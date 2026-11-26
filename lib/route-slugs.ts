import type { Locale } from '@/lib/i18n'
import type { BaseTranslated, NewLocale } from '@/lib/locale-list'
import { newLocales } from '@/lib/locale-packs'
import { TRANSLATED_SLUG_FALLBACKS } from './translated-slug-fallbacks'

// Public URLs for the translated sections use words people actually search for in each country.
// Internally every page still lives at its Danish path; the proxy rewrites localized URLs to it.
type Section = 'guide' | 'sport' | 'bookmaker'
type Translated = Exclude<Locale, 'da'>

export const SECTION_NAMES_BASE: Record<BaseTranslated, Record<Section, string>> = {
  en: { guide: 'guides', sport: 'sports', bookmaker: 'bookmakers' },
  sv: { guide: 'guider', sport: 'sport', bookmaker: 'spelbolag' },
  no: { guide: 'guider', sport: 'sport', bookmaker: 'bookmakere' },
  de: { guide: 'ratgeber', sport: 'sportarten', bookmaker: 'buchmacher' },
  es: { guide: 'guias', sport: 'deportes', bookmaker: 'casas-de-apuestas' },
  br: { guide: 'guias', sport: 'esportes', bookmaker: 'casas-de-apostas' },
  pt: { guide: 'guias', sport: 'desportos', bookmaker: 'casas-de-apostas' },
  fr: { guide: 'guides', sport: 'sports', bookmaker: 'bookmakers' },
  it: { guide: 'guide', sport: 'sport', bookmaker: 'bookmaker' },
  pl: { guide: 'poradniki', sport: 'sporty', bookmaker: 'bukmacherzy' },
  fi: { guide: 'oppaat', sport: 'urheilu', bookmaker: 'vedonlyontiyhtiot' },
  nl: { guide: 'gidsen', sport: 'sporten', bookmaker: 'bookmakers' },
}

