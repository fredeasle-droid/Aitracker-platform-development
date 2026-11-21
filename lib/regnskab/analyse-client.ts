import type { CouponReading } from './coupon'

export type AnalyseResult = { ok: true; reading: CouponReading } | { ok: false; message: string }

export async function analyseCoupons(images: [string, string]): Promise<AnalyseResult> {
  const res = await fetch('/api/regnskab/analyse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ images }),
  })
  try {
    return (await res.json()) as AnalyseResult
  } catch {
    return { ok: false, message: 'Analysen mislykkedes. Prøv igen om lidt.' }
  }
}
