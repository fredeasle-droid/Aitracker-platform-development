import { WORKER_PACKAGE_JSON, WORKER_SCRIPT } from '@/lib/bethero-worker'

export const dynamic = 'force-dynamic'

export function GET(request: Request) {
  const wantsPackage = new URL(request.url).searchParams.get('file') === 'package'
  return new Response(wantsPackage ? WORKER_PACKAGE_JSON : WORKER_SCRIPT, {
    headers: { 'Content-Type': wantsPackage ? 'application/json' : 'text/javascript; charset=utf-8', 'Cache-Control': 'no-store' },
  })
}
