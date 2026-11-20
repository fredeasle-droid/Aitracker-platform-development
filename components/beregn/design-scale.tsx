'use client'

import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

const CANVAS_WIDTH = 1248

// Runs during HTML parsing so the canvas is scaled before first paint, not only after hydration.
const PRE_PAINT = `(function(s){var e=s.parentElement;if(e&&e.clientWidth)e.style.setProperty('--ds',String(e.clientWidth/${CANVAS_WIDTH}))})(document.currentScript)`

/** Draws children on the mock-up's fixed 1248px canvas and scales it to the available width. */
export function DesignScale({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      if (el.clientWidth) el.style.setProperty('--ds', String(el.clientWidth / CANVAS_WIDTH))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={ref} className={cn('min-w-0', className)} suppressHydrationWarning>
      <div className="bi-canvas relative">{children}</div>
      <script dangerouslySetInnerHTML={{ __html: PRE_PAINT }} />
    </div>
  )
}
