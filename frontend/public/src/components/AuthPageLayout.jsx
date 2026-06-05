import authBackground from '../assets/login-signin.png'
import authIllustration from '../assets/logo.png'

function AuthPageLayout({ onBack, children }) {
  return (
    <section
      className="auth-page"
      style={{ backgroundImage: `url(${authBackground})` }}
    >
      <button type="button" className="auth-page__back" onClick={onBack}>
        <span className="auth-page__back-icon" aria-hidden>
          ←
        </span>
        Kembali ke Beranda
      </button>

      <div className="auth-page__card">
        <img
          className="auth-page__illustration"
          src={authIllustration}
          alt="Ilustrasi pengaduan masyarakat"
        />
        <div className="auth-page__brand">ADUIN</div>
        {children}
      </div>
    </section>
  )
}

export default AuthPageLayout
