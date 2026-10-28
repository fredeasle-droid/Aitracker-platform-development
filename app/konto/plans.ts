export const plans = {
  basis: { name: 'Basis', price: '149', detail: 'SikkerBets op til 5% margin' },
  premium: { name: 'Premium', price: '249', detail: 'Alle SikkerBets + SMS-alerts' },
} as const

export type Plan = keyof typeof plans
