import 'server-only'

export function isAuthorizedScan(request: Request) {
  const secret = process.env.CRON_SECRET
  if (secret) return request.headers.get('authorization') === `Bearer ${secret}`
  return process.env.VERCEL_ENV !== 'production'
}
