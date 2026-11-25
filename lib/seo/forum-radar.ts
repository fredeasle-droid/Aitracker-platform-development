import 'server-only'
import { generateText } from 'ai'
import { desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { forumThreads } from '@/lib/db/schema'
import { SITE_URL } from '@/lib/site'

export const FORUM_KEYWORDS = ['surebet', 'surebets', 'arbitrage betting', 'sure bet', 'odds forskel', 'matched betting', 'bonusjagt', 'betting bonus']
export const THREAD_STATUSES = ['new', 'posted', 'skipped'] as const
export type ThreadStatus = (typeof THREAD_STATUSES)[number]
export type ForumThread = typeof forumThreads.$inferSelect

const USER_AGENT = 'web:bettrackerai-forum-radar:1.0 (by ODDSLOGIC LTD)'
const MAX_BODY = 4000

export const redditConfigured = () => Boolean(process.env.REDDIT_CLIENT_ID && process.env.REDDIT_CLIENT_SECRET)

async function getRedditToken() {
  if (!redditConfigured()) return null
  const credentials = Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`).toString('base64')
  const response = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: { Authorization: `Basic ${credentials}`, 'User-Agent': USER_AGENT, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  })
  if (!response.ok) throw new Error(`Reddit login fejlede (${response.status})`)
  return ((await response.json()) as { access_token: string }).access_token
}

type RedditPost = { id: string; title: string; selftext: string; permalink: string; subreddit: string; over_18: boolean; locked: boolean; archived: boolean }

async function redditGet<T>(token: string, path: string) {
  const response = await fetch(`https://oauth.reddit.com${path}`, {
    headers: { Authorization: `Bearer ${token}`, 'User-Agent': USER_AGENT },
    cache: 'no-store',
  })
  if (!response.ok) throw new Error(`Reddit svarede ${response.status}`)
  return (await response.json()) as T
}

export async function scanForums() {
  const token = await getRedditToken()
  if (!token) return { ok: false as const, error: 'Reddit er ikke forbundet' }
  let added = 0
  for (const keyword of FORUM_KEYWORDS) {
    const result = await redditGet<{ data: { children: { data: RedditPost }[] } }>(
      token,
      `/search?q=${encodeURIComponent(`"${keyword}"`)}&sort=new&t=week&limit=15&type=link`,
    )
    const rows = result.data.children
      .map((child) => child.data)
      .filter((post) => !post.over_18 && !post.locked && !post.archived)
      .map((post) => ({
        source: 'reddit',
        externalId: `reddit:${post.id}`,
        url: `https://www.reddit.com${post.permalink}`,
        title: post.title.slice(0, 300),
        body: post.selftext.slice(0, MAX_BODY),
        community: `r/${post.subreddit}`,
        keyword,
      }))
    if (rows.length === 0) continue
    const inserted = await db.insert(forumThreads).values(rows).onConflictDoNothing().returning({ id: forumThreads.id })
    added += inserted.length
  }
  return { ok: true as const, added }
}

export function parseThreadUrl(raw: string) {
  try {
    const url = new URL(raw.trim())
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null
    const host = url.hostname.toLowerCase()
    if (host === 'localhost' || host.endsWith('.local') || host.endsWith('.internal') || /^[\d.]+$/.test(host) || host.includes(':')) return null
    url.hash = ''
    return url
  } catch {
    return null
  }
}

const decodeEntities = (value: string) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')

function readMeta(html: string, name: string) {
  const match =
    html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${name}["'][^>]+content=["']([^"']*)["']`, 'i')) ??
    html.match(new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${name}["']`, 'i'))
  return match ? decodeEntities(match[1]).trim() : ''
}

export async function fetchThreadDetails(url: URL) {
  const redditId = url.hostname.endsWith('reddit.com') ? url.pathname.match(/\/comments\/([a-z0-9]+)/i)?.[1] : undefined
  if (redditId) {
    const token = await getRedditToken().catch(() => null)
    if (token) {
      const [listing] = await redditGet<{ data: { children: { data: RedditPost }[] } }[]>(token, `/comments/${redditId}?limit=1`)
      const post = listing?.data.children[0]?.data
      if (post) return { title: post.title, body: post.selftext.slice(0, MAX_BODY), community: `r/${post.subreddit}`, source: 'reddit', externalId: `reddit:${post.id}` }
    }
  }
  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BetTrackerAI/1.0)' }, redirect: 'follow', signal: AbortSignal.timeout(8000), cache: 'no-store' })
    if (!response.ok) return null
    const html = (await response.text()).slice(0, 400_000)
    const title = readMeta(html, 'og:title') || decodeEntities(html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] ?? '').trim()
    const body = readMeta(html, 'og:description') || readMeta(html, 'description')
    return title ? { title, body, community: url.hostname.replace(/^www\./, ''), source: 'web', externalId: null } : null
  } catch {
    return null
  }
}

const REPLY_INSTRUCTIONS = `Du skriver et svarforslag til en tråd på et forum eller Reddit på vegne af Frederik, stifter af BetTrackerAI (${SITE_URL}), et værktøj der finder surebets hos danske og internationale bookmakere.
Regler:
- Svar på samme sprog som tråden.
- Svar først og fremmest konkret og brugbart på det, personen spørger om. Svaret skal give værdi, selv hvis man aldrig klikker på et link.
- Skriv som et menneske i en afslappet, ærlig tone. Ingen salgssprog, ingen overdrivelser, ingen garantier for gevinst.
- Nævn kun BetTrackerAI, hvis det faktisk er relevant for spørgsmålet. Gør det i så fald åbent, f.eks. "Disclaimer: jeg har selv lavet BetTrackerAI", og nævn linket højst én gang.
- Hvis tråden ikke handler om surebets, arbitrage, odds eller bonusser, så skriv et kort, hjælpsomt svar uden link.
- Nævn gerne kort de reelle risici: begrænsning af konti hos bookmakere, odds der ændrer sig, og at man skal være 18+ og spille ansvarligt.
- Maks 180 ord. Ingen overskrifter, ingen emojis, ingen hashtags.
Returnér kun selve svarteksten.`

export async function draftReply(thread: Pick<ForumThread, 'title' | 'body' | 'community'>) {
  const { text } = await generateText({
    model: 'openai/gpt-5.4-mini',
    system: REPLY_INSTRUCTIONS,
    prompt: `Fællesskab: ${thread.community ?? 'ukendt'}\nTitel: ${thread.title}\n\nIndlæg:\n${thread.body || '(intet tekstindhold, kun titlen)'}`,
  })
  return text.trim()
}

export async function getForumThreads(status: ThreadStatus) {
  return db.select().from(forumThreads).where(eq(forumThreads.status, status)).orderBy(desc(forumThreads.createdAt)).limit(60)
}
