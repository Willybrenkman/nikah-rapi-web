import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Demo = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const checkoutUrl = "https://entrepreneurai.myscalev.com/checkout-page";

  const menus = [
    { name: 'Dashboard', icon: '🏠', locked: false },
    { name: 'Budget Planner', icon: '💰', locked: false },
    { name: 'Seserahan Tracker', icon: '💍', locked: false },
    { name: 'Guest List', icon: '👥', locked: true },
    { name: 'Vendor Manager', icon: '🏢', locked: true },
    { name: 'Timeline Acara', icon: '📅', locked: true },
    { name: 'Kado & Angpao', icon: '🎁', locked: true },
  ];

  const handleMenuClick = (menu) => {
    if (menu.locked) {
      alert("Fitur ini hanya tersedia di NIKAH RAPI Versi Premium. Silakan klaim akses Anda untuk membuka semua fitur!");
    } else {
      setActiveMenu(menu.name);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0F172A', color: 'white', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Sidebar Simulasi */}
      <div style={{ width: '260px', background: '#1E293B', padding: '24px', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#D4AF37', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>💍</span> NIKAH RAPI <span style={{ fontSize: '10px', background: '#D4AF37', color: 'black', padding: '2px 6px', borderRadius: '4px' }}>DEMO</span>
        </div>
        
        <nav>
          {menus.map((menu) => (
            <div 
              key={menu.name}
              onClick={() => handleMenuClick(menu)}
              style={{ 
                padding: '12px 16px', 
                borderRadius: '8px', 
                marginBottom: '8px', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: activeMenu === menu.name ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                color: activeMenu === menu.name ? '#D4AF37' : '#94A3B8',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>{menu.icon}</span>
                <span style={{ fontSize: '14px' }}>{menu.name}</span>
              </div>
              {menu.locked && <span style={{ fontSize: '12px' }}>🔒</span>}
            </div>
          ))}
        </nav>

        <div style={{ marginTop: '40px', padding: '16px', background: 'rgba(212, 175, 55, 0.05)', borderRadius: '12px', border: '1px dashed #D4AF37' }}>
          <p style={{ fontSize: '12px', color: '#CBD5E1', marginBottom: '12px', lineHeight: '1.5' }}>Suka dengan aplikasinya? Dapatkan akses penuh sekarang!</p>
          <a 
            href={checkoutUrl}
            style={{ 
              display: 'block', 
              textAlign: 'center', 
              background: '#D4AF37', 
              color: 'black', 
              padding: '10px', 
              borderRadius: '6px', 
              fontSize: '12px', 
              fontWeight: 'bold', 
              textDecoration: 'none' 
            }}
          >
            Beli Versi Premium
          </a>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header Area */}
        <header style={{ height: '70px', background: '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: '18px', fontWeight: '500' }}>{activeMenu} (Simulasi Data)</div>
          <button 
            onClick={() => navigate('/')}
            style={{ background: 'transparent', border: '1px solid #94A3B8', color: '#94A3B8', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
          >
            Kembali ke Landing Page
          </button>
        </header>

        {/* Content Preview */}
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          <div style={{ background: '#1E293B', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '12px', background: 'rgba(212, 175, 55, 0.1)', color: '#D4AF37', padding: '4px 12px', borderRadius: '100px', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                PREVIEW MODE — DATA CONTOH
              </span>
            </div>

            {activeMenu === 'Dashboard' && (
              <img src="/landing-assets/dashboard.png" alt="Dashboard Preview" style={{ width: '100%', borderRadius: '8px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }} />
            )}
            {activeMenu === 'Budget Planner' && (
              <img src="/landing-assets/budget.png" alt="Budget Preview" style={{ width: '100%', borderRadius: '8px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }} />
            )}
            {activeMenu === 'Seserahan Tracker' && (
              <img src="/landing-assets/seserahan.png" alt="Seserahan Preview" style={{ width: '100%', borderRadius: '8px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }} />
            )}

            <div style={{ marginTop: '32px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '32px' }}>
              <h3 style={{ color: '#D4AF37', marginBottom: '16px' }}>Ini Hanyalah Sebagian Kecil Dari Fitur Kami</h3>
              <p style={{ color: '#94A3B8', fontSize: '14px', maxWidth: '600px', margin: '0 auto 24px', lineHeight: '1.6' }}>
                Dalam versi Premium, Anda akan mendapatkan akses ke 22+ modul lengkap yang saling terintegrasi secara real-time. Data Anda tersimpan aman dan bisa diakses kapan saja.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <a href={checkoutUrl} style={{ background: '#D4AF37', color: 'black', padding: '14px 28px', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' }}>
                  Klaim Akses Premium Sekarang
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Demo;
