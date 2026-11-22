'use server'

import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { db, pool } from '@/lib/db'
import { bets, favorites, opportunities } from '@/lib/db/schema'
import { getUserId } from '@/lib/user'
import { getBetForUser, getTopOpportunities } from '@/lib/data'
import { refreshOpportunities } from '@/lib/scanner-sync'
import { demoOpportunities, isDemoMode } from '@/lib/demo-opportunities'
import { guaranteedProfit } from '@/lib/odds'
import { addDemoBet, getDemoBets, isDemoOpportunityId, updateDemoBet } from '@/lib/demo-bets'
import { MAX_COUPON_BETS, couponBetSchema, type CouponBet } from '@/lib/coupon'
import { BOOKMAKERS } from '@/lib/regnskab/surebet'

export async function refreshOpportunityList() {
  try {
    await refreshOpportunities()
  } catch (error) {
    console.error('[scanner] auto refresh failed', error)
  }
  return getTopOpportunities()
}

export async function toggleFavorite(opportunityId: number) {
  if (!Number.isInteger(opportunityId) || opportunityId <= 0) throw new Error('Ugyldigt id')
  const userId = await getUserId()
  const deleted = await db
    .delete(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.opportunityId, opportunityId)))
    .returning()
  if (deleted.length === 0) {
    await db.insert(favorites).values({ userId, opportunityId }).onConflictDoNothing()
  }
  revalidatePath('/')
  return deleted.length === 0
}

const MAX_STAKE = 1_000_000

function validStake(n: number) {
  return Number.isFinite(n) && n > 0 && n <= MAX_STAKE
}

function regnskabBookmaker(name: string) {
  const wanted = name.trim().toLowerCase()
  return BOOKMAKERS.find((known) => known.toLowerCase() === wanted) ?? name.trim()
}

