import { cn } from '@/lib/utils'

function FlagArt({ code }: { code: string }) {
  switch (code.toLowerCase()) {
    case 'dk':
      return (
        <>
          <rect width="24" height="24" fill="#c8102e" />
          <rect x="7" width="3.4" height="24" fill="#fff" />
          <rect y="10.3" width="24" height="3.4" fill="#fff" />
        </>
      )
    case 'gb-eng':
      return (
        <>
          <rect width="24" height="24" fill="#fff" />
          <rect x="10.2" width="3.6" height="24" fill="#ce1124" />
          <rect y="10.2" width="24" height="3.6" fill="#ce1124" />
        </>
      )
    case 'es':
      return (
        <>
          <rect width="24" height="24" fill="#c60b1e" />
          <rect y="6" width="24" height="12" fill="#ffc400" />
          <rect x="5" y="9" width="3.5" height="5" rx="0.8" fill="#ad1519" />
        </>
      )
    case 'it':
      return (
        <>
          <rect width="8" height="24" fill="#009246" />
          <rect x="8" width="8" height="24" fill="#fff" />
          <rect x="16" width="8" height="24" fill="#ce2b37" />
        </>
      )
    case 'de':
      return (
        <>
          <rect width="24" height="8" fill="#000" />
          <rect y="8" width="24" height="8" fill="#dd0000" />
          <rect y="16" width="24" height="8" fill="#ffce00" />
        </>
      )
    case 'fr':
      return (
        <>
          <rect width="8" height="24" fill="#002395" />
          <rect x="8" width="8" height="24" fill="#fff" />
          <rect x="16" width="8" height="24" fill="#ed2939" />
        </>
      )
    case 'se':
      return (
        <>
          <rect width="24" height="24" fill="#006aa7" />
          <rect x="7" width="3.4" height="24" fill="#fecc00" />
          <rect y="10.3" width="24" height="3.4" fill="#fecc00" />
        </>
      )
    case 'us':
      return (
        <>
          <rect width="24" height="24" fill="#fff" />
          {[0, 2, 4, 6].map((i) => (
            <rect key={i} y={i * 3.43} width="24" height="1.72" fill="#b22234" />
          ))}
          <rect y="20.6" width="24" height="3.4" fill="#b22234" />
          <rect width="11" height="12" fill="#3c3b6e" />
        </>
      )
    default:
      return <rect width="24" height="24" fill="#334155" />
  }
}

export function Flag({ code, label, className }: { code: string; label: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" role="img" aria-label={label} className={cn('size-5 shrink-0 rounded-full', className)}>
      <clipPath id={`flag-${code}`}>
        <circle cx="12" cy="12" r="12" />
      </clipPath>
      <g clipPath={`url(#flag-${code})`}>
        <FlagArt code={code} />
      </g>
    </svg>
  )
}
