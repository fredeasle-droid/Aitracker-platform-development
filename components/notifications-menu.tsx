'use client'

import Link from 'next/link'
import { Bell, ChevronRight } from 'lucide-react'
import { Popover } from '@/components/menu'
import { formatPct } from '@/lib/odds'

type Alert = { id: number; title: string; market: string; margin: number; kickoff: string }

export function NotificationsMenu({ alerts }: { alerts: Alert[] }) {
  return (
    <Popover
      align="right"
      label={`Notifikationer, ${alerts.length} nye`}
      triggerClassName="relative flex size-11 items-center justify-center rounded-full text-foreground hover:bg-accent"
      panelClassName="w-[min(20rem,calc(100vw-2rem))]"
      trigger={
        <>
          <Bell className="size-7" strokeWidth={1.8} />
          {alerts.length > 0 && (
            <span className="absolute right-2 top-2 size-2.5 rounded-full bg-success ring-2 ring-background" />
          )}
        </>
      }
    >
      {(close) => (
        <div>
          <p className="px-3 pb-2 pt-2 text-sm font-semibold">Høj margin lige nu</p>
          {alerts.length === 0 ? (
            <p className="px-3 pb-3 text-sm text-muted-foreground">Ingen SikkerBets over 4% lige nu.</p>
          ) : (
            <ul>
              {alerts.map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/beregn?id=${a.id}`}
                    onClick={close}
                    className="flex min-h-14 items-center gap-3 rounded-xl px-3 py-2 hover:bg-accent"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{a.title}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {a.market} · {a.kickoff}
                      </span>
                    </span>
                    <span className="text-sm font-bold text-success">{formatPct(a.margin)}</span>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Popover>
  )
}
