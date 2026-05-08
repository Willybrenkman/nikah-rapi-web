import React from 'react';

const rp = (n = 0) => 'Rp ' + Number(n).toLocaleString('id-ID');

const budgetItems = [
  { icon: '🏢', kategori: 'Gedung & Venue', estimasi: 25000000, aktual: 25000000 },
  { icon: '🍽️', kategori: 'Katering (500 Pax)', estimasi: 45000000, aktual: 20000000 },
  { icon: '💄', kategori: 'MUA & Kebaya', estimasi: 15000000, aktual: 5000000 },
  { icon: '🌸', kategori: 'Dekorasi Pelaminan', estimasi: 10000000, aktual: 0 },
  { icon: '💌', kategori: 'Undangan Digital', estimasi: 500000, aktual: 500000 },
];

const seserahanItems = [
  { icon: '💄', nama: 'Set Makeup Premium', status: 'Sudah Beli', estimasi: 2500000 },
  { icon: '👕', nama: 'Sepatu Kerja Pria', status: 'Belum Beli', estimasi: 1200000 },
  { icon: '💍', nama: 'Perhiasan Emas 24K', status: 'Sudah Kemas', estimasi: 15000000 },
  { icon: '🕋', nama: 'Sarung & Peci Premium', status: 'Sudah Kemas', estimasi: 800000 },
  { icon: '👜', nama: 'Tas Branded', status: 'Belum Beli', estimasi: 5000000 },
  { icon: '🌸', nama: 'Parfum Set', status: 'Sudah Beli', estimasi: 1500000 },
];

const badgeStyle = {
  'Sudah Kemas': { bg: '#e8f5e9', color: '#2e7d32', label: '✨ Siap' },
  'Sudah Beli': { bg: '#e3f2fd', color: '#1565c0', label: '🛒 Dibeli' },
  'Belum Beli': { bg: '#fce4ec', color: '#c62828', label: '📦 Belum' },
};

