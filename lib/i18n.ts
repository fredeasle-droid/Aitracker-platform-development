import { da as daMessages, type MessageKey } from './messages/da'
import { en as enMessages } from './messages/en'
import { sv as svMessages } from './messages/sv'
import { no as noMessages } from './messages/no'
import { de as deMessages } from './messages/de'
import { dataMessages } from './data-messages'

export type Locale = 'da' | 'en' | 'sv' | 'no' | 'de'

export const DEFAULT_LOCALE: Locale = 'da'
export const LOCALE_COOKIE = 'bettracker_locale'

export const LOCALES: Record<Locale, { label: string; flag: string; countryCode: string; tag: string }> = {
  da: { label: 'Dansk', flag: '🇩🇰', countryCode: 'DK', tag: 'da-DK' },
  en: { label: 'English', flag: '🇬🇧', countryCode: 'GB', tag: 'en-GB' },
  sv: { label: 'Svenska', flag: '🇸🇪', countryCode: 'SE', tag: 'sv-SE' },
  no: { label: 'Norsk', flag: '🇳🇴', countryCode: 'NO', tag: 'nb-NO' },
  de: { label: 'Deutsch', flag: '🇩🇪', countryCode: 'DE', tag: 'de-DE' },
}

export function isLocale(value: string | undefined | null): value is Locale {
  return Boolean(value) && Object.prototype.hasOwnProperty.call(LOCALES, value as string)
}

