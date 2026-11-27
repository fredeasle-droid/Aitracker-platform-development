// Rewrites market-specific facts (bookmakers, regulator, tax, currency, help lines, country)
// in each locale's SEO copy so no market is served Danish details.
// Usage: node scripts/i18n/localize-markets.mjs [locale ...]
// Resumable: finished units are recorded in scripts/i18n/.progress/localize-<locale>.json.
import fs from 'node:fs'
import path from 'node:path'
import { generateText } from 'ai'
import { MARKET_FACTS } from './market-facts.mjs'

const ROOT = process.cwd()
const PROGRESS_DIR = path.join(ROOT, 'scripts/i18n/.progress')
const MODEL = 'anthropic/claude-sonnet-5.5'
const CONCURRENCY = 12
const NEW_LOCALES = new Set(['tr', 'cs', 'el', 'hu', 'hr', 'sk', 'mx', 'ar', 'ch', 'at', 'be'])
// ui/data hold app copy (real DKK subscription prices, offers at the Danish bookmakers the product covers).
const PACK_SECTIONS = ['seo', 'daily', 'faqPage', 'calculator']
const SKIP_KEYS = new Set(['type', 'href', 'src', 'slug', 'id', 'icon', 'variant', 'url', 'image'])
// The subscription is billed in DKK, so "499 DKK/Monat" style prices are true in every market.
const KEEP_PHRASES = [/Surebet[\s-]Danmark/gi, /BetTrackerAI/g, /\d[\d.,]*\s?(?:DKK|kr\.?)\s?\/\s?\p{L}+/gu, /\b(?:499|199)\s?(?:DKK|kr\.?)/g, /[a-z0-9]+(?:-[a-z0-9]+)*-danmark(?:-[a-z0-9]+)*/g]

const DANISH = /Danmark|Dänemark|Denmark|Dinamarca|Danemark|Danimarca|\bDania\b|Danii|Tanska|Denemarken|Danimarka|Dánsk|Dánia|Dánsko|Dansk|dänisch|danish|danois|danese|duńsk|tanskal|deens|dinamarqu|Δανία|δανέζ|Danska|dánsk|DKK|Spillemyndighed|Danske Spil|Bet25|Spilnu|NordicBet|ROFUS|StopSpillet|\.dk\b/i
const KR = /\d\s?kr\.?(?!\w)|\bkr\.(?!\w)/i

// The competitor guide compares against a Denmark-only service, so naming its Danish coverage is factual there.

function marker(locale, text, id = '') {
  let t = text
  for (const re of KEEP_PHRASES) t = t.replace(re, '')
  if (DANISH.test(t)) return t.match(DANISH)[0]
  if (!['sv', 'no'].includes(locale) && KR.test(t)) return t.match(KR)[0]
  return null
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}
function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n')
}

function leaves(value, pathParts = [], out = []) {
  if (typeof value === 'string') out.push([pathParts, value])
  else if (Array.isArray(value)) value.forEach((v, i) => leaves(v, [...pathParts, i], out))
  else if (value && typeof value === 'object')
    for (const [k, v] of Object.entries(value)) if (!SKIP_KEYS.has(k)) leaves(v, [...pathParts, k], out)
  return out
}
function setAt(obj, parts, val) {
  let o = obj
  for (const p of parts.slice(0, -1)) o = o[p]
  o[parts.at(-1)] = val
}

const placeholders = (s) => (s.match(/\{[a-zA-Z0-9_]+\}/g) || []).sort().join(',')

function factSheet(locale) {
  const f = MARKET_FACTS[locale]
  return [
    `Target market: ${f.country}`,
    `Language: ${f.language}`,
    `Currency for examples: ${f.currency}`,
    `Regulator: ${f.regulator}`,
    `Licensed bookmakers to use as examples: ${f.bookmakers.join(', ')}`,
    `Market structure: ${f.structure}`,
    `Tax: ${f.tax}`,
    `Responsible gambling help: ${f.help}`,
  ].join('\n')
}

