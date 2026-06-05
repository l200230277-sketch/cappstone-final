import { useState } from 'react'
import backIcon from '../assets/logo-kembali.png'
import defaultAvatar from '../assets/default-avatar.png'
import namaIcon from '../assets/nama-pengguna.png'
import alamatIcon from '../assets/alamat.png'
import teleponIcon from '../assets/nomor-telepon.png'
import statusIcon from '../assets/status.png'
import editProfilIcon from '../assets/edit-profil.png'

function ProfilePage({ user, onBack, onPhotoChange, onUpdateProfile }) {
  const [isEditing, setIsEditing] = useState(false)
  const [address, setAddress] = useState(user.address || '')
  const [phone, setPhone] = useState(
    user.phone?.startsWith('+62') ? user.phone : '+62'
  )
  const [errorMessage, setErrorMessage] = useState('')

  const showError = (message) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(''), 3000)
  }

  const handlePhoneChange = (value) => {
    let cleaned = value.replace(/[^\d+]/g, '')
    if (!cleaned.startsWith('+62')) {
      cleaned = '+62' + cleaned.replace(/^\+?62?/, '')
    }
    if (cleaned.length > 15) return
    setPhone(cleaned)
  }

  const handleSaveProfile = () => {
    if (!address.trim()) { showError('Alamat wajib diisi'); return }
    if (phone.length < 11 || !phone.startsWith('+62')) {
      showError('Nomor telepon harus diawali +62 dan valid'); return
    }
    if (onUpdateProfile) onUpdateProfile({ address: address.trim(), phone })
    setIsEditing(false)
    alert('Profil berhasil diperbarui!')
  }

  const fields = [
    { icon: namaIcon,    label: 'Nama Pengguna', value: user.name,              editable: false },
    { icon: alamatIcon,  label: 'Alamat',        value: user.address || 'Belum diisi', editable: true,
      editEl: <input type="text" className="profile-edit-input" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Masukkan alamat" /> },
    { icon: teleponIcon, label: 'Nomor Telepon', value: user.phone  || 'Belum diisi', editable: true,
      editEl: <input type="text" className="profile-edit-input" value={phone}   onChange={(e) => handlePhoneChange(e.target.value)} placeholder="+628123456789" /> },
    { icon: statusIcon,  label: 'Status',        value: user.role   || 'Pelapor',     editable: false },
  ]

  return (
    <section className="profile-screen">

      {/* TOPBAR — pojok kiri */}
      <div className="profile-topbar">
        <button className="profile-back-btn" type="button" onClick={onBack} aria-label="Kembali">
          <img src={backIcon} alt="Kembali" className="profile-back-icon" />
        </button>
        <div>
          <h1 className="profile-topbar__title">Profil</h1>
          <p className="profile-topbar__sub">Kelola informasi akun Anda</p>
        </div>
      </div>

      {errorMessage && <div className="popup-error profile-error">{errorMessage}</div>}

      {/* BODY: avatar kiri, card kanan */}
      <div className="profile-body">

        {/* KIRI — avatar */}
        <div className="profile-left">
          <label className="profile-avatar-wrap">
            <img
              src={user.photo || defaultAvatar}
              alt="Foto Profil"
              className="profile-avatar-img"
            />
            <input
              type="file" accept="image/*" className="upload-photo-input"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file && onPhotoChange) onPhotoChange(URL.createObjectURL(file))
              }}
            />
          </label>
          <h2 className="profile-avatar-name">{user.name}</h2>
          <p className="profile-avatar-email">{user.email}</p>
        </div>

        {/* KANAN — card + button */}
        <div className="profile-right">
          <div className="profile-card">
            {fields.map((f, i) => (
              <div key={i} className={`profile-row${i < fields.length - 1 ? ' profile-row--border' : ''}`}>
                <div className="profile-row__icon-wrap">
                  <img src={f.icon} alt="" aria-hidden className="profile-row__icon" />
                </div>
                <div className="profile-row__body">
                  <span className="profile-row__label">{f.label}</span>
                  {isEditing && f.editable ? f.editEl : (
                    <span className="profile-row__value">{f.value}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="profile-action-btn"
            onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
          >
            {!isEditing && (
              <img src={editProfilIcon} alt="" aria-hidden className="profile-action-btn__icon" />
            )}
            {isEditing ? 'Simpan Profil' : 'Edit Profil'}
          </button>
        </div>

      </div>
    </section>
  )
}

export default ProfilePage