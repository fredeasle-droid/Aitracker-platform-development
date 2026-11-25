import type { Locale } from '@/lib/i18n'

export const BONUS_CATEGORIES = ['Velkomstbonus'] as const
export type BonusCategory = (typeof BONUS_CATEGORIES)[number]

export type BonusOffer = {
  bookmaker: string
  title: string
  highlights: readonly string[]
  tags: readonly BonusCategory[]
  terms: readonly string[]
  url: string
  status: 'reported' | 'verify' | 'restricted'
}

const reported = (bookmaker: string, url: string, title: string, terms: readonly string[]): BonusOffer => ({
  bookmaker,
  url,
  title,
  highlights: [title],
  tags: ['Velkomstbonus'],
  terms,
  status: 'reported',
})

const verify = (bookmaker: string, url: string): BonusOffer => ({
  bookmaker,
  url,
  title: 'Check the current local offer',
  highlights: ['Offer not independently confirmed'],
  tags: ['Velkomstbonus'],
  terms: ['Open the bookmaker’s official country site and check its current promotion terms before registering.'],
  status: 'verify',
})

const restricted = (bookmaker: string, url: string): BonusOffer => ({
  bookmaker,
  url,
  title: 'No verified welcome bonus',
  highlights: ['No public welcome offer confirmed for this market'],
  tags: ['Velkomstbonus'],
  terms: ['Promotions may be restricted by local rules. Check the regulator and the operator’s official terms.'],
  status: 'restricted',
})

