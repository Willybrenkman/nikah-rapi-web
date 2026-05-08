import React, { useState, useEffect } from 'react';
import './LandingIbu.css';

const LandingIbu = () => {
  const [activeTab, setActiveTab] = useState('p-dash');
  const [openFaq, setOpenFaq] = useState(null);

  const checkoutUrl = "https://entrepreneurai.myscalev.com/checkout-page";

  useEffect(() => {
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));
    return () => revealElements.forEach(el => observer.unobserve(el));
  }, []);

  const tabs = [
    { id: 'p-dash', label: '🏠 Dashboard', img: 'dashboard.png' },
    { id: 'p-ses', label: '💍 Seserahan', img: 'seserahan.png' },
    { id: 'p-budget', label: '💰 Budget', img: 'budget.png' },
    { id: 'p-vendor', label: '🏢 Vendor', img: 'vendor.png' },
  ];

  return (
    <div className="landing-container">
      <a href={checkoutUrl} className="sticky-cta show">💍 Amankan Slot Untuk Anak Ibu</a>

      <section className="hero">
        <div className="badge">Pilihan Ibu Bijak</div>
        <p className="hero-eyebrow">Hadiah terbaik untuk pernikahan anak Ibu</p>
        <h1 className="hero-title">
          Pastikan Pernikahan <em>Anak Ibu Sempurna</em> & Tanpa Drama Yang Menyakitkan
        </h1>
        <p className="hero-hook">
          "Ibu ingin yang terbaik untuk hari besar anak Ibu. Biarkan NIKAH RAPI membantu Ibu mengontrol setiap detail, agar Ibu bisa fokus menikmati momen bahagia tanpa pusing urusan teknis."
        </p>
        
        <div className="preview-tabs">
          {tabs.map(tab => (
            <button key={tab.id} className={`ptab ${activeTab === tab.id ? 'on' : ''}`} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
          ))}
        </div>

        <div className="product-showcase">
          <div className="browser-frame">
            <div className="browser-bar">
              <div className="browser-dots"><div className="browser-dot" style={{background:'#ff5f57'}}></div><div className="browser-dot" style={{background:'#febc2e'}}></div><div className="browser-dot" style={{background:'#28c840'}}></div></div>
              <div className="browser-url">nikahrapi.online/dashboard</div>
            </div>
            {tabs.map(tab => (
              <div key={tab.id} className={`preview-stage ${activeTab === tab.id ? 'on' : ''}`}>
                <img src={`/landing-assets/${tab.img}`} alt={tab.label} />
              </div>
            ))}
          </div>
        </div>

        <div className="hero-cta-block">
          <div className="price-display">
            <div className="price-new"><sup style={{fontSize:'22px'}}>Rp</sup>99.000</div>
            <div className="price-old"><s>Rp 299.000</s></div>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '20px' }}>
            <a href={checkoutUrl} className="btn-primary">💍 Dapatkan Akses Sekarang</a>
            <button 
              onClick={() => window.location.href = '/demo'}
              className="btn-secondary"
              style={{ background: 'rgba(139, 94, 106, 0.1)', border: '1px solid var(--mauve)', color: 'var(--mauve)', padding: '16px 30px', cursor: 'pointer' }}
            >
              👁️ Coba Simulasi
            </button>
          </div>
          <p className="cta-notes">✓ Bisa diakses Ibu & Anak ✓ Data aman ✓ Langsung pakai</p>
        </div>
      </section>

      {/* Drama Section (Ibu Version) */}
      <section className="drama-section">
        <h2 className="section-title reveal">Jangan Biarkan Persiapan Nikah<br/><em>Bikin Ibu Stress & Kelelahan</em></h2>
        <div className="drama-grid">
          <div className="drama-card reveal">
            <h3>😰 Takut Ada Yang Terlewat</h3>
            <p>Daftar undangan, katering, sampai kain seragam keluarga. Terlalu banyak detail yang bikin Ibu susah tidur.</p>
          </div>
          <div className="drama-card reveal">
            <h3>💰 Anggaran Tidak Terkontrol</h3>
            <p>Pengeluaran tak terduga yang bikin kaget di akhir. Ibu ingin semua transparan dan terencana.</p>
          </div>
          <div className="drama-card reveal">
            <h3>📋 Koordinasi Yang Sulit</h3>
            <p>Susah memantau sudah sampai mana persiapan anak Ibu. Ingin semua bisa dilihat dalam satu layar HP.</p>
          </div>
        </div>
      </section>

      <footer style={{ background: '#2C2218', padding: '40px 80px', textAlign: 'center', color: 'white' }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', letterSpacing: '2px' }}>NIKAH RAPI ✦</div>
        <p style={{ fontSize: '12px', opacity: 0.4, marginTop: '10px' }}>© 2025 NIKAH RAPI · Untuk Ibu & Keluarga Indonesia</p>
      </footer>
    </div>
  );
};

export default LandingIbu;
