// Translates every section (UI, home, guides, landing pages, FAQ, SEO, URLs) into the new markets via AI Gateway.
// Resumable: progress is kept per market in scripts/i18n/.progress/<locale>.json, and a market's pack is only
// marked `ready` (which launches it) once every string is translated and passes validation.
// Usage:
//   npx tsx scripts/i18n/dump-sources.ts
//   node --env-file-if-exists=/vercel/share/.env.project scripts/i18n/translate-locales.mjs [locale ...]
import fs from 'node:fs'
import path from 'node:path'
import { generateText } from 'ai'

const ROOT = process.cwd()
const SOURCES_DIR = path.join(ROOT, 'scripts/i18n/.sources')
const PROGRESS_DIR = path.join(ROOT, 'scripts/i18n/.progress')
const MODEL = 'anthropic/claude-sonnet-5.5'
const CONCURRENCY = 16
const CHUNK_CHARS = 7000

// Rollout order: regional variants first (lowest risk), then new languages.
const MARKETS = {
  at: { source: 'de', name: 'Austrian German', country: 'Austria', currency: 'EUR', regional: true },
  ch: { source: 'de', name: 'Swiss Standard German (always "ss", never "ß")', country: 'Switzerland', currency: 'CHF', regional: true },
  be: { source: 'nl', name: 'Belgian Dutch (Flemish)', country: 'Belgium', currency: 'EUR', regional: true },
  cs: { source: 'en', name: 'Czech', country: 'Czech Republic', currency: 'CZK' },
  sk: { source: 'en', name: 'Slovak', country: 'Slovakia', currency: 'EUR' },
  el: { source: 'en', name: 'Greek', country: 'Greece', currency: 'EUR' },
  tr: { source: 'en', name: 'Turkish', country: 'Turkey', currency: 'TRY' },
  hu: { source: 'en', name: 'Hungarian', country: 'Hungary', currency: 'HUF' },
  hr: { source: 'en', name: 'Croatian', country: 'Croatia', currency: 'EUR' },
  mx: { source: 'es', name: 'Mexican Spanish', country: 'Mexico', currency: 'MXN', regional: true },
  ar: { source: 'es', name: 'Argentine Spanish (voseo where natural)', country: 'Argentina', currency: 'ARS', regional: true },
}

const PACK_SECTIONS = ['ui', 'data', 'calculator', 'seo', 'daily', 'faqPage', 'account', 'sections', 'slugs', 'pages']
const URL_SECTIONS = new Set(['sections', 'slugs', 'pages'])
const SKIP_KEYS = new Set(['type', 'href', 'src', 'slug', 'id', 'icon', 'variant'])

function flatten(value, prefix, out, key = '') {
  if (typeof value === 'string') {
    if (!SKIP_KEYS.has(key) && /\p{L}/u.test(value)) out[prefix] = value
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => flatten(item, `${prefix}[${index}]`, out, key))
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) flatten(v, `${prefix}.${JSON.stringify(k)}`, out, k)
  }
  return out
}

function rebuild(value, prefix, done) {
  if (typeof value === 'string') return done[prefix] ?? value
  if (Array.isArray(value)) return value.map((item, index) => rebuild(item, `${prefix}[${index}]`, done))
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, rebuild(v, `${prefix}.${JSON.stringify(k)}`, done)]))
  }
  return value
}

const tokens = (s) => (s.match(/\{\w+\}/g) ?? []).sort().join(',')
const slugify = (s) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/ı/g, 'i').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

function valid(path, source, translated) {
  if (typeof translated !== 'string' || !translated.trim()) return false
  if (tokens(source) !== tokens(translated)) return false
  if (path.startsWith('slugs.') && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slugify(translated))) return false
  // Preserve the leading/trailing spaces that join sentence fragments.
  if (/^\s/.test(source) !== /^\s/.test(translated) || /\s$/.test(source) !== /\s$/.test(translated)) return false
  return true
}

function prompt(market, chunk) {
  const m = MARKETS[market]
  const adapt = m.regional
    ? `Write everything in ${m.name} for readers in ${m.country}. Some inputs are English, others are already in the parent language (${m.source.toUpperCase()}): translate English inputs and adapt parent-language inputs. Use the vocabulary, spelling and tone readers in ${m.country} expect, written like a native copywriter, not a literal translation. Never refer to another country as the reader's own.`
    : `Translate into natural, fluent ${m.name} for readers in ${m.country}, written like a native copywriter, not a literal translation.`
  return `You localise website copy for BetTrackerAI, a surebet (arbitrage betting) scanner SaaS.
${adapt}

Rules:
- Return ONLY a JSON object mapping every input key (unchanged) to its localised string.
- Keep placeholders like {mail}, {minutes}, {label}, {bookmaker} exactly as written.
- Keep leading and trailing spaces and punctuation of each string, because some strings are sentence fragments joined in the UI.
- Keep brand and product names unchanged: BetTrackerAI, BetTracker AI, BetTrackerAI Pro, Telegram, Discord, bookmaker names, team and league names.
- Keep numbers, odds and prices exactly as written, including their currency.
- Where the text addresses readers as bettors of a specific country in general terms, address readers in ${m.country} instead.
- Never invent legal, tax or licensing facts. Statements about a specific country's laws or authorities stay about that country.
- Keys starting with "slugs." are URL slugs: return lowercase ASCII words joined by hyphens (transliterate non-Latin scripts), short and keyword-rich.
- Keys starting with "sections." or "pages." are URL path segments: return lowercase ASCII words joined by hyphens.

${JSON.stringify(chunk, null, 1)}`
}

