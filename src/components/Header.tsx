import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  onOpenOrder?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenOrder }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<'conversation' | 'bio' | null>(null);

  // Sticky header transition and exact scroll-spy for active nav indicator
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const conversationEl = document.getElementById('conversation');
      const bioEl = document.getElementById('bio');
      const scrollPos = window.scrollY + 100; // Account for header height offset

      if (bioEl && conversationEl) {
        const bioTop = bioEl.offsetTop;
        const bioHeight = bioEl.offsetHeight;
        const convTop = conversationEl.offsetTop;
        const convHeight = conversationEl.offsetHeight;

        if (scrollPos >= bioTop && scrollPos < bioTop + bioHeight) {
          setActiveSection('bio');
        } else if (scrollPos >= convTop && scrollPos < convTop + convHeight) {
          setActiveSection('conversation');
        } else {
          setActiveSection(null);
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { label: 'The Journal', href: '#conversation', id: 'conversation' as const },
    { label: 'The Author', href: '#bio', id: 'bio' as const },
  ];

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      const headerOffset = scrolled ? 64 : 68;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setMobileMenuOpen(false);
    }
  };

  const handleOrderClick = () => {
    setMobileMenuOpen(false);
    if (onOpenOrder) {
      onOpenOrder();
    }
  };

  return (
    <header
      id="main-header"
      className={`sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md transition-all duration-300 ${
        scrolled
          ? 'h-[62px] sm:h-[64px] border-b border-[#EAEAEA] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)]'
          : 'h-[68px] border-b border-[#EAEAEA]/60 shadow-none'
      }`}
    >
      <div className="max-w-[1200px] h-full mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Left: Brand Logo / Title */}
        <a
          id="header-brand-logo"
          href="#book"
          onClick={(e) => handleNavClick(e, '#book')}
          className="group flex items-center focus:outline-none select-none py-1"
        >
          <span className="text-[13px] sm:text-[14px] font-semibold tracking-[2px] uppercase text-[#111111] transition-colors duration-200 group-hover:text-[#B5964A]">
            RAMBLINGS &amp; EPIPHANIES
          </span>
        </a>

        {/* Right: Desktop Navigation Links & CTA */}
        <div className="hidden md:flex items-center gap-7 lg:gap-9">
          {/* Navigation Links with Active State */}
          <nav id="desktop-nav" aria-label="Main Navigation" className="flex items-center gap-6 lg:gap-8">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.label}
                  id={`nav-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`relative py-1 text-[12px] uppercase tracking-[1.5px] transition-colors duration-200 ${
                    isActive
                      ? 'text-[#111111] font-semibold'
                      : 'text-[#5F5F5F] hover:text-[#111111] font-medium'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#B5964A] rounded-full"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Direct Checkout CTA Button (No cart) */}
          <div className="flex items-center pl-2">
            <button
              id="header-order-pill-btn"
              type="button"
              onClick={handleOrderClick}
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[#111111] hover:bg-[#222222] hover:-translate-y-0.5 active:scale-[0.98] text-white text-[12.5px] font-medium px-5 py-2.5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer select-none"
            >
              <span>Order Your Copy</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#B5964A] transform transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Mobile View Toggle */}
        <div className="flex md:hidden items-center gap-2.5">
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="p-2 text-[#111111] hover:text-[#B5964A] focus:outline-none cursor-pointer transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 transition-transform duration-200 rotate-0 hover:rotate-90" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden bg-white/98 backdrop-blur-lg border-b border-[#EAEAEA] overflow-hidden shadow-xl"
          >
            <div className="px-6 py-5 flex flex-col gap-3">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`text-[13.5px] uppercase tracking-[1.5px] py-2.5 border-b border-[#EAEAEA]/60 flex items-center justify-between transition-colors ${
                      isActive
                        ? 'text-[#111111] font-semibold'
                        : 'text-[#5F5F5F] hover:text-[#111111] font-medium'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#B5964A]" />}
                      {item.label}
                    </span>
                    <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'text-[#B5964A] translate-x-1' : 'text-[#888888]'}`} />
                  </a>
                );
              })}
              <div className="pt-2">
                <button
                  onClick={handleOrderClick}
                  className="group w-full inline-flex items-center justify-center gap-2.5 rounded-full bg-[#111111] text-white text-[13px] font-medium py-3.5 shadow-sm hover:bg-[#222222] transition-all cursor-pointer hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  <span>Order Your Copy</span>
                  <ArrowRight className="w-4 h-4 text-[#B5964A] transform transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};


