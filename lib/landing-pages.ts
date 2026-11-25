import type { GuideBlock } from '@/lib/guides'

export type LandingPage = {
  slug: string
  name: string
  title: string
  metaTitle: string
  description: string
  keyword: string
  intro: string
  blocks: GuideBlock[]
  faq: { q: string; a: string }[]
  guides: string[]
}

export const UPDATED = '2026-11-23'

export const SPORT_PAGES: LandingPage[] = [
  {
    slug: 'fodbold',
    name: 'Fodbold',
    title: 'Surebets på fodbold',
    metaTitle: 'Surebets fodbold – find sikre odds på fodboldkampe',
    description:
      'Find surebets på fodbold i realtid. BetTrackerAI scanner odds på Superligaen, Premier League og hundredvis af andre ligaer hos danske bookmakere.',
    keyword: 'surebets fodbold',
    intro:
      'Fodbold er den sport, hvor der findes flest surebets. Der spilles kampe hele døgnet, og hver kamp har hundredvis af markeder, som bookmakerne prissætter forskelligt.',
    blocks: [
      { type: 'h2', text: 'Hvorfor fodbold giver mange surebets' },
      {
        type: 'p',
        text: 'Bookmakerne skal sætte odds på tusindvis af fodboldkampe hver uge, fra Champions League til lavere rækker. Jo mindre ligaen er, jo mindre tid bruger bookmakerne på den, og jo større er chancen for prisforskelle.',
      },
      { type: 'h2', text: 'De mest brugte markeder' },
      {
        type: 'ul',
        items: [
          '1X2: hjemmesejr, uafgjort og udesejr. Tre udfald, så du skal bruge tre spil.',
          'Over/under mål, fx over eller under 2,5 mål. Kun to udfald og ofte høj likviditet.',
          'Asiatisk handicap: to udfald og lav margin, men læs reglerne for halve og hele mål grundigt.',
          'Begge hold scorer: ja eller nej. Et simpelt marked med to udfald.',
        ],
      },
      {
        type: 'tip',
        text: 'Tjek altid, om markedet gælder for ordinær spilletid. Forlænget spilletid og straffespark tæller sjældent med i fodbold.',
      },
      { type: 'h2', text: 'Hvornår opstår surebets?' },
      {
        type: 'p',
        text: 'Mange fodbold-surebets opstår, når holdopstillingerne bliver offentliggjort cirka en time før kampstart. Nogle bookmakere justerer hurtigt, andre er langsommere, og i det vindue opstår prisforskellene.',
      },
    ],
    faq: [
      {
        q: 'Hvilke fodboldligaer har flest surebets?',
        a: 'De mindre ligaer giver ofte højere profit, men de store ligaer som Premier League og Superligaen har flere markeder og højere maksimale indsatser.',
      },
      {
        q: 'Kan man spille surebets på live fodbold?',
        a: 'Ja, men live-odds ændrer sig meget hurtigt. Det kræver, at du placerer begge spil på få sekunder.',
      },
    ],
    guides: ['hvad-er-surebets', 'surebet-beregner', 'undgaa-begraensning'],
  },
  {
    slug: 'tennis',
    name: 'Tennis',
    title: 'Surebets på tennis',
    metaTitle: 'Surebets tennis – sikre odds på ATP, WTA og Challenger',
    description:
      'Tennis er perfekt til surebets: kun to udfald og kampe hele året. Find tennis-surebets på ATP, WTA og Challenger hos danske bookmakere.',
    keyword: 'surebets tennis',
    intro:
      'Tennis er mange surebetteres foretrukne sport. Der er kun to udfald, ingen uafgjort, og der spilles turneringer næsten hver eneste dag året rundt.',
    blocks: [
      { type: 'h2', text: 'Fordelene ved tennis' },
      {
        type: 'ul',
        items: [
          'Kun to udfald, så du skal kun placere to spil.',
          'Ingen uafgjort, hvilket gør beregningen enkel.',
          'Mange kampe på Challenger- og ITF-niveau, hvor bookmakerne ofte er uenige.',
          'Kampe døgnet rundt på grund af turneringer i forskellige tidszoner.',
        ],
      },
      { type: 'h2', text: 'Pas på opgivne kampe' },
      {
        type: 'p',
        text: 'Den største risiko i tennis er, når en spiller opgiver kampen. Bookmakerne har forskellige regler: nogle annullerer spillet, andre afgør det, hvis første sæt er spillet færdigt. Bruger dine to bookmakere forskellige regler, kan du tabe begge spil.',
      },
      {
        type: 'tip',
        text: 'Læs bookmakernes regler for opgivne tenniskampe, før du spiller dit første tennis-surebet.',
      },
      { type: 'h2', text: 'Andre markeder' },
      {
        type: 'p',
        text: 'Ud over vinderen af kampen findes der surebets på antal partier, sæt-handicap og vinderen af enkelte sæt. Disse markeder har ofte lavere maksimale indsatser.',
      },
    ],
    faq: [
      {
        q: 'Er tennis godt til surebets?',
        a: 'Ja. Kun to udfald og mange kampe gør tennis til en af de bedste sportsgrene til surebets, især for begyndere.',
      },
      {
        q: 'Hvad sker der, hvis en spiller opgiver?',
        a: 'Det afhænger af bookmakeren. Nogle annullerer alle spil, andre afgør dem, hvis et bestemt antal sæt er spillet. Tjek reglerne hos begge bookmakere.',
      },
    ],
    guides: ['hvad-er-surebets', 'surebet-beregner', 'bedste-bookmakere-til-surebets'],
  },
  {
    slug: 'basketball',
    name: 'Basketball',
    title: 'Surebets på basketball',
    metaTitle: 'Surebets basketball – sikre odds på NBA og Euroleague',
    description:
      'Find surebets på basketball fra NBA, Euroleague og europæiske ligaer. Point-markeder og handicap giver mange muligheder hos danske bookmakere.',
    keyword: 'surebets basketball',
    intro:
      'Basketball giver mange surebets på point og handicap. NBA har et stort udvalg af markeder, og bookmakerne flytter deres linjer i forskelligt tempo.',
    blocks: [
      { type: 'h2', text: 'Populære markeder' },
      {
        type: 'ul',
        items: [
          'Vinder inklusive overtid: to udfald og enkel beregning.',
          'Over/under samlet point, fx over eller under 215,5.',
          'Point-handicap, hvor favoritten skal vinde med et bestemt antal point.',
          'Spillerspecifikke markeder som point, rebounds og assists.',
        ],
      },
      { type: 'h2', text: 'Mellemspil på point' },
      {
        type: 'p',
        text: 'Ved point-markeder kan to bookmakere have forskellige linjer, fx over 214,5 hos den ene og under 216,5 hos den anden. Ender kampen på 215 eller 216 point, vinder du begge spil. Det kaldes et "middle" og er en ekstra bonus ved basketball.',
      },
      {
        type: 'tip',
        text: 'Tjek, om overtid tæller med. I basketball gør det det næsten altid, men ikke hos alle bookmakere på alle markeder.',
      },
    ],
    faq: [
      {
        q: 'Tæller overtid med i basketball-surebets?',
        a: 'For de fleste markeder ja, men tjek altid reglerne. Et marked uden overtid kan ikke kombineres med et marked inklusive overtid.',
      },
      {
        q: 'Hvornår spilles NBA-kampe i dansk tid?',
        a: 'De fleste NBA-kampe spilles om natten dansk tid, så mange surebets opstår om aftenen før kampene.',
      },
    ],
    guides: ['hvad-er-surebets', 'arbitrage-betting', 'value-betting-vs-surebets'],
  },
  {
    slug: 'ishockey',
    name: 'Ishockey',
    title: 'Surebets på ishockey',
    metaTitle: 'Surebets ishockey – sikre odds på NHL og Metal Ligaen',
    description:
      'Surebets på ishockey fra NHL, SHL og Metal Ligaen. Lær forskellen på markeder med og uden overtid, og find sikre odds hos danske bookmakere.',
    keyword: 'surebets ishockey',
    intro:
      'Ishockey er en undervurderet sport til surebets. Mange bookmakere prissætter de nordiske ligaer forskelligt, og forskellen mellem markeder med og uden overtid giver ekstra muligheder.',
    blocks: [
      { type: 'h2', text: 'Ordinær tid eller inklusive overtid?' },
      {
        type: 'p',
        text: 'I ishockey findes både 1X2 for ordinær spilletid og et vindermarked inklusive overtid og straffeslag. De to må aldrig blandes i samme surebet. Kontrollér altid, hvilket marked du spiller på hos hver bookmaker.',
      },
      { type: 'h2', text: 'Gode ligaer til surebets' },
      {
        type: 'ul',
        items: [
          'NHL: mange kampe og høje maksimale indsatser.',
          'SHL og Liiga: populære i Norden og prissat forskelligt hos bookmakerne.',
          'Metal Ligaen: dansk liga, hvor de danske bookmakere ofte er uenige.',
        ],
      },
      {
        type: 'tip',
        text: 'Ishockey har ofte høj profit pr. surebet, men lavere maksimale indsatser end fodbold.',
      },
    ],
    faq: [
      {
        q: 'Kan man kombinere 1X2 og vinder inkl. overtid?',
        a: 'Nej. Det er to forskellige markeder. Kombinerer du dem, kan du tabe begge spil, hvis kampen går i overtid.',
      },
      {
        q: 'Er der surebets på Metal Ligaen?',
        a: 'Ja. Danske bookmakere prissætter Metal Ligaen forskelligt, så der opstår jævnligt muligheder.',
      },
    ],
    guides: ['hvad-er-surebets', 'surebet-beregner', 'bankroll-management'],
  },
  {
    slug: 'esport',
    name: 'Esport',
    title: 'Surebets på esport',
    metaTitle: 'Surebets esport – sikre odds på CS2, LoL og Dota 2',
    description:
      'Esport er en af de hurtigst voksende sportsgrene til surebets. Find sikre odds på CS2, League of Legends og Dota 2 hos danske bookmakere.',
    keyword: 'surebets esport',
    intro:
      'Esport har store prisforskelle mellem bookmakerne. Markedet er nyt, mange bookmakere har færre eksperter på området, og odds bevæger sig ofte kraftigt før kampstart.',
    blocks: [
      { type: 'h2', text: 'Hvorfor esport giver høj profit' },
      {
        type: 'p',
        text: 'Bookmakerne bruger færre ressourcer på esport end på fodbold, og nyheder om holdopstillinger spredes hurtigt i fællesskabet. Det giver større forskelle i odds og ofte højere profit pr. surebet.',
      },
      { type: 'h2', text: 'Populære spil' },
      {
        type: 'ul',
        items: [
          'Counter-Strike 2: flest kampe og markeder for kort- og rundehandicap.',
          'League of Legends: store turneringer med stabile markeder.',
          'Dota 2: høje odds-forskelle, men lavere maksimale indsatser.',
        ],
      },
      {
        type: 'tip',
        text: 'Hold øje med kampe, der bliver udsat. Bookmakerne har forskellige regler for, hvor længe et spil står ved magt.',
      },
    ],
    faq: [
      {
        q: 'Er esport godt til surebets?',
        a: 'Ja, profitten er ofte højere end i traditionel sport. Til gengæld er de maksimale indsatser lavere.',
      },
      {
        q: 'Hvilke bookmakere tilbyder esport?',
        a: 'De fleste store danske bookmakere tilbyder esport, især CS2 og League of Legends.',
      },
    ],
    guides: ['hvad-er-surebets', 'value-betting-vs-surebets', 'undgaa-begraensning'],
  },
]

