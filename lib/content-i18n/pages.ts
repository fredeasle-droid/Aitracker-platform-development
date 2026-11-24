import { PRICING, yearlyDiscount } from '@/components/home/data'
import { COMPANY } from '@/lib/legal'
import type { Locale } from '@/lib/i18n'

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

export const DAILY: Record<Translated, DailyContent> = {
  en: {
    metaTitle: "Today's Surebets – the Best Sure Bets Right Now",
    metaDescription:
      "See today's best surebets across Danish and international bookmakers, updated continuously. Sport, match, market and guaranteed profit for the strongest opportunities right now.",
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
      'Se dagens bästa surebets hos danska och internationella spelbolag, uppdaterade löpande. Sport, match, marknad och garanterad vinst för de starkaste möjligheterna just nu.',
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
      'Se dagens beste surebets hos danske og internasjonale bookmakere, oppdatert løpende. Sport, kamp, marked og garantert profitt for de sterkeste mulighetene akkurat nå.',
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
      'Die besten Surebets von heute bei dänischen und internationalen Buchmachern, laufend aktualisiert. Sportart, Spiel, Markt und garantierter Gewinn der stärksten Chancen im Moment.',
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

export const FAQ_PAGE: Record<Translated, FaqContent> = {
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
      { q: 'How much does BetTrackerAI Pro cost?', a: `${price} DKK/month on monthly billing or ${yearly} DKK/month on yearly billing – a saving of ${discount}%. You can pay with Visa, Mastercard, MobilePay or bank transfer.` },
      { q: 'Which bookmakers do you compare?', a: 'We compare odds from Danish and international bookmakers, including Danske Spil, bet365, Unibet, LeoVegas, Betano and Pinnacle.' },
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
      { q: 'Vad kostar BetTrackerAI Pro?', a: `${price} DKK/mån vid månadsbetalning eller ${yearly} DKK/mån vid årsbetalning – en besparing på ${discount} %. Du kan betala med Visa, Mastercard, MobilePay eller banköverföring.` },
      { q: 'Vilka spelbolag jämför ni?', a: 'Vi jämför odds från danska och internationella spelbolag, bland annat Danske Spil, bet365, Unibet, LeoVegas, Betano och Pinnacle.' },
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
      { q: 'Hva koster BetTrackerAI Pro?', a: `${price} DKK/mnd ved månedlig betaling eller ${yearly} DKK/mnd ved årlig betaling – en besparelse på ${discount} %. Du kan betale med Visa, Mastercard, MobilePay eller bankoverføring.` },
      { q: 'Hvilke bookmakere sammenligner dere?', a: 'Vi sammenligner odds fra danske og internasjonale bookmakere, blant annet Danske Spil, bet365, Unibet, LeoVegas, Betano og Pinnacle.' },
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
      { q: 'Was kostet BetTrackerAI Pro?', a: `${price} DKK/Monat bei monatlicher Zahlung oder ${yearly} DKK/Monat bei jährlicher Zahlung – eine Ersparnis von ${discount} %. Du kannst mit Visa, Mastercard, MobilePay oder per Banküberweisung zahlen.` },
      { q: 'Welche Buchmacher vergleicht ihr?', a: 'Wir vergleichen Quoten dänischer und internationaler Buchmacher, unter anderem Danske Spil, bet365, Unibet, LeoVegas, Betano und Pinnacle.' },
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
}
