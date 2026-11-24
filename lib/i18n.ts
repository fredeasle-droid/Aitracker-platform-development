import { da as daMessages, type MessageKey } from './messages/da'
import { en as enMessages } from './messages/en'
import { sv as svMessages } from './messages/sv'
import { no as noMessages } from './messages/no'
import { de as deMessages } from './messages/de'
import { es as esMessages } from './messages/es'
import { br as brMessages } from './messages/br'
import { pt as ptMessages } from './messages/pt'
import { fr as frMessages } from './messages/fr'
import { it as itMessages } from './messages/it'
import { pl as plMessages } from './messages/pl'
import { fi as fiMessages } from './messages/fi'
import { nl as nlMessages } from './messages/nl'
import { dataMessages } from './data-messages'
import { localizeRoute } from './route-slugs'

export type Locale = 'da' | 'en' | 'sv' | 'no' | 'de' | 'es' | 'br' | 'pt' | 'fr' | 'it' | 'pl' | 'fi' | 'nl'

export const DEFAULT_LOCALE: Locale = 'da'
export const LOCALE_COOKIE = 'bettracker_locale'

export const LOCALES: Record<Locale, { label: string; flag: string; countryCode: string; tag: string }> = {
  da: { label: 'Dansk', flag: '🇩🇰', countryCode: 'DK', tag: 'da-DK' },
  en: { label: 'English', flag: '🇬🇧', countryCode: 'GB', tag: 'en-GB' },
  sv: { label: 'Svenska', flag: '🇸🇪', countryCode: 'SE', tag: 'sv-SE' },
  no: { label: 'Norsk', flag: '🇳🇴', countryCode: 'NO', tag: 'nb-NO' },
  de: { label: 'Deutsch', flag: '🇩🇪', countryCode: 'DE', tag: 'de-DE' },
  es: { label: 'Español', flag: '🇪🇸', countryCode: 'ES', tag: 'es-ES' },
  br: { label: 'Português (Brasil)', flag: '🇧🇷', countryCode: 'BR', tag: 'pt-BR' },
  pt: { label: 'Português', flag: '🇵🇹', countryCode: 'PT', tag: 'pt-PT' },
  fr: { label: 'Français', flag: '🇫🇷', countryCode: 'FR', tag: 'fr-FR' },
  it: { label: 'Italiano', flag: '🇮🇹', countryCode: 'IT', tag: 'it-IT' },
  pl: { label: 'Polski', flag: '🇵🇱', countryCode: 'PL', tag: 'pl-PL' },
  fi: { label: 'Suomi', flag: '🇫🇮', countryCode: 'FI', tag: 'fi-FI' },
  nl: { label: 'Nederlands', flag: '🇳🇱', countryCode: 'NL', tag: 'nl-NL' },
}

export function isLocale(value: string | undefined | null): value is Locale {
  return Boolean(value) && Object.prototype.hasOwnProperty.call(LOCALES, value as string)
}

export const LOCALE_HEADER = 'x-bt-locale'

// Danish is served from the root; the other languages live under a URL prefix on the same domain.
export const LOCALE_PREFIX: Record<Locale, string> = { da: '', en: 'en', sv: 'se', no: 'no', de: 'de', es: 'es', br: 'br', pt: 'pt', fr: 'fr', it: 'it', pl: 'pl', fi: 'fi', nl: 'nl' }

export const HREFLANG: Record<Locale, string> = { da: 'da-DK', en: 'en', sv: 'sv-SE', no: 'nb-NO', de: 'de-DE', es: 'es', br: 'pt-BR', pt: 'pt-PT', fr: 'fr-FR', it: 'it-IT', pl: 'pl-PL', fi: 'fi-FI', nl: 'nl-NL' }

export const OG_LOCALE: Record<Locale, string> = { da: 'da_DK', en: 'en_GB', sv: 'sv_SE', no: 'nb_NO', de: 'de_DE', es: 'es_ES', br: 'pt_BR', pt: 'pt_PT', fr: 'fr_FR', it: 'it_IT', pl: 'pl_PL', fi: 'fi_FI', nl: 'nl_NL' }

export function localeFromPrefix(segment: string | undefined): Locale | null {
  if (!segment) return null
  const match = (Object.keys(LOCALE_PREFIX) as Locale[]).find((key) => LOCALE_PREFIX[key] && LOCALE_PREFIX[key] === segment)
  return match ?? null
}

export function stripLocalePrefix(pathname: string): { locale: Locale | null; path: string } {
  const [, first, ...rest] = pathname.split('/')
  const locale = localeFromPrefix(first)
  if (!locale) return { locale: null, path: pathname }
  return { locale, path: `/${rest.join('/')}` }
}

// Takes a canonical (Danish) path and returns the public URL path for the language.
export function localePath(locale: Locale, path: string): string {
  const prefix = LOCALE_PREFIX[locale]
  if (!prefix) return path
  const localized = localizeRoute(locale, path)
  return localized === '/' ? `/${prefix}` : `/${prefix}${localized}`
}

