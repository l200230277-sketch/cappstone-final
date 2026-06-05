import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import MobileAppBar from './components/MobileAppBar'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import ReportPage from './pages/ReportPage'
import { apiRequest } from './api/client.js'
import { PUBLIC_SESSION_KEY } from './constants/session.js'
import { INITIAL_USER } from './constants/mockData'
import { normalizeImageSrc } from './utils/imageSrc.js'
import './App.css'

function readStoredSession() {
  try {
    const raw = localStorage.getItem(PUBLIC_SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function mapApiUserToState(apiUser, extra = {}) {
  return {
    ...INITIAL_USER,
    id: apiUser.id,
    name: apiUser.nama || apiUser.username,
    username: apiUser.username,
    email: apiUser.email,
    phone: apiUser.telepon || extra.phone || '',
    address: extra.address || '',
    photo: extra.photo || '',
    role: 'Pelapor',
  }
}

export function persistPublicSession(apiUser, extra = {}) {
  const payload = {
    id: apiUser.id,
    username: apiUser.username,
    nama: apiUser.nama,
    email: apiUser.email,
    telepon: apiUser.telepon || extra.phone || '',
    address: extra.address || '',
    photo: extra.photo || '',
  }
  localStorage.setItem(PUBLIC_SESSION_KEY, JSON.stringify(payload))
  return mapApiUserToState(apiUser, extra)
}

export default function PublicApp() {
  const navigate = useNavigate()
  const [screen, setScreen] = useState('home')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [booting, setBooting] = useState(true)

  const [user, setUser] = useState({
    ...INITIAL_USER,
    name: '',
    username: '',
    password: '',
    email: '',
    address: '',
    phone: '',
  })

  const [reports, setReports] = useState([])

  const fetchMyReports = useCallback(async (userId) => {
    if (!userId) {
      setReports([])
      return
    }
    const data = await apiRequest(`/api/pengaduan/user/${userId}`)
    const list = Array.isArray(data) ? data : []
    setReports(
      list.map((r) => ({
        ...r,
        image: normalizeImageSrc(r.image),
      })),
    )
  }, [])

  useEffect(() => {
    const stored = readStoredSession()
    if (!stored?.id) {
      setBooting(false)
      navigate('/login', { replace: true })
      return
    }

    const restored = mapApiUserToState(stored, {
      address: stored.address,
      phone: stored.telepon || stored.phone,
      photo: stored.photo,
    })
    setUser(restored)

    fetchMyReports(stored.id)
      .catch(() => {
        localStorage.removeItem(PUBLIC_SESSION_KEY)
        navigate('/login', { replace: true })
      })
      .finally(() => setBooting(false))
  }, [fetchMyReports, navigate])

  const greeting = useMemo(() => {
    if (!user.username) return 'Halo'
    return `Halo, ${user.username}`
  }, [user.username])

  const handleSubmitReport = async (report) => {
    if (!user.id) {
      alert('Silakan masuk terlebih dahulu.')
      navigate('/login')
      return
    }

    try {
      const res = await apiRequest('/api/pengaduan', {
        method: 'POST',
        body: JSON.stringify({
          userId: user.id,
          judul: report.title,
          deskripsi: report.description,
          kategori: report.category,
          alamat: report.place,
          foto: report.image || null,
          pelapor_nama: report.reporterName,
          pelapor_username: user.username,
        }),
      })

      const created = {
        ...res.data,
        image: normalizeImageSrc(res.data?.image),
      }
      setReports((prev) => [created, ...prev])
      setScreen('home')
    } catch (err) {
      alert(err.message || 'Gagal mengirim laporan')
      throw err
    }
  }

  const handleDeleteReport = async (id) => {
    const confirmDelete = window.confirm('Hapus laporan ini?')
    if (!confirmDelete || !user.id) return

    try {
      await apiRequest(`/api/pengaduan/${id}`, {
        method: 'DELETE',
        body: JSON.stringify({ userId: user.id }),
      })
      setReports((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      alert(err.message || 'Gagal menghapus laporan')
    }
  }

  const handlePhotoChange = (imageUrl) => {
    setUser((prev) => ({ ...prev, photo: imageUrl }))
    const stored = readStoredSession()
    if (stored) {
      localStorage.setItem(
        PUBLIC_SESSION_KEY,
        JSON.stringify({ ...stored, photo: imageUrl }),
      )
    }
  }

  const handleUpdateProfile = async ({ address, phone }) => {
    if (!user.id) return

    try {
      await apiRequest(`/api/users/${user.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          telepon: phone,
          alamat: address,
        }),
      })

      setUser((prev) => ({ ...prev, address, phone }))
      const stored = readStoredSession()
      if (stored) {
        localStorage.setItem(
          PUBLIC_SESSION_KEY,
          JSON.stringify({ ...stored, telepon: phone, address }),
        )
      }
      alert('Profil berhasil diperbarui!')
    } catch (err) {
      alert(err.message || 'Gagal memperbarui profil')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem(PUBLIC_SESSION_KEY)
    setReports([])
    navigate('/', { replace: true })
  }

  const myReports = reports

  const stats = [
    { label: 'Total Laporan', value: myReports.length },
    {
      label: 'Diproses',
      value: myReports.filter(
        (item) => (item.status || '').toLowerCase() === 'diproses',
      ).length,
    },
    {
      label: 'Selesai',
      value: myReports.filter(
        (item) => (item.status || '').toLowerCase() === 'selesai',
      ).length,
    },
    {
      label: 'Ditolak',
      value: myReports.filter(
        (item) => (item.status || '').toLowerCase() === 'ditolak',
      ).length,
    },
  ]

  const navigateInApp = (next) => {
    setMobileNavOpen(false)
    setScreen(next)
  }

  const screens = {
    home: (
      <HomePage
        greeting={greeting}
        user={user}
        stats={stats}
        reports={myReports}
        onDeleteReport={handleDeleteReport}
        onOpenProfile={() => navigateInApp('profile')}
      />
    ),
    report: (
      <ReportPage
        onSubmit={handleSubmitReport}
        onBack={() => navigateInApp('home')}
      />
    ),
    profile: (
      <ProfilePage
        user={user}
        onBack={() => navigateInApp('home')}
        onPhotoChange={handlePhotoChange}
        onUpdateProfile={handleUpdateProfile}
      />
    ),
  }

  const showNav = ['home', 'report', 'profile'].includes(screen)

  useEffect(() => {
    setMobileNavOpen(false)
  }, [screen])

  if (booting) {
    return (
      <div className="public-app">
        <main className="public-main">
          <p className="report-empty">Memuat…</p>
        </main>
      </div>
    )
  }

  return (
    <div className={`public-app${showNav ? ' public-app--with-nav' : ''}`}>
      {showNav ? (
        <MobileAppBar
          user={user}
          onOpenMenu={() => setMobileNavOpen(true)}
          onOpenProfile={() => navigateInApp('profile')}
        />
      ) : null}

      <main className="public-main">{screens[screen]}</main>

      {showNav && (
        <BottomNav
          screen={screen}
          onNavigate={navigateInApp}
          onLogout={() => {
            setMobileNavOpen(false)
            handleLogout()
          }}
          mobileOpen={mobileNavOpen}
          onMobileClose={() => setMobileNavOpen(false)}
        />
      )}
    </div>
  )
}
