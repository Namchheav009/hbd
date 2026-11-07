import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, X, Copy, Check, Sparkles } from 'lucide-react';
import { soundManager } from '../audio/soundManager';
import { triggerCelebration } from './ConfettiEffect';
import useDialog from './useDialog';

export default function LoveLetterSection({ story }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState('');
  const copyTimeout = useRef(null);
  const dialogRef = useDialog(isOpen, () => setIsOpen(false));
  useEffect(() => () => clearTimeout(copyTimeout.current), []);

  const handleOpenLetter = (e) => {
    setIsOpen(true);
    soundManager.playFanfare();
    const rect = e.currentTarget.getBoundingClientRect();
    triggerCelebration(rect.left / window.innerWidth, rect.top / window.innerHeight);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(story.letter);
      setCopyError('');
      setCopied(true);
      soundManager.playChime();
      clearTimeout(copyTimeout.current);
      copyTimeout.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      setCopyError('Copy unavailable. Please select and copy the letter text.');
    }
  };

  return (
    <section id="letter" className="py-24 px-6 bg-[#f7ebeb]/70 border-b border-[#ebd8d8] overflow-hidden">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        {/* Left Column: Letter Intro */}
        <div className="text-center lg:text-left max-w-lg">
          <span className="text-xs uppercase tracking-[0.25em] font-medium text-rose-400 mb-2 block">
            03 / Words I’ve Been Saving
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-normal text-[#52373f] mb-4">
            A little letter. <br />
            <em className="italic text-rose-500 font-serif">All of my heart.</em>
          </h2>
          <p className="text-sm text-[#82616a] leading-relaxed mb-8 font-light">
            Some things are too precious to leave unsaid. I put all my feelings, memories, and gratitude into this special letter for you…
          </p>
          <motion.button
            onClick={handleOpenLetter}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-sm font-medium py-4 px-8 rounded-full shadow-[0_8px_20px_-4px_rgba(244,63,94,0.35)] transition-all cursor-pointer"
          >
            <span>Open My Letter</span>
            <Heart className="w-4 h-4 fill-white" />
          </motion.button>
        </div>

        {/* Right Column: Interactive 3D Envelope */}
        <div role="button" tabIndex={0} aria-label="Open love letter" onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOpenLetter(e); } }} className="relative group cursor-pointer" onClick={handleOpenLetter}>
          {/* Glowing back aura */}
          <div className="absolute -inset-4 bg-gradient-to-r from-rose-200/40 to-pink-200/40 rounded-3xl blur-xl group-hover:scale-105 transition-all duration-500" />

          {/* Envelope Body */}
          <div className="relative w-80 sm:w-96 h-56 bg-[#e6b9c4] rounded-lg shadow-[0_20px_40px_-10px_rgba(148,107,115,0.35)] border border-[#dbaab6] flex flex-col justify-end p-5 rotate-2 group-hover:rotate-0 group-hover:-translate-y-2 transition-all duration-500 overflow-hidden">
            {/* Letter peek preview */}
            <div className="absolute -top-6 left-6 right-6 h-28 bg-[#fffcf5] rounded-t-sm shadow-inner p-3 font-handwriting text-xl text-[#9c6b77] -rotate-1 border border-pink-100 flex flex-col justify-between">
              <span>My Love,</span>
              <span className="text-xs text-rose-300 font-sans tracking-widest text-right uppercase">click to unfold</span>
            </div>

            {/* Envelope flaps geometry */}
            <div className="absolute inset-0 bg-[#f0c5d0] [clip-path:polygon(0_0,50%_56%,100%_0,100%_100%,0_100%)] rounded-lg pointer-events-none" />
            <div className="absolute inset-0 bg-[#e3b4c1] [clip-path:polygon(0_0,100%_0,50%_58%)] rounded-lg pointer-events-none" />

            {/* Wax Seal */}
            <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-gradient-to-br from-rose-500 to-rose-700 text-rose-50 flex items-center justify-center font-serif text-2xl shadow-[0_4px_15px_rgba(185,75,100,0.4)] border-2 border-rose-300/40 group-hover:scale-110 transition-transform duration-300 z-10">
              <span className="drop-shadow-sm">♡</span>
            </div>

            {/* To tag */}
            <div className="relative z-10 text-right font-handwriting text-2xl text-[#8e5c6a] drop-shadow-xs">
              just for {story.name}
            </div>
          </div>
        </div>
      </div>

      {/* Love Letter Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              ref={dialogRef} role="dialog" aria-modal="true" aria-label="Love letter" tabIndex={-1}
              className="relative max-w-2xl w-full bg-[#fffdf9] p-8 md:p-12 rounded-3xl shadow-2xl border border-[#ebd8cc] my-8 max-h-[85dvh] overflow-y-auto text-left"
              style={{
                backgroundImage: 'repeating-linear-gradient(#fffdf9 0px, #fffdf9 34px, #ebdcd344 35px)',
              }}
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header icons */}
              <div className="flex items-center justify-between pb-4 border-b border-rose-100 mb-6">
                <div className="flex items-center gap-2 text-rose-500">
                  <Heart className="w-5 h-5 fill-rose-500" />
                  <span className="text-xs uppercase tracking-[0.2em] font-medium text-rose-400">
                    From the bottom of my heart
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-full hover:bg-rose-50 text-rose-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Copy letter text"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    aria-label="Close love letter"
                    className="p-2 rounded-full hover:bg-rose-50 text-[#85656f] hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Letter Content */}
              <p role="status" className="text-sm text-rose-600">{copyError || (copied ? 'Letter copied.' : '')}</p>
              <div className="font-handwriting text-2xl md:text-3xl text-[#5c3e46] leading-relaxed whitespace-pre-line tracking-wide">
                {story.letter}
              </div>

              {/* Signature */}
              <div className="mt-8 pt-6 border-t border-rose-100 text-right">
                <div className="font-handwriting text-3xl text-rose-500">
                  Forever grateful for you,
                </div>
                <div className="font-handwriting text-3xl text-[#52373f] mt-1">
                  {story.yourName}❤️
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

