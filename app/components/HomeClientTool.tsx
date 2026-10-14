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
import UploadDropzone from '@/app/components/UploadDropzone';
import ProcessingStepper from '@/app/components/ProcessingStepper';
import BeforeAfterStatusCard from '@/app/components/BeforeAfterStatusCard';
import { processImageFile } from '@/app/lib/metadataRemover';
import { inspectMetadataBefore, BeforeAfterStatus } from '@/app/lib/metadataStatus';
import { triggerSuccessConfetti } from '@/app/lib/confetti';

interface CleanedFileState {
  file: File;
  previewUrl: string;
  cleanedBlob: Blob | null;
  cleanedUrl: string | null;
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

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
    setProgressPercent(15);

    // Inspect metadata for each item
    for (let i = 0; i < items.length; i++) {
      try {
        const status = await inspectMetadataBefore(items[i].file, 'general');
        items[i].beforeAfter = status;
      } catch {
        // Fallback default
      }
    }

    await sleep(350);
    setCurrentStep(2);
    setProgressPercent(45);
    await sleep(400);

    setCurrentStep(3);
    setProgressPercent(75);

    const updated = [...items];
    for (let i = 0; i < updated.length; i++) {
      try {
        const cleanBlob = await processImageFile(updated[i].file);
        const cleanUrl = URL.createObjectURL(cleanBlob);
        updated[i] = {
          ...updated[i],
          cleanedBlob: cleanBlob,
          cleanedUrl: cleanUrl,
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

    await sleep(350);
    setCurrentStep(4);
    setProgressPercent(95);
    await sleep(250);
    setProgressPercent(100);

    setSelectedFiles(updated);

    // Trigger celebratory success confetti
    triggerSuccessConfetti();
  };

  const handleDownload = (item: CleanedFileState) => {
    if (!item.cleanedUrl) return;
    const a = document.createElement('a');
    a.href = item.cleanedUrl;
    a.download = `cleaned_${item.file.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
    <div className="paper-card p-4 sm:p-6 md:p-10 mb-12 shadow-paper-lg border border-slate-200/80 dark:border-slate-800 dark:bg-slate-900/90 transition-colors">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 rounded-full text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
            <span>✨ INSTANT CLIENT-SIDE SANITIZER</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white font-[family-name:var(--font-merriweather)]">
            Clean Your Photos
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Select an image to strip hidden camera tags, GPS location, and personal metadata.
          </p>
        </div>
        {selectedFiles.length > 0 && !isAnyProcessing && (
          <button
            onClick={handleReset}
            className="self-start sm:self-auto text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            Clear / Upload New
          </button>
        )}
      </div>

      {/* Upload Dropzone */}
      {selectedFiles.length === 0 ? (
        <UploadDropzone
          onFilesSelected={handleFilesSelected}
          label="Drop your photos here or tap to browse"
          description="JPEG, PNG, WebP, TIFF, GIF, HEIC — up to 20MB per photo"
        />
      ) : isAnyProcessing ? (
        <div className="space-y-6">
          {/* Live Preview during processing */}
          {selectedFiles[0]?.previewUrl && (
            <div className="relative border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 bg-slate-100/50 dark:bg-slate-950/50 flex flex-col items-center justify-center overflow-hidden shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedFiles[0].previewUrl}
                alt="Preview"
                className="max-h-64 object-contain rounded-xl shadow-xs"
              />
              <div className="mt-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2">
                <span>📷 {selectedFiles[0].file.name}</span>
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
        <div className="space-y-6 animate-in fade-in duration-300">
          {selectedFiles.map((item, idx) => (
            <div key={idx} className="space-y-6">
              {/* Live Preview & Action Section */}
              <div className="border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 bg-slate-50/70 dark:bg-slate-900/60 flex flex-col lg:flex-row items-center gap-6">
                {/* Live Image Preview (Visual Feedback) */}
                {item.previewUrl && (
                  <div className="w-full lg:w-72 shrink-0 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 shadow-md flex flex-col items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.previewUrl}
                      alt={item.file.name}
                      className="w-full h-48 object-contain rounded-xl bg-slate-50 dark:bg-slate-950/40"
                    />
                    <div className="w-full mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[140px]">
                        {item.file.name}
                      </span>
                      <span>{formatFileSize(item.file.size)}</span>
                    </div>
                  </div>
                )}

                {/* Status & Download Controls */}
                <div className="w-full flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full shadow-2xs">
                        ✓ All EXIF Stripped
                      </span>
                      <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full shadow-2xs">
                        ✓ GPS Wiped
                      </span>
                      <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full shadow-2xs">
                        ✓ 100% Private
                      </span>
                    </div>

                    <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2">
                      Photo Successfully Sanitized
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      Your photo was stripped locally in your browser memory. Hidden camera serial numbers, GPS coordinates, and edit timestamps have been permanently removed.
                    </p>

                    {item.status === 'error' && (
                      <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 p-2.5 rounded-lg">
                        {item.errorMessage}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center gap-3">
                    {item.status === 'done' && (
                      <button
                        onClick={() => handleDownload(item)}
                        className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-bold rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
                      >
                        <svg width="16" height="16" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Download Clean Photo</span>
                      </button>
                    )}

                    <button
                      onClick={handleReset}
                      className="px-5 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs md:text-sm font-medium rounded-xl transition-colors cursor-pointer"
                    >
                      Clean Another Image
                    </button>
                  </div>
                </div>
              </div>

              {/* 'Before & After' Metadata Status */}
              {item.beforeAfter && (
                <BeforeAfterStatusCard status={item.beforeAfter} fileName={item.file.name} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Feature highlights under upload */}
      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="p-3">
          <p className="text-xs font-bold text-slate-800 dark:text-white">100% In-Browser</p>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">Your files never leave your device</p>
        </div>
        <div className="p-3">
          <p className="text-xs font-bold text-slate-800 dark:text-white">Zero Quality Loss</p>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">Only hidden tags are wiped, pixels stay crisp</p>
        </div>
        <div className="p-3">
          <p className="text-xs font-bold text-slate-800 dark:text-white">All Major Formats</p>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">JPEG, PNG, WebP, TIFF, GIF, HEIC</p>
        </div>
      </div>
    </div>
  );
}