export const SLUGS_BASE: Record<BaseTranslated, Record<string, string>> = {
  en: {
    'er-surebets-lovligt': 'are-surebets-legal',
    'undgaa-begraensning': 'avoid-bookmaker-limits',
    'surebet-beregner': 'surebet-calculator',
    'odds-beregner': 'odds-calculator',
    'bedste-bookmakere-til-surebets': 'best-bookmakers-for-surebets',
    'skat-paa-spillegevinster': 'tax-on-gambling-winnings',
    'hvad-er-surebets': 'what-are-surebets',
    'fodbold-surebets': 'football-surebets',
    'bookmakerens-margin': 'bookmaker-margin',
    'asiatisk-handicap': 'asian-handicap',
    'betting-regnskab': 'betting-accounts',
    'tjen-penge-paa-odds-uden-risiko': 'make-money-betting-without-risk',
    'find-surebets-automatisk': 'find-surebets-automatically',
    'find-value-bets-med-ai': 'find-value-bets-with-ai',
    'bedste-odds-vaerktoej-danmark': 'best-sports-betting-tools',
    fodbold: 'football',
    ishockey: 'ice-hockey',
    esport: 'esports',
  },
  sv: {
    'er-surebets-lovligt': 'ar-surebets-lagligt',
    'undgaa-begraensning': 'undvik-begransade-konton',
    'surebet-beregner': 'surebet-kalkylator',
    'odds-beregner': 'oddskalkylator',
    'value-betting-vs-surebets': 'value-bets-vs-surebets',
    'bedste-bookmakere-til-surebets': 'basta-spelbolag-for-surebets',
    'skat-paa-spillegevinster': 'skatt-pa-spelvinster',
    'arbitrage-betting': 'arbitragespel',
    'hvad-er-surebets': 'vad-ar-surebets',
    'tennis-surebets': 'surebets-tennis',
    'fodbold-surebets': 'surebets-fotboll',
    'bookmakerens-margin': 'spelbolagets-marginal',
    'asiatisk-handicap': 'asiatiskt-handicap',
    'betting-regnskab': 'spelredovisning',
    'dutching-betting': 'dutching',
    'tjen-penge-paa-odds-uden-risiko': 'tjana-pengar-pa-odds-utan-risk',
    'find-surebets-automatisk': 'hitta-surebets-automatiskt',
    'find-value-bets-med-ai': 'hitta-value-bets-med-ai',
    'bedste-odds-vaerktoej-danmark': 'basta-oddsverktyget-sverige',
    fodbold: 'fotboll',
    basketball: 'basket',
    esport: 'e-sport',
  },
  no: {
    'er-surebets-lovligt': 'er-surebets-lovlig',
    'undgaa-begraensning': 'unnga-begrensede-kontoer',
    'surebet-beregner': 'surebet-kalkulator',
    'odds-beregner': 'odds-kalkulator',
    'bedste-bookmakere-til-surebets': 'beste-bookmakere-for-surebets',
    'skat-paa-spillegevinster': 'skatt-pa-spillegevinster',
    'arbitrage-betting': 'arbitrasjespill',
    'hvad-er-surebets': 'hva-er-surebets',
    'dutching-betting': 'dutching',
    'tennis-surebets': 'surebets-tennis',
    'fodbold-surebets': 'surebets-fotball',
    'betting-regnskab': 'spillregnskap',
    'tjen-penge-paa-odds-uden-risiko': 'tjen-penger-pa-odds-uten-risiko',
    'find-surebets-automatisk': 'finn-surebets-automatisk',
    'find-value-bets-med-ai': 'finn-value-bets-med-ai',
    'bedste-odds-vaerktoej-danmark': 'beste-odds-verktoy-norge',
    fodbold: 'fotball',
    esport: 'e-sport',
  },
  de: {
    'er-surebets-lovligt': 'sind-surebets-legal',
    'undgaa-begraensning': 'kontolimits-vermeiden',
    'surebet-beregner': 'surebet-rechner',
    'odds-beregner': 'quotenrechner',
    'value-betting-vs-surebets': 'value-bets-vs-surebets',
    'bedste-bookmakere-til-surebets': 'beste-wettanbieter-fuer-surebets',
    'skat-paa-spillegevinster': 'steuer-auf-sportwetten-gewinne',
    'bankroll-management': 'bankroll-management-wetten',
    'arbitrage-betting': 'sportwetten-arbitrage',
    'hvad-er-surebets': 'was-sind-surebets',
    'dutching-betting': 'dutching-wetten',
    'tennis-surebets': 'surebets-tennis',
    'fodbold-surebets': 'surebets-fussball',
    'bookmakerens-margin': 'buchmacher-marge',
    'asiatisk-handicap': 'asiatisches-handicap',
    'bet-tracker': 'wetten-verfolgen',
    'roi-betting': 'roi-wetten',
    'betting-regnskab': 'wettbuchhaltung',
    'tjen-penge-paa-odds-uden-risiko': 'sportwetten-ohne-risiko',
    'find-surebets-automatisk': 'surebets-automatisch-finden',
    'find-value-bets-med-ai': 'value-bets-mit-ki-finden',
    'bedste-odds-vaerktoej-danmark': 'beste-sportwetten-tools',
    fodbold: 'fussball',
    ishockey: 'eishockey',
  },
  es: { fodbold: 'futbol', ishockey: 'hockey-hielo', esport: 'esports', 'matched-betting': 'matched-betting-gana-con-bonos', 'er-surebets-lovligt': 'son-legales-las-surebets', 'undgaa-begraensning': 'como-evitar-limites-de-casas-de-apuestas', 'surebet-beregner': 'calculadora-surebet-gratis', 'odds-beregner': 'calculadora-de-odds', 'value-betting-vs-surebets': 'value-betting-vs-surebets', 'bedste-bookmakere-til-surebets': 'mejores-casas-de-apuestas-surebets', 'skat-paa-spillegevinster': 'impuestos-ganancias-apuestas-deportivas', 'bankroll-management': 'bankroll-management-apuestas-deportivas', 'arbitrage-betting': 'como-funciona-el-arbitrage-betting', 'hvad-er-surebets': 'que-son-las-surebets', 'dutching-betting': 'dutching-apuestas-multiples-resultados', 'tennis-surebets': 'surebets-en-tenis', 'fodbold-surebets': 'surebets-en-futbol', 'bookmakerens-margin': 'margen-de-la-casa-de-apuestas', 'asiatisk-handicap': 'handicap-asiatico-explicado', 'bet-tracker': 'registro-de-apuestas-automatico', 'roi-betting': 'roi-en-apuestas-deportivas', 'betting-regnskab': 'como-gestionar-tu-bankroll-apuestas', 'tjen-penge-paa-odds-uden-risiko': 'ganar-dinero-apuestas-sin-riesgo', 'find-surebets-automatisk': 'encontrar-surebets-automaticamente', 'live-arbitrage-betting-scanner': 'scanner-arbitrage-betting-en-vivo', 'find-value-bets-med-ai': 'encontrar-value-bets-con-ia', 'bedste-odds-vaerktoej-danmark': 'mejores-herramientas-apuestas-deportivas' },
  br: { fodbold: 'futebol', ishockey: 'hoquei-no-gelo', esport: 'esports', 'matched-betting': 'matched-betting-lucro-com-bonus', 'er-surebets-lovligt': 'surebets-sao-legais-regras-impostos', 'undgaa-begraensning': 'como-evitar-limites-casas-de-apostas', 'surebet-beregner': 'calculadora-surebet-gratis', 'odds-beregner': 'calculadora-de-odds-apostas', 'value-betting-vs-surebets': 'value-betting-vs-surebets-diferencas', 'bedste-bookmakere-til-surebets': 'melhores-casas-de-apostas-surebets', 'skat-paa-spillegevinster': 'imposto-sobre-ganhos-em-apostas', 'bankroll-management': 'bankroll-management-apostas-esportivas', 'arbitrage-betting': 'como-funciona-arbitrage-betting', 'hvad-er-surebets': 'o-que-sao-surebets', 'dutching-betting': 'dutching-apostas-multiplos-resultados', 'tennis-surebets': 'surebets-no-tenis', 'fodbold-surebets': 'surebets-no-futebol', 'bookmakerens-margin': 'margem-da-casa-de-apostas', 'asiatisk-handicap': 'handicap-asiatico-explicado', 'bet-tracker': 'planilha-de-apostas-rastreamento-automatico', 'roi-betting': 'roi-em-apostas-como-calcular', 'betting-regnskab': 'controle-de-bankroll-apostas', 'tjen-penge-paa-odds-uden-risiko': 'ganhar-dinheiro-apostas-sem-risco', 'find-surebets-automatisk': 'encontrar-surebets-automaticamente', 'live-arbitrage-betting-scanner': 'scanner-arbitrage-betting-ao-vivo', 'find-value-bets-med-ai': 'encontrar-value-bets-com-ia', 'bedste-odds-vaerktoej-danmark': 'melhores-ferramentas-apostas-esportivas' },
  pt: { fodbold: 'futebol', ishockey: 'hoquei-no-gelo', esport: 'esports', 'matched-betting': 'matched-betting-lucro-com-bonus', 'er-surebets-lovligt': 'surebets-sao-legais', 'undgaa-begraensning': 'como-evitar-limites-bookmaker', 'surebet-beregner': 'calculadora-surebet-gratis', 'odds-beregner': 'calculadora-de-odds', 'value-betting-vs-surebets': 'value-betting-vs-surebets', 'bedste-bookmakere-til-surebets': 'melhores-casas-apostas-surebets', 'skat-paa-spillegevinster': 'impostos-sobre-ganhos-apostas', 'bankroll-management': 'bankroll-management-apostas-desportivas', 'arbitrage-betting': 'como-funciona-arbitrage-betting', 'hvad-er-surebets': 'o-que-sao-surebets', 'dutching-betting': 'dutching-apostas-multiplos-resultados', 'tennis-surebets': 'surebets-no-tenis', 'fodbold-surebets': 'surebets-no-futebol', 'bookmakerens-margin': 'margem-do-bookmaker', 'asiatisk-handicap': 'handicap-asiatico-explicado', 'bet-tracker': 'registo-automatico-de-apostas', 'roi-betting': 'roi-em-apostas-desportivas', 'betting-regnskab': 'controlo-bankroll-apostas', 'tjen-penge-paa-odds-uden-risiko': 'ganhar-dinheiro-apostas-sem-risco', 'find-surebets-automatisk': 'encontrar-surebets-automaticamente', 'live-arbitrage-betting-scanner': 'live-arbitrage-betting-scanner', 'find-value-bets-med-ai': 'encontrar-value-bets-com-ia', 'bedste-odds-vaerktoej-danmark': 'melhores-ferramentas-apostas-desportivas' },
  fr: { fodbold: 'football', ishockey: 'hockey-sur-glace', esport: 'esports', 'matched-betting': 'matched-betting-bonus-bienvenue', 'er-surebets-lovligt': 'surebets-legal-france-fiscalite', 'undgaa-begraensning': 'eviter-limitations-bookmakers-comptes', 'surebet-beregner': 'calculateur-surebet-gratuit', 'odds-beregner': 'calculateur-cotes-sportives', 'value-betting-vs-surebets': 'value-betting-vs-surebets-differences', 'bedste-bookmakere-til-surebets': 'meilleurs-bookmakers-surebets', 'skat-paa-spillegevinster': 'impots-gains-paris-sportifs', 'bankroll-management': 'bankroll-management-paris-sportifs', 'arbitrage-betting': 'arbitrage-sportif-comment-ca-marche', 'hvad-er-surebets': 'surebets-paris-sans-risque', 'dutching-betting': 'dutching-repartir-mise-plusieurs-selections', 'tennis-surebets': 'surebets-tennis-trouver-jouer', 'fodbold-surebets': 'surebets-football-couvrir-trois-issues', 'bookmakerens-margin': 'marge-bookmaker-comprendre-les-cotes', 'asiatisk-handicap': 'handicap-asiatique-explique', 'bet-tracker': 'suivi-paris-sportifs-automatique', 'roi-betting': 'roi-paris-sportifs-calculer-rendement', 'betting-regnskab': 'gerer-bankroll-paris-sportifs', 'tjen-penge-paa-odds-uden-risiko': 'gagner-argent-paris-sportifs-sans-risque', 'find-surebets-automatisk': 'trouver-surebets-automatiquement-scanner', 'live-arbitrage-betting-scanner': 'scanner-arbitrage-sportif-live', 'find-value-bets-med-ai': 'trouver-value-bets-intelligence-artificielle', 'bedste-odds-vaerktoej-danmark': 'meilleurs-outils-paris-sportifs-2026' },
  it: { fodbold: 'calcio', ishockey: 'hockey-ghiaccio', esport: 'esports', 'matched-betting': 'matched-betting', 'er-surebets-lovligt': 'surebets-sono-legali', 'undgaa-begraensning': 'evitare-limitazioni-bookmaker', 'surebet-beregner': 'calcolatore-surebet-gratuito', 'odds-beregner': 'calcolatore-quote-scommesse', 'value-betting-vs-surebets': 'value-betting-vs-surebets', 'bedste-bookmakere-til-surebets': 'migliori-bookmaker-surebets', 'skat-paa-spillegevinster': 'tasse-vincite-scommesse-sportive', 'bankroll-management': 'bankroll-management-scommesse', 'arbitrage-betting': 'arbitrage-betting-come-funziona', 'hvad-er-surebets': 'cosa-sono-i-surebets', 'dutching-betting': 'dutching-betting', 'tennis-surebets': 'surebets-tennis', 'fodbold-surebets': 'surebets-calcio', 'bookmakerens-margin': 'margine-bookmaker-quote', 'asiatisk-handicap': 'handicap-asiatico-spiegato', 'bet-tracker': 'tracciare-scommesse-automaticamente', 'roi-betting': 'roi-scommesse-sportive', 'betting-regnskab': 'gestione-conti-scommesse-bankroll', 'tjen-penge-paa-odds-uden-risiko': 'guadagnare-scommesse-senza-rischio', 'find-surebets-automatisk': 'trovare-surebets-automaticamente', 'live-arbitrage-betting-scanner': 'scanner-arbitrage-betting-live', 'find-value-bets-med-ai': 'trovare-value-bets-con-ai', 'bedste-odds-vaerktoej-danmark': 'migliori-strumenti-scommesse-sportive' },
  pl: { fodbold: 'pilka-nozna', ishockey: 'hokej', basketball: 'koszykowka', esport: 'esport', 'matched-betting': 'matched-betting', 'er-surebets-lovligt': 'czy-surebety-sa-legalne', 'undgaa-begraensning': 'jak-unikac-limitow-bukmacherskich', 'surebet-beregner': 'kalkulator-surebet', 'odds-beregner': 'kalkulator-kursow-bukmacherskich', 'value-betting-vs-surebets': 'value-betting-vs-surebets', 'bedste-bookmakere-til-surebets': 'najlepsi-bukmacherzy-do-surebet', 'skat-paa-spillegevinster': 'podatek-od-wygranych-zakladow', 'bankroll-management': 'bankroll-management-zaklady-sportowe', 'arbitrage-betting': 'jak-dziala-arbitraz-bukmacherski', 'hvad-er-surebets': 'czym-sa-surebety', 'dutching-betting': 'dutching-betting', 'tennis-surebets': 'surebety-tenis', 'fodbold-surebets': 'surebety-pilka-nozna', 'bookmakerens-margin': 'marza-bukmachera', 'asiatisk-handicap': 'handicap-azjatycki', 'bet-tracker': 'tracker-zakladow-sportowych', 'roi-betting': 'roi-zaklady-sportowe', 'betting-regnskab': 'bankroll-ewidencja-zakladow', 'tjen-penge-paa-odds-uden-risiko': 'zarabianie-na-zakladach-bez-ryzyka', 'find-surebets-automatisk': 'automatyczne-znajdowanie-surebet', 'live-arbitrage-betting-scanner': 'live-arbitraz-bukmacherski-skaner', 'find-value-bets-med-ai': 'value-bety-ai-skaner-kursow', 'bedste-odds-vaerktoej-danmark': 'najlepsze-narzedzia-bukmacherskie-2026' },
  fi: { fodbold: 'jalkapallo', ishockey: 'jaakiekko', basketball: 'koripallo', tennis: 'tennis', esport: 'e-urheilu', 'matched-betting': 'matched-betting', 'er-surebets-lovligt': 'ovatko-surebetit-laillisia', 'undgaa-begraensning': 'kuinka-valttaa-bookmaker-rajoitukset', 'surebet-beregner': 'ilmainen-surebet-laskuri', 'odds-beregner': 'odds-laskuri', 'value-betting-vs-surebets': 'value-betting-vs-surebets', 'bedste-bookmakere-til-surebets': 'parhaat-bookmakerit-surebets', 'skat-paa-spillegevinster': 'vero-uhkapelituloista', 'bankroll-management': 'bankroll-management-urheiluvedot', 'arbitrage-betting': 'miten-arbitrage-betting-toimii', 'hvad-er-surebets': 'mita-ovat-surebetit', 'dutching-betting': 'dutching-betting', 'tennis-surebets': 'tennis-surebets', 'fodbold-surebets': 'jalkapallo-surebets', 'bookmakerens-margin': 'bookmaker-marginaali', 'asiatisk-handicap': 'aasialainen-handicap-selitetty', 'bet-tracker': 'vedonlyonti-seuranta-tyokalu', 'roi-betting': 'roi-betting-laskeminen', 'betting-regnskab': 'bankroll-seuranta-vedot', 'tjen-penge-paa-odds-uden-risiko': 'tienaa-urheiluvedoilla-ilman-riskia', 'find-surebets-automatisk': 'loyda-surebetit-automaattisesti', 'live-arbitrage-betting-scanner': 'live-arbitrage-betting-skanneri', 'find-value-bets-med-ai': 'loyda-value-betit-tekoalyla', 'bedste-odds-vaerktoej-danmark': 'parhaat-urheiluvedonlyonti-tyokalut' },
  nl: { fodbold: 'voetbal', ishockey: 'ijshockey', esport: 'esports', 'matched-betting': 'matched-betting-welkomstbonus-winst', 'er-surebets-lovligt': 'zijn-surebets-legaal-belasting', 'undgaa-begraensning': 'bookmaker-limieten-vermijden-account', 'surebet-beregner': 'surebet-calculator-inzet-berekenen', 'odds-beregner': 'odds-calculator-gebruiken', 'value-betting-vs-surebets': 'value-betting-vs-surebets-verschil', 'bedste-bookmakere-til-surebets': 'beste-bookmakers-voor-surebets', 'skat-paa-spillegevinster': 'belasting-gokwinsten-sportweddenschappen', 'bankroll-management': 'bankroll-management-sportweddenschappen', 'arbitrage-betting': 'arbitrage-betting-winst-elke-uitslag', 'hvad-er-surebets': 'wat-zijn-surebets-gegarandeerde-winst', 'dutching-betting': 'dutching-inzet-verdelen-uitkomsten', 'tennis-surebets': 'surebets-tennis-vinden-spelen', 'fodbold-surebets': 'surebets-voetbal-drie-uitkomsten', 'bookmakerens-margin': 'bookmaker-marge-odds-kosten', 'asiatisk-handicap': 'aziatisch-handicap-uitgelegd-lijnen', 'bet-tracker': 'weddenschappen-bijhouden-automatisch', 'roi-betting': 'roi-sportweddenschappen-berekenen', 'betting-regnskab': 'bankroll-beheren-weddenschap-overzicht', 'tjen-penge-paa-odds-uden-risiko': 'geld-verdienen-weddenschappen-zonder-risico', 'find-surebets-automatisk': 'surebets-automatisch-vinden-scanner', 'live-arbitrage-betting-scanner': 'live-arbitrage-betting-scanner-surebets', 'find-value-bets-med-ai': 'value-bets-vinden-met-ai', 'bedste-odds-vaerktoej-danmark': 'beste-sportweddenschappen-tools-2026' },
}

