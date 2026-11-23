'use client'

import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { removePushSubscription, savePushSettings, savePushSubscription, sendTestPush, type PushSettingsInput } from '@/app/konto/push-actions'
import { IosInstallGuide, isIos } from '@/components/push/ios-install-guide'
import { Card, FieldLabel, Message, inputClass, primaryButton, secondaryButton } from './ui'

const PRESETS = [15, 20, 25, 30]
const HOURS = Array.from({ length: 24 }, (_, h) => h)
const hourLabel = (h: number) => `${String(h).padStart(2, '0')}:00`

type Status = 'checking' | 'unsupported' | 'blocked' | 'off' | 'on'

function urlBase64ToBytes(value: string) {
  const padded = value + '='.repeat((4 - (value.length % 4)) % 4)
  const raw = atob(padded.replace(/-/g, '+').replace(/_/g, '/'))
  return Uint8Array.from(raw, (c) => c.charCodeAt(0))
}

function Switch({ checked, onChange, title, hint }: { checked: boolean; onChange: (value: boolean) => void; title: string; hint: string }) {
  return (
    <label className="flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-xl border border-[#38506b] bg-[#081725] px-3 py-2">
      <span className="flex flex-col">
        <span className="text-[15px] font-semibold text-white">{title}</span>
        <span className="text-[12px] text-[#9fb3cc]">{hint}</span>
      </span>
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span aria-hidden="true" className="relative h-7 w-12 shrink-0 rounded-full bg-[#2a3d55] transition-colors peer-checked:bg-[#138cff] peer-focus-visible:ring-2 peer-focus-visible:ring-[#159cff] after:absolute after:left-1 after:top-1 after:size-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5" />
    </label>
  )
}

