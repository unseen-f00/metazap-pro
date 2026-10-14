'use client';

/**
 * FileSizeAnalyticsCard.tsx
 * Renders Before vs After File Size Analytics:
 * 1. Original Size
 * 2. Cleaned Size
 * 3. Data Removed (Saved Space)
 */

import { SizeAnalytics, calculateSizeAnalytics } from '@/app/lib/metadataRemover';

interface FileSizeAnalyticsCardProps {
  analytics?: SizeAnalytics;
  originalSize?: number;
  cleanedSize?: number;
  title?: string;
  compact?: boolean;
}

export default function FileSizeAnalyticsCard({
  analytics,
  originalSize,
  cleanedSize,
  title = 'File Size & Space Savings',
  compact = false,
}: FileSizeAnalyticsCardProps) {
  const data =
    analytics ??
    (originalSize !== undefined && cleanedSize !== undefined
      ? calculateSizeAnalytics(originalSize, cleanedSize)
      : null);

  if (!data) return null;

  const hasSavings = data.savedBytes > 0;

  if (compact) {
    return (
      <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-100/70 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-center">
        <div>
          <span className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
            Original
          </span>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            {data.originalFormatted}
          </span>
        </div>
        <div>
          <span className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
            Cleaned
          </span>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {data.cleanedFormatted}
          </span>
        </div>
        <div>
          <span className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
            Removed
          </span>
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            {hasSavings ? `-${data.savedFormatted}` : '0 B'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50/90 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg">📊</span>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            {title}
          </h4>
        </div>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          {hasSavings ? `Wiped ${data.savedPercent}% Metadata` : '100% EXIF Scrubbed'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Metric 1: Original Size */}
        <div className="bg-white dark:bg-slate-800/80 rounded-xl p-3.5 border border-slate-200/70 dark:border-slate-700/70 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            <span>📁</span>
            <span>Original Size</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 font-mono">
            {data.originalFormatted}
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            Initial raw uploaded bytes
          </div>
        </div>

        {/* Metric 2: Cleaned Size */}
        <div className="bg-white dark:bg-slate-800/80 rounded-xl p-3.5 border border-slate-200/70 dark:border-slate-700/70 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
            <span>🛡️</span>
            <span>Cleaned Size</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-emerald-700 dark:text-emerald-400 font-mono">
            {data.cleanedFormatted}
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            100% Visual Quality Preserved
          </div>
        </div>

        {/* Metric 3: Data Removed (Saved Space) */}
        <div className="bg-white dark:bg-slate-800/80 rounded-xl p-3.5 border border-slate-200/70 dark:border-slate-700/70 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-1">
            <span>📉</span>
            <span>Data Removed (Saved Space)</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-indigo-700 dark:text-indigo-400 font-mono">
            {hasSavings ? `-${data.savedFormatted}` : 'Metadata Stripped'}
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            {hasSavings ? `${data.savedPercent}% space saved (${data.savedKb})` : 'Zero tracking tags remain'}
          </div>
        </div>
      </div>
    </div>
  );
}
