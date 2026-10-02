import 'server-only'
import { cache } from 'react'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { appUsers } from '@/lib/db/schema'

const USER_COOKIE = 'bt_uid'
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const getUserId = cache(async () => {
  const store = await cookies()
  const uid = store.get(USER_COOKIE)?.value
  if (!uid || !UUID_RE.test(uid)) throw new Error('Missing user session')

  const inserted = await db
    .insert(appUsers)
    .values({ id: uid })
    .onConflictDoNothing()
    .returning({ id: appUsers.id })
  return inserted[0]?.id ?? uid
})