// Stand-alone pages that exist in every language. Keys are the canonical (Danish) paths.
export const PAGE_NAMES_BASE: Record<BaseTranslated, Record<string, string>> = {
  en: { '/om-os': '/about-us', '/kontakt': '/contact', '/dagens-surebets': '/todays-surebets', '/beregn': '/calculator', '/konto': '/account' },
  sv: { '/om-os': '/om-oss', '/kontakt': '/kontakt', '/dagens-surebets': '/dagens-surebets', '/faq': '/vanliga-fragor', '/beregn': '/kalkylator', '/konto': '/mitt-konto' },
  no: { '/om-os': '/om-oss', '/kontakt': '/kontakt-oss', '/dagens-surebets': '/dagens-surebets', '/faq': '/vanlige-sporsmal', '/beregn': '/kalkulator' },
  de: { '/om-os': '/uber-uns', '/kontakt': '/kontakt', '/dagens-surebets': '/surebets-heute', '/beregn': '/rechner', '/konto': '/mein-konto' },
  es: { '/om-os': '/sobre-nosotros', '/kontakt': '/contacto', '/dagens-surebets': '/surebets-hoy', '/beregn': '/calculadora', '/konto': '/mi-cuenta', '/faq': '/preguntas-frecuentes' },
  br: { '/om-os': '/sobre-nos', '/kontakt': '/contato', '/dagens-surebets': '/surebets-hoje', '/beregn': '/calculadora', '/konto': '/minha-conta', '/faq': '/perguntas-frequentes' },
  pt: { '/om-os': '/sobre-nos', '/kontakt': '/contactos', '/dagens-surebets': '/surebets-hoje', '/beregn': '/calculadora', '/konto': '/a-minha-conta', '/faq': '/perguntas-frequentes' },
  fr: { '/om-os': '/a-propos', '/kontakt': '/contact', '/dagens-surebets': '/surebets-du-jour', '/beregn': '/calculateur', '/konto': '/mon-compte' },
  it: { '/om-os': '/chi-siamo', '/kontakt': '/contatti', '/dagens-surebets': '/surebet-oggi', '/beregn': '/calcolatore', '/konto': '/il-mio-account', '/faq': '/domande-frequenti' },
  pl: { '/om-os': '/o-nas', '/kontakt': '/kontakt', '/dagens-surebets': '/surebety-dzis', '/beregn': '/kalkulator', '/konto': '/moje-konto', '/faq': '/czeste-pytania' },
  fi: { '/om-os': '/tietoa-meista', '/kontakt': '/yhteystiedot', '/dagens-surebets': '/paivan-surebetit', '/beregn': '/laskuri', '/konto': '/oma-tili', '/faq': '/usein-kysytyt' },
  nl: { '/om-os': '/over-ons', '/kontakt': '/contact', '/dagens-surebets': '/surebets-vandaag', '/beregn': '/calculator', '/konto': '/mijn-account', '/faq': '/veelgestelde-vragen' },
}

