'use server'

import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { getOwnerState } from '@/lib/admin'
import { db } from '@/lib/db'
import { seoKeywords } from '@/lib/db/schema'
import { syncSearchConsole } from '@/lib/seo/sync'

async function requireOwner() {
  if ((await getOwnerState()) !== 'owner') throw new Error('Ingen adgang')
}

function readKeyword(formData: FormData) {
  const keyword = String(formData.get('keyword') ?? '').trim().toLowerCase().replace(/\s+/g, ' ')
  if (keyword.length < 2 || keyword.length > 80) return null
  return keyword
}

function readPath(formData: FormData) {
  const path = String(formData.get('targetPath') ?? '/').trim() || '/'
  return /^\/[a-z0-9\-/]*$/i.test(path) ? path : '/'
}

export async function addKeyword(formData: FormData) {
  await requireOwner()
  const keyword = readKeyword(formData)
  if (!keyword) return
  await db.insert(seoKeywords).values({ keyword, targetPath: readPath(formData) }).onConflictDoNothing()
  revalidatePath('/admin/seo')
}

export async function deleteKeyword(formData: FormData) {
  await requireOwner()
  const id = Number(formData.get('id'))
  if (!Number.isInteger(id)) return
  await db.delete(seoKeywords).where(eq(seoKeywords.id, id))
  revalidatePath('/admin/seo')
}

export async function syncNow(_: string | null): Promise<string> {
  await requireOwner()
  const result = await syncSearchConsole()
  revalidatePath('/admin/seo')
  return result.ok ? `Hentede ${result.days} dage og ${result.queries} rækker.` : result.error
}
