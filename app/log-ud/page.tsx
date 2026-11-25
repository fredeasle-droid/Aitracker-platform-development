'use client'

import { useEffect } from 'react'
import { signOut } from '@/lib/auth-client'
import { useLocale } from '@/components/locale-provider'
import { localizedInternalHref } from '@/lib/localized-href'

export default function LogoutPage() {
  const { locale } = useLocale()
  useEffect(() => {
    signOut().finally(() => window.location.assign(localizedInternalHref(locale, '/login')))
  }, [locale])

  return (
    <main className="flex min-h-dvh items-center justify-center text-[#f3f6fc]">
      <p role="status">Logger ud...</p>
    </main>
  )
}
