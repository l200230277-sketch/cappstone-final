import { useState } from 'react'
import AuthField from '../components/AuthField'
import AuthPageLayout from '../components/AuthPageLayout'
import { isValidGmailCom, normalizeGmailCom } from '../utils/validation.js'

function SignupPage({ onSubmit, onLogin, onBack }) {
  const [username, setUsername] = useState('')
  const [emailName, setEmailName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const showError = (message) => {
    setErrorMessage(message)

    setTimeout(() => {
      setErrorMessage('')
    }, 3000)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!username.trim()) {
      showError('Nama pengguna wajib diisi')
      return
    }

    const email = normalizeGmailCom(emailName)

    if (!email) {
      showError('Email wajib diisi')
      return
    }

    if (!isValidGmailCom(email)) {
      showError('Email harus berakhiran @gmail.com')
      return
    }

    if (!password) {
      showError('Kata sandi wajib diisi')
      return
    }

    if (password.length < 6) {
      showError('Kata sandi minimal 6 karakter')
      return
    }

    if (!confirmPassword) {
      showError('Konfirmasi kata sandi wajib diisi')
      return
    }

    if (password !== confirmPassword) {
      showError('Konfirmasi kata sandi tidak cocok')
      return
    }

    Promise.resolve(
      onSubmit({
        fullName: username.trim(),
        username: username.trim(),
        email,
        password,
      }),
    )
      .then(() => {
        setUsername('')
        setEmailName('')
        setPassword('')
        setConfirmPassword('')
      })
      .catch((err) => {
        showError(err.message || 'Pendaftaran gagal')
      })
  }

  return (
    <AuthPageLayout onBack={onBack}>
      {errorMessage ? (
        <div className="auth-page__error">{errorMessage}</div>
      ) : null}

      <form className="auth-page__form" onSubmit={handleSubmit}>
        <AuthField
          icon="user"
          placeholder="Masukkan username"
          value={username}
          onChange={(event) => {
            const value = event.target.value.replace(/\s/g, '')
            setUsername(value)
          }}
          required
        />

        <AuthField
          icon="mail"
          type="email"
          placeholder="@gmail.com"
          value={emailName}
          onChange={(event) => setEmailName(event.target.value.replace(/\s/g, ''))}
          required
        />

        <AuthField
          icon="lock"
          placeholder="Masukkan password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          showToggle
          visible={showPassword}
          onToggleVisibility={() => setShowPassword((prev) => !prev)}
          required
        />

        <AuthField
          icon="lock"
          placeholder="Masukkan ulang password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          showToggle
          visible={showConfirmPassword}
          onToggleVisibility={() => setShowConfirmPassword((prev) => !prev)}
          required
        />

        <button className="auth-page__submit" type="submit">
          Daftar Akun
        </button>

        <p className="auth-page__footer">
          Sudah punya akun?{' '}
          <button type="button" className="auth-page__footer-link" onClick={onLogin}>
            Masuk di sini
          </button>
        </p>
      </form>
    </AuthPageLayout>
  )
}

export default SignupPage
