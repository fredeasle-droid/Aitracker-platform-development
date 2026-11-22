import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ChevronDown, CircleHelp, Mail, UserRound, Zap } from 'lucide-react'
import { FAQ_ENTRIES } from '@/components/home/faq-data'
import { LegalPage } from '@/components/legal/legal-page'
import { ACCOUNT_FAQ } from '@/lib/legal'

export const metadata: Metadata = {
  title: 'FAQ – BetTrackerAI',
  description: 'Svar på de mest stillede spørgsmål om surebets, prøveperiode, abonnement, opsigelse og fortrydelsesret.',
}

const GROUPS = [
  { id: 'surebets', title: 'Om surebets og tjenesten', icon: Zap, entries: FAQ_ENTRIES },
  { id: 'konto', title: 'Konto, betaling og data', icon: UserRound, entries: ACCOUNT_FAQ },
]

const JSON_LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: GROUPS.flatMap((g) => g.entries).map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
})

export default function FaqPage() {
  return (
    <LegalPage
      icon={CircleHelp}
      eyebrow="Support"
      title="Ofte stillede spørgsmål"
      intro="Find svar på det, vi oftest bliver spurgt om. Finder du ikke dit spørgsmål, så skriv til os."
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON_LD }} />

      <nav aria-label="Emner" className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden">
        <ul className="flex w-max gap-2 lg:w-auto">
          {GROUPS.map(({ id, title, icon: Icon, entries }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className="flex min-h-11 items-center gap-2 rounded-xl border border-border bg-card/70 px-4 text-[14px] font-semibold whitespace-nowrap text-foreground/85 transition-colors hover:border-primary/60 hover:text-foreground"
              >
                <Icon className="size-4 text-primary-glow" aria-hidden="true" />
                {title}
                <span className="rounded-md bg-primary/15 px-1.5 py-0.5 text-[12px] tabular-nums text-primary-glow">{entries.length}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-8 flex flex-col gap-10 lg:max-w-3xl">
        {GROUPS.map(({ id, title, icon: Icon, entries }) => (
          <section key={id} id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-20">
            <h2 id={`${id}-heading`} className="mb-4 flex items-center gap-3 text-[20px] font-bold text-foreground">
              <span className="flex size-10 items-center justify-center rounded-xl border border-primary/40 bg-primary/15 text-primary-glow">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              {title}
            </h2>
            <div className="flex flex-col gap-3">
              {entries.map(({ q, a }) => (
                <details
                  key={q}
                  className="group rounded-2xl border border-border bg-card/70 transition-colors open:border-primary/50 open:bg-gradient-to-br open:from-primary/10 open:to-card/70 open:shadow-[0_0_32px_-16px] open:shadow-primary/70"
                >
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-[16px] font-semibold leading-snug text-foreground [&::-webkit-details-marker]:hidden lg:px-5">
                    <span className="text-pretty">{q}</span>
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background/60 text-primary-glow transition-colors group-open:bg-primary group-open:text-primary-foreground">
                      <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden="true" />
                    </span>
                  </summary>
                  <p className="px-4 pb-5 text-pretty text-[15px] leading-relaxed text-foreground/80 lg:px-5">{a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}

        <div className="flex flex-col gap-4 rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/15 to-card/70 p-5 shadow-[0_0_40px_-18px] shadow-primary/70 lg:flex-row lg:items-center lg:justify-between lg:p-7">
          <div className="flex items-center gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-primary/40 bg-primary/20 text-primary-glow">
              <Mail className="size-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[18px] font-bold text-foreground">Fandt du ikke svar?</p>
              <p className="mt-0.5 text-[15px] text-foreground/80">Vi hjælper dig gerne personligt.</p>
            </div>
          </div>
          <Link
            href="/kontakt"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-[15px] font-semibold text-primary-foreground shadow-[0_0_28px_-8px] shadow-primary transition-opacity hover:opacity-90"
          >
            Kontakt os <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </LegalPage>
  )
}
