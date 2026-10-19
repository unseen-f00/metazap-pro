'use client';

/**
 * Logo.tsx
 * Refined Editorial Imprint & Brandmark for MetaZap.
 * Guaranteed fixed dimensions to prevent layout shifts or full-screen expansion on mobile.
 */

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', showText = true, size = 'md' }: LogoProps) {
  const iconSizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8 md:w-9 md:h-9',
    lg: 'w-10 h-10 md:w-11 md:h-11',
  }[size];

  const textClasses = {
    sm: 'text-base',
    md: 'text-lg md:text-xl',
    lg: 'text-xl md:text-2xl',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Editorial Emblem / Aperture Mark */}
      <div
        className={`relative ${iconSizeClasses} shrink-0 flex items-center justify-center rounded-lg bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-950 shadow-2xs border border-stone-800 dark:border-stone-200 transition-colors`}
        style={{ maxWidth: '44px', maxHeight: '44px' }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4.5 h-4.5 shrink-0"
          aria-hidden="true"
        >
          {/* Architectural Darkroom Aperture Mark */}
          <rect x="3.5" y="3.5" width="17" height="17" rx="3" stroke="currentColor" strokeWidth="1.75" />
          <path d="M7 3.5v5.5l4-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M17 20.5v-5.5l-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20.5 7h-5.5l3 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3.5 17h5.5l-3-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="2.25" fill="currentColor" />
        </svg>
      </div>

      {/* Editorial Wordmark */}
      {showText && (
        <div className="flex flex-col text-left">
          <div className={`font-serif tracking-tight text-stone-900 dark:text-stone-100 ${textClasses} flex items-center gap-1.5 leading-none`}>
            <span className="font-bold">Meta</span>
            <span className="font-normal italic">Zap</span>
            <span className="font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 font-semibold">
              LAB
            </span>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-stone-500 dark:text-stone-400 mt-1 hidden sm:block">
            In-Browser Privacy Studio
          </span>
        </div>
      )}
    </div>
  );
}
