// Default opening time: 24 hours after the "closed for rebuild" page was set up.
// Override without a code change by setting MAINTENANCE_OPENS_AT (ISO 8601) in the project env vars.
const DEFAULT_OPENS_AT = '2026-11-22T07:15:46Z'

export const MAINTENANCE_BYPASS_COOKIE = 'bt_preview'

export function getOpensAt(): number {
  const parsed = Date.parse(process.env.MAINTENANCE_OPENS_AT || DEFAULT_OPENS_AT)
  return Number.isNaN(parsed) ? Date.parse(DEFAULT_OPENS_AT) : parsed
}

// Only the live production deployment is closed. v0 preview and Vercel preview deployments stay open
// so the new design can keep being built and reviewed.
export function isMaintenanceActive(now = Date.now()): boolean {
  return process.env.VERCEL_ENV === 'production' && now < getOpensAt()
}
