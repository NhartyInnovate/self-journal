import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Download, Sparkles, Mail } from 'lucide-react';

interface NewsletterProps {
  onBonusUnlocked?: () => void;
}

export const Newsletter: React.FC<NewsletterProps> = ({ onBonusUnlocked }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      if (onBonusUnlocked) {
        onBonusUnlocked();
      }
    }, 600);
  };

  return (
    <section
      id="contact"
      className="w-full bg-[#FAFAF8] text-[#111111] border-t border-[#EAEAEA] scroll-mt-[76px]"
      style={{ paddingTop: '75px', paddingBottom: '75px' }}
    >
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto flex flex-col items-center"
        >
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-2 mb-3 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B5964A] inline-block" />
            <span
              id="newsletter-eyebrow"
              className="text-[11px] font-semibold text-[#B5964A] uppercase tracking-[2px]"
            >
              READER CIRCLE
            </span>
          </div>

          {/* Main Heading */}
          <h2
            id="newsletter-heading"
            className="text-[28px] sm:text-[34px] md:text-[38px] font-normal text-[#111111] leading-tight mb-3"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Join The Conversation
          </h2>

          {/* Description */}
          <p
            id="newsletter-description"
            className="text-[14px] sm:text-[15px] text-[#5F5F5F] font-normal leading-[1.7] mb-8 max-w-lg mx-auto"
          >
            Receive candid reflections, guided reflection frameworks, and author launch updates directly to your inbox.
          </p>

          {/* Form / State */}
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                id="newsletter-form"
                onSubmit={handleSubmit}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-md mx-auto"
              >
                <div className="flex flex-col sm:flex-row items-stretch gap-2.5 sm:gap-2 bg-white rounded-full p-1.5 border border-[#EAEAEA] shadow-xs focus-within:border-[#111111] focus-within:shadow-sm transition-all duration-200">
                  <div className="relative flex-1">
                    <input
                      id="newsletter-email-input"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="Enter your email address"
                      aria-label="Email address for newsletter"
                      className="w-full px-5 py-2.5 bg-transparent text-[#111111] placeholder-neutral-400 text-[13px] sm:text-[14px] rounded-full focus:outline-none"
                    />
                  </div>

                  <button
                    id="newsletter-join-btn"
                    type="submit"
                    disabled={loading}
                    className="px-7 py-3 bg-[#111111] hover:bg-[#222222] hover:-translate-y-0.5 active:scale-[0.98] text-white text-[12px] font-semibold tracking-[1.5px] uppercase rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer min-w-[110px] shadow-xs hover:shadow-sm"
                  >
                    {loading ? (
                      <span className="inline-block w-4 h-4 border-2 border-neutral-400 border-t-white rounded-full animate-spin" />
                    ) : (
                      'JOIN'
                    )}
                  </button>
                </div>

                {error && (
                  <p id="newsletter-error-msg" className="mt-2 text-xs text-rose-500 text-left sm:text-center">
                    {error}
                  </p>
                )}

                <p className="text-[11px] text-[#888888] mt-3 text-center">
                  No spam ever. Unsubscribe at any time with a single click.
                </p>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-[#EAEAEA] p-6 rounded-xl text-[#111111] text-center max-w-md mx-auto shadow-sm"
              >
                <div className="flex items-center justify-center gap-2 mb-2 text-[#111111]">
                  <CheckCircle2 className="w-5 h-5 text-[#70C12E]" />
                  <span className="font-semibold text-sm tracking-wide">
                    Welcome to the Reader Circle!
                  </span>
                </div>
                <p className="text-xs text-[#5F5F5F] mb-4">
                  A welcome note and your link to access the <strong>Guided Reflection Prompts &amp; Framework</strong> have been sent to <em>{email}</em>.
                </p>
                <button
                  onClick={() => {
                    if (onBonusUnlocked) {
                      onBonusUnlocked();
                    }
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#111111] text-white text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-[#222222] hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#B5964A]" />
                  Access Reader Vault &amp; Guides
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
