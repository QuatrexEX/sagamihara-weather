import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = '相模原市の天気'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #5B8FB9 0%, #87CEEB 50%, #F8B500 100%)',
          position: 'relative',
        }}
      >
        {/* Sun */}
        <div
          style={{
            position: 'absolute',
            top: '60px',
            right: '120px',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            boxShadow: '0 0 80px 20px rgba(255, 215, 0, 0.5)',
          }}
        />

        {/* Cloud */}
        <div
          style={{
            position: 'absolute',
            top: '180px',
            left: '150px',
            display: 'flex',
          }}
        >
          <div
            style={{
              width: '120px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.9)',
              marginRight: '-40px',
            }}
          />
          <div
            style={{
              width: '150px',
              height: '100px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.9)',
              marginTop: '-20px',
            }}
          />
          <div
            style={{
              width: '100px',
              height: '70px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.9)',
              marginLeft: '-30px',
              marginTop: '10px',
            }}
          />
        </div>

        {/* Mountains */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '200px',
            background: 'linear-gradient(to bottom, rgba(74, 107, 138, 0.8), rgba(45, 74, 94, 0.9))',
            clipPath: 'polygon(0 100%, 0 60%, 15% 40%, 30% 55%, 45% 30%, 60% 45%, 75% 25%, 90% 40%, 100% 35%, 100% 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '150px',
            background: 'rgba(61, 90, 115, 0.7)',
            clipPath: 'polygon(0 100%, 0 50%, 20% 35%, 40% 50%, 60% 30%, 80% 45%, 100% 40%, 100% 100%)',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            marginTop: '-40px',
          }}
        >
          {/* Weather Icon */}
          <div style={{ fontSize: '120px', marginBottom: '20px' }}>
            ☀️
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: 'white',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              margin: 0,
              letterSpacing: '0.05em',
            }}
          >
            相模原市の天気
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '32px',
              color: 'rgba(255, 255, 255, 0.85)',
              margin: '16px 0 0 0',
              letterSpacing: '0.1em',
            }}
          >
            神奈川県西部 | 天気予報 & 履歴
          </p>
        </div>

        {/* Glass card decoration */}
        <div
          style={{
            position: 'absolute',
            bottom: '220px',
            left: '80px',
            width: '200px',
            height: '120px',
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '240px',
            right: '100px',
            width: '160px',
            height: '100px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
