'use client'

import { useState } from 'react'
import Link from 'next/link'
import WeatherBackground from '@/components/WeatherBackground'
import Calendar from '@/components/Calendar'
import { WeatherRecord, getWeatherType, WeatherType } from '@/types/weather'

interface HistoryContentProps {
  records: WeatherRecord[]
  initialYear: number
  initialMonth: number
  todayWeatherCode: string | null
}

export default function HistoryContent({ records, initialYear, initialMonth, todayWeatherCode }: HistoryContentProps) {
  // 初期背景は当日の天気、選択されたらその天気に変更
  const [currentWeatherType, setCurrentWeatherType] = useState<WeatherType>(
    todayWeatherCode ? getWeatherType(todayWeatherCode) : 'cloudy'
  )

  const handleWeatherChange = (weatherCode: string | null) => {
    if (weatherCode) {
      setCurrentWeatherType(getWeatherType(weatherCode))
    }
  }

  // 統計データの計算
  const stats = {
    total: records.length,
    sunny: records.filter((r) => r.weather_code.startsWith('1')).length,
    cloudy: records.filter((r) => r.weather_code.startsWith('2')).length,
    rainy: records.filter((r) => r.weather_code.startsWith('3') || r.weather_code.startsWith('4')).length,
  }

  return (
    <WeatherBackground weatherType={currentWeatherType}>
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-10 animate-fade-in">
          <h1 className="text-4xl md:text-5xl text-white drop-shadow-lg tracking-wider">
            天気の履歴
          </h1>
          <p className="text-white/70 mt-3 tracking-wide">過去1年間の天気記録</p>
        </header>

        {/* Navigation */}
        <nav className="flex justify-center gap-3 mb-10 animate-fade-in">
          <Link
            href="/"
            className="px-5 py-2.5 glass-card rounded-full text-white/80 tracking-wide hover:bg-white/20 transition-all hover:scale-105"
          >
            天気予報
          </Link>
          <Link
            href="/history"
            className="px-5 py-2.5 glass-card-strong rounded-full text-white font-medium tracking-wide transition-all hover:scale-105"
          >
            履歴カレンダー
          </Link>
        </nav>

        {/* Calendar */}
        <section className="mb-10">
          <Calendar
            records={records}
            initialYear={initialYear}
            initialMonth={initialMonth}
            onWeatherChange={handleWeatherChange}
          />
        </section>

        {/* Stats */}
        {records.length > 0 && (
          <section className="glass-card rounded-3xl p-5 md:p-7 mb-10 animate-fade-in">
            <h2 className="text-2xl text-white mb-6 tracking-wide">統計</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard value={stats.total} label="記録日数" icon="📊" />
              <StatCard value={stats.sunny} label="晴れの日" icon="☀️" />
              <StatCard value={stats.cloudy} label="曇りの日" icon="☁️" />
              <StatCard value={stats.rainy} label="雨/雪の日" icon="🌧️" />
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="text-center text-white/50 text-sm animate-fade-in">
          <p className="tracking-wide">データ提供: 気象庁</p>
        </footer>
      </div>
    </WeatherBackground>
  )
}

function StatCard({ value, label, icon }: { value: number; label: string; icon: string }) {
  return (
    <div className="bg-white/10 rounded-2xl p-4 text-center hover-lift transition-all">
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-3xl font-light text-white mb-1">{value}</p>
      <p className="text-sm text-white/60">{label}</p>
    </div>
  )
}
