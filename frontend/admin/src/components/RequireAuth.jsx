import { Navigate, Outlet } from 'react-router-dom'
import { useSession } from '../context/SessionContext.jsx'

/** Melindungi rute admin — redirect ke login jika belum masuk */
export function RequireAuth() {
  const { user } = useSession()
  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}
