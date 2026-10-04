'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, CreditCard, Crown, LockKeyhole, ShieldCheck, Sparkles, UserRound, X } from 'lucide-react'
import { LoginStep } from './login-step'
import { authClient } from '@/lib/auth-client'

const plans = {
  basis: { name: 'Basis', price: '149', detail: 'SikkerBets op til 5% margin' },
  premium: { name: 'Premium', price: '249', detail: 'Alle SikkerBets + SMS-alerts' },
} as const

type Plan = keyof typeof plans

export default function AccountFlowPage() {
  const [step, setStep] = useState(1)
  const [plan, setPlan] = useState<Plan>('premium')
  const [submitted, setSubmitted] = useState(false)
  const [loginMode, setLoginMode] = useState(false)

  return (
    <main className="min-h-dvh bg-[#050b17] px-3 pb-8 pt-2 text-[#f3f6fc] sm:px-5">
      <div className="mx-auto w-full max-w-[390px]">
        <header className="flex h-14 items-center justify-between">
          <Link href="/" aria-label="Tilbage til BetTracker" className="flex size-11 items-center justify-center rounded-full hover:bg-white/5">
            <ArrowLeft className="size-5" />
          </Link>
          <span className="text-[21px] font-black tracking-tight"><span className="text-white">Bet</span><span className="text-[#1593ff]">Tracker</span></span>
          <Link href="/" aria-label="Luk" className="flex size-11 items-center justify-center rounded-full hover:bg-white/5"><X className="size-5" /></Link>
        </header>

        <div className="mb-7 flex items-center justify-center gap-0 px-5" aria-label={`Trin ${step} af 3`}>
          {[1, 2, 3].map((number) => (
            <div key={number} className="flex flex-1 items-center last:flex-none">
              <span className={`flex size-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${step >= number ? 'border-[#159cff] bg-[#159cff] text-[#03101e]' : 'border-[#52617a] bg-[#071321] text-[#d0d8e7]'}`}>{step > number ? <Check className="size-4" /> : number}</span>
              {number < 3 && <span className={`h-px w-full ${step > number ? 'bg-[#159cff]' : 'bg-[#34445e]'}`} />}
            </div>
          ))}
        </div>

        {submitted ? <SuccessState plan={plans[plan]} /> : step === 1 ? (loginMode ? <LoginStep onBack={() => setLoginMode(false)} onNext={() => window.location.assign('/')} /> : <SignupStep onNext={() => setStep(2)} onLogin={() => setLoginMode(true)} />) : step === 2 ? <PlanStep plan={plan} setPlan={setPlan} onBack={() => setStep(1)} onNext={() => setStep(3)} /> : <PaymentStep plan={plans[plan]} onBack={() => setStep(2)} onSubmit={() => setSubmitted(true)} />}
      </div>
    </main>
  )
}

function SignupStep({ onNext, onLogin }: { onNext: () => void; onLogin: () => void }) {
  const [error, setError] = useState('')
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const result = await authClient.signUp.email({ name: String(data.get('name')), email: String(data.get('email')), password: String(data.get('password')) })
    if (result.error) { setError('Kontoen kunne ikke oprettes. Prøv igen.'); return }
    onNext()
  }
  return <form onSubmit={submit}><section>
    <h1 className="text-[27px] font-extrabold leading-tight">Opret gratis konto</h1>
    <p className="mt-2 text-[16px] leading-6 text-[#e2e7f1]">Få 7 dages gratis adgang til alle funktioner. Ingen binding.</p>
    <div className="mt-7 space-y-3">
