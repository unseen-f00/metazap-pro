/**
 * confetti.ts
 * Lightweight, elegant confetti animation trigger for tool completion.
 * Designed with subtle pastel and brand colors matching the Paper UI theme.
 */

import confetti from 'canvas-confetti';

export function triggerSuccessConfetti() {
  if (typeof window === 'undefined') return;

  try {
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#4F46E5', '#10B981', '#6366F1', '#34D399', '#F59E0B'],
      disableForReducedMotion: true,
      ticks: 200,
      gravity: 1.1,
      scalar: 0.9,
    });
  } catch (err) {
    // Graceful fallback if canvas is unavailable
    console.debug('Confetti could not be rendered:', err);
  }
}
