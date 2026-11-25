'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'
import { EXPLAINER_VIDEO } from '@/lib/video'

export function YoutubeFacade({ className = '' }: { className?: string }) {
  const [playing, setPlaying] = useState(false)

  return (
    <div className={`relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-card ${className}`}>
      {playing ? (
        <iframe
          src={`${EXPLAINER_VIDEO.embedUrl}?autoplay=1&rel=0`}
          title={EXPLAINER_VIDEO.title}
          allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Afspil video: ${EXPLAINER_VIDEO.title}`}
          className="group absolute inset-0 flex size-full items-center justify-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={EXPLAINER_VIDEO.thumbnailUrl}
            alt={`Forsidebillede til videoen ${EXPLAINER_VIDEO.title}`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover"
          />
          <span className="absolute inset-0 bg-background/30 transition-colors group-hover:bg-background/10" aria-hidden="true" />
          <span className="relative flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform group-hover:scale-105">
            <Play className="ml-0.5 size-7 fill-current" aria-hidden="true" />
          </span>
        </button>
      )}
    </div>
  )
}
