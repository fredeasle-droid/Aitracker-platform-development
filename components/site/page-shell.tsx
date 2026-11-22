'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { isStandalonePath } from '@/components/site/chrome-gate'
import { AuthActions } from '@/components/site/global-header'

export function PageShell({ sidebar, children }: { sidebar: ReactNode; children: ReactNode }) {
  const pathname = usePathname()

  if (pathname === '/' || isStandalonePath(pathname)) return <>{children}</>

  const scaled = pathname === '/stats' || pathname === '/konto'

  return (
    <div className="lg:flex">
      {sidebar}
      <div className="mx-auto min-h-[calc(100dvh-60px)] w-full max-w-2xl lg:mx-0 lg:min-h-0 lg:min-w-0 lg:max-w-none lg:flex-1 lg:pb-6 lg:pl-10">
        <div className="bt-theme hidden justify-end px-8 pt-4 lg:flex">
          <AuthActions />
        </div>
        {scaled ? <div className="desk-zoom">{children}</div> : children}
      </div>
    </div>
  )
}
