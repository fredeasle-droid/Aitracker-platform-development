'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  AtSign,
  Calendar,
  Check,
  CircleHelp,
  CreditCard,
  Crown,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Minus,
  Smartphone,
  Star,
  Trophy,
  UserRound,
  Zap,
} from 'lucide-react'
import { BarsIcon } from '@/components/icons'
import { Flag } from '@/components/flag'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import { plans, type Plan } from '@/app/konto/plans'
import { LoginStep } from '@/app/konto/login-step'

const STEPS = ['Dine oplysninger', 'Vælg abonnement', 'Betalingsoplysninger'] as const

const panel = 'rounded-2xl border border-[#183252] bg-[linear-gradient(135deg,#071426_0%,#06101e_60%,#071a2a_100%)]'
const shell = 'flex h-14 items-center gap-3 rounded-xl border border-[#1d3a5f] bg-[#071428] px-4 text-[#c3cde2] transition-colors focus-within:border-primary'
const input = 'min-w-0 flex-1 bg-transparent text-[16px] text-white outline-none placeholder:text-[#8fa3c4]'
const primaryButton =
  'flex h-16 items-center justify-center gap-3 rounded-2xl bg-[linear-gradient(100deg,#1682ff_0%,#1a63f0_55%,#5a3ff0_100%)] text-[19px] font-bold text-white shadow-[0_14px_34px_-14px_#1682ff] transition-[filter] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60'

type Props = {
  step: number
  setStep: (step: number) => void
  plan: Plan
  setPlan: (plan: Plan) => void
  submitted: boolean
  onSubmitted: () => void
  loginMode: boolean
  setLoginMode: (value: boolean) => void
}

export function DesktopFlow({ step, setStep, plan, setPlan, submitted, onSubmitted, loginMode, setLoginMode }: Props) {
  if (loginMode) {
    return (
      <div className="mx-auto w-full max-w-[520px] pt-6">
        <div className={cn(panel, 'p-8')}>
          <LoginStep onBack={() => setLoginMode(false)} onNext={() => window.location.assign('/')} />
        </div>
      </div>
    )
  }

  if (submitted) return <Success planName={plans[plan].name} />

  return (
    <div className="mx-auto w-full max-w-[930px]">
      <Stepper step={step} />
      {step === 1 && <DetailsStep onNext={() => setStep(2)} onLogin={() => setLoginMode(true)} />}
      {step === 2 && <PlanStep plan={plan} setPlan={setPlan} onBack={() => setStep(1)} onNext={() => setStep(3)} />}
      {step === 3 && <PaymentStep plan={plan} onBack={() => setStep(2)} onChangePlan={() => setStep(2)} onSubmit={onSubmitted} />}
    </div>
  )
}

function Stepper({ step }: { step: number }) {
  return (
    <ol className="mx-auto mb-10 mt-2 flex w-full max-w-[740px]" aria-label={`Trin ${step} af 3`}>
      {STEPS.map((label, index) => {
        const number = index + 1
        const done = step > number
        const current = step === number
        return (
          <li key={label} className="relative flex flex-1 flex-col items-center gap-3" aria-current={current ? 'step' : undefined}>
            {number < STEPS.length && (
              <span aria-hidden="true" className={cn('absolute left-1/2 top-6 h-0.5 w-full', done ? 'bg-primary' : 'bg-[#1d3a5f]')} />
            )}
            <span
              className={cn(
                'relative z-10 flex size-12 items-center justify-center rounded-full border-2 text-[18px] font-semibold',
                current && 'border-primary bg-primary text-primary-foreground shadow-[0_0_28px_-4px_var(--primary)]',
                done && 'border-primary bg-[#071a33] text-primary',
                !current && !done && 'border-[#2a4a76] bg-[#071428] text-[#d5ddef]',
              )}
            >
              {done ? <Check className="size-6" aria-hidden="true" /> : number}
            </span>
            <span className={cn('text-[15px]', current ? 'font-bold text-white' : 'text-[#c3cde2]', done && 'text-[#e6ecf7]')}>{label}</span>
          </li>
        )
      })}
    </ol>
  )
}

function Title({ before, accent }: { before?: string; accent: string }) {
  return (
    <h1 className="text-balance text-center text-[54px] font-extrabold leading-[1.05] tracking-tight">
      {before}
      <span className="bg-[linear-gradient(90deg,#1593ff_0%,#4a7bff_55%,#7a45f0_100%)] bg-clip-text text-transparent">{accent}</span>
    </h1>
  )
}

