import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, HeartHandshake, Mail, MessageCircleQuestion, Phone, Send } from 'lucide-react'
import { RESPONSIBLE } from '@/components/home/data'
import { LegalPage } from '@/components/legal/legal-page'
import { COMPANY } from '@/lib/legal'

export const metadata: Metadata = {
  title: 'Kontakt os – BetTrackerAI',
  description: 'Kontakt BetTrackerAI support på e-mail, via Telegram eller i supportchatten på forsiden.',
  alternates: { canonical: '/kontakt' },
}

const cardCls = 'flex flex-col gap-3 rounded-2xl border border-border bg-card/70 p-5 transition-colors hover:border-primary/50 lg:p-6'
const iconCls = 'flex size-12 items-center justify-center rounded-xl border border-primary/40 bg-primary/15 text-primary-glow'
const linkCls =
  'inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border bg-background/50 px-4 text-[14px] font-semibold text-foreground transition-colors hover:border-primary/60 hover:text-primary-glow'

export default function ContactPage() {
  const details = [
    ['Virksomhed', COMPANY.legalName],
    ['CVR-nr.', COMPANY.cvr],
    ['Adresse', COMPANY.address],
  ].filter((row): row is [string, string] => Boolean(row[1]))

  return (
    <LegalPage
      icon={Mail}
      eyebrow="Support"
      title="Kontakt os"
      intro="Har du et spørgsmål om dit abonnement, en fejl eller dine data? Vælg den vej, der passer dig bedst."
    >
      <section
        aria-labelledby="mail-heading"
        className="flex flex-col gap-4 rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/15 to-card/70 p-5 shadow-[0_0_40px_-18px] shadow-primary/70 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:p-8"
      >
        <div className="flex gap-4">
          <span className={`${iconCls} shrink-0`}>
            <Mail className="size-6" aria-hidden="true" />
          </span>
          <div>
            <h2 id="mail-heading" className="text-[20px] font-bold text-foreground">Skriv til os</h2>
            <p className="mt-1.5 max-w-xl text-pretty text-[15px] leading-relaxed text-foreground/80">
              Abonnement, betaling, fortrydelse, rettelse af e-mail eller sletning af data. Skriv gerne, hvilken e-mail din konto er oprettet med.
            </p>
          </div>
        </div>
        <a
          href={`mailto:${COMPANY.email}`}
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 text-[15px] font-semibold text-primary-foreground shadow-[0_0_28px_-8px] shadow-primary transition-opacity hover:opacity-90"
        >
          {COMPANY.email}
          <ArrowRight className="size-4" aria-hidden="true" />
        </a>
      </section>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <section className={cardCls} aria-labelledby="chat-heading">
          <span className={iconCls}>
            <MessageCircleQuestion className="size-6" aria-hidden="true" />
          </span>
          <h2 id="chat-heading" className="text-[18px] font-bold text-foreground">Hurtige svar</h2>
          <p className="flex-1 text-pretty text-[15px] leading-relaxed text-foreground/80">
            Find svar på de mest almindelige spørgsmål i vores FAQ eller i supportchatten på forsiden.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href="/faq" className={linkCls}>Se FAQ</Link>
            <Link href="/#faq" className={linkCls}>Supportchat</Link>
          </div>
        </section>

        <section className={cardCls} aria-labelledby="telegram-heading">
          <span className={iconCls}>
            <Send className="size-6" aria-hidden="true" />
          </span>
          <h2 id="telegram-heading" className="text-[18px] font-bold text-foreground">Telegram</h2>
          <p className="flex-1 text-pretty text-[15px] leading-relaxed text-foreground/80">
            Følg vores kanal for nyheder og opdateringer fra 365-dages challengen.
          </p>
          <div>
            <Link href="/telegram" className={linkCls}>
              Gå til Telegram <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className={cardCls} aria-labelledby="help-heading">
          <span className={iconCls}>
            <HeartHandshake className="size-6" aria-hidden="true" />
          </span>
          <h2 id="help-heading" className="text-[18px] font-bold text-foreground">Hjælp med spil</h2>
          <p className="flex-1 text-pretty text-[15px] leading-relaxed text-foreground/80">
            Er spil ved at blive et problem, kan du få fortrolig og gratis hjælp hos StopSpillet eller udelukke dig selv via ROFUS.
          </p>
          <div className="flex flex-wrap gap-2">
            <a href={`tel:${RESPONSIBLE.stopSpilletPhone.replace(/\s/g, '')}`} className={linkCls}>
              <Phone className="size-4" aria-hidden="true" />
              {RESPONSIBLE.stopSpilletPhone}
            </a>
            <a href={RESPONSIBLE.rofusUrl} target="_blank" rel="noopener noreferrer" className={linkCls}>
              ROFUS.nu <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </section>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {details.length > 0 && (
          <dl className="rounded-2xl border border-border bg-card/70 p-5 text-[14px] lg:p-6">
            <dt className="mb-1 text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Virksomhedsoplysninger</dt>
            {details.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 border-t border-border py-2.5 first:border-t-0">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="text-right text-foreground">{value}</dd>
              </div>
            ))}
          </dl>
        )}
        <div className="rounded-2xl border border-border bg-card/70 p-5 lg:p-6">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Klager</h2>
          <p className="mt-2 text-pretty text-[15px] leading-relaxed text-foreground/80">
            Klager over os kan du sende til {COMPANY.email}. Kan vi ikke løse den sammen, kan du som forbruger klage til{' '}
            <a href="https://naevneneshus.dk" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary-glow underline underline-offset-2">Nævnenes Hus</a>.
          </p>
        </div>
      </div>
    </LegalPage>
  )
}
