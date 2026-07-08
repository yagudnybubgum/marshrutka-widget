export function formatTime(minutes) {
  const hours = Math.floor(minutes / 60) % 24
  const mins = minutes % 60
  return `${hours}:${mins.toString().padStart(2, '0')}`
}

export function formatTimeUntil(minutes) {
  if (minutes < 60) {
    return `${minutes} мин`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours} ч. ${mins} мин` : `${hours} ч.`
}

export function getCurrentTimeInMinutes(date) {
  return date.getHours() * 60 + date.getMinutes()
}
