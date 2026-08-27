import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckSquare, Star, Check, Loader2 } from 'lucide-react';
import { CURRENT_BOOK } from '../data/bookData';
import heroBookImg from '../assets/images/ramblings_journal_1787042086006.jpg';
import PaystackPop from '@paystack/inline-js';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [showMore, setShowMore] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Status states: 'idle' | 'confirming' | 'success' | 'error'
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'confirming' | 'success' | 'error'>('idle');
  const [orderNumber, setOrderNumber] = useState('');
  
  // Customer details
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  // Pricing from DB
  const [unitPrice, setUnitPrice] = useState<number | null>(null);
  const [preordersOpen, setPreordersOpen] = useState<boolean>(true);
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsLoadingPrice(true);
      // Append a cache-buster timestamp to ensure the browser doesn't serve a stale HTML response
      fetch(`/api/product?t=${Date.now()}`)
        .then(async (res) => {
          if (!res.ok) {
            let serverError = 'Failed to fetch price';
            try {
              const errorData = await res.json();
              serverError = errorData.error || serverError;
            } catch (e) {
              // Ignore JSON parse errors for non-JSON responses
            }
            throw new Error(`[${res.status}] ${serverError}`);
          }
          return res.json();
        })
        .then((data) => {
          setUnitPrice(data.price);
          setPreordersOpen(data.preorders_open !== false);
          setIsLoadingPrice(false);
        })
        .catch((err) => {
          console.error(err);
          setPriceError(`Error: ${err.message || 'Unknown network error'}`);
          setIsLoadingPrice(false);
        });
    } else {
      // Reset state when closed
      setPaymentStatus('idle');
      setIsProcessing(false);
      setQuantity(1);
      setCustomerName('');
      setCustomerEmail('');
      setPriceError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalPrice = unitPrice ? (unitPrice * quantity) : 0;
  // Format Naira
  const displayTotal = totalPrice.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handleIncrement = () => setQuantity((prev) => Math.min(prev + 20, prev + 1));
  const handleDecrement = () => setQuantity((prev) => Math.max(prev - 1, 1));

  const pollOrderStatus = async (orderId: string) => {
    try {
      const res = await fetch(`/api/order-status?id=${orderId}`);
      if (!res.ok) return false;
      const data = await res.json();
      return data.payment_status === 'PAID';
    } catch (e) {
      return false;
    }
  };

  const startPolling = (orderId: string) => {
    let attempts = 0;
    const maxAttempts = 20; // 20 * 3s = 60s
    
    const interval = setInterval(async () => {
      attempts++;
      const isPaid = await pollOrderStatus(orderId);
      
      if (isPaid) {
        clearInterval(interval);
        setPaymentStatus('success');
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
        setPaymentStatus('error'); // Timeout or manual check needed
      }
    }, 3000);
  };

  const handleProceedToGateway = async () => {
    if (!customerName.trim() || !customerEmail.trim()) {
      alert("Please enter your name and email to proceed.");
      return;
    }

    setIsProcessing(true);
    setPriceError('');

    try {
      // 1. Create Order
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName,
          customer_email: customerEmail,
          quantity
        })
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      const order = orderData.order;
      setOrderNumber(order.id);

      // 2. Initialize Paystack
      const paystack = new PaystackPop();
      paystack.newTransaction({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: customerEmail,
        amount: order.total_amount * 100,
        reference: order.payment_reference,
        onSuccess: (transaction: any) => {
          // DO NOT TRUST UI SUCCESS. Transition to confirming state.
          setPaymentStatus('confirming');
          startPolling(order.id);
        },
        onCancel: () => {
          setIsProcessing(false);
        }
      });
    } catch (error: any) {
      console.error(error);
      setPriceError(error.message || 'Payment initialization failed');
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        id="order-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-sm overflow-y-auto"
        onClick={paymentStatus === 'confirming' ? undefined : handleClose}
      >
        <motion.div
          id="order-modal-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-[580px] bg-[#FFFFFF] text-[#111111] rounded-[20px] border border-[#EAEAEA] shadow-2xl p-6 sm:p-8 overflow-hidden my-auto"
          style={{ boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)' }}
        >
          <button
            id="close-order-modal-btn"
            onClick={paymentStatus === 'confirming' ? undefined : handleClose}
            disabled={paymentStatus === 'confirming'}
            aria-label="Close modal"
            className="absolute top-4 right-4 sm:top-5 sm:right-5 p-1.5 text-neutral-400 hover:text-neutral-700 transition-colors rounded-full hover:bg-neutral-100 cursor-pointer focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" strokeWidth={1.75} />
          </button>

          {paymentStatus === 'confirming' ? (
            <div className="py-12 text-center flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 animate-spin text-[#F29F1C] mb-4" />
              <h3 className="text-xl font-semibold mb-2">Payment received. Confirming your order...</h3>
              <p className="text-sm text-neutral-500">Please wait while we verify the transaction with our servers.</p>
            </div>
          ) : paymentStatus === 'error' ? (
            <div className="py-12 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <X className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verification Delayed</h3>
              <p className="text-sm text-neutral-500 mb-6">
                Your payment is taking longer than usual to confirm. You will receive an email once it goes through. Do not pay again.
              </p>
              <button
                onClick={handleClose}
                className="py-2 px-6 bg-neutral-900 text-white rounded-full text-sm font-medium"
              >
                Close
              </button>
            </div>
          ) : paymentStatus === 'success' ? (
            <div className="py-6 text-center flex flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-14 h-14 rounded-full bg-[#111111] text-[#B5964A] flex items-center justify-center mb-4 border border-[#B5964A]/30 shadow-md"
              >
                <Check className="w-7 h-7 stroke-[2.5]" />
              </motion.div>
              <span className="text-[11px] font-bold tracking-[2px] uppercase text-[#B5964A] mb-1">
                ORDER SECURED • {orderNumber.substring(0,8).toUpperCase()}
              </span>
              <h3
                className="text-2xl sm:text-3xl font-normal text-[#111111] mb-2"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Order Confirmed
              </h3>
              <div className="text-xs sm:text-sm text-[#5F5F5F] max-w-sm mb-6 leading-relaxed space-y-2">
                <p>Thank you for ordering <strong>{quantity} &times; {CURRENT_BOOK.title}</strong>.</p>
                <p>Your preorder has been confirmed.</p>
                <p>A confirmation email has been sent to your email address.</p>
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
              {/* Left Column: Book Cover */}
              <div className="w-full sm:w-[170px] shrink-0 flex flex-col items-center sm:items-start">
                <div
                  className="relative w-[140px] sm:w-[160px] aspect-[3/4.2] group cursor-pointer"
                  onClick={() => setShowMore(!showMore)}
                >
                  <div className="absolute -bottom-2.5 left-2 right-2 h-5 bg-black/40 rounded-full blur-md" />
                  <div className="relative w-full h-full rounded-r-[4px] rounded-l-[2px] overflow-hidden shadow-[0_12px_28px_rgba(0,0,0,0.25)] border-y border-r border-neutral-300/60 bg-[#1A1A1A]">
                    <div className="absolute left-0 top-0 bottom-0 w-3.5 bg-gradient-to-r from-black/60 via-white/15 to-transparent z-10 pointer-events-none" />
                    <img src={heroBookImg} alt={CURRENT_BOOK.title} className="w-full h-full object-cover object-center" />
                  </div>
                </div>
              </div>

              {/* Right Column: Info & Form */}
              <div className="flex-1 w-full text-left flex flex-col justify-between">
                <div>
                  <h3 id="modal-title" className="text-[22px] sm:text-[25px] font-bold text-[#182230] leading-tight tracking-tight mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
                    Ramblings &amp; Epiphanies
                  </h3>
                  <p className="text-[14px] sm:text-[15px] font-normal text-[#4A5568] mb-2" style={{ fontFamily: 'var(--font-editorial)' }}>
                    Mimshach Obioha
                  </p>
                  
                  {/* Customer Details Form */}
                  <div className="mt-4 space-y-3 mb-4">
                    <div>
                      <label htmlFor="customerName" className="block text-xs font-medium text-neutral-600 mb-1">Full Name</label>
                      <input 
                        id="customerName"
                        type="text" 
                        required
                        value={customerName}
                        onChange={e => setCustomerName(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-neutral-400"
                        placeholder="Jane Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="customerEmail" className="block text-xs font-medium text-neutral-600 mb-1">Email Address</label>
                      <input 
                        id="customerEmail"
                        type="email" 
                        required
                        value={customerEmail}
                        onChange={e => setCustomerEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-neutral-400"
                        placeholder="jane@example.com"
                      />
                    </div>
                  </div>
                  
                  {priceError && <p className="text-red-500 text-xs mb-2">{priceError}</p>}
                </div>

                <div className="flex items-center justify-between pt-3 pb-4 border-t border-neutral-100">
                  <div>
                    <label className="block text-[13px] font-medium text-[#2D3748] mb-1.5">Quantity</label>
                    <div className="flex items-center gap-2.5">
                      <button type="button" onClick={handleDecrement} disabled={quantity <= 1} className="w-7 h-7 rounded-[6px] bg-[#E2E8F0] hover:bg-[#CBD5E1] disabled:opacity-40 text-[#475569] font-bold flex items-center justify-center text-sm transition-colors cursor-pointer">−</button>
                      <span className="w-6 text-center text-[14px] font-semibold text-[#1A202C]">{quantity}</span>
                      <button type="button" onClick={handleIncrement} className="w-7 h-7 rounded-[6px] bg-[#70C12E] hover:bg-[#60AF25] text-white font-bold flex items-center justify-center text-sm transition-colors cursor-pointer shadow-xs">+</button>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="block text-[13px] font-medium text-[#2D3748] mb-0.5">Total Price</span>
                    <span className="text-[22px] sm:text-[24px] font-bold text-[#B43B23] tracking-tight font-mono">
                      {isLoadingPrice ? <Loader2 className="w-5 h-5 animate-spin inline-block text-neutral-400" /> : `₦${displayTotal}`}
                    </span>
                  </div>
                </div>

                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={handleProceedToGateway}
                    disabled={isProcessing || isLoadingPrice || !unitPrice || !preordersOpen}
                    className="w-full sm:w-auto min-w-[200px] inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[#F29F1C] hover:bg-[#DF8F14] active:scale-[0.98] text-white text-[13.5px] font-medium transition-all shadow-sm cursor-pointer select-none disabled:opacity-60"
                  >
                    <CheckSquare className="w-4 h-4" />
                    <span>{!preordersOpen ? 'Preorders Closed' : isProcessing ? 'Processing...' : 'Buy Now'}</span>
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
