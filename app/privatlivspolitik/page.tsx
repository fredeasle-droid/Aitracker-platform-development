import type { Metadata } from 'next'
import { ShieldCheck } from 'lucide-react'
import { LegalDocument } from '@/components/legal/legal-document'
import { LegalPage } from '@/components/legal/legal-page'
import { LEGAL_UPDATED, PRIVACY_SECTIONS } from '@/lib/legal'

export const metadata: Metadata = {
  title: 'Privatlivspolitik – BetTrackerAI',
  description: 'Se hvilke personoplysninger BetTrackerAI behandler, hvorfor, hvor længe, og hvilke rettigheder du har efter GDPR.',
}

export default function PrivacyPage() {
  return (
    <LegalPage
      icon={ShieldCheck}
      eyebrow="Juridisk"
      title="Privatlivspolitik"
      intro="Vi behandler kun de oplysninger, vi har brug for. Her kan du læse hvilke, hvorfor og hvilke rettigheder du har."
      updated={LEGAL_UPDATED}
    >
      <LegalDocument sections={PRIVACY_SECTIONS} />
    </LegalPage>
  )
}