const PAGE_NAMES_NEW: Record<NewLocale, Record<string, string>> = {
  tr: { '/om-os': '/hakkimizda', '/kontakt': '/iletisim' },
  cs: { '/om-os': '/o-nas', '/kontakt': '/kontakt' },
  el: { '/om-os': '/sxetika-me-emas', '/kontakt': '/epikoinonia' },
  hu: { '/om-os': '/rolunk', '/kontakt': '/kapcsolat' },
  hr: { '/om-os': '/o-nama', '/kontakt': '/kontakt' },
  sk: { '/om-os': '/o-nas', '/kontakt': '/kontakt' },
  mx: { '/om-os': '/sobre-nosotros', '/kontakt': '/contacto' },
  ar: { '/om-os': '/sobre-nosotros', '/kontakt': '/contacto' },
  ch: { '/om-os': '/uber-uns', '/kontakt': '/kontakt' },
  at: { '/om-os': '/uber-uns', '/kontakt': '/kontakt' },
  be: { '/om-os': '/over-ons', '/kontakt': '/contact' },
}

const SECTION_NAMES: Record<Translated, Record<Section, string>> = {
  ...SECTION_NAMES_BASE,
  ...newLocales(SECTION_NAMES_BASE, (pack, fallback) => ({ ...fallback, ...(pack.sections as Partial<Record<Section, string>>) })),
}

