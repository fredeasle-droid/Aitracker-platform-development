'use server'

import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { hasActiveSubscription } from '@/lib/billing'

function isAdminEmail(email: string) {
  const admins = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
  return admins.includes(email.toLowerCase())
}

export async function getHasOddsAccess() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return false
  if (session.user.email && isAdminEmail(session.user.email)) return true
  try {
    return await hasActiveSubscription(session.user.id)
  } catch (error) {
    console.error('[access] subscription lookup failed', error)
    return false
  }
}
