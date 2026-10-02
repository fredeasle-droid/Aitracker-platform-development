export function marginPercent(oddsA: number, oddsB: number) {
  const inv = 1 / oddsA + 1 / oddsB
  return (1 / inv - 1) * 100
}

export function splitStake(total: number, oddsA: number, oddsB: number) {
  const inv = 1 / oddsA + 1 / oddsB
  const a = Math.round((total * (1 / oddsA)) / inv)
  return { a, b: Math.max(0, Math.round(total - a)) }
}

export function guaranteedProfit(stakeA: number, stakeB: number, oddsA: number, oddsB: number) {
  const total = stakeA + stakeB
  return Math.min(stakeA * oddsA, stakeB * oddsB) - total
}

export function formatInt(n: number) {
  return Math.round(n).toLocaleString('da-DK')
}

export function formatSigned(n: number) {
  const rounded = Math.round(n)
  return `${rounded > 0 ? '+' : rounded < 0 ? '-' : ''}${formatInt(Math.abs(rounded))}`
}

export function formatPct(n: number, digits = 2) {
  return `${n.toFixed(digits)}%`
}

export function formatOdds(n: number) {
  return n.toFixed(2)
}
