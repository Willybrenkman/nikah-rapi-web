import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingNav = ({ links, ctaText, ctaUrl }) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const checkoutUrl = ctaUrl || "https://checkout.nikahrapi.online/";

  const defaultLinks = [
    { label: 'Fitur', href: '#fitur' },
    { label: 'Cara Kerja', href: '#cara-kerja' },
    { label: 'Harga', href: '#pricing' },
    { label: 'FAQ', href: '#faq' }
  ];

  const displayLinks = links || defaultLinks;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${scrolled ? 'bg-[#FAF7F2]/95 backdrop-blur-md shadow-sm py-3 border-b border-[#5C3D2E]/10' : 'bg-[#FAF7F2] py-4'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <span className="text-xl">💍</span>
          <span className="text-[#5C3D2E] font-playfair font-bold text-xl tracking-wide">NIKAH RAPI</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {displayLinks.map((link, idx) => (
            <a 
              key={idx} 
              href={link.href} 
              onClick={(e) => handleLinkClick(e, link.href)}
              className="text-[#5C3D2E] hover:text-[#8B5E6A] text-sm font-medium transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <a
            href={checkoutUrl}
            className="bg-[#8B5E6A] hover:bg-[#5C3D2E] text-white px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-md shadow-[#8B5E6A]/20"
          >
            {ctaText || 'Mulai Sekarang'}
          </a>
        </div>
      </div>
    </nav>
  );
};

export default LandingNav;
