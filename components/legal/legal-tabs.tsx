'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const PAGES = [
  { href: '/faq', label: 'FAQ' },
  { href: '/kontakt', label: 'Kontakt os' },
  { href: '/vilkaar', label: 'Vilkår & Betingelser' },
  { href: '/privatlivspolitik', label: 'Privatlivspolitik' },
]

export function LegalTabs() {
  const pathname = usePathname()

  return (
    <nav aria-label="Support" className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden">
      <ul className="flex w-max gap-2 lg:w-auto lg:flex-wrap">
        {PAGES.map(({ href, label }) => {
          const active = pathname === href
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`flex min-h-11 items-center rounded-full border px-4 text-[14px] font-medium whitespace-nowrap transition-colors ${
                  active
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card/60 text-foreground/80 hover:border-primary/60 hover:text-foreground'
                }`}
              >
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
