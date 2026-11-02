import { imageFallback } from './imageFallback';
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, ArrowDown, Sparkles } from 'lucide-react';
import { triggerCelebration } from './ConfettiEffect';

export default function Hero({ story, onSendLove }) {
  const [loveCount, setLoveCount] = useState(0);

  const handleHeartClick = (e) => {
    setLoveCount((c) => c + 1);
    if (onSendLove) onSendLove();
    const rect = e.currentTarget.getBoundingClientRect();
    triggerCelebration(rect.left / window.innerWidth, rect.top / window.innerHeight);
  };

  const parsedDate = new Date(story.birthday + 'T12:00:00');
  const formattedDate = Number.isNaN(parsedDate.getTime())
    ? 'Today is your special day'
    : parsedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <section id="home" className="relative min-h-[85vh] max-w-6xl mx-auto px-6 py-12 md:py-20 flex flex-col justify-center overflow-hidden">
      {/* Background radial ambient glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-rose-200/35 to-pink-100/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Sparks in background */}
      <div className="absolute top-16 right-12 text-amber-300/80 text-2xl select-none animate-pulse">✧</div>
      <div className="absolute bottom-20 left-12 text-rose-300/70 text-xl select-none animate-bounce">✦</div>
      <div className="absolute top-1/3 left-8 text-pink-300/50 text-3xl font-serif select-none pointer-events-none">✿</div>
      <div className="absolute bottom-16 right-16 text-rose-300/40 text-4xl font-serif select-none pointer-events-none">✿</div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Hero Text */}
        <motion.div
          className="lg:col-span-7 text-center lg:text-left z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50/90 border border-rose-200/60 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
            <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium text-rose-500">
              Today, The World Is A Little Sweeter
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-[#52373f] leading-[1.12] tracking-tight mb-4">
            Happy Birthday, <br />
            <em className="font-serif text-rose-500">{story.name}.</em>
            <span className="inline-block text-rose-400 ml-2 font-serif animate-pulse">♡</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm md:text-base text-[#7c5f67] leading-relaxed max-w-lg mx-auto lg:mx-0 mb-6 font-light">
            {story.subtitle}
          </p>

          {/* Dedication */}
          <div className="font-handwriting text-2xl md:text-3xl text-rose-500 mb-8">
            A whole little world, wrapped up in love.
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <a
              href="#memories"
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs md:text-sm font-medium py-3.5 px-6 rounded-full shadow-[0_8px_20px_-4px_rgba(244,63,94,0.35)] hover:-translate-y-0.5 transition-all"
            >
              <span>Let’s make a little magic</span>
              <ArrowDown className="w-4 h-4" />
            </a>

            {/* Send Love interactive button */}
            <button
              onClick={handleHeartClick}
              className="inline-flex items-center gap-2 bg-white/90 hover:bg-rose-50 border border-rose-200/80 text-rose-600 text-xs md:text-sm font-medium py-3.5 px-5 rounded-full shadow-sm hover:-translate-y-0.5 transition-all cursor-pointer group"
            >
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500 group-hover:scale-125 transition-transform" />
              <span>{loveCount === 0 ? 'Send Love' : `${loveCount} Hearts Sent ♡`}</span>
            </button>
          </div>

          {/* Birthday Date Tag */}
          <div className="mt-8 flex items-center justify-center lg:justify-start gap-2 text-xs text-[#9d7d85] font-light">
            <span className="text-amber-400">✧</span>
            <span>{formattedDate}</span>
            <span className="text-amber-400">✧</span>
          </div>
        </motion.div>

        {/* Right Column: Hero Polaroid & Romantic Art */}
        <motion.div
          className="lg:col-span-5 flex justify-center relative"
          initial={{ opacity: 0, scale: 0.95, rotate: 2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
        >
          {/* Circular orbit decoration */}
          <div className="absolute inset-2 border border-rose-200/40 rounded-full -rotate-12 pointer-events-none scale-105" />

          {/* Little handwritten badge */}
          <div className="absolute -top-4 right-4 md:right-8 z-20 font-handwriting text-2xl text-rose-400 rotate-6 bg-white/90 px-3 py-1 rounded-full shadow-sm border border-pink-100">
            my favorite person ✨
          </div>

          {/* Polaroid Card */}
          <div className="relative bg-white p-3.5 pb-6 rounded-sm shadow-[0_20px_50px_-10px_rgba(147,96,108,0.22)] border border-[#f0e3db] rotate-3 hover:rotate-0 transition-transform duration-500 max-w-xs w-full group">
            {/* Washi Tape */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-7 bg-amber-100/80 border border-amber-200/40 rotate-[-2deg] shadow-xs z-10 [clip-path:polygon(3%_0%,97%_2%,95%_98%,0%_94%)]" />

            {/* Photo */}
            <div className="overflow-hidden rounded-xs bg-[#eadbd2] aspect-[4/4.5] flex items-center justify-center">
              <img
                src={story.heroPhoto}
                alt={`A sweet photo of ${story.name}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onError={imageFallback}
              />
            </div>

            {/* Caption */}
            <div className="text-center mt-3 font-handwriting text-2xl text-[#7c5661]">
              You make my world bloom ♡
            </div>
          </div>

          {/* Floating small note */}
          <div className="absolute -bottom-6 -left-2 md:left-2 font-handwriting text-2xl text-rose-400/90 -rotate-6 select-none pointer-events-none bg-white/70 px-2 py-0.5 rounded-lg border border-pink-100">
            wrapped up in you ♡
          </div>
        </motion.div>
      </div>

      {/* Bottom subtle indicator */}
      <div className="text-center mt-12 md:mt-16">
        <a
          href="#memories"
          className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-rose-400/80 hover:text-rose-600 transition-colors"
        >
          <span>A Love Story In Little Moments</span>
          <ArrowDown className="w-3 h-3 animate-bounce" />
        </a>
      </div>
    </section>
  );
}

