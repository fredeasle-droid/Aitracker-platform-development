import 'server-only'
import { cache } from 'react'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

export const getUserId = cache(async () => {
  const userId = await getOptionalUserId()
  if (!userId) throw new Error('Mangler login')
  return userId
})

export const getOptionalUserId = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user?.id ?? null
})
