import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  CheckSquare,
  Star,
  Check,
} from 'lucide-react';
import { CURRENT_BOOK } from '../data/bookData';
import heroBookImg from '../assets/images/ramblings_journal_1787042086006.jpg';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [showMore, setShowMore] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  if (!isOpen) return null;

  const unitPrice = 28.0;
  const totalPrice = (unitPrice * quantity).toFixed(2);

  const handleIncrement = () => setQuantity((prev) => Math.min(prev + 1, 20));
  const handleDecrement = () => setQuantity((prev) => Math.max(prev - 1, 1));

  const handleProceedToGateway = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const generatedOrderNum = `RMB-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderNumber(generatedOrderNum);
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1000);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setIsProcessing(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        id="order-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-sm overflow-y-auto"
        onClick={handleClose}
      >
        <motion.div
          id="order-modal-card"
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-[580px] bg-[#FFFFFF] text-[#111111] rounded-[20px] border border-[#EAEAEA] shadow-2xl p-6 sm:p-8 overflow-hidden my-auto"
          style={{
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
          }}
        >
          {/* Top Right Close Button */}
          <button
            id="close-order-modal-btn"
            onClick={handleClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 sm:top-5 sm:right-5 p-1.5 text-neutral-400 hover:text-neutral-700 transition-colors rounded-full hover:bg-neutral-100 cursor-pointer focus:outline-none"
          >
            <X className="w-5 h-5" strokeWidth={1.75} />
          </button>

          {/* Success Screen */}
          {isSuccess ? (
            <div className="py-6 text-center flex flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-14 h-14 rounded-full bg-[#111111] text-[#B5964A] flex items-center justify-center mb-4 border border-[#B5964A]/30 shadow-md"
              >
                <Check className="w-7 h-7 stroke-[2.5]" />
              </motion.div>

              <span className="text-[11px] font-bold tracking-[2px] uppercase text-[#B5964A] mb-1">
                ORDER SECURED • {orderNumber}
              </span>
              <h3
                className="text-2xl sm:text-3xl font-normal text-[#111111] mb-2"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Order Confirmed
              </h3>
              <p className="text-xs sm:text-sm text-[#5F5F5F] max-w-sm mb-6 leading-relaxed">
                Thank you for ordering <strong>{quantity} &times; {CURRENT_BOOK.title}</strong> (${totalPrice}). Your dispatch receipt and guided reflection bonuses have been delivered to your email.
              </p>

              <div className="w-full bg-[#FAFAF8] border border-[#EAEAEA] rounded-xl p-4 mb-6 text-left text-xs space-y-2">
                <div className="flex justify-between text-[#5F5F5F]">
                  <span>Item:</span>
                  <span className="font-semibold text-[#111111]">Clothbound Hardcover Edition</span>
                </div>
                <div className="flex justify-between text-[#5F5F5F]">
                  <span>Tracked Delivery:</span>
                  <span className="font-semibold text-[#111111]">FREE Launch Delivery</span>
                </div>
                <div className="flex justify-between text-[#5F5F5F] pt-2 border-t border-[#EAEAEA]">
                  <span className="font-bold text-[#111111]">Total Paid:</span>
                  <span className="font-bold font-mono text-[#B43B23] text-sm">${totalPrice}</span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="py-3 px-8 bg-[#111111] hover:bg-[#222222] text-white rounded-full text-xs font-semibold uppercase tracking-[1.5px] transition-all cursor-pointer shadow-sm"
              >
                Return to Journal
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-7">
              {/* Left Column: 3D Book Cover */}
              <div className="w-full sm:w-[170px] shrink-0 flex flex-col items-center sm:items-start">
                {/* 3D Realistic Book Mockup */}
                <div
                  id="modal-book-3d-wrapper"
                  className="relative w-[140px] sm:w-[160px] aspect-[3/4.2] group cursor-pointer"
                  onClick={() => setShowMore(!showMore)}
                >
                  {/* Soft ambient book shadow */}
                  <div
                    className="absolute -bottom-2.5 left-2 right-2 h-5 bg-black/40 rounded-full blur-md"
                    aria-hidden="true"
                  />

                  {/* 3D Book Spine Effect */}
                  <div className="relative w-full h-full rounded-r-[4px] rounded-l-[2px] overflow-hidden shadow-[0_12px_28px_rgba(0,0,0,0.25)] border-y border-r border-neutral-300/60 bg-[#1A1A1A]">
                    {/* Left Spine highlight */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-3.5 bg-gradient-to-r from-black/60 via-white/15 to-transparent z-10 pointer-events-none"
                      aria-hidden="true"
                    />

                    {/* Book Image */}
                    <img
                      src={heroBookImg}
                      alt={CURRENT_BOOK.title}
                      className="w-full h-full object-cover object-center"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Title, Author, Star Rating, Description, Quantity & Buy Now */}
              <div className="flex-1 w-full text-left flex flex-col justify-between">
                <div>
                  {/* Title */}
                  <h3
                    id="modal-book-title"
                    className="text-[22px] sm:text-[25px] font-bold text-[#182230] leading-tight tracking-tight mb-1 select-none"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    Ramblings &amp; Epiphanies
                  </h3>

                  {/* Author */}
                  <p
                    id="modal-book-author"
                    className="text-[14px] sm:text-[15px] font-normal text-[#4A5568] mb-2"
                    style={{ fontFamily: 'var(--font-editorial)' }}
                  >
                    Mimshach Obioha
                  </p>

                  {/* Star Rating Row */}
                  <div id="modal-rating-row" className="flex items-center gap-2 mb-3.5 select-none">
                    <div className="flex items-center gap-0.5 text-[#F5A623]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-[#F5A623] text-[#F5A623]"
                          strokeWidth={1}
                        />
                      ))}
                    </div>
                    <span className="text-[12px] text-[#718096] font-normal">
                      4.9 out of 5 stars
                    </span>
                  </div>

                  {/* Short Quote / Summary */}
                  <div id="modal-quote-block" className="mb-4 text-[13px] text-[#4A5568] leading-relaxed">
                    <p>
                      “Ramblings &amp; Epiphanies” is an invitation to reflect, question, disagree, and recognize yourself in authentic conversation.
                      {' '}
                      <button
                        type="button"
                        onClick={() => setShowMore(!showMore)}
                        className="text-[#C53030] hover:text-[#9B2C2C] font-medium ml-1 inline-flex items-center transition-colors cursor-pointer select-none"
                      >
                        {showMore ? 'Less<<' : 'More>>'}
                      </button>
                    </p>

                    {/* Expanded text */}
                    {showMore && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2 text-[12.5px] text-[#666666] border-t border-neutral-100 pt-2"
                      >
                        A beautifully crafted companion for those navigating creative journeys, personal philosophy, and intentional living. Hardcover foil-stamped edition with archival paper.
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Quantity & Price Row */}
                <div
                  id="modal-quantity-price-row"
                  className="flex items-center justify-between pt-3 pb-4 border-t border-neutral-100"
                >
                  {/* Quantity Controls */}
                  <div>
                    <label className="block text-[13px] font-medium text-[#2D3748] mb-1.5">
                      Quantity
                    </label>
                    <div className="flex items-center gap-2.5">
                      {/* Minus Button (grey rounded button) */}
                      <button
                        id="modal-qty-minus-btn"
                        type="button"
                        onClick={handleDecrement}
                        disabled={quantity <= 1}
                        className="w-7 h-7 rounded-[6px] bg-[#E2E8F0] hover:bg-[#CBD5E1] disabled:opacity-40 text-[#475569] font-bold flex items-center justify-center text-sm transition-colors cursor-pointer"
                      >
                        −
                      </button>

                      {/* Quantity Number */}
                      <span
                        id="modal-qty-value"
                        className="w-6 text-center text-[14px] font-semibold text-[#1A202C]"
                      >
                        {quantity}
                      </span>

                      {/* Plus Button (Green Pill/Square) */}
                      <button
                        id="modal-qty-plus-btn"
                        type="button"
                        onClick={handleIncrement}
                        className="w-7 h-7 rounded-[6px] bg-[#70C12E] hover:bg-[#60AF25] text-white font-bold flex items-center justify-center text-sm transition-colors cursor-pointer shadow-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Price Display */}
                  <div className="text-right">
                    <span className="block text-[13px] font-medium text-[#2D3748] mb-0.5">
                      Price
                    </span>
                    <span
                      id="modal-price-value"
                      className="text-[22px] sm:text-[24px] font-bold text-[#B43B23] tracking-tight font-mono"
                    >
                      ${totalPrice}
                    </span>
                  </div>
                </div>

                {/* Single Buy Now Button (Amber-Orange Pill) */}
                <div id="modal-actions-row" className="pt-1 flex justify-end">
                  <button
                    id="modal-buy-now-btn"
                    type="button"
                    onClick={handleProceedToGateway}
                    disabled={isProcessing}
                    className="w-full sm:w-auto min-w-[200px] inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[#F29F1C] hover:bg-[#DF8F14] active:scale-[0.98] text-white text-[13.5px] font-medium transition-all shadow-sm cursor-pointer select-none disabled:opacity-60"
                  >
                    <CheckSquare className="w-4 h-4" />
                    <span>{isProcessing ? 'Processing...' : 'Buy Now'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
