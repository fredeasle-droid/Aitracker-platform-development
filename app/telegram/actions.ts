'use server'

import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { getOwnerState } from '@/lib/admin'
import { db } from '@/lib/db'
import { telegramGroups, telegramPosts } from '@/lib/db/schema'
import { discoverGroups, lookupChat, normalizeHours, runDuePosts, saveSettings } from '@/lib/telegram'

export type ActionState = { ok: boolean; message: string } | null

const DENIED: ActionState = { ok: false, message: 'Du har ikke adgang til Telegram-opslag.' }
const MAX_POST_LENGTH = 4096

async function isOwner() {
  return (await getOwnerState()) === 'owner'
}

const parseId = (formData: FormData) => Number.parseInt(String(formData.get('id') ?? ''), 10)

export async function addPost(_previous: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await isOwner())) return DENIED
  const body = String(formData.get('body') ?? '').trim()
  const imageUrl = String(formData.get('imageUrl') ?? '').trim()
  if (!body) return { ok: false, message: 'Skriv teksten til opslaget.' }
  if (body.length > MAX_POST_LENGTH) return { ok: false, message: `Opslaget må højst være ${MAX_POST_LENGTH} tegn.` }
  if (imageUrl && !/^https:\/\/\S+$/i.test(imageUrl)) return { ok: false, message: 'Billed-linket skal starte med https://' }
  if (imageUrl && body.length > 1024) return { ok: false, message: 'Med billede må teksten højst være 1024 tegn.' }

  await db.insert(telegramPosts).values({ body, imageUrl: imageUrl || null })
  revalidatePath('/telegram')
  return { ok: true, message: 'Opslaget er tilføjet til køen.' }
}

export async function togglePost(formData: FormData) {
  if (!(await isOwner())) return
  const id = parseId(formData)
  if (!Number.isInteger(id)) return
  const [post] = await db.select().from(telegramPosts).where(eq(telegramPosts.id, id))
  if (post) await db.update(telegramPosts).set({ active: !post.active }).where(eq(telegramPosts.id, id))
  revalidatePath('/telegram')
}

export async function deletePost(formData: FormData) {
  if (!(await isOwner())) return
  const id = parseId(formData)
  if (!Number.isInteger(id)) return
  await db.delete(telegramPosts).where(eq(telegramPosts.id, id))
  revalidatePath('/telegram')
}

export async function addGroup(_previous: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await isOwner())) return DENIED
  const reference = String(formData.get('chat') ?? '').trim()
  if (!/^-?\d+$/.test(reference) && !/^@[A-Za-z0-9_]{4,}$/.test(reference)) {
    return { ok: false, message: 'Brug et chat-ID (fx -1001234567890) eller @brugernavn.' }
  }
  const chat = await lookupChat(reference)
  if (!chat.ok) return { ok: false, message: `Botten har ikke adgang til gruppen: ${chat.error}` }

  await db
    .insert(telegramGroups)
    .values({ chatId: chat.chatId, title: chat.title })
    .onConflictDoUpdate({ target: telegramGroups.chatId, set: { title: chat.title, active: true } })
  revalidatePath('/telegram')
  return { ok: true, message: `Tilføjede ${chat.title}.` }
}

export async function toggleGroup(formData: FormData) {
  if (!(await isOwner())) return
  const id = parseId(formData)
  if (!Number.isInteger(id)) return
  const [group] = await db.select().from(telegramGroups).where(eq(telegramGroups.id, id))
  if (group) await db.update(telegramGroups).set({ active: !group.active }).where(eq(telegramGroups.id, id))
  revalidatePath('/telegram')
}

export async function deleteGroup(formData: FormData) {
  if (!(await isOwner())) return
  const id = parseId(formData)
  if (!Number.isInteger(id)) return
  await db.delete(telegramGroups).where(eq(telegramGroups.id, id))
  revalidatePath('/telegram')
}

export async function findGroups(_previous: ActionState, _formData: FormData): Promise<ActionState> {
  if (!(await isOwner())) return DENIED
  const result = await discoverGroups()
  if (!result.ok) return { ok: false, message: result.error }
  revalidatePath('/telegram')
  return { ok: true, message: result.found > 0 ? `Fandt ${result.found} grupper, hvor botten er medlem.` : 'Ingen grupper endnu. Tilføj botten til en gruppe og prøv igen.' }
}

export async function saveSchedule(_previous: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await isOwner())) return DENIED
  const hours = normalizeHours(String(formData.get('hours') ?? ''))
  if (hours.length === 0) return { ok: false, message: 'Skriv mindst ét klokkeslæt, fx 10,15,20.' }
  await saveSettings(formData.get('enabled') === 'on', hours)
  revalidatePath('/telegram')
  return { ok: true, message: `Gemt. Postning kl. ${hours.join(', ')} (dansk tid).` }
}

export async function sendNow(_previous: ActionState, _formData: FormData): Promise<ActionState> {
  if (!(await isOwner())) return DENIED
  const result = await runDuePosts({ force: true })
  revalidatePath('/telegram')
  if (result.skipped) return { ok: false, message: result.skipped }
  return { ok: result.failed === 0, message: `Sendt til ${result.sent} grupper, ${result.failed} fejlede.` }
}
