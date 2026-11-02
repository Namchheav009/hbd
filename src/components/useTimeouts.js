import { useEffect, useRef } from 'react';

export default function useTimeouts() {
  const timers = useRef(new Set());
  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current.clear();
  };
  useEffect(() => clear, []);
  return {
    clear,
    schedule(callback, delay) {
      const timer = setTimeout(() => {
        timers.current.delete(timer);
        callback();
      }, delay);
      timers.current.add(timer);
    },
  };
}
