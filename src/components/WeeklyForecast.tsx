'use client'

import { WeatherForecast, getWeatherEmoji } from '@/types/weather'

interface WeeklyForecastProps {
  forecasts: WeatherForecast[]
}

// JSTの今日の日付を取得
function getTodayJST(): string {
  const now = new Date()
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  return jst.toISOString().split('T')[0]
}

export default function WeeklyForecast({ forecasts }: WeeklyForecastProps) {
  const todayDate = getTodayJST()

  return (
    <div className="glass-card rounded-3xl p-5 md:p-7 animate-fade-in">
      <h2 className="text-2xl text-white mb-6 tracking-wide">週間予報</h2>

      <div className="space-y-2">
        {forecasts.map((forecast, index) => {
          // 日付文字列をJSTとして解釈
          const date = new Date(forecast.date + 'T00:00:00+09:00')
          const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()]
          const isWeekend = date.getDay() === 0 || date.getDay() === 6
          const isToday = forecast.date === todayDate

          return (
            <div
              key={forecast.date}
              className={`
                group flex items-center justify-between p-4 rounded-2xl
                transition-all duration-300
                ${isToday
                  ? 'bg-white/20 border border-white/30'
                  : 'bg-white/5 hover:bg-white/15 border border-transparent'
                }
              `}
              style={{
                animationDelay: `${index * 0.05}s`,
              }}
            >
              {/* 日付と天気 */}
              <div className="flex items-center gap-4">
                <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                  {getWeatherEmoji(forecast.weatherCode)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className={`text-lg font-medium ${
                      isWeekend
                        ? (date.getDay() === 0 ? 'text-red-300' : 'text-blue-300')
                        : 'text-white'
                    }`}>
                      {date.getMonth() + 1}/{date.getDate()}
                      <span className="ml-1 text-sm">({dayOfWeek})</span>
                    </p>
                    {isToday && (
                      <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs text-white/90">
                        今日
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/70 mt-0.5">{forecast.weatherText}</p>
                </div>
              </div>

              {/* 降水確率 */}
              {forecast.pop !== null && (
                <div className="flex items-center gap-1.5 min-w-[60px] justify-end">
                  <svg className="w-3.5 h-3.5 text-blue-300/70" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a.75.75 0 01.75.75v.258a33.186 33.186 0 016.668.83.75.75 0 01-.336 1.461 31.28 31.28 0 00-1.103-.232l1.702 7.545a.75.75 0 01-.387.832A4.981 4.981 0 0115 14c-.825 0-1.606-.2-2.294-.556a.75.75 0 01-.387-.832l1.77-7.849a31.743 31.743 0 00-3.339-.254v11.505a20.01 20.01 0 013.78.501.75.75 0 11-.339 1.462A18.558 18.558 0 0010 17.5a18.558 18.558 0 00-4.191.477.75.75 0 11-.339-1.462 20.01 20.01 0 013.78-.501V4.509c-1.129.026-2.243.112-3.339.254l1.77 7.849a.75.75 0 01-.387.832A4.981 4.981 0 015 14c-.825 0-1.606-.2-2.294-.556a.75.75 0 01-.387-.832l1.702-7.545c-.37.07-.738.148-1.103.232a.75.75 0 01-.336-1.462 33.053 33.053 0 016.668-.829V2.75A.75.75 0 0110 2zM5 12.086l-1.27-5.629A27.847 27.847 0 015 6.27c.489.053.974.12 1.454.2L5 12.086zm10 0l-1.454-5.616c.48-.08.965-.147 1.454-.2-.19.016-.38.034-.569.054L15 12.086z" />
                  </svg>
                  <span className="text-white/60 text-sm">{forecast.pop}%</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
