import { RichText } from '@/components/legal/rich-text'
import { COMPANY, type LegalSection } from '@/lib/legal'

function CompanyDetails() {
  const rows = [
    ['Virksomhed', COMPANY.legalName],
    ['CVR-nr.', COMPANY.cvr],
    ['Adresse', COMPANY.address],
    ['E-mail', COMPANY.email],
  ].filter((row): row is [string, string] => Boolean(row[1]))

  return (
    <section className="mt-10 border-t border-border pt-8">
      <h2 className="text-[20px] font-bold leading-snug text-foreground lg:text-[22px]">Udbyder</h2>
      <p className="mt-3 text-[16px] leading-[1.75] text-foreground/85">
        {COMPANY.brand}
        {rows.map(([label, value]) => (
          <span key={label} className="block">
            {label}: {value}
          </span>
        ))}
      </p>
    </section>
  )
}

export function LegalDocument({ sections }: { sections: LegalSection[] }) {
  return (
    <article className="max-w-[68ch] text-[16px] leading-[1.75] text-foreground/85">
      {sections.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          aria-labelledby={`${section.id}-title`}
          className={`scroll-mt-20 ${index === 0 ? '' : 'mt-10'}`}
        >
          <h2 id={`${section.id}-title`} className="text-balance text-[20px] font-bold leading-snug text-foreground lg:text-[22px]">
            {index + 1}. {section.title}
          </h2>
          <div className="mt-3 flex flex-col gap-4">
            {section.blocks.map((block, blockIndex) =>
              'p' in block ? (
                <p key={blockIndex} className="text-pretty">
                  <RichText text={block.p} />
                </p>
              ) : (
                <ul key={blockIndex} className="flex list-disc flex-col gap-2 pl-6 marker:text-muted-foreground">
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
    </article>
  )
}