function Field({ id, label, icon, children, className }: { id: string; label: string; icon: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-[15px] font-semibold text-white">
        {label}
      </label>
      <div className={shell}>
        <span className="shrink-0 [&_svg]:size-6" aria-hidden="true">
          {icon}
        </span>
        {children}
      </div>
    </div>
  )
}

function BackButton({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('flex items-center justify-center gap-3 text-[18px] text-[#e6ecf7] transition-colors hover:text-white', className)}
    >
      <ArrowLeft className="size-6 text-primary" aria-hidden="true" />
      Tilbage
    </button>
  )
}

const BENEFITS = [
  { icon: Zap, title: 'Live scanning', text: 'Vi scanner 24/7 hos 2.000+ bookmakere.' },
  { icon: BarsIcon, title: 'Oddsberegner', text: 'Beregn din sikre indsatsfordeling.' },
  { icon: Trophy, title: 'Statistik', text: 'Se resultater og afkast.' },
  { icon: Star, title: 'Favoritter', text: 'Gem dine favoritkampe.' },
] as const

function DetailsStep({ onNext, onLogin }: { onNext: () => void; onLogin: () => void }) {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setBusy(true)
    const data = new FormData(event.currentTarget)
    const phone = String(data.get('phone') ?? '').trim()
    try {
      const result = await authClient.signUp.email({
        name: String(data.get('name')).trim(),
        username: String(data.get('username')).trim(),
        email: String(data.get('email')).trim(),
        password: String(data.get('password')),
        ...(phone ? { phone: `+45 ${phone}` } : {}),
      })
      if (result.error) {
        setError(result.error.message ?? 'Kontoen kunne ikke oprettes. Brugernavn eller e-mail er måske allerede i brug.')
        return
      }
      onNext()
    } catch {
      setError('Der opstod en forbindelsesfejl. Kontrollér din internetforbindelse og prøv igen.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit}>
      <Title before="Dine " accent="oplysninger" />
      <p className="mx-auto mt-4 max-w-[640px] text-center text-[19px] leading-snug text-[#e6ecf7]">
        Opret din konto og få 7 dages gratis adgang til alle funktioner.
      </p>
      <p className="mt-1 text-center text-[16px] text-[#c3cde2]">Ingen binding. Ingen betalingsoplysninger nu.</p>

      <div className={cn(panel, 'mt-8 grid grid-cols-2 gap-x-8 gap-y-5 p-6')}>
        <Field id="signup-name" label="Fulde navn" icon={<UserRound />}>
          <input id="signup-name" name="name" required autoComplete="name" placeholder="Fx. Fredreik Aslerin" className={input} />
        </Field>
        <Field id="signup-username" label="Brugernavn" icon={<AtSign />}>
          <input
            id="signup-username"
            name="username"
            required
            minLength={3}
            maxLength={24}
            pattern="[A-Za-z0-9_.\-]+"
            title="3-24 tegn: bogstaver, tal, punktum, bindestreg eller understreg"
            autoComplete="username"
            placeholder="Vælg et unikt brugernavn"
            className={input}
          />
        </Field>
        <Field id="signup-email" label="E-mail" icon={<Mail />}>
          <input id="signup-email" name="email" type="email" required autoComplete="email" placeholder="din@email.com" className={input} />
        </Field>
        <Field id="signup-phone" label="Telefonnummer (valgfrit)" icon={<Smartphone />}>
          <Flag code="dk" label="Danmark" className="size-6" />
          <span className="text-[16px] text-white">+45</span>
          <input id="signup-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="12 34 56 78" className={input} />
        </Field>
        <Field id="signup-password" label="Adgangskode" icon={<LockKeyhole />} className="col-span-2">
          <input
            id="signup-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            minLength={6}
            autoComplete="new-password"
            placeholder="Mindst 6 tegn"
            className={input}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? 'Skjul adgangskode' : 'Vis adgangskode'}
            aria-pressed={showPassword}
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-[#c3cde2] hover:bg-[#102744]"
          >
            {showPassword ? <EyeOff className="size-6" /> : <Eye className="size-6" />}
          </button>
        </Field>
      </div>

      <ul className={cn(panel, 'mt-5 grid grid-cols-4 gap-4 p-6')}>
        {BENEFITS.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex items-start gap-3">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-full border border-[#1b4a86] bg-[#081c38] text-primary">
              <Icon className="size-7" fill={Icon === BarsIcon ? 'currentColor' : 'none'} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-[16px] font-semibold">{title}</span>
              <span className="mt-1 block text-[14px] leading-snug text-[#c3cde2]">{text}</span>
            </span>
          </li>
        ))}
      </ul>

      <label className="mt-6 flex items-center gap-3 text-[16px] text-[#e6ecf7]">
        <input type="checkbox" name="terms" required defaultChecked className="size-6 shrink-0 rounded-md accent-[#1682ff]" />
        <span>
          Jeg er mindst 18 år, og jeg accepterer{' '}
          <Link href="/" className="text-[#42aeff] underline">
            vilkår
          </Link>{' '}
          og{' '}
          <Link href="/" className="text-[#42aeff] underline">
            privatlivspolitikt
          </Link>
          .
        </span>
      </label>

      {error && (
        <p role="alert" className="mt-4 rounded-xl border border-[#5a2530] bg-[#2a1018] px-4 py-3 text-[15px] text-[#ff9aa6]">
          {error}
        </p>
      )}

      <div className="mt-6 flex gap-5">
        <Link
          href="/"
          className="flex h-16 w-[183px] shrink-0 items-center justify-center gap-3 rounded-2xl border border-[#1d4c91] bg-[#071428] text-[18px] text-white transition-colors hover:bg-[#0b1d39]"
        >
          <ArrowLeft className="size-6 text-primary" aria-hidden="true" />
          Tilbage
        </Link>
        <button type="submit" disabled={busy} className={cn(primaryButton, 'flex-1')}>
          {busy ? 'Opretter konto…' : 'Videre'}
          {!busy && <ArrowRight className="size-6" aria-hidden="true" />}
        </button>
      </div>

      <p className="mt-6 text-center text-[16px] text-[#c3cde2]">
        Har du allerede en konto?{' '}
        <button type="button" onClick={onLogin} className="text-[#42aeff] underline">
          Log ind
        </button>
      </p>
    </form>
  )
}

