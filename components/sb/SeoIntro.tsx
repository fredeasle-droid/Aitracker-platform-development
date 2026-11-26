import Link from '@/components/localized-link'
import { SPORT_PAGES } from '@/lib/landing-pages'
import { LOCALE_SOURCE, type BaseTranslated, type Locale, type NewLocale } from '@/lib/locale-list'
import { localePath, type TranslationKey } from '@/lib/i18n'
import { getServerLocale, getServerT } from '@/lib/locale-server'

type SeoCopy = {
  heading: string
  paragraph: string
  workflow: string
  sportsHeading: string
  bookmakersHeading: string
  bookmakers: string
  bookmakerGuide: string
}

const SEO_COPY: Record<BaseTranslated | 'da', SeoCopy> = {
  da: {
    heading: 'Surebets i realtid hos danske bookmakere',
    paragraph:
      'Et surebet er en kombination af odds hos forskellige bookmakere, hvor du spiller på alle udfald af en kamp og får en gevinst uanset resultatet. BetTrackerAI scanner odds hos danske bookmakere med licens fra Spillemyndigheden døgnet rundt og viser mulighederne, så snart de opstår, sammen med den garanterede profit og den rigtige fordeling af indsatsen.',
    workflow:
      'Vælg bookmakerne i filteret, og sortér mulighederne efter profit.',
    sportsHeading: 'Surebets efter sport',
    bookmakersHeading: 'Bookmakere i vores guide',
    bookmakers: 'Den danske guide gennemgår Bet365, Unibet, NordicBet, LeoVegas, Betano og Danske Spil (Oddset).',
    bookmakerGuide: 'Se guiden til de bedste bookmakere til surebets',
  },
  en: {
    heading: 'Live surebets across bookmakers',
    paragraph:
      'A surebet combines odds from different bookmakers so you cover every outcome of an event and can secure a return regardless of the result. BetTrackerAI scans bookmaker odds around the clock and shows opportunities as they appear, including the estimated profit and the stake split needed to cover each outcome.',
    workflow:
      'Choose the bookmakers you use in the filter and sort opportunities by profit.',
    sportsHeading: 'Surebets by sport',
    bookmakersHeading: 'Bookmakers covered in our guide',
    bookmakers: 'Our guide covers operators such as bet365, Pinnacle, Unibet, Betfair, William Hill, Betway and bwin. Only use bookmakers that are licensed where you live.',
    bookmakerGuide: 'Read the guide to the best bookmakers for surebets',
  },
  sv: {
    heading: 'Surebets i realtid hos svenska spelbolag',
    paragraph:
      'En surebet kombinerar odds från olika spelbolag så att du spelar på alla utfall och kan säkra en avkastning oavsett resultat. BetTrackerAI bevakar oddsen dygnet runt och visar möjligheter när de uppstår, tillsammans med beräknad vinst och hur insatsen ska fördelas mellan utfallen.',
    workflow:
      'Välj spelbolagen du använder i filtret och sortera möjligheterna efter vinst.',
    sportsHeading: 'Surebets per sport',
    bookmakersHeading: 'Spelbolag i vår guide',
    bookmakers: 'Den svenska guiden tar upp bland andra Svenska Spel Sport & Casino, bet365, Unibet, LeoVegas, Betsson och Mr Green.',
    bookmakerGuide: 'Läs guiden till de bästa spelbolagen för surebets',
  },
  no: {
    heading: 'Surebets som analyse for det norske markedet',
    paragraph:
      'En surebet kombinerer odds fra ulike bookmakere slik at du dekker alle utfall og kan sikre avkastning uansett resultat. Norsk Tipping er den eneste lisensierte spilltilbyderen i Norge, så det er ikke mulig å lage en surebet ved å kombinere flere norske, lisensierte bookmakere. BetTrackerAI viser odds og markedsforskjeller som analyse; sjekk alltid norske regler og vilkårene hos hver tilbyder.',
    workflow:
      'Velg bookmakerne du bruker i filteret, og sorter mulighetene etter profitt.',
    sportsHeading: 'Surebets etter sport',
    bookmakersHeading: 'Bookmakere og norske regler',
    bookmakers: 'Norsk Tipping er den eneste lisensierte spilltilbyderen i Norge. En surebet krever ulike tilbydere, så odds fra Norsk Tipping alene er ikke nok.',
    bookmakerGuide: 'Les guiden om bookmakere og regler for surebets',
  },
  de: {
    heading: 'Surebets in Echtzeit bei deutschen Buchmachern',
    paragraph:
      'Eine Surebet kombiniert Quoten verschiedener Buchmacher, sodass alle möglichen Ausgänge abgedeckt sind und unabhängig vom Ergebnis ein Ertrag möglich ist. BetTrackerAI überwacht Quoten rund um die Uhr und zeigt passende Möglichkeiten mit dem berechneten Gewinn und der nötigen Einsatzverteilung.',
    workflow:
      'Wähle deine Buchmacher im Filter aus und sortiere die Möglichkeiten nach Gewinn.',
    sportsHeading: 'Surebets nach Sportart',
    bookmakersHeading: 'Buchmacher in unserem Ratgeber',
    bookmakers: 'Der Ratgeber für Deutschland behandelt unter anderem Tipico, bwin, bet365, Interwetten, Betway und ODDSET. Prüfe vor dem Spielen stets die aktuelle Lizenz und die Bedingungen des jeweiligen Anbieters.',
    bookmakerGuide: 'Ratgeber zu den besten Buchmachern für Surebets',
  },
  es: {
    heading: 'Surebets en tiempo real en casas de apuestas',
    paragraph:
      'Una surebet combina cuotas de distintas casas de apuestas para cubrir todos los resultados y buscar un beneficio independientemente del desenlace. BetTrackerAI analiza las cuotas continuamente y muestra oportunidades con el beneficio estimado y el reparto de apuesta necesario.',
    workflow:
      'Elige las casas de apuestas que utilizas en el filtro y ordena las oportunidades por beneficio.',
    sportsHeading: 'Surebets por deporte',
    bookmakersHeading: 'Casas de apuestas de nuestra guía',
    bookmakers: 'La guía para España incluye operadores como Codere, bet365, Sportium, bwin, Luckia y Retabet.',
    bookmakerGuide: 'Lee la guía de casas de apuestas para surebets',
  },
  br: {
    heading: 'Surebets em tempo real em casas de apostas brasileiras',
    paragraph:
      'Uma surebet combina odds de diferentes casas de apostas para cobrir todos os resultados e buscar retorno independentemente do desfecho. A BetTrackerAI acompanha as odds continuamente e mostra oportunidades com o lucro estimado e a divisão necessária das apostas.',
    workflow:
      'Escolha as casas de apostas que utiliza no filtro e ordene as oportunidades pelo lucro.',
    sportsHeading: 'Surebets por esporte',
    bookmakersHeading: 'Casas de apostas do nosso guia',
    bookmakers: 'O guia brasileiro inclui operadores autorizados como Betano, Superbet, bet365, Sportingbet, KTO e Estrela Bet.',
    bookmakerGuide: 'Leia o guia de casas de apostas para surebets',
  },
  pt: {
    heading: 'Surebets em tempo real nas casas de apostas portuguesas',
    paragraph:
      'Uma surebet combina odds de diferentes casas de apostas para cobrir todos os resultados e procurar retorno independentemente do desfecho. A BetTrackerAI acompanha as odds continuamente e mostra oportunidades com o lucro estimado e a distribuição necessária das apostas.',
    workflow:
      'Escolha as casas de apostas que utiliza no filtro e ordene as oportunidades pelo lucro.',
    sportsHeading: 'Surebets por modalidade',
    bookmakersHeading: 'Casas de apostas do nosso guia',
    bookmakers: 'O guia para Portugal inclui operadores licenciados como Betano, Betclic, Placard, Solverde, bwin e Luckia.',
    bookmakerGuide: 'Leia o guia de casas de apostas para surebets',
  },
  fr: {
    heading: 'Surebets en temps réel chez les bookmakers français',
    paragraph:
      'Un surebet combine les cotes de plusieurs bookmakers afin de couvrir toutes les issues et de viser un gain quel que soit le résultat. BetTrackerAI surveille les cotes en continu et présente les occasions avec le bénéfice estimé et la répartition des mises nécessaire.',
    workflow:
      'Choisissez les bookmakers que vous utilisez dans le filtre et triez les occasions par bénéfice.',
    sportsHeading: 'Surebets par sport',
    bookmakersHeading: 'Bookmakers présentés dans notre guide',
    bookmakers: 'Le guide français présente notamment Winamax, Betclic, Unibet, Parions Sport en ligne, PMU et ZEbet.',
    bookmakerGuide: 'Lire le guide des meilleurs bookmakers pour les surebets',
  },
  it: {
    heading: 'Surebet in tempo reale con bookmaker italiani',
    paragraph:
      'Una surebet combina quote di bookmaker diversi per coprire tutti gli esiti e puntare a un profitto qualunque sia il risultato. BetTrackerAI monitora le quote continuamente e mostra le opportunità con il profitto stimato e la distribuzione delle puntate necessaria.',
    workflow:
      'Scegli i bookmaker che utilizzi nel filtro e ordina le opportunità per profitto.',
    sportsHeading: 'Surebet per sport',
    bookmakersHeading: 'Bookmaker inclusi nella guida',
    bookmakers: 'La guida italiana include operatori come Snai, Sisal, Goldbet, Eurobet, bet365 e Planetwin365.',
    bookmakerGuide: 'Leggi la guida ai migliori bookmaker per le surebet',
  },
  pl: {
    heading: 'Surebety na żywo u bukmacherów',
    paragraph:
      'Surebet łączy kursy różnych bukmacherów, aby pokryć każdy możliwy wynik i uzyskać zysk niezależnie od rezultatu. BetTrackerAI stale monitoruje kursy i pokazuje okazje wraz z szacowanym zyskiem oraz podziałem stawek.',
    workflow:
      'Wybierz używanych bukmacherów w filtrze i sortuj okazje według zysku.',
    sportsHeading: 'Surebety według sportu',
    bookmakersHeading: 'Bukmacherzy opisani w poradniku',
    bookmakers: 'Poradnik dla Polski obejmuje legalnych operatorów dostępnych na lokalnym rynku.',
    bookmakerGuide: 'Przeczytaj poradnik o bukmacherach do surebetów',
  },
  fi: {
    heading: 'Surebetit reaaliajassa vedonlyöntisivustoilla',
    paragraph:
      'Surebetissä yhdistetään eri vedonlyöntisivustojen kertoimia niin, että kaikki tulokset katetaan ja tuottoa voidaan tavoitella lopputuloksesta riippumatta. BetTrackerAI seuraa kertoimia ympäri vuorokauden ja näyttää mahdollisuudet arvioituine tuottoineen ja panosjakoineen.',
    workflow:
      'Valitse käyttämäsi vedonlyöntisivustot suodattimesta ja lajittele mahdollisuudet tuoton mukaan.',
    sportsHeading: 'Surebetit lajeittain',
    bookmakersHeading: 'Oppaassa käsitellyt vedonlyöntisivustot',
    bookmakers: 'Suomen opas käsittelee paikallisilla markkinoilla toimivia vedonlyöntisivustoja.',
    bookmakerGuide: 'Lue opas parhaista surebet-sivustoista',
  },
  nl: {
    heading: 'Live surebets bij Nederlandse bookmakers',
    paragraph:
      'Een surebet combineert odds van verschillende bookmakers zodat alle mogelijke uitkomsten zijn afgedekt en er ongeacht de uitslag rendement kan worden behaald. BetTrackerAI volgt de odds continu en toont kansen met de geschatte winst en de benodigde inzetverdeling.',
    workflow:
      'Kies de bookmakers die je gebruikt in het filter en sorteer de kansen op winst.',
    sportsHeading: 'Surebets per sport',
    bookmakersHeading: 'Bookmakers in onze gids',
    bookmakers: 'De Nederlandse gids bespreekt onder meer TOTO, bet365, Unibet, BetCity, Jack’s.nl en Holland Casino Online.',
    bookmakerGuide: 'Lees de gids over de beste bookmakers voor surebets',
  },
}

