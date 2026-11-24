import type { Locale } from '@/lib/i18n'

export type SeoStrings = {
  home: string
  breadcrumb: string
  surebets: string
  guides: string
  minRead: (minutes: number) => string
  updated: string
  by: string
  readAlso: string
  watchVideo: string
  faq: string
  relatedGuides: string
  moreOf: (label: string) => string
  seeCurrent: string
  todays: string
  sportsLabel: string
  bookmakersLabel: string
  crossSports: string
  crossBookmakers: string
  findOnSport: string
  surebetsAtBookmakers: string
  guideIndexTitle: string
  guideIndexDescription: string
  guideIndexH1: string
  guideIndexLead: string
  guideIndexName: string
  readGuide: string
  categories: Record<'Grundlæggende' | 'Strategi' | 'Regler', string>
}

export const SEO_STRINGS: Record<Locale, SeoStrings> = {
  da: {
    home: 'Forside',
    breadcrumb: 'Brødkrumme',
    surebets: 'Surebets',
    guides: 'Guides',
    minRead: (m) => `${m} min. læsning`,
    updated: 'Opdateret',
    by: 'Af',
    readAlso: 'Læs også',
    watchVideo: 'Se videoen: surebets forklaret på under 3 minutter',
    faq: 'Ofte stillede spørgsmål',
    relatedGuides: 'Relaterede guides',
    moreOf: (label) => `Flere ${label.toLowerCase()}`,
    seeCurrent: 'Se aktuelle surebets',
    todays: 'Dagens surebets',
    sportsLabel: 'Sportsgrene',
    bookmakersLabel: 'Bookmakere',
    crossSports: 'Surebets pr. sportsgren',
    crossBookmakers: 'Surebets pr. bookmaker',
    findOnSport: 'Find surebets på din sport',
    surebetsAtBookmakers: 'Surebets hos bookmakerne',
    guideIndexTitle: 'Guides til surebets og arbitrage betting – BetTrackerAI',
    guideIndexDescription: 'Lær surebets fra bunden: hvad det er, hvordan du beregner indsatsen, regler og skat i Danmark, og hvordan du undgår at blive begrænset.',
    guideIndexH1: 'Alt du skal vide om surebets',
    guideIndexLead: 'Korte, konkrete guides skrevet til danske spillere. Fra den første beregning til at holde dine konti åbne.',
    guideIndexName: 'Guides til surebets',
    readGuide: 'Læs guiden',
    categories: { Grundlæggende: 'Grundlæggende', Strategi: 'Strategi', Regler: 'Regler' },
  },
  en: {
    home: 'Home',
    breadcrumb: 'Breadcrumb',
    surebets: 'Sure bets',
    guides: 'Guides',
    minRead: (m) => `${m} min read`,
    updated: 'Updated',
    by: 'By',
    readAlso: 'Read next',
    watchVideo: 'Watch the video: sure bets explained in under 3 minutes',
    faq: 'Frequently asked questions',
    relatedGuides: 'Related guides',
    moreOf: (label) => `More ${label.toLowerCase()}`,
    seeCurrent: 'See current sure bets',
    todays: "Today's sure bets",
    sportsLabel: 'Sports',
    bookmakersLabel: 'Bookmakers',
    crossSports: 'Sure bets by sport',
    crossBookmakers: 'Sure bets by bookmaker',
    findOnSport: 'Find sure bets on your sport',
    surebetsAtBookmakers: 'Sure bets at the bookmakers',
    guideIndexTitle: 'Sure bet and arbitrage betting guides – BetTrackerAI',
    guideIndexDescription: 'Learn sure bets from scratch: what they are, how to calculate your stakes, the rules and tax in Denmark, and how to avoid getting limited.',
    guideIndexH1: 'Everything you need to know about sure bets',
    guideIndexLead: 'Short, practical guides written for Danish bettors. From your first calculation to keeping your accounts open.',
    guideIndexName: 'Sure bet guides',
    readGuide: 'Read the guide',
    categories: { Grundlæggende: 'Basics', Strategi: 'Strategy', Regler: 'Rules' },
  },
  sv: {
    home: 'Startsida',
    breadcrumb: 'Brödsmulor',
    surebets: 'Surebets',
    guides: 'Guider',
    minRead: (m) => `${m} min läsning`,
    updated: 'Uppdaterad',
    by: 'Av',
    readAlso: 'Läs också',
    watchVideo: 'Se videon: surebets förklarade på under 3 minuter',
    faq: 'Vanliga frågor',
    relatedGuides: 'Relaterade guider',
    moreOf: (label) => `Fler ${label.toLowerCase()}`,
    seeCurrent: 'Se aktuella surebets',
    todays: 'Dagens surebets',
    sportsLabel: 'Sporter',
    bookmakersLabel: 'Bookmakers',
    crossSports: 'Surebets per sport',
    crossBookmakers: 'Surebets per bookmaker',
    findOnSport: 'Hitta surebets i din sport',
    surebetsAtBookmakers: 'Surebets hos bookmakerna',
    guideIndexTitle: 'Guider om surebets och arbitrage betting – BetTrackerAI',
    guideIndexDescription: 'Lär dig surebets från grunden: vad det är, hur du räknar ut insatsen, regler och skatt i Danmark och hur du undviker att bli begränsad.',
    guideIndexH1: 'Allt du behöver veta om surebets',
    guideIndexLead: 'Korta, konkreta guider skrivna för danska spelare. Från din första uträkning till att hålla kontona öppna.',
    guideIndexName: 'Guider om surebets',
    readGuide: 'Läs guiden',
    categories: { Grundlæggende: 'Grunderna', Strategi: 'Strategi', Regler: 'Regler' },
  },
  no: {
    home: 'Forside',
    breadcrumb: 'Brødsmulesti',
    surebets: 'Surebets',
    guides: 'Guider',
    minRead: (m) => `${m} min lesing`,
    updated: 'Oppdatert',
    by: 'Av',
    readAlso: 'Les også',
    watchVideo: 'Se videoen: surebets forklart på under 3 minutter',
    faq: 'Ofte stilte spørsmål',
    relatedGuides: 'Relaterte guider',
    moreOf: (label) => `Flere ${label.toLowerCase()}`,
    seeCurrent: 'Se aktuelle surebets',
    todays: 'Dagens surebets',
    sportsLabel: 'Sportsgrener',
    bookmakersLabel: 'Bookmakere',
    crossSports: 'Surebets per sportsgren',
    crossBookmakers: 'Surebets per bookmaker',
    findOnSport: 'Finn surebets i din sport',
    surebetsAtBookmakers: 'Surebets hos bookmakerne',
    guideIndexTitle: 'Guider om surebets og arbitrage betting – BetTrackerAI',
    guideIndexDescription: 'Lær surebets fra bunnen av: hva det er, hvordan du beregner innsatsen, regler og skatt i Danmark, og hvordan du unngår å bli begrenset.',
    guideIndexH1: 'Alt du trenger å vite om surebets',
    guideIndexLead: 'Korte, konkrete guider skrevet for danske spillere. Fra den første beregningen til å holde kontoene åpne.',
    guideIndexName: 'Guider om surebets',
    readGuide: 'Les guiden',
    categories: { Grundlæggende: 'Grunnleggende', Strategi: 'Strategi', Regler: 'Regler' },
  },
  de: {
    home: 'Startseite',
    breadcrumb: 'Brotkrümelnavigation',
    surebets: 'Surebets',
    guides: 'Ratgeber',
    minRead: (m) => `${m} Min. Lesezeit`,
    updated: 'Aktualisiert',
    by: 'Von',
    readAlso: 'Auch interessant',
    watchVideo: 'Video ansehen: Surebets in unter 3 Minuten erklärt',
    faq: 'Häufige Fragen',
    relatedGuides: 'Weitere Ratgeber',
    moreOf: (label) => `Weitere ${label}`,
    seeCurrent: 'Aktuelle Surebets ansehen',
    todays: 'Surebets des Tages',
    sportsLabel: 'Sportarten',
    bookmakersLabel: 'Buchmacher',
    crossSports: 'Surebets nach Sportart',
    crossBookmakers: 'Surebets nach Buchmacher',
    findOnSport: 'Surebets für deine Sportart finden',
    surebetsAtBookmakers: 'Surebets bei den Buchmachern',
    guideIndexTitle: 'Ratgeber zu Surebets und Arbitrage-Wetten – BetTrackerAI',
    guideIndexDescription: 'Surebets von Grund auf lernen: was sie sind, wie du den Einsatz berechnest, Regeln und Steuern in Dänemark und wie du Limitierungen vermeidest.',
    guideIndexH1: 'Alles, was du über Surebets wissen musst',
    guideIndexLead: 'Kurze, konkrete Ratgeber für dänische Spieler. Von der ersten Berechnung bis dazu, deine Konten offen zu halten.',
    guideIndexName: 'Surebet-Ratgeber',
    readGuide: 'Ratgeber lesen',
    categories: { Grundlæggende: 'Grundlagen', Strategi: 'Strategie', Regler: 'Regeln' },
  },
}
