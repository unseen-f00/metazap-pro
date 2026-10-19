'use client';

/**
 * HomeClientTool.tsx
 * Interactive client component for the homepage upload & cleaning flow.
 * Featuring:
 * 1. Live Image Preview with rounded-2xl, shadow-md, and object-contain
 * 2. 'Before & After' Metadata Status comparison
 * 3. Confetti celebratory success animation
 * 4. Transparent ProcessingStepper trust-building
 */

import { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import UploadDropzone from '@/app/components/UploadDropzone';
import ProcessingStepper from '@/app/components/ProcessingStepper';
import BeforeAfterStatusCard from '@/app/components/BeforeAfterStatusCard';
import { processImageFile, calculateSizeAnalytics, SizeAnalytics } from '@/app/lib/metadataRemover';
import { inspectMetadataBefore, BeforeAfterStatus } from '@/app/lib/metadataStatus';
import { triggerSuccessConfetti } from '@/app/lib/confetti';
import FileSizeAnalyticsCard from '@/app/components/FileSizeAnalyticsCard';
import { verifyCleanBlob } from '@/app/utils/metadataTester';

interface CleanedFileState {
  file: File;
  previewUrl: string;
  cleanedBlob: Blob | null;
  cleanedUrl: string | null;
  sizeAnalytics?: SizeAnalytics;
  beforeAfter: BeforeAfterStatus | null;
  isProcessing: boolean;
  status: 'idle' | 'processing' | 'done' | 'error';
  errorMessage?: string;
}

export default function HomeClientTool() {
  const [selectedFiles, setSelectedFiles] = useState<CleanedFileState[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [progressPercent, setProgressPercent] = useState(0);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      selectedFiles.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
        if (item.cleanedUrl) URL.revokeObjectURL(item.cleanedUrl);
      });
    };
  }, [selectedFiles]);

  const handleFilesSelected = async (files: File[]) => {
    const newItems: CleanedFileState[] = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      cleanedBlob: null,
      cleanedUrl: null,
      beforeAfter: null,
      isProcessing: true,
      status: 'processing',
    }));

    setSelectedFiles(newItems);

    if (newItems.length > 0) {
      await runSteppedProcessing(newItems);
    }
  };

  const runSteppedProcessing = async (items: CleanedFileState[]) => {
    setCurrentStep(1);
    setProgressPercent(20);

    // Inspect metadata for each item
    for (let i = 0; i < items.length; i++) {
      try {
        const status = await inspectMetadataBefore(items[i].file, 'general');
        items[i].beforeAfter = status;
      } catch {
        // Fallback default
      }
    }

    setCurrentStep(2);
    setProgressPercent(50);

    setCurrentStep(3);
    setProgressPercent(75);

    const updated = [...items];
    for (let i = 0; i < updated.length; i++) {
      try {
        const cleanBlob = await processImageFile(updated[i].file);
        const cleanUrl = URL.createObjectURL(cleanBlob);
        const analytics = calculateSizeAnalytics(updated[i].file.size, cleanBlob.size);
        updated[i] = {
          ...updated[i],
          cleanedBlob: cleanBlob,
          cleanedUrl: cleanUrl,
          sizeAnalytics: analytics,
          isProcessing: false,
          status: 'done',
        };
      } catch {
        updated[i] = {
          ...updated[i],
          isProcessing: false,
          status: 'error',
          errorMessage: 'Could not process this file. Please try another image.',
        };
      }
    }

    setCurrentStep(4);
    setProgressPercent(100);

    setSelectedFiles(updated);

    // Trigger celebratory success confetti
    triggerSuccessConfetti();
  };

  const handleDownload = async (item: CleanedFileState) => {
    const filename = `cleaned_${item.file.name}`;
    if (item.cleanedBlob) {
      await verifyCleanBlob(item.cleanedBlob);
      saveAs(item.cleanedBlob, filename);
    } else if (item.cleanedUrl) {
      const a = document.createElement('a');
      a.href = item.cleanedUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleReset = () => {
    selectedFiles.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      if (item.cleanedUrl) URL.revokeObjectURL(item.cleanedUrl);
    });
    setSelectedFiles([]);
    setCurrentStep(1);
    setProgressPercent(0);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  const isAnyProcessing = selectedFiles.some((f) => f.isProcessing);

  return (
    <div className="editorial-card p-5 sm:p-8 md:p-10 mb-14 shadow-paper border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 transition-colors">
      <div className="mb-6 pb-4 border-b border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="editorial-kicker text-stone-400 dark:text-stone-500 block mb-1">
            [ IN-BROWSER SANITIZER // MEMORY BUFFER ]
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-stone-900 dark:text-stone-100 font-serif tracking-tight">
            Photo Sanitization Studio
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Drop an image to wipe hidden camera models, GPS coordinates, and personal timestamps.
          </p>
        </div>
        {selectedFiles.length > 0 && !isAnyProcessing && (
          <button
            onClick={handleReset}
            className="self-start sm:self-auto font-mono text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-stone-100 border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
          >
            [ Clear / New Image ]
          </button>
        )}
      </div>

      {/* Upload Dropzone */}
      {selectedFiles.length === 0 ? (
        <UploadDropzone
          onFilesSelected={handleFilesSelected}
          label="Drop photograph here to inspect & sanitize"
          description="JPEG, PNG, WebP, TIFF, GIF, HEIC — up to 20MB per photo"
          accept="image/jpeg,image/png,image/webp,image/tiff,image/gif,image/bmp,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.tiff,.gif,.bmp,.heic,.heif"
        />
      ) : isAnyProcessing ? (
        <div className="space-y-6">
          {/* Live Preview during processing */}
          {selectedFiles[0]?.previewUrl && (
            <div className="relative border border-stone-200 dark:border-stone-800 rounded-xl p-4 bg-stone-50/60 dark:bg-stone-950/60 flex flex-col items-center justify-center overflow-hidden shadow-2xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedFiles[0].previewUrl}
                alt="Preview"
                className="max-h-64 object-contain rounded-lg shadow-2xs"
              />
              <div className="mt-3 font-mono text-xs text-stone-600 dark:text-stone-400 flex items-center gap-2">
                <span>{selectedFiles[0].file.name}</span>
                <span>•</span>
                <span>{formatFileSize(selectedFiles[0].file.size)}</span>
              </div>
            </div>
          )}

          <ProcessingStepper
            currentStep={currentStep}
            progressPercent={progressPercent}
            customStep3Label="Stripping Metadata Headers"
            customStep3Desc="Discarding EXIF, GPS & binary chunks while preserving pixels"
            fileName={selectedFiles[0]?.file.name}
          />
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-200">
          {selectedFiles.map((item, idx) => (
            <div key={idx} className="space-y-6">
              {/* Live Preview & Action Section */}
              <div className="border border-stone-200 dark:border-stone-800 rounded-xl p-5 sm:p-6 bg-stone-50/50 dark:bg-stone-900/50 flex flex-col lg:flex-row items-center gap-6">
                {/* Live Image Preview (Darkroom Framed Print) */}
                {item.previewUrl && (
                  <div className="w-full lg:w-72 shrink-0 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl p-3 shadow-2xs flex flex-col items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.previewUrl}
                      alt={item.file.name}
                      className="w-full h-48 object-contain rounded-lg bg-stone-50 dark:bg-stone-900/50"
                    />
                    <div className="w-full mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between font-mono text-[11px] text-stone-500 dark:text-stone-400">
                      <span className="font-semibold text-stone-800 dark:text-stone-200 truncate max-w-[140px]">
                        {item.file.name}
                      </span>
                      <span>{formatFileSize(item.file.size)}</span>
                    </div>
                  </div>
                )}

                {/* Status & Download Controls */}
                <div className="w-full flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-3 font-mono text-[11px]">
                      <span className="px-2.5 py-0.5 rounded border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200">
                        ✓ EXIF STRIPPED
                      </span>
                      <span className="px-2.5 py-0.5 rounded border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200">
                        ✓ GPS WIPED
                      </span>
                      <span className="px-2.5 py-0.5 rounded border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200">
                        ✓ 100% PRIVATE
                      </span>
                    </div>

                    <h3 className="font-serif text-lg md:text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">
                      Photograph Successfully Sanitized
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
                      All hidden camera serial numbers, GPS breadcrumbs, and software edit histories have been pruned locally inside your browser memory.
                    </p>

                    {item.status === 'error' && (
                      <p className="font-mono text-xs text-rose-700 dark:text-rose-400 mt-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 p-2.5 rounded-lg">
                        [ERROR] {item.errorMessage}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-5 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center gap-3">
                    {item.status === 'done' && (
                      <button
                        onClick={() => handleDownload(item)}
                        className="flex items-center gap-2 px-6 py-3.5 bg-stone-900 hover:bg-black dark:bg-stone-100 dark:hover:bg-white text-stone-50 dark:text-stone-950 font-mono text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
                      >
                        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Download Clean Photo</span>
                      </button>
                    )}

                    <button
                      onClick={handleReset}
                      className="px-5 py-3.5 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-mono text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Clean Another Image
                    </button>
                  </div>
                </div>
              </div>

              {/* File Size Analytics (Before vs After) */}
              {item.sizeAnalytics && (
                <FileSizeAnalyticsCard analytics={item.sizeAnalytics} />
              )}

              {/* 'Before & After' Metadata Status */}
              {item.beforeAfter && (
                <BeforeAfterStatusCard status={item.beforeAfter} fileName={item.file.name} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Feature highlights under upload */}
      <div className="mt-8 pt-6 border-t border-stone-100 dark:border-stone-800 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div className="p-2">
          <span className="editorial-kicker text-stone-400 block mb-1">01 / LOCAL BUFFER</span>
          <p className="text-xs font-bold text-stone-900 dark:text-stone-100">100% In-Browser Execution</p>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">Files never leave your local device memory</p>
        </div>
        <div className="p-2 border-t sm:border-t-0 sm:border-l border-stone-100 dark:border-stone-800">
          <span className="editorial-kicker text-stone-400 block mb-1">02 / VISUAL INTEGRITY</span>
          <p className="text-xs font-bold text-stone-900 dark:text-stone-100">Zero Pixel Quality Loss</p>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">Tracking tags stripped while pixels remain untouched</p>
        </div>
        <div className="p-2 border-t sm:border-t-0 sm:border-l border-stone-100 dark:border-stone-800">
          <span className="editorial-kicker text-stone-400 block mb-1">03 / COMPATIBILITY</span>
          <p className="text-xs font-bold text-stone-900 dark:text-stone-100">Standard Image Formats</p>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">JPEG, PNG, WebP, TIFF, GIF, HEIC</p>
        </div>
      </div>
    </div>
  );
}