function PlanStep({ plan, setPlan, onBack, onNext }: { plan: Plan; setPlan: (plan: Plan) => void; onBack: () => void; onNext: () => void }) {
  return (
    <section>
      <Title before="Vælg dit " accent="abonnement" />
      <p className="mt-4 text-center text-[20px] text-[#e6ecf7]">Få 7 dage gratis. Opsig når som helst.</p>

      <div className="mt-10 grid grid-cols-2 gap-5">
        <PlanCard id="premium" selected={plan === 'premium'} onSelect={() => setPlan('premium')} popular />
        <PlanCard id="basis" selected={plan === 'basis'} onSelect={() => setPlan('basis')} />
      </div>

      <ul className={cn(panel, 'mt-5 grid grid-cols-3 divide-x divide-[#183252] py-4')}>
        <Assurance icon={<Minus className="size-7" />} title="Ingen binding" text="Opsig når som helst" />
        <Assurance icon={<Check className="size-7" />} title="7 dage gratis prøve" text="Fuld adgang til alle funktioner" />
        <Assurance icon={<CreditCard className="size-7" />} title="Sikker betaling via Stripe" text="Dine data er beskyttet" />
      </ul>

      <button type="button" onClick={onNext} className={cn(primaryButton, 'mt-5 w-full')}>
        Fortsæt med {plans[plan].name}
        <ArrowRight className="size-6" aria-hidden="true" />
      </button>
      <BackButton onClick={onBack} className="mx-auto mt-6" />
    </section>
  )
}

const FEATURES = {
  premium: ['Alle SikkerBets + SMS-alerts', 'Oddsberegner', 'Statistik', 'Live odds', 'Favoritter'],
  basis: ['SikkerBets op til 5% margin', 'Oddsberegner', 'Statistik', 'Live odds', 'Favoritter'],
} as const

