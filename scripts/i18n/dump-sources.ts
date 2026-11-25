// Writes every translatable section for the source languages (en, de, es, nl) to scripts/i18n/.sources/<locale>.json.
// Usage: npx tsx scripts/i18n/dump-sources.ts
import fs from 'node:fs'
import path from 'node:path'
import { translations } from '@/lib/i18n'
import { dataMessages } from '@/lib/data-messages'
import { calculatorBase } from '@/lib/messages/calculator'
import { SEO_STRINGS } from '@/lib/seo/ui-strings'
import { DAILY, FAQ_PAGE } from '@/lib/content-i18n/pages'
import { PAGE_NAMES_BASE, SECTION_NAMES_BASE, SLUGS_BASE } from '@/lib/route-slugs'
import { homePageMessages } from '@/lib/home-messages'
import { COMPANY } from '@/lib/legal'

const SOURCES = ['en', 'de', 'es', 'nl'] as const
const OUT = path.join(process.cwd(), 'scripts/i18n/.sources')
const ROOT = process.cwd()

const accountFile = fs.readFileSync(path.join(ROOT, 'app/konto/page.tsx'), 'utf8')
const withMailToken = <T>(value: T): T => JSON.parse(JSON.stringify(value).split(COMPANY.email).join('{mail}'))
const readJson = (file: string) => JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf8'))

fs.mkdirSync(OUT, { recursive: true })
for (const locale of SOURCES) {
  const seo = SEO_STRINGS[locale]
  const calculator = Object.fromEntries(
    Object.entries(calculatorBase[locale]).filter(([key, value]) => typeof value === 'string' && key !== 'numberTag' && key !== 'currency'),
  )
  const account = accountFile.match(new RegExp(`\\n  ${locale}: '([^']+) – BetTracker'`))?.[1]
  const source = {
    ui: translations[locale],
    data: dataMessages[locale],
    calculator,
    seo: { ...seo, minRead: seo.minRead(Number.NaN).replace('NaN', '{minutes}'), moreOf: seo.moreOf('{label}') },
    daily: withMailToken(DAILY[locale]),
    faqPage: withMailToken(FAQ_PAGE[locale]),
    account,
    sections: SECTION_NAMES_BASE[locale],
    slugs: SLUGS_BASE[locale],
    pages: PAGE_NAMES_BASE[locale],
    home: homePageMessages[locale],
    guides: readJson(`lib/content-i18n/guides.${locale}.json`),
    landing: readJson(`lib/content-i18n/landing.${locale}.json`),
  }
  fs.writeFileSync(path.join(OUT, `${locale}.json`), JSON.stringify(source, null, 1))
  console.log(locale, Object.fromEntries(Object.entries(source).map(([k, v]) => [k, JSON.stringify(v ?? '').length])))
}
