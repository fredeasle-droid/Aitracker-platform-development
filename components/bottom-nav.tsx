'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChartPie, Gift } from 'lucide-react'
import { BarsIcon } from '@/components/icons'
import { cn } from '@/lib/utils'

const ITEMS = [
  { href: '/', label: 'SikkerBets', icon: BarsIcon },
  { href: '/stats', label: 'Stats', icon: ChartPie },
  { href: '/bonus', label: 'Bonus', icon: Gift },
] as const

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Hovedmenu"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#193451] bg-[#050d1b]/95 px-2 pt-2 shadow-[0_-10px_30px_-20px_#159cff] backdrop-blur-xl pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto flex max-w-2xl items-stretch gap-1.5 rounded-2xl border border-[#102945] bg-[#071524]/90 p-1.5">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 text-[12px] font-bold tracking-[0.01em] transition-all',
                  active ? 'bg-[#102f4d] text-[#55b7ff] shadow-[inset_0_0_0_1px_#1d6594,0_4px_14px_-8px_#159cff]' : 'text-[#71839d] hover:bg-[#0b2136] hover:text-[#d7e8fa]',
                )}
              >
                <Icon
                  className={cn('size-5.5 transition-transform', active ? 'scale-105 text-[#55b7ff]' : 'text-[#6b7894]')}
                  strokeWidth={Icon === BarsIcon ? undefined : 2.25}
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