const REGIONAL_COPY: Partial<Record<NewLocale, Partial<SeoCopy>>> = {
  tr: {
    heading: 'Türkiye pazarı için surebet bilgileri',
    paragraph:
      'Surebet, tüm olası sonuçları kapsamak için farklı bahis seçeneklerindeki oranları birleştirir. Türkiye’de lisanslı bayiler aynı iddaa oranlarını sunduğundan aralarında surebet oluşmaz. Lisanssız yabancı bahis sitelerini önermiyoruz; yerel kuralları ve lisans koşullarını kontrol edin.',
    workflow: 'Filtrede takip ettiğiniz seçenekleri belirleyin ve fırsatları kâra göre sıralayın.',
    sportsHeading: 'Spor dallarına göre surebetler',
    bookmakersHeading: 'Türkiye’deki bahis seçenekleri',
    bookmakerGuide: 'Bahis seçenekleri ve kurallar rehberini okuyun',
  },
  cs: {
    heading: 'Surebety v reálném čase u českých sázkových kanceláří',
    paragraph:
      'Surebet kombinuje kurzy různých sázkových kanceláří tak, aby pokryl všechny možné výsledky a mohl přinést výnos bez ohledu na výsledek. BetTrackerAI sleduje kurzy nepřetržitě a zobrazuje příležitosti včetně odhadovaného zisku a potřebného rozdělení vkladů.',
    workflow: 'Vyberte sázkové kanceláře, které používáte, a seřaďte příležitosti podle zisku.',
    sportsHeading: 'Surebety podle sportu',
    bookmakersHeading: 'Sázkové kanceláře v našem průvodci',
    bookmakerGuide: 'Přečtěte si průvodce nejlepšími sázkovými kancelářemi pro surebety',
  },
  el: {
    heading: 'Surebets σε πραγματικό χρόνο σε ελληνικές στοιχηματικές',
    paragraph:
      'Ένα surebet συνδυάζει αποδόσεις από διαφορετικές στοιχηματικές ώστε να καλύπτει όλα τα πιθανά αποτελέσματα και να επιδιώκει κέρδος ανεξάρτητα από την έκβαση. Το BetTrackerAI παρακολουθεί συνεχώς τις αποδόσεις και εμφανίζει ευκαιρίες με το εκτιμώμενο κέρδος και την απαιτούμενη κατανομή πονταρίσματος.',
    workflow: 'Επιλέξτε τις στοιχηματικές που χρησιμοποιείτε στο φίλτρο και ταξινομήστε τις ευκαιρίες ανά κέρδος.',
    sportsHeading: 'Surebets ανά άθλημα',
    bookmakersHeading: 'Στοιχηματικές στον οδηγό μας',
    bookmakerGuide: 'Διαβάστε τον οδηγό για τις καλύτερες στοιχηματικές για surebets',
  },
  hu: {
    heading: 'Surebetek a magyar piacon – fontos tudnivalók',
    paragraph:
      'A surebet különböző fogadóirodák oddsait kombinálja az összes lehetséges kimenetel lefedésére. Magyarországon a Tippmix (Szerencsejáték Zrt.) az egyetlen engedéllyel működő szolgáltató, ezért engedélyezett hazai irodák között nem lehet surebetet létrehozni. Ne használj engedély nélküli vagy blokkolt oldalakat.',
    workflow: 'A szűrőben válaszd ki a követni kívánt lehetőségeket, majd rendezd őket profit szerint.',
    sportsHeading: 'Surebetek sportág szerint',
    bookmakersHeading: 'Fogadási lehetőségek Magyarországon',
    bookmakerGuide: 'Olvasd el a fogadóirodákról és a szabályokról szóló útmutatót',
  },
  hr: {
    heading: 'Surebetovi u stvarnom vremenu kod hrvatskih kladionica',
    paragraph:
      'Surebet kombinira tečajeve različitih kladionica kako bi pokrio sve moguće ishode i ostvario dobit bez obzira na rezultat. BetTrackerAI neprekidno prati tečajeve i prikazuje prilike s procijenjenom dobiti i potrebnom raspodjelom uloga.',
    workflow: 'U filtru odaberite kladionice koje koristite i sortirajte prilike prema dobiti.',
    sportsHeading: 'Surebetovi po sportu',
    bookmakersHeading: 'Kladionice navedene u našem vodiču',
    bookmakerGuide: 'Pročitajte vodič o najboljim kladionicama za surebetove',
  },
  sk: {
    heading: 'Surebety v reálnom čase u slovenských stávkových kancelárií',
    paragraph:
      'Surebet kombinuje kurzy rôznych stávkových kancelárií tak, aby pokryl všetky možné výsledky a mohol priniesť zisk bez ohľadu na výsledok. BetTrackerAI nepretržite sleduje kurzy a zobrazuje príležitosti spolu s odhadovaným ziskom a potrebným rozdelením vkladov.',
    workflow: 'Vo filtri vyberte stávkové kancelárie, ktoré používate, a zoraďte príležitosti podľa zisku.',
    sportsHeading: 'Surebety podľa športu',
    bookmakersHeading: 'Stávkové kancelárie v našom sprievodcovi',
    bookmakerGuide: 'Prečítajte si sprievodcu najlepšími stávkovými kanceláriami pre surebety',
  },
}

