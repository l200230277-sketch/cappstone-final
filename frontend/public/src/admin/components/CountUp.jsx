import { useEffect, useRef, useState } from 'react'

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3
}

export default function CountUp({ value = 0, duration = 1400, className = '' }) {
  const [display, setDisplay] = useState(0)
  const rootRef = useRef(null)
  const animatedRef = useRef(false)
  const frameRef = useRef(null)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return undefined

    const runAnimation = () => {
      if (animatedRef.current) return
      animatedRef.current = true
      const target = Math.max(0, Number(value) || 0)
      const start = performance.now()

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1)
        setDisplay(Math.round(target * easeOutCubic(progress)))
        if (progress < 1) {
          frameRef.current = requestAnimationFrame(tick)
        }
      }

      frameRef.current = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) runAnimation()
      },
      { threshold: 0.25, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [value, duration])

  useEffect(() => {
    if (!animatedRef.current) return
    setDisplay(Math.max(0, Number(value) || 0))
  }, [value])

  return (
    <span ref={rootRef} className={className}>
      {display}
    </span>
  )
}
