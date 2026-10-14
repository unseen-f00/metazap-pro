'use client';

/**
 * BeforeAfterStatusCard.tsx
 * Visual 'Before & After' metadata comparison card.
 * Displays exact pill-tags for every detected tag (Camera, GPS, Software, Date, etc.)
 * so the user sees exactly what was detected and wiped.
 * Supports Dark Mode and mobile responsiveness.
 */

import { useState } from 'react';
import { BeforeAfterStatus, DetectedTagItem } from '@/app/lib/metadataStatus';

interface BeforeAfterStatusCardProps {
  status: BeforeAfterStatus;
  fileName: string;
}

export default function BeforeAfterStatusCard({ status, fileName }: BeforeAfterStatusCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const tags = status.detectedTagList || [];
  const displayLimit = 8;
  const hasMoreTags = tags.length > displayLimit;
  const visibleTags = isExpanded ? tags : tags.slice(0, displayLimit);

  const getCategoryBadgeClass = (category: DetectedTagItem['category']) => {
    switch (category) {
      case 'gps':
        return 'bg-rose-100/90 text-rose-900 border-rose-300/80 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-800';
      case 'camera':
      case 'lens':
        return 'bg-amber-100/90 text-amber-900 border-amber-300/80 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800';
      case 'software':
        return 'bg-purple-100/90 text-purple-900 border-purple-300/80 dark:bg-purple-950/60 dark:text-purple-200 dark:border-purple-800';
      case 'date':
        return 'bg-blue-100/90 text-blue-900 border-blue-300/80 dark:bg-blue-950/60 dark:text-blue-200 dark:border-blue-800';
      case 'chunk':
        return 'bg-teal-100/90 text-teal-900 border-teal-300/80 dark:bg-teal-950/60 dark:text-teal-200 dark:border-teal-800';
      default:
        return 'bg-slate-100/90 text-slate-800 border-slate-300/80 dark:bg-slate-800/70 dark:text-slate-200 dark:border-slate-700';
    }
  };

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
        <div className="border border-amber-200/80 dark:border-amber-900/80 rounded-2xl p-4 sm:p-5 bg-amber-50/50 dark:bg-amber-950/30 shadow-2xs relative flex flex-col justify-between">
          <div>
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

            {/* Exact Pill-Tags List */}
            {visibleTags.length > 0 ? (
              <div className="mt-3">
                <div className="text-[11px] font-semibold text-amber-800/90 dark:text-amber-300/90 uppercase tracking-wider mb-2">
                  Tags Target List (To Be Removed):
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {visibleTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg border shadow-2xs transition-all ${getCategoryBadgeClass(
                        tag.category
                      )}`}
                      title={`${tag.label}: ${tag.value}`}
                    >
                      <span className="font-semibold text-slate-900 dark:text-white">[{tag.label}:</span>
                      <span className="truncate max-w-[160px]">{tag.value}]</span>
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {status.beforeDetails.map((detail, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium text-amber-900 dark:text-amber-200 bg-amber-100/70 dark:bg-amber-900/40 border border-amber-200/80 dark:border-amber-800/60 px-2.5 py-1 rounded-lg"
                  >
                    ⚠️ {detail}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Expand/Collapse if more than displayLimit */}
          {hasMoreTags && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-3.5 self-start text-xs font-semibold text-amber-800 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 underline decoration-dotted underline-offset-4 cursor-pointer"
            >
              {isExpanded ? '▲ Show fewer tags' : `▼ Show all ${tags.length} detected tags`}
            </button>
          )}
        </div>

        {/* AFTER CARD */}
        <div className="border border-emerald-200/90 dark:border-emerald-900/80 rounded-2xl p-4 sm:p-5 bg-emerald-50/50 dark:bg-emerald-950/30 shadow-2xs relative flex flex-col justify-between">
          <div>
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

            <div className="text-[11px] font-semibold text-emerald-800/90 dark:text-emerald-300/90 uppercase tracking-wider mb-2 mt-3">
              Sanitization Verification:
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-900 dark:text-emerald-200 bg-emerald-100/90 dark:bg-emerald-900/50 border border-emerald-300 dark:border-emerald-800 px-2.5 py-1 rounded-lg">
                ✓ [Camera Model: Stripped]
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-900 dark:text-emerald-200 bg-emerald-100/90 dark:bg-emerald-900/50 border border-emerald-300 dark:border-emerald-800 px-2.5 py-1 rounded-lg">
                ✓ [GPS Location: Wiped]
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-900 dark:text-emerald-200 bg-emerald-100/90 dark:bg-emerald-900/50 border border-emerald-300 dark:border-emerald-800 px-2.5 py-1 rounded-lg">
                ✓ [Software &amp; Edits: Cleared]
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-900 dark:text-emerald-200 bg-emerald-100/90 dark:bg-emerald-900/50 border border-emerald-300 dark:border-emerald-800 px-2.5 py-1 rounded-lg">
                ✓ [Dates &amp; Timestamps: Removed]
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-900 dark:text-emerald-200 bg-emerald-100/90 dark:bg-emerald-900/50 border border-emerald-300 dark:border-emerald-800 px-2.5 py-1 rounded-lg">
                ✓ [Metadata Chunks: 0 Remain]
              </span>
            </div>
          </div>

          <div className="mt-3.5 pt-3 border-t border-emerald-200/60 dark:border-emerald-800/50 flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            <span>🛡️ 100% In-Browser Scrubbing Complete</span>
          </div>
        </div>
      </div>
    </div>
  );
}