const ACTION_LABELS: Record<BaseTranslated | 'da', { calculator: string; guide: string }> = {
  da: { calculator: 'Beregn surebet', guide: 'Hvad er surebets?' },
  en: { calculator: 'Calculate your stake', guide: 'Surebet guide' },
  sv: { calculator: 'Beräkna insats', guide: 'Guide till surebets' },
  no: { calculator: 'Beregn innsats', guide: 'Guide til surebets' },
  de: { calculator: 'Einsatz berechnen', guide: 'Surebet-Ratgeber' },
  es: { calculator: 'Calcula tu apuesta', guide: 'Guía sobre surebets' },
  br: { calculator: 'Calcule sua aposta', guide: 'Guia de surebets' },
  pt: { calculator: 'Calcule a sua aposta', guide: 'Guia de surebets' },
  fr: { calculator: 'Calculer la mise', guide: 'Guide sur les surebets' },
  it: { calculator: 'Calcola la puntata', guide: 'Guida alle surebet' },
  pl: { calculator: 'Oblicz stawkę', guide: 'Poradnik o surebetach' },
  fi: { calculator: 'Laske panos', guide: 'Surebet-opas' },
  nl: { calculator: 'Bereken je inzet', guide: 'Surebetgids' },
}

const REGIONAL_BOOKMAKERS: Partial<Record<NewLocale, string>> = {
  tr: 'Türkiye’de lisanslı bayiler Nesine, Bilyoner, Misli, Oley, Birebin ve Tuttur aynı iddaa oranlarını sunar; bu nedenle aralarında surebet oluşmaz. Lisanssız yabancı siteleri önermiyoruz.',
  cs: 'Çekya rehberi, yerel lisanslı operatörler arasında Tipsport, Fortuna, Chance, Betano, Synot Tip, Sazka bet, Kingsbet ve Merkur’u listeliyor.',
  el: 'Ο ελληνικός οδηγός αναφέρει αδειοδοτημένους παρόχους όπως Stoiximan, Novibet, Pamestoixima (OPAP), bet365, bwin, Betsson, Interwetten και Elabet.',
  hu: 'Magyarországon a Tippmix (Szerencsejáték Zrt.) az egyetlen engedéllyel működő szolgáltató; ezért engedéllyel rendelkező hazai irodák között nem lehet surebetet létrehozni.',
  hr: 'Hrvatski vodič navodi licencirane kladionice kao što su SuperSport, Germania Sport, PSK, Hrvatska Lutrija, Admiral, Mozzart, Favbet i Arena Sport.',
  sk: 'Slovenský sprievodca uvádza licencovaných prevádzkovateľov Niké, Tipsport, Fortuna, Doxxbet, Synot Tip, Tipos a Monaco.',
  mx: 'La guía de México incluye operadores autorizados como Caliente, Codere, Strendus, bet365, Betway, Playdoit, Betcris y Winpot.',
  ar: 'La guía argentina incluye operadores habilitados en distintas provincias, como bplay, Codere, bet365, Betsson, Betano, BetWarrior y Jugadón. Comprueba la licencia en tu provincia.',
  ch: 'In der Schweiz sind laut Ratgeber Swisslos Sporttip und Jouez Sport (Loterie Romande) zugelassen. Surebets zwischen diesen beiden Anbietern sind selten; ausländische Seiten sind gesperrt.',
  at: 'Der österreichische Ratgeber verweist auf Buchmacher mit gültiger österreichischer Zulassung. Prüfe die aktuelle Lizenz des Anbieters vor dem Spielen.',
  be: 'De Belgische gids noemt vergunde aanbieders zoals Napoleon Sports, Unibet, Bingoal, Betfirst, Circus, Golden Palace en Scooore.',
}

