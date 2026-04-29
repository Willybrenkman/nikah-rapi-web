// src/components/layout/Sidebar.jsx
import { NavLink } from 'react-router-dom'
import useStore from '../../store/useStore'
import { useWedding } from '../../hooks/useWedding'

const NAV = [
  { num: '01', icon: '📊', label: 'Dashboard Utama', path: '/' },
  { num: '02', icon: '💰', label: 'Budget Planner', path: '/budget' },
  { num: '03', icon: '📦', label: 'Seserahan Tracker ✦', path: '/seserahan' },
  { num: '04', icon: '🎁', label: 'Kado & Angpao ✦', path: '/kado-angpao' },
  { num: '05', icon: '👥', label: 'Guest List', path: '/guest-list' },
  { num: '06', icon: '✉️', label: 'RSVP Tracker', path: '/rsvp' },
  { num: '07', icon: '🤝', label: 'Vendor Manager', path: '/vendor' },
  { num: '08', icon: '📅', label: 'Timeline Acara', path: '/timeline' },
  { num: '09', icon: '✅', label: 'Checklist Persiapan', path: '/checklist' },
  { num: '10', icon: '🎨', label: 'Dekorasi & Tema', path: '/dekorasi' },
  { num: '11', icon: '🍽️', label: 'Katering & Menu', path: '/katering' },
  { num: '12', icon: '💌', label: 'Undangan & Desain', path: '/undangan' },
  { num: '13', icon: '💄', label: 'MUA & Busana', path: '/mua-busana' },
  { num: '14', icon: '📷', label: 'Foto & Video', path: '/foto-video' },
  { num: '15', icon: '💍', label: 'Cincin & Mahar', path: '/cincin-mahar' },
  { num: '16', icon: '🌙', label: 'Honeymoon Planner', path: '/honeymoon' },
  { num: '17', icon: '🎀', label: 'Souvenir & Hampers', path: '/souvenir' },
  { num: '18', icon: '📝', label: 'Catatan Penting', path: '/catatan' },
  { num: '19', icon: '📋', label: 'Rekap Akhir', path: '/rekap' },
]

export default function Sidebar() {
  const { sidebarOpen, closeSidebar } = useStore()
  const { wedding } = useWedding()

  const couple = wedding
    ? `${wedding.nama_pengantin_1} & ${wedding.nama_pengantin_2}`
    : 'Pasangan Bahagia'

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar lg:translate-x-0 ${sidebarOpen ? 'open' : ''}`}>

        {/* Header */}
        <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid #F0E6DF', flexShrink: 0 }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: '#C9956C', fontWeight: 700 }}>
            NIKAH RAPI ✦
          </div>
          <div style={{ fontSize: 12, color: '#9B8070', marginTop: 2 }}>{couple}</div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
          {NAV.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={closeSidebar}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <span style={{ fontSize: 11, color: '#9B8070', opacity: .6, minWidth: 18 }}>{item.num}</span>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}

          <div style={{ height: 1, background: '#F0E6DF', margin: '8px 16px' }} />

          <NavLink
            to="/pengaturan"
            onClick={closeSidebar}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span style={{ fontSize: 11, color: '#9B8070', opacity: .6, minWidth: 18 }}>⚙️</span>
            <span>Pengaturan</span>
          </NavLink>
        </nav>

        {/* Footer */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #F0E6DF', fontSize: 11, color: '#9B8070', fontStyle: 'italic', textAlign: 'center', flexShrink: 0 }}>
          Nikah tanpa drama 💍
        </div>
      </aside>
    </>
  )
}