import Link from '@/components/localized-link'
import { ChevronRight, Database, LineChart, MessagesSquare, Send, Wrench } from 'lucide-react'
import { Card } from './ui'

const TOOLS = [
  { href: '/admin/seo/forum', label: 'Forum-radar', description: 'Nye tråde og svarforslag – tjek hver morgen', icon: MessagesSquare },
  { href: '/admin/seo', label: 'SEO-dashboard', description: 'Søgeord, klik og placeringer fra Google', icon: LineChart },
  { href: '/telegram', label: 'Telegram', description: 'Styr den automatiske Telegram-kanal', icon: Send },
  { href: '/kilder', label: 'Kilder', description: 'Odds-feeds og datakilder', icon: Database },
]

export function OwnerToolsCard() {
  return (
    <Card title="Ejer-værktøjer" icon={<Wrench />}>
      <ul className="flex flex-col gap-2">
        {TOOLS.map(({ href, label, description, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className="flex min-h-14 items-center gap-3 rounded-xl border border-[#344861] bg-[#0a1725] px-3 py-2 hover:bg-[#102744]"
            >
              <Icon className="size-5 shrink-0 text-[#4db5ff]" aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-[#e6ecf7]">{label}</span>
                <span className="block truncate text-[13px] text-[#a8c0d8]">{description}</span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-[#7f95b0]" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  )
}