export default function LandingDemoPreview({ navigate }) {
  const totalEst = budgetItems.reduce((a, i) => a + i.estimasi, 0);
  const totalReal = budgetItems.reduce((a, i) => a + i.aktual, 0);
  const sisa = totalEst - totalReal;
  const sudahKemas = seserahanItems.filter(i => i.status === 'Sudah Kemas').length;
  const sesPct = Math.round(sudahKemas / seserahanItems.length * 100);

  return (
    <section className="sheets-section" id="simulasi" style={{ background: 'var(--cream)' }}>
      <p className="section-eyebrow reveal">✨ Preview Langsung</p>
      <h2 className="section-title reveal">Intip Fitur <em>Andalan Kami</em></h2>

      {/* BUDGET PLANNER */}
      <div className="reveal" style={{ maxWidth: 1000, margin: '0 auto 48px' }}>
        <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(139,94,106,0.1)', boxShadow: '0 8px 32px rgba(92,61,46,0.06)' }}>
          <div style={{ padding: '20px 28px', borderBottom: '1px solid #F5F0EC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 22 }}>💰</span>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: '#2A1F1A' }}>Perencana Anggaran</div>
                <div style={{ fontSize: 11, color: '#9B8070', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>Budget Planner</div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: '#F5F0EC' }}>
            {[
              { label: 'Total Estimasi', value: rp(totalEst), icon: '📋', color: '#C9956C' },
              { label: 'Total Realisasi', value: rp(totalReal), icon: '💸', color: '#D4756B' },
              { label: 'Sisa Anggaran', value: rp(sisa), icon: '✨', color: '#8BAF8B' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'white', padding: '20px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: '#2A1F1A' }}>{s.value}</div>
                <div style={{ fontSize: 10, color: '#9B8070', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #F5F0EC' }}>
                  <th style={{ padding: '12px 16px', fontSize: 10, color: '#C9956C', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'left' }}>Kategori</th>
                  <th style={{ padding: '12px 16px', fontSize: 10, color: '#C9956C', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'right' }}>Estimasi</th>
                  <th style={{ padding: '12px 16px', fontSize: 10, color: '#C9956C', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'right' }}>Aktual</th>
                  <th style={{ padding: '12px 16px', fontSize: 10, color: '#C9956C', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center', minWidth: 120 }}>Progres</th>
                  <th style={{ padding: '12px 16px', fontSize: 10, color: '#C9956C', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {budgetItems.map((item, i) => {
                  const pct = item.estimasi > 0 ? Math.min(100, Math.round(item.aktual / item.estimasi * 100)) : 0;
                  const statusLabel = item.aktual === 0 ? 'Belum Bayar' : pct >= 100 ? 'Lunas' : 'Sebagian';
                  const statusColor = item.aktual === 0 ? '#9B8070' : pct >= 100 ? '#5C7361' : '#D4756B';
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid #F5F0EC' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 18 }}>{item.icon}</span>
                          <span style={{ fontWeight: 600, fontSize: 13, color: '#2A1F1A' }}>{item.kategori}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 11, fontWeight: 600, color: '#9B8070', textAlign: 'right' }}>{rp(item.estimasi)}</td>
                      <td style={{ padding: '14px 16px', fontSize: 11, fontWeight: 700, color: '#2A1F1A', textAlign: 'right' }}>{rp(item.aktual)}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, height: 6, background: '#F5F0EC', borderRadius: 99, overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #C9956C, #8B5E6A)', borderRadius: 99, transition: 'width 1s ease' }} />
                          </div>
                          <span style={{ fontSize: 10, fontWeight: 700, color: '#9B8070', minWidth: 28 }}>{pct}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <span style={{ fontSize: 9, fontWeight: 700, color: statusColor, background: `${statusColor}15`, padding: '4px 10px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: 0.5 }}>{statusLabel}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SESERAHAN TRACKER */}
      <div className="reveal" style={{ maxWidth: 1000, margin: '0 auto 48px' }}>
        <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(139,94,106,0.1)', boxShadow: '0 8px 32px rgba(92,61,46,0.06)' }}>
          <div style={{ padding: '20px 28px', borderBottom: '1px solid #F5F0EC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 22 }}>🎁</span>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: '#2A1F1A' }}>Pelacak Seserahan</div>
                <div style={{ fontSize: 11, color: '#9B8070', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>Seserahan Tracker <span style={{ background: '#C9956C', color: 'white', padding: '2px 8px', borderRadius: 99, fontSize: 9, marginLeft: 4 }}>✦ Eksklusif</span></div>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div style={{ padding: '24px 28px', borderBottom: '1px solid #F5F0EC', display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#2A1F1A' }}>Progres Pengemasan</span>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: '#C9956C' }}>{sesPct}%</span>
              </div>
              <div style={{ height: 10, background: '#F5F0EC', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ width: `${sesPct}%`, height: '100%', background: 'linear-gradient(90deg, #C9956C, #8B5E6A)', borderRadius: 99, transition: 'width 1s ease' }} />
              </div>
              <div style={{ fontSize: 10, color: '#9B8070', marginTop: 6, fontWeight: 600 }}>{sudahKemas} dari {seserahanItems.length} item siap dikemas</div>
            </div>
          </div>

          {/* Items */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #F5F0EC' }}>
                  <th style={{ padding: '12px 16px', fontSize: 10, color: '#C9956C', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'left' }}>Item</th>
                  <th style={{ padding: '12px 16px', fontSize: 10, color: '#C9956C', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'right' }}>Estimasi</th>
                  <th style={{ padding: '12px 16px', fontSize: 10, color: '#C9956C', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {seserahanItems.map((item, i) => {
                  const b = badgeStyle[item.status];
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid #F5F0EC' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 18 }}>{item.icon}</span>
                          <span style={{ fontWeight: 600, fontSize: 13, color: '#2A1F1A' }}>{item.nama}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 11, fontWeight: 600, color: '#9B8070', textAlign: 'right' }}>{rp(item.estimasi)}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <span style={{ fontSize: 9, fontWeight: 700, color: b.color, background: b.bg, padding: '4px 10px', borderRadius: 99, textTransform: 'uppercase' }}>{b.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center' }} className="reveal">
        <button onClick={() => navigate('/demo')} className="btn-secondary" style={{ background: 'var(--mauve)', color: 'white', border: 'none' }}>
          👁️ Coba Simulasi Lengkap →
        </button>
      </div>
    </section>
  );
}
