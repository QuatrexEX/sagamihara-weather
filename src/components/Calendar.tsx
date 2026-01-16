'use client'

import { useState } from 'react'
import { WeatherRecord, getWeatherEmoji } from '@/types/weather'

interface CalendarProps {
  records: WeatherRecord[]
  initialYear: number
  initialMonth: number
  onWeatherChange?: (weatherCode: string | null) => void
}

// JSTの今日の日付を取得
function getTodayJST(): string {
  const now = new Date()
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  return jst.toISOString().split('T')[0]
}

export default function Calendar({ records, initialYear, initialMonth, onWeatherChange }: CalendarProps) {
  const [year, setYear] = useState(initialYear)
  const [month, setMonth] = useState(initialMonth)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const todayDate = getTodayJST()

  const daysInMonth = new Date(year, month, 0).getDate()
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay()

  const recordMap = new Map<string, WeatherRecord>()
  records.forEach((record) => {
    recordMap.set(record.date, record)
  })

  const handleDateSelect = (dateStr: string) => {
    setSelectedDate(dateStr)
    const record = recordMap.get(dateStr)
    onWeatherChange?.(record?.weather_code || null)
  }

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
    <div className="glass-card rounded-3xl p-5 md:p-7 animate-fade-in">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={prevMonth}
          className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all duration-300 text-white group"
          aria-label="前月"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h2 className="text-2xl md:text-3xl text-white tracking-wider">
          {year}年{month}月
        </h2>

        <button
          onClick={nextMonth}
          className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all duration-300 text-white group"
          aria-label="翌月"
        >
          <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-3">
        {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
          <div
            key={day}
            className={`text-center text-sm font-medium py-2 ${
              index === 0 ? 'text-red-300' : index === 6 ? 'text-blue-300' : 'text-white/60'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1.5">
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
          const isToday = dateStr === todayDate

          return (
            <button
              key={day}
              onClick={() => handleDateSelect(dateStr)}
              className={`
                aspect-square rounded-xl flex flex-col items-center justify-center
                transition-all duration-300 relative group
                ${isSelected
                  ? 'bg-white/30 ring-2 ring-white shadow-lg scale-105'
                  : 'bg-white/5 hover:bg-white/15'
                }
                ${isToday && !isSelected ? 'ring-2 ring-amber-400/60' : ''}
              `}
            >
              <span
                className={`text-sm font-medium ${
                  dayOfWeek === 0 ? 'text-red-300' : dayOfWeek === 6 ? 'text-blue-300' : 'text-white/90'
                }`}
              >
                {day}
              </span>
              {record && (
                <span className="text-lg leading-none mt-0.5 group-hover:scale-110 transition-transform">
                  {getWeatherEmoji(record.weather_code)}
                </span>
              )}
              {isToday && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full" />
              )}
            </button>
          )
        })}
      </div>

      {/* Selected Date Details */}
      {selectedRecord && (
        <div className="mt-8 p-5 bg-white/10 rounded-2xl border border-white/20 animate-scale-in">
          <h3 className="text-lg text-white mb-4 tracking-wide">
            {selectedDate?.replace(/-/g, '/')}の天気
          </h3>
          <div className="flex items-center gap-6">
            <div className="text-6xl animate-float">
              {getWeatherEmoji(selectedRecord.weather_code)}
            </div>
            <div className="flex-1">
              <p className="text-xl font-medium text-white mb-2">
                {selectedRecord.weather_text}
              </p>
              {selectedRecord.pop !== null && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-white/60">降水確率</span>
                  <span className="text-white font-medium">{selectedRecord.pop}%</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedDate && !selectedRecord && (
        <div className="mt-8 p-5 bg-white/10 rounded-2xl border border-white/20 animate-scale-in">
          <p className="text-white/70 text-center">
            {selectedDate?.replace(/-/g, '/')}のデータはありません
          </p>
        </div>
      )}
    </div>
  )
}
