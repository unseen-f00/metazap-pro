'use client';

/**
 * ThemeToggle.tsx
 * Clean, minimal editorial dark/light mode toggle.
 * Supports system preference detection and smooth theme switching.
 */

import { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';

const emptySubscribe = () => () => {};

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 ${className}`}
        aria-hidden="true"
      />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`relative inline-flex items-center justify-center w-9 h-9 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/80 hover:bg-white dark:bg-stone-900/80 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-stone-900 dark:focus:ring-stone-100 shrink-0 cursor-pointer ${className}`}
      aria-label={isDark ? 'Switch to light reading mode' : 'Switch to dark reading mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        /* Minimalist Sun */
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 text-stone-200 transition-transform duration-200 hover:rotate-45"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        /* Minimalist Moon */
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 text-stone-800 transition-transform duration-200 hover:-rotate-12"
          aria-hidden="true"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      )}
    </button>
  );
}
