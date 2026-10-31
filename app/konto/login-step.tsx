'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, LockKeyhole, ShieldCheck } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { useLocale } from '@/components/locale-provider'


type Props = { onBack: () => void; onNext: () => void }

export function LoginStep({ onBack, onNext }: Props) {
  const { t } = useLocale()
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    const data = new FormData(event.currentTarget)
    try {
      const result = await authClient.signIn.email({ email: String(data.get('email')), password: String(data.get('password')) })
      if (result.error) { setError(t('loginFailed')); return }
      onNext()
    } catch {
      setError(t('connError'))
    } finally {
      setIsSubmitting(false)
    }
  }
  return <form onSubmit={submit}><section>
    <h1 className="text-[27px] font-extrabold leading-tight">{t('loginTitle')}</h1>
    <p className="mt-2 text-[16px] leading-6 text-[#e2e7f1]">{t('welcomeBack')}</p>
    <div className="mt-7 space-y-3">
      <label className="flex h-12 items-center gap-3 rounded-xl border border-[#38506b] bg-[#081725] px-3"><span className="text-lg text-[#e3ebf8]">@</span><input name="email" required type="email" placeholder={t('email')} className="min-w-0 flex-1 bg-transparent text-[16px] text-white outline-none placeholder:text-[#e1e5ee]" /></label>
      <label className="flex h-12 items-center gap-3 rounded-xl border border-[#38506b] bg-[#081725] px-3"><LockKeyhole className="size-5" /><input name="password" required type="password" placeholder={t('password')} className="min-w-0 flex-1 bg-transparent text-[16px] text-white outline-none placeholder:text-[#e1e5ee]" /></label>
    </div>
    <label className="mt-3 flex items-center gap-2 text-sm text-[#d6deeb]"><input type="checkbox" defaultChecked className="size-4 accent-[#159cff]" /> {t('rememberMe')} <span className="ml-auto text-[#42aeff] underline">{t('forgotPassword')}</span></label>
    {error && <p className="mt-3 text-sm text-[#ff8290]" role="alert">{error}</p>}
    <button type="submit" disabled={isSubmitting} className="mt-5 flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#138cff] text-[17px] font-bold disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? t('loggingIn') : t('loginTitle')} {!isSubmitting && <ArrowRight className="size-5" />}</button>
    <div className="mt-6 flex items-center gap-3 rounded-xl border border-[#123b61] bg-[#071a2b] p-3"><ShieldCheck className="size-9 shrink-0 text-[#159cff]" /><p className="text-[12px] text-[#cbd6e7]"><b className="text-[#159cff]">{t('secure100')}</b><br />{t('dataProtected')}</p></div>
    <button type="button" onClick={onBack} className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 text-sm text-[#8cb3d9]"><ArrowLeft className="size-4" /> {t('noAccount')} <span className="text-[#42aeff] underline">{t('createFreeAccount')}</span></button>
  </section></form>
}
