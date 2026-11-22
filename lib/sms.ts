import 'server-only'

const GATEWAYAPI_URL = 'https://gatewayapi.com/rest/mtsms'
const SENDER = 'BetTracker'

export const isSmsConfigured = () => Boolean(process.env.GATEWAYAPI_TOKEN)

/** Returns an MSISDN (country code + number, digits only), defaulting 8-digit numbers to Denmark. */
export function normalizePhone(raw: string | null | undefined) {
  if (!raw) return null
  let digits = raw.replace(/[^\d+]/g, '')
  if (digits.startsWith('+')) digits = digits.slice(1)
  else if (digits.startsWith('00')) digits = digits.slice(2)
  digits = digits.replace(/\D/g, '')
  if (digits.length === 8) digits = `45${digits}`
  return digits.length >= 10 && digits.length <= 15 ? digits : null
}

export async function sendSms(msisdn: string, message: string) {
  const token = process.env.GATEWAYAPI_TOKEN
  if (!token) throw new Error('GATEWAYAPI_TOKEN mangler')
  const response = await fetch(GATEWAYAPI_URL, {
    method: 'POST',
    headers: { Authorization: `Token ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender: SENDER, message, recipients: [{ msisdn: Number(msisdn) }] }),
    signal: AbortSignal.timeout(10_000),
  })
  if (!response.ok) throw new Error(`GatewayAPI ${response.status}: ${(await response.text()).slice(0, 200)}`)
}
