export function getScheduleWindow(times, currentTime, followingCount = 3, cancelledToday = null) {
  if (!times || times.length === 0) {
    return { nextTrip: null, followingTrips: [], previousTrip: null }
  }

  const minutesInDay = 24 * 60
  const n = times.length

  const isAllowed = (time, dayOffset) =>
    !(dayOffset === 0 && cancelledToday != null && cancelledToday.has(time))

  const buildTrip = (index, dayOffset) => ({
    time: times[index],
    minutesUntil: times[index] + dayOffset * minutesInDay - currentTime,
    isTomorrow: dayOffset > 0,
  })

  let nextIndex = times.findIndex((time) => time >= currentTime)
  let baseOffset = 0

  if (nextIndex === -1) {
    nextIndex = 0
    baseOffset = 1
  }

  let nextTrip = null
  for (let i = 0; i < n * 2; i++) {
    const rawIndex = nextIndex + i
    const wrappedIndex = rawIndex % n
    const wrapOffset = baseOffset + Math.floor(rawIndex / n)
    if (!isAllowed(times[wrappedIndex], wrapOffset)) continue
    nextTrip = buildTrip(wrappedIndex, wrapOffset)
    nextIndex = wrappedIndex
    baseOffset = wrapOffset
    break
  }

  if (!nextTrip) {
    return { nextTrip: null, followingTrips: [], previousTrip: null }
  }

  let previousTrip = null
  for (let i = 1; i <= n; i++) {
    const absolute = baseOffset * n + nextIndex - i
    if (absolute < 0) break
    const wrapOffset = Math.floor(absolute / n)
    const wrappedIndex = absolute % n
    if (!isAllowed(times[wrappedIndex], wrapOffset)) continue
    previousTrip = buildTrip(wrappedIndex, wrapOffset)
    break
  }

  const followingTrips = []
  for (let i = 1; followingTrips.length < followingCount && i <= n * 2; i++) {
    const rawIndex = nextIndex + i
    const wrappedIndex = rawIndex % n
    const wrapOffset = baseOffset + Math.floor(rawIndex / n)
    if (!isAllowed(times[wrappedIndex], wrapOffset)) continue
    followingTrips.push(buildTrip(wrappedIndex, wrapOffset))
  }

  return { nextTrip, followingTrips, previousTrip }
}
