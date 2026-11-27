'use client'

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { LOCALE_COOKIE, LOCALES, localePath, makeTranslator, stripLocalePrefix, type Locale, type Translator } from '@/lib/i18n'
import { canonicalRoute } from '@/lib/route-slugs'

type LocaleContextValue = Translator & { locale: Locale; setLocale: (locale: Locale) => void; tag: string }

const LocaleContext = createContext<LocaleContextValue | null>(null)
const SPORT_TRANSLATION_KEYS = ['football', 'basketball', 'tennis', 'hockey', 'esports', 'handball'] as const
const LEGACY_SPORT_VALUES = { football: 'Fodbold', basketball: 'Basketball', tennis: 'Tennis', hockey: 'Ishockey', esports: 'Esport', handball: 'Håndbold' } as const

export function LocaleProvider({ children, initialLocale }: { children: ReactNode; initialLocale: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  const value = useMemo<LocaleContextValue>(() => {
    function setLocale(next: Locale) {
      setLocaleState(next)
      document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`
      document.documentElement.lang = next
      const { locale: current, path } = stripLocalePrefix(window.location.pathname)
      const currentLocale = current ?? locale
      const canonical = canonicalRoute(currentLocale, path)
      const search = new URLSearchParams(window.location.search)
      const currentSport = search.get('sport')
      const currentTranslator = makeTranslator(currentLocale)
      const nextTranslator = makeTranslator(next)
      const sportKey = SPORT_TRANSLATION_KEYS.find(
        (key) => currentSport === currentTranslator.t(key) || currentSport === LEGACY_SPORT_VALUES[key],
      )
      if (sportKey) search.set('sport', nextTranslator.t(sportKey))
      const query = search.toString()
      const target = `${localePath(next, canonical)}${query ? `?${query}` : ''}${window.location.hash}`
      window.location.assign(target)
    }
    return { ...makeTranslator(locale), locale, setLocale, tag: LOCALES[locale].tag }
  }, [locale])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) throw new Error('useLocale must be used inside LocaleProvider')
  return context
}
