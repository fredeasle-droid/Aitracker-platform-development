import type { Metadata } from 'next'
import Link from 'next/link'
import { HeartHandshake, Mail, MessageCircleQuestion, Send } from 'lucide-react'
import { RESPONSIBLE } from '@/components/home/data'
import { LegalPage } from '@/components/legal/legal-page'
import { COMPANY } from '@/lib/legal'

export const metadata: Metadata = {
  title: 'Kontakt os – BetTrackerAI',
  description: 'Kontakt BetTrackerAI support på e-mail, via Telegram eller i supportchatten på forsiden.',
}

const cardCls = 'flex flex-col gap-3 rounded-2xl border border-border bg-card/60 p-5 lg:p-6'
const iconCls = 'flex size-11 items-center justify-center rounded-xl border border-primary/40 bg-primary/15 text-primary-glow'
const linkCls = 'inline-flex min-h-11 items-center font-semibold text-primary-glow underline underline-offset-2 hover:text-foreground'

export default function ContactPage() {
  const details = [
    ['Virksomhed', COMPANY.legalName],
    ['CVR-nr.', COMPANY.cvr],
    ['Adresse', COMPANY.address],
  ].filter((row): row is [string, string] => Boolean(row[1]))

  return (
    <LegalPage
      eyebrow="Support"
      title="Kontakt os"
      intro="Har du et spørgsmål om dit abonnement, en fejl eller dine data? Vælg den vej, der passer dig bedst."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <section className={cardCls} aria-labelledby="mail-heading">
          <span className={iconCls}>
            <Mail className="size-5" aria-hidden="true" />
          </span>
          <h2 id="mail-heading" className="text-[18px] font-bold text-foreground">E-mail</h2>
          <p className="text-[15px] leading-relaxed text-foreground/80">
            Skriv til os om abonnement, betaling, fortrydelse, rettelse af e-mail eller sletning af data. Skriv gerne, hvilken e-mail din konto er oprettet med.
          </p>
          <a href={`mailto:${COMPANY.email}`} className={linkCls}>{COMPANY.email}</a>
        </section>

        <section className={cardCls} aria-labelledby="chat-heading">
          <span className={iconCls}>
            <MessageCircleQuestion className="size-5" aria-hidden="true" />
          </span>
          <h2 id="chat-heading" className="text-[18px] font-bold text-foreground">Supportchat og FAQ</h2>
          <p className="text-[15px] leading-relaxed text-foreground/80">
            Få hurtigt svar på de mest almindelige spørgsmål i vores FAQ eller i supportchatten på forsiden.
          </p>
          <div className="flex flex-wrap gap-x-5">
            <Link href="/faq" className={linkCls}>Se FAQ</Link>
            <Link href="/#faq" className={linkCls}>Åbn supportchat</Link>
          </div>
        </section>

        <section className={cardCls} aria-labelledby="telegram-heading">
          <span className={iconCls}>
            <Send className="size-5" aria-hidden="true" />
          </span>
          <h2 id="telegram-heading" className="text-[18px] font-bold text-foreground">Telegram</h2>
          <p className="text-[15px] leading-relaxed text-foreground/80">
            Følg vores kanal for nyheder og opdateringer fra 365-dages challengen.
          </p>
          <Link href="/telegram" className={linkCls}>Gå til Telegram</Link>
        </section>

        <section className={cardCls} aria-labelledby="help-heading">
          <span className={iconCls}>
            <HeartHandshake className="size-5" aria-hidden="true" />
          </span>
          <h2 id="help-heading" className="text-[18px] font-bold text-foreground">Brug for hjælp med spil?</h2>
          <p className="text-[15px] leading-relaxed text-foreground/80">
            Er spil ved at blive et problem, kan du få fortrolig og gratis hjælp hos StopSpillet, eller udelukke dig selv via ROFUS.
          </p>
          <div className="flex flex-wrap gap-x-5">
            <a href={`tel:${RESPONSIBLE.stopSpilletPhone.replace(/\s/g, '')}`} className={linkCls}>{RESPONSIBLE.stopSpilletPhone}</a>
            <a href={RESPONSIBLE.rofusUrl} target="_blank" rel="noopener noreferrer" className={linkCls}>ROFUS.nu</a>
          </div>
        </section>
      </div>

      {details.length > 0 && (
        <dl className="mt-6 rounded-2xl border border-border bg-card/60 p-5 text-[14px] lg:max-w-xl">
          {details.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 border-t border-border py-2 first:border-t-0">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="text-right text-foreground">{value}</dd>
            </div>
          ))}
        </dl>
      )}

      <p className="mt-6 text-[14px] leading-relaxed text-muted-foreground lg:max-w-2xl">
        Klager over os kan du også sende til {COMPANY.email}. Kan vi ikke løse den sammen, kan du som forbruger klage til{' '}
        <a href="https://naevneneshus.dk" target="_blank" rel="noopener noreferrer" className="text-primary-glow underline underline-offset-2">Nævnenes Hus</a>.
      </p>
    </LegalPage>
  )
}
