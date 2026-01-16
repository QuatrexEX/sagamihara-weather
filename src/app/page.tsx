import Link from 'next/link'
import WeatherBackground from '@/components/WeatherBackground'
import WeatherCard from '@/components/WeatherCard'
import WeeklyForecast from '@/components/WeeklyForecast'
import { fetchJMAForecast } from '@/lib/jma'
import { getWeatherType, WeatherForecast } from '@/types/weather'

export const revalidate = 3600 // 1時間ごとに再検証

async function getWeatherData(): Promise<WeatherForecast[]> {
  try {
    const forecasts = await fetchJMAForecast()
    return forecasts
  } catch (error) {
    console.error('Failed to fetch weather:', error)
    return []
  }
}

export default async function Home() {
  const forecasts = await getWeatherData()
  const today = forecasts[0]
  const tomorrow = forecasts[1]
  const weeklyForecasts = forecasts.slice(0, 8) // 今日から一週間後まで（8日間）

  const currentWeatherType = today ? getWeatherType(today.weatherCode) : 'sunny'

  return (
    <WeatherBackground weatherType={currentWeatherType}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
            相模原市の天気
          </h1>
          <p className="text-white/80 mt-2">神奈川県西部</p>
        </header>

        {/* Navigation */}
        <nav className="flex justify-center gap-4 mb-8">
          <Link
            href="/"
            className="px-4 py-2 bg-white/30 backdrop-blur-sm rounded-full text-white font-medium hover:bg-white/40 transition-colors"
          >
            天気予報
          </Link>
          <Link
            href="/history"
            className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/80 hover:bg-white/30 transition-colors"
          >
            履歴カレンダー
          </Link>
        </nav>

        {/* Today & Tomorrow */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4 drop-shadow">今日・明日の天気</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {today && <WeatherCard forecast={today} isToday />}
            {tomorrow && <WeatherCard forecast={tomorrow} />}
          </div>
        </section>

        {/* Weekly Forecast */}
        <section>
          {weeklyForecasts.length > 0 && (
            <WeeklyForecast forecasts={weeklyForecasts} />
          )}
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center text-white/60 text-sm">
          <p>データ提供: 気象庁</p>
          <p className="mt-1">最終更新: {new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}</p>
        </footer>
      </div>
    </WeatherBackground>
  )
}
