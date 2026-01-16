import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { fetchJMAForecast } from '@/lib/jma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // まずDBから今日以降のデータを取得
    const today = new Date().toISOString().split('T')[0]
    const { data: existingData, error: fetchError } = await supabase
      .from('weather_records')
      .select('*')
      .gte('date', today)
      .order('date', { ascending: true })

    if (fetchError) {
      console.error('Error fetching from DB:', fetchError)
    }

    // DBにデータがあればそれを返す
    if (existingData && existingData.length > 0) {
      return NextResponse.json({
        forecasts: existingData.map((record) => ({
          date: record.date,
          weatherCode: record.weather_code,
          weatherText: record.weather_text,
          tempHigh: record.temp_high,
          tempLow: record.temp_low,
          pop: record.pop,
        })),
        source: 'database',
      })
    }

    // DBにデータがなければ気象庁APIから取得
    const forecasts = await fetchJMAForecast()

    return NextResponse.json({
      forecasts,
      source: 'jma',
    })
  } catch (error) {
    console.error('Error in weather API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    )
  }
}
