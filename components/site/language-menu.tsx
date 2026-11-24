'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { FlagImage } from '@/components/flag-image'
import { useLocale } from '@/components/locale-provider'
import { LOCALES, type Locale } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const LOCALE_OPTIONS = Object.entries(LOCALES) as [Locale, (typeof LOCALES)[Locale]][]

export function LanguageMenu({ className }: { className?: string }) {
  const { locale, setLocale } = useLocale()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = LOCALES[locale]

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`${current.label} – ${current.countryCode}`}
        className="flex h-10 items-center gap-2 rounded-full border border-border bg-background-deep/70 px-2.5 text-[13px] font-semibold text-foreground transition-colors hover:bg-card md:h-9 md:px-3"
      >
        <FlagImage code={current.countryCode.toLowerCase()} label="" className="size-5" />
        <span className="hidden sm:inline">{current.countryCode}</span>
        <ChevronDown className={cn('hidden size-4 text-muted-foreground transition-transform sm:block', open && 'rotate-180')} aria-hidden="true" />
      </button>
      {open && (
        <div
          role="listbox"
          aria-label="Sprog"
          className="absolute right-0 top-full z-50 mt-2 max-h-[min(70vh,28rem)] w-56 overflow-y-auto overscroll-contain rounded-xl border border-border bg-background-deep p-1.5 shadow-xl"
        >
          {LOCALE_OPTIONS.map(([code, option]) => {
            const selected = code === locale
            return (
              <button
                key={code}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  setLocale(code)
                  setOpen(false)
                }}
                className={cn(
                  'flex min-h-10 w-full items-center gap-2.5 rounded-lg px-2.5 text-left text-sm transition-colors hover:bg-card',
                  selected ? 'bg-card font-semibold text-foreground' : 'text-foreground/85',
                )}
              >
                <FlagImage code={option.countryCode.toLowerCase()} label="" className="size-5" />
                <span className="flex-1">{option.label}</span>
                {selected && <Check className="size-4 text-primary-glow" aria-hidden="true" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
