'use client'

import { useState, useSyncExternalStore } from 'react'
import { Check, ChevronDown, Download, Smartphone } from 'lucide-react'
import { IosInstallGuide, isIos } from '@/components/push/ios-install-guide'
import { cn } from '@/lib/utils'

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

type InstallState = { mode: 'hidden' | 'prompt' | 'ios' | 'installed' }

const SERVER_STATE: InstallState = { mode: 'hidden' }
let deferredPrompt: InstallPromptEvent | null = null
let state: InstallState = SERVER_STATE
const listeners = new Set<() => void>()

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

function computeState(): InstallState {
  if (isStandalone()) return { mode: 'installed' }
  if (deferredPrompt) return { mode: 'prompt' }
  if (isIos()) return { mode: 'ios' }
  return SERVER_STATE
}

function refresh() {
  const next = computeState()
  if (next.mode === state.mode) return
  state = next
  listeners.forEach((listener) => listener())
}

if (typeof window !== 'undefined') {
  state = computeState()
  // The browser fires this once, early, so it must be captured before any component mounts.
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    deferredPrompt = event as InstallPromptEvent
    refresh()
  })
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null
    refresh()
  })
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function useInstallApp() {
  const current = useSyncExternalStore(subscribe, () => state, () => SERVER_STATE)

  async function install() {
    if (!deferredPrompt) return
    const prompt = deferredPrompt
    await prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') deferredPrompt = null
    refresh()
  }

  return { mode: current.mode, install }
}

const GUIDE_TITLE = 'Sådan installerer du på iPhone'

/** Row for the side menus. Hidden when the app can't be installed or already is. */
export function InstallAppMenuItem({ className }: { className?: string }) {
  const { mode, install } = useInstallApp()
  const [open, setOpen] = useState(false)
  if (mode === 'hidden' || mode === 'installed') return null

  return (
    <div className={className}>
      <button
        type="button"
        onClick={mode === 'prompt' ? install : () => setOpen((v) => !v)}
        aria-expanded={mode === 'ios' ? open : undefined}
        className="flex min-h-11 w-full items-center gap-3.5 rounded-xl border border-primary/40 bg-primary/10 px-4 text-left text-[15px] font-semibold text-primary-glow transition-colors hover:bg-primary/20"
      >
        <Download className="size-5 shrink-0" aria-hidden="true" />
        <span className="flex-1">Installer app</span>
        {mode === 'ios' && <ChevronDown className={cn('size-4 transition-transform', open && 'rotate-180')} aria-hidden="true" />}
      </button>
      {mode === 'ios' && open && (
        <IosInstallGuide
          title={GUIDE_TITLE}
          className="mt-2 rounded-xl border border-border bg-card/60 p-3 text-foreground/90"
          titleClassName="text-primary-glow"
        />
      )}
    </div>
  )
}

/** Section shown next to the push and SMS settings. */
export function InstallAppSection() {
  const { mode, install } = useInstallApp()
  if (mode === 'hidden') return null

  return (
    <section aria-labelledby="install-app-title" className="mt-4 rounded-lg border border-border bg-surface-elevated/40 p-3">
      <div className="flex items-center gap-2">
        <Smartphone className="size-4 text-primary-glow" aria-hidden="true" />
        <h3 id="install-app-title" className="text-[14px] font-bold">
          BetTracker som app
        </h3>
      </div>

      {mode === 'installed' ? (
        <p className="mt-2 flex items-center gap-1.5 text-[12.5px] leading-5 text-success">
          <Check className="size-4" aria-hidden="true" /> Appen er installeret på denne enhed.
        </p>
      ) : (
        <>
          <p className="mt-1.5 text-[12.5px] leading-5 text-muted-foreground">
            Læg BetTracker på din hjemmeskærm. Den åbner som en app, og push-alarmer kommer frem med det samme.
          </p>
          {mode === 'prompt' ? (
            <button
              type="button"
              onClick={install}
              className="mt-3 flex min-h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-bold text-primary-foreground transition hover:brightness-110"
            >
              <Download className="size-4" aria-hidden="true" /> Installer app
            </button>
          ) : (
            <IosInstallGuide title={GUIDE_TITLE} className="mt-3 text-foreground/90" titleClassName="text-primary-glow" />
          )}
        </>
      )}
    </section>
  )
}
