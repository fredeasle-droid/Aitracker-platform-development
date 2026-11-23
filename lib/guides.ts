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
  {
    slug: 'bedste-bookmakere-til-surebets',
    title: 'Bedste bookmakere til surebets i Danmark',
    metaTitle: 'Bedste bookmakere til surebets i Danmark (2026)',
    description:
      'Hvilke bookmakere skal du bruge til surebets? Se hvad der kendetegner en god surebet-bookmaker, og hvordan du sammensætter dine konti.',
    keyword: 'bedste bookmakere surebets',
    category: 'Strategi',
    readMinutes: 6,
    updated: '2026-11-23',
    intro:
      'Der findes ikke én bookmaker, der er bedst til surebets. Surebets opstår mellem bookmakere, så det vigtigste er at have konti hos flere af dem med forskellige odds-leverandører og forskellig tilgang til markedet.',
    blocks: [
      { type: 'h2', text: 'Hvorfor flere bookmakere giver flere surebets' },
      {
        type: 'p',
        text: 'Mange bookmakere bruger den samme odds-platform og har derfor næsten ens odds. Surebets opstår oftest mellem bookmakere, der sætter odds på hver sin måde. Har du kun konti hos bookmakere på samme platform, vil du se langt færre muligheder.',
      },
      { type: 'h2', text: 'Det skal du kigge efter' },
      {
        type: 'ul',
        items: [
          'Dansk licens fra Spillemyndigheden, så gevinster er skattefrie og du er beskyttet.',
          'Hurtige ind- og udbetalinger, så du kan flytte penge, hvor de skal bruges.',
          'Bredt udvalg af sportsgrene og markeder, især tennis, fodbold og basketball.',
          'Konkurrencedygtige odds og lav margin på de populære markeder.',
          'En velkomstbonus med rimelige vilkår, som du kan omsætte med surebets.',
        ],
      },
      { type: 'h2', text: 'Sådan sammensætter du dine konti' },
      {
        type: 'p',
        text: 'Start med 5-8 danske bookmakere fordelt på forskellige platforme. Det giver et godt udvalg af muligheder uden at du skal holde styr på for mange saldi. Når du har styr på rutinen, kan du udvide med flere.',
      },
      {
        type: 'tip',
        text: 'I BetTrackerAI kan du vælge præcis de bookmakere, du har konto hos, så du kun ser surebets, du faktisk kan spille.',
      },
      { type: 'h2', text: 'Bookmakere med egne odds er guld værd' },
      {
        type: 'p',
        text: 'Bookmakere, der sætter deres egne odds i stedet for at købe dem, reagerer ofte langsommere eller anderledes på nyheder. Det er netop her, prisforskellene opstår. Til gengæld er det også ofte dem, der er hurtigst til at begrænse vindende konti.',
      },
    ],
    faq: [
      {
        q: 'Hvor mange bookmakere skal jeg have til surebets?',
        a: 'Et godt udgangspunkt er 5-8 bookmakere med dansk licens. Jo flere forskellige odds-platforme du dækker, jo flere surebets får du adgang til.',
      },
      {
        q: 'Må jeg bruge udenlandske bookmakere?',
        a: 'Det anbefales ikke. Bookmakere uden dansk licens kan være blokeret, og gevinster derfra kan være skattepligtige.',
      },
    ],
    cta: { href: '/surebets', label: 'Se surebets hos dine bookmakere' },
  },
  {
    slug: 'bankroll-management',
    title: 'Bankroll management til surebets og betting',
    metaTitle: 'Bankroll management – styr dine penge som surebetter',
    description:
      'Sådan fordeler du din bankroll mellem bookmakere, hvor meget du skal sætte pr. surebet, og hvordan du undgår at mangle penge, når muligheden kommer.',
    keyword: 'bankroll management',
    category: 'Strategi',
    readMinutes: 5,
    updated: '2026-11-23',
    intro:
      'Din bankroll er de penge, du har sat af til betting. Ved surebets handler bankroll management mindre om at undgå tab og mere om at have pengene det rigtige sted, når et surebet dukker op.',
    blocks: [
      { type: 'h2', text: 'Sæt en fast bankroll' },
      {
        type: 'p',
        text: 'Bestem et beløb, du kan undvære, og hold det adskilt fra dine øvrige penge. Brug kun det beløb til betting, og læg ikke flere penge ind, fordi et enkelt spil gik galt.',
      },
      { type: 'h2', text: 'Fordel pengene mellem bookmakere' },
      {
        type: 'p',
        text: 'Et surebet kræver indsats hos to eller tre bookmakere samtidig. Fordel derfor din bankroll, så hver bookmaker har nok til mindst et par spil. Bookmakere, der ofte indgår i surebets, skal have lidt mere.',
      },
      {
        type: 'example',
        title: 'Eksempel: bankroll på 10.000 kr. fordelt på 6 bookmakere',
        rows: [
          ['To mest brugte bookmakere', '2.500 kr. hver'],
          ['Fire øvrige bookmakere', '1.250 kr. hver'],
          ['Typisk indsats pr. surebet', '500-1.000 kr. i alt'],
        ],
        note: 'Med denne fordeling kan du dække flere surebets i træk, før du skal flytte penge.',
      },
      { type: 'h2', text: 'Hvor meget skal man sætte pr. surebet?' },
      {
        type: 'p',
        text: 'En god tommelfingerregel er 5-10 % af din samlede bankroll pr. surebet. Det er højt sammenlignet med almindelig betting, men risikoen er også langt lavere. Gå ned i indsats, hvis oddsene er ustabile, eller hvis du er ny.',
      },
      {
        type: 'tip',
        text: 'Før regnskab over alle spil. Så kan du se, hvilke bookmakere der binder flest penge, og fordele bankrollen bedre.',
      },
      { type: 'h2', text: 'Flyt gevinster regelmæssigt' },
      {
        type: 'p',
        text: 'Efter en periode samler pengene sig hos nogle bookmakere og mangler hos andre. Hæv fra dem med for meget og indsæt hos dem med for lidt, fx en gang om ugen.',
      },
    ],
    faq: [
      {
        q: 'Hvor stor en bankroll skal man starte med?',
        a: 'Du kan starte med et par tusinde kroner, men 5.000-10.000 kr. gør det lettere at have penge nok hos flere bookmakere samtidig.',
      },
      {
        q: 'Kan man tabe penge på surebets?',
        a: 'Det kan ske, hvis en odds ændrer sig, før du når at placere det andet spil, eller hvis et spil bliver annulleret. God bankroll management begrænser skaden.',
      },
    ],
    cta: { href: '/stats', label: 'Hold styr på din bankroll' },
  },
  {
    slug: 'value-betting-vs-surebets',
    title: 'Value betting vs. surebets: hvad er forskellen?',
    metaTitle: 'Value betting vs. surebets – forskelle, fordele og risiko',
    description:
      'Value betting og surebets bruger begge forkerte odds, men på hver sin måde. Se forskellen, risikoen, og hvilken strategi der passer til dig.',
    keyword: 'value betting',
    category: 'Strategi',
    readMinutes: 5,
    updated: '2026-11-23',
    intro:
      'Både value betting og surebets udnytter, at bookmakerne nogle gange sætter odds forkert. Forskellen er, at et surebet låser gevinsten fast med det samme, mens value betting giver profit over mange spil.',
    blocks: [
      { type: 'h2', text: 'Hvad er value betting?' },
      {
        type: 'p',
        text: 'Et value bet er en odds, der er højere end den reelle sandsynlighed tilsiger. Hvis en kamp reelt er 50/50, og en bookmaker giver odds 2,20, er det et value bet. Du spiller kun på ét udfald og kan tabe det enkelte spil, men over tid vinder du.',
      },
      { type: 'h2', text: 'Hvad er et surebet?' },
      {
        type: 'p',
        text: 'Ved et surebet spiller du på alle udfald hos forskellige bookmakere, så du vinder uanset resultatet. Gevinsten er mindre pr. spil, men den er sikret med det samme.',
      },
      {
        type: 'example',
        title: 'Sammenligning',
        rows: [
          ['Risiko pr. spil', 'Surebets: lav · Value: høj'],
          ['Profit pr. spil', 'Surebets: 1-5 % · Value: varierer'],
          ['Antal spil før profit', 'Surebets: 1 · Value: hundredvis'],
          ['Kræver konti hos', 'Surebets: flere · Value: én'],
        ],
      },
      { type: 'h2', text: 'Hvilken strategi passer til dig?' },
      {
        type: 'ul',
        items: [
          'Vælg surebets, hvis du vil have stabil profit uden store udsving.',
          'Vælg value betting, hvis du kan tåle perioder med tab og har en stor bankroll.',
          'Mange kombinerer begge: surebets som fast indtægt og value bets som supplement.',
        ],
      },
      {
        type: 'tip',
        text: 'Begynder du, så start med surebets. Du lærer markedet at kende uden at risikere store tab.',
      },
    ],
    faq: [
      {
        q: 'Er value betting mere profitabelt end surebets?',
        a: 'Value betting kan give højere profit på lang sigt, men med langt større udsving. Surebets giver mindre, men mere stabil profit.',
      },
      {
        q: 'Bliver man også begrænset af value betting?',
        a: 'Ja. Bookmakere begrænser vindende kunder uanset strategi, men value betting kan være lidt sværere at opdage, fordi du også taber spil.',
      },
    ],
    cta: { href: '/surebets', label: 'Prøv surebets i realtid' },
  },
  {
    slug: 'skat-paa-spillegevinster',
    title: 'Skat på spillegevinster i Danmark',
    metaTitle: 'Skat på spillegevinster i Danmark – hvad gælder for betting?',
    description:
      'Skal du betale skat af gevinster fra betting og surebets? Her er reglerne for danske og udenlandske bookmakere, og hvad du skal være opmærksom på.',
    keyword: 'skat på spillegevinster',
    category: 'Regler',
    readMinutes: 4,
    updated: '2026-11-23',
    intro:
      'For de fleste danske spillere er svaret enkelt: Gevinster fra bookmakere med dansk licens er skattefrie. Det er bookmakeren, der betaler afgift til staten, ikke dig.',
    blocks: [
      { type: 'h2', text: 'Danske bookmakere: skattefrit' },
      {
        type: 'p',
        text: 'Når du spiller hos en udbyder med licens fra Spillemyndigheden, betaler udbyderen spilleafgift af sin indtjening. Dine gevinster er derfor som udgangspunkt skattefrie, og du skal ikke oplyse dem til Skattestyrelsen.',
      },
      { type: 'h2', text: 'Udenlandske bookmakere uden dansk licens' },
      {
        type: 'p',
        text: 'Spiller du hos udbydere uden dansk licens, kan gevinsterne være skattepligtige. Reglerne afhænger blandt andet af, om udbyderen har licens i et andet EU/EØS-land. Det er en af grundene til, at det er mest enkelt at holde sig til danske bookmakere.',
      },
      { type: 'h2', text: 'Gælder det også for surebets?' },
      {
        type: 'p',
        text: 'Ja. Skattemæssigt er et surebet bare to eller tre almindelige spil. Gevinster fra danske bookmakere er skattefrie, uanset om du spiller surebets, value bets eller almindelige spil.',
      },
      {
        type: 'tip',
        text: 'Gem en oversigt over dine spil. Det gør det let at dokumentere, hvor pengene kommer fra, hvis din bank spørger.',
      },
      { type: 'h2', text: 'Professionelt spil' },
      {
        type: 'p',
        text: 'Er betting din hovedbeskæftigelse i stort omfang, kan der i særlige tilfælde gælde andre regler. Er du i tvivl om din egen situation, så kontakt Skattestyrelsen eller en revisor.',
      },
    ],
    faq: [
      {
        q: 'Skal jeg betale skat af gevinster fra danske bookmakere?',
        a: 'Nej, som udgangspunkt ikke. Gevinster fra udbydere med dansk licens er skattefrie for spilleren.',
      },
      {
        q: 'Hvordan ser jeg, om en bookmaker har dansk licens?',
        a: 'Spillemyndigheden har en liste over godkendte udbydere på sin hjemmeside, og bookmakere med licens viser Spillemyndighedens logo på deres side.',
      },
    ],
    cta: { href: '/guide/er-surebets-lovligt', label: 'Læs om reglerne for surebets' },
  },
  {
    slug: 'odds-beregner',
    title: 'Sådan bruger du en odds-beregner',
    metaTitle: 'Odds-beregner – omregn odds til sandsynlighed og gevinst',
    description:
      'Lær at omregne decimalodds til sandsynlighed, beregne din mulige gevinst, og finde bookmakerens margin med en odds-beregner.',
    keyword: 'odds beregner',
    category: 'Grundlæggende',
    readMinutes: 4,
    updated: '2026-11-23',
    intro:
      'En odds-beregner gør odds til noget, du kan bruge: hvor meget du vinder, hvor sandsynligt bookmakeren mener udfaldet er, og hvor meget bookmakeren tjener. Her er de tre beregninger, du skal kende.',
    blocks: [
      { type: 'h2', text: '1. Mulig gevinst' },
      {
        type: 'p',
        text: 'Med decimalodds, som danske bookmakere bruger, er udbetalingen indsats gange odds. Profitten er udbetalingen minus indsatsen.',
      },
      {
        type: 'example',
        title: 'Indsats 200 kr. til odds 2,50',
        rows: [
          ['Udbetaling', '200 × 2,50 = 500 kr.'],
          ['Profit', '500 − 200 = 300 kr.'],
        ],
      },
      { type: 'h2', text: '2. Implicit sandsynlighed' },
      {
        type: 'p',
        text: 'Den sandsynlighed, bookmakeren regner med, er 1 divideret med odds. Odds 2,50 svarer til 40 %. Mener du selv, chancen er højere, er det et value bet.',
      },
      { type: 'h2', text: '3. Bookmakerens margin' },
      {
        type: 'p',
        text: 'Læg de implicitte sandsynligheder for alle udfald sammen. Summen er over 100 %, og det overskydende er bookmakerens margin. Er summen under 100 % på tværs af bookmakere, har du et surebet.',
      },
      {
        type: 'example',
        title: 'Tennis: odds 1,85 og 1,95 hos samme bookmaker',
        rows: [
          ['1/1,85 + 1/1,95', '54,1 % + 51,3 % = 105,4 %'],
          ['Bookmakerens margin', 'ca. 5,4 %'],
        ],
        note: 'Jo lavere margin, jo bedre odds får du som spiller.',
      },
      {
        type: 'tip',
        text: 'Vores gratis surebet beregner laver alle tre beregninger for dig og fordeler indsatsen på flere udfald.',
      },
    ],
    faq: [
      {
        q: 'Hvordan omregner man odds til procent?',
        a: 'Divider 1 med odds og gang med 100. Odds 2,00 svarer til 50 %, og odds 4,00 svarer til 25 %.',
      },
      {
        q: 'Hvad er forskellen på decimalodds og brøkodds?',
        a: 'Decimalodds viser den samlede udbetaling pr. krone, fx 2,50. Brøkodds, som 3/2, viser kun profitten. Danske bookmakere bruger decimalodds.',
      },
    ],
    cta: { href: '/beregn', label: 'Åbn beregneren' },
  },
  {
    slug: 'dutching-betting',
    title: 'Dutching: sådan fordeler du indsatsen på flere udfald',
    metaTitle: 'Dutching betting – forklaring, formel og eksempel',
    description:
      'Dutching betyder, at du fordeler indsatsen på flere udfald, så du får samme gevinst, uanset hvilket af dem der vinder. Se formlen og et eksempel.',
    keyword: 'dutching',
    category: 'Strategi',
    readMinutes: 5,
    updated: '2026-11-23',
    intro:
      'Dutching er en metode, hvor du spiller på flere udfald i den samme begivenhed og fordeler indsatsen, så du får den samme udbetaling, uanset hvilket af dine udfald der vinder. Metoden bruges især i turneringer og på markeder med mange mulige udfald.',
    blocks: [
      { type: 'h2', text: 'Forskellen på dutching og surebets' },
      {
        type: 'p',
        text: 'Ved et surebet dækker du alle udfald og vinder uanset resultatet. Ved dutching dækker du kun nogle af udfaldene. Rammer et af dem, får du den samme gevinst, men rammer ingen af dem, taber du hele indsatsen. Dutching er derfor ikke risikofri.',
      },
      { type: 'h2', text: 'Formlen' },
      {
        type: 'p',
        text: 'Beregn 1/odds for hvert udfald, og læg dem sammen. Kald summen S. Indsatsen på et udfald er den samlede indsats gange (1/odds) divideret med S. Udbetalingen bliver den samlede indsats divideret med S.',
      },
      {
        type: 'example',
        title: 'Eksempel: tre spillere i en turnering, samlet indsats 1.000 kr.',
        rows: [
          ['Spiller A, odds 3,00', 'indsats ca. 444 kr.'],
          ['Spiller B, odds 4,00', 'indsats ca. 333 kr.'],
          ['Spiller C, odds 6,00', 'indsats ca. 222 kr.'],
          ['S = 0,333 + 0,250 + 0,167', '0,750'],
          ['Vinder en af de tre', 'udbetaling ca. 1.333 kr., profit ca. 333 kr.'],
          ['Vinder ingen af de tre', 'tab på 1.000 kr.'],
        ],
        note: 'Profitten er kun sikker, hvis en af dine tre spillere vinder. Hvor sandsynligt det er, må du selv vurdere.',
      },
      { type: 'h2', text: 'Hvornår giver dutching mening?' },
      {
        type: 'ul',
        items: [
          'Når du mener, at få udfald har størstedelen af chancen, fx de tre favoritter i en turnering.',
          'Når du vil sprede risikoen i stedet for at satse på ét udfald.',
          'Når du kan få bedre odds hos flere bookmakere og vil fordele indsatsen mellem dem.',
        ],
      },
      {
        type: 'tip',
        text: 'Dutching er ikke en erstatning for surebets. Vil du have sikker profit, skal du dække alle udfald hos forskellige bookmakere. Beregneren viser forskellen med det samme.',
      },
    ],
    faq: [
      {
        q: 'Er dutching det samme som surebets?',
        a: 'Nej. Ved et surebet dækker du alle udfald og vinder uanset resultat. Ved dutching dækker du kun nogle af udfaldene og kan tabe hele indsatsen.',
      },
      {
        q: 'Kan man tabe penge på dutching?',
        a: 'Ja. Rammer ingen af de udfald, du har spillet på, taber du hele den samlede indsats.',
      },
      {
        q: 'Hvordan beregner man dutching?',
        a: 'Læg 1/odds sammen for dine udfald (S). Indsatsen på hvert udfald er den samlede indsats gange 1/odds divideret med S.',
      },
    ],
    cta: { href: '/beregn', label: 'Brug beregneren til at fordele indsatsen' },
  },
  {
    slug: 'asiatisk-handicap',
    title: 'Asiatisk handicap forklaret: hele, halve og kvarte linjer',
    metaTitle: 'Asiatisk handicap forklaret – simpel guide med eksempler',
    description:
      'Forstå asiatisk handicap: hvad -0,5, -1 og -0,25 betyder, hvornår du får pengene tilbage, og hvorfor linjen er vigtig, når du spiller surebets.',
    keyword: 'asiatisk handicap',
    category: 'Grundlæggende',
    readMinutes: 6,
    updated: '2026-11-23',
    intro:
      'Asiatisk handicap er et marked i fodbold, hvor uafgjort bliver fjernet eller delt op. Det giver kun to udfald, og derfor bruges det ofte af dem, der leder efter surebets.',
    blocks: [
      { type: 'h2', text: 'Hele linjer: pengene tilbage ved uafgjort' },
      {
        type: 'p',
        text: 'Ved et handicap på 0 eller et helt tal kan din indsats blive betalt tilbage. Hjemmehold 0 betyder, at du får pengene tilbage, hvis kampen ender uafgjort. Hjemmehold -1 betyder, at holdet skal vinde med mindst to mål for at give gevinst. Vinder det med præcis ét mål, får du pengene tilbage.',
      },
      { type: 'h2', text: 'Halve linjer: ingen pengene tilbage' },
      {
        type: 'p',
        text: 'Ved -0,5 skal holdet vinde. Uafgjort og tab giver tabt spil. Ved +0,5 vinder du, hvis holdet vinder eller spiller uafgjort. Der er altid enten gevinst eller tab, og pengene kommer ikke tilbage.',
      },
      { type: 'h2', text: 'Kvartlinjer: indsatsen deles i to' },
      {
        type: 'p',
        text: 'Ved -0,25 deles indsatsen i to: halvdelen på 0 og halvdelen på -0,5. Ved +0,25 er det halvdelen på 0 og halvdelen på +0,5. Resultatet kan derfor blive en halv gevinst eller et halvt tab.',
      },
      {
        type: 'example',
        title: 'Hjemmehold -0,25 med indsats 100 kr.',
        rows: [
          ['Hjemmeholdet vinder', 'begge halvdele vinder'],
          ['Uafgjort', '50 kr. tilbage, 50 kr. tabt'],
          ['Hjemmeholdet taber', 'begge halvdele er tabt'],
        ],
        note: 'Ved +0,25 på udeholdet er det omvendt: Uafgjort giver gevinst på den ene halvdel og pengene tilbage på den anden.',
      },
      { type: 'h2', text: 'Asiatisk handicap og surebets' },
      {
        type: 'p',
        text: 'Fordi markedet har to udfald, kan du kombinere hjemmehold -0,5 hos én bookmaker med udehold +0,5 hos en anden og nøjes med to bookmakere. Pas på, at begge sider har den modsvarende linje: -0,5 hører sammen med +0,5, og -0,25 hører sammen med +0,25.',
      },
      {
        type: 'tip',
        text: 'Tjek altid linjen, før du placerer et surebet. En forskel på en kvart linje kan forvandle et sikkert spil til et spil med risiko.',
      },
    ],
    faq: [
      {
        q: 'Hvad betyder asiatisk handicap -0,5?',
        a: 'Holdet skal vinde kampen for at give gevinst. Uafgjort og tab giver tabt spil.',
      },
      {
        q: 'Får jeg pengene tilbage ved asiatisk handicap?',
        a: 'Ved hele linjer, fx 0 eller -1, får du pengene tilbage, hvis kampen går præcis op med handicappet. Ved halve linjer sker det aldrig, og ved kvartlinjer kan du få halv gevinst eller halvt tab.',
      },
    ],
    cta: { href: '/surebets', label: 'Se aktuelle surebets' },
  },
  {
    slug: 'bookmakerens-margin',
    title: 'Bookmakerens margin: sådan ser du, hvad odds egentlig koster',
    metaTitle: 'Bookmakerens margin – beregn overround og find bedre odds',
    description:
      'Bookmakere tjener på en indbygget margin i deres odds. Lær at beregne den, og find de bookmakere, der giver dig de bedste odds.',
    keyword: 'bookmaker margin',
    category: 'Grundlæggende',
    readMinutes: 4,
    updated: '2026-11-23',
    intro:
      'Når du lægger de implicitte sandsynligheder fra et marked sammen, bliver summen over 100 %. Det overskydende er bookmakerens margin, også kaldet overround. Det er den pris, du betaler for at spille.',
    blocks: [
      { type: 'h2', text: 'Sådan beregner du marginen' },
      {
        type: 'p',
        text: 'Beregn 1/odds for alle udfald i markedet, og læg dem sammen. Trækker du 1 fra summen, har du marginen.',
      },
      {
        type: 'example',
        title: 'Eksempel: fodboldkamp med odds 2,10, 3,40 og 3,60',
        rows: [
          ['1/2,10 + 1/3,40 + 1/3,60', '0,476 + 0,294 + 0,278 = 1,048'],
          ['Bookmakerens margin', 'ca. 4,8 %'],
          ['Udbetalingsprocent', 'ca. 95,4 %'],
          ['Hjemmesejr uden margin', 'ca. 45,4 %'],
        ],
        note: 'Odds 2,10 svarer til 47,6 %, men uden marginen er den rigtige sandsynlighed ca. 45,4 %.',
      },
      { type: 'h2', text: 'Hvorfor betyder marginen noget?' },
      {
        type: 'p',
        text: 'Jo lavere margin, jo bedre odds får du for den samme sandsynlighed. Over mange spil gør forskellen mellem 3 % og 7 % en stor forskel for din bankroll. Sammenlign derfor margin hos de bookmakere, du bruger, på de markeder du spiller mest.',
      },
      { type: 'h2', text: 'Margin og surebets' },
      {
        type: 'p',
        text: 'Et surebet opstår, når de bedste odds fra flere bookmakere tilsammen giver en sum under 1. Så er bookmakernes margin mere end opvejet af, at de er uenige om prisen. Det er det, en scanner leder efter.',
      },
      {
        type: 'tip',
        text: 'Brug vores beregner til at lægge odds ind og se summen med det samme. Er den under 1, har du et surebet.',
      },
    ],
    faq: [
      {
        q: 'Hvad er en god margin?',
        a: 'Jo lavere, jo bedre. På populære fodboldmarkeder er en margin på 3-6 % almindelig, og små ligaer og specialmarkeder har ofte højere margin.',
      },
      {
        q: 'Hvad er overround?',
        a: 'Overround er det engelske ord for bookmakerens margin, altså hvor meget de implicitte sandsynligheder summer til over 100 %.',
      },
    ],
    cta: { href: '/beregn', label: 'Beregn summen af dine odds' },
  },
  {
    slug: 'tennis-surebets',
    title: 'Surebets i tennis: sådan finder og spiller du dem',
    metaTitle: 'Surebets tennis – find sikre odds på tennis',
    description:
      'Tennis er en af de mest brugte sportsgrene til surebets, fordi der kun er to udfald. Se et eksempel og de fælder, du skal undgå.',
    keyword: 'surebets tennis',
    category: 'Strategi',
    readMinutes: 5,
    updated: '2026-11-23',
    intro:
      'Tennis er en af de nemmeste sportsgrene at spille surebets på. En kamp har kun to udfald og ingen uafgjort, så du skal kun bruge to bookmakere og to spil.',
    blocks: [
      { type: 'h2', text: 'Hvorfor tennis passer til surebets' },
      {
        type: 'p',
        text: 'Med to udfald er regnestykket enkelt, og du skal kun placere to spil. Der spilles mange kampe hver dag på tværs af tidszoner, så bookmakerne hele tiden skal sætte nye odds, og de gør det ikke ens.',
      },
      {
        type: 'example',
        title: 'Eksempel: odds 1,95 og 2,20, samlet indsats 1.000 kr.',
        rows: [
          ['Spiller A hos bookmaker 1, odds 1,95', 'indsats ca. 530 kr.'],
          ['Spiller B hos bookmaker 2, odds 2,20', 'indsats ca. 470 kr.'],
          ['1/1,95 + 1/2,20', '0,513 + 0,455 = 0,967'],
          ['Udbetaling uanset vinder', 'ca. 1.034 kr.'],
          ['Profit', 'ca. 34 kr. (3,4 %)'],
        ],
        note: 'Summen er under 1, så kombinationen er et surebet.',
      },
      { type: 'h2', text: 'Fælder i tennis' },
      {
        type: 'ul',
        items: [
          'Udgåede spillere: Hvis en spiller opgiver midt i kampen, kan bookmakernes regler være forskellige. Nogle annullerer spillet, andre afgør det. Læs vilkårene hos begge.',
          'Walkover og kampe, der aldrig bliver spillet, kan give annullerede spil og en åben position.',
          'Forkert kamp: Tjek spillernes navne og turneringen, især i mindre turneringer, hvor navne kan ligne hinanden.',
          'Live-odds ændrer sig hurtigt. Surebets før kampen er lettere at nå at spille.',
        ],
      },
      {
        type: 'tip',
        text: 'Placér det spil først, hvor oddsene er mest ustabile, og spil det andet bagefter. Så er risikoen for at stå med et halvt surebet mindst.',
      },
    ],
    faq: [
      {
        q: 'Hvorfor er tennis godt til surebets?',
        a: 'Fordi der kun er to udfald og ingen uafgjort. Du skal kun bruge to bookmakere og placere to spil.',
      },
      {
        q: 'Hvad sker der, hvis en spiller opgiver midt i kampen?',
        a: 'Det afhænger af bookmakernes regler. Nogle annullerer spillet, hvis kampen ikke bliver spillet færdig, mens andre afgør det. Det er en af de største risici, så læs vilkårene først.',
      },
    ],
    cta: { href: '/surebets', label: 'Se aktuelle surebets' },
  },
  {
    slug: 'fodbold-surebets',
    title: 'Surebets i fodbold: sådan spiller du tre udfald',
    metaTitle: 'Surebets fodbold – sådan fordeler du 1X2-odds',
    description:
      'Fodbold har tre udfald, så et surebet kræver tre spil. Lær at fordele indsatsen på hjemmesejr, uafgjort og udesejr, og hvilke fælder du skal undgå.',
    keyword: 'surebets fodbold',
    category: 'Strategi',
    readMinutes: 5,
    updated: '2026-11-23',
    intro:
      'Fodbold har tre mulige udfald: hjemmesejr, uafgjort og udesejr. Et surebet på 1X2-markedet kræver derfor tre spil, og de bedste odds ligger ofte hos tre forskellige bookmakere.',
    blocks: [
      { type: 'h2', text: 'Sådan regner du på tre udfald' },
      {
        type: 'p',
        text: 'Formlen er den samme som ved to udfald. Læg 1/odds sammen for alle tre udfald. Er summen under 1, har du et surebet. Indsatsen på hvert udfald er den samlede indsats gange 1/odds divideret med summen.',
      },
      {
        type: 'example',
        title: 'Eksempel: tre bookmakere, samlet indsats 1.000 kr.',
        rows: [
          ['Hjemmesejr hos bookmaker 1, odds 2,40', 'indsats ca. 424 kr.'],
          ['Uafgjort hos bookmaker 2, odds 3,80', 'indsats ca. 268 kr.'],
          ['Udesejr hos bookmaker 3, odds 3,30', 'indsats ca. 308 kr.'],
          ['1/2,40 + 1/3,80 + 1/3,30', '0,417 + 0,263 + 0,303 = 0,983'],
          ['Udbetaling uanset udfald', 'ca. 1.017 kr.'],
          ['Profit', 'ca. 17 kr. (1,7 %)'],
        ],
        note: 'Profitten er mindre end i tennis, og tre spil betyder større risiko for, at en odds ændrer sig, mens du spiller.',
      },
      { type: 'h2', text: 'Fælder i fodbold' },
      {
        type: 'ul',
        items: [
          'Tjek at markedet gælder samme spilletid hos alle bookmakere. 1X2 gælder normalt kun ordinær tid, men tjek det for pokal- og slutspilskampe.',
          'Aflyste og udsatte kampe afgøres forskelligt, så læs reglerne hos hver bookmaker.',
          'Tre spil giver større risiko for, at en odds når at ændre sig. Placér det mest ustabile spil først.',
          'Brug gerne markeder med to udfald, fx asiatisk handicap eller over/under 2,5 mål, hvis du vil nøjes med to bookmakere.',
        ],
      },
      {
        type: 'tip',
        text: 'Vælg de bookmakere, du allerede har penge hos, i BetTrackerAI, så du kun ser surebets, du kan nå at spille.',
      },
    ],
    faq: [
      {
        q: 'Hvorfor er surebets i fodbold sværere end i tennis?',
        a: 'Fordi der er tre udfald i stedet for to. Du skal placere tre spil, ofte hos tre bookmakere, og risikoen for at en odds ændrer sig undervejs er større.',
      },
      {
        q: 'Gælder 1X2 også forlænget spilletid?',
        a: 'Normalt ikke. 1X2 gælder som udgangspunkt kun de 90 minutter plus tilføjet tid, men reglerne kan være forskellige. Tjek vilkårene hos bookmakeren.',
      },
    ],
    cta: { href: '/surebets', label: 'Se aktuelle surebets' },
  },
]

export function getGuide(slug: string) {
  return GUIDES.find((guide) => guide.slug === slug)
}
