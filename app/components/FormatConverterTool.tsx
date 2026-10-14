'use client';

/**
 * FormatConverterTool.tsx
 * Canvas-based Image Format Converters:
 * 1. PNG to JPG (with white background fill to prevent black alpha)
 * 2. JPG to PNG (lossless PNG output)
 * 3. Image to WebP (web optimization)
 * 4. HEIC to JPG (Apple HEIC to universal JPG)
 *
 * All conversions:
 * - 100% In-Browser & Client-Side
 * - Zero tracking metadata
 * - Automated QA verification before download
 */

import { useState } from 'react';
import { saveAs } from 'file-saver';
import UploadDropzone from '@/app/components/UploadDropzone';
import FileSizeAnalyticsCard from '@/app/components/FileSizeAnalyticsCard';
import { calculateSizeAnalytics, SizeAnalytics, formatFileSize } from '@/app/lib/metadataRemover';
import { verifyCleanBlob } from '@/app/utils/metadataTester';
import { triggerSuccessConfetti } from '@/app/lib/confetti';

export type ConverterType = 'png-to-jpg' | 'jpg-to-png' | 'image-to-webp' | 'heic-to-jpg';

interface ConverterConfig {
  title: string;
  badge: string;
  description: string;
  accept: string;
  targetMime: string;
  targetExt: string;
  quality: number;
  fillWhiteBg: boolean;
  filePrefix: string;
}

const CONVERTER_CONFIGS: Record<ConverterType, ConverterConfig> = {
  'png-to-jpg': {
    title: 'PNG to JPG Converter',
    badge: '🖼️ ➔ 📷 PNG TO JPG',
    description: 'Converts PNG images to JPG with solid white background fill (no black transparent backgrounds).',
    accept: 'image/png,.png',
    targetMime: 'image/jpeg',
    targetExt: '.jpg',
    quality: 0.92,
    fillWhiteBg: true,
    filePrefix: 'converted_',
  },
  'jpg-to-png': {
    title: 'JPG to PNG Converter',
    badge: '📷 ➔ 🖼️ JPG TO PNG',
    description: 'Converts JPEG/JPG photos into clean, lossless PNG format devoid of camera tracking tags.',
    accept: 'image/jpeg,.jpg,.jpeg',
    targetMime: 'image/png',
    targetExt: '.png',
    quality: 1.0,
    fillWhiteBg: false,
    filePrefix: 'converted_',
  },
  'image-to-webp': {
    title: 'Image to WebP Converter',
    badge: '🌐 IMAGE TO WEBP',
    description: 'Transforms JPEG, PNG, or HEIC images into next-gen WebP format for fast web loading and SEO.',
    accept: 'image/jpeg,image/png,image/webp,image/tiff,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.heic',
    targetMime: 'image/webp',
    targetExt: '.webp',
    quality: 0.90,
    fillWhiteBg: false,
    filePrefix: 'optimized_',
  },
  'heic-to-jpg': {
    title: 'HEIC to JPG Converter',
    badge: '📱 ➔ 📷 HEIC TO JPG',
    description: 'Converts Apple iPhone HEIC photos into universal high-quality JPGs with zero location tracking.',
    accept: 'image/heic,image/heif,.heic,.heif',
    targetMime: 'image/jpeg',
    targetExt: '.jpg',
    quality: 0.92,
    fillWhiteBg: true,
    filePrefix: 'converted_',
  },
};

