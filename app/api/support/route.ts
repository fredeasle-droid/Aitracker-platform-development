import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from 'ai'
import { getOptionalUserId } from '@/lib/user'
import { getSubscription } from '@/lib/billing'

export const maxDuration = 30

const MAX_MESSAGES = 20
const MAX_CHARS_PER_MESSAGE = 2000

const INSTRUCTIONS = `Du er BetTrackers live support-assistent på bettrackerai.com.

Om BetTracker:
- BetTracker finder SikkerBets (arbitrage/surebets): kampe hvor odds hos forskellige bookmakere tilsammen giver en garanteret gevinst uanset udfald.
- Vi scanner odds 24/7 fra 23 udvalgte bookmakere, bl.a. bwin, Unibet, LeoVegas, 888sport, MrGreen, Betinia, CampoBet, Oddset, betsson, NordicBet, betfair, bet365, Marathonbet, Cloudbet og Sportsbet.io.
- Sportsgrene: fodbold, basketball, tennis, ishockey og esport.
- "Beregn" udregner, hvor meget man skal satse på hvert udfald for at sikre profit.

Abonnementer (betales via Stripe, kan opsiges når som helst):
- Basis: 149 kr./md. SikkerBets op til 5 % margin.
- Premium: 249 kr./md. Alle SikkerBets + SMS-alerts.
- Begge har 7 dages gratis prøveperiode. Der trækkes først penge når prøveperioden slutter.

Konto ("Min side" under /konto):
- Her kan man se og ændre abonnement, opsige, se fakturaer, rette brugernavn og mobilnummer og skifte adgangskode.
- Email kan ikke ændres selv. Henvis til support@bettrackerai.com.
- Opsigelse sker på Min side og gælder fra næste betalingsperiode.

Regler for dine svar:
- Svar på det sprog brugeren skriver på (typisk dansk). Vær kort, venlig og konkret: 1-4 korte afsnit, ingen markdown-overskrifter, ingen tabeller.
- Lov aldrig gevinster. Odds kan ændre sig, og bookmakere kan begrænse konti. Nævn det kort når det er relevant.
- Opfordr til ansvarligt spil. Hvis nogen virker til at have spilleproblemer, henvis venligt til StopSpillet.dk (tlf. 70 22 28 25).
- Du kan ikke se betalingsoplysninger, ændre abonnementer eller tilbagebetale. Ved fejl i betaling, refusion eller noget du ikke kan løse: henvis til support@bettrackerai.com.
- Opfind aldrig funktioner, priser eller bookmakere der ikke står her. Er du i tvivl, så sig det og henvis til support@bettrackerai.com.`

function isValidMessages(value: unknown): value is UIMessage[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (m) =>
        m &&
        typeof m === 'object' &&
        (m.role === 'user' || m.role === 'assistant') &&
        Array.isArray(m.parts),
    )
  )
}

function textLength(message: UIMessage) {
  return message.parts.reduce((sum, part) => sum + (part.type === 'text' ? part.text.length : 0), 0)
}

async function describeUser() {
  try {
    const userId = await getOptionalUserId()
    if (!userId) return 'Brugeren er ikke logget ind.'
    const subscription = await getSubscription(userId)
    if (!subscription?.status) return 'Brugeren er logget ind, men har intet abonnement.'
    return `Brugeren er logget ind. Abonnement: ${subscription.plan ?? 'ukendt'}, status: ${subscription.status}.`
  } catch {
    return 'Login-status er ukendt.'
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const messages = body?.messages

  if (!isValidMessages(messages)) {
    return Response.json({ error: 'Ugyldig forespørgsel' }, { status: 400 })
  }

  const recent = messages.slice(-MAX_MESSAGES)
  if (recent.some((m) => textLength(m) > MAX_CHARS_PER_MESSAGE)) {
    return Response.json({ error: 'Beskeden er for lang' }, { status: 413 })
  }

  const result = streamText({
    model: 'openai/gpt-5.4-mini',
    instructions: `${INSTRUCTIONS}\n\nKontekst: ${await describeUser()}`,
    messages: await convertToModelMessages(recent),
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  })
}
