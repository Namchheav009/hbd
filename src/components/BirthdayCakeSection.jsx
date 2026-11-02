import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RotateCcw, Heart } from 'lucide-react';
import { soundManager } from '../audio/soundManager';
import { triggerCelebration } from './ConfettiEffect';
import useTimeouts from './useTimeouts';

export default function BirthdayCakeSection({ story }) {
  // Candle states: true = lit, false = blown
  const [candles, setCandles] = useState([true, true, true, true, true]);
  const [allBlown, setAllBlown] = useState(false);
  const [wish, setWish] = useState('');
  const { schedule, clear } = useTimeouts();

  const blowSingleCandle = (index, e) => {
    if (!candles[index]) return;
    const nextCandles = [...candles];
    nextCandles[index] = false;
    setCandles(nextCandles);
    soundManager.playBlow();

    const rect = e.currentTarget.getBoundingClientRect();
    triggerCelebration(rect.left / window.innerWidth, rect.top / window.innerHeight);

    if (nextCandles.every((c) => !c)) {
      setAllBlown(true);
      schedule(() => {
        soundManager.playFanfare();
        triggerCelebration(0.5, 0.4);
      }, 400);
    }
  };

  const blowAllCandles = (e) => {
    setCandles([false, false, false, false, false]);
    setAllBlown(true);
    soundManager.playBlow();

    const rect = e.currentTarget.getBoundingClientRect();
    triggerCelebration(rect.left / window.innerWidth, rect.top / window.innerHeight);
    schedule(() => {
      soundManager.playFanfare();
      triggerCelebration(0.5, 0.4);
    }, 500);
  };

  const relightCandles = () => {
    clear();
    setCandles([true, true, true, true, true]);
    setAllBlown(false);
    soundManager.playChime();
  };

  return (
    <section id="wish" className="py-24 px-6 bg-radial from-[#fae5e1]/60 via-[#fff8f5] to-[#fffaf6] text-center border-b border-pink-100/60 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.25em] font-medium text-rose-400 mb-2 block">
            04 / A Little Birthday Magic
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-normal text-[#52373f] mb-3">
            Close your eyes. <br />
            <em className="italic text-rose-500 font-serif">Make a wish.</em>
          </h2>
          <p className="text-xs md:text-sm text-[#8c6f76] font-light">
            Tap the candles or press the button below to blow them out and send your wish to the stars.
          </p>
        </div>

        {/* Birthday Cake Container */}
        <div className="wish-note max-w-md mx-auto mb-8 text-left rounded-2xl border border-rose-200/70 bg-white/75 p-5 shadow-sm">
          <label htmlFor="birthday-wish" className="block font-serif text-lg text-[#644a50] mb-2">A little wish for the year ahead</label>
          {allBlown ? (
            <div role="status" className="py-3">
              <span className="text-xs tracking-widest uppercase text-rose-500 block mb-2">Sealed with a little birthday magic ♡</span>
              <p className="font-handwriting text-2xl text-[#7c5661] break-words">{wish.trim() || 'A year full of love, laughter, and beautiful little moments.'}</p>
            </div>
          ) : (
            <>
              <textarea id="birthday-wish" value={wish} onChange={(e) => setWish(e.target.value)} maxLength={240} rows={2} placeholder="This year, my heart wishes for…" className="w-full resize-none rounded-xl border border-rose-100 bg-[#fffaf8] px-4 py-3 text-sm leading-relaxed placeholder:text-[#b1979f]" />
              <p className="text-[10px] text-[#9d7d85] mt-2">Just for this moment. Your wish stays on this page.</p>
            </>
          )}
        </div>
        <div className="relative w-80 h-72 mx-auto my-6 flex flex-col items-center justify-end">
          {/* Ambient candle glow */}
          {!allBlown && (
            <div className="absolute top-2 w-48 h-32 bg-amber-200/40 rounded-full blur-2xl pointer-events-none animate-pulse" />
          )}

          {/* Sparkles around cake */}
          <span className="absolute top-10 right-4 text-amber-400 text-3xl animate-bounce pointer-events-none select-none">✧</span>
          <span className="absolute top-16 left-4 text-rose-300 text-2xl animate-pulse pointer-events-none select-none">✦</span>

          {/* Candles Row */}
          <div className="relative z-10 flex justify-between w-56 px-4 mb-[-6px]">
            {candles.map((isLit, i) => (
              <button type="button" disabled={!isLit} aria-label={`Blow out candle ${i + 1}`}
                key={i}
                onClick={(e) => blowSingleCandle(i, e)}
                className="relative flex flex-col items-center cursor-pointer group"
                title={isLit ? 'Click to blow out candle' : 'Candle blown'}
              >
                {/* Flame or Smoke */}
                {isLit ? (
                  <div className="relative mb-1">
                    {/* Flame */}
                    <div className="w-3.5 h-6 bg-gradient-to-t from-amber-500 via-amber-300 to-yellow-100 rounded-[50%_50%_20%_20%] shadow-[0_0_12px_4px_rgba(255,193,7,0.6)] animate-flicker group-hover:scale-125 transition-transform" />
                  </div>
                ) : (
                  <div className="relative mb-1 h-6 flex items-center justify-center">
                    {/* Smoke wisp */}
                    <span className="w-1.5 h-4 bg-gray-400/40 rounded-full blur-[1px] animate-smoke" />
                  </div>
                )}

                {/* Candle Stick */}
                <div
                  className={`w-3 rounded-t-sm shadow-xs ${
                    i % 2 === 0
                      ? 'h-14 bg-gradient-to-b from-pink-200 via-rose-300 to-pink-200'
                      : 'h-12 bg-gradient-to-b from-amber-100 via-pink-200 to-rose-200'
                  }`}
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.6) 4px, rgba(255,255,255,0.6) 8px)',
                  }}
                />
              </button>
            ))}
          </div>

          {/* Cake Top Layer */}
          <div className="relative z-2 w-64 h-16 rounded-[50%] bg-[#fde9eb] border-2 border-[#f3ccd4] shadow-inner flex items-center justify-center" />

          {/* Cake Body Layer */}
          <div className="relative z-1 w-64 h-28 -mt-8 rounded-b-[45px] bg-gradient-to-r from-[#e3aab9] via-[#f7cbd6] to-[#e4adb9] border-x-2 border-b-2 border-[#d99fac] shadow-md flex flex-col items-center justify-center pt-2">
            {/* Icing Pearls */}
            <div className="text-white/90 text-lg tracking-[0.4em] drop-shadow-xs mb-1 select-none">
              ♡ ♡ ♡ ♡
            </div>
            {/* Cake message */}
            <div className="font-handwriting text-2xl text-[#8e4c63] drop-shadow-xs">
              happy birthday, {story.name}
            </div>
          </div>

          {/* Cake Plate */}
          <div className="w-76 h-8 bg-gradient-to-b from-[#ebd7c8] to-[#dfc8b7] rounded-[50%] -mt-3 shadow-[0_12px_25px_rgba(183,131,114,0.35)] border-b-4 border-[#cfb5a3]" />
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <motion.button
            onClick={blowAllCandles}
            disabled={allBlown}
            whileHover={!allBlown ? { scale: 1.05 } : {}}
            whileTap={!allBlown ? { scale: 0.96 } : {}}
            className={`inline-flex items-center gap-2.5 font-medium text-xs md:text-sm py-3.5 px-7 rounded-full shadow-md transition-all cursor-pointer ${
              allBlown
                ? 'bg-rose-100 text-rose-400 border border-rose-200 cursor-default opacity-85'
                : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-rose-300'
            }`}
          >
            <span>{allBlown ? 'Your wish is on its way ✨' : 'Make a Wish & Blow All Candles'}</span>
            <Sparkles className="w-4 h-4" />
          </motion.button>

          {allBlown && (
            <button
              onClick={relightCandles}
              className="inline-flex items-center gap-2 bg-white/90 hover:bg-rose-50 border border-rose-200 text-rose-600 text-xs md:text-sm font-medium py-3.5 px-5 rounded-full shadow-xs transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Relight Candles</span>
            </button>
          )}
        </div>

        {/* Wish Result Message */}
        <div className="mt-6 font-handwriting text-2xl md:text-3xl text-rose-500 min-h-[3rem] flex items-center justify-center transition-all duration-500">
          {allBlown ? (
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2"
            >
              <span>May all your dreams and wishes come true, my love. Always & forever ♡</span>
            </motion.span>
          ) : (
            <span className="text-[#a47b85] font-light">
              Take a deep breath... this special moment is yours.
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

