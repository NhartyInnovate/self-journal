import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, ChevronLeft, ChevronRight, Bookmark, ShoppingBag, Type } from 'lucide-react';
import { CURRENT_BOOK } from '../data/bookData';

interface ExcerptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderBook: () => void;
}

export const ExcerptModal: React.FC<ExcerptModalProps> = ({
  isOpen,
  onClose,
  onOrderBook,
}) => {
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        id="excerpt-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          id="excerpt-modal-card"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl bg-[#FAFAF8] text-[#111111] rounded-xl border border-[#EAEAEA] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="bg-[#111111] text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-[#B5964A]" />
              <div>
                <span className="text-[9px] uppercase tracking-[2px] text-[#B5964A] block font-semibold">
                  SAMPLE EXCERPT
                </span>
                <h3
                  className="text-base sm:text-lg font-normal text-white"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {CURRENT_BOOK.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Font Size Toggle */}
              <button
                onClick={() => setFontSize(fontSize === 'normal' ? 'large' : 'normal')}
                className="px-3 py-1 text-xs border border-white/20 rounded-full text-white/90 hover:bg-white/10 transition-colors flex items-center gap-1 cursor-pointer"
                title="Toggle font size"
              >
                <Type className="w-3.5 h-3.5" />
                <span className="text-[10px] font-semibold uppercase">{fontSize === 'normal' ? '1x' : '1.3x'}</span>
              </button>

              <button
                id="close-excerpt-modal-btn"
                onClick={onClose}
                className="p-1 text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Book Excerpt Text Container */}
          <div className="p-8 sm:p-12 overflow-y-auto bg-[#FAFAF8] select-text">
            <div className="max-w-xl mx-auto">
              <div className="text-center mb-8 border-b border-[#EAEAEA] pb-6">
                <span className="text-[11px] font-semibold tracking-[2px] uppercase text-[#B5964A] block mb-1">
                  {CURRENT_BOOK.sampleExcerpt.chapter}
                </span>
                <h2
                  className="text-2xl sm:text-3xl font-normal text-[#111111]"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {CURRENT_BOOK.sampleExcerpt.title}
                </h2>
                <div className="w-8 h-[1px] bg-[#B5964A] mx-auto mt-4" />
              </div>

              {/* Excerpt Body with Classical Literary Drop Cap */}
              <div
                className={`space-y-6 ${
                  fontSize === 'large'
                    ? 'text-[17px] leading-[1.85]'
                    : 'text-[15px] sm:text-[15.5px] leading-[1.8]'
                } text-[#111111] font-serif`}
                style={{ fontFamily: 'var(--font-editorial)' }}
              >
                {CURRENT_BOOK.sampleExcerpt.paragraphs.map((p, idx) => (
                  <p key={idx} className={idx === 0 ? 'first-letter:text-5xl first-letter:font-serif first-letter:float-left first-letter:mr-3 first-letter:text-[#111111] first-letter:leading-none' : ''}>
                    {p}
                  </p>
                ))}

                <div className="pt-8 text-center">
                  <div className="text-[#B5964A] select-none tracking-[0.5em] text-sm mb-4">
                    * * *
                  </div>
                  <p className="text-xs uppercase tracking-widest text-[#5F5F5F] font-sans">
                    End of Preview Excerpt
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar with Direct Order Action */}
          <div className="bg-[#FFFFFF] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#EAEAEA]">
            <div className="text-xs text-[#5F5F5F] text-center sm:text-left">
              Want to read all {CURRENT_BOOK.pageCount} pages of <strong>{CURRENT_BOOK.title}</strong>?
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#5F5F5F] hover:text-[#111111] uppercase tracking-wider cursor-pointer"
              >
                Close Preview
              </button>
              <button
                id="excerpt-order-now-btn"
                onClick={() => {
                  onClose();
                  onOrderBook();
                }}
                className="px-6 py-2.5 bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold uppercase tracking-wider rounded-full flex items-center gap-2 transition-colors cursor-pointer shadow-xs hover:-translate-y-0.5 active:translate-y-0"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#B5964A]" />
                Order Complete Book
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
