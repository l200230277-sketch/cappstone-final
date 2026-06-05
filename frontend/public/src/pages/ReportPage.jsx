import { useState } from 'react'
import backIcon from '../assets/logo-kembali.png'
import namaIcon from '../assets/nama-pengguna.png'
import teleponIcon from '../assets/nomor-telepon.png'
import alamatIcon from '../assets/alamat.png'
import laporanIcon from '../assets/logo-laporan.png'
import kategoriIcon from '../assets/kategori.png'
import deskripsiIcon from '../assets/deskripsi.png'
import kirimIcon from '../assets/kirim.png'
import { compressImageFile } from '../utils/imageSrc.js'

const initialForm = {
  reporterName: '',
  phone: '+62',
  category: '',
  address: '',
  title: '',
  description: '',
  file: null,
  filePreview: '',
}

function ReportPage({ onSubmit, onBack }) {
  const [form, setForm] = useState(initialForm)

  const isComplete =
    form.reporterName.trim() &&
    form.phone.trim().length > 3 &&
    form.category.trim() &&
    form.address.trim() &&
    form.title.trim() &&
    form.description.trim() &&
    form.file

  /* NOMOR TELEPON WAJIB +62 */
  const handlePhoneChange = (e) => {
    let value = e.target.value

    /* Hapus semua selain angka */
    value = value.replace(/[^\d]/g, '')

    /* Paksa selalu diawali 62 */
    if (!value.startsWith('62')) {
      value = `62${value.replace(/^0+/, '')}`
    }

    setForm({
      ...form,
      phone: `+${value}`,
    })
  }

  /* FILE */
  const handleFile = async (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    const allowed = ['image/jpeg', 'image/png']
    if (!allowed.includes(file.type)) {
      alert('Dokumentasi hanya boleh JPG atau PNG.')
      e.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB.')
      e.target.value = ''
      return
    }

    try {
      const preview = await compressImageFile(file)
      setForm((prev) => ({
        ...prev,
        file,
        filePreview: preview,
      }))
    } catch {
      alert('Gagal memproses gambar. Coba file lain.')
      e.target.value = ''
    }
  }

  /* SUBMIT */
  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!isComplete) {
      alert('Semua data laporan wajib diisi.')
      return
    }

    try {
      await onSubmit({
        reporterName: form.reporterName,
        phone: form.phone,
        category: form.category,
        title: form.title,
        place: form.address,
        description: form.description,
        image: form.filePreview,
      })

      alert('Laporan berhasil dikirim ke desa.')
      setForm(initialForm)
      onBack()
    } catch {
      /* pesan error ditangani di App.jsx */
    }
  }

  return (
    <form className="public-screen public-screen--report" onSubmit={handleSubmit}>
      <header className="report-page__header">
        <button
          className="icon-btn icon-btn--image report-page__back"
          type="button"
          onClick={onBack}
          aria-label="Kembali"
        >
          <img src={backIcon} alt="Kembali" className="back-icon-img" />
        </button>

        <div className="report-page__title-wrap">
          <h2 className="report-page__title">Buat Laporan</h2>
          <p className="report-page__subtitle">
            Sampaikan keluhan atau laporan Anda untuk desa yang lebih baik.
          </p>
        </div>
      </header>

      <section className="report-form-card" aria-label="Form laporan">
        <div className="report-form-grid">
          <div className="report-field">
            <label htmlFor="reporterName">Nama Pelapor</label>
            <div className="report-input">
              <img src={namaIcon} alt="" aria-hidden className="report-input__icon" />
              <input
                id="reporterName"
                className="report-input__control"
                placeholder="Masukkan nama lengkap Anda"
                value={form.reporterName}
                onChange={(e) =>
                  setForm({
                    ...form,
                    reporterName: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>

          <div className="report-field">
            <label htmlFor="phone">Nomor Telepon</label>
            <div className="report-input">
              <img
                src={teleponIcon}
                alt=""
                aria-hidden
                className="report-input__icon"
              />
              <input
                id="phone"
                className="report-input__control"
                type="text"
                inputMode="numeric"
                placeholder="+62"
                value={form.phone}
                onChange={handlePhoneChange}
                maxLength={16}
                required
              />
            </div>
          </div>

          <div className="report-field">
            <label htmlFor="address">Alamat Lengkap</label>
            <div className="report-input">
              <img src={alamatIcon} alt="" aria-hidden className="report-input__icon" />
              <input
                id="address"
                className="report-input__control"
                placeholder="Masukkan alamat lengkap Anda"
                value={form.address}
                onChange={(e) =>
                  setForm({
                    ...form,
                    address: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>

          <div className="report-field-row">
            <div className="report-field">
              <label htmlFor="title">Judul Laporan</label>
              <div className="report-input">
                <img src={laporanIcon} alt="" aria-hidden className="report-input__icon" />
                <input
                  id="title"
                  className="report-input__control"
                  placeholder="Masukkan judul laporan Anda"
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="report-field">
              <label htmlFor="category">Kategori</label>
              <div className="report-input">
                <img
                  src={kategoriIcon}
                  alt=""
                  aria-hidden
                  className="report-input__icon"
                />
                <select
                  id="category"
                  className="report-input__control report-input__control--select"
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Pilih kategori laporan</option>
                  <option value="Infrastruktur">Infrastruktur</option>
                  <option value="Kebersihan">Kebersihan</option>
                  <option value="Keamanan">Keamanan</option>
                  <option value="Layanan Publik">Layanan Publik</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>
          </div>

          <div className="report-field">
            <label htmlFor="description">Deskripsi</label>
            <div className="report-input report-input--textarea">
              <img
                src={deskripsiIcon}
                alt=""
                aria-hidden
                className="report-input__icon"
              />
              <textarea
                id="description"
                className="report-input__control report-input__control--textarea"
                placeholder="Jelaskan kronologi atau detail laporan Anda..."
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                required
              />
              <div className="report-textarea-count">0/1000</div>
            </div>
          </div>

          <div className="report-field">
            <label htmlFor="doc">Dokumentasi</label>

            <div className="report-upload">
              <div className="report-upload__meta">
                <p className="report-upload__title">
                  Upload foto pendukung (JPG/PNG)
                </p>
                <p className="report-upload__sub">
                  Format: JPG, PNG • Maks. 5MB
                </p>
              </div>

              <label className="report-upload__btn" htmlFor="doc">
                Pilih File
              </label>

              <input
                id="doc"
                className="report-upload__input"
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleFile}
                required
              />
            </div>
          </div>
        </div>
      </section>

      {form.filePreview && (
        <section className="report-preview" aria-label="Pratinjau dokumentasi">
          <img
            src={form.filePreview}
            alt="Pratinjau lampiran"
            className="report-preview__img"
          />
        </section>
      )}

      <footer className="report-actions-bar">
        <button
          type="button"
          className="report-actions-bar__btn report-actions-bar__btn--cancel"
          onClick={onBack}
        >
          Batal
        </button>

        <button
          className="report-actions-bar__btn report-actions-bar__btn--submit"
          type="submit"
          disabled={!isComplete}
        >
          <img src={kirimIcon} alt="" aria-hidden className="report-actions-bar__icon" />
          Kirim Laporan
        </button>
      </footer>
    </form>
  )
}

export default ReportPage