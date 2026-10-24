import 'server-only'
import { cache } from 'react'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

export const getAdminState = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return 'signed-out' as const
  const admins = (process.env.ADMIN_EMAILS ?? '').split(',').map((email) => email.trim().toLowerCase()).filter(Boolean)
  if (admins.length === 0) return 'not-configured' as const
  return admins.includes(session.user.email.toLowerCase()) ? ('admin' as const) : ('forbidden' as const)
})
