import { ImageResponse } from 'next/og'

export const OG_SIZE = { width: 1200, height: 630 }

export function ogCard(eyebrow: string, title: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: 'linear-gradient(160deg, #0a1a4a 0%, #030a26 60%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 56 }}>
            <div style={{ width: 16, height: 26, borderRadius: 4, background: '#1e8bff' }} />
            <div style={{ width: 16, height: 38, borderRadius: 4, background: '#1e8bff' }} />
            <div style={{ width: 16, height: 56, borderRadius: 4, background: '#1e8bff' }} />
          </div>
          <div style={{ display: 'flex', fontSize: 38, fontWeight: 800 }}>
            BetTracker<span style={{ color: '#3aa6ff' }}>AI</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ display: 'flex', fontSize: 28, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', color: '#3aa6ff' }}>
            {eyebrow}
          </div>
          <div style={{ display: 'flex', fontSize: title.length > 48 ? 62 : 74, fontWeight: 800, lineHeight: 1.08, maxWidth: 1050 }}>
            {title}
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 26, color: '#b8c4e6' }}>bettrackerai.com</div>
      </div>
    ),
    OG_SIZE,
  )
}
