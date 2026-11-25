import { CHALLENGE, PRICING, RESPONSIBLE, yearlyDiscount } from "./data";

/** Questions and answers shown in the FAQ. Shared by the page and the support chat. */
export const FAQ_ENTRIES: { q: string; a: string }[] = [
  {
    q: "Hvad er et surebet?",
    a: "Et surebet opstår, når bookmakerne har så forskellige odds på den samme kamp, at du kan dække alle udfald og stadig ende i plus. Marginen viser, hvor stor gevinsten er i procent af din samlede indsats.",
  },
  {
    q: "Er surebets helt uden risiko?",
    a: "Når alle indsatser er placeret til de viste odds, er resultatet låst. Risikoen ligger i, at odds kan nå at ændre sig, før du har placeret alle spil, eller at en bookmaker begrænser din konto. Derfor viser vi altid, hvornår et surebet sidst er opdateret.",
  },
  {
    q: "Hvordan fungerer den gratis prøveperiode?",
    a: `Du får ${PRICING.trialDays} dage gratis med fuld adgang til BetTrackerAI Pro. Du kan opsige når som helst i prøveperioden.`,
  },
  {
    q: "Hvad koster BetTrackerAI Pro?",
    a: `${PRICING.monthly} kr./md ved månedlig betaling eller ${PRICING.yearly} kr./md ved årlig betaling – en besparelse på ${yearlyDiscount()}%. Du kan betale med Visa, Mastercard, MobilePay eller bankoverførsel.`,
  },
  {
    q: "Hvilke bookmakere sammenligner I?",
    a: "Vi sammenligner odds fra danske og internationale bookmakere, bl.a. Danske Spil, bet365, Unibet, LeoVegas, Betano og Pinnacle.",
  },
  {
    q: "Hvordan får jeg besked om nye surebets?",
    a: "Du kan følge med direkte på platformen, få besked på SMS med vores SMS-service eller følge vores Telegram-kanal.",
  },
  {
    q: "Hvem kan bruge BetTrackerAI?",
    a: `Du skal være fyldt ${RESPONSIBLE.minAge} år. Spil altid ansvarligt – har du brug for hjælp, kan du ringe til StopSpillet på ${RESPONSIBLE.stopSpilletPhone} eller udelukke dig selv fra spil via ROFUS.nu.`,
  },
];

/** Limits on what visitors can send to the support chat. */
export const CHAT_LIMITS = { maxMessages: 30, maxChars: 800 } as const;

/** Instructions for the support chat: who it is, what it knows, and what it must never do. */
export function supportInstructions() {
  const faq = FAQ_ENTRIES.map((e) => `- ${e.q}\n  ${e.a}`).join("\n");
  return `Du er BetTrackerAI's venlige kundesupport på hjemmesiden. Svar på samme sprog som den besøgende (normalt dansk), kort og klart: 1-4 sætninger, ingen overskrifter.

Om BetTrackerAI:
- BetTrackerAI Pro er en surebet-scanner, der sammenligner odds hos mange bookmakere i realtid og viser surebets med margin i procent.
- Pris: ${PRICING.monthly} kr./md (månedlig) eller ${PRICING.yearly} kr./md ved årlig betaling (spar ${yearlyDiscount()}%). ${PRICING.trialDays} dages gratis prøveperiode med fuld adgang.
- Vi kører en offentlig 365-dages surebet-challenge: dag ${CHALLENGE.day}, samlet afkast ${CHALLENGE.totalReturn}%, ${CHALLENGE.surebets} surebets, gennemsnitlig margin ${CHALLENGE.avgMargin}%.
- Besked om nye surebets: på platformen, via SMS-service eller vores Telegram-kanal.

Ofte stillede spørgsmål (brug disse fakta):
${faq}

Regler:
- Opfind aldrig priser, funktioner, kontaktoplysninger, garantier eller resultater, der ikke står ovenfor. Ved du det ikke, så sig det ærligt og foreslå at prøve de ${PRICING.trialDays} gratis dage.
- Lov aldrig sikker eller garanteret gevinst. Nævn risici ærligt (odds kan ændre sig, bookmakere kan begrænse konti).
- Giv ikke tips til konkrete kampe eller spil, og opfordr aldrig til at spille mere.
- Kun for personer over ${RESPONSIBLE.minAge} år. Hvis nogen virker under ${RESPONSIBLE.minAge} eller nævner spilleproblemer, så henvis venligt til hjælp: i Danmark StopSpillet på ${RESPONSIBLE.stopSpilletPhone} og ROFUS.nu, ellers hjælpelinjen og selvudelukkelsen i den besøgendes eget land. Sig aldrig, at supporten kun er på dansk.
- Hold dig til emner om BetTrackerAI, surebets og ansvarligt spil; afvis andre emner høfligt.`;
}
