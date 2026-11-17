'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

const STANDALONE_PATHS = ['/surebets']

export function isStandalonePath(pathname: string) {
  return STANDALONE_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))
}

export function ChromeGate({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  if (isStandalonePath(pathname)) return null
  return <>{children}</>
}
