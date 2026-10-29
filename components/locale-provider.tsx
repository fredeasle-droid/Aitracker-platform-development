'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { LOCALES, translations, type Locale, type TranslationKey } from '@/lib/i18n'

const LocaleContext = createContext<{ locale: Locale; setLocale: (locale: Locale) => void; t: (key: TranslationKey) => string } | null>(null)

function readLocale(): Locale {
  if (typeof document === 'undefined') return 'da'
  const stored = document.cookie.match(/(?:^|; )bettracker_locale=([^;]+)/)?.[1]
  return stored && stored in LOCALES ? (stored as Locale) : 'da'
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('da')

  useEffect(() => setLocaleState(readLocale()), [])

  function setLocale(next: Locale) {
    setLocaleState(next)
    document.cookie = `bettracker_locale=${next}; path=/; max-age=31536000; samesite=lax`
  }

  const value = useMemo(() => ({ locale, setLocale, t: (key: TranslationKey) => translations[locale][key] }), [locale])
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) throw new Error('useLocale must be used inside LocaleProvider')
  return context
}
