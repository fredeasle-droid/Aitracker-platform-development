import Link from 'next/link'
import { BOOKMAKER_PAGES, SPORT_PAGES } from '@/lib/landing-pages'

const linkCls =
  'inline-flex min-h-11 items-center rounded-full border border-border bg-card/60 px-4 text-[14px] font-semibold text-foreground/85 transition-colors hover:border-primary/60 hover:text-foreground'

export function SeoIntro() {
  return (
    <section aria-labelledby="seo-intro-heading" className="mt-10 flex max-w-4xl flex-col gap-4 lg:ml-5">
      <h2 id="seo-intro-heading" className="text-balance text-[22px] font-bold text-foreground lg:text-[26px]">
        Surebets i realtid hos danske bookmakere
      </h2>
      <p className="text-pretty text-[15px] leading-relaxed text-foreground/80 lg:text-[16px]">
        Et surebet er en kombination af odds hos forskellige bookmakere, hvor du spiller på alle udfald af en kamp og får
        en gevinst uanset resultatet. BetTrackerAI scanner odds hos danske bookmakere med licens fra Spillemyndigheden døgnet
        rundt og viser mulighederne, så snart de opstår, sammen med den garanterede profit og den rigtige fordeling af
        indsatsen.
      </p>
      <p className="text-pretty text-[15px] leading-relaxed text-foreground/80 lg:text-[16px]">
        Vælg dine bookmakere i filteret, sortér efter profit, og brug{' '}
        <Link href="/beregn" className="font-semibold text-primary-glow underline-offset-4 hover:underline">surebet beregneren</Link>{' '}
        til at fordele indsatsen. Ny til surebets? Start med guiden{' '}
        <Link href="/guide/hvad-er-surebets" className="font-semibold text-primary-glow underline-offset-4 hover:underline">
          Hvad er surebets?
        </Link>
      </p>

      <nav aria-label="Surebets efter sport" className="flex flex-col gap-2">
        <h3 className="text-[15px] font-semibold text-foreground">Surebets efter sport</h3>
        <ul className="flex flex-wrap gap-2">
          {SPORT_PAGES.map((page) => (
            <li key={page.slug}>
              <Link href={`/sport/${page.slug}`} className={linkCls}>{page.name}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <nav aria-label="Surebets efter bookmaker" className="flex flex-col gap-2">
        <h3 className="text-[15px] font-semibold text-foreground">Surebets efter bookmaker</h3>
        <ul className="flex flex-wrap gap-2">
          {BOOKMAKER_PAGES.map((page) => (
            <li key={page.slug}>
              <Link href={`/bookmaker/${page.slug}`} className={linkCls}>{page.name}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  )
}