const SLUGS_BASE_WITH_FALLBACKS = Object.fromEntries(
  (Object.keys(SLUGS_BASE) as BaseTranslated[]).map((locale) => [
    locale,
    { ...TRANSLATED_SLUG_FALLBACKS[locale], ...SLUGS_BASE[locale] },
  ]),
) as Record<BaseTranslated, Record<string, string>>

const SLUGS: Record<Translated, Record<string, string>> = {
  ...SLUGS_BASE_WITH_FALLBACKS,
  ...newLocales(SLUGS_BASE, (pack, fallback, locale) => ({
    ...fallback,
    ...TRANSLATED_SLUG_FALLBACKS[locale],
    ...pack.slugs,
  })),
}

const CORE_PAGE_NAMES: Partial<Record<Translated, Record<string, string>>> = {
  en: { '/stats': '/statistics', '/bonus': '/bonuses', '/surebets': '/surebets', '/faq': '/faq', '/login': '/login', '/vilkaar': '/terms', '/privatlivspolitik': '/privacy-policy', '/telegram': '/telegram' },
  sv: { '/stats': '/statistik', '/bonus': '/bonus', '/surebets': '/surebets', '/faq': '/vanliga-fragor', '/login': '/logga-in', '/konto': '/mitt-konto', '/vilkaar': '/villkor', '/privatlivspolitik': '/integritetspolicy', '/telegram': '/telegram' },
  no: { '/stats': '/statistikk', '/bonus': '/bonuser', '/surebets': '/surebets', '/faq': '/vanlige-sporsmal', '/login': '/logg-inn', '/konto': '/min-konto', '/vilkaar': '/vilkar', '/privatlivspolitik': '/personvern', '/telegram': '/telegram' },
  de: { '/stats': '/statistiken', '/bonus': '/bonusangebote', '/surebets': '/surebets', '/faq': '/haeufige-fragen', '/login': '/anmelden', '/vilkaar': '/bedingungen', '/privatlivspolitik': '/datenschutz', '/telegram': '/telegram' },
  es: { '/stats': '/estadisticas', '/bonus': '/bonos', '/surebets': '/surebets', '/faq': '/preguntas-frecuentes', '/login': '/iniciar-sesion', '/vilkaar': '/terminos', '/privatlivspolitik': '/politica-de-privacidad', '/telegram': '/telegram' },
  br: { '/stats': '/estatisticas', '/bonus': '/bonus', '/surebets': '/surebets', '/faq': '/perguntas-frequentes', '/login': '/entrar', '/vilkaar': '/termos', '/privatlivspolitik': '/politica-de-privacidade', '/telegram': '/telegram' },
  pt: { '/stats': '/estatisticas', '/bonus': '/bonus', '/surebets': '/surebets', '/faq': '/perguntas-frequentes', '/login': '/entrar', '/vilkaar': '/termos-e-condicoes', '/privatlivspolitik': '/politica-de-privacidade', '/telegram': '/telegram' },
  fr: { '/stats': '/statistiques', '/bonus': '/bonus', '/surebets': '/surebets', '/faq': '/questions-frequentes', '/login': '/connexion', '/vilkaar': '/conditions', '/privatlivspolitik': '/politique-de-confidentialite', '/telegram': '/telegram' },
  it: { '/stats': '/statistiche', '/bonus': '/bonus', '/surebets': '/surebets', '/faq': '/domande-frequenti', '/login': '/accedi', '/vilkaar': '/condizioni', '/privatlivspolitik': '/privacy', '/telegram': '/telegram' },
  pl: { '/stats': '/statystyki', '/bonus': '/bonusy', '/surebets': '/surebets', '/faq': '/czeste-pytania', '/login': '/logowanie', '/vilkaar': '/regulamin', '/privatlivspolitik': '/polityka-prywatnosci', '/telegram': '/telegram' },
  fi: { '/stats': '/tilastot', '/bonus': '/bonukset', '/surebets': '/surebetit', '/faq': '/usein-kysytyt', '/login': '/kirjaudu', '/vilkaar': '/kayttoehdot', '/privatlivspolitik': '/tietosuojakaytanto', '/telegram': '/telegram' },
  nl: { '/stats': '/statistieken', '/bonus': '/bonussen', '/surebets': '/surebets', '/faq': '/veelgestelde-vragen', '/login': '/inloggen', '/vilkaar': '/voorwaarden', '/privatlivspolitik': '/privacybeleid', '/telegram': '/telegram' },
  tr: { '/stats': '/istatistikler', '/bonus': '/bonuslar', '/surebets': '/surebetler', '/faq': '/sikca-sorulan-sorular', '/login': '/giris-yap', '/konto': '/hesabim', '/vilkaar': '/kullanim-kosullari', '/privatlivspolitik': '/gizlilik-politikasi', '/telegram': '/telegram' },
  cs: { '/stats': '/statistiky', '/bonus': '/bonusy', '/surebets': '/surebety', '/faq': '/casto-kladene-otazky', '/login': '/prihlaseni', '/konto': '/ucet', '/vilkaar': '/podminky-pouziti', '/privatlivspolitik': '/ochrana-osobnich-udaju', '/telegram': '/telegram' },
  el: { '/stats': '/statistika', '/bonus': '/bonus', '/surebets': '/surebets', '/faq': '/sychnes-erotiseis', '/login': '/syndesi', '/konto': '/logariasmos', '/vilkaar': '/oroi-chrisis', '/privatlivspolitik': '/politiki-aporritou', '/telegram': '/telegram' },
  hu: { '/stats': '/statisztikak', '/bonus': '/bonuszok', '/surebets': '/surebetek', '/faq': '/gyakori-kerdesek', '/login': '/belepes', '/konto': '/fiokom', '/vilkaar': '/felhasznalasi-feltetelek', '/privatlivspolitik': '/adatvedelmi-tajekoztato', '/telegram': '/telegram' },
  hr: { '/stats': '/statistika', '/bonus': '/bonusi', '/surebets': '/surebeti', '/faq': '/cesta-pitanja', '/login': '/prijava', '/konto': '/moj-racun', '/vilkaar': '/uvjeti-koristenja', '/privatlivspolitik': '/politika-privatnosti', '/telegram': '/telegram' },
  sk: { '/stats': '/statistiky', '/bonus': '/bonusy', '/surebets': '/surebety', '/faq': '/casto-kladene-otazky', '/login': '/prihlasenie', '/konto': '/ucet', '/vilkaar': '/podmienky-pouzivania', '/privatlivspolitik': '/ochrana-osobnych-udajov', '/telegram': '/telegram' },
  mx: { '/stats': '/estadisticas', '/bonus': '/bonos', '/surebets': '/surebets', '/faq': '/preguntas-frecuentes', '/login': '/iniciar-sesion', '/vilkaar': '/terminos', '/privatlivspolitik': '/politica-de-privacidad', '/telegram': '/telegram' },
  ar: { '/stats': '/estadisticas', '/bonus': '/bonos', '/surebets': '/surebets', '/faq': '/preguntas-frecuentes', '/login': '/iniciar-sesion', '/vilkaar': '/terminos', '/privatlivspolitik': '/politica-de-privacidad', '/telegram': '/telegram' },
  ch: { '/stats': '/statistiken', '/bonus': '/bonusangebote', '/surebets': '/surebets', '/faq': '/haeufige-fragen', '/login': '/anmelden', '/vilkaar': '/bedingungen', '/privatlivspolitik': '/datenschutz', '/telegram': '/telegram' },
  at: { '/stats': '/statistiken', '/bonus': '/bonusangebote', '/surebets': '/surebets', '/faq': '/haeufige-fragen', '/login': '/anmelden', '/vilkaar': '/bedingungen', '/privatlivspolitik': '/datenschutz', '/telegram': '/telegram' },
  be: { '/stats': '/statistieken', '/bonus': '/bonussen', '/surebets': '/surebets', '/faq': '/veelgestelde-vragen', '/login': '/inloggen', '/vilkaar': '/voorwaarden', '/privatlivspolitik': '/privacybeleid', '/telegram': '/telegram' },
}

