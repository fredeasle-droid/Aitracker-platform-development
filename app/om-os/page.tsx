import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { YoutubeFacade } from '@/components/seo/youtube-facade'
import { SITE_NAME, SITE_URL } from '@/lib/site'
import { getServerT, getServerLocale } from '@/lib/locale-server'
import { localePath } from '@/lib/i18n'
import { videoObjectJsonLd } from '@/lib/video'

export const metadata: Metadata = {
  title: 'Om BetTrackerAI – hvem står bag surebet-scanneren',
  description:
    'Læs hvem der står bag BetTrackerAI, hvordan vi finder surebets hos danske bookmakere, og hvordan vi skriver og opdaterer vores guides.',
  alternates: { canonical: '/om-os' },
  openGraph: { url: '/om-os', type: 'website' },
}

const JSON_LD = JSON.stringify([
  videoObjectJsonLd(),
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
    legalName: 'ODDSLOGIC LTD',
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    description: 'Dansk surebet-scanner, der finder odds hos bookmakere, hvor du vinder uanset udfaldet.',
    areaServed: 'DK',
    founder: {
      '@type': 'Person',
      name: 'Frederik Myllerup Asler',
      url: `${SITE_URL}/om-os`,
      image: `${SITE_URL}/home/pricing-host.webp`,
      jobTitle: 'Stifter og ejer',
    },
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
      'BetTrackerAI er grundlagt og ejet af Frederik Myllerup Asler, som står bag udviklingen af scanneren og har det redaktionelle ansvar for sidens guides. Tjenesten drives af selskabet ODDSLOGIC LTD.',
      'Det er også Frederik, du møder i videoen på forsiden og på billederne rundt omkring på siden.',
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

export default async function AboutPage() {
  const locale = await getServerLocale()
  const { tx } = await getServerT()

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

      <figure className="mt-8 overflow-hidden rounded-2xl border border-border">
        <Image
          src="/home/pricing-host.webp"
          alt="Frederik Myllerup Asler, stifter af BetTrackerAI, foran BetTrackerAI-scanneren"
          width={1600}
          height={893}
          priority
          className="h-auto w-full"
        />
        <figcaption className="px-4 py-3 text-[14px] text-muted-foreground">
          Frederik Myllerup Asler, stifter og ejer af BetTrackerAI
        </figcaption>
      </figure>

      <section className="mt-10">
        <h2 className="text-[22px] font-bold text-foreground">Se hvad BetTrackerAI gør</h2>
        <p className="mt-3 text-pretty text-[16px] leading-relaxed text-foreground/85">
          I videoen forklarer Frederik, hvad surebets er, og hvordan du bruger scanneren.
        </p>
        <YoutubeFacade className="mt-4" />
      </section>

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
          href={localePath(locale, '/dagens-surebets')}
          className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-[16px] font-bold text-primary-foreground transition-opacity hover:opacity-90"
        >
          {tx('Dagens surebets')}
          <ArrowRight className="size-5" aria-hidden="true" />
        </Link>
        <Link
          href={localePath(locale, '/kontakt')}
          className="flex min-h-14 flex-1 items-center justify-center rounded-2xl border border-border bg-card/60 px-5 text-[16px] font-bold text-foreground transition-colors hover:border-primary/60"
        >
          {tx('Kontakt os')}
        </Link>
      </div>
    </main>
  )
}
