import { imageFallback } from './imageFallback';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { soundManager } from '../audio/soundManager';
import useDialog from './useDialog';

export default function MemoriesGallery({ memories }) {
  const [activePhoto, setActivePhoto] = useState(null);
  const dialogRef = useDialog(activePhoto !== null, () => setActivePhoto(null), (direction) => {
    setActivePhoto((index) => (index + direction + memories.length) % memories.length);
  });

  const handleOpenPhoto = (idx) => {
    setActivePhoto(idx);
    soundManager.playChime();
  };

  const handleClose = () => {
    setActivePhoto(null);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActivePhoto((prev) => (prev + 1) % memories.length);
    soundManager.playPop();
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setActivePhoto((prev) => (prev + memories.length - 1) % memories.length);
    soundManager.playPop();
  };

  return (
    <section id="memories" className="py-20 px-6 bg-[#f7eee9]/60 border-y border-[#ecdfd8]">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.25em] font-medium text-rose-400 mb-2 block">
            01 / The Moments I Keep
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-normal text-[#52373f] mb-3">
            Our beautiful <em className="italic text-rose-500 font-serif">memories.</em>
          </h2>
          <p className="text-xs md:text-sm text-[#8c6f76] font-light">
            If I could keep any moment forever, it would always be one with you.
          </p>
        </div>

        {/* Polaroid Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 max-w-5xl mx-auto">
          {memories.map((m, idx) => {
            const tilt = idx % 2 === 0 ? '-rotate-2' : 'rotate-2';

            return (
              <motion.div
                key={m.caption + idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                className={`relative group bg-[#fffaf6] p-4 pb-6 rounded-xs shadow-[0_10px_25px_-5px_rgba(115,83,80,0.12)] border border-[#ece0d8] ${tilt} hover:rotate-0 hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col`}
              >
                {/* Polaroid Number Badge */}
                <span className="absolute top-6 left-6 z-10 text-[10px] font-medium tracking-wider bg-white/85 text-[#85636c] px-2.5 py-0.5 rounded-full border border-pink-100 shadow-xs">
                  0{idx + 1}
                </span>

                {/* Photo container */}
                <button type="button" aria-label={`View ${m.caption}`} onClick={() => handleOpenPhoto(idx)} className="overflow-hidden bg-[#ecdcd3] aspect-[4/3.5] rounded-xs mb-3 relative flex items-center justify-center cursor-pointer">
                  <img
                    src={m.photo}
                    alt={m.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={imageFallback}
                  />
                </button>

                {/* Caption & Hint */}
                <div className="text-center mt-auto">
                  <button onClick={() => handleOpenPhoto(idx)} className="font-handwriting text-2xl text-[#6b4c55] group-hover:text-rose-600 transition-colors cursor-pointer">
                    {m.caption}
                  </button>
                  <div className="inline-flex items-center gap-1 text-[10px] tracking-wider uppercase text-[#a98f95] mt-1">
                    <span>a memory to hold</span>
                    <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Note under gallery */}
        <p className="text-center text-xs text-[#a5898f] mt-10 font-light flex items-center justify-center gap-2">
          <span>Tap any polaroid to view our story ♡</span>
        </p>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activePhoto !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            <motion.div
              ref={dialogRef} role="dialog" aria-modal="true" aria-label="Memory photo preview" tabIndex={-1}
              className="relative max-w-xl w-full bg-[#fffcf7] p-6 md:p-8 rounded-2xl shadow-2xl border border-pink-100/60 overflow-hidden text-center"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-500 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close photo preview"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Photo */}
              <div className="overflow-hidden rounded-xl bg-[#f0e3db] aspect-[4/3] max-h-[50vh] flex items-center justify-center mb-5 shadow-sm">
                <img
                  src={memories[activePhoto].photo}
                  alt={memories[activePhoto].caption}
                  className="w-full h-full object-contain"
                  onError={imageFallback}
                />
              </div>

              {/* Caption and personal note */}
              <h3 className="font-handwriting text-3xl md:text-4xl text-[#52373f] mb-2">
                {memories[activePhoto].caption}
              </h3>
              <p className="text-sm text-[#7e5f67] font-light max-w-md mx-auto mb-6">
                "{memories[activePhoto].note}"
              </p>

              {/* Navigation controls */}
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-xs tracking-widest text-[#9d7d85] font-medium">
                  {activePhoto + 1} / {memories.length}
                </span>
                <button
                  onClick={handleNext}
                  className="w-10 h-10 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

