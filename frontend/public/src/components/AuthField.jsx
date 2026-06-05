const ICONS = {
  user: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 118 0v3" />
    </svg>
  ),
}

function EyeIcon({ open }) {
  if (open) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6A3 3 0 0012 15a3 3 0 002.4-1.2" />
      <path d="M9.9 5.1A10.7 10.7 0 0112 5c6 0 10 7 10 7a17.5 17.5 0 01-4.1 4.8" />
      <path d="M6.2 6.2C3.6 8.1 2 12 2 12s4 7 10 7a10.2 10.2 0 004.2-.9" />
    </svg>
  )
}

function AuthField({
  icon,
  type = 'text',
  placeholder,
  value,
  onChange,
  required,
  showToggle = false,
  visible = false,
  onToggleVisibility,
}) {
  return (
    <label className="auth-field">
      <span className="auth-field__icon">{ICONS[icon]}</span>
      <input
        className="auth-field__input"
        type={showToggle ? (visible ? 'text' : 'password') : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
      {showToggle ? (
        <button
          type="button"
          className="auth-field__toggle"
          onClick={onToggleVisibility}
          aria-label={visible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
        >
          <EyeIcon open={visible} />
        </button>
      ) : null}
    </label>
  )
}

export default AuthField
