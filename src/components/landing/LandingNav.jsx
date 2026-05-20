import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingNav = ({ links }) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const checkoutUrl = "https://checkout.nikahrapi.online/";

  const defaultLinks = [
    { label: 'Fitur', href: '#fitur' },
    { label: 'Cara Kerja', href: '#cara-kerja' },
    { label: 'Harga', href: '#pricing' },
    { label: 'FAQ', href: '#faq' }
  ];

  const displayLinks = links || defaultLinks;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      transition: 'all 0.3s ease',
      background: scrolled ? 'rgba(250, 247, 242, 0.95)' : '#FAF7F2',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      boxShadow: scrolled ? '0 1px 8px rgba(92, 61, 46, 0.08)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(92, 61, 46, 0.1)' : 'none',
      padding: scrolled ? '12px 0' : '16px 0',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <span style={{ fontSize: '20px' }}>💍</span>
          <span style={{
            color: '#5C3D2E',
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: '700',
            fontSize: '20px',
            letterSpacing: '2px',
          }}>NIKAH RAPI</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {displayLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              style={{
                color: '#5C3D2E',
                fontSize: '14px',
                fontWeight: '500',
                textDecoration: 'none',
                fontFamily: "'Jost', sans-serif",
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#8B5E6A'}
              onMouseLeave={e => e.currentTarget.style.color = '#5C3D2E'}
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href={checkoutUrl}
          style={{
            background: '#8B5E6A',
            color: 'white',
            padding: '8px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '700',
            textDecoration: 'none',
            fontFamily: "'Jost', sans-serif",
            boxShadow: '0 4px 12px rgba(139, 94, 106, 0.2)',
          }}
        >
          Mulai Sekarang
        </a>
      </div>
    </nav>
  );
};

export default LandingNav;
