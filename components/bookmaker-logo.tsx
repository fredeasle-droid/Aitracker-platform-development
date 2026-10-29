'use client'

import { useState } from 'react'
import { getBookmaker } from '@/lib/bookmakers'
import { cn } from '@/lib/utils'

export function BookmakerLogo({ name, className }: { name: string; className?: string }) {
  const brand = getBookmaker(name)
  const [failed, setFailed] = useState(false)
  const showLogo = brand.logo && !failed

  if (!showLogo) {
    return (
      <span
        aria-hidden="true"
        className={cn('flex size-11 shrink-0 items-center justify-center font-black leading-none text-[#f3f6fc]', className)}
      >
        <span className="text-[0.9em] tracking-tight">{brand.mark}</span>
      </span>
    )
  }

  return (
    <span aria-hidden="true" className={cn('flex size-11 shrink-0 items-center justify-center overflow-hidden', className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={brand.logo}
        alt=""
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        ref={(el) => {
          // The image can fail before hydration attaches onError.
          if (el?.complete && el.naturalWidth === 0) setFailed(true)
        }}
        className={cn(
          'size-full object-cover',
          brand.inset && 'object-contain',
          brand.small && 'object-contain [image-rendering:pixelated]',
          brand.favicon && 'rounded-[22%] object-contain',
        )}
      />
    </span>
  )
}
