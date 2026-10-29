'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calculator, ChartPie } from 'lucide-react'
import { BarsIcon } from '@/components/icons'
import { cn } from '@/lib/utils'
import { useLocale } from '@/components/locale-provider'

const ITEMS = [
  { href: '/', key: 'home', icon: BarsIcon },
  { href: '/beregn', key: 'calc', icon: Calculator },
  { href: '/stats', key: 'stats', icon: ChartPie },
] as const

export function BottomNav() {
  const pathname = usePathname()
  const { t } = useLocale()

  return (
    <nav
      aria-label="Hovedmenu"
      className="fixed inset-x-0 bottom-0 z-40 lg:hidden border-t border-[#193451] bg-[#050d1b]/95 px-2 pt-2 shadow-[0_-10px_30px_-20px_#159cff] backdrop-blur-xl pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto flex max-w-2xl items-stretch gap-1.5 px-1">
        {ITEMS.map(({ href, key, icon: Icon }) => {
          const label = t(key)
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative flex min-h-14 flex-col items-center justify-center gap-1 px-2 py-1.5 text-[12px] font-bold tracking-[0.01em] transition-all',
                  active ? 'text-[#65c1ff] drop-shadow-[0_0_8px_rgba(21,156,255,0.75)]' : 'text-[#71839d] hover:text-[#d7e8fa]',
                )}
              >
                <Icon
                  className={cn('size-5.5 transition-transform', active ? 'scale-105 text-[#65c1ff] drop-shadow-[0_0_7px_rgba(21,156,255,0.85)]' : 'text-[#6b7894]')}
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
