import { NextRequest, NextResponse } from 'next/server'
import { fetchJMAForecast } from '@/lib/jma'
import { upsertForecasts, deleteOldRecords } from '@/lib/weather-db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  // Vercel Cron からの呼び出しかを確認
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // 気象庁APIから最新データを取得
    const forecasts = await fetchJMAForecast()

    // DBに保存
    const upsertSuccess = await upsertForecasts(forecasts)
    if (!upsertSuccess) {
      console.error('Failed to upsert some forecasts')
    }

    // 1年以上古いデータを削除
    const deleteSuccess = await deleteOldRecords()
    if (!deleteSuccess) {
      console.error('Failed to delete old records')
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
