'use client'

import { WeatherType } from '@/types/weather'

interface WeatherBackgroundProps {
  weatherType: WeatherType
  children: React.ReactNode
}

export default function WeatherBackground({ weatherType, children }: WeatherBackgroundProps) {
  const bgGradient = {
    sunny: 'from-sky-400 via-blue-400 to-blue-500',
    cloudy: 'from-gray-400 via-gray-500 to-gray-600',
    rainy: 'from-slate-600 via-slate-700 to-slate-800',
    snowy: 'from-slate-200 via-slate-300 to-slate-400',
    unknown: 'from-sky-400 via-blue-400 to-blue-500',
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${bgGradient[weatherType]} relative overflow-hidden`}>
      {weatherType === 'sunny' && <SunnyAnimation />}
      {weatherType === 'cloudy' && <CloudyAnimation />}
      {weatherType === 'rainy' && <RainyAnimation />}
      {weatherType === 'snowy' && <SnowyAnimation />}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

function SunnyAnimation() {
  return (
    <>
      {/* Sun */}
      <div className="absolute top-10 right-10 w-32 h-32 md:w-40 md:h-40">
        <div className="absolute inset-0 bg-yellow-300 rounded-full animate-pulse shadow-[0_0_60px_30px_rgba(253,224,71,0.5)]" />
        {/* Sun rays */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 w-2 h-20 bg-yellow-200 origin-bottom animate-spin-slow"
            style={{
              transform: `translate(-50%, -100%) rotate(${i * 45}deg)`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
      {/* Light clouds */}
      <div className="absolute top-20 left-10 w-24 h-12 bg-white/30 rounded-full animate-float" />
      <div className="absolute top-40 left-1/4 w-32 h-16 bg-white/20 rounded-full animate-float-delayed" />
    </>
  )
}

function CloudyAnimation() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute bg-white/70 rounded-full animate-cloud"
          style={{
            width: `${100 + i * 30}px`,
            height: `${50 + i * 15}px`,
            top: `${10 + i * 15}%`,
            left: '-150px',
            animationDelay: `${i * 3}s`,
            animationDuration: `${20 + i * 5}s`,
          }}
        />
      ))}
    </>
  )
}

function RainyAnimation() {
  return (
    <>
      {/* Clouds */}
      <div className="absolute top-5 left-1/4 w-40 h-20 bg-slate-500/80 rounded-full" />
      <div className="absolute top-10 left-1/3 w-48 h-24 bg-slate-500/80 rounded-full" />
      <div className="absolute top-8 right-1/4 w-44 h-22 bg-slate-500/80 rounded-full" />
      {/* Rain drops */}
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute w-0.5 h-6 bg-blue-300/60 animate-rain"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-20px',
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${0.5 + Math.random() * 0.5}s`,
          }}
        />
      ))}
    </>
  )
}

function SnowyAnimation() {
  return (
    <>
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full animate-snow"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-10px',
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 3}s`,
          }}
        />
      ))}
    </>
  )
}
