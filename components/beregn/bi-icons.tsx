import { useId, type SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>

/** url()-safe id so icons can render twice on a page (desktop + phone). */
export function useSvgId(prefix: string) {
  return `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
}

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function SoccerBallSolid(props: P) {
  const gid = useSvgId('ball-clip')
  const pent = (cx: number, cy: number, r: number, rot = 0) =>
    Array.from({ length: 5 }, (_, i) => {
      const a = ((-90 + rot + i * 72) * Math.PI) / 180
      return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`
    }).join(' ')
  const dirs = Array.from({ length: 5 }, (_, i) => ((-90 + i * 72) * Math.PI) / 180)
  const pt = (a: number, d: number) => ({ x: 24 + d * Math.cos(a), y: 24 + d * Math.sin(a) })
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" {...props}>
      <defs>
        <clipPath id={gid}>
          <circle cx="24" cy="24" r="21" />
        </clipPath>
      </defs>
      <circle cx="24" cy="24" r="21" fill="var(--bi-fg)" />
      <g clipPath={`url(#${gid})`} fill="var(--bi-bg)" stroke="var(--bi-bg)" strokeWidth="1.3" strokeLinejoin="round">
        <polygon points={pent(24, 24, 6.6)} />
        {dirs.map((a, i) => {
          const c = pt(a, 21.6)
          const s0 = pt(a, 6.6)
          const s1 = pt(a, 15.8)
          const m = a + Math.PI / 5
          const e0 = pt(m, 16.5)
          const e1 = pt(m, 22)
          return (
            <g key={i}>
              <polygon points={pent(c.x, c.y, 5.8, 36 + i * 72)} />
              <line x1={s0.x} y1={s0.y} x2={s1.x} y2={s1.y} />
              <line x1={e0.x} y1={e0.y} x2={e1.x} y2={e1.y} />
            </g>
          )
        })}
      </g>
      <circle cx="24" cy="24" r="21" fill="none" stroke="var(--bi-fg)" strokeWidth="1.2" />
    </svg>
  )
}

export function CoinsStackIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}>
      <ellipse cx="13" cy="5" rx="7" ry="2.5" />
      <path d="M6 5v3c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V5" />
      <path d="M20 8v3c0 1.4-3.1 2.5-7 2.5" />
      <ellipse cx="10" cy="14.5" rx="7" ry="2.5" />
      <path d="M3 14.5v3c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-3" />
      <path d="M20 11v3c0 1.1-1.9 2-4.5 2.4" />
    </svg>
  )
}

export function ProfitBarsIcon(props: P) {
  const gid = useSvgId('bars-g')
  return (
    <svg viewBox="0 0 44 44" aria-hidden="true" {...props}>
      <defs>
        <linearGradient id={gid} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" style={{ stopColor: 'var(--bi-primary)' }} />
          <stop offset="1" style={{ stopColor: 'var(--bi-glow)' }} />
        </linearGradient>
      </defs>
      <g fill={`url(#${gid})`}>
        <rect x="1" y="24" width="7.5" height="20" rx="1.2" />
        <rect x="12" y="15" width="7.5" height="29" rx="1.2" />
        <rect x="23" y="6" width="7.5" height="38" rx="1.2" />
        <rect x="34" y="17" width="7.5" height="27" rx="1.2" />
      </g>
    </svg>
  )
}

export function BetfairArrow(props: P) {
  return (
    <svg viewBox="0 0 30 26" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M15 0 30 13H21L15 7.8 9 13H0Z" />
      <path d="M0 13h9l6 5.2 6-5.2h9L15 26Z" opacity="0.92" transform="translate(-4 0)" />
    </svg>
  )
}
