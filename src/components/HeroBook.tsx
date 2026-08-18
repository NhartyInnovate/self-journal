import React from 'react';
import { motion } from 'motion/react';
import { BookCover } from './BookCover';
import { BookData } from '../types';
import { ArrowRight } from 'lucide-react';

interface HeroBookProps {
  book: BookData;
  onLearnMore: () => void;
  onOrderAmazon: () => void;
  onQuickPreview: () => void;
}

const contentContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.15,
    },
  },
};

const itemFadeUpVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const HeroBook: React.FC<HeroBookProps> = ({
  book,
  onLearnMore,
  onOrderAmazon,
  onQuickPreview,
}) => {
  return (
    <section
      id="book"
      className="w-full bg-[#FFFFFF] overflow-hidden scroll-mt-[76px]"
      style={{ paddingTop: '65px', paddingBottom: '65px' }}
    >
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
        <div className="flex flex-col lg:flex-row items-center lg:items-center gap-10 lg:gap-14">
          {/* Left Column: Book Cover */}
          <motion.div
            id="hero-book-cover-col"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-[38%] flex flex-col items-center justify-center"
          >
            <BookCover onQuickPreview={onQuickPreview} />
          </motion.div>

          {/* Right Column: Editorial Text & CTAs (62% on desktop) */}
          <motion.div
            id="hero-book-content-col"
            variants={contentContainerVariants}
            initial="hidden"
            animate="visible"
            className="w-full lg:w-[62%] text-left"
          >
            {/* Main Title Block matching graphic layout */}
            <motion.div id="hero-title-block" variants={itemFadeUpVariants} className="mb-6">
              {/* Line 1: RAMBLINGS */}
              <h1
                id="hero-title-ramblings"
                className="text-[#111111] font-normal leading-[0.95] tracking-[0.05em] text-[34px] sm:text-[46px] lg:text-[56px] select-none"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                RAMBLINGS
              </h1>

              {/* Line 2: Italic Ampersand & Horizontal Gold Hairline */}
              <div className="flex items-center gap-3.5 my-1.5 max-w-[460px]">
                <span
                  id="hero-title-ampersand"
                  className="text-[#B5964A] font-normal italic leading-none text-[32px] sm:text-[38px] lg:text-[44px] select-none"
                  style={{ fontFamily: 'var(--font-editorial)' }}
                >
                  &amp;
                </span>
                <span className="h-[1px] bg-[#B5964A]/70 flex-1 inline-block" />
              </div>

              {/* Line 3: EPIPHANIES */}
              <div
                id="hero-title-epiphanies"
                className="text-[#111111] font-normal leading-[0.95] tracking-[0.05em] text-[34px] sm:text-[46px] lg:text-[56px] select-none"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                EPIPHANIES
              </div>

              {/* Subtitle: THE SELF JOURNAL */}
              <p
                id="hero-subtitle-self-journal"
                className="mt-5 tracking-[2.5px] text-[12px] sm:text-[13px] font-medium text-[#5F5F5F] uppercase select-none"
              >
                THE SELF JOURNAL
              </p>
            </motion.div>

            {/* Tagline */}
            <motion.p
              id="hero-book-tagline"
              variants={itemFadeUpVariants}
              className="text-[15px] sm:text-[16px] font-normal text-[#444444] leading-relaxed mb-4 italic"
              style={{ fontFamily: 'var(--font-editorial)' }}
            >
              {book.tagline}
            </motion.p>

            {/* Body Description */}
            <motion.p
              id="hero-book-body"
              variants={itemFadeUpVariants}
              className="text-[14px] sm:text-[15px] text-[#5F5F5F] font-normal leading-[1.75] mb-8 max-w-2xl"
            >
              {book.description}
            </motion.p>

            {/* Action Buttons: Unified Rounded Pill Language */}
            <motion.div
              id="hero-actions"
              variants={itemFadeUpVariants}
              className="flex flex-wrap items-center gap-3.5 sm:gap-4"
            >
              {/* Hero Primary CTA: Order Your Copy */}
              <button
                id="hero-order-amazon-btn"
                onClick={onOrderAmazon}
                className="group relative inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 bg-[#111111] text-white text-[12px] sm:text-[13px] font-medium uppercase tracking-[1.5px] hover:bg-[#222222] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 shadow-[0_18px_35px_-5px_rgba(0,0,0,0.22)] hover:shadow-[0_22px_40px_-5px_rgba(0,0,0,0.3)] cursor-pointer select-none"
              >
                <span>ORDER YOUR COPY</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#B5964A] transform group-hover:translate-x-1 transition-transform duration-200" />
              </button>

              {/* Hero Secondary CTA: Learn More */}
              <button
                id="hero-learn-more-btn"
                onClick={onLearnMore}
                className="group relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 bg-white text-[#111111] text-[12px] sm:text-[13px] font-medium uppercase tracking-[1.5px] border border-[#EAEAEA] hover:border-[#111111] hover:bg-[#FAFAF8] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 cursor-pointer select-none"
              >
                <span>LEARN MORE</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#5F5F5F] transform group-hover:translate-x-0.5 transition-transform duration-200" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

