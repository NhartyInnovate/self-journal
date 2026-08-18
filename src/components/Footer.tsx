import React from 'react';

interface FooterProps {
  onOpenBonuses?: () => void;
  onOpenShop?: () => void;
  onOpenOrder?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBonuses, onOpenShop, onOpenOrder }) => {
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    href: string
  ) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const headerOffset = 64;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleOrderClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onOpenOrder) {
      onOpenOrder();
    } else if (onOpenShop) {
      onOpenShop();
    } else {
      const targetElement = document.getElementById('closing');
      if (targetElement) {
        const headerOffset = 64;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }
  };

  const handleLaunchClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onOpenBonuses) {
      onOpenBonuses();
    } else {
      const targetElement = document.getElementById('contact');
      if (targetElement) {
        const headerOffset = 64;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }
  };

  return (
    <footer
      id="main-footer"
      className="w-full bg-[#111111] text-white py-12 sm:py-16 transition-colors duration-300"
    >
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10">
        {/* Top Row: Brand & Navigation Links */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8 sm:mb-10">
          {/* Left: Brand Name & Gold Italic Byline */}
          <div id="footer-brand-block" className="flex flex-col gap-1.5 text-left select-none">
            <span
              id="footer-brand-title"
              className="text-[13px] sm:text-[14px] font-semibold tracking-[2.5px] uppercase text-[#FFFFFF]"
            >
              RAMBLINGS &amp; EPIPHANIES
            </span>
            <p
              id="footer-brand-subtitle"
              className="text-[13px] sm:text-[14px] font-normal italic text-[#B5964A] tracking-normal"
              style={{ fontFamily: 'var(--font-editorial)' }}
            >
              The Self Journal <span className="text-[#B5964A]/60 mx-1">•</span> by Mimshach Obioha
            </p>
          </div>

          {/* Right: Uppercase Nav Links */}
          <nav
            id="footer-nav-links"
            aria-label="Footer Navigation"
            className="flex flex-wrap items-center gap-6 sm:gap-8 md:gap-9 text-[11px] sm:text-[12px] font-medium tracking-[2px] uppercase text-[#999999]"
          >
            <a
              id="footer-link-journal"
              href="#conversation"
              onClick={(e) => handleNavClick(e, '#conversation')}
              className="hover:text-white transition-colors duration-200"
            >
              JOURNAL
            </a>
            <a
              id="footer-link-author"
              href="#bio"
              onClick={(e) => handleNavClick(e, '#bio')}
              className="hover:text-white transition-colors duration-200"
            >
              AUTHOR
            </a>
            <button
              id="footer-link-launch"
              type="button"
              onClick={handleLaunchClick}
              className="hover:text-white transition-colors duration-200 cursor-pointer uppercase tracking-[2px]"
            >
              NEWSLETTER
            </button>
            <button
              id="footer-link-order"
              type="button"
              onClick={handleOrderClick}
              className="hover:text-[#B5964A] text-white transition-colors duration-200 cursor-pointer uppercase tracking-[2px] font-semibold"
            >
              ORDER
            </button>
          </nav>
        </div>

        {/* Subtle Hairline Divider */}
        <div className="w-full h-[1px] bg-white/10 mb-7 sm:mb-8" aria-hidden="true" />

        {/* Bottom Row: Copyright & Literary Publication Tagline */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[12px] sm:text-[13px] text-[#777777]">
          <div id="footer-copyright">
            &copy; 2026 Mimshach Obioha. All rights reserved.
          </div>
          <div
            id="footer-publication-badge"
            className="italic text-[#777777]"
            style={{ fontFamily: 'var(--font-editorial)' }}
          >
            An independent literary publication
          </div>
        </div>
      </div>
    </footer>
  );
};

