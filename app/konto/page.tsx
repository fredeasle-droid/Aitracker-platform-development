'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, CreditCard, LockKeyhole, ShieldCheck, UserRound, X } from 'lucide-react'
import { LoginStep } from './login-step'

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

        {submitted ? <SuccessState plan={plans[plan]} /> : step === 1 ? (loginMode ? <LoginStep onBack={() => setLoginMode(false)} onNext={() => setStep(2)} /> : <SignupStep onNext={() => setStep(2)} onLogin={() => setLoginMode(true)} />) : step === 2 ? <PlanStep plan={plan} setPlan={setPlan} onBack={() => setStep(1)} onNext={() => setStep(3)} /> : <PaymentStep plan={plans[plan]} onBack={() => setStep(2)} onSubmit={() => setSubmitted(true)} />}
      </div>
    </main>
  )
}

function SignupStep({ onNext, onLogin }: { onNext: () => void; onLogin: () => void }) {
  return <section>
    <h1 className="text-[27px] font-extrabold leading-tight">Opret gratis konto</h1>
    <p className="mt-2 text-[16px] leading-6 text-[#e2e7f1]">Få 7 dages gratis adgang til alle funktioner. Ingen binding.</p>
    <div className="mt-7 space-y-3">
      <Field icon={<UserRound />} label="Brugernavn" />
      <Field icon={<span className="text-[22px]">@</span>} label="Email" type="email" />
      <Field icon={<LockKeyhole />} label="Adgangskode" type="password" />
    </div>
    <label className="mt-5 flex items-start gap-2 text-[13px] leading-5 text-[#d6deeb]"><input type="checkbox" defaultChecked className="mt-1 size-4 accent-[#159cff]" /> <span>Jeg accepterer <u className="text-[#51b5ff]">vilkår og privatlivspolitik</u>.</span></label>
    <button type="button" onClick={onNext} className="mt-5 flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#138cff] text-[17px] font-bold shadow-[0_8px_22px_-10px_#138cff]">Opret konto <ArrowRight className="size-5" /></button>
    <div className="my-5 flex items-center gap-3 text-sm text-[#d7deeb]"><span className="h-px flex-1 bg-[#243650]" /> eller <span className="h-px flex-1 bg-[#243650]" /></div>
    <div className="space-y-3"><button type="button" className="min-h-12 w-full rounded-xl border border-[#344861] bg-[#0a1725] text-[15px]">Google&nbsp;&nbsp; Fortsæt med Google</button><button type="button" className="min-h-12 w-full rounded-xl border border-[#344861] bg-[#0a1725] text-[15px]">&nbsp;&nbsp; Fortsæt med Apple</button></div>
    <div className="mt-6 flex items-center gap-3 rounded-xl border border-[#123b61] bg-[#071a2b] p-3"><ShieldCheck className="size-9 shrink-0 text-[#159cff]" /><p className="text-[12px] text-[#cbd6e7]"><b className="text-[#159cff]">100% sikkert</b><br />Dine data er beskyttet og bruges kun til din konto.</p></div>
    <button type="button" onClick={onLogin} className="mt-5 min-h-11 w-full text-sm text-[#8cb3d9]">Har du allerede en konto? <span className="text-[#42aeff] underline">Log ind</span></button>
  </section>
}

function Field({ icon, label, type = 'text' }: { icon: React.ReactNode; label: string; type?: string }) { return <label className="flex h-12 items-center gap-3 rounded-xl border border-[#38506b] bg-[#081725] px-3"><span className="text-[#e3ebf8]">{icon}</span><input required type={type} placeholder={label} className="min-w-0 flex-1 bg-transparent text-[16px] text-white outline-none placeholder:text-[#e1e5ee]" /></label> }

function PlanStep({ plan, setPlan, onBack, onNext }: { plan: Plan; setPlan: (plan: Plan) => void; onBack: () => void; onNext: () => void }) { return <section><h1 className="text-[27px] font-extrabold leading-tight">Vælg dit abonnement</h1><p className="mt-2 text-[16px] text-[#e2e7f1]">Få 7 dage gratis. Opsig når som helst.</p><div className="mt-7 grid grid-cols-2 gap-2"><PlanCard id="basis" selected={plan === 'basis'} onClick={() => setPlan('basis')} /><PlanCard id="premium" selected={plan === 'premium'} onClick={() => setPlan('premium')} popular /></div><div className="mt-6 grid grid-cols-3 gap-2 text-center text-[11px] text-[#e0e7f2]"><Mini icon="⌁" label="Ingen binding" detail="Opsig når som helst" /><Mini icon="✓" label="7 dage" detail="gratis prøve" /><Mini icon="▣" label="Sikker betaling" detail="via Stripe" /></div><button type="button" onClick={onNext} className="mt-7 flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#138cff] text-[17px] font-bold">Vælg {plans[plan].name} <ArrowRight className="size-5" /></button><button type="button" onClick={onBack} className="mt-2 min-h-11 w-full text-sm text-[#8cb3d9]">Tilbage</button></section> }

