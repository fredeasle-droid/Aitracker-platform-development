import { installScript, isValidPairCode, workerToken } from '@/lib/bethero-worker'
import { SITE_URL } from '@/lib/site'

export const dynamic = 'force-dynamic'

export async function GET(_request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  if (!isValidPairCode(code)) {
    return new Response('echo "Koden er udløbet eller forkert. Hent en ny kode på /kilder."; exit 1\n', {
      status: 404,
      headers: { 'Content-Type': 'text/x-shellscript; charset=utf-8', 'Cache-Control': 'no-store' },
    })
  }
  return new Response(installScript(SITE_URL, workerToken()), {
    headers: { 'Content-Type': 'text/x-shellscript; charset=utf-8', 'Cache-Control': 'no-store' },
  })
}
