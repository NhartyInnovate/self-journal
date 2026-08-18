import React from 'react';
import { motion } from 'motion/react';
import { Square, Settings, Bookmark } from 'lucide-react';
import { TESTIMONIALS } from '../data/bookData';
import { Testimonial } from '../types';

interface TestimonialsProps {
  testimonials?: Testimonial[];
}

export const Testimonials: React.FC<TestimonialsProps> = ({
  testimonials = TESTIMONIALS,
}) => {
  const renderIcon = (iconName?: string, index: number = 0) => {
    const iconClass = "w-5 h-5 text-[#8E8E93] group-hover:text-[#111111] transition-colors duration-200";
    if (iconName === 'settings' || index === 1) {
      return <Settings className={iconClass} strokeWidth={1.8} />;
    }
    if (iconName === 'bookmark') {
      return <Bookmark className={iconClass} strokeWidth={1.8} />;
    }
    return <Square className={iconClass} strokeWidth={1.8} />;
  };

  return (
    <section
      id="testimonials-section"
      className="w-full bg-[#FAFAF8] py-16 sm:py-20 border-t border-[#EAEAEA] scroll-mt-[76px]"
    >
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
        {/* Section Header Label */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-2 mb-2 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B5964A] inline-block" />
            <p className="text-[11px] font-semibold tracking-[2px] uppercase text-[#B5964A]">
              READER REFLECTIONS &amp; REVIEWS
            </p>
          </div>
          <h2
            className="text-[26px] sm:text-[32px] font-normal text-[#111111] leading-tight"
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
              className="group bg-white rounded-[22px] p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 border border-[#EAEAEA] shadow-[0_8px_30px_-6px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.08)] hover:border-[#111111]/20"
            >
              <div>
                {/* Card Bold Header */}
                <h3
                  id={`testimonial-header-${index + 1}`}
                  className="text-[17px] sm:text-[18px] font-semibold text-[#18181B] tracking-tight leading-snug mb-3.5"
                >
                  {review.header || (index === 0 ? 'Clarity & Introspection' : index === 1 ? 'Vulnerability & Depth' : 'Essential Companion')}
                </h3>

                {/* Review Body Text */}
                <p
                  id={`testimonial-quote-${index + 1}`}
                  className="text-[14px] sm:text-[14.5px] leading-[1.7] text-[#555555] font-normal mb-6"
                >
                  {review.quote}
                </p>
              </div>

              {/* Bottom Icon Row with subtle author label */}
              <div className="pt-2 flex items-center justify-between">
                <div
                  id={`testimonial-icon-${index + 1}`}
                  className="flex items-center justify-center"
                >
                  {renderIcon(review.icon, index)}
                </div>

                {review.author && (
                  <span
                    id={`testimonial-author-${index + 1}`}
                    className="text-[11px] font-medium tracking-[1px] uppercase text-[#8E8E93]"
                  >
                    {review.author}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

