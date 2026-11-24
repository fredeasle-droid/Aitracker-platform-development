import { generateText } from 'ai'
import fs from 'node:fs'

const MODEL = 'anthropic/claude-sonnet-4.6'
const OUT = '.v0-scratch/seo'
fs.mkdirSync(OUT, { recursive: true })

const LANGS = {
  es: 'Spanish (Spain, neutral enough to also read naturally in Latin America)',
  br: 'Brazilian Portuguese (pt-BR)',
  pt: 'European Portuguese (pt-PT, Portugal – NOT Brazilian)',
  fr: 'French (France)',
  it: 'Italian',
  pl: 'Polish',
  fi: 'Finnish',
  nl: 'Dutch (Netherlands)',
}
const ONLY = process.argv[2] ? process.argv[2].split(',') : Object.keys(LANGS)

const routeSrc = fs.readFileSync('lib/route-slugs.ts', 'utf8')
function objBlock(src, start) {
  const i = src.indexOf(start)
  const open = src.indexOf('{', i)
  let d = 0
  for (let j = open; j < src.length; j++) {
    if (src[j] === '{') d++
    else if (src[j] === '}' && --d === 0) return src.slice(open, j + 1)
  }
}
const pairs = (block) => Object.fromEntries([...block.matchAll(/'?([\w/-]+)'?:\s*'([^']+)'/g)].map((m) => [m[1], m[2]]))
const slugsBlock = objBlock(routeSrc, 'const SLUGS')
const pagesBlock = objBlock(routeSrc, 'const PAGE_NAMES')
const sectionsBlock = objBlock(routeSrc, 'const SECTION_NAMES')
const langBlock = (block, lang) => pairs(objBlock(block, `\n  ${lang}: {`))

const enSlugs = langBlock(slugsBlock, 'en')
const enReverse = Object.fromEntries(Object.entries(enSlugs).map(([da, en]) => [en, da]))
const enPagesReverse = Object.fromEntries(Object.entries(langBlock(pagesBlock, 'en')).map(([da, en]) => [en, da]))
const enSections = { guides: 'guide', sports: 'sport', bookmakers: 'bookmaker' }

const guidesEn = JSON.parse(fs.readFileSync('lib/content-i18n/guides.en.json', 'utf8'))
const landingEn = JSON.parse(fs.readFileSync('lib/content-i18n/landing.en.json', 'utf8'))

function toCanonical(text) {
  return text.replace(/\/en(\/[a-z0-9/-]*)?(?=[)"\s#?]|$)/g, (_, rest = '') => {
    const parts = rest.split('/').filter(Boolean)
    if (parts.length === 0) return '@@/'
    if (enSections[parts[0]]) {
      const section = enSections[parts[0]]
      const slug = parts[1] ? (enReverse[parts[1]] ?? parts[1]) : ''
      return `@@/${section}${slug ? `/${slug}` : ''}`
    }
    const page = `/${parts.join('/')}`
    return `@@${enPagesReverse[page] ?? page}`
  })
}

function toLocale(text, lang, guideSlugs) {
  const sections = langBlock(sectionsBlock, lang)
  const pages = langBlock(pagesBlock, lang)
  const existing = langBlock(slugsBlock, lang)
  return text.replace(/@@(\/[a-z0-9/-]*)/g, (_, path) => {
    const parts = path.split('/').filter(Boolean)
    if (parts.length === 0) return `/${lang}`
    if (sections[parts[0]]) {
      const slug = parts[1] ? (guideSlugs[parts[1]] ?? existing[parts[1]] ?? parts[1]) : ''
      return `/${lang}/${sections[parts[0]]}${slug ? `/${slug}` : ''}`
    }
    return `/${lang}${pages[path] ?? path}`
  })
}

async function ask(prompt, maxOutputTokens = 16000) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const { text } = await generateText({ model: MODEL, prompt, maxOutputTokens, temperature: 0.3 })
      return JSON.parse(text.trim().replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, ''))
    } catch (error) {
      if (attempt === 2) throw error
    }
  }
}

async function slugsFor(lang) {
  const file = `${OUT}/slugs.${lang}.json`
  if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'))
  const list = Object.entries(guidesEn).map(([da, g]) => `${da} | en: ${enSlugs[da] ?? da} | ${g.title} | keyword: ${g.keyword}`)
  const result = await ask(`Create SEO-friendly URL slugs in ${LANGS[lang]} for these articles about sports betting / surebets.
Return ONLY a JSON object mapping the first column (the key, unchanged) to the new slug.
Slug rules: lowercase ASCII only (strip accents: ç→c, ã→a, é→e, ł→l, ą→a, ä→a, ö→o), words joined by hyphens, 2-6 words, include the main search term people in that country actually type. Keep "surebets"/"surebet" as is. Keep "matched-betting", "dutching", "roi", "bankroll" when they are the common term. All slugs must be unique.

${list.join('\n')}`, 4000)
  fs.writeFileSync(file, JSON.stringify(result, null, 2))
  return result
}

const RULES = (lang) => `Translate this JSON from English into ${LANGS[lang]} for a sports-betting SEO article on BetTrackerAI.
Rules:
- Output ONLY valid JSON with exactly the same keys and structure (same number of blocks, same "type" values, same array lengths). No markdown fences.
- Translate every human-readable string value. Never translate keys or "type" values.
- Keep every link path that starts with "@@" EXACTLY unchanged, including inside markdown links like [text](@@/guide/x).
- Keep brand names unchanged: BetTrackerAI, BetTracker, bet365, Unibet, Betano, LeoVegas, Pinnacle, Betfair, Telegram.
- Keep all numbers, odds, amounts and currencies (EUR, €) exactly as in the source.
- Write naturally like a native SEO copywriter. The "keyword" field and "metaTitle" must use the term people in that country really search for (e.g. "surebets", "apuestas seguras", "apostas de arbitragem", "paris sûrs", "scommesse sicure", "zakłady arbitrażowe", "varmat vedot", "arbitrage wedden") while keeping "surebet" when that is the common term.
- Where the English text refers to the UK specifically (laws, tax, regulator), adapt it to the target country (${lang === 'br' ? 'Brazil' : lang === 'es' ? 'Spain' : lang === 'pt' ? 'Portugal' : lang === 'fr' ? 'France' : lang === 'it' ? 'Italy' : lang === 'pl' ? 'Poland' : lang === 'fi' ? 'Finland' : 'the Netherlands'}) only with general, non-specific wording; never invent concrete legal facts, numbers or tax rates.
- metaTitle max ~60 characters, description max ~155 characters.`

function sameShape(a, b) {
  if (Array.isArray(a)) return Array.isArray(b) && a.length === b.length && a.every((x, i) => sameShape(x, b[i]))
  if (a && typeof a === 'object') return b && typeof b === 'object' && Object.keys(a).every((k) => k in b && (k === 'type' ? a[k] === b[k] : sameShape(a[k], b[k])))
  return typeof a === typeof b
}

async function translateEntry(kind, key, entry, lang, guideSlugs) {
  const file = `${OUT}/${kind}.${lang}.${key.replace('/', '__')}.json`
  if (fs.existsSync(file)) return
  const source = JSON.parse(toCanonical(JSON.stringify(entry)))
  let result
  for (let attempt = 0; attempt < 3; attempt++) {
    result = await ask(`${RULES(lang)}\n\nJSON:\n${JSON.stringify(source)}`, 20000)
    if (sameShape(source, result)) break
    if (attempt === 2) throw new Error('shape mismatch')
  }
  const localized = JSON.parse(toLocale(JSON.stringify(result), lang, guideSlugs))
  fs.writeFileSync(file, JSON.stringify(localized))
  console.log('done', kind, lang, key)
}

const slugMaps = {}
await Promise.all(ONLY.map(async (lang) => { slugMaps[lang] = await slugsFor(lang) }))
console.log('slugs ready')

const queue = []
for (const lang of ONLY) {
  for (const [key, entry] of Object.entries(guidesEn)) queue.push(['guides', key, entry, lang])
  for (const [key, entry] of Object.entries(landingEn)) queue.push(['landing', key, entry, lang])
}
let failed = 0
async function worker() {
  while (queue.length) {
    const [kind, key, entry, lang] = queue.shift()
    try { await translateEntry(kind, key, entry, lang, slugMaps[lang]) } catch (e) { failed++; console.error('FAIL', kind, lang, key, e.message) }
  }
}
await Promise.all(Array.from({ length: 16 }, worker))
console.log('failed', failed)