export default function FormatConverterTool({ type }: { type: ConverterType }) {
  const config = CONVERTER_CONFIGS[type];
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [sizeAnalytics, setSizeAnalytics] = useState<SizeAnalytics | null>(null);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    if (!files.length) return;
    const file = files[0];
    if (!file || file.size === 0) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (convertedUrl) URL.revokeObjectURL(convertedUrl);

    setSelectedFile(file);
    setIsConverting(true);
    setErrorMessage(null);

    try {
      let sourceBlob: Blob = file;
      const fileNameLower = file.name.toLowerCase();
      const isHeic =
        file.type.includes('heic') ||
        file.type.includes('heif') ||
        fileNameLower.endsWith('.heic') ||
        fileNameLower.endsWith('.heif');

      if (isHeic) {
        const heic2anyModule = await import('heic2any');
        const heic2any = heic2anyModule.default;
        const converted = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: config.quality,
        });
        sourceBlob = Array.isArray(converted) ? converted[0] : converted;
      }

      // Generate preview
      const objectUrl = URL.createObjectURL(sourceBlob);
      setPreviewUrl(objectUrl);

      // Canvas conversion
      const resultBlob = await new Promise<Blob>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
          try {
            const width = img.naturalWidth || img.width;
            const height = img.naturalHeight || img.height;

            if (!width || !height) {
              reject(new Error('Image has 0 dimensions'));
              return;
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const isTransparentTarget = config.targetMime === 'image/png' || config.targetMime === 'image/webp';
            const ctx = canvas.getContext('2d', { alpha: isTransparentTarget });
            if (!ctx) {
              reject(new Error('HTML5 Canvas context unavailable'));
              return;
            }

            // White background fill for PNG to JPG
            if (config.fillWhiteBg) {
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(0, 0, width, height);
            }

            // Render source image pixels
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
              (blob) => {
                try {
                  ctx.clearRect(0, 0, width, height);
                  canvas.width = 0;
                  canvas.height = 0;
                } catch {
                  // Ignore cleanup
                }

                if (blob && blob.size > 0) {
                  resolve(blob);
                } else {
                  reject(new Error('Canvas export failed'));
                }
              },
              config.targetMime,
              config.quality
            );
          } catch (err) {
            reject(err);
          }
        };

        img.onerror = () => {
          reject(new Error('Failed to load image for conversion'));
        };

        img.src = objectUrl;
      });

      // Automated QA verification: assert 0 tags remain in converted blob
      await verifyCleanBlob(resultBlob);

      const url = URL.createObjectURL(resultBlob);
      setConvertedBlob(resultBlob);
      setConvertedUrl(url);

      const analytics = calculateSizeAnalytics(file.size, resultBlob.size);
      setSizeAnalytics(analytics);
      triggerSuccessConfetti();
    } catch (err) {
      console.error('Format conversion failed:', err);
      setErrorMessage('Could not convert this file. Please make sure the format is valid.');
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = async () => {
    if (!convertedBlob || !selectedFile) return;

    // QA Verification before download
    await verifyCleanBlob(convertedBlob);

    const baseName = selectedFile.name.replace(/\.[^/.]+$/, '');
    const filename = `${config.filePrefix}${baseName}${config.targetExt}`;

    saveAs(convertedBlob, filename);
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (convertedUrl) URL.revokeObjectURL(convertedUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setConvertedBlob(null);
    setConvertedUrl(null);
    setSizeAnalytics(null);
    setErrorMessage(null);
  };

  return (
    <div className="paper-card p-4 sm:p-6 md:p-10 shadow-paper-lg mb-12 border border-slate-200/80 dark:border-slate-800 dark:bg-slate-900/90 transition-colors">
      {!selectedFile ? (
        <UploadDropzone
          onFilesSelected={handleFilesSelected}
          label={`Drop photo here to convert to ${config.targetExt.toUpperCase()}`}
          description={config.description}
          accept={config.accept}
        />
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 rounded-full text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-1.5">
                <span>{config.badge}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {selectedFile.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Original: <span className="font-mono font-semibold">{formatFileSize(selectedFile.size)}</span> • Converting to {config.targetExt.toUpperCase()}
              </p>
            </div>
            <button
              onClick={handleReset}
              className="self-start sm:self-auto text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
            >
              Upload Another Photo
            </button>
          </div>

          {/* Processing Spinner */}
          {isConverting && (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700">
              <span className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin inline-block mb-3"></span>
              <p className="text-sm font-bold text-slate-800 dark:text-white">
                Converting to {config.targetExt.toUpperCase()}...
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Processing pixels in browser memory and stripping all metadata
              </p>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs font-medium">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Comparison Preview */}
          {convertedUrl && !isConverting && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-white dark:bg-slate-900 flex flex-col items-center">
                <span className="text-xs font-bold text-slate-500 mb-2">Original Image</span>
                {previewUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt="Original"
                    className="max-h-56 object-contain rounded-xl bg-slate-50 dark:bg-slate-950/40"
                  />
                )}
                <span className="mt-2 text-xs font-mono font-semibold text-slate-600 dark:text-slate-400">
                  {formatFileSize(selectedFile.size)}
                </span>
              </div>

              <div className="border border-emerald-300 dark:border-emerald-800 rounded-2xl p-4 bg-emerald-50/20 dark:bg-emerald-950/20 flex flex-col items-center">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-1">
                  <span>✓</span> Converted {config.targetExt.toUpperCase()} (Clean)
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={convertedUrl}
                  alt="Converted"
                  className="max-h-56 object-contain rounded-xl bg-slate-50 dark:bg-slate-950/40"
                />
                <span className="mt-2 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
                  {convertedBlob ? formatFileSize(convertedBlob.size) : '...'}
                </span>
              </div>
            </div>
          )}

          {/* File Size Analytics */}
          {sizeAnalytics && !isConverting && (
            <FileSizeAnalyticsCard analytics={sizeAnalytics} title="Format Conversion Analytics" />
          )}

          {/* Action Button */}
          {convertedUrl && !isConverting && (
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all cursor-pointer"
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download Converted {config.targetExt.toUpperCase()}</span>
              </button>

              <button
                onClick={handleReset}
                className="px-5 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
