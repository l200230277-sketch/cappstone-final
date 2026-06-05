import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useSession } from '../context/SessionContext.jsx'
import logo from '../assets/logo.png'

import '../App.css'

function IconReports() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconUser() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
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

function IconArchive() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7a2 2 0 012-2h12a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V7z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M8 11h8M8 15h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconHamburger() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 7h14M5 12h14M5 17h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconExit() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default function AdminLayout() {
  const { logout } = useSession()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLogout() {
    setMenuOpen(false)
    logout()
    navigate('/login')
  }

  return (
    <div className={`admin-shell${menuOpen ? ' admin-shell--menu-open' : ''}`}>
      {menuOpen ? (
        <button
          type="button"
          className="admin-shell__drawer-backdrop"
          aria-label="Tutup menu samping"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      <aside className="admin-shell__sidebar" aria-label="Navigasi utama">
        <div className="admin-shell__sidebar-brand">
          <img src={logo} alt="ADUIN" className="admin-shell__sidebar-logo" />

          <h1 className="admin-shell__sidebar-title">ADUIN</h1>

          <p className="admin-shell__sidebar-subtitle">
            Pusat Pengaduan
            <br />
            Masyarakat Desa Canden
          </p>
        </div>

        <nav className="admin-shell__nav">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) => `admin-shell__nav-link${isActive ? ' active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <IconReports />
            Data Laporan
          </NavLink>

          <NavLink
            to="/profil"
            className={({ isActive }) => `admin-shell__nav-link${isActive ? ' active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <IconUser />
            Profil
          </NavLink>

          <NavLink
            to="/arsip"
            className={({ isActive }) => `admin-shell__nav-link${isActive ? ' active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <IconArchive />
            Arsip
          </NavLink>
        </nav>

        <button type="button" className="admin-shell__logout" onClick={handleLogout}>
          <IconExit />
          Keluar
        </button>
      </aside>

      <div className="admin-shell__main-col">
        <header className="admin-shell__topbar">
          <div className="admin-shell__topbar-inner">
            <div className="admin-shell__menu-wrap">
              <button
                type="button"
                className="admin-shell__icon-btn"
                aria-expanded={menuOpen}
                aria-haspopup="true"
                aria-label="Menu"
                onClick={() => setMenuOpen((v) => !v)}
              >
                <IconHamburger />
              </button>

            </div>

            <span className="admin-shell__topbar-brand aduin-logo aduin-logo--small">ADUIN</span>

            <span className="admin-shell__topbar-spacer" aria-hidden />
          </div>
        </header>

        <main className="admin-shell__content">
          <Outlet />
        </main>

        <footer className="admin-shell__footer">© 2026 ADUIN — Desa Canden. All rights reserved.</footer>

        <nav className="admin-shell__bottom" aria-label="Navigasi bawah">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) => `admin-shell__bottom-link${isActive ? ' active' : ''}`}
          >
            <IconReports />
            <span>Laporan</span>
          </NavLink>

          <NavLink to="/arsip" className={({ isActive }) => `admin-shell__bottom-link${isActive ? ' active' : ''}`}>
            <IconArchive />
            <span>Arsip</span>
          </NavLink>

          <NavLink to="/profil" className={({ isActive }) => `admin-shell__bottom-link${isActive ? ' active' : ''}`}>
            <IconUser />
            <span>Profil</span>
          </NavLink>
        </nav>
      </div>
    </div>
  )
}
