import { parseTime } from './parseTime.js'
import { formatDirectionName } from './formatDirectionName.js'
import { isWeekendOrHoliday } from '../holidays.js'

function detectFormat(data) {
  const firstRow = data[0] || []
  const hasPeriodInfo = firstRow.some((cell) => {
    const value = cell ? cell.toString().toLowerCase() : ''
    return value.includes('будн') || value.includes('выходн')
  })

  if (hasPeriodInfo) {
    return {
      hasPeriodInfo: true,
      periodRow: firstRow,
      directionRow: data[1] || [],
      bodyRows: data.slice(2),
    }
  }

  return {
    hasPeriodInfo: false,
    periodRow: [],
    directionRow: firstRow,
    bodyRows: data.slice(1),
  }
}

function buildColumnMeta(hasPeriodInfo, periodRow, directionRow) {
  if (hasPeriodInfo) {
    return periodRow.map((cell, idx) => {
      const value = cell ? cell.toString().toLowerCase() : ''
      if (value.includes('будн')) return { idx, type: 'weekday' }
      if (value.includes('выходн')) return { idx, type: 'weekend' }
      return { idx, type: null }
    })
  }

  return directionRow.map((_, idx) => ({ idx, type: 'weekday' }))
}

function extractTimesForColumn(bodyRows, colIdx) {
  return bodyRows
    .map((row) => parseTime(row ? row[colIdx] : null))
    .filter((time) => time !== null)
    .sort((a, b) => a - b)
}

export function processScheduleForWidget(data, date = new Date()) {
  if (!data || data.length < 2) return null

  const isWeekend = isWeekendOrHoliday(date)
  const { hasPeriodInfo, periodRow, directionRow, bodyRows } = detectFormat(data)
  const columnMeta = buildColumnMeta(hasPeriodInfo, periodRow, directionRow)

  const buildDirections = (type) =>
    columnMeta
      .filter((col) => col.type === type)
      .map((col) => ({
        name: formatDirectionName(directionRow[col.idx] || ''),
        times: extractTimesForColumn(bodyRows, col.idx),
      }))
      .filter((dir) => dir.times.length > 0)

  const weekdayDirections = buildDirections('weekday')
  const weekendDirections = buildDirections('weekend')

  const activeDirections = (() => {
    if (!hasPeriodInfo) {
      return weekdayDirections.length ? weekdayDirections : []
    }
    if (isWeekend && weekendDirections.length) return weekendDirections
    if (!isWeekend && weekdayDirections.length) return weekdayDirections
    return weekdayDirections.length ? weekdayDirections : weekendDirections
  })()

  if (!activeDirections.length) return null

  const primary = activeDirections[0]
  const secondary = activeDirections.length > 1 ? activeDirections[1] : null

  return {
    direction1: primary.times,
    direction2: secondary ? secondary.times : [],
    direction1Name: primary.name || 'Направление 1',
    direction2Name: secondary ? secondary.name || 'Направление 2' : 'Направление 2',
    isWeekend,
  }
}

export function processScheduleForFull(data) {
  if (!data || data.length < 2) return null

  const { hasPeriodInfo, periodRow, directionRow, bodyRows } = detectFormat(data)
  const columnMeta = buildColumnMeta(hasPeriodInfo, periodRow, directionRow)

  const buildColumns = () => {
    const columns = []

    if (hasPeriodInfo) {
      const weekdayCols = columnMeta.filter((col) => col.type === 'weekday')
      weekdayCols.forEach((col) => {
        columns.push({
          period: 'Будние дни',
          name: formatDirectionName(directionRow[col.idx] || ''),
          times: extractTimesForColumn(bodyRows, col.idx),
          colIdx: col.idx,
        })
      })

      const weekendCols = columnMeta.filter((col) => col.type === 'weekend')
      weekendCols.forEach((col) => {
        columns.push({
          period: 'Выходные дни',
          name: formatDirectionName(directionRow[col.idx] || ''),
          times: extractTimesForColumn(bodyRows, col.idx),
          colIdx: col.idx,
        })
      })
    } else {
      columnMeta.forEach((col) => {
        columns.push({
          period: 'Будние дни',
          name: formatDirectionName(directionRow[col.idx] || ''),
          times: extractTimesForColumn(bodyRows, col.idx),
          colIdx: col.idx,
        })
      })
    }

    return columns.filter((col) => col.times.length > 0)
  }

  return {
    columns: buildColumns(),
    hasPeriodInfo,
  }
}

export function extractLadozhskayaDepartures(data, date = new Date()) {
  if (!data || data.length < 2) return []

  const isWeekend = isWeekendOrHoliday(date)
  const { hasPeriodInfo, periodRow, directionRow, bodyRows } = detectFormat(data)

  const ladozhskayaColumnIndexes = []

  directionRow.forEach((cell, idx) => {
    if (!cell) return
    const name = cell.toString().toLowerCase()

    if (!name.includes('ладожская')) return

    let isFromLadozhskaya = false

    if (name.includes('=>') || name.includes('->') || name.includes('–')) {
      const parts = name.split(/=>|->|–|_=>_|_->_/)
      if (parts.length >= 2) {
        const firstPart = parts[0].trim().toLowerCase()
        isFromLadozhskaya = firstPart.includes('ладожская')
      }
    } else if (name.includes('ст.') || name.includes('ст ')) {
      isFromLadozhskaya = true
    }

    if (isFromLadozhskaya) {
      let period = 'weekday'
      if (hasPeriodInfo && periodRow[idx]) {
        const periodValue = periodRow[idx].toString().toLowerCase()
        if (periodValue.includes('выходн')) {
          period = 'weekend'
        }
      }
      ladozhskayaColumnIndexes.push({ idx, period })
    }
  })

  const relevantColumns = ladozhskayaColumnIndexes.filter((col) => {
    if (!hasPeriodInfo) return true
    return isWeekend ? col.period === 'weekend' : col.period === 'weekday'
  })

  const columnsToUse = relevantColumns.length > 0 ? relevantColumns : ladozhskayaColumnIndexes

  const times = []
  columnsToUse.forEach((col) => {
    bodyRows.forEach((row) => {
      const time = parseTime(row ? row[col.idx] : null)
      if (time !== null && !times.includes(time)) {
        times.push(time)
      }
    })
  })

  return times.sort((a, b) => a - b)
}
