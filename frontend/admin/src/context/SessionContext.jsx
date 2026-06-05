import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const SessionContext = createContext(null)

const STORAGE_KEY = 'aduin_admin_session'

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function SessionProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)

  const login = useCallback((payload) => {
    const next = { username: payload.username, email: payload.email ?? 'admin@gmail.com' }
    setUser(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout])

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession harus di dalam SessionProvider')
  return ctx
}
