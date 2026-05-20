import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingNav from '../../components/landing/LandingNav';
import SEO from '../../components/SEO';

const LandingDemoPreview = React.lazy(() => import('../../components/landing/LandingDemoPreview'));
import './LandingMain.css';
import './LandingKarir.css';

const LandingKarir = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [showSticky, setShowSticky] = useState(false);

  const toggleFaq = (index) => setOpenFaq(openFaq === index ? null : index);
  const checkoutUrl = "https://checkout.nikahrapi.online/";

  useEffect(() => {
    if (window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_name: 'Nikah Rapi Karir Package',
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
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    const els = document.querySelectorAll('.reveal');
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const navLinks = [
    { label: 'Masalah Karir', href: '#masalah' },
    { label: 'Fitur', href: '#fitur' },
    { label: 'Harga', href: '#pricing' },
    { label: 'FAQ', href: '#faq' }
  ];

  return (
    <div className="landing-container" style={{ paddingTop: '70px' }}>
      <SEO
        title="Wedding Planner untuk Wanita Karir | NIKAH RAPI — Nikah Rapi Tanpa Resign"
        description="Sibuk kerja tapi tetap mau nikah rapi? Atur budget, vendor, seserahan, dan tamu undangan dari HP saat lunch break. 22+ modul otomatis. Rp 99.000 sekali bayar seumur hidup."
        path="/untuk-karir"
        keywords="wanita karir menikah, persiapan nikah sambil kerja, wedding planner wanita sibuk, atur pernikahan dari HP, wedding app indonesia, nikah tanpa ribet"
      />
      <LandingNav links={navLinks} />
      <main className="landing-page">

      {/* ══ HERO ══ */}
      <section className="hero">
        <div className="badge">✦ Wedding Planner untuk Wanita Sibuk</div>
        <p className="hero-eyebrow">Kerja sampai larut, weekend isinya rapat keluarga — kapan ngurus nikahnya?</p>
        <h1 className="hero-title">
          Atur Pernikahanmu <em>di Sela Kerja</em><br />— 15 Menit Sehari, Cukup.
        </h1>
        <p className="hero-hook">
          "Kamu nggak perlu cuti seminggu cuma buat ngurus seserahan.<br />
          NIKAH RAPI bantu kamu cicil persiapan saat lunch break, commute, atau jeda meeting — semua tersinkronisasi otomatis."
        </p>
        <p className="hero-title-sub">
          Cicil 15 menit sehari · Auto-sync dengan pasangan · Akses dari HP & laptop kerja
        </p>
        <div className="drama-tags">
          <span className="drama-tag">⏰ Gak Sempat Riset Vendor</span>
          <span className="drama-tag">😩 Lupa Ada Deadline DP</span>
          <span className="drama-tag">📱 Chat WA Pasangan Hilang Semua</span>
        </div>

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
              <div className="browser-url">app.nikahrapi.online ✦</div>
            </div>
            <div className="preview-stage on">
              <picture>
                <source srcSet="/landing-assets/dashboard.webp" type="image/webp" />
                <img src="/landing-assets/dashboard-opt.png" alt="Dashboard NIKAH RAPI" width="665" height="346" fetchPriority="high" loading="eager" decoding="sync" style={{ width: '100%', height: 'auto' }} />
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
              ⚡ Hemat Waktumu, Mulai Sekarang →
            </a>
            <button onClick={() => navigate('/demo')} className="btn-secondary">
              👁️ Coba 2 Menit Gratis
            </button>
          </div>
          <div className="cta-notes">
            <div className="cta-note-item">✓ Bisa diakses dari HP saat meeting</div>
            <div className="cta-note-item">✓ Garansi 7 hari</div>
            <div className="cta-note-item">✓ Sekali bayar, seumur hidup</div>
          </div>
        </div>

        <div className="social-proof-bar">
          <div className="sp-avatars">
            <div className="sp-avatar" style={{ background: 'linear-gradient(135deg,#E8C4B8,#D4A090)' }}>🌸</div>
            <div className="sp-avatar" style={{ background: 'linear-gradient(135deg,#C4857A,#8B5E6A)' }}>💼</div>
            <div className="sp-avatar" style={{ background: 'linear-gradient(135deg,#C9A96E,#E8D5B0)' }}>👩‍💻</div>
          </div>
          <div className="stars">★★★★★</div>
          <span>Dipercaya wanita karir Indonesia</span>
        </div>
      </section>

      {/* ══ DRAMA (KARIR VERSION) ══ */}
      <section className="drama-section" id="masalah">
        <p className="section-eyebrow reveal">Terlalu familiar buat kamu...</p>
        <h2 className="section-title reveal">Jangan Biarkan Persiapan Nikah<br/><em>Mengganggu Karir & Waktu Istirahatmu</em></h2>
        <div className="drama-grid">
          {[
            { icon: '⏰', title: 'Deadline Menumpuk', desc: 'Hectic di kantor ditambah ribuan detail pernikahan yang belum tuntas. Kamu butuh sistem yang bekerja otomatis bahkan saat kamu rapat.', scenario: '"Meeting jam 3, tapi otak masih mikirin DP katering udah dibayar belum."' },
            { icon: '📱', title: 'Data Tersebar Kemana-mana', desc: 'Vendor di WA, budget di Excel laptop kantor, seserahan di notes HP. Semua berantakan dan rawan ada yang terlewat.', scenario: '"File Excel budget-nya di laptop kantor, sekarang lagi di rumah. Gimana cek?"' },
            { icon: '😤', title: 'Koordinasi Pasangan Susah', desc: 'Capek rapat di kantor, masih harus debat sama pasangan soal hal teknis. Ingin satu tempat transparan buat berdua.', scenario: '"Udah capek kerja, pulang-pulang masih ribut soal vendor mana yang dipilih."' }
          ].map((item, i) => (
            <div key={i} className="drama-card reveal">
              <span className="drama-icon">{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <div className="drama-scenario">{item.scenario}</div>
            </div>
          ))}
        </div>
        <p className="drama-closer reveal">"Karirmu sudah susah payah dibangun. Jangan sampai persiapan nikah merusaknya."</p>
      </section>

      {/* ══ SOLUTION ══ */}
      <section className="solution-section" id="fitur">
        <div className="solution-inner">
          <div className="solution-left">
            <p className="section-eyebrow reveal" style={{ color: 'var(--blush)' }}>Solusi yang kamu butuhkan</p>
            <h2 className="section-title reveal">Satu platform.<br />Kerja tetap fokus.<br />Nikah tetap rapi.</h2>
            <p className="reveal">
              NIKAH RAPI dirancang untuk kamu yang sibuk — 22+ modul Web App terintegrasi yang bisa diakses dari HP. 
              Update vendor saat lunch break, ceklis seserahan saat di taksi. Input sekali, semua terupdate otomatis.
            </p>
            <a href="#pricing" className="btn-secondary reveal" style={{ background: 'white', color: 'var(--mauve)', border: 'none' }}>Lihat Harga & Paket →</a>
          </div>
          <div className="feature-cards">
            {[
              { icon: '💍', title: 'Seserahan Tracker', tag: 'Eksklusif', desc: 'Catat semua item, harga, status beli. Auto-hitung total. Update kapan saja dari HP.' },
              { icon: '🎁', title: 'Kado & Angpao Tracker', tag: 'Eksklusif', desc: 'Rekap siapa beri apa, nominal angpao, status follow up. Tidak ada yang terlewat.' },
              { icon: '💰', title: 'Budget Planner Otomatis', desc: 'Rencana vs realisasi terupdate real-time. Tahu persis kategori mana yang overbudget.' },
              { icon: '🏢', title: 'Vendor Manager Lengkap', desc: 'Kontak, kontrak, DP & pelunasan. Semua vendor terpantau tanpa harus scroll chat WA.' }
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
      <Suspense fallback={<div style={{height:'400px'}}/>}>
        <LandingDemoPreview navigate={navigate} />
      </Suspense>

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
                ['Akses PWA & Offline Support', false, true],
                ['Export & Import Data', false, true],
                ['Honeymoon Planner', false, true]
              ].map((row, i) => (
                <tr key={i}><td>{row[0]}</td><td style={{textAlign:'center'}}>{row[1]?'✓':'✕'}</td><td style={{textAlign:'center'}}>{row[2]?'✓':'✕'}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ══ TESTIMONI KARIR ══ */}
      <section className="testi-section">
        <p className="section-eyebrow reveal">Dari Wanita Karir Seperti Kamu</p>
        <h2 className="section-title reveal">Mereka Berhasil <em>Nikah Tanpa Resign</em></h2>
        <div className="testi-photo-grid">
          {[
            { emoji: '💼', bg: 'linear-gradient(135deg,#7A8C7E,#8B5E6A)', city: 'Tangerang', text: '"Kerja kantoran 9-to-5, gak ada waktu duduk depan laptop buat planning. Untungnya NIKAH RAPI bisa diakses dari HP. Update vendor pas lunch break, ceklis seserahan saat di taksi."', name: 'Maya S.', role: 'Marketing Manager · Des 2025' },
            { emoji: '👩‍💻', bg: 'linear-gradient(135deg,#E8C4B8,#8B5E6A)', city: 'Jakarta', text: '"Saya remote worker, suami di kantor. NIKAH RAPI bikin kami bisa update persiapan masing-masing tanpa harus video call tiap malam. Dashboard-nya jelas banget, progress keliatan semua."', name: 'Dina K.', role: 'Software Engineer · Sept 2025' },
            { emoji: '🌸', bg: 'linear-gradient(135deg,#C9A96E,#C4857A)', city: 'Bandung', text: '"Awalnya mau hire WO karena gak punya waktu. Tapi setelah coba NIKAH RAPI, ternyata bisa self-planned! Hematnya lumayan banget. Budget lebih terkontrol, dan gak perlu ambil cuti banyak."', name: 'Rina A.', role: 'Akuntan · Nov 2025' }
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
        <p className="section-eyebrow reveal">Investasi terkecil — hemat waktu & tenaga</p>
        <h2 className="section-title reveal">Dapatkan NIKAH RAPI Sekarang</h2>
        <div className="pricing-card reveal">
          <div className="pricing-card-badge">✦ Akses Premium Seumur Hidup</div>
          <div className="price-hero"><div className="price-big"><sup>Rp</sup>99.000</div></div>
          <div className="price-was-p"><s>Rp 199.000</s></div>
          <div className="price-save-badge">🔥 Hemat 50% — Harga Promo Terbatas!</div>
          <ul className="include-list">
            <li>Aplikasi Web NIKAH RAPI — 22+ modul lengkap & terintegrasi</li>
            <li>Seserahan Tracker eksklusif — tidak ada di produk lain!</li>
            <li>Kado & Angpao Tracker — follow up terima kasih mudah</li>
            <li>Dashboard otomatis update — cek progress dari HP saat di kantor</li>
            <li>Update akses gratis seumur hidup</li>
            <li>Akses multi-device (kamu & pasangan bisa bareng)</li>
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
            ⚡ Dapatkan Sekarang — Rp 99.000
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
            { q: 'Saya sangat sibuk, butuh waktu lama untuk set up?', a: 'Tidak! NIKAH RAPI langsung bisa dipakai setelah login. Tidak perlu setup rumit — tinggal isi data sesuai kebutuhan, sisanya otomatis.' },
            { q: 'Bisa diakses dari HP saat di kantor?', a: 'Tentu! NIKAH RAPI adalah Web App yang responsive. Buka browser di HP, login, dan langsung bisa update kapan saja — bahkan saat lunch break.' },
            { q: 'Pasangan saya juga bisa akses?', a: 'Bisa! Kamu dan pasangan bisa buka aplikasinya di HP masing-masing dan datanya akan tersinkronisasi otomatis.' },
            { q: 'Sekali bayar atau berlangganan?', a: 'Sekali bayar untuk akses seumur hidup. Tidak ada biaya bulanan — hemat waktu dan uang.' },
            { q: 'Ada garansi uang kembali?', a: 'Ada garansi 7 hari. Jika tidak sesuai deskripsi, hubungi kami untuk refund penuh tanpa ribet.' }
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
        <p className="section-eyebrow reveal" style={{ color: 'var(--blush)' }}>Sudah siap?</p>
        <h2 className="section-title reveal" style={{ color: 'white' }}>Mulai rencanakan pernikahanmu<br />dengan lebih <em style={{ color: '#E8D5B0' }}>tenang & efisien</em></h2>
        <p className="reveal">Karirmu tetap cemerlang. Pernikahanmu tetap sempurna. Semua terkontrol dalam satu platform.</p>
        <a href={checkoutUrl} className="btn-secondary reveal" style={{ margin: '0 auto', background: 'white', color: 'var(--mauve)', border: 'none' }}>
          ⚡ Ambil Sekarang — Nikah Tanpa Chaos
        </a>
      </section>
      
      </main>

      {showSticky && (
        <div className="sticky-cta-mobile">
          <a
            href={checkoutUrl}
            className="sticky-cta-btn"
            onClick={() => {
              if (window.fbq) window.fbq('track', 'InitiateCheckout', { value: 99000, currency: 'IDR' });
            }}
          >
            💍 Dapatkan Sekarang — Rp 99.000
          </a>
        </div>
      )}

      <footer style={{ background: '#2C2218', padding: '40px 80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', letterSpacing: '2px' }}>NIKAH RAPI ✦</div>
        <div style={{ fontSize: '12px', opacity: 0.7 }}>© 2025 NIKAH RAPI · Untuk Wanita Karir Indonesia 🤍</div>
      </footer>
    </div>
  );
};

export default LandingKarir;
