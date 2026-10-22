import { getBookmaker } from '@/lib/bookmakers'
import { cn } from '@/lib/utils'

export function BookmakerLogo({ name, className }: { name: string; className?: string }) {
  const brand = getBookmaker(name)
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl font-black leading-none',
        className,
      )}
      style={{ background: brand.bg, color: brand.fg }}
    >
      {brand.style === 'ring' ? (
        <span className="block size-[55%] rounded-full border-[3px] border-white shadow-[inset_0_0_0_2px_rgba(255,255,255,0.35)]" />
      ) : brand.style === 'dice' ? (
        <span className="grid size-[60%] rotate-12 grid-cols-2 place-items-center gap-0.5 rounded-md bg-[#ffb000] p-1 shadow">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="size-1.5 rounded-full bg-[#d62a1e]" />
          ))}
        </span>
      ) : brand.style === 'text' ? (
        <span className="text-[11px] tracking-tight">
          Bet<span style={{ color: brand.accent }}>365</span>
        </span>
      ) : (
        <span className={cn(brand.mark.length > 1 ? 'text-lg' : 'text-2xl', 'italic')}>{brand.mark}</span>
      )}
    </span>
  )
}
