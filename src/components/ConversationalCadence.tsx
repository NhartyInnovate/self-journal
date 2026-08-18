import React from 'react';
import { motion } from 'motion/react';

const CADENCE_WORDS = ['READ.', 'LISTEN.', 'QUESTION.', 'DISAGREE.', 'WRITE.', 'TALK.'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const wordVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: 'blur(4px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const manifestoVariants = {
  hidden: {
    opacity: 0,
    y: 24,
    filter: 'blur(3px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.85,
      delay: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const ConversationalCadence: React.FC = () => {
  return (
    <section
      id="conversation"
      aria-label="The Conversational Cadence"
      className="relative w-full bg-[#111111] text-white overflow-hidden py-16 sm:py-24 px-5 sm:px-8 transition-colors duration-300 scroll-mt-[76px]"
    >
      {/* Soft Ambient Gold Radial Lighting */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] sm:w-[720px] h-[360px] sm:h-[480px] bg-[#B5964A]/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Subtle Geometric Ambient Ring */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[960px] h-[450px] sm:h-[600px] border border-[#B5964A]/5 rounded-full pointer-events-none -rotate-6"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1200px] mx-auto text-center flex flex-col items-center">
        {/* 1. Eyebrow Label */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex items-center justify-center gap-3 mb-8 sm:mb-10"
        >
          <span className="h-[1px] w-6 sm:w-10 bg-[#B5964A]/50 inline-block" />
          <span
            id="cadence-eyebrow"
            className="text-[11px] font-semibold text-[#B5964A] uppercase tracking-[2.5px] select-none"
          >
            THE CONVERSATIONAL CADENCE
          </span>
          <span className="h-[1px] w-6 sm:w-10 bg-[#B5964A]/50 inline-block" />
        </motion.div>

        {/* 2. Monumental Rhythmic Headline */}
        <motion.div
          id="cadence-words-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-7 md:gap-x-9 gap-y-3 sm:gap-y-4 max-w-5xl mb-12 sm:mb-16"
        >
          {CADENCE_WORDS.map((word, idx) => (
            <motion.span
              key={word}
              variants={wordVariants}
              id={`cadence-word-${idx}`}
              className="font-normal text-[#FFFFFF] hover:text-[#B5964A] tracking-tight leading-[1.05] cursor-pointer transition-colors duration-300 select-none inline-block transform hover:scale-[1.02]"
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(32px, 5.5vw, 68px)',
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.div>

        {/* Hairline Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl h-[1px] bg-white/10 mb-10 sm:mb-12"
          aria-hidden="true"
        />

        {/* 3. Manifesto & Supporting Statement */}
        <motion.div
          id="cadence-manifesto-statement"
          variants={manifestoVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-2xl text-center px-4 flex flex-col items-center gap-4"
        >
          <blockquote
            id="cadence-primary-quote"
            className="text-[24px] sm:text-[28px] md:text-[30px] font-normal text-[#FAF8F2] italic leading-snug tracking-normal"
            style={{ fontFamily: 'var(--font-editorial)' }}
          >
            “This is more than a book. It’s a conversation.”
          </blockquote>

          <p
            id="cadence-supporting-desc"
            className="text-[15px] sm:text-[16px] text-[#A3A3A3] font-normal leading-[1.7] max-w-xl text-center mt-1"
          >
            An invitation to reflect, question, disagree, recognize yourself in another person’s experience, and begin conversations of your own.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
