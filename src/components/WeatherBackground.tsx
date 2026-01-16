'use client'

import { WeatherType } from '@/types/weather'
import { useMemo } from 'react'

interface WeatherBackgroundProps {
  weatherType: WeatherType
  children: React.ReactNode
}

export default function WeatherBackground({ weatherType, children }: WeatherBackgroundProps) {
  const bgConfig = {
    sunny: {
      gradient: 'from-sky-400 via-blue-400 to-amber-200',
      overlay: 'bg-gradient-to-b from-transparent via-transparent to-orange-100/20',
    },
    cloudy: {
      gradient: 'from-slate-400 via-gray-400 to-slate-500',
      overlay: 'bg-gradient-to-b from-white/5 via-transparent to-slate-600/30',
    },
    rainy: {
      gradient: 'from-slate-700 via-slate-800 to-slate-900',
      overlay: 'bg-gradient-to-b from-blue-900/20 via-transparent to-slate-900/50',
    },
    snowy: {
      gradient: 'from-slate-200 via-blue-100 to-slate-300',
      overlay: 'bg-gradient-to-b from-white/30 via-transparent to-blue-200/30',
    },
    unknown: {
      gradient: 'from-sky-400 via-blue-400 to-blue-500',
      overlay: 'bg-gradient-to-b from-transparent via-transparent to-blue-600/20',
    },
  }

  const config = bgConfig[weatherType]

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.gradient} relative overflow-hidden`}>
      {/* オーバーレイ */}
      <div className={`absolute inset-0 ${config.overlay}`} />

      {/* 山のシルエット */}
      <MountainSilhouette weatherType={weatherType} />

      {/* 天気アニメーション */}
      {weatherType === 'sunny' && <SunnyAnimation />}
      {weatherType === 'cloudy' && <CloudyAnimation />}
      {weatherType === 'rainy' && <RainyAnimation />}
      {weatherType === 'snowy' && <SnowyAnimation />}

      {/* 装飾的な要素 */}
      <DecorativeElements weatherType={weatherType} />

      {/* コンテンツ */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

function MountainSilhouette({ weatherType }: { weatherType: WeatherType }) {
  const colors = {
    sunny: 'fill-blue-600/20',
    cloudy: 'fill-slate-600/30',
    rainy: 'fill-slate-900/40',
    snowy: 'fill-slate-400/30',
    unknown: 'fill-blue-600/20',
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
      <svg
        viewBox="0 0 1440 320"
        className={`w-full h-auto ${colors[weatherType]} transition-colors duration-1000`}
        preserveAspectRatio="none"
      >
        {/* 丹沢山系をイメージした山並み */}
        <path d="M0,320 L0,200 Q120,100 240,180 T480,120 T720,160 T960,100 T1200,140 T1440,120 L1440,320 Z" />
      </svg>
      <svg
        viewBox="0 0 1440 320"
        className={`w-full h-auto absolute bottom-0 ${colors[weatherType]} opacity-60 transition-colors duration-1000`}
        preserveAspectRatio="none"
        style={{ transform: 'translateY(-30%)' }}
      >
        <path d="M0,320 L0,240 Q180,160 360,200 T720,140 T1080,180 T1440,160 L1440,320 Z" />
      </svg>
    </div>
  )
}

function DecorativeElements({ weatherType }: { weatherType: WeatherType }) {
  return (
    <>
      {/* 装飾的な円 - 光のエフェクト */}
      <div
        className={`decorative-circle w-96 h-96 -top-48 -right-48 ${
          weatherType === 'sunny' ? 'opacity-40' : 'opacity-20'
        } transition-opacity duration-1000`}
      />
      <div
        className={`decorative-circle w-64 h-64 top-1/4 -left-32 ${
          weatherType === 'rainy' ? 'opacity-10' : 'opacity-20'
        } transition-opacity duration-1000`}
      />
    </>
  )
}

function SunnyAnimation() {
  return (
    <>
      {/* 太陽 */}
      <div className="absolute top-8 right-8 md:top-12 md:right-12">
        <div className="relative">
          {/* 光芒 */}
          <div className="absolute inset-0 w-32 h-32 md:w-40 md:h-40 animate-sun-ray">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 w-1 h-24 bg-gradient-to-t from-yellow-300/60 to-transparent origin-bottom"
                style={{
                  transform: `translate(-50%, -100%) rotate(${i * 30}deg)`,
                }}
              />
            ))}
          </div>
          {/* 太陽本体 */}
          <div className="relative w-24 h-24 md:w-32 md:h-32 animate-sun-pulse">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-400 rounded-full shadow-[0_0_80px_20px_rgba(251,191,36,0.6)]" />
            <div className="absolute inset-2 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full" />
          </div>
        </div>
      </div>

      {/* 薄い雲 */}
      {[...Array(3)].map((_, i) => (
        <Cloud
          key={i}
          className="opacity-40"
          style={{
            top: `${15 + i * 12}%`,
            animationDelay: `${i * 8}s`,
            animationDuration: `${30 + i * 5}s`,
          }}
          scale={0.6 + i * 0.2}
        />
      ))}
    </>
  )
}

function CloudyAnimation() {
  return (
    <>
      {/* 複数の雲 */}
      {[...Array(6)].map((_, i) => (
        <Cloud
          key={i}
          className="opacity-80"
          style={{
            top: `${5 + i * 10}%`,
            animationDelay: `${i * 4}s`,
            animationDuration: `${25 + i * 3}s`,
          }}
          scale={0.8 + (i % 3) * 0.3}
        />
      ))}

      {/* 暗い雲 */}
      {[...Array(3)].map((_, i) => (
        <Cloud
          key={`dark-${i}`}
          className="opacity-60"
          dark
          style={{
            top: `${20 + i * 15}%`,
            animationDelay: `${i * 6 + 2}s`,
            animationDuration: `${28 + i * 4}s`,
          }}
          scale={1 + i * 0.2}
        />
      ))}
    </>
  )
}

function RainyAnimation() {
  const raindrops = useMemo(() =>
    [...Array(60)].map((_, i) => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      duration: `${0.6 + Math.random() * 0.4}s`,
      height: `${20 + Math.random() * 20}px`,
    })), []
  )

  return (
    <>
      {/* 暗い雲 */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-slate-800 to-transparent" />
      {[...Array(4)].map((_, i) => (
        <Cloud
          key={i}
          className="opacity-90"
          dark
          style={{
            top: `${-5 + i * 8}%`,
            animationDelay: `${i * 5}s`,
            animationDuration: `${35 + i * 5}s`,
          }}
          scale={1.2 + i * 0.2}
        />
      ))}

      {/* 雨粒 */}
      {raindrops.map((drop, i) => (
        <div
          key={i}
          className="absolute w-0.5 bg-gradient-to-b from-blue-300/70 to-blue-400/40 rounded-full animate-rain-drop"
          style={{
            left: drop.left,
            top: '-20px',
            height: drop.height,
            animationDelay: drop.delay,
            animationDuration: drop.duration,
          }}
        />
      ))}
    </>
  )
}

function SnowyAnimation() {
  const snowflakes = useMemo(() =>
    [...Array(40)].map((_, i) => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${6 + Math.random() * 6}s`,
      size: `${4 + Math.random() * 8}px`,
    })), []
  )

  return (
    <>
      {/* 薄い雲 */}
      {[...Array(3)].map((_, i) => (
        <Cloud
          key={i}
          className="opacity-50"
          style={{
            top: `${5 + i * 10}%`,
            animationDelay: `${i * 7}s`,
            animationDuration: `${35 + i * 5}s`,
          }}
          scale={1 + i * 0.15}
        />
      ))}

      {/* 雪の結晶 */}
      {snowflakes.map((flake, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full animate-snow-fall shadow-[0_0_10px_rgba(255,255,255,0.8)]"
          style={{
            left: flake.left,
            top: '-20px',
            width: flake.size,
            height: flake.size,
            animationDelay: flake.delay,
            animationDuration: flake.duration,
          }}
        />
      ))}
    </>
  )
}

interface CloudProps {
  className?: string
  style?: React.CSSProperties
  scale?: number
  dark?: boolean
}

function Cloud({ className = '', style = {}, scale = 1, dark = false }: CloudProps) {
  const baseColor = dark ? 'bg-slate-500' : 'bg-white'

  return (
    <div
      className={`absolute animate-drift ${className}`}
      style={{
        ...style,
        left: '-200px',
        transform: `scale(${scale})`,
      }}
    >
      <div className="relative">
        <div className={`absolute w-20 h-12 ${baseColor} rounded-full blur-sm`} />
        <div className={`absolute w-16 h-10 ${baseColor} rounded-full -top-4 left-6 blur-sm`} />
        <div className={`absolute w-24 h-14 ${baseColor} rounded-full -top-2 left-12 blur-sm`} />
        <div className={`absolute w-18 h-12 ${baseColor} rounded-full left-28 blur-sm`} />
      </div>
    </div>
  )
}
