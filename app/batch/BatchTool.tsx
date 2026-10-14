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
  pending: { text: 'Waiting in queue', color: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' },
  reading: { text: '1. Reading bytes...', color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800 animate-pulse' },
  stripping: { text: '2. Stripping tags...', color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800 animate-pulse' },
  finalizing: { text: '3. Finalizing image...', color: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800 animate-pulse' },
  done: { text: '✓ Cleaned & Safe', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800' },
  error: { text: '✕ Processing Failed', color: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800' },
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
    <div className="paper-card p-6 md:p-10 shadow-paper-lg mb-12 border border-slate-200/80 dark:border-slate-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300 mb-2">
            <span>📦 BATCH PROCESSOR &amp; PREVIEW GRID</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white font-[family-name:var(--font-merriweather)]">
            Bulk Photo Cleaner &amp; ZIP Export
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Drop multiple images to clean them simultaneously. All processed 100% locally in your browser.
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={handleReset}
            disabled={isProcessing}
            className="self-start md:self-auto text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:hover:text-white dark:bg-slate-800 dark:hover:bg-slate-700 px-3.5 py-2 rounded-xl transition-colors disabled:opacity-50"
          >
            Clear All / Start Over
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <UploadDropzone
          onFilesSelected={handleFilesSelected}
          maxFiles={25}
          multiple={true}
          label="Drop multiple photos here (up to 25 files)"
          description="JPEG, PNG, WebP, TIFF, GIF, HEIC — all processed 100% in your browser"
          accept="image/jpeg,image/png,image/webp,image/tiff,image/gif,image/bmp,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.tiff,.gif,.bmp,.heic,.heif"
        />
      ) : (
        <div className="space-y-6">
          {/* Celebratory Banner when all files are completed */}
          {allCompleted && (
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 dark:from-emerald-950/40 dark:via-teal-950/40 dark:to-emerald-950/40 border border-emerald-200/90 dark:border-emerald-800/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs animate-in fade-in duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-xl shadow-sm shrink-0">
                  🎉
                </div>
                <div>
                  <p className="font-bold text-sm sm:text-base text-emerald-950 dark:text-emerald-100">
                    Your images are 100% private and ready!
                  </p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                    All {items.length} photos have been sanitized locally. Ready to download as a single ZIP archive.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadAllAsZip}
                disabled={isZipping}
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 shrink-0"
              >
                {isZipping ? (
                  <span>Zipping...</span>
                ) : (
                  <span>Download ZIP Now ↓</span>
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
          <div className="bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
              <span className="flex items-center gap-2">
                {isProcessing ? (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping"></span>
                    <span>
                      Processed {completedCount} of {items.length} images...
                      {activeProcessingIndex !== null && items[activeProcessingIndex]
                        ? ` (Cleaning "${items[activeProcessingIndex].file.name}")`
                        : ''}
                    </span>
                  </>
                ) : allCompleted ? (
                  <>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                    <span>All {items.length} files successfully cleaned!</span>
                  </>
                ) : (
                  <span>
                    Queue ready: {items.length} file{items.length > 1 ? 's' : ''} staged
                  </span>
                )}
              </span>
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                {completedCount} of {items.length} completed ({progressPercent}%)
              </span>
            </div>

            {/* Overall progress bar */}
            <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  allCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-indigo-600'
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
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs md:text-sm font-bold rounded-xl transition-all shadow-sm flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>
                        Cleaning {inProgressCount > 0 ? `(${completedCount + 1}/${items.length})` : '...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <span>⚡ Clean All {items.length} Photos</span>
                    </>
                  )}
                </button>
              )}

              {completedCount > 0 && (
                <button
                  type="button"
                  onClick={handleDownloadAllAsZip}
                  disabled={isZipping || isProcessing}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs md:text-sm font-bold rounded-xl transition-all shadow-sm flex items-center gap-2"
                >
                  {isZipping ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Creating ZIP Archive...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 shrink-0" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>Download All as ZIP ({completedCount} Files)</span>
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
                className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs md:text-sm font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                + Add More Photos
              </button>
            </div>

            {zipSuccess && (
              <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 text-xs font-medium flex items-center justify-between">
                <span>✓ ZIP package assembled and download started!</span>
                <button
                  type="button"
                  onClick={() => setZipSuccess(false)}
                  className="text-emerald-700 hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-100"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Bulk Upload Preview Grid (Visual Feedback Grid) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
              <span>PHOTO PREVIEW GRID ({items.length} IMAGES)</span>
              <span>LIVE QUEUE STATUS</span>
            </div>

            {/* Responsive CSS Grid: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item, idx) => {
                const statusMeta = STATUS_LABELS[item.status];
                const isItemActive = ['reading', 'stripping', 'finalizing'].includes(item.status);
                const isDone = item.status === 'done';

                return (
                  <div
                    key={item.id}
                    className={`border rounded-2xl p-3.5 bg-white dark:bg-slate-900 transition-all flex flex-col justify-between shadow-xs ${
                      isDone
                        ? 'border-emerald-300 dark:border-emerald-700 ring-2 ring-emerald-100 dark:ring-emerald-950 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-sm'
                        : isItemActive
                        ? 'border-indigo-300 dark:border-indigo-700 ring-2 ring-indigo-100 dark:ring-indigo-950 bg-indigo-50/20 dark:bg-indigo-950/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div>
                      {/* Image Preview Container with Overlay Checkmark */}
                      <div className="relative w-full h-40 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 mb-3 flex items-center justify-center">
                        {item.previewUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.previewUrl}
                            alt={item.file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-3xl text-slate-400">📷</span>
                        )}

                        {/* Order badge */}
                        <div className="absolute top-2 left-2 bg-slate-900/70 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded-md">
                          #{idx + 1}
                        </div>

                        {/* Small checkmark ✓ over preview when done */}
                        {isDone && (
                          <div className="absolute top-2 right-2 bg-emerald-500 text-white w-7 h-7 rounded-full flex items-center justify-center font-black text-sm shadow-md border-2 border-white dark:border-slate-900 animate-in zoom-in-75 duration-200">
                            ✓
                          </div>
                        )}

                        {/* Processing spinner overlay when active */}
                        {isItemActive && (
                          <div className="absolute inset-0 bg-indigo-950/40 backdrop-blur-2xs flex flex-col items-center justify-center gap-1.5 text-white">
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            <span className="text-[11px] font-semibold tracking-wide">Cleaning...</span>
                          </div>
                        )}
                      </div>

                      {/* File Details */}
                      <div className="px-1 mb-2">
                        <p className="font-bold text-slate-900 dark:text-white text-xs truncate" title={item.file.name}>
                          {item.file.name}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          <span>{(item.file.size / (1024 * 1024)).toFixed(2)} MB</span>
                          <span>•</span>
                          <span className="uppercase">{item.file.type.split('/')[1] || 'IMAGE'}</span>
                        </div>
                      </div>

                      {/* File Size Analytics (Before vs After) */}
                      {item.sizeAnalytics && (
                        <div className="mb-2.5">
                          <FileSizeAnalyticsCard compact analytics={item.sizeAnalytics} />
                        </div>
                      )}
                    </div>

                    {/* Status & Action Footer */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 mt-1">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${statusMeta.color} truncate`}
                      >
                        {statusMeta.text}
                      </span>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isDone && (
                          <button
                            type="button"
                            onClick={() => handleDownloadSingle(item)}
                            className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                            title="Download single clean image"
                          >
                            <svg className="w-3 h-3 shrink-0" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span>Save</span>
                          </button>
                        )}

                        {!isProcessing && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
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
