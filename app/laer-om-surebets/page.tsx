import Image from 'next/image'
import Link from 'next/link'

export default function LaerOmSurebetsPage() {
  return (
    <main className="min-h-dvh bg-background px-4 pb-10 pt-6 text-foreground">
      <div className="mx-auto max-w-xl">
        <Link href="/" className="mb-6 inline-flex min-h-11 items-center text-sm text-muted-foreground">
          ← Tilbage til oversigten
        </Link>

        <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-black/20">
          <div className="relative aspect-[9/11] overflow-hidden bg-[#0b1730]">
            <Image
              src="/surebet-avatar-test.png"
              alt="Test af præsentator til en forklaringsvideo om surebets"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 576px"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#050b17] via-[#050b17]/80 to-transparent px-5 pb-5 pt-20">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-success">Lær om surebets</p>
              <h1 className="text-2xl font-bold tracking-tight">Sådan virker et surebet</h1>
            </div>
          </div>

          <div className="space-y-5 p-5">
            <div>
              <p className="text-sm font-semibold text-foreground">Test af videoformat</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                En personlig præsentator forklarer begrebet, mens odds, indsatser og beregningen vises ved siden af.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-secondary/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Speak – første udkast</p>
              <p className="mt-2 text-base leading-7 text-foreground">
                “Et surebet opstår, når du kan spille på alle udfald hos forskellige bookmakere og stadig sikre et lille overskud.”
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground">
              <div className="rounded-xl bg-secondary p-3"><span className="block text-lg font-bold text-success">01</span>Forklaring</div>
              <div className="rounded-xl bg-secondary p-3"><span className="block text-lg font-bold text-primary">02</span>Eksempel</div>
              <div className="rounded-xl bg-secondary p-3"><span className="block text-lg font-bold text-violet">03</span>Scanner</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export const metadata = {
  title: 'Lær om surebets – BetTracker',
  description: 'Test af præsentator til BetTrackers forklaringsvideo om surebets.',
}
