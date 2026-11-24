import { ChevronDown, Lightbulb } from 'lucide-react'
import type { GuideBlock } from '@/lib/guides'

export function Block({ block }: { block: GuideBlock }) {
  switch (block.type) {
    case 'h2':
      return <h2 className="mt-10 text-balance text-[22px] font-bold leading-tight text-foreground lg:text-[26px]">{block.text}</h2>
    case 'p':
      return <p className="mt-4 text-pretty text-[16px] leading-relaxed text-foreground/85 lg:text-[17px]">{block.text}</p>
    case 'ul':
      return (
        <ul className="mt-4 flex flex-col gap-2.5">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 text-pretty text-[16px] leading-relaxed text-foreground/85">
              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary-glow" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      )
    case 'example':
      return (
        <figure className="mt-6 overflow-hidden rounded-2xl border border-border bg-card/70">
          <figcaption className="border-b border-border px-4 py-3 text-[14px] font-semibold text-foreground">{block.title}</figcaption>
          <dl className="divide-y divide-border">
            {block.rows.map(([label, value]) => (
              <div key={label} className="flex items-baseline justify-between gap-4 px-4 py-3 text-[15px]">
                <dt className="text-foreground/75">{label}</dt>
                <dd className="shrink-0 text-right font-semibold tabular-nums text-foreground">{value}</dd>
              </div>
            ))}
          </dl>
          {block.note && <p className="bg-primary/10 px-4 py-3 text-[14px] leading-relaxed text-foreground/85">{block.note}</p>}
        </figure>
      )
    case 'tip':
      return (
        <aside className="mt-6 flex gap-3 rounded-2xl border border-primary/40 bg-primary/10 p-4">
          <Lightbulb className="mt-0.5 size-5 shrink-0 text-primary-glow" aria-hidden="true" />
          <p className="text-pretty text-[15px] leading-relaxed text-foreground/90">{block.text}</p>
        </aside>
      )
  }
}

export function FaqList({ items, heading = 'Ofte stillede spørgsmål' }: { items: { q: string; a: string }[]; heading?: string }) {
  return (
    <section aria-labelledby="faq-heading" className="mt-12">
      <h2 id="faq-heading" className="text-[22px] font-bold text-foreground">{heading}</h2>
      <div className="mt-4 flex flex-col gap-3">
        {items.map(({ q, a }) => (
          <details key={q} className="group rounded-2xl border border-border bg-card/70 open:border-primary/50">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-[16px] font-semibold leading-snug text-foreground [&::-webkit-details-marker]:hidden">
              <span className="text-pretty">{q}</span>
              <ChevronDown className="size-5 shrink-0 text-primary-glow transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <p className="px-4 pb-5 text-pretty text-[15px] leading-relaxed text-foreground/80">{a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  }
}
