import { Trophy } from 'lucide-react'

export function CalcHero({ league, kickoff }: { league: string; kickoff: string }) {
  return (
    <section className="sb-panel panel-glow relative overflow-hidden rounded-3xl">
      <picture>
        <source media="(max-width: 639px)" srcSet="/sb/hero-football-mobile.jpg" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/sb/hero-football.jpg"
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[70%_25%] max-sm:object-[60%_20%]"
        />
      </picture>
      <div className="sb-hero-scrim absolute inset-0" aria-hidden="true" />
      <div className="relative flex min-h-[200px] flex-col justify-center gap-3 p-6 sm:min-h-[230px] sm:p-8 lg:min-h-[245px]">
        <h1 className="text-shadow-hero text-balance text-[40px] font-extrabold leading-none tracking-tight sm:text-[56px] lg:text-[64px]">
          Beregn <span className="text-gradient">indsats</span>
        </h1>
        <p className="text-pretty text-[15px] leading-relaxed text-foreground/90 sm:text-[19px]">
          Find den rigtige indsats og få garanteret profit.
        </p>
        <p className="glass-pill flex w-fit max-w-full items-center gap-2.5 rounded-full px-4 py-2 text-[13px] font-medium sm:text-[15px]">
          <Trophy className="h-4 w-4 shrink-0 text-cyan" aria-hidden="true" />
          <span className="truncate">
            {league} · {kickoff}
          </span>
        </p>
      </div>
    </section>
  )
}
