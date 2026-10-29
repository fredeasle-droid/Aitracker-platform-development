'use client'

import { useState } from 'react'
import { getBookmaker } from '@/lib/bookmakers'
import { cn } from '@/lib/utils'

export function BookmakerLogo({ name, className }: { name: string; className?: string }) {
  const brand = getBookmaker(name)
  const [failed, setFailed] = useState(false)
  const showLogo = brand.logo && !failed

  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl font-black leading-none',
        className,
      )}
      style={{ background: brand.bg, color: brand.fg }}
    >
      {showLogo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={brand.logo}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className={cn(
            'size-full object-cover',
            brand.inset && 'p-[22%] object-contain',
            brand.small && 'p-[30%] object-contain [image-rendering:pixelated]',
            brand.favicon && 'rounded-[22%] p-[16%] object-contain',
          )}
        />
      ) : (
        <span className="text-[0.9em]">{brand.mark}</span>
      )}
    </span>
  )
}
