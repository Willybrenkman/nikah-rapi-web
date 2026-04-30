// src/components/layout/Topbar.jsx
import { useLocation, useNavigate } from 'react-router-dom'
import useStore from '../../store/useStore'
import { useAuth } from '../../hooks/useAuth'
import { useWedding } from '../../hooks/useWedding'
import toast from 'react-hot-toast'
import ThemeToggle from '../ThemeToggle'

const TITLES = {
  '/': 'Dashboard Utama',
  '/budget': 'Budget Planner',
  '/seserahan': 'Seserahan Tracker ✦',
  '/kado-angpao': 'Kado & Angpao ✦',
  '/guest-list': 'Guest List',
  '/rsvp': 'RSVP Tracker',
  '/vendor': 'Vendor Manager',
  '/timeline': 'Timeline Acara',
  '/checklist': 'Checklist Persiapan',
  '/dekorasi': 'Dekorasi & Tema',
  '/katering': 'Katering & Menu',
  '/undangan': 'Undangan & Desain',
  '/mua-busana': 'MUA & Busana',
  '/foto-video': 'Foto & Video',
  '/cincin-mahar': 'Cincin & Mahar',
  '/honeymoon': 'Honeymoon Planner',
  '/souvenir': 'Souvenir & Hampers',
  '/catatan': 'Catatan Penting',
  '/rekap': 'Rekap Akhir',
  '/pengaturan': 'Pengaturan',
}

export default function Topbar() {
  const { toggleSidebar } = useStore()
  const { signOut, user } = useAuth()
  const { wedding, hMin } = useWedding()
  const location = useLocation()
  const navigate = useNavigate()

  const title = TITLES[location.pathname] || 'NIKAH RAPI'
  const firstName = wedding?.nama_pengantin_1?.split(' ')[0]
    || user?.email?.split('@')[0] || 'User'

  const handleLogout = async () => {
    await signOut()
    toast.success('Sampai jumpa! 👋')
    navigate('/login')
  }

  return (
    <header className="topbar">
      {/* Kiri */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Hamburger mobile */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden"
          style={{ padding: 8, borderRadius: 8, background: 'transparent', border: 'none', cursor: 'pointer' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9B8070" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: 'var(--brown)' }}>
          {title}
        </h1>
      </div>

      {/* Kanan */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {hMin !== null && (
          <div className="countdown-chip hidden sm:block">
            H-{Math.max(0, hMin)} 💍
          </div>
        )}

        <ThemeToggle />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500 }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-dark))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>👤</div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: '7px 14px', background: 'transparent',
            border: '1.5px solid var(--border)', borderRadius: 8,
            fontSize: 12, cursor: 'pointer', color: 'var(--brown-muted)',
            transition: 'all .2s',
          }}
          onMouseEnter={e => { e.target.style.borderColor = '#D4756B'; e.target.style.color = '#D4756B' }}
          onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--brown-muted)' }}
        >
          Keluar
        </button>
      </div>
    </header>
  )
}