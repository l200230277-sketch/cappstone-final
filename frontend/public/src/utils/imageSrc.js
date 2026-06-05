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

/** Kompres foto sebelum upload agar muat di database & tampil di UI. */
export function compressImageFile(file, maxWidth = 1280, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width)
        width = maxWidth
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas tidak didukung'))
        return
      }
      ctx.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Gagal memuat gambar'))
    }
    img.src = url
  })
}
