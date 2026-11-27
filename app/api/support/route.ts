import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from 'ai'
import { getOptionalUserId } from '@/lib/user'
import { getSubscription } from '@/lib/billing'
import { getServerLocale } from '@/lib/locale-server'
import { LOCALES, type Locale } from '@/lib/i18n'
import { formatMoney } from '@/lib/currency'
import { localHelp } from '@/lib/responsible-help'
import { getBonusOffers } from '@/lib/bonus-offers'

export const maxDuration = 30

const MAX_MESSAGES = 20
const MAX_CHARS_PER_MESSAGE = 2000

const DANISH_INSTRUCTIONS = `Du er BetTrackers live support-assistent på bettrackerai.com.

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

function marketInstructions(locale: Locale) {
  if (locale === 'da') return DANISH_INSTRUCTIONS
  const language = LOCALES[locale].label
  const help = localHelp(locale)
  const localNames = getBonusOffers(locale).map((o) => o.bookmaker)
  return `You are the live support assistant of BetTracker (bettrackerai.com), a service for the ${language}-language market.

About BetTracker:
- BetTracker finds surebets (arbitrage): matches where the odds at different bookmakers together give a guaranteed profit whatever the outcome.
- Odds are scanned 24/7 from a selection of licensed bookmakers. Never list bookmakers yourself; if the user asks which ones, say the selection is shown in the app and only mention locally licensed operators such as ${localNames.join(', ')}.
- Sports: football, basketball, tennis, ice hockey and esports.
- The calculator works out how much to stake on each outcome to lock in profit.

Subscriptions (paid via Stripe, cancel any time):
- Basis: ${formatMoney(149, locale)}/month. Surebets up to 5% margin.
- Premium: ${formatMoney(249, locale)}/month. All surebets plus SMS alerts.
- Both have a 7-day free trial. Nothing is charged until the trial ends.

Account (the account page in the site menu):
- Users can view or change their plan, cancel, see invoices, edit username and mobile number, and change password.
- Email cannot be changed by the user; refer to support@bettrackerai.com.
- Cancellation applies from the next billing period.

Rules for your answers:
- Always answer in the language the user writes in. If they have not written yet, use ${language}. Be short, friendly and concrete: 1-4 short paragraphs, no markdown headings, no tables.
- Never promise winnings. Odds can change and bookmakers can limit accounts; mention it briefly when relevant.
- Encourage responsible gambling. ${help ? `${help.text} ${help.links.map((l) => l.label).join(', ')}.` : 'Refer to the local help line and self-exclusion service in the user\'s own country.'}
- Never mention Denmark, Danish bookmakers, Danish law, StopSpillet, ROFUS or "kr." Everything must fit the user's own country and currency.
- You cannot see payment details, change plans or refund. For payment errors, refunds or anything you cannot solve, refer to support@bettrackerai.com.
- Never invent features, prices or bookmakers. If unsure, say so and refer to support@bettrackerai.com.`
}

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
    instructions: `${marketInstructions(await getServerLocale())}\n\nContext: ${await describeUser()}`,
    messages: await convertToModelMessages(recent),
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  })
}
