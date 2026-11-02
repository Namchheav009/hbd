import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Award } from 'lucide-react';
import { soundManager } from '../audio/soundManager';
import { triggerCelebration } from './ConfettiEffect';
import useTimeouts from './useTimeouts';

export default function ReasonsSection({ reasons }) {
  const [opened, setOpened] = useState([]);
  const [unlockedAll, setUnlockedAll] = useState(false);
  const { schedule } = useTimeouts();

  const toggleReason = (index, e) => {
    if (opened.includes(index)) {
      setOpened(opened.filter((i) => i !== index));
      soundManager.playPop();
    } else {
      const nextOpened = [...opened, index];
      setOpened(nextOpened);
      soundManager.playChime();

      // Trigger sparkle from button position
      const rect = e.currentTarget.getBoundingClientRect();
      triggerCelebration(rect.left / window.innerWidth, rect.top / window.innerHeight);

      if (nextOpened.length === reasons.length && !unlockedAll) {
        setUnlockedAll(true);
        schedule(() => {
          soundManager.playFanfare();
          triggerCelebration(0.5, 0.5);
        }, 300);
      }
    }
  };

  const progressPercent = reasons.length ? Math.round((opened.length / reasons.length) * 100) : 0;

  return (
    <section id="reasons" className="py-20 px-6 bg-[#fffaf8]">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.25em] font-medium text-rose-400 mb-2 block">
            02 / It’s Always The Little Things
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-normal text-[#52373f] mb-3">
            Ten little reasons. <br />
            <em className="italic text-rose-500 font-serif">One very big love.</em>
          </h2>
          <p className="text-xs md:text-sm text-[#8c6f76] font-light">
            There are a thousand reasons why I love you. Here are ten to hold close to your heart.
          </p>
          <div className="font-handwriting text-2xl text-rose-400 mt-2">
            tap a heart to reveal a little truth ↴
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-xs mx-auto mb-10 text-center">
          <div className="flex justify-between items-center text-[11px] font-medium text-[#8c6f76] mb-1.5">
            <span>Progress</span>
            <span className="text-rose-500 font-semibold">{opened.length} of {reasons.length} discovered</span>
          </div>
          <div className="w-full h-2 bg-pink-100 rounded-full overflow-hidden p-0.5">
            <motion.div
              className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Hearts Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 max-w-5xl mx-auto">
          {reasons.map((reason, index) => {
            const isRevealed = opened.includes(index);

            return (
              <motion.button
                aria-pressed={isRevealed}
                key={reason + index}
                onClick={(e) => toggleReason(index, e)}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.96 }}
                className={`relative aspect-[1/1.05] rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer border select-none ${
                  isRevealed
                    ? 'bg-gradient-to-br from-[#fff2f5] to-[#ffe8ef] border-rose-300 shadow-[0_8px_20px_-5px_rgba(244,143,177,0.35)]'
                    : 'bg-white/80 hover:bg-rose-50/50 border-pink-100/90 shadow-[0_4px_15px_-3px_rgba(185,102,128,0.08)]'
                }`}
              >
                {/* Background faint heart */}
                <Heart
                  className={`absolute inset-0 w-full h-full p-2 transition-colors duration-300 pointer-events-none ${
                    isRevealed ? 'text-rose-200/40 fill-rose-100/30' : 'text-pink-100/60 fill-pink-50/40'
                  }`}
                  strokeWidth={0.5}
                />

                {isRevealed ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 flex flex-col items-center justify-center h-full px-1"
                  >
                    <span className="font-handwriting text-lg md:text-xl text-[#623c47] leading-snug">
                      "{reason}"
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-rose-400 mt-2 font-medium">
                      #{String(index + 1).padStart(2, '0')}
                    </span>
                  </motion.div>
                ) : (
                  <div className="relative z-10 flex flex-col items-center">
                    <Heart className="w-8 h-8 text-rose-400 fill-rose-300/30 mb-2 animate-pulse" strokeWidth={1.5} />
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#a58890] font-medium">
                      Reason
                    </span>
                    <span className="font-serif text-2xl text-[#644a50] font-normal">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* All reasons unlocked bonus celebration */}
        <AnimatePresence>
          {unlockedAll && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 max-w-lg mx-auto bg-gradient-to-r from-rose-50 via-pink-50 to-rose-50 border border-rose-200 rounded-2xl p-6 text-center shadow-lg shadow-rose-100/60"
            >
              <div className="w-12 h-12 bg-rose-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md shadow-rose-300">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl text-[#52373f] mb-1">
                You Unlocked My Whole Heart! ✨
              </h3>
              <p className="text-xs text-[#825e67] leading-relaxed">
                Thank you for being the most precious blessing in my life. Every single day with you is a gift I cherish beyond words.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

