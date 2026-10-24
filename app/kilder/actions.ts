'use server'

import { revalidatePath } from 'next/cache'
import { getAdminState } from '@/lib/admin'
import { saveStoredCookie } from '@/lib/scraper-session'
import { SUREBETDANMARK_SOURCE, requestFeed } from '@/lib/scrapers/surebetdanmark'

export type SaveState = { ok: boolean; message: string } | null

const MAX_COOKIE_LENGTH = 20_000

function cleanCookieInput(raw: string) {
  return raw
    .replace(/\s*\r?\n\s*/g, '')
    .replace(/^-H\s+/i, '')
    .replace(/^['"]|['"]$/g, '')
    .replace(/^cookie:\s*/i, '')
    .trim()
}

export async function saveSureBetDanmarkCookie(_previous: SaveState, formData: FormData): Promise<SaveState> {
  if ((await getAdminState()) !== 'admin') return { ok: false, message: 'Du har ikke adgang til at gemme sessioner.' }

  const cookie = cleanCookieInput(String(formData.get('cookie') ?? ''))
  if (!cookie) return { ok: false, message: 'Indsæt Cookie-værdien først.' }
  if (cookie.length > MAX_COOKIE_LENGTH) return { ok: false, message: 'Teksten er for lang til at være en cookie.' }
  if (!cookie.includes('auth-token')) return { ok: false, message: 'Teksten indeholder ingen auth-token. Brug Cookie-linjen fra feed-kaldet.' }

  try {
    const { surebets } = await requestFeed(cookie)
    await saveStoredCookie(SUREBETDANMARK_SOURCE, cookie, `OK, ${surebets.length} surebets (lige gemt)`)
    revalidatePath('/kilder')
    return { ok: true, message: `Sessionen virker og er gemt. Feedet gav ${surebets.length} brugbare surebets.` }
  } catch (error) {
    return { ok: false, message: `Sessionen blev ikke gemt: ${error instanceof Error ? error.message : 'ukendt fejl'}` }
  }
}
