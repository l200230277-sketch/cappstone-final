import { useState } from 'react'
import searchIcon from '../assets/logo-search.png'
import clearSearchIcon from '../assets/logo-kembali-search.png'
import defaultAvatar from '../assets/default-avatar.png'
import totalLaporanIcon from '../assets/total-laporan.png'
import diprosesIcon from '../assets/diproses.png'
import selesaiIcon from '../assets/selesai.png'
import ditolakIcon from '../assets/ditolak.png'
import alamatIcon from '../assets/alamat.png'
import tanggalIcon from '../assets/tanggal.png'
import detailIcon from '../assets/detail.png'
import hapusIcon from '../assets/hapus.png'
import ituSajaIcon from '../assets/itu-saja.png'
import { isDisplayableImage, normalizeImageSrc } from '../utils/imageSrc.js'

const STAT_META = {
  'Total Laporan': { icon: totalLaporanIcon },
  Diproses:        { icon: diprosesIcon },
  Selesai:         { icon: selesaiIcon },
  Ditolak:         { icon: ditolakIcon },
}

function statusToClass(status) {
  const s = (status || '').toLowerCase()
  if (s.includes('selesai')) return 'selesai'
  if (s.includes('ditolak')) return 'ditolak'
  if (s.includes('diterima')) return 'diterima'
  return 'diproses'
}

function splitGreeting(greeting) {
  const i = (greeting || '').indexOf(',')
  if (i < 0) return { lead: greeting || 'Halo', name: '' }
  return {
    lead: greeting.slice(0, i).trim(),
    name: greeting.slice(i + 1).trim(),
  }
}

function getAdminNote(report) {
  const status = (report.status || '').toLowerCase()
  if (report.note && report.note.trim() !== '') return report.note
  if (status.includes('diterima')) return 'Catatan: Belum ada catatan yang di berikan oleh pihak desa'
  return 'Catatan: Belum ada catatan'
}

// Ubah label jadi class-friendly: "Total Laporan" → "total-laporan"
function labelToClass(label) {
  return (label || '').toLowerCase().replace(/\s+/g, '-')
}

