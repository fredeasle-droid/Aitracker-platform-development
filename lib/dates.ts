const TZ = 'Europe/Copenhagen'

const dayKey = new Intl.DateTimeFormat('en-CA', {
  timeZone: TZ,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})
const timeFmt = new Intl.DateTimeFormat('da-DK', {
  timeZone: TZ,
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})
const monthFmt = new Intl.DateTimeFormat('da-DK', { timeZone: TZ, month: 'short' })
const dayFmt = new Intl.DateTimeFormat('da-DK', { timeZone: TZ, day: 'numeric' })

export function formatTime(d: Date) {
  return timeFmt.format(d).replace('.', ':')
}

export function formatShortDate(d: Date) {
  const month = monthFmt.format(d).replace('.', '')
  return `${dayFmt.format(d).replace('.', '')}. ${month}. ${formatTime(d)}`
}

export function formatKickoff(d: Date, now = new Date()) {
  const today = dayKey.format(now)
  const tomorrow = dayKey.format(new Date(now.getTime() + 86_400_000))
  const yesterday = dayKey.format(new Date(now.getTime() - 86_400_000))
  const key = dayKey.format(d)
  if (key === today) return `I dag ${formatTime(d)}`
  if (key === tomorrow) return `I morgen ${formatTime(d)}`
  if (key === yesterday) return `I går ${formatTime(d)}`
  return formatShortDate(d)
}
