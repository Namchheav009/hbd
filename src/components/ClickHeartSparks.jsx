import React, { useEffect, useState } from 'react';
import useTimeouts from './useTimeouts';

export default function ClickHeartSparks() {
  const [sparks, setSparks] = useState([]);
  const { schedule } = useTimeouts();

  useEffect(() => {
    const handleClick = (e) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      // Don't spawn if clicking input or specific interactive controls that have their own effects
      const newSpark = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        emoji: ['💖', '✨', '🌸', '💕', '🌷'][Math.floor(Math.random() * 5)],
        driftX: (Math.random() - 0.5) * 60,
      };

      setSparks((prev) => [...prev.slice(-15), newSpark]);

      schedule(() => {
        setSparks((prev) => prev.filter((s) => s.id !== newSpark.id));
      }, 1200);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9990] overflow-hidden">
      {sparks.map((spark) => (
        <span
          key={spark.id}
          className="absolute select-none pointer-events-none transform -translate-x-1/2 -translate-y-1/2 animate-float-fade"
          style={{
            left: spark.x,
            top: spark.y,
            '--drift-x': `${spark.driftX}px`,
            fontSize: '22px',
          }}
        >
          {spark.emoji}
        </span>
      ))}
    </div>
  );
}

