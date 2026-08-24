import React, { useState } from 'react';
import { Header } from '../components/Header';
import { HeroBook } from '../components/HeroBook';
import { ConversationalCadence } from '../components/ConversationalCadence';
import { Testimonials } from '../components/Testimonials';
import { Newsletter } from '../components/Newsletter';
import { AuthorSection } from '../components/AuthorSection';
import { ClosingInvitation } from '../components/ClosingInvitation';
import { Footer } from '../components/Footer';
import { OrderModal } from '../components/OrderModal';
import { BonusesModal } from '../components/BonusesModal';
import { ExcerptModal } from '../components/ExcerptModal';

import { BioDetailModal } from '../components/BioDetailModal';
import { CURRENT_BOOK, TESTIMONIALS } from '../data/bookData';

export default function LandingPage() {
  // Modal State
  const [isBonusesOpen, setIsBonusesOpen] = useState(false);
  const [isExcerptOpen, setIsExcerptOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isBioOpen, setIsBioOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#363636] selection:bg-[#363636] selection:text-white">
      {/* 1. Header Navigation Bar */}
      <Header
        onOpenOrder={() => setIsOrderOpen(true)}
      />

      {/* Main Page Flow */}
      <main className="flex-1 w-full">
        {/* 1. Hero / Book Section */}
        <HeroBook
          book={CURRENT_BOOK}
          onLearnMore={() => setIsExcerptOpen(true)}
          onOrderAmazon={() => setIsOrderOpen(true)}
          onQuickPreview={() => setIsExcerptOpen(true)}
        />

        {/* 2. Conversational Cadence / The Journal Section */}
        <ConversationalCadence />

        {/* 3. About the Author Section */}
        <AuthorSection onLearnMoreBio={() => setIsBioOpen(true)} />

        {/* 4. Review & Reflection / Testimonials Section (Below Author Section) */}
        <Testimonials testimonials={TESTIMONIALS} />

        {/* 5. Climax Invitation / Final Call-to-Action Section */}
        <ClosingInvitation onOrderClick={() => setIsOrderOpen(true)} />

        {/* 6. Join The Conversation / Newsletter Section (Before Footer) */}
        <Newsletter onBonusUnlocked={() => setIsBonusesOpen(true)} />
      </main>

      {/* Footer */}
      <Footer
        onOpenBonuses={() => setIsBonusesOpen(true)}
        onOpenOrder={() => setIsOrderOpen(true)}
      />

      {/* Modals */}
      <BonusesModal isOpen={isBonusesOpen} onClose={() => setIsBonusesOpen(false)} />

      <ExcerptModal
        isOpen={isExcerptOpen}
        onClose={() => setIsExcerptOpen(false)}
        onOrderBook={() => setIsOrderOpen(true)}
      />

      <OrderModal
        isOpen={isOrderOpen}
        onClose={() => setIsOrderOpen(false)}
      />

      <BioDetailModal isOpen={isBioOpen} onClose={() => setIsBioOpen(false)} />
    </div>
  );
}

