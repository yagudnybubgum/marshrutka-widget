const SCRIPT_ID = 'yandex-maps-jsapi'

let loadPromise = null

export function getYandexMapsKey() {
  return import.meta.env.VITE_YANDEX_MAPS_KEY || ''
}

export function loadYmaps() {
  const apikey = getYandexMapsKey()
  if (!apikey) {
    return Promise.reject(new Error('VITE_YANDEX_MAPS_KEY is not set'))
  }

  if (window.ymaps?.ready) {
    return new Promise((resolve) => window.ymaps.ready(() => resolve(window.ymaps)))
  }

  if (loadPromise) return loadPromise

  loadPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID)
    if (existing) {
      existing.addEventListener('load', () => {
        window.ymaps.ready(() => resolve(window.ymaps))
      })
      existing.addEventListener('error', () => reject(new Error('Failed to load Yandex Maps')))
      return
    }

    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(apikey)}&lang=ru_RU`
    script.async = true
    script.onload = () => {
      window.ymaps.ready(() => resolve(window.ymaps))
    }
    script.onerror = () => {
      loadPromise = null
      reject(new Error('Failed to load Yandex Maps'))
    }
    document.head.appendChild(script)
  })

  return loadPromise
}
