'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { canonicalPathname } from '@/lib/i18n'

const STANDALONE_PATHS = ['/surebets', '/beregn', '/lukket']

export function isStandalonePath(pathname: string) {
  const canonical = canonicalPathname(pathname)
  return STANDALONE_PATHS.some((path) => canonical === path || canonical.startsWith(`${path}/`))
}

export function ChromeGate({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  if (isStandalonePath(pathname)) return null
  return <>{children}</>
}