const PAGE_NAMES_BASE_WITH_CORE = Object.fromEntries(
  (Object.keys(PAGE_NAMES_BASE) as BaseTranslated[]).map((locale) => [
    locale,
    { ...CORE_PAGE_NAMES[locale], ...PAGE_NAMES_BASE[locale] },
  ]),
) as Record<BaseTranslated, Record<string, string>>

const PAGE_NAMES: Record<Translated, Record<string, string>> = {
  ...PAGE_NAMES_BASE_WITH_CORE,
  ...newLocales(PAGE_NAMES_BASE, (pack, fallback, locale) => {
    const pages = { ...fallback, ...pack.pages, ...CORE_PAGE_NAMES[locale], ...PAGE_NAMES_NEW[locale] }
    return Object.fromEntries(
      Object.entries(pages).map(([canonical, localized]) => [canonical, localized.startsWith('/') ? localized : `/${localized}`]),
    )
  }),
}

const REVERSE_PAGE_NAMES = Object.fromEntries(
  (Object.keys(PAGE_NAMES) as Translated[]).map((locale) => [
    locale,
    Object.fromEntries(Object.entries(PAGE_NAMES[locale]).map(([canonical, localized]) => [localized, canonical])),
  ]),
) as Record<Translated, Record<string, string>>

