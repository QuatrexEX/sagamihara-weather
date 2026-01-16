import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { fetchJMAForecast } from '@/lib/jma'

export const dynamic = 'force-dynamic'

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(url, key)
}

export async function GET(request: NextRequest) {
  // Vercel Cron からの呼び出しかを確認
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabaseAdmin = getSupabaseAdmin()

    // 気象庁APIから最新データを取得
    const forecasts = await fetchJMAForecast()

    // 各予報をDBに保存（upsert）
    for (const forecast of forecasts) {
      const { error } = await supabaseAdmin
        .from('weather_records')
        .upsert(
          {
            date: forecast.date,
            weather_code: forecast.weatherCode,
            weather_text: forecast.weatherText,
            temp_high: forecast.tempHigh,
            temp_low: forecast.tempLow,
            pop: forecast.pop,
            fetched_at: new Date().toISOString(),
          },
          {
            onConflict: 'date',
          }
        )

      if (error) {
        console.error('Error upserting forecast:', error)
      }
    }

    // 1年以上古いデータを削除
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
    const { error: deleteError } = await supabaseAdmin
      .from('weather_records')
      .delete()
      .lt('date', oneYearAgo.toISOString().split('T')[0])

    if (deleteError) {
      console.error('Error deleting old records:', deleteError)
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${forecasts.length} forecasts`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { error: 'Failed to update weather data' },
      { status: 500 }
    )
  }
}
