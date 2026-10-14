'use client';

/**
 * MetadataEditorTool.tsx
 * Client component for manually editing and injecting EXIF metadata into photos.
 * Uses ProcessingStepper for transparent scanning and piexifjs for binary EXIF manipulation.
 */

import { useState, useRef, useEffect } from 'react';
import UploadDropzone from '@/app/components/UploadDropzone';
import ProcessingStepper from '@/app/components/ProcessingStepper';
import { readExifForEditor, injectExifData, formatExifDate, ExifEditorFields } from '@/app/lib/exifEditor';
import { triggerSuccessConfetti } from '@/app/lib/confetti';

export default function MetadataEditorTool() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  // Stepper state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [progressPercent, setProgressPercent] = useState(25);

  // Form fields
  const [fields, setFields] = useState<ExifEditorFields>({
    author: '',
    copyright: '',
    dateOriginal: '',
    software: '',
  });

  const [isApplying, setIsApplying] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFilesSelected = (files: File[]) => {
    if (!files.length) return;
    const file = files[0];
    setSelectedFile(file);
    setErrorMessage(null);
    setDownloadSuccess(false);

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Read image dimensions
    const img = new Image();
    img.onload = () => {
      setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = objectUrl;

    // Run transparent progress stepper
    setIsAnalyzing(true);
    setCurrentStep(1);
    setProgressPercent(25);

    const advance = (step: number, percent: number, delay: number, callback?: () => void) => {
      timerRef.current = setTimeout(() => {
        setCurrentStep(step);
        setProgressPercent(percent);
        if (callback) callback();
      }, delay);
    };

    advance(2, 50, 250, () => {
      advance(3, 75, 300, async () => {
        try {
          const loadedFields = await readExifForEditor(file);
          setFields(loadedFields);
        } catch {
          setFields({
            author: '',
            copyright: `© ${new Date().getFullYear()} All Rights Reserved`,
            dateOriginal: formatExifDate(),
            software: 'MetaZap Metadata Editor',
          });
        }
        advance(4, 100, 250, () => {
          setIsAnalyzing(false);
        });
      });
    });
  };

  const handleApplyAndDownload = async () => {
    if (!selectedFile) return;
    setIsApplying(true);
    setErrorMessage(null);

    try {
      const { blob, fileName } = await injectExifData(selectedFile, fields);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => URL.revokeObjectURL(url), 2000);
      setDownloadSuccess(true);
      triggerSuccessConfetti();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to inject EXIF data';
      setErrorMessage(message);
    } finally {
      setIsApplying(false);
    }
  };

  const handleSetCurrentDate = () => {
    setFields((prev) => ({
      ...prev,
      dateOriginal: formatExifDate(new Date()),
    }));
  };

  const handleClearAll = () => {
    setFields({
      author: '',
      copyright: '',
      dateOriginal: '',
      software: '',
    });
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setDimensions(null);
    setIsAnalyzing(false);
    setDownloadSuccess(false);
    setErrorMessage(null);
    setFields({
      author: '',
      copyright: '',
      dateOriginal: '',
      software: '',
    });
  };

  return (
    <div className="paper-card p-6 md:p-10 shadow-paper-lg mb-12 border border-slate-200/80 dark:border-slate-800">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300 mb-2">
            <span>✏️ EXIF Injection &amp; Customization</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white font-[family-name:var(--font-merriweather)]">
            Manual EXIF Metadata Editor
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Embed your custom artist credits, copyright notice, timestamp, and software tags into your image file.
          </p>
        </div>
        {selectedFile && !isAnalyzing && (
          <button
            onClick={handleReset}
            className="self-start md:self-auto text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:hover:text-white dark:bg-slate-800 dark:hover:bg-slate-700 px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <span>↺</span> Upload Different Image
          </button>
        )}
      </div>

      {!selectedFile ? (
        <UploadDropzone
          onFilesSelected={handleFilesSelected}
          multiple={false}
          label="Drop an image here to edit metadata"
          description="JPEG, PNG, WebP — processed 100% locally in your browser"
        />
      ) : isAnalyzing ? (
        <div className="py-6">
          <ProcessingStepper
            currentStep={currentStep}
            progressPercent={progressPercent}
            customStep3Label="Populating Form"
            customStep3Desc="Extracting editable tags into form inputs"
            fileName={selectedFile?.name}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* File summary preview bar */}
          <div className="border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/70 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {previewUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-14 h-14 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm shrink-0"
                />
              )}
              <div className="min-w-0">
                <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{selectedFile.name}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  <span>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                  {dimensions && (
                    <>
                      <span>•</span>
                      <span>
                        {dimensions.width} × {dimensions.height} px
                      </span>
                    </>
                  )}
                  <span>•</span>
                  <span className="text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                    Ready to Edit
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={handleSetCurrentDate}
                className="text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-900/60 px-3 py-1.5 rounded-lg transition-colors"
                title="Update timestamp to right now"
              >
                🕒 Set Today&apos;s Time
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs font-medium text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:border-slate-700 px-3 py-1.5 rounded-lg transition-colors"
                title="Wipe form inputs"
              >
                Clear Inputs
              </button>
            </div>
          </div>

          {/* Form fields */}
          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Author / Artist / Creator
              </label>
              <input
                type="text"
                value={fields.author}
                onChange={(e) => setFields({ ...fields, author: e.target.value })}
                placeholder="e.g., Alex Morgan Photography"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
              />
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Mapped to EXIF <code className="text-slate-600 dark:text-slate-300 font-mono">ImageIFD.Artist</code>.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Copyright Notice
              </label>
              <input
                type="text"
                value={fields.copyright}
                onChange={(e) => setFields({ ...fields, copyright: e.target.value })}
                placeholder="e.g., © 2026 Alex Morgan. All rights reserved."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
              />
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Mapped to EXIF <code className="text-slate-600 dark:text-slate-300 font-mono">ImageIFD.Copyright</code>.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Date &amp; Time (DateTimeOriginal)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fields.dateOriginal}
                  onChange={(e) => setFields({ ...fields, dateOriginal: e.target.value })}
                  placeholder="YYYY:MM:DD HH:MM:SS"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Standard format: <code className="text-slate-600 dark:text-slate-300 font-mono">YYYY:MM:DD HH:MM:SS</code>.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Software / Tool Signature
              </label>
              <input
                type="text"
                value={fields.software}
                onChange={(e) => setFields({ ...fields, software: e.target.value })}
                placeholder="e.g., Custom Darkroom Suite v4"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
              />
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Mapped to EXIF <code className="text-slate-600 dark:text-slate-300 font-mono">ImageIFD.Software</code>.
              </p>
            </div>
          </div>

          {errorMessage && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 text-xs font-medium">
              ⚠️ {errorMessage}
            </div>
          )}

          {downloadSuccess && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between">
              <span>✓ Your customized image was generated and downloaded successfully!</span>
              <button
                type="button"
                onClick={() => setDownloadSuccess(false)}
                className="text-emerald-700 hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-100 text-xs"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleApplyAndDownload}
              disabled={isApplying}
              className="px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              {isApplying ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Embedding EXIF Data...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 shrink-0" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Apply &amp; Download Photo</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 text-sm font-medium rounded-xl transition-colors"
            >
              Cancel &amp; Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
