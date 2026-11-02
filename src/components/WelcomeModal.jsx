import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, Music } from 'lucide-react';
import useDialog from './useDialog';

export default function WelcomeModal({ onEnter, story }) {
  const [withMusic, setWithMusic] = useState(false);
  const dialogRef = useDialog(true, () => onEnter(false));
  return (
    <motion.div
      ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="welcome-title" tabIndex={-1}
      className="welcome-scene fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-b from-[#fff2f5]/95 via-[#fff8f6]/95 to-[#ffeef2]/95 backdrop-blur-md text-center overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      <div className="welcome-card max-w-lg w-full bg-white/80 backdrop-blur-md p-7 md:p-12 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(224,107,136,0.25)] border border-pink-100/80 relative overflow-hidden my-auto">
        <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.2em] text-[#a47b85] mb-7"><span>A birthday keepsake</span><span>Just for you ♡</span></div>
        {/* Decorative corner glows */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-pink-200/40 rounded-full blur-2xl" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-rose-200/40 rounded-full blur-2xl" />

        {/* Floating Ring & Heart */}
        <motion.div
          className="mx-auto w-24 h-24 mb-6 rounded-full border-2 border-rose-300/60 flex items-center justify-center relative shadow-[0_0_25px_rgba(244,143,177,0.3)] bg-gradient-to-tr from-pink-50 to-white"
          animate={{ scale: [1, 1.06, 1], rotate: [0, 4, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Heart className="w-12 h-12 text-rose-500 fill-rose-500/20" strokeWidth={1.5} />
          </motion.div>
          <div className="absolute -top-1 -right-1 text-amber-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
        </motion.div>

        {/* Eyebrow */}
        <span className="inline-block text-xs uppercase tracking-[0.25em] font-medium text-rose-400 mb-3">
          A Little World, Made Just For You
        </span>

        {/* Title */}
        <h1 id="welcome-title" className="font-serif text-4xl md:text-5xl font-normal text-[#553b43] mb-4 leading-tight">
          A little world for<br /><em className="text-rose-500">{story.name}.</em>
        </h1>

        {/* Message */}
        <p className="text-sm md:text-base text-[#7c5e66] leading-relaxed mb-6 font-light max-w-sm mx-auto">
          {story.welcome || 'I made a little something just for you on your special day.'}
        </p>

        {/* Audio hint */}
        <label className="flex items-center justify-center gap-2.5 text-xs text-[#88606c] mb-7 min-h-11 cursor-pointer">
          <input type="checkbox" checked={withMusic} onChange={(e) => setWithMusic(e.target.checked)} className="w-4 h-4 accent-rose-500" />
          <Music className="w-3.5 h-3.5" /><span>Open with a little music</span>
        </label>

        {/* Primary Action Button */}
        <motion.button
          onClick={() => onEnter(withMusic)}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-medium text-sm md:text-base py-4 px-8 rounded-full shadow-[0_10px_25px_-5px_rgba(244,63,94,0.4)] transition-all cursor-pointer"
        >
          <span>Open Your Surprise</span>
          <Heart className="w-5 h-5 fill-white group-hover:scale-125 transition-transform" />
        </motion.button>

        {/* Handwritten subtitle */}
        <div className="mt-6 font-handwriting text-2xl text-rose-400/90 tracking-wide">
          a little magic awaits ♡
        </div>
      </div>
    </motion.div>
  );
}