function bookmakerPage(slug: string, name: string, intro: string, about: string, faqExtra: { q: string; a: string }): LandingPage {
  return {
    slug,
    name,
    title: `Surebets hos ${name}`,
    metaTitle: `${name} surebets – find sikre odds hos ${name}`,
    description: `Find surebets hos ${name} i realtid. BetTrackerAI sammenligner ${name}s odds med andre danske bookmakere og viser, hvor du kan låse en gevinst fast.`,
    keyword: `${name.toLowerCase()} surebets`,
    intro,
    blocks: [
      { type: 'h2', text: `Om ${name}` },
      { type: 'p', text: about },
      { type: 'h2', text: `Sådan finder du surebets med ${name}` },
      {
        type: 'p',
        text: `Et surebet med ${name} opstår, når ${name} har en højere odds på ét udfald, end andre bookmakere har på de modsatte udfald. BetTrackerAI holder øje med ${name}s odds hele tiden og sammenligner dem med resten af markedet.`,
      },
      {
        type: 'ul',
        items: [
          `Vælg ${name} og dine øvrige bookmakere under filteret på surebets-siden.`,
          'Sortér efter profit, og vælg et surebet med stabile odds.',
          'Brug beregneren til at fordele indsatsen, og rund beløbet af.',
          `Placér spillet hos den bookmaker med den mest ustabile odds først.`,
        ],
      },
      {
        type: 'tip',
        text: `Spred dit spil over flere bookmakere, så du ikke kun bruger ${name}. Det forlænger levetiden på din konto.`,
      },
    ],
    faq: [
      {
        q: `Må man spille surebets hos ${name}?`,
        a: `Ja, det er lovligt. Som alle bookmakere kan ${name} dog begrænse konti efter sine vilkår, hvis de kun spiller med garanteret gevinst.`,
      },
      faqExtra,
    ],
    guides: ['undgaa-begraensning', 'bedste-bookmakere-til-surebets', 'surebet-beregner'],
  }
}

