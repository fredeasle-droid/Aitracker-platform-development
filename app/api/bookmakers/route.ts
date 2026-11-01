import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { opportunities } from '@/lib/db/schema'
import { demoOpportunities, isDemoMode } from '@/lib/demo-opportunities'
import { getBookmaker } from '@/lib/bookmakers'
import { bookmakerId } from '@/lib/bookmaker-filter'

export const dynamic = 'force-dynamic'

export async function GET() {
  const pairs = isDemoMode()
    ? demoOpportunities.map((o) => ({ a: o.a.bookmaker, b: o.b.bookmaker }))
    : await db.selectDistinct({ a: opportunities.aBookmaker, b: opportunities.bBookmaker }).from(opportunities)

  const byId = new Map<string, string>()
  for (const { a, b } of pairs) {
    for (const name of [a, b]) {
      const id = bookmakerId(name)
      if (!byId.has(id)) byId.set(id, getBookmaker(name).name)
    }
  }

  const list = Array.from(byId, ([id, name]) => ({ id, name })).sort((x, y) => x.name.localeCompare(y.name))
  return NextResponse.json(list)
}
