'use client';

/**
 * BatchTool.tsx
 * Client component for Bulk / Batch Image Metadata Removal.
 * Accepts multiple files (up to 25), processes each file through transparent
 * progress stages, displays a CSS Grid preview with overlay checkmarks,
 * and triggers confetti on completion with 1-click ZIP export.
 */

import { useState, useRef, useEffect } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import UploadDropzone from '@/app/components/UploadDropzone';
import { processImageFile, calculateSizeAnalytics, SizeAnalytics } from '@/app/lib/metadataRemover';
import { triggerSuccessConfetti } from '@/app/lib/confetti';
import FileSizeAnalyticsCard from '@/app/components/FileSizeAnalyticsCard';
import { verifyCleanBlob } from '@/app/utils/metadataTester';

export interface BatchFileItem {
  id: string;
  file: File;
  previewUrl: string;
  cleanedBlob: Blob | null;
  cleanedUrl: string | null;
  status: 'pending' | 'reading' | 'stripping' | 'finalizing' | 'done' | 'error';
  errorMessage?: string;
  originalSize: number;
  cleanedSize?: number;
  sizeAnalytics?: SizeAnalytics;
}

const STATUS_LABELS: Record<BatchFileItem['status'], { text: string; color: string }> = {
  pending: { text: 'QUEUED', color: 'bg-surface-subtle text-ink/70 dark:text-chalk/70 border-hairline font-mono' },
  reading: { text: '01. INGESTING', color: 'bg-surface-subtle text-ink dark:text-chalk border-hairline font-mono animate-pulse' },
  stripping: { text: '02. STRIPPING', color: 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/30 font-mono animate-pulse' },
  finalizing: { text: '03. FINALIZING', color: 'bg-surface-subtle text-ink dark:text-chalk border-hairline font-mono animate-pulse' },
  done: { text: '✓ SANITIZED', color: 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/30 font-mono' },
  error: { text: '✕ FAILED', color: 'bg-rose-500/10 text-rose-800 dark:text-rose-300 border-rose-500/30 font-mono' },
};

export default function BatchTool() {
  const [items, setItems] = useState<BatchFileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeProcessingIndex, setActiveProcessingIndex] = useState<number | null>(null);
  const [isZipping, setIsZipping] = useState(false);
  const [zipSuccess, setZipSuccess] = useState(false);
  const itemsRef = useRef<BatchFileItem[]>([]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      itemsRef.current.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
        if (item.cleanedUrl) URL.revokeObjectURL(item.cleanedUrl);
      });
    };
  }, []);

  const handleFilesSelected = (files: File[]) => {
    const newItems: BatchFileItem[] = files.map((file, idx) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${idx}`,
      file,
      previewUrl: URL.createObjectURL(file),
      cleanedBlob: null,
      cleanedUrl: null,
      status: 'pending',
      originalSize: file.size,
    }));

    setItems((prev) => [...prev, ...newItems]);
    setZipSuccess(false);
  };

  const handleProcessAll = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setZipSuccess(false);

    const currentItems = [...items];

    // Strictly sequential processing loop (one by one) to prevent mobile browser memory exhaustion
    for (let i = 0; i < currentItems.length; i++) {
      if (currentItems[i].status === 'done') continue;

      setActiveProcessingIndex(i);
      currentItems[i] = { ...currentItems[i], status: 'stripping' };
      setItems([...currentItems]);

      try {
        // True client-side HTML5 canvas stripping with 1.0 quality & active GPU texture disposal
        const cleanBlob = await processImageFile(currentItems[i].file);
        const cleanUrl = URL.createObjectURL(cleanBlob);
        const analytics = calculateSizeAnalytics(currentItems[i].file.size, cleanBlob.size);

        currentItems[i] = {
          ...currentItems[i],
          cleanedBlob: cleanBlob,
          cleanedUrl: cleanUrl,
          cleanedSize: cleanBlob.size,
          sizeAnalytics: analytics,
          status: 'done',
        };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Processing failed';
        currentItems[i] = {
          ...currentItems[i],
          status: 'error',
          errorMessage: message,
        };
      }

      setItems([...currentItems]);
    }

    setActiveProcessingIndex(null);
    setIsProcessing(false);

    // Trigger celebratory success confetti
    triggerSuccessConfetti();
  };

  const handleDownloadSingle = async (item: BatchFileItem) => {
    if (!item.cleanedBlob && !item.cleanedUrl) return;
    const blobToSave = item.cleanedBlob || undefined;
    if (blobToSave) {
      await verifyCleanBlob(blobToSave);
      saveAs(blobToSave, `cleaned_${item.file.name}`);
    } else if (item.cleanedUrl) {
      const a = document.createElement('a');
      a.href = item.cleanedUrl;
      a.download = `cleaned_${item.file.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleDownloadAllAsZip = async () => {
    const finishedItems = items.filter((item) => item.status === 'done' && item.cleanedBlob);
    if (!finishedItems.length) return;

    setIsZipping(true);
    setZipSuccess(false);

    try {
      const zip = new JSZip();
      const folder = zip.folder('cleaned_photos') || zip;

      // Track duplicate filenames
      const nameCounts: Record<string, number> = {};

      for (const item of finishedItems) {
        if (!item.cleanedBlob) continue;
        await verifyCleanBlob(item.cleanedBlob);
        let baseName = item.file.name;
        if (nameCounts[baseName]) {
          const count = nameCounts[baseName]++;
          const extIndex = baseName.lastIndexOf('.');
          if (extIndex !== -1) {
            baseName = `${baseName.slice(0, extIndex)}_(${count})${baseName.slice(extIndex)}`;
          } else {
            baseName = `${baseName}_(${count})`;
          }
        } else {
          nameCounts[baseName] = 1;
        }

        folder.file(`clean_${baseName}`, item.cleanedBlob);
      }

      const zipBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 },
      });

      const timestamp = new Date().toISOString().slice(0, 10);
      saveAs(zipBlob, `cleaned_photos_${timestamp}.zip`);
      setZipSuccess(true);
      triggerSuccessConfetti();
    } catch (err) {
      console.error('Failed to create ZIP archive:', err);
    } finally {
      setIsZipping(false);
    }
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      if (target?.cleanedUrl) URL.revokeObjectURL(target.cleanedUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  const handleReset = () => {
    items.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      if (item.cleanedUrl) URL.revokeObjectURL(item.cleanedUrl);
    });
    setItems([]);
    setIsProcessing(false);
    setActiveProcessingIndex(null);
    setIsZipping(false);
    setZipSuccess(false);
  };

  const completedCount = items.filter((i) => i.status === 'done').length;
  const inProgressCount = items.filter((i) => ['reading', 'stripping', 'finalizing'].includes(i.status)).length;
  const progressPercent = items.length ? Math.round((completedCount / items.length) * 100) : 0;
  const allCompleted = items.length > 0 && completedCount === items.length;

  // Batch analytics computation
  const finishedItems = items.filter((item) => item.status === 'done' && item.cleanedBlob);
  const totalOriginalBytes = finishedItems.reduce((acc, i) => acc + i.originalSize, 0);
  const totalCleanedBytes = finishedItems.reduce((acc, i) => acc + (i.cleanedSize || i.originalSize), 0);
  const batchAnalytics = finishedItems.length > 0 ? calculateSizeAnalytics(totalOriginalBytes, totalCleanedBytes) : null;

  return (
    <div className="editorial-card p-6 md:p-10 mb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-hairline">
        <div>
          <div className="editorial-kicker mb-2">
            BATCH RUNNER // CONCURRENT INGESTION ENGINE
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-ink dark:text-chalk tracking-tight">
            Bulk Photo Sanitizer &amp; ZIP Compilation
          </h2>
          <p className="text-sm text-ink/70 dark:text-chalk/70 mt-1">
            Drop up to 25 assets. Processed sequentially in local sandbox RAM with zero server communication.
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={handleReset}
            disabled={isProcessing}
            className="self-start md:self-auto text-xs font-mono font-medium text-ink/80 dark:text-chalk/80 hover:text-ink dark:hover:text-chalk border border-hairline hover:bg-hairline/40 px-3.5 py-2 rounded-md transition-colors disabled:opacity-40"
          >
            RESET QUEUE / START OVER
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <UploadDropzone
          onFilesSelected={handleFilesSelected}
          maxFiles={25}
          multiple={true}
          label="Drop batch photos here (up to 25 files)"
          description="JPEG, PNG, WebP, TIFF, GIF, HEIC — processed 100% in local memory"
          accept="image/jpeg,image/png,image/webp,image/tiff,image/gif,image/bmp,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.tiff,.gif,.bmp,.heic,.heif"
        />
      ) : (
        <div className="space-y-6">
          {/* Celebratory Completion Banner */}
          {allCompleted && (
            <div className="border border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/20 rounded-lg p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-md bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 flex items-center justify-center font-mono font-bold text-base shrink-0">
                  ✓
                </div>
                <div>
                  <p className="font-serif font-bold text-base text-ink dark:text-chalk">
                    Queue Sanitized &amp; Cryptographically Cleaned
                  </p>
                  <p className="font-mono text-xs text-ink/70 dark:text-chalk/70 mt-0.5">
                    All {items.length} frames stripped of identifiers. Ready to export as unified ZIP.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadAllAsZip}
                disabled={isZipping}
                className="w-full sm:w-auto px-5 py-2.5 bg-stone-900 text-stone-100 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 text-xs font-mono font-bold tracking-wider uppercase rounded-md transition-all shadow-sm flex items-center justify-center gap-2 shrink-0"
              >
                {isZipping ? (
                  <span>COMPILING ZIP ARCHIVE...</span>
                ) : (
                  <span>EXPORT ARCHIVE (.ZIP) ↓</span>
                )}
              </button>
            </div>
          )}

          {/* Batch File Size Analytics Card */}
          {batchAnalytics && (
            <FileSizeAnalyticsCard
              analytics={batchAnalytics}
              title={`Batch Size Savings (${finishedItems.length} Cleaned Images)`}
            />
          )}

          {/* Batch Status Bar */}
          <div className="border border-hairline bg-surface-subtle rounded-lg p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-ink dark:text-chalk mb-3">
              <span className="flex items-center gap-2">
                {isProcessing ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                    <span>
                      PROCESSING {completedCount} OF {items.length}...
                      {activeProcessingIndex !== null && items[activeProcessingIndex]
                        ? ` [${items[activeProcessingIndex].file.name}]`
                        : ''}
                    </span>
                  </>
                ) : allCompleted ? (
                  <>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                    <span>ALL {items.length} ASSETS SUCCESSFULLY SANITIZED</span>
                  </>
                ) : (
                  <span>
                    INGESTION STAGED: {items.length} ASSET{items.length > 1 ? 'S' : ''} IN RUNNER
                  </span>
                )}
              </span>
              <span className="text-ink/60 dark:text-chalk/60">
                {completedCount} / {items.length} COMPLETE ({progressPercent}%)
              </span>
            </div>

            {/* Overall progress bar */}
            <div className="w-full h-1.5 bg-hairline rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  allCompleted ? 'bg-emerald-600 dark:bg-emerald-400' : 'bg-stone-900 dark:bg-stone-100'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Action Bar */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {completedCount < items.length && (
                <button
                  type="button"
                  onClick={handleProcessAll}
                  disabled={isProcessing}
                  className="px-6 py-2.5 bg-stone-900 text-stone-100 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 disabled:opacity-50 text-xs font-mono font-bold tracking-wider uppercase rounded-md transition-all shadow-sm flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                      <span>
                        CLEANING {inProgressCount > 0 ? `(${completedCount + 1}/${items.length})` : '...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <span>CLEAN ALL {items.length} ASSETS</span>
                    </>
                  )}
                </button>
              )}

              {completedCount > 0 && (
                <button
                  type="button"
                  onClick={handleDownloadAllAsZip}
                  disabled={isZipping || isProcessing}
                  className="px-6 py-2.5 border border-hairline bg-surface hover:bg-hairline/30 disabled:opacity-50 text-ink dark:text-chalk text-xs font-mono font-bold tracking-wider uppercase rounded-md transition-all shadow-sm flex items-center gap-2"
                >
                  {isZipping ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                      <span>COMPILING ZIP...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5 shrink-0" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>DOWNLOAD ZIP ARCHIVE ({completedCount} ASSETS)</span>
                    </>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.multiple = true;
                  input.accept = 'image/*';
                  input.onchange = (e) => {
                    const files = (e.target as HTMLInputElement).files;
                    if (files) handleFilesSelected(Array.from(files));
                  };
                  input.click();
                }}
                disabled={isProcessing}
                className="px-4 py-2.5 border border-hairline bg-surface hover:bg-hairline/30 text-ink/80 dark:text-chalk/80 text-xs font-mono font-medium rounded-md transition-colors"
              >
                + ADD MORE ASSETS
              </button>
            </div>

            {zipSuccess && (
              <div className="mt-4 p-3 border border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/30 rounded-md text-emerald-800 dark:text-emerald-200 text-xs font-mono flex items-center justify-between">
                <span>✓ ZIP ARCHIVE ASSEMBLED AND DISPATCHED TO DOWNLOADS</span>
                <button
                  type="button"
                  onClick={() => setZipSuccess(false)}
                  className="text-ink/50 hover:text-ink dark:text-chalk/50 dark:hover:text-chalk ml-4"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Bulk Upload Preview Grid (Visual Feedback Grid) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-ink/60 dark:text-chalk/60 px-1 border-b border-hairline pb-2">
              <span>PHOTO LEDGER ({items.length} ASSETS)</span>
              <span>STAGE STATUS</span>
            </div>

            {/* Responsive Grid: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item, idx) => {
                const statusMeta = STATUS_LABELS[item.status];
                const isItemActive = ['reading', 'stripping', 'finalizing'].includes(item.status);
                const isDone = item.status === 'done';

                return (
                  <div
                    key={item.id}
                    className={`border rounded-lg p-3.5 bg-surface transition-all flex flex-col justify-between ${
                      isDone
                        ? 'border-emerald-500/40 ring-1 ring-emerald-500/20'
                        : isItemActive
                        ? 'border-amber-500/40 ring-1 ring-amber-500/20'
                        : 'border-hairline hover:border-ink/30 dark:hover:border-chalk/30'
                    }`}
                  >
                    <div>
                      {/* Image Preview Container with Contact-Sheet Frame */}
                      <div className="relative w-full h-40 rounded-md overflow-hidden bg-hairline/20 border border-hairline mb-3 flex items-center justify-center">
                        {item.previewUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.previewUrl}
                            alt={item.file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="font-mono text-xs text-ink/40">NO PREVIEW</span>
                        )}

                        {/* Frame index badge */}
                        <div className="absolute top-2 left-2 bg-stone-900/80 backdrop-blur-xs text-stone-100 text-[10px] font-mono px-1.5 py-0.5 rounded">
                          #{String(idx + 1).padStart(2, '0')}
                        </div>

                        {/* Verified badge */}
                        {isDone && (
                          <div className="absolute top-2 right-2 bg-emerald-600 text-white w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs shadow-xs border border-white dark:border-stone-900">
                            ✓
                          </div>
                        )}

                        {/* Processing overlay */}
                        {isItemActive && (
                          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-2xs flex flex-col items-center justify-center gap-1.5 text-stone-100">
                            <span className="w-4 h-4 border-2 border-stone-100 border-t-transparent rounded-full animate-spin"></span>
                            <span className="text-[10px] font-mono tracking-wider">STRIPPING...</span>
                          </div>
                        )}
                      </div>

                      {/* File Details */}
                      <div className="px-0.5 mb-2">
                        <p className="font-mono font-semibold text-xs text-ink dark:text-chalk truncate" title={item.file.name}>
                          {item.file.name}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] font-mono text-ink/60 dark:text-chalk/60 mt-0.5">
                          <span>{(item.file.size / (1024 * 1024)).toFixed(2)} MB</span>
                          <span className="opacity-40">/</span>
                          <span className="uppercase">{item.file.type.split('/')[1] || 'IMAGE'}</span>
                        </div>
                      </div>

                      {/* File Size Analytics */}
                      {item.sizeAnalytics && (
                        <div className="mb-2.5">
                          <FileSizeAnalyticsCard compact analytics={item.sizeAnalytics} />
                        </div>
                      )}
                    </div>

                    {/* Status & Action Footer */}
                    <div className="pt-2 border-t border-hairline flex items-center justify-between gap-2 mt-1">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded border ${statusMeta.color} truncate`}
                      >
                        {statusMeta.text}
                      </span>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isDone && (
                          <button
                            type="button"
                            onClick={() => handleDownloadSingle(item)}
                            className="px-2.5 py-1 border border-hairline bg-surface hover:bg-hairline/40 text-ink dark:text-chalk text-[11px] font-mono font-medium rounded transition-colors flex items-center gap-1"
                            title="Download single clean image"
                          >
                            <svg className="w-3 h-3 shrink-0" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span>SAVE</span>
                          </button>
                        )}

                        {!isProcessing && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1 text-ink/40 hover:text-rose-600 dark:text-chalk/40 dark:hover:text-rose-400 rounded transition-colors"
                            title="Remove image from batch"
                          >
                            <svg className="w-3.5 h-3.5 shrink-0" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
