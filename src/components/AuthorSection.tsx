import React from 'react';
import { motion } from 'motion/react';

interface AuthorSectionProps {
  onLearnMoreBio?: () => void;
}

export const AuthorSection: React.FC<AuthorSectionProps> = () => {
  return (
    <section
      id="bio"
      aria-label="About the Author"
      className="w-full bg-[#FFFFFF] py-16 sm:py-24 px-6 sm:px-8 overflow-hidden scroll-mt-[76px]"
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-10 lg:gap-16">
          {/* Left: Author Portrait Card */}
          <motion.div
            id="author-portrait-col"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="w-full sm:w-[380px] md:w-[420px] shrink-0 flex justify-center"
          >
            <div
              id="author-portrait-card"
              className="relative w-full aspect-[3/4] max-w-[420px] rounded-[4px] overflow-hidden shadow-xl shadow-black/8 group bg-[#111111] transition-shadow duration-500 hover:shadow-2xl"
            >
              {/* High-res Black & White Editorial Author Portrait */}
              <img
                id="author-portrait-image"
                src="/src/assets/images/mimshach_obioha_portrait_1787044786544.jpg"
                alt="Mimshach Obioha - Author Portrait in black and white"
                className="w-full h-full object-cover object-center filter grayscale contrast-[1.08] brightness-[0.98] group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
              />

              {/* Bottom Subtle Gradient Shadow for Watermark */}
              <div
                className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none"
                aria-hidden="true"
              />

              {/* Overlay Badge at Bottom Left */}
              <div
                id="author-portrait-watermark"
                className="absolute bottom-4 sm:bottom-5 left-4 sm:left-5 text-white/95 text-[10px] sm:text-[11px] font-medium tracking-[2px] uppercase select-none drop-shadow-sm"
              >
                AUTHOR PORTRAIT
              </div>
            </div>
          </motion.div>

          {/* Right: Author Biography & Highlighted Quote */}
          <motion.div
            id="author-content-col"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:flex-1 text-left flex flex-col justify-center"
          >
            {/* 1. Eyebrow */}
            <div className="flex items-center gap-2 mb-3 sm:mb-4 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B5964A] inline-block" />
              <span
                id="author-eyebrow"
                className="text-[11px] sm:text-[12px] font-semibold text-[#B5964A] uppercase tracking-[2px]"
              >
                THE AUTHOR
              </span>
            </div>

            {/* 2. Monumental Name Headline */}
            <h2
              id="author-name-headline"
              className="text-[36px] sm:text-[46px] lg:text-[54px] font-normal text-[#111111] leading-[1.05] tracking-[0.05em] uppercase mb-6 sm:mb-8 select-none"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              MIMSHACH OBIOHA
            </h2>

            {/* 3. Quote Card with Gold Vertical Border */}
            <div
              id="author-quote-card"
              className="border-l-[2px] border-[#B5964A] pl-5 sm:pl-6 py-3.5 sm:py-4 bg-[#FAFAF8] rounded-none mb-8 max-w-2xl"
            >
              <blockquote
                id="author-quote-text"
                className="text-[17px] sm:text-[19px] lg:text-[20px] font-normal text-[#111111] italic leading-[1.55] tracking-normal"
                style={{ fontFamily: 'var(--font-editorial)' }}
              >
                “I write to clarify what I feel, and share it so we don’t have to carry our questions in solitude.”
              </blockquote>
            </div>

            {/* 4. Biography Subtitle & Description */}
            <div id="author-bio-details" className="flex flex-col gap-2 max-w-2xl">
              <p
                id="author-bio-title"
                className="text-[13px] sm:text-[14px] text-[#5F5F5F] font-normal uppercase tracking-[1.5px]"
              >
                AUTHOR BIOGRAPHY WILL BE ADDED HERE.
              </p>

              <p
                id="author-bio-desc"
                className="text-[14px] sm:text-[15px] text-[#5F5F5F]/80 font-normal leading-[1.7]"
              >
                Official biographical profile and publishing background will appear with the launch edition.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
