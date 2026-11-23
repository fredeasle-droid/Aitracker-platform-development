import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

const COLORS = {
  background: '#050b17',
  card: '#0a1426',
  border: '#1b2c4d',
  primary: '#1677ff',
  foreground: '#f3f6fc',
  muted: '#8da2c4',
}

function text(params: URLSearchParams, key: string, max = 36) {
  return (params.get(key) ?? '').replace(/\s+/g, ' ').trim().slice(0, max)
}

function odds(params: URLSearchParams, key: string) {
  const value = Number(params.get(key))
  return Number.isFinite(value) && value > 1 && value < 1000 ? value.toFixed(2) : '-'
}

function Leg({ bookmaker, label, odd }: { bookmaker: string; label: string; odd: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        padding: '22px 26px',
        borderRadius: 20,
        backgroundColor: COLORS.card,
        border: `2px solid ${COLORS.border}`,
      }}
    >
      <div style={{ display: 'flex', fontSize: 26, fontWeight: 700, color: COLORS.muted }}>{bookmaker}</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 10 }}>
        <div style={{ display: 'flex', fontSize: 30, color: COLORS.foreground, maxWidth: 250 }}>{label}</div>
        <div style={{ display: 'flex', fontSize: 54, fontWeight: 800, color: COLORS.primary }}>{odd}</div>
      </div>
    </div>
  )
}

export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const profit = text(params, 'p', 8) || '0'
  const match = `${text(params, 'h')} - ${text(params, 'a')}`
  const league = text(params, 'l', 48)
  const kickoff = text(params, 'k', 32)

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          padding: '44px 52px',
          backgroundColor: COLORS.background,
          color: COLORS.foreground,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 36 }}>
              <div style={{ display: 'flex', width: 10, height: 16, borderRadius: 3, backgroundColor: COLORS.primary }} />
              <div style={{ display: 'flex', width: 10, height: 26, borderRadius: 3, backgroundColor: COLORS.primary }} />
              <div style={{ display: 'flex', width: 10, height: 36, borderRadius: 3, backgroundColor: COLORS.primary }} />
            </div>
            <div style={{ display: 'flex', marginLeft: 14, fontSize: 32, fontWeight: 800, letterSpacing: 1 }}>BetTracker</div>
          </div>
          <div style={{ display: 'flex', fontSize: 26, fontWeight: 700, color: COLORS.muted }}>{kickoff}</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginTop: 30 }}>
          <div
            style={{
              display: 'flex',
              padding: '8px 34px',
              borderRadius: 24,
              backgroundColor: COLORS.primary,
              fontSize: 110,
              fontWeight: 800,
              lineHeight: 1.1,
              color: COLORS.foreground,
            }}
          >
            {`+${profit}%`}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 32, flex: 1 }}>
            <div style={{ display: 'flex', fontSize: match.length > 34 ? 32 : 40, fontWeight: 800, lineHeight: 1.15 }}>{match}</div>
            <div style={{ display: 'flex', fontSize: 24, color: COLORS.muted, marginTop: 8 }}>{league}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 24, marginTop: 'auto' }}>
          <Leg bookmaker={text(params, 'ab', 24)} label={text(params, 'al', 28)} odd={odds(params, 'ao')} />
          <Leg bookmaker={text(params, 'bb', 24)} label={text(params, 'bl', 28)} odd={odds(params, 'bo')} />
        </div>
      </div>
    ),
    {
      width: 1000,
      height: 500,
      headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=86400, immutable' },
    },
  )
}