function PlanCard({ id, selected, onSelect, popular = false }: { id: Plan; selected: boolean; onSelect: () => void; popular?: boolean }) {
  const plan = plans[id]
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        'relative rounded-2xl border-2 p-6 text-left transition-[border-color,box-shadow]',
        selected
          ? 'border-primary bg-[linear-gradient(145deg,#0a2547,#06142a)] shadow-[0_0_36px_-12px_var(--primary)]'
          : 'border-[#183252] bg-[#06101e] hover:border-[#2a4a76]',
      )}
    >
      {popular && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[linear-gradient(100deg,#1682ff,#1a63f0)] px-5 py-1.5 text-[15px] font-bold text-white shadow-[0_6px_18px_-6px_var(--primary)]">
          Mest populær
        </span>
      )}
      <span
        className={cn(
          'absolute right-4 top-4 flex size-7 items-center justify-center rounded-full border-2',
          selected ? 'border-primary bg-primary text-primary-foreground' : 'border-[#2a4a76]',
        )}
        aria-hidden="true"
      >
        {selected && <Check className="size-4" strokeWidth={3} />}
      </span>

      <span className="flex items-center gap-4">
        <span className={cn('flex size-16 shrink-0 items-center justify-center rounded-full bg-[#0b2342]', id === 'premium' ? 'text-[#f5c84b]' : 'text-[#c3cde2]')}>
          {id === 'premium' ? <Crown className="size-8 fill-current" aria-hidden="true" /> : <span className="size-6 rotate-45 rounded-[4px] border-2 border-current" aria-hidden="true" />}
        </span>
        <span className="flex-1">
          <span className="block text-[22px] font-extrabold uppercase tracking-wide">{plan.name}</span>
          <span className="mt-1 block text-[16px] text-[#c3cde2]">{id === 'premium' ? 'Maksimal værdi' : 'Det enkle valg'}</span>
        </span>
        <span className="mt-8 text-right">
          <span className="block text-[38px] font-extrabold leading-none tabular-nums">
            {plan.price}
            <span className="ml-1.5 text-[16px] font-medium text-[#c3cde2]">kr./md.</span>
          </span>
          <span className="mt-2 block text-[17px] font-bold text-[#ffd32a]">7 dage gratis</span>
        </span>
      </span>

      <ul className="mt-6 grid grid-flow-col grid-cols-2 grid-rows-3 gap-x-4 gap-y-4 border-t border-[#183252] pt-6 text-[17px]">
        {FEATURES[id].map((feature) => (
          <li key={feature} className="flex items-center gap-3">
            <Check className="size-6 shrink-0 text-[#2fb8ff]" aria-hidden="true" />
            {feature}
          </li>
        ))}
      </ul>
    </button>
  )
}

function Assurance({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <li className="flex items-center gap-4 px-6">
      <span className="flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-[#1b6fd1] bg-[#081c38] text-primary" aria-hidden="true">
        {icon}
      </span>
      <span>
        <span className="block text-[17px] font-bold">{title}</span>
        <span className="mt-0.5 block text-[15px] text-[#c3cde2]">{text}</span>
      </span>
    </li>
  )
}

function CardBrands() {
  return (
    <span className="flex items-center gap-4" aria-hidden="true">
      <span className="text-[22px] font-black italic tracking-tight text-white">VISA</span>
      <span className="relative flex h-7 w-11 items-center">
        <span className="absolute left-0 size-7 rounded-full bg-[#eb001b]" />
        <span className="absolute right-0 size-7 rounded-full bg-[#f79e1b] mix-blend-screen" />
      </span>
      <span className="flex h-8 w-9 items-center justify-center rounded bg-[#1f8bd6] text-[9px] font-black text-white">AMEX</span>
    </span>
  )
}

