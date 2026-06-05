import { Navigate, Outlet } from 'react-router-dom'
import { useSession } from '../context/SessionContext.jsx'

const ADMIN_USER_KEY = 'currentUser'

function readAdminAccount() {
  try {
    const raw = localStorage.getItem(ADMIN_USER_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.role === 'ADMIN' ? parsed : null
  } catch {
    return null
  }
}

/** Melindungi rute admin — redirect ke login jika belum masuk sebagai ADMIN */
export function RequireAuth() {
  const { user } = useSession()
  const account = readAdminAccount()
  if (!user || !account) return <Navigate to="/login" replace />
  return <Outlet />
}
