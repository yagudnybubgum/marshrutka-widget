import { describe, it, expect } from 'vitest'
import { parseTime } from './parseTime.js'
import { formatTime, formatTimeUntil } from './formatTime.js'
import { formatDirectionName } from './formatDirectionName.js'
import { getScheduleWindow } from './getScheduleWindow.js'
import { isHoliday, isWeekendOrHoliday } from '../holidays.js'

describe('parseTime', () => {
  it('parses HH:MM strings', () => {
    expect(parseTime('7:30')).toBe(450)
    expect(parseTime('23:45')).toBe(1425)
  })

  it('parses HH.MM strings', () => {
    expect(parseTime('8.15')).toBe(495)
  })

  it('parses Excel fraction', () => {
    expect(parseTime(0.5)).toBe(720)
  })

  it('returns null for invalid values', () => {
    expect(parseTime(null)).toBeNull()
    expect(parseTime('')).toBeNull()
    expect(parseTime('invalid')).toBeNull()
  })
})

describe('formatTime', () => {
  it('formats minutes as HH:MM', () => {
    expect(formatTime(450)).toBe('7:30')
    expect(formatTime(5)).toBe('0:05')
  })
})

describe('formatTimeUntil', () => {
  it('formats minutes under an hour', () => {
    expect(formatTimeUntil(15)).toBe('15 мин')
  })

  it('formats hours and minutes', () => {
    expect(formatTimeUntil(90)).toBe('1 ч. 30 мин')
    expect(formatTimeUntil(120)).toBe('2 ч.')
  })
})

describe('formatDirectionName', () => {
  it('formats route 533 directions', () => {
    expect(formatDirectionName('Янино_=>_Ладожская')).toBe('Из Янино')
    expect(formatDirectionName('Ладожская_=>_Янино1')).toBe('С Ладожской')
  })

  it('formats route 664 directions', () => {
    expect(formatDirectionName('МЕГА Дыбенко')).toBe('От "МЕГА Дыбенко"')
    expect(formatDirectionName('Янино-1')).toBe('Из Янино')
  })
})

describe('getScheduleWindow', () => {
  const times = [360, 420, 480, 540]

  it('finds next trip today', () => {
    const result = getScheduleWindow(times, 400)
    expect(result.nextTrip.time).toBe(420)
    expect(result.nextTrip.isTomorrow).toBe(false)
  })

  it('wraps to tomorrow after last trip', () => {
    const result = getScheduleWindow(times, 600)
    expect(result.nextTrip.time).toBe(360)
    expect(result.nextTrip.isTomorrow).toBe(true)
  })

  it('handles empty times', () => {
    const result = getScheduleWindow([], 100)
    expect(result.nextTrip).toBeNull()
  })
})

describe('holidays', () => {
  it('detects known 2026 holidays', () => {
    expect(isHoliday(new Date(2026, 0, 1))).toBe(true)
    expect(isHoliday(new Date(2026, 2, 9))).toBe(true)
  })

  it('detects regular weekdays', () => {
    expect(isHoliday(new Date(2026, 6, 8))).toBe(false)
  })

  it('combines weekends and holidays', () => {
    expect(isWeekendOrHoliday(new Date(2026, 6, 11))).toBe(true)
    expect(isWeekendOrHoliday(new Date(2026, 6, 8))).toBe(false)
  })
})
