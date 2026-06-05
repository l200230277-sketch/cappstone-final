import { useMemo, useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as XLSX from 'xlsx'
import { useReports } from '../context/ReportsContext.jsx'
import { useSession } from '../context/SessionContext.jsx'
import { REPORT_CATEGORIES } from '../data/categories.js'
import { linkGambarUntukExport } from '../utils/imageSrc.js'
import '../AdminApp.css'

function deskripsiRingkas(text, max = 140) {
  const t = (text ?? '').replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  return `${t.slice(0, max).trim()}…`
}

function IconChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconUser() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconCalendar() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden className="dashboard__cal-ico">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconFolder() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 8a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconHourglass() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 4h8v4a4 4 0 01-4 4 4 4 0 01-4-4V4zM8 20h8v-4a4 4 0 00-4-4 4 4 0 00-4 4v4z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconCheckBox() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 12l2.5 2.5L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconX() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useSession()
  const { reports, stats, loading, error } = useReports()

  const [query, setQuery] = useState('')
  const [kategori, setKategori] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)

  const displayName = user?.username ?? 'Pengguna'

  useEffect(() => {
    function onDocClick(e) {
      if (!userMenuRef.current?.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    return reports.filter((r) => {
      if (kategori && r.kategori !== kategori) {
        return false
      }

      if (!q) return true

      const u = (r.usernamePelapor ?? r.pelapor).toLowerCase()
      return (
        r.judul.toLowerCase().includes(q) ||
        r.alamat.toLowerCase().includes(q) ||
        r.pelapor.toLowerCase().includes(q) ||
        u.includes(q) ||
        r.kategori.toLowerCase().includes(q)
      )
    })
  }, [reports, query, kategori])

  const statItems = useMemo(
    () => [
      {
        key: 'total',
        label: 'Total Laporan',
        value: stats.total,
        icon: IconFolder,
        tone: 'blue',
      },
      {
        key: 'belum',
        label: 'Belum Diterima',
        value: stats.belumDiterima ?? stats.belum_diterima ?? 0,
        icon: IconHourglass,
        tone: 'orange',
      },
      {
        key: 'diterima',
        label: 'Diterima',
        value: stats.diterima ?? 0,
        icon: IconCheckBox,
        tone: 'blue',
      },
      {
        key: 'diproses',
        label: 'Diproses',
        value: stats.diproses,
        icon: IconHourglass,
        tone: 'orange',
      },
      {
        key: 'selesai',
        label: 'Selesai',
        value: stats.selesai,
        icon: IconCheckBox,
        tone: 'green',
      },
      {
        key: 'ditolak',
        label: 'Ditolak',
        value: stats.ditolak,
        icon: IconX,
        tone: 'red',
      },
    ],
    [stats],
  )

  function handleDownloadFile() {
    const headers = [
      'ID',
      'Judul',
      'Nama Pelapor',
      'Username Pelapor',
      'Alamat',
      'Deskripsi',
      'Kategori',
      'Status',
      'Tanggal Laporan',
      'Tanggal Update',
      'Link Gambar (URL)',
    ]

    const rows = filtered.map((r) => [
      r.id,
      r.judul,
      r.pelapor,
      r.usernamePelapor ?? r.pelapor,
      r.alamat,
      r.deskripsi,
      r.kategori,
      r.status,
      r.tanggalLabel,
      r.tanggalUpdateLabel ?? '',
      linkGambarUntukExport(r),
    ])

    const aoa = [headers, ...rows]
    const ws = XLSX.utils.aoa_to_sheet(aoa)
    ws['!cols'] = [
      { wch: 6 },
      { wch: 28 },
      { wch: 18 },
      { wch: 18 },
      { wch: 28 },
      { wch: 40 },
      { wch: 16 },
      { wch: 14 },
      { wch: 16 },
      { wch: 16 },
      { wch: 56 },
    ]
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan')
    XLSX.writeFile(wb, `laporan-aduin-${Date.now()}.xlsx`)
  }

  function handleLogout() {
    setUserMenuOpen(false)
    logout()
    navigate('/login')
  }

  return (
    <div className="dashboard">
      <header className="dashboard__hero">
        <div className="dashboard__hero-text">
          <h1 className="dashboard__greeting">
            Halo, <span className="dashboard__greeting-name">{displayName}</span>
          </h1>
          <p className="dashboard__subgreeting">Selamat datang kembali di ADUIN</p>
        </div>

        <div className="dashboard__hero-user" ref={userMenuRef}>
          <button
            type="button"
            className="dashboard__user-chip"
            aria-expanded={userMenuOpen}
            aria-haspopup="true"
            onClick={(e) => {
              e.stopPropagation()
              setUserMenuOpen((v) => !v)
            }}
          >
            <span className="dashboard__user-chip-icon" aria-hidden>
              <IconUser />
            </span>
            <span>{displayName}</span>
            <IconChevronDown />
          </button>

          {userMenuOpen ? (
            <div className="dashboard__user-dropdown" role="menu">
              <Link to="/admin/profil" className="dashboard__user-dropdown-item" role="menuitem" onClick={() => setUserMenuOpen(false)}>
                Profil
              </Link>
              <button type="button" className="dashboard__user-dropdown-item" role="menuitem" onClick={handleLogout}>
                Keluar
              </button>
            </div>
          ) : null}
        </div>
      </header>

      <section className="dashboard__stats" aria-label="Ringkasan laporan">
        {statItems.map(({ key, label, value, icon: Ico, tone }) => (
          <article key={key} className="dashboard__stat-card">
            <div className="dashboard__stat-card-top">
              <span className={`dashboard__stat-icon-square dashboard__stat-icon-square--${tone}`} aria-hidden>
                <Ico />
              </span>
              <span className="dashboard__stat-card-label">{label}</span>
            </div>
            <p className="dashboard__stat-card-value">{value}</p>
          </article>
        ))}
      </section>

      <div className="dashboard__riwayat" role="region" aria-label="Riwayat laporan">
        {error ? (
          <p className="login-page__error" style={{ marginBottom: '1rem' }}>
            {error} — pastikan backend berjalan di port 8001.
          </p>
        ) : null}
        {loading ? <p style={{ marginBottom: '1rem' }}>Memuat laporan…</p> : null}

        <div className="dashboard__riwayat-bar">
          <h2 className="dashboard__riwayat-title">Riwayat Laporan</h2>

          <div className="dashboard__riwayat-tools">
            <input
              type="search"
              className="dashboard__search-input"
              placeholder="Cari laporan..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />

            <button type="button" className="dashboard__pill-btn" onClick={() => setFilterOpen((v) => !v)} aria-expanded={filterOpen}>
              Filter
            </button>

            <button type="button" className="dashboard__pill-btn" onClick={handleDownloadFile}>
              Unduh File
            </button>
          </div>
        </div>

        <div className="dashboard__kategori-row">
          <label className="dashboard__kategori-field">
            <span className="dashboard__kategori-label">Kategori</span>
            <select
              id="dashboard-kategori"
              className="dashboard__kategori-select"
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
            >
              <option value="">Semua kategori</option>
              {REPORT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          {filterOpen ? (
            <button type="button" className="aduin-link dashboard__filter-reset" onClick={() => setKategori('')}>
              Hapus filter kategori
            </button>
          ) : null}
        </div>

        <div className="dashboard__table-scroll">
          <table className="dashboard__table dashboard__table--aduin">
            <thead>
              <tr>
                <th scope="col">Laporan</th>
                <th scope="col" className="dashboard__th-cat">
                  Kategori
                </th>
                <th scope="col" className="dashboard__th-status">
                  Status
                </th>
                <th scope="col">Tanggal</th>
                <th scope="col">Detail</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div className="dashboard__lap-cell">
                      <div className="dashboard__lap-body">
                        <div className="dashboard__lap-title-row">
                          <span className="dashboard__lap-title">{r.judul}</span>
                          <span className={`dashboard__badge dashboard__badge--${badgeKind(r.status)}`}>{r.status}</span>
                        </div>
                        <p className="dashboard__lap-meta">
                          <IconCalendar />
                          <span>
                            {r.tanggalLabel}
                            {r.waktuLabel ? ` • ${r.waktuLabel}` : ''}
                          </span>
                        </p>
                        <p className="dashboard__lap-desc">{deskripsiRingkas(r.deskripsi)}</p>
                        <p className="dashboard__lap-by">
                          Dilaporkan oleh: <strong>{r.usernamePelapor ?? r.pelapor}</strong>
                        </p>
                        <span className="dashboard__cat-mobile">{r.kategori}</span>
                      </div>
                    </div>
                  </td>
                  <td className="dashboard__td-cat">{r.kategori}</td>
                  <td className="dashboard__td-status">
                    <span className={`dashboard__badge dashboard__badge--${badgeKind(r.status)} dashboard__badge--table`}>{r.status}</span>
                  </td>
                  <td className="dashboard__td-date">{r.tanggalLabel}</td>
                  <td>
                    <Link to={`/admin/laporan/${r.id}`} className="dashboard__detail-btn">
                      <span>Detail Laporan</span>
                      <IconChevronRight />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filtered.length === 0 ? <p className="dashboard__empty">Tidak ada laporan yang cocok</p> : null}
    </div>
  )
}

function badgeKind(status) {
  switch (status) {
    case 'Belum diterima':
      return 'new'
    case 'Diterima':
      return 'accepted'
    case 'Diproses':
      return 'progress'
    case 'Selesai':
      return 'done'
    case 'Ditolak':
      return 'bad'
    default:
      return 'new'
  }
}