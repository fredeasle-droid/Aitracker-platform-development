export type Locale = 'da' | 'sv' | 'no' | 'de'

export const LOCALES: Record<Locale, { label: string; flag: string; countryCode: string }> = {
  da: { label: 'Danmark', flag: '🇩🇰', countryCode: 'DK' },
  sv: { label: 'Sverige', flag: '🇸🇪', countryCode: 'SE' },
  no: { label: 'Norge', flag: '🇳🇴', countryCode: 'NO' },
  de: { label: 'Tyskland', flag: '🇩🇪', countryCode: 'DE' },
}

export const translations = {
  da: {
    login: 'Log ind', loggedIn: 'Logget ind', home: 'SikkerBets', live: 'Live scanning', stats: 'Stats', bonus: 'Bonus', games: 'Mine spil',
    all: 'Alle', football: 'Fodbold', basketball: 'Basketball', tennis: 'Tennis', hockey: 'Ishockey', esports: 'Esport', handball: 'Håndbold', favorites: 'Favoritter', more: 'Flere',
    sport: 'Sport', leagues: 'Ligaer', moreLeagues: 'Flere ligaer', premium: 'Premium', premiumText: 'Få adgang til flere funktioner og eksklusive SikkerBets.', upgrade: 'Opgrader nu', createAccount: 'Opret gratis konto', accountText: 'Få fuld adgang til alle odds og funktioner.', create: 'Opret konto',
    leaguesFilter: 'Ligaer', allLeagues: 'Alle ligaer', minMargin: 'Min. margin', allMargins: 'Alle margins', atLeast: 'Mindst', markets: 'Alle markeder', market: 'Marked', sorting: 'Sortering', newest: 'Nyeste først', highest: 'Højeste margin', kickoff: 'Starter snart', found: 'SikkerBets fundet', noMatches: 'Ingen SikkerBets matcher', tryAgain: 'Prøv en lavere minimum margin eller en anden sportsgren.', reset: 'Nulstil filtre',
  },
  sv: {
    login: 'Logga in', loggedIn: 'Inloggad', home: 'Säkra spel', live: 'Liveskanning', stats: 'Statistik', bonus: 'Bonus', games: 'Mina spel',
    all: 'Alla', football: 'Fotboll', basketball: 'Basket', tennis: 'Tennis', hockey: 'Ishockey', esports: 'E-sport', handball: 'Handboll', favorites: 'Favoriter', more: 'Fler',
    sport: 'Sport', leagues: 'Ligorna', moreLeagues: 'Fler ligor', premium: 'Premium', premiumText: 'Få tillgång till fler funktioner och exklusiva säkra spel.', upgrade: 'Uppgradera nu', createAccount: 'Skapa gratis konto', accountText: 'Få full tillgång till alla odds och funktioner.', create: 'Skapa konto',
    leaguesFilter: 'Ligor', allLeagues: 'Alla ligor', minMargin: 'Min. marginal', allMargins: 'Alla marginaler', atLeast: 'Minst', markets: 'Alla marknader', market: 'Marknad', sorting: 'Sortering', newest: 'Nyaste först', highest: 'Högsta marginal', kickoff: 'Startar snart', found: 'säkra spel hittade', noMatches: 'Inga säkra spel matchar', tryAgain: 'Prova en lägre minimimarginal eller en annan sport.', reset: 'Återställ filter',
  },
  no: {
    login: 'Logg inn', loggedIn: 'Innlogget', home: 'Sikre spill', live: 'Live-skanning', stats: 'Statistikk', bonus: 'Bonus', games: 'Mine spill',
    all: 'Alle', football: 'Fotball', basketball: 'Basketball', tennis: 'Tennis', hockey: 'Ishockey', esports: 'E-sport', handball: 'Håndball', favorites: 'Favoritter', more: 'Flere',
    sport: 'Sport', leagues: 'Ligaer', moreLeagues: 'Flere ligaer', premium: 'Premium', premiumText: 'Få tilgang til flere funksjoner og eksklusive sikre spill.', upgrade: 'Oppgrader nå', createAccount: 'Opprett gratis konto', accountText: 'Få full tilgang til alle odds og funksjoner.', create: 'Opprett konto',
    leaguesFilter: 'Ligaer', allLeagues: 'Alle ligaer', minMargin: 'Min. margin', allMargins: 'Alle marginer', atLeast: 'Minst', markets: 'Alle markeder', market: 'Marked', sorting: 'Sortering', newest: 'Nyeste først', highest: 'Høyeste margin', kickoff: 'Starter snart', found: 'sikre spill funnet', noMatches: 'Ingen sikre spill matcher', tryAgain: 'Prøv en lavere minimumsmargin eller en annen sport.', reset: 'Nullstill filtre',
  },
  de: {
    login: 'Anmelden', loggedIn: 'Angemeldet', home: 'Sichere Wetten', live: 'Live-Scan', stats: 'Statistiken', bonus: 'Bonus', games: 'Meine Spiele',
    all: 'Alle', football: 'Fußball', basketball: 'Basketball', tennis: 'Tennis', hockey: 'Eishockey', esports: 'E-Sport', handball: 'Handball', favorites: 'Favoriten', more: 'Mehr',
    sport: 'Sport', leagues: 'Ligen', moreLeagues: 'Weitere Ligen', premium: 'Premium', premiumText: 'Erhalte Zugang zu weiteren Funktionen und exklusiven sicheren Wetten.', upgrade: 'Jetzt upgraden', createAccount: 'Kostenloses Konto erstellen', accountText: 'Erhalte vollen Zugriff auf alle Quoten und Funktionen.', create: 'Konto erstellen',
    leaguesFilter: 'Ligen', allLeagues: 'Alle Ligen', minMargin: 'Min. Marge', allMargins: 'Alle Margen', atLeast: 'Mindestens', markets: 'Alle Märkte', market: 'Markt', sorting: 'Sortierung', newest: 'Neueste zuerst', highest: 'Höchste Marge', kickoff: 'Beginnt bald', found: 'sichere Wetten gefunden', noMatches: 'Keine sicheren Wetten gefunden', tryAgain: 'Versuche eine niedrigere Mindestmarge oder eine andere Sportart.', reset: 'Filter zurücksetzen',
  },
} as const

export type TranslationKey = keyof typeof translations.da
