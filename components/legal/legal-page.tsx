import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { CalendarCheck } from 'lucide-react'
import { LegalTabs } from '@/components/legal/legal-tabs'

export function LegalPage({
  eyebrow,
  title,
  intro,
  updated,
  icon: Icon,
  children,
}: {
  eyebrow: string
  title: string
  intro: string
  updated?: string
  icon: LucideIcon
  children: ReactNode
}) {
  return (
    <main id="top" className="mx-auto w-full max-w-3xl px-4 pb-16 pt-5 lg:max-w-6xl lg:px-10 lg:pb-24 lg:pt-10">
      <LegalTabs />

      <header className="relative mt-5 overflow-hidden rounded-3xl border border-primary/35 bg-gradient-to-br from-primary/20 via-card/80 to-card/60 p-5 shadow-[0_0_48px_-18px] shadow-primary/60 lg:mt-8 lg:p-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-8">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-primary/50 bg-primary/25 text-primary-glow shadow-[0_0_28px_-6px] shadow-primary/70 lg:size-20 lg:rounded-3xl">
            <Icon className="size-7 lg:size-9" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-primary-glow">{eyebrow}</p>
            <h1 className="mt-1.5 text-balance text-[32px] font-extrabold leading-[1.08] tracking-tight text-foreground lg:text-[48px]">
              {title}
            </h1>
            <p className="mt-3 max-w-2xl text-pretty text-[16px] leading-relaxed text-foreground/80 lg:text-[17px]">{intro}</p>
            {updated && (
              <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-3 py-1.5 text-[13px] text-muted-foreground">
                <CalendarCheck className="size-4 text-primary-glow" aria-hidden="true" />
                Senest opdateret {updated}
              </p>
            )}
          </div>
        </div>
      </header>

      <div className="mt-6 lg:mt-10">{children}</div>
    </main>
  )
}
