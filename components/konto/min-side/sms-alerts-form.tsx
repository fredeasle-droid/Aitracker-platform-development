'use client'

import { useState } from 'react'
import { MessageSquareText } from 'lucide-react'
import { saveSmsSettings, type SmsSettingsInput } from '@/app/konto/sms-actions'
import { Card, FieldLabel, Message, inputClass, primaryButton } from './ui'

const PRESETS = [3, 5, 10, 15]
const HOURS = Array.from({ length: 24 }, (_, h) => h)
const hourLabel = (h: number) => `${String(h).padStart(2, '0')}:00`

export function SmsAlertsForm({ initial, hasPhone, isSubscriber }: { initial: SmsSettingsInput; hasPhone: boolean; isSubscriber: boolean }) {
  const [settings, setSettings] = useState(initial)
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)
  const update = <K extends keyof SmsSettingsInput>(key: K, value: SmsSettingsInput[K]) => setSettings((s) => ({ ...s, [key]: value }))

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(null)
    setPending(true)
    try {
      const result = await saveSmsSettings(settings)
      setMessage(result.ok ? { kind: 'ok', text: settings.enabled ? 'SMS-alerts er slået til.' : 'Dine SMS-indstillinger er gemt.' } : { kind: 'error', text: result.error })
    } catch {
      setMessage({ kind: 'error', text: 'Der opstod en forbindelsesfejl. Prøv igen.' })
    } finally {
      setPending(false)
    }
  }

  return (
    <Card title="SMS-alerts" icon={<MessageSquareText />}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <label className="flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-xl border border-[#38506b] bg-[#081725] px-3">
          <span className="flex flex-col">
            <span className="text-[15px] font-semibold text-white">Send mig en SMS</span>
            <span className="text-[12px] text-[#9fb3cc]">Når vi finder et surebet over din grænse</span>
          </span>
          <input
            type="checkbox"
            role="switch"
            checked={settings.enabled}
            onChange={(e) => update('enabled', e.target.checked)}
            className="peer sr-only"
          />
          <span aria-hidden="true" className="relative h-7 w-12 shrink-0 rounded-full bg-[#2a3d55] transition-colors peer-checked:bg-[#138cff] peer-focus-visible:ring-2 peer-focus-visible:ring-[#159cff] after:absolute after:left-1 after:top-1 after:size-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5" />
        </label>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1.5 text-[13px] font-medium text-[#b5c6d9]">Minimum profit</legend>
          <div className="flex gap-2">
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                aria-pressed={settings.minProfit === p}
                onClick={() => update('minProfit', p)}
                className={`min-h-11 flex-1 rounded-xl border text-[14px] font-bold ${settings.minProfit === p ? 'border-[#138cff] bg-[#0b2945] text-[#8dd0ff]' : 'border-[#38506b] bg-[#081725] text-[#c9d6e6] hover:bg-[#102744]'}`}
              >
                {p}%
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              inputMode="decimal"
              min={1}
              max={50}
              step={0.5}
              aria-label="Egen profitgrænse i procent"
              value={settings.minProfit}
              onChange={(e) => update('minProfit', Number(e.target.value))}
              className={inputClass}
            />
            <span className="text-[15px] font-bold text-[#c9d6e6]">%</span>
          </div>
        </fieldset>

        <FieldLabel label="Maks SMS pr. døgn">
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={30}
            value={settings.dailyLimit}
            onChange={(e) => update('dailyLimit', Number(e.target.value))}
            className={inputClass}
          />
        </FieldLabel>

        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] font-medium text-[#b5c6d9]">Stille timer (ingen SMS)</span>
          <div className="flex items-center gap-2">
            <select aria-label="Stille timer starter" value={settings.quietStart} onChange={(e) => update('quietStart', Number(e.target.value))} className={inputClass}>
              {HOURS.map((h) => <option key={h} value={h}>{hourLabel(h)}</option>)}
            </select>
            <span className="text-[#9fb3cc]">–</span>
            <select aria-label="Stille timer slutter" value={settings.quietEnd} onChange={(e) => update('quietEnd', Number(e.target.value))} className={inputClass}>
              {HOURS.map((h) => <option key={h} value={h}>{hourLabel(h)}</option>)}
            </select>
          </div>
        </div>

        {!hasPhone && <p className="text-[12px] leading-5 text-[#ffcf6b]">Tilføj dit mobilnummer under &quot;Mine oplysninger&quot; for at modtage SMS.</p>}
        {!isSubscriber && <p className="text-[12px] leading-5 text-[#ffcf6b]">SMS-alerts sendes kun til medlemmer med aktivt abonnement.</p>}
        <p className="text-[12px] leading-5 text-[#9fb3cc]">Du får højst én SMS pr. surebet, og aldrig mere end din daglige grænse.</p>

        <button type="submit" disabled={pending} className={primaryButton}>{pending ? 'Gemmer…' : 'Gem SMS-indstillinger'}</button>
        {message && <Message kind={message.kind}>{message.text}</Message>}
      </form>
    </Card>
  )
}
