import { generateText, Output } from 'ai'
import { NextResponse } from 'next/server'
import { getOptionalUserId } from '@/lib/user'
import { MAX_COUPON_BETS, couponSchema } from '@/lib/coupon'

export const maxDuration = 60

const MAX_IMAGE_CHARS = 6_000_000
const DATA_URL = /^data:image\/(png|jpe?g|webp);base64,[A-Za-z0-9+/=]+$/

const INSTRUCTIONS = `You read screenshots and photos of betting slips (kuponer) from Danish and international bookmakers.
Extract every bet on the slip. Rules:
- Odds are decimal. Convert fractional or American odds to decimal if needed.
- Amounts are DKK numbers without currency symbols or thousand separators ("1.250,50 kr" -> 1250.5).
- An accumulator / kombination with several legs is ONE bet: join the legs in "match" and "selection" separated by " + ", and use the combined odds.
- status: "won" if the slip says vundet/won/udbetalt, "lost" if tabt/lost, otherwise "open".
- Never invent data. Use empty string, 0 or null when a value is not visible.
- If the image is not a betting slip, return an empty bets array.`

export async function POST(request: Request) {
  const userId = await getOptionalUserId()
  if (!userId) return NextResponse.json({ error: 'Du skal være logget ind' }, { status: 401 })

  let image: unknown
  try {
    image = ((await request.json()) as { image?: unknown }).image
  } catch {
    return NextResponse.json({ error: 'Ugyldig forespørgsel' }, { status: 400 })
  }
  if (typeof image !== 'string' || image.length > MAX_IMAGE_CHARS || !DATA_URL.test(image)) {
    return NextResponse.json({ error: 'Billedet er ugyldigt eller for stort' }, { status: 400 })
  }

  try {
    const { output } = await generateText({
      model: 'google/gemini-3.8-flash',
      system: INSTRUCTIONS,
      output: Output.object({ schema: couponSchema }),
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Læs denne kupon og udtræk alle væddemål.' },
            { type: 'image', image },
          ],
        },
      ],
    })
    return NextResponse.json({ bets: output.bets.slice(0, MAX_COUPON_BETS) })
  } catch (error) {
    console.error('[coupon] parse failed', error)
    return NextResponse.json({ error: 'Kunne ikke læse kuponen. Prøv et skarpere billede.' }, { status: 502 })
  }
}
