'use client'

import { useRef, useState } from 'react'
import { LockKeyhole } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { Card, FieldLabel, Message, inputClass, primaryButton } from './ui'

const MIN_LENGTH = 6

export function PasswordForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(null)
    const data = new FormData(event.currentTarget)
    const currentPassword = String(data.get('current'))
    const newPassword = String(data.get('next'))
    const confirm = String(data.get('confirm'))

    if (newPassword.length < MIN_LENGTH) {
      setMessage({ kind: 'error', text: `Den nye adgangskode skal være mindst ${MIN_LENGTH} tegn.` })
      return
    }
    if (newPassword !== confirm) {
      setMessage({ kind: 'error', text: 'De to nye adgangskoder er ikke ens.' })
      return
    }

    setPending(true)
    try {
      const result = await authClient.changePassword({ currentPassword, newPassword, revokeOtherSessions: true })
      if (result.error) {
        setMessage({ kind: 'error', text: result.error.message ?? 'Adgangskoden kunne ikke ændres. Tjek din nuværende adgangskode.' })
        return
      }
      formRef.current?.reset()
      setMessage({ kind: 'ok', text: 'Din adgangskode er ændret. Andre enheder er logget ud.' })
    } catch {
      setMessage({ kind: 'error', text: 'Der opstod en forbindelsesfejl. Prøv igen.' })
    } finally {
      setPending(false)
    }
  }

  return (
    <Card title="Adgangskode" icon={<LockKeyhole />}>
      <form ref={formRef} onSubmit={submit} className="space-y-3">
        <FieldLabel label="Nuværende adgangskode">
          <input name="current" type="password" required autoComplete="current-password" className={inputClass} />
        </FieldLabel>
        <FieldLabel label="Ny adgangskode">
          <input name="next" type="password" required minLength={MIN_LENGTH} autoComplete="new-password" className={inputClass} />
        </FieldLabel>
        <FieldLabel label="Gentag ny adgangskode">
          <input name="confirm" type="password" required minLength={MIN_LENGTH} autoComplete="new-password" className={inputClass} />
        </FieldLabel>
        <button type="submit" disabled={pending} className={primaryButton}>{pending ? 'Ændrer…' : 'Skift adgangskode'}</button>
        {message && <Message kind={message.kind}>{message.text}</Message>}
      </form>
    </Card>
  )
}
