import { generateText, Output } from 'ai'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getOptionalUserId } from '@/lib/user'
import { BOOKMAKERS } from '@/lib/regnskab/surebet'

export const maxDuration = 60

const MAX_IMAGE_CHARS = 8_000_000
const DATA_URL = /^data:image\/(png|jpe?g|webp);base64,[A-Za-z0-9+/=]+$/

const side = z.object({
  bookmaker: z.string().nullable(),
  odds: z.number().nullable(),
  stake: z.number().nullable(),
})

const schema = z.object({
  event: z.string().nullable(),
  date: z.string().nullable(),
  coupon1: side,
  coupon2: side,
})

const INSTRUCTIONS = `Du læser to screenshots af væddemålskuponer (betting slips), der tilsammen udgør én surebet.
Billede 1 er kupon 1, billede 2 er kupon 2. De to kuponer er normalt fra forskellige bookmakere og dækker modsatte udfald af samme kamp.
For hver kupon: find bookmakeren (vælg præcis én af ${BOOKMAKERS.join(', ')} eller "Andet"), decimal-odds og indsatsen i kroner.
Danske tal bruger komma som decimaltegn (2,10 betyder 2.10). Returnér tal som almindelige decimaltal.
event er kampens navn, f.eks. "Arsenal – Chelsea". date er kampens eller kuponens dato som YYYY-MM-DD.
Brug null for alt, du ikke kan se tydeligt. Gæt aldrig.`

const toBookmaker = (name: string | null) =>
  BOOKMAKERS.find((bm) => bm.toLowerCase() === (name ?? '').trim().toLowerCase()) ?? null

export async function POST(request: Request) {
  const userId = await getOptionalUserId()
  if (!userId) return NextResponse.json({ ok: false, message: 'Du skal være logget ind' }, { status: 401 })

  let images: unknown
  try {
    images = ((await request.json()) as { images?: unknown }).images
  } catch {
    return NextResponse.json({ ok: false, message: 'Ugyldig forespørgsel' }, { status: 400 })
  }
  if (
    !Array.isArray(images) ||
    images.length !== 2 ||
    !images.every((img) => typeof img === 'string' && img.length <= MAX_IMAGE_CHARS && DATA_URL.test(img))
  ) {
    return NextResponse.json({ ok: false, message: 'Begge billeder skal være gyldige og ikke for store' }, { status: 400 })
  }

  try {
    const { output } = await generateText({
      model: 'google/gemini-3.8-flash',
      system: INSTRUCTIONS,
      output: Output.object({ schema }),
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Kupon 1:' },
            { type: 'image', image: images[0] as string },
            { type: 'text', text: 'Kupon 2:' },
            { type: 'image', image: images[1] as string },
          ],
        },
      ],
    })
    const sides = [output.coupon1, output.coupon2].map((s) => ({
      bookmaker: toBookmaker(s.bookmaker),
      odds: s.odds,
      stake: s.stake,
    }))
    if (sides.every((s) => s.odds === null)) {
      return NextResponse.json({
        ok: false,
        message: 'Vi kunne ikke finde odds på billederne. Prøv med tydeligere screenshots af kuponerne.',
      })
    }
    return NextResponse.json({ ok: true, reading: { event: output.event, date: output.date, sides } })
  } catch (error) {
    console.error('[regnskab] analyse failed', error)
    return NextResponse.json({ ok: false, message: 'Analysen mislykkedes. Prøv igen om lidt.' })
  }
}
