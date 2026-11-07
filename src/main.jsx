import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence, MotionConfig, useScroll } from 'motion/react';
import { story } from './config';
import { soundManager } from './audio/soundManager';
import PetalsCanvas from './components/PetalsCanvas';
import ClickHeartSparks from './components/ClickHeartSparks';
import WelcomeModal from './components/WelcomeModal';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MemoriesGallery from './components/MemoriesGallery';
import ReasonsSection from './components/ReasonsSection';
import LoveLetterSection from './components/LoveLetterSection';
import BirthdayCakeSection from './components/BirthdayCakeSection';
import FutureSection from './components/FutureSection';
import GiftBoxSection from './components/GiftBoxSection';
import Footer from './components/Footer';
import './styles.css';

function App() {
  const [entered, setEntered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [replay, setReplay] = useState(0);
  const { scrollYProgress } = useScroll();

  // Music starts separately with the play button.
  const handleEnter = (withMusic = false) => {
    void soundManager.unlock().catch(() => {});
    setEntered(true);
    if (withMusic) handleToggleMusic();
  };

  useEffect(() => () => soundManager.stop(), []);

  const handleToggleMusic = async () => {
    const active = await soundManager.togglePlay(story.music);
    setIsPlaying(active);
  };

  const handleResetStory = () => {
    setReplay((value) => value + 1);
    // Scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fffaf8] text-[#644a50] relative selection:bg-rose-200 selection:text-rose-900">
      {/* Top Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 via-rose-500 to-amber-400 origin-left z-50 pointer-events-none"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Atmospheric Floating Sakura/Rose Petals & Golden Sparkles */}
      <PetalsCanvas />

      {/* Interactive Cursor / Touch Hearts */}
      <ClickHeartSparks />

      {/* Entrance Welcome Screen */}
      <AnimatePresence>
        {!entered && (
          <WelcomeModal
            story={story}
            onEnter={handleEnter}
          />
        )}
      </AnimatePresence>

      {/* Main Website Content */}
      <div inert={!entered} className={!entered ? 'opacity-0 pointer-events-none' : 'opacity-100 transition-opacity duration-700'}>
        <Navbar
          name={story.name}
          isPlaying={isPlaying}
          onToggleMusic={handleToggleMusic}
        />

        <main key={replay}>
          <Hero
            story={story}
            onSendLove={() => soundManager.playPop()}
          />

          <MemoriesGallery
            memories={story.memories}
          />

          <ReasonsSection
            reasons={story.reasons}
          />

          <LoveLetterSection
            story={story}
          />

          <BirthdayCakeSection
            story={story}
          />

          <FutureSection
            future={story.future}
          />

          <GiftBoxSection
            story={story}
            onReset={handleResetStory}
          />
        </main>

        <Footer key={`footer-${replay}`}
          story={story}
        />
      </div>
    </div>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<MotionConfig reducedMotion="user"><App /></MotionConfig>);
}
