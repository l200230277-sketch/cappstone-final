import '../App.css'

/** Logo ADUIN — ukuran diatur lewat modifier class */
export function Logo({ size = 'large', className = '' }) {
  return (
    <span className={`aduin-logo aduin-logo--${size} ${className}`.trim()} aria-label="ADUIN">
      ADUIN
    </span>
  )
}