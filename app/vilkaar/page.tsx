import type { Metadata } from 'next'
import { FileText } from 'lucide-react'
import { LegalDocument } from '@/components/legal/legal-document'
import { LegalPage } from '@/components/legal/legal-page'
import { LEGAL_UPDATED, TERMS_SECTIONS } from '@/lib/legal'

export const metadata: Metadata = {
  title: 'Vilkår & Betingelser – BetTrackerAI',
  description: 'Læs vilkårene for BetTrackerAI: abonnement, prøveperiode, fortrydelsesret, opsigelse og ansvarligt spil.',
  alternates: { canonical: '/vilkaar' },
}

export default function TermsPage() {
  return (
    <LegalPage
      icon={FileText}
      plain
      eyebrow="Juridisk"
      title="Vilkår & Betingelser"
      intro="Her står det, hvad du kan forvente af os, og hvad vi forventer af dig, når du bruger BetTrackerAI."
      updated={LEGAL_UPDATED}
    >
      <LegalDocument sections={TERMS_SECTIONS} />
    </LegalPage>
  )
}
