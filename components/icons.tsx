import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

export function BrandMark(props: IconProps) {
  return (
    <svg viewBox="0 0 64 48" fill="none" aria-hidden="true" {...props}>
      <defs>
        <linearGradient id="bt-bar" x1="0" y1="48" x2="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0f5fe0" />
          <stop offset="1" stopColor="#3b9bff" />
        </linearGradient>
      </defs>
      <rect x="2" y="32" width="9" height="14" rx="2" fill="url(#bt-bar)" />
      <rect x="15" y="25" width="9" height="21" rx="2" fill="url(#bt-bar)" />
      <rect x="28" y="16" width="9" height="30" rx="2" fill="url(#bt-bar)" />
      <rect x="41" y="6" width="9" height="40" rx="2" fill="url(#bt-bar)" />
      <path d="M4 30 L18 20 L30 24 L52 4" stroke="#e8f1ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M45 4 H53 V12" stroke="#e8f1ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function BarsIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <rect x="3" y="12" width="4.5" height="9" rx="1.5" />
      <rect x="9.75" y="4" width="4.5" height="17" rx="1.5" />
      <rect x="16.5" y="9" width="4.5" height="12" rx="1.5" />
    </svg>
  )
}

export function SmallBarsIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
      <rect x="2" y="10" width="3" height="8" rx="1" />
      <rect x="6.5" y="6" width="3" height="12" rx="1" />
      <rect x="11" y="3" width="3" height="15" rx="1" />
      <rect x="15.5" y="8" width="3" height="10" rx="1" />
    </svg>
  )
}

export function SoccerBallIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="10" fill="#f3f6fc" />
      <path d="M12 7.2 L15.4 9.6 L14.1 13.6 H9.9 L8.6 9.6 Z" fill="#0a1426" />
      <path d="M12 2.2 V7.2 M15.4 9.6 L20.6 8 M14.1 13.6 L17 18.4 M9.9 13.6 L7 18.4 M8.6 9.6 L3.4 8" stroke="#0a1426" strokeWidth="1.4" />
      <path d="M9.6 2.5 L12 4 L14.4 2.5 M21.2 10.8 L20.6 8 M18.2 19 L17 18.4 L15.6 21.4 M5.8 19 L7 18.4 L8.4 21.4 M2.8 10.8 L3.4 8" stroke="#0a1426" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="10" stroke="#0a1426" strokeOpacity="0.15" />
    </svg>
  )
}
