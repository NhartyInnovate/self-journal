import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface ClosingInvitationProps {
  onOrderClick: () => void;
}

export const ClosingInvitation: React.FC<ClosingInvitationProps> = ({ onOrderClick }) => {
  return (
    <section
      id="closing"
      aria-label="The Invitation"
      className="relative w-full bg-[#111111] text-white overflow-hidden scroll-mt-[76px]"
      style={{
        paddingTop: 'clamp(80px, 10vw, 110px)',
        paddingBottom: 'clamp(80px, 10vw, 110px)',
      }}
    >
      {/* Centered Soft Antique Gold Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#B5964A]/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Subtle Geometric Background Ambient Accent */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] border border-[#B5964A]/5 rounded-full pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-8 text-center flex flex-col items-center">
        {/* 1. Eyebrow Label & 2. Monumental Closing Headline (Group 1) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3 mb-6 sm:mb-7">
            <span className="h-[1px] w-5 sm:w-8 bg-[#B5964A]/40 inline-block" />
            <span
              id="invitation-eyebrow"
              className="text-[10px] sm:text-[11px] font-semibold text-[#B5964A] uppercase tracking-[2px] select-none"
            >
              THE INVITATION
            </span>
            <span className="h-[1px] w-5 sm:w-8 bg-[#B5964A]/40 inline-block" />
          </div>

          {/* Monumental Closing Headline */}
          <h2
            id="invitation-headline"
            className="text-[#FFFFFF] font-normal leading-[1.08] tracking-[-0.01em] max-w-3xl text-center select-none"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(32px, 5vw, 52px)',
            }}
          >
            START THE CONVERSATION WITH YOURSELF.
          </h2>
        </motion.div>

        {/* 3. Sub-Titles & Byline (Group 2) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 sm:mt-10 mb-10 sm:mb-12 flex flex-col items-center gap-2.5 text-center"
        >
          <p
            id="invitation-book-title"
            className="text-[13px] sm:text-[14px] uppercase font-medium text-white/90 tracking-[2.5px]"
          >
            RAMBLINGS &amp; EPIPHANIES: THE SELF JOURNAL
          </p>

          <p
            id="invitation-author-byline"
            className="text-[11px] uppercase font-medium text-[#B5964A] tracking-[2px]"
          >
            BY MIMSHACH OBIOHA
          </p>
        </motion.div>

        {/* 4. Primary Call-to-Action (Pill Button) (Group 3) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            id="invitation-order-cta-btn"
            type="button"
            onClick={onOrderClick}
            className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-[#FFFFFF] hover:bg-[#FAFAF8] text-[#111111] font-semibold text-[12px] uppercase tracking-[2.5px] px-8 sm:px-11 py-3.5 sm:py-4 cursor-pointer shadow-[0_15px_35px_-5px_rgba(255,255,255,0.12)] hover:shadow-[0_20px_45px_-5px_rgba(255,255,255,0.20)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 select-none"
          >
            <span>ORDER YOUR COPY</span>
            <ArrowRight className="w-4 h-4 text-[#B5964A] transform transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
