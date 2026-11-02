import { imageFallback } from './imageFallback';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, RotateCcw } from 'lucide-react';
import { soundManager } from '../audio/soundManager';
import { triggerCelebration } from './ConfettiEffect';
import useTimeouts from './useTimeouts';

export default function GiftBoxSection({ story, onReset }) {
  const [isOpen, setIsOpen] = useState(false);
  const { schedule } = useTimeouts();

  const handleOpenGift = (e) => {
    setIsOpen(true);
    soundManager.playFanfare();
    const rect = e.currentTarget.getBoundingClientRect();
    triggerCelebration(rect.left / window.innerWidth, rect.top / window.innerHeight);
    schedule(() => {
      triggerCelebration(0.5, 0.4);
    }, 400);
  };

  const handleReset = () => {
    setIsOpen(false);
    if (onReset) onReset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    soundManager.playChime();
  };

  return (
    <section id="gift" className="py-24 px-6 bg-radial from-[#fae2e9]/70 via-[#fff5f7] to-[#fffaf8] text-center min-h-[700px] flex flex-col justify-center overflow-hidden">
      <div className="max-w-4xl mx-auto w-full">
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.25em] font-medium text-rose-400 mb-2 block">
            06 / Saved The Sweetest For Last
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-normal text-[#52373f] mb-2">
            {isOpen ? 'Happy Birthday, My Love!' : 'One last surprise'} <br />
            <em className="italic text-rose-500 font-serif">
              {isOpen ? 'My always & forever.' : 'just for you.'}
            </em>
          </h2>
        </div>

        {/* Gift Box or Revealed Card */}
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="closed-gift"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -25, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              {/* Interactive Gift Box */}
              <motion.button
                onClick={handleOpenGift}
                whileHover={{ scale: 1.05, rotate: -2 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-48 h-52 bg-transparent my-4 cursor-pointer group select-none"
                aria-label="Unwrap your birthday surprise"
              >
                {/* Glow behind gift */}
                <div className="absolute inset-0 bg-pink-200/50 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />

                {/* Bow */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 font-serif text-7xl text-[#d4af37] z-30 drop-shadow-sm select-none group-hover:scale-110 transition-transform">
                  ୨୧
                </div>

                {/* Lid */}
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-44 h-10 bg-gradient-to-r from-[#e7b1c3] to-[#f4c2d2] rounded-md shadow-md z-20 border-b border-[#cf9bb0]" />

                {/* Box Body */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-32 bg-gradient-to-tr from-[#dba1b5] to-[#f0bfcf] rounded-b-lg shadow-[0_15px_35px_rgba(173,123,133,0.35)] z-10" />

                {/* Golden Ribbon Vertical */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-7 h-42 bg-gradient-to-r from-[#ffdca8] via-[#fff1d0] to-[#ffd89e] z-25 shadow-xs" />
              </motion.button>

              <motion.button
                onClick={handleOpenGift}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="mt-6 inline-flex items-center gap-2.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-sm font-medium py-4 px-8 rounded-full shadow-[0_8px_20px_-4px_rgba(244,63,94,0.35)] transition-all cursor-pointer"
              >
                <span>Open Your Gift</span>
                <Sparkles className="w-4 h-4" />
              </motion.button>

              <p className="font-handwriting text-2xl text-rose-400 mt-4">
                wrapped with all the love in my heart ♡
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="opened-reveal"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="max-w-xl mx-auto bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-[0_20px_50px_rgba(185,102,128,0.18)] border border-pink-100 flex flex-col items-center"
            >
              {/* Photo in Heart Frame */}
              <div className="relative w-56 h-52 mb-8 [clip-path:polygon(50%_17%,61%_5%,78%_1%,94%_11%,100%_30%,95%_51%,79%_72%,50%_100%,21%_72%,5%_51%,0%_30%,6%_11%,22%_1%,39%_5%)] shadow-lg overflow-hidden group">
                <img
                  src={story.finalPhoto}
                  alt={`Forever with ${story.name}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={imageFallback}
                />
              </div>

              {/* Message */}
              <p className="font-serif text-xl md:text-2xl text-[#62464f] leading-relaxed mb-6 font-normal">
                "{story.finalMessage}"
              </p>

              {/* Forever declaration */}
              <div className="font-handwriting text-3xl md:text-4xl text-rose-500 mb-8 tracking-wide">
                {story.forever} ♡
              </div>

              {/* Reset / Experience Again Button */}
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 text-xs text-[#9d7380] hover:text-rose-600 transition-colors py-2 px-4 rounded-full hover:bg-rose-50 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Experience Our Story Again</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

