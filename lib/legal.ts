import { PRICING, RESPONSIBLE } from "@/components/home/data";

/**
 * Company details shown on the legal pages. The Danish e-commerce act requires a trader to state its legal name,
 * CVR number and address; fill in `legalName`, `cvr` and `address` here and they appear on every legal page.
 */
export const COMPANY: { brand: string; email: string; legalName?: string; cvr?: string; address?: string } = {
  brand: "BetTrackerAI",
  email: "support@bettrackerai.com",
  legalName: "ODDSLOGIC LTD",
};

export const LEGAL_UPDATED = "23. november 2026";

export type LegalBlock = { p: string } | { ul: string[] };
export type LegalSection = { id: string; title: string; blocks: LegalBlock[] };

const stopSpillet = `[StopSpillet](${RESPONSIBLE.stopSpilletUrl}) på telefon ${RESPONSIBLE.stopSpilletPhone}`;

export const TERMS_SECTIONS: LegalSection[] = [
  {
    id: "om-tjenesten",
    title: "Om tjenesten og aftalens parter",
    blocks: [
      {
        p: `Disse vilkår gælder for din brug af ${COMPANY.brand} (”vi”, ”os”) på bettrackerai.com, herunder abonnementet BetTrackerAI Pro, SMS-service, Telegram-kanal og øvrige funktioner. Når du opretter en konto eller starter en prøveperiode, indgår du en aftale med os på disse vilkår.`,
      },
      {
        p: "Vi er et informationsværktøj. Vi sammenligner odds fra bookmakere og viser, hvor forskelle i odds kan give et surebet. Vi er ikke en spiludbyder, udbyder ikke væddemål og modtager ikke indsatser.",
      },
    ],
  },
  {
    id: "alder",
    title: "Hvem kan bruge tjenesten",
    blocks: [
      {
        p: `Du skal være fyldt ${RESPONSIBLE.minAge} år for at oprette en konto. Bookmakerne i oversigten kræver samme aldersgrænse, og du er selv ansvarlig for, at du må spille hos dem efter de regler, der gælder for dig.`,
      },
      { p: "Du må ikke bruge tjenesten, hvis du er udelukket fra spil via ROFUS." },
    ],
  },
  {
    id: "ingen-garanti",
    title: "Ingen rådgivning og ingen garanti",
    blocks: [
      {
        p: "Alt indhold hos os er generel information. Det er hverken finansiel rådgivning, investeringsrådgivning eller en opfordring til at spille. Vi garanterer ikke gevinst, afkast eller, at et vist surebet kan gennemføres.",
      },
      { p: "Vær særligt opmærksom på, at:" },
      {
        ul: [
          "odds kan ændre sig eller forsvinde, før du har placeret alle spil, og så er surebettet ikke længere låst",
          "en bookmaker kan begrænse eller lukke din konto, nedsætte maksimale indsatser eller annullere spil ved åbenlyse fejl",
          "bonusser og kampagner hos bookmakerne har egne omsætningskrav og vilkår, som du selv skal læse og overholde",
          "viste resultater fra vores 365-dages challenge er historiske og er ingen garanti for fremtidige resultater",
        ],
      },
    ],
  },
  {
    id: "konto",
    title: "Din konto",
    blocks: [
      {
        p: "Du skal oplyse korrekte oplysninger, når du opretter din konto, og holde dem opdaterede. Din konto er personlig. Du må ikke dele dit login, og du er ansvarlig for al aktivitet på din konto. Opdager du misbrug, skal du straks skifte adgangskode og kontakte os.",
      },
    ],
  },
  {
    id: "abonnement",
    title: "Abonnement, priser og betaling",
    blocks: [
      {
        p: "Den aktuelle pris for BetTrackerAI Pro vises, før du bekræfter din tilmelding. Priser er angivet i danske kroner og inklusive moms, medmindre andet fremgår.",
      },
      {
        p: "Abonnementet fornyes automatisk for en ny periode (måned eller år, afhængigt af hvad du har valgt), indtil du opsiger det. Betaling håndteres af betalingsudbyderen Stripe. Vi gemmer ikke dine kortoplysninger.",
      },
      {
        p: "Ændrer vi prisen, giver vi dig besked i god tid, før den nye pris træder i kraft, og du kan opsige, før ændringen gælder for dig.",
      },
    ],
  },
  {
    id: "proveperiode",
    title: "Gratis prøveperiode",
    blocks: [
      {
        p: `Nye brugere kan få ${PRICING.trialDays} dages gratis prøveperiode med fuld adgang. Der trækkes først betaling, når prøveperioden slutter. Opsiger du inden udløbet, betaler du ikke. Prøveperioden kan bruges én gang pr. person.`,
      },
    ],
  },
  {
    id: "fortrydelse",
    title: "Fortrydelsesret",
    blocks: [
      {
        p: "Som forbruger har du efter forbrugeraftaleloven 14 dages fortrydelsesret fra den dag, aftalen er indgået. Du kan bruge fortrydelsesretten ved at sende os en klar meddelelse om, at du fortryder, fx på e-mail. Du kan bruge Forbrugerombudsmandens standardfortrydelsesformular, men det er ikke et krav.",
      },
      {
        p: "Hvis du beder om, at tjenesten skal starte inden fortrydelsesfristen udløber, skal du betale forholdsmæssigt for det, der er leveret, indtil du giver os besked om, at du fortryder. Er tjenesten leveret fuldt ud, før fristen udløber, og du har givet dit udtrykkelige samtykke og bekræftet, at du dermed mister fortrydelsesretten, kan den ikke længere bruges.",
      },
    ],
  },
  {
    id: "opsigelse",
    title: "Opsigelse",
    blocks: [
      {
        p: "Du kan opsige dit abonnement når som helst på Min konto eller ved at skrive til os. Opsigelsen gælder fra udgangen af den betalingsperiode, du allerede har betalt for, og du beholder adgang til den periode er slut. Vi refunderer som udgangspunkt ikke en periode, der allerede er betalt, medmindre loven giver dig ret til det.",
      },
      {
        p: "Vi kan lukke din konto, hvis du groft eller gentagne gange overtræder disse vilkår. Allerede betalte beløb for en periode, du ikke kan bruge på grund af vores lukning, refunderer vi forholdsmæssigt, medmindre lukningen skyldes dit misbrug.",
      },
    ],
  },
  {
    id: "tilladt-brug",
    title: "Tilladt brug",
    blocks: [
      { p: "Du må bruge tjenesten til personlig brug. Du må ikke:" },
      {
        ul: [
          "videresælge, dele eller offentliggøre vores data, surebets eller login",
          "hente data automatisk (scraping, bots eller lignende) eller omgå tekniske begrænsninger",
          "forsøge at skaffe dig uautoriseret adgang til vores systemer eller andre brugeres konti",
          "bruge tjenesten til ulovlige formål",
        ],
      },
    ],
  },
  {
    id: "rettigheder",
    title: "Ophavsret og varemærker",
    blocks: [
      {
        p: `Indhold, design, software og varemærker på ${COMPANY.brand} tilhører os eller vores licensgivere. Navne og logoer tilhørende bookmakere og andre tredjeparter tilhører de respektive ejere og vises kun til identifikation. Du får en personlig, ikke-eksklusiv ret til at bruge tjenesten, så længe din aftale løber.`,
      },
    ],
  },
  {
    id: "ansvar",
    title: "Ansvar",
    blocks: [
      {
        p: "Vi leverer tjenesten med rimelig omhu, men kan ikke love, at den altid er fejlfri eller tilgængelig. Data kommer fra tredjeparter og kan være forsinket eller forkert, og du bør altid kontrollere odds hos bookmakeren, før du spiller.",
      },
      {
        p: "Vi er ikke ansvarlige for tab, der skyldes ændrede odds, bookmakeres beslutninger, dine egne spil eller driftsforstyrrelser hos tredjeparter. Vi hæfter efter dansk rets almindelige regler, og intet i disse vilkår begrænser vores ansvar for forsæt eller grov uagtsomhed eller de rettigheder, du har som forbruger efter ufravigelig lovgivning.",
      },
    ],
  },
  {
    id: "ansvarligt-spil",
    title: "Ansvarligt spil",
    blocks: [
      {
        p: `Spil kan blive en vane, og surebetting fjerner ikke alle risici. Spil aldrig for penge, du ikke har råd til at miste. Har du brug for hjælp, kan du ringe til ${stopSpillet} eller udelukke dig selv fra alle danske spiludbydere på [ROFUS](${RESPONSIBLE.rofusUrl}).`,
      },
    ],
  },
  {
    id: "aendringer",
    title: "Ændringer af vilkårene",
    blocks: [
      {
        p: "Vi kan opdatere disse vilkår, fx ved ændringer i tjenesten eller lovgivningen. Ved væsentlige ændringer giver vi dig besked på e-mail eller i tjenesten med mindst 30 dages varsel. Fortsætter du med at bruge tjenesten efter, at ændringen er trådt i kraft, accepterer du de nye vilkår. Accepterer du dem ikke, kan du opsige abonnementet.",
      },
    ],
  },
  {
    id: "klager",
    title: "Klager, lovvalg og værneting",
    blocks: [
      {
        p: `Er du utilfreds, så skriv til os på ${COMPANY.email}, så forsøger vi at løse det. Kan vi ikke blive enige, kan du som forbruger klage til [Nævnenes Hus](https://naevneneshus.dk), som driver Center for Klageløsning.`,
      },
      {
        p: "Aftalen er underlagt dansk ret. Tvister afgøres ved danske domstole. Som forbruger kan du altid bruge de værnetingsregler, som loven giver dig.",
      },
    ],
  },
];

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: "dataansvarlig",
    title: "Hvem er dataansvarlig",
    blocks: [
      {
        p: `${COMPANY.legalName}, som driver ${COMPANY.brand}, er dataansvarlig for de personoplysninger, vi behandler om dig. Du kan altid kontakte os på ${COMPANY.email}, hvis du har spørgsmål om, hvordan vi bruger dine oplysninger.`,
      },
    ],
  },
  {
    id: "oplysninger",
    title: "Hvilke oplysninger vi behandler",
    blocks: [
      { p: "Afhængigt af hvordan du bruger tjenesten, behandler vi:" },
      {
        ul: [
          "kontooplysninger: e-mail, brugernavn, mobilnummer (hvis du bruger SMS-service) og din adgangskode i krypteret form",
          "alarmindstillinger: dine grænser for SMS og push (fx minimum og maksimum profit), stilletider og en log over, hvilke alarmer vi har sendt til dig",
          "push-abonnement: en teknisk adresse (endpoint og nøgler), som din browser eller enhed giver os, når du tillader push-notifikationer. Den bruges kun til at sende dig beskeder",
          "abonnements- og betalingsoplysninger: hvilken plan du har, fakturaer og betalingsstatus. Selve kortoplysningerne håndteres af Stripe, og vi ser dem ikke",
          "dine data i tjenesten: registrerede spil og bankroll, indstillinger, valgte sportsgrene og alerts, samt billeder af kuponer, hvis du bruger scanningen",
          "henvendelser: dine beskeder til support og til vores AI-baserede supportchat",
          "tekniske oplysninger: IP-adresse, browser, enhed og sider, du besøger, samt cookies, som beskrevet nedenfor",
          "nyhedsbrev: din e-mailadresse, hvis du tilmelder dig",
        ],
      },
    ],
  },
  {
    id: "formaal",
    title: "Formål og retsgrundlag",
    blocks: [
      {
        ul: [
          "At levere tjenesten, oprette din konto og håndtere dit abonnement: GDPR art. 6, stk. 1, litra b (opfyldelse af aftale)",
          "At sende SMS-alerts, push-notifikationer, nyhedsbrev og markedsføring (nyheder og tilbud): GDPR art. 6, stk. 1, litra a (samtykke). Du slår SMS og push til af dig selv, og du kan trække samtykket tilbage når som helst ved at slå dem fra under Min side eller i din browser",
          "At sikre og forbedre tjenesten, forebygge misbrug og besvare henvendelser: GDPR art. 6, stk. 1, litra f (legitim interesse)",
          "At opfylde bogføringsloven og andre retlige krav: GDPR art. 6, stk. 1, litra c (retlig forpligtelse)",
        ],
      },
      {
        p: "Vi bruger ikke dine oplysninger til automatiske afgørelser, der har retsvirkning for dig eller på tilsvarende måde betydeligt påvirker dig.",
      },
    ],
  },
  {
    id: "modtagere",
    title: "Hvem vi deler oplysninger med",
    blocks: [
      {
        p: "Vi sælger ikke dine oplysninger. Vi bruger udvalgte leverandører som databehandlere, der kun må behandle data efter vores instruks og efter en databehandleraftale:",
      },
      {
        ul: [
          "Stripe til betalinger og fakturering",
          "Vercel til hosting og målinger af besøg",
          "Neon til drift af vores database",
          "udbydere af AI-modeller til at aflæse kuponer og besvare spørgsmål i supportchatten",
          "GatewayAPI (dansk udbyder med servere i EU) til at sende SMS-alarmer til det mobilnummer, du selv har oplyst. De modtager kun nummeret og beskedteksten, når en SMS sendes, og bruger det ikke til egen markedsføring",
          "din browsers push-tjeneste (fx Google, Apple eller Mozilla) til at levere push-notifikationer. De modtager kun den krypterede besked og det tekniske push-abonnement",
          "udbydere af e-mail til at sende dine beskeder",
        ],
      },
      {
        p: "Vi kan også videregive oplysninger til myndigheder, hvis vi er retligt forpligtet til det.",
      },
    ],
  },
  {
    id: "tredjelande",
    title: "Overførsel til lande uden for EU/EØS",
    blocks: [
      {
        p: "Nogle af vores leverandører har aktiviteter i USA. Overførsler sker kun, hvis der er et gyldigt overførselsgrundlag, fx EU-Kommissionens standardkontraktbestemmelser eller leverandørens certificering under EU-US Data Privacy Framework, jf. GDPR kapitel V.",
      },
    ],
  },
  {
    id: "opbevaring",
    title: "Hvor længe vi gemmer dine oplysninger",
    blocks: [
      {
        ul: [
          "Kontooplysninger og dine data gemmes, så længe du har en konto. Sletter du kontoen, sletter vi oplysningerne, medmindre vi skal gemme dem af hensyn til loven",
          "Bogføringsmateriale, fx fakturaer, gemmes i 5 år efter regnskabsårets udløb, jf. bogføringsloven",
          "Billeder af kuponer gemmer vi kun, så længe det er nødvendigt for at aflæse dem",
          "Nyhedsbrevsoplysninger gemmes, til du afmelder dig",
          "Mobilnummer og push-abonnement gemmes, til du slår SMS eller push fra, fjerner nummeret eller sletter din konto. Loggen over sendte alarme bruges til at undgå dubletter og gemmes kun kortvarigt",
          "Supporthenvendelser gemmer vi, så længe det er nødvendigt for at løse sagen og dokumentere vores svar",
        ],
      },
    ],
  },
  {
    id: "cookies",
    title: "Cookies",
    blocks: [
      {
        p: "Vi bruger cookies, der er nødvendige for, at tjenesten virker: en session-cookie, der holder dig logget ind, og en teknisk cookie, der genkender din browser og dine indstillinger, så du får samme oplevelse, når du kommer tilbage. De kræver ikke samtykke efter cookiebekendtgørelsen.",
      },
      {
        p: "Vi bruger ikke cookies til markedsføring eller til at følge dig på tværs af andre websteder. Du kan altid slette cookies i din browser, men så virker login og nogle funktioner ikke.",
      },
    ],
  },
  {
    id: "rettigheder",
    title: "Dine rettigheder",
    blocks: [
      { p: "Du har efter databeskyttelsesforordningen ret til at:" },
      {
        ul: [
          "få indsigt i, hvilke oplysninger vi behandler om dig",
          "få urigtige oplysninger rettet og i visse tilfælde få dem slettet",
          "begrænse vores behandling eller gøre indsigelse mod den",
          "få dine oplysninger udleveret i et almindeligt format (dataportabilitet)",
          "trække et samtykke tilbage. Tilbagetrækningen påvirker ikke behandling, der er sket før",
        ],
      },
      {
        p: `Kontakt os på ${COMPANY.email}, hvis du vil bruge dine rettigheder. Vi svarer senest inden for en måned.`,
      },
    ],
  },
  {
    id: "sikkerhed",
    title: "Sikkerhed",
    blocks: [
      {
        p: "Vi beskytter dine oplysninger med tekniske og organisatoriske foranstaltninger, herunder krypteret forbindelse (HTTPS), krypteret adgangskode og adgangsstyring. Opdager vi et brud på persondatasikkerheden, der indebærer risiko for dig, underretter vi Datatilsynet og dig, som loven kræver.",
      },
    ],
  },
  {
    id: "klage",
    title: "Klage til Datatilsynet",
    blocks: [
      {
        p: "Er du utilfreds med, hvordan vi behandler dine oplysninger, kan du klage til [Datatilsynet](https://www.datatilsynet.dk), Carl Jacobsens Vej 35, 2500 Valby, e-mail dt@datatilsynet.dk. Vi vil gerne have mulighed for at løse det først, så kontakt os gerne på forhånd.",
      },
    ],
  },
  {
    id: "aendringer",
    title: "Ændringer",
    blocks: [
      {
        p: "Vi opdaterer denne privatlivspolitik, når vores behandling af oplysninger ændrer sig. Datoen øverst viser, hvornår den senest er ændret. Ved væsentlige ændringer informerer vi dig direkte.",
      },
    ],
  },
];

