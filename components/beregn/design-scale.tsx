'use client'

import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

const CANVAS_WIDTH = 1248
// Uncapped it grew far too large on wide screens, at 1 it looked small; 1.2 is the middle ground, canvas stays centred beyond it.
const MAX_SCALE = 1.2

// Runs during HTML parsing so the canvas is scaled before first paint, not only after hydration.
const PRE_PAINT = `(function(s){var e=s.parentElement;if(e&&e.clientWidth)e.style.setProperty('--ds',String(Math.min(${MAX_SCALE},e.clientWidth/${CANVAS_WIDTH})))})(document.currentScript)`

/** Draws children on the mock-up's 1248px canvas, shrinks it to fit narrow widths and centres it on wide ones. */
export function DesignScale({
  children,
  className,
  backdrop,
}: {
  children: ReactNode
  className?: string
  /** Full-width layer behind the canvas; use `calc(Npx * var(--ds))` for heights that follow the scale. */
  backdrop?: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      if (el.clientWidth) el.style.setProperty('--ds', String(Math.min(MAX_SCALE, el.clientWidth / CANVAS_WIDTH)))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={ref} className={cn('min-w-0', className)} suppressHydrationWarning>
      {backdrop}
      <div className="relative flex justify-center">
        <div className="bi-canvas relative shrink-0">{children}</div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: PRE_PAINT }} />
    </div>
  )
}
