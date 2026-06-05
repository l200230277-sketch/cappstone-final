import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import CountUp from '../components/CountUp'
import { useReveal } from '../hooks/useReveal'
import { useStatistikPengaduan } from '../hooks/useStatistikPengaduan'
import brandIcon from '../assets/logo.png'
import heroIllustration from '../assets/landing.png'
import totalLaporanIcon from '../assets/total-laporan.png'
import selesaiIcon from '../assets/selesai.png'
import diprosesIcon from '../assets/diproses.png'
import desaBg from '../assets/desa.jpg'
import './LandingPage.css'

const FEATURES = [
  {
    title: 'Aman & Terlindungi',
    desc: 'Data pengaduan Anda dilindungi dengan sistem keamanan terbaik.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V8a4 4 0 118 0v3" />
      </svg>
    ),
  },
  {
    title: 'Transparan',
    desc: 'Pantau status pengaduan secara real-time dan transparan.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: 'Mudah Digunakan',
    desc: 'Antarmuka sederhana yang mudah dipahami semua kalangan.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
  },
  {
    title: 'Respon Cepat',
    desc: 'Tim desa merespons pengaduan dengan cepat dan tepat.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
  {
    title: 'Mobile Friendly',
    desc: 'Akses dari smartphone kapan saja dan di mana saja.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <rect x="7" y="2" width="10" height="20" rx="2" />
        <path d="M11 18h2" />
      </svg>
    ),
  },
  {
    title: 'Statistik Real-Time',
    desc: 'Lihat statistik pengaduan desa secara langsung dan akurat.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M4 19V5M10 19V9M16 19v-6M22 19V3" />
      </svg>
    ),
  },
]

const FLOW_STEPS = [
  {
    title: 'Buat Laporan',
    desc: 'Sampaikan laporan Anda dengan mudah.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="M9 12h6M9 16h6" />
      </svg>
    ),
  },
  {
    title: 'Verifikasi',
    desc: 'Laporan diverifikasi oleh admin desa.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Diproses',
    desc: 'Laporan diproses oleh tim terkait.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  },
  {
    title: 'Tindak Lanjut',
    desc: 'Tindakan dilakukan sesuai laporan.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M3 3v18h18" />
        <path d="M7 14l4-4 4 4 5-6" />
      </svg>
    ),
  },
  {
    title: 'Selesai',
    desc: 'Laporan selesai dan Anda diberi notifikasi.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <circle cx="12" cy="12" r="10" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
]

const STAT_CARDS = [
  { key: 'total', label: 'Total Laporan', icon: totalLaporanIcon, wrap: 'total' },
  { key: 'selesai', label: 'Laporan Selesai', icon: selesaiIcon, wrap: 'selesai' },
  { key: 'dalamProses', label: 'Dalam Proses', icon: diprosesIcon, wrap: 'proses' },
]

function RevealSection({ children, className = '', id }) {
  const [ref, visible] = useReveal()
  return (
    <section
      id={id}
      ref={ref}
      className={`marketing-reveal ${visible ? 'is-visible' : ''} ${className}`.trim()}
    >
      {children}
    </section>
  )
}

