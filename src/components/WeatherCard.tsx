'use client'

import { WeatherForecast, getWeatherEmoji } from '@/types/weather'

interface WeatherCardProps {
  forecast: WeatherForecast
  isToday?: boolean
}

export default function WeatherCard({ forecast, isToday = false }: WeatherCardProps) {
  // 日付文字列をJSTとして解釈
  const date = new Date(forecast.date + 'T00:00:00+09:00')
  const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()]
  const isWeekend = date.getDay() === 0 || date.getDay() === 6

  return (
    <div
      className={`
        glass-card rounded-3xl p-5 md:p-7 text-white
        hover-lift gradient-border
        ${isToday ? 'glass-card-strong' : ''}
        animate-fade-in
      `}
    >
      {/* 日付ヘッダー */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-white/70 text-sm tracking-wide">
            {date.getMonth() + 1}月{date.getDate()}日
          </p>
          <p className={`text-2xl font-medium tracking-wider ${
            isWeekend
              ? (date.getDay() === 0 ? 'text-red-300' : 'text-blue-300')
              : 'text-white'
          }`}>
            {dayOfWeek}曜日
          </p>
        </div>
        {isToday && (
          <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium tracking-wide border border-white/30">
            今日
          </span>
        )}
      </div>

      {/* 天気アイコン */}
      <div className="text-center my-6">
        <div className="text-7xl md:text-8xl animate-float drop-shadow-lg">
          {getWeatherEmoji(forecast.weatherCode)}
        </div>
        <p className="mt-3 text-lg font-medium text-white/90 tracking-wide">
          {forecast.weatherText}
        </p>
      </div>

      {/* 降水確率 */}
      {forecast.pop !== null && (
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.5 17a4.5 4.5 0 01-1.44-8.765 4.5 4.5 0 018.302-3.046 3.5 3.5 0 014.504 4.272A4 4 0 0115 17H5.5zm3.75-2.75a.75.75 0 001.5 0V9.66l1.95 2.1a.75.75 0 101.1-1.02l-3.25-3.5a.75.75 0 00-1.1 0l-3.25 3.5a.75.75 0 101.1 1.02l1.95-2.1v4.59z" clipRule="evenodd" />
            </svg>
            <span className="text-white/70 text-sm">降水確率</span>
            <span className="text-white font-medium">{forecast.pop}%</span>
          </div>
          {/* 降水確率バー */}
          <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-blue-300 rounded-full transition-all duration-500"
              style={{ width: `${forecast.pop}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
