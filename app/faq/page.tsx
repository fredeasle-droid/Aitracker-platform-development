import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { FAQ_ENTRIES } from '@/components/home/faq-data'
import { LegalPage } from '@/components/legal/legal-page'
import { ACCOUNT_FAQ } from '@/lib/legal'

export const metadata: Metadata = {
  title: 'FAQ – BetTrackerAI',
  description: 'Svar på de mest stillede spørgsmål om surebets, prøveperiode, abonnement, opsigelse og fortrydelsesret.',
}

const GROUPS = [
  { title: 'Om surebets og tjenesten', entries: FAQ_ENTRIES },
  { title: 'Konto, betaling og data', entries: ACCOUNT_FAQ },
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
      eyebrow="Support"
      title="Ofte stillede spørgsmål"
      intro="Find svar på det, vi oftest bliver spurgt om. Finder du ikke dit spørgsmål, så skriv til os."
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON_LD }} />
      <div className="flex flex-col gap-8 lg:max-w-3xl">
        {GROUPS.map((group) => (
          <section key={group.title} aria-labelledby={`${group.title}-heading`}>
            <h2 id={`${group.title}-heading`} className="mb-3 text-[18px] font-bold text-foreground">
              {group.title}
            </h2>
            <div className="flex flex-col gap-3">
              {group.entries.map(({ q, a }) => (
                <details key={q} className="group rounded-2xl border border-border bg-card/60 open:border-primary/50">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-[16px] font-semibold leading-snug text-foreground [&::-webkit-details-marker]:hidden lg:px-5">
                    <span className="text-pretty">{q}</span>
                    <ChevronDown className="size-5 shrink-0 text-primary-glow transition-transform group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className="px-4 pb-4 text-[15px] leading-relaxed text-foreground/80 lg:px-5">{a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}

        <div className="rounded-2xl border border-primary/40 bg-card/60 p-5">
          <p className="text-[17px] font-bold text-foreground">Fandt du ikke svar?</p>
          <p className="mt-1 text-[15px] text-foreground/80">Vi hjælper dig gerne personligt.</p>
          <Link
            href="/kontakt"
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-[15px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Kontakt os <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </LegalPage>
  )
}
