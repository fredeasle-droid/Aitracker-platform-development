import { ChevronDown } from 'lucide-react'
import { RichText } from '@/components/legal/rich-text'
import { COMPANY, type LegalSection } from '@/lib/legal'

function TocLinks({ sections }: { sections: LegalSection[] }) {
  return (
    <ol className="flex flex-col">
      {sections.map((section, index) => (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
            className="flex min-h-11 items-center gap-3 rounded-lg px-2 text-[14px] text-foreground/80 transition-colors hover:text-primary-glow lg:min-h-9"
          >
            <span className="w-5 shrink-0 text-right tabular-nums text-muted-foreground">{index + 1}.</span>
            <span>{section.title}</span>
          </a>
        </li>
      ))}
    </ol>
  )
}

function CompanyDetails() {
  const rows = [
    ['Virksomhed', COMPANY.legalName],
    ['CVR-nr.', COMPANY.cvr],
    ['Adresse', COMPANY.address],
    ['E-mail', COMPANY.email],
  ].filter((row): row is [string, string] => Boolean(row[1]))

  return (
    <dl className="mt-10 rounded-2xl border border-border bg-card/60 p-5 text-[14px]">
      <dt className="sr-only">Udbyder</dt>
      <dd className="mb-3 text-[16px] font-semibold text-foreground">{COMPANY.brand}</dd>
      {rows.map(([label, value]) => (
        <div key={label} className="flex justify-between gap-4 border-t border-border py-2 first:border-t-0">
          <dt className="text-muted-foreground">{label}</dt>
          <dd className="text-right text-foreground">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

export function LegalDocument({ sections }: { sections: LegalSection[] }) {
  return (
    <div className="lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">
      <aside className="lg:sticky lg:top-6 lg:self-start">
        <details className="group rounded-2xl border border-border bg-card/60 lg:hidden">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 text-[15px] font-semibold text-foreground [&::-webkit-details-marker]:hidden">
            Indhold
            <ChevronDown className="size-5 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <nav aria-label="Indhold" className="px-2 pb-3">
            <TocLinks sections={sections} />
          </nav>
        </details>
        <nav aria-label="Indhold" className="hidden rounded-2xl border border-border bg-card/60 p-3 lg:block">
          <p className="px-2 pb-1 pt-1 text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Indhold</p>
          <TocLinks sections={sections} />
        </nav>
      </aside>

      <div className="mt-6 flex flex-col gap-4 lg:mt-0 lg:max-w-3xl">
        {sections.map((section, index) => (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={`${section.id}-title`}
            className="scroll-mt-20 rounded-2xl border border-border bg-card/60 p-5 lg:p-7"
          >
            <h2 id={`${section.id}-title`} className="text-balance text-[19px] font-bold leading-snug text-foreground lg:text-[22px]">
              {index + 1}. {section.title}
            </h2>
            <div className="mt-3 flex flex-col gap-3 text-[15px] leading-relaxed text-foreground/85">
              {section.blocks.map((block, blockIndex) =>
                'p' in block ? (
                  <p key={blockIndex} className="text-pretty">
                    <RichText text={block.p} />
                  </p>
                ) : (
                  <ul key={blockIndex} className="flex list-disc flex-col gap-2 pl-5 marker:text-primary-glow">
                    {block.ul.map((item) => (
                      <li key={item} className="text-pretty pl-1">
                        <RichText text={item} />
                      </li>
                    ))}
                  </ul>
                ),
              )}
            </div>
          </section>
        ))}
        <CompanyDetails />
      </div>
    </div>
  )
}
