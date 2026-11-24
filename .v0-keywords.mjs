import { generateText } from 'ai'
import fs from 'node:fs'
import pg from 'pg'

const LANGS = {
  es: 'Spain (Spanish)',
  br: 'Brazil (Brazilian Portuguese)',
  pt: 'Portugal (European Portuguese)',
  fr: 'France (French)',
  it: 'Italy (Italian)',
  pl: 'Poland (Polish)',
  fi: 'Finland (Finnish)',
  nl: 'the Netherlands (Dutch)',
}
const OUT = '.v0-scratch/keywords'
fs.mkdirSync(OUT, { recursive: true })

const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
await client.connect()
const { rows: en } = await client.query("select keyword, target_path from seo_keywords where locale = 'en' order by id")
const write = process.argv[2] === 'write'

for (const lang of Object.keys(LANGS)) {
  const file = `${OUT}/${lang}.json`
  if (!fs.existsSync(file)) {
    const { text } = await generateText({
      model: 'anthropic/claude-sonnet-4.6',
      temperature: 0.3,
      maxOutputTokens: 6000,
      prompt: `You are an SEO specialist for ${LANGS[lang]}. Below is an English keyword list for a surebet / arbitrage betting tool, each with a target path.
Produce the equivalent list of what people in ${LANGS[lang]} actually type into Google for each target path. 1-2 keywords per English line, lowercase, native spelling with accents, realistic search phrases (keep "surebets"/"surebet", "matched betting", "value bets" where locals use them). Use exactly the same target_path values. 35-45 entries, no duplicates.
Return ONLY a JSON array of {"keyword": string, "target_path": string}.

${en.map((row) => `${row.keyword} -> ${row.target_path}`).join('\n')}`,
    })
    fs.writeFileSync(file, text.trim().replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, ''))
  }
  const list = JSON.parse(fs.readFileSync(file, 'utf8'))
  const valid = new Set(en.map((row) => row.target_path))
  const clean = list.filter((item) => valid.has(item.target_path) && item.keyword?.trim())
  console.log(lang, clean.length, clean.slice(0, 4).map((item) => item.keyword).join(' | '))
  if (write) {
    for (const item of clean) {
      await client.query(
        'insert into seo_keywords (locale, keyword, target_path) values ($1, $2, $3) on conflict (locale, keyword) do nothing',
        [lang, item.keyword.trim().toLowerCase(), item.target_path],
      )
    }
  }
}
await client.end()
