import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sunset, Plane, Coffee, Cake, Camera, Heart, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../audio/soundManager';
import { triggerCelebration } from './ConfettiEffect';

const iconMap = {
  sunset: Sunset,
  plane: Plane,
  coffee: Coffee,
  cake: Cake,
  camera: Camera,
  heart: Heart,
};

export default function FutureSection({ future }) {
  const [promised, setPromised] = useState([]);

  const togglePromised = (index, e) => {
    if (promised.includes(index)) {
      setPromised(promised.filter((i) => i !== index));
      soundManager.playPop();
    } else {
      setPromised([...promised, index]);
      soundManager.playChime();
      const rect = e.currentTarget.getBoundingClientRect();
      triggerCelebration(rect.left / window.innerWidth, rect.top / window.innerHeight);
    }
  };

  return (
    <section id="future" className="py-24 px-6 bg-[#faf3ee]/70 border-b border-[#ecded4]">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.25em] font-medium text-rose-400 mb-2 block">
            05 / The Pages We Haven’t Written
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-normal text-[#52373f] mb-3">
            So much more <em className="italic text-rose-500 font-serif">with you.</em>
          </h2>
          <p className="text-xs md:text-sm text-[#8c6f76] font-light">
            All the little adventures and quiet moments I dream of sharing together, one page at a time.
          </p>
          <div className="font-handwriting text-2xl text-rose-400 mt-2">
            tap any card to seal a promise ↴
          </div>
        </div>

        {/* Future Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {future.map((item, index) => {
            const Icon = iconMap[item.icon] || Heart;
            const isPromised = promised.includes(index);

            return (
              <motion.div
                role="button" tabIndex={0} aria-pressed={isPromised}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); togglePromised(index, e); } }}
                key={item.title + index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                onClick={(e) => togglePromised(index, e)}
                whileHover={{ y: -4, scale: 1.02 }}
                className={`relative p-7 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                  isPromised
                    ? 'bg-gradient-to-br from-[#fff7f8] to-[#ffedf2] border-rose-300 shadow-md shadow-rose-100'
                    : 'bg-[#fffcf8] hover:bg-[#fff7f4] border-[#ebdcd3] shadow-xs'
                }`}
              >
                {/* Card Number */}
                <span className="absolute top-5 right-5 font-handwriting text-2xl text-[#c29fa4]">
                  0{index + 1}
                </span>

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors ${
                  isPromised ? 'bg-rose-500 text-white shadow-sm' : 'bg-rose-50 text-rose-400'
                }`}>
                  <Icon className="w-6 h-6" strokeWidth={1.5} />
                </div>

                {/* Content */}
                <h3 className="font-serif text-xl font-normal text-[#52373f] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-[#8c6f76] font-light leading-relaxed mb-6">
                  {item.text}
                </p>

                {/* Stamp / Promise tag */}
                <div className="pt-4 border-t border-dashed border-rose-200/70 flex items-center justify-between">
                  <span className="font-handwriting text-lg text-rose-400">
                    {isPromised ? '♡ Sealed & Promised' : '♡ on our someday list'}
                  </span>
                  {isPromised && (
                    <motion.span
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: -8 }}
                      className="px-2 py-0.5 rounded-sm border-2 border-rose-500 text-rose-600 font-bold text-[9px] uppercase tracking-wider bg-rose-50 select-none shadow-xs"
                    >
                      PROMISED
                    </motion.span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

