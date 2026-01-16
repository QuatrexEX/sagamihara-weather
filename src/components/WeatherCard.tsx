'use client'

import { WeatherForecast, getWeatherEmoji } from '@/types/weather'

interface WeatherCardProps {
  forecast: WeatherForecast
  isToday?: boolean
}

export default function WeatherCard({ forecast, isToday = false }: WeatherCardProps) {
  const date = new Date(forecast.date)
  const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()]
  const isWeekend = date.getDay() === 0 || date.getDay() === 6

  return (
    <div
      className={`
        backdrop-blur-md rounded-2xl p-4 md:p-6 text-white shadow-lg
        ${isToday ? 'bg-white/30 ring-2 ring-white/50' : 'bg-white/20'}
        transition-transform hover:scale-105
      `}
    >
      <div className="text-center">
        <p className="text-sm opacity-80">
          {date.getMonth() + 1}/{date.getDate()}
        </p>
        <p className={`text-lg font-bold ${isWeekend ? (date.getDay() === 0 ? 'text-red-300' : 'text-blue-300') : ''}`}>
          {dayOfWeek}曜日
          {isToday && <span className="ml-2 text-xs bg-white/30 px-2 py-0.5 rounded-full">今日</span>}
        </p>
        <div className="text-5xl md:text-6xl my-3">
          {getWeatherEmoji(forecast.weatherCode)}
        </div>
        <p className="text-lg font-medium">{forecast.weatherText}</p>
        <div className="mt-3 flex justify-center gap-4 text-sm">
          {forecast.tempHigh !== null && (
            <span className="text-red-300">
              <span className="text-xs">最高</span> {forecast.tempHigh}°C
            </span>
          )}
          {forecast.tempLow !== null && (
            <span className="text-blue-300">
              <span className="text-xs">最低</span> {forecast.tempLow}°C
            </span>
          )}
        </div>
        {forecast.pop !== null && (
          <p className="mt-2 text-sm opacity-80">
            降水確率 {forecast.pop}%
          </p>
        )}
      </div>
    </div>
  )
}
