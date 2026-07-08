export function parseTime(value) {
  if (value === null || value === undefined || value === '') return null

  if (typeof value === 'number') {
    if (value >= 0 && value < 1) {
      const totalMinutes = Math.round(value * 24 * 60)
      const hours = Math.floor(totalMinutes / 60)
      const minutes = totalMinutes % 60
      return hours * 60 + minutes
    }
    if (value >= 0 && value < 1440 && value % 1 === 0) {
      return value
    }
    if (value >= 0 && value < 24) {
      return Math.floor(value) * 60
    }
  }

  const str = value.toString().trim()
  const timeMatch = str.match(/(\d{1,2})[:.](\d{2})/)
  if (timeMatch) {
    const hours = parseInt(timeMatch[1], 10)
    const minutes = parseInt(timeMatch[2], 10)
    if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
      return hours * 60 + minutes
    }
  }

  return null
}
