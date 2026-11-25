import { PRICING, yearlyDiscount } from '@/components/home/data'
import { COMPANY } from '@/lib/legal'
import type { Locale } from '@/lib/i18n'
import type { BaseTranslated } from '@/lib/locale-list'
import { fillTemplate, newLocales } from '@/lib/locale-packs'

type Qa = { q: string; a: string }
type Translated = Exclude<Locale, 'da'>

const AGE = 18

export type DailyContent = {
  metaTitle: string
  metaDescription: string
  name: string
  h1: string
  lead: (time: string) => string
  empty: string
  membersOdds: string
  at: string
  and: string
  ctaMore: (hidden: number) => string
  ctaPlain: string
  sportsHeading: string
  howHeading: string
  howBefore: string
  calculator: string
  howMiddle: string
  guide: string
  howAfter: string
  faqHeading: string
  faq: Qa[]
}

const DAILY_BASE: Record<BaseTranslated, DailyContent> = {
  en: {
    metaTitle: "Today's Surebets – the Best Sure Bets Right Now",
    metaDescription:
      "See today's best surebets across local and international bookmakers, updated continuously. Sport, match, market and guaranteed profit for the strongest opportunities right now.",
    name: "Today's surebets",
    h1: "Today's surebets",
    lead: (time) => `The strongest surebets at bookmakers right now, sorted by guaranteed profit. Updated at ${time}.`,
    empty: 'There are no active surebets at the moment. The scanner runs around the clock, so check back shortly.',
    membersOdds: 'Odds for members',
    at: 'at',
    and: 'and',
    ctaMore: (hidden) => `See the odds and ${hidden} more surebets`,
    ctaPlain: 'See the odds and stakes',
    sportsHeading: 'Surebets by sport',
    howHeading: 'How to play a surebet',
    howBefore:
      'A surebet means you bet on every outcome at different bookmakers and win whatever the result. Split your stake with the ',
    calculator: 'surebet calculator',
    howMiddle: ', and read the ',
    guide: 'guide to surebets',
    howAfter: ' if you are new.',
    faqHeading: 'Frequently asked questions',
    faq: [
      {
        q: 'How often are the daily surebets updated?',
        a: 'The page updates every ten minutes. Inside BetTrackerAI you see surebets in real time as soon as the scanner finds them.',
      },
      {
        q: 'Why can I not see the odds?',
        a: 'Odds and stake splits are reserved for members, because surebets disappear quickly when many people play them. Sign up to see the exact odds and every current opportunity.',
      },
      {
        q: 'Is the profit guaranteed?',
        a: 'Yes, as long as you place every bet at the displayed odds. Odds can change quickly, so always check them at the bookmaker before you bet.',
      },
    ],
  },
  sv: {
    metaTitle: 'Dagens surebets – de bästa säkra spelen just nu',
    metaDescription:
      'Se dagens bästa surebets hos svenska och internationella spelbolag, uppdaterade löpande. Sport, match, marknad och garanterad vinst för de starkaste möjligheterna just nu.',
    name: 'Dagens surebets',
    h1: 'Dagens surebets',
    lead: (time) => `De starkaste surebetsen hos spelbolagen just nu, sorterade efter garanterad vinst. Uppdaterad kl. ${time}.`,
    empty: 'Det finns inga aktiva surebets just nu. Skannern arbetar dygnet runt, så titta in igen om en stund.',
    membersOdds: 'Odds för medlemmar',
    at: 'hos',
    and: 'och',
    ctaMore: (hidden) => `Se oddsen och ${hidden} fler surebets`,
    ctaPlain: 'Se odds och insatser',
    sportsHeading: 'Surebets per sport',
    howHeading: 'Så spelar du en surebet',
    howBefore:
      'En surebet innebär att du spelar på alla utfall hos olika spelbolag och vinner oavsett resultat. Fördela insatsen med ',
    calculator: 'surebet-kalkylatorn',
    howMiddle: ' och läs ',
    guide: 'guiden till surebets',
    howAfter: ' om du är ny.',
    faqHeading: 'Vanliga frågor',
    faq: [
      {
        q: 'Hur ofta uppdateras dagens surebets?',
        a: 'Sidan uppdateras var tionde minut. Inne i BetTrackerAI ser du surebets i realtid så fort skannern hittar dem.',
      },
      {
        q: 'Varför kan jag inte se oddsen?',
        a: 'Odds och insatsfördelning är förbehållna medlemmar, eftersom surebets försvinner snabbt när många spelar dem. Skapa ett konto för att se de exakta oddsen och alla aktuella möjligheter.',
      },
      {
        q: 'Är vinsten garanterad?',
        a: 'Ja, så länge du placerar alla spel till de visade oddsen. Oddsen kan ändras snabbt, så kontrollera alltid oddsen hos spelbolaget innan du spelar.',
      },
    ],
  },
  no: {
    metaTitle: 'Dagens surebets – de beste sikre oddsene akkurat nå',
    metaDescription:
      'Se dagens beste surebets som analyse, oppdatert løpende. Sport, kamp, marked og teoretisk profitt for de sterkeste mulighetene, men surebetting er ikke mulig hos Norsk Tipping alene.',
    name: 'Dagens surebets',
    h1: 'Dagens surebets',
    lead: (time) => `De sterkeste surebetsene hos bookmakerne akkurat nå, sortert etter garantert profitt. Oppdatert kl. ${time}.`,
    empty: 'Det finnes ingen aktive surebets for øyeblikket. Skanneren går døgnet rundt, så kom tilbake om litt.',
    membersOdds: 'Odds for medlemmer',
    at: 'hos',
    and: 'og',
    ctaMore: (hidden) => `Se oddsen og ${hidden} flere surebets`,
    ctaPlain: 'Se odds og innsatser',
    sportsHeading: 'Surebets fordelt på sport',
    howHeading: 'Slik spiller du en surebet',
    howBefore:
      'En surebet betyr at du spiller på alle utfall hos ulike bookmakere og vinner uansett resultat. Fordel innsatsen med ',
    calculator: 'surebet-kalkulatoren',
    howMiddle: ', og les ',
    guide: 'guiden til surebets',
    howAfter: ' hvis du er ny.',
    faqHeading: 'Ofte stilte spørsmål',
    faq: [
      {
        q: 'Hvor ofte oppdateres dagens surebets?',
        a: 'Siden oppdateres hvert tiende minutt. Inne i BetTrackerAI ser du surebets i sanntid så snart skanneren finner dem.',
      },
      {
        q: 'Hvorfor kan jeg ikke se oddsen?',
        a: 'Odds og innsatsfordeling er forbeholdt medlemmer, fordi surebets forsvinner raskt når mange spiller dem. Opprett en konto for å se de nøyaktige oddsene og alle aktuelle muligheter.',
      },
      {
        q: 'Er profitten garantert?',
        a: 'Ja, så lenge du plasserer alle spill til de viste oddsene. Oddsen kan endre seg raskt, så sjekk alltid oddsen hos bookmakeren før du spiller.',
      },
    ],
  },
  de: {
    metaTitle: 'Surebets heute – die besten Sure Bets im Überblick',
    metaDescription:
      'Die besten Surebets von heute bei deutschen und internationalen Buchmachern, laufend aktualisiert. Sportart, Spiel, Markt und garantierter Gewinn der stärksten Chancen im Moment.',
    name: 'Surebets heute',
    h1: 'Surebets heute',
    lead: (time) => `Die stärksten Surebets bei den Buchmachern im Moment, sortiert nach garantiertem Gewinn. Aktualisiert um ${time} Uhr.`,
    empty: 'Aktuell gibt es keine aktiven Surebets. Der Scanner läuft rund um die Uhr, schau also gleich noch einmal vorbei.',
    membersOdds: 'Quoten für Mitglieder',
    at: 'bei',
    and: 'und',
    ctaMore: (hidden) => `Quoten und ${hidden} weitere Surebets ansehen`,
    ctaPlain: 'Quoten und Einsätze ansehen',
    sportsHeading: 'Surebets nach Sportart',
    howHeading: 'So spielst du eine Surebet',
    howBefore:
      'Bei einer Surebet setzt du bei verschiedenen Buchmachern auf alle Ausgänge und gewinnst unabhängig vom Ergebnis. Verteile deinen Einsatz mit dem ',
    calculator: 'Surebet-Rechner',
    howMiddle: ' und lies den ',
    guide: 'Ratgeber zu Surebets',
    howAfter: ', wenn du neu bist.',
    faqHeading: 'Häufige Fragen',
    faq: [
      {
        q: 'Wie oft werden die Surebets von heute aktualisiert?',
        a: 'Die Seite wird alle zehn Minuten aktualisiert. In BetTrackerAI siehst du Surebets in Echtzeit, sobald der Scanner sie findet.',
      },
      {
        q: 'Warum sehe ich die Quoten nicht?',
        a: 'Quoten und Einsatzverteilung sind Mitgliedern vorbehalten, weil Surebets schnell verschwinden, wenn viele sie spielen. Registriere dich, um die genauen Quoten und alle aktuellen Chancen zu sehen.',
      },
      {
        q: 'Ist der Gewinn garantiert?',
        a: 'Ja, solange du alle Wetten zu den angezeigten Quoten platzierst. Quoten können sich schnell ändern, prüfe sie deshalb immer beim Buchmacher, bevor du wettest.',
      },
    ],
  },
  es: {
    metaTitle: "Surebets de hoy – las mejores apuestas seguras ahora mismo",
    metaDescription:
      "Descubre las mejores surebets de hoy en casas de apuestas con licencia DGOJ, actualizadas continuamente. Deporte, partido, mercado y beneficio garantizado para las mejores oportunidades ahora mismo.",
    name: "Surebets de hoy",
    h1: "Surebets de hoy",
    lead: (time) => `Las surebets más rentables en las casas de apuestas ahora mismo, ordenadas por beneficio garantizado. Actualizado a las ${time}.`,
    empty: 'No hay surebets activas en este momento. El escáner funciona las 24 horas, así que vuelve a comprobarlo en breve.',
    membersOdds: 'Cuotas para miembros',
    at: 'en',
    and: 'y',
    ctaMore: (hidden) => `Ver las cuotas y ${hidden} surebets más`,
    ctaPlain: 'Ver las cuotas y las apuestas',
    sportsHeading: 'Surebets por deporte',
    howHeading: 'Cómo jugar una surebet',
    howBefore:
      'Una surebet significa que apuestas a todos los resultados en distintas casas de apuestas y ganas sea cual sea el resultado. Reparte tu apuesta con la ',
    calculator: 'calculadora de surebets',
    howMiddle: ', y lee la ',
    guide: 'guía de surebets',
    howAfter: ' si eres nuevo.',
    faqHeading: 'Preguntas frecuentes',
    faq: [
      {
        q: '¿Con qué frecuencia se actualizan las surebets diarias?',
        a: 'La página se actualiza cada diez minutos. Dentro de BetTrackerAI ves las surebets en tiempo real en cuanto el escáner las encuentra.',
      },
      {
        q: '¿Por qué no puedo ver las cuotas?',
        a: 'Las cuotas y el reparto de apuestas están reservados para los miembros, porque las surebets desaparecen rápidamente cuando mucha gente las juega. Regístrate para ver las cuotas exactas y todas las oportunidades actuales.',
      },
      {
        q: '¿Está garantizado el beneficio?',
        a: 'Sí, siempre que coloques todas las apuestas a las cuotas mostradas. Las cuotas pueden cambiar rápidamente, así que compruébalas siempre en la casa de apuestas antes de apostar.',
      },
    ],
  },
  br: {
    metaTitle: "Surebets de Hoje – as Melhores Sure Bets Agora",
    metaDescription:
      "Veja as melhores surebets de hoje em casas de apostas autorizadas no Brasil (.bet.br), atualizadas continuamente. Esporte, partida, mercado e lucro garantido para as melhores oportunidades agora.",
    name: "Surebets de hoje",
    h1: "Surebets de hoje",
    lead: (time) => `As surebets mais lucrativas nas casas de apostas agora, ordenadas por lucro garantido. Atualizado às ${time}.`,
    empty: 'Não há surebets ativas no momento. O scanner funciona 24 horas por dia, então volte em breve.',
    membersOdds: 'Odds para membros',
    at: 'em',
    and: 'e',
    ctaMore: (hidden) => `Veja as odds e mais ${hidden} surebets`,
    ctaPlain: 'Veja as odds e os valores',
    sportsHeading: 'Surebets por esporte',
    howHeading: 'Como jogar uma surebet',
    howBefore:
      'Uma surebet significa apostar em todos os resultados em casas de apostas diferentes e ganhar independentemente do resultado. Divida o valor com a ',
    calculator: 'calculadora de surebet',
    howMiddle: ', e leia o ',
    guide: 'guia de surebets',
    howAfter: ' se você é novo no assunto.',
    faqHeading: 'Perguntas frequentes',
    faq: [
      {
        q: 'Com que frequência as surebets diárias são atualizadas?',
        a: 'A página é atualizada a cada dez minutos. Dentro do BetTrackerAI você vê as surebets em tempo real assim que o scanner as encontra.',
      },
      {
        q: 'Por que não consigo ver as odds?',
        a: 'As odds e a divisão dos valores são exclusivas para membros, pois as surebets desaparecem rapidamente quando muitas pessoas as jogam. Cadastre-se para ver as odds exatas e todas as oportunidades disponíveis.',
      },
      {
        q: 'O lucro é garantido?',
        a: 'Sim, desde que você faça todas as apostas nas odds exibidas. As odds podem mudar rapidamente, então sempre confira na casa de apostas antes de apostar.',
      },
    ],
  },
  pt: {
    metaTitle: "Surebets de Hoje – as Melhores Sure Bets Agora",
    metaDescription:
      "Vê as melhores surebets de hoje em casas de apostas licenciadas em Portugal, atualizadas continuamente. Desporto, jogo, mercado e lucro garantido para as melhores oportunidades agora.",
    name: "Surebets de hoje",
    h1: "Surebets de hoje",
    lead: (time) => `As surebets mais lucrativas nas casas de apostas agora, ordenadas por lucro garantido. Atualizado às ${time}.`,
    empty: 'Não há surebets ativas neste momento. O scanner funciona 24 horas por dia, por isso volta a verificar em breve.',
    membersOdds: 'Odds para membros',
    at: 'em',
    and: 'e',
    ctaMore: (hidden) => `Ver as odds e mais ${hidden} surebets`,
    ctaPlain: 'Ver as odds e os valores a apostar',
    sportsHeading: 'Surebets por desporto',
    howHeading: 'Como jogar uma surebet',
    howBefore:
      'Uma surebet significa que apostas em todos os resultados em diferentes casas de apostas e ganhas independentemente do resultado. Divide o valor com a ',
    calculator: 'calculadora de surebets',
    howMiddle: ', e lê o ',
    guide: 'guia de surebets',
    howAfter: ' se és novo.',
    faqHeading: 'Perguntas frequentes',
    faq: [
      {
        q: 'Com que frequência são atualizadas as surebets diárias?',
        a: 'A página atualiza a cada dez minutos. Dentro do BetTrackerAI vês as surebets em tempo real assim que o scanner as encontra.',
      },
      {
        q: 'Por que não consigo ver as odds?',
        a: 'As odds e a divisão dos valores são reservadas para membros, porque as surebets desaparecem rapidamente quando muitas pessoas as jogam. Regista-te para ver as odds exatas e todas as oportunidades atuais.',
      },
      {
        q: 'O lucro é garantido?',
        a: 'Sim, desde que coloques todas as apostas às odds apresentadas. As odds podem mudar rapidamente, por isso verifica-as sempre na casa de apostas antes de apostares.',
      },
    ],
  },
  fr: {
    metaTitle: "Surebets du jour – les meilleures opportunités en ce moment",
    metaDescription:
      "Découvrez les meilleures surebets du jour chez les bookmakers agréés par l'ANJ, mises à jour en continu. Sport, match, marché et profit garanti pour les meilleures opportunités en ce moment.",
    name: "Surebets du jour",
    h1: "Surebets du jour",
    lead: (time) => `Les surebets les plus rentables chez les bookmakers en ce moment, triées par profit garanti. Mise à jour à ${time}.`,
    empty: 'Aucune surebet active pour le moment. Le scanner tourne en permanence, reviens dans quelques instants.',
    membersOdds: 'Cotes réservées aux membres',
    at: 'chez',
    and: 'et',
    ctaMore: (hidden) => `Voir les cotes et ${hidden} surebets supplémentaires`,
    ctaPlain: 'Voir les cotes et les mises',
    sportsHeading: 'Surebets par sport',
    howHeading: 'Comment jouer une surebet',
    howBefore:
      'Une surebet consiste à parier sur tous les résultats possibles chez différents bookmakers et à gagner quel que soit le résultat. Répartis ta mise avec le ',
    calculator: 'calculateur de surebets',
    howMiddle: ', et consulte le ',
    guide: 'guide des surebets',
    howAfter: ' si tu débutes.',
    faqHeading: 'Questions fréquentes',
    faq: [
      {
        q: 'À quelle fréquence les surebets du jour sont-elles mises à jour ?',
        a: 'La page se met à jour toutes les dix minutes. Dans BetTrackerAI, tu vois les surebets en temps réel dès que le scanner les détecte.',
      },
      {
        q: 'Pourquoi ne puis-je pas voir les cotes ?',
        a: 'Les cotes et la répartition des mises sont réservées aux membres, car les surebets disparaissent rapidement lorsque trop de personnes les jouent. Inscris-toi pour voir les cotes exactes et toutes les opportunités disponibles.',
      },
      {
        q: 'Le profit est-il garanti ?',
        a: 'Oui, à condition de placer chaque pari aux cotes affichées. Les cotes peuvent évoluer rapidement, alors vérifie-les toujours chez le bookmaker avant de parier.',
      },
    ],
  },
  it: {
    metaTitle: "Surebets di oggi – le migliori scommesse sicure in questo momento",
    metaDescription:
      "Scopri i migliori surebets di oggi tra i bookmaker italiani con licenza ADM, aggiornati continuamente. Sport, partita, mercato e profitto garantito per le opportunità più interessanti in questo momento.",
    name: "Surebets di oggi",
    h1: "Surebets di oggi",
    lead: (time) => `I surebets più redditizi sui bookmaker in questo momento, ordinati per profitto garantito. Aggiornato alle ${time}.`,
    empty: 'Al momento non ci sono surebets attivi. Lo scanner funziona 24 ore su 24, ricontrolla tra poco.',
    membersOdds: 'Quote per i membri',
    at: 'su',
    and: 'e',
    ctaMore: (hidden) => `Vedi le quote e altri ${hidden} surebets`,
    ctaPlain: 'Vedi le quote e le puntate',
    sportsHeading: 'Surebets per sport',
    howHeading: 'Come giocare un surebet',
    howBefore:
      'Un surebet significa puntare su ogni risultato presso diversi bookmaker e vincere qualunque sia l\'esito. Dividi la puntata con il ',
    calculator: 'calcolatore di surebets',
    howMiddle: ', e leggi la ',
    guide: 'guida ai surebets',
    howAfter: ' se sei alle prime armi.',
    faqHeading: 'Domande frequenti',
    faq: [
      {
        q: 'Con quale frequenza vengono aggiornati i surebets giornalieri?',
        a: 'La pagina si aggiorna ogni dieci minuti. All\'interno di BetTrackerAI vedi i surebets in tempo reale non appena lo scanner li individua.',
      },
      {
        q: 'Perché non riesco a vedere le quote?',
        a: 'Le quote e le suddivisioni delle puntate sono riservate ai membri, perché i surebets scompaiono rapidamente quando in molti li giocano. Registrati per vedere le quote esatte e tutte le opportunità disponibili.',
      },
      {
        q: 'Il profitto è garantito?',
        a: 'Sì, a condizione che tu piazzi ogni scommessa alle quote visualizzate. Le quote possono cambiare rapidamente, quindi verificale sempre sul bookmaker prima di scommettere.',
      },
    ],
  },
  pl: {
    metaTitle: "Dzisiejsze surebets – najlepsze pewne zakłady teraz",
    metaDescription:
      "Zobacz dzisiejsze najlepsze surebets u licencjonowanych w Polsce bukmacherów, aktualizowane na bieżąco. Sport, mecz, rynek i gwarantowany zysk dla najmocniejszych okazji w tej chwili.",
    name: "Dzisiejsze surebets",
    h1: "Dzisiejsze surebets",
    lead: (time) => `Najmocniejsze surebets u bukmacherów w tej chwili, posortowane według gwarantowanego zysku. Zaktualizowano o ${time}.`,
    empty: 'W tej chwili nie ma aktywnych surebets. Skaner działa całą dobę, więc zajrzyj tu za chwilę.',
    membersOdds: 'Kursy dla członków',
    at: 'u',
    and: 'i',
    ctaMore: (hidden) => `Zobacz kursy i ${hidden} kolejnych surebets`,
    ctaPlain: 'Zobacz kursy i stawki',
    sportsHeading: 'Surebets według sportu',
    howHeading: 'Jak zagrać surebet',
    howBefore:
      'Surebet polega na obstawieniu każdego wyniku u różnych bukmacherów i wygraniu niezależnie od rezultatu. Podziel stawkę za pomocą ',
    calculator: 'kalkulatora surebets',
    howMiddle: ', a jeśli dopiero zaczynasz, przeczytaj ',
    guide: 'poradnik o surebets',
    howAfter: '.',
    faqHeading: 'Często zadawane pytania',
    faq: [
      {
        q: 'Jak często są aktualizowane dzisiejsze surebets?',
        a: 'Strona aktualizuje się co dziesięć minut. W BetTrackerAI widzisz surebets w czasie rzeczywistym, gdy tylko skaner je znajdzie.',
      },
      {
        q: 'Dlaczego nie widzę kursów?',
        a: 'Kursy i podziały stawek są zarezerwowane dla członków, ponieważ surebets szybko znikają, gdy gra na nich wiele osób. Zarejestruj się, aby zobaczyć dokładne kursy i wszystkie aktualne okazje.',
      },
      {
        q: 'Czy zysk jest gwarantowany?',
        a: 'Tak, o ile postawisz każdy zakład po wyświetlonych kursach. Kursy mogą się szybko zmieniać, więc zawsze sprawdzaj je u bukmachera przed postawieniem zakładu.',
      },
    ],
  },
  fi: {
    metaTitle: "Tämän päivän surebetit – parhaat varmat vedot juuri nyt",
    metaDescription:
      "Katso tämän päivän parhaat surebetit kotimaisilta ja kansainvälisiltä vedonlyöntiyhtiöiltä, jatkuvasti päivitettynä. Laji, ottelu, markkina ja taattu voitto – parhaat mahdollisuudet juuri nyt.",
    name: "Tämän päivän surebetit",
    h1: "Tämän päivän surebetit",
    lead: (time) => `Parhaat surebetit vedonlyöntiyhtiöillä juuri nyt, järjestetty taatun voiton mukaan. Päivitetty ${time}.`,
    empty: 'Aktiivisia surebettejä ei ole tällä hetkellä. Skanneri toimii ympäri vuorokauden, joten tarkista pian uudelleen.',
    membersOdds: 'Kertoimet jäsenille',
    at: 'kohteessa',
    and: 'ja',
    ctaMore: (hidden) => `Katso kertoimet ja ${hidden} muuta surebettiä`,
    ctaPlain: 'Katso kertoimet ja panokset',
    sportsHeading: 'Surebetit lajeittain',
    howHeading: 'Kuinka pelata surebet',
    howBefore:
      'Surebet tarkoittaa, että veikkaat jokaista lopputulosta eri vedonlyöntiyhtiöillä ja voitat tuloksesta riippumatta. Jaa panoksesi ',
    calculator: 'surebet-laskurilla',
    howMiddle: ', ja lue ',
    guide: 'opas surebeteistä',
    howAfter: ', jos olet uusi.',
    faqHeading: 'Usein kysytyt kysymykset',
    faq: [
      {
        q: 'Kuinka usein päivittäiset surebetit päivitetään?',
        a: 'Sivu päivittyy kymmenen minuutin välein. BetTrackerAI:n sisällä näet surebetit reaaliajassa heti, kun skanneri löytää ne.',
      },
      {
        q: 'Miksi en näe kertoimia?',
        a: 'Kertoimet ja panoksen jaot on varattu jäsenille, koska surebetit katoavat nopeasti, kun monet pelaavat niitä. Rekisteröidy nähdäksesi tarkat kertoimet ja kaikki nykyiset mahdollisuudet.',
      },
      {
        q: 'Onko voitto taattu?',
        a: 'Kyllä, kunhan asetat jokaisen vedon näytetyillä kertoimilla. Kertoimet voivat muuttua nopeasti, joten tarkista ne aina vedonlyöntiyhtiöltä ennen vedon asettamista.',
      },
    ],
  },
  nl: {
    metaTitle: "Surebets van vandaag – de beste surebets op dit moment",
    metaDescription:
      "Bekijk de beste surebets van vandaag bij Nederlandse en internationale bookmakers, continu bijgewerkt. Sport, wedstrijd, markt en gegarandeerde winst voor de sterkste kansen op dit moment.",
    name: "Surebets van vandaag",
    h1: "Surebets van vandaag",
    lead: (time) => `De sterkste surebets bij bookmakers op dit moment, gesorteerd op gegarandeerde winst. Bijgewerkt om ${time}.`,
    empty: 'Er zijn momenteel geen actieve surebets. De scanner draait dag en nacht, dus kom snel terug.',
    membersOdds: 'Odds voor leden',
    at: 'bij',
    and: 'en',
    ctaMore: (hidden) => `Bekijk de odds en ${hidden} meer surebets`,
    ctaPlain: 'Bekijk de odds en inzetten',
    sportsHeading: 'Surebets per sport',
    howHeading: 'Hoe speel je een surebet',
    howBefore:
      'Een surebet betekent dat je op elke uitkomst wedt bij verschillende bookmakers en wint wat het resultaat ook is. Verdeel je inzet met de ',
    calculator: 'surebet calculator',
    howMiddle: ', en lees de ',
    guide: 'gids voor surebets',
    howAfter: ' als je nieuw bent.',
    faqHeading: 'Veelgestelde vragen',
    faq: [
      {
        q: 'Hoe vaak worden de dagelijkse surebets bijgewerkt?',
        a: 'De pagina wordt elke tien minuten bijgewerkt. Binnen BetTrackerAI zie je surebets in real time zodra de scanner ze vindt.',
      },
      {
        q: 'Waarom kan ik de odds niet zien?',
        a: 'Odds en inzetverdelingen zijn voorbehouden aan leden, omdat surebets snel verdwijnen als veel mensen ze spelen. Meld je aan om de exacte odds en alle actuele kansen te zien.',
      },
      {
        q: 'Is de winst gegarandeerd?',
        a: 'Ja, zolang je elke weddenschap plaatst tegen de weergegeven odds. Odds kunnen snel veranderen, dus controleer ze altijd bij de bookmaker voordat je wedt.',
      },
    ],
  },
}

