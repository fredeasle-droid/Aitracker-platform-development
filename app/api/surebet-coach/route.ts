import { generateText } from 'ai'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const messages = Array.isArray(body.messages) ? body.messages : []

  const result = await generateText({
    model: 'openai/gpt-4o-mini',
    system: `Du er SikkerBets' rolige danske surebet-coach. Forklar kort og pædagogisk på dansk. Hjælp brugeren trin for trin med at forstå et surebet, beregne indsatser og opdage fejl. Giv aldrig garanti for gevinst, og mind om oddsændringer, limits og bookmakerregler. Du må ikke placere væddemål automatisk. Start altid med det konkrete næste trin.`,
    messages,
  })

  return Response.json({ text: result.text })
}
