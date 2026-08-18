import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Book, Award, Feather, Sparkles } from 'lucide-react';
import { AUTHOR_BIO } from '../data/bookData';

interface BioDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BioDetailModal: React.FC<BioDetailModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        id="bio-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          id="bio-modal-card"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-white text-[#111111] rounded-2xl border border-[#EAEAEA] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="bg-[#111111] text-white px-6 py-5 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#B5964A]" />
              <div>
                <span className="text-[10px] uppercase tracking-[2px] text-[#B5964A] block font-semibold">
                  AUTHOR BIOGRAPHY
                </span>
                <h3
                  className="text-xl sm:text-2xl font-normal text-white"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {AUTHOR_BIO.name}
                </h3>
              </div>
            </div>
            <button
              id="close-bio-modal-btn"
              onClick={onClose}
              className="p-1.5 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-28 sm:w-32 aspect-[3/4] rounded-lg overflow-hidden border border-[#EAEAEA] shadow-md bg-[#111111] shrink-0">
                <img
                  src="/src/assets/images/mimshach_obioha_portrait_1787044786544.jpg"
                  alt="Mimshach Obioha"
                  className="w-full h-full object-cover filter grayscale contrast-[1.08]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h4
                  className="text-2xl font-normal text-[#111111]"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {AUTHOR_BIO.name}
                </h4>
                <p className="text-xs text-[#B5964A] font-medium flex items-center gap-1.5 mt-0.5 uppercase tracking-wider">
                  <Feather className="w-3.5 h-3.5" /> Author &amp; Creator of The Self Journal
                </p>
                <p className="text-xs sm:text-sm text-[#5F5F5F] leading-relaxed mt-3">
                  {AUTHOR_BIO.extendedBio}
                </p>
              </div>
            </div>

            {/* Selected Works */}
            <div className="border-t border-[#EAEAEA] pt-5">
              <h5 className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#111111] mb-3 flex items-center gap-1.5">
                <Book className="w-3.5 h-3.5 text-[#B5964A]" /> Featured Publication
              </h5>
              <div className="grid grid-cols-1 gap-2.5">
                {AUTHOR_BIO.notableWorks.map((work, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-[#FAFAF8] border border-[#EAEAEA] rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#111111]">{work.title}</div>
                      <div className="text-[10px] text-[#777777]">{work.type}</div>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#B5964A]">
                      {work.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Inquiries */}
            <div className="border-t border-[#EAEAEA] pt-4 bg-[#FAFAF8] p-4 rounded-xl text-xs text-[#5F5F5F] space-y-1">
              <div className="font-bold text-[#111111] uppercase tracking-wider text-[11px] mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#B5964A]" /> Reader Inquiries &amp; Circle
              </div>
              <p>For book clubs, reflection group guides, and speaking notes, connect through the reader circle on the website.</p>
            </div>
          </div>

          <div className="bg-[#FAFAF8] px-6 py-3.5 flex justify-end border-t border-[#EAEAEA]">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold uppercase tracking-[1.5px] rounded-full transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
