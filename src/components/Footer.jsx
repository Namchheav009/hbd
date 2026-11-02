import React, { useState } from 'react';
import { Heart, ArrowUp } from 'lucide-react';
import { soundManager } from '../audio/soundManager';
import { triggerCelebration } from './ConfettiEffect';

export default function Footer({ story }) {
  const [secret, setSecret] = useState(false);

  const toggleSecret = (e) => {
    setSecret((prev) => !prev);
    soundManager.playChime();
    const rect = e.currentTarget.getBoundingClientRect();
    triggerCelebration(rect.left / window.innerWidth, rect.top / window.innerHeight);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 px-6 bg-[#fffaf8] border-t border-rose-100/60 text-center relative">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Secret Heart Button */}
        <button
          onClick={toggleSecret}
          className="w-12 h-12 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-500 flex items-center justify-center transition-all shadow-xs hover:scale-110 mb-4 cursor-pointer"
          title="Click to discover a secret message"
        >
          <Heart className="w-5 h-5 fill-rose-400 text-rose-500 animate-pulse" />
        </button>

        {/* Message */}
        <p className="font-handwriting text-2xl text-[#845f6a] max-w-md mx-auto transition-all duration-300">
          {secret
            ? 'P.S. In every universe, in every lifetime, I will always choose you. ♡'
            : 'Made with endless love, for my favorite person in the world.'}
        </p>

        {/* Attribution */}
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#a98e94] mt-4 font-medium">
          YOURS, {story.yourName ? story.yourName.toUpperCase() : 'YOUR LOVE'} · ALWAYS
        </span>

        {/* Scroll to top button */}
        <button
          onClick={scrollToTop}
          className="mt-6 inline-flex items-center gap-1.5 text-xs text-[#a98e94] hover:text-rose-500 transition-colors py-1 px-3 rounded-full hover:bg-rose-50 cursor-pointer"
        >
          <ArrowUp className="w-3.5 h-3.5" />
          <span>Back to Top</span>
        </button>
      </div>
    </footer>
  );
}

