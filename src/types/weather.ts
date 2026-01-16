export interface WeatherRecord {
  id: string
  date: string
  weather_code: string
  weather_text: string
  temp_high: number | null
  temp_low: number | null
  pop: number | null
  fetched_at: string
  created_at: string
}

export interface WeatherForecast {
  date: string
  weatherCode: string
  weatherText: string
  tempHigh: number | null
  tempLow: number | null
  pop: number | null
}

export type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'unknown'

export function getWeatherType(weatherCode: string): WeatherType {
  const code = weatherCode.substring(0, 2)

  if (['10', '11', '12', '13'].includes(code)) return 'sunny'
  if (['20', '21', '22', '23', '24', '28', '29', '30', '31'].includes(code)) return 'cloudy'
  if (['30', '31', '32', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '60', '61', '62', '63', '64', '65', '66', '67', '68', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99'].includes(code)) return 'rainy'

  return 'unknown'
}

export function getWeatherEmoji(weatherCode: string): string {
  const type = getWeatherType(weatherCode)
  switch (type) {
    case 'sunny': return '☀️'
    case 'cloudy': return '☁️'
    case 'rainy': return '🌧️'
    case 'snowy': return '❄️'
    default: return '🌤️'
  }
}
