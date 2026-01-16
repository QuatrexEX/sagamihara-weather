'use client'

import { useState } from 'react'
import { WeatherRecord, getWeatherEmoji } from '@/types/weather'

interface CalendarProps {
  records: WeatherRecord[]
  initialYear: number
  initialMonth: number
}

export default function Calendar({ records, initialYear, initialMonth }: CalendarProps) {
  const [year, setYear] = useState(initialYear)
  const [month, setMonth] = useState(initialMonth)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const daysInMonth = new Date(year, month, 0).getDate()
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay()

  const recordMap = new Map<string, WeatherRecord>()
  records.forEach((record) => {
    recordMap.set(record.date, record)
  })

  const prevMonth = () => {
    if (month === 1) {
      setYear(year - 1)
      setMonth(12)
    } else {
      setMonth(month - 1)
    }
    setSelectedDate(null)
  }

  const nextMonth = () => {
    if (month === 12) {
      setYear(year + 1)
      setMonth(1)
    } else {
      setMonth(month + 1)
    }
    setSelectedDate(null)
  }

  const selectedRecord = selectedDate ? recordMap.get(selectedDate) : null

  return (
    <div className="backdrop-blur-md bg-white/20 rounded-2xl p-4 md:p-6">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-white">
          {year}年{month}月
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
          <div
            key={day}
            className={`text-center text-sm font-medium py-2 ${
              index === 0 ? 'text-red-300' : index === 6 ? 'text-blue-300' : 'text-white/80'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before the first day of month */}
        {[...Array(firstDayOfMonth)].map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}

        {/* Days of the month */}
        {[...Array(daysInMonth)].map((_, index) => {
          const day = index + 1
          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const record = recordMap.get(dateStr)
          const dayOfWeek = new Date(year, month - 1, day).getDay()
          const isSelected = selectedDate === dateStr
          const isToday = dateStr === new Date().toISOString().split('T')[0]

          return (
            <button
              key={day}
              onClick={() => setSelectedDate(dateStr)}
              className={`
                aspect-square rounded-lg flex flex-col items-center justify-center
                transition-all hover:scale-105
                ${isSelected ? 'bg-white/40 ring-2 ring-white' : 'bg-white/10 hover:bg-white/20'}
                ${isToday ? 'ring-2 ring-yellow-300' : ''}
              `}
            >
              <span
                className={`text-sm ${
                  dayOfWeek === 0 ? 'text-red-300' : dayOfWeek === 6 ? 'text-blue-300' : 'text-white'
                }`}
              >
                {day}
              </span>
              {record && (
                <span className="text-lg leading-none">
                  {getWeatherEmoji(record.weather_code)}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Selected Date Details */}
      {selectedRecord && (
        <div className="mt-6 p-4 bg-white/20 rounded-xl">
          <h3 className="text-lg font-bold text-white mb-2">
            {selectedDate?.replace(/-/g, '/')}の天気
          </h3>
          <div className="flex items-center gap-4">
            <span className="text-4xl">{getWeatherEmoji(selectedRecord.weather_code)}</span>
            <div className="text-white">
              <p className="text-lg font-medium">{selectedRecord.weather_text}</p>
              <p className="text-sm opacity-80">
                {selectedRecord.temp_high !== null && (
                  <span className="text-red-300">最高 {selectedRecord.temp_high}°C</span>
                )}
                {selectedRecord.temp_high !== null && selectedRecord.temp_low !== null && ' / '}
                {selectedRecord.temp_low !== null && (
                  <span className="text-blue-300">最低 {selectedRecord.temp_low}°C</span>
                )}
              </p>
              {selectedRecord.pop !== null && (
                <p className="text-sm opacity-80">降水確率 {selectedRecord.pop}%</p>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedDate && !selectedRecord && (
        <div className="mt-6 p-4 bg-white/20 rounded-xl">
          <p className="text-white/80 text-center">
            {selectedDate?.replace(/-/g, '/')}のデータはありません
          </p>
        </div>
      )}
    </div>
  )
}
