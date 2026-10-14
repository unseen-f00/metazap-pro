'use client';

/**
 * Logo.tsx
 * Strictly constrained, scalable vector brand logo for MetaZap.
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
    lg: 'w-10 h-10 md:w-12 md:h-12',
  }[size];

  const textClasses = {
    sm: 'text-lg',
    md: 'text-xl md:text-2xl',
    lg: 'text-2xl md:text-3xl',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Constrained Icon Container */}
      <div
        className={`relative ${iconSizeClasses} shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10`}
        style={{ maxWidth: '48px', maxHeight: '48px' }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 shrink-0 text-white drop-shadow-xs"
          aria-hidden="true"
        >
          {/* Shield / Photo Frame outline */}
          <path
            d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-90"
          />
          {/* Electric Zap (Lightning) piercing through metadata */}
          <path
            d="M13 7l-3.5 5h3L11 17l4.5-6h-3.5L13 7z"
            fill="#FBBF24"
            stroke="#D97706"
            strokeWidth="0.75"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Brand Wordmark */}
      {showText && (
        <span className={`font-bold tracking-tight text-slate-900 dark:text-white ${textClasses} flex items-center gap-1`}>
          <span>Meta</span>
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            Zap
          </span>
          <span className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
            PRO
          </span>
        </span>
      )}
    </div>
  );
}