const baseTranslations = {
  en: {
    login: 'Log in', loggedIn: 'Logged in', home: 'Sure Bets', live: 'Live scanning', stats: 'Stats', calc: 'Calculate', bonus: 'Bonus', myPage: 'My page', signup: 'Sign up', games: 'My bets',
    all: 'All', football: 'Football', basketball: 'Basketball', tennis: 'Tennis', hockey: 'Ice hockey', esports: 'Esports', handball: 'Handball', favorites: 'Favourites', more: 'More',
    sport: 'Sport', leagues: 'Leagues', moreLeagues: 'More leagues', premium: 'Premium', premiumText: 'Get access to more features and exclusive sure bets.', upgrade: 'Upgrade now', createAccount: 'Create free account', accountText: 'Get full access to all odds and features.', create: 'Create account',
    bookmakers: 'Bookmakers', bookmakersFilter: 'Bookmakers', allBookmakers: 'All bookmakers', sortBookmaker: 'Bookmaker A-Z', clearBookmakers: 'Clear selected',
    leaguesFilter: 'Leagues', allLeagues: 'All leagues', minMargin: 'Min. margin', allMargins: 'All margins', atLeast: 'At least', markets: 'All markets', market: 'Market', sorting: 'Sort by', newest: 'Newest first', highest: 'Highest margin', kickoff: 'Starting soon', found: 'sure bets found', noMatches: 'No sure bets match', tryAgain: 'Try a lower minimum margin or another sport.', reset: 'Reset filters',
    locked: 'Locked', marketLocked: 'Market locked', createToSeeOdds: 'Create a free account to see the odds', createToSeeOddsFrom: 'Create a free account to see the odds from', bothCovered: 'Both possible outcomes are covered', twoOutcomes: '2 outcomes', details: 'View details', removeFav: 'Remove from favourites', addFav: 'Add to favourites', calcStake: 'Calculate stake', marginLabel: 'MARGIN',
    overview: 'Overview', scanText: 'We constantly scan for new opportunities across 2,000+ bookmakers.', sportBranches: 'Sports', foundToday: 'Opportunities found today', exampleTitle: 'Sure bet example', potentialProfit: 'Potential profit:', profitHelp: 'Profit with the correct stake split', latestFinds: 'Latest finds',
    unlockPremium: 'Unlock with Premium', becomeCustomer: 'Become a customer to see the odds', unlock: 'Unlock', notifications: 'Notifications', newCount: 'new', highMarginNow: 'High margin right now', noAlerts: 'No sure bets above 4% right now.',
  },
  da: {
    login: 'Log ind', loggedIn: 'Logget ind', home: 'SikkerBets', live: 'Live scanning', stats: 'Stats', calc: 'Beregn', bonus: 'Bonus', myPage: 'Min side', signup: 'Opret bruger', games: 'Mine spil',
    all: 'Alle', football: 'Fodbold', basketball: 'Basketball', tennis: 'Tennis', hockey: 'Ishockey', esports: 'Esport', handball: 'Håndbold', favorites: 'Favoritter', more: 'Flere',
    sport: 'Sport', leagues: 'Ligaer', moreLeagues: 'Flere ligaer', premium: 'Premium', premiumText: 'Få adgang til flere funktioner og eksklusive SikkerBets.', upgrade: 'Opgrader nu', createAccount: 'Opret gratis konto', accountText: 'Få fuld adgang til alle odds og funktioner.', create: 'Opret konto',
    bookmakers: 'Bookmakere', bookmakersFilter: 'Bookmakere', allBookmakers: 'Alle bookmakere', sortBookmaker: 'Bookmaker A-Å', clearBookmakers: 'Ryd valgte',
    leaguesFilter: 'Ligaer', allLeagues: 'Alle ligaer', minMargin: 'Min. margin', allMargins: 'Alle margins', atLeast: 'Mindst', markets: 'Alle markeder', market: 'Marked', sorting: 'Sortering', newest: 'Nyeste først', highest: 'Højeste margin', kickoff: 'Starter snart', found: 'SikkerBets fundet', noMatches: 'Ingen SikkerBets matcher', tryAgain: 'Prøv en lavere minimum margin eller en anden sportsgren.', reset: 'Nulstil filtre',
    locked: 'Låst', marketLocked: 'Marked låst', createToSeeOdds: 'Opret gratis konto for at se oddsene', createToSeeOddsFrom: 'Opret gratis konto for at se oddsene fra', bothCovered: 'Begge mulige udfald er dækket', twoOutcomes: '2 udfald', details: 'Se detaljer', removeFav: 'Fjern fra favoritter', addFav: 'Tilføj til favoritter', calcStake: 'Beregn indsats', marginLabel: 'MARGIN',
    overview: 'Overblik', scanText: 'Vi scanner konstant efter nye muligheder hos 2.000+ bookmakere.', sportBranches: 'Sportsgrene', foundToday: 'Fundne muligheder i dag', exampleTitle: 'Eksempel på sikkerbet', potentialProfit: 'Potentiel profit:', profitHelp: 'Profit ved korrekt indsatsfordeling', latestFinds: 'Seneste fund',
    unlockPremium: 'Lås op med Premium', becomeCustomer: 'Bliv kunde for at se oddsene', unlock: 'Lås op', notifications: 'Notifikationer', newCount: 'nye', highMarginNow: 'Høj margin lige nu', noAlerts: 'Ingen SikkerBets over 4% lige nu.',
  },
  sv: {
    login: 'Logga in', loggedIn: 'Inloggad', home: 'Säkra spel', live: 'Liveskanning', stats: 'Statistik', calc: 'Beräkna', bonus: 'Bonus', myPage: 'Min sida', signup: 'Skapa konto', games: 'Mina spel',
    all: 'Alla', football: 'Fotboll', basketball: 'Basket', tennis: 'Tennis', hockey: 'Ishockey', esports: 'E-sport', handball: 'Handboll', favorites: 'Favoriter', more: 'Fler',
    sport: 'Sport', leagues: 'Ligorna', moreLeagues: 'Fler ligor', premium: 'Premium', premiumText: 'Få tillgång till fler funktioner och exklusiva säkra spel.', upgrade: 'Uppgradera nu', createAccount: 'Skapa gratis konto', accountText: 'Få full tillgång till alla odds och funktioner.', create: 'Skapa konto',
    bookmakers: 'Spelbolag', bookmakersFilter: 'Spelbolag', allBookmakers: 'Alla spelbolag', sortBookmaker: 'Spelbolag A-Ö', clearBookmakers: 'Rensa valda',
    leaguesFilter: 'Ligor', allLeagues: 'Alla ligor', minMargin: 'Min. marginal', allMargins: 'Alla marginaler', atLeast: 'Minst', markets: 'Alla marknader', market: 'Marknad', sorting: 'Sortering', newest: 'Nyaste först', highest: 'Högsta marginal', kickoff: 'Startar snart', found: 'säkra spel hittade', noMatches: 'Inga säkra spel matchar', tryAgain: 'Prova en lägre minimimarginal eller en annan sport.', reset: 'Återställ filter',
    locked: 'Låst', marketLocked: 'Marknad låst', createToSeeOdds: 'Skapa gratis konto för att se oddsen', createToSeeOddsFrom: 'Skapa gratis konto för att se oddsen från', bothCovered: 'Båda möjliga utfall är täckta', twoOutcomes: '2 utfall', details: 'Se detaljer', removeFav: 'Ta bort från favoriter', addFav: 'Lägg till i favoriter', calcStake: 'Beräkna insats', marginLabel: 'MARGINAL',
    overview: 'Översikt', scanText: 'Vi skannar ständigt efter nya möjligheter hos 2 000+ spelbolag.', sportBranches: 'Sportgrenar', foundToday: 'Hittade möjligheter idag', exampleTitle: 'Exempel på säkert spel', potentialProfit: 'Potentiell vinst:', profitHelp: 'Vinst vid korrekt insatsfördelning', latestFinds: 'Senaste fynd',
    unlockPremium: 'Lås upp med Premium', becomeCustomer: 'Bli kund för att se oddsen', unlock: 'Lås upp', notifications: 'Notiser', newCount: 'nya', highMarginNow: 'Hög marginal just nu', noAlerts: 'Inga säkra spel över 4 % just nu.',
  },
  no: {
    login: 'Logg inn', loggedIn: 'Innlogget', home: 'Sikre spill', live: 'Live-skanning', stats: 'Statistikk', calc: 'Beregn', bonus: 'Bonus', myPage: 'Min side', signup: 'Opprett bruker', games: 'Mine spill',
    all: 'Alle', football: 'Fotball', basketball: 'Basketball', tennis: 'Tennis', hockey: 'Ishockey', esports: 'E-sport', handball: 'Håndball', favorites: 'Favoritter', more: 'Flere',
    sport: 'Sport', leagues: 'Ligaer', moreLeagues: 'Flere ligaer', premium: 'Premium', premiumText: 'Få tilgang til flere funksjoner og eksklusive sikre spill.', upgrade: 'Oppgrader nå', createAccount: 'Opprett gratis konto', accountText: 'Få full tilgang til alle odds og funksjoner.', create: 'Opprett konto',
    bookmakers: 'Bookmakere', bookmakersFilter: 'Bookmakere', allBookmakers: 'Alle bookmakere', sortBookmaker: 'Bookmaker A-Å', clearBookmakers: 'Fjern valgte',
    leaguesFilter: 'Ligaer', allLeagues: 'Alle ligaer', minMargin: 'Min. margin', allMargins: 'Alle marginer', atLeast: 'Minst', markets: 'Alle markeder', market: 'Marked', sorting: 'Sortering', newest: 'Nyeste først', highest: 'Høyeste margin', kickoff: 'Starter snart', found: 'sikre spill funnet', noMatches: 'Ingen sikre spill matcher', tryAgain: 'Prøv en lavere minimumsmargin eller en annen sport.', reset: 'Nullstill filtre',
    locked: 'Låst', marketLocked: 'Marked låst', createToSeeOdds: 'Opprett gratis konto for å se oddsen', createToSeeOddsFrom: 'Opprett gratis konto for å se oddsen fra', bothCovered: 'Begge mulige utfall er dekket', twoOutcomes: '2 utfall', details: 'Se detaljer', removeFav: 'Fjern fra favoritter', addFav: 'Legg til i favoritter', calcStake: 'Beregn innsats', marginLabel: 'MARGIN',
    overview: 'Oversikt', scanText: 'Vi skanner hele tiden etter nye muligheter hos 2 000+ bookmakere.', sportBranches: 'Sportsgrener', foundToday: 'Funnede muligheter i dag', exampleTitle: 'Eksempel på sikkert spill', potentialProfit: 'Potensiell profitt:', profitHelp: 'Profitt ved riktig innsatsfordeling', latestFinds: 'Siste funn',
    unlockPremium: 'Lås opp med Premium', becomeCustomer: 'Bli kunde for å se oddsen', unlock: 'Lås opp', notifications: 'Varsler', newCount: 'nye', highMarginNow: 'Høy margin akkurat nå', noAlerts: 'Ingen sikre spill over 4 % akkurat nå.',
  },
  de: {
    login: 'Anmelden', loggedIn: 'Angemeldet', home: 'Sichere Wetten', live: 'Live-Scan', stats: 'Statistiken', calc: 'Rechner', bonus: 'Bonus', myPage: 'Mein Konto', signup: 'Registrieren', games: 'Meine Spiele',
    all: 'Alle', football: 'Fußball', basketball: 'Basketball', tennis: 'Tennis', hockey: 'Eishockey', esports: 'E-Sport', handball: 'Handball', favorites: 'Favoriten', more: 'Mehr',
    sport: 'Sport', leagues: 'Ligen', moreLeagues: 'Weitere Ligen', premium: 'Premium', premiumText: 'Erhalte Zugang zu weiteren Funktionen und exklusiven sicheren Wetten.', upgrade: 'Jetzt upgraden', createAccount: 'Kostenloses Konto erstellen', accountText: 'Erhalte vollen Zugriff auf alle Quoten und Funktionen.', create: 'Konto erstellen',
    bookmakers: 'Buchmacher', bookmakersFilter: 'Buchmacher', allBookmakers: 'Alle Buchmacher', sortBookmaker: 'Buchmacher A-Z', clearBookmakers: 'Auswahl löschen',
    leaguesFilter: 'Ligen', allLeagues: 'Alle Ligen', minMargin: 'Min. Marge', allMargins: 'Alle Margen', atLeast: 'Mindestens', markets: 'Alle Märkte', market: 'Markt', sorting: 'Sortierung', newest: 'Neueste zuerst', highest: 'Höchste Marge', kickoff: 'Beginnt bald', found: 'sichere Wetten gefunden', noMatches: 'Keine sicheren Wetten gefunden', tryAgain: 'Versuche eine niedrigere Mindestmarge oder eine andere Sportart.', reset: 'Filter zurücksetzen',
    locked: 'Gesperrt', marketLocked: 'Markt gesperrt', createToSeeOdds: 'Kostenloses Konto erstellen, um die Quoten zu sehen', createToSeeOddsFrom: 'Kostenloses Konto erstellen, um die Quoten zu sehen von', bothCovered: 'Beide möglichen Ausgänge sind abgedeckt', twoOutcomes: '2 Ausgänge', details: 'Details ansehen', removeFav: 'Aus Favoriten entfernen', addFav: 'Zu Favoriten hinzufügen', calcStake: 'Einsatz berechnen', marginLabel: 'MARGE',
    overview: 'Überblick', scanText: 'Wir scannen ständig nach neuen Chancen bei über 2.000 Buchmachern.', sportBranches: 'Sportarten', foundToday: 'Gefundene Chancen heute', exampleTitle: 'Beispiel für eine sichere Wette', potentialProfit: 'Möglicher Gewinn:', profitHelp: 'Gewinn bei korrekter Einsatzverteilung', latestFinds: 'Neueste Funde',
    unlockPremium: 'Mit Premium freischalten', becomeCustomer: 'Werde Kunde, um die Quoten zu sehen', unlock: 'Freischalten', notifications: 'Benachrichtigungen', newCount: 'neu', highMarginNow: 'Hohe Marge gerade jetzt', noAlerts: 'Derzeit keine sicheren Wetten über 4 %.',
  },
} as const

type BaseKey = keyof typeof baseTranslations.da
export type TranslationKey = BaseKey | MessageKey

export const translations: Record<Locale, Record<TranslationKey, string>> = {
  da: { ...baseTranslations.da, ...daMessages },
  en: { ...baseTranslations.en, ...enMessages },
  sv: { ...baseTranslations.sv, ...svMessages },
  no: { ...baseTranslations.no, ...noMessages },
  de: { ...baseTranslations.de, ...deMessages },
}

export type TranslateVars = Record<string, string | number>

export function makeTranslator(locale: Locale) {
  const table = translations[locale]
  const extra = locale === 'da' ? null : dataMessages[locale]

  function t(key: TranslationKey, vars?: TranslateVars) {
    const template = table[key]
    if (!vars) return template
    return template.replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match))
  }

  // Translates Danish source strings that come from data (bonus offers, server messages, plan features).
  function tx(source: string) {
    return extra?.[source] ?? source
  }

  return { locale, t, tx }
}

export type Translator = ReturnType<typeof makeTranslator>