const baseTranslations = {
  en: {
    login: 'Log in', loggedIn: 'Logged in', frontPage: 'Home', home: 'Sure Bets', live: 'Live scanning', stats: 'Stats', calc: 'Calculate', bonus: 'Bonus', myPage: 'My page', signup: 'Sign up', games: 'My bets',
    all: 'All', football: 'Football', basketball: 'Basketball', tennis: 'Tennis', hockey: 'Ice hockey', esports: 'Esports', handball: 'Handball', favorites: 'Favourites', more: 'More',
    sport: 'Sport', leagues: 'Leagues', moreLeagues: 'More leagues', premium: 'Premium', premiumText: 'Get access to more features and exclusive sure bets.', upgrade: 'Upgrade now', createAccount: 'Create free account', accountText: 'Get full access to all odds and features.', create: 'Create account',
    bookmakers: 'Bookmakers', bookmakersFilter: 'Bookmakers', allBookmakers: 'All bookmakers', sortBookmaker: 'Bookmaker A-Z', clearBookmakers: 'Clear selected',
    leaguesFilter: 'Leagues', allLeagues: 'All leagues', minMargin: 'Min. margin', allMargins: 'All margins', atLeast: 'At least', markets: 'All markets', market: 'Market', sorting: 'Sort by', newest: 'Newest first', highest: 'Highest margin', kickoff: 'Starting soon', found: 'sure bets found', noMatches: 'No sure bets match', tryAgain: 'Try a lower minimum margin or another sport.', reset: 'Reset filters',
    locked: 'Locked', marketLocked: 'Market locked', createToSeeOdds: 'Create a free account to see the odds', createToSeeOddsFrom: 'Create a free account to see the odds from', bothCovered: 'Both possible outcomes are covered', twoOutcomes: '2 outcomes', details: 'View details', removeFav: 'Remove from favourites', addFav: 'Add to favourites', calcStake: 'Calculate stake', marginLabel: 'MARGIN',
    overview: 'Overview', scanText: 'We constantly scan for new opportunities across 2,000+ bookmakers.', sportBranches: 'Sports', foundToday: 'Opportunities found today', exampleTitle: 'Sure bet example', potentialProfit: 'Potential profit:', profitHelp: 'Profit with the correct stake split', latestFinds: 'Latest finds',
    unlockPremium: 'Unlock with Premium', becomeCustomer: 'Become a customer to see the odds', unlock: 'Unlock', notifications: 'Notifications', newCount: 'new', highMarginNow: 'High margin right now', noAlerts: 'No sure bets above 4% right now.',
  },
  da: {
    login: 'Log ind', loggedIn: 'Logget ind', frontPage: 'Forside', home: 'Surebets', live: 'Live scanning', stats: 'Stats', calc: 'Beregn', bonus: 'Bonus', myPage: 'Min side', signup: 'Opret bruger', games: 'Min konto',
    all: 'Alle', football: 'Fodbold', basketball: 'Basketball', tennis: 'Tennis', hockey: 'Ishockey', esports: 'Esport', handball: 'Håndbold', favorites: 'Favoritter', more: 'Flere',
    sport: 'Sport', leagues: 'Ligaer', moreLeagues: 'Flere ligaer', premium: 'Premium', premiumText: 'Få adgang til flere funktioner og eksklusive SikkerBets.', upgrade: 'Opgrader nu', createAccount: 'Opret gratis konto', accountText: 'Få fuld adgang til alle odds og funktioner.', create: 'Opret konto',
    bookmakers: 'Bookmakere', bookmakersFilter: 'Bookmakere', allBookmakers: 'Alle bookmakere', sortBookmaker: 'Bookmaker A-Å', clearBookmakers: 'Ryd valgte',
    leaguesFilter: 'Ligaer', allLeagues: 'Alle ligaer', minMargin: 'Min. margin', allMargins: 'Alle margins', atLeast: 'Mindst', markets: 'Alle markeder', market: 'Marked', sorting: 'Sortering', newest: 'Nyeste først', highest: 'Højeste margin', kickoff: 'Starter snart', found: 'SikkerBets fundet', noMatches: 'Ingen SikkerBets matcher', tryAgain: 'Prøv en lavere minimum margin eller en anden sportsgren.', reset: 'Nulstil filtre',
    locked: 'Låst', marketLocked: 'Marked låst', createToSeeOdds: 'Opret gratis konto for at se oddsene', createToSeeOddsFrom: 'Opret gratis konto for at se oddsene fra', bothCovered: 'Begge mulige udfald er dækket', twoOutcomes: '2 udfald', details: 'Se detaljer', removeFav: 'Fjern fra favoritter', addFav: 'Tilføj til favoritter', calcStake: 'Beregn indsats', marginLabel: 'MARGIN',
    overview: 'Overblik', scanText: 'Vi scanner konstant efter nye muligheder hos 2.000+ bookmakere.', sportBranches: 'Sportsgrene', foundToday: 'Fundne muligheder i dag', exampleTitle: 'Eksempel på sikkerbet', potentialProfit: 'Potentiel profit:', profitHelp: 'Profit ved korrekt indsatsfordeling', latestFinds: 'Seneste fund',
    unlockPremium: 'Lås op med Premium', becomeCustomer: 'Bliv kunde for at se oddsene', unlock: 'Lås op', notifications: 'Notifikationer', newCount: 'nye', highMarginNow: 'Høj margin lige nu', noAlerts: 'Ingen SikkerBets over 4% lige nu.',
  },
  sv: {
    login: 'Logga in', loggedIn: 'Inloggad', frontPage: 'Startsida', home: 'Säkra spel', live: 'Liveskanning', stats: 'Statistik', calc: 'Beräkna', bonus: 'Bonus', myPage: 'Min sida', signup: 'Skapa konto', games: 'Mina spel',
    all: 'Alla', football: 'Fotboll', basketball: 'Basket', tennis: 'Tennis', hockey: 'Ishockey', esports: 'E-sport', handball: 'Handboll', favorites: 'Favoriter', more: 'Fler',
    sport: 'Sport', leagues: 'Ligorna', moreLeagues: 'Fler ligor', premium: 'Premium', premiumText: 'Få tillgång till fler funktioner och exklusiva säkra spel.', upgrade: 'Uppgradera nu', createAccount: 'Skapa gratis konto', accountText: 'Få full tillgång till alla odds och funktioner.', create: 'Skapa konto',
    bookmakers: 'Spelbolag', bookmakersFilter: 'Spelbolag', allBookmakers: 'Alla spelbolag', sortBookmaker: 'Spelbolag A-Ö', clearBookmakers: 'Rensa valda',
    leaguesFilter: 'Ligor', allLeagues: 'Alla ligor', minMargin: 'Min. marginal', allMargins: 'Alla marginaler', atLeast: 'Minst', markets: 'Alla marknader', market: 'Marknad', sorting: 'Sortering', newest: 'Nyaste först', highest: 'Högsta marginal', kickoff: 'Startar snart', found: 'säkra spel hittade', noMatches: 'Inga säkra spel matchar', tryAgain: 'Prova en lägre minimimarginal eller en annan sport.', reset: 'Återställ filter',
    locked: 'Låst', marketLocked: 'Marknad låst', createToSeeOdds: 'Skapa gratis konto för att se oddsen', createToSeeOddsFrom: 'Skapa gratis konto för att se oddsen från', bothCovered: 'Båda möjliga utfall är täckta', twoOutcomes: '2 utfall', details: 'Se detaljer', removeFav: 'Ta bort från favoriter', addFav: 'Lägg till i favoriter', calcStake: 'Beräkna insats', marginLabel: 'MARGINAL',
    overview: 'Översikt', scanText: 'Vi skannar ständigt efter nya möjligheter hos 2 000+ spelbolag.', sportBranches: 'Sportgrenar', foundToday: 'Hittade möjligheter idag', exampleTitle: 'Exempel på säkert spel', potentialProfit: 'Potentiell vinst:', profitHelp: 'Vinst vid korrekt insatsfördelning', latestFinds: 'Senaste fynd',
    unlockPremium: 'Lås upp med Premium', becomeCustomer: 'Bli kund för att se oddsen', unlock: 'Lås upp', notifications: 'Notiser', newCount: 'nya', highMarginNow: 'Hög marginal just nu', noAlerts: 'Inga säkra spel över 4 % just nu.',
  },
  no: {
    login: 'Logg inn', loggedIn: 'Innlogget', frontPage: 'Forside', home: 'Sikre spill', live: 'Live-skanning', stats: 'Statistikk', calc: 'Beregn', bonus: 'Bonus', myPage: 'Min side', signup: 'Opprett bruker', games: 'Mine spill',
    all: 'Alle', football: 'Fotball', basketball: 'Basketball', tennis: 'Tennis', hockey: 'Ishockey', esports: 'E-sport', handball: 'Håndball', favorites: 'Favoritter', more: 'Flere',
    sport: 'Sport', leagues: 'Ligaer', moreLeagues: 'Flere ligaer', premium: 'Premium', premiumText: 'Få tilgang til flere funksjoner og eksklusive sikre spill.', upgrade: 'Oppgrader nå', createAccount: 'Opprett gratis konto', accountText: 'Få full tilgang til alle odds og funksjoner.', create: 'Opprett konto',
    bookmakers: 'Bookmakere', bookmakersFilter: 'Bookmakere', allBookmakers: 'Alle bookmakere', sortBookmaker: 'Bookmaker A-Å', clearBookmakers: 'Fjern valgte',
    leaguesFilter: 'Ligaer', allLeagues: 'Alle ligaer', minMargin: 'Min. margin', allMargins: 'Alle marginer', atLeast: 'Minst', markets: 'Alle markeder', market: 'Marked', sorting: 'Sortering', newest: 'Nyeste først', highest: 'Høyeste margin', kickoff: 'Starter snart', found: 'sikre spill funnet', noMatches: 'Ingen sikre spill matcher', tryAgain: 'Prøv en lavere minimumsmargin eller en annen sport.', reset: 'Nullstill filtre',
    locked: 'Låst', marketLocked: 'Marked låst', createToSeeOdds: 'Opprett gratis konto for å se oddsen', createToSeeOddsFrom: 'Opprett gratis konto for å se oddsen fra', bothCovered: 'Begge mulige utfall er dekket', twoOutcomes: '2 utfall', details: 'Se detaljer', removeFav: 'Fjern fra favoritter', addFav: 'Legg til i favoritter', calcStake: 'Beregn innsats', marginLabel: 'MARGIN',
    overview: 'Oversikt', scanText: 'Vi skanner hele tiden etter nye muligheter hos 2 000+ bookmakere.', sportBranches: 'Sportsgrener', foundToday: 'Funnede muligheter i dag', exampleTitle: 'Eksempel på sikkert spill', potentialProfit: 'Potensiell profitt:', profitHelp: 'Profitt ved riktig innsatsfordeling', latestFinds: 'Siste funn',
    unlockPremium: 'Lås opp med Premium', becomeCustomer: 'Bli kunde for å se oddsen', unlock: 'Lås opp', notifications: 'Varsler', newCount: 'nye', highMarginNow: 'Høy margin akkurat nå', noAlerts: 'Ingen sikre spill over 4 % akkurat nå.',
  },
  de: {
    login: 'Anmelden', loggedIn: 'Angemeldet', frontPage: 'Startseite', home: 'Sichere Wetten', live: 'Live-Scan', stats: 'Statistiken', calc: 'Rechner', bonus: 'Bonus', myPage: 'Mein Konto', signup: 'Registrieren', games: 'Meine Spiele',
    all: 'Alle', football: 'Fußball', basketball: 'Basketball', tennis: 'Tennis', hockey: 'Eishockey', esports: 'E-Sport', handball: 'Handball', favorites: 'Favoriten', more: 'Mehr',
    sport: 'Sport', leagues: 'Ligen', moreLeagues: 'Weitere Ligen', premium: 'Premium', premiumText: 'Erhalte Zugang zu weiteren Funktionen und exklusiven sicheren Wetten.', upgrade: 'Jetzt upgraden', createAccount: 'Kostenloses Konto erstellen', accountText: 'Erhalte vollen Zugriff auf alle Quoten und Funktionen.', create: 'Konto erstellen',
    bookmakers: 'Buchmacher', bookmakersFilter: 'Buchmacher', allBookmakers: 'Alle Buchmacher', sortBookmaker: 'Buchmacher A-Z', clearBookmakers: 'Auswahl löschen',
    leaguesFilter: 'Ligen', allLeagues: 'Alle Ligen', minMargin: 'Min. Marge', allMargins: 'Alle Margen', atLeast: 'Mindestens', markets: 'Alle Märkte', market: 'Markt', sorting: 'Sortierung', newest: 'Neueste zuerst', highest: 'Höchste Marge', kickoff: 'Beginnt bald', found: 'sichere Wetten gefunden', noMatches: 'Keine sicheren Wetten gefunden', tryAgain: 'Versuche eine niedrigere Mindestmarge oder eine andere Sportart.', reset: 'Filter zurücksetzen',
    locked: 'Gesperrt', marketLocked: 'Markt gesperrt', createToSeeOdds: 'Kostenloses Konto erstellen, um die Quoten zu sehen', createToSeeOddsFrom: 'Kostenloses Konto erstellen, um die Quoten zu sehen von', bothCovered: 'Beide möglichen Ausgänge sind abgedeckt', twoOutcomes: '2 Ausgänge', details: 'Details ansehen', removeFav: 'Aus Favoriten entfernen', addFav: 'Zu Favoriten hinzufügen', calcStake: 'Einsatz berechnen', marginLabel: 'MARGE',
    overview: 'Überblick', scanText: 'Wir scannen ständig nach neuen Chancen bei über 2.000 Buchmachern.', sportBranches: 'Sportarten', foundToday: 'Gefundene Chancen heute', exampleTitle: 'Beispiel für eine sichere Wette', potentialProfit: 'Möglicher Gewinn:', profitHelp: 'Gewinn bei korrekter Einsatzverteilung', latestFinds: 'Neueste Funde',
    unlockPremium: 'Mit Premium freischalten', becomeCustomer: 'Werde Kunde, um die Quoten zu sehen', unlock: 'Freischalten', notifications: 'Benachrichtigungen', newCount: 'neu', highMarginNow: 'Hohe Marge gerade jetzt', noAlerts: 'Derzeit keine sicheren Wetten über 4 %.',
  },
  es: {
    login: 'Iniciar sesión', loggedIn: 'Sesión iniciada', frontPage: 'Inicio', home: 'Sure Bets', live: 'Escaneo en vivo', stats: 'Estadísticas', calc: 'Calcular', bonus: 'Bono', myPage: 'Mi página', signup: 'Registrarse', games: 'Mis apuestas',
    all: 'Todos', football: 'Fútbol', basketball: 'Baloncesto', tennis: 'Tenis', hockey: 'Hockey sobre hielo', esports: 'Esports', handball: 'Balonmano', favorites: 'Favoritos', more: 'Más',
    sport: 'Deporte', leagues: 'Ligas', moreLeagues: 'Más ligas', premium: 'Premium', premiumText: 'Obtén acceso a más funciones y surebets exclusivas.', upgrade: 'Mejorar ahora', createAccount: 'Crear cuenta gratis', accountText: 'Obtén acceso completo a todas las cuotas y funciones.', create: 'Crear cuenta',
    bookmakers: 'Casas de apuestas', bookmakersFilter: 'Casas de apuestas', allBookmakers: 'Todas las casas de apuestas', sortBookmaker: 'Casa de apuestas A-Z', clearBookmakers: 'Borrar selección',
    leaguesFilter: 'Ligas', allLeagues: 'Todas las ligas', minMargin: 'Margen mín.', allMargins: 'Todos los márgenes', atLeast: 'Al menos', markets: 'Todos los mercados', market: 'Mercado', sorting: 'Ordenar por', newest: 'Más recientes primero', highest: 'Mayor margen', kickoff: 'Empieza pronto', found: 'surebets encontradas', noMatches: 'Ninguna surebet coincide', tryAgain: 'Prueba con un margen mínimo menor u otro deporte.', reset: 'Restablecer filtros',
    locked: 'Bloqueado', marketLocked: 'Mercado bloqueado', createToSeeOdds: 'Crea una cuenta gratis para ver las cuotas', createToSeeOddsFrom: 'Crea una cuenta gratis para ver las cuotas de', bothCovered: 'Ambos resultados posibles están cubiertos', twoOutcomes: '2 resultados', details: 'Ver detalles', removeFav: 'Eliminar de favoritos', addFav: 'Añadir a favoritos', calcStake: 'Calcular apuesta', marginLabel: 'MARGEN',
    overview: 'Resumen', scanText: 'Escaneamos constantemente nuevas oportunidades en más de 2.000 casas de apuestas.', sportBranches: 'Deportes', foundToday: 'Oportunidades encontradas hoy', exampleTitle: 'Ejemplo de surebet', potentialProfit: 'Beneficio potencial:', profitHelp: 'Beneficio con la distribución correcta de la apuesta', latestFinds: 'Últimas encontradas',
    unlockPremium: 'Desbloquear con Premium', becomeCustomer: 'Hazte cliente para ver las cuotas', unlock: 'Desbloquear', notifications: 'Notificaciones', newCount: 'nuevas', highMarginNow: 'Alto margen ahora mismo', noAlerts: 'No hay surebets por encima del 4% en este momento.',
  },
  br: {
    login: 'Entrar', loggedIn: 'Conectado', frontPage: 'Início', home: 'Sure Bets', live: 'Varredura ao vivo', stats: 'Estatísticas', calc: 'Calcular', bonus: 'Bônus', myPage: 'Minha página', signup: 'Cadastrar', games: 'Minhas apostas',
    all: 'Todos', football: 'Futebol', basketball: 'Basquete', tennis: 'Tênis', hockey: 'Hóquei no gelo', esports: 'Esports', handball: 'Handebol', favorites: 'Favoritos', more: 'Mais',
    sport: 'Esporte', leagues: 'Ligas', moreLeagues: 'Mais ligas', premium: 'Premium', premiumText: 'Tenha acesso a mais recursos e surebets exclusivas.', upgrade: 'Fazer upgrade agora', createAccount: 'Criar conta grátis', accountText: 'Tenha acesso completo a todas as odds e recursos.', create: 'Criar conta',
    bookmakers: 'Casas de apostas', bookmakersFilter: 'Casas de apostas', allBookmakers: 'Todas as casas', sortBookmaker: 'Casa de apostas A-Z', clearBookmakers: 'Limpar seleção',
    leaguesFilter: 'Ligas', allLeagues: 'Todas as ligas', minMargin: 'Margem mín.', allMargins: 'Todas as margens', atLeast: 'Pelo menos', markets: 'Todos os mercados', market: 'Mercado', sorting: 'Ordenar por', newest: 'Mais recentes primeiro', highest: 'Maior margem', kickoff: 'Começando em breve', found: 'surebets encontradas', noMatches: 'Nenhuma surebet encontrada', tryAgain: 'Tente uma margem mínima menor ou outro esporte.', reset: 'Redefinir filtros',
    locked: 'Bloqueado', marketLocked: 'Mercado bloqueado', createToSeeOdds: 'Crie uma conta grátis para ver as odds', createToSeeOddsFrom: 'Crie uma conta grátis para ver as odds de', bothCovered: 'Ambos os resultados possíveis estão cobertos', twoOutcomes: '2 resultados', details: 'Ver detalhes', removeFav: 'Remover dos favoritos', addFav: 'Adicionar aos favoritos', calcStake: 'Calcular stake', marginLabel: 'MARGEM',
    overview: 'Visão geral', scanText: 'Fazemos varreduras constantes em busca de novas oportunidades em mais de 2.000 casas de apostas.', sportBranches: 'Esportes', foundToday: 'Oportunidades encontradas hoje', exampleTitle: 'Exemplo de surebet', potentialProfit: 'Lucro potencial:', profitHelp: 'Lucro com a divisão correta de stake', latestFinds: 'Últimas descobertas',
    unlockPremium: 'Desbloquear com Premium', becomeCustomer: 'Torne-se cliente para ver as odds', unlock: 'Desbloquear', notifications: 'Notificações', newCount: 'nova', highMarginNow: 'Alta margem agora', noAlerts: 'Nenhuma surebet acima de 4% no momento.',
  },
  pt: {
    login: 'Iniciar sessão', loggedIn: 'Sessão iniciada', frontPage: 'Início', home: 'Sure Bets', live: 'Scanning em direto', stats: 'Estatísticas', calc: 'Calcular', bonus: 'Bónus', myPage: 'A minha página', signup: 'Registar', games: 'As minhas apostas',
    all: 'Todos', football: 'Futebol', basketball: 'Basquetebol', tennis: 'Ténis', hockey: 'Hóquei no gelo', esports: 'Esports', handball: 'Andebol', favorites: 'Favoritos', more: 'Mais',
    sport: 'Desporto', leagues: 'Ligas', moreLeagues: 'Mais ligas', premium: 'Premium', premiumText: 'Obtém acesso a mais funcionalidades e surebets exclusivas.', upgrade: 'Atualizar agora', createAccount: 'Criar conta gratuita', accountText: 'Obtém acesso completo a todas as odds e funcionalidades.', create: 'Criar conta',
    bookmakers: 'Casas de apostas', bookmakersFilter: 'Casas de apostas', allBookmakers: 'Todas as casas de apostas', sortBookmaker: 'Casa de apostas A-Z', clearBookmakers: 'Limpar seleção',
    leaguesFilter: 'Ligas', allLeagues: 'Todas as ligas', minMargin: 'Margem mín.', allMargins: 'Todas as margens', atLeast: 'Pelo menos', markets: 'Todos os mercados', market: 'Mercado', sorting: 'Ordenar por', newest: 'Mais recentes primeiro', highest: 'Margem mais alta', kickoff: 'A começar em breve', found: 'surebets encontradas', noMatches: 'Nenhuma surebet corresponde', tryAgain: 'Tenta uma margem mínima mais baixa ou outro desporto.', reset: 'Repor filtros',
    locked: 'Bloqueado', marketLocked: 'Mercado bloqueado', createToSeeOdds: 'Cria uma conta gratuita para ver as odds', createToSeeOddsFrom: 'Cria uma conta gratuita para ver as odds de', bothCovered: 'Ambos os resultados possíveis estão cobertos', twoOutcomes: '2 resultados', details: 'Ver detalhes', removeFav: 'Remover dos favoritos', addFav: 'Adicionar aos favoritos', calcStake: 'Calcular aposta', marginLabel: 'MARGEM',
    overview: 'Visão geral', scanText: 'Analisamos constantemente novas oportunidades em mais de 2.000 casas de apostas.', sportBranches: 'Desportos', foundToday: 'Oportunidades encontradas hoje', exampleTitle: 'Exemplo de surebet', potentialProfit: 'Lucro potencial:', profitHelp: 'Lucro com a divisão correta da aposta', latestFinds: 'Últimas descobertas',
    unlockPremium: 'Desbloquear com Premium', becomeCustomer: 'Torna-te cliente para ver as odds', unlock: 'Desbloquear', notifications: 'Notificações', newCount: 'novas', highMarginNow: 'Margem alta neste momento', noAlerts: 'Nenhuma surebet acima de 4% neste momento.',
  },
  fr: {
    login: 'Connexion', loggedIn: 'Connecté', frontPage: 'Accueil', home: 'Sure Bets', live: 'Scan en direct', stats: 'Statistiques', calc: 'Calculer', bonus: 'Bonus', myPage: 'Mon compte', signup: 'S\'inscrire', games: 'Mes paris',
    all: 'Tous', football: 'Football', basketball: 'Basketball', tennis: 'Tennis', hockey: 'Hockey sur glace', esports: 'Esports', handball: 'Handball', favorites: 'Favoris', more: 'Plus',
    sport: 'Sport', leagues: 'Ligues', moreLeagues: 'Plus de ligues', premium: 'Premium', premiumText: 'Accède à plus de fonctionnalités et à des surebets exclusifs.', upgrade: 'Passer à Premium', createAccount: 'Créer un compte gratuit', accountText: 'Accède à toutes les cotes et fonctionnalités.', create: 'Créer un compte',
    bookmakers: 'Bookmakers', bookmakersFilter: 'Bookmakers', allBookmakers: 'Tous les bookmakers', sortBookmaker: 'Bookmaker A-Z', clearBookmakers: 'Effacer la sélection',
    leaguesFilter: 'Ligues', allLeagues: 'Toutes les ligues', minMargin: 'Marge min.', allMargins: 'Toutes les marges', atLeast: 'Au moins', markets: 'Tous les marchés', market: 'Marché', sorting: 'Trier par', newest: 'Les plus récents', highest: 'Marge la plus élevée', kickoff: 'Commence bientôt', found: 'surebets trouvés', noMatches: 'Aucun surebet ne correspond', tryAgain: 'Essaie une marge minimale plus basse ou un autre sport.', reset: 'Réinitialiser les filtres',
    locked: 'Verrouillé', marketLocked: 'Marché verrouillé', createToSeeOdds: 'Crée un compte gratuit pour voir les cotes', createToSeeOddsFrom: 'Crée un compte gratuit pour voir les cotes de', bothCovered: 'Les deux issues possibles sont couvertes', twoOutcomes: '2 issues', details: 'Voir les détails', removeFav: 'Retirer des favoris', addFav: 'Ajouter aux favoris', calcStake: 'Calculer la mise', marginLabel: 'MARGE',
    overview: 'Aperçu', scanText: 'Nous scannons en permanence de nouvelles opportunités auprès de plus de 2 000 bookmakers.', sportBranches: 'Sports', foundToday: 'Opportunités trouvées aujourd\'hui', exampleTitle: 'Exemple de surebet', potentialProfit: 'Profit potentiel :', profitHelp: 'Profit avec la répartition de mise optimale', latestFinds: 'Dernières trouvailles',
    unlockPremium: 'Débloquer avec Premium', becomeCustomer: 'Deviens client pour voir les cotes', unlock: 'Débloquer', notifications: 'Notifications', newCount: 'nouveau', highMarginNow: 'Marge élevée en ce moment', noAlerts: 'Aucun surebet au-dessus de 4 % pour l\'instant.',
  },
  it: {
    login: 'Accedi', loggedIn: 'Accesso effettuato', frontPage: 'Home', home: 'Sure Bets', live: 'Scansione live', stats: 'Statistiche', calc: 'Calcola', bonus: 'Bonus', myPage: 'Il mio profilo', signup: 'Registrati', games: 'Le mie scommesse',
    all: 'Tutti', football: 'Calcio', basketball: 'Basket', tennis: 'Tennis', hockey: 'Hockey su ghiaccio', esports: 'Esports', handball: 'Pallamano', favorites: 'Preferiti', more: 'Altro',
    sport: 'Sport', leagues: 'Campionati', moreLeagues: 'Altri campionati', premium: 'Premium', premiumText: 'Accedi a più funzionalità e surebets esclusive.', upgrade: 'Passa a Premium', createAccount: 'Crea account gratuito', accountText: 'Accedi a tutte le quote e funzionalità.', create: 'Crea account',
    bookmakers: 'Bookmaker', bookmakersFilter: 'Bookmaker', allBookmakers: 'Tutti i bookmaker', sortBookmaker: 'Bookmaker A-Z', clearBookmakers: 'Deseleziona tutti',
    leaguesFilter: 'Campionati', allLeagues: 'Tutti i campionati', minMargin: 'Margine min.', allMargins: 'Tutti i margini', atLeast: 'Almeno', markets: 'Tutti i mercati', market: 'Mercato', sorting: 'Ordina per', newest: 'Più recenti', highest: 'Margine più alto', kickoff: 'In partenza a breve', found: 'surebets trovate', noMatches: 'Nessuna surebet corrisponde', tryAgain: 'Prova un margine minimo più basso o un altro sport.', reset: 'Reimposta filtri',
    locked: 'Bloccato', marketLocked: 'Mercato bloccato', createToSeeOdds: 'Crea un account gratuito per vedere le quote', createToSeeOddsFrom: 'Crea un account gratuito per vedere le quote di', bothCovered: 'Entrambi gli esiti possibili sono coperti', twoOutcomes: '2 esiti', details: 'Vedi dettagli', removeFav: 'Rimuovi dai preferiti', addFav: 'Aggiungi ai preferiti', calcStake: 'Calcola la puntata', marginLabel: 'MARGINE',
    overview: 'Panoramica', scanText: 'Scansionamo continuamente nuove opportunità su oltre 2.000 bookmaker.', sportBranches: 'Sport', foundToday: 'Opportunità trovate oggi', exampleTitle: 'Esempio di surebet', potentialProfit: 'Profitto potenziale:', profitHelp: 'Profitto con la suddivisione ottimale della puntata', latestFinds: 'Ultime trovate',
    unlockPremium: 'Sblocca con Premium', becomeCustomer: 'Diventa cliente per vedere le quote', unlock: 'Sblocca', notifications: 'Notifiche', newCount: 'nuove', highMarginNow: 'Margine alto in questo momento', noAlerts: 'Nessuna surebet sopra il 4% al momento.',
  },
  pl: {
    login: 'Zaloguj się', loggedIn: 'Zalogowano', frontPage: 'Strona główna', home: 'Sure Bets', live: 'Skanowanie na żywo', stats: 'Statystyki', calc: 'Kalkulator', bonus: 'Bonus', myPage: 'Moje konto', signup: 'Zarejestruj się', games: 'Moje zakłady',
    all: 'Wszystkie', football: 'Piłka nożna', basketball: 'Koszykówka', tennis: 'Tenis', hockey: 'Hokej na lodzie', esports: 'Esports', handball: 'Piłka ręczna', favorites: 'Ulubione', more: 'Więcej',
    sport: 'Sport', leagues: 'Ligi', moreLeagues: 'Więcej lig', premium: 'Premium', premiumText: 'Uzyskaj dostęp do większej liczby funkcji i ekskluzywnych surebets.', upgrade: 'Ulepsz teraz', createAccount: 'Utwórz darmowe konto', accountText: 'Uzyskaj pełny dostęp do wszystkich kursów i funkcji.', create: 'Utwórz konto',
    bookmakers: 'Bukmacherzy', bookmakersFilter: 'Bukmacherzy', allBookmakers: 'Wszyscy bukmacherzy', sortBookmaker: 'Bukmacher A-Z', clearBookmakers: 'Wyczyść zaznaczenie',
    leaguesFilter: 'Ligi', allLeagues: 'Wszystkie ligi', minMargin: 'Min. marża', allMargins: 'Wszystkie marże', atLeast: 'Co najmniej', markets: 'Wszystkie rynki', market: 'Rynek', sorting: 'Sortuj według', newest: 'Najpierw najnowsze', highest: 'Najwyższa marża', kickoff: 'Wkrótce się zaczyna', found: 'znalezionych surebets', noMatches: 'Brak pasujących surebets', tryAgain: 'Spróbuj niższej minimalnej marży lub innego sportu.', reset: 'Resetuj filtry',
    locked: 'Zablokowane', marketLocked: 'Rynek zablokowany', createToSeeOdds: 'Utwórz darmowe konto, aby zobaczyć kursy', createToSeeOddsFrom: 'Utwórz darmowe konto, aby zobaczyć kursy od', bothCovered: 'Oba możliwe wyniki są pokryte', twoOutcomes: '2 wyniki', details: 'Zobacz szczegóły', removeFav: 'Usuń z ulubionych', addFav: 'Dodaj do ulubionych', calcStake: 'Oblicz stawkę', marginLabel: 'MARŻA',
    overview: 'Przegląd', scanText: 'Nieustannie skanujemy w poszukiwaniu nowych okazji u ponad 2 000 bukmacherów.', sportBranches: 'Sporty', foundToday: 'Okazje znalezione dzisiaj', exampleTitle: 'Przykład surebeta', potentialProfit: 'Potencjalny zysk:', profitHelp: 'Zysk przy odpowiednim podziale stawki', latestFinds: 'Ostatnio znalezione',
    unlockPremium: 'Odblokuj z Premium', becomeCustomer: 'Zostań klientem, aby zobaczyć kursy', unlock: 'Odblokuj', notifications: 'Powiadomienia', newCount: 'nowe', highMarginNow: 'Wysoka marża teraz', noAlerts: 'Brak surebets powyżej 4% w tej chwili.',
  },
  fi: {
    login: 'Kirjaudu sisään', loggedIn: 'Kirjautunut', frontPage: 'Etusivu', home: 'Sure Bets', live: 'Reaaliaikainen skannaus', stats: 'Tilastot', calc: 'Laske', bonus: 'Bonus', myPage: 'Oma sivu', signup: 'Rekisteröidy', games: 'Omat vedot',
    all: 'Kaikki', football: 'Jalkapallo', basketball: 'Koripallo', tennis: 'Tennis', hockey: 'Jääkiekko', esports: 'Esports', handball: 'Käsipallo', favorites: 'Suosikit', more: 'Lisää',
    sport: 'Laji', leagues: 'Sarjat', moreLeagues: 'Lisää sarjoja', premium: 'Premium', premiumText: 'Hanki pääsy lisäominaisuuksiin ja eksklusiivisiin surebetseihin.', upgrade: 'Päivitä nyt', createAccount: 'Luo ilmainen tili', accountText: 'Saat täyden pääsyn kaikkiin kertoimiin ja ominaisuuksiin.', create: 'Luo tili',
    bookmakers: 'Vedonlyöntitoimistot', bookmakersFilter: 'Vedonlyöntitoimistot', allBookmakers: 'Kaikki vedonlyöntitoimistot', sortBookmaker: 'Vedonlyöntitoimisto A-Ö', clearBookmakers: 'Tyhjennä valinta',
    leaguesFilter: 'Sarjat', allLeagues: 'Kaikki sarjat', minMargin: 'Min. marginaali', allMargins: 'Kaikki marginaalit', atLeast: 'Vähintään', markets: 'Kaikki markkinat', market: 'Markkina', sorting: 'Järjestä', newest: 'Uusimmat ensin', highest: 'Korkein marginaali', kickoff: 'Alkaa pian', found: 'surebetsiä löydetty', noMatches: 'Ei vastaavia surebetsejä', tryAgain: 'Kokeile pienempää vähimmäismarginaalia tai toista lajia.', reset: 'Nollaa suodattimet',
    locked: 'Lukittu', marketLocked: 'Markkina lukittu', createToSeeOdds: 'Luo ilmainen tili nähdäksesi kertoimet', createToSeeOddsFrom: 'Luo ilmainen tili nähdäksesi kertoimet kohteesta', bothCovered: 'Molemmat mahdolliset lopputulokset on katettu', twoOutcomes: '2 lopputulosta', details: 'Näytä tiedot', removeFav: 'Poista suosikeista', addFav: 'Lisää suosikkeihin', calcStake: 'Laske panos', marginLabel: 'MARGINAALI',
    overview: 'Yleiskatsaus', scanText: 'Skannaamme jatkuvasti uusia mahdollisuuksia yli 2 000 vedonlyöntitoimistosta.', sportBranches: 'Lajit', foundToday: 'Tänään löydetyt mahdollisuudet', exampleTitle: 'Surebet-esimerkki', potentialProfit: 'Mahdollinen voitto:', profitHelp: 'Voitto oikealla panosjaolla', latestFinds: 'Viimeisimmät löydöt',
    unlockPremium: 'Avaa Premiumilla', becomeCustomer: 'Ryhdy asiakkaaksi nähdäksesi kertoimet', unlock: 'Avaa', notifications: 'Ilmoitukset', newCount: 'uutta', highMarginNow: 'Korkea marginaali juuri nyt', noAlerts: 'Ei yli 4 %:n surebetsejä tällä hetkellä.',
  },
  nl: {
    login: 'Inloggen', loggedIn: 'Ingelogd', frontPage: 'Home', home: 'Sure Bets', live: 'Live scannen', stats: 'Statistieken', calc: 'Berekenen', bonus: 'Bonus', myPage: 'Mijn pagina', signup: 'Registreren', games: 'Mijn weddenschappen',
    all: 'Alle', football: 'Voetbal', basketball: 'Basketball', tennis: 'Tennis', hockey: 'IJshockey', esports: 'Esports', handball: 'Handbal', favorites: 'Favorieten', more: 'Meer',
    sport: 'Sport', leagues: 'Competities', moreLeagues: 'Meer competities', premium: 'Premium', premiumText: 'Krijg toegang tot meer functies en exclusieve surebets.', upgrade: 'Nu upgraden', createAccount: 'Gratis account aanmaken', accountText: 'Krijg volledige toegang tot alle odds en functies.', create: 'Account aanmaken',
    bookmakers: 'Bookmakers', bookmakersFilter: 'Bookmakers', allBookmakers: 'Alle bookmakers', sortBookmaker: 'Bookmaker A-Z', clearBookmakers: 'Selectie wissen',
    leaguesFilter: 'Competities', allLeagues: 'Alle competities', minMargin: 'Min. marge', allMargins: 'Alle marges', atLeast: 'Minimaal', markets: 'Alle markten', market: 'Markt', sorting: 'Sorteren op', newest: 'Nieuwste eerst', highest: 'Hoogste marge', kickoff: 'Begint binnenkort', found: 'surebets gevonden', noMatches: 'Geen surebets gevonden', tryAgain: 'Probeer een lagere minimummarge of een andere sport.', reset: 'Filters resetten',
    locked: 'Vergrendeld', marketLocked: 'Markt vergrendeld', createToSeeOdds: 'Maak een gratis account aan om de odds te zien', createToSeeOddsFrom: 'Maak een gratis account aan om de odds te zien van', bothCovered: 'Beide mogelijke uitkomsten zijn gedekt', twoOutcomes: '2 uitkomsten', details: 'Details bekijken', removeFav: 'Verwijderen uit favorieten', addFav: 'Toevoegen aan favorieten', calcStake: 'Inzet berekenen', marginLabel: 'MARGE',
    overview: 'Overzicht', scanText: 'We scannen voortdurend naar nieuwe kansen bij 2.000+ bookmakers.', sportBranches: 'Sporten', foundToday: 'Kansen gevonden vandaag', exampleTitle: 'Surebet voorbeeld', potentialProfit: 'Potentiële winst:', profitHelp: 'Winst bij de juiste inzetverdeling', latestFinds: 'Laatste vondsten',
    unlockPremium: 'Ontgrendelen met Premium', becomeCustomer: 'Word klant om de odds te zien', unlock: 'Ontgrendelen', notifications: 'Meldingen', newCount: 'nieuw', highMarginNow: 'Hoge marge op dit moment', noAlerts: 'Geen surebets boven 4% op dit moment.',
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
  es: { ...baseTranslations.es, ...esMessages },
  br: { ...baseTranslations.br, ...brMessages },
  pt: { ...baseTranslations.pt, ...ptMessages },
  fr: { ...baseTranslations.fr, ...frMessages },
  it: { ...baseTranslations.it, ...itMessages },
  pl: { ...baseTranslations.pl, ...plMessages },
  fi: { ...baseTranslations.fi, ...fiMessages },
  nl: { ...baseTranslations.nl, ...nlMessages },
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