const REGIONAL_ACTIONS: Partial<Record<NewLocale, { calculator: string; guide: string }>> = {
  tr: { calculator: 'Bahis miktarını hesapla', guide: 'Surebet rehberi' },
  cs: { calculator: 'Vypočítat vklad', guide: 'Průvodce surebety' },
  el: { calculator: 'Υπολογισμός πονταρίσματος', guide: 'Οδηγός surebet' },
  hu: { calculator: 'Tét kiszámítása', guide: 'Surebet útmutató' },
  hr: { calculator: 'Izračunaj ulog', guide: 'Vodič za surebet' },
  sk: { calculator: 'Vypočítať vklad', guide: 'Sprievodca surebetmi' },
  mx: { calculator: 'Calcula tu apuesta', guide: 'Guía de surebets' },
  ar: { calculator: 'Calcula tu apuesta', guide: 'Guía de surebets' },
  ch: { calculator: 'Einsatz berechnen', guide: 'Surebet-Ratgeber' },
  at: { calculator: 'Einsatz berechnen', guide: 'Surebet-Ratgeber' },
  be: { calculator: 'Bereken je inzet', guide: 'Surebetgids' },
}

const sportMessageKeys: Record<string, TranslationKey> = {
  fodbold: 'sbFootball',
  tennis: 'sbTennis',
  basketball: 'sbBasketball',
  ishockey: 'sbIceHockey',
  esport: 'sbEsport',
}