function PlanCard({ id, selected, onClick, popular = false }: { id: Plan; selected: boolean; onClick: () => void; popular?: boolean }) { const p = plans[id]; return <button type="button" onClick={onClick} className={`relative min-h-[475px] rounded-xl border p-3 text-left ${selected ? 'border-[#159cff] bg-[#092039] shadow-[0_0_24px_-10px_#159cff]' : 'border-[#29425c] bg-[#071522]'}`}>{popular && <span className="absolute -top-3 right-2 rounded-full bg-[#078eff] px-2 py-1 text-[10px] font-bold">Mest populær</span>}<div className="text-center"><div className="mt-3 text-3xl">{id === 'premium' ? '♛' : '◇'}</div><h2 className="mt-2 text-[16px] font-extrabold uppercase">{p.name}</h2><p className="mt-1 text-[25px] font-extrabold">{p.price}<span className="text-[13px] font-normal"> kr./md.</span></p><p className="mt-2 text-sm text-[#ffd32a]">7 dage gratis</p></div><ul className="mt-5 space-y-3 text-[12px] leading-4 text-[#e1e8f2]"><li><Check /> {p.detail}</li><li><Check /> Live odds</li><li><Check /> Oddsberegner</li><li><Check /> Favoritter</li><li><Check /> Statistik</li><li><Check /> Alle ligaer og lande</li>{id === 'premium' && <><li><Check /> SMS-alerts</li><li><Check /> Prioriteret support</li></>}</ul><span className="absolute bottom-3 left-3 right-3 rounded-lg border border-[#168eff] py-2 text-center text-sm font-bold">Vælg {p.name}</span></button> }
function Mini({ icon, label, detail }: { icon: string; label: string; detail: string }) { return <div><div className="mx-auto mb-2 flex size-9 items-center justify-center rounded-full border border-[#145e91] text-lg text-[#36aaff]">{icon}</div><b>{label}</b><br />{detail}</div> }

function PaymentStep({ plan, onBack, onSubmit }: { plan: typeof plans[Plan]; onBack: () => void; onSubmit: () => void }) { return <section><h1 className="text-[27px] font-extrabold leading-tight">Betalingsoplysninger</h1><p className="mt-2 text-[16px] leading-6 text-[#e2e7f1]">Du betaler ikke i dag.<br />Din 7 dages gratis prøve starter nu, og herefter {plan.price} kr./md.</p><div className="mt-7 flex rounded-xl border border-[#334a66] bg-[#071624] p-1"><button className="min-h-11 flex-1 rounded-lg bg-white text-sm font-bold text-[#172131]" type="button"><CreditCard className="mr-2 inline size-4" />Kort</button><button className="min-h-11 flex-1 text-sm text-[#a9bed7]" type="button">MobilePay</button></div><div className="mt-5 space-y-3"><Field label="Kortnummer" icon={<CreditCard />} /><div className="grid grid-cols-2 gap-3"><Field label="Udløbsdato" icon={<span>◫</span>} /><Field label="CVC" icon={<span>•••</span>} /></div><Field label="Navn på kort" icon={<UserRound />} /></div><label className="mt-5 flex items-start gap-2 text-[13px] text-[#d7deeb]"><input type="checkbox" defaultChecked className="mt-1 size-4 accent-[#159cff]" /> Gem kortoplysninger til fremtidige betalinger</label><button type="button" onClick={onSubmit} className="mt-6 flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#138cff] text-[17px] font-bold">Start 7 dage gratis <ArrowRight className="size-5" /></button><button type="button" onClick={onBack} className="mt-2 min-h-11 w-full text-sm text-[#8cb3d9]">Tilbage</button><p className="mt-5 text-center text-[12px] leading-5 text-[#c3cede]">Du bliver ikke trukket i dag.<br />Abonnementet starter automatisk efter 7 dage. Du kan opsige når som helst.</p></section> }
function SuccessState({ plan }: { plan: typeof plans[Plan] }) { return <section className="pt-16 text-center"><div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#159cff] text-[#04111e]"><Check className="size-8" /></div><h1 className="mt-5 text-[27px] font-extrabold">Du er klar</h1><p className="mt-2 text-[#dce5f2]">Din {plan.name}-prøveperiode er startet. God fornøjelse med BetTracker.</p><Link href="/" className="mt-7 flex min-h-13 items-center justify-center rounded-xl bg-[#138cff] text-[17px] font-bold">Gå til BetTracker</Link></section> }
