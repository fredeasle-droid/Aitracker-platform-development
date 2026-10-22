'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChartPie } from 'lucide-react'
import { BarsIcon } from '@/components/icons'
import { cn } from '@/lib/utils'

const ITEMS = [
  { href: '/', label: 'SikkerBets', icon: BarsIcon },
  { href: '/stats', label: 'Stats', icon: ChartPie },
] as const

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Hovedmenu"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-[#060d1c]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md"
    >
      <ul className="mx-auto flex max-w-2xl items-stretch">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex min-h-16 flex-col items-center justify-center gap-1 py-2 text-sm font-semibold transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon
                  className={cn('size-7', active ? 'text-primary' : 'text-[#6b7894]')}
                  strokeWidth={Icon === BarsIcon ? undefined : 2}
                  fill={Icon === ChartPie ? 'currentColor' : Icon === BarsIcon ? 'currentColor' : 'none'}
                />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
