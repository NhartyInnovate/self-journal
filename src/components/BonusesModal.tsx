import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, FileText, Map, Headphones, BookOpen, Check, Play, Pause } from 'lucide-react';
import { BONUSES_LIST } from '../data/bookData';

interface BonusesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BonusesModal: React.FC<BonusesModalProps> = ({ isOpen, onClose }) => {
  const [downloadedItems, setDownloadedItems] = useState<Record<string, boolean>>({});
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!isOpen) return null;

  const handleDownload = (id: string, title: string) => {
    setDownloadedItems((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      // simulated download feedback
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div
        id="bonuses-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          id="bonuses-modal-card"
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-white text-[#111111] rounded-xl border border-[#EAEAEA] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="bg-[#111111] text-white px-6 py-5 flex items-center justify-between border-b border-neutral-800">
            <div>
              <span className="text-[10px] font-bold tracking-[2px] uppercase text-[#B5964A] block mb-0.5">
                EXCLUSIVE READER VAULT
              </span>
              <h3
                className="text-xl sm:text-2xl font-normal text-white"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Reader Bonuses &amp; Reflection Materials
              </h3>
            </div>
            <button
              id="close-bonuses-modal-btn"
              onClick={onClose}
              className="p-1.5 text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body List */}
          <div className="p-6 overflow-y-auto space-y-4">
            <p className="text-xs text-[#5F5F5F] leading-relaxed mb-2">
              As a reader of Ramblings &amp; Epiphanies, enjoy these complimentary digital companion guides, reflection frameworks, daily habit templates, and guided audio intros.
            </p>

            <div className="grid grid-cols-1 gap-3.5">
              {BONUSES_LIST.map((item) => {
                const isDownloaded = downloadedItems[item.id];
                return (
                  <div
                    key={item.id}
                    className="p-4 bg-[#FAFAF8] border border-[#EAEAEA] rounded-[2px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#B5964A]/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-[#111111] text-white flex items-center justify-center shrink-0 mt-0.5 rounded-[2px]">
                        {item.iconName === 'FileText' && <FileText className="w-4 h-4 text-[#B5964A]" />}
                        {item.iconName === 'Map' && <Map className="w-4 h-4 text-[#B5964A]" />}
                        {item.iconName === 'Headphones' && <Headphones className="w-4 h-4 text-[#B5964A]" />}
                        {item.iconName === 'BookOpen' && <BookOpen className="w-4 h-4 text-[#B5964A]" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-[#B5964A]">
                            {item.category}
                          </span>
                          <span className="text-[9px] text-neutral-300">•</span>
                          <span className="text-[9px] text-[#888888] font-mono">
                            {item.fileSize}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-[#111111]">{item.title}</h4>
                        <p className="text-xs text-[#5F5F5F] mt-0.5 leading-normal">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {item.iconName === 'Headphones' && (
                        <button
                          onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                          className="px-3.5 py-1.5 rounded-full bg-neutral-200 hover:bg-neutral-300 text-[#111111] text-[11px] font-semibold tracking-wider uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          {isPlayingAudio ? (
                            <>
                              <Pause className="w-3 h-3" /> Pause
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3" /> Preview
                            </>
                          )}
                        </button>
                      )}

                      <button
                        id={`download-bonus-${item.id}`}
                        onClick={() => handleDownload(item.id, item.title)}
                        className={`px-4 py-1.5 text-[11px] font-semibold tracking-[1.5px] uppercase rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
                          isDownloaded
                            ? 'bg-[#70C12E]/15 text-[#70C12E] border border-[#70C12E]/30'
                            : 'bg-[#111111] text-white hover:bg-[#222222]'
                        }`}
                      >
                        {isDownloaded ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Downloaded
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5 text-[#B5964A]" /> Download
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {isPlayingAudio && (
              <div className="p-3 bg-[#111111] text-white rounded-[2px] flex items-center justify-between text-xs animate-pulse">
                <div className="flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-[#B5964A]" />
                  <span>Playing: <strong>Mimshach Obioha — Philosophy Intro</strong></span>
                </div>
                <span className="font-mono text-neutral-300">01:42 / 28:00</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-[#FAFAF8] px-6 py-3.5 flex items-center justify-between text-xs text-[#5F5F5F] border-t border-[#EAEAEA]">
            <span>Free for readers &amp; newsletter subscribers</span>
            <button
              onClick={onClose}
              className="font-semibold text-[#111111] hover:text-[#B5964A] uppercase tracking-wider text-[11px] cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
