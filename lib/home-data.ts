import 'server-only'
import { getOpportunities, type Opportunity } from '@/lib/data'
import { getOptionalUserId } from '@/lib/user'
import { plans } from '@/app/konto/plans'
import type { HomeData, HomeFind, HomeRow, HomeTeam } from '@/components/home/home-data'

const team = (name: string, logo?: string | null): HomeTeam => ({ name, crest: logo ?? null })

const unique = (values: string[]) => [...new Set(values.filter(Boolean))]

export async function getHomeData(): Promise<HomeData> {
  const [all, userId] = await Promise.all([getOpportunities(), getOptionalUserId().catch(() => null)])
  const now = Date.now()

  const byFreshness = [...all].sort((a, b) => b.createdTs - a.createdTs)
  const byMargin = [...all].sort((a, b) => b.margin - a.margin)

  const toRow = (o: Opportunity): HomeRow => ({
    id: o.id,
    home: team(o.homeTeam, o.homeLogo),
    away: team(o.awayTeam, o.awayLogo),
    league: o.league,
    margin: o.margin,
    age: Math.max(1, Math.floor((now - o.createdTs) / 1000)),
  })

  const toFind = (o: Opportunity): HomeFind => ({
    id: o.id,
    home: team(o.homeTeam, o.homeLogo),
    away: team(o.awayTeam, o.awayLogo),
    league: o.league,
    margin: o.margin,
    time: o.kickoffLabel,
  })

  const bookmakers = unique(all.flatMap((o) => [o.a.bookmaker, o.b.bookmaker]))
  const margins = all.map((o) => o.margin)

  return {
    rows: byFreshness.slice(0, 12).map(toRow),
    finds: byMargin.slice(0, 6).map(toFind),
    bookmakers,
    stats: {
      surebets: all.length,
      bookmakers: bookmakers.length,
      leagues: unique(all.map((o) => o.league)).length,
      avgMargin: margins.length ? margins.reduce((s, m) => s + m, 0) / margins.length : 0,
      topMargin: margins.length ? Math.max(...margins) : 0,
    },
    plans: Object.entries(plans).map(([key, p]) => ({ key, name: p.name, price: Number(p.price), detail: p.detail })),
    signedIn: Boolean(userId),
  }
}
