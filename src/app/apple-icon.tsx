import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #5B8FB9 0%, #87CEEB 100%)',
          borderRadius: '40px',
          position: 'relative',
        }}
      >
        {/* Sun */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            right: '25px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            boxShadow: '0 0 20px 5px rgba(255, 215, 0, 0.4)',
          }}
        />

        {/* Cloud */}
        <div
          style={{
            position: 'absolute',
            top: '55px',
            left: '25px',
            display: 'flex',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '28px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.95)',
            }}
          />
          <div
            style={{
              width: '50px',
              height: '35px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.95)',
              marginLeft: '-15px',
              marginTop: '-8px',
            }}
          />
          <div
            style={{
              width: '35px',
              height: '25px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.95)',
              marginLeft: '-10px',
              marginTop: '3px',
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
            height: '60px',
            background: 'linear-gradient(to bottom, rgba(74, 107, 138, 0.85), rgba(45, 74, 94, 0.95))',
            clipPath: 'polygon(0 100%, 0 60%, 20% 30%, 40% 50%, 60% 20%, 80% 40%, 100% 30%, 100% 100%)',
            borderRadius: '0 0 40px 40px',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
