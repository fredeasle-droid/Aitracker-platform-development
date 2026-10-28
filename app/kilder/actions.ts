'use server'

import { revalidatePath } from 'next/cache'
import { getAdminState } from '@/lib/admin'
import { cleanCookieInput, saveStoredCookie } from '@/lib/scraper-session'
import { BETHERO_SOURCE, describeBetHeroMessages, fetchBetHeroMessages } from '@/lib/scrapers/bethero'
import { SUREBETDANMARK_SOURCE, requestFeed } from '@/lib/scrapers/surebetdanmark'

export type SaveState = { ok: boolean; message: string } | null

const MAX_COOKIE_LENGTH = 20_000

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

export async function saveBetHeroCookie(_previous: SaveState, formData: FormData): Promise<SaveState> {
  if ((await getAdminState()) !== 'admin') return { ok: false, message: 'Du har ikke adgang til at gemme sessioner.' }

  let cookie = cleanCookieInput(String(formData.get('cookie') ?? ''))
  if (!cookie) return { ok: false, message: 'Indsæt cookien først.' }
  if (cookie.length > MAX_COOKIE_LENGTH) return { ok: false, message: 'Teksten er for lang til at være en cookie.' }
  if (/[^\x20-\x7e]/.test(cookie)) return { ok: false, message: 'Cookien er afkortet eller indeholder ugyldige tegn (fx "…").' }
  if (!cookie.includes('=')) cookie = `auth_session=${cookie}`
  if (!cookie.includes('auth_session=')) return { ok: false, message: 'Teksten indeholder ingen auth_session. Kopiér cookien auth_session fra Bet Hero.' }

  try {
    const messages = await fetchBetHeroMessages(cookie)
    const total = messages
      .map((message) => (message && typeof message === 'object' ? (message as { total?: unknown }).total : undefined))
      .find((value): value is number => typeof value === 'number')
    if (!total) {
      return { ok: false, message: `Cookien blev ikke gemt, fordi Bet Hero ikke gav et antal surebets. ${describeBetHeroMessages(messages)}` }
    }
    await saveStoredCookie(BETHERO_SOURCE, cookie, `Forbundet, ${total} surebets hos Bet Hero (lige gemt)`)
    revalidatePath('/kilder')
    return { ok: true, message: `Sessionen virker og er gemt. Bet Hero viser ${total} surebets.` }
  } catch (error) {
    return { ok: false, message: `Sessionen blev ikke gemt: ${error instanceof Error ? error.message : 'ukendt fejl'}` }
  }
}
