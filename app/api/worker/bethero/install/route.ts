import { installScript } from '@/lib/bethero-worker'
import { SITE_URL } from '@/lib/site'

export const dynamic = 'force-dynamic'

export function GET() {
  return new Response(installScript(SITE_URL), { headers: { 'Content-Type': 'text/x-shellscript; charset=utf-8', 'Cache-Control': 'no-store' } })
}