// The stats page (surebet-regnskab) reads regnskab_surebets, so every saved bet is mirrored there.
async function mirrorToRegnskab(
  userId: string,
  bet: { event: string; bookmakers: [string, string]; odds: [number, number]; stake: number; profit: number },
) {
  try {
    await pool.query(
      `INSERT INTO regnskab_surebets (id, user_id, date, event, bookmaker_a, bookmaker_b, odds_a, odds_b, stake, expected, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'Åben') ON CONFLICT (id) DO NOTHING`,
      [
        `bet-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        userId,
        new Date().toISOString().slice(0, 10),
        bet.event.slice(0, 200),
        regnskabBookmaker(bet.bookmakers[0]),
        regnskabBookmaker(bet.bookmakers[1]),
        bet.odds[0],
        bet.odds[1],
        bet.stake,
        bet.stake + bet.profit,
      ],
    )
  } catch (error) {
    console.error('[actions] unable to mirror bet to regnskab', error)
  }
}

export async function placeBet(input: { opportunityId: number; stakeA: number; stakeB: number }) {
  const userId = await getUserId()
  const { opportunityId } = input
  const stakeA = Math.round(input.stakeA)
  const stakeB = Math.round(input.stakeB)
  if (!Number.isInteger(opportunityId) || !validStake(stakeA) || !validStake(stakeB)) {
    return { ok: false as const, error: 'Ugyldig indsats' }
  }

  // TEST opportunities are intentionally resolved from the development dataset when
  // no live provider is configured; they must never require a database opportunity row.
  const demoEnabled = !process.env.ODDS_API_KEY && process.env.VERCEL_ENV !== 'production'
  const demo = demoEnabled ? demoOpportunities.find((item) => item.id === opportunityId) : undefined
  const opp = demo
    ? undefined
    : (await db.select().from(opportunities).where(eq(opportunities.id, opportunityId)).limit(1))[0]
  if (!opp && !demo) return { ok: false as const, error: 'Kampen findes ikke længere' }

  const aOdds = opp ? Number(opp.aOdds) : demo!.a.odds
  const bOdds = opp ? Number(opp.bOdds) : demo!.b.odds
  const profit = guaranteedProfit(stakeA, stakeB, aOdds, bOdds)
  try {
    await db.insert(bets).values({
      userId,
      opportunityId: opp ? opportunityId : null,
      sport: opp?.sport ?? demo!.sport,
      match: `${opp?.homeTeam ?? demo!.homeTeam} vs ${opp?.awayTeam ?? demo!.awayTeam}`,
      market: opp ? `${opp.aLabel} / ${opp.bLabel}` : `${demo!.a.label} / ${demo!.b.label}`,
      stake: String(stakeA + stakeB),
      expectedProfit: profit.toFixed(2),
      status: 'open',
      bookmakers: opp ? `${opp.aBookmaker} / ${opp.bBookmaker}` : `${demo!.a.bookmaker} / ${demo!.b.bookmaker}`,
      kickoff: opp?.kickoff ?? new Date(demo!.kickoffTs),
    })
  } catch (error) {
    // The v0 preview may intentionally run without Postgres. Keep TEST bets
    // usable for the review flow, while live/production bets still require DB.
    if (demo && isDemoOpportunityId(opportunityId)) {
      addDemoBet(userId, {
        id: Date.now(),
        sport: demo.sport,
        match: `${demo.homeTeam} vs ${demo.awayTeam}`,
        market: `${demo.a.label} / ${demo.b.label}`,
        stake: stakeA + stakeB,
        expectedProfit: profit,
        profit: null,
        status: 'open',
        bookmakers: `${demo.a.bookmaker} / ${demo.b.bookmaker}`,
        kickoffLabel: demo.kickoffLabel,
        dateLabel: new Date(demo.kickoffTs).toLocaleDateString('da-DK'),
        placedTs: Date.now(),
      })
      await mirrorToRegnskab(userId, {
        event: `${demo.homeTeam} vs ${demo.awayTeam}`,
        bookmakers: [demo.a.bookmaker, demo.b.bookmaker],
        odds: [aOdds, bOdds],
        stake: stakeA + stakeB,
        profit,
      })
      revalidatePath('/stats')
      return { ok: true as const }
    }
    console.error('[actions] unable to save open bet', error)
    return { ok: false as const, error: 'Væddemålet kunne ikke gemmes lige nu' }
  }
  await mirrorToRegnskab(userId, {
    event: `${opp?.homeTeam ?? demo!.homeTeam} vs ${opp?.awayTeam ?? demo!.awayTeam}`,
    bookmakers: opp ? [opp.aBookmaker, opp.bBookmaker] : [demo!.a.bookmaker, demo!.b.bookmaker],
    odds: [aOdds, bOdds],
    stake: stakeA + stakeB,
    profit,
  })
  revalidatePath('/stats')
  return { ok: true as const }
}

export async function saveCouponBets(input: CouponBet[]) {
  const userId = await getUserId()
  if (!Array.isArray(input) || input.length === 0 || input.length > MAX_COUPON_BETS) {
    return { ok: false as const, error: 'Ugyldig kupon' }
  }

  const now = new Date()
  const rows = []
  for (const raw of input) {
    const parsed = couponBetSchema.safeParse(raw)
    const stake = parsed.success ? Math.round(parsed.data.stake * 100) / 100 : 0
    if (!parsed.success || !validStake(stake) || !parsed.data.match.trim()) {
      return { ok: false as const, error: 'Hvert væddemål skal have kamp og indsats' }
    }
    const bet = parsed.data
    const odds = bet.odds !== null && bet.odds > 1 && bet.odds <= 1000 ? bet.odds : null
    const potential = odds ? stake * (odds - 1) : 0
    const profit =
      bet.status === 'won'
        ? bet.payout !== null && bet.payout > 0
          ? bet.payout - stake
          : potential
        : bet.status === 'lost'
          ? -stake
          : null
    const date = bet.date ? new Date(bet.date) : null
    const kickoff = date && !Number.isNaN(date.getTime()) ? date : now
    rows.push({
      userId,
      opportunityId: null,
      sport: bet.sport.trim() || 'Fodbold',
      match: bet.match.trim().slice(0, 200),
      market: `${bet.selection.trim()}${odds ? ` @ ${odds.toFixed(2)}` : ''}`.slice(0, 200) || 'Kupon',
      stake: stake.toFixed(2),
      expectedProfit: potential.toFixed(2),
      profit: profit === null ? null : profit.toFixed(2),
      status: bet.status,
      bookmakers: bet.bookmaker.trim().slice(0, 60) || null,
      kickoff,
      settledAt: bet.status === 'open' ? null : now,
    })
  }

  try {
    await db.insert(bets).values(rows)
  } catch (error) {
    if (!process.env.ODDS_API_KEY && process.env.VERCEL_ENV !== 'production') {
      rows.forEach((row, index) => {
        addDemoBet(userId, {
          id: Date.now() + index,
          sport: row.sport,
          match: row.match,
          market: row.market,
          stake: Number(row.stake),
          expectedProfit: Number(row.expectedProfit),
          profit: row.profit === null ? null : Number(row.profit),
          status: row.status,
          bookmakers: row.bookmakers,
          kickoffLabel: row.kickoff.toLocaleDateString('da-DK'),
          dateLabel: row.kickoff.toLocaleDateString('da-DK'),
          placedTs: row.kickoff.getTime(),
        })
      })
      revalidatePath('/stats')
      return { ok: true as const, count: rows.length }
    }
    console.error('[actions] unable to save coupon bets', error)
    return { ok: false as const, error: 'Kuponen kunne ikke gemmes lige nu' }
  }
  revalidatePath('/stats')
  return { ok: true as const, count: rows.length }
}

export async function settleBet(id: number, result: 'won' | 'lost', amount?: number) {
  const userId = await getUserId()
  const demoBet = getDemoBets(userId).find((item) => item.id === id)
  const bet = demoBet ?? (await getBetForUser(id, userId))
  if (!bet) return { ok: false as const, error: 'Væddemål ikke fundet' }

  let profit: number
  if (result === 'won') {
    profit = amount !== undefined && Number.isFinite(amount) ? amount : Number(bet.expectedProfit)
  } else {
    const loss = amount !== undefined && Number.isFinite(amount) ? -Math.abs(amount) : -Number(bet.stake)
    profit = Math.max(loss, -Number(bet.stake))
  }
  if (Math.abs(profit) > MAX_STAKE) return { ok: false as const, error: 'Ugyldigt beløb' }

  if (demoBet) {
    updateDemoBet(userId, id, {
      status: result,
      profit,
      placedTs: Date.now(),
      dateLabel: new Date().toLocaleDateString('da-DK'),
      kickoffLabel: 'Afgjort nu',
    })
  } else {
    await db
      .update(bets)
      .set({ status: result, profit: profit.toFixed(2), settledAt: new Date() })
      .where(and(eq(bets.id, id), eq(bets.userId, userId)))
  }
  revalidatePath('/stats')
  return { ok: true as const }
}

export async function reopenBet(id: number) {
  const userId = await getUserId()
  await db
    .update(bets)
    .set({ status: 'open', profit: null, settledAt: null })
    .where(and(eq(bets.id, id), eq(bets.userId, userId)))
  revalidatePath('/stats')
}

export async function deleteBet(id: number) {
  const userId = await getUserId()
  await db.delete(bets).where(and(eq(bets.id, id), eq(bets.userId, userId)))
  revalidatePath('/stats')
}
