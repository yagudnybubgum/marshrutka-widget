import { getBasePath } from './getBasePath.js'

const cache = new Map()
const inflight = new Map()

export function clearScheduleCache() {
  cache.clear()
}

export async function loadScheduleRaw(routeId) {
  if (cache.has(routeId)) {
    return cache.get(routeId)
  }

  if (inflight.has(routeId)) {
    return inflight.get(routeId)
  }

  const promise = (async () => {
    const basePath = getBasePath()
    const filePath = `${basePath}schedules/${routeId}.json`.replace(/\/\//g, '/')

    const response = await fetch(filePath)
    if (!response.ok) {
      throw new Error(`Файл расписания не найден (${response.status})`)
    }

    const data = await response.json()
    cache.set(routeId, data)
    return data
  })()

  inflight.set(routeId, promise)

  try {
    return await promise
  } finally {
    inflight.delete(routeId)
  }
}

export async function loadSchedulesRaw(routeIds) {
  return Promise.all(
    routeIds.map(async (routeId) => {
      try {
        const data = await loadScheduleRaw(routeId)
        return { routeId, data }
      } catch {
        return { routeId, data: null }
      }
    }),
  )
}
