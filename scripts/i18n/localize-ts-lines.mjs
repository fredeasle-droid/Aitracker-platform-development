// Localises the Danish market facts left in per-locale TS tables (base locales only; 'da' is skipped).
// Usage: node scripts/i18n/localize-ts-lines.mjs
import fs from 'node:fs'
import { generateText } from 'ai'
import { MARKET_FACTS } from './market-facts.mjs'

const MODEL = 'anthropic/claude-sonnet-5.5'
const FILES = ['lib/content-i18n/pages.ts', 'lib/seo/ui-strings.ts']
const DANISH =
  /Danmark|Dänemark|Denmark|Dinamarca|Danemark|Danimarca|\bDania\b|Danii|Tanska|Denemarken|Danimarka|Danske Spil|Bet25|Spilnu|NordicBet|Spillemyndighed|ROFUS|\bdansk|\bdanska|dänisch|Danish|danois|danes[ie]|duńsk|tanskal|Deens|deense|dinamarqu|danes[ae]s?\b/i

function literals(line) {
  const out = []
  const re = /'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"/g
  for (const m of line.matchAll(re)) out.push({ raw: m[0], quote: m[0][0], text: m[1] ?? m[2] })
  return out
}

async function rewrite(locale, texts) {
  const f = MARKET_FACTS[locale]
  const promptText = `Rewrite these ${f.language} SEO strings for BetTrackerAI (surebet and odds tool) so they fit ${f.country} instead of Denmark.
Facts: regulator ${f.regulator}; licensed bookmakers ${f.bookmakers.join(', ')}; market: ${f.structure} Tax: ${f.tax}
Rules: same language, meaning and length; remove every Danish reference (Denmark, Danish players/bookmakers, Danske Spil). When bookmakers are listed, use only ones from the licensed list (keep Pinnacle out unless listed). Keep \${...} expressions and escapes exactly. Return ONLY a JSON array of strings in the same order.
${JSON.stringify(texts)}`
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const { text } = await generateText({ model: MODEL, prompt: promptText, maxOutputTokens: 8000 })
      const arr = JSON.parse(text.slice(text.indexOf('['), text.lastIndexOf(']') + 1))
      if (arr.length !== texts.length) throw new Error('length mismatch')
      arr.forEach((s, i) => {
        if (DANISH.test(s)) throw new Error(`still Danish: ${s.match(DANISH)[0]}`)
        const keep = (texts[i].match(/\$\{[^}]+\}/g) || []).join()
        if ((s.match(/\$\{[^}]+\}/g) || []).join() !== keep) throw new Error('template mismatch')
      })
      return arr
    } catch (err) {
      if (attempt === 4) throw err
      console.warn(`  [${locale}] retry ${attempt}: ${err.message}`)
    }
  }
}

const escape = (s, q) => s.replace(/\\(?!['"\\n])/g, '\\\\').replace(new RegExp(`(?<!\\\\)${q}`, 'g'), `\\${q}`)

for (const file of FILES) {
  const lines = fs.readFileSync(file, 'utf8').split('\n')
  const jobs = new Map()
  let locale = null
  lines.forEach((line, i) => {
    const block = line.match(/^ {2}([a-z]{2}): \{/)
    if (block) locale = block[1]
    if (!locale || locale === 'da' || !MARKET_FACTS[locale] || !DANISH.test(line)) return
    const lits = literals(line).filter((l) => DANISH.test(l.text))
    if (!lits.length) return
    if (!jobs.has(locale)) jobs.set(locale, [])
    jobs.get(locale).push({ i, lits })
  })
  await Promise.all(
    [...jobs].map(async ([loc, items]) => {
      const texts = items.flatMap((it) => it.lits.map((l) => l.text))
      const out = await rewrite(loc, texts)
      let k = 0
      for (const it of items)
        for (const l of it.lits) lines[it.i] = lines[it.i].replace(l.raw, l.quote + escape(out[k++], l.quote) + l.quote)
      console.log(`${file} [${loc}] ${texts.length} strings`)
    }),
  )
  fs.writeFileSync(file, lines.join('\n'))
}
console.log('FINISHED')