export function isLocalizedRoute(locale: Locale, path: string) {
  if (locale === 'da') {
    const pathname = splitSuffix(path).pathname
    const [, first] = pathname.split('/')
    return pathname === '/' || isSection(first)
  }

  const pathname = splitSuffix(path).pathname
  if (pathname === '/') return true
  const [, first] = pathname.split('/')
  return (
    isSection(first) ||
    Boolean(REVERSE_SECTION[locale][first]) ||
    Boolean(PAGE_NAMES[locale][pathname]) ||
    Boolean(REVERSE_PAGE_NAMES[locale][pathname])
  )
}

const SECTIONS: Section[] = ['guide', 'sport', 'bookmaker']

function isSection(value: string): value is Section {
  return (SECTIONS as string[]).includes(value)
}

// Reverse lookups, built once.
const REVERSE_SECTION = Object.fromEntries(
  (Object.keys(SECTION_NAMES) as Translated[]).map((locale) => [
    locale,
    Object.fromEntries(Object.entries(SECTION_NAMES[locale]).map(([section, name]) => [name, section])),
  ]),
) as Record<Translated, Record<string, Section>>

const REVERSE_SLUGS = Object.fromEntries(
  (Object.keys(SLUGS) as Translated[]).map((locale) => [
    locale,
    Object.fromEntries(Object.entries(SLUGS[locale]).map(([canonical, localized]) => [localized, canonical])),
  ]),
) as Record<Translated, Record<string, string>>

