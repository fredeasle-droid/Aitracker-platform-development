import { ArrowUp, Building2, ChevronDown, ListOrdered } from 'lucide-react'
import { RichText } from '@/components/legal/rich-text'
import { COMPANY, type LegalSection } from '@/lib/legal'

function TocLinks({ sections }: { sections: LegalSection[] }) {
  return (
    <ol className="flex flex-col">
      {sections.map((section, index) => (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
            className="group/toc flex min-h-11 items-center gap-3 rounded-xl px-2 text-[14px] text-foreground/80 transition-colors hover:bg-primary/10 hover:text-foreground lg:min-h-9"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background/60 text-[12px] font-semibold tabular-nums text-muted-foreground transition-colors group-hover/toc:bg-primary/25 group-hover/toc:text-primary-glow">
              {index + 1}
            </span>
            <span className="text-pretty">{section.title}</span>
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
    <dl className="mt-4 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-card/60 p-5 text-[14px] lg:p-7">
      <div className="mb-3 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl border border-primary/40 bg-primary/15 text-primary-glow">
          <Building2 className="size-5" aria-hidden="true" />
        </span>
        <div>
          <dt className="text-[13px] uppercase tracking-[0.14em] text-muted-foreground">Udbyder</dt>
          <dd className="text-[17px] font-bold text-foreground">{COMPANY.brand}</dd>
        </div>
      </div>
      {rows.map(([label, value]) => (
        <div key={label} className="flex justify-between gap-4 border-t border-border py-2.5">
          <dt className="text-muted-foreground">{label}</dt>
          <dd className="text-right text-foreground">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

export function LegalDocument({ sections }: { sections: LegalSection[] }) {
  return (
    <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-12">
      <aside className="lg:sticky lg:top-6 lg:self-start">
        <details className="group rounded-2xl border border-border bg-card/70 lg:hidden">
          <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 px-4 text-[15px] font-semibold text-foreground [&::-webkit-details-marker]:hidden">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary-glow">
              <ListOrdered className="size-5" aria-hidden="true" />
            </span>
            <span className="flex-1">Spring til afsnit</span>
            <span className="text-[13px] font-normal text-muted-foreground">{sections.length} afsnit</span>
            <ChevronDown className="size-5 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <nav aria-label="Indhold" className="px-2 pb-3">
            <TocLinks sections={sections} />
          </nav>
        </details>
        <nav aria-label="Indhold" className="hidden rounded-2xl border border-border bg-card/70 p-3 lg:block">
          <p className="flex items-center gap-2 px-2 pb-2 pt-1 text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            <ListOrdered className="size-4 text-primary-glow" aria-hidden="true" />
            Indhold
          </p>
          <TocLinks sections={sections} />
        </nav>
      </aside>

      <div className="mt-4 flex flex-col gap-4 lg:mt-0 lg:max-w-3xl">
        {sections.map((section, index) => (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={`${section.id}-title`}
            className="scroll-mt-20 rounded-2xl border border-border bg-card/70 p-5 transition-colors target:border-primary/60 lg:p-7"
          >
            <div className="flex items-start gap-3.5">
              <span
                aria-hidden="true"
                className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-primary/40 bg-primary/15 text-[15px] font-bold tabular-nums text-primary-glow"
              >
                {index + 1}
              </span>
              <h2 id={`${section.id}-title`} className="text-balance pt-1 text-[19px] font-bold leading-snug text-foreground lg:text-[22px]">
                {section.title}
              </h2>
            </div>
            <div className="mt-4 flex flex-col gap-3 text-[15px] leading-relaxed text-foreground/85 lg:pl-[50px]">
              {section.blocks.map((block, blockIndex) =>
                'p' in block ? (
                  <p key={blockIndex} className="text-pretty">
                    <RichText text={block.p} />
                  </p>
                ) : (
                  <ul key={blockIndex} className="flex flex-col gap-2.5">
                    {block.ul.map((item) => (
                      <li key={item} className="flex gap-3 text-pretty">
                        <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary-glow" />
                        <span>
                          <RichText text={item} />
                        </span>
                      </li>
                    ))}
                  </ul>
                ),
              )}
            </div>
          </section>
        ))}
        <CompanyDetails />
        <a
          href="#top"
          className="mx-auto mt-2 inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-card/60 px-5 text-[14px] font-semibold text-foreground/80 transition-colors hover:border-primary/60 hover:text-foreground"
        >
          <ArrowUp className="size-4 text-primary-glow" aria-hidden="true" />
          Til toppen
        </a>
      </div>
    </div>
  )
}
