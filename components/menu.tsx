'use client'

import { useId, useState, type ReactNode } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Popover({
  trigger,
  children,
  align = 'left',
  label,
  triggerClassName,
  panelClassName,
}: {
  trigger: ReactNode
  children: (close: () => void) => ReactNode
  align?: 'left' | 'right'
  label: string
  triggerClassName?: string
  panelClassName?: string
}) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const close = () => setOpen(false)

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={id}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => e.key === 'Escape' && close()}
        className={triggerClassName}
      >
        {trigger}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" aria-hidden="true" onClick={close} />
          <div
            id={id}
            onKeyDown={(e) => e.key === 'Escape' && close()}
            className={cn(
              'absolute top-full z-50 mt-2 min-w-48 overflow-hidden rounded-2xl border border-border bg-popover p-1.5 shadow-2xl shadow-black/60',
              align === 'right' ? 'right-0' : 'left-0',
              panelClassName,
            )}
          >
            {children(close)}
          </div>
        </>
      )}
    </div>
  )
}

export function MenuOption({
  selected,
  onSelect,
  children,
}: {
  selected: boolean
  onSelect: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        'flex min-h-11 w-full items-center justify-between gap-3 rounded-xl px-3 text-left text-[15px] transition-colors hover:bg-accent',
        selected ? 'text-primary' : 'text-foreground',
      )}
    >
      {children}
      {selected && <Check className="size-4" />}
    </button>
  )
}
