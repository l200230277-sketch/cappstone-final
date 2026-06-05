import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import AdminLayout from './admin/components/AdminLayout.jsx'
import { RequireAuth } from './admin/components/RequireAuth.jsx'
import { ReportsProvider } from './admin/context/ReportsContext.jsx'
import { useSession } from './admin/context/SessionContext.jsx'
import Arsip from './admin/pages/Arsip.jsx'
import Dashboard from './admin/pages/Dashboard.jsx'
import AdminProfile from './admin/pages/Profile.jsx'
import ReportDetail from './admin/pages/ReportDetail.jsx'
import { apiRequest } from './api/client.js'
import { ADMIN_USER_KEY } from './constants/session.js'
import PublicApp, { persistPublicSession } from './PublicApp.jsx'
import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import { isValidGmailCom, normalizeGmailCom } from './utils/validation.js'
import './App.css'
import './admin/AdminApp.css'

function AuthRoutes() {
  const navigate = useNavigate()
  const { login: adminLogin } = useSession()

  const handleLogin = async ({ username, password }) => {
    const res = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: username.trim(), password }),
    })

    if (res.user?.role === 'ADMIN') {
      adminLogin({
        username: res.user.username,
        email: res.user.email,
        role: res.user.role,
      })
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(res.user))
      navigate('/admin/dashboard', { replace: true })
      return
    }

    if (res.user?.role === 'MASYARAKAT') {
      persistPublicSession(res.user)
      navigate('/app', { replace: true })
      return
    }

    throw new Error('Peran akun tidak dikenali')
  }

  const handleSignUp = async ({ fullName, username, email, password }) => {
    const cleanEmail = normalizeGmailCom(email)

    if (!isValidGmailCom(cleanEmail)) {
      throw new Error(
        'Email harus berakhiran @gmail.com (contoh: nama@gmail.com)',
      )
    }

    await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username: username.trim(),
        email: cleanEmail,
        password,
        nama: fullName?.trim() || username.trim(),
      }),
    })
    alert('Pendaftaran berhasil! Silakan masuk.')
    navigate('/login', { replace: true })
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <LandingPage
            onLogin={() => navigate('/login')}
            onSignup={() => navigate('/signup')}
          />
        }
      />
      <Route
        path="/login"
        element={
          <LoginPage
            onSubmit={handleLogin}
            onSignup={() => navigate('/signup')}
            onBack={() => navigate('/')}
          />
        }
      />
      <Route
        path="/signup"
        element={
          <SignUpPage
            onSubmit={handleSignUp}
            onLogin={() => navigate('/login')}
            onBack={() => navigate('/')}
          />
        }
      />
      <Route path="/app/*" element={<PublicApp />} />
      <Route element={<RequireAuth />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/laporan/:id" element={<ReportDetail />} />
          <Route path="/admin/profil" element={<AdminProfile />} />
          <Route path="/admin/arsip" element={<Arsip />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ReportsProvider>
      <AuthRoutes />
    </ReportsProvider>
  )
}
