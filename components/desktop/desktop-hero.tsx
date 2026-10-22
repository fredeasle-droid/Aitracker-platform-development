import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Layers, LockKeyhole, Trophy, Zap } from 'lucide-react'

const FEATURES = [
  { icon: Zap, value: 'Live scanning', label: '24/7 overvågning' },
  { icon: Layers, value: '2.000+', label: 'Bookmakere' },
  { icon: Trophy, value: '30+', label: 'Sportsgrene' },
] as const

export function DesktopHero({ loggedIn }: { loggedIn: boolean }) {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative mb-4 hidden h-[226px] overflow-hidden rounded-2xl border border-[#183252] lg:block"
    >
      <Image
        src="/images/hero-stadium.png"
        alt=""
        fill
        priority
        sizes="(min-width: 1280px) 60vw, 75vw"
        className="object-cover object-[65%_center]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#050d1c_0%,rgba(5,13,28,0.92)_32%,rgba(5,13,28,0.35)_60%,rgba(5,13,28,0.15)_100%)]" />

      <div className="relative flex h-full items-center justify-between gap-6 px-8">
        <div className="max-w-[340px]">
          <h2 id="hero-title" className="text-balance text-[30px] font-extrabold leading-[1.1] tracking-tight">
            Find sikre odds med <span className="whitespace-nowrap">Bet<span className="text-[#2f8bff]">Tracker</span></span>
          </h2>
          <p className="mt-2 text-pretty text-[14px] leading-relaxed text-[#d5ddef]">
            Vi scanner over <strong className="text-foreground">2.000+</strong> bookmakere 24/7 og finder forskelle, du kan udnytte.
          </p>
          <Link
            href={loggedIn ? '/beregn' : '/konto'}
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-[14px] font-semibold text-primary-foreground shadow-[0_8px_24px_-8px_var(--primary)] transition-colors hover:bg-primary/90"
          >
            {!loggedIn && <LockKeyhole className="size-4" aria-hidden="true" />}
            {loggedIn ? 'Beregn indsats' : 'Opret gratis konto'}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <ul className="hidden items-end gap-6 2xl:flex">
          {FEATURES.map(({ icon: Icon, value, label }) => (
            <li key={label} className="flex w-[104px] flex-col items-center gap-1.5 text-center">
              <Icon className="size-9 text-[#55a8ff]" strokeWidth={1.6} aria-hidden="true" />
              <span className="text-[14px] font-semibold">{value}</span>
              <span className="text-[12px] text-[#c3cde2]">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
