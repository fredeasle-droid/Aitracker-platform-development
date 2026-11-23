export type GuideBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'example'; title: string; rows: [string, string][]; note?: string }
  | { type: 'tip'; text: string }

export type Guide = {
  slug: string
  title: string
  metaTitle: string
  description: string
  keyword: string
  category: 'Grundlæggende' | 'Strategi' | 'Regler'
  readMinutes: number
  updated: string
  intro: string
  blocks: GuideBlock[]
  faq: { q: string; a: string }[]
  cta: { href: string; label: string }
}

export const GUIDES: Guide[] = [
  {
    slug: 'hvad-er-surebets',
    title: 'Hvad er surebets? Sådan virker sikre odds',
    metaTitle: 'Hvad er surebets? Komplet guide til sikre odds (2026)',
    description:
      'Lær hvad surebets er, hvordan de opstår, og hvordan du spiller på alle udfald hos forskellige bookmakere for at få en garanteret gevinst.',
    keyword: 'hvad er surebets',
    category: 'Grundlæggende',
    readMinutes: 6,
    updated: '2026-11-23',
    intro:
      'Et surebet er en kombination af odds hos forskellige bookmakere, hvor du kan spille på alle mulige udfald af en kamp og stadig vinde, uanset hvordan det ender. Det lyder for godt til at være sandt, men det er ren matematik.',
    blocks: [
      { type: 'h2', text: 'Hvorfor findes surebets?' },
      {
        type: 'p',
        text: 'Bookmakere sætter deres odds uafhængigt af hinanden. De bruger forskellige modeller, reagerer forskelligt på nyheder og vil gerne tiltrække spil på bestemte udfald. Derfor kan én bookmaker give høje odds på hjemmeholdet, mens en anden giver høje odds på udeholdet. Når forskellen bliver stor nok, opstår et surebet.',
      },
      {
        type: 'p',
        text: 'Surebets lever typisk kun i minutter. Så snart bookmakerne justerer deres odds, forsvinder muligheden. Derfor kræver det enten mange timers manuel søgning eller en scanner, der holder øje med markedet hele tiden.',
      },
      { type: 'h2', text: 'Sådan ser du, om det er et surebet' },
      {
        type: 'p',
        text: 'Du regner den omvendte værdi af hver odds ud (1 divideret med odds) og lægger dem sammen. Er summen under 1, har du et surebet. Jo lavere summen er, jo større er din profit.',
      },
      {
        type: 'example',
        title: 'Eksempel: tennis med to udfald',
        rows: [
          ['Spiller A hos bookmaker 1', 'odds 2,10'],
          ['Spiller B hos bookmaker 2', 'odds 2,05'],
          ['1/2,10 + 1/2,05', '0,476 + 0,488 = 0,964'],
          ['Garanteret profit', 'ca. 3,7 %'],
        ],
        note: 'Summen er under 1, så kombinationen er et surebet.',
      },
      { type: 'h2', text: 'Hvordan fordeler man indsatsen?' },
      {
        type: 'p',
        text: 'Indsatsen skal fordeles, så udbetalingen bliver den samme, uanset hvem der vinder. Med en samlet indsats på 1.000 kr. i eksemplet ovenfor sætter du ca. 494 kr. på spiller A og ca. 506 kr. på spiller B. Begge udfald giver ca. 1.037 kr. tilbage, altså en profit på ca. 37 kr.',
      },
      {
        type: 'tip',
        text: 'Du behøver ikke regne selv. Vores gratis surebet beregner fordeler indsatsen automatisk og viser din garanterede profit.',
      },
      { type: 'h2', text: 'Hvad skal du være opmærksom på?' },
      {
        type: 'ul',
        items: [
          'Odds kan ændre sig, mens du placerer dine spil. Placér det spil med den mest ustabile odds først.',
          'Tjek at markedet er præcis det samme hos begge bookmakere, fx om forlænget spilletid tæller med.',
          'Hav penge stående hos flere bookmakere, så du kan handle hurtigt.',
          'Bookmakere kan begrænse konti, der kun spiller surebets. Læs vores guide til at undgå begrænsning.',
        ],
      },
    ],
    faq: [
      {
        q: 'Er surebets risikofrie?',
        a: 'Matematisk er gevinsten sikret, når begge spil er placeret til de rigtige odds. Risikoen ligger i praksis: odds der ændrer sig, annullerede spil eller fejl i markedet.',
      },
      {
        q: 'Hvor meget kan man tjene på surebets?',
        a: 'De fleste surebets giver mellem 1 og 5 % af indsatsen. Gevinsten kommer af at gøre det mange gange, ikke af enkelte store gevinster.',
      },
      {
        q: 'Hvordan finder man surebets?',
        a: 'Du kan sammenligne odds manuelt, men det er langsomt. En surebet-scanner som BetTrackerAI overvåger bookmakerne og viser mulighederne, så snart de opstår.',
      },
    ],
    cta: { href: '/surebets', label: 'Se aktuelle surebets' },
  },
  {
    slug: 'arbitrage-betting',
    title: 'Arbitrage betting i Danmark: den komplette guide',
    metaTitle: 'Arbitrage betting i Danmark – guide til betting arbitrage',
    description:
      'Arbitrage betting forklaret på dansk: hvad det er, hvordan du kommer i gang, hvilke bookmakere du skal bruge, og hvordan du holder styr på din bankroll.',
    keyword: 'arbitrage betting',
    category: 'Strategi',
    readMinutes: 7,
    updated: '2026-11-23',
    intro:
      'Arbitrage betting er den engelske betegnelse for at spille surebets. Ideen er den samme som på finansmarkederne: du udnytter en prisforskel mellem to markeder og låser en gevinst fast, før markedet retter sig.',
    blocks: [
      { type: 'h2', text: 'Sådan kommer du i gang' },
      {
        type: 'ul',
        items: [
          'Opret konti hos flere danske bookmakere med licens fra Spillemyndigheden. Jo flere, jo flere muligheder.',
          'Sæt en startbankroll ind, som du fordeler mellem bookmakerne.',
          'Brug en scanner til at finde muligheder i realtid i stedet for at sammenligne odds manuelt.',
          'Brug en beregner, så indsatsen altid fordeles korrekt.',
          'Før regnskab over hvert spil, så du kan se din reelle profit.',
        ],
      },
      { type: 'h2', text: 'Hvor stor en bankroll skal man have?' },
      {
        type: 'p',
        text: 'Du kan starte med et par tusinde kroner, men det bliver lettere med mere. Pengene skal stå fordelt hos mange bookmakere på samme tid, og et surebet kræver indsats hos to eller tre af dem samtidig. Med en lille bankroll vil du ofte mangle penge det rigtige sted.',
      },
      { type: 'h2', text: 'Tid er den vigtigste faktor' },
      {
        type: 'p',
        text: 'Arbitrage opstår, fordi bookmakerne ikke opdaterer deres odds på samme tid. Det betyder også, at muligheden lukker hurtigt. Derfor er det afgørende at få besked med det samme, fx via push-notifikationer eller SMS, og at have konti klar med penge på.',
      },
      {
        type: 'tip',
        text: 'Slå alarmer til med en minimumsprofit, så du kun bliver forstyrret af de muligheder, der er værd at handle på.',
      },
      { type: 'h2', text: 'Almindelige fejl' },
      {
        type: 'ul',
        items: [
          'At spille på to markeder, der ligner hinanden, men ikke er ens (fx asiatisk handicap mod almindeligt handicap).',
          'At glemme at runde indsatsen af til hele kroner, så det ser mindre automatisk ud.',
          'At placere det første spil og opdage, at den anden odds er faldet.',
          'At lade gevinster stå ujævnt fordelt, så man ikke kan dække det næste surebet.',
        ],
      },
    ],
    faq: [
      {
        q: 'Hvad er forskellen på arbitrage betting og surebets?',
        a: 'Der er ingen forskel. Arbitrage betting er den engelske betegnelse, og surebets er det, man i Danmark oftest kalder de enkelte muligheder.',
      },
      {
        q: 'Kan man leve af arbitrage betting?',
        a: 'Nogle få kan, men for de fleste er det en sideindtægt. Bookmakernes begrænsninger og den nødvendige bankroll gør det svært at skalere.',
      },
    ],
    cta: { href: '/surebets', label: 'Find arbitrage-muligheder nu' },
  },
  {
    slug: 'surebet-beregner',
    title: 'Surebet beregner: sådan fordeler du indsatsen korrekt',
    metaTitle: 'Surebet beregner – fordel indsatsen og se din profit',
    description:
      'Se formlen bag en surebet beregner, og lær at fordele indsatsen på to eller tre udfald, så du får samme udbetaling uanset resultatet.',
    keyword: 'surebet beregner',
    category: 'Grundlæggende',
    readMinutes: 5,
    updated: '2026-11-23',
    intro:
      'En surebet beregner fortæller dig, hvor meget du skal sætte på hvert udfald, så udbetalingen bliver den samme, uanset hvordan kampen ender. Her er formlen, så du forstår, hvad beregneren gør.',
    blocks: [
      { type: 'h2', text: 'Formlen' },
      {
        type: 'p',
        text: 'Læg først de omvendte odds sammen: 1/odds A + 1/odds B (+ 1/odds C ved tre udfald). Kald summen S. Indsatsen på hvert udfald er så den samlede indsats gange 1/odds for udfaldet, divideret med S.',
      },
      {
        type: 'example',
        title: 'Eksempel: fodbold med tre udfald (1X2), samlet indsats 1.000 kr.',
        rows: [
          ['Hjemmesejr, odds 2,60', 'indsats ca. 375 kr.'],
          ['Uafgjort, odds 3,70', 'indsats ca. 264 kr.'],
          ['Udesejr, odds 2,70', 'indsats ca. 361 kr.'],
          ['S = 0,385 + 0,270 + 0,370', '1,025 (ikke et surebet)'],
        ],
        note: 'Summen er over 1, så her vil du tabe ca. 2,5 % uanset udfaldet. Beregneren viser det med det samme, så du undgår dårlige kombinationer.',
      },
      { type: 'h2', text: 'Afrunding af indsatsen' },
      {
        type: 'p',
        text: 'Indsatser som 493,98 kr. kan få bookmakeren til at lægge mærke til, at du bruger en beregner. Rund af til hele eller halve tiere. Det koster lidt profit, men gør dine spil mere naturlige.',
      },
      {
        type: 'tip',
        text: 'I BetTrackerAI-beregneren kan du rette odds direkte og se, hvordan fordelingen og profitten ændrer sig med det samme.',
      },
    ],
    faq: [
      {
        q: 'Virker beregneren også med tre udfald?',
        a: 'Ja. Formlen er den samme. Du lægger bare den tredje omvendte odds med i summen og fordeler indsatsen på tre spil.',
      },
      {
        q: 'Er beregneren gratis?',
        a: 'Ja. Beregneren på BetTrackerAI kan bruges gratis.',
      },
    ],
    cta: { href: '/beregn', label: 'Åbn surebet beregneren' },
  },
  {
    slug: 'matched-betting',
    title: 'Matched betting i Danmark: få mest ud af velkomstbonusser',
    metaTitle: 'Matched betting Danmark – sådan udnytter du bonusser',
    description:
      'Matched betting forklaret: sådan bruger du velkomstbonusser og freebets hos danske bookmakere til at låse en gevinst fast, og hvordan det adskiller sig fra surebets.',
    keyword: 'matched betting danmark',
    category: 'Strategi',
    readMinutes: 6,
    updated: '2026-11-23',
    intro:
      'Matched betting handler om at omsætte bookmakernes bonusser og freebets til rigtige penge. Du dækker dit spil af hos en anden bookmaker eller en spillebørs, så du ikke er afhængig af resultatet.',
    blocks: [
      { type: 'h2', text: 'Sådan virker det' },
      {
        type: 'p',
        text: 'Når du får et freebet, spiller du det på ét udfald og dækker de andre udfald hos en anden bookmaker. Fordi freebettet ikke koster dig noget, kan du låse størstedelen af dets værdi fast som gevinst.',
      },
      { type: 'h2', text: 'Danske bonusregler' },
      {
        type: 'p',
        text: 'I Danmark må en velkomstbonus højst være på 1.000 kr., og omsætningskravet må højst være 10 gange bonusbeløbet. Det gør danske bonusser mere gennemsigtige end mange udenlandske, men også mindre. Læs altid de konkrete vilkår, før du tager imod en bonus.',
      },
      {
        type: 'ul',
        items: [
          'Tjek minimumsodds for omsætning. Mange kræver fx odds på mindst 1,80.',
          'Tjek tidsfristen, så bonussen ikke udløber.',
          'Brug gerne surebets til at omsætte bonussen med lav risiko.',
        ],
      },
      { type: 'h2', text: 'Matched betting og surebets sammen' },
      {
        type: 'p',
        text: 'Surebets egner sig godt til at omsætte bonuspenge, fordi du ikke risikerer pengene på et enkelt udfald. Når bonussen er omsat, kan du fortsætte med almindelige surebets.',
      },
    ],
    faq: [
      {
        q: 'Er matched betting lovligt i Danmark?',
        a: 'Ja. Det er lovligt at udnytte bonusser inden for bookmakerens vilkår. Bookmakeren kan dog afvise bonusser eller begrænse kontoen, hvis vilkårene ikke bliver overholdt.',
      },
      {
        q: 'Hvor stor er en velkomstbonus i Danmark?',
        a: 'Højst 1.000 kr. med et omsætningskrav på højst 10 gange bonusbeløbet, efter de danske regler for bonusser.',
      },
    ],
    cta: { href: '/bonus', label: 'Se aktuelle bonusser' },
  },
  {
    slug: 'er-surebets-lovligt',
    title: 'Er surebets lovligt i Danmark? Regler og skat',
    metaTitle: 'Er surebets lovligt i Danmark? Regler, skat og vilkår',
    description:
      'Er det lovligt at spille surebets i Danmark, og skal du betale skat af gevinsten? Her er reglerne, og hvad bookmakerne må gøre.',
    keyword: 'er surebets lovligt',
    category: 'Regler',
    readMinutes: 4,
    updated: '2026-11-23',
    intro:
      'Det korte svar er ja. Det er lovligt at spille surebets i Danmark. Du placerer almindelige spil hos bookmakere, og det er ikke ulovligt at sammenligne odds og vælge de bedste.',
    blocks: [
      { type: 'h2', text: 'Hvad må bookmakerne gøre?' },
      {
        type: 'p',
        text: 'Selvom surebets er lovlige, ønsker bookmakerne ikke kunder, der kun spiller med garanteret gevinst. I deres vilkår forbeholder de sig derfor ret til at sætte maksimale indsatser ned eller lukke for bestemte markeder. Dine indestående penge skal de dog altid udbetale.',
      },
      { type: 'h2', text: 'Skal man betale skat af gevinster?' },
      {
        type: 'p',
        text: 'Gevinster fra spil hos udbydere med dansk licens fra Spillemyndigheden er som udgangspunkt skattefrie for dig som spiller. Spiller du hos udbydere uden dansk licens, kan gevinsten være skattepligtig. Er du i tvivl om din egen situation, så kontakt Skattestyrelsen.',
      },
      {
        type: 'tip',
        text: 'Spil kun hos bookmakere med dansk licens. Det giver dig både skattefrie gevinster og beskyttelse fra Spillemyndigheden.',
      },
      { type: 'h2', text: 'Ansvarligt spil' },
      {
        type: 'p',
        text: 'Selv med surebets er det vigtigt at have kontrol over dit spil. Sæt grænser for dine indbetalinger, og brug ROFUS, hvis du har brug for en pause. Har du brug for at tale med nogen, kan du kontakte StopSpillet.',
      },
    ],
    faq: [
      {
        q: 'Kan en bookmaker nægte at udbetale en gevinst fra et surebet?',
        a: 'En bookmaker skal udbetale gyldige gevinster. Den kan annullere et spil, hvis der var en åbenlys fejl i oddsene, og den kan begrænse kontoen fremover.',
      },
      {
        q: 'Skal jeg betale skat af surebet-gevinster?',
        a: 'Ikke hvis du spiller hos udbydere med dansk licens. Gevinster derfra er som udgangspunkt skattefrie for spilleren.',
      },
    ],
    cta: { href: '/surebets', label: 'Se surebets hos danske bookmakere' },
  },
  {
    slug: 'undgaa-begraensning',
    title: 'Sådan undgår du at blive begrænset hos bookmakere',
    metaTitle: 'Undgå begrænsning hos bookmakere – tips til surebettere',
    description:
      'Bookmakere begrænser konti, der vinder for stabilt. Her er de vigtigste tips til at holde dine konti åbne længere, når du spiller surebets.',
    keyword: 'bookmaker begrænsning',
    category: 'Strategi',
    readMinutes: 5,
    updated: '2026-11-23',
    intro:
      'Den største udfordring ved surebets er ikke at finde dem, men at beholde sine konti. Bookmakere holder øje med spillemønstre, og konti der kun vinder, bliver ofte begrænset. Med lidt omtanke kan du forlænge levetiden betydeligt.',
    blocks: [
      { type: 'h2', text: 'Hvorfor bliver man begrænset?' },
      {
        type: 'p',
        text: 'Bookmakerne tjener penge på deres margin. En kunde, der altid spiller på de odds, som er for høje, koster dem penge. Systemerne ser efter mønstre som skæve beløb, spil på små ligaer og spil kort efter, at en odds har bevæget sig.',
      },
      { type: 'h2', text: 'Gode vaner' },
      {
        type: 'ul',
        items: [
          'Rund indsatserne af, fx 500 kr. i stedet for 493,98 kr.',
          'Undgå de højeste profitprocenter. De skyldes ofte fejl og tiltrækker opmærksomhed.',
          'Spil også på store kampe og populære markeder.',
          'Lad være med at hæve gevinsten med det samme efter hvert spil.',
          'Fordel spil over mange bookmakere i stedet for at bruge de samme hver gang.',
        ],
      },
      {
        type: 'tip',
        text: 'Følg dine spil i regnskabet, så du kan se, hvilke bookmakere du bruger mest, og sprede dit spil mere jævnt.',
      },
      { type: 'h2', text: 'Hvis du bliver begrænset' },
      {
        type: 'p',
        text: 'En begrænset konto er ikke spildt. Du kan ofte stadig bruge den til bonusser eller mindre indsatser. Hav altid flere konti end du har brug for, så du kan fortsætte, selvom en enkelt bookmaker sætter dine grænser ned.',
      },
    ],
    faq: [
      {
        q: 'Kan man blive lukket helt ude af en bookmaker?',
        a: 'Bookmakere kan lukke en konto efter deres vilkår, men de skal udbetale dine indestående penge.',
      },
      {
        q: 'Hvor lang tid går der, før man bliver begrænset?',
        a: 'Det varierer meget mellem bookmakere og afhænger af, hvordan du spiller. Nogle begrænser efter få uger, andre efter flere måneder.',
      },
    ],
    cta: { href: '/stats', label: 'Følg dine spil i regnskabet' },
  },
]

export function getGuide(slug: string) {
  return GUIDES.find((guide) => guide.slug === slug)
}
