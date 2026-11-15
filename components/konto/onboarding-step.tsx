'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Check, Star } from 'lucide-react'
import { completeOnboarding } from '@/app/konto/account-actions'
import { cn } from '@/lib/utils'

const RECOMMENDED_BOOKMAKERS = [
  { id: 'bet365', name: 'bet365', bonus: 'Op til 1.000 kr. i bonus' },
  { id: 'betano', name: 'Betano', bonus: 'Op til 1.500 kr. i bonus' },
  { id: 'unibet', name: 'UNIBET', bonus: 'Op til 1.000 kr. i bonus' },
  { id: 'williamhill', name: 'William Hill', bonus: 'Op til 1.000 kr. i bonus' },
  { id: 'nordicbet', name: 'NordicBet', bonus: 'Op til 1.000 kr. i bonus' },
  { id: '888sport', name: '888sport', bonus: 'Op til 888 kr. i bonus' },
  { id: 'betfair', name: 'betfair', bonus: 'Opret konto hos bookmakeren' },
  { id: 'bwin', name: 'bwin', bonus: 'Opret konto hos bookmakeren' },
  { id: 'leovegas', name: 'LeoVegas', bonus: 'Opret konto hos bookmakeren' },
  { id: 'danskespil', name: 'Danske Spil', bonus: 'Opret konto hos bookmakeren' },
  { id: 'betsson', name: 'betsson', bonus: 'Opret konto hos bookmakeren' },
]

export function OnboardingStep({ initialBookmakers = [] }: { initialBookmakers?: string[] }) {
  const router = useRouter()
  const [selected, setSelected] = useState<string[]>(initialBookmakers)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  function toggle(id: string) {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }

  async function finish() {
    setBusy(true)
    setError('')
    try {
      await completeOnboarding(selected)
      router.replace('/')
      router.refresh()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Onboarding kunne ikke gemmes. Prøv igen.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 text-foreground sm:px-6 lg:py-10">
      <ol className="mx-auto mb-8 flex max-w-xl items-center justify-center gap-3 text-xs font-semibold text-muted-foreground sm:text-sm" aria-label="Oprettelse: trin 3 af 3">
        <li className="flex items-center gap-2 text-primary"><span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="size-4" /></span><span className="hidden sm:inline">Opret konto</span></li>
        <span aria-hidden="true" className="h-px flex-1 bg-primary" />
        <li className="flex items-center gap-2 text-primary"><span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="size-4" /></span><span className="hidden sm:inline">Vælg bookmaker</span></li>
        <span aria-hidden="true" className="h-px flex-1 bg-border" />
        <li className="flex items-center gap-2 text-foreground" aria-current="step"><span className="flex size-8 items-center justify-center rounded-full border border-primary bg-primary/15 text-primary">3</span><span className="hidden sm:inline">Få den bedste start</span></li>
      </ol>

      <header className="mx-auto mb-7 max-w-3xl text-center">
        <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"><Star className="size-3.5" /> Dit sidste trin</p>
        <h1 className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">Vi anbefaler <span className="text-primary">disse bookmakere</span></h1>
        <p className="mt-3 text-pretty text-sm leading-6 text-muted-foreground sm:text-base">Vælg de bookmakere, du allerede har en konto hos. Det hjælper os med at vise muligheder, der passer til dig. Du kan altid ændre dine valg senere.</p>
      </header>

      <fieldset>
        <legend className="sr-only">Vælg bookmakere</legend>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {RECOMMENDED_BOOKMAKERS.map((bookmaker) => {
            const isSelected = selected.includes(bookmaker.id)
            return (
              <button key={bookmaker.id} type="button" aria-pressed={isSelected} onClick={() => toggle(bookmaker.id)} className={cn('flex min-h-[88px] items-center justify-between gap-3 rounded-xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', isSelected ? 'border-primary bg-primary/10' : 'border-border bg-card hover:border-primary/60')}>
                <span className="min-w-0">
                  <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-emerald-600/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-500"><Star className="size-3" /> Anbefalet</span>
                  <span className="block truncate text-lg font-extrabold">{bookmaker.name}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{bookmaker.bonus}</span>
                </span>
                <span className={cn('flex size-7 shrink-0 items-center justify-center rounded-full border', isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/50 text-transparent')}><Check className="size-4" /></span>
              </button>
            )
          })}
        </div>
      </fieldset>

      <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">Du kan altid tilføje flere bookmakere senere under indstillinger.</p>
      {error && <p className="mt-4 text-center text-sm text-destructive" role="alert">{error}</p>}
      <button type="button" onClick={finish} disabled={!selected.length || busy} className="mx-auto mt-6 flex min-h-14 w-full max-w-xl items-center justify-center gap-3 rounded-xl bg-primary px-5 text-base font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
        {busy ? 'Gemmer dine valg…' : 'Fortsæt til dashboard'} <ArrowRight className="size-5" />
      </button>
      <p className="mt-3 text-center text-xs text-muted-foreground" aria-live="polite">{selected.length ? `${selected.length} valgt` : 'Vælg mindst én bookmaker for at fortsætte'}</p>
    </main>
  )
}
