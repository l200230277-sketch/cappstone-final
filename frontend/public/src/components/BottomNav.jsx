// BottomNav.jsx
import landingIllustration from '../assets/logo.png'
import homeIcon from '../assets/logo-home.png'
import laporanIcon from '../assets/logo-laporan.png'
import settingIcon from '../assets/nama-pengguna.png'

function BottomNav({
  screen,
  onNavigate,
  onLogout,
  mobileOpen = false,
  onMobileClose,
}) {
  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          className="bottom-nav__backdrop"
          aria-label="Tutup menu"
          onClick={onMobileClose}
        />
      ) : null}

      <aside
        className={`bottom-nav${
          mobileOpen ? ' bottom-nav--open' : ''
        }`}
      >
      <div className="sidebar-brand">
        <img
          src={landingIllustration}
          alt="Logo ADUIN"
          className="sidebar-logo"
        />
        <div className="aduin-logo aduin-logo--large sidebar-title">
          ADUIN
        </div>
        <p className="sidebar-tagline">
          Pusat Pengaduan Masyarakat Desa Canden
        </p>
      </div>

      <div className="sidebar-menu">
        <button
          className={screen === 'home' ? 'active' : ''}
          onClick={() => onNavigate('home')}
          type="button"
        >
          <img
            src={homeIcon}
            alt="Home"
            className="nav-image-icon"
          />
          <span>Beranda</span>
        </button>

        <button
          className={screen === 'report' ? 'active' : ''}
          onClick={() => onNavigate('report')}
          type="button"
        >
          <img
            src={laporanIcon}
            alt="Laporan"
            className="nav-image-icon"
          />
          <span>Laporan</span>
        </button>

        <button
          className={screen === 'profile' ? 'active' : ''}
          onClick={() => onNavigate('profile')}
          type="button"
        >
          <img
            src={settingIcon}
            alt="Profil"
            className="nav-image-icon"
          />
          <span>Profil</span>
        </button>
      </div>

      <div className="sidebar-footer">
        <button
          type="button"
          className="sidebar-logout"
          onClick={onLogout}
        >
          Keluar
        </button>
      </div>
    </aside>
    </>
  )
}

export default BottomNav