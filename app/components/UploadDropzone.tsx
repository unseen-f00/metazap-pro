'use client';

/**
 * UploadDropzone.tsx
 * Architectural Darkroom Ingestion Dropzone for MetaZap.
 * Features:
 * - Corner registration marks (+) evoking contact sheets & darkroom proofing
 * - Strict client-side MIME & extension verification
 * - Accessible focus rings & keyboard activation (Enter / Space)
 * - Minimalist editorial toast notification on validation rejection
 * - Full Dark Mode & Mobile Responsive
 */

import { useState, useRef, useEffect } from 'react';
import { validateImageFile } from '@/app/lib/imageValidator';

export interface UploadDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  multiple?: boolean;
  accept?: string;
  label?: string;
  description?: string;
  selectedFilesCount?: number;
}

export default function UploadDropzone({
  onFilesSelected,
  maxFiles = 25,
  multiple = true,
  accept = 'image/jpeg,image/png,image/webp,image/tiff,image/gif,image/bmp,image/heic,image/heif',
  label = 'Drop photograph here to inspect & sanitize',
  description = 'JPEG, PNG, WebP, TIFF, GIF, HEIC — up to 20MB each',
  selectedFilesCount = 0,
}: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 6000);
  };

  const dismissToast = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setToastMessage(null);
    setErrorMessage(null);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      handleFiles(Array.from(droppedFiles));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      handleFiles(files);
    }
    // Clear value to allow re-upload of the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFiles = (fileList: File[]) => {
    const validFiles: File[] = [];
    let firstError: string | null = null;

    for (const file of fileList) {
      const result = validateImageFile(file, accept);
      if (result.isValid) {
        validFiles.push(file);
      } else if (!firstError) {
        firstError = result.errorMessage;
      }
    }

    if (firstError) {
      setErrorMessage(firstError);
      showToast(firstError);
    } else {
      setErrorMessage(null);
      setToastMessage(null);
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles.slice(0, maxFiles));
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Editorial Toast / Alert Notification */}
      {toastMessage && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-4 p-4 rounded-lg bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 border border-stone-800 dark:border-stone-200 text-xs shadow-md flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <div className="flex items-start gap-2.5">
            <span className="font-mono text-sm leading-none shrink-0" aria-hidden="true">
              [!]
            </span>
            <div>
              <p className="editorial-kicker text-stone-400 dark:text-stone-600">
                Format Restriction
              </p>
              <p className="mt-0.5 leading-relaxed font-sans">{toastMessage}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={dismissToast}
            className="font-mono text-[11px] font-bold px-2 py-0.5 rounded border border-stone-700 dark:border-stone-300 hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors"
            aria-label="Dismiss alert"
          >
            DISMISS
          </button>
        </div>
      )}

      {/* Main Drag-and-Drop Ingestion Target */}
      <div
        className={`relative border rounded-xl p-8 sm:p-12 md:p-14 text-center transition-all duration-150 cursor-pointer select-none focus:outline-none focus:ring-1 focus:ring-stone-900 dark:focus:ring-stone-100 ${
          isDragging
            ? 'border-stone-900 dark:border-stone-100 bg-stone-100/90 dark:bg-stone-800/80 scale-[1.005]'
            : 'border-dashed border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/40 hover:border-stone-900 dark:hover:border-stone-400 hover:bg-white dark:hover:bg-stone-900/80'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openFileDialog();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Upload photo"
      >
        {/* Contact-sheet corner crosshairs (+) */}
        <span className="absolute top-2.5 left-3 font-mono text-xs text-stone-300 dark:text-stone-700 select-none pointer-events-none">
          +
        </span>
        <span className="absolute top-2.5 right-3 font-mono text-xs text-stone-300 dark:text-stone-700 select-none pointer-events-none">
          +
        </span>
        <span className="absolute bottom-2.5 left-3 font-mono text-xs text-stone-300 dark:text-stone-700 select-none pointer-events-none">
          +
        </span>
        <span className="absolute bottom-2.5 right-3 font-mono text-xs text-stone-300 dark:text-stone-700 select-none pointer-events-none">
          +
        </span>

        {/* Hidden native input */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden sr-only"
          multiple={multiple}
          accept={accept}
          onChange={handleFileSelect}
          aria-hidden="true"
        />

        <div className="pointer-events-none">
          {/* Architectural Aperture Icon */}
          <div className="w-12 h-12 mx-auto mb-4 rounded-full border border-stone-200 dark:border-stone-700 flex items-center justify-center bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 shrink-0"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>

          <span className="editorial-kicker text-stone-400 dark:text-stone-500 block mb-1.5">
            [ INGESTION PLANE // LOCAL MEMORY ]
          </span>

          <p className="font-serif text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 mb-2 tracking-tight">
            {label}
          </p>

          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto leading-relaxed font-sans mb-4">
            {description}
          </p>

          {selectedFilesCount > 0 ? (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-950 rounded-md text-xs font-mono font-medium">
              ✓ {selectedFilesCount} photo{selectedFilesCount > 1 ? 's' : ''} queued for local processing
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 font-mono text-[11px] bg-white dark:bg-stone-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400"></span>
              <span>Tap to select or drag photo · Zero server upload</span>
            </div>
          )}

          {errorMessage && (
            <p className="mt-4 font-mono text-xs text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-3 py-1.5 rounded-md inline-block border border-rose-200 dark:border-rose-900">
              [ERROR] {errorMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
