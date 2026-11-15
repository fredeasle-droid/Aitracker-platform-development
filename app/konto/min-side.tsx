import Link from 'next/link'
import { ArrowLeft, LogOut } from 'lucide-react'
import { ProfileForm } from '@/components/konto/min-side/profile-form'
import { PasswordForm } from '@/components/konto/min-side/password-form'
import { SubscriptionCard } from '@/components/konto/min-side/subscription-card'
import { InvoiceList } from '@/components/konto/min-side/invoice-list'
import { secondaryButton } from '@/components/konto/min-side/ui'
import { formatDate, type AccountInvoice, type AccountSubscription, type AccountUser } from './account-types'

type Props = {
  user: AccountUser
  subscription: AccountSubscription | null
  invoices: AccountInvoice[]
}

export function MinSide({ user, subscription, invoices }: Props) {
  const initial = (user.name.trim()[0] ?? user.email[0] ?? '?').toUpperCase()

  return (
    <div className="min-h-dvh bg-[#050b17] text-[#f3f6fc] lg:min-h-[calc(100dvh-70px)] lg:bg-[#030914] lg:px-6 lg:pb-10 lg:pt-6">
      <main className="mx-auto w-full max-w-[390px] px-3 pb-8 pt-2 sm:px-5 lg:max-w-5xl lg:px-0 lg:pt-0 xl:max-w-[1240px]">
        <header className="flex h-14 items-center gap-2 lg:hidden">
          <Link href="/" aria-label="Tilbage til BetTracker" className="flex size-11 items-center justify-center rounded-full hover:bg-white/5">
            <ArrowLeft className="size-5" />
          </Link>
          <span className="text-[17px] font-black tracking-tight">Min side</span>
        </header>

        <div className="flex items-center gap-3 py-3 lg:pt-0">
          <span aria-hidden="true" className="flex size-14 shrink-0 items-center justify-center rounded-full border border-[#159cff] bg-[#0b2945] text-[24px] font-black text-[#8dd0ff]">{initial}</span>
          <div className="min-w-0">
            <h1 className="truncate text-[22px] font-black leading-tight lg:text-[28px]">{user.name || 'Min side'}</h1>
            <p className="truncate text-[13px] text-[#a8c0d8]">{user.email}</p>
            <p className="text-[12px] text-[#7f95b0]">Medlem siden {formatDate(user.createdAt)}</p>
          </div>
        </div>

        <div className="mt-3 space-y-4 lg:mt-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-5 lg:space-y-0 xl:grid-cols-3">
          <div className="space-y-4 lg:row-span-2 xl:row-span-1">
            <SubscriptionCard subscription={subscription} />
            <InvoiceList invoices={invoices} />
          </div>
          <ProfileForm user={user} />
          <div className="space-y-4 lg:col-start-2 xl:col-start-auto">
            <PasswordForm />
            <Link href="/log-ud" className={secondaryButton}>
              <LogOut className="size-4" aria-hidden="true" /> Log ud
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
