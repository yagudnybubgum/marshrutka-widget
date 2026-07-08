import holidaysData from '../data/holidays.json'

const holidaySet = new Set(
  Object.values(holidaysData).flat(),
)

const supportedYears = new Set(
  Object.keys(holidaysData).map(Number),
)

const normalizeDate = (date) => {
  const normalized = new Date(date)
  normalized.setHours(0, 0, 0, 0)
  return normalized
}

const toDateKey = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

let warnedYears = new Set()

export const isHoliday = (date) => {
  const normalized = normalizeDate(date)
  const year = normalized.getFullYear()

  if (!supportedYears.has(year)) {
    if (!warnedYears.has(year)) {
      console.warn(`[holidays] Нет данных о праздниках для ${year} года`)
      warnedYears.add(year)
    }
    return false
  }

  return holidaySet.has(toDateKey(normalized))
}

export const isWeekendOrHoliday = (date) => {
  const dayOfWeek = date.getDay()
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
  return isWeekend || isHoliday(date)
}

export const getDayType = (date) => {
  return isWeekendOrHoliday(date) ? 'Выходной' : 'Будний'
}
