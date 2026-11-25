'use server'

import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { getOwnerState } from '@/lib/admin'
import { db } from '@/lib/db'
import { forumThreads } from '@/lib/db/schema'
import { draftReply, fetchThreadDetails, parseThreadUrl, scanForums, THREAD_STATUSES, type ThreadStatus } from '@/lib/seo/forum-radar'

const PATH = '/admin/seo/forum'

async function requireOwner() {
  if ((await getOwnerState()) !== 'owner') throw new Error('Ingen adgang')
}

const readId = (formData: FormData) => {
  const id = Number(formData.get('id'))
  return Number.isInteger(id) && id > 0 ? id : null
}

export async function addThread(_: string | null, formData: FormData): Promise<string> {
  await requireOwner()
  const url = parseThreadUrl(String(formData.get('url') ?? ''))
  if (!url) return 'Indsæt et gyldigt link til tråden.'

  const manualTitle = String(formData.get('title') ?? '').trim().slice(0, 300)
  const manualBody = String(formData.get('body') ?? '').trim().slice(0, 4000)
  const fetched = manualTitle && manualBody ? null : await fetchThreadDetails(url)
  const title = manualTitle || fetched?.title
  if (!title) return 'Kunne ikke læse tråden. Indsæt titel og tekst manuelt.'

  const thread = {
    url: url.toString(),
    title,
    body: manualBody || fetched?.body || '',
    community: fetched?.community ?? url.hostname.replace(/^www\./, ''),
    source: fetched?.source ?? 'manual',
    externalId: fetched?.externalId ?? null,
  }

  const [row] = await db.insert(forumThreads).values(thread).onConflictDoNothing().returning({ id: forumThreads.id })
  if (!row) return 'Tråden er allerede på listen.'

  try {
    await db.update(forumThreads).set({ draft: await draftReply(thread) }).where(eq(forumThreads.id, row.id))
  } catch {
    revalidatePath(PATH)
    return 'Tråden er gemt, men svarforslaget fejlede. Prøv "Nyt forslag".'
  }
  revalidatePath(PATH)
  return 'Tråden er tilføjet med et svarforslag.'
}

export async function regenerateDraft(formData: FormData) {
  await requireOwner()
  const id = readId(formData)
  if (!id) return
  const [thread] = await db.select().from(forumThreads).where(eq(forumThreads.id, id))
  if (!thread) return
  await db.update(forumThreads).set({ draft: await draftReply(thread) }).where(eq(forumThreads.id, id))
  revalidatePath(PATH)
}

export async function setThreadStatus(formData: FormData) {
  await requireOwner()
  const id = readId(formData)
  const status = String(formData.get('status')) as ThreadStatus
  if (!id || !THREAD_STATUSES.includes(status)) return
  await db
    .update(forumThreads)
    .set({ status, postedAt: status === 'posted' ? new Date() : null })
    .where(eq(forumThreads.id, id))
  revalidatePath(PATH)
}

export async function deleteThread(formData: FormData) {
  await requireOwner()
  const id = readId(formData)
  if (!id) return
  await db.delete(forumThreads).where(eq(forumThreads.id, id))
  revalidatePath(PATH)
}

export async function scanNow(_: string | null): Promise<string> {
  await requireOwner()
  try {
    const result = await scanForums()
    revalidatePath(PATH)
    return result.ok ? `Fandt ${result.added} nye tråde.` : result.error
  } catch (error) {
    return error instanceof Error ? error.message : 'Søgningen fejlede.'
  }
}
