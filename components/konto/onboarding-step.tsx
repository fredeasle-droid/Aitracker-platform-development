'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Check, LayoutGrid, LifeBuoy, Star } from 'lucide-react'
import { completeOnboarding } from '@/app/konto/account-actions'
import { getBookmaker } from '@/lib/bookmakers'
import { cn } from '@/lib/utils'

type Recommended = { id: string; name: string; bonus: string }

const RECOMMENDED_BOOKMAKERS: readonly Recommended[] = [
  { id: 'bet365', name: 'bet365', bonus: '1.000 kr.' },
  { id: 'betano', name: 'Betano', bonus: '1.500 kr.' },
  { id: 'unibet', name: 'Unibet', bonus: '1.000 kr.' },
  { id: 'williamhill', name: 'William Hill', bonus: '1.000 kr.' },
  { id: 'nordicbet', name: 'NordicBet', bonus: '1.000 kr.' },
  { id: '888sport', name: '888sport', bonus: '888 kr.' },
  { id: 'betfair', name: 'betfair', bonus: '1.000 kr.' },
  { id: 'bwin', name: 'bwin', bonus: '1.000 kr.' },
  { id: 'paddypower', name: 'Paddy Power', bonus: '1.000 kr.' },
  { id: 'leovegas', name: 'LeoVegas', bonus: '1.000 kr.' },
  { id: 'danskespil', name: 'Danske Spil', bonus: '500 kr.' },
  { id: 'betsson', name: 'betsson', bonus: '1.000 kr.' },
]

function signupUrl(id: string) {
  const brand = getBookmaker(id)
  if (!brand.affiliate) return brand.url
  return brand.affiliate.includes('{url}') ? brand.affiliate.replace('{url}', encodeURIComponent(brand.url)) : brand.affiliate
}

const STEPS = [
  { label: 'Opret konto', state: 'done' },
  { label: 'Vælg bookmaker', state: 'done' },
  { label: 'Få den bedste start', state: 'current' },
] as const

type BookmakerAnswer = 'already_registered' | 'registered_after_click' | 'not_yet'

const ANSWER_OPTIONS: { value: BookmakerAnswer; label: string }[] = [
  { value: 'already_registered', label: 'Har allerede konto' },
  { value: 'registered_after_click', label: 'Jeg har oprettet mig' },
  { value: 'not_yet', label: 'Ikke endnu' },
]

