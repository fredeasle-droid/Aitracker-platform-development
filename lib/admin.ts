import 'server-only'
import { cache } from 'react'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

// Stricter than getAdminState: only emails listed in ADMIN_EMAILS may control the Telegram poster.
export const getOwnerState = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return 'signed-out' as const
  const owners = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
  return session.user.email && owners.includes(session.user.email.toLowerCase()) ? ('owner' as const) : ('forbidden' as const)
})

export const getAdminState = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return 'signed-out' as const
  // Kilder is an authenticated owner workspace: the signed-in BetTracker account can manage its feeds.
  return 'admin' as const
})
