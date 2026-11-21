'use server'

import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { hasActiveSubscription } from '@/lib/billing'
import { isPreviewTestEnvironment } from '@/lib/test-access'

export async function getHasOddsAccess() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return false
  if (isPreviewTestEnvironment()) return true
  try {
    return await hasActiveSubscription(session.user.id)
  } catch (error) {
    console.error('[access] subscription lookup failed', error)
    return false
  }
}
