import { createClient } from '@supabase/supabase-js'
import { WeatherForecast } from '@/types/weather'

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    return null
  }

  return createClient(url, key)
}

export async function upsertForecasts(forecasts: WeatherForecast[]): Promise<boolean> {
  const supabaseAdmin = getSupabaseAdmin()

  if (!supabaseAdmin) {
    console.warn('Supabase admin client not available (missing SERVICE_ROLE_KEY)')
    return false
  }

  try {
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
        return false
      }
    }
    return true
  } catch (error) {
    console.error('Error in upsertForecasts:', error)
    return false
  }
}

export async function deleteOldRecords(): Promise<boolean> {
  const supabaseAdmin = getSupabaseAdmin()

  if (!supabaseAdmin) {
    return false
  }

  try {
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

    const { error } = await supabaseAdmin
      .from('weather_records')
      .delete()
      .lt('date', oneYearAgo.toISOString().split('T')[0])

    if (error) {
      console.error('Error deleting old records:', error)
      return false
    }
    return true
  } catch (error) {
    console.error('Error in deleteOldRecords:', error)
    return false
  }
}
