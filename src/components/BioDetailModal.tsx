import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Book, Award, Calendar, Mail, MapPin } from 'lucide-react';
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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
        onClick={onClose}
      >
        <motion.div
          id="bio-modal-card"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-white text-[#363636] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          style={{ borderRadius: '0px' }}
        >
          {/* Header */}
          <div className="bg-[#363636] text-white px-6 py-5 flex items-center justify-between">
            <div>
              <span className="text-[9px] uppercase tracking-[2px] text-neutral-300 block">
                AUTHOR INFORMATION
              </span>
              <h3
                className="text-xl sm:text-2xl font-normal text-white"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                About {AUTHOR_BIO.name}
              </h3>
            </div>
            <button
              id="close-bio-modal-btn"
              onClick={onClose}
              className="p-1 text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop&sat=-100&contrast=120"
                alt="Mimshach Obioha"
                className="w-28 h-28 object-cover filter grayscale contrast-110 shadow-sm border border-neutral-300 shrink-0"
              />
              <div>
                <h4 className="text-lg font-bold text-[#111111]">{AUTHOR_BIO.name}</h4>
                <p className="text-xs text-neutral-500 flex items-center gap-1.5 mt-0.5">
                  <Book className="w-3.5 h-3.5" /> Author &amp; Creator of The Self Journal
                </p>
                <p className="text-xs sm:text-sm text-[#444444] leading-relaxed mt-2.5">
                  {AUTHOR_BIO.shortBio}
                </p>
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-4 space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                Author Notes &amp; Status
              </h5>
              <p className="text-xs sm:text-[13px] text-[#555555] leading-relaxed">
                {AUTHOR_BIO.extendedBio}
              </p>
            </div>

            {/* Selected Bibliography */}
            <div className="border-t border-neutral-200 pt-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-800 mb-3 flex items-center gap-1.5">
                <Book className="w-3.5 h-3.5 text-neutral-600" /> Publications
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {AUTHOR_BIO.notableWorks.map((work, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#F8F7F5] border border-neutral-200 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#111111]">{work.title}</div>
                      <div className="text-[10px] text-neutral-500">{work.type}</div>
                    </div>
                    <span className="text-xs font-mono font-bold text-neutral-600">
                      {work.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Inquiries */}
            <div className="border-t border-neutral-200 pt-4 bg-[#F8F7F5] p-4 border text-xs text-neutral-600 space-y-1">
              <div className="font-bold text-neutral-800 uppercase tracking-wider text-[11px] mb-1">
                Inquiries &amp; Speaking
              </div>
              <p>For book clubs, speaking requests, or general reflections, join the reader circle on the website.</p>
            </div>
          </div>

          <div className="bg-[#EEEEEE] px-6 py-3.5 flex justify-end border-t border-neutral-300">
            <button
              onClick={onClose}
              className="px-5 py-1.5 bg-[#000000] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#363636] transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