export function OnboardingStep({ initialResponses = {} }: { initialResponses?: Record<string, string> }) {
  const router = useRouter()
  const [responses, setResponses] = useState<Record<string, BookmakerAnswer>>(() =>
    Object.fromEntries(Object.entries(initialResponses).filter(([, value]) => ANSWER_OPTIONS.some((option) => option.value === value))) as Record<string, BookmakerAnswer>,
  )
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const allAnswered = RECOMMENDED_BOOKMAKERS.every(({ id }) => Boolean(responses[id]))

  function setAnswer(id: string, answer: BookmakerAnswer) {
    setResponses((current) => ({ ...current, [id]: answer }))
  }

  async function finish() {
    setBusy(true)
    setError('')
    try {
      await completeOnboarding(responses)
      router.replace('/')
      router.refresh()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Dine valg kunne ikke gemmes. Prøv igen.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="mx-auto w-full max-w-[1080px] px-1 pb-8 text-foreground">
      <ol className="mx-auto mb-6 mt-1 flex w-full max-w-[560px]" aria-label="Oprettelse: trin 3 af 3">
        {STEPS.map(({ label, state }, index) => (
          <li key={label} aria-current={state === 'current' ? 'step' : undefined} className="relative flex flex-1 flex-col items-center gap-2">
            {index < STEPS.length - 1 && (
              <span aria-hidden="true" className={cn('absolute left-1/2 top-[18px] h-0.5 w-full', index === 0 ? 'bg-primary' : 'bg-[linear-gradient(90deg,var(--primary),#7a45f0)]')} />
            )}
            <span
              className={cn(
                'relative z-10 flex size-9 items-center justify-center rounded-full border-2 text-sm font-bold',
                state === 'done' ? 'border-primary bg-primary text-primary-foreground' : 'border-primary bg-[#0a2547] text-white shadow-[0_0_24px_-4px_var(--primary)]',
              )}
            >
              {state === 'done' ? <Check className="size-5" strokeWidth={3} aria-hidden="true" /> : index + 1}
            </span>
            <span className="text-center text-[13px] text-[#c3cde2]">{label}</span>
          </li>
        ))}
      </ol>

      <header className="mx-auto mb-6 max-w-[860px] text-center">
        <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Vi anbefaler{' '}
          <span className="bg-[linear-gradient(90deg,#1593ff_0%,#4a7bff_70%,#7a45f0_100%)] bg-clip-text text-transparent">disse bookmakere</span>
        </h1>
        <p className="mx-auto mt-3 max-w-[760px] text-pretty text-[15px] leading-relaxed text-[#e6ecf7] sm:text-base">
          For at få den bedste start anbefaler vi, at du opretter dig hos nogle af disse bookmakere. Det er her, vi får flest muligheder for at finde gode surebets til dig.
        </p>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {RECOMMENDED_BOOKMAKERS.map((bookmaker) => {
          const answer = responses[bookmaker.id]
          return (
            <li
              key={bookmaker.id}
              className={cn(
                'overflow-hidden rounded-xl border bg-[linear-gradient(135deg,#071426_0%,#06101e_60%,#071a2a_100%)] transition-colors',
                answer ? 'border-primary shadow-[0_0_28px_-14px_var(--primary)]' : 'border-[#183252]',
              )}
            >
              <span className="inline-flex items-center gap-1.5 rounded-br-lg bg-[#0d2a1c] px-2.5 py-1 text-[11px] font-medium text-[#e6ecf7]">
                <Star className="size-3 fill-[#ffd32a] text-[#ffd32a]" aria-hidden="true" />
                Vores anbefaling
              </span>
              <div className="flex items-center gap-3 px-4 pt-2">
                <span className="flex h-12 min-w-0 flex-1 items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/bookmakers/wordmarks/${bookmaker.id}.png`}
                    alt={bookmaker.name}
                    loading="lazy"
                    decoding="async"
                    className="max-h-full max-w-full object-contain object-left"
                  />
                </span>
                <span className="shrink-0 text-xs leading-tight text-[#c3cde2]">
                  Op til
                  <span className="block text-base font-bold text-white">{bookmaker.bonus}</span>i bonus
                </span>
              </div>
              <div className="flex flex-col gap-2 p-4 pt-3">
                <a
                  href={signupUrl(bookmaker.id)}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="flex h-10 items-center justify-center gap-1.5 rounded-lg bg-primary text-[13px] font-semibold text-primary-foreground transition-[filter] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Opret konto
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                  <span className="sr-only"> hos {bookmaker.name} (åbner i nyt vindue)</span>
                </a>
                <p className="text-center text-xs leading-relaxed text-[#c3cde2]">Når du er færdig, fortæl os det herunder.</p>
                <div className="grid grid-cols-1 gap-1.5" role="group" aria-label={`Svar om ${bookmaker.name}`}>
                  {ANSWER_OPTIONS.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={answer === value}
                      onClick={() => setAnswer(bookmaker.id, value)}
                      className={cn(
                        'flex min-h-9 items-center justify-center gap-1.5 rounded-lg border px-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        answer === value ? 'border-primary bg-primary/15 text-white' : 'border-[#344861] text-[#e6ecf7] hover:bg-[#102744]',
                      )}
                    >
                      {answer === value && <Check className="size-3.5 text-primary" aria-hidden="true" />}
                      {label}
                      <span className="sr-only"> hos {bookmaker.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      {error && (
        <p role="alert" className="mt-4 text-center text-sm text-destructive">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={finish}
        disabled={busy || !allAnswered}
        className="mx-auto mt-6 flex h-14 w-full max-w-[570px] items-center justify-center gap-4 rounded-2xl bg-[linear-gradient(100deg,#1682ff_0%,#1a63f0_55%,#5a3ff0_100%)] text-lg font-bold text-white shadow-[0_14px_34px_-14px_#1682ff] transition-[filter] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LayoutGrid className="size-5" aria-hidden="true" />
        <span aria-hidden="true" className="h-6 w-px bg-white/30" />
        {busy ? 'Gemmer…' : allAnswered ? 'Fortsæt til dashboard' : `Besvar alle bookmakerne (${Object.keys(responses).length}/${RECOMMENDED_BOOKMAKERS.length})`}
        {!busy && allAnswered && <ArrowRight className="size-5" aria-hidden="true" />}
      </button>
      <p className="mt-3 text-center text-xs text-[#c3cde2]" aria-live="polite">
        Du behøver ikke oprette konto hos alle. Vælg “Ikke endnu”, hvis du vil springe en bookmaker over.
      </p>
      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event('open-support-chat'))}
        className="mx-auto mt-5 flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#344861] px-4 text-sm font-semibold text-[#e6ecf7] transition-colors hover:border-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <LifeBuoy className="size-4" aria-hidden="true" />
        Brug for hjælp? Få hjælp nu
      </button>
    </main>
  )
}