function PaymentStep({
  plan,
  onBack,
  onChangePlan,
  onSubmit,
}: {
  plan: Plan
  onBack: () => void
  onChangePlan: () => void
  onSubmit: () => void
}) {
  const [method, setMethod] = useState<'card' | 'mobilepay'>('card')
  const selected = plans[plan]

  return (
    <section>
      <Title before="Betalings" accent="oplysninger" />
      <p className="mx-auto mt-4 max-w-[640px] text-balance text-center text-[19px] leading-snug text-[#e6ecf7]">
        Du betaler ikke i dag. Din 7 dages gratis prøve starter nu, og herefter {selected.price} kr./md. for {selected.name}.
      </p>

      <div className={cn(panel, 'mt-8 flex items-center py-5 pl-6 pr-8')}>
        <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-[#0b2342] text-[#f5c84b]">
          <Crown className="size-8 fill-current" aria-hidden="true" />
        </span>
        <div className="ml-5 flex-1">
          <p className="text-[15px] text-[#c3cde2]">Valgt abonnement</p>
          <p className="mt-0.5 flex items-center gap-4 text-[26px] font-extrabold">
            {selected.name}
            <span className="rounded-lg bg-[#0d3a36] px-3 py-1 text-[15px] font-semibold text-success">7 dage gratis</span>
          </p>
        </div>
        <div className="flex items-center gap-8 border-l border-[#183252] pl-8">
          <p className="text-[38px] font-extrabold tabular-nums">
            {selected.price} <span className="text-[20px] font-medium text-[#e6ecf7]">kr./md.</span>
          </p>
          <button type="button" onClick={onChangePlan} className="text-[16px] text-[#42aeff] underline">
            Skift abonnement
          </button>
        </div>
      </div>

      <div role="tablist" aria-label="Betalingsmetode" className="mt-5 flex overflow-hidden rounded-xl border border-[#1d3a5f] bg-[#071428]">
        <button
          type="button"
          role="tab"
          aria-selected={method === 'card'}
          onClick={() => setMethod('card')}
          className={cn(
            'flex h-14 flex-1 items-center justify-center gap-3 text-[17px] font-semibold transition-colors',
            method === 'card' ? 'bg-[linear-gradient(100deg,#1682ff,#1a5ff0_70%,#4a45f0)] text-white' : 'text-[#c3cde2] hover:text-white',
          )}
        >
          <CreditCard className="size-6" aria-hidden="true" />
          Kort
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={method === 'mobilepay'}
          onClick={() => setMethod('mobilepay')}
          className={cn(
            'flex h-14 flex-1 items-center justify-center gap-3 text-[17px] font-semibold transition-colors',
            method === 'mobilepay' ? 'bg-[linear-gradient(100deg,#1682ff,#1a5ff0_70%,#4a45f0)] text-white' : 'text-[#c3cde2] hover:text-white',
          )}
        >
          <Smartphone className="size-6" aria-hidden="true" />
          MobilePay
        </button>
      </div>

      {method === 'card' ? (
        <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-5">
          <Field id="card-number" label="Kortnummer" icon={<CreditCard />} className="col-span-2">
            <input id="card-number" inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" className={input} />
            <CardBrands />
          </Field>
          <Field id="card-expiry" label="Udløbsdato" icon={<Calendar />}>
            <input id="card-expiry" inputMode="numeric" autoComplete="cc-exp" placeholder="MM / ÅÅ" className={input} />
          </Field>
          <Field id="card-cvc" label="CVC" icon={<LockKeyhole />}>
            <input id="card-cvc" inputMode="numeric" autoComplete="cc-csc" placeholder="123" className={input} />
            <CircleHelp className="size-6 shrink-0 text-[#c3cde2]" aria-label="CVC står på bagsiden af dit kort" />
          </Field>
          <Field id="card-name" label="Navn på kort" icon={<UserRound />} className="col-span-2">
            <input id="card-name" autoComplete="cc-name" placeholder="Navn som står på kortet" className={input} />
          </Field>
        </div>
      ) : (
        <p className={cn(panel, 'mt-6 px-6 py-8 text-center text-[17px] text-[#e6ecf7]')}>
          Du bliver sendt videre til MobilePay for at godkende din gratis prøveperiode.
        </p>
      )}

      {method === 'card' && (
        <label className="mt-5 flex items-start gap-3">
          <input type="checkbox" defaultChecked className="mt-1 size-6 shrink-0 rounded-md accent-[#1682ff]" />
          <span>
            <span className="block text-[17px] text-white">Gem kortoplysninger til fremtidige betalinger</span>
            <span className="mt-0.5 block text-[14px] text-[#c3cde2]">Det gør det nemt at fortsætte dit abonnement.</span>
          </span>
        </label>
      )}

      <button type="button" onClick={onSubmit} className={cn(primaryButton, 'mt-6 w-full')}>
        Start 7 dage gratis
        <ArrowRight className="size-6" aria-hidden="true" />
      </button>
      <BackButton onClick={onBack} className="mx-auto mt-5" />
      <p className="mt-5 text-center text-[14px] text-[#c3cde2]">
        Du betaler ikke i dag. Abonnementet starter automatisk efter 7 dage. Du kan opsige når som helst.
      </p>
    </section>
  )
}

function Success({ planName }: { planName: string }) {
  return (
    <section className={cn(panel, 'mx-auto mt-10 max-w-[560px] p-10 text-center')}>
      <span className="mx-auto flex size-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_36px_-6px_var(--primary)]">
        <Check className="size-10" aria-hidden="true" />
      </span>
      <h1 className="mt-6 text-[36px] font-extrabold">Du er klar</h1>
      <p className="mt-3 text-[18px] text-[#e6ecf7]">Din {planName}-prøveperiode er startet. God fornøjelse med BetTracker.</p>
      <Link href="/" className={cn(primaryButton, 'mt-8 w-full')}>
        Gå til BetTracker
        <ArrowRight className="size-6" aria-hidden="true" />
      </Link>
    </section>
  )
}
