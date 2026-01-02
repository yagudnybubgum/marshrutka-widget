// Праздничные дни 2026 года в России
// Включая переносы выходных дней

const HOLIDAYS_2026 = [
  // Новогодние каникулы и Рождество
  new Date(2026, 0, 1),  // 1 января
  new Date(2026, 0, 2),  // 2 января
  new Date(2026, 0, 3),  // 3 января (переносится на 9 января)
  new Date(2026, 0, 4),  // 4 января (переносится на 31 декабря)
  new Date(2026, 0, 5),  // 5 января
  new Date(2026, 0, 6),  // 6 января
  new Date(2026, 0, 7),  // 7 января - Рождество
  new Date(2026, 0, 8),  // 8 января
  new Date(2026, 0, 9),  // 9 января (перенос с 3 января)
  new Date(2025, 11, 31), // 31 декабря 2025 (перенос с 4 января)
  
  // День защитника Отечества
  new Date(2026, 1, 23), // 23 февраля
  
  // Международный женский день
  new Date(2026, 2, 8),  // 8 марта
  
  // Праздник Весны и Труда
  new Date(2026, 4, 1),  // 1 мая
  
  // День Победы
  new Date(2026, 4, 9),  // 9 мая
  
  // День России
  new Date(2026, 5, 12), // 12 июня
  
  // День народного единства
  new Date(2026, 10, 4), // 4 ноября
]

// Нормализует дату для сравнения (убирает время)
const normalizeDate = (date) => {
  const normalized = new Date(date)
  normalized.setHours(0, 0, 0, 0)
  return normalized
}

// Проверяет, является ли дата праздничным днем
export const isHoliday = (date) => {
  const normalized = normalizeDate(date)
  const year = normalized.getFullYear()
  
  // Если год не 2026, возвращаем false (можно расширить для других годов)
  if (year !== 2026 && year !== 2025) {
    return false
  }
  
  return HOLIDAYS_2026.some(holiday => {
    const normalizedHoliday = normalizeDate(holiday)
    return normalized.getTime() === normalizedHoliday.getTime()
  })
}

// Проверяет, является ли дата выходным днем (суббота, воскресенье или праздник)
export const isWeekendOrHoliday = (date) => {
  const dayOfWeek = date.getDay()
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
  return isWeekend || isHoliday(date)
}

// Возвращает тип дня: 'Выходной' или 'Будний'
export const getDayType = (date) => {
  return isWeekendOrHoliday(date) ? 'Выходной' : 'Будний'
}

