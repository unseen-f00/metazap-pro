'use client';

/**
 * AICleanerTool.tsx
 * Client component for AI Data Cleaner page.
 * Uses UploadDropzone to clean AI generation metadata and prompts.
 */

import { useState } from 'react';
import { saveAs } from 'file-saver';
import UploadDropzone from '@/app/components/UploadDropzone';
import { processImageFile, calculateSizeAnalytics, SizeAnalytics } from '@/app/lib/metadataRemover';
import { triggerSuccessConfetti } from '@/app/lib/confetti';
import FileSizeAnalyticsCard from '@/app/components/FileSizeAnalyticsCard';

export default function AICleanerTool() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cleanedUrl, setCleanedUrl] = useState<string | null>(null);
  const [cleanedBlob, setCleanedBlob] = useState<Blob | null>(null);
  const [sizeAnalytics, setSizeAnalytics] = useState<SizeAnalytics | null>(null);
  const [isCleaning, setIsCleaning] = useState(false);

  const handleFilesSelected = async (files: File[]) => {
    if (!files.length) return;
    const file = files[0];
    if (!file || file.size === 0) return;
    setSelectedFile(file);
    setIsCleaning(true);

    try {
      const cleanBlob = await processImageFile(file);
      setCleanedBlob(cleanBlob);
      const url = URL.createObjectURL(cleanBlob);
      setCleanedUrl(url);

      const analytics = calculateSizeAnalytics(file.size, cleanBlob.size);
      setSizeAnalytics(analytics);
      triggerSuccessConfetti();
    } catch (err) {
      console.error(err);
    } finally {
      setIsCleaning(false);
    }
  };

  const handleDownload = () => {
    if (!selectedFile) return;
    const filename = `cleaned_${selectedFile.name}`;
    if (cleanedBlob) {
      saveAs(cleanedBlob, filename);
    } else if (cleanedUrl) {
      const a = document.createElement('a');
      a.href = cleanedUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleReset = () => {
    if (cleanedUrl) URL.revokeObjectURL(cleanedUrl);
    setSelectedFile(null);
    setCleanedUrl(null);
    setCleanedBlob(null);
    setSizeAnalytics(null);
  };

  return (
    <div className="editorial-card p-6 md:p-10 mb-12">
      <div className="editorial-kicker mb-2">SYNTHETIC INGESTION // NEURAL WORKFLOW STRIPPER</div>
      <h2 className="font-serif text-2xl md:text-3xl font-bold text-ink dark:text-chalk mb-2">
        AI Metadata &amp; Prompt Sanitizer
      </h2>
      <p className="text-sm text-ink/70 dark:text-chalk/70 mb-6 font-sans">
        Purges C2PA provenance manifests, generation prompt dictionaries, seed numbers, and synthetic markers embedded by generative tools.
      </p>

      {!selectedFile ? (
        <UploadDropzone
          onFilesSelected={handleFilesSelected}
          label="Drop AI-generated or edited images here"
          description="JPEG, PNG, WebP — up to 20MB per photo"
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        />
      ) : (
        <div className="space-y-6">
          <div className="border border-hairline rounded-lg p-5 bg-surface-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-md bg-surface border border-hairline flex items-center justify-center font-mono text-xs font-bold text-ink dark:text-chalk shrink-0">
                AI
              </div>
              <div>
                <p className="font-mono font-semibold text-ink dark:text-chalk text-xs sm:text-sm">{selectedFile.name}</p>
                <p className="font-mono text-xs text-ink/60 dark:text-chalk/60 mt-0.5">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
                {cleanedUrl && (
                  <span className="inline-block mt-2 font-mono text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                    ✓ AI PROMPTS &amp; C2PA MANIFESTS STRIPPED
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isCleaning ? (
                <span className="font-mono text-xs text-ink/70 dark:text-chalk/70 bg-surface border border-hairline px-4 py-2.5 rounded-md animate-pulse">
                  CLEANING AI TAGS...
                </span>
              ) : cleanedUrl ? (
                <button
                  onClick={handleDownload}
                  className="px-5 py-2.5 bg-stone-900 text-stone-100 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 text-xs font-mono font-bold tracking-wider uppercase rounded-md transition-all shadow-sm flex items-center gap-2"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>DOWNLOAD CLEAN IMAGE</span>
                </button>
              ) : null}

              <button
                onClick={handleReset}
                className="px-4 py-2.5 border border-hairline bg-surface hover:bg-hairline/30 text-ink/80 dark:text-chalk/80 text-xs font-mono font-medium rounded-md transition-colors"
              >
                RESET
              </button>
            </div>
          </div>

          {/* File Size Analytics (Before vs After) */}
          {sizeAnalytics && (
            <FileSizeAnalyticsCard analytics={sizeAnalytics} />
          )}
        </div>
      )}
    </div>
  );
}
