'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Check, LayoutGrid, LifeBuoy } from 'lucide-react'
import { completeOnboarding } from '@/app/konto/account-actions'
import { ONBOARDING_BOOKMAKERS } from '@/lib/onboarding-bookmakers'
import { BookmakerLogo } from '@/components/bookmaker-logo'
import { cn } from '@/lib/utils'

const RECOMMENDED_BOOKMAKERS = ONBOARDING_BOOKMAKERS

const STEPS = [
  { label: 'Opret konto', state: 'done' },
  { label: 'Vælg bookmaker', state: 'done' },
  { label: 'Få den bedste start', state: 'current' },
] as const

type BookmakerAnswer = 'already_registered' | 'registered_after_click'

const ANSWER_OPTIONS: { value: BookmakerAnswer; label: string }[] = [
  { value: 'already_registered', label: 'Har allerede konto' },
  { value: 'registered_after_click', label: 'Jeg har oprettet mig' },
]

export function OnboardingStep({ initialResponses = {} }: { initialResponses?: Record<string, string> }) {
  const router = useRouter()
  const [responses, setResponses] = useState<Record<string, BookmakerAnswer>>(() =>
    Object.fromEntries(Object.entries(initialResponses).filter(([, value]) => ANSWER_OPTIONS.some((option) => option.value === value))) as Record<string, BookmakerAnswer>,
  )
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const answeredCount = RECOMMENDED_BOOKMAKERS.filter(({ id }) => Boolean(responses[id])).length
  const allAnswered = answeredCount === RECOMMENDED_BOOKMAKERS.length

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
          Åbn BonusTracker-siden for den bookmaker, du vil oprette dig hos. Når du er færdig, så kom tilbage og markér, om du allerede har en konto eller netop har oprettet dig.
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
              <div className="flex flex-col gap-2 p-4">
                <div className="flex items-center gap-3">
                  <BookmakerLogo name={bookmaker.name} className="size-12" />
                  <h2 className="text-lg font-bold text-white">{bookmaker.name}</h2>
                </div>
                <a
                  href={`https://bonustracker.dk/${bookmaker.funnelSlug}`}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="flex min-h-11 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-center text-[13px] font-semibold text-primary-foreground transition-[filter] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Opret
                  <span className="sr-only"> hos {bookmaker.name} (åbner i en ny fane)</span>
                </a>
                <p className="text-center text-xs leading-relaxed text-[#c3cde2]">Markér dit svar, når du kommer tilbage.</p>
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
        {busy ? 'Gemmer…' : allAnswered ? 'Fortsæt til dashboard' : `Besvar alle bookmakerne (${answeredCount}/${RECOMMENDED_BOOKMAKERS.length})`}
        {!busy && allAnswered && <ArrowRight className="size-5" aria-hidden="true" />}
      </button>
      <p className="mt-3 text-center text-xs text-[#c3cde2]" aria-live="polite">
        Vælg for hver bookmaker, om du allerede har en konto eller har oprettet dig via linket.
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
