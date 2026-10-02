import 'server-only'
import { cache } from 'react'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { appUsers, bets, opportunities } from '@/lib/db/schema'
import { asc } from 'drizzle-orm'

const USER_COOKIE = 'bt_uid'
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const DEMO_HISTORY: { match: string; market: string; stake: number; profit: number; daysAgo: number; hour: number }[] = [
  { match: 'Real Madrid vs Barcelona', market: 'Over 2,5 mål', stake: 1000, profit: 52, daysAgo: 3, hour: 21 },
  { match: 'Inter vs Milan', market: 'Under 3,5 mål', stake: 1500, profit: 68, daysAgo: 4, hour: 20.75 },
  { match: 'Newcastle vs PSG', market: 'Begge hold scorer', stake: 1000, profit: -1000, daysAgo: 7, hour: 21 },
  { match: 'Liverpool vs Chelsea', market: 'Over 2,5 mål', stake: 1500, profit: 73, daysAgo: 8, hour: 18.5 },
  { match: 'Tottenham vs Man United', market: 'Begge hold scorer', stake: 2000, profit: 110, daysAgo: 10, hour: 17.5 },
  { match: 'Ajax vs PSV', market: 'Over 3,5 mål', stake: 2000, profit: 96, daysAgo: 11, hour: 20 },
  { match: 'Bayern München vs Leipzig', market: 'Begge hold scorer', stake: 2500, profit: 124, daysAgo: 12, hour: 18.5 },
  { match: 'FC Midtjylland vs AGF', market: 'Over 2,5 mål', stake: 1500, profit: 81, daysAgo: 13, hour: 19 },
  { match: 'Napoli vs Roma', market: 'Under 2,5 mål', stake: 2000, profit: 102, daysAgo: 14, hour: 20.75 },
  { match: 'Atletico Madrid vs Sevilla', market: 'Over 2,5 mål', stake: 3000, profit: 147, daysAgo: 15, hour: 21 },
  { match: 'Arsenal vs Brighton', market: 'Begge hold scorer', stake: 2500, profit: 118, daysAgo: 16, hour: 16 },
  { match: 'Benfica vs Porto', market: 'Under 3,5 mål', stake: 2000, profit: 94, daysAgo: 17, hour: 21.5 },
  { match: 'Juventus vs Lazio', market: 'Over 2,5 mål', stake: 3000, profit: 156, daysAgo: 18, hour: 20.75 },
  { match: 'Celtic vs Rangers', market: 'Begge hold scorer', stake: 2000, profit: 101, daysAgo: 20, hour: 13.5 },
  { match: 'Dortmund vs Leverkusen', market: 'Over 3,5 mål', stake: 3000, profit: 162, daysAgo: 21, hour: 18.5 },
  { match: 'Lyon vs Marseille', market: 'Under 2,5 mål', stake: 2500, profit: 129, daysAgo: 23, hour: 20.75 },
  { match: 'Brøndby vs Randers', market: 'Over 2,5 mål', stake: 3000, profit: 171, daysAgo: 25, hour: 18 },
  { match: 'Man United vs Aston Villa', market: 'Begge hold scorer', stake: 2500, profit: 138, daysAgo: 27, hour: 17.5 },
  { match: 'Villarreal vs Valencia', market: 'Over 2,5 mål', stake: 2000, profit: 120, daysAgo: 45, hour: 21 },
  { match: 'Galatasaray vs Fenerbahce', market: 'Begge hold scorer', stake: 2000, profit: -2000, daysAgo: 60, hour: 19 },
  { match: 'Feyenoord vs AZ', market: 'Over 3,5 mål', stake: 2500, profit: 133, daysAgo: 75, hour: 14.5 },
]

async function seedDemoBets(userId: string) {
  const open = await db.select().from(opportunities).orderBy(asc(opportunities.id)).limit(2)
  const now = Date.now()
  const rows = DEMO_HISTORY.map((b) => {
    const day = new Date(now - b.daysAgo * 86_400_000)
    day.setUTCHours(Math.floor(b.hour) - 2, Math.round((b.hour % 1) * 60), 0, 0)
    return {
      userId,
      match: b.match,
      market: b.market,
      stake: String(b.stake),
      expectedProfit: String(b.profit > 0 ? b.profit : Math.round(b.stake * 0.045)),
      profit: String(b.profit),
      status: b.profit > 0 ? 'won' : 'lost',
      kickoff: day,
      placedAt: new Date(day.getTime() - 3 * 3_600_000),
      settledAt: new Date(day.getTime() + 2 * 3_600_000),
    }
  })
  const openRows = open.map((o, i) => ({
    userId,
    opportunityId: o.id,
    match: `${o.homeTeam} vs ${o.awayTeam.replace(' IF', '')}`,
    market: o.market.replace('Over/Under ', 'Over '),
    stake: String(i === 0 ? 1500 : 2000),
    expectedProfit: String(i === 0 ? 75 : 120),
    status: 'open',
    kickoff: o.kickoff,
  }))
  await db.insert(bets).values([...openRows, ...rows])
}

export const getUserId = cache(async () => {
  const store = await cookies()
  const uid = store.get(USER_COOKIE)?.value
  if (!uid || !UUID_RE.test(uid)) throw new Error('Missing user session')

  const inserted = await db
    .insert(appUsers)
    .values({ id: uid })
    .onConflictDoNothing()
    .returning({ id: appUsers.id })
  if (inserted.length > 0) await seedDemoBets(uid)
  return uid
})
