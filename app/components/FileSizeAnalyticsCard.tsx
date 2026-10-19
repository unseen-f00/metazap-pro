'use client';

/**
 * FileSizeAnalyticsCard.tsx
 * Financial Ledger Style Size & Space Analytics Card for MetaZap.
 * Displays:
 * 1. Original File Size
 * 2. Cleaned Output Size
 * 3. Exact Metadata Pruned (Space Saved)
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
  title = 'Payload & Space Ledger',
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
      <div className="grid grid-cols-3 gap-2 p-2.5 bg-stone-100/70 dark:bg-stone-850 rounded-lg border border-stone-200 dark:border-stone-800 text-center font-mono">
        <div>
          <span className="block text-[9px] uppercase tracking-wider text-stone-400">
            Original
          </span>
          <span className="text-xs font-semibold text-stone-800 dark:text-stone-200">
            {data.originalFormatted}
          </span>
        </div>
        <div>
          <span className="block text-[9px] uppercase tracking-wider text-stone-400">
            Cleaned
          </span>
          <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
            {data.cleanedFormatted}
          </span>
        </div>
        <div>
          <span className="block text-[9px] uppercase tracking-wider text-stone-400">
            Pruned
          </span>
          <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
            {hasSavings ? `-${data.savedFormatted}` : '0 B'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-stone-100 dark:border-stone-800">
        <div>
          <span className="editorial-kicker text-stone-400 dark:text-stone-500 block">
            Byte Accounting
          </span>
          <h4 className="font-serif text-sm font-bold text-stone-900 dark:text-stone-100">
            {title}
          </h4>
        </div>
        <span className="self-start sm:self-auto font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700">
          {hasSavings ? `[ PRUNED ${data.savedPercent}% OVERHEAD ]` : '[ 100% EXIF HEADERS STRIPPED ]'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
        {/* Metric 1: Original Payload */}
        <div className="p-3.5 rounded-lg border border-stone-200/80 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/40">
          <span className="editorial-kicker text-stone-400 dark:text-stone-500 block mb-1">
            01. Initial Payload
          </span>
          <div className="text-base font-bold text-stone-900 dark:text-stone-100">
            {data.originalFormatted}
          </div>
          <p className="font-sans text-[11px] text-stone-400 mt-0.5">
            Raw uploaded file bytes
          </p>
        </div>

        {/* Metric 2: Cleaned Artifact */}
        <div className="p-3.5 rounded-lg border border-stone-200/80 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/40">
          <span className="editorial-kicker text-stone-400 dark:text-stone-500 block mb-1">
            02. Sanitized Artifact
          </span>
          <div className="text-base font-bold text-stone-900 dark:text-stone-100">
            {data.cleanedFormatted}
          </div>
          <p className="font-sans text-[11px] text-stone-400 mt-0.5">
            Visual pixel clarity intact
          </p>
        </div>

        {/* Metric 3: Metadata Pruned */}
        <div className="p-3.5 rounded-lg border border-stone-200/80 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/40">
          <span className="editorial-kicker text-stone-400 dark:text-stone-500 block mb-1">
            03. Pruned Overhead
          </span>
          <div className="text-base font-bold text-stone-900 dark:text-stone-100">
            {hasSavings ? `-${data.savedFormatted}` : 'Headers Purged'}
          </div>
          <p className="font-sans text-[11px] text-stone-400 mt-0.5">
            {hasSavings ? `${data.savedPercent}% payload reduced` : 'Zero tracking markers remain'}
          </p>
        </div>
      </div>
    </div>
  );
}
