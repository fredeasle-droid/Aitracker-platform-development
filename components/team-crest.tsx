import { cn } from '@/lib/utils'

const TEAM_LOGOS: Record<string, string> = {
  'FC København': 'https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/fc-kobenhavn/default.svg',
  'Brøndby IF': 'https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/brondby-if/default.svg',
  'Manchester City': 'https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/manchester-city/default.svg',
  Arsenal: 'https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/arsenal/default.svg',
  'Real Madrid': 'https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/real-madrid/default.svg',
  Barcelona: 'https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/barcelona/default.svg',
  Inter: 'https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/inter-milan/default.svg',
  'AC Milan': 'https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/ac-milan/default.svg',
}

const TEAM_COLORS: Record<string, [string, string]> = {
  'FC København': ['#ffffff', '#1d4ed8'],
  'Brøndby IF': ['#facc15', '#1e3a8a'],
  'Manchester City': ['#7dd3fc', '#0c4a6e'],
  Arsenal: ['#ef4444', '#fde68a'],
  'Real Madrid': ['#ffffff', '#b45309'],
  Barcelona: ['#1e40af', '#b91c1c'],
  Inter: ['#1e3a8a', '#0f172a'],
  'AC Milan': ['#dc2626', '#111827'],
  'Bayern München': ['#dc2626', '#ffffff'],
  Dortmund: ['#facc15', '#111827'],
  'Boston Celtics': ['#16a34a', '#ffffff'],
  'LA Lakers': ['#7c3aed', '#facc15'],
  'C. Alcaraz': ['#f97316', '#ffffff'],
  'J. Sinner': ['#22c55e', '#ffffff'],
  Frölunda: ['#16a34a', '#ffffff'],
  Färjestad: ['#facc15', '#16a34a'],
  Aalborg: ['#dc2626', '#ffffff'],
  GOG: ['#1d4ed8', '#facc15'],
}

function initials(name: string) {
  const parts = name
    .replace(/^(FC|AC|IF|LA|C\.|J\.)\s/, '')
    .split(/\s+/)
    .filter((p) => !['FC', 'IF', 'AC'].includes(p))
  return parts
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}

export function TeamCrest({ name, className }: { name: string; className?: string }) {
  const [bg, fg] = TEAM_COLORS[name] ?? ['#1e293b', '#e2e8f0']
  const dark = bg === '#ffffff' || bg === '#facc15' || bg === '#7dd3fc' || bg === '#f97316'
  const logo = TEAM_LOGOS[name]

  if (logo) {
    return (
      <span className={cn('flex size-11 shrink-0 items-center justify-center', className)}>
        <img src={logo} alt="" aria-hidden="true" className="size-full object-contain drop-shadow-[0_0_5px_rgba(255,255,255,0.18)]" />
      </span>
    )
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex size-11 shrink-0 items-center justify-center rounded-full border-[3px] text-[13px] font-extrabold tracking-tight shadow-[0_0_0_2px_rgba(255,255,255,0.08)]',
        className,
      )}
      style={{ background: bg, borderColor: fg, color: dark ? fg : '#ffffff' }}
    >
      {initials(name)}
    </span>
  )
}
