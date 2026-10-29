import 'server-only'
import { asc, eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { telegramGroups, telegramPosts, telegramSettings } from '@/lib/db/schema'

const API = 'https://api.telegram.org'
const MIN_GAP_MS = 50 * 60 * 1000
const DELAY_BETWEEN_GROUPS_MS = 1500
const MAX_HOURS = 12

type TelegramResult<T> = { ok: true; result: T } | { ok: false; error: string; code?: number; retryAfter?: number }

export const hasBotToken = () => Boolean(process.env.TELEGRAM_BOT_TOKEN)

async function callTelegram<T>(method: string, body: Record<string, unknown> = {}): Promise<TelegramResult<T>> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) return { ok: false, error: 'TELEGRAM_BOT_TOKEN mangler' }
  try {
    const response = await fetch(`${API}/bot${token}/${method}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    })
    const data = (await response.json()) as { ok: boolean; result?: T; description?: string; error_code?: number; parameters?: { retry_after?: number } }
    if (data.ok) return { ok: true, result: data.result as T }
    return { ok: false, error: data.description ?? 'Ukendt Telegram-fejl', code: data.error_code, retryAfter: data.parameters?.retry_after }
  } catch {
    return { ok: false, error: 'Kunne ikke nå Telegram' }
  }
}

export type TelegramSettings = { enabled: boolean; hours: number[]; lastSlotDate: string; lastSlots: number[] }

const parseHours = (value: string) =>
  value
    .split(',')
    .map((part) => Number.parseInt(part.trim(), 10))
    .filter((hour) => Number.isInteger(hour) && hour >= 0 && hour <= 23)

export function normalizeHours(input: string) {
  return [...new Set(parseHours(input))].sort((a, b) => a - b).slice(0, MAX_HOURS)
}

export async function getSettings(): Promise<TelegramSettings> {
  const rows = await db.select().from(telegramSettings)
  const map = new Map(rows.map((row) => [row.key, row.value]))
  return {
    enabled: map.get('enabled') === 'true',
    hours: normalizeHours(map.get('hours') ?? ''),
    lastSlotDate: map.get('last_slot_date') ?? '',
    lastSlots: parseHours(map.get('last_slots') ?? ''),
  }
}

async function setSetting(key: string, value: string) {
  await db
    .insert(telegramSettings)
    .values({ key, value })
    .onConflictDoUpdate({ target: telegramSettings.key, set: { value } })
}

export async function saveSettings(enabled: boolean, hours: number[]) {
  await setSetting('enabled', String(enabled))
  await setSetting('hours', hours.join(','))
}

function copenhagenNow() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Copenhagen',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date())
  const pick = (type: string) => parts.find((part) => part.type === type)?.value ?? ''
  return { date: `${pick('year')}-${pick('month')}-${pick('day')}`, hour: Number.parseInt(pick('hour'), 10) }
}

type Post = typeof telegramPosts.$inferSelect

async function sendPost(chatId: string, post: Post) {
  if (post.imageUrl) {
    return callTelegram('sendPhoto', { chat_id: chatId, photo: post.imageUrl, caption: post.body.slice(0, 1024) })
  }
  return callTelegram('sendMessage', { chat_id: chatId, text: post.body.slice(0, 4096) })
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export type RunResult = { ok: boolean; sent: number; failed: number; skipped?: string }

export async function runDuePosts({ force = false }: { force?: boolean } = {}): Promise<RunResult> {
  if (!hasBotToken()) return { ok: false, sent: 0, failed: 0, skipped: 'TELEGRAM_BOT_TOKEN mangler' }

  const settings = await getSettings()
  if (!force && !settings.enabled) return { ok: true, sent: 0, failed: 0, skipped: 'Automatisk postning er slået fra' }

  const now = copenhagenNow()
  const doneToday = settings.lastSlotDate === now.date ? settings.lastSlots : []
  const dueSlots = settings.hours.filter((hour) => hour <= now.hour && !doneToday.includes(hour))
  if (!force && dueSlots.length === 0) return { ok: true, sent: 0, failed: 0, skipped: 'Ingen tidspunkter forfaldne' }

  const [post] = await db
    .select()
    .from(telegramPosts)
    .where(eq(telegramPosts.active, true))
    .orderBy(sql`${telegramPosts.lastPostedAt} asc nulls first`, asc(telegramPosts.id))
    .limit(1)
  if (!post) return { ok: true, sent: 0, failed: 0, skipped: 'Ingen aktive opslag i køen' }

  const groups = await db.select().from(telegramGroups).where(eq(telegramGroups.active, true)).orderBy(asc(telegramGroups.id))
  if (groups.length === 0) return { ok: true, sent: 0, failed: 0, skipped: 'Ingen aktive grupper' }

  let sent = 0
  let failed = 0
  let rateLimited = false

  for (const group of groups) {
    if (rateLimited) break
    const recentlyPosted = group.lastPostedAt && Date.now() - group.lastPostedAt.getTime() < MIN_GAP_MS
    if (!force && recentlyPosted) continue

    const result = await sendPost(group.chatId, post)
    if (result.ok) {
      sent += 1
      await db.update(telegramGroups).set({ lastPostedAt: new Date(), lastStatus: 'Sendt' }).where(eq(telegramGroups.id, group.id))
    } else {
      failed += 1
      const removed = result.code === 403 || /kicked|not a member|chat not found/i.test(result.error)
      await db
        .update(telegramGroups)
        .set({ lastStatus: result.error.slice(0, 200), ...(removed ? { active: false } : {}) })
        .where(eq(telegramGroups.id, group.id))
      if (result.code === 429) rateLimited = true
    }
    await sleep(DELAY_BETWEEN_GROUPS_MS)
  }

  if (sent > 0) await db.update(telegramPosts).set({ lastPostedAt: new Date() }).where(eq(telegramPosts.id, post.id))
  if (!force && !rateLimited) {
    await setSetting('last_slot_date', now.date)
    await setSetting('last_slots', [...new Set([...doneToday, ...dueSlots])].join(','))
  }
  return { ok: failed === 0, sent, failed }
}

type TelegramChat = { id: number; title?: string; username?: string; type: string }
type TelegramUpdate = {
  message?: { chat: TelegramChat }
  channel_post?: { chat: TelegramChat }
  my_chat_member?: { chat: TelegramChat; new_chat_member: { status: string } }
}

export async function discoverGroups() {
  const updates = await callTelegram<TelegramUpdate[]>('getUpdates', { limit: 100, timeout: 0 })
  if (!updates.ok) return { ok: false as const, error: updates.error }

  const chats = new Map<string, string>()
  for (const update of updates.result) {
    const left = update.my_chat_member && ['left', 'kicked'].includes(update.my_chat_member.new_chat_member.status)
    const chat = update.my_chat_member?.chat ?? update.message?.chat ?? update.channel_post?.chat
    if (!chat || chat.type === 'private' || left) continue
    chats.set(String(chat.id), chat.title ?? chat.username ?? String(chat.id))
  }

  for (const [chatId, title] of chats) {
    await db.insert(telegramGroups).values({ chatId, title }).onConflictDoUpdate({ target: telegramGroups.chatId, set: { title } })
  }
  return { ok: true as const, found: chats.size }
}

export async function lookupChat(reference: string) {
  const result = await callTelegram<TelegramChat>('getChat', { chat_id: reference })
  if (!result.ok) return { ok: false as const, error: result.error }
  return { ok: true as const, chatId: String(result.result.id), title: result.result.title ?? result.result.username ?? reference }
}

export async function getBotName() {
  const result = await callTelegram<{ username?: string }>('getMe')
  return result.ok ? (result.result.username ?? null) : null
}
