import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const rp = (n = 0) => n >= 1_000_000 ? `Rp ${(n / 1_000_000).toFixed(0)} Jt` : n >= 1_000 ? `Rp ${(n / 1_000).toFixed(0)} Rb` : `Rp ${n}`;

function ProgressRow({ label, done, total, sage }) {
    const pct = total > 0 ? Math.round(done / total * 100) : 0;
    return (
        <div className="mb-5 group">
            <div className="flex justify-between text-xs mb-2">
                <span className="text-brown-muted font-medium group-hover:text-brown transition-colors">{label}</span>
                <span className="font-bold text-brown">{done}/{total} <span className="text-rose-gold ml-1">({pct}%)</span></span>
            </div>
            <div className="progress-track h-2 bg-ivory shadow-inner">
                <div className={`progress-fill ${sage ? 'sage' : ''} shadow-sm`} style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}

const Demo = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('Dashboard Utama');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showBottomCTA, setShowBottomCTA] = useState(false);
  const checkoutUrl = "https://entrepreneurai.myscalev.com/checkout-page";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.3) {
        setShowBottomCTA(true);
      } else {
        setShowBottomCTA(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menus = [
    { num: '01', icon: '📊', label: 'Dashboard Utama', locked: false },
    { num: '02', icon: '💰', label: 'Budget Planner', locked: false },
    { num: '03', icon: '📦', label: 'Seserahan Tracker ✦', locked: false },
    { num: '04', icon: '🎁', label: 'Kado & Angpao ✦', locked: false },
    { num: '05', icon: '👥', label: 'Guest List', locked: true },
    { num: '06', icon: '✉️', label: 'RSVP Tracker', locked: true },
    { num: '07', icon: '🤝', label: 'Vendor Manager', locked: true },
    { num: '08', icon: '📅', label: 'Timeline Acara', locked: true },
    { num: '09', icon: '✅', label: 'Checklist Persiapan', locked: true },
    { num: '10', icon: '🎨', label: 'Dekorasi & Tema', locked: true },
    { num: '11', icon: '🍽️', label: 'Katering & Menu', locked: true },
  ];

  const handleMenuClick = (menu) => {
    setActiveMenu(menu.label);
    setSidebarOpen(false);
  };

  const isLocked = menus.find(m => m.label === activeMenu)?.locked;

  return (
    <div className="">
      <div className="layout-wrapper" style={{ minHeight: '100vh' }}>
        
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`sidebar lg:translate-x-0 ${sidebarOpen ? 'open' : ''}`}>
          <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid var(--border)', flexShrink: 0, position: 'relative' }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: 'var(--rose-gold)', fontWeight: 700 }}>
              NIKAH RAPI <span className="text-[10px] bg-rose-gold text-black px-1.5 py-0.5 rounded ml-1 align-top">DEMO</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--brown-muted)', marginTop: 2 }}>Jessica & Max</div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden absolute right-4 top-6 w-8 h-8 flex items-center justify-center rounded-lg bg-ivory/50 border border-border">✕</button>
          </div>

          <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
            {menus.map(item => (
              <button
                key={item.label}
                onClick={() => handleMenuClick(item)}
                className={`nav-item w-full text-left ${activeMenu === item.label ? 'active' : ''}`}
                style={{ position: 'relative' }}
              >
                <span style={{ fontSize: 11, color: '#9B8070', opacity: .6, minWidth: 18 }}>{item.num}</span>
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {item.locked && <span className="absolute right-4 text-xs opacity-50">🔒</span>}
              </button>
            ))}
          </nav>
          
          <div className="p-4 m-4 rounded-xl bg-rose-gold/10 border border-rose-gold/30 text-center">
            <p className="text-[11px] text-brown-muted mb-3 leading-tight">Suka dengan aplikasinya?<br/>Dapatkan akses penuh sekarang!</p>
            <a href={checkoutUrl} className="block bg-rose-gold text-black text-xs font-bold py-2 rounded-lg hover:bg-rose-dark transition-colors">
              Beli Versi Premium
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <div className="layout-main">
          {/* Topbar */}
          <header className="topbar">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-brown">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
              </button>
              <div className="flex items-center gap-2">
                <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: 'var(--brown)' }}>{activeMenu}</h1>
                <span className="lg:hidden text-[9px] bg-rose-gold/20 text-rose-gold px-2 py-0.5 rounded-full font-bold border border-rose-gold/30">
                  DEMO
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] bg-rose-gold/20 text-rose-gold px-3 py-1 rounded-full font-bold border border-rose-gold/30 hidden lg:block">
                PREVIEW MODE
              </span>
              <button 
                onClick={() => navigate('/')} 
                className="flex items-center justify-center text-brown-muted hover:text-rose-gold transition-colors border border-border w-9 h-9 md:w-auto md:h-auto md:px-3 md:py-1.5 rounded-full md:rounded-lg"
              >
                <span className="hidden md:inline text-xs font-bold">← Kembali</span>
                <span className="md:hidden">←</span>
              </button>
            </div>
          </header>

          {/* Body */}
          <main className="main-content relative p-4 md:p-8">
            <div className={isLocked ? "blur-[6px] opacity-60 pointer-events-none select-none transition-all duration-500" : ""}>
              {activeMenu === 'Dashboard Utama' && <DemoDashboard />}
              {activeMenu === 'Budget Planner' && <DemoBudget />}
              {activeMenu === 'Seserahan Tracker ✦' && <DemoSeserahan />}
              {activeMenu === 'Kado & Angpao ✦' && <DemoKadoAngpao />}
              {/* Unique placeholder per locked menu — keeps curiosity gap intact */}
              {isLocked && <DemoLockedPlaceholder menuLabel={activeMenu} />}
            </div>

            {isLocked && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 demo-locked-overlay">
                <div className="card shadow-2xl text-center max-w-sm mx-4 transform animate-fade-up border-rose-gold/20 p-8 md:p-10">
                  <div className="text-6xl mb-6">🔒</div>
                  <h3 className="text-2xl font-playfair font-bold text-brown mb-3">Fitur Terkunci</h3>
                  <p className="text-sm text-brown-muted mb-8 leading-relaxed">
                    Fitur <strong>{activeMenu}</strong> hanya tersedia di NIKAH RAPI Versi Premium. Dapatkan akses ke 22+ modul lengkap sekarang!
                  </p>
                  <a 
                    href={checkoutUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="demo-pulse-button block w-full bg-rose-gold text-black px-6 py-4 rounded-xl font-bold text-[15px] hover:bg-rose-dark transition-colors shadow-xl shadow-rose-gold/30"
                  >
                    Klaim Akses Premium
                  </a>
                </div>
              </div>
            )}
          </main>

          {/* Floating Bottom CTA (Mobile Only) */}
          {!isLocked && showBottomCTA && (
            <div className="fixed bottom-0 left-0 right-0 z-[60] lg:hidden demo-bottom-cta">
              <div className="bg-white border-t border-border p-3 px-4 flex items-center justify-between shadow-[0_-4px-20px_rgba(44,24,16,0.08)]">
                <div className="flex-1 mr-4">
                  <p className="text-[12px] font-medium text-brown leading-tight">💍 Suka demonya? Dapatkan akses penuh sekarang!</p>
                </div>
                <a 
                  href={checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-rose-gold text-black text-xs font-bold px-6 py-2.5 rounded-lg whitespace-nowrap shadow-lg shadow-rose-gold/20"
                >
                  BELI
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// FAKE DASHBOARD COMPONENT (HARDCODED)
// ==========================================
const DemoDashboard = () => {
  const stats = {
    totalBudget: 95500000,
    usedBudget: 50500000,
    tamuConfirm: 3,
    totalTamu: 5,
    totalAngpao: 4000000,
    angpaoPemberi: 4,
    checklistDone: 8,
    checklistTotal: 12
  };
  
  const budgetItems = [
    { kategori: 'Venue', jumlah_estimasi: 25000000, jumlah_aktual: 25000000 },
    { kategori: 'Katering', jumlah_estimasi: 45000000, jumlah_aktual: 20000000 },
    { kategori: 'MUA', jumlah_estimasi: 15000000, jumlah_aktual: 5000000 },
    { kategori: 'Dekorasi', jumlah_estimasi: 10000000, jumlah_aktual: 0 },
    { kategori: 'Undangan', jumlah_estimasi: 500000, jumlah_aktual: 500000 },
  ];

  const vendors = [
    { id: 1, nama: 'Grand Ballroom Hotel', kategori: 'Venue', deadline_pelunasan: new Date(Date.now() + 14 * 86400000).toISOString() },
    { id: 2, nama: 'Catering Berkah', kategori: 'Katering', deadline_pelunasan: new Date(Date.now() + 30 * 86400000).toISOString() },
    { id: 3, nama: 'Glow MUA', kategori: 'MUA', deadline_pelunasan: new Date(Date.now() + 7 * 86400000).toISOString() },
  ];

  const milestones = {
    administrasi: { done: 3, total: 4 },
    venue: { done: 2, total: 3 },
    mua: { done: 1, total: 2 },
    dokumentasi: { done: 2, total: 3 }
  };

  const usedPct = Math.round(stats.usedBudget / stats.totalBudget * 100);

  return (
    <div className="animate-fade-in pb-12">
      {/* ── GREETING ── */}
      <div className="greeting-card relative overflow-hidden group mb-8 card">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-gold/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="relative z-10 flex justify-between items-center">
              <div>
                  <h2 className="font-playfair text-3xl text-brown mb-2">
                      Halo, <span className="font-bold text-rose-gold">Jessica</span> & <span className="font-bold text-rose-gold">Max</span>! ✨
                  </h2>
                  <p className="text-sm text-brown/70 max-w-md">Persiapan hari bahagia kamu sedang dalam pantauan. Mari wujudkan pernikahan impian bersama-sama!</p>
              </div>
              <div className="relative z-10 backdrop-blur-md rounded-2xl px-8 py-4 text-center shrink-0 shadow-xl shadow-rose-gold/10 border border-brown/10 bg-[var(--countdown-bg)] hidden md:block">
                  <div className="font-playfair text-4xl font-bold text-brown leading-tight mb-1">128</div>
                  <div className="text-[10px] text-rose-gold font-bold uppercase tracking-[0.2em]">HARI LAGI</div>
              </div>
          </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stat-card hover:-translate-y-1 transition-transform">
              <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#C9956C20] flex items-center justify-center text-xl">💎</div>
              </div>
              <div className="font-playfair text-3xl font-bold text-brown leading-tight">{rp(stats.totalBudget)}</div>
              <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Total Anggaran</div>
          </div>
          <div className="stat-card hover:-translate-y-1 transition-transform">
              <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#D4756B15] flex items-center justify-center text-xl">💸</div>
              </div>
              <div className="font-playfair text-3xl font-bold text-brown leading-tight">{rp(stats.usedBudget)}</div>
              <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Dana Terpakai</div>
              <div className="text-[10px] text-danger font-bold mt-1">{usedPct}% terealisasi</div>
          </div>
          <div className="stat-card hover:-translate-y-1 transition-transform">
              <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#8BAF8B20] flex items-center justify-center text-xl">💌</div>
              </div>
              <div className="font-playfair text-3xl font-bold text-brown leading-tight">{stats.tamuConfirm}</div>
              <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Tamu Konfirmasi</div>
          </div>
          <div className="stat-card hover:-translate-y-1 transition-transform">
              <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#E8C4B840] flex items-center justify-center text-xl">✨</div>
              </div>
              <div className="font-playfair text-3xl font-bold text-brown leading-tight">{rp(stats.totalAngpao)}</div>
              <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Total Angpao</div>
          </div>
      </div>

      {/* ── CHARTS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="card lg:col-span-1">
              <div className="p-6 border-b border-[var(--border)]">
                  <h3 className="text-lg font-bold text-brown font-playfair">Status Finansial</h3>
                  <p className="text-[10px] text-brown-muted uppercase tracking-widest mt-1">Kesehatan Anggaran</p>
              </div>
              <div className="p-8 flex flex-col items-center justify-center h-[280px]">
                  <div className="relative w-40 h-40">
                        <Doughnut data={{
                          labels: ['Terpakai', 'Sisa'],
                          datasets: [{ 
                              data: [stats.usedBudget, Math.max(0, stats.totalBudget - stats.usedBudget)], 
                              backgroundColor: ['#D4756B', '#8BAF8B20'], 
                              borderWidth: 0,
                              cutout: '85%'
                          }]
                      }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-black text-brown">{usedPct}%</span>
                          <span className="text-[8px] font-bold text-brown-muted uppercase tracking-widest">Terpakai</span>
                      </div>
                  </div>
              </div>
          </div>

          <div className="card lg:col-span-2">
              <div className="p-6 border-b border-[var(--border)] flex justify-between">
                  <div>
                      <h3 className="text-lg font-bold text-brown font-playfair">Analisa Pengeluaran</h3>
                      <p className="text-[10px] text-brown-muted uppercase tracking-widest mt-1">Estimasi vs Aktual</p>
                  </div>
              </div>
              <div className="p-4 sm:p-8 h-[280px]">
                  <Bar data={{
                      labels: budgetItems.map(i => i.kategori),
                      datasets: [
                          { label: 'Estimasi', data: budgetItems.map(i => i.jumlah_estimasi), backgroundColor: '#C9956C50', borderRadius: 6 },
                          { label: 'Aktual', data: budgetItems.map(i => i.jumlah_aktual), backgroundColor: '#D4756BCC', borderRadius: 6 },
                      ]
                  }} options={{ 
                      responsive: true, maintainAspectRatio: false, 
                      plugins: { legend: { position: 'top', labels: { color: 'var(--brown-muted)' } } }, 
                      scales: { 
                          y: { grid: { color: 'rgba(201, 149, 108, 0.1)' }, ticks: { color: 'var(--brown-muted)' } }, 
                          x: { grid: { display: false }, ticks: { color: 'var(--brown-muted)' } } 
                      } 
                  }} />
              </div>
          </div>
      </div>
      
      {/* ── BOTTOM ROW ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="card lg:col-span-2">
              <div className="p-6 border-b border-[var(--border)] mb-6">
                  <h3 className="text-lg font-bold text-brown font-playfair">Progress Persiapan</h3>
              </div>
              <div className="px-6 pb-6">
                  <ProgressRow label="Administrasi & KUA" done={milestones.administrasi.done} total={milestones.administrasi.total} sage />
                  <ProgressRow label="Venue & Katering" done={milestones.venue.done} total={milestones.venue.total} />
                  <ProgressRow label="MUA & Busana" done={milestones.mua.done} total={milestones.mua.total} sage />
              </div>
          </div>
          <div className="card lg:col-span-3 p-0 overflow-hidden">
              <div className="p-6 border-b border-[var(--border)]">
                  <h3 className="text-lg font-bold text-brown font-playfair">Deadline Vendor Terdekat</h3>
              </div>
              <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse demo-table-mobile">
                        <thead>
                            <tr className="border-b border-[var(--border)] bg-ivory/5">
                                <th className="th text-rose-gold">Vendor</th>
                                <th className="th text-rose-gold">Kategori</th>
                                <th className="th text-rose-gold">Deadline</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendors.map((v, i) => (
                                <tr key={v.id} className="tr group transition-all hover:bg-ivory/5 demo-mobile-card demo-stagger-2">
                                    {/* Mobile Card Header */}
                                    <div className="lg:hidden demo-card-header">
                                      <div className="demo-card-icon">🤝</div>
                                      <div className="demo-card-title">{v.nama}</div>
                                    </div>

                                    <td className="td font-bold text-brown group-hover:text-rose-gold transition-colors demo-hide-mobile" data-label="Vendor">{v.nama}</td>
                                    
                                    <div className="demo-field-row lg:hidden">
                                      <span className="demo-field-label">Kategori</span>
                                      <span className="demo-field-value">{v.kategori}</span>
                                    </div>
                                    <td className="td demo-hide-mobile" data-label="Kategori">
                                        <span className="text-[9px] font-black uppercase tracking-tighter text-rose-gold bg-rose-gold/5 px-2.5 py-1 rounded-lg border border-rose-gold/10 shadow-sm">{v.kategori}</span>
                                    </td>

                                    <div className="demo-field-row lg:hidden">
                                      <span className="demo-field-label">Deadline</span>
                                      <span className="demo-field-value text-danger font-bold italic">14 Hari Lagi</span>
                                    </div>
                                    <td className="td text-brown-muted text-[11px] font-bold italic demo-hide-mobile" data-label="Deadline">14 Hari Lagi</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
          </div>
      </div>
    </div>
  );
};

// ==========================================
// DEMO BUDGET PLANNER (INTERACTIVE)
// ==========================================
const DemoBudget = () => {
  const rp = (n = 0) => 'Rp ' + Number(n).toLocaleString('id-ID');
  const COLORS = ['#C9956C', '#E8C4B8', '#8BAF8B', '#D4756B', '#E8A87C'];

  const items = [
    { id: 1, kategori: 'Gedung & Venue', icon: '🏢', jumlah_estimasi: 25000000, jumlah_aktual: 25000000 },
    { id: 2, kategori: 'Katering (500 Pax)', icon: '🍽️', jumlah_estimasi: 45000000, jumlah_aktual: 20000000 },
    { id: 3, kategori: 'MUA & Kebaya', icon: '💄', jumlah_estimasi: 15000000, jumlah_aktual: 5000000 },
    { id: 4, kategori: 'Dekorasi Pelaminan', icon: '🌸', jumlah_estimasi: 10000000, jumlah_aktual: 0 },
    { id: 5, kategori: 'Undangan Digital', icon: '💌', jumlah_estimasi: 500000, jumlah_aktual: 500000 },
  ];

  const totalEst = items.reduce((a, i) => a + i.jumlah_estimasi, 0);
  const totalReal = items.reduce((a, i) => a + i.jumlah_aktual, 0);
  const sisa = totalEst - totalReal;

  return (
    <div className="animate-fade-in pb-12">
      <div className="section-header">
        <div>
          <h1 className="section-title">Perencana Anggaran 💰</h1>
          <p className="section-subtitle">Pantau rencana estimasi dan realisasi pengeluaran pernikahan kalian</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="stat-card hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="w-12 h-12 rounded-2xl bg-rose-gold/10 flex items-center justify-center text-xl mb-4">📋</div>
          <div className="font-playfair text-2xl font-bold text-brown leading-tight">{rp(totalEst)}</div>
          <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Total Estimasi Awal</div>
        </div>
        <div className="stat-card hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="w-12 h-12 rounded-2xl bg-danger/5 flex items-center justify-center text-xl mb-4">💸</div>
          <div className="font-playfair text-2xl font-bold text-brown leading-tight">{rp(totalReal)}</div>
          <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Total Realisasi Dana</div>
        </div>
        <div className="stat-card hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="w-12 h-12 rounded-2xl bg-sage/10 flex items-center justify-center text-xl mb-4">✨</div>
          <div className="font-playfair text-2xl font-bold text-brown leading-tight">{rp(sisa)}</div>
          <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Sisa Anggaran</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
        <div className="card lg:col-span-2 shadow-sm">
          <div className="p-6 border-b border-[var(--border)]">
            <h2 className="font-playfair text-lg font-bold text-brown">Alokasi Dana per Kategori</h2>
          </div>
          <div className="p-8 h-[340px]">
            <Pie 
              data={{ 
                labels: items.map(i => i.kategori), 
                datasets: [{ data: items.map(i => i.jumlah_estimasi), backgroundColor: COLORS, borderWidth: 0, hoverOffset: 20 }] 
              }}
              options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { font: { size: 10 }, usePointStyle: true, padding: 20, boxWidth: 8 } } } }} 
            />
          </div>
        </div>
        <div className="card lg:col-span-3 shadow-sm">
          <div className="p-6 border-b border-[var(--border)]">
            <h2 className="font-playfair text-lg font-bold text-brown">Komparasi Estimasi vs Aktual</h2>
          </div>
          <div className="p-8 h-[340px]">
            <Bar 
              data={{
                labels: items.map(i => i.kategori),
                datasets: [
                  { label: 'Estimasi', data: items.map(i => i.jumlah_estimasi), backgroundColor: '#C9956C50', borderRadius: 6, barThickness: 16 },
                  { label: 'Aktual', data: items.map(i => i.jumlah_aktual), backgroundColor: '#8BAF8BCC', borderRadius: 6, barThickness: 16 },
                ]
              }} 
              options={{ 
                responsive: true, maintainAspectRatio: false, 
                plugins: { legend: { position: 'bottom', labels: { font: { size: 10 }, usePointStyle: true, padding: 20, boxWidth: 8 } } }, 
                scales: { y: { beginAtZero: true, grid: { color: '#F0E6DF' }, ticks: { font: { size: 9 }, color: '#826A5E' } }, x: { grid: { display: false }, ticks: { font: { size: 9 }, color: '#5C4033' } } } 
              }} 
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
          <h2 className="font-playfair text-xl font-bold text-brown">Rincian Pengeluaran Terperinci</h2>
          <span className="text-[10px] font-bold text-brown-muted uppercase tracking-widest">{items.length} Kategori</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse demo-table-mobile">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="th hide-on-mobile text-center">No</th>
                <th className="th">Kategori</th>
                <th className="th">Estimasi</th>
                <th className="th">Aktual</th>
                <th className="th">Selisih</th>
                <th className="th">Progres</th>
                <th className="th">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => {
                const sel = item.jumlah_estimasi - item.jumlah_aktual;
                const pct = item.jumlah_estimasi > 0 ? Math.min(100, Math.round(item.jumlah_aktual / item.jumlah_estimasi * 100)) : 0;
                const badge = item.jumlah_aktual === 0 ? 'bg-[#9B8070]/10 text-[#9B8070]' : pct >= 100 ? 'bg-[#8BAF8B]/15 text-[#5C7361]' : 'bg-[#D4756B]/10 text-[#D4756B]';
                const blabel = item.jumlah_aktual === 0 ? 'Belum Bayar' : pct >= 100 ? 'Lunas' : 'Bayar Sebagian';
                return (
                  <tr key={item.id} className="tr group transition-all hover:bg-[var(--ivory)]/5 demo-mobile-card demo-stagger-3">
                    {/* Mobile Card Header */}
                    <div className="lg:hidden demo-card-header">
                      <div className="demo-card-icon">{item.icon}</div>
                      <div className="demo-card-title">{item.kategori}</div>
                    </div>

                    <td className="td hide-on-mobile text-center text-[10px] text-brown-muted font-bold" data-label="No">{String(i + 1).padStart(2, '0')}</td>
                    <td className="td demo-hide-mobile" data-label="Kategori">
                      <div className="flex items-center gap-3 justify-end md:justify-start">
                        <div className="w-10 h-10 rounded-xl bg-[var(--ivory)]/50 flex items-center justify-center text-xl shadow-inner">{item.icon}</div>
                        <span className="font-bold text-brown group-hover:text-rose-gold transition-colors">{item.kategori}</span>
                      </div>
                    </td>

                    <div className="demo-field-row lg:hidden">
                      <span className="demo-field-label">Estimasi</span>
                      <span className="demo-field-value">{rp(item.jumlah_estimasi)}</span>
                    </div>
                    <td className="td text-[11px] font-bold text-brown-muted demo-hide-mobile" data-label="Estimasi">{rp(item.jumlah_estimasi)}</td>

                    <div className="demo-field-row lg:hidden">
                      <span className="demo-field-label">Aktual</span>
                      <span className="demo-featured-value">{rp(item.jumlah_aktual)}</span>
                    </div>
                    <td className="td text-[11px] font-bold text-brown demo-hide-mobile" data-label="Aktual">{rp(item.jumlah_aktual)}</td>

                    <div className="demo-field-row lg:hidden">
                      <span className="demo-field-label">Selisih</span>
                      <span className={`demo-field-value font-bold ${sel >= 0 ? 'text-sage' : 'text-danger'}`}>
                        {sel >= 0 ? '+' : ''}{rp(Math.abs(sel))}
                      </span>
                    </div>
                    <td className={`td text-[11px] font-bold demo-hide-mobile ${sel >= 0 ? 'text-sage' : 'text-danger'}`} data-label="Selisih">
                      {sel >= 0 ? '+' : ''}{rp(Math.abs(sel))}
                    </td>

                    <div className="demo-field-row lg:hidden">
                      <span className="demo-field-label">Progres</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-ivory rounded-full overflow-hidden">
                          <div className="bg-rose-gold h-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[10px] font-bold text-brown-muted">{pct}%</span>
                      </div>
                    </div>
                    <td className="td min-w-[140px] demo-hide-mobile" data-label="Progres">
                      <div className="flex items-center gap-3 justify-end md:justify-start">
                        <div className="flex-1 h-2 bg-[var(--ivory)] rounded-full overflow-hidden shadow-inner max-w-[100px] md:max-w-none">
                          <div className="progress-fill h-full rounded-full shadow-sm" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[10px] font-bold text-brown-muted">{pct}%</span>
                      </div>
                    </td>

                    <div className="demo-status-bar lg:hidden">
                      <span className={`${badge} text-[9px] font-black uppercase tracking-tighter px-4 py-1.5 rounded-lg shadow-sm`}>{blabel}</span>
                    </div>
                    <td className="td demo-hide-mobile" data-label="Status">
                      <span className={`${badge} text-[9px] font-black uppercase tracking-tighter px-3 py-1.5 rounded-lg shadow-sm`}>{blabel}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// DEMO SESERAHAN TRACKER (INTERACTIVE)
// ==========================================
const DemoSeserahan = () => {
  const rp = (n = 0) => 'Rp ' + Number(n).toLocaleString('id-ID');
  const items = [
    { id: 1, nama: 'Set Makeup Premium', kategori: 'Kecantikan', icon: '💄', estimasi: 2500000, aktual: 2450000, tempat_beli: 'Sephora', status: 'Sudah Beli' },
    { id: 2, nama: 'Sepatu Kerja Pria', kategori: 'Fashion', icon: '👕', estimasi: 1200000, aktual: 0, tempat_beli: 'Zalora', status: 'Belum Beli' },
    { id: 3, nama: 'Perhiasan Emas 24K', kategori: 'Perhiasan', icon: '💍', estimasi: 15000000, aktual: 15000000, tempat_beli: 'Toko Emas Sejahtera', status: 'Sudah Kemas' },
    { id: 4, nama: 'Sarung & Peci Premium', kategori: 'Ibadah', icon: '🕋', estimasi: 800000, aktual: 750000, tempat_beli: 'Tokopedia', status: 'Sudah Kemas' },
    { id: 5, nama: 'Tas Branded', kategori: 'Fashion', icon: '👜', estimasi: 5000000, aktual: 0, tempat_beli: 'Mall Central', status: 'Belum Beli' },
    { id: 6, nama: 'Parfum Set', kategori: 'Kecantikan', icon: '🌸', estimasi: 1500000, aktual: 1500000, tempat_beli: 'Guardian', status: 'Sudah Beli' },
  ];

  const sudahKemas = items.filter(i => i.status === 'Sudah Kemas').length;
  const totalEst = items.reduce((a, i) => a + i.estimasi, 0);
  const pct = items.length > 0 ? Math.round(sudahKemas / items.length * 100) : 0;
  const badgeMap = { 'Sudah Kemas': 'bg-[#8BAF8B]/15 text-[#5C7361]', 'Sudah Beli': 'bg-[#4A90D9]/10 text-[#4A90D9]', 'Belum Beli': 'bg-[#D4756B]/10 text-[#D4756B]' };
  const labelMap = { 'Sudah Kemas': '✨ Siap', 'Sudah Beli': '🛒 Dibeli', 'Belum Beli': '📦 Belum' };

  return (
    <div className="animate-fade-in pb-12">
      <div className="section-header">
        <div>
          <h1 className="section-title">Pelacak Seserahan 🎁 <span className="text-[10px] bg-rose-gold text-white px-2 py-0.5 rounded-full ml-2 align-middle font-bold">✦ Premium</span></h1>
          <p className="section-subtitle">Daftar hantaran, progres pembelian, hingga pengemasan seserahan pernikahan</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stat-card hover:shadow-xl transition-all">
          <div className="w-12 h-12 rounded-2xl bg-rose-gold/10 flex items-center justify-center text-xl mb-4">🎁</div>
          <div className="font-playfair text-2xl font-bold text-brown">{items.length}</div>
          <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Total Hantaran</div>
        </div>
        <div className="stat-card hover:shadow-xl transition-all">
          <div className="w-12 h-12 rounded-2xl bg-rose-gold/5 flex items-center justify-center text-xl mb-4">💰</div>
          <div className="font-playfair text-2xl font-bold text-brown">{rp(totalEst)}</div>
          <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Estimasi Biaya</div>
        </div>
        <div className="stat-card hover:shadow-xl transition-all">
          <div className="w-12 h-12 rounded-2xl bg-sage/10 flex items-center justify-center text-xl mb-4">🎀</div>
          <div className="font-playfair text-2xl font-bold text-brown">{sudahKemas}</div>
          <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Siap / Dikemas</div>
        </div>
        <div className="stat-card hover:shadow-xl transition-all">
          <div className="w-12 h-12 rounded-2xl bg-[var(--ivory)] flex items-center justify-center text-xl mb-4">⏳</div>
          <div className="font-playfair text-2xl font-bold text-brown">{items.length - sudahKemas}</div>
          <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Belum Selesai</div>
        </div>
      </div>

      {/* Progress */}
      <div className="card mb-10 p-6 md:p-10 shadow-sm overflow-hidden relative">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
            <div>
              <h3 className="font-playfair text-xl font-bold text-brown">Progres Persiapan Hantaran</h3>
              <p className="text-[10px] font-bold text-brown-muted uppercase tracking-widest mt-1">Status Pengemasan & Kelengkapan</p>
            </div>
            <div className="md:text-right">
              <span className="font-playfair text-4xl font-bold text-rose-gold">{pct}%</span>
              <p className="text-[10px] font-bold text-brown-muted uppercase tracking-widest mt-1">{sudahKemas} dari {items.length} Item Selesai</p>
            </div>
          </div>
          <div className="progress-track h-5 bg-[var(--ivory)] rounded-full p-1">
            <div className="progress-fill h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
          <h2 className="font-playfair text-xl font-bold text-brown">Rincian Barang Seserahan</h2>
          <span className="text-[10px] font-bold text-brown-muted uppercase tracking-widest">{items.length} Item</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse demo-table-mobile">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="th hide-on-mobile text-center">No</th>
                <th className="th">Nama Item</th>
                <th className="th">Kategori</th>
                <th className="th">Estimasi</th>
                <th className="th">Aktual</th>
                <th className="th">Toko</th>
                <th className="th">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item.id} className="tr group transition-all hover:bg-[var(--ivory)]/5 demo-mobile-card demo-stagger-2">
                  {/* Mobile Card Header */}
                  <div className="lg:hidden demo-card-header">
                    <div className="demo-card-icon">{item.icon}</div>
                    <div className="demo-card-title">{item.nama}</div>
                  </div>

                  <td className="td hide-on-mobile text-center text-[10px] text-brown-muted font-bold" data-label="No">{String(i + 1).padStart(2, '0')}</td>
                  <td className="td demo-hide-mobile" data-label="Nama Item">
                    <div className="flex items-center gap-3 justify-end md:justify-start">
                      <div className="w-10 h-10 rounded-xl bg-[var(--ivory)]/50 flex items-center justify-center text-xl shadow-inner">{item.icon}</div>
                      <span className="font-bold text-brown group-hover:text-rose-gold transition-colors">{item.nama}</span>
                    </div>
                  </td>

                  <div className="demo-field-row lg:hidden">
                    <span className="demo-field-label">Kategori</span>
                    <span className="demo-field-value">{item.kategori}</span>
                  </div>
                  <td className="td demo-hide-mobile" data-label="Kategori">
                    <span className="bg-rose-gold/5 text-rose-gold text-[9px] font-black uppercase px-3 py-1.5 rounded-lg border border-rose-gold/10 shadow-sm">{item.kategori}</span>
                  </td>

                  <div className="demo-field-row lg:hidden">
                    <span className="demo-field-label">Estimasi</span>
                    <span className="demo-field-value">{rp(item.estimasi)}</span>
                  </div>
                  <td className="td text-[11px] font-bold text-brown-muted demo-hide-mobile" data-label="Estimasi">{rp(item.estimasi)}</td>

                  <div className="demo-field-row lg:hidden">
                    <span className="demo-field-label">Aktual</span>
                    <span className="demo-featured-value">{item.aktual ? rp(item.aktual) : '—'}</span>
                  </div>
                  <td className="td text-[11px] font-bold text-brown demo-hide-mobile" data-label="Aktual">{item.aktual ? rp(item.aktual) : <span className="text-[9px] text-brown-muted/40 italic uppercase">Menunggu...</span>}</td>

                  <div className="demo-field-row lg:hidden">
                    <span className="demo-field-label">Toko</span>
                    <span className="demo-field-value italic">{item.tempat_beli}</span>
                  </div>
                  <td className="td text-[10px] font-bold text-brown-muted italic demo-hide-mobile" data-label="Toko">{item.tempat_beli}</td>

                  <div className="demo-status-bar lg:hidden">
                    <span className={`${badgeMap[item.status]} text-[9px] font-black uppercase tracking-tighter px-4 py-1.5 rounded-lg shadow-sm`}>{labelMap[item.status]}</span>
                  </div>
                  <td className="td demo-hide-mobile" data-label="Status">
                    <span className={`${badgeMap[item.status]} text-[9px] font-black uppercase tracking-tighter px-3 py-1.5 rounded-lg shadow-sm`}>{labelMap[item.status]}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// DEMO KADO & ANGPAO TRACKER (USP — must showcase)
// ==========================================
const DemoKadoAngpao = () => {
  const rp = (n = 0) => 'Rp ' + Number(n).toLocaleString('id-ID');
  const entries = [
    { id: 1, nama: 'Pak Budi & Ibu Sari', hubungan: 'Keluarga Ayah', tipe: 'Angpao', nominal: 2000000, kado: '-', status: 'Sudah Terima Kasih', icon: '👨‍👩‍👧' },
    { id: 2, nama: 'Tante Lina', hubungan: 'Keluarga Ibu', tipe: 'Angpao', nominal: 1500000, kado: '-', status: 'Sudah Terima Kasih', icon: '👩' },
    { id: 3, nama: 'Pak Dharma (Bos)', hubungan: 'Kantor', tipe: 'Kado + Angpao', nominal: 3000000, kado: 'Set Peralatan Dapur', status: 'Belum', icon: '💼' },
    { id: 4, nama: 'Andi & Maya', hubungan: 'Teman Kuliah', tipe: 'Angpao', nominal: 500000, kado: '-', status: 'Belum', icon: '👫' },
    { id: 5, nama: 'Keluarga Sebelah', hubungan: 'Tetangga', tipe: 'Kado', nominal: 0, kado: 'Mesin Cuci Sharp', status: 'Sudah Terima Kasih', icon: '🏠' },
    { id: 6, nama: 'Geng SMA', hubungan: 'Teman SMA', tipe: 'Kado + Angpao', nominal: 2500000, kado: 'Hampers + Voucher Belanja', status: 'Belum', icon: '👯' },
    { id: 7, nama: 'Kak Reza', hubungan: 'Sepupu', tipe: 'Angpao', nominal: 1000000, kado: '-', status: 'Sudah Terima Kasih', icon: '👨' },
  ];

  const totalAngpao = entries.reduce((sum, e) => sum + e.nominal, 0);
  const totalPemberi = entries.length;
  const sudahTk = entries.filter(e => e.status === 'Sudah Terima Kasih').length;
  const belumTk = totalPemberi - sudahTk;
  const pctTk = totalPemberi > 0 ? Math.round(sudahTk / totalPemberi * 100) : 0;

  // Aggregate by hubungan for chart
  const byHubungan = entries.reduce((acc, e) => {
    acc[e.hubungan] = (acc[e.hubungan] || 0) + e.nominal;
    return acc;
  }, {});
  const hubunganLabels = Object.keys(byHubungan);
  const hubunganValues = Object.values(byHubungan);
  const COLORS = ['#C9956C', '#8BAF8B', '#D4756B', '#E8C4B8', '#9B8070', '#C9A96E'];

  const badgeMap = { 'Sudah Terima Kasih': 'bg-[#8BAF8B]/15 text-[#5C7361]', 'Belum': 'bg-[#D4756B]/10 text-[#D4756B]' };
  const labelMap = { 'Sudah Terima Kasih': '✓ Sudah TK', 'Belum': '⏰ Belum TK' };

  return (
    <div className="animate-fade-in pb-12">
      <div className="section-header">
        <div>
          <h1 className="section-title">Kado & Angpao Tracker 🎁 <span className="text-[10px] bg-rose-gold text-white px-2 py-0.5 rounded-full ml-2 align-middle font-bold">✦ Eksklusif</span></h1>
          <p className="section-subtitle">Catat semua pemberi, nominal angpao, dan kado — biar tidak ada yang lupa diucapkan terima kasih</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stat-card hover:shadow-xl transition-all">
          <div className="w-12 h-12 rounded-2xl bg-rose-gold/10 flex items-center justify-center text-xl mb-4">💰</div>
          <div className="font-playfair text-2xl font-bold text-brown">{rp(totalAngpao)}</div>
          <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Total Angpao Diterima</div>
        </div>
        <div className="stat-card hover:shadow-xl transition-all">
          <div className="w-12 h-12 rounded-2xl bg-[#C9956C20] flex items-center justify-center text-xl mb-4">👥</div>
          <div className="font-playfair text-2xl font-bold text-brown">{totalPemberi}</div>
          <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Total Pemberi</div>
        </div>
        <div className="stat-card hover:shadow-xl transition-all">
          <div className="w-12 h-12 rounded-2xl bg-sage/10 flex items-center justify-center text-xl mb-4">✓</div>
          <div className="font-playfair text-2xl font-bold text-brown">{sudahTk}</div>
          <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Sudah Diterima Kasih</div>
        </div>
        <div className="stat-card hover:shadow-xl transition-all">
          <div className="w-12 h-12 rounded-2xl bg-[#D4756B20] flex items-center justify-center text-xl mb-4">⏰</div>
          <div className="font-playfair text-2xl font-bold text-brown">{belumTk}</div>
          <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Perlu Follow Up</div>
        </div>
      </div>

      {/* Progress + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
        <div className="card lg:col-span-2 shadow-sm">
          <div className="p-6 border-b border-[var(--border)]">
            <h3 className="text-lg font-bold text-brown font-playfair">Status Ucapan Terima Kasih</h3>
            <p className="text-[10px] text-brown-muted uppercase tracking-widest mt-1">Yang sudah & belum dihubungi</p>
          </div>
          <div className="p-8 flex flex-col items-center justify-center h-[280px]">
            <div className="relative w-40 h-40">
              <Doughnut data={{
                labels: ['Sudah TK', 'Belum TK'],
                datasets: [{ data: [sudahTk, belumTk], backgroundColor: ['#8BAF8B', '#D4756B'], borderWidth: 0 }]
              }} options={{ responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { display: false } } }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-playfair text-3xl font-bold text-brown">{pctTk}%</span>
                <span className="text-[9px] text-brown-muted font-bold uppercase tracking-wider">Selesai</span>
              </div>
            </div>
            <p className="text-xs text-brown-muted mt-4 text-center">{sudahTk} dari {totalPemberi} pemberi sudah diberi ucapan terima kasih</p>
          </div>
        </div>

        <div className="card lg:col-span-3 shadow-sm">
          <div className="p-6 border-b border-[var(--border)]">
            <h2 className="font-playfair text-lg font-bold text-brown">Distribusi Angpao per Relasi</h2>
            <p className="text-[10px] text-brown-muted uppercase tracking-widest mt-1">Dari mana saja dukungan finansial datang</p>
          </div>
          <div className="p-8 h-[280px]">
            <Bar
              data={{
                labels: hubunganLabels,
                datasets: [{ label: 'Total Angpao', data: hubunganValues, backgroundColor: COLORS, borderRadius: 6, barThickness: 22 }]
              }}
              options={{
                indexAxis: 'y',
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { x: { beginAtZero: true, grid: { color: '#F0E6DF' }, ticks: { font: { size: 9 }, color: '#826A5E', callback: (v) => 'Rp ' + (v / 1000000) + 'jt' } }, y: { grid: { display: false }, ticks: { font: { size: 9 }, color: '#5C4033' } } }
              }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
          <h2 className="font-playfair text-xl font-bold text-brown">Daftar Pemberi & Pemberian</h2>
          <span className="text-[10px] font-bold text-brown-muted uppercase tracking-widest">{entries.length} Pemberi</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse demo-table-mobile">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="th hide-on-mobile text-center">No</th>
                <th className="th">Nama Pemberi</th>
                <th className="th">Hubungan</th>
                <th className="th">Tipe</th>
                <th className="th">Nominal Angpao</th>
                <th className="th">Kado</th>
                <th className="th">Status</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr key={e.id} className="tr group transition-all hover:bg-[var(--ivory)]/5 demo-mobile-card demo-stagger-4">
                  {/* Mobile Card Header */}
                  <div className="lg:hidden demo-card-header">
                    <div className="demo-card-icon">{e.icon}</div>
                    <div className="demo-card-title">{e.nama}</div>
                  </div>

                  <td className="td hide-on-mobile text-center text-[10px] text-brown-muted font-bold" data-label="No">{String(i + 1).padStart(2, '0')}</td>
                  <td className="td demo-hide-mobile" data-label="Nama Pemberi">
                    <div className="flex items-center gap-3 justify-end md:justify-start">
                      <div className="w-10 h-10 rounded-xl bg-[var(--ivory)]/50 flex items-center justify-center text-xl shadow-inner">{e.icon}</div>
                      <span className="font-bold text-brown group-hover:text-rose-gold transition-colors">{e.nama}</span>
                    </div>
                  </td>

                  <div className="demo-field-row lg:hidden">
                    <span className="demo-field-label">Hubungan</span>
                    <span className="demo-field-value italic">{e.hubungan}</span>
                  </div>
                  <td className="td text-[11px] font-bold text-brown-muted italic demo-hide-mobile" data-label="Hubungan">{e.hubungan}</td>

                  <div className="demo-field-row lg:hidden">
                    <span className="demo-field-label">Tipe</span>
                    <span className="demo-field-value">{e.tipe}</span>
                  </div>
                  <td className="td demo-hide-mobile" data-label="Tipe">
                    <span className="bg-rose-gold/5 text-rose-gold text-[9px] font-black uppercase px-3 py-1.5 rounded-lg border border-rose-gold/10 shadow-sm">{e.tipe}</span>
                  </td>

                  <div className="demo-field-row lg:hidden">
                    <span className="demo-field-label">Nominal</span>
                    <span className="demo-featured-value">{e.nominal > 0 ? rp(e.nominal) : '—'}</span>
                  </div>
                  <td className="td text-[11px] font-bold text-brown demo-hide-mobile" data-label="Nominal Angpao">{e.nominal > 0 ? rp(e.nominal) : <span className="text-[9px] text-brown-muted/40 italic">—</span>}</td>

                  <div className="demo-field-row lg:hidden">
                    <span className="demo-field-label">Kado</span>
                    <span className="demo-field-value truncate max-w-[150px]">{e.kado === '-' ? '—' : e.kado}</span>
                  </div>
                  <td className="td text-[10px] font-bold text-brown-muted demo-hide-mobile" data-label="Kado">{e.kado === '-' ? <span className="text-[9px] text-brown-muted/40 italic">—</span> : e.kado}</td>

                  <div className="demo-status-bar lg:hidden">
                    <span className={`${badgeMap[e.status]} text-[9px] font-black uppercase tracking-tighter px-4 py-1.5 rounded-lg shadow-sm`}>{labelMap[e.status]}</span>
                  </div>
                  <td className="td demo-hide-mobile" data-label="Status">
                    <span className={`${badgeMap[e.status]} text-[9px] font-black uppercase tracking-tighter px-3 py-1.5 rounded-lg shadow-sm`}>{labelMap[e.status]}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// DEMO LOCKED PLACEHOLDER (unique skeleton per menu)
// Keeps curiosity gap intact — each locked menu shows
// a different layout hint of what's inside.
// ==========================================
const DemoLockedPlaceholder = ({ menuLabel }) => {
  // Strip the ✦ marker for matching
  const key = menuLabel.replace(' ✦', '').trim();

  // Per-menu config: hint of what user would see
  const config = {
    'Guest List': {
      title: 'Daftar Tamu Undangan',
      subtitle: 'Kelola data tamu, kategori, & alamat dalam satu tempat',
      stats: [
        { icon: '👥', label: 'Total Tamu', value: '247' },
        { icon: '🏷️', label: 'Kategori', value: '8' },
        { icon: '📍', label: 'Lokasi', value: '12 Kota' },
        { icon: '✉️', label: 'Sudah Diundang', value: '189' },
      ],
      tableTitle: 'Daftar Tamu',
      tableCols: ['No', 'Nama', 'Kategori', 'Hubungan', 'Kontak', 'Status'],
      tableRows: 7,
    },
    'RSVP Tracker': {
      title: 'RSVP Tracker',
      subtitle: 'Pantau konfirmasi kehadiran tamu secara real-time',
      stats: [
        { icon: '✅', label: 'Hadir', value: '156' },
        { icon: '❌', label: 'Tidak Hadir', value: '23' },
        { icon: '⏰', label: 'Belum Konfirmasi', value: '68' },
        { icon: '📊', label: 'Response Rate', value: '72%' },
      ],
      tableTitle: 'Status Konfirmasi Tamu',
      tableCols: ['No', 'Nama Tamu', 'Tanggal Konfirmasi', 'Status', 'Jumlah Orang', 'Catatan'],
      tableRows: 6,
    },
    'Vendor Manager': {
      title: 'Vendor Manager',
      subtitle: 'Pantau DP, pelunasan, dan deadline pembayaran semua vendor',
      stats: [
        { icon: '🤝', label: 'Total Vendor', value: '14' },
        { icon: '💵', label: 'Sudah DP', value: '11' },
        { icon: '⚠️', label: 'Deadline Dekat', value: '3' },
        { icon: '✓', label: 'Lunas', value: '5' },
      ],
      tableTitle: 'Status Pembayaran Vendor',
      tableCols: ['No', 'Nama Vendor', 'Kategori', 'Total Biaya', 'Sudah Dibayar', 'Deadline', 'Status'],
      tableRows: 7,
    },
    'Timeline Acara': {
      title: 'Timeline Acara',
      subtitle: 'Susun jadwal acara dari prosesi hingga resepsi',
      stats: [
        { icon: '📅', label: 'Total Acara', value: '8' },
        { icon: '⏰', label: 'Durasi Total', value: '14 Jam' },
        { icon: '👥', label: 'Penanggung Jawab', value: '12' },
        { icon: '📍', label: 'Lokasi', value: '3' },
      ],
      tableTitle: 'Susunan Acara',
      tableCols: ['Waktu', 'Acara', 'Lokasi', 'PJ', 'Durasi', 'Catatan'],
      tableRows: 6,
    },
    'Checklist Persiapan': {
      title: 'Checklist Persiapan',
      subtitle: 'Cek list persiapan H-90 sampai hari H biar gak ada yang ketinggalan',
      stats: [
        { icon: '✅', label: 'Selesai', value: '47' },
        { icon: '🔄', label: 'Sedang Proses', value: '12' },
        { icon: '⏰', label: 'Belum', value: '23' },
        { icon: '📊', label: 'Progress', value: '57%' },
      ],
      tableTitle: 'Daftar Persiapan',
      tableCols: ['No', 'Tugas', 'Kategori', 'Deadline', 'PIC', 'Status'],
      tableRows: 7,
    },
    'Dekorasi & Tema': {
      title: 'Dekorasi & Tema',
      subtitle: 'Tentukan tema, palette warna, dan detail dekorasi',
      stats: [
        { icon: '🎨', label: 'Tema Utama', value: 'Rustic' },
        { icon: '🌸', label: 'Palette Warna', value: '5' },
        { icon: '💐', label: 'Bunga & Hias', value: '23' },
        { icon: '📸', label: 'Inspirasi', value: '47' },
      ],
      tableTitle: 'Detail Dekorasi',
      tableCols: ['No', 'Item', 'Lokasi', 'Vendor', 'Estimasi', 'Status'],
      tableRows: 6,
    },
    'Katering & Menu': {
      title: 'Katering & Menu',
      subtitle: 'Susun menu makanan, jumlah porsi, dan special diet tamu',
      stats: [
        { icon: '🍽️', label: 'Menu Item', value: '24' },
        { icon: '👥', label: 'Total Porsi', value: '500' },
        { icon: '🥗', label: 'Vegetarian', value: '15' },
        { icon: '💵', label: 'Cost / Pax', value: 'Rp 175k' },
      ],
      tableTitle: 'Daftar Menu',
      tableCols: ['No', 'Nama Menu', 'Kategori', 'Porsi', 'Harga / Pax', 'Total'],
      tableRows: 7,
    },
  };

  // Default fallback for menus we haven't customized
  const data = config[key] || {
    title: key,
    subtitle: 'Fitur premium NIKAH RAPI',
    stats: [
      { icon: '✨', label: 'Fitur', value: 'Premium' },
      { icon: '📊', label: 'Data', value: 'Real-time' },
      { icon: '☁️', label: 'Backup', value: 'Cloud' },
      { icon: '🔄', label: 'Sync', value: 'Auto' },
    ],
    tableTitle: 'Detail Data',
    tableCols: ['No', 'Item', 'Kategori', 'Status'],
    tableRows: 6,
  };

  return (
    <div className="animate-fade-in pb-12">
      <div className="section-header">
        <div>
          <h1 className="section-title">{data.title} <span className="text-[10px] bg-rose-gold text-white px-2 py-0.5 rounded-full ml-2 align-middle font-bold">✦ Premium</span></h1>
          <p className="section-subtitle">{data.subtitle}</p>
        </div>
      </div>

      {/* Stats grid with skeleton pulse */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {data.stats.map((s, i) => (
          <div key={i} className="stat-card opacity-60">
            <div className="w-12 h-12 rounded-2xl bg-rose-gold/10 flex items-center justify-center text-xl mb-4 grayscale">{s.icon}</div>
            <div className="font-playfair text-2xl font-bold text-brown/40 bg-ivory h-8 w-24 rounded animate-pulse mb-2"></div>
            <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Skeleton table card */}
      <div className="card p-0 overflow-hidden shadow-sm opacity-50 grayscale">
        <div className="p-6 border-b border-[var(--border)] flex items-center justify-between bg-ivory/20">
          <h2 className="font-playfair text-xl font-bold text-brown/50">{data.tableTitle}</h2>
          <div className="h-4 w-20 bg-ivory rounded animate-pulse"></div>
        </div>
        <div className="overflow-x-auto p-4">
           {/* Mock Table UI */}
           <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border-b border-border/50">
                   <div className="w-10 h-10 rounded-xl bg-ivory animate-pulse" />
                   <div className="flex-1 space-y-2">
                      <div className="h-3 bg-ivory rounded w-1/3 animate-pulse" />
                      <div className="h-2 bg-ivory rounded w-1/4 animate-pulse" />
                   </div>
                   <div className="w-20 h-6 bg-ivory rounded-full animate-pulse" />
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;

