import { useEffect, useRef } from 'react';

export default function useDialog(open, onClose, onArrow) {
  const ref = useRef(null);
  const callbacks = useRef({ onClose, onArrow });
  callbacks.current = { onClose, onArrow };

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const dialog = ref.current;
    const focusable = () => [...(dialog?.querySelectorAll('button, a[href], input, [tabindex="0"]') || [])]
      .filter((element) => !element.disabled);
    (focusable()[0] || dialog)?.focus();
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        callbacks.current.onClose?.();
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        if (callbacks.current.onArrow) {
          event.preventDefault();
          callbacks.current.onArrow(event.key === 'ArrowRight' ? 1 : -1);
        }
      } else if (event.key === 'Tab') {
        const elements = focusable();
        const first = elements[0];
        const last = elements.at(-1);
        if (!first) {
          event.preventDefault();
          dialog?.focus();
        } else if (!dialog.contains(document.activeElement) ||
          (event.shiftKey ? document.activeElement === first : document.activeElement === last)) {
          event.preventDefault();
          (event.shiftKey ? last : first).focus();
        }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKey);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [open]);
  return ref;
}
