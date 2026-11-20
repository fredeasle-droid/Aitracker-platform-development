import { Trophy } from 'lucide-react'

export function LeagueMark({ league, className }: { league: string; className?: string }) {
  if (/premier league/i.test(league)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src="/beregn/pl.png" alt="" className={className} />
  }
  return <Trophy className={className} strokeWidth={2} aria-hidden="true" />
}

/** Night-stadium backdrop with the striker; sits behind the top bar and hero (desktop canvas). */
export function CalcHeroBackdrop() {
  return (
    <div className="pointer-events-none relative h-[460px] overflow-hidden" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/beregn/stadium.jpg"
        alt=""
        className="absolute inset-0 size-full object-cover object-[50%_18%] opacity-60 [mask-image:linear-gradient(180deg,black_45%,transparent_100%)]"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/beregn/hero-player.jpg"
        alt=""
        fetchPriority="high"
        className="absolute left-[250px] top-[30px] h-[380px] w-auto [mask-image:radial-gradient(ellipse_60%_62%_at_58%_50%,black_55%,transparent_100%)]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-(--bi-bg)/80 via-(--bi-bg)/20 to-transparent" />
    </div>
  )
}

export function CalcHero({ league, kickoff }: { league: string; kickoff: string }) {
  return (
    <section className="relative z-10 h-[245px] pl-[53px] pt-[28px]">
      <h1 className="text-[64px] font-bold leading-[1] tracking-[-0.025em]">
        Beregn <span className="bi-text-neon">indsats</span>
      </h1>
      <p className="mt-[14px] text-[22px] font-medium tracking-[-0.005em]">Find den rigtige indsats og få garanteret profit.</p>
      <p className="mt-[16px] inline-flex h-[46px] items-center gap-[12px] rounded-full border border-(--bi-primary)/70 bg-(--bi-bg)/60 pl-[16px] pr-[20px] text-[17px] font-medium backdrop-blur-sm">
        <LeagueMark league={league} className="h-[30px] w-[26px] object-contain" />
        {league} · {kickoff}
      </p>
    </section>
  )
}
