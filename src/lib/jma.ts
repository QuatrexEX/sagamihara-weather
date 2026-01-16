import { WeatherForecast } from '@/types/weather'

const JMA_FORECAST_URL = 'https://www.jma.go.jp/bosai/forecast/data/forecast/140000.json'

// 神奈川県西部のarea code
const KANAGAWA_WEST_AREA_CODE = '140020'

interface JMAForecastResponse {
  publishingOffice: string
  reportDatetime: string
  timeSeries: JMATimeSeries[]
  tempAverage?: unknown
  precipAverage?: unknown
}

interface JMATimeSeries {
  timeDefines: string[]
  areas: JMAArea[]
}

interface JMAArea {
  area: {
    name: string
    code: string
  }
  weatherCodes?: string[]
  weathers?: string[]
  winds?: string[]
  waves?: string[]
  pops?: string[]
  temps?: string[]
  tempsMin?: string[]
  tempsMinUpper?: string[]
  tempsMinLower?: string[]
  tempsMax?: string[]
  tempsMaxUpper?: string[]
  tempsMaxLower?: string[]
  reliabilities?: string[]
}

export async function fetchJMAForecast(): Promise<WeatherForecast[]> {
  const response = await fetch(JMA_FORECAST_URL, {
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch JMA forecast')
  }

  const data: JMAForecastResponse[] = await response.json()

  const forecasts: WeatherForecast[] = []

  // 今日・明日の予報（最初のデータセット）
  const dailyForecast = data[0]
  if (dailyForecast?.timeSeries) {
    const weatherSeries = dailyForecast.timeSeries[0]
    const popSeries = dailyForecast.timeSeries[1]
    const tempSeries = dailyForecast.timeSeries[2]

    const weatherArea = weatherSeries?.areas?.find(
      (a) => a.area.code === KANAGAWA_WEST_AREA_CODE
    )
    const popArea = popSeries?.areas?.find(
      (a) => a.area.code === KANAGAWA_WEST_AREA_CODE
    )
    const tempArea = tempSeries?.areas?.find(
      (a) => a.area.code === KANAGAWA_WEST_AREA_CODE
    )

    if (weatherArea && weatherSeries.timeDefines) {
      weatherSeries.timeDefines.forEach((time, index) => {
        const date = time.split('T')[0]
        const existingForecast = forecasts.find((f) => f.date === date)

        if (!existingForecast) {
          forecasts.push({
            date,
            weatherCode: weatherArea.weatherCodes?.[index] || '100',
            weatherText: weatherArea.weathers?.[index] || '不明',
            tempHigh: null,
            tempLow: null,
            pop: null,
          })
        }
      })
    }

    // 気温を追加
    if (tempArea && tempSeries?.timeDefines) {
      tempSeries.timeDefines.forEach((time, index) => {
        const date = time.split('T')[0]
        const forecast = forecasts.find((f) => f.date === date)
        if (forecast && tempArea.temps?.[index]) {
          const temp = parseInt(tempArea.temps[index], 10)
          if (!isNaN(temp)) {
            // 最初の温度は最低気温、2番目は最高気温として扱う
            if (index % 2 === 0) {
              forecast.tempLow = temp
            } else {
              forecast.tempHigh = temp
            }
          }
        }
      })
    }

    // 降水確率を追加
    if (popArea && popSeries?.timeDefines) {
      popSeries.timeDefines.forEach((time, index) => {
        const date = time.split('T')[0]
        const forecast = forecasts.find((f) => f.date === date)
        if (forecast && popArea.pops?.[index]) {
          const pop = parseInt(popArea.pops[index], 10)
          if (!isNaN(pop)) {
            forecast.pop = Math.max(forecast.pop || 0, pop)
          }
        }
      })
    }
  }

  // 週間予報（2番目のデータセット）
  const weeklyForecast = data[1]
  if (weeklyForecast?.timeSeries) {
    const weatherSeries = weeklyForecast.timeSeries[0]
    const tempSeries = weeklyForecast.timeSeries[1]

    const weatherArea = weatherSeries?.areas?.find(
      (a) => a.area.code === KANAGAWA_WEST_AREA_CODE
    )
    const tempArea = tempSeries?.areas?.find(
      (a) => a.area.code === KANAGAWA_WEST_AREA_CODE
    )

    if (weatherArea && weatherSeries.timeDefines) {
      weatherSeries.timeDefines.forEach((time, index) => {
        const date = time.split('T')[0]
        const existingForecast = forecasts.find((f) => f.date === date)

        if (!existingForecast) {
          forecasts.push({
            date,
            weatherCode: weatherArea.weatherCodes?.[index] || '100',
            weatherText: getWeatherTextFromCode(weatherArea.weatherCodes?.[index] || '100'),
            tempHigh: tempArea?.tempsMax?.[index] ? parseInt(tempArea.tempsMax[index], 10) : null,
            tempLow: tempArea?.tempsMin?.[index] ? parseInt(tempArea.tempsMin[index], 10) : null,
            pop: weatherArea.pops?.[index] ? parseInt(weatherArea.pops[index], 10) : null,
          })
        }
      })
    }
  }

  // 日付順にソート
  forecasts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return forecasts
}

function getWeatherTextFromCode(code: string): string {
  const weatherMap: Record<string, string> = {
    '100': '晴れ',
    '101': '晴れ時々曇り',
    '102': '晴れ一時雨',
    '103': '晴れ時々雨',
    '104': '晴れ一時雪',
    '105': '晴れ時々雪',
    '110': '晴れ後曇り',
    '111': '晴れ後曇り時々雨',
    '112': '晴れ後一時雨',
    '113': '晴れ後時々雨',
    '114': '晴れ後雨',
    '115': '晴れ後一時雪',
    '116': '晴れ後時々雪',
    '117': '晴れ後雪',
    '200': '曇り',
    '201': '曇り時々晴れ',
    '202': '曇り一時雨',
    '203': '曇り時々雨',
    '204': '曇り一時雪',
    '205': '曇り時々雪',
    '210': '曇り後晴れ',
    '211': '曇り後雨',
    '212': '曇り後一時雨',
    '213': '曇り後時々雨',
    '214': '曇り後雪',
    '215': '曇り後一時雪',
    '216': '曇り後時々雪',
    '300': '雨',
    '301': '雨時々晴れ',
    '302': '雨時々曇り',
    '303': '雨時々雪',
    '304': '雨一時雪',
    '311': '雨後晴れ',
    '313': '雨後曇り',
    '314': '雨後時々雪',
    '400': '雪',
    '401': '雪時々晴れ',
    '402': '雪時々曇り',
    '403': '雪時々雨',
    '411': '雪後晴れ',
    '413': '雪後曇り',
    '414': '雪後雨',
  }

  return weatherMap[code] || '不明'
}
