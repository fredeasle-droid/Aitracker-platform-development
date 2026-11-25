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
    title: 'Hvordan fungerer arbitrage betting? Sådan låser du gevinsten fast',
    metaTitle: 'Hvordan fungerer arbitrage betting? Guide 2026',
    description:
      'Sådan fungerer arbitrage betting og surebets i Danmark: formlen, regneeksempler i kr. og hvordan du laver dit første sikre bet trin for trin.',
    keyword: 'hvordan fungerer arbitrage betting',
    category: 'Strategi',
    readMinutes: 8,
    updated: '2026-11-24',
    intro:
      'Arbitrage betting fungerer ved, at du spiller på alle udfald af den samme kamp hos forskellige bookmakere, når deres odds tilsammen giver en sum af omvendte odds under 1. Du fordeler indsatsen, så udbetalingen er den samme uanset resultatet. Forskellen mellem indsats og udbetaling er din gevinst, typisk 1–3 % pr. surebet, og den er sikret af matematik frem for held.',
    blocks: [
      { type: 'h2', text: 'Surebets forklaret: prisforskellen mellem to bookmakere' },
      {
        type: 'p',
        text: 'Hver bookmaker sætter sine egne odds og lægger en margin på 4–7 % oven i. Men de reagerer ikke lige hurtigt på skader, holdopstillinger og store indsatser. Når én bookmaker er langsom til at sænke en odds, mens en anden allerede har hævet den modsatte, kan de to odds tilsammen give dig et overskud. Det er et surebet. Er du helt ny, kan du starte med vores forklaring af [hvad surebets er](/guide/hvad-er-surebets).',
      },
      {
        type: 'p',
        text: 'Testen er enkel: Regn 1 ÷ odds ud for hvert udfald, og læg tallene sammen. Er summen under 1,00, er der tale om arbitrage. Jo lavere summen er, jo større er gevinsten.',
      },
      {
        type: 'example',
        title: 'Eksempel: tenniskamp med to udfald, samlet indsats 1.000 kr.',
        rows: [
          ['Spiller A hos bookmaker 1, odds 2,08', 'indsats 492,70 kr.'],
          ['Spiller B hos bookmaker 2, odds 2,02', 'indsats 507,30 kr.'],
          ['1/2,08 + 1/2,02', '0,481 + 0,495 = 0,976'],
          ['Udbetaling uanset vinder', 'ca. 1.024,80 kr.'],
          ['Sikker gevinst', 'ca. 24,80 kr. (2,5 %)'],
        ],
        note: 'Summen er under 1, så du vinder ca. 24,80 kr., uanset hvem der vinder kampen.',
      },
      { type: 'h2', text: 'Hvordan laver man surebets? Fem trin' },
      {
        type: 'ul',
        items: [
          '**Find muligheden.** Surebets lever ofte kun i få minutter, så en scanner, der sammenligner oddsene løbende, er langt hurtigere end at gøre det manuelt.',
          '**Tjek, at markedet er identisk.** "Vinder inkl. overtid" og "1X2 i ordinær tid" er to forskellige markeder, selvom de ligner hinanden.',
          '**Beregn indsatsen.** Brug en [surebet beregner](/beregn), så udbetalingen bliver ens på alle udfald.',
          '**Placér det mest ustabile spil først.** Det er typisk den højeste odds eller den mindste bookmaker, der retter sin pris hurtigst.',
          '**Registrér begge spil.** Kun et regnskab viser, om du reelt tjener penge over tid.',
        ],
      },
      {
        type: 'example',
        title: 'Eksempel: fodbold 1X2, samlet indsats 1.500 kr.',
        rows: [
          ['Hjemmesejr, odds 2,30', 'indsats 660,90 kr.'],
          ['Uafgjort, odds 3,70', 'indsats 410,90 kr.'],
          ['Udesejr, odds 3,55', 'indsats 428,20 kr.'],
          ['Sum af omvendte odds', '0,987'],
          ['Sikker gevinst', 'ca. 20 kr. (1,3 %)'],
        ],
        note: 'Ved tre udfald skal du bruge tre bookmakere på samme tid, så hav penge stående hos flere af dem.',
      },
      { type: 'h2', text: 'Arbitrage betting i Danmark: det skal du vide' },
      {
        type: 'p',
        text: 'Det er lovligt at spille surebets i Danmark. Gevinster fra udbydere med dansk licens er som udgangspunkt skattefrie. Gevinster fra udenlandske udbydere kan også være skattefrie, men kun hvis særlige krav til udbyderens hjemsted, offentlige kontrol og spillets lovlighed i Danmark er opfyldt. Du kan læse mere i guiden [er surebets lovligt](/guide/er-surebets-lovligt).',
      },
      {
        type: 'p',
        text: 'Bookmakerne må til gengæld selv vælge, hvem de vil have som kunder. Spiller du kun surebets, risikerer du at få nedsat dine maksimale indsatser. Det kan du læse, hvordan du udskyder, i guiden om at [undgå begrænsning](/guide/undgaa-begraensning).',
      },
      { type: 'h2', text: 'Er sikre bets virkelig sikre?' },
      {
        type: 'p',
        text: 'Matematisk ja: Når alle spil er placeret til de rigtige odds, er gevinsten låst fast. Risikoen ligger i udførelsen:',
      },
      {
        type: 'ul',
        items: [
          '**Oddsen falder,** før du når at placere det andet spil.',
          '**Reglerne er forskellige,** fx hvis en tennisspiller udgår, og den ene bookmaker annullerer spillet, mens den anden gør det op.',
          '**Åbenlyse oddsfejl** kan blive annulleret af bookmakeren.',
          '**Maksimal indsats** kan være lavere end forventet hos den ene bookmaker.',
        ],
      },
      {
        type: 'tip',
        text: 'BetTracker AI scanner de danske bookmakere i realtid, beregner indsatsen for dig og sender en alarm, når et surebet over din minimumsprofit dukker op. [Se hvordan BetTracker AI virker](/).',
      },
      { type: 'h2', text: 'Hvad kan du realistisk tjene?' },
      {
        type: 'example',
        title: 'Regneeksempel: en måned med surebets',
        rows: [
          ['Antal surebets', '40'],
          ['Gennemsnitlig indsats pr. surebet', '1.000 kr.'],
          ['Gennemsnitlig profit', '2 %'],
          ['Samlet omsætning', '40.000 kr.'],
          ['Forventet gevinst', 'ca. 800 kr.'],
        ],
        note: 'Gevinsten kommer af volumen og disciplin, ikke af enkelte store gevinster.',
      },
      {
        type: 'p',
        text: 'Klar til dit første surebet? [Kom i gang med BetTracker AI](/) og få oddsene fra danske bookmakere samlet ét sted. Vil du også bruge strategien til at sikre gevinster på spil, du allerede har placeret, så læs [sådan tjener du penge på odds uden risiko](/guide/tjen-penge-paa-odds-uden-risiko).',
      },
    ],
    faq: [
      {
        q: 'Hvordan laver man surebets som begynder?',
        a: 'Opret konti hos 4–6 danske bookmakere, sæt et mindre beløb ind hos hver, og start med surebets på to udfald, fx tennis. Brug en beregner til indsatsen, og placér det mest ustabile spil først.',
      },
      {
        q: 'Er arbitrage betting lovligt i Danmark?',
        a: 'Ja. Det er lovligt at spille på alle udfald hos forskellige bookmakere. Bookmakerne må dog begrænse konti, de ikke ønsker som kunder.',
      },
      {
        q: 'Hvor stor profit giver et surebet?',
        a: 'De fleste surebets giver 1–3 % af den samlede indsats. Med 1.000 kr. i indsats svarer det til 10–30 kr. pr. surebet.',
      },
      {
        q: 'Hvad er forskellen på arbitrage betting og surebets?',
        a: 'Ingen. Arbitrage betting er betegnelsen for metoden, og et surebet er den enkelte mulighed, hvor oddsene tilsammen giver et sikkert overskud.',
      },
    ],
    cta: { href: '/surebets', label: 'Find arbitrage-muligheder nu' },
  },
  {
    slug: 'tjen-penge-paa-odds-uden-risiko',
    title: 'Tjen penge på odds uden risiko: gevinstsikring og arbitrage forklaret',
    metaTitle: 'Tjen penge på odds uden risiko – sådan gør du 2026',
    description:
      'Lær at tjene penge på odds uden risiko med odds arbitrage og gevinstsikring. Regneeksempler i kr. og de praktiske risici, du skal kende.',
    keyword: 'tjen penge på odds uden risiko',
    category: 'Strategi',
    readMinutes: 8,
    updated: '2026-11-24',
    intro:
      'Du kan tjene penge på odds uden risiko for kampens resultat på to måder: odds arbitrage, hvor du fra start spiller alle udfald til odds, der tilsammen giver overskud, og gevinstsikring, hvor du dækker et eksisterende spil af, når oddsene har flyttet sig til din fordel. Begge dele er ren matematik, men kræver hurtighed, disciplin og styr på bookmakernes regler.',
    blocks: [
      { type: 'h2', text: 'Odds arbitrage: overskud fra første klik' },
      {
        type: 'p',
        text: 'Ved odds arbitrage finder du to eller tre bookmakere, hvis odds på hvert sit udfald tilsammen giver mere tilbage, end du sætter ind. Du placerer alle spil med det samme, så resultatet er ligegyldigt. Metoden er forklaret trin for trin i guiden [hvordan fungerer arbitrage betting](/guide/arbitrage-betting).',
      },
      {
        type: 'example',
        title: 'Eksempel: basketball inkl. overtid, samlet indsats 1.000 kr.',
        rows: [
          ['Hjemmehold hos bookmaker 1, odds 1,95', 'indsats 520,90 kr.'],
          ['Udehold hos bookmaker 2, odds 2,12', 'indsats 479,10 kr.'],
          ['Udbetaling uanset vinder', 'ca. 1.015,70 kr.'],
          ['Sikker gevinst', 'ca. 15,70 kr. (1,6 %)'],
        ],
      },
      { type: 'h2', text: 'Gevinstsikring: lås en gevinst fast, når oddsene flytter sig' },
      {
        type: 'p',
        text: 'Gevinstsikring betyder, at du dækker et spil, du allerede har placeret, med et spil på det modsatte udfald. Det giver kun en sikker gevinst, hvis oddsen på dit oprindelige valg er faldet siden, fx fordi din spiller har vundet første sæt.',
      },
      {
        type: 'example',
        title: 'Eksempel: gevinstsikring i en tenniskamp',
        rows: [
          ['Før kampen: 200 kr. på spiller A, odds 3,50', 'mulig udbetaling 700 kr.'],
          ['Efter første sæt: spiller B har odds 2,20', 'dækspil 318 kr.'],
          ['Udbetaling, hvis B vinder', '318 × 2,20 = 699,60 kr.'],
          ['Samlet indsats', '518 kr.'],
          ['Sikker gevinst', 'ca. 182 kr. (35 %)'],
        ],
        note: 'Dækspillets størrelse er den mulige udbetaling divideret med den nye odds: 700 ÷ 2,20 ≈ 318 kr.',
      },
      {
        type: 'p',
        text: 'Er oddsen gået den forkerte vej, kan den samme beregning i stedet begrænse dit tab. Så er det ikke længere en gevinst, men en forsikring.',
      },
      { type: 'h2', text: 'Matematisk betting: tre formler, der afgør det hele' },
      {
        type: 'ul',
        items: [
          '**Er det et surebet?** Summen af 1 ÷ odds for alle udfald skal være under 1,00.',
          '**Hvor stor er gevinsten?** Profit i % = (1 ÷ summen − 1) × 100.',
          '**Hvor meget skal du sætte?** Indsats på et udfald = samlet indsats × (1 ÷ odds) ÷ summen.',
        ],
      },
      {
        type: 'tip',
        text: 'Du behøver ikke regne i hånden. Vores gratis [surebet beregner](/beregn) gør det på et sekund og viser gevinsten i både kr. og %.',
      },
      { type: 'h2', text: 'Den praktiske risiko: det kan gå galt' },
      {
        type: 'ul',
        items: [
          '**Oddsen falder undervejs.** Falder oddsen i basketball-eksemplet fra 2,12 til 2,00, før du når at spille, taber du ca. 13 kr. på 1.000 kr. i stedet for at vinde 15,70 kr.',
          '**Forskellige regler.** Bookmakere gør fx opgivelser i tennis og udsatte kampe op forskelligt.',
          '**Annullerede oddsfejl.** Er en odds åbenlyst forkert, kan bookmakeren annullere spillet.',
          '**Begrænsninger.** Spiller du kun surebets, kan dine maksimale indsatser blive sat ned.',
          '**Bundet kapital.** Dine penge skal stå hos flere bookmakere på samme tid.',
        ],
      },
      { type: 'h2', text: 'En betting strategi, der holder i længden' },
      {
        type: 'ul',
        items: [
          'Sæt en minimumsprofit på 1 %, så små udsving ikke æder gevinsten.',
          'Fordel din bankroll, så du altid kan dække begge sider af et surebet.',
          'Rund indsatser af til hele tiere, så dine spil ser mindre automatiske ud.',
          'Brug velkomstbonusser og freebets oven i, se guiden om [matched betting](/guide/matched-betting).',
          'Registrér hvert spil, så du kan se din reelle gevinst måned for måned.',
        ],
      },
      {
        type: 'p',
        text: 'BetTracker AI holder øje med oddsene hos danske bookmakere, viser surebets i realtid og fører dit regnskab automatisk. [Prøv BetTracker AI](/) og se de aktuelle muligheder.',
      },
    ],
    faq: [
      {
        q: 'Kan man virkelig tjene penge på odds uden risiko?',
        a: 'Ja, når alle spil er placeret til odds, der tilsammen giver overskud. Den eneste risiko er praktisk: odds, der ændrer sig, annullerede spil eller begrænsninger hos bookmakeren.',
      },
      {
        q: 'Hvad er forskellen på gevinstsikring og odds arbitrage?',
        a: 'Ved arbitrage placerer du alle spil på samme tid. Ved gevinstsikring har du allerede et spil og dækker det af senere, når oddsene har flyttet sig til din fordel.',
      },
      {
        q: 'Hvor mange penge skal man starte med?',
        a: 'Du kan starte med 2.000–5.000 kr. fordelt på 4–6 bookmakere. Med mindre end det mangler du ofte penge hos den bookmaker, der har den gode odds.',
      },
      {
        q: 'Skal man betale skat af gevinsten?',
        a: 'Gevinster fra udbydere med dansk licens er som udgangspunkt skattefrie. Gevinster fra en udenlandsk udbyder er kun skattefrie, hvis betingelserne om EU/EØS-hjemsted, offentlig godkendelse og kontrol samt et tilsvarende lovligt spil i Danmark er opfyldt. Du har selv ansvaret for at kunne dokumentere det; spørg Skattestyrelsen, hvis du er i tvivl.',
      },
    ],
    cta: { href: '/surebets', label: 'Se aktuelle surebets' },
  },
  {
    slug: 'surebet-beregner',
    title: 'Surebet beregner på dansk: beregn din indsats på sekunder',
    metaTitle: 'Surebet beregner på dansk – beregn din indsats 2026',
    description:
      'Gratis surebet beregner på dansk: beregn indsatsen på 2 eller 3 udfald, se gevinsten i kr. og %, og lær formlen bag. Med regneeksempler.',
    keyword: 'surebet beregner dansk',
    category: 'Grundlæggende',
    readMinutes: 6,
    updated: '2026-11-24',
    intro:
      'En surebet beregner fortæller dig præcis, hvor mange kroner du skal sætte på hvert udfald, så udbetalingen bliver den samme uanset resultatet. Du indtaster odds og samlet indsats, og beregneren viser fordelingen, din gevinst i kr. og i procent, og om kombinationen overhovedet er et surebet. Her er formlen bag og tre regneeksempler.',
    blocks: [
      { type: 'h2', text: 'Sådan bruger du beregneren' },
      {
        type: 'ul',
        items: [
          'Vælg, om kampen har to udfald (fx tennis) eller tre (fodbold 1X2).',
          'Indtast oddsene fra hver bookmaker i decimalformat, fx 2,10.',
          'Skriv din samlede indsats, eller lås indsatsen hos én bookmaker.',
          'Aflæs fordelingen og den garanterede gevinst i kr. og %.',
        ],
      },
      {
        type: 'p',
        text: 'Beregneren er gratis og kræver ikke login. [Åbn surebet beregneren](/beregn) i et andet faneblad, og regn med på eksemplerne nedenfor.',
      },
      { type: 'h2', text: 'Formlen: beregn indsats på surebets selv' },
      {
        type: 'p',
        text: 'Regn først 1 ÷ odds ud for hvert udfald, og læg tallene sammen. Kald summen S. Indsatsen på et udfald er så den samlede indsats × (1 ÷ odds) ÷ S, og gevinsten i procent er (1 ÷ S − 1) × 100.',
      },
      {
        type: 'example',
        title: 'Eksempel: to udfald, samlet indsats 1.000 kr.',
        rows: [
          ['Odds 2,10 hos bookmaker 1', 'indsats 490,30 kr.'],
          ['Odds 2,02 hos bookmaker 2', 'indsats 509,70 kr.'],
          ['S = 0,476 + 0,495', '0,971'],
          ['Udbetaling uanset udfald', 'ca. 1.029,60 kr.'],
          ['Sikker gevinst', 'ca. 29,60 kr. (3,0 %)'],
        ],
      },
      { type: 'h2', text: 'Når en bookmaker har en maksimal indsats' },
      {
        type: 'p',
        text: 'Ofte er det den ene bookmaker, der bestemmer, hvor meget du kan spille for. Så låser du indsatsen dér og regner den anden side ud fra udbetalingen: udbetaling ÷ odds.',
      },
      {
        type: 'example',
        title: 'Eksempel: maks. 300 kr. hos bookmaker 1',
        rows: [
          ['300 kr. på odds 2,10', 'udbetaling 630 kr.'],
          ['630 ÷ 2,02 på bookmaker 2', 'indsats 312 kr.'],
          ['Samlet indsats', '612 kr.'],
          ['Sikker gevinst', 'ca. 18 kr. (2,9 %)'],
        ],
      },
      { type: 'h2', text: 'Tre udfald: odds arbitrage på fodbold 1X2' },
      {
        type: 'example',
        title: 'Eksempel: 1X2, samlet indsats 2.000 kr.',
        rows: [
          ['Hjemmesejr, odds 2,55', 'indsats 790 kr.'],
          ['Uafgjort, odds 3,60', 'indsats 560 kr.'],
          ['Udesejr, odds 3,10', 'indsats 650 kr.'],
          ['S = 0,392 + 0,278 + 0,323', '0,993'],
          ['Mindste udbetaling', 'ca. 2.014,50 kr.'],
          ['Sikker gevinst', 'ca. 14,50 kr. (0,7 %)'],
        ],
        note: 'Indsatserne er rundet af til hele tiere. Det koster få kroner, men gør dine spil mindre iøjnefaldende.',
      },
      { type: 'h2', text: 'Afrunding og andre detaljer i dit betting værktøj' },
      {
        type: 'ul',
        items: [
          '**Rund af til hele tiere.** I to-udfaldseksemplet giver 490/510 kr. stadig mindst 29 kr. i gevinst.',
          '**Tjek gevinsten efter afrunding.** Ved små surebets under 1 % kan afrundingen æde hele gevinsten.',
          '**Brug decimalodds.** Danske bookmakere viser dem som standard, og formlen bygger på dem.',
          '**Registrér spillet bagefter,** fx i en [bet tracker](/guide/bet-tracker), så du kan se din reelle ROI.',
        ],
      },
      {
        type: 'p',
        text: 'Beregneren fortæller, hvordan du fordeler pengene, men du skal stadig finde surebets. Læs [hvordan arbitrage betting fungerer](/guide/arbitrage-betting), eller [lad BetTracker AI finde dem for dig](/).',
      },
    ],
    faq: [
      {
        q: 'Er surebet beregneren gratis?',
        a: 'Ja. Beregneren på BetTracker AI er gratis, på dansk og kræver ikke login.',
      },
      {
        q: 'Virker beregneren med tre udfald?',
        a: 'Ja. Formlen er den samme. Du lægger bare den tredje omvendte odds med i summen og fordeler indsatsen på tre spil.',
      },
      {
        q: 'Hvordan ser jeg, om det er et surebet?',
        a: 'Læg 1 ÷ odds sammen for alle udfald. Er summen under 1,00, er det et surebet. Beregneren viser det automatisk og advarer, hvis kombinationen giver tab.',
      },
      {
        q: 'Kan jeg låse indsatsen hos én bookmaker?',
        a: 'Ja. Indtast den maksimale indsats hos den ene bookmaker, så beregner du de øvrige indsatser ud fra den samme udbetaling.',
      },
    ],
    cta: { href: '/beregn', label: 'Åbn surebet beregneren' },
  },
  {
    slug: 'find-surebets-automatisk',
    title: 'Find surebets automatisk: sådan finder en odds scanner sikre gevinster og oddsfejl',
    metaTitle: 'Find surebets automatisk med scanner og oddsfejl 2026',
    description:
      'Find surebets automatisk med en odds scanner. Se hvordan betting software finder odds fejl, hvad det giver i kr., og hvad du tjekker, før du spiller.',
    keyword: 'find surebets automatisk',
    category: 'Strategi',
    readMinutes: 7,
    updated: '2026-11-24',
    intro:
      'Du finder surebets automatisk ved at lade en odds scanner hente oddsene fra flere bookmakere, matche samme kamp og samme marked, og regne ud, om de omvendte odds tilsammen giver under 1,00. Scanneren gør det på sekunder og gentager det hele døgnet. Du får en liste med færdige indsatser i kr., så du kan bruge din tid på at placere spillene i stedet for at lede.',
    blocks: [
      { type: 'h2', text: 'Hvorfor du ikke kan finde surebets i hånden' },
      {
        type: 'p',
        text: 'Regn på det: 8 bookmakere, 30 kampe og 3 udfald pr. kamp giver 720 odds, du skal holde op mod hinanden. Oddsene ændrer sig løbende, og en typisk surebet på 1–3 % holder kun i minutter. Når du har sammenlignet de sidste odds, er de første allerede ændret. Selve metoden er forklaret i guiden [hvordan fungerer arbitrage betting](/guide/arbitrage-betting).',
      },
      { type: 'h2', text: 'Sådan finder en odds scanner surebets for dig' },
      {
        type: 'ul',
        items: [
          '**Henter odds** fra alle de bookmakere, du har valgt, med faste mellemrum.',
          '**Matcher kampene.** Samme hold, samme dato og samme marked, fx kampresultat inkl. overtid.',
          '**Beregner summen af omvendte odds** for hver kombination. Er den under 1,00, er det et surebet.',
          '**Filtrerer** efter din minimumsprofit og kun de bookmakere, du har konto hos.',
          '**Udregner indsatserne,** så udbetalingen er ens uanset resultat.',
        ],
      },
      {
        type: 'example',
        title: 'Eksempel: surebet fundet af scanneren, samlet indsats 1.000 kr.',
        rows: [
          ['Hjemmehold hos bookmaker 1, odds 2,08', 'indsats 490,20 kr.'],
          ['Udehold hos bookmaker 2, odds 2,00', 'indsats 509,80 kr.'],
          ['Udbetaling uanset vinder', 'ca. 1.019,60 kr.'],
          ['Sikker gevinst', 'ca. 19,60 kr. (2,0 %)'],
        ],
        note: 'Vil du regne selv med, kan du bruge [surebet beregneren](/beregn).',
      },
      { type: 'h2', text: 'Software til at finde odds fejl: den store gevinst og den store risiko' },
      {
        type: 'p',
        text: 'En odds fejl er en odds, som en bookmaker har sat forkert, fx fordi to hold er byttet om, eller fordi en trader har tastet forkert. En scanner opdager den, fordi oddsen afviger markant fra de andre bookmakere, og fordi den pludselig skaber et surebet med en usædvanlig høj profit.',
      },
      {
        type: 'example',
        title: 'Eksempel: odds fejl, samlet indsats 1.000 kr.',
        rows: [
          ['Hjemmehold hos bookmaker 1, fejlagtig odds 2,60', 'indsats 409,10 kr.'],
          ['Udehold hos bookmaker 2, odds 1,80', 'indsats 590,90 kr.'],
          ['Udbetaling uanset vinder', 'ca. 1.063,60 kr.'],
          ['Sikker gevinst', 'ca. 63,60 kr. (6,4 %)'],
        ],
        note: 'Over tre gange så stor gevinst som et almindeligt surebet. Men bookmakeren kan annullere spillet med den fejlagtige odds, og så står du med et enkelt åbent spil.',
      },
      {
        type: 'ul',
        items: [
          '**Tjek, at oddsene er friske.** Se, hvornår scanneren sidst har hentet dem.',
          '**Tjek, at markederne er ens.** Inkl. eller ekskl. overtid og fuld tid eller første halvleg giver helt forskellige spil.',
          '**Placér det mest usikre spil først,** altså dét hos bookmakeren med den fejlagtige odds.',
          '**Brug beløb, du kan tåle at have stående,** hvis spillet bliver annulleret.',
        ],
      },
      { type: 'h2', text: 'Det skal en god betting software kunne' },
      {
        type: 'ul',
        items: [
          'Vise kun surebets hos de bookmakere, du selv har valgt.',
          'Regne indsatserne ud i kr. og vise gevinsten i procent.',
          'Opdatere ofte og vise, hvor gamle oddsene er.',
          'Sende besked, når en ny surebet over din grænse dukker op.',
          'Gemme dine spil, så du kan følge din reelle gevinst i en [bet tracker](/guide/bet-tracker).',
        ],
      },
      {
        type: 'tip',
        text: 'Se et udvalg af dagens fund på siden [dagens surebets](/dagens-surebets), og lær, hvordan du [holder dine konti åbne](/guide/undgaa-begraensning) på sigt.',
      },
      { type: 'h2', text: 'Fra scanner til gevinst: din rutine' },
      {
        type: 'p',
        text: 'Vælg dine bookmakere, sæt en minimumsprofit på 1 %, og placer spillene hurtigt og efter hinanden. Registrér dem bagefter, så du kan se, hvad scanneren faktisk har givet dig. Kampene kører også live: læs om [live arbitrage betting scanner](/guide/live-arbitrage-betting-scanner). [Prøv BetTracker AI](/) og lad scanneren gøre det tunge arbejde.',
      },
    ],
    faq: [
      {
        q: 'Hvordan finder man surebets automatisk?',
        a: 'Med en odds scanner, der sammenligner oddsene fra flere bookmakere og regner summen af omvendte odds ud. Er summen under 1,00, viser scanneren surebetten med de færdige indsatser.',
      },
      {
        q: 'Er det lovligt at bruge software til at finde odds fejl?',
        a: 'Ja, det er lovligt at sammenligne odds og spille på dem. Bookmakere må dog selv bestemme, hvem de vil have som kunder, og kan sætte dine maksimale indsatser ned. Læs mere i guiden om [er surebets lovligt](/guide/er-surebets-lovligt).',
      },
      {
        q: 'Hvor ofte opstår der odds fejl?',
        a: 'Sjældent, og de bliver typisk rettet inden for få minutter. Derfor er det vigtigt, at scanneren opdaterer ofte, og at du kan reagere hurtigt.',
      },
      {
        q: 'Kan en odds scanner give garanti for gevinst?',
        a: 'Nej. Scanneren finder muligheder, men du skal selv placere spillene, før oddsene ændrer sig. Annullerede spil og odds, der flytter sig, er de to største risici.',
      },
    ],
    cta: { href: '/surebets', label: 'Se surebets fundet af scanneren' },
  },
  {
    slug: 'live-arbitrage-betting-scanner',
    title: 'Live arbitrage betting scanner: sådan finder du live surebets, mens kampen kører',
    metaTitle: 'Live arbitrage betting scanner – live surebets 2026',
    description:
      'Sådan fungerer en live arbitrage betting scanner. Regneeksempler i kr., risikoen ved odds, der flytter sig, og tips til sports arbitrage under kampen.',
    keyword: 'live arbitrage betting scanner',
    category: 'Strategi',
    readMinutes: 7,
    updated: '2026-11-24',
    intro:
      'En live arbitrage betting scanner sammenligner bookmakernes odds, mens kampen er i gang, og viser dig surebets, der kun eksisterer i få sekunder eller minutter. Under kampen flytter oddsene sig hurtigt og ikke lige hurtigt hos alle bookmakere, og det skaber de prisforskelle, du kan tjene på. Til gengæld er risikoen større end før kampen, fordi oddsene kan ændre sig, mens dit spil bliver godkendt.',
    blocks: [
      { type: 'h2', text: 'Live surebets: hvorfor oddsene pludselig er uens' },
      {
        type: 'p',
        text: 'Et mål, et rødt kort eller et vundet tennissæt får bookmakerne til at opdatere oddsene. Nogle gør det på sekunder, andre bruger længere tid. I mellemtiden kan to bookmakeres odds tilsammen give en sum af omvendte odds under 1,00, og så er der en live surebet. Grundprincippet er det samme som i [arbitrage betting](/guide/arbitrage-betting), men tiden er knap.',
      },
      { type: 'h2', text: 'Sådan fungerer en live surebets scanner' },
      {
        type: 'ul',
        items: [
          '**Opdaterer oddsene hyppigt** for kampe, der er i gang.',
          '**Sammenligner odds** på tværs af dine bookmakere i realtid.',
          '**Viser kun friske muligheder,** så du ikke bruger tid på udløbne odds.',
          '**Regner indsatserne ud** i kr., så du kan placere spillene med det samme.',
        ],
      },
      {
        type: 'example',
        title: 'Eksempel: tennis under kampen, samlet indsats 1.000 kr.',
        rows: [
          ['Spiller A hos bookmaker 1, odds 2,20', 'indsats 469,90 kr.'],
          ['Spiller B hos bookmaker 2, odds 1,95', 'indsats 530,10 kr.'],
          ['Udbetaling uanset vinder', 'ca. 1.033,80 kr.'],
          ['Sikker gevinst', 'ca. 33,80 kr. (3,4 %)'],
        ],
        note: 'Live giver ofte højere procenter end før kampen, men det er netop fordi risikoen for, at oddsene flytter sig, er større.',
      },
      { type: 'h2', text: 'Risikoen: oddsen ændrer sig, før dit spil er godkendt' },
      {
        type: 'p',
        text: 'Mange bookmakere bruger nogle sekunder på at godkende live-spil. Når du har placeret det første spil, kan oddsen på det andet være faldet. Så sidder du med et åbent spil og skal vælge mellem at dække det til en dårligere pris eller tage chancen.',
      },
      {
        type: 'example',
        title: 'Eksempel: odds på spiller A falder fra 2,20 til 2,00, efter du har spillet på B',
        rows: [
          ['Spil på B placeret', '530,10 kr. à 1,95 = 1.033,70 kr.'],
          ['Dæk A ved odds 2,00', '1.033,70 ÷ 2,00 = 516,85 kr.'],
          ['Samlet indsats', '1.046,95 kr.'],
          ['Resultat', 'tab ca. 13,25 kr. (1,3 %)'],
        ],
        note: 'Oddsen på A kan faktisk falde til 2,06, før surebetten forsvinder. Falder den længere, bliver det et tab.',
      },
      { type: 'h2', text: 'Sports arbitrage live: sådan sammenligner du odds uden at miste overblikket' },
      {
        type: 'ul',
        items: [
          '**Start med et højere krav til profit,** fx mindst 2 %, så du har luft, hvis oddsen flytter sig.',
          '**Placér det spil først, der er sværest at få godkendt,** typisk hos bookmakeren med den højeste odds.',
          '**Vælg sportsgrene, hvor oddsene flytter sig i små skridt,** fx tennis, hvor hvert point ændrer lidt.',
          '**Hav saldo klar hos alle bookmakere,** så du ikke skal indbetale midt i spillet.',
          '**Brug [beregneren](/beregn),** hvis du skal tjekke et tal hurtigt.',
        ],
      },
      {
        type: 'tip',
        text: 'Er du ny, så start med surebets før kampen. Der har du tid til at tjekke oddsene to gange. Live passer bedst, når du kender rutinen. Sådan finder du dem [automatisk](/guide/find-surebets-automatisk).',
      },
      { type: 'h2', text: 'Kom i gang med live surebets' },
      {
        type: 'p',
        text: 'Sæt et fast maksimalt beløb pr. live-spil, og registrér hvert spil i din [bet tracker](/guide/bet-tracker), så du kan se, om live faktisk giver dig mere end før kampen. [Se de aktuelle muligheder i BetTracker AI](/).',
      },
    ],
    faq: [
      {
        q: 'Hvad er en live arbitrage betting scanner?',
        a: 'Et værktøj, der sammenligner odds hos flere bookmakere under kampen og viser, når oddsene tilsammen giver en sikker gevinst. Scanneren regner også indsatserne ud.',
      },
      {
        q: 'Er live surebets mere risikable end almindelige surebets?',
        a: 'Ja. Oddsene flytter sig hurtigere, og bookmakere godkender live-spil med få sekunders forsinkelse. Risikoen for et åbent spil er derfor større.',
      },
      {
        q: 'Hvor hurtig skal jeg være?',
        a: 'Du skal kunne placere begge spil inden for få sekunder. Har du ikke din saldo og dine konti klar, så hold dig til surebets før kampen.',
      },
      {
        q: 'Hvad er forskellen på live surebets og almindelige surebets?',
        a: 'Almindelige surebets varer ofte i minutter, mens live surebets ofte kun varer sekunder. Til gengæld kan live give højere gevinstprocenter.',
      },
    ],
    cta: { href: '/surebets', label: 'Find surebets nu' },
  },
  {
    slug: 'find-value-bets-med-ai',
    title: 'Find value bets med AI: sådan bruger kunstig intelligens odds til at finde +EV',
    metaTitle: 'Find value bets med AI – guide til +EV betting 2026',
    description:
      'Sådan finder du value bets med AI: hvordan kunstig intelligens odds sammenligner bookmakere, beregner fair odds og viser forventet gevinst i kr.',
    keyword: 'find value bets med ai',
    category: 'Strategi',
    readMinutes: 7,
    updated: '2026-11-24',
    intro:
      'Du finder value bets med AI ved at lade software sammenligne oddsene hos mange bookmakere, beregne den fair odds ud fra de skarpeste markeder og markere de spil, hvor en bookmaker giver mere end den fair odds. Et value bet vinder ikke hver gang, men giver plus over mange spil. AI gør arbejdet hurtigere, end du kan i hånden, men erstatter ikke matematikken.',
    blocks: [
      { type: 'h2', text: 'Hvad er value betting?' },
      {
        type: 'p',
        text: 'Et value bet er et spil, hvor oddsen er højere end den reelle sandsynlighed tilsiger. Har et udfald 50 % chance, er den fair odds 2,00. Får du 2,20, har du en fordel. Du taber stadig ca. halvdelen af spillene, men over mange spil vinder du mere, end du taber. Forskellen til surebets er forklaret i [value betting vs. surebets](/guide/value-betting-vs-surebets).',
      },
      { type: 'h2', text: 'Sådan beregner AI betting den fair odds' },
      {
        type: 'p',
        text: 'De skarpeste bookmakere har små marginer og flytter hurtigt oddsene efter, hvor pengene går hen. Deres odds er derfor det bedste bud på den reelle sandsynlighed. Softwaren fjerner bookmakerens margin og får den fair odds.',
      },
      {
        type: 'example',
        title: 'Eksempel: fra skarpe odds til value bet',
        rows: [
          ['Skarpe odds: hjemmehold 2,00 / udehold 1,90', 'sum af omvendte odds 1,0263'],
          ['Fair sandsynlighed hjemmehold', '0,500 / 1,0263 = 48,7 %'],
          ['Fair odds hjemmehold', 'ca. 2,05'],
          ['Odds hos en anden bookmaker', '2,20'],
          ['Forventet gevinst (EV)', '48,7 % × 2,20 − 1 = +7,2 %'],
          ['Indsats 100 kr.', 'forventet gevinst ca. 7,20 kr.'],
        ],
        note: 'Læs om, hvordan marginen fjernes, i guiden om [bookmakerens margin](/guide/bookmakerens-margin).',
      },
      { type: 'h2', text: 'Hvad en AI odds scanner i Danmark kan, og hvad den ikke kan' },
      {
        type: 'ul',
        items: [
          '**Kan:** sammenligne tusindvis af odds på sekunder og finde dem, der skiller sig ud.',
          '**Kan:** regne fair odds og forventet gevinst ud for hvert spil.',
          '**Kan:** filtrere efter dine bookmakere og din minimums-EV.',
          '**Kan ikke:** spå resultater. Kunstig intelligens odds bygger på markedet, ikke på krystalkugler.',
          '**Kan ikke:** fjerne udsving. Selv med +5 % EV kan du være i minus efter 100 spil.',
        ],
      },
      { type: 'h2', text: 'Regneeksempel: 200 value bets' },
      {
        type: 'example',
        title: '200 spil à 100 kr. med gennemsnitlig EV på 4 %',
        rows: [
          ['Samlet indsats', '20.000 kr.'],
          ['Forventet gevinst', '800 kr.'],
          ['Realistisk spænd efter 200 spil', 'fra minus til flere tusinde kr. i plus'],
        ],
        note: 'Derfor skal value betting kombineres med små indsatser på 1–2 % af bankrollen. Se [guiden til bankroll management](/guide/bankroll-management).',
      },
      {
        type: 'tip',
        text: 'Vil du have gevinsten sikret i hvert enkelt spil, er surebets den bedre vej. BetTracker AI finder surebets automatisk, så du ikke er afhængig af udsving. Læs [find surebets automatisk](/guide/find-surebets-automatisk).',
      },
      { type: 'h2', text: 'Kom i gang med AI betting' },
      {
        type: 'p',
        text: 'Start med at registrere alle spil, så du kan se din reelle ROI over tid. Uden et regnskab kan du ikke skelne mellem en god strategi og held. [Prøv BetTracker AI](/), og brug scanneren og trackeren til at bygge din strategi på tal.',
      },
    ],
    faq: [
      {
        q: 'Kan man finde value bets med AI?',
        a: 'Ja. Software kan sammenligne odds hos mange bookmakere og finde dem, der ligger over den fair odds. Det er matematik på markedets odds, ikke forudsigelser af resultater.',
      },
      {
        q: 'Hvad er forskellen på value betting og surebets?',
        a: 'Et surebet giver sikker gevinst, fordi du spiller på alle udfald. Et value bet er ét spil med positiv forventet gevinst, som du kan tabe.',
      },
      {
        q: 'Hvor mange value bets skal jeg spille, før jeg kan se et resultat?',
        a: 'Flere hundrede. Med en EV på 3–5 % kan du sagtens være i minus efter 100 spil, selvom strategien er god.',
      },
    ],
    cta: { href: '/surebets', label: 'Se surebets med sikret gevinst' },
  },
  {
    slug: 'bedste-odds-vaerktoej-danmark',
    title: 'Bedste odds værktøj i Danmark: odds sammenligning, scanner og tracker',
    metaTitle: 'Bedste odds værktøj i Danmark 2026 – sammenligning',
    description:
      'Find det bedste odds værktøj i Danmark. Vi sammenligner odds sammenligning, AI odds scanner, regneark og bet tracker, og viser hvad de giver i kr.',
    keyword: 'bedste odds værktøj danmark',
    category: 'Strategi',
    readMinutes: 6,
    updated: '2026-11-24',
    intro:
      'Det bedste odds værktøj i Danmark afhænger af, hvordan du spiller. Spiller du almindelige spil, er en odds sammenligning nok. Vil du tjene penge uden risiko, skal du bruge en odds scanner, der finder surebets automatisk. Og uanset hvad, skal du have en bet tracker, der viser, om du faktisk tjener penge.',
    blocks: [
      { type: 'h2', text: 'De fire typer betting værktøj' },
      {
        type: 'example',
        title: 'Sammenligning af betting værktøjer',
        rows: [
          ['Odds sammenligning', 'Viser den højeste odds på et spil. Godt til almindelige spil.'],
          ['Odds scanner / surebet scanner', 'Finder surebets på tværs af bookmakere automatisk.'],
          ['Surebet beregner', 'Fordeler indsatsen, så gevinsten er ens.'],
          ['Bet tracker', 'Holder regnskab med gevinst, ROI og saldi.'],
        ],
      },
      { type: 'h2', text: 'Odds sammenligning: små forskelle, stor effekt' },
      {
        type: 'p',
        text: 'Selv hvis du kun spiller almindelige spil, betaler det sig at tage den højeste odds. Forskellen på 1,85 og 1,95 ser lille ud, men løber op over mange spil.',
      },
      {
        type: 'example',
        title: 'Eksempel: 100 spil à 500 kr., 50 vundne',
        rows: [
          ['Udbetaling pr. vundet spil ved odds 1,85', '925 kr.'],
          ['Udbetaling pr. vundet spil ved odds 1,95', '975 kr.'],
          ['Forskel pr. vundet spil', '50 kr.'],
          ['Forskel over 50 vundne spil', '2.500 kr.'],
        ],
      },
      { type: 'h2', text: 'AI odds scanner i Danmark: når odds sammenligning bliver til surebets' },
      {
        type: 'p',
        text: 'En scanner går et skridt videre. Den finder de kampe, hvor de højeste odds på alle udfald tilsammen giver sikker gevinst, og regner indsatserne ud for dig.',
      },
      {
        type: 'example',
        title: 'Eksempel: surebet på over/under 2,5 mål, samlet indsats 1.000 kr.',
        rows: [
          ['Over 2,5 mål hos bookmaker 1, odds 2,10', 'indsats 487,80 kr.'],
          ['Under 2,5 mål hos bookmaker 2, odds 2,00', 'indsats 512,20 kr.'],
          ['Udbetaling uanset resultat', 'ca. 1.024,40 kr.'],
          ['Sikker gevinst', 'ca. 24,40 kr. (2,4 %)'],
        ],
        note: 'Regn selv med i [surebet beregneren](/beregn).',
      },
      { type: 'h2', text: 'Det skal du kigge efter i betting software' },
      {
        type: 'ul',
        items: [
          '**Danske bookmakere.** Værktøjet skal dække de bookmakere, du faktisk kan spille hos.',
          '**Friske odds.** Gamle odds giver surebets, der ikke findes længere.',
          '**Færdige indsatser i kr.** Så du ikke skal regne, mens oddsene flytter sig.',
          '**Indbygget tracker.** Så scanner og regnskab hænger sammen.',
          '**Mobilvenligt.** De fleste spil placeres fra telefonen.',
        ],
      },
      {
        type: 'tip',
        text: 'Se, hvilke bookmakere der giver flest muligheder, i guiden om [de bedste bookmakere til surebets](/guide/bedste-bookmakere-til-surebets).',
      },
      { type: 'h2', text: 'BetTracker AI: scanner, beregner og tracker samlet' },
      {
        type: 'p',
        text: 'BetTracker AI samler de tre værktøjer, der betyder mest for surebets: en scanner, der finder surebets hos danske bookmakere, en beregner, der fordeler indsatsen, og en tracker, der viser din gevinst og ROI. [Prøv BetTracker AI](/) og se dagens muligheder.',
      },
    ],
    faq: [
      {
        q: 'Hvad er det bedste odds værktøj i Danmark?',
        a: 'Til almindelige spil er en odds sammenligning nok. Til surebets skal du bruge en scanner med danske bookmakere, en beregner og en tracker, gerne samlet ét sted.',
      },
      {
        q: 'Er en AI odds scanner bedre end odds sammenligning?',
        a: 'Den gør mere. En odds sammenligning viser den højeste odds på ét spil, mens en scanner finder kombinationer på tværs af bookmakere, der giver sikker gevinst.',
      },
      {
        q: 'Er betting software lovligt i Danmark?',
        a: 'Ja, det er lovligt at sammenligne odds og bruge værktøjer. Læs mere i guiden om [er surebets lovligt](/guide/er-surebets-lovligt).',
      },
    ],
    cta: { href: '/surebets', label: 'Se dagens surebets' },
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
        text: 'I Danmark må en salgsfremmende foranstaltning til væddemål og onlinekasino højst have en værdi på 1.000 kr. Et eventuelt gennemspilskrav må højst være 10 gange indskuddet og bonusbeløbet tilsammen. Læs altid de konkrete vilkår, før du tager imod et tilbud.',
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
        a: 'Til væddemål og onlinekasino må tilbuddet højst have en værdi på 1.000 kr. Et eventuelt gennemspilskrav må højst være 10 gange indskuddet og bonusbeløbet tilsammen.',
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
        text: 'Gevinster fra spil hos udbydere med dansk licens fra Spillemyndigheden er som udgangspunkt skattefrie for dig som spiller. Gevinster fra udenlandske udbydere kan også være skattefrie, men kun hvis udbyderen er hjemmehørende i et EU/EØS-land, spillet er godkendt og kontrolleret af en offentlig myndighed dér, og tilsvarende spil lovligt kan udbydes i Danmark. Du skal selv kunne dokumentere betingelserne. Spørg Skattestyrelsen, hvis du er i tvivl.',
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
        a: 'Gevinster fra udbydere med dansk licens er som udgangspunkt skattefrie. Gevinster fra en udenlandsk udbyder er kun skattefrie, hvis betingelserne om EU/EØS-hjemsted, offentlig godkendelse og kontrol samt et tilsvarende lovligt spil i Danmark er opfyldt. Du skal kunne dokumentere det.'
      },
    ],
    cta: { href: '/surebets', label: 'Se surebets hos danske bookmakere' },
  },
  {
    slug: 'undgaa-begraensning',
    title: 'Sådan undgår du limits hos bookmakere som surebetter',
    metaTitle: 'Sådan undgår du limits hos bookmakere (guide 2026)',
    description:
      'Hvordan undgår man limits hos bookmakere? Syv vaner, et regneeksempel i kr. og tips til at fordele dine konti og holde dem åbne længere.',
    keyword: 'hvordan undgår man limits hos bookmakere',
    category: 'Strategi',
    readMinutes: 7,
    updated: '2026-11-24',
    intro:
      'Du kan ikke undgå limits helt, men du kan udskyde dem betydeligt. Bookmakere sætter dine maksimale indsatser ned, når din konto vinder for stabilt eller spiller anderledes end almindelige kunder. Du holder dine konti åbne længere ved at runde indsatser af, sprede dine spil over mange bookmakere, ikke jagte de højeste profitter og lade din betting strategi omfatte mere end surebets alene.',
    blocks: [
      { type: 'h2', text: 'Hvorfor sætter bookmakere limits på surebettere?' },
      {
        type: 'p',
        text: 'Bookmakerne tjener på deres margin, som typisk er 4–7 %. En kunde, der altid spiller på de odds, som er højere end markedet, koster dem penge. Deres systemer leder efter mønstre som skæve indsatser, spil på små ligaer, spil kort efter en oddsændring og kunder, der aldrig spiller kombinationsspil. Bookmakere må selv vælge, hvem de vil have som kunder. Grundreglerne for surebets kan du læse i guiden [hvordan fungerer arbitrage betting](/guide/arbitrage-betting).',
      },
      { type: 'h2', text: 'Syv vaner, der holder dine konti åbne længere' },
      {
        type: 'ul',
        items: [
          '**Rund indsatserne af** til hele tiere eller halve hundreder i stedet for 493,98 kr.',
          '**Undgå de højeste profitprocenter.** De skyldes ofte odds fejl og tiltrækker opmærksomhed.',
          '**Spil også på store kampe og populære markeder,** ikke kun på små ligaer.',
          '**Spred dine spil.** Brug ikke de samme to bookmakere hver gang.',
          '**Vent med at hæve gevinsten** til du har en samlet sum, i stedet for efter hvert spil.',
          '**Spil engang imellem på kampe, du selv har en holdning til,** uden at det er et surebet.',
          '**Hold styr på, hvor meget du spiller hos hver bookmaker,** i en [bet tracker](/guide/bet-tracker).',
        ],
      },
      { type: 'h2', text: 'Regneeksempel: hvad koster det at blive limited?' },
      {
        type: 'p',
        text: 'Afrunding koster næsten ingenting, mens en limit koster meget. Her er begge dele i tal.',
      },
      {
        type: 'example',
        title: 'Afrunding: surebet med odds 2,08 og 2,00, samlet indsats 1.000 kr.',
        rows: [
          ['Præcise indsatser 490,20 kr. og 509,80 kr.', 'gevinst ca. 19,60 kr.'],
          ['Afrundede indsatser 490 kr. og 510 kr.', 'gevinst ca. 19,20 kr.'],
          ['Pris for at ligne en almindelig kunde', 'ca. 0,40 kr.'],
        ],
      },
      {
        type: 'example',
        title: 'Limit: surebet med 2 % gevinst, før og efter',
        rows: [
          ['Maksimal indsats 2.000 kr.', 'gevinst ca. 40 kr. pr. spil'],
          ['Maksimal indsats sat ned til 150 kr.', 'gevinst ca. 3 kr. pr. spil'],
          ['Tabt indtjening pr. spil', 'ca. 37 kr. (92 %)'],
        ],
        note: 'Det er derfor, det betaler sig at tænke langsigtet. En enkelt ekstra procent er ikke værd at risikere en konto for.',
      },
      { type: 'h2', text: 'Bedste bookmakere til surebets i Danmark: spred dine konti' },
      {
        type: 'p',
        text: 'Jo flere bookmakere med dansk licens du bruger, jo færre spil får hver af dem. Spiller du 24 surebets på en måned fordelt på 6 bookmakere, er det kun 4 spil pr. bookmaker. Spiller du dem på to bookmakere, er det 12 hos hver, og de lægger mærke til det hurtigere. Du kan læse mere om, hvilke bookmakere der passer bedst, i guiden [bedste bookmakere til surebets](/guide/bedste-bookmakere-til-surebets). Husk, at du kun må have én konto pr. person hos hver bookmaker.',
      },
      {
        type: 'tip',
        text: 'I [BetTracker AI](/) vælger du selv de bookmakere, du har konto hos, så du kun ser surebets, du kan spille, og lettere kan fordele dine spil.',
      },
      { type: 'h2', text: 'Betting strategi, hvis du alligevel bliver limited' },
      {
        type: 'ul',
        items: [
          '**Brug kontoen alligevel.** En limited konto kan stadig bruges til mindre indsatser og velkomstbonusser, se guiden om [matched betting](/guide/matched-betting).',
          '**Flyt fokus til andre bookmakere,** og lad den limited konto hvile.',
          '**Spil mindre, men oftere,** så din samlede gevinst holder.',
          '**Planlæg din bankroll efter det,** se [bankroll management](/guide/bankroll-management).',
        ],
      },
      {
        type: 'p',
        text: 'Se de aktuelle muligheder og vælg dine bookmakere i [BetTracker AI](/).',
      },
    ],
    faq: [
      {
        q: 'Kan man helt undgå limits hos bookmakere?',
        a: 'Nej. Bookmakere kan altid sætte dine maksimale indsatser ned. Men du kan udskyde det med afrundede indsatser, spredte spil og færre jagter på de højeste profitter.',
      },
      {
        q: 'Hvor lang tid går der, før man bliver limited?',
        a: 'Det varierer meget og afhænger af bookmakeren og af, hvordan du spiller. Nogle begrænser efter få uger, andre først efter flere måneder.',
      },
      {
        q: 'Hvad gør jeg, hvis jeg bliver limited?',
        a: 'Brug kontoen til bonusser og mindre indsatser, og flyt dine surebets til de andre bookmakere. Husk, at bookmakeren skal udbetale det, du har stående på kontoen.',
      },
      {
        q: 'Må jeg have flere konti hos samme bookmaker?',
        a: 'Nej. Du må kun have én konto pr. person hos hver bookmaker. Det er de mange forskellige bookmakere, der giver dig flere muligheder, ikke flere konti hos samme.',
      },
    ],
    cta: { href: '/surebets', label: 'Se surebets hos dine bookmakere' },
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
          'Kontrollér, at udbyderen har dansk licens fra Spillemyndigheden, og at licensen gælder det præcise domæne.',
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
    title: 'Guide til bankroll management i betting: sådan styrer du dine penge',
    metaTitle: 'Bankroll management i betting – guide 2026',
    description:
      'Guide til bankroll management i betting: hvor stor din bankroll skal være, hvor meget du sætter pr. spil, og hvordan du beregner din ROI i kr. og %.',
    keyword: 'guide til bankroll management i betting',
    category: 'Strategi',
    readMinutes: 7,
    updated: '2026-11-24',
    intro:
      'Bankroll management i betting betyder, at du sætter et fast beløb af til spil, fordeler det mellem dine bookmakere og aldrig satser mere pr. spil, end din plan tillader. Ved surebets handler det om at have pengene det rigtige sted, når muligheden dukker op. Ved value betting handler det om at overleve de tab, der altid kommer undervejs.',
    blocks: [
      { type: 'h2', text: 'Trin 1: Sæt en fast bankroll' },
      {
        type: 'p',
        text: 'Bestem et beløb, du kan undvære, og hold det adskilt fra dine øvrige penge. Det er din bankroll. Læg ikke flere penge ind, fordi et spil gik galt, og tag ikke penge ud midt i en måned. Så kan du se, hvad strategien faktisk giver.',
      },
      { type: 'h2', text: 'Trin 2: Fordel pengene mellem bookmakere' },
      {
        type: 'p',
        text: 'Et surebet kræver penge hos to eller flere bookmakere på samme tid. Har du alle pengene ét sted, kan du ikke spille, når surebettet dukker op. Hold derfor en del af bankrollen som reserve, du kan indbetale, hvor der mangler penge.',
      },
      {
        type: 'example',
        title: 'Eksempel: bankroll på 10.000 kr.',
        rows: [
          ['5 bookmakere à 1.500 kr.', '7.500 kr.'],
          ['Reserve på bankkontoen', '2.500 kr.'],
          ['Maks. samlet indsats pr. surebet', '1.000–1.500 kr. (10–15 %)'],
        ],
        note: 'Se, hvilke bookmakere der passer til surebets, i guiden om [de bedste bookmakere til surebets](/guide/bedste-bookmakere-til-surebets).',
      },
      { type: 'h2', text: 'Trin 3: Vælg din indsats pr. spil' },
      {
        type: 'ul',
        items: [
          '**Surebets:** 10–15 % af bankrollen pr. surebet. Gevinsten er sikret, så risikoen ligger i annullerede spil og odds, der flytter sig.',
          '**Value bets:** 1–2 % af bankrollen pr. spil, altså 100–200 kr. ved 10.000 kr. Du taber mange enkeltspil, så indsatsen skal være lille.',
          '**Ingen jagt på tab.** Hæv aldrig indsatsen for at vinde et tab tilbage.',
        ],
      },
      {
        type: 'tip',
        text: 'Brug [surebet beregneren](/beregn) til at fordele den samlede indsats, så udbetalingen bliver ens uanset resultat.',
      },
      { type: 'h2', text: 'Trin 4: Følg din ROI med en sports betting ROI beregner' },
      {
        type: 'p',
        text: 'ROI viser, hvor meget du tjener pr. krone, du satser. Afkast på bankroll viser, hvor meget din bankroll er vokset. Begge tal skal med, når du vurderer din strategi.',
      },
      {
        type: 'example',
        title: 'Eksempel: to måneders surebets',
        rows: [
          ['60 surebets à 1.000 kr.', 'samlet indsats 60.000 kr.'],
          ['Samlet gevinst', '1.200 kr.'],
          ['ROI (gevinst / indsats)', '2,0 %'],
          ['Afkast på bankroll (gevinst / 10.000 kr.)', '12 %'],
        ],
        note: 'Samme penge bliver satset igen og igen. Derfor er afkastet på bankrollen meget højere end ROI.',
      },
      { type: 'h2', text: 'Trin 5: Hold styr på dine bets gratis' },
      {
        type: 'p',
        text: 'Bankroll management virker kun, hvis du kender dine tal. Registrér hvert spil, og se din saldo hos hver bookmaker, før du placerer det næste. Det er præcis, hvad en [bet tracker](/guide/bet-tracker) gør. [Prøv BetTracker AI](/) og få din bankroll, ROI og saldi samlet ét sted.',
      },
    ],
    faq: [
      {
        q: 'Hvor stor skal min bankroll være til surebets?',
        a: 'Mindst 5.000–10.000 kr., så du kan have penge hos flere bookmakere på én gang. Med for lille en bankroll bliver gevinsten pr. surebet meget lille.',
      },
      {
        q: 'Hvordan beregner jeg min ROI i sports betting?',
        a: 'Del din samlede gevinst med din samlede indsats. 1.200 kr. i gevinst på 60.000 kr. i indsats giver en ROI på 2,0 %.',
      },
      {
        q: 'Hvad gør jeg, når en bookmaker løber tør for penge?',
        a: 'Flyt penge fra reserven, eller hæv fra en bookmaker med for meget stående. Hold øje med saldoen, så det ikke sker midt i et surebet.',
      },
      {
        q: 'Gælder bankroll management også for value betting?',
        a: 'Ja, og endnu mere. Ved value betting taber du mange spil i træk, så små indsatser på 1–2 % er nødvendige. Læs om forskellen i [value betting vs. surebets](/guide/value-betting-vs-surebets).',
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
      'Gevinster fra spil hos udbydere med dansk licens er som udgangspunkt skattefrie for dig som spiller. Gevinster fra udenlandske udbydere kræver en særskilt vurdering efter Skattestyrelsens betingelser; en EU/EØS-licens er ikke i sig selv nok.',
    blocks: [
      { type: 'h2', text: 'Danske bookmakere: skattefrit' },
      {
        type: 'p',
        text: 'Når du spiller hos en udbyder med licens fra Spillemyndigheden, betaler udbyderen spilleafgift af sin indtjening. Dine gevinster er derfor som udgangspunkt skattefrie, og du skal ikke oplyse dem til Skattestyrelsen.',
      },
      { type: 'h2', text: 'Gevinster hos udbydere uden dansk licens' },
      {
        type: 'p',
        text: 'Gevinster fra en udenlandsk udbyder er kun skattefrie, hvis udbyderen er hjemmehørende i et EU/EØS-land, spillet er godkendt og kontrolleret af en offentlig myndighed dér, og tilsvarende spil lovligt kan udbydes i Danmark. Du skal selv kunne dokumentere, at betingelserne er opfyldt. Hvis de ikke er det, kan gevinsten være skattepligtig. Kontrollér altid reglerne hos Skattestyrelsen.',
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
        a: 'Som udgangspunkt er gevinster fra udbydere med dansk licens skattefrie. Gevinster fra udenlandske udbydere afhænger af, om Skattestyrelsens betingelser er opfyldt.'
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
  {
    slug: 'surebet-danmark-alternativ',
    title: 'BetTrackerAI vs. Surebet Danmark: det billigere alternativ',
    metaTitle: 'Surebet Danmark alternativ – BetTrackerAI sammenlignet (2026)',
    description:
      'Sammenligning af BetTrackerAI og Surebet Danmark: pris, funktioner, bookmakere og regnskab. Se hvilket surebet-værktøj der passer til dig.',
    keyword: 'surebet danmark alternativ',
    category: 'Grundlæggende',
    readMinutes: 5,
    updated: '2026-11-23',
    intro:
      'Surebet Danmark og BetTrackerAI er de to danske værktøjer, der finder surebets hos bookmakere med dansk licens. Begge giver dig 7 dages gratis prøve. Forskellen ligger i prisen, og i hvad du får ud over selve surebet-listen.',
    blocks: [
      { type: 'h2', text: 'Kort fortalt' },
      {
        type: 'example',
        title: 'BetTrackerAI og Surebet Danmark side om side',
        rows: [
          ['Pris pr. måned', 'BetTrackerAI fra 149 kr. · Surebet Danmark 999 kr.'],
          ['Gratis prøve', 'Begge: 7 dage'],
          ['Bookmakere', 'Begge: kun bookmakere med dansk licens'],
          ['Notifikationer', 'BetTrackerAI: push og SMS (Premium) · Surebet Danmark: live notifikationer'],
          ['Regnskab over dine spil', 'BetTrackerAI: fuldt regnskab med ROI og bankroll pr. bookmaker · Surebet Danmark: bet tracker'],
          ['Gratis beregner og guides', 'BetTrackerAI: surebet beregner og guides på dansk'],
        ],
        note: 'Priserne er tjekket på begge sider den 23. november 2026 og kan ændre sig.',
      },
      { type: 'h2', text: 'Pris: forskellen er stor' },
      {
        type: 'p',
        text: 'Surebet Danmark koster 999 kr. om måneden. BetTrackerAI koster 149 kr. om måneden for Basis med surebets op til 5 % profit, og 249 kr. for Premium med alle surebets og SMS-alerts. Med Premium sparer du 750 kr. om måneden, altså 9.000 kr. om året.',
      },
      {
        type: 'p',
        text: 'Det betyder noget, fordi surebets typisk giver 1–5 % pr. spil. Med en lav månedspris skal du omsætte langt mindre, før abonnementet har tjent sig hjem.',
      },
      { type: 'h2', text: 'Regnskab: her adskiller BetTrackerAI sig' },
      {
        type: 'p',
        text: 'Surebets er kun lønsomme, hvis du ved præcis, hvor meget du har tjent. I BetTrackerAI registrerer du dine surebets og indskud, og du ser din profit, din ROI og din saldo hos hver bookmaker samlet ét sted. Du kan også importere en kupon i stedet for at taste den ind.',
      },
      { type: 'h2', text: 'Hvem passer hvad til?' },
      {
        type: 'ul',
        items: [
          'Vælg BetTrackerAI, hvis du vil have danske surebets til en lav pris og samtidig holde styr på dit regnskab.',
          'Vælg Surebet Danmark, hvis du allerede bruger deres system og er tilfreds med prisen.',
          'Er du i tvivl, så prøv begge. De har begge 7 dages gratis prøve, så du kan sammenligne surebets på de samme kampe.',
        ],
      },
      {
        type: 'tip',
        text: 'Uanset hvilket værktøj du vælger: placér altid det spil med den mest ustabile odds først, og tjek at markedet er det samme hos begge bookmakere.',
      },
    ],
    faq: [
      {
        q: 'Er BetTrackerAI billigere end Surebet Danmark?',
        a: 'Ja. BetTrackerAI koster 149 eller 249 kr. om måneden, mens Surebet Danmark koster 999 kr. om måneden (pr. 23. november 2026).',
      },
      {
        q: 'Bruger begge kun danske bookmakere?',
        a: 'Ja. Begge værktøjer fokuserer på bookmakere med dansk licens, så du spiller lovligt og med dansk spillerbeskyttelse.',
      },
      {
        q: 'Kan jeg prøve BetTrackerAI gratis?',
        a: 'Ja. Du får 7 dages gratis prøve med fuld adgang, og du kan opsige når som helst i prøveperioden.',
      },
    ],
    cta: { href: '/konto', label: 'Prøv BetTrackerAI gratis i 7 dage' },
  },
  {
    slug: 'bet-tracker',
    title: 'Betting regneark alternativ: derfor er en bet tracker bedre end Excel',
    metaTitle: 'Betting regneark alternativ: bedste bet tracker 2026',
    description:
      'Træt af dit betting regneark? Se hvordan en automatisk bet tracker holder dit odds regnskab, viser din ROI i kr. og % og sparer dig for tastefejl.',
    keyword: 'betting regneark alternativ',
    category: 'Strategi',
    readMinutes: 6,
    updated: '2026-11-24',
    intro:
      'Det bedste alternativ til et betting regneark er en bet tracker, der registrerer dine spil, regner gevinst og ROI ud automatisk og viser, hvor mange penge du har stående hos hver bookmaker. Regnearket kræver, at du taster alt selv, og én forkert odds eller indsats ødelægger hele regnskabet. En tracker gør det samme arbejde på få sekunder pr. spil.',
    blocks: [
      { type: 'h2', text: 'Hvorfor regnearket ikke holder, når du spiller mange surebets' },
      {
        type: 'p',
        text: 'Et surebet består af mindst to spil hos to bookmakere. Spiller du 40 surebets om måneden, er det 80 linjer i regnearket, hver med bookmaker, odds, indsats, resultat og udbetaling. Det er 400 felter, du skal taste korrekt. Skriver du 2,10 i stedet for 2,01, viser regnearket en gevinst, du aldrig har fået.',
      },
      {
        type: 'ul',
        items: [
          '**Tastefejl** i odds eller indsats giver forkert profit.',
          '**Formler går i stykker,** når du indsætter rækker eller kopierer ark.',
          '**Ingen samlet saldo pr. bookmaker,** så du ved ikke, hvor pengene står.',
          '**Ingen overblik på mobilen,** når du placerer spil på farten.',
        ],
      },
      { type: 'h2', text: 'Sådan fungerer en automatisk bet tracking app' },
      {
        type: 'p',
        text: 'En bet tracker samler alle dine spil ét sted og regner resten ud for dig. Du registrerer et surebet med ét klik fra scanneren, og trackeren lægger begge spil ind med de rigtige odds og indsatser. Når kampen er slut, ser du gevinsten i kr. og ROI i procent.',
      },
      {
        type: 'example',
        title: 'Eksempel: en måned i dit odds regnskab',
        rows: [
          ['Antal surebets', '40'],
          ['Samlet indsats', '40.000 kr.'],
          ['Samlet gevinst', '720 kr.'],
          ['ROI', '1,8 %'],
        ],
        note: 'ROI er gevinsten delt med den samlede indsats: 720 / 40.000 = 1,8 %. Læs mere i guiden om [ROI i betting](/guide/roi-betting).',
      },
      { type: 'h2', text: 'Bet tracker vs. regneark: sammenligning' },
      {
        type: 'example',
        title: 'Regneark og bet tracker side om side',
        rows: [
          ['Registrering af et surebet', 'Regneark: 1–2 min. / Tracker: få sekunder'],
          ['Gevinst og ROI', 'Regneark: egne formler / Tracker: automatisk'],
          ['Saldo pr. bookmaker', 'Regneark: manuelt / Tracker: altid opdateret'],
          ['Risiko for tastefejl', 'Regneark: høj / Tracker: lav'],
          ['Adgang på mobil', 'Regneark: besværligt / Tracker: ja'],
        ],
      },
      { type: 'h2', text: 'Hvad den bedste bet tracker app skal kunne' },
      {
        type: 'ul',
        items: [
          'Registrere surebets med begge spil på én gang.',
          'Vise gevinst i kr. og ROI i % pr. dag, måned og bookmaker.',
          'Holde styr på saldoen hos hver bookmaker, så du ved, hvor du skal indbetale.',
          'Håndtere annullerede spil og ændrede odds.',
          'Virke på mobilen, hvor du placerer de fleste spil.',
        ],
      },
      {
        type: 'tip',
        text: 'Brug trackeren sammen med en fast [bankroll management](/guide/bankroll-management), så du altid ved, hvor stor en indsats du kan tåle pr. surebet.',
      },
      { type: 'h2', text: 'Hold styr på dine bets gratis og kom i gang' },
      {
        type: 'p',
        text: 'Du kan prøve BetTracker AI gratis og registrere dine surebets direkte fra scanneren. Så får du dit odds regnskab, din ROI og dine saldi uden at taste noget i et regneark. Har du allerede spil i Excel, kan du starte forfra fra i dag og lade de gamle ligge som historik. [Prøv BetTracker AI](/) og se din rigtige profit.',
      },
    ],
    faq: [
      {
        q: 'Kan jeg holde styr på mine bets gratis?',
        a: 'Ja. Et regneark er gratis, men kræver meget tastearbejde. BetTracker AI kan prøves gratis i 7 dage, hvor du kan registrere dine spil og se din ROI automatisk.',
      },
      {
        q: 'Hvad er den bedste bet tracker app?',
        a: 'Den, der passer til din måde at spille på. Spiller du surebets, skal den kunne registrere flere spil som ét surebet og vise saldoen hos hver bookmaker.',
      },
      {
        q: 'Hvorfor skal jeg føre et odds regnskab?',
        a: 'Fordi du ellers ikke ved, om du tjener penge. Mange tror, de er i plus, indtil de lægger alle spil sammen. Se også guiden om [betting regnskab](/guide/betting-regnskab).',
      },
    ],
    cta: { href: '/stats', label: 'Åbn din bet tracker' },
  },
  {
    slug: 'roi-betting',
    title: 'ROI på betting: sådan beregner du dit afkast',
    metaTitle: 'ROI betting – sådan beregner du afkast på dine spil',
    description:
      'Lær at beregne ROI og yield på betting med eksempler. Se hvad et godt afkast er, og hvorfor ROI siger mere end din samlede gevinst.',
    keyword: 'roi betting',
    category: 'Strategi',
    readMinutes: 4,
    updated: '2026-11-23',
    intro:
      'ROI står for return on investment og viser, hvor mange procent du tjener i forhold til det, du har sat på spil. Det er det tal, der fortæller, om din strategi virker, uanset hvor store indsatser du bruger.',
    blocks: [
      { type: 'h2', text: 'Formlen' },
      {
        type: 'p',
        text: 'ROI = profit divideret med samlet indsats, ganget med 100. Profitten er det, du har fået udbetalt, minus det, du har sat på spil.',
      },
      {
        type: 'example',
        title: 'Eksempel: en måned med surebets',
        rows: [
          ['Samlet indsats', '40.000 kr.'],
          ['Samlet udbetaling', '41.000 kr.'],
          ['Profit', '1.000 kr.'],
          ['ROI', '1.000 / 40.000 × 100 = 2,5 %'],
        ],
        note: 'Du har tjent 2,5 øre for hver krone, du har sat på spil.',
      },
      { type: 'h2', text: 'ROI og yield er det samme' },
      {
        type: 'p',
        text: 'I betting bruges ordene ROI og yield ofte om det samme tal: profit i forhold til samlet indsats. Nogle regner i stedet ROI ud i forhold til din bankroll. Det giver et højere tal, fordi den samme bankroll bliver brugt mange gange. Tjek altid, hvilken metode et tal er regnet med, før du sammenligner.',
      },
      { type: 'h2', text: 'Hvad er en god ROI?' },
      {
        type: 'ul',
        items: [
          'Almindelige spil på lang sigt: de fleste spillere ligger under 0 %, fordi bookmakeren tager en margin.',
          'Value betting: 2–5 % over mange spil er et godt resultat.',
          'Surebets: typisk 1–5 % pr. surebet, men næsten uden risiko, fordi alle udfald er dækket.',
        ],
      },
      {
        type: 'tip',
        text: 'ROI siger mest over mange spil. Efter 20 spil kan tallet svinge meget. Efter flere hundrede spil viser det, om din strategi holder.',
      },
    ],
    faq: [
      {
        q: 'Hvordan beregner jeg ROI på betting?',
        a: 'Tag din profit, divider med din samlede indsats og gang med 100. Har du sat 10.000 kr. på spil og tjent 300 kr., er din ROI 3 %.',
      },
      {
        q: 'Hvad er forskellen på ROI og profit?',
        a: 'Profit er det beløb, du har tjent. ROI er profitten i procent af din indsats. Den gør det muligt at sammenligne resultater med forskellige indsatser.',
      },
      {
        q: 'Kan jeg se min ROI automatisk?',
        a: 'Ja. Regnskabet i BetTrackerAI regner din ROI ud ud fra de spil, du registrerer.',
      },
    ],
    cta: { href: '/stats', label: 'Se din ROI i regnskabet' },
  },
  {
    slug: 'betting-regnskab',
    title: 'Betting-regnskab: sådan holder du styr på din bankroll',
    metaTitle: 'Betting regnskab – styr på saldo hos alle bookmakere',
    description:
      'Sådan fører du regnskab over din betting: indskud, udbetalinger og saldo hos hver bookmaker. Undgå at miste overblikket, når du spiller hos flere bookmakere.',
    keyword: 'betting regnskab',
    category: 'Strategi',
    readMinutes: 4,
    updated: '2026-11-23',
    intro:
      'Når du spiller surebets, har du penge stående hos mange bookmakere på én gang. Et betting-regnskab viser dig, hvor pengene er, og hvor meget du har tjent, når du lægger det hele sammen.',
    blocks: [
      { type: 'h2', text: 'Hvorfor overblikket forsvinder' },
      {
        type: 'p',
        text: 'Ved surebets vinder du hos én bookmaker og taber hos en anden. Saldoen flytter sig hele tiden, og du skal løbende indbetale og hæve for at have penge de rigtige steder. Uden et regnskab er det svært at se, om du samlet set er i plus.',
      },
      { type: 'h2', text: 'Det skal dit regnskab indeholde' },
      {
        type: 'ul',
        items: [
          'Alle indskud og udbetalinger hos hver bookmaker',
          'Den aktuelle saldo hos hver bookmaker',
          'Alle spil med indsats, odds og resultat',
          'Din samlede profit: nuværende saldoer plus udbetalinger minus indskud',
        ],
      },
      {
        type: 'example',
        title: 'Eksempel: samlet profit på tværs af bookmakere',
        rows: [
          ['Indskud i alt', '10.000 kr.'],
          ['Udbetalt i alt', '3.000 kr.'],
          ['Saldo hos bookmakerne nu', '7.800 kr.'],
          ['Profit', '3.000 + 7.800 − 10.000 = 800 kr.'],
        ],
      },
      { type: 'h2', text: 'Gode vaner' },
      {
        type: 'ul',
        items: [
          'Registrér indskud og udbetalinger samme dag.',
          'Afstem saldoen med bookmakerens egen saldo en gang om ugen.',
          'Hold dine bettingpenge adskilt fra dine almindelige penge, så du ikke kommer til at spille for penge, du skal bruge.',
        ],
      },
      {
        type: 'tip',
        text: 'Regnskabet i BetTrackerAI viser saldo, indskud og profit pr. bookmaker, så du altid ved, hvor dine penge står.',
      },
    ],
    faq: [
      {
        q: 'Skal jeg betale skat af mine gevinster?',
        a: 'Gevinster hos udbydere med dansk licens er som udgangspunkt skattefrie. For udenlandske udbydere afhænger skatten af, om Skattestyrelsens betingelser er opfyldt. Læs vores guide om skat på spillegevinster for detaljerne.'
      },
      {
        q: 'Hvor ofte skal jeg opdatere mit regnskab?',
        a: 'Registrér spil og indskud med det samme, og afstem saldoerne en gang om ugen.',
      },
    ],
    cta: { href: '/stats', label: 'Åbn dit regnskab' },
  },
]

export function getGuide(slug: string) {
  return GUIDES.find((guide) => guide.slug === slug)
}
