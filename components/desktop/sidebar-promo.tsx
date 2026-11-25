'use client'

import Link from '@/components/localized-link'
import { ArrowRight, Crown } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { useLocale } from '@/components/locale-provider'

export function SidebarPromo() {
  const { data: session } = authClient.useSession()
  const { t } = useLocale()
  const loggedIn = Boolean(session?.user)

  return (
    <div className="sb-panel panel-glow mt-6 shrink-0 p-4 short:mt-4 short:p-3 lg:mt-auto">
      <div className="flex items-start gap-3">
        <Crown className="h-9 w-9 shrink-0 fill-[#f5c84b] text-[#f5c84b]" strokeWidth={1.8} aria-hidden="true" />
        <div>
          <p className="text-sm font-bold leading-tight">{loggedIn ? t('premium') : t('createAccount')}</p>
          <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
            {loggedIn ? t('premiumText') : t('accountText')}
          </p>
        </div>
      </div>
      <Link
        href="/konto"
        className="bg-gradient-primary mt-3 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold text-primary-foreground shadow-glow"
      >
        {loggedIn ? (
          t('upgrade')
        ) : (
          <>
            {t('create')} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </>
        )}
      </Link>
    </div>
  )
}
