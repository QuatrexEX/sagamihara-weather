'use client'

import { WeatherForecast, getWeatherEmoji } from '@/types/weather'

interface WeeklyForecastProps {
  forecasts: WeatherForecast[]
}

export default function WeeklyForecast({ forecasts }: WeeklyForecastProps) {
  return (
    <div className="backdrop-blur-md bg-white/20 rounded-2xl p-4 md:p-6">
      <h2 className="text-xl font-bold text-white mb-4">週間予報</h2>
      <div className="space-y-2">
        {forecasts.map((forecast, index) => {
          const date = new Date(forecast.date)
          const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()]
          const isWeekend = date.getDay() === 0 || date.getDay() === 6
          const isToday = index === 0

          return (
            <div
              key={forecast.date}
              className={`
                flex items-center justify-between p-3 rounded-xl
                ${isToday ? 'bg-white/20' : 'bg-white/10'}
                hover:bg-white/25 transition-colors
              `}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getWeatherEmoji(forecast.weatherCode)}</span>
                <div>
                  <p className={`font-medium text-white ${isWeekend ? (date.getDay() === 0 ? 'text-red-300' : 'text-blue-300') : ''}`}>
                    {date.getMonth() + 1}/{date.getDate()} ({dayOfWeek})
                    {isToday && <span className="ml-2 text-xs bg-white/30 px-2 py-0.5 rounded-full">今日</span>}
                  </p>
                  <p className="text-sm text-white/80">{forecast.weatherText}</p>
                </div>
              </div>
              <div className="text-right text-sm text-white">
                <p>
                  {forecast.tempHigh !== null && <span className="text-red-300">{forecast.tempHigh}°</span>}
                  {forecast.tempHigh !== null && forecast.tempLow !== null && ' / '}
                  {forecast.tempLow !== null && <span className="text-blue-300">{forecast.tempLow}°</span>}
                </p>
                {forecast.pop !== null && (
                  <p className="text-white/60">{forecast.pop}%</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
