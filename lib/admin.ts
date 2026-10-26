import 'server-only'
import { cache } from 'react'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

export const getAdminState = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return 'signed-out' as const
  // Kilder is an authenticated owner workspace: the signed-in BetTracker account can manage its feeds.
  return 'admin' as const
})
