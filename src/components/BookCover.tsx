import React from 'react';
import { motion } from 'motion/react';
import { BookOpen } from 'lucide-react';
import heroBookImg from '../assets/images/ramblings_journal_1787042086006.jpg';

interface BookCoverProps {
  onQuickPreview?: () => void;
  className?: string;
}

export const BookCover: React.FC<BookCoverProps> = ({ onQuickPreview, className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* 3D Book Container */}
      <motion.div
        id="book-cover-container"
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="group relative cursor-pointer select-none"
        onClick={onQuickPreview}
      >
        {/* Soft Ambient Shadow */}
        <div className="absolute -bottom-5 left-4 right-4 h-8 bg-black/25 rounded-full blur-lg transform group-hover:scale-105 group-hover:blur-xl transition-all duration-300 pointer-events-none" />

        {/* Physical Book Cover Photograph Card */}
        <div
          id="book-cover"
          className="relative w-[300px] sm:w-[340px] md:w-[370px] aspect-[3/4] bg-[#F4F1EC] text-white overflow-hidden shadow-[0_30px_70px_-15px_rgba(0,0,0,0.18)] border border-[#EAEAEA] transition-all duration-300 rounded-[24px]"
        >
          <img
            src={heroBookImg}
            alt="Ramblings & Epiphanies: The Self Journal by Mimshach Obioha"
            className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500 ease-out"
            referrerPolicy="no-referrer"
          />

          {/* Hover Overlay "Click to Preview Excerpt" */}
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2.5 z-30 p-5 text-center">
            <div className="w-10 h-10 rounded-full bg-white text-[#111111] flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <BookOpen className="w-4 h-4 text-[#111111]" />
            </div>
            <span className="text-xs font-semibold text-white tracking-[2px] uppercase">
              LOOK INSIDE
            </span>
            <span className="text-[11px] text-neutral-200 tracking-wide">
              Read Sample Excerpt
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};


