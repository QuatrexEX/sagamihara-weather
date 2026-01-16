import { supabase } from '@/lib/supabase'
import { WeatherRecord } from '@/types/weather'
import HistoryContent from '@/components/HistoryContent'

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
  const todayStr = now.toISOString().split('T')[0]

  // 当日の天気コードを取得
  const todayRecord = records.find(r => r.date === todayStr)
  const todayWeatherCode = todayRecord?.weather_code || null

  return (
    <HistoryContent
      records={records}
      initialYear={now.getFullYear()}
      initialMonth={now.getMonth() + 1}
      todayWeatherCode={todayWeatherCode}
    />
  )
}