function prompt(locale, items) {
  return `You localise SEO copy for BetTrackerAI, a surebet / odds comparison and bet tracking tool, for one market.
The copy was originally written for Denmark. Rewrite it so it is correct and relevant for the target market.

${factSheet(locale)}

Rules:
- Write in ${MARKET_FACTS[locale].language}. Keep meaning, tone, length and SEO intent. Change only what is market-specific.
- Replace every Danish fact: Denmark/Danish players, Spillemyndigheden, ROFUS, StopSpillet, Danish tax rules, DKK/kr. amounts, and Danish bookmakers (Danske Spil, Bet25, Spilnu, NordicBet, .dk sites). Use the facts above instead.
- Where a text lists bookmakers, use bookmakers from the licensed list above. Never name a bookmaker that is not licensed in this market.
- Convert example amounts to ${MARKET_FACTS[locale].currency} with sensible round numbers. Keep the maths in calculations correct.
- Keep the BetTrackerAI subscription price exactly as written (amount and currency) — it is the real price.
- "Surebet Danmark" is a competitor's brand name: keep it unchanged.
- Do not invent exact tax rates, thresholds, laws or dates beyond the facts above. If unsure, say readers should check current local rules.
- If the market structure says surebetting is limited, be honest about it; never encourage unlicensed or blocked sites.
- Keep {placeholders}, markdown, URLs and HTML exactly. Keep text that is already correct unchanged.

Return ONLY a JSON object mapping each id to the rewritten string, with exactly the same ids.

Input:
${JSON.stringify(Object.fromEntries(items.map(([id, text]) => [id, text])), null, 1)}`
}

async function rewrite(locale, items) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const { text } = await generateText({ model: MODEL, prompt: prompt(locale, items), maxOutputTokens: 32000 })
      const json = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1))
      const bad = []
      for (const [id, src] of items) {
        const out = json[id]
        if (typeof out !== 'string' || !out.trim()) bad.push(`${id}: missing`)
        else if (placeholders(out) !== placeholders(src)) bad.push(`${id}: placeholders`)
        else if (marker(locale, out, id)) bad.push(`${id}: still "${marker(locale, out, id)}"`)
      }
      if (bad.length) throw new Error(bad.slice(0, 3).join('; '))
      return json
    } catch (err) {
      if (attempt === 4) throw err
      console.warn(`  [${locale}] retry ${attempt}: ${String(err.message).slice(0, 160)}`)
    }
  }
}

function buildUnits(locale) {
  const units = []
  const packFile = path.join(ROOT, `lib/locale-packs/${locale}.json`)
  if (NEW_LOCALES.has(locale) && fs.existsSync(packFile)) {
    const pack = readJson(packFile)
    const items = []
    for (const section of PACK_SECTIONS)
      for (const [parts, text] of leaves(pack[section] ?? {}, [section]))
        if (marker(locale, text)) items.push([parts.join('.'), text, parts])
    for (let i = 0; i < items.length; i += 30)
      units.push({ id: `pack:${i}`, file: packFile, items: items.slice(i, i + 30) })
  }
  for (const kind of ['guides', 'landing']) {
    const file = path.join(ROOT, `lib/content-i18n/${kind}.${locale}.json`)
    if (!fs.existsSync(file)) continue
    for (const [key, value] of Object.entries(readJson(file))) {
      const items = leaves(value, [key]).map(([parts, text]) => [parts.join('.'), text, parts])
      // Whole page per request, so the page is localised coherently. Split very long pages.
      for (let i = 0, n = 0; i < items.length; n++) {
        let size = 0
        let j = i
        while (j < items.length && (size < 9000 || j === i)) size += items[j++][1].length
        units.push({ id: `${kind}:${key}:${n}`, file, items: items.slice(i, j) })
        i = j
      }
    }
  }
  return units
}

async function runLocale(locale) {
  fs.mkdirSync(PROGRESS_DIR, { recursive: true })
  const progressFile = path.join(PROGRESS_DIR, `localize-${locale}.json`)
  const done = new Set(fs.existsSync(progressFile) ? readJson(progressFile) : [])
  const units = buildUnits(locale).filter((u) => !done.has(u.id))
  console.log(`[${locale}] ${units.length} units to localise`)
  const cache = new Map()
  const load = (f) => (cache.has(f) ? cache.get(f) : (cache.set(f, readJson(f)), cache.get(f)))
  let failed = 0
  let cursor = 0
  async function worker() {
    while (cursor < units.length) {
      const unit = units[cursor++]
      try {
        const result = await rewrite(locale, unit.items.map(([id, text]) => [id, text]))
        const data = load(unit.file)
        for (const [id, , parts] of unit.items) setAt(data, parts, result[id])
        writeJson(unit.file, data)
        done.add(unit.id)
        writeJson(progressFile, [...done])
      } catch (err) {
        failed++
        console.error(`  [${locale}] FAILED ${unit.id}: ${String(err.message).slice(0, 200)}`)
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker))
  console.log(`[${locale}] done, ${failed} failed`)
  return failed
}

const ALL = Object.keys(MARKET_FACTS)
const targets = process.argv.slice(2).length ? process.argv.slice(2) : ALL
let totalFailed = 0
for (const locale of targets) totalFailed += await runLocale(locale)
console.log(totalFailed ? `FINISHED with ${totalFailed} failed units (rerun to retry)` : 'FINISHED all units')
