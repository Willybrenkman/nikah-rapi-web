import React, { useState, useEffect } from 'react';
import LandingNav from '../../components/landing/LandingNav';
import './LandingMain.css';
import './LandingPria.css';

const LandingPria = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

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

  const navLinks = [
    { label: 'Masalah Pria', href: '#masalah' },
    { label: 'Fitur', href: '#fitur' },
    { label: 'Harga', href: '#pricing' },
    { label: 'FAQ', href: '#faq' }
  ];

  return (
    <div className="landing-container pt-[70px]">
      <LandingNav links={navLinks} />

      <section className="hero">
        <div className="badge">Efisiensi & Presisi</div>
        <p className="hero-eyebrow">Solusi cerdas calon suami modern</p>
        <h1 className="hero-title">
          Nikah Tanpa Boncos & <em>Stress Budget Berantakan.</em> Kontrol Semua Dalam Genggaman
        </h1>
        <p className="hero-hook">
          "Sebagai calon suami, Anda ingin memastikan semua biaya terukur dan persiapan berjalan lancar tanpa ada kejutan buruk di hari H. NIKAH RAPI adalah asisten digital pribadimu untuk kontrol total."
        </p>
        
        <div className="product-showcase">
          <div className="browser-frame">
            <div className="browser-bar">
              <div className="browser-dots"><div className="browser-dot" style={{background:'#ff5f57'}}></div><div className="browser-dot" style={{background:'#febc2e'}}></div><div className="browser-dot" style={{background:'#28c840'}}></div></div>
              <div className="browser-url">nikahrapi.online/budget-planner</div>
            </div>
            
            <div className="preview-stage on">
              <img src="/landing-assets/budget.png" alt="Budget Planner" />
            </div>
          </div>
        </div>

        <div className="hero-cta-block" id="harga">
          <div className="price-display">
            <div className="price-new"><sup style={{fontSize:'22px'}}>Rp</sup>99.000</div>
            <div className="price-old"><s>Rp 299.000</s></div>
          </div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '20px' }}>
            <a href={checkoutUrl} className="btn-primary">💍 Dapatkan Harga Early Bird</a>
            <button 
              onClick={() => window.location.href = '/demo'}
              className="btn-secondary"
            >
              📊 Coba Simulasi
            </button>
          </div>
          <p className="cta-notes">✓ Lisensi seumur hidup ✓ Update gratis ✓ Akses instan</p>
        </div>
      </section>

      {/* Drama Section (Pria Version) */}
      <section className="drama-section" id="masalah">
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

      {/* ══ SOLUTION ══ */}
      <section className="solution-section" id="fitur">
        <div className="solution-inner">
          <div className="solution-left">
            <p className="section-eyebrow reveal">Solusi yang calon suami butuhkan</p>
            <h2 className="section-title reveal">Satu platform.<br />Ambil alih kendali<br />tanpa repot.</h2>
            <p className="reveal">
              NIKAH RAPI dirancang khusus untuk mengontrol 22+ aspek pernikahan secara terpusat. 
              Sebagai pengambil keputusan, kamu bisa memantau budget, DP vendor, dan persentase progress langsung dari HP.
            </p>
            <a href="#pricing" className="btn-secondary reveal">Lihat Harga & Paket →</a>
          </div>
          <div className="feature-cards">
            {[
              { icon: '💍', title: 'Seserahan Tracker', tag: 'Eksklusif', desc: 'Catat barang apa saja yang sudah dibeli dan berapa sisa budgetnya. Auto-hitung total.' },
              { icon: '🎁', title: 'Kado & Angpao Tracker', tag: 'Eksklusif', desc: 'Rekap siapa beri apa, nominal angpao. Pencatatan terpusat mencegah kehilangan data.' },
              { icon: '💰', title: 'Budget Planner Otomatis', desc: 'Rencana vs realisasi terupdate real-time. Tahu persis mana yang mulai overbudget.' },
              { icon: '🏢', title: 'Vendor Manager Lengkap', desc: 'Pantau histori cicilan DP dan deadline pelunasan vendor di satu tempat aman.' }
            ].map((feat, i) => (
              <div key={i} className="feat-card reveal">
                <div className="feat-icon">{feat.icon}</div>
                <div className="feat-text">
                  <h4>{feat.title} {feat.tag && <span className="usp-tag">{feat.tag}</span>}</h4>
                  <p>{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ DIFF ══ */}
      <section className="diff-section">
        <p className="section-eyebrow reveal">Kenapa NIKAH RAPI?</p>
        <h2 className="section-title reveal">Alat cerdas untuk<br /><em>Pria yang Sistematis</em></h2>
        <div className="diff-table-wrap reveal">
          <table className="diff-table">
            <thead>
              <tr>
                <th>Fitur</th>
                <th>Wedding Planner Biasa</th>
                <th>NIKAH RAPI ✦</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Seserahan Tracker', false, true],
                ['Kado & Angpao Tracker', false, true],
                ['Budget real-time otomatis', false, true],
                ['Dashboard visual progress', false, true],
                ['Disesuaikan adat Indonesia', false, true],
                ['22+ modul terintegrasi', false, true],
                ['Akses PWA & Offline Support', false, true],
                ['Export & Import Data', false, true],
                ['Honeymoon Planner', false, true]
              ].map((row, i) => (
                <tr key={i}>
                  <td>{row[0]}</td>
                  <td style={{ textAlign: 'center' }}>{row[1] ? '✓' : '✕'}</td>
                  <td style={{ textAlign: 'center' }}>{row[2] ? '✓' : '✕'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ══ PRICING ══ */}
      <section className="pricing-section" id="pricing">
        <p className="section-eyebrow reveal">Investasi terkecil untuk efisiensi budget jutaan rupiah</p>
        <h2 className="section-title reveal">Dapatkan Akses Sekarang</h2>
        <div className="pricing-card reveal">
          <div className="pricing-card-badge">✦ Akses Premium Seumur Hidup</div>
          <div className="price-hero">
            <div className="price-big"><sup>Rp</sup>99.000</div>
          </div>
          <div className="price-was-p"><s>Rp 299.000</s></div>
          <div className="price-save-badge">🔥 Hemat 63% — Harga Promo Terbatas!</div>
          <ul className="include-list">
            <li>Aplikasi Web NIKAH RAPI — 22+ modul lengkap & terintegrasi</li>
            <li>Seserahan Tracker eksklusif — tidak ada di produk lain!</li>
            <li>Kado & Angpao Tracker eksklusif — pencatatan rapi</li>
            <li>Dashboard otomatis update & tracking pelunasan vendor</li>
            <li>Update akses gratis seumur hidup</li>
            <li>Akses multi-device (Bisa dibuka di HP kamu & pasangan)</li>
          </ul>
          <a href={checkoutUrl} className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '15px', padding: '22px' }}>
            💍 Amankan Promo Sekarang — Rp 99.000
          </a>
          <p className="urgency-note">⏰ Harga segera naik ke Rp 299.000 · Garansi 7 hari · Akses langsung via WA</p>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section className="faq-section" id="faq">
        <p className="section-eyebrow reveal">Pertanyaan yang sering ditanya</p>
        <h2 className="section-title reveal">FAQ</h2>
        <div className="faq-inner">
          {[
            { q: 'Apakah aman dari kehilangan data?', a: 'Sangat aman. Semua data tersimpan di Cloud otomatis, tidak seperti Excel yang bisa corrupt atau hilang file-nya.' },
            { q: 'Bisa dibuka di HP?', a: 'Bisa! Bahkan kamu dan pasangan bisa buka aplikasinya di HP masing-masing dan datanya akan tersinkronisasi.' },
            { q: 'Sekali bayar atau berlangganan?', a: 'Sekali bayar untuk akses seumur hidup. Tidak ada biaya bulanan lagi.' },
            { q: 'Ada garansi uang kembali?', a: 'Ada garansi 7 hari. Jika merasa tidak berguna untuk mengontrol persiapan pernikahanmu, kami kembalikan 100%.' }
          ].map((item, i) => (
            <div key={i} className={`faq-item reveal ${openFaq === i ? 'open' : ''}`} onClick={() => toggleFaq(i)}>
              <div className="faq-q">{item.q} <span className="faq-arrow">{openFaq === i ? '−' : '+'}</span></div>
              <div className="faq-a">{item.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      <section className="final-cta">
        <p className="section-eyebrow reveal">Ambil Kendali Sekarang</p>
        <h2 className="section-title reveal">Bantu pasanganmu wujudkan pernikahan<br />dengan lebih <em style={{ color: '#E8D5B0' }}>terkontrol & efisien</em></h2>
        <p className="reveal">Kurangi drama, tekan pengeluaran tak terduga, dan pastikan hari bahagiamu berjalan sesuai rencana.</p>
        <a href={checkoutUrl} className="btn-secondary reveal" style={{ margin: '0 auto' }}>
          💍 Dapatkan NIKAH RAPI Sekarang
        </a>
      </section>

      <footer style={{ background: '#2C2218', padding: '40px 80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', letterSpacing: '2px' }}>NIKAH RAPI ✦</div>
        <div style={{ fontSize: '12px', opacity: 0.4 }}>© 2025 NIKAH RAPI · Untuk Pria Terencana Indonesia</div>
      </footer>
    </div>
  );
};

export default LandingPria;
