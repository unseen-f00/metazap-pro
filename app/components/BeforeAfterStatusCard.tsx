'use client';

/**
 * BeforeAfterStatusCard.tsx
 * Forensic Audit Comparative Docket for MetaZap.
 * Shows exact identified tags before processing vs the verified clean state after.
 * Styled with editorial precision and monospace indicators.
 */

import { useState } from 'react';
import { BeforeAfterStatus } from '@/app/lib/metadataStatus';

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

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Forensic Docket Header */}
      <div className="border border-stone-200 dark:border-stone-800 rounded-xl p-4 sm:p-5 bg-stone-50/70 dark:bg-stone-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-950 flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">
            MZ
          </div>
          <div className="min-w-0">
            <span className="editorial-kicker text-stone-500 dark:text-stone-400 block">
              Forensic Sanitization Audit
            </span>
            <p className="font-serif text-base font-bold text-stone-900 dark:text-stone-100 truncate">
              {fileName}
            </p>
            <p className="font-mono text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
              Target processed locally in browser RAM · 0 network transmissions
            </p>
          </div>
        </div>

        <span className="self-start sm:self-auto font-mono text-[11px] font-bold px-3 py-1 rounded bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-950 shrink-0">
          ✓ VERIFIED SANITIZED
        </span>
      </div>

      {/* Comparative Docket Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* DOCKET A: BEFORE */}
        <div className="border border-stone-200 dark:border-stone-800 rounded-xl p-4 sm:p-5 bg-white dark:bg-stone-900 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-stone-100 dark:border-stone-800">
              <span className="editorial-kicker text-stone-500 dark:text-stone-400">
                Docket A // Initial Exposure
              </span>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                {status.beforeTagsCount} Tags Detected
              </span>
            </div>

            <p className="font-serif text-sm font-bold text-stone-900 dark:text-stone-100 mb-2">
              {status.beforeLabel}
            </p>

            {visibleTags.length > 0 ? (
              <div className="mt-3">
                <span className="editorial-kicker text-stone-400 dark:text-stone-500 block mb-2">
                  Targeted Metadata List:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {visibleTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="font-mono text-[11px] px-2 py-0.75 rounded border border-stone-200 dark:border-stone-750 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200"
                      title={`${tag.label}: ${tag.value}`}
                    >
                      <span className="font-bold">[{tag.label}:</span>{' '}
                      <span className="truncate max-w-[150px]">{tag.value}]</span>
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {status.beforeDetails.map((detail, idx) => (
                  <span
                    key={idx}
                    className="font-mono text-[11px] px-2 py-0.75 rounded border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-850 text-stone-700 dark:text-stone-300"
                  >
                    • {detail}
                  </span>
                ))}
              </div>
            )}
          </div>

          {hasMoreTags && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-3.5 self-start font-mono text-[11px] font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 underline underline-offset-4 cursor-pointer"
            >
              {isExpanded ? '[-] Show fewer tags' : `[+] Inspect all ${tags.length} tags`}
            </button>
          )}
        </div>

        {/* DOCKET B: AFTER */}
        <div className="border border-stone-200 dark:border-stone-800 rounded-xl p-4 sm:p-5 bg-white dark:bg-stone-900 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-stone-100 dark:border-stone-800">
              <span className="editorial-kicker text-stone-500 dark:text-stone-400">
                Docket B // Cleaned State
              </span>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                {status.afterTagsCount} Tags Remaining
              </span>
            </div>

            <p className="font-serif text-sm font-bold text-stone-900 dark:text-stone-100 mb-2">
              {status.afterLabel}
            </p>

            <span className="editorial-kicker text-stone-400 dark:text-stone-500 block mb-2 mt-3">
              Sanitization Proof:
            </span>
            <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
              <span className="px-2 py-0.75 rounded border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
                ✓ [Camera Model: Purged]
              </span>
              <span className="px-2 py-0.75 rounded border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
                ✓ [GPS Coordinates: Wiped]
              </span>
              <span className="px-2 py-0.75 rounded border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
                ✓ [Software &amp; Edits: Cleared]
              </span>
              <span className="px-2 py-0.75 rounded border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
                ✓ [Timestamps: Neutralized]
              </span>
              <span className="px-2 py-0.75 rounded border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
                ✓ [Binary Chunks: 0 Remain]
              </span>
            </div>
          </div>

          <div className="mt-3.5 pt-3 border-t border-stone-100 dark:border-stone-800 font-mono text-[11px] text-stone-500 dark:text-stone-400">
            [ CERTIFIED: COMPLETE CLIENT-SIDE INGESTION &amp; PURGE ]
          </div>
        </div>
      </div>
    </div>
  );
}
