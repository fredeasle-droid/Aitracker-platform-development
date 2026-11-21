'use server'

import { pool } from '@/lib/db'

export type NewsletterState = { status: 'idle' | 'success' | 'error'; message: string }

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function subscribeToNewsletter(_previous: NewsletterState, formData: FormData): Promise<NewsletterState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()

  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return { status: 'error', message: 'Indtast en gyldig e-mailadresse.' }
  }

  try {
    await pool.query(
      `CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id serial PRIMARY KEY,
        email text NOT NULL UNIQUE,
        created_at timestamptz NOT NULL DEFAULT now()
      )`,
    )
    await pool.query('INSERT INTO newsletter_subscribers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING', [email])
    return { status: 'success', message: 'Tak! Du er tilmeldt.' }
  } catch (error) {
    console.error('[newsletter] subscribe failed', error)
    return { status: 'error', message: 'Noget gik galt. Prøv igen om lidt.' }
  }
}
