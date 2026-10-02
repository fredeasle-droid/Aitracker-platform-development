'use server'

import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { bets, favorites, opportunities } from '@/lib/db/schema'
import { getUserId } from '@/lib/user'
import { getBetForUser } from '@/lib/data'
import { guaranteedProfit } from '@/lib/odds'

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

export async function placeBet(input: { opportunityId: number; stakeA: number; stakeB: number }) {
  const userId = await getUserId()
  const { opportunityId } = input
  const stakeA = Math.round(input.stakeA)
  const stakeB = Math.round(input.stakeB)
  if (!Number.isInteger(opportunityId) || !validStake(stakeA) || !validStake(stakeB)) {
    return { ok: false as const, error: 'Ugyldig indsats' }
  }

  const [opp] = await db.select().from(opportunities).where(eq(opportunities.id, opportunityId)).limit(1)
  if (!opp) return { ok: false as const, error: 'Kampen findes ikke længere' }

  const profit = guaranteedProfit(stakeA, stakeB, Number(opp.aOdds), Number(opp.bOdds))
  await db.insert(bets).values({
    userId,
    opportunityId,
    sport: opp.sport,
    match: `${opp.homeTeam} vs ${opp.awayTeam}`,
    market: `${opp.aLabel} / ${opp.bLabel}`,
    stake: String(stakeA + stakeB),
    expectedProfit: profit.toFixed(2),
    status: 'open',
    kickoff: opp.kickoff,
  })
  revalidatePath('/stats')
  return { ok: true as const }
}

export async function settleBet(id: number, result: 'won' | 'lost', amount?: number) {
  const userId = await getUserId()
  const bet = await getBetForUser(id, userId)
  if (!bet) return { ok: false as const, error: 'Væddemål ikke fundet' }

  let profit: number
  if (result === 'won') {
    profit = amount !== undefined && Number.isFinite(amount) ? amount : Number(bet.expectedProfit)
  } else {
    const loss = amount !== undefined && Number.isFinite(amount) ? -Math.abs(amount) : -Number(bet.stake)
    profit = Math.max(loss, -Number(bet.stake))
  }
  if (Math.abs(profit) > MAX_STAKE) return { ok: false as const, error: 'Ugyldigt beløb' }

  await db
    .update(bets)
    .set({ status: result, profit: profit.toFixed(2), settledAt: new Date() })
    .where(and(eq(bets.id, id), eq(bets.userId, userId)))
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
