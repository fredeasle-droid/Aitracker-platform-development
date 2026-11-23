import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const target = /^\d{1,12}$/.test(id) ? `/beregn?id=${id}` : '/surebets'
  return NextResponse.redirect(new URL(target, request.url), 307)
}
