import defaultAvatar from '../assets/default-avatar.png'

function MobileAppBar({ user, onOpenMenu, onOpenProfile }) {
  return (
    <header className="mobile-app-bar" role="banner">
      <button
        type="button"
        className="mobile-app-bar__menu"
        onClick={onOpenMenu}
        aria-label="Buka menu"
      >
        <span className="mobile-app-bar__hamburger" aria-hidden />
      </button>

      <div className="aduin-logo aduin-logo--large sidebar-title">
          ADUIN
      </div>

      <button
        type="button"
        className="mobile-app-bar__user"
        onClick={onOpenProfile}
      >
        <img
          src={user?.photo || defaultAvatar}
          alt=""
          className="mobile-app-bar__avatar"
        />
        <span className="mobile-app-bar__name">
          {user?.username || 'Pengguna'}
        </span>
        <span className="mobile-app-bar__chevron" aria-hidden>
          ▾
        </span>
      </button>
    </header>
  )
}

export default MobileAppBar