function LandingPage({ onLogin: onLoginProp, onSignup: onSignupProp }) {
  const navigate = useNavigate()
  const onLogin = onLoginProp ?? (() => navigate('/login'))
  const onSignup = onSignupProp ?? (() => navigate('/signup'))
  const { statistik, statsLoading, statsError } = useStatistikPengaduan()

  const scrollToStats = useCallback(() => {
    document
      .getElementById('landing-statistik')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const year = new Date().getFullYear()

  return (
    <div className="marketing-landing">
      <header className="marketing-header">
        <div className="marketing-landing__inner marketing-header__bar">
          <div className="marketing-brand" aria-label="ADUIN">
            <img src={brandIcon} alt="" className="marketing-brand__icon" />
            <span className="marketing-brand__name">ADUIN</span>
          </div>
          <div className="marketing-header__actions">
            <button
              type="button"
              className="marketing-btn marketing-btn--ghost"
              onClick={onLogin}
            >
              Masuk
            </button>
            <button
              type="button"
              className="marketing-btn marketing-btn--primary"
              onClick={onSignup}
            >
              Daftar Akun
            </button>
          </div>
        </div>
      </header>

      <RevealSection className="marketing-hero">
        <div className="marketing-landing__inner marketing-hero__grid">
          <div>
            <p className="marketing-hero__eyebrow">Aduan Warga Desa Canden</p>
            <h1 className="marketing-hero__title">
              Suara Warga Didengar, <em>Perubahan</em> Dimulai
            </h1>
            <p className="marketing-hero__desc">
              Platform pengaduan digital untuk warga Desa Canden. Laporkan masalah,
              pantau progres, dan wujudkan desa yang lebih baik bersama.
            </p>
            <div className="marketing-hero__actions">
              <button
                type="button"
                className="marketing-btn marketing-btn--primary marketing-btn--lg"
                onClick={onLogin}
              >
                Buat Pengaduan
                <span className="marketing-btn__icon" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </span>
              </button>
              <button
                type="button"
                className="marketing-btn marketing-btn--outline marketing-btn--lg"
                onClick={scrollToStats}
              >
                Lihat Statistik
                <span className="marketing-btn__icon" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19V5M10 19V9M16 19v-6M22 19V3" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
          <img
            className="marketing-hero__art"
            src={heroIllustration}
            alt="Ilustrasi warga Desa Canden"
          />
        </div>
      </RevealSection>

      <RevealSection
        className="marketing-stats"
        id="landing-statistik"
      >
        <div className="marketing-landing__inner">
          <h2 className="marketing-stats__title">Statistik Pengaduan Desa Canden</h2>
          {statsLoading && (
            <p className="marketing-stats__loading">Memuat statistik…</p>
          )}
          {statsError && !statsLoading ? (
            <p className="marketing-stats__error" role="alert">
              {statsError}
            </p>
          ) : null}
          <div className="marketing-stats__grid">
            {STAT_CARDS.map((card) => (
              <article key={card.key} className="marketing-stat-card">
                <span
                  className={`marketing-stat-card__icon-wrap marketing-stat-card__icon-wrap--${card.wrap}`}
                >
                  <img
                    src={card.icon}
                    alt=""
                    className="marketing-stat-card__icon"
                  />
                </span>
                <p className="marketing-stat-card__label">{card.label}</p>
                {statsLoading ? (
                  <span className="marketing-stat-card__value">0</span>
                ) : (
                  <CountUp
                    key={`${card.key}-${statistik[card.key]}`}
                    value={statistik[card.key]}
                    className="marketing-stat-card__value"
                  />
                )}
              </article>
            ))}
          </div>
        </div>
      </RevealSection>

      <RevealSection className="marketing-features">
        <div className="marketing-landing__inner">
          <div className="marketing-features__head">
            <h2 className="marketing-features__title">Mengapa Memilih ADUIN?</h2>
            <p className="marketing-features__sub">
              Sistem pengaduan modern yang aman, transparan, dan mudah digunakan
              oleh semua warga.
            </p>
          </div>
          <div className="marketing-features__grid">
            {FEATURES.map((item) => (
              <article key={item.title} className="marketing-feature-card">
                <div className="marketing-feature-card__icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </RevealSection>

      <RevealSection className="marketing-flow">
        <div className="marketing-landing__inner">
          <div className="marketing-flow__head">
            <h2 className="marketing-flow__title">Alur Pengaduan</h2>
            <p className="marketing-flow__sub">
              Proses pengaduan yang jelas, mudah, dan transparan.
            </p>
          </div>
          <div className="marketing-flow__steps">
            {FLOW_STEPS.map((step) => (
              <div key={step.title} className="marketing-flow-step">
                <div className="marketing-flow-step__circle">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      <RevealSection className="marketing-cta">
        <div className="marketing-landing__inner">
          <div
            className="marketing-cta__banner"
            style={{ '--cta-bg': `url(${desaBg})` }}
          >
            <h2 className="marketing-cta__title">
              Mari Bangun Desa Canden yang Lebih Baik Bersama
            </h2>
            <p className="marketing-cta__sub">
              Sampaikan aspirasi Anda, bersama kita wujudkan desa yang maju,
              transparan, dan sejahtera.
            </p>
            <button
              type="button"
              className="marketing-btn marketing-btn--primary"
              onClick={onLogin}
            >
              Buat Laporan Sekarang
              <span className="marketing-btn__icon" aria-hidden>→</span>
            </button>
          </div>
        </div>
      </RevealSection>

      <RevealSection className="marketing-footer">
        <div className="marketing-landing__inner marketing-footer__grid">
          <div className="marketing-footer__brand">
            <div className="marketing-brand">
              <img src={brandIcon} alt="" className="marketing-brand__icon" />
              <span className="marketing-brand__name">ADUIN</span>
            </div>
            <p>
              Platform pengaduan digital untuk warga Desa Canden. Bersama membangun
              desa yang lebih transparan dan responsif.
            </p>
          </div>
          <div className="marketing-footer__col">
            <h4>Kontak Desa Canden</h4>
            <p className="marketing-footer__item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M12 21s-7-4.5-7-10a7 7 0 1114 0c0 5.5-7 10-7 10z" />
                <circle cx="12" cy="11" r="2.5" />
              </svg>
              Jl. Raya Waduk Cengklik, Dusun I, Canden, Kec. Sambi, Kabupaten Boyolali, Jawa Tengah
            </p>
            <p className="marketing-footer__item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              (0321) 123-4567
            </p>
            <p className="marketing-footer__item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M4 4h16v16H4z" />
                <path d="M4 8l8 5 8-5" />
              </svg>
              desacanden@gmail.com
            </p>
          </div>
          <div className="marketing-footer__col marketing-footer__hours">
            <h4>Jam Pelayanan</h4>
            <p>Senin - Jumat: 08:00 - 16:00 WIB</p>
            <p>Sabtu: 08:00 - 12:00 WIB</p>
            <p>Minggu &amp; Libur: Tutup</p>
          </div>
        </div>
        <div className="marketing-landing__inner marketing-footer__bar">
          <span>© {year} Desa Canden. All rights reserved.</span>
          <div className="marketing-footer__links">
          </div>
        </div>
      </RevealSection>
    </div>
  )
}

export default LandingPage
