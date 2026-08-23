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
              COMMUNITY
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
            Connect with other readers, access guided reflection frameworks, and receive direct updates from the author in our official WhatsApp community.
          </p>

          {/* WhatsApp CTA Button */}
          <div className="w-full max-w-md mx-auto flex justify-center">
            {import.meta.env.VITE_WHATSAPP_CHANNEL_URL ? (
              <a
                href={import.meta.env.VITE_WHATSAPP_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-2.5 rounded-full px-8 py-3.5 bg-[#111111] text-white text-[12px] sm:text-[13px] font-medium uppercase tracking-[1.5px] hover:bg-[#222222] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 shadow-[0_12px_25px_-5px_rgba(0,0,0,0.15)] hover:shadow-[0_18px_30px_-5px_rgba(0,0,0,0.25)] cursor-pointer select-none"
                aria-label="Join the official Ramblings and Epiphanies WhatsApp channel"
              >
                <span>JOIN THE WHATSAPP CHANNEL</span>
              </a>
            ) : (
              <button
                disabled
                className="group relative inline-flex items-center justify-center gap-2.5 rounded-full px-8 py-3.5 bg-[#EAEAEA] text-[#888888] text-[12px] sm:text-[13px] font-medium uppercase tracking-[1.5px] cursor-not-allowed select-none"
                aria-label="WhatsApp channel link is currently unavailable"
              >
                <span>CHANNEL COMING SOON</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
