import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingNav from '../../components/landing/LandingNav';
import SEO from '../../components/SEO';
import './LandingMain.css';
import './LandingGlobal.css';

const LandingGlobal = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i);

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
  const checkoutUrl = 'https://checkout.nikahrapi.online/global';

  const navLinks = [
    { label: 'Problems', href: '#problems' },
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <div className="landing-container" style={{ paddingTop: '70px' }}>
      <SEO
        title="Nikah Rapi — Muslim Wedding Planner App for Malaysia, Singapore & Brunei"
        description="The all-in-one digital wedding planner for Muslim couples. Manage your budget, guest list, vendors, hantaran & more — all in one place. Lifetime access for just $19."
        path="/global"
        keywords="muslim wedding planner, wedding app malaysia, wedding organizer singapore, nikah planner, hantaran tracker, wedding budget malaysia"
      />
      <LandingNav links={navLinks} />
      <main className="landing-page">

        {/* ══ HERO ══ */}
        <section className="hero">
          <div className="badge">✦ Trusted by Couples in Malaysia, Singapore & Brunei</div>
          <p className="hero-eyebrow">For Muslim couples who want a stress-free wedding</p>
          <h1 className="hero-title">
            Plan Your Dream Wedding<br /><em>Without the Chaos</em>
          </h1>
          <p className="hero-hook">
            Stop managing 100+ guests in WhatsApp, budgets in messy spreadsheets,<br />
            and vendor contacts scattered everywhere.<br />
            One platform. Everything organised. Ready in 10 minutes.
          </p>
          <p className="hero-title-sub">
            Works on mobile · Real-time sync · Lifetime access
          </p>

          <div className="product-showcase">
            <div className="showcase-glow"></div>
            <div className="float-badge float-badge-top">
              <div className="fb-icon" style={{ background: '#FFF0EC' }}>💰</div>
              <div>
                <div className="fb-label">Budget Tracker</div>
                <div className="fb-val">RM 48,500 tracked ✓</div>
              </div>
            </div>
            <div className="float-badge float-badge-bot">
              <div className="fb-icon" style={{ background: '#F0F4F0' }}>💍</div>
              <div>
                <div className="fb-label">Hantaran Tracker</div>
                <div className="fb-val">12/15 items ready ✓</div>
              </div>
            </div>
            <div className="browser-frame">
              <div className="browser-bar">
                <div className="browser-dots">
                  <div className="browser-dot" style={{ background: '#ff5f57' }}></div>
                  <div className="browser-dot" style={{ background: '#febc2e' }}></div>
                  <div className="browser-dot" style={{ background: '#28c840' }}></div>
                </div>
                <div className="browser-url">nikahrapi.online/dashboard</div>
              </div>
              <div className="preview-stage on">
                <picture>
                  <source srcSet="/landing-assets/dashboard.webp" type="image/webp" />
                  <img src="/landing-assets/dashboard-opt.png" alt="Nikah Rapi Dashboard" width="665" height="346" fetchPriority="high" loading="eager" decoding="sync" style={{ width: '100%', height: 'auto' }} />
                </picture>
              </div>
            </div>
          </div>

          <div className="hero-cta-block">
            <div className="price-display">
              <div className="price-new"><sup style={{ fontSize: '22px' }}>$</sup>19</div>
              <div className="price-old"><s>$59</s></div>
              <div className="price-save">SAVE 68%</div>
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '20px' }}>
              <a
                href={checkoutUrl}
                className="btn-primary"
                onClick={() => window.fbq && window.fbq('track', 'ViewContent', {
                  content_name: 'Nikah Rapi Global',
                  content_category: 'Wedding Planner',
                  value: 19,
                  currency: 'USD'
                })}
              >
                💍 Get Nikah Rapi Now →
              </a>
              <button onClick={() => navigate('/demo')} className="btn-secondary">
                👁️ See the App
              </button>
            </div>
            <div className="cta-notes">
              <div className="cta-note-item">✓ Lifetime access</div>
              <div className="cta-note-item">✓ No monthly fees</div>
              <div className="cta-note-item">✓ 7-day money back</div>
            </div>
          </div>
        </section>

        {/* ══ PROBLEMS ══ */}
        <section className="drama-section" id="problems">
          <p className="section-eyebrow reveal">Sound familiar?</p>
          <h2 className="section-title reveal">Wedding Planning Shouldn't Feel Like<br /><em>A Second Job</em></h2>
          <div className="drama-grid">
            {[
              {
                icon: '😩',
                title: 'Guest List Chaos',
                desc: 'Hundreds of names across WhatsApp, Excel sheets, and sticky notes. Impossible to track who\'s coming, who\'s not, and how many seats you need.',
                scenario: '"Wait — did we send an invite to Mak Long\'s side? I can\'t find it anywhere..."'
              },
              {
                icon: '💸',
                title: 'Budget Overruns',
                desc: 'You had a number in mind. Now it\'s somehow doubled. No clear view of what\'s been paid, what\'s outstanding, and where the money went.',
                scenario: '"The caterer needs the final payment by Friday. How much have we paid them already?"'
              },
              {
                icon: '📱',
                title: 'Vendor Contacts Everywhere',
                desc: 'Photographer in one chat, florist in another, dewan in your email. Following up on each one is exhausting.',
                scenario: '"Which one was the photographer\'s number again? I need to confirm the shot list."'
              }
            ].map((item, i) => (
              <div key={i} className="drama-card reveal">
                <span className="drama-icon">{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <div className="drama-scenario">{item.scenario}</div>
              </div>
            ))}
          </div>
          <p className="drama-closer reveal">"Your wedding day should be a joy — not the finish line of a stressful marathon."</p>
        </section>

        {/* ══ SOLUTION ══ */}
        <section className="solution-section" id="features">
          <div className="solution-inner">
            <div className="solution-left">
              <p className="section-eyebrow reveal" style={{ color: 'var(--blush)' }}>The solution you need</p>
              <h2 className="section-title reveal">One platform.<br />Every detail<br />under control.</h2>
              <p className="reveal">
                Nikah Rapi is built specifically for Muslim couples — 22+ integrated modules covering everything from hantaran to honeymoon. All on your phone.
              </p>
              <a href="#pricing" className="btn-secondary reveal" style={{ background: 'white', color: 'var(--mauve)', border: 'none' }}>See Pricing →</a>
            </div>
            <div className="feature-cards">
              {[
                { icon: '💰', title: 'Budget Planner', tag: '', desc: 'Track every ringgit/dollar in real-time. See exactly what\'s paid, what\'s pending, and what\'s left.' },
                { icon: '💍', title: 'Hantaran Tracker', tag: 'Exclusive', desc: 'Log every hantaran item, price, and purchase status. Nothing gets missed.' },
                { icon: '👥', title: 'Guest List & RSVP', tag: '', desc: 'Import hundreds of names, track confirmations digitally, manage seating arrangements.' },
                { icon: '🏢', title: 'Vendor Manager', tag: '', desc: 'All vendor contacts, contracts, and payment deadlines — centralised in one place.' },
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

        {/* ══ FULL FEATURE LIST ══ */}
        <section className="diff-section">
          <p className="section-eyebrow reveal">Everything you need</p>
          <h2 className="section-title reveal">22+ Modules — <em>All Included</em></h2>
          <div className="diff-table-wrap reveal">
            <table className="diff-table">
              <thead><tr><th>Feature</th><th>Spreadsheet / WhatsApp</th><th>Nikah Rapi ✦</th></tr></thead>
              <tbody>
                {[
                  ['Hantaran / Seserahan Tracker', false, true],
                  ['Gift & Angpao Tracker', false, true],
                  ['Real-time Budget Dashboard', false, true],
                  ['Guest List & Digital RSVP', false, true],
                  ['Vendor Payment Tracking', false, true],
                  ['Wedding Checklist (H-12 months)', false, true],
                  ['Day-of Timeline / Rundown', false, true],
                  ['Multi-device Access (You + Spouse)', false, true],
                  ['Honeymoon Planner', false, true],
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

        {/* ══ TESTIMONIALS ══ */}
        <section className="testi-section">
          <p className="section-eyebrow reveal">Real couples, real results</p>
          <h2 className="section-title reveal">They Used Nikah Rapi — <em>Here's What They Said</em></h2>
          <div className="testi-photo-grid">
            {[
              { emoji: '💑', bg: 'linear-gradient(135deg,#C9A96E,#8B5E6A)', city: 'Kuala Lumpur', text: '"We were managing everything in WhatsApp groups and it was a mess. Nikah Rapi brought everything together — budget, vendors, guests. Saved us so much stress in the final months."', name: 'Amir & Nadia', role: 'Couple · Oct 2025' },
              { emoji: '🌸', bg: 'linear-gradient(135deg,#E8C4B8,#C4857A)', city: 'Singapore', text: '"The hantaran tracker alone was worth it. We had 18 items to prepare and this made sure nothing was missed. Our mothers were impressed with how organised we were!"', name: 'Hafiz & Aisyah', role: 'Couple · Dec 2025' },
              { emoji: '💐', bg: 'linear-gradient(135deg,#8B5E6A,#C9A96E)', city: 'Bandar Seri Begawan', text: '"Being based in Brunei and planning a wedding in Malaysia, I needed everything organised digitally. Nikah Rapi was exactly what we needed. Worth every cent."', name: 'Danial & Nur', role: 'Couple · Aug 2025' },
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
          <p className="section-eyebrow reveal">Simple, one-time pricing</p>
          <h2 className="section-title reveal">Get Nikah Rapi Today</h2>
          <div className="pricing-card reveal">
            <div className="pricing-card-badge">✦ Lifetime Access — Pay Once, Use Forever</div>
            <div className="price-hero">
              <div className="price-big"><sup>$</sup>19</div>
            </div>
            <div className="price-was-p"><s>$59</s></div>
            <div className="price-save-badge">🔥 Save 68% — Limited Time Offer!</div>
            <ul className="include-list">
              <li>Full access to Nikah Rapi — 22+ modules</li>
              <li>Hantaran / Seserahan Tracker — exclusive feature</li>
              <li>Gift & Angpao Tracker — follow up made easy</li>
              <li>Budget, Guest, Vendor, Checklist & more</li>
              <li>Free lifetime updates</li>
              <li>Multi-device access (you + spouse)</li>
            </ul>
            <a
              href={checkoutUrl}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', fontSize: '15px', padding: '22px' }}
              onClick={() => window.fbq && window.fbq('track', 'ViewContent', {
                content_name: 'Nikah Rapi Global',
                content_category: 'Wedding Planner',
                value: 19,
                currency: 'USD'
              })}
            >
              💍 Get Nikah Rapi — $19 USD
            </a>
            <p className="urgency-note">⏰ Price increases soon · 7-day money back guarantee · Instant access</p>
          </div>
        </section>

        {/* ══ FAQ ══ */}
        <section className="faq-section" id="faq">
          <p className="section-eyebrow reveal">Got questions?</p>
          <h2 className="section-title reveal">FAQ</h2>
          <div className="faq-inner">
            {[
              { q: 'Is this suitable for Malaysian/Singapore weddings?', a: 'Absolutely. Nikah Rapi is built for Muslim wedding culture — including hantaran tracking, doa selamat checklists, and multi-family coordination features that generic planners don\'t have.' },
              { q: 'Can my spouse access it too?', a: 'Yes! Both of you can access the same account on your own devices. All data syncs in real-time, so you\'re always on the same page.' },
              { q: 'Is it a one-time payment or subscription?', a: 'One-time payment for lifetime access. No monthly fees, no surprises.' },
              { q: 'What if I\'m not satisfied?', a: '7-day money back guarantee. If it\'s not right for you, we\'ll refund 100% — no questions asked.' },
              { q: 'What currency is the payment in?', a: 'Payment is in USD ($19). Your bank will automatically convert to MYR, SGD, or BND at the current exchange rate.' },
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
          <p className="section-eyebrow reveal" style={{ color: 'var(--blush)' }}>Ready to get organised?</p>
          <h2 className="section-title reveal" style={{ color: 'white' }}>Start Planning Your Wedding<br />the <em style={{ color: '#E8D5B0' }}>Right Way</em></h2>
          <p className="reveal">Everything you need for a smooth, stress-free wedding — in one platform.</p>
          <a href={checkoutUrl} className="btn-secondary reveal" style={{ margin: '0 auto', background: 'white', color: 'var(--mauve)', border: 'none' }}>
            💍 Get Nikah Rapi — $19 USD
          </a>
        </section>

      </main>
      <footer style={{ background: '#2C2218', padding: '40px 80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', letterSpacing: '2px' }}>NIKAH RAPI ✦</div>
        <div style={{ fontSize: '12px', opacity: 0.7 }}>© 2025 NIKAH RAPI · For Muslim Couples Worldwide 🤍</div>
      </footer>
    </div>
  );
};

export default LandingGlobal;
