const FREE_ACCESS_EMAILS = new Set(['nebleipad@gmail.com'])

export function isPreviewTestEmail(email: string | null | undefined) {
  if (process.env.VERCEL_ENV !== 'preview' && process.env.NODE_ENV !== 'development') return false
  if (!email) return false

  const normalizedEmail = email.trim().toLowerCase()
  const admins = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)

  return FREE_ACCESS_EMAILS.has(normalizedEmail) || admins.includes(normalizedEmail)
}
