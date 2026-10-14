'use client';

/**
 * AICleanerTool.tsx
 * Client component for AI Data Cleaner page.
 * Uses UploadDropzone to clean AI generation metadata and prompts.
 */

import { useState } from 'react';
import UploadDropzone from '@/app/components/UploadDropzone';
import { processImageFile } from '@/app/lib/metadataRemover';

export default function AICleanerTool() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cleanedUrl, setCleanedUrl] = useState<string | null>(null);
  const [isCleaning, setIsCleaning] = useState(false);

  const handleFilesSelected = async (files: File[]) => {
    if (!files.length) return;
    const file = files[0];
    setSelectedFile(file);
    setIsCleaning(true);

    try {
      const cleanBlob = await processImageFile(file);
      const url = URL.createObjectURL(cleanBlob);
      setCleanedUrl(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCleaning(false);
    }
  };

  const handleDownload = () => {
    if (!cleanedUrl || !selectedFile) return;
    const a = document.createElement('a');
    a.href = cleanedUrl;
    a.download = `cleaned_${selectedFile.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    if (cleanedUrl) URL.revokeObjectURL(cleanedUrl);
    setSelectedFile(null);
    setCleanedUrl(null);
  };

  return (
    <div className="paper-card p-6 md:p-10 shadow-paper-lg mb-12 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
      <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 font-[family-name:var(--font-merriweather)]">
        AI Metadata Removal
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Strips C2PA provenance tags, generation prompts, and synthetic markers embedded by AI tools.
      </p>

      {!selectedFile ? (
        <UploadDropzone
          onFilesSelected={handleFilesSelected}
          label="Drop AI-generated or edited images here"
          description="JPEG, PNG, WebP — up to 20MB per photo"
        />
      ) : (
        <div className="space-y-6">
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 bg-slate-50 dark:bg-slate-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🤖</span>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{selectedFile.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
                {cleanedUrl && (
                  <span className="inline-block mt-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded">
                    ✓ AI Prompts & C2PA Stripped
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isCleaning ? (
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-4 py-2.5 rounded-xl">
                  Cleaning AI tags...
                </span>
              ) : cleanedUrl ? (
                <button
                  onClick={handleDownload}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Clean Image
                </button>
              ) : null}

              <button
                onClick={handleReset}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-xl transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
