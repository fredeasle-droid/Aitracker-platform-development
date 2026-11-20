import { Trophy } from 'lucide-react'

export function CalcHeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-[360px] overflow-hidden lg:block" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/sb/hero-football.jpg"
        alt=""
        fetchPriority="high"
        className="absolute inset-y-0 right-0 h-full w-[75%] object-cover object-[70%_25%]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 via-35% to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  )
}

export function CalcHero({ league, kickoff }: { league: string; kickoff: string }) {
  return (
    <section className="relative overflow-hidden rounded-3xl lg:overflow-visible lg:rounded-none">
      <div className="sb-panel panel-glow absolute inset-0 rounded-3xl lg:hidden" aria-hidden="true" />
      <picture className="lg:hidden">
        <source media="(max-width: 639px)" srcSet="/sb/hero-football-mobile.jpg" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/sb/hero-football.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-[70%_25%] max-sm:object-[60%_20%]"
        />
      </picture>
      <div className="sb-hero-scrim absolute inset-0 lg:hidden" aria-hidden="true" />
      <div className="relative flex min-h-[200px] flex-col justify-center gap-3 p-6 sm:min-h-[230px] sm:p-8 lg:min-h-[250px] lg:px-8 lg:py-6">
        <h1 className="text-shadow-hero text-balance text-[40px] font-extrabold leading-none tracking-tight sm:text-[56px] lg:text-[66px]">
          Beregn <span className="text-cyan">indsats</span>
        </h1>
        <p className="text-pretty text-[15px] leading-relaxed text-foreground/90 sm:text-[19px] lg:text-[22px] lg:text-foreground">
          Find den rigtige indsats og få garanteret profit.
        </p>
        <p className="glass-pill flex w-fit max-w-full items-center gap-2.5 rounded-full px-4 py-2 text-[13px] font-medium sm:text-[15px] lg:mt-1 lg:border lg:border-primary/60 lg:px-6 lg:py-2.5 lg:text-[17px]">
          <Trophy className="h-4 w-4 shrink-0 text-cyan lg:h-5 lg:w-5 lg:text-foreground" aria-hidden="true" />
          <span className="truncate">
            {league} · {kickoff}
          </span>
        </p>
      </div>
    </section>
  )
}