function splitSuffix(path: string) {
  const index = path.search(/[?#]/)
  return index === -1 ? { pathname: path, suffix: '' } : { pathname: path.slice(0, index), suffix: path.slice(index) }
}

export function localizeSlug(locale: Locale, slug: string) {
  return locale === 'da' ? slug : (SLUGS[locale][slug] ?? slug)
}

// Canonical (Danish) path -> the public path for a language.
export function localizeRoute(locale: Locale, path: string) {
  if (locale === 'da') return path
  const { pathname, suffix } = splitSuffix(path)
  const [, section, slug, ...rest] = pathname.split('/')
  if (!section || !isSection(section)) {
    const page = PAGE_NAMES[locale][pathname]
    return page ? `${page}${suffix}` : path
  }
  const segments = [SECTION_NAMES[locale][section]]
  if (slug) segments.push(localizeSlug(locale, slug))
  return `/${[...segments, ...rest].join('/')}${suffix}`
}

// Public path for a language -> canonical (Danish) path. Danish names are accepted too,
// so old links keep resolving and can be redirected to the new address.
export function canonicalRoute(locale: Locale, path: string) {
  if (locale === 'da') return path
  const { pathname, suffix } = splitSuffix(path)
  const [, first, slug, ...rest] = pathname.split('/')
  if (!first) return path
  const section = REVERSE_SECTION[locale][first] ?? (isSection(first) ? first : undefined)
  if (!section) {
    const page = REVERSE_PAGE_NAMES[locale][pathname]
    return page ? `${page}${suffix}` : path
  }
  const segments: string[] = [section]
  if (slug) segments.push(REVERSE_SLUGS[locale][slug] ?? slug)
  return `/${[...segments, ...rest].join('/')}${suffix}`
}
