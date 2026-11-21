import { z } from 'zod'

export const couponBetSchema = z.object({
  bookmaker: z.string().describe('Name of the bookmaker shown on the slip, e.g. Bet365, Unibet, Betano. Empty string if not visible.'),
  sport: z.string().describe('Sport in Danish, e.g. Fodbold, Tennis, Basketball. Default Fodbold.'),
  match: z.string().describe('Event as "Home vs Away" or the player names for individual sports.'),
  selection: z.string().describe('The market and pick, e.g. "Over 2.5 mål", "Sejr Hjemmehold", "Begge hold scorer - Ja".'),
  odds: z.number().nullable().describe('Decimal odds for this bet. Null if not visible.'),
  stake: z.number().describe('Stake (indsats) in DKK as a plain number. 0 if not visible.'),
  status: z.enum(['open', 'won', 'lost']).describe('open = not settled yet, won = won/cashed out in profit, lost = lost.'),
  payout: z.number().nullable().describe('Total payout in DKK if the bet is settled as won, otherwise null.'),
  date: z.string().nullable().describe('Event or placement date as ISO 8601 if visible, otherwise null.'),
})

export const couponSchema = z.object({
  bets: z.array(couponBetSchema).describe('Every separate bet on the slip. A multi-leg accumulator is ONE bet with all legs in match/selection.'),
})

export type CouponBet = z.infer<typeof couponBetSchema>

export const MAX_COUPON_BETS = 20
