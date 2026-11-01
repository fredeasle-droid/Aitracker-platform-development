import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { opportunities } from '@/lib/db/schema'
import { demoOpportunities, isDemoMode } from '@/lib/demo-opportunities'
import { getBookmaker } from '@/lib/bookmakers'
import { getBetHeroCatalog, getBetHeroMessages } from '@/lib/bethero-ingest'
import { bookmakerId } from '@/lib/bookmaker-filter'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const country = new URL(request.url).searchParams.get('country')?.toUpperCase() ?? 'DK'
  const pairs = isDemoMode()
    ? demoOpportunities.map((o) => ({ a: o.a.bookmaker, b: o.b.bookmaker }))
    : await db.selectDistinct({ a: opportunities.aBookmaker, b: opportunities.bBookmaker }).from(opportunities)

  const byId = new Map<string, string>()
  const feedMessages = await getBetHeroMessages().catch(() => [])
  const catalog = await getBetHeroCatalog().catch(() => [])
  const feedBooks: string[] = catalog.map((entry) => entry.name)
  const collectFeedBooks = (value: unknown) => {
    if (Array.isArray(value)) return value.forEach(collectFeedBooks)
    if (!value || typeof value !== 'object') return
    const candidate = value as { books_1?: Array<{ name?: string }>; books_2?: Array<{ name?: string }> }
    for (const book of [...(candidate.books_1 ?? []), ...(candidate.books_2 ?? [])]) {
      if (book.name) feedBooks.push(book.name)
    }
    Object.values(value).forEach(collectFeedBooks)
  }
  feedMessages.forEach(collectFeedBooks)
  for (const { a, b } of pairs) {
    for (const bookmaker of [a, b]) {
      const id = bookmakerId(bookmaker)
      if (!byId.has(id)) byId.set(id, getBookmaker(bookmaker).name)
    }
  }
  if (country !== 'DK') {
    for (const name of feedBooks) {
      const id = bookmakerId(name)
      if (!byId.has(id)) byId.set(id, getBookmaker(name).name)
    }
  }
  for (const { a, b } of pairs) {
    for (const name of [a, b]) {
      const id = bookmakerId(name)
      if (!byId.has(id)) byId.set(id, getBookmaker(name).name)
    }
  }

  const list = Array.from(byId, ([id, name]) => ({ id, name })).sort((x, y) => x.name.localeCompare(y.name))
  return NextResponse.json(list)
}
