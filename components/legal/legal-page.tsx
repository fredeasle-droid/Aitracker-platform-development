import type { ReactNode } from 'react'
import { LegalTabs } from '@/components/legal/legal-tabs'

export function LegalPage({
  eyebrow,
  title,
  intro,
  updated,
  children,
}: {
  eyebrow: string
  title: string
  intro: string
  updated?: string
  children: ReactNode
}) {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-14 pt-6 lg:max-w-6xl lg:px-10 lg:pb-20 lg:pt-10">
      <LegalTabs />
      <header className="mt-6 lg:mt-8 lg:max-w-3xl">
        <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-primary-glow">{eyebrow}</p>
        <h1 className="mt-2 text-balance text-[32px] font-extrabold leading-[1.1] tracking-tight text-foreground lg:text-[44px]">
          {title}
        </h1>
        <p className="mt-3 text-pretty text-[16px] leading-relaxed text-foreground/80">{intro}</p>
        {updated && <p className="mt-3 text-[14px] text-muted-foreground">Senest opdateret {updated}</p>}
      </header>
      <div className="mt-8 lg:mt-10">{children}</div>
    </main>
  )
}
