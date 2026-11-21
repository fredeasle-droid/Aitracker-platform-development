import type { Metadata } from 'next'
import { Countdown } from '@/components/maintenance/countdown'
import { getOpensAt } from '@/lib/maintenance'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Lukket under ombygning | BetTrackerAI',
  description: 'BetTrackerAI bygges om og åbner igen snart.',
  robots: { index: false, follow: false },
}

export default function ClosedPage() {
  const opensAt = getOpensAt()
  const opensLabel = new Intl.DateTimeFormat('da-DK', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Europe/Copenhagen',
  }).format(opensAt)

  return (
    <main
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background px-5 py-12 text-center"
      style={{
        backgroundImage:
          'linear-gradient(to bottom, var(--background) 0%, color-mix(in oklab, var(--background) 82%, transparent) 50%, var(--background) 100%), url(/beregn/stadium.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center gap-8">
        <p className="text-3xl font-black tracking-tight text-foreground">
          BetTracker<span className="text-primary-glow">AI</span>
        </p>

        <span className="rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary-glow">
          Lukket under ombygning
        </span>

        <div className="flex flex-col gap-4">
          <h1 className="text-balance text-4xl font-black leading-tight text-foreground sm:text-6xl">
            Vi bygger en helt ny BetTrackerAI
          </h1>
          <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Nyt design, hurtigere surebets og en bedre beregner. Vi åbner igen om:
          </p>
        </div>

        <Countdown opensAt={opensAt} />

        <p className="text-sm leading-relaxed text-muted-foreground">
          Åbner <span className="font-medium text-foreground">{opensLabel}</span>
        </p>
      </div>
    </main>
  )
}
