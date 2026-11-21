'use server'

import { pool } from '@/lib/db'
import { getOptionalUserId } from '@/lib/user'
import { BOOKMAKERS, type Activity, type Bookmaker, type Deposit, type Surebet, type SurebetStatus } from '@/lib/regnskab/surebet'

export type RegnskabData = { surebets: Surebet[]; deposits: Deposit[]; activity: Activity[] }
type Result = { ok: true } | { ok: false; message: string }

const NOT_LOGGED_IN: Result = { ok: false, message: 'Log ind for at gemme dine surebets' }
const isBookmaker = (v: unknown): v is Bookmaker => BOOKMAKERS.includes(v as Bookmaker)
const isId = (v: unknown): v is string => typeof v === 'string' && v.length > 0 && v.length <= 64
const isDate = (v: unknown): v is string => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v)
const isMoney = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && v >= 0 && v < 1e9

export async function loadRegnskab(): Promise<RegnskabData> {
  const userId = await getOptionalUserId()
  if (!userId) return { surebets: [], deposits: [], activity: [] }
  const [s, d, a] = await Promise.all([
    pool.query('SELECT * FROM regnskab_surebets WHERE user_id = $1 ORDER BY date DESC, created_at DESC', [userId]),
    pool.query('SELECT * FROM regnskab_deposits WHERE user_id = $1 ORDER BY date ASC, created_at ASC', [userId]),
    pool.query('SELECT * FROM regnskab_activity WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50', [userId]),
  ])
  return {
    surebets: s.rows.map((r) => ({
      id: r.id,
      date: r.date,
      event: r.event,
      bookmakers: [r.bookmaker_a, r.bookmaker_b] as [Bookmaker, Bookmaker],
      odds: [Number(r.odds_a), Number(r.odds_b)] as [number, number],
      stake: Number(r.stake),
      expected: Number(r.expected),
      status: r.status as SurebetStatus,
      ...(r.winner === 0 || r.winner === 1 ? { winner: r.winner as 0 | 1 } : {}),
    })),
    deposits: d.rows.map((r) => ({ id: r.id, date: r.date, bookmaker: r.bookmaker as Bookmaker, amount: Number(r.amount) })),
    activity: a.rows.map((r) => ({ id: r.id, date: r.date, kind: r.kind as Activity['kind'], text: r.text })),
  }
}

export async function saveSurebet(s: Surebet): Promise<Result> {
  const userId = await getOptionalUserId()
  if (!userId) return NOT_LOGGED_IN
  if (
    !isId(s.id) || !isDate(s.date) || typeof s.event !== 'string' || !s.event.trim() || s.event.length > 200 ||
    !isBookmaker(s.bookmakers?.[0]) || !isBookmaker(s.bookmakers?.[1]) ||
    !isMoney(s.odds?.[0]) || !isMoney(s.odds?.[1]) || !isMoney(s.stake) || !isMoney(s.expected)
  ) {
    return { ok: false, message: 'Ugyldige data' }
  }
  await pool.query(
    `INSERT INTO regnskab_surebets (id, user_id, date, event, bookmaker_a, bookmaker_b, odds_a, odds_b, stake, expected, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'Åben') ON CONFLICT (id) DO NOTHING`,
    [s.id, userId, s.date, s.event.trim(), s.bookmakers[0], s.bookmakers[1], s.odds[0], s.odds[1], s.stake, s.expected],
  )
  return { ok: true }
}

export async function updateSurebetStatus(id: string, status: SurebetStatus, winner?: 0 | 1): Promise<Result> {
  const userId = await getOptionalUserId()
  if (!userId) return NOT_LOGGED_IN
  if (!isId(id) || !['Vundet', 'Åben', 'Tabt'].includes(status)) return { ok: false, message: 'Ugyldige data' }
  await pool.query('UPDATE regnskab_surebets SET status = $3, winner = $4 WHERE id = $1 AND user_id = $2', [
    id,
    userId,
    status,
    status === 'Vundet' && (winner === 0 || winner === 1) ? winner : null,
  ])
  return { ok: true }
}

export async function deleteSurebet(id: string): Promise<Result> {
  const userId = await getOptionalUserId()
  if (!userId) return NOT_LOGGED_IN
  if (!isId(id)) return { ok: false, message: 'Ugyldige data' }
  await pool.query('DELETE FROM regnskab_surebets WHERE id = $1 AND user_id = $2', [id, userId])
  return { ok: true }
}

export async function saveDeposit(d: Deposit): Promise<Result> {
  const userId = await getOptionalUserId()
  if (!userId) return NOT_LOGGED_IN
  if (!isId(d.id) || !isDate(d.date) || !isBookmaker(d.bookmaker) || !isMoney(d.amount) || d.amount <= 0) {
    return { ok: false, message: 'Ugyldige data' }
  }
  await pool.query(
    'INSERT INTO regnskab_deposits (id, user_id, date, bookmaker, amount) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (id) DO NOTHING',
    [d.id, userId, d.date, d.bookmaker, d.amount],
  )
  return { ok: true }
}

export async function saveActivity(a: Activity): Promise<Result> {
  const userId = await getOptionalUserId()
  if (!userId) return NOT_LOGGED_IN
  if (!isId(a.id) || !isDate(a.date) || !['won', 'info', 'lost'].includes(a.kind) || typeof a.text !== 'string' || a.text.length > 300) {
    return { ok: false, message: 'Ugyldige data' }
  }
  await pool.query(
    'INSERT INTO regnskab_activity (id, user_id, date, kind, text) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (id) DO NOTHING',
    [a.id, userId, a.date, a.kind, a.text],
  )
  return { ok: true }
}
