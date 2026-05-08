import React, { useState, useEffect } from 'react';
import './LandingPria.css';

const LandingPria = () => {
  const [activeTab, setActiveTab] = useState('p-budget');
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
    { id: 'p-budget', label: '💰 Budget Planner', img: 'budget.png' },
    { id: 'p-vendor', label: '🏢 Vendor Manager', img: 'vendor.png' },
    { id: 'p-dash', label: '🏠 Dashboard', img: 'dashboard.png' },
    { id: 'p-guest', label: '👥 Guest List', img: 'guestlist.png' },
  ];

  return (
    <div className="landing-container">
      <a href={checkoutUrl} className="sticky-cta show">💍 Amankan Budget Pernikahanmu</a>

      <section className="hero">
        <div className="badge">Efisiensi & Presisi</div>
        <p className="hero-eyebrow">Solusi cerdas calon suami modern</p>
        <h1 className="hero-title">
          Nikah Tanpa Boncos & <em>Stress Budget Berantakan.</em> Kontrol Semua Dalam Genggaman
        </h1>
        <p className="hero-hook">
          "Sebagai calon suami, Anda ingin memastikan semua biaya terukur dan persiapan berjalan lancar tanpa ada kejutan buruk di hari H. NIKAH RAPI adalah asisten digital pribadimu untuk kontrol total."
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
              <div className="browser-url">nikahrapi.online/budget-planner</div>
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
            <a href={checkoutUrl} className="btn-primary">💍 Dapatkan Harga Early Bird</a>
            <button 
              onClick={() => window.location.href = '/demo'}
              className="btn-secondary"
              style={{ background: 'rgba(139, 94, 106, 0.1)', border: '1px solid var(--mauve)', color: 'var(--mauve)', padding: '16px 30px', cursor: 'pointer' }}
            >
              📊 Coba Simulasi
            </button>
          </div>
          <p className="cta-notes">✓ Lisensi seumur hidup ✓ Update gratis ✓ Akses instan</p>
        </div>
      </section>

      {/* Drama Section (Pria Version) */}
      <section className="drama-section">
        <h2 className="section-title reveal">Jangan Sampai Dana Nikah<br/><em>Menguap Tanpa Jejak</em></h2>
        <div className="drama-grid">
          <div className="drama-card reveal">
            <h3>💸 Budget Bocor Halus</h3>
            <p>Pengeluaran kecil yang tidak tercatat tahu-tahu bikin tabungan minus. Kamu butuh tracking yang presisi.</p>
          </div>
          <div className="drama-card reveal">
            <h3>🤯 Koordinasi Vendor Rumit</h3>
            <p>Capek tanya 'ini sudah lunas belum?' ke pasangan. Semua status pembayaran vendor ada di sini.</p>
          </div>
          <div className="drama-card reveal">
            <h3>📊 Gak Tahu Progress</h3>
            <p>Persiapan sudah berapa persen? Apa yang urgent? Dashboard kami memberi gambaran visual instan.</p>
          </div>
        </div>
      </section>

      <footer style={{ background: '#2C2218', padding: '40px 80px', textAlign: 'center', color: 'white' }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', letterSpacing: '2px' }}>NIKAH RAPI ✦</div>
        <p style={{ fontSize: '12px', opacity: 0.4, marginTop: '10px' }}>© 2025 NIKAH RAPI · Platform Wedding Planner No. 1 di Indonesia</p>
      </footer>
    </div>
  );
};

export default LandingPria;
