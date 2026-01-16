import Link from 'next/link'
import WeatherBackground from '@/components/WeatherBackground'
import WeatherCard from '@/components/WeatherCard'
import WeeklyForecast from '@/components/WeeklyForecast'
import { fetchJMAForecast } from '@/lib/jma'
import { upsertForecasts } from '@/lib/weather-db'
import { getWeatherType, WeatherForecast } from '@/types/weather'

export const revalidate = 3600 // 1時間ごとに再検証

async function getWeatherData(): Promise<WeatherForecast[]> {
  try {
    const forecasts = await fetchJMAForecast()

    // DBにデータを保存（バックグラウンドで実行、エラーは無視）
    upsertForecasts(forecasts).catch((err) =>
      console.error('Failed to upsert forecasts:', err)
    )

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
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-10 animate-fade-in">
          <h1 className="text-4xl md:text-5xl text-white drop-shadow-lg tracking-wider">
            相模原市の天気
          </h1>
          <p className="text-white/70 mt-3 tracking-wide">神奈川県西部</p>
        </header>

        {/* Navigation */}
        <nav className="flex justify-center gap-3 mb-10 animate-fade-in">
          <Link
            href="/"
            className="px-5 py-2.5 glass-card-strong rounded-full text-white font-medium tracking-wide transition-all hover:scale-105"
          >
            天気予報
          </Link>
          <Link
            href="/history"
            className="px-5 py-2.5 glass-card rounded-full text-white/80 tracking-wide hover:bg-white/20 transition-all hover:scale-105"
          >
            履歴カレンダー
          </Link>
        </nav>

        {/* Today & Tomorrow */}
        <section className="mb-10">
          <h2 className="text-2xl text-white mb-5 tracking-wide animate-fade-in">
            今日・明日の天気
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {today && <WeatherCard forecast={today} isToday />}
            {tomorrow && <WeatherCard forecast={tomorrow} />}
          </div>
        </section>

        {/* Weekly Forecast */}
        <section className="mb-10">
          {weeklyForecasts.length > 0 && (
            <WeeklyForecast forecasts={weeklyForecasts} />
          )}
        </section>

        {/* Footer */}
        <footer className="text-center text-white/50 text-sm animate-fade-in">
          <p className="tracking-wide">データ提供: 気象庁</p>
          <p className="mt-2 text-xs">
            最終更新: {new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
          </p>
        </footer>
      </div>
    </WeatherBackground>
  )
}