export function PushAlertsForm({ initial, isSubscriber }: { initial: PushSettingsInput; isSubscriber: boolean }) {
  const [settings, setSettings] = useState(initial)
  const [status, setStatus] = useState<Status>('checking')
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)
  const update = <K extends keyof PushSettingsInput>(key: K, value: PushSettingsInput[K]) => setSettings((s) => ({ ...s, [key]: value }))

  useEffect(() => {
    let cancelled = false
    async function detect() {
      if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) return 'unsupported'
      if (Notification.permission === 'denied') return 'blocked'
      const registration = await navigator.serviceWorker.getRegistration('/sw.js')
      const existing = await registration?.pushManager.getSubscription()
      return existing ? 'on' : 'off'
    }
    detect().then((next) => !cancelled && setStatus(next as Status)).catch(() => !cancelled && setStatus('unsupported'))
    return () => {
      cancelled = true
    }
  }, [])

  async function enable() {
    setMessage(null)
    setPending(true)
    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        setStatus(permission === 'denied' ? 'blocked' : 'off')
        setMessage({ kind: 'error', text: 'Du skal trykke "Tillad" i browseren for at få notifikationer.' })
        return
      }
      const registration = await navigator.serviceWorker.register('/sw.js')
      await navigator.serviceWorker.ready
      const { publicKey } = (await (await fetch('/api/push/key')).json()) as { publicKey: string }
      const subscription =
        (await registration.pushManager.getSubscription()) ??
        (await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToBytes(publicKey) }))
      const json = subscription.toJSON()
      const result = await savePushSubscription({
        endpoint: subscription.endpoint,
        p256dh: json.keys?.p256dh ?? '',
        auth: json.keys?.auth ?? '',
        userAgent: navigator.userAgent,
      })
      if (!result.ok) {
        setMessage({ kind: 'error', text: result.error })
        return
      }
      setStatus('on')
      setMessage({ kind: 'ok', text: 'Notifikationer er slået til på denne enhed.' })
    } catch {
      setMessage({ kind: 'error', text: 'Kunne ikke slå notifikationer til. Prøv igen.' })
    } finally {
      setPending(false)
    }
  }

  async function disable() {
    setMessage(null)
    setPending(true)
    try {
      const registration = await navigator.serviceWorker.getRegistration('/sw.js')
      const subscription = await registration?.pushManager.getSubscription()
      if (subscription) {
        await removePushSubscription(subscription.endpoint)
        await subscription.unsubscribe()
      }
      setStatus('off')
      setMessage({ kind: 'ok', text: 'Notifikationer er slået fra på denne enhed.' })
    } catch {
      setMessage({ kind: 'error', text: 'Kunne ikke slå notifikationer fra. Prøv igen.' })
    } finally {
      setPending(false)
    }
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(null)
    setPending(true)
    try {
      const result = await savePushSettings(settings)
      setMessage(result.ok ? { kind: 'ok', text: 'Dine notifikationer er gemt.' } : { kind: 'error', text: result.error })
    } catch {
      setMessage({ kind: 'error', text: 'Der opstod en forbindelsesfejl. Prøv igen.' })
    } finally {
      setPending(false)
    }
  }

  async function test() {
    setMessage(null)
    setPending(true)
    try {
      const result = await sendTestPush()
      setMessage(result.ok ? { kind: 'ok', text: result.message ?? 'Sendt.' } : { kind: 'error', text: result.error })
    } finally {
      setPending(false)
    }
  }

  return (
    <Card title="Push-notifikationer" icon={<Bell />}>
      {status === 'checking' && <p className="text-[13px] text-[#9fb3cc]">Tjekker din enhed…</p>}

      {status === 'unsupported' &&
        (isIos() ? (
          <IosInstallGuide className="rounded-xl border border-[#ffcf6b]/40 bg-[#ffcf6b]/10 p-3 text-[#dbe6f3]" titleClassName="text-[#ffcf6b]" />
        ) : (
          <p className="text-[13px] leading-5 text-[#ffcf6b]">Din browser understøtter ikke push-notifikationer. Prøv Chrome, Edge, Firefox eller Safari.</p>
        ))}

      {status === 'blocked' && (
        <p className="text-[13px] leading-5 text-[#ffcf6b]">Notifikationer er blokeret i din browser. Tillad dem i browserens indstillinger for siden, og genindlæs.</p>
      )}

      {status === 'off' && (
        <div className="flex flex-col gap-3">
          <p className="text-[13px] leading-5 text-[#9fb3cc]">Få besked med det samme i din browser, når der er et surebet over din grænse, samt tilbud og nyheder, hvis du vælger det. Gratis.</p>
          <button type="button" onClick={enable} disabled={pending} className={primaryButton}>
            {pending ? 'Slår til…' : 'Slå notifikationer til'}
          </button>
        </div>
      )}

      {status === 'on' && (
        <form onSubmit={save} className="flex flex-col gap-4">
          <Switch checked={settings.alertsEnabled} onChange={(v) => update('alertsEnabled', v)} title="Surebet-alarm" hint="Når vi finder et surebet over din grænse" />
          <Switch checked={settings.offersEnabled} onChange={(v) => update('offersEnabled', v)} title="Tilbud" hint="Bonusser og kampagner fra bookmakerne" />
          <Switch checked={settings.newsEnabled} onChange={(v) => update('newsEnabled', v)} title="Nyheder" hint="Nye funktioner og vigtige beskeder fra os" />

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
              <input type="number" inputMode="decimal" min={1} max={50} step={0.5} aria-label="Egen profitgrænse i procent" value={settings.minProfit} onChange={(e) => update('minProfit', Number(e.target.value))} className={inputClass} />
              <span className="text-[15px] font-bold text-[#c9d6e6]">%</span>
            </div>
          </fieldset>

          <FieldLabel label="Maks notifikationer pr. døgn">
            <input type="number" inputMode="numeric" min={1} max={100} value={settings.dailyLimit} onChange={(e) => update('dailyLimit', Number(e.target.value))} className={inputClass} />
          </FieldLabel>

          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-[#b5c6d9]">Stille timer (ingen alarmer)</span>
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

          {!isSubscriber && <p className="text-[12px] leading-5 text-[#ffcf6b]">Surebet-alarmer sendes kun til medlemmer med aktivt abonnement.</p>}
          <p className="text-[12px] leading-5 text-[#9fb3cc]">Du får højst én notifikation pr. surebet, og aldrig mere end din daglige grænse.</p>

          <button type="submit" disabled={pending} className={primaryButton}>{pending ? 'Gemmer…' : 'Gem notifikationer'}</button>
          <div className="flex gap-2">
            <button type="button" onClick={test} disabled={pending} className={secondaryButton}>Send test</button>
            <button type="button" onClick={disable} disabled={pending} className={secondaryButton}>Slå fra her</button>
          </div>
        </form>
      )}

      {message && <Message kind={message.kind}>{message.text}</Message>}
    </Card>
  )
}
