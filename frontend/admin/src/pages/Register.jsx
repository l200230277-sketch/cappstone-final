import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo.jsx'
import '../App.css'
import logo from '../assets/logo.png'

export default function Register() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')

  // pakai ref untuk field lain
  const emailRef = useRef()
  const passwordRef = useRef()
  const password2Ref = useRef()

  function handleSubmit(e) {
    e.preventDefault()

    const data = {
      username,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password2: password2Ref.current.value,
    }

    console.log(data)

    navigate('/login')
  }

  return (
    <div className="register-page">
      <header className="register-page__header">
        <img
          src={logo}
          alt="Logo ADUIN"
          className="register-page__logo"
        />

        <Logo size="large" />
      </header>

      <main className="register-page__main">
        <form className="register-page__form" onSubmit={handleSubmit} noValidate>
          
          <label className="aduin-field">
            <span className="visually-hidden">Username</span>
            <input
              className="aduin-input"
              name="username"
              autoComplete="username"
              placeholder="masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>

          <label className="aduin-field">
            <span className="visually-hidden">Email</span>
            <input
              className="aduin-input"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="masukkan email"
              ref={emailRef}
            />
          </label>

          <label className="aduin-field">
            <span className="visually-hidden">Password</span>
            <input
              className="aduin-input"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="masukkan password"
              ref={passwordRef}
            />
          </label>

          <label className="aduin-field">
            <span className="visually-hidden">Ulang password</span>
            <input
              className="aduin-input"
              name="password2"
              type="password"
              autoComplete="new-password"
              placeholder="masukkan ulang password"
              ref={password2Ref}
            />
          </label>

          <button
            type="submit"
            className="aduin-btn aduin-btn--primary register-page__submit"
          >
            Daftar Akun
          </button>
        </form>

        <p className="register-page__login">
          Sudah punya akun?{' '}
          <Link to="/login" className="aduin-link aduin-link--inline">
            Masuk
          </Link>
        </p>
      </main>
    </div>
  )
}