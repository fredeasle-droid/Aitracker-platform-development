import { Receipt } from 'lucide-react'
import type { AccountInvoice } from '@/app/konto/account-types'
import { Card } from './ui'

const INVOICE_STATUS: Record<string, string> = { paid: 'Betalt', open: 'Åben', uncollectible: 'Ikke betalt', void: 'Annulleret' }

export function InvoiceList({ invoices }: { invoices: AccountInvoice[] }) {
  return (
    <Card title="Fakturaer" icon={<Receipt />}>
      {invoices.length === 0 ? (
        <p className="text-[14px] leading-6 text-[#b5c6d9]">Ingen fakturaer endnu. Din første faktura kommer, når den gratis prøveperiode slutter.</p>
      ) : (
        <ul className="divide-y divide-[#183754]">
          {invoices.map((invoice) => (
            <li key={invoice.id} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-3 first:pt-0 last:pb-0">
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-[#f3f6fc]">{invoice.amount}</p>
                <p className="text-[12px] text-[#9fb3cc]">{invoice.date} · {INVOICE_STATUS[invoice.status] ?? invoice.status}</p>
              </div>
              {invoice.url && (
                <a href={invoice.url} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center text-[14px] font-semibold text-[#42aeff] underline">
                  Se faktura
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
