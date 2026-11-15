import type { ReactNode } from 'react'

export const inputClass =
  'min-h-12 w-full rounded-xl border border-[#38506b] bg-[#081725] px-3 text-[16px] text-white outline-none placeholder:text-[#8ea3bd] focus:border-[#159cff] disabled:cursor-not-allowed disabled:opacity-60'

export const primaryButton =
  'flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#138cff] px-4 text-[15px] font-bold text-white shadow-[0_8px_22px_-12px_#138cff] disabled:cursor-not-allowed disabled:opacity-60'

export const secondaryButton =
  'flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#344861] bg-[#0a1725] px-4 text-[15px] font-semibold text-[#e6ecf7] hover:bg-[#102744] disabled:cursor-not-allowed disabled:opacity-60'

export const dangerButton =
  'flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#6b2a35] bg-[#1c0b11] px-4 text-[15px] font-semibold text-[#ff9aa6] hover:bg-[#2a1018] disabled:cursor-not-allowed disabled:opacity-60'

export function Card({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#183754] bg-[#071725] p-4">
      <h2 className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.14em] text-[#4db5ff]">
        <span aria-hidden="true" className="[&>svg]:size-4">{icon}</span>
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

export function FieldLabel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-[#b5c6d9]">{label}</span>
      {children}
    </label>
  )
}

export function Message({ kind, children }: { kind: 'ok' | 'error'; children: ReactNode }) {
  return (
    <p role={kind === 'error' ? 'alert' : 'status'} className={`mt-3 text-[14px] leading-5 ${kind === 'error' ? 'text-[#ff8290]' : 'text-[#16ee93]'}`}>
      {children}
    </p>
  )
}
