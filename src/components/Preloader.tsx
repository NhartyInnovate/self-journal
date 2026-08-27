import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const Preloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Artificial delay to show the loader (reduced by half)
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // give time for fade out
    }, 750);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-[#FAFAF8] flex flex-col items-center justify-center"
        >
          {/* Round spiral loader taking the color of the website theme (#B5964A) */}
          <div className="relative w-16 h-16">
            <motion.span
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#B5964A] border-r-[#B5964A]"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <motion.span
              className="absolute inset-2 rounded-full border-4 border-transparent border-b-[#B5964A] border-l-[#B5964A] opacity-60"
              animate={{ rotate: -360 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
