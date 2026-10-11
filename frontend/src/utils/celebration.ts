import confetti from 'canvas-confetti';

/**
 * Triggers a fast (700-1000ms), lightweight celebration particle burst
 * on successful login or registration.
 * Respects `prefers-reduced-motion` and ensures non-blocking pointer events.
 */
export const triggerSuccessCelebration = () => {
  if (
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return;
  }

  try {
    // Fast particle burst lasting ~700-1000ms
    confetti({
      particleCount: 50,
      spread: 70,
      startVelocity: 35,
      ticks: 80, // ~800-1000ms duration at 60fps
      origin: { x: 0.5, y: 0.6 },
      colors: ['#2563eb', '#3b82f6', '#60a5fa', '#10b981', '#34d399', '#f59e0b'],
      shapes: ['circle', 'square'],
      scalar: 0.85,
      gravity: 1.2,
      drift: 0,
      zIndex: 999999,
      disableForReducedMotion: true,
    });
  } catch (err) {
    console.debug('Celebration animation suppressed:', err);
  }
};