async function translateChunk(market, chunk) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const { text } = await generateText({ model: MODEL, prompt: prompt(market, chunk), maxOutputTokens: 32000 })
      const json = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1))
      const ok = Object.entries(chunk).filter(([k, v]) => valid(k, v, json[k]))
      return Object.fromEntries(ok.map(([k]) => [k, k.startsWith('slugs.') || k.startsWith('sections.') || k.startsWith('pages.') ? slugify(json[k]) : json[k]]))
    } catch (err) {
      console.warn(`[${market}] attempt ${attempt} failed: ${String(err.message).slice(0, 160)}`)
    }
  }
  return {}
}

const loadJson = (file, fallback) => (fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : fallback)
const writeJson = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n')

const selected = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(MARKETS)
fs.mkdirSync(PROGRESS_DIR, { recursive: true })

const state = {}
const jobs = []
for (const market of selected) {
  const parent = loadJson(path.join(SOURCES_DIR, `${MARKETS[market].source}.json`))
  const english = loadJson(path.join(SOURCES_DIR, 'en.json'))
  if (!parent || !english) throw new Error(`Missing sources; run: npx tsx scripts/i18n/dump-sources.ts`)
  // Parent-language guides and landing pages are written about the parent's own country (e.g. German law),
  // so regional variants are written from the country-neutral English text instead. That also keeps them
  // from being near-copies of the parent language's pages.
  const source = MARKETS[market].regional ? { ...parent, guides: english.guides, landing: english.landing } : parent
  // Regional variants keep their parent's URLs so the same page has one slug per language family.
  const sections = Object.keys(source).filter((s) => !(MARKETS[market].regional && URL_SECTIONS.has(s)))
  const flat = {}
  for (const section of sections) flatten(source[section], section, flat)
  const progressFile = path.join(PROGRESS_DIR, `${market}.json`)
  const done = loadJson(progressFile, {})
  for (const key of Object.keys(done)) if (!(key in flat) || !valid(key, flat[key], done[key])) delete done[key]
  state[market] = { source, flat, done, progressFile, pending: 0 }
  let chunk = {}
  let size = 0
  for (const [key, value] of Object.entries(flat)) {
    if (done[key]) continue
    chunk[key] = value
    size += key.length + value.length
    if (size > CHUNK_CHARS || Object.keys(chunk).length >= 120) jobs.push([market, chunk]), (chunk = {}), (size = 0)
  }
  if (Object.keys(chunk).length) jobs.push([market, chunk])
  state[market].pending = jobs.filter(([m]) => m === market).length
  console.log(`[${market}] ${Object.keys(done).length}/${Object.keys(flat).length} done, ${state[market].pending} requests`)
}

function build(market) {
  const { source, flat, done } = state[market]
  const total = Object.keys(flat).length
  const translated = Object.keys(done).length
  const out = {}
  for (const section of Object.keys(source)) {
    const keys = Object.keys(flat).filter((k) => k === section || k.startsWith(`${section}.`))
    const sectionDone = Object.fromEntries(keys.filter((k) => done[k]).map((k) => [k, done[k]]))
    out[section] = rebuild(source[section], section, sectionDone)
  }
  const { home, guides, landing, ...pack } = out
  writeJson(path.join(ROOT, 'lib/home-i18n', `${market}.json`), home)
  writeJson(path.join(ROOT, 'lib/content-i18n', `guides.${market}.json`), guides)
  writeJson(path.join(ROOT, 'lib/content-i18n', `landing.${market}.json`), landing)
  const packOut = Object.fromEntries(PACK_SECTIONS.filter((s) => s in pack).map((s) => [s, pack[s]]))
  writeJson(path.join(ROOT, 'lib/locale-packs', `${market}.json`), translated === total ? { ready: true, ...packOut } : {})
  console.log(`[${market}] ${translated === total ? 'READY' : `incomplete ${translated}/${total}`}`)
}

let next = 0
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (next < jobs.length) {
      const [market, chunk] = jobs[next++]
      const s = state[market]
      Object.assign(s.done, await translateChunk(market, chunk))
      writeJson(s.progressFile, s.done)
      s.pending -= 1
      console.log(`[${market}] ${Object.keys(s.done).length}/${Object.keys(s.flat).length} (${s.pending} left)`)
      if (s.pending === 0) build(market)
    }
  }),
)
for (const market of selected) if (state[market].pending === 0 && jobs.every(([m]) => m !== market)) build(market)
console.log('Done')
