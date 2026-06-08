import { useEffect, useMemo, useState } from 'react'

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const MONTH_FULL = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const MONTH_LOOKUP = MONTH_SHORT.reduce((map, month, index) => {
  map[month.toLowerCase()] = index
  map[MONTH_FULL[index].toLowerCase()] = index
  map[MONTH_FULL[index].slice(0, 3).toLowerCase()] = index
  return map
}, {})

function isValidDate(value) {
  return value instanceof Date && !Number.isNaN(value.getTime())
}

function sameDay(a, b) {
  return (
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function isBetween(date, start, end) {
  if (!date || !start || !end) return false
  const time = new Date(date).setHours(0, 0, 0, 0)
  const startTime = new Date(start).setHours(0, 0, 0, 0)
  const endTime = new Date(end).setHours(0, 0, 0, 0)
  const min = Math.min(startTime, endTime)
  const max = Math.max(startTime, endTime)
  return time >= min && time <= max
}

export function formatEventDate(start, end = null) {
  if (!isValidDate(start)) return { date: '', period: '' }

  const monthShort = MONTH_SHORT[start.getMonth()]
  const period = `${MONTH_FULL[start.getMonth()]} ${start.getFullYear()}`

  if (isValidDate(end) && !sameDay(start, end)) {
    const endMonthShort = MONTH_SHORT[end.getMonth()]

    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      return {
        date: `${start.getDate()}–${end.getDate()} ${monthShort}`,
        period,
      }
    }

    return {
      date: `${start.getDate()} ${monthShort} – ${end.getDate()} ${endMonthShort}`,
      period: `${MONTH_FULL[start.getMonth()]} – ${MONTH_FULL[end.getMonth()]} ${start.getFullYear()}`,
    }
  }

  return {
    date: `${start.getDate()} ${monthShort}`,
    period,
  }
}

export function parseEventDate(dateStr = '', periodStr = '') {
  const yearMatch = periodStr.match(/\d{4}/)
  const year = yearMatch ? Number(yearMatch[0]) : new Date().getFullYear()

  const rangeMatch = dateStr.match(/^(\d{1,2})\s*[-\u2013\u2014]\s*(\d{1,2})\s+([A-Za-z]+)/)
  if (rangeMatch) {
    const monthIndex = MONTH_LOOKUP[rangeMatch[3].toLowerCase()]
    if (monthIndex !== undefined) {
      const start = new Date(year, monthIndex, Number(rangeMatch[1]))
      const end = new Date(year, monthIndex, Number(rangeMatch[2]))
      if (isValidDate(start) && isValidDate(end)) {
        return { start, end, isRange: true }
      }
    }
  }

  const singleMatch = dateStr.match(/^(\d{1,2})\s+([A-Za-z]+)/)
  if (singleMatch) {
    const monthIndex = MONTH_LOOKUP[singleMatch[2].toLowerCase()]
    if (monthIndex !== undefined) {
      const start = new Date(year, monthIndex, Number(singleMatch[1]))
      if (isValidDate(start)) {
        return { start, end: null, isRange: false }
      }
    }
  }

  return { start: null, end: null, isRange: false }
}

function buildCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1)
  const startOffset = firstDay.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = []

  for (let i = 0; i < startOffset; i += 1) {
    cells.push(null)
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day))
  }

  return cells
}

export default function EventDatePicker({ date, period, onChange }) {
  const parsed = useMemo(() => parseEventDate(date, period), [date, period])
  const initialView = isValidDate(parsed.start) ? parsed.start : new Date()

  const [viewYear, setViewYear] = useState(initialView.getFullYear())
  const [viewMonth, setViewMonth] = useState(initialView.getMonth())
  const [selectedStart, setSelectedStart] = useState(isValidDate(parsed.start) ? parsed.start : null)
  const [selectedEnd, setSelectedEnd] = useState(isValidDate(parsed.end) ? parsed.end : null)
  const [rangeMode, setRangeMode] = useState(parsed.isRange)

  useEffect(() => {
    const view = isValidDate(parsed.start) ? parsed.start : new Date()
    setViewYear(view.getFullYear())
    setViewMonth(view.getMonth())
    setSelectedStart(isValidDate(parsed.start) ? parsed.start : null)
    setSelectedEnd(isValidDate(parsed.end) ? parsed.end : null)
    setRangeMode(parsed.isRange)
  }, [date, period, parsed.end, parsed.isRange, parsed.start])

  const days = useMemo(() => buildCalendarDays(viewYear, viewMonth), [viewYear, viewMonth])

  const applySelection = (start, end, nextRangeMode) => {
    setSelectedStart(start)
    setSelectedEnd(end)
    onChange(formatEventDate(start, nextRangeMode ? end : null))
  }

  const handleDayClick = (day) => {
    if (!rangeMode) {
      applySelection(day, null, false)
      return
    }

    if (!selectedStart || selectedEnd) {
      applySelection(day, null, true)
      return
    }

    applySelection(selectedStart, day, true)
  }

  const shiftMonth = (delta) => {
    const next = new Date(viewYear, viewMonth + delta, 1)
    setViewYear(next.getFullYear())
    setViewMonth(next.getMonth())
  }

  const toggleRangeMode = () => {
    const nextRangeMode = !rangeMode
    setRangeMode(nextRangeMode)

    if (!nextRangeMode && selectedStart) {
      applySelection(selectedStart, null, false)
    }
  }

  const hasSelection = Boolean(selectedStart)

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-ink-muted transition-colors hover:border-brand/25 hover:text-brand"
          aria-label="Previous month"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <p className="font-medium text-ink">
          {MONTH_FULL[viewMonth]} {viewYear}
        </p>

        <button
          type="button"
          onClick={() => shiftMonth(1)}
          className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-ink-muted transition-colors hover:border-brand/25 hover:text-brand"
          aria-label="Next month"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[0.65rem] font-semibold tracking-wide text-ink-muted uppercase">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((weekday) => (
          <span key={weekday} className="py-1">
            {weekday}
          </span>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (!day) {
            return <span key={`empty-${index}`} />
          }

          const isStart = sameDay(day, selectedStart)
          const isEnd = sameDay(day, selectedEnd)
          const inRange = rangeMode && isBetween(new Date(day), selectedStart, selectedEnd)
          const isSelected = isStart || isEnd || inRange

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => handleDayClick(day)}
              className={`grid h-9 place-items-center rounded-lg text-sm transition-colors ${
                isStart || isEnd
                  ? 'bg-brand text-white'
                  : inRange
                    ? 'bg-brand-muted text-brand'
                    : isSelected
                      ? 'bg-brand text-white'
                      : 'text-ink hover:bg-surface-alt'
              }`}
            >
              {day.getDate()}
            </button>
          )
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 pt-4">
        <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-ink-muted">
          <input
            type="checkbox"
            checked={rangeMode}
            onChange={toggleRangeMode}
            className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand/30"
          />
          Multi-day event
        </label>

        <p className="text-sm text-ink">
          {hasSelection ? (
            <>
              <span className="font-medium">{date}</span>
              {period ? <span className="text-ink-muted"> · {period}</span> : null}
            </>
          ) : (
            <span className="text-ink-muted">Pick a date on the calendar</span>
          )}
        </p>
      </div>
    </div>
  )
}
