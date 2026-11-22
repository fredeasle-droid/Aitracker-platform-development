'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileText, HelpCircle, Mail, ShieldCheck } from 'lucide-react'

const PAGES = [
  { href: '/faq', label: 'FAQ', icon: HelpCircle },
  { href: '/kontakt', label: 'Kontakt os', icon: Mail },
  { href: '/vilkaar', label: 'Vilkår & Betingelser', icon: FileText },
  { href: '/privatlivspolitik', label: 'Privatlivspolitik', icon: ShieldCheck },
]

export function LegalTabs() {
  const pathname = usePathname()

  return (
    <nav aria-label="Support" className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden">
      <ul className="flex w-max gap-2 lg:w-auto lg:flex-wrap">
        {PAGES.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`flex min-h-11 items-center gap-2 rounded-full border px-4 text-[14px] font-semibold whitespace-nowrap transition-all ${
                  active
                    ? 'border-primary bg-primary text-primary-foreground shadow-[0_0_24px_-6px] shadow-primary/80'
                    : 'border-border bg-card/60 text-foreground/80 hover:border-primary/60 hover:text-foreground'
                }`}
              >
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