export const ACCOUNT_FAQ: { q: string; a: string }[] = [
  {
    q: "Hvordan opsiger jeg mit abonnement?",
    a: "Du kan opsige når som helst under Min konto. Opsigelsen gælder fra udgangen af den periode, du har betalt for, og du beholder adgang indtil da. Opsiger du inden prøveperiodens udløb, trækker vi ingen penge.",
  },
  {
    q: "Kan jeg fortryde mit køb?",
    a: "Ja. Som forbruger har du 14 dages fortrydelsesret efter forbrugeraftaleloven. Skriv til os, så hjælper vi dig. Har du bedt om at starte tjenesten med det samme, betaler du forholdsmæssigt for den tid, du har brugt.",
  },
  {
    q: "Hvordan ændrer jeg min e-mail eller mit mobilnummer?",
    a: `Mobilnummer og brugernavn kan du ændre under Min konto. E-mailadressen kan du ikke ændre selv, så skriv til ${COMPANY.email}, så retter vi den.`,
  },
  {
    q: "Kan jeg få mine data slettet?",
    a: `Ja. Du har ret til at få dine oplysninger slettet, medmindre vi skal gemme dem efter loven, fx fakturaer i 5 år. Skriv til ${COMPANY.email}, så hjælper vi dig.`,
  },
  {
    q: "Hvilke oplysninger gemmer I om min betaling?",
    a: "Betalinger håndteres af Stripe. Vi gemmer ikke dine kortoplysninger og ser kun, hvilken plan du har, og om din betaling er gennemført.",
  },
];
