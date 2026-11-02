import React, { useEffect, useState } from 'react';
import { Heart, Music2, VolumeX } from 'lucide-react';

const chapters = [
  ['home', 'For you'], ['memories', 'Memories'], ['reasons', 'Little reasons'],
  ['letter', 'Love letter'], ['wish', 'Make a wish'], ['future', 'Our someday'], ['gift', 'Your surprise'],
];

export default function Navbar({ isPlaying, onToggleMusic, name }) {
  const [active, setActive] = useState('home');
  useEffect(() => {
    let frame;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const current = chapters.filter(([id]) => document.getElementById(id)?.getBoundingClientRect().top <= 170).at(-1);
        setActive(current?.[0] || 'home');
      });
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', update); };
  }, []);

  return (
    <header className="story-header sticky top-0 z-40 border-b border-rose-100/80 bg-[#fffaf8]/95 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-18 flex items-center justify-between gap-4">
        <a href="#home" className="flex items-center gap-3 text-[#553b43]">
          <span className="w-10 h-10 rounded-full border border-rose-200 flex items-center justify-center bg-white"><Heart className="w-4 h-4 text-rose-500" strokeWidth={1.5} /></span>
          <span className="font-handwriting text-3xl">for {name || 'you'}</span>
        </a>
        <span className="hidden sm:block text-[10px] tracking-[0.25em] uppercase text-[#9d7d85]">A little world of us</span>
        <button onClick={onToggleMusic} aria-pressed={isPlaying} aria-label={isPlaying ? 'Pause romantic melody' : 'Play romantic melody'} className="min-h-11 inline-flex items-center gap-2 px-4 rounded-full border border-rose-200 bg-white text-rose-600 text-xs hover:bg-rose-50 transition-colors cursor-pointer">
          {isPlaying ? <Music2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span>{isPlaying ? 'Music on' : 'Play melody'}</span>
        </button>
      </div>
      <nav aria-label="Story chapters" className="chapter-nav max-w-6xl mx-auto flex gap-1 px-3 md:px-7 overflow-x-auto">
        {chapters.map(([id, label], index) => (
          <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined} className={`chapter-link shrink-0 min-h-11 px-3 flex items-center gap-2 text-[11px] border-b-2 transition-colors ${active === id ? 'border-rose-500 text-rose-600' : 'border-transparent text-[#886c74] hover:text-rose-600'}`}>
            <span className="text-[9px] opacity-60">{String(index).padStart(2, '0')}</span>{label}
          </a>
        ))}
      </nav>
    </header>
  );
}
