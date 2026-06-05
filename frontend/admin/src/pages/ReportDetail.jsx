import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useReports } from '../context/ReportsContext.jsx'
import { REPORT_CATEGORIES } from '../data/categories.js'
import { REPORT_STATUSES } from '../data/statuses.js'
import { isDisplayableImage, normalizeImageSrc } from '../utils/imageSrc.js'
import { labelTanggalUpdateSekarang } from '../utils/tanggalIndonesia.js'
import '../App.css'

export default function ReportDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getById, updateReport } = useReports()
  const report = getById(id)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [draftStatus, setDraftStatus] = useState('')
  const [draftKategori, setDraftKategori] = useState('')

  useEffect(() => {
    if (!id || report) return
    navigate('/dashboard', { replace: true })
  }, [id, report, navigate])

  if (!report) {
    return null
  }

  const fotoUrls = (
    Array.isArray(report.fotoUrls) ? report.fotoUrls : report.foto ? [report.foto] : []
  )
    .map(normalizeImageSrc)
    .filter(isDisplayableImage)
  const username = report.usernamePelapor ?? report.pelapor

  function openDialog() {
    setDraftStatus(report.status)
    setDraftKategori(report.kategori)
    setDialogOpen(true)
  }

  async function saveDialog() {
    const patch = {
      status: draftStatus,
      kategori: draftKategori,
    }
    if (draftStatus !== report.status) {
      Object.assign(patch, labelTanggalUpdateSekarang())
    }
    try {
      await updateReport(report.id, patch)
      setDialogOpen(false)
    } catch {
      alert('Gagal menyimpan perubahan. Coba lagi.')
    }
  }

  return (
    <div className="report-detail">
      <div className="report-detail__topbar">
        <button
          type="button"
          className="report-detail__close"
          onClick={() => navigate(-1)}
          aria-label="Kembali"
        >
          Close
        </button>
        <div className="report-detail__pill">Detail Laporan</div>
      </div>

      <article className="report-detail__card">
        <dl className="report-detail__list">
          <div className="report-detail__row">
            <dt>Pelapor</dt>
            <dd>{report.pelapor}</dd>
          </div>
          <div className="report-detail__row">
            <dt>Username pelapor</dt>
            <dd>{username}</dd>
          </div>
          <div className="report-detail__row">
            <dt>Alamat</dt>
            <dd>{report.alamat}</dd>
          </div>
          <div className="report-detail__row">
            <dt>Tanggal</dt>
            <dd>{report.tanggalLabel}</dd>
          </div>
          {report.tanggalUpdateLabel ? (
            <div className="report-detail__row">
              <dt>Tanggal update</dt>
              <dd>{report.tanggalUpdateLabel}</dd>
            </div>
          ) : null}
          <div className="report-detail__row">
            <dt>Judul</dt>
            <dd>{report.judul}</dd>
          </div>
          <div className="report-detail__row">
            <dt>Kategori</dt>
            <dd>{report.kategori}</dd>
          </div>
          <div className="report-detail__row">
            <dt>Deskripsi</dt>
            <dd>{report.deskripsi}</dd>
          </div>
          <div className="report-detail__row">
            <dt>Status</dt>
            <dd>
              <span
                className={`report-detail__status-pill report-detail__status-pill--${badgeKind(
                  report.status,
                )}`}
              >
                {report.status}
              </span>
            </dd>
          </div>
          <div className="report-detail__row report-detail__row--block">
            <dt>Foto</dt>
            <dd className="report-detail__foto-wrap">
              {fotoUrls.length > 0 ? (
                <div className="report-detail__foto-grid">
                  {fotoUrls.map((url, index) => (
                    <div key={`${report.id}-foto-${index}`} className="report-detail__foto-item">
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="report-detail__foto-link"
                        title="Buka lampiran"
                      >
                        <img src={url} alt="Lampiran laporan" className="report-detail__foto-img" />
                      </a>
                      {url.startsWith('http') ? (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="report-detail__foto-url"
                        >
                          {url}
                        </a>
                      ) : (
                        <span className="report-detail__foto-hint">Lampiran gambar laporan</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <span className="report-detail__foto">{report.fotoLabel}</span>
              )}
            </dd>
          </div>
        </dl>

        <button type="button" className="aduin-btn aduin-btn--tan report-detail__btn" onClick={openDialog}>
          Ubah Status
        </button>
      </article>

      {dialogOpen ? (
        <div className="report-detail__backdrop" role="presentation">
          <button
            type="button"
            className="report-detail__backdrop-hit"
            aria-label="Tutup"
            onClick={() => setDialogOpen(false)}
          />
          <div
            className="report-detail__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-detail-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="report-detail-modal-title" className="report-detail__modal-title">
              Ubah status &amp; kategori
            </h2>
            <label className="aduin-field">
              <span className="report-detail__label">Status</span>
              <select
                className="aduin-input report-detail__select"
                value={draftStatus}
                onChange={(e) => setDraftStatus(e.target.value)}
              >
                {REPORT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="aduin-field">
              <span className="report-detail__label">Kategori</span>
              <select
                className="aduin-input report-detail__select"
                value={draftKategori}
                onChange={(e) => setDraftKategori(e.target.value)}
              >
                {REPORT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <div className="report-detail__modal-actions">
              <button type="button" className="aduin-btn aduin-btn--tan" onClick={() => setDialogOpen(false)}>
                Batal
              </button>
              <button type="button" className="aduin-btn aduin-btn--primary" onClick={saveDialog}>
                Simpan
              </button>
            </div>
          </div>
        </div>
      ) : null}
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
