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
      className="fixed inset-x-0 bottom-0 z-40 lg:hidden border-t border-[#193451] bg-[#050d1b]/95 pt-2.5 backdrop-blur-xl pb-[max(env(safe-area-inset-bottom),22px)]"
    >
      <ul className="relative left-1/2 flex w-[426px] -translate-x-1/2 items-stretch">
        {ITEMS.map(({ href, key, icon: Icon }) => {
          const label = t(key)
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <li key={href} className="w-[142px] shrink-0">
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative flex flex-col items-center justify-center gap-[3px] text-[9.5px] font-semibold transition-all',
                  active ? 'text-[#3d9bff]' : 'text-[#71839d] hover:text-[#d7e8fa]',
                )}
              >
                <Icon
                  className={cn('size-[17px] transition-transform', active ? 'text-[#3d9bff]' : 'text-[#6b7894]')}
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
