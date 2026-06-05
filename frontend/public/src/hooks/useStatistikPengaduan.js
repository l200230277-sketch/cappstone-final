import { useCallback, useEffect, useRef, useState } from 'react'
import { apiRequest } from '../api/client'

const POLL_MS = 10000

export function useStatistikPengaduan() {
  const [statistik, setStatistik] = useState({
    total: 0,
    selesai: 0,
    dalamProses: 0,
  })
  const [statsLoading, setStatsLoading] = useState(true)
  const [statsError, setStatsError] = useState('')
  const initialLoadDone = useRef(false)

  const loadStatistik = useCallback(async (silent = false) => {
    if (!silent) setStatsLoading(true)
    if (!silent) setStatsError('')
    try {
      const data = await apiRequest('/api/pengaduan/statistik')
      setStatistik({
        total: data.total ?? 0,
        selesai: data.selesai ?? 0,
        dalamProses: data.dalamProses ?? 0,
      })
    } catch (err) {
      if (!silent || !initialLoadDone.current) {
        setStatsError(err.message || 'Gagal memuat statistik')
      }
    } finally {
      if (!silent) {
        setStatsLoading(false)
        initialLoadDone.current = true
      }
    }
  }, [])

  useEffect(() => {
    loadStatistik()
    const interval = setInterval(() => loadStatistik(true), POLL_MS)

    const onVisible = () => {
      if (document.visibilityState === 'visible') loadStatistik(true)
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [loadStatistik])

  return { statistik, statsLoading, statsError }
}
