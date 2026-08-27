import React from 'react';
import { motion } from 'motion/react';
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
      className="w-full bg-[#FAFAF8] py-20 sm:py-28 border-t border-[#EAEAEA] scroll-mt-[76px]"
    >
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
        {/* Section Header Label */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center mb-16"
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
              className="bg-[#F4F3EB] rounded-[16px] p-8 flex flex-col justify-between transition-all duration-300 relative"
            >
              <div>
                {/* Quote Badge */}
                <div className="w-12 h-12 rounded-xl bg-[#EBE7D8] flex items-center justify-center mb-6">
                  <span className="text-[#111111] font-serif text-2xl leading-none mt-2">"</span>
                </div>

                {/* Review Body Text */}
                <p
                  id={`testimonial-quote-${index + 1}`}
                  className="text-[15px] sm:text-[16px] leading-[1.6] text-[#333333] font-medium mb-12"
                >
                  "{review.quote.replace(/^[“"]|[”"]$/g, '')}"
                </p>
              </div>

              {/* Bottom Attribution */}
              <div className="flex items-center gap-3">
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.author)}&background=B5964A&color=fff&rounded=true&size=48`}
                  alt={review.author} 
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div
                    id={`testimonial-author-${index + 1}`}
                    className="text-[13px] font-medium text-[#111111]"
                  >
                    {review.author}
                  </div>
                  {review.source && (
                    <div className="text-[11px] text-[#777777] font-normal mt-0.5">
                      {review.source}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
