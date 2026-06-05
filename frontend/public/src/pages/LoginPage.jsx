import { useState } from 'react'
import AuthField from '../components/AuthField'
import AuthPageLayout from '../components/AuthPageLayout'

function LoginPage({ onSubmit, onSignup, onBack }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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

    if (!password) {
      showError('Kata sandi wajib diisi')
      return
    }

    Promise.resolve(
      onSubmit({
        username: username.trim(),
        password,
      }),
    ).catch((err) => {
      showError(err.message || 'Gagal masuk')
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
          icon="lock"
          placeholder="Masukkan password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          showToggle
          visible={showPassword}
          onToggleVisibility={() => setShowPassword((prev) => !prev)}
          required
        />

        <button className="auth-page__submit" type="submit">
          Masuk ke Akun
        </button>

        <p className="auth-page__footer">
          Belum punya akun?{' '}
          <button type="button" className="auth-page__footer-link" onClick={onSignup}>
            Daftar di sini
          </button>
        </p>
      </form>
    </AuthPageLayout>
  )
}

export default LoginPage