const linkCls =
  'inline-flex min-h-11 items-center rounded-full border border-border bg-card/60 px-4 text-[14px] font-semibold text-foreground/85 transition-colors hover:border-primary/60 hover:text-foreground'

function sourceLocaleFor(locale: Locale): keyof typeof SEO_COPY {
  return locale in SEO_COPY ? (locale as keyof typeof SEO_COPY) : LOCALE_SOURCE[locale as NewLocale]
}

function getCopy(locale: Locale): SeoCopy {
  const copy = { ...SEO_COPY[sourceLocaleFor(locale)], ...REGIONAL_COPY[locale as NewLocale] }
  const regionalBookmakers = REGIONAL_BOOKMAKERS[locale as NewLocale]
  return regionalBookmakers ? { ...copy, bookmakers: regionalBookmakers } : copy
}

export async function SeoIntro() {
  const [locale, { t }] = await Promise.all([getServerLocale(), getServerT()])
  const copy = getCopy(locale)
  const actionLabels = REGIONAL_ACTIONS[locale as NewLocale] ?? ACTION_LABELS[sourceLocaleFor(locale)]

  return (
    <section aria-labelledby="seo-intro-heading" className="mt-10 flex max-w-4xl flex-col gap-4 lg:ml-5">
      <h2 id="seo-intro-heading" className="text-balance text-[22px] font-bold text-foreground lg:text-[26px]">
        {copy.heading}
      </h2>
      <p className="text-pretty text-[15px] leading-relaxed text-foreground/80 lg:text-[16px]">{copy.paragraph}</p>
      <p className="text-pretty text-[15px] leading-relaxed text-foreground/80 lg:text-[16px]">
        {copy.workflow}{' '}
        <Link href={localePath(locale, '/beregn')} className="font-semibold text-primary-glow underline-offset-4 hover:underline">
          {actionLabels.calculator}
        </Link>
        {' · '}
        <Link href={localePath(locale, '/guide/hvad-er-surebets')} className="font-semibold text-primary-glow underline-offset-4 hover:underline">
          {actionLabels.guide}
        </Link>
      </p>

      <nav aria-label={copy.sportsHeading} className="flex flex-col gap-2">
        <h3 className="text-[15px] font-semibold text-foreground">{copy.sportsHeading}</h3>
        <ul className="flex flex-wrap gap-2">
          {SPORT_PAGES.map((page) => (
            <li key={page.slug}>
              <Link href={localePath(locale, `/sport/${page.slug}`)} className={linkCls}>
                {sportMessageKeys[page.slug] ? t(sportMessageKeys[page.slug]) : page.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <nav aria-label={copy.bookmakersHeading} className="flex flex-col gap-2">
        <h3 className="text-[15px] font-semibold text-foreground">{copy.bookmakersHeading}</h3>
        <p className="text-pretty text-[15px] leading-relaxed text-foreground/80">{copy.bookmakers}</p>
        <Link
          href={localePath(locale, '/guide/bedste-bookmakere-til-surebets')}
          className={`${linkCls} w-fit`}
        >
          {copy.bookmakerGuide}
        </Link>
      </nav>
    </section>
  )
}
