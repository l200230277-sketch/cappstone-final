import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../../api/client.js'
import { normalizeImageSrc } from '../utils/imageSrc.js'
const ReportsContext = createContext(null)

export function ReportsProvider({ children }) {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refreshReports = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await apiRequest('/api/pengaduan')
      const list = Array.isArray(data) ? data : []
      setReports(
        list.map((r) => {
          const fotoUrls = (Array.isArray(r.fotoUrls) ? r.fotoUrls : r.foto ? [r.foto] : [])
            .map(normalizeImageSrc)
            .filter(Boolean)
          return { ...r, fotoUrls, foto: fotoUrls[0] ?? '' }
        }),
      )
    } catch (err) {
      setError(err.message || 'Gagal memuat laporan')
      setReports([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshReports()
  }, [refreshReports])

  const updateReport = useCallback(async (id, patch) => {
    const body = {
      status: patch.status,
      kategori: patch.kategori,
      catatan: patch.catatan,
    }
    const res = await apiRequest(`/api/pengaduan/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
    const updated = res.data ?? { ...patch, id }
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updated, ...patch } : r)),
    )
  }, [])

  const getById = useCallback(
    (id) => reports.find((r) => r.id === id) ?? null,
    [reports],
  )

  const stats = useMemo(() => {
    const total = reports.length
    const belumDiterima = reports.filter(
      (r) => r.status === 'Belum diterima',
    ).length
    const diterima = reports.filter((r) => r.status === 'Diterima').length
    const diproses = reports.filter((r) => r.status === 'Diproses').length
    const selesai = reports.filter((r) => r.status === 'Selesai').length
    const ditolak = reports.filter((r) => r.status === 'Ditolak').length
    return {
      total,
      belumDiterima,
      diterima,
      diproses,
      selesai,
      ditolak,
    }
  }, [reports])

  const value = useMemo(
    () => ({
      reports,
      loading,
      error,
      refreshReports,
      updateReport,
      getById,
      stats,
    }),
    [reports, loading, error, refreshReports, updateReport, getById, stats],
  )

  return (
    <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>
  )
}

export function useReports() {
  const ctx = useContext(ReportsContext)
  if (!ctx) throw new Error('useReports harus di dalam ReportsProvider')
  return ctx
}