export const BOOKMAKER_PAGES: LandingPage[] = [
  bookmakerPage(
    'bet365',
    'Bet365',
    'Bet365 er en af verdens største bookmakere og har et af de bredeste udvalg af sportsgrene og markeder. Det gør Bet365 til en af de bookmakere, der oftest indgår i surebets.',
    'Bet365 har dansk licens og tilbyder odds på et meget stort antal kampe, også i mindre ligaer og på live-markeder. Bredden betyder, at Bet365 ofte har odds, som skiller sig ud fra resten af markedet.',
    { q: 'Har Bet365 dansk licens?', a: 'Ja. Bet365 har licens fra Spillemyndigheden, så gevinster er som udgangspunkt skattefrie.' },
  ),
  bookmakerPage(
    'unibet',
    'Unibet',
    'Unibet er en af de mest populære bookmakere i Danmark. Unibet bruger Kambi-platformen, så odds hos Unibet ligner ofte odds hos andre Kambi-bookmakere.',
    'Unibet har dansk licens og et bredt udvalg af sportsgrene. Fordi Unibet deler odds-platform med flere andre bookmakere, opstår surebets oftest mellem Unibet og bookmakere på andre platforme.',
    { q: 'Hvilke bookmakere ligner Unibet?', a: 'Unibet bruger Kambi, som også leverer odds til flere andre bookmakere. Kombinér derfor Unibet med bookmakere på andre platforme for at finde flere surebets.' },
  ),
  bookmakerPage(
    'nordicbet',
    'NordicBet',
    'NordicBet er en nordisk bookmaker med stærkt fokus på skandinavisk sport. Det gør NordicBet interessant til surebets på dansk, svensk og norsk fodbold og ishockey.',
    'NordicBet har dansk licens og tilhører samme koncern som Betsson. Udvalget af nordiske ligaer er stort, og her er NordicBet ofte uenig med de internationale bookmakere.',
    { q: 'Er NordicBet og Betsson det samme?', a: 'De tilhører samme koncern og har ofte ens odds. Et surebet mellem NordicBet og Betsson er derfor sjældent.' },
  ),
  bookmakerPage(
    'leovegas',
    'LeoVegas',
    'LeoVegas er kendt for sit casino, men har også et stort sportsudvalg. Bookmakeren bruger Kambi-platformen og indgår jævnligt i surebets.',
    'LeoVegas har dansk licens og en brugervenlig app, som gør det hurtigt at placere spil. Det er vigtigt ved surebets, hvor odds kan ændre sig på sekunder.',
    { q: 'Er LeoVegas god til surebets?', a: 'LeoVegas er en god supplerende bookmaker, især i kombination med bookmakere uden for Kambi-platformen.' },
  ),
  bookmakerPage(
    'betano',
    'Betano',
    'Betano er en af de nyere bookmakere på det danske marked og bruger sin egen odds-platform. Det betyder, at Betanos odds ofte afviger fra resten af markedet.',
    'Betano har dansk licens og et bredt udvalg af sportsgrene. Fordi Betano sætter odds på sin egen måde, indgår Betano ofte i surebets med de etablerede bookmakere.',
    { q: 'Har Betano dansk licens?', a: 'Ja. Betano har licens fra Spillemyndigheden.' },
  ),
  bookmakerPage(
    'danske-spil',
    'Danske Spil',
    'Danske Spil står bag Oddset, Danmarks ældste spiludbyder på sport. Oddset har egne odds og reagerer ofte anderledes på markedet end de internationale bookmakere.',
    'Oddset fra Danske Spil har dansk licens og et stort fokus på dansk sport. Oddsene er ofte lidt lavere end hos konkurrenterne, men på enkelte kampe kan Oddset ligge højt og skabe et surebet.',
    { q: 'Er Oddset og Danske Spil det samme?', a: 'Ja. Oddset er Danske Spils sportsbetting. Du spiller med din Danske Spil-konto.' },
  ),
]

export function getSportPage(slug: string) {
  return SPORT_PAGES.find((page) => page.slug === slug)
}

export function getBookmakerPage(slug: string) {
  return BOOKMAKER_PAGES.find((page) => page.slug === slug)
}
