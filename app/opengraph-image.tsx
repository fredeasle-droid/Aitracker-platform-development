import { ImageResponse } from 'next/og'

export const alt = 'BetTrackerAI – surebets i realtid'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
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
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 64 }}>
            <div style={{ width: 18, height: 30, borderRadius: 4, background: '#1e8bff' }} />
            <div style={{ width: 18, height: 44, borderRadius: 4, background: '#1e8bff' }} />
            <div style={{ width: 18, height: 64, borderRadius: 4, background: '#1e8bff' }} />
          </div>
          <div style={{ display: 'flex', fontSize: 44, fontWeight: 800 }}>
            BetTracker<span style={{ color: '#3aa6ff' }}>AI</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, maxWidth: 960 }}>Surebets i realtid. Garanteret profit.</div>
          <div style={{ fontSize: 32, color: '#b8c4e6', maxWidth: 900 }}>
            Vi scanner danske bookmakere døgnet rundt og finder odds, hvor du vinder uanset udfaldet.
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 26, color: '#3aa6ff' }}>bettrackerai.com</div>
      </div>
    ),
    size,
  )
}
