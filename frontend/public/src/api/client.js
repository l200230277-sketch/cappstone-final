const API_BASE =
  import.meta.env.VITE_API_URL !== undefined
    ? import.meta.env.VITE_API_URL
    : import.meta.env.DEV
      ? ''
      : 'http://127.0.0.1:8001'

export async function apiRequest(path, options = {}) {
  const url = `${API_BASE}${path}`
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  let data = null
  try {
    data = await res.json()
  } catch {
    data = null
  }

  if (!res.ok) {
    const message = data?.message || `Permintaan gagal (${res.status})`
    throw new Error(message)
  }

  return data
}

export { API_BASE }
