import React, { useEffect, useRef, useState } from 'react';
import { Heart, Music2, Pause, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const chapters = [
  ['home', 'For you'], ['memories', 'Memories'], ['reasons', 'Love notes'],
  ['letter', 'Love letter'], ['wish', 'Make a wish'], ['future', 'Our someday'], ['gift', 'Your surprise'],
];

export default function Navbar({ isPlaying, onToggleMusic, name }) {
  const [active, setActive] = useState('home');
  const navRef = useRef(null);
  const headerRef = useRef(null);
  const [scrollEdges, setScrollEdges] = useState({ start: true, end: false, overflow: false });
  const measureNav = () => {
    const nav = navRef.current;
    if (!nav) return;
    setScrollEdges({ start: nav.scrollLeft < 4, end: nav.scrollLeft + nav.clientWidth >= nav.scrollWidth - 4, overflow: nav.scrollWidth > nav.clientWidth + 4 });
  };
  useEffect(() => {
    const observer = new ResizeObserver(measureNav);
    observer.observe(navRef.current);
    measureNav();
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const nav = navRef.current;
    const link = nav?.querySelector('[aria-current="location"]');
    if (nav && link) {
      nav.scrollTo({ left: link.offsetLeft - (nav.clientWidth - link.clientWidth) / 2, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }
  }, [active]);
  const scrollChapters = (direction) => {
    navRef.current?.scrollBy({ left: direction * 200, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  useEffect(() => {
    let frame;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const threshold = (headerRef.current?.getBoundingClientRect().height || 132) + 40;
        const current = chapters.filter(([id]) => document.getElementById(id)?.getBoundingClientRect().top <= threshold).at(-1);
        setActive(current?.[0] || 'home');
      });
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', update); };
  }, []);

  return (
    <header ref={headerRef} className="story-header sticky top-0 z-40 bg-[#fffaf8]/95 backdrop-blur-xl">
      <div className="story-header-top">
        <a href="#home" className="story-brand" aria-label={`For ${name || 'you'}, back to the beginning`}>
          <span className="story-brand-mark"><Heart size={20} strokeWidth={1.4} /></span>
          <span><span className="story-brand-name">for {name || 'you'}</span><span className="story-brand-caption">A little world, made with love</span></span>
        </a>
        <div className="story-header-dedication" aria-hidden="true"><span /><Sparkles size={13} strokeWidth={1.3} /><span className="dedication-text">Every little moment, us.</span><span /></div>
        <button type="button" onClick={onToggleMusic} aria-pressed={isPlaying} aria-label={isPlaying ? 'Pause romantic melody' : 'Play romantic melody'} className={`story-music ${isPlaying ? 'is-playing' : ''}`}>
          <span className="story-music-icon">{isPlaying ? <Pause size={15} /> : <Music2 size={16} />}</span>
          <span>{isPlaying ? 'Pause melody' : 'Play melody'}</span>
          <span className="story-equalizer" aria-hidden="true"><i /><i /><i /><i /></span>
        </button>
      </div>
      <div className="story-chapter-bar">
        <span className="story-chapter-caption">Our little story</span>
        {scrollEdges.overflow && <button type="button" className="chapter-scroll" aria-label="Scroll chapters left" disabled={scrollEdges.start} onClick={() => scrollChapters(-1)}><ChevronLeft size={16} /></button>}
      <nav ref={navRef} onScroll={measureNav} aria-label="Story chapters" className="chapter-nav">
        {chapters.map(([id, label]) => (
          <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined} className={`chapter-link ${active === id ? 'is-active' : ''}`}>
            <span>{label}</span>
            {active === id && <span className="chapter-active-dot" aria-hidden="true" />}
          </a>
        ))}
      </nav>
        {scrollEdges.overflow && <button type="button" className="chapter-scroll" aria-label="Scroll chapters right" disabled={scrollEdges.end} onClick={() => scrollChapters(1)}><ChevronRight size={16} /></button>}
      </div>
    </header>
  );
}
