'use client'

import { createContext, useContext, useMemo, useState, useTransition, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { LOCALE_COOKIE, LOCALES, makeTranslator, type Locale, type Translator } from '@/lib/i18n'

type LocaleContextValue = Translator & { setLocale: (locale: Locale) => void; tag: string }

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children, initialLocale }: { children: ReactNode; initialLocale: Locale }) {
  const router = useRouter()
  const [locale, setLocaleState] = useState<Locale>(initialLocale)
  const [, startTransition] = useTransition()

  const value = useMemo<LocaleContextValue>(() => {
    function setLocale(next: Locale) {
      setLocaleState(next)
      document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`
      document.documentElement.lang = next
      startTransition(() => router.refresh())
    }
    return { ...makeTranslator(locale), setLocale, tag: LOCALES[locale].tag }
  }, [locale, router])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) throw new Error('useLocale must be used inside LocaleProvider')
  return context
}