<Field name="name" icon={<UserRound />} label="Brugernavn" />
  <Field name="email" icon={<span className="text-[22px]">@</span>} label="Email" type="email" />
  <Field name="password" icon={<LockKeyhole />} label="Adgangskode" type="password" />
    </div>
    <label className="mt-5 flex items-start gap-2 text-[13px] leading-5 text-[#d6deeb]"><input type="checkbox" defaultChecked className="mt-1 size-4 accent-[#159cff]" /> <span>Jeg accepterer <u className="text-[#51b5ff]">vilkår og privatlivspolitik</u>.</span></label>
    {error && <p className="mt-3 text-sm text-[#ff8290]" role="alert">{error}</p>}
  <button type="submit" className="mt-5 flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#138cff] text-[17px] font-bold shadow-[0_8px_22px_-10px_#138cff]">Opret konto <ArrowRight className="size-5" /></button>
    <div className="my-5 flex items-center gap-3 text-sm text-[#d7deeb]"><span className="h-px flex-1 bg-[#243650]" /> eller <span className="h-px flex-1 bg-[#243650]" /></div>
    <div className="space-y-3"><button type="button" className="min-h-12 w-full rounded-xl border border-[#344861] bg-[#0a1725] text-[15px]">Google&nbsp;&nbsp; Fortsæt med Google</button><button type="button" className="min-h-12 w-full rounded-xl border border-[#344861] bg-[#0a1725] text-[15px]">&nbsp;&nbsp; Fortsæt med Apple</button></div>
    <div className="mt-6 flex items-center gap-3 rounded-xl border border-[#123b61] bg-[#071a2b] p-3"><ShieldCheck className="size-9 shrink-0 text-[#159cff]" /><p className="text-[12px] text-[#cbd6e7]"><b className="text-[#159cff]">100% sikkert</b><br />Dine data er beskyttet og bruges kun til din konto.</p></div>
    <button type="button" onClick={onLogin} className="mt-5 min-h-11 w-full text-sm text-[#8cb3d9]">Har du allerede en konto? <span className="text-[#42aeff] underline">Log ind</span></button>
  </section></form>
}

function Field({ name, icon, label, type = 'text' }: { name: string; icon: React.ReactNode; label: string; type?: string }) { return <label className="flex h-12 items-center gap-3 rounded-xl border border-[#38506b] bg-[#081725] px-3"><span className="text-[#e3ebf8]">{icon}</span><input name={name} required type={type} placeholder={label} className="min-w-0 flex-1 bg-transparent text-[16px] text-white outline-none placeholder:text-[#e1e5ee]" /></label> }

function PlanStep({ plan, setPlan, onBack, onNext }: { plan: Plan; setPlan: (plan: Plan) => void; onBack: () => void; onNext: () => void }) {
  return <section className="pb-4">
    <div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#4db5ff]"><Sparkles className="size-4" /> BetTracker medlemskab</div>
    <h1 className="text-[30px] font-black leading-[1.08] tracking-[-0.03em]">Vælg dit abonnement</h1>
    <p className="mt-3 text-[17px] leading-6 text-[#cbd7e8]">Få 7 dage gratis. Opsig når som helst.</p>
    <div className="mt-7 space-y-3">
      <PlanCard id="premium" selected={plan === 'premium'} onClick={() => setPlan('premium')} popular />
      <PlanCard id="basis" selected={plan === 'basis'} onClick={() => setPlan('basis')} />
    </div>
    <div className="mt-5 grid grid-cols-3 divide-x divide-[#233e5d] rounded-2xl border border-[#183754] bg-[#071725] py-3 text-center text-[11px] text-[#cbd9e9]"><Mini icon="⌁" label="Ingen binding" detail="Opsig når som helst" /><Mini icon="✓" label="7 dage" detail="gratis prøve" /><Mini icon="▣" label="Sikker betaling" detail="via Stripe" /></div>
    <button type="button" onClick={onNext} className="mt-5 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(100deg,#168dff,#126be9)] text-[17px] font-bold shadow-[0_12px_28px_-12px_#159cff]">Fortsæt med {plans[plan].name} <ArrowRight className="size-5" /></button>
    <button type="button" onClick={onBack} className="mt-1 min-h-10 w-full text-sm text-[#8cb3d9]">Tilbage</button>
  </section>
}

