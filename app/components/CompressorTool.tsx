'use client';

/**
 * CompressorTool.tsx
 * Photo Size Editor & Dynamic Compressor.
 * 100% Client-Side In-Browser Compression:
 * - Dynamic Quality Slider (10% - 100%)
 * - Dynamic Resolution Scale Slider (10% - 100%)
 * - Real-time size calculation & space saved analytics
 * - Zero server uploads & verified metadata stripping
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { saveAs } from 'file-saver';
import UploadDropzone from '@/app/components/UploadDropzone';
import FileSizeAnalyticsCard from '@/app/components/FileSizeAnalyticsCard';
import { calculateSizeAnalytics, SizeAnalytics, formatFileSize } from '@/app/lib/metadataRemover';
import { verifyCleanBlob } from '@/app/utils/metadataTester';
import { triggerSuccessConfetti } from '@/app/lib/confetti';

type OutputFormat = 'image/jpeg' | 'image/webp' | 'image/png';

export default function CompressorTool() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Compression settings
  const [quality, setQuality] = useState<number>(0.80);
  const [scale, setScale] = useState<number>(1.0);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('image/jpeg');

  // Compressed result
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressedDimensions, setCompressedDimensions] = useState<{ width: number; height: number } | null>(null);
  const [sizeAnalytics, setSizeAnalytics] = useState<SizeAnalytics | null>(null);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);

  const imageElementRef = useRef<HTMLImageElement | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const compressImage = useCallback(
    async (
      img: HTMLImageElement,
      targetQuality: number,
      targetScale: number,
      targetFormat: OutputFormat
    ) => {
      setIsCompressing(true);
      try {
        const origW = img.naturalWidth || img.width;
        const origH = img.naturalHeight || img.height;
        const targetW = Math.max(1, Math.round(origW * targetScale));
        const targetH = Math.max(1, Math.round(origH * targetScale));

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas 2D context unavailable');

        // Fill background white for JPEG so transparent PNG doesn't turn black
        if (targetFormat === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, targetW, targetH);
        }

        // Draw scaled image
        ctx.drawImage(img, 0, 0, targetW, targetH);

        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (b) => {
              if (b) resolve(b);
              else reject(new Error('Failed to encode compressed canvas'));
            },
            targetFormat,
            targetQuality
          );
        });

        // Cleanup canvas memory
        try {
          ctx.clearRect(0, 0, targetW, targetH);
          canvas.width = 0;
          canvas.height = 0;
        } catch {
          // Ignore cleanup
        }

        if (compressedUrl) URL.revokeObjectURL(compressedUrl);
        const newUrl = URL.createObjectURL(blob);
        setCompressedBlob(blob);
        setCompressedUrl(newUrl);
        setCompressedDimensions({ width: targetW, height: targetH });

        if (selectedFile) {
          const analytics = calculateSizeAnalytics(selectedFile.size, blob.size);
          setSizeAnalytics(analytics);
        }
      } catch (err) {
        console.error('Compression failed:', err);
      } finally {
        setIsCompressing(false);
      }
    },
    [compressedUrl, selectedFile]
  );

  const handleFilesSelected = (files: File[]) => {
    if (!files.length) return;
    const file = files[0];
    if (!file || file.size === 0) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);

    setSelectedFile(file);

    // Initial default format matching file type
    const mime = file.type === 'image/png' ? 'image/png' : file.type === 'image/webp' ? 'image/webp' : 'image/jpeg';
    setOutputFormat(mime);

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageElementRef.current = img;
      setOriginalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      compressImage(img, quality, scale, mime);
    };
    img.src = objectUrl;
  };

  // Re-compress dynamically when settings change with debounce
  useEffect(() => {
    if (!imageElementRef.current) return;
    const img = imageElementRef.current;

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      compressImage(img, quality, scale, outputFormat);
    }, 120);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [quality, scale, outputFormat, compressImage]);

  const handleDownload = async () => {
    if (!compressedBlob || !selectedFile) return;

    // Automated QA verification: assert 0 tags remain
    await verifyCleanBlob(compressedBlob);

    const ext = outputFormat === 'image/jpeg' ? '.jpg' : outputFormat === 'image/webp' ? '.webp' : '.png';
    const baseName = selectedFile.name.replace(/\.[^/.]+$/, '');
    const filename = `compressed_${baseName}${ext}`;

    saveAs(compressedBlob, filename);
    triggerSuccessConfetti();
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    imageElementRef.current = null;
    setSelectedFile(null);
    setOriginalDimensions(null);
    setPreviewUrl(null);
    setCompressedBlob(null);
    setCompressedUrl(null);
    setCompressedDimensions(null);
    setSizeAnalytics(null);
    setQuality(0.8);
    setScale(1.0);
  };

  return (
    <div className="editorial-card p-5 sm:p-8 md:p-10 mb-14 shadow-paper border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 transition-colors">
      {!selectedFile ? (
        <UploadDropzone
          onFilesSelected={handleFilesSelected}
          label="Drop photo here to compress & scale"
          description="JPEG, PNG, WebP — reduce file size with real-time sliders"
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        />
      ) : (
        <div className="space-y-6">
          {/* Header controls bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200 dark:border-stone-800">
            <div>
              <span className="editorial-kicker text-stone-400 dark:text-stone-500 block mb-1">
                DYNAMIC COMPRESSION STUDIO
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100">
                {selectedFile.name}
              </h3>
              <p className="font-mono text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Original:{' '}
                <span className="font-semibold text-stone-700 dark:text-stone-300">
                  {formatFileSize(selectedFile.size)}
                </span>
                {originalDimensions && (
                  <span>
                    {' '}
                    • {originalDimensions.width} × {originalDimensions.height} px
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={handleReset}
              className="self-start sm:self-auto font-mono text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-stone-100 border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
            >
              [ Upload Different Photo ]
            </button>
          </div>

          {/* Interactive Controls & Sliders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 bg-stone-50/70 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 rounded-xl shadow-2xs">
            {/* Control 1: Compression Quality Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-serif font-bold text-stone-800 dark:text-stone-200">
                  Compression Quality
                </span>
                <span className="font-mono font-bold text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 px-2 py-0.5 rounded border border-stone-200 dark:border-stone-700">
                  {Math.round(quality * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.10"
                max="1.00"
                step="0.05"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-stone-900 dark:accent-stone-100"
              />
              <div className="flex justify-between font-mono text-[10px] text-stone-400">
                <span>Smallest File (10%)</span>
                <span>Balanced (80%)</span>
                <span>Max Quality (100%)</span>
              </div>
            </div>

            {/* Control 2: Resolution Scale Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-serif font-bold text-stone-800 dark:text-stone-200">
                  Resolution Scale
                </span>
                <span className="font-mono font-bold text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 px-2 py-0.5 rounded border border-stone-200 dark:border-stone-700">
                  {Math.round(scale * 100)}%
                  {compressedDimensions && (
                    <span className="ml-1 text-[11px] text-stone-500 font-normal">
                      ({compressedDimensions.width}×{compressedDimensions.height})
                    </span>
                  )}
                </span>
              </div>
              <input
                type="range"
                min="0.10"
                max="1.00"
                step="0.05"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-stone-900 dark:accent-stone-100"
              />
              <div className="flex justify-between font-mono text-[10px] text-stone-400">
                <span>Mini (10%)</span>
                <span>Half (50%)</span>
                <span>Original (100%)</span>
              </div>
            </div>

            {/* Control 3: Output Format Preset Buttons */}
            <div className="space-y-2 md:col-span-2 pt-3 border-t border-stone-200/60 dark:border-stone-800/60">
              <span className="editorial-kicker text-stone-400 dark:text-stone-500 block">
                Target Format
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { format: 'image/jpeg' as OutputFormat, label: 'JPEG (Universal)', icon: '📷' },
                  { format: 'image/webp' as OutputFormat, label: 'WebP (Efficient)', icon: '🌐' },
                  { format: 'image/png' as OutputFormat, label: 'PNG (Lossless / Alpha)', icon: '🖼️' },
                ].map((item) => (
                  <button
                    key={item.format}
                    type="button"
                    onClick={() => setOutputFormat(item.format)}
                    className={`px-3 py-2 text-xs font-mono rounded-lg border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      outputFormat === item.format
                        ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-950 border-stone-900 dark:border-stone-100 font-bold shadow-2xs'
                        : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Preview & Comparison */}
          {compressedUrl && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-stone-200 dark:border-stone-800 rounded-xl p-4 bg-white dark:bg-stone-900 flex flex-col items-center">
                <span className="editorial-kicker text-stone-400 dark:text-stone-500 mb-2">Original Photograph</span>
                {previewUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt="Original"
                    className="max-h-56 object-contain rounded-lg bg-stone-50 dark:bg-stone-950/40"
                  />
                )}
                <span className="mt-2.5 font-mono text-xs text-stone-600 dark:text-stone-400">
                  {formatFileSize(selectedFile.size)}
                </span>
              </div>

              <div className="border border-stone-200 dark:border-stone-800 rounded-xl p-4 bg-stone-50/50 dark:bg-stone-850 flex flex-col items-center relative">
                <span className="editorial-kicker text-stone-900 dark:text-stone-100 mb-2 flex items-center gap-1 font-bold">
                  ✓ Compressed Preview
                  {isCompressing && <span className="animate-pulse font-normal">(Calculating...)</span>}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={compressedUrl}
                  alt="Compressed"
                  className="max-h-56 object-contain rounded-lg bg-white dark:bg-stone-950/40"
                />
                <span className="mt-2.5 font-mono text-xs font-bold text-stone-900 dark:text-stone-100">
                  {compressedBlob ? formatFileSize(compressedBlob.size) : '...'}
                </span>
              </div>
            </div>
          )}

          {/* Size Analytics Before vs After */}
          {sizeAnalytics && (
            <FileSizeAnalyticsCard analytics={sizeAnalytics} title="Compression Ledger" />
          )}

          {/* Download Action */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownload}
              disabled={isCompressing || !compressedBlob}
              className="flex items-center gap-2 px-6 py-3.5 bg-stone-900 hover:bg-black dark:bg-stone-100 dark:hover:bg-white disabled:opacity-50 text-stone-50 dark:text-stone-950 font-mono text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download Compressed Image</span>
            </button>

            <button
              onClick={handleReset}
              className="px-5 py-3.5 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-mono text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
