'use client'

import { useState } from 'react'
import { Megaphone } from 'lucide-react'
import { sendBroadcastPush } from '@/app/konto/push-actions'
import { Card, FieldLabel, Message, inputClass, primaryButton } from './ui'

export function PushBroadcastForm() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [url, setUrl] = useState('/surebets')
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(null)
    setPending(true)
    try {
      const result = await sendBroadcastPush({ title, body, url })
      if (result.ok) {
        setMessage({ kind: 'ok', text: result.message ?? 'Sendt.' })
        setTitle('')
        setBody('')
      } else {
        setMessage({ kind: 'error', text: result.error })
      }
    } catch {
      setMessage({ kind: 'error', text: 'Der opstod en forbindelsesfejl. Prøv igen.' })
    } finally {
      setPending(false)
    }
  }

  return (
    <Card title="Send besked til alle" icon={<Megaphone />}>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <FieldLabel label="Titel">
          <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} required className={inputClass} />
        </FieldLabel>
        <FieldLabel label="Tekst">
          <textarea value={body} onChange={(e) => setBody(e.target.value)} maxLength={240} rows={3} required className={`${inputClass} py-3`} />
        </FieldLabel>
        <FieldLabel label="Link ved tryk">
          <input value={url} onChange={(e) => setUrl(e.target.value)} className={inputClass} />
        </FieldLabel>
        <p className="text-[12px] leading-5 text-[#9fb3cc]">Sendes kun til dem, der har slået &quot;Tilbud og nyheder&quot; til. Kun synlig for ejeren.</p>
        <button type="submit" disabled={pending} className={primaryButton}>{pending ? 'Sender…' : 'Send til alle'}</button>
        {message && <Message kind={message.kind}>{message.text}</Message>}
      </form>
    </Card>
  )
}
