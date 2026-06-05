import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import defaultAvatar from '../assets/default-avatar.png'
import riwayatIcon from '../assets/riwayat.png'
import insightIcon from '../assets/insight.png'
import kategoriTerbanyakIcon from '../assets/kategori-terbanyak.png'
import dusunIcon from '../assets/dusun.png'
import editIcon from '../assets/edit.png'
import { useSession } from '../context/SessionContext.jsx'
import '../App.css'

// ── Data dummy – ganti dengan data real dari API/context kamu ──
const DUMMY_AKTIVITAS = [
  { id: 1, aksi: 'Laporan #128 diverifikasi', waktu: '5 menit lalu' },
  { id: 2, aksi: 'Laporan #127 ditandai selesai', waktu: '1 jam lalu' },
  { id: 3, aksi: 'Laporan #125 diperbarui statusnya', waktu: '3 jam lalu' },
  { id: 4, aksi: 'Laporan #120 diteruskan ke dinas', waktu: 'Kemarin, 14:22' },
  { id: 5, aksi: 'Akun admin login dari perangkat baru', waktu: 'Kemarin, 09:05' },
]

const DUMMY_INSIGHT = {
  kategoriTerbanyak: 'Infrastruktur',
  dusunTertinggi: 'Dusun Karanglo',
}

export default function Profile() {
  const { user } = useSession()

  // ── Foto ──
  const [photo, setPhoto] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const fileInputRef = useRef(null)
  const menuRef = useRef(null)

  // ── Nama ──
  const [nama, setNama] = useState('Admin')
  const [editNama, setEditNama] = useState(false)
  const [namaTemp, setNamaTemp] = useState(nama)
  const namaInputRef = useRef(null)

  // ── Avatar handlers ──
  const handleAvatarClick = (e) => {
    e.stopPropagation()
    if (!photo) fileInputRef.current?.click()
    else setMenuOpen((prev) => !prev)
  }

  const handleChangePhoto = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (photo) URL.revokeObjectURL(photo)
      setPhoto(URL.createObjectURL(file))
      setMenuOpen(false)
      e.target.value = ''
    }
  }

  const handleRemovePhoto = (e) => {
    e.stopPropagation()
    if (photo) URL.revokeObjectURL(photo)
    setPhoto(null)
    setMenuOpen(false)
  }

  const handleReplacePhoto = (e) => {
    e.stopPropagation()
    fileInputRef.current?.click()
  }

  // ── Nama handlers ──
  const startEditNama = () => {
    setNamaTemp(nama)
    setEditNama(true)
  }

  const saveNama = () => {
    const trimmed = namaTemp.trim()
    if (trimmed) setNama(trimmed)
    setEditNama(false)
  }

  const cancelNama = () => {
    setNamaTemp(nama)
    setEditNama(false)
  }

  // auto focus
  useEffect(() => {
    if (editNama) namaInputRef.current?.focus()
  }, [editNama])

  // close avatar menu outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }

    window.addEventListener('click', handler)
    return () => window.removeEventListener('click', handler)
  }, [])

  return (
    <div className="profile-page">

      {/* ════════════════════════════════
          HEADER PROFILE
      ════════════════════════════════ */}
      <div className="profile-page__header">

        {/* Avatar */}
        <div className="profile-page__avatar-wrap">
          <div className="profile-page__avatar" onClick={handleAvatarClick}>
            <img
              src={photo || defaultAvatar}
              alt="avatar"
              className="profile-page__img"
            />

            <div className="profile-page__avatar-overlay">
              <img
                src={editIcon}
                alt="Edit Foto"
                className="profile-page__avatar-edit-icon"
              />
            </div>
          </div>

          {menuOpen && (
            <div
              className="profile-page__menu"
              ref={menuRef}
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={handleReplacePhoto}>
                Ganti Foto
              </button>

              <button onClick={handleRemovePhoto}>
                Hapus Foto
              </button>
            </div>
          )}
        </div>

        {/* Nama + Email */}
        <div className="profile-page__identity">

          {editNama ? (
            <div className="profile-page__nama-edit">
              <input
                ref={namaInputRef}
                className="profile-page__nama-input"
                value={namaTemp}
                onChange={(e) => setNamaTemp(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveNama()
                  if (e.key === 'Escape') cancelNama()
                }}
                maxLength={40}
              />

              <div className="profile-page__nama-actions">
                <button className="btn-save" onClick={saveNama}>
                  Simpan
                </button>

                <button className="btn-cancel" onClick={cancelNama}>
                  Batal
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-page__nama-display">
              <h1 className="profile-page__name">{nama}</h1>

              <button
                className="profile-page__edit-btn"
                onClick={startEditNama}
                title="Edit nama"
              >
                <img
                  src={editIcon}
                  alt="Edit"
                  className="profile-page__edit-icon"
                />
              </button>
            </div>
          )}

          <p className="profile-page__email">
            {user?.email ?? 'admin@gmail.com'}
          </p>

          <span className="profile-page__badge">
            Administrator
          </span>

        </div>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleChangePhoto}
        hidden
      />

      {/* ════════════════════════════════
          BAWAH
      ════════════════════════════════ */}
      <div className="profile-page__bottom">

        {/* Riwayat Aktivitas */}
        <section className="profile-page__activity">
          <h2 className="section-title profile-page__section-with-icon">
            <img
              src={riwayatIcon}
              alt="Riwayat"
              className="section-icon"
            />
            Riwayat Aktivitas Terbaru
          </h2>

          <ul className="activity-list">
            {DUMMY_AKTIVITAS.map((item) => (
              <li key={item.id} className="activity-list__item">
                <span className="activity-list__dot" />

                <div className="activity-list__content">
                  <p className="activity-list__aksi">
                    {item.aksi}
                  </p>

                  <span className="activity-list__waktu">
                    {item.waktu}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
        {/* Insight */}
        <section className="profile-page__insight">
          <h2 className="section-title profile-page__section-with-icon">
            <img
              src={insightIcon}
              alt="Insight"
              className="section-icon"
            />
            Insight Laporan
          </h2>

          {/* Kategori */}
          <div className="insight-card">
            <div className="insight-card__icon">
              <img
                src={kategoriTerbanyakIcon}
                alt="Kategori Terbanyak"
              />
            </div>

            <div className="insight-card__body">
              <span className="insight-card__label">
                Laporan terbanyak{' '}
              </span>

              <span className="insight-card__value">
                {DUMMY_INSIGHT.kategoriTerbanyak}
              </span>
            </div>
          </div>

          {/* Dusun */}
          <div className="insight-card">
            <div className="insight-card__icon">
              <img
                src={dusunIcon}
                alt="Dusun Tertinggi"
              />
            </div>

            <div className="insight-card__body">
              <span className="insight-card__label">
                Dusun aduan tertinggi{' '}
              </span>

              <span className="insight-card__value">
                {DUMMY_INSIGHT.dusunTertinggi}
              </span>
            </div>
          </div>

          <Link
            to="/dashboard"
            className="profile-page__nav-link insight-card__link"
          >
            Lihat semua laporan →
          </Link>
        </section>
      </div>
    </div>
  )
}