export function getScheduleWindow(times, currentTime, followingCount = 3) {
  if (!times || times.length === 0) {
    return { nextTrip: null, followingTrips: [], previousTrip: null }
  }

  const minutesInDay = 24 * 60
  let nextIndex = times.findIndex((time) => time >= currentTime)
  let baseOffset = 0

  if (nextIndex === -1) {
    nextIndex = 0
    baseOffset = 1
  }

  const buildTrip = (index, dayOffset) => {
    const absoluteTime = times[index] + dayOffset * minutesInDay
    return {
      time: times[index],
      minutesUntil: absoluteTime - currentTime,
      isTomorrow: dayOffset > 0,
    }
  }

  let previousIndex = nextIndex - 1
  let previousOffset = baseOffset
  if (previousIndex < 0) {
    previousIndex = times.length - 1
    previousOffset = baseOffset - 1
  }
  const previousTrip = previousOffset >= 0 ? buildTrip(previousIndex, previousOffset) : null

  const nextTrip = buildTrip(nextIndex, baseOffset)
  const followingTrips = []

  for (let i = 1; i <= followingCount; i++) {
    const rawIndex = nextIndex + i
    const wrappedIndex = rawIndex % times.length
    const wrapOffset = baseOffset + Math.floor(rawIndex / times.length)
    followingTrips.push(buildTrip(wrappedIndex, wrapOffset))
  }

  return { nextTrip, followingTrips, previousTrip }
}
