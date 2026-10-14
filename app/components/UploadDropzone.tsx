'use client';

/**
 * UploadDropzone.tsx
 * Mobile-First, Accessible, Dark-Mode Drag-and-Drop Image Uploader.
 * Strict sizing: w-full max-w-2xl mx-auto p-6 md:p-12 border-2 border-dashed rounded-2xl.
 * Browser input fully hidden (sr-only).
 */

import { useState, useRef } from 'react';
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
  label = 'Drop your images here',
  description = 'JPEG, PNG, WebP, TIFF, GIF, HEIC — up to 20MB each',
  selectedFilesCount = 0,
}: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setErrorMessage(null);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      handleFiles(Array.from(droppedFiles));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFiles = (fileList: File[]) => {
    const validFiles: File[] = [];
    let firstError: string | null = null;

    for (const file of fileList) {
      const result = validateImageFile(file);
      if (result.isValid) {
        validFiles.push(file);
      } else if (!firstError) {
        firstError = result.errorMessage;
      }
    }

    if (firstError && validFiles.length === 0) {
      setErrorMessage(firstError);
    } else {
      setErrorMessage(null);
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles.slice(0, maxFiles));
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`relative w-full max-w-2xl mx-auto border-2 border-dashed rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-12 text-center transition-all cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
        isDragging
          ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 scale-[1.01]'
          : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-white dark:hover:bg-slate-900 hover:shadow-paper'
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
      {/* Hidden browser native file input */}
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
        <div className="mb-3 md:mb-4 text-4xl md:text-5xl" aria-hidden="true">
          ⚡
        </div>
        <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-1.5 md:mb-2">
          {label}
        </p>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          {description}
        </p>

        {selectedFilesCount > 0 ? (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 rounded-full text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            ✓ {selectedFilesCount} file{selectedFilesCount > 1 ? 's' : ''} ready to clean
          </div>
        ) : (
          <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-2xs">
            <svg
              width="14"
              height="14"
              className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Tap to browse or drop here · 100% in-browser</span>
          </div>
        )}

        {errorMessage && (
          <p className="mt-4 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-3 py-1.5 rounded-lg inline-block border border-rose-200 dark:border-rose-900">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}
