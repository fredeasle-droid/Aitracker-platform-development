'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserRound } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import type { AccountUser } from '@/app/konto/account-types'
import { Card, FieldLabel, Message, inputClass, primaryButton } from './ui'

export function ProfileForm({ user }: { user: AccountUser }) {
  const router = useRouter()
  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState(user.phone)
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(null)
    if (!name.trim()) {
      setMessage({ kind: 'error', text: 'Brugernavn må ikke være tomt.' })
      return
    }
    setPending(true)
    try {
      const result = await authClient.updateUser({ name: name.trim(), phone: phone.trim() })
      if (result.error) {
        setMessage({ kind: 'error', text: result.error.message ?? 'Oplysningerne kunne ikke gemmes.' })
        return
      }
      setMessage({ kind: 'ok', text: 'Dine oplysninger er gemt.' })
      router.refresh()
    } catch {
      setMessage({ kind: 'error', text: 'Der opstod en forbindelsesfejl. Prøv igen.' })
    } finally {
      setPending(false)
    }
  }

  return (
    <Card title="Mine oplysninger" icon={<UserRound />}>
      <form onSubmit={submit} className="space-y-3">
        <FieldLabel label="Brugernavn">
          <input name="name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="nickname" required className={inputClass} />
        </FieldLabel>
        <FieldLabel label="Email">
          <input value={user.email} readOnly disabled aria-describedby="email-note" className={inputClass} />
        </FieldLabel>
        <p id="email-note" className="text-[12px] leading-5 text-[#9fb3cc]">Din email bruges til login og kan ikke ændres her.</p>
        <FieldLabel label="Mobilnummer (til SMS-alerts)">
          <input name="phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" placeholder="+45 12 34 56 78" className={inputClass} />
        </FieldLabel>
        <button type="submit" disabled={pending} className={primaryButton}>{pending ? 'Gemmer…' : 'Gem oplysninger'}</button>
        {message && <Message kind={message.kind}>{message.text}</Message>}
      </form>
    </Card>
  )
}
