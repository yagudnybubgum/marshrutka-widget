import { scheduleCancellations } from '../../data/scheduleCancellations.js'
import { parseTime } from './parseTime.js'

const toDateKey = (date) => {
  const d = new Date(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const parsedCache = new Map()

function getEntry(routeId, date) {
  if (!routeId || !date) return null
  const dateKey = toDateKey(date)
  const cacheKey = `${routeId}|${dateKey}`
  if (parsedCache.has(cacheKey)) return parsedCache.get(cacheKey)

  const raw = scheduleCancellations.find(
    (item) => item.routeId === routeId && item.date === dateKey,
  )
  if (!raw) {
    parsedCache.set(cacheKey, null)
    return null
  }

  const byDirection = {}
  for (const [directionName, times] of Object.entries(raw.byDirection || {})) {
    byDirection[directionName] = new Set(
      times.map((t) => parseTime(t)).filter((t) => t !== null),
    )
  }

  const entry = { byDirection }
  parsedCache.set(cacheKey, entry)
  return entry
}

/** @returns {Set<number>} minutes-from-midnight cancelled today for direction */
export function getCancelledTimesToday(routeId, date, directionName) {
  const entry = getEntry(routeId, date)
  if (!entry || !directionName) return new Set()
  return entry.byDirection[directionName] || new Set()
}

export function filterCancelledTimes(times, routeId, date, directionName) {
  const cancelled = getCancelledTimesToday(routeId, date, directionName)
  if (!cancelled.size) return times
  return times.filter((t) => !cancelled.has(t))
}
