'use client';

/**
 * BeforeAfterStatusCard.tsx
 * Visual 'Before & After' metadata comparison card.
 * Displays initial tags found vs. final clean state with celebratory status banner.
 * Supports Dark Mode and mobile responsiveness.
 */

import { BeforeAfterStatus } from '@/app/lib/metadataStatus';

interface BeforeAfterStatusCardProps {
  status: BeforeAfterStatus;
  fileName: string;
}

export default function BeforeAfterStatusCard({ status, fileName }: BeforeAfterStatusCardProps) {
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Celebratory Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-emerald-950/40 border border-emerald-200/90 dark:border-emerald-800/80 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center text-xl shadow-xs shrink-0">
            🛡️
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm sm:text-base text-emerald-950 dark:text-emerald-100 truncate">
              Your image is 100% private and ready!
            </p>
            <p className="text-xs text-emerald-700 dark:text-emerald-300/80 mt-0.5 truncate">
              {fileName} has been sanitized locally in your browser memory.
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100/90 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-xs font-bold rounded-full shrink-0">
          ✓ Clean &amp; Verified
        </span>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* BEFORE CARD */}
        <div className="border border-amber-200/80 dark:border-amber-900/80 rounded-2xl p-4 sm:p-5 bg-amber-50/50 dark:bg-amber-950/30 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Before Processing
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              {status.beforeTagsCount} Tags Detected
            </span>
          </div>

          <p className="font-bold text-slate-900 dark:text-white text-sm mb-2">{status.beforeLabel}</p>

          <div className="flex flex-wrap gap-1.5">
            {status.beforeDetails.map((detail, idx) => (
              <span
                key={idx}
                className="text-xs font-medium text-amber-900 dark:text-amber-200 bg-amber-100/70 dark:bg-amber-900/40 border border-amber-200/80 dark:border-amber-800/60 px-2.5 py-1 rounded-lg"
              >
                ⚠️ {detail}
              </span>
            ))}
          </div>
        </div>

        {/* AFTER CARD */}
        <div className="border border-emerald-200/90 dark:border-emerald-900/80 rounded-2xl p-4 sm:p-5 bg-emerald-50/50 dark:bg-emerald-950/30 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              After Cleaning
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {status.afterTagsCount} Tags Remaining
            </span>
          </div>

          <p className="font-bold text-slate-900 dark:text-white text-sm mb-2">{status.afterLabel}</p>

          <div className="flex flex-wrap gap-1.5">
            {status.afterDetails.map((detail, idx) => (
              <span
                key={idx}
                className="text-xs font-medium text-emerald-900 dark:text-emerald-200 bg-emerald-100/80 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-1 rounded-lg"
              >
                ✓ {detail}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
