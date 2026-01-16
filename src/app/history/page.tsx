import Link from 'next/link'
import WeatherBackground from '@/components/WeatherBackground'
import Calendar from '@/components/Calendar'
import { supabase } from '@/lib/supabase'
import { WeatherRecord } from '@/types/weather'

export const revalidate = 3600

async function getHistoryData(): Promise<WeatherRecord[]> {
  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

  const { data, error } = await supabase
    .from('weather_records')
    .select('*')
    .gte('date', oneYearAgo.toISOString().split('T')[0])
    .order('date', { ascending: true })

  if (error) {
    console.error('Error fetching history:', error)
    return []
  }

  return data || []
}

export default async function HistoryPage() {
  const records = await getHistoryData()
  const now = new Date()

  return (
    <WeatherBackground weatherType="cloudy">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
            天気の履歴
          </h1>
          <p className="text-white/80 mt-2">過去1年間の天気記録</p>
        </header>

        {/* Navigation */}
        <nav className="flex justify-center gap-4 mb-8">
          <Link
            href="/"
            className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/80 hover:bg-white/30 transition-colors"
          >
            天気予報
          </Link>
          <Link
            href="/history"
            className="px-4 py-2 bg-white/30 backdrop-blur-sm rounded-full text-white font-medium hover:bg-white/40 transition-colors"
          >
            履歴カレンダー
          </Link>
        </nav>

        {/* Calendar */}
        <section>
          <Calendar
            records={records}
            initialYear={now.getFullYear()}
            initialMonth={now.getMonth() + 1}
          />
        </section>

        {/* Stats */}
        {records.length > 0 && (
          <section className="mt-8 backdrop-blur-md bg-white/20 rounded-2xl p-4 md:p-6">
            <h2 className="text-xl font-bold text-white mb-4">統計</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-white">
              <div>
                <p className="text-3xl font-bold">{records.length}</p>
                <p className="text-sm opacity-80">記録日数</p>
              </div>
              <div>
                <p className="text-3xl font-bold">
                  {records.filter((r) => r.weather_code.startsWith('1')).length}
                </p>
                <p className="text-sm opacity-80">晴れの日</p>
              </div>
              <div>
                <p className="text-3xl font-bold">
                  {records.filter((r) => r.weather_code.startsWith('2')).length}
                </p>
                <p className="text-sm opacity-80">曇りの日</p>
              </div>
              <div>
                <p className="text-3xl font-bold">
                  {records.filter((r) => r.weather_code.startsWith('3') || r.weather_code.startsWith('4')).length}
                </p>
                <p className="text-sm opacity-80">雨/雪の日</p>
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-white/60 text-sm">
          <p>データ提供: 気象庁</p>
        </footer>
      </div>
    </WeatherBackground>
  )
}
