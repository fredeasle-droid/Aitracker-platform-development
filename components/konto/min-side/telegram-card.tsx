import { BellRing, ExternalLink, Send, Sparkles, Trophy } from 'lucide-react'
import { Card, primaryButton, secondaryButton } from '@/components/konto/min-side/ui'

const perks = [
  { icon: BellRing, text: 'Få push-alarmer direkte i Telegram, også når du ikke er på siden' },
  { icon: Sparkles, text: 'Unikke surebets, som ikke vises på hjemmesiden' },
  { icon: Trophy, text: 'Følg og deltag i vores 365 dages challenge' },
]

export function TelegramCard() {
  const url = process.env.NEXT_PUBLIC_TELEGRAM_URL?.trim() || 'https://t.me/bettrackerai'

  return (
    <Card title="Følg os på Telegram" icon={<Send />}>
      <ul className="space-y-3">
        {perks.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-start gap-3 text-[14px] leading-5 text-[#c8d6e6]">
            <span aria-hidden="true" className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#0b2945] text-[#4db5ff]">
              <Icon className="size-4" />
            </span>
            <span className="pt-1">{text}</span>
          </li>
        ))}
      </ul>

      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className={`${primaryButton} mt-4`}>
          Åbn Telegram-kanalen <ExternalLink className="size-4" aria-hidden="true" />
        </a>
      ) : (
        <button type="button" disabled className={`${secondaryButton} mt-4`}>
          Link kommer snart
        </button>
      )}
    </Card>
  )
}
