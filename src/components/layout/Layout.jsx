import { Outlet, Navigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import BottomNav from '../BottomNav'
import { useWedding } from '../../hooks/useWedding'

export default function Layout() {
  const { wedding, loading } = useWedding()

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FDFAF6' }}>
      <div style={{ fontSize: 48, animation: 'pulse-logo 1.5s ease-in-out infinite' }}>💍</div>
    </div>
  )

  if (!wedding) return <Navigate to="/onboarding" replace />

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