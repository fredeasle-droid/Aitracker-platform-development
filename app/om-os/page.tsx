import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SITE_NAME, SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Om BetTrackerAI – hvem står bag surebet-scanneren',
  description:
    'Læs hvem der står bag BetTrackerAI, hvordan vi finder surebets hos danske bookmakere, og hvordan vi skriver og opdaterer vores guides.',
  alternates: { canonical: '/om-os' },
  openGraph: { url: '/om-os', type: 'website' },
}

const JSON_LD = JSON.stringify([
  {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Om BetTrackerAI',
    url: `${SITE_URL}/om-os`,
    inLanguage: 'da-DK',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    description: 'Dansk surebet-scanner, der finder odds hos bookmakere, hvor du vinder uanset udfaldet.',
    areaServed: 'DK',
    founder: { '@type': 'Person', name: 'Frederik Myllerup Asler', url: `${SITE_URL}/om-os` },
    contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', url: `${SITE_URL}/kontakt`, availableLanguage: ['da'] },
  },
])

const SECTIONS = [
  {
    title: 'Hvem vi er',
    body: [
      'BetTrackerAI er en dansk tjeneste, der gør surebets tilgængelige for alle. I stedet for at sidde med regneark og ti faner åbne for at sammenligne odds, får du mulighederne samlet ét sted med den rigtige indsatsfordeling.',
      'Vi fokuserer på det danske marked: danske bookmakere, danske regler og dansk skat.',
    ],
  },
  {
    title: 'Hvem står bag',
    body: [
      'BetTrackerAI er grundlagt og ejet af Frederik Myllerup Asler, som står bag udviklingen af scanneren og har det redaktionelle ansvar for sidens guides.',
    ],
  },
  {
    title: 'Sådan finder vi surebets',
    body: [
      'Vores scanner henter odds fra danske og internationale bookmakere døgnet rundt. Hver gang en odds ændrer sig, beregner vi, om det giver et surebet, og viser det med det samme sammen med den korrekte indsatsfordeling.',
      'Vi viser kun muligheder, hvor alle udfald er dækket på samme marked, og vi markerer, hvor gamle oddsene er, så du kan se, om de stadig er gyldige.',
    ],
  },
  {
    title: 'Sådan skriver vi vores guides',
    body: [
      'Guides skrives af Frederik Myllerup Asler og bygger på vores egne erfaringer, bookmakernes regler og gældende dansk lovgivning. Hver guide har en dato for seneste opdatering, og vi gennemgår dem, når reglerne eller markedet ændrer sig.',
      'Finder du en fejl, så skriv til os, så retter vi den.',
    ],
  },
  {
    title: 'Ansvarligt spil',
    body: [
      'Surebets er matematik, men det er stadig spil. Du skal være fyldt 18 år, og du bør kun bruge penge, du har råd til at miste. Har du brug for hjælp eller en pause, kan du kontakte StopSpillet på 70 22 28 25 eller udelukke dig selv via ROFUS.',
    ],
  },
]

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-6 lg:px-10 lg:pb-24 lg:pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON_LD }} />

      <header>
        <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-primary-glow">Om os</p>
        <h1 className="mt-2 text-balance text-[30px] font-extrabold leading-[1.1] tracking-tight text-foreground lg:text-[42px]">
          Bygget af surebet-spillere, til surebet-spillere
        </h1>
        <p className="mt-5 text-pretty text-[18px] leading-relaxed text-foreground">
          BetTrackerAI scanner bookmakerne for dig og finder odds, hvor du vinder uanset udfaldet. Her kan du læse, hvem vi er, og hvordan vi arbejder.
        </p>
      </header>

      {SECTIONS.map((section) => (
        <section key={section.title} className="mt-10">
          <h2 className="text-[22px] font-bold text-foreground">{section.title}</h2>
          {section.body.map((text) => (
            <p key={text} className="mt-3 text-pretty text-[16px] leading-relaxed text-foreground/85">
              {text}
            </p>
          ))}
        </section>
      ))}

      <div className="mt-12 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/dagens-surebets"
          className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-[16px] font-bold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Se dagens surebets
          <ArrowRight className="size-5" aria-hidden="true" />
        </Link>
        <Link
          href="/kontakt"
          className="flex min-h-14 flex-1 items-center justify-center rounded-2xl border border-border bg-card/60 px-5 text-[16px] font-bold text-foreground transition-colors hover:border-primary/60"
        >
          Kontakt os
        </Link>
      </div>
    </main>
  )
}
