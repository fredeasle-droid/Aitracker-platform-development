'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Flag } from '@/components/flag'

export function FlagImage({ code, label, className }: { code: string; label: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  const normalized = code.trim().toLowerCase()

  if (!normalized || failed) return <Flag code={normalized} label={label} className={className} />

  return (
    <img
      src={`https://flagcdn.com/w80/${normalized}.png`}
      alt={label}
      loading="lazy"
      onError={() => setFailed(true)}
      ref={(el) => {
        // The image can fail before hydration attaches onError.
        if (el?.complete && el.naturalWidth === 0) setFailed(true)
      }}
      className={cn('size-5 shrink-0 rounded-full object-cover', className)}
    />
  )
}