function HomePage({
  greeting,
  user,
  stats = [],
  reports = [],
  onDeleteReport,
  onOpenProfile,
}) {
  const [search, setSearch] = useState('')
  const [openDetail, setOpenDetail] = useState(null)

  const normalizedReports = reports.map((report) => ({
    ...report,
    status: report.status && report.status.trim() !== '' ? report.status : 'Diproses',
  }))

  const filteredReports = normalizedReports.filter((r) => {
    const keyword = search.trim().toLowerCase()
    return (
      (r.title  || '').toLowerCase().includes(keyword) ||
      (r.status || '').toLowerCase().includes(keyword) ||
      (r.place  || '').toLowerCase().includes(keyword) ||
      (r.date   || '').toLowerCase().includes(keyword)
    )
  })

  const { lead, name } = splitGreeting(greeting)
  const displayName = name || user?.username || ''

  return (
    <section className="public-screen public-screen--home dashboard-home">

      {/* HEADER */}
      <header className="dashboard-home__header">
        <div className="dashboard-home__greet">
          <h2 className="dashboard-home__title">
            {lead}
            {displayName ? (
              <>, <span className="dashboard-home__name">{displayName}</span></>
            ) : null}
          </h2>
          <p className="dashboard-home__sub">Selamat datang kembali di ADUIN</p>
        </div>

        <button type="button" className="dashboard-home__user-chip" onClick={onOpenProfile}>
          <img src={user?.photo || defaultAvatar} alt="" className="dashboard-home__avatar" />
          <span className="dashboard-home__chip-name">{user?.username || 'Pengguna'}</span>
          <span className="dashboard-home__chevron" aria-hidden>▾</span>
        </button>
      </header>

      {/* STAT CARDS */}
      <div className="dashboard__stats dashboard__stats--cards">
        {stats.map((item) => {
          const meta = STAT_META[item.label] || { icon: totalLaporanIcon }
          const iconClass = `dashboard__stat-icon-wrap dashboard__stat-icon-wrap--${labelToClass(item.label)}`

          return (
            <article key={item.label} className="dashboard__stat-card dashboard__stat-card--light">
              <div className="dashboard__stat-card__row">

                {/* Icon wrap dengan class dinamis */}
                <span className={iconClass}>
                  <img src={meta.icon} alt="" className="dashboard__stat-icon" />
                </span>

                <p className="dashboard__stat-label">{item.label}</p>
              </div>

              <p className="dashboard__stat-value">{item.value ?? 0}</p>
            </article>
          )
        })}
      </div>

      {/* RIWAYAT LAPORAN HEADER + SEARCH */}
      <div className="report-header-card">
        <div className="report-header-card__title report-header-card__title--left">
          <h3>Riwayat Laporan</h3>
        </div>

        <div className="report-header-card__search">
          <img src={searchIcon} alt="" className="report-search-icon" aria-hidden />
          <input
            type="search"
            placeholder="Cari laporan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search ? (
            <button
              type="button"
              className="report-search-clear"
              onClick={() => setSearch('')}
              aria-label="Hapus pencarian"
            >
              <img src={clearSearchIcon} alt="" className="report-clear-icon" />
            </button>
          ) : null}
        </div>
      </div>

      {/* REPORT LIST */}
      <div className="report-list report-list--dashboard">
        {filteredReports.length > 0 ? (
          <>
            {filteredReports.map((r) => {
              const thumbSrc = normalizeImageSrc(r.image)
              const hasThumb = isDisplayableImage(r.image)

              return (
              <article key={r.id} className="card report report--row">

                {/* THUMBNAIL */}
                <div className="report__thumb-wrap">
                  {hasThumb ? (
                    <img src={thumbSrc} alt="" className="report__thumb" />
                  ) : (
                    <div className="report__thumb report__thumb--placeholder" aria-hidden />
                  )}
                </div>

                {/* BODY */}
                <div className="report__body">
                  <div className="report__title-block">
                    <strong className="report__title">{r.title}</strong>
                    <span className={`status-pill status-pill--light ${statusToClass(r.status)}`}>
                      {r.status}
                    </span>
                  </div>

                  <p className="report__line">
                    <img src={alamatIcon} alt="" className="report__inline-icon" />
                    <span>{r.place || 'Belum ada lokasi'}</span>
                  </p>

                  <p className="report__line">
                    <img src={tanggalIcon} alt="" className="report__inline-icon" />
                    <span>{r.date || 'Belum ada tanggal'}</span>
                  </p>

                  {r.description ? (
                    <p className="report__desc">{r.description}</p>
                  ) : (
                    <p className="report__desc report__desc--muted">Belum ada deskripsi</p>
                  )}

                  {openDetail === r.id ? (
                    <div className="report-detail-inline report-detail-inline--light">
                      <p><strong>Status:</strong> {r.status || 'Diproses'}</p>
                      <p className="report-detail-inline__note">
                        <strong>Catatan:</strong>{' '}
                        {getAdminNote(r).replace('Catatan: ', '')}
                      </p>
                    </div>
                  ) : null}
                </div>

                {/* SIDE ACTIONS */}
                <div className="report__side">
                  <div className="report-card__actions report-card__actions--row">
                    <button
                      type="button"
                      className="report-btn report-btn--detail"
                      onClick={() => setOpenDetail(openDetail === r.id ? null : r.id)}
                    >
                      <img src={detailIcon} alt="" className="report-btn__icon" />
                      Detail
                    </button>

                    <button
                      type="button"
                      className="report-btn report-btn--hapus"
                      onClick={() => onDeleteReport(r.id)}
                    >
                      <img src={hapusIcon} alt="" className="report-btn__icon" />
                      Hapus
                    </button>
                  </div>
                </div>

              </article>
            )})}

            <footer className="report-list-footer">
              <div className="report-list-footer__icon-wrap">
                <img src={ituSajaIcon} alt="" className="report-list-footer__icon" />
              </div>
              <p className="report-list-footer__title">Itu saja laporan Anda</p>
              <p className="report-list-footer__sub">
                Terus sampaikan keluhan Anda untuk desa yang lebih baik.
              </p>
            </footer>
          </>
        ) : (
          <p className="report-empty">
            {search.trim()
              ? 'Belum ada laporan yang cocok dengan pencarian.'
              : 'Belum ada laporan. Buat laporan pertama Anda dari menu Buat Laporan.'}
          </p>
        )}
      </div>

    </section>
  )
}

export default HomePage