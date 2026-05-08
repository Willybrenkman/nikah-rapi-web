// src/components/layout/Layout.jsx
import { Outlet, Navigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import BottomNav from '../BottomNav'
import { useWedding } from '../../hooks/useWedding'

export default function Layout() {
  const { wedding, loading, error, refetch } = useWedding()

  // 1. UI Loading
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FDFAF6' }}>
      <div style={{ fontSize: 48, animation: 'pulse-logo 1.5s ease-in-out infinite' }}>💍</div>
      <p style={{ marginTop: 16, color: '#9B8070', fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>Menyiapkan Dashboard...</p>
    </div>
  )

  // 2. UI Error (Network error, RLS, dsb)
  if (error) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FDFAF6', padding: 20, textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>📡</div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: '#2C1810', marginBottom: 8 }}>Koneksi Terganggu</h2>
      <p style={{ color: '#9B8070', fontSize: 14, maxWidth: 300, marginBottom: 24, lineHeight: 1.6 }}>
        Gagal mengambil data pernikahanmu. Pastikan koneksi internet stabil atau coba lagi nanti.
      </p>
      <button 
        onClick={() => refetch()}
        style={{ 
          padding: '12px 24px', 
          background: '#C9956C', 
          color: '#fff', 
          border: 'none', 
          borderRadius: 10, 
          fontWeight: 600, 
          cursor: 'pointer' 
        }}
      >
        Coba Lagi
      </button>
    </div>
  )

  // 3. Redirect ke Onboarding (Hanya jika loading selesai, tidak ada error, dan wedding memang null)
  if (!wedding) return <Navigate to="/onboarding" replace />

  // 4. Render Dashboard Layout
  return (
    <div className="layout-wrapper">
      <Sidebar />
      <div className="layout-main pb-20 lg:pb-0">
        <Topbar />
        <main className="main-content animate-fade-in">
          <Outlet />
        </main>
        <div className="lg:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  )
}