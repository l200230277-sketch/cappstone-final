function apiBase() {
  if (import.meta.env.VITE_API_URL !== undefined) {
    return String(import.meta.env.VITE_API_URL).replace(/\/$/, '')
  }
  return import.meta.env.DEV ? '' : 'http://127.0.0.1:8001'
}

export function normalizeImageSrc(src) {
  if (!src || typeof src !== 'string') return ''
  const s = src.trim()
  if (!s) return ''

  if (s.startsWith('/api/files/')) {
    const base = apiBase()
    return base ? `${base}${s}` : s
  }

  if (
    s.startsWith('data:') ||
    s.startsWith('http://') ||
    s.startsWith('https://')
  ) {
    return s
  }

  return `data:image/jpeg;base64,${s}`
}

export function isDisplayableImage(src) {
  const normalized = normalizeImageSrc(src)
  if (!normalized) return false
  return (
    normalized.startsWith('data:image') ||
    normalized.startsWith('http') ||
    normalized.includes('/api/files/')
  )
}

export function linkGambarUntukExport(report) {
  const urls = Array.isArray(report.fotoUrls)
    ? report.fotoUrls.map(normalizeImageSrc).filter(Boolean)
    : report.foto
      ? [normalizeImageSrc(report.foto)]
      : []
  if (urls.length === 0) return ''
  return urls.join(' | ')
}
