import 'server-only'

export function isAuthorizedScan(request: Request) {
  const secret = process.env.CRON_SECRET
  if (secret) return request.headers.get('authorization') === `Bearer ${secret}`
  if (process.env.VERCEL_ENV !== 'production') return true
  // Without CRON_SECRET the user-agent is spoofable, so refreshOpportunities throttles runs.
  return request.headers.get('user-agent')?.startsWith('vercel-cron/') ?? false
}
