import React from 'react';
import { motion } from 'motion/react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import { TESTIMONIALS } from '../data/bookData';
import { Testimonial } from '../types';

interface TestimonialsProps {
  testimonials?: Testimonial[];
}

export const Testimonials: React.FC<TestimonialsProps> = ({
  testimonials = TESTIMONIALS,
}) => {
  return (
    <section
      id="testimonials-section"
      className="w-full bg-[#FAFAF8] py-16 sm:py-24 border-t border-[#EAEAEA] scroll-mt-[76px]"
    >
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
        {/* Section Header Label */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center mb-12 sm:mb-14"
        >
          <div className="flex items-center justify-center gap-2 mb-2.5 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B5964A] inline-block" />
            <p className="text-[11px] font-semibold tracking-[2px] uppercase text-[#B5964A]">
              READER REFLECTIONS &amp; REVIEWS
            </p>
          </div>
          <h2
            className="text-[28px] sm:text-[34px] font-normal text-[#111111] leading-tight"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Words From The Community
          </h2>
        </motion.div>

        {/* Testimonial Cards Grid */}
        <div
          id="testimonials-grid"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch"
        >
          {testimonials.map((review, index) => (
            <motion.div
              key={review.id || index}
              id={`testimonial-card-${index + 1}`}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
              className="group bg-white rounded-[20px] p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 border border-[#EAEAEA] shadow-[0_8px_30px_-6px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.08)] hover:border-[#B5964A]/30 relative overflow-hidden"
            >
              {/* Subtle top-right decorative quote watermark */}
              <div
                className="absolute top-4 right-5 text-neutral-100 group-hover:text-[#B5964A]/10 transition-colors pointer-events-none"
                aria-hidden="true"
              >
                <Quote className="w-10 h-10 transform -scale-x-100" />
              </div>

              <div className="relative z-10">
                {/* 5-Star Rating Row in Antique Gold */}
                <div
                  id={`testimonial-rating-${index + 1}`}
                  className="flex items-center gap-1 mb-4 text-[#B5964A]"
                  aria-label="5 out of 5 stars"
                >
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-[#B5964A] text-[#B5964A]"
                      strokeWidth={1}
                    />
                  ))}
                </div>

                {/* Card Editorial Header */}
                <h3
                  id={`testimonial-header-${index + 1}`}
                  className="text-[17px] sm:text-[18px] font-semibold text-[#18181B] tracking-tight leading-snug mb-3"
                >
                  {review.header || (index === 0 ? 'Clarity & Introspection' : index === 1 ? 'Vulnerability & Depth' : 'Essential Companion')}
                </h3>

                {/* Review Body Text */}
                <p
                  id={`testimonial-quote-${index + 1}`}
                  className="text-[14px] sm:text-[14.5px] leading-[1.7] text-[#555555] font-normal mb-6 italic"
                  style={{ fontFamily: 'var(--font-editorial)' }}
                >
                  “{review.quote.replace(/^[“"]|[”"]$/g, '')}”
                </p>
              </div>

              {/* Bottom Attribution Bar with Verified Reader Icon */}
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#FAFAF8] border border-[#EAEAEA] flex items-center justify-center text-[#B5964A] group-hover:bg-[#111111] group-hover:text-[#B5964A] transition-colors">
                    <Quote className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div
                      id={`testimonial-author-${index + 1}`}
                      className="text-[12px] font-semibold text-[#111111]"
                    >
                      {review.author}
                    </div>
                    {review.source && (
                      <div className="text-[10.5px] text-[#888888] font-normal">
                        {review.source}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-[#70C12E] font-medium bg-[#70C12E]/10 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