export type FaqContent = {
  metaTitle: string
  metaDescription: string
  eyebrow: string
  h1: string
  intro: string
  topicsLabel: string
  groupService: string
  groupAccount: string
  notFound: string
  notFoundText: string
  contact: string
  service: Qa[]
  account: Qa[]
}

const price = `${PRICING.monthly}`
const yearly = `${PRICING.yearly}`
const discount = yearlyDiscount()
const mail = COMPANY.email

const FAQ_PAGE_BASE: Record<BaseTranslated, FaqContent> = {
  en: {
    metaTitle: 'FAQ – BetTrackerAI',
    metaDescription: 'Answers to the most common questions about surebets, the free trial, subscription, cancellation and the right of withdrawal.',
    eyebrow: 'Support',
    h1: 'Frequently asked questions',
    intro: 'Find answers to what we are asked most often. If you cannot find your question, write to us.',
    topicsLabel: 'Topics',
    groupService: 'About surebets and the service',
    groupAccount: 'Account, payment and data',
    notFound: 'Did not find an answer?',
    notFoundText: 'We are happy to help you personally.',
    contact: 'Contact us',
    service: [
      { q: 'What is a surebet?', a: "A surebet appears when bookmakers' odds on the same match differ enough that you can cover every outcome and still finish in profit. The margin shows the profit as a percentage of your total stake." },
      { q: 'Are surebets completely risk-free?', a: 'Once every bet is placed at the displayed odds, the result is locked in. The risk is that odds can change before you have placed all your bets, or that a bookmaker limits your account. That is why we always show when a surebet was last updated.' },
      { q: 'How does the free trial work?', a: `You get ${PRICING.trialDays} days free with full access to BetTrackerAI Pro. You can cancel at any time during the trial.` },
      { q: 'How much does BetTrackerAI Pro cost?', a: `${price} DKK/month on monthly billing or ${yearly} DKK/month on yearly billing – a saving of ${discount}%. You can pay with Visa, Mastercard or bank transfer.` },
      { q: 'Which bookmakers do you compare?', a: 'We compare odds from licensed local and international bookmakers, including bet365, Unibet, Betfair, William Hill, bwin and Pinnacle.' },
      { q: 'How do I get notified about new surebets?', a: 'You can follow along on the platform, get SMS alerts with our SMS service, or follow our Telegram channel.' },
      { q: 'Who can use BetTrackerAI?', a: `You must be at least ${AGE} years old. Always gamble responsibly – if you need help, contact BeGambleAware (begambleaware.org).` },
    ],
    account: [
      { q: 'How do I cancel my subscription?', a: 'You can cancel at any time under My account. The cancellation takes effect at the end of the period you have paid for, and you keep access until then. If you cancel before the trial ends, we charge nothing.' },
      { q: 'Can I withdraw my purchase?', a: 'Yes. As a consumer you have a 14-day right of withdrawal. Write to us and we will help you. If you asked to start the service immediately, you pay proportionally for the time you have used.' },
      { q: 'How do I change my email or mobile number?', a: `You can change your mobile number and username under My account. You cannot change your email address yourself, so write to ${mail} and we will update it.` },
      { q: 'Can I have my data deleted?', a: `Yes. You have the right to have your data deleted, unless we are legally required to keep it, such as invoices for 5 years. Write to ${mail} and we will help you.` },
      { q: 'What payment details do you store?', a: 'Payments are handled by Stripe. We do not store your card details and only see which plan you have and whether your payment went through.' },
    ],
  },
  sv: {
    metaTitle: 'Vanliga frågor – BetTrackerAI',
    metaDescription: 'Svar på de vanligaste frågorna om surebets, provperiod, abonnemang, uppsägning och ångerrätt.',
    eyebrow: 'Support',
    h1: 'Vanliga frågor',
    intro: 'Här hittar du svar på det vi oftast blir tillfrågade om. Hittar du inte din fråga, skriv till oss.',
    topicsLabel: 'Ämnen',
    groupService: 'Om surebets och tjänsten',
    groupAccount: 'Konto, betalning och data',
    notFound: 'Hittade du inget svar?',
    notFoundText: 'Vi hjälper dig gärna personligen.',
    contact: 'Kontakta oss',
    service: [
      { q: 'Vad är en surebet?', a: 'En surebet uppstår när spelbolagen har så olika odds på samma match att du kan täcka alla utfall och ändå gå plus. Marginalen visar hur stor vinsten är i procent av din totala insats.' },
      { q: 'Är surebets helt riskfria?', a: 'När alla insatser är placerade till de visade oddsen är resultatet låst. Risken ligger i att oddsen hinner ändras innan du har placerat alla spel, eller att ett spelbolag begränsar ditt konto. Därför visar vi alltid när en surebet senast uppdaterades.' },
      { q: 'Hur fungerar den kostnadsfria provperioden?', a: `Du får ${PRICING.trialDays} dagar gratis med full tillgång till BetTrackerAI Pro. Du kan säga upp när som helst under provperioden.` },
      { q: 'Vad kostar BetTrackerAI Pro?', a: `${price} DKK/mån vid månadsbetalning eller ${yearly} DKK/mån vid årsbetalning – en besparing på ${discount} %. Du kan betala med Visa, Mastercard eller banköverföring.` },
      { q: 'Vilka spelbolag jämför ni?', a: 'Vi jämför odds från svenska och internationella spelbolag, bland annat Svenska Spel Sport & Casino, bet365, Unibet, LeoVegas, Betsson och Mr Green.' },
      { q: 'Hur får jag besked om nya surebets?', a: 'Du kan följa med direkt på plattformen, få besked via SMS med vår SMS-tjänst eller följa vår Telegram-kanal.' },
      { q: 'Vem kan använda BetTrackerAI?', a: `Du måste ha fyllt ${AGE} år. Spela alltid ansvarsfullt – behöver du hjälp kan du kontakta Stödlinjen (stodlinjen.se) eller stänga av dig själv via Spelpaus.se.` },
    ],
    account: [
      { q: 'Hur säger jag upp mitt abonnemang?', a: 'Du kan säga upp när som helst under Mitt konto. Uppsägningen gäller från slutet av den period du har betalat för, och du behåller tillgången till dess. Säger du upp före provperiodens slut dras inga pengar.' },
      { q: 'Kan jag ångra mitt köp?', a: 'Ja. Som konsument har du 14 dagars ångerrätt. Skriv till oss så hjälper vi dig. Har du bett om att starta tjänsten direkt betalar du proportionerligt för den tid du har använt.' },
      { q: 'Hur ändrar jag min e-postadress eller mitt mobilnummer?', a: `Mobilnummer och användarnamn kan du ändra under Mitt konto. E-postadressen kan du inte ändra själv, så skriv till ${mail} så rättar vi den.` },
      { q: 'Kan jag få mina uppgifter raderade?', a: `Ja. Du har rätt att få dina uppgifter raderade, om vi inte enligt lag måste spara dem, till exempel fakturor i 5 år. Skriv till ${mail} så hjälper vi dig.` },
      { q: 'Vilka betalningsuppgifter sparar ni?', a: 'Betalningar hanteras av Stripe. Vi sparar inte dina kortuppgifter och ser bara vilken plan du har och om betalningen har gått igenom.' },
    ],
  },
  no: {
    metaTitle: 'Vanlige spørsmål – BetTrackerAI',
    metaDescription: 'Svar på de vanligste spørsmålene om surebets, prøveperiode, abonnement, oppsigelse og angrerett.',
    eyebrow: 'Support',
    h1: 'Ofte stilte spørsmål',
    intro: 'Her finner du svar på det vi oftest blir spurt om. Finner du ikke spørsmålet ditt, skriv til oss.',
    topicsLabel: 'Emner',
    groupService: 'Om surebets og tjenesten',
    groupAccount: 'Konto, betaling og data',
    notFound: 'Fant du ikke svar?',
    notFoundText: 'Vi hjelper deg gjerne personlig.',
    contact: 'Kontakt oss',
    service: [
      { q: 'Hva er en surebet?', a: 'En surebet oppstår når bookmakerne har så ulike odds på samme kamp at du kan dekke alle utfall og likevel gå i pluss. Marginen viser hvor stor gevinsten er i prosent av den samlede innsatsen din.' },
      { q: 'Er surebets helt uten risiko?', a: 'Når alle innsatser er plassert til de viste oddsene, er resultatet låst. Risikoen ligger i at oddsen kan endre seg før du har plassert alle spill, eller at en bookmaker begrenser kontoen din. Derfor viser vi alltid når en surebet sist ble oppdatert.' },
      { q: 'Hvordan fungerer den gratis prøveperioden?', a: `Du får ${PRICING.trialDays} dager gratis med full tilgang til BetTrackerAI Pro. Du kan si opp når som helst i prøveperioden.` },
      { q: 'Hva koster BetTrackerAI Pro?', a: `${price} DKK/mnd ved månedlig betaling eller ${yearly} DKK/mnd ved årlig betaling – en besparelse på ${discount} %. Du kan betale med Visa, Mastercard eller bankoverføring.` },
      { q: 'Hvilke bookmakere sammenligner dere?', a: 'Vi sammenligner odds med Norsk Tipping, eneste lisensierte aktør i Norge under Lotteritilsynet. Gevinster er skattefrie.' },
      { q: 'Hvordan får jeg beskjed om nye surebets?', a: 'Du kan følge med direkte på plattformen, få beskjed på SMS med vår SMS-tjeneste eller følge Telegram-kanalen vår.' },
      { q: 'Hvem kan bruke BetTrackerAI?', a: `Du må være fylt ${AGE} år. Spill alltid ansvarlig – trenger du hjelp, kan du kontakte Hjelpelinjen (hjelpelinjen.no).` },
    ],
    account: [
      { q: 'Hvordan sier jeg opp abonnementet mitt?', a: 'Du kan si opp når som helst under Min konto. Oppsigelsen gjelder fra utløpet av perioden du har betalt for, og du beholder tilgangen til da. Sier du opp før prøveperioden er over, trekker vi ingen penger.' },
      { q: 'Kan jeg angre kjøpet?', a: 'Ja. Som forbruker har du 14 dagers angrerett. Skriv til oss, så hjelper vi deg. Har du bedt om å starte tjenesten med en gang, betaler du forholdsmessig for tiden du har brukt.' },
      { q: 'Hvordan endrer jeg e-postadressen eller mobilnummeret mitt?', a: `Mobilnummer og brukernavn kan du endre under Min konto. E-postadressen kan du ikke endre selv, så skriv til ${mail}, så retter vi den.` },
      { q: 'Kan jeg få slettet dataene mine?', a: `Ja. Du har rett til å få opplysningene dine slettet, med mindre vi må lagre dem etter loven, for eksempel fakturaer i 5 år. Skriv til ${mail}, så hjelper vi deg.` },
      { q: 'Hvilke betalingsopplysninger lagrer dere?', a: 'Betalinger håndteres av Stripe. Vi lagrer ikke kortopplysningene dine og ser bare hvilken plan du har og om betalingen er gjennomført.' },
    ],
  },
  de: {
    metaTitle: 'Häufige Fragen (FAQ) – BetTrackerAI',
    metaDescription: 'Antworten auf die häufigsten Fragen zu Surebets, Testphase, Abo, Kündigung und Widerrufsrecht.',
    eyebrow: 'Support',
    h1: 'Häufig gestellte Fragen',
    intro: 'Hier findest du Antworten auf das, was wir am häufigsten gefragt werden. Findest du deine Frage nicht, schreib uns.',
    topicsLabel: 'Themen',
    groupService: 'Über Surebets und den Dienst',
    groupAccount: 'Konto, Zahlung und Daten',
    notFound: 'Keine Antwort gefunden?',
    notFoundText: 'Wir helfen dir gern persönlich weiter.',
    contact: 'Kontakt aufnehmen',
    service: [
      { q: 'Was ist eine Surebet?', a: 'Eine Surebet entsteht, wenn die Quoten der Buchmacher auf dasselbe Spiel so weit auseinanderliegen, dass du alle Ausgänge abdecken und trotzdem im Plus landen kannst. Die Marge zeigt den Gewinn in Prozent deines Gesamteinsatzes.' },
      { q: 'Sind Surebets völlig risikofrei?', a: 'Sobald alle Wetten zu den angezeigten Quoten platziert sind, steht das Ergebnis fest. Das Risiko liegt darin, dass sich Quoten ändern können, bevor du alle Wetten platziert hast, oder dass ein Buchmacher dein Konto begrenzt. Deshalb zeigen wir immer an, wann eine Surebet zuletzt aktualisiert wurde.' },
      { q: 'Wie funktioniert die kostenlose Testphase?', a: `Du erhältst ${PRICING.trialDays} Tage kostenlos mit vollem Zugriff auf BetTrackerAI Pro. Du kannst während der Testphase jederzeit kündigen.` },
      { q: 'Was kostet BetTrackerAI Pro?', a: `${price} DKK/Monat bei monatlicher Zahlung oder ${yearly} DKK/Monat bei jährlicher Zahlung – eine Ersparnis von ${discount} %. Du kannst mit Visa, Mastercard oder per Banküberweisung zahlen.` },
      { q: 'Welche Buchmacher vergleicht ihr?', a: 'Wir vergleichen Quoten deutscher und internationaler Buchmacher, unter anderem Tipico, bwin, bet365, Interwetten, Betway und ODDSET.' },
      { q: 'Wie erfahre ich von neuen Surebets?', a: 'Du kannst direkt auf der Plattform mitverfolgen, per SMS-Dienst benachrichtigt werden oder unserem Telegram-Kanal folgen.' },
      { q: 'Wer kann BetTrackerAI nutzen?', a: `Du musst mindestens ${AGE} Jahre alt sein. Spiele immer verantwortungsvoll – wenn du Hilfe brauchst, wende dich an die BZgA (check-dein-spiel.de) oder lass dich über das Sperrsystem OASIS sperren.` },
    ],
    account: [
      { q: 'Wie kündige ich mein Abo?', a: 'Du kannst jederzeit unter „Mein Konto“ kündigen. Die Kündigung gilt zum Ende des bezahlten Zeitraums, bis dahin behältst du den Zugang. Kündigst du vor Ende der Testphase, buchen wir nichts ab.' },
      { q: 'Kann ich meinen Kauf widerrufen?', a: 'Ja. Als Verbraucher hast du ein 14-tägiges Widerrufsrecht. Schreib uns, dann helfen wir dir. Hast du verlangt, dass der Dienst sofort beginnt, zahlst du anteilig für die genutzte Zeit.' },
      { q: 'Wie ändere ich meine E-Mail-Adresse oder Handynummer?', a: `Handynummer und Benutzername kannst du unter „Mein Konto“ ändern. Die E-Mail-Adresse kannst du nicht selbst ändern, schreib daher an ${mail}, dann passen wir sie an.` },
      { q: 'Kann ich meine Daten löschen lassen?', a: `Ja. Du hast das Recht auf Löschung deiner Daten, sofern wir sie nicht gesetzlich aufbewahren müssen, etwa Rechnungen für 5 Jahre. Schreib an ${mail}, dann helfen wir dir.` },
      { q: 'Welche Zahlungsdaten speichert ihr?', a: 'Zahlungen werden von Stripe abgewickelt. Wir speichern deine Kartendaten nicht und sehen nur, welchen Tarif du hast und ob die Zahlung durchgegangen ist.' },
    ],
  },
  es: {
    metaTitle: 'Preguntas frecuentes (FAQ) – BetTrackerAI',
    metaDescription: 'Respuestas a las preguntas más frecuentes sobre surebets, la prueba gratuita, la suscripción, la cancelación y el derecho de desistimiento.',
    eyebrow: 'Soporte',
    h1: 'Preguntas frecuentes',
    intro: 'Encuentra respuestas a lo que nos preguntan con más frecuencia. Si no encuentras tu pregunta, escríbenos.',
    topicsLabel: 'Temas',
    groupService: 'Sobre surebets y el servicio',
    groupAccount: 'Cuenta, pago y datos',
    notFound: '¿No has encontrado respuesta?',
    notFoundText: 'Estaremos encantados de ayudarte personalmente.',
    contact: 'Contáctanos',
    service: [
      { q: '¿Qué es una surebet?', a: 'Una surebet aparece cuando las cuotas de los bookmakers para el mismo partido difieren lo suficiente como para cubrir todos los resultados y aun así obtener beneficio. El margen muestra el beneficio como porcentaje de tu apuesta total.' },
      { q: '¿Las surebets son completamente libres de riesgo?', a: 'Una vez colocadas todas las apuestas a las cuotas mostradas, el resultado queda asegurado. El riesgo está en que las cuotas pueden cambiar antes de que hayas colocado todas tus apuestas, o en que un bookmaker limite tu cuenta. Por eso siempre mostramos cuándo se actualizó por última vez una surebet.' },
      { q: '¿Cómo funciona la prueba gratuita?', a: `Tienes ${PRICING.trialDays} días gratis con acceso completo a BetTrackerAI Pro. Puedes cancelar en cualquier momento durante la prueba.` },
      { q: '¿Cuánto cuesta BetTrackerAI Pro?', a: `${price} DKK/mes con facturación mensual o ${yearly} DKK/mes con facturación anual, un ahorro del ${discount}%. Puedes pagar con Visa, Mastercard o transferencia bancaria.` },
      { q: '¿Qué bookmakers comparáis?', a: 'Comparamos cuotas de bookmakers con licencia en España, entre ellos Codere, bet365, Sportium, bwin, Luckia y Retabet.' },
      { q: '¿Cómo me avisan de nuevas surebets?', a: 'Puedes seguirlas en la plataforma, recibir alertas por SMS con nuestro servicio de SMS o seguir nuestro canal de Telegram.' },
      { q: '¿Quién puede usar BetTrackerAI?', a: `Debes tener al menos ${AGE} años. Juega siempre de forma responsable; si necesitas ayuda, contacta con BeGambleAware (begambleaware.org).` },
    ],
    account: [
      { q: '¿Cómo cancelo mi suscripción?', a: 'Puedes cancelar en cualquier momento desde Mi cuenta. La cancelación tiene efecto al final del período que has pagado y conservas el acceso hasta entonces. Si cancelas antes de que termine la prueba, no te cobramos nada.' },
      { q: '¿Puedo desistir de mi compra?', a: 'Sí. Como consumidor tienes un derecho de desistimiento de 14 días. Escríbenos y te ayudaremos. Si solicitaste iniciar el servicio de inmediato, pagarás proporcionalmente por el tiempo que hayas utilizado.' },
      { q: '¿Cómo cambio mi correo electrónico o número de móvil?', a: `Puedes cambiar tu número de móvil y tu nombre de usuario en Mi cuenta. No puedes cambiar tu dirección de correo electrónico por tu cuenta, así que escribe a ${mail} y lo actualizaremos.` },
      { q: '¿Puedo solicitar que se eliminen mis datos?', a: `Sí. Tienes derecho a que se eliminen tus datos, salvo que estemos obligados legalmente a conservarlos, como las facturas durante 5 años. Escribe a ${mail} y te ayudaremos.` },
      { q: '¿Qué datos de pago almacenáis?', a: 'Los pagos son gestionados por Stripe. No almacenamos los datos de tu tarjeta y solo vemos qué plan tienes y si tu pago se ha procesado correctamente.' },
    ],
  },
  br: {
    metaTitle: 'Perguntas frequentes (FAQ) – BetTrackerAI',
    metaDescription: 'Respostas às perguntas mais comuns sobre surebets, o período de teste gratuito, assinatura, cancelamento e direito de arrependimento.',
    eyebrow: 'Suporte',
    h1: 'Perguntas frequentes',
    intro: 'Encontre respostas para o que nos perguntam com mais frequência. Se não encontrar sua dúvida, escreva para nós.',
    topicsLabel: 'Tópicos',
    groupService: 'Sobre surebets e o serviço',
    groupAccount: 'Conta, pagamento e dados',
    notFound: 'Não encontrou uma resposta?',
    notFoundText: 'Ficamos felizes em te ajudar pessoalmente.',
    contact: 'Fale conosco',
    service: [
      { q: 'O que é uma surebet?', a: 'Uma surebet aparece quando as odds de diferentes bookmakers para o mesmo jogo divergem o suficiente para que você cubra todos os resultados e ainda saia no lucro. A margem mostra o lucro como percentual do valor total apostado.' },
      { q: 'As surebets são completamente sem risco?', a: 'Assim que todas as apostas são feitas nas odds exibidas, o resultado está garantido. O risco é que as odds podem mudar antes de você concluir todas as apostas, ou que um bookmaker limite sua conta. Por isso, sempre mostramos quando uma surebet foi atualizada pela última vez.' },
      { q: 'Como funciona o período de teste gratuito?', a: `Você tem ${PRICING.trialDays} dias grátis com acesso completo ao BetTrackerAI Pro. Você pode cancelar a qualquer momento durante o período de teste.` },
      { q: 'Quanto custa o BetTrackerAI Pro?', a: `${price} DKK/mês no plano mensal ou ${yearly} DKK/mês no plano anual – uma economia de ${discount}%. Você pode pagar com Visa, Mastercard ou transferência bancária.` },
      { q: 'Quais bookmakers vocês comparam?', a: 'Comparamos odds de bookmakers autorizados pela SPA, incluindo Betano, Superbet, bet365, Sportingbet, KTO e Estrela Bet.' },
      { q: 'Como recebo notificações sobre novas surebets?', a: 'Você pode acompanhar pela plataforma, receber alertas por SMS com nosso serviço de SMS, ou seguir nosso canal no Telegram.' },
      { q: 'Quem pode usar o BetTrackerAI?', a: `Você deve ter pelo menos ${AGE} anos. Aposte sempre com responsabilidade – se precisar de ajuda, entre em contato com a BeGambleAware (begambleaware.org).` },
    ],
    account: [
      { q: 'Como cancelo minha assinatura?', a: 'Você pode cancelar a qualquer momento em Minha conta. O cancelamento entra em vigor no final do período já pago, e você mantém o acesso até lá. Se cancelar antes do término do período de teste, não cobramos nada.' },
      { q: 'Posso desistir da compra?', a: 'Sim. Como consumidor, você tem 14 dias de direito de arrependimento. Escreva para nós e te ajudaremos. Se você solicitou o início imediato do serviço, cobramos proporcionalmente pelo tempo utilizado.' },
      { q: 'Como altero meu e-mail ou número de celular?', a: `Você pode alterar seu número de celular e nome de usuário em Minha conta. Não é possível alterar o endereço de e-mail por conta própria, então escreva para ${mail} e faremos a atualização.` },
      { q: 'Posso solicitar a exclusão dos meus dados?', a: `Sim. Você tem o direito de solicitar a exclusão dos seus dados, a menos que sejamos legalmente obrigados a mantê-los, como faturas por 5 anos. Escreva para ${mail} e te ajudaremos.` },
      { q: 'Quais dados de pagamento vocês armazenam?', a: 'Os pagamentos são processados pelo Stripe. Não armazenamos os dados do seu cartão e apenas verificamos qual plano você possui e se o pagamento foi aprovado.' },
    ],
  },
  pt: {
    metaTitle: 'Perguntas frequentes (FAQ) – BetTrackerAI',
    metaDescription: 'Respostas às perguntas mais frequentes sobre surebets, o período de teste gratuito, subscrição, cancelamento e direito de arrependimento.',
    eyebrow: 'Suporte',
    h1: 'Perguntas frequentes',
    intro: 'Encontra aqui respostas às perguntas que nos fazem com mais frequência. Se não encontrares a tua pergunta, escreve-nos.',
    topicsLabel: 'Tópicos',
    groupService: 'Sobre surebets e o serviço',
    groupAccount: 'Conta, pagamento e dados',
    notFound: 'Não encontraste resposta?',
    notFoundText: 'Temos todo o gosto em ajudar-te pessoalmente.',
    contact: 'Contacta-nos',
    service: [
      { q: 'O que é uma surebet?', a: 'Uma surebet surge quando as odds de diferentes casas de apostas para o mesmo jogo diferem o suficiente para cobrires todos os resultados e ainda assim ficares com lucro. A margem indica o lucro em percentagem do valor total apostado.' },
      { q: 'As surebets são completamente sem risco?', a: 'Assim que todas as apostas estão colocadas às odds apresentadas, o resultado fica garantido. O risco está em as odds poderem mudar antes de teres colocado todas as apostas, ou em a casa de apostas limitar a tua conta. Por isso mostramos sempre quando uma surebet foi atualizada pela última vez.' },
      { q: 'Como funciona o período de teste gratuito?', a: `Tens ${PRICING.trialDays} dias gratuitos com acesso completo ao BetTrackerAI Pro. Podes cancelar a qualquer momento durante o período de teste.` },
      { q: 'Quanto custa o BetTrackerAI Pro?', a: `${price} DKK/mês na faturação mensal ou ${yearly} DKK/mês na faturação anual – uma poupança de ${discount}%. Podes pagar com Visa, Mastercard ou transferência bancária.` },
      { q: 'Que casas de apostas comparam?', a: 'Comparamos odds de casas de apostas licenciadas pelo SRIJ, incluindo Betano, Betclic, Placard, Solverde, bwin e Luckia.' },
      { q: 'Como recebo notificações sobre novas surebets?', a: 'Podes acompanhar na plataforma, receber alertas por SMS com o nosso serviço de SMS, ou seguir o nosso canal de Telegram.' },
      { q: 'Quem pode usar o BetTrackerAI?', a: `Tens de ter pelo menos ${AGE} anos. Joga sempre de forma responsável – se precisares de ajuda, contacta a BeGambleAware (begambleaware.org).` },
    ],
    account: [
      { q: 'Como cancelo a minha subscrição?', a: 'Podes cancelar a qualquer momento em A minha conta. O cancelamento entra em vigor no final do período já pago e mantens o acesso até lá. Se cancelares antes de o período de teste terminar, não te cobramos nada.' },
      { q: 'Posso exercer o direito de arrependimento?', a: 'Sim. Enquanto consumidor tens 14 dias de direito de arrependimento. Escreve-nos e ajudamos-te. Se pediste para iniciar o serviço imediatamente, pagas proporcionalmente pelo tempo que utilizaste.' },
      { q: 'Como altero o meu e-mail ou número de telemóvel?', a: `Podes alterar o teu número de telemóvel e nome de utilizador em A minha conta. Não é possível alterar o endereço de e-mail por conta própria, por isso escreve para ${mail} e nós atualizamos.` },
      { q: 'Posso pedir a eliminação dos meus dados?', a: `Sim. Tens o direito de solicitar a eliminação dos teus dados, salvo quando somos legalmente obrigados a conservá-los, como faturas durante 5 anos. Escreve para ${mail} e ajudamos-te.` },
      { q: 'Que dados de pagamento guardam?', a: 'Os pagamentos são processados pela Stripe. Não guardamos os dados do teu cartão e apenas vemos qual o plano que tens e se o pagamento foi efetuado com sucesso.' },
    ],
  },
  fr: {
    metaTitle: 'Questions fréquentes (FAQ) – BetTrackerAI',
    metaDescription: 'Réponses aux questions les plus fréquentes sur les surebets, l\'essai gratuit, l\'abonnement, la résiliation et le droit de rétractation.',
    eyebrow: 'Support',
    h1: 'Questions fréquentes',
    intro: 'Trouve les réponses aux questions qu\'on nous pose le plus souvent. Si tu ne trouves pas ta question, écris-nous.',
    topicsLabel: 'Thèmes',
    groupService: 'Les surebets et le service',
    groupAccount: 'Compte, paiement et données',
    notFound: 'Tu n\'as pas trouvé de réponse ?',
    notFoundText: 'Nous sommes là pour t\'aider personnellement.',
    contact: 'Nous contacter',
    service: [
      { q: 'Qu\'est-ce qu\'un surebet ?', a: 'Un surebet apparaît lorsque les cotes des bookmakers sur un même match diffèrent suffisamment pour couvrir tous les résultats et dégager un bénéfice. La marge indique le profit en pourcentage de ta mise totale.' },
      { q: 'Les surebets sont-ils totalement sans risque ?', a: 'Une fois toutes les mises placées aux cotes affichées, le résultat est garanti. Le risque est que les cotes changent avant que tu aies placé toutes tes mises, ou qu\'un bookmaker limite ton compte. C\'est pourquoi nous indiquons toujours la dernière mise à jour d\'un surebet.' },
      { q: 'Comment fonctionne l\'essai gratuit ?', a: `Tu bénéficies de ${PRICING.trialDays} jours gratuits avec un accès complet à BetTrackerAI Pro. Tu peux annuler à tout moment pendant l\'essai.` },
      { q: 'Combien coûte BetTrackerAI Pro ?', a: `${price} DKK/mois avec la facturation mensuelle ou ${yearly} DKK/mois avec la facturation annuelle – soit une économie de ${discount}%. Tu peux payer par Visa, Mastercard ou virement bancaire.` },
      { q: 'Quels bookmakers comparez-vous ?', a: 'Nous comparons les cotes de bookmakers agréés par l\'ANJ, notamment Winamax, Betclic, Unibet, Parions Sport en ligne, PMU et ZEbet.' },
      { q: 'Comment être alerté des nouveaux surebets ?', a: 'Tu peux suivre les opportunités directement sur la plateforme, recevoir des alertes SMS via notre service SMS, ou suivre notre chaîne Telegram.' },
      { q: 'Qui peut utiliser BetTrackerAI ?', a: `Tu dois avoir au moins ${AGE} ans. Joue toujours de manière responsable – si tu as besoin d\'aide, contacte BeGambleAware (begambleaware.org).` },
    ],
    account: [
      { q: 'Comment résilier mon abonnement ?', a: 'Tu peux résilier à tout moment depuis Mon compte. La résiliation prend effet à la fin de la période déjà payée, et tu conserves l\'accès jusqu\'à cette date. Si tu résilie avant la fin de l\'essai, rien ne te sera facturé.' },
      { q: 'Puis-je me rétracter de mon achat ?', a: 'Oui. En tant que consommateur, tu disposes d\'un droit de rétractation de 14 jours. Écris-nous et nous t\'aiderons. Si tu as demandé à démarrer le service immédiatement, tu paies au prorata du temps utilisé.' },
      { q: 'Comment modifier mon adresse e-mail ou mon numéro de mobile ?', a: `Tu peux modifier ton numéro de mobile et ton nom d\'utilisateur depuis Mon compte. Il n\'est pas possible de modifier ton adresse e-mail toi-même, alors écris à ${mail} et nous le ferons pour toi.` },
      { q: 'Puis-je faire supprimer mes données ?', a: `Oui. Tu as le droit de faire supprimer tes données, sauf si nous sommes légalement tenus de les conserver, comme les factures pendant 5 ans. Écris à ${mail} et nous t\'aiderons.` },
      { q: 'Quelles informations de paiement conservez-vous ?', a: 'Les paiements sont gérés par Stripe. Nous ne stockons pas tes coordonnées bancaires et voyons uniquement l\'offre souscrite et si ton paiement a bien été effectué.' },
    ],
  },
  it: {
    metaTitle: 'Domande frequenti (FAQ) – BetTrackerAI',
    metaDescription: 'Risposte alle domande più frequenti su surebets, la prova gratuita, l\'abbonamento, la disdetta e il diritto di recesso.',
    eyebrow: 'Supporto',
    h1: 'Domande frequenti',
    intro: 'Trova le risposte alle domande che ci vengono poste più spesso. Se non trovi la tua domanda, scrivici.',
    topicsLabel: 'Argomenti',
    groupService: 'Sui surebets e il servizio',
    groupAccount: 'Account, pagamento e dati',
    notFound: 'Non hai trovato una risposta?',
    notFoundText: 'Siamo felici di aiutarti personalmente.',
    contact: 'Contattaci',
    service: [
      { q: 'Cos\'è un surebet?', a: 'Un surebet si presenta quando le quote dei bookmaker sullo stesso incontro differiscono abbastanza da permetterti di coprire ogni risultato e chiudere comunque in profitto. Il margine mostra il guadagno come percentuale della puntata totale.' },
      { q: 'I surebets sono completamente privi di rischio?', a: 'Una volta piazzate tutte le scommesse alle quote visualizzate, il risultato è garantito. Il rischio è che le quote possano cambiare prima che tu abbia piazzato tutte le scommesse, o che un bookmaker limiti il tuo account. Per questo mostriamo sempre quando un surebet è stato aggiornato l\'ultima volta.' },
      { q: 'Come funziona la prova gratuita?', a: `Hai ${PRICING.trialDays} giorni gratuiti con accesso completo a BetTrackerAI Pro. Puoi disdire in qualsiasi momento durante la prova.` },
      { q: 'Quanto costa BetTrackerAI Pro?', a: `${price} DKK/mese con fatturazione mensile o ${yearly} DKK/mese con fatturazione annuale – un risparmio del ${discount}%. Puoi pagare con Visa, Mastercard o bonifico bancario.` },
      { q: 'Quali bookmaker confrontate?', a: 'Confrontiamo le quote di bookmaker con licenza ADM, tra cui Snai, Sisal, Goldbet, Eurobet, bet365 e Planetwin365.' },
      { q: 'Come ricevo notifiche sui nuovi surebets?', a: 'Puoi seguire la piattaforma direttamente, ricevere avvisi SMS con il nostro servizio SMS, oppure seguire il nostro canale Telegram.' },
      { q: 'Chi può usare BetTrackerAI?', a: `Devi avere almeno ${AGE} anni. Gioca sempre in modo responsabile – se hai bisogno di aiuto, contatta BeGambleAware (begambleaware.org).` },
    ],
    account: [
      { q: 'Come disdico il mio abbonamento?', a: 'Puoi disdire in qualsiasi momento dalla sezione Il mio account. La disdetta ha effetto alla fine del periodo già pagato e mantieni l\'accesso fino ad allora. Se disdici prima della fine della prova, non ti addebitiamo nulla.' },
      { q: 'Posso esercitare il diritto di recesso?', a: 'Sì. Come consumatore hai un diritto di recesso di 14 giorni. Scrivici e ti aiuteremo. Se hai richiesto l\'avvio immediato del servizio, paghi proporzionalmente per il tempo utilizzato.' },
      { q: 'Come cambio la mia email o il numero di cellulare?', a: `Puoi modificare il numero di cellulare e il nome utente dalla sezione Il mio account. Non puoi cambiare l\'indirizzo email autonomamente, quindi scrivi a ${mail} e lo aggiorneremo noi.` },
      { q: 'Posso richiedere la cancellazione dei miei dati?', a: `Sì. Hai il diritto di far cancellare i tuoi dati, a meno che non siamo obbligati per legge a conservarli, come le fatture per 5 anni. Scrivi a ${mail} e ti aiuteremo.` },
      { q: 'Quali dati di pagamento conservate?', a: 'I pagamenti sono gestiti da Stripe. Non conserviamo i dati della tua carta e vediamo solo quale piano hai attivo e se il pagamento è andato a buon fine.' },
    ],
  },
  pl: {
    metaTitle: 'Najczęstsze pytania (FAQ) – BetTrackerAI',
    metaDescription: 'Odpowiedzi na najczęściej zadawane pytania dotyczące surebets, bezpłatnego okresu próbnego, subskrypcji, anulowania i prawa do odstąpienia od umowy.',
    eyebrow: 'Wsparcie',
    h1: 'Często zadawane pytania',
    intro: 'Znajdź odpowiedzi na pytania, które zadajecie nam najczęściej. Jeśli nie możesz znaleźć swojego pytania, napisz do nas.',
    topicsLabel: 'Tematy',
    groupService: 'O surebets i usłudze',
    groupAccount: 'Konto, płatności i dane',
    notFound: 'Nie znalazłeś odpowiedzi?',
    notFoundText: 'Chętnie pomożemy Ci osobiście.',
    contact: 'Skontaktuj się z nami',
    service: [
      { q: 'Czym jest surebet?', a: 'Surebet pojawia się, gdy kursy bukmacherów na ten sam mecz różnią się na tyle, że możesz pokryć każdy wynik i nadal osiągnąć zysk. Marża pokazuje zysk jako procent całkowitego zakładu.' },
      { q: 'Czy surebets są całkowicie wolne od ryzyka?', a: 'Gdy każdy zakład zostanie postawiony po wyświetlonych kursach, wynik jest zagwarantowany. Ryzyko polega na tym, że kursy mogą się zmienić, zanim postawisz wszystkie zakłady, lub że bukmacher ograniczy Twoje konto. Dlatego zawsze pokazujemy, kiedy surebet był ostatnio aktualizowany.' },
      { q: 'Jak działa bezpłatny okres próbny?', a: `Otrzymujesz ${PRICING.trialDays} dni za darmo z pełnym dostępem do BetTrackerAI Pro. Możesz anulować w dowolnym momencie podczas okresu próbnego.` },
      { q: 'Ile kosztuje BetTrackerAI Pro?', a: `${price} DKK/miesiąc przy rozliczeniu miesięcznym lub ${yearly} DKK/miesiąc przy rozliczeniu rocznym – oszczędność wynosi ${discount}%. Możesz zapłacić kartą Visa, Mastercard lub przelewem bankowym.` },
      { q: 'Których bukmacherów porównujecie?', a: 'Porównujemy kursy licencjonowanych w Polsce bukmacherów, w tym STS, Fortuna, Betclic, Superbet, Totolotek i LV BET.' },
      { q: 'Jak mogę otrzymywać powiadomienia o nowych surebets?', a: 'Możesz śledzić platformę na bieżąco, otrzymywać alerty SMS za pośrednictwem naszej usługi SMS lub obserwować nasz kanał Telegram.' },
      { q: 'Kto może korzystać z BetTrackerAI?', a: `Musisz mieć co najmniej ${AGE} lat. Zawsze graj odpowiedzialnie – jeśli potrzebujesz pomocy, skontaktuj się z BeGambleAware (begambleaware.org).` },
    ],
    account: [
      { q: 'Jak anulować subskrypcję?', a: 'Możesz anulować w dowolnym momencie w sekcji Moje konto. Anulowanie wchodzi w życie z końcem opłaconego okresu i zachowujesz dostęp do tego czasu. Jeśli anulujesz przed końcem okresu próbnego, nic nie pobieramy.' },
      { q: 'Czy mogę odstąpić od zakupu?', a: 'Tak. Jako konsument masz 14-dniowe prawo do odstąpienia od umowy. Napisz do nas, a pomożemy Ci. Jeśli poprosiłeś o natychmiastowe uruchomienie usługi, zapłacisz proporcjonalnie za czas, w którym z niej korzystałeś.' },
      { q: 'Jak zmienić adres e-mail lub numer telefonu?', a: `Możesz zmienić numer telefonu i nazwę użytkownika w sekcji Moje konto. Nie możesz samodzielnie zmienić adresu e-mail, dlatego napisz na ${mail}, a my go zaktualizujemy.` },
      { q: 'Czy mogę usunąć swoje dane?', a: `Tak. Masz prawo do usunięcia swoich danych, chyba że jesteśmy prawnie zobowiązani do ich przechowywania, np. faktur przez 5 lat. Napisz na ${mail}, a pomożemy Ci.` },
      { q: 'Jakie dane płatności przechowujecie?', a: 'Płatności są obsługiwane przez Stripe. Nie przechowujemy danych Twojej karty i widzimy jedynie, jaki plan posiadasz oraz czy płatność przebiegła pomyślnie.' },
    ],
  },
  fi: {
    metaTitle: 'Usein kysytyt kysymykset (UKK) – BetTrackerAI',
    metaDescription: 'Vastauksia yleisimpiin kysymyksiin surebet-kohteista, ilmaisesta kokeilujaksosta, tilauksesta, peruuttamisesta ja peruutusoikeudesta.',
    eyebrow: 'Tuki',
    h1: 'Usein kysytyt kysymykset',
    intro: 'Löydä vastaukset yleisimpiin kysymyksiin. Jos et löydä vastausta kysymykseesi, ota meihin yhteyttä.',
    topicsLabel: 'Aiheet',
    groupService: 'Surebet-kohteista ja palvelusta',
    groupAccount: 'Tili, maksaminen ja tiedot',
    notFound: 'Etkö löytänyt vastausta?',
    notFoundText: 'Autamme sinua mielellämme henkilökohtaisesti.',
    contact: 'Ota yhteyttä',
    service: [
      { q: 'Mikä on surebet?', a: 'Surebet syntyy, kun vedonlyöntitoimistojen kertoimet samalle ottelulle eroavat riittävästi, jotta voit kattaa kaikki lopputulokset ja silti tehdä voittoa. Marginaali näyttää voiton prosentteina kokonaispanoksestasi.' },
      { q: 'Ovatko surebet-kohteet täysin riskittömiä?', a: 'Kun kaikki vedot on asetettu näytetyillä kertoimilla, tulos on lukittu. Riskinä on, että kertoimet voivat muuttua ennen kuin olet asettanut kaikki vetosi, tai että vedonlyöntitoimisto rajoittaa tiliäsi. Siksi näytämme aina, milloin surebet on viimeksi päivitetty.' },
      { q: 'Miten ilmainen kokeilu toimii?', a: `Saat ${PRICING.trialDays} päivää ilmaiseksi täydellä pääsyllä BetTrackerAI Pro -palveluun. Voit peruuttaa milloin tahansa kokeilujakson aikana.` },
      { q: 'Paljonko BetTrackerAI Pro maksaa?', a: `${price} DKK/kuukausi kuukausilaskutuksella tai ${yearly} DKK/kuukausi vuosilaskutuksella – säästät ${discount}%. Voit maksaa Visalla, Mastercardilla tai tilisiirrolla.` },
      { q: 'Mitä vedonlyöntitoimistoja vertailette?', a: 'Vertailemme kertoimia suomalaisilta ja kansainvälisiltä lisensoiduilta vedonlyöntitoimistoilta, mukaan lukien Veikkaus, sitä mukaa kun markkina avautuu.' },
      { q: 'Miten saan ilmoituksia uusista surebet-kohteista?', a: 'Voit seurata kohteita alustalla, saada SMS-hälytyksiä SMS-palvelumme kautta tai seurata Telegram-kanaviamme.' },
      { q: 'Kuka voi käyttää BetTrackerAI:ta?', a: `Sinun on oltava vähintään ${AGE} vuotta vanha. Pelaa aina vastuullisesti – jos tarvitset apua, ota yhteyttä BeGambleAware-palveluun (begambleaware.org).` },
    ],
    account: [
      { q: 'Miten peruutan tilaukseni?', a: 'Voit peruuttaa tilauksen milloin tahansa Oma tili -osiossa. Peruutus astuu voimaan maksetun kauden lopussa, ja sinulla on pääsy palveluun siihen asti. Jos peruutat ennen kokeilujakson päättymistä, emme veloita mitään.' },
      { q: 'Voinko peruuttaa ostokseni?', a: 'Kyllä. Kuluttajana sinulla on 14 päivän peruutusoikeus. Kirjoita meille ja autamme sinua. Jos pyysit palvelun käynnistämistä heti, maksat suhteessa käyttämästäsi ajasta.' },
      { q: 'Miten vaihdan sähköpostiosoitteeni tai puhelinnumeroni?', a: `Voit vaihtaa puhelinnumerosi ja käyttäjänimesi Oma tili -osiossa. Et voi vaihtaa sähköpostiosoitettasi itse, joten kirjoita osoitteeseen ${mail} ja päivitämme sen.` },
      { q: 'Voinko pyytää tietojeni poistamista?', a: `Kyllä. Sinulla on oikeus pyytää tietojesi poistamista, ellei meillä ole lakisääteistä velvollisuutta säilyttää niitä, kuten laskuja 5 vuoden ajan. Kirjoita osoitteeseen ${mail} ja autamme sinua.` },
      { q: 'Mitä maksutietoja tallennatte?', a: 'Maksut käsittelee Stripe. Emme tallenna korttitietojasi ja näemme vain, mikä tilaus sinulla on ja onko maksusi onnistunut.' },
    ],
  },
  nl: {
    metaTitle: 'Veelgestelde vragen (FAQ) – BetTrackerAI',
    metaDescription: 'Antwoorden op de meest gestelde vragen over surebets, de gratis proefperiode, het abonnement, opzegging en het herroepingsrecht.',
    eyebrow: 'Ondersteuning',
    h1: 'Veelgestelde vragen',
    intro: 'Vind antwoorden op wat we het vaakst wordt gevraagd. Als je je vraag niet kunt vinden, schrijf ons dan.',
    topicsLabel: 'Onderwerpen',
    groupService: 'Over surebets en de service',
    groupAccount: 'Account, betaling en gegevens',
    notFound: 'Geen antwoord gevonden?',
    notFoundText: 'We helpen je graag persoonlijk verder.',
    contact: 'Neem contact op',
    service: [
      { q: 'Wat is een surebet?', a: 'Een surebet ontstaat wanneer de odds van bookmakers op dezelfde wedstrijd genoeg van elkaar verschillen zodat je elke uitkomst kunt afdekken en toch winst maakt. De marge toont de winst als percentage van je totale inzet.' },
      { q: 'Zijn surebets volledig risicovrij?', a: 'Zodra elke weddenschap is geplaatst tegen de weergegeven odds, staat het resultaat vast. Het risico is dat odds kunnen veranderen voordat je al je weddenschappen hebt geplaatst, of dat een bookmaker je account beperkt. Daarom tonen we altijd wanneer een surebet voor het laatst is bijgewerkt.' },
      { q: 'Hoe werkt de gratis proefperiode?', a: `Je krijgt ${PRICING.trialDays} dagen gratis met volledige toegang tot BetTrackerAI Pro. Je kunt op elk moment tijdens de proefperiode opzeggen.` },
      { q: 'Wat kost BetTrackerAI Pro?', a: `${price} DKK/maand bij maandelijkse facturering of ${yearly} DKK/maand bij jaarlijkse facturering – een besparing van ${discount}%. Je kunt betalen met Visa, Mastercard of bankoverschrijving.` },
      { q: 'Welke bookmakers vergelijken jullie?', a: 'We vergelijken odds van Nederlandse en internationale bookmakers, waaronder TOTO, bet365, Unibet, BetCity, Jack\'s.nl en Holland Casino Online.' },
      { q: 'Hoe word ik op de hoogte gesteld van nieuwe surebets?', a: 'Je kunt het platform volgen, sms-meldingen ontvangen via onze sms-service, of ons Telegram-kanaal volgen.' },
      { q: 'Wie kan BetTrackerAI gebruiken?', a: `Je moet minimaal ${AGE} jaar oud zijn. Gok altijd verantwoord – als je hulp nodig hebt, neem dan contact op met BeGambleAware (begambleaware.org).` },
    ],
    account: [
      { q: 'Hoe zeg ik mijn abonnement op?', a: 'Je kunt op elk moment opzeggen via Mijn account. De opzegging gaat in aan het einde van de periode waarvoor je hebt betaald, en je behoudt tot die tijd toegang. Als je opzegt vóór het einde van de proefperiode, brengen we niets in rekening.' },
      { q: 'Kan ik mijn aankoop herroepen?', a: 'Ja. Als consument heb je een herroepingsrecht van 14 dagen. Schrijf ons en we helpen je verder. Als je hebt gevraagd de service direct te starten, betaal je naar rato voor de tijd die je hebt gebruikt.' },
      { q: 'Hoe wijzig ik mijn e-mailadres of mobiel nummer?', a: `Je kunt je mobiele nummer en gebruikersnaam wijzigen via Mijn account. Je kunt je e-mailadres niet zelf wijzigen, dus schrijf naar ${mail} en we passen het voor je aan.` },
      { q: 'Kan ik mijn gegevens laten verwijderen?', a: `Ja. Je hebt het recht om je gegevens te laten verwijderen, tenzij we wettelijk verplicht zijn deze te bewaren, zoals facturen gedurende 5 jaar. Schrijf naar ${mail} en we helpen je verder.` },
      { q: 'Welke betalingsgegevens slaan jullie op?', a: 'Betalingen worden verwerkt door Stripe. We slaan je kaartgegevens niet op en zien alleen welk abonnement je hebt en of je betaling is geslaagd.' },
    ],
  },
}

// Packs store the support address as {mail}, so the address stays in one place.
function withMail<T>(value: T): T {
  return JSON.parse(fillTemplate(JSON.stringify(value), { mail: COMPANY.email })) as T
}

export const DAILY: Record<Translated, DailyContent> = {
  ...DAILY_BASE,
  ...newLocales(DAILY_BASE, (pack, fallback) => (pack.daily ? { ...fallback, ...withMail(pack.daily) } : fallback)),
}

export const FAQ_PAGE: Record<Translated, FaqContent> = {
  ...FAQ_PAGE_BASE,
  ...newLocales(FAQ_PAGE_BASE, (pack, fallback) => (pack.faqPage ? { ...fallback, ...withMail(pack.faqPage) } : fallback)),
}
