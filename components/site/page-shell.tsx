'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

export function PageShell({ sidebar, children }: { sidebar: ReactNode; children: ReactNode }) {
  const pathname = usePathname()

  if (pathname === '/') return <>{children}</>

  return (
    <div className="lg:flex">
      {sidebar}
      <div className="mx-auto min-h-[calc(100dvh-60px)] w-full max-w-2xl lg:mx-0 lg:min-h-0 lg:min-w-0 lg:max-w-none lg:flex-1 lg:pb-6">
        {children}
      </div>
    </div>
  )
}
