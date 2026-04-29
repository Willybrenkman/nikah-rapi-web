import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()

  // Masih cek session — tampilkan loading spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-center">
          <div className="font-playfair text-2xl text-rose-gold mb-2">NIKAH RAPI ✦</div>
          <div className="text-brown-muted text-sm animate-pulse">Memuat...</div>
        </div>
      </div>
    )
  }

  // Belum login → redirect ke /login
  if (!user) return <Navigate to="/login" replace />

  // Sudah login → tampilkan halaman yang diminta
  return <Outlet />
}
