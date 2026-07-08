export function getBasePath() {
  const viteBase = import.meta.env.BASE_URL
  if (viteBase && viteBase !== '/') {
    return viteBase
  }
  const path = window.location.pathname
  if (path.includes('/marshrutka-widget/')) {
    return '/marshrutka-widget/'
  }
  return '/'
}