const offersByLocale: Record<Locale, readonly BonusOffer[]> = {
  da: [verify('Danske Spil', 'https://danskespil.dk/oddset'), verify('Bet365', 'https://www.bet365.dk')],
  en: [verify('Bet365', 'https://www.bet365.com'), verify('William Hill', 'https://www.williamhill.com')],
  sv: [reported('ATG', 'https://www.atg.se', '100 kr welcome offer reported', ['Reported conditions: a 50 kr deposit and a qualifying 1 kr bet. Confirm eligibility on ATG’s Swedish site.']), verify('Svenska Spel', 'https://www.svenskaspel.se')],
  no: [restricted('Norsk Tipping', 'https://www.norsk-tipping.no'), restricted('Norsk Rikstoto', 'https://www.rikstoto.no')],
  de: [reported('Tipico', 'https://www.tipico.de', '100% up to €100', ['Reported terms: 10x wagering at minimum odds 1.50 within 30 days. Confirm the live promotion and full terms on Tipico.de.']), reported('Interwetten', 'https://www.interwetten.de', '100% up to €100', ['Reported terms: deposit wagering in 5 stages at minimum odds 1.70 within 14 days. Confirm the live promotion on Interwetten.de.'])],
  es: [reported('Sportium', 'https://www.sportium.es', 'Welcome offer up to €200', ['Reported as two deposit matches up to €100 each. Eligibility, promo code and wagering terms vary; confirm on Sportium.es.']), reported('Codere', 'https://www.codere.es', '100% first-deposit offer reported', ['Reported package up to €200. The split between sports and casino and all terms must be confirmed on Codere.es.'])],
  br: [restricted('Betano', 'https://www.betano.bet.br'), restricted('Bet365', 'https://www.bet365.bet.br')],
  pt: [reported('Betclic', 'https://www.betclic.pt', 'Up to €50 in free bets', ['Reported welcome challenges; qualifying bets and odds requirements vary. Confirm the active promotion on Betclic.pt.']), reported('Betano', 'https://www.betano.pt', 'New-customer offer varies', ['A fixed 100% match was not confirmed. Check the current Portugal-specific offer and terms on Betano.pt.'])],
  fr: [reported('Winamax', 'https://www.winamax.fr', 'First losing bet refunded up to €100', ['Reported welcome offer; refund format and qualifying conditions can change. Confirm on Winamax.fr.']), reported('Betclic', 'https://www.betclic.fr', 'First losing bet refunded up to €100', ['Reported welcome offer; refund format and qualifying conditions can change. Confirm on Betclic.fr.'])],
  it: [reported('SNAI', 'https://www.snai.it', 'Sports welcome offer reported up to €100', ['Reported as part of a broader welcome package. Confirm the current sports-specific offer and terms on SNAI.it.']), verify('Sisal', 'https://www.sisal.it')],
  pl: [reported('STS', 'https://www.sts.pl', '100% first-deposit bonus up to 100 zł reported', ['Reported terms include bonus activation and qualifying turnover. Check the currently available code and full terms on STS.pl.']), verify('Fortuna', 'https://www.efortuna.pl')],
  fi: [verify('Veikkaus', 'https://www.veikkaus.fi'), verify('Paf', 'https://www.paf.com')],
  nl: [reported('Unibet', 'https://www.unibet.nl', '5 × €10 free bets reported', ['Reported after a qualifying €10 bet. Check current age, odds, eligibility and expiry terms on Unibet.nl.']), reported('BetCity', 'https://www.betcity.nl', '5 × €10 free bets reported', ['Reported after a qualifying €10 bet at minimum odds 1.50. Confirm validity and terms on BetCity.nl.'])],
  tr: [restricted('Nesine', 'https://www.nesine.com'), restricted('Misli', 'https://www.misli.com')],
  cs: [reported('Tipsport', 'https://www.tipsport.cz', 'New-customer bonus reported', ['Promotional value and qualification vary by campaign. Check current sports-betting terms on Tipsport.cz.']), reported('Fortuna', 'https://www.ifortuna.cz', 'Free-bet offer reported', ['Reported welcome offer; confirm current amount, odds and expiry terms on Fortuna.cz.'])],
  el: [reported('Stoiximan', 'https://www.stoiximan.gr', '100% first-deposit bonus up to €500 reported', ['Reported wagering: 5x on qualifying odds. Confirm expiry, eligible markets and full terms on Stoiximan.gr.']), reported('Superbet', 'https://www.superbet.gr', '100% first-deposit bonus up to €300 reported', ['Reported wagering: 5x on qualifying odds. Confirm current offer and full terms on Superbet.gr.'])],
  hu: [restricted('Tippmix', 'https://www.tippmix.hu'), verify('TippmixPro', 'https://www.tippmixpro.hu')],
  hr: [reported('Admiral', 'https://www.admiral.hr', 'New-customer free-bet offer reported', ['Reported offer depends on the first deposit and qualifying ticket. Check current local terms on Admiral.hr.']), verify('SuperSport', 'https://www.supersport.hr')],
  sk: [reported('Niké', 'https://www.nike.sk', '€20 bonus bet reported', ['Reported welcome package; identity verification and other conditions apply. Confirm active terms on Niké.sk.']), reported('Fortuna', 'https://www.ifortuna.sk', 'Welcome free bet reported', ['The amount and qualifying conditions vary. Confirm the current Slovakia offer on Fortuna.sk.'])],
  mx: [reported('Caliente', 'https://www.caliente.mx', '100% first-deposit bonus up to MXN 7,000 reported', ['Reported terms: 3x rollover, minimum odds 1.50 and 7-day completion window. Confirm the current offer and eligibility on Caliente.mx.']), reported('Codere', 'https://www.codere.mx', '100% first-deposit bonus up to MXN 7,000 reported', ['Reported terms: minimum deposit MXN 200 and 3x rollover within 30 days. Confirm the current offer on Codere.mx.'])],
  ar: [reported('Codere', 'https://www.codere.bet.ar', 'Welcome package up to ARS 525,000 reported', ['Reported package combines casino bonus and sports free bets. Availability and rules depend on jurisdiction; verify on the licensed local site.']), reported('bplay', 'https://www.bplay.bet.ar', 'Welcome offer ARS 25,000 reported', ['Reported offer; provincial availability and terms vary. Confirm eligibility on the official site for your jurisdiction.'])],
  ch: [restricted('Swisslos', 'https://www.swisslos.ch'), restricted('Loterie Romande', 'https://www.loro.ch')],
  at: [reported('Admiral', 'https://www.admiral.at', '100% first-deposit bonus up to €200 reported', ['Reported terms include a €20 minimum deposit and 5x wagering at minimum odds 1.90. Confirm the live offer on Admiral.at.']), verify('Bwin', 'https://sports.bwin.at')],
  be: [restricted('Napoleon Sports', 'https://www.napoleonsports.be'), restricted('Unibet', 'https://www.unibet.be')],
}

export function getBonusOffers(locale: Locale): readonly BonusOffer[] {
  return offersByLocale[locale]
}
