// Collects Danish UI strings from the home page and site header, then translates any missing ones
// into every locale via AI Gateway. Results go to lib/home-i18n/<locale>.json (keyed by Danish source).
// Usage: node --env-file-if-exists=/vercel/share/.env.project scripts/i18n/translate-home.mjs
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { generateText } from 'ai'

const require = createRequire(import.meta.url)
const ts = require('typescript')
const ROOT = process.cwd()
const OUT_DIR = path.join(ROOT, 'lib/home-i18n')
const MODEL = 'anthropic/claude-sonnet-5.5'
const LOCALES = {
  en: 'English (UK)', sv: 'Swedish', no: 'Norwegian Bokmål', de: 'German', es: 'Spanish (Spain)',
  br: 'Brazilian Portuguese', pt: 'European Portuguese', fr: 'French', it: 'Italian', pl: 'Polish',
  fi: 'Finnish', nl: 'Dutch',
  tr: 'Turkish', cs: 'Czech', el: 'Greek', hu: 'Hungarian', hr: 'Croatian', sk: 'Slovak',
  mx: 'Mexican Spanish', ar: 'Argentine Spanish (voseo where natural)',
  ch: 'Swiss Standard German (always "ss", never "ß")', at: 'Austrian German', be: 'Belgian Dutch (Flemish)',
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name)
    return d.isDirectory() ? walk(p) : /\.tsx?$/.test(d.name) ? [p] : []
  })
}

const SKIP_ATTRS = new Set(['className', 'href', 'src', 'id', 'key', 'type', 'style', 'role', 'rel', 'target', 'd', 'viewBox', 'fill', 'stroke', 'sizes'])
const looksLikeUi = (s) => {
  const t = s.trim()
  if (!/\p{L}{2,}/u.test(t)) return false
  if (/^(https?:|\/|#|var\(|bg-|text-)/.test(t)) return false
  if (/[\[\]{}<>=]|\b(flex|grid|items-|justify-|rounded|px-|py-|h-|w-|gap-)/.test(t)) return false
  return /\s/.test(t) || /[æøåÆØÅ]/.test(t) || /^[A-ZÆØÅ]/.test(t)
}

function collectLiterals(file, keys) {
  const sf = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const visit = (node) => {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) return
    if (ts.isJsxAttribute(node) && SKIP_ATTRS.has(node.name.getText(sf))) return
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      const p = node.parent
      const isTx = ts.isCallExpression(p) && ts.isIdentifier(p.expression) && p.expression.text === 'tx'
      if (isTx || looksLikeUi(node.text)) keys.add(node.text.trim())
    }
    ts.forEachChild(node, visit)
  }
  visit(sf)
}

// FAQ answers are template literals with prices; evaluate them so the keys match what renders.
function collectFaq(keys) {
  const tmp = path.join(ROOT, 'scripts/i18n/.tmp')
  fs.mkdirSync(tmp, { recursive: true })
  for (const name of ['data', 'faq-data']) {
    const src = fs.readFileSync(path.join(ROOT, `components/home/${name}.ts`), 'utf8')
    const { outputText } = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } })
    fs.writeFileSync(path.join(tmp, `${name}.cjs`), outputText.replace(/require\("\.\/data"\)/g, 'require("./data.cjs")'))
  }
  const { FAQ_ENTRIES } = require(path.join(tmp, 'faq-data.cjs'))
  for (const { q, a } of FAQ_ENTRIES) keys.add(q.trim()), keys.add(a.trim())
  fs.rmSync(tmp, { recursive: true, force: true })
}

const keys = new Set()
const EXTRA = ['components/regnskab', 'components/konto']
const EXTRA_FILES = ['app/kontakt/page.tsx', 'app/om-os/page.tsx']
for (const f of [
  ...walk(path.join(ROOT, 'components/home')),
  ...EXTRA.flatMap((d) => walk(path.join(ROOT, d))),
  ...EXTRA_FILES.map((f) => path.join(ROOT, f)),
  path.join(ROOT, 'components/site/global-header.tsx'),
  path.join(ROOT, 'components/site/global-footer.tsx'),
]) collectLiterals(f, keys)
collectFaq(keys)
const allKeys = [...keys].filter(Boolean).sort()
console.log(`Collected ${allKeys.length} source strings`)

async function translateChunk(locale, chunk) {
  const prompt = `Translate this Danish UI copy for BetTrackerAI (a surebet / arbitrage betting scanner SaaS website) into ${LOCALES[locale]}.
Rules:
- Return ONLY a JSON object mapping each exact Danish source string (unchanged key) to its translation.
- Natural, concise marketing/UI tone for that market. Use "surebet(s)" as the term where the source does.
- Keep brand and product names unchanged: BetTrackerAI, BetTracker AI, BetTrackerAI Pro, Telegram, Discord, Instagram, YouTube, Visa, Mastercard, bookmaker names, team and league names.
- Keep numbers, percentages, prices and the currency "kr." exactly as written; translate units like "/md" (per month) and "dage" (days).
- Some strings are fragments of a sentence split around a value (e.g. "Seneste fund:" ... "siden" = "Latest find: <time> ago"). Translate them so they read naturally when joined.
- Danish-only references (StopSpillet, ROFUS, Spillemyndigheden) stay as names.
- Preserve leading/trailing punctuation such as "–", "?", ":" and "…".

${JSON.stringify(chunk, null, 1)}`
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const { text } = await generateText({ model: MODEL, prompt, maxOutputTokens: 32000 })
      const json = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1))
      return Object.fromEntries(chunk.filter((k) => typeof json[k] === 'string' && json[k].trim()).map((k) => [k, json[k]]))
    } catch (err) {
      console.warn(`[${locale}] attempt ${attempt} failed: ${err.message.slice(0, 160)}`)
    }
  }
  return {}
}

const jobs = []
const results = {}
for (const locale of Object.keys(LOCALES)) {
  const file = path.join(OUT_DIR, `${locale}.json`)
  const existing = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {}
  results[locale] = existing
  const missing = allKeys.filter((k) => !existing[k])
  for (let i = 0; i < missing.length; i += 120) jobs.push([locale, missing.slice(i, i + 120)])
}
console.log(`${jobs.length} translation requests`)

let next = 0
await Promise.all(
  Array.from({ length: 12 }, async () => {
    while (next < jobs.length) {
      const [locale, chunk] = jobs[next++]
      Object.assign(results[locale], await translateChunk(locale, chunk))
      console.log(`[${locale}] ${Object.keys(results[locale]).length}/${allKeys.length}`)
    }
  }),
)

for (const [locale, dict] of Object.entries(results)) {
  const sorted = Object.fromEntries(Object.entries(dict).filter(([k]) => keys.has(k)).sort(([a], [b]) => a.localeCompare(b)))
  fs.writeFileSync(path.join(OUT_DIR, `${locale}.json`), JSON.stringify(sorted, null, 2) + '\n')
}
console.log('Done')
