import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingNav from '../../components/landing/LandingNav';
import LandingDemoPreview from '../../components/landing/LandingDemoPreview';
import SEO from '../../components/SEO';
import './LandingMain.css';
import './LandingIbu.css';

const LandingIbu = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [showSticky, setShowSticky] = useState(false);

  const toggleFaq = (index) => setOpenFaq(openFaq === index ? null : index);
  const checkoutUrl = "https://checkout.nikahrapi.online/";

  useEffect(() => {
    if (window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_name: 'Nikah Rapi Ibu Package',
        content_category: 'Wedding Planner',
        value: 99000,
        currency: 'IDR'
      });
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowSticky(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });
    const els = document.querySelectorAll('.reveal');
    els.forEach(el => observer.observe(el));
    return () => els.forEach(el => observer.unobserve(el));
  }, []);

  const navLinks = [
    { label: 'Kekhawatiran Ibu', href: '#masalah' },
    { label: 'Fitur', href: '#fitur' },
    { label: 'Harga', href: '#pricing' },
    { label: 'FAQ', href: '#faq' }
  ];

  return (
    <div className="landing-container" style={{ paddingTop: '70px' }}>
      <SEO
        title="Hadiah Pernikahan Terbaik dari Ibu | NIKAH RAPI — Wedding Planner Digital"
        description="Bantu anak Ibu menikah tanpa drama. Pantau persiapan nikah dari HP: seserahan, budget, vendor, semua tercatat rapi. Hadiah paling bermanfaat untuk calon pengantin. Rp 99.000."
        path="/untuk-ibu"
        keywords="hadiah pernikahan anak, ibu calon pengantin, persiapan nikah anak, seserahan pernikahan, wedding planner untuk orang tua, koordinasi nikah jarak jauh"
      />
      <LandingNav links={navLinks} />
      <main className="landing-page">

      {/* ══ HERO ══ */}
      <section className="hero">
        <div className="badge">✦ Hadiah Pernikahan Paling Bermanfaat dari Ibu</div>
        <p className="hero-eyebrow">Untuk Ibu yang ingin anak menikah dengan tenang, bukan kelelahan</p>
        <h1 className="hero-title">
          Bantu Anak Ibu Menikah <em>Tanpa Drama</em><br />— Tanpa Ibu Harus Ikut Kelelahan
        </h1>
        <p className="hero-hook">
          "Ibu sudah kasih banyak hal sepanjang hidup anak. Sekarang kasih satu lagi:<br />
          ketenangan saat dia siapkan hari paling penting dalam hidupnya. Cukup 1 web app, semua persiapan rapi terkontrol."
        </p>
        <p className="hero-title-sub">
          Bisa diakses Ibu dari rumah · Anak yang isi data · Ibu bisa pantau dari HP
        </p>
        
        <div className="product-showcase">
          <div className="showcase-glow"></div>
          <div className="float-badge float-badge-top">
            <div className="fb-icon" style={{ background: '#FFF0EC' }}>🎁</div>
            <div>
              <div className="fb-label">Kado & Angpao Tracker</div>
              <div className="fb-val">Rp 48.500.000 tercatat ✓</div>
            </div>
          </div>
          <div className="float-badge float-badge-bot">
            <div className="fb-icon" style={{ background: '#F0F4F0' }}>💍</div>
            <div>
              <div className="fb-label">Seserahan Tracker</div>
              <div className="fb-val">12/15 item siap ✓</div>
            </div>
          </div>
          <div className="browser-frame">
            <div className="browser-bar">
              <div className="browser-dots"><div className="browser-dot" style={{background:'#ff5f57'}}></div><div className="browser-dot" style={{background:'#febc2e'}}></div><div className="browser-dot" style={{background:'#28c840'}}></div></div>
              <div className="browser-url">nikahrapi.online/dashboard</div>
            </div>
            <div className="preview-stage on">
              <picture>
                <source srcSet="/landing-assets/dashboard.webp" type="image/webp" />
                <img src="/landing-assets/dashboard-opt.png" alt="Dashboard" width="665" height="346" fetchPriority="high" loading="eager" decoding="sync" style={{ width: '100%', height: 'auto' }} />
              </picture>
            </div>
          </div>
        </div>

        <div className="hero-cta-block">
          <div className="price-display">
            <div className="price-new"><sup style={{fontSize:'22px'}}>Rp</sup>99.000</div>
            <div className="price-old"><s>Rp 199.000</s></div>
            <div className="price-save">HEMAT 50%</div>
          </div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '20px' }}>
            <a
              href={checkoutUrl}
              className="btn-primary"
              onClick={() => {
                if (window.fbq) {
                  window.fbq('track', 'InitiateCheckout', { value: 99000, currency: 'IDR' });
                }
              }}
            >
              💝 Hadiahkan untuk Anak Ibu →
            </a>
            <button onClick={() => navigate('/demo')} className="btn-secondary">
              👁️ Lihat Tampilan App
            </button>
          </div>
          <div className="cta-notes">
            <div className="cta-note-item">✓ Akses Ibu & anak sekaligus</div>
            <div className="cta-note-item">✓ Sederhana, tidak ribet</div>
            <div className="cta-note-item">✓ Garansi 7 hari</div>
          </div>
          <div className="social-proof-bar">
            👩 127+ ibu sudah hadiahkan untuk anaknya
          </div>
        </div>
      </section>

      {/* ══ DRAMA (IBU VERSION) ══ */}
      <section className="drama-section" id="masalah">
        <p className="section-eyebrow reveal">Kekhawatiran yang Ibu rasakan...</p>
        <h2 className="section-title reveal">Jangan Biarkan Persiapan Nikah<br/><em>Bikin Ibu Stress & Kelelahan</em></h2>
        <div className="drama-grid">
          {[
            { icon: '😰', title: 'Takut Ada Yang Terlewat', desc: 'Daftar undangan, katering, sampai kain seragam keluarga. Terlalu banyak detail yang bikin Ibu susah tidur.', scenario: '"Aduh, kain seragam keluarganya udah dipesan belum ya? Siapa yang ngurusin?"' },
            { icon: '💰', title: 'Anggaran Tidak Terkontrol', desc: 'Pengeluaran tak terduga yang bikin kaget di akhir. Ibu ingin semua transparan dan terencana sejak awal.', scenario: '"Kok budget-nya tiba-tiba bengkak? Kemarin katanya cukup..."' },
            { icon: '📋', title: 'Koordinasi Jarak Jauh', desc: 'Anak di kota lain, Ibu di kampung. Susah memantau sudah sampai mana persiapan. Ingin semua bisa dilihat dari HP.', scenario: '"Nak, seserahan-nya udah lengkap belum? Ibu khawatir ada yang kurang."' }
          ].map((item, i) => (
            <div key={i} className="drama-card reveal">
              <span className="drama-icon">{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <div className="drama-scenario">{item.scenario}</div>
            </div>
          ))}
        </div>
        <p className="drama-closer reveal">"Ibu berhak menikmati momen bahagia — bukan dihantui kekhawatiran yang tak berujung."</p>
      </section>

      {/* ══ SOLUTION ══ */}
      <section className="solution-section" id="fitur">
        <div className="solution-inner">
          <div className="solution-left">
            <p className="section-eyebrow reveal" style={{ color: 'var(--blush)' }}>Solusi yang Ibu butuhkan</p>
            <h2 className="section-title reveal">Satu platform.<br />Semua kekhawatiran<br />bisa teratasi.</h2>
            <p className="reveal">
              NIKAH RAPI dirancang khusus untuk keluarga calon pengantin Indonesia — 22+ modul Web App terintegrasi. 
              Ibu bisa ikut memantau progress persiapan nikah dari HP Ibu, tanpa harus repot bertanya berulang kali.
            </p>
            <a href="#pricing" className="btn-secondary reveal" style={{ background: 'white', color: 'var(--mauve)', border: 'none' }}>Lihat Harga & Paket →</a>
          </div>
          <div className="feature-cards">
            {[
              { icon: '💍', title: 'Seserahan Tracker', tag: 'Eksklusif', desc: 'Catat semua item seserahan, harga, dan status pembelian. Ibu bisa pantau langsung dari HP.' },
              { icon: '🎁', title: 'Kado & Angpao Tracker', tag: 'Eksklusif', desc: 'Rekap siapa beri apa, nominal angpao, status ucapan terima kasih. Tidak ada yang terlewat.' },
              { icon: '💰', title: 'Budget Planner Otomatis', desc: 'Transparan dan real-time. Ibu bisa tahu persis total pengeluaran vs rencana awal.' },
              { icon: '🏢', title: 'Vendor Manager Lengkap', desc: 'Semua kontak, kontrak, dan status pembayaran vendor — terpusat di satu tempat aman.' }
            ].map((feat, i) => (
              <div key={i} className="feat-card reveal">
                <div className="feat-icon">{feat.icon}</div>
                <div className="feat-text">
                  <h3>{feat.title} {feat.tag && <span className="usp-tag">{feat.tag}</span>}</h3>
                  <p>{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ DEMO PREVIEW ══ */}
      <LandingDemoPreview navigate={navigate} />

      {/* ══ DIFF ══ */}
      <section className="diff-section">
        <p className="section-eyebrow reveal">Kenapa NIKAH RAPI?</p>
        <h2 className="section-title reveal">Beda dari yang lain —<br /><em>Dibuat untuk Pernikahan Indonesia</em></h2>
        <div className="diff-table-wrap reveal">
          <table className="diff-table">
            <thead><tr><th>Fitur</th><th>Wedding Planner Biasa</th><th>NIKAH RAPI ✦</th></tr></thead>
            <tbody>
              {[
                ['Seserahan Tracker', false, true],
                ['Kado & Angpao Tracker', false, true],
                ['Budget real-time otomatis', false, true],
                ['Dashboard visual progress', false, true],
                ['Disesuaikan adat Indonesia', false, true],
                ['22+ modul terintegrasi', false, true],
                ['Akses multi-device keluarga', false, true],
                ['Export & Import Data', false, true],
                ['Honeymoon Planner', false, true]
              ].map((row, i) => (
                <tr key={i}><td>{row[0]}</td><td style={{textAlign:'center'}}>{row[1]?'✓':'✕'}</td><td style={{textAlign:'center'}}>{row[2]?'✓':'✕'}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ══ TESTIMONI IBU ══ */}
      <section className="testi-section">
        <p className="section-eyebrow reveal">Dari Ibu-Ibu Calon Besan</p>
        <h2 className="section-title reveal">Ibu Lain Sudah <em>Merasakan Manfaatnya</em></h2>
        <div className="testi-photo-grid">
          {[
            { emoji: '👩', bg: 'linear-gradient(135deg,#C9A96E,#8B5E6A)', city: 'Surabaya', text: '"Anak saya kerja di Jakarta, saya di Surabaya. Sejak pakai NIKAH RAPI, semua list seserahan dan keperluan akad bisa saya pantau dari rumah. Tinggal bagi tugas, semua tercatat rapi."', name: 'Bunda Sri W.', role: 'Ibu Calon Pengantin · Okt 2025' },
            { emoji: '🌸', bg: 'linear-gradient(135deg,#E8C4B8,#C4857A)', city: 'Yogyakarta', text: '"Saya senang sekali ada aplikasi ini. Budget pernikahan anak saya jadi terkontrol, dan saya bisa bantu awasi tanpa harus ikut campur berlebihan. Terima kasih NIKAH RAPI!"', name: 'Ibu Siti H.', role: 'Ibu Calon Pengantin · Des 2025' },
            { emoji: '💐', bg: 'linear-gradient(135deg,#8B5E6A,#C9A96E)', city: 'Bekasi', text: '"Awalnya skeptis, tapi ternyata gampang banget dipakainya. Sekarang saya dan anak saya bisa koordinasi persiapan nikah tanpa harus telpon-telponan tiap malam."', name: 'Mama Linda', role: 'Ibu Calon Pengantin · Agu 2025' }
          ].map((t, i) => (
            <div key={i} className="testi-photo-card reveal">
              <div style={{ height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <div style={{ width: 88, height: 88, borderRadius: '50%', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 42, boxShadow: '0 8px 24px rgba(92,61,46,0.15)' }}>{t.emoji}</div>
                <div className="testi-photo-badge">📍 {t.city}</div>
              </div>
              <div className="testi-photo-content">
                <div style={{ color: 'var(--gold)', marginBottom: 8, fontSize: 14 }}>★★★★★</div>
                <p className="testi-photo-text">{t.text}</p>
                <div>
                  <div className="testi-photo-name">{t.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-light)', marginBottom: 6 }}>{t.role}</div>
                  <div className="testi-photo-verified">✓ Verified Purchase</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ PRICING ══ */}
      <section className="pricing-section" id="pricing">
        <p className="section-eyebrow reveal">Hadiah terbaik untuk ketenangan anak Ibu</p>
        <h2 className="section-title reveal">Berikan NIKAH RAPI Sekarang</h2>
        <div className="pricing-card reveal">
          <div className="pricing-card-badge">✦ Akses Premium Seumur Hidup</div>
          <div className="price-hero"><div className="price-big"><sup>Rp</sup>99.000</div></div>
          <div className="price-was-p"><s>Rp 199.000</s></div>
          <div className="price-save-badge">🔥 Hemat 50% — Harga Promo Terbatas!</div>
          <ul className="include-list">
            <li>Aplikasi Web NIKAH RAPI — 22+ modul lengkap & terintegrasi</li>
            <li>Seserahan Tracker eksklusif — pantau dari HP Ibu!</li>
            <li>Kado & Angpao Tracker — follow up terima kasih mudah</li>
            <li>Dashboard otomatis update — lihat progress anak kapan saja</li>
            <li>Update akses gratis seumur hidup</li>
            <li>Akses multi-device (HP Ibu & HP Anak bisa bareng)</li>
          </ul>
          <a 
            href={checkoutUrl} 
            className="btn-primary" 
            style={{ width: '100%', justifyContent: 'center', fontSize: '15px', padding: '22px' }}
            onClick={() => {
              if (window.fbq) {
                window.fbq('track', 'InitiateCheckout', { value: 99000, currency: 'IDR' });
              }
            }}
          >
            💍 Hadiahkan Sekarang — Rp 99.000
          </a>
          <p className="urgency-note">⏰ Harga naik ke Rp 199.000 setelah 10 slot terjual · Sisa X slot · Garansi 7 hari</p>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section className="faq-section" id="faq">
        <p className="section-eyebrow reveal">Pertanyaan yang sering ditanya</p>
        <h2 className="section-title reveal">FAQ</h2>
        <div className="faq-inner">
          {[
            { q: 'Saya gaptek, bisa pakai tidak?', a: 'Tidak perlu jago teknologi! NIKAH RAPI dirancang agar tinggal isi data — semua kalkulasi dan dashboard berjalan otomatis. Kalau Ibu bisa pakai WhatsApp, Ibu sudah bisa pakai ini.' },
            { q: 'Anak saya juga bisa akses?', a: 'Bisa! Ibu dan anak bisa buka aplikasinya di HP masing-masing dan datanya akan tersinkronisasi otomatis.' },
            { q: 'Sekali bayar atau berlangganan?', a: 'Sekali bayar untuk akses seumur hidup. Tidak ada biaya bulanan.' },
            { q: 'Ada garansi uang kembali?', a: 'Ada garansi 7 hari. Jika merasa tidak sesuai, kami kembalikan 100% tanpa pertanyaan.' }
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
        <p className="section-eyebrow reveal" style={{ color: 'var(--blush)' }}>Sudah siap, Bu?</p>
        <h2 className="section-title reveal" style={{ color: 'white' }}>Bantu wujudkan pernikahan anak Ibu<br />dengan lebih <em style={{ color: '#E8D5B0' }}>tenang & rapi</em></h2>
        <p className="reveal">Ratusan detail pernikahan dalam satu platform. Supaya hari terbaik mereka benar-benar terasa seperti hari terbaik.</p>
        <a href={checkoutUrl} className="btn-secondary reveal" style={{ margin: '0 auto', background: 'white', color: 'var(--mauve)', border: 'none' }}>
          💍 Hadiahkan NIKAH RAPI Untuk Anak Ibu
        </a>
      </section>
      
      </main>

      {showSticky && (
        <a
          href={checkoutUrl}
          className="sticky-bottom-bar"
          onClick={() => {
            if (window.fbq) window.fbq('track', 'InitiateCheckout', { value: 99000, currency: 'IDR' });
          }}
        >
          💍 Hadiahkan Sekarang — Rp 99.000
        </a>
      )}

      <footer style={{ background: '#2C2218', padding: '40px 80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', letterSpacing: '2px' }}>NIKAH RAPI ✦</div>
        <div style={{ fontSize: '12px', opacity: 0.7 }}>© 2025 NIKAH RAPI · Untuk Ibu & Keluarga Indonesia 🤍</div>
      </footer>
    </div>
  );
};

export default LandingIbu;
