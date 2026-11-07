import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, RotateCcw, Mic, MicOff, Heart, Check, ArrowDown, LockKeyhole, Wind, PenLine } from 'lucide-react';
import { listenForBlow } from '../audio/blowListener';
import { soundManager } from '../audio/soundManager';
import { triggerCelebration } from './ConfettiEffect';
import useTimeouts from './useTimeouts';

const quickWishes = [
  { label: 'More happy days', icon: '☀', text: 'I wish for a year full of happiness, good health, and little reasons to smile.' },
  { label: 'Adventures together', icon: '✧', text: 'I wish for new adventures, beautiful places, and more memories with you.' },
  { label: 'Dreams coming true', icon: '☆', text: 'I wish for the courage to follow my dreams and a year that brings them a little closer.' },
  { label: 'Always us', icon: '♡', text: 'I wish for more laughter, more hugs, and more birthdays with you by my side.' },
];

export default function BirthdayCakeSection({ story }) {
  // Candle states: true = lit, false = blown
  const [candles, setCandles] = useState([true, true, true, true, true]);
  const [allBlown, setAllBlown] = useState(false);
  const [wish, setWish] = useState('');
  const { schedule, clear } = useTimeouts();
  const [micState, setMicState] = useState('idle');
  const [micError, setMicError] = useState('');
  const [breathLevel, setBreathLevel] = useState(0);
  const stopListening = useRef(null);
  const cakeRef = useRef(null);
  const successRef = useRef(null);
  const tapButtonRef = useRef(null);
  const wasBlown = useRef(false);
  const isListening = micState !== 'idle';
  const candlesLeft = candles.filter(Boolean).length;
  useEffect(() => {
    if (allBlown) successRef.current?.focus({ preventScroll: true });
    else if (wasBlown.current) tapButtonRef.current?.focus({ preventScroll: true });
    wasBlown.current = allBlown;
  }, [allBlown]);

  const stopMicrophone = () => {
    stopListening.current?.();
    stopListening.current = null;
    setMicState('idle');
    setBreathLevel(0);
  };

  useEffect(() => {
    const stopWhenHidden = () => { if (document.hidden) stopMicrophone(); };
    document.addEventListener('visibilitychange', stopWhenHidden);
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) stopMicrophone();
    });
    if (cakeRef.current) observer?.observe(cakeRef.current);
    return () => {
      stopListening.current?.();
      document.removeEventListener('visibilitychange', stopWhenHidden);
      observer?.disconnect();
    };
  }, []);

  const blowSingleCandle = (index, e) => {
    if (!candles[index]) return;
    const nextCandles = [...candles];
    nextCandles[index] = false;
    setCandles(nextCandles);
    soundManager.playBlow();

    const rect = e.currentTarget.getBoundingClientRect();
    triggerCelebration(rect.left / window.innerWidth, rect.top / window.innerHeight);

    if (nextCandles.every((c) => !c)) {
      stopMicrophone();
      setMicError('');
      setAllBlown(true);
      schedule(() => {
        soundManager.playFanfare();
        triggerCelebration(0.5, 0.4);
      }, 400);
    }
  };

  const blowAllCandles = (e) => {
    stopMicrophone();
    setMicError('');
    setCandles([false, false, false, false, false]);
    setAllBlown(true);
    soundManager.playBlow();

    const rect = e?.currentTarget?.getBoundingClientRect();
    triggerCelebration(rect ? rect.left / window.innerWidth : 0.5, rect ? rect.top / window.innerHeight : 0.4);
    schedule(() => {
      soundManager.playFanfare();
      triggerCelebration(0.5, 0.4);
    }, 500);
  };

  const relightCandles = () => {
    stopMicrophone();
    setMicError('');
    clear();
    setCandles([true, true, true, true, true]);
    setAllBlown(false);
    soundManager.playChime();
  };

  const toggleMicrophone = () => {
    if (micState !== 'idle') {
      stopMicrophone();
      return;
    }
    setMicError('');
    stopListening.current = listenForBlow({
      getAudioContext: () => {
        soundManager.init();
        return soundManager.ctx;
      },
      onState: setMicState,
      onLevel: setBreathLevel,
      onBlow: () => blowAllCandles(),
      onError: (message) => {
        stopMicrophone();
        setMicError(message);
      },
    });
  };

  return (
    <section id="wish" className="wish-section py-20 px-4 sm:px-6 text-center border-b border-pink-100/60 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-9">
          <span className="text-xs uppercase tracking-[0.25em] font-medium text-rose-400 mb-2 block">
            A Little Birthday Magic
          </span>
          <h2 className="font-serif text-4xl md:text-6xl font-normal text-[#52373f] mb-4 leading-[1.12]">
            Close your eyes. <br />
            <em className="italic text-rose-500 font-serif">Make a wish.</em>
          </h2>
          <p className="text-sm text-[#896770] leading-relaxed max-w-sm mx-auto">
            Think of something lovely. Then blow out your candles.
          </p>
        </div>

        <div className="wish-experience">
        <div className="wish-writing">
          <span className="wish-step"><span>{allBlown ? <Check size={15} /> : <PenLine size={15} />}</span> {allBlown ? 'Made with a little hope' : 'A little wish, just for you'}</span>
          <h3 className="font-serif text-3xl text-[#52373f] mt-5 mb-3 leading-tight">{allBlown ? 'Keep this little wish close.' : 'What are you wishing for?'}</h3>
          <p className="text-base leading-relaxed text-[#785966] mb-6">{allBlown ? 'Here’s to a year filled with the things that make you smile.' : 'Write it here, or keep it a secret. Both are a little magical.'}</p>
        <div className={`wish-note rounded-2xl border p-5 ${allBlown ? 'border-rose-200' : 'border-[#eddbdf]'}`}>
          <label htmlFor={allBlown ? undefined : 'birthday-wish'} className="wish-input-label">{allBlown ? 'Your birthday wish' : <>My birthday wish <span>optional</span></>}</label>
          {allBlown ? (
            <div role="status" className="py-3">
              <span className="text-xs tracking-widest uppercase text-rose-500 block mb-2">Sealed with a little birthday magic ♡</span>
              <p className="font-handwriting text-2xl text-[#7c5661] break-words">{wish.trim() || 'A year full of love, laughter, and beautiful little moments.'}</p>
            </div>
          ) : (
            <>
              <textarea id="birthday-wish" value={wish} onChange={(e) => setWish(e.target.value)} maxLength={240} rows={4} placeholder="This year, my heart wishes for…" aria-describedby="wish-hint" className="wish-input w-full resize-none bg-transparent text-base leading-relaxed placeholder:text-[#af929a]" />
              <div className="flex justify-between gap-3 mt-3 text-[11px] text-[#896770]">
                <span id="wish-hint">A wish in your heart counts, too.</span>
                {wish.length > 200 && <span aria-label={`${240 - wish.length} characters remaining`}>{240 - wish.length} left</span>}
              </div>
            </>
          )}
        </div>
          {!allBlown && (
            <div className="wish-suggestions" role="group" aria-labelledby="quick-wishes-title">
              <p id="quick-wishes-title" className="wish-suggestions-title"><Sparkles size={14} /> Need a little inspiration?</p>
              <p className="wish-suggestions-hint">Tap a wish to fill the box. You can make it your own.</p>
              <div className="wish-suggestions-grid">
                {quickWishes.map((suggestion) => {
                  const selected = wish === suggestion.text;
                  return (
                    <button key={suggestion.label} type="button" className={`wish-suggestion ${selected ? 'is-selected' : ''}`}
                      aria-pressed={selected} aria-controls="birthday-wish" onClick={() => setWish(suggestion.text)}>
                      <span className="wish-suggestion-icon" aria-hidden="true">{suggestion.icon}</span>
                      <span>{suggestion.label}</span>
                      {selected && <Check size={14} className="shrink-0" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
              <p className="wish-suggestion-status" role="status">{quickWishes.some((suggestion) => suggestion.text === wish) ? 'Wish added. Keep it as it is, or add your own little touch.' : ''}</p>
            </div>
          )}
          <p className="wish-privacy"><LockKeyhole size={14} className="shrink-0" /> Your wish stays on this page.</p>
          {!allBlown && <a className="wish-next" href="#birthday-candles">Ready? Let’s blow out the candles <ArrowDown size={16} /></a>}
          <div className="wish-keepsake" aria-hidden="true"><Heart size={18} strokeWidth={1} /><span>May this be your loveliest year yet.</span></div>
        </div>
        <div id="birthday-candles" ref={cakeRef} className={`wish-cake-panel ${isListening ? 'is-listening' : ''} ${allBlown ? 'is-celebrating' : ''}`}>
          <span className="wish-step justify-center"><span>{allBlown ? <Check size={15} /> : <Sparkles size={15} />}</span> {allBlown ? 'A wish on its way' : 'Your birthday moment'}</span>
          <h3 className="wish-cake-title">{allBlown ? 'You made a little magic.' : 'Ready, birthday girl?'}</h3>
          <div className="wish-candle-status" aria-live="polite"><span className={allBlown ? 'bg-rose-400' : 'bg-amber-400'} />{allBlown ? 'All your candles are out' : candlesLeft < 5 ? `${candlesLeft} ${candlesLeft === 1 ? 'candle' : 'candles'} left to blow out` : 'Your candles are glowing for you'}</div>
        <div className="wish-cake relative w-72 h-64 mx-auto flex flex-col items-center justify-end">
          {/* Ambient candle glow */}
          {!allBlown && (
            <div className="absolute top-2 w-48 h-32 bg-amber-200/40 rounded-full blur-2xl pointer-events-none animate-pulse" />
          )}

          {/* Sparkles around cake */}
          <span className="absolute top-10 right-4 text-amber-400 text-3xl animate-bounce pointer-events-none select-none">✧</span>
          <span className="absolute top-16 left-4 text-rose-300 text-2xl animate-pulse pointer-events-none select-none">✦</span>

          {/* Candles Row */}
          <div className="relative z-10 flex justify-between w-56 mb-[-6px]">
            {candles.map((isLit, i) => (
              <button type="button" disabled={!isLit} aria-label={`Blow out candle ${i + 1}`}
                key={i}
                onClick={(e) => blowSingleCandle(i, e)}
                className="relative flex w-11 min-h-24 flex-col items-center justify-end rounded-lg cursor-pointer group disabled:cursor-default"
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

        <div className="wish-controls">
          {allBlown ? (
            <motion.div ref={successRef} tabIndex={-1} aria-labelledby="wish-success-title" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="wish-success" role="status">
              <span className="wish-success-icon"><Sparkles size={22} /></span>
              <h3 id="wish-success-title" className="font-serif text-2xl text-[#52373f] mt-3">May your wish come true, my love.</h3>
              <p className="text-sm leading-relaxed text-[#896770] mt-2">May all the beautiful things you hope for find their way to you.</p>
              <button type="button" onClick={relightCandles} className="wish-secondary mt-5"><RotateCcw size={16} /> Make another wish</button>
            </motion.div>
          ) : (
            <>
              <p className="wish-action-hint">Make your wish, then tap below.</p>
              <button ref={tapButtonRef} type="button" onClick={blowAllCandles} className="wish-primary wish-blow-button w-full"><Wind size={20} /> Blow out my candles <Sparkles size={17} /></button>
              <p className="wish-tap-hint">One tap is all it takes. Or tap each candle.</p>
              <div className="wish-mic-option">
              <button type="button" onClick={toggleMicrophone} aria-pressed={isListening} aria-describedby={isListening || micError ? 'microphone-status' : 'wish-mic-hint'} className="wish-mic-toggle">
                {isListening ? <MicOff size={17} /> : <Mic size={17} />}
                {isListening ? 'Stop microphone' : micError ? 'Try microphone again' : 'Blow with my microphone'}
              </button>
              {!isListening && !micError && <p id="wish-mic-hint">For a real birthday blow. We’ll ask to use your mic.</p>}
              {(isListening || micError) && (
              <div className={`wish-listening-card ${micError ? 'has-error' : ''}`}>
                <div className="wish-listening-heading">
                  <span className={`wish-mic-icon ${isListening ? 'is-active' : ''}`}>
                    {micState === 'listening' ? <Wind size={19} /> : <Mic size={19} />}
                  </span>
                  <div className="text-left">
                    <h4 className="text-sm font-medium text-[#644a50]">{micError ? 'You can still use the pink button above' : micState === 'requesting' ? 'Allow your microphone' : micState === 'calibrating' ? 'Almost ready…' : 'Blow gently toward your microphone'}</h4>
                    <p id="microphone-status" role="status" aria-live="polite" className="text-xs leading-relaxed text-[#896770] mt-1">
                      {micError || (micState === 'requesting' ? 'Choose Allow in your browser microphone prompt.'
                        : micState === 'calibrating' ? 'Stay quiet for a second. We are almost ready.'
                        : micState === 'listening' ? 'Blow steadily toward your microphone.'
                        : 'A steady breath will blow out your candles.')}
                    </p>
                  </div>
                </div>
                {isListening && (
                  <div className="mt-4">
                    <div className="flex justify-between text-[10px] text-[#896770] mb-2"><span>{micState === 'listening' ? 'Your breath' : 'Getting ready'}</span><span>{micState === 'listening' ? 'Keep blowing gently' : 'Just a moment'}</span></div>
                    <div role="meter" aria-label="Breath strength" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(breathLevel * 100)} className="h-1.5 overflow-hidden rounded-full bg-rose-100">
                      <div className="h-full rounded-full bg-gradient-to-r from-rose-400 to-pink-500 transition-[width] duration-100" style={{ width: `${breathLevel * 100}%` }} />
                    </div>
                  </div>
                )}
              </div>
              )}
              {isListening && <p className="wish-mic-privacy"><LockKeyhole size={12} /> Your audio is never saved or uploaded.</p>}
              </div>
            </>
          )}
        </div>
        </div>
        </div>
        <p className="font-handwriting text-2xl text-[#a47b85] mt-7">{allBlown ? 'Here is to you, and everything still to come.' : 'Take your time. This little moment is yours.'}</p>
      </div>
    </section>
  );
}
