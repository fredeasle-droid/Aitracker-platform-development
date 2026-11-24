import guidesEn from './content-i18n/guides.en.json'
import guidesSv from './content-i18n/guides.sv.json'
import guidesNo from './content-i18n/guides.no.json'
import guidesDe from './content-i18n/guides.de.json'
import landingEn from './content-i18n/landing.en.json'
import landingSv from './content-i18n/landing.sv.json'
import landingNo from './content-i18n/landing.no.json'
import landingDe from './content-i18n/landing.de.json'
import { GUIDES, type Guide, type GuideBlock } from '@/lib/guides'
import { BOOKMAKER_PAGES, SPORT_PAGES, type LandingPage } from '@/lib/landing-pages'
import type { Locale } from '@/lib/i18n'

type GuideTranslation = {
  title: string
  metaTitle: string
  description: string
  keyword: string
  intro: string
  blocks: GuideBlock[]
  faq: { q: string; a: string }[]
  category: string
  ctaLabel: string
}

type LandingTranslation = Omit<GuideTranslation, 'category' | 'ctaLabel'>

const GUIDE_TRANSLATIONS = {
  en: guidesEn,
  sv: guidesSv,
  no: guidesNo,
  de: guidesDe,
} as unknown as Record<Exclude<Locale, 'da'>, Record<string, GuideTranslation>>

const LANDING_TRANSLATIONS = {
  en: landingEn,
  sv: landingSv,
  no: landingNo,
  de: landingDe,
} as unknown as Record<Exclude<Locale, 'da'>, Record<string, LandingTranslation>>

export type LocalizedGuide = Omit<Guide, 'category'> & { category: string }

export function getLocalizedGuide(slug: string, locale: Locale): LocalizedGuide | undefined {
  const base = GUIDES.find((guide) => guide.slug === slug)
  if (!base || locale === 'da') return base
  const translation = GUIDE_TRANSLATIONS[locale]?.[slug]
  if (!translation) return undefined
  const { ctaLabel, ...fields } = translation
  return { ...base, ...fields, cta: { href: base.cta.href, label: ctaLabel } }
}

export function guideLocales(slug: string): Locale[] {
  const translated = (Object.keys(GUIDE_TRANSLATIONS) as Exclude<Locale, 'da'>[]).filter((locale) => GUIDE_TRANSLATIONS[locale]?.[slug])
  return ['da', ...translated]
}

export function getLocalizedGuides(locale: Locale): LocalizedGuide[] {
  return GUIDES.map((guide) => getLocalizedGuide(guide.slug, locale)).filter((guide) => guide !== undefined)
}

export function getLocalizedLanding(kind: 'sport' | 'bookmaker', slug: string, locale: Locale): LandingPage | undefined {
  const list = kind === 'sport' ? SPORT_PAGES : BOOKMAKER_PAGES
  const base = list.find((page) => page.slug === slug)
  if (!base || locale === 'da') return base
  const translation = LANDING_TRANSLATIONS[locale]?.[`${kind}/${slug}`]
  if (!translation) return undefined
  return { ...base, ...translation }
}

export function getLocalizedLandingList(kind: 'sport' | 'bookmaker', locale: Locale): LandingPage[] {
  const list = kind === 'sport' ? SPORT_PAGES : BOOKMAKER_PAGES
  return list.map((page) => getLocalizedLanding(kind, page.slug, locale)).filter((page) => page !== undefined)
}