function PlanCard({ id, selected, onClick, popular = false }: { id: Plan; selected: boolean; onClick: () => void; popular?: boolean }) {
  const p = plans[id]
  const features = id === 'premium' ? ['Alle SikkerBets + SMS-alerts', 'Live odds', 'Oddsberegner', 'Favoritter', 'Statistik'] : ['SikkerBets op til 5% margin', 'Live odds', 'Oddsberegner', 'Favoritter', 'Statistik']
  return <button type="button" onClick={onClick} className={`relative w-full rounded-2xl border p-4 text-left transition-colors ${selected ? 'border-[#159cff] bg-[linear-gradient(145deg,#0b2945,#071b30)] shadow-[0_0_28px_-12px_#159cff]' : 'border-[#263f5a] bg-[#071522]'}`}>
    {popular && <span className="absolute -top-3 right-4 rounded-full bg-[#118cff] px-3 py-1.5 text-[11px] font-bold shadow-[0_5px_15px_-5px_#159cff]">Mest populær</span>}
    <div className="flex items-center gap-3"><span className={`flex size-11 items-center justify-center rounded-xl ${id === 'premium' ? 'bg-[#123d62] text-[#ffd532]' : 'bg-[#10263a] text-[#86a0ba]'}`}>{id === 'premium' ? <Crown className="size-6" /> : <span className="text-2xl">◇</span>}</span><span className="flex-1"><span className="block text-[15px] font-black uppercase tracking-wide">{p.name}</span><span className="mt-0.5 block text-[13px] text-[#a8c0d8]">{id === 'premium' ? 'Maksimal værdi' : 'Det enkle valg'}</span></span><span className="text-right"><span className="block text-[25px] font-black leading-none">{p.price}<small className="ml-1 text-[12px] font-medium text-[#b5c6d9]">kr./md.</small></span><span className="mt-1 block text-[12px] font-bold text-[#ffd32a]">7 dage gratis</span></span></div>
    <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-white/10 pt-3 text-[12px] text-[#dce7f4]">{features.map((feature) => <li key={feature} className="flex items-center gap-1.5"><Check className="size-4 shrink-0 text-[#35adff]" />{feature}</li>)}</ul>
  </button>
}
function Mini({ icon, label, detail }: { icon: string; label: string; detail: string }) { return <div><div className="mx-auto mb-2 flex size-9 items-center justify-center rounded-full border border-[#145e91] text-lg text-[#36aaff]">{icon}</div><b>{label}</b><br />{detail}</div> }

function PaymentStep({ plan, onBack, onSubmit }: { plan: typeof plans[Plan]; onBack: () => void; onSubmit: () => void }) { return <section><h1 className="text-[27px] font-extrabold leading-tight">Betalingsoplysninger</h1><p className="mt-2 text-[16px] leading-6 text-[#e2e7f1]">Du betaler ikke i dag.<br />Din 7 dages gratis prøve starter nu, og herefter {plan.price} kr./md.</p><div className="mt-7 flex rounded-xl border border-[#334a66] bg-[#071624] p-1"><button className="min-h-11 flex-1 rounded-lg bg-white text-sm font-bold text-[#172131]" type="button"><CreditCard className="mr-2 inline size-4" />Kort</button><button className="min-h-11 flex-1 text-sm text-[#a9bed7]" type="button">MobilePay</button></div><div className="mt-5 space-y-3"><Field name="cardNumber" label="Kortnummer" icon={<CreditCard />} /><div className="grid grid-cols-2 gap-3"><Field name="expiry" label="Udløbsdato" icon={<span>◫</span>} /><Field name="cvc" label="CVC" icon={<span>•••</span>} /></div><Field name="cardName" label="Navn på kort" icon={<UserRound />} /></div><label className="mt-5 flex items-start gap-2 text-[13px] text-[#d7deeb]"><input type="checkbox" defaultChecked className="mt-1 size-4 accent-[#159cff]" /> Gem kortoplysninger til fremtidige betalinger</label><button type="button" onClick={onSubmit} className="mt-6 flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#138cff] text-[17px] font-bold">Start 7 dage gratis <ArrowRight className="size-5" /></button><button type="button" onClick={onBack} className="mt-2 min-h-11 w-full text-sm text-[#8cb3d9]">Tilbage</button><p className="mt-5 text-center text-[12px] leading-5 text-[#c3cede]">Du bliver ikke trukket i dag.<br />Abonnementet starter automatisk efter 7 dage. Du kan opsige når som helst.</p></section> }
function SuccessState({ plan }: { plan: typeof plans[Plan] }) { return <section className="pt-16 text-center"><div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#159cff] text-[#04111e]"><Check className="size-8" /></div><h1 className="mt-5 text-[27px] font-extrabold">Du er klar</h1><p className="mt-2 text-[#dce5f2]">Din {plan.name}-prøveperiode er startet. God fornøjelse med BetTracker.</p><Link href="/" className="mt-7 flex min-h-13 items-center justify-center rounded-xl bg-[#138cff] text-[17px] font-bold">Gå til BetTracker</Link></section> }
