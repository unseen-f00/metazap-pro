'use client';

/**
 * CropperTool.tsx
 * Social Media Cropper with Aspect Ratio Presets.
 * Powered by react-image-crop:
 * - 1:1 (Instagram Post / Square Avatar)
 * - 9:16 (Instagram Reels / Stories / TikTok)
 * - 16:9 (YouTube Thumbnail / Cover)
 * - 4:5 (Instagram Portrait)
 * - Free / Custom Aspect Ratio
 * Strips all metadata and runs QA verification before download.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { saveAs } from 'file-saver';
import UploadDropzone from '@/app/components/UploadDropzone';
import { formatFileSize } from '@/app/lib/metadataRemover';
import { verifyCleanBlob } from '@/app/utils/metadataTester';
import { triggerSuccessConfetti } from '@/app/lib/confetti';

interface AspectPreset {
  label: string;
  sublabel: string;
  aspect: number | undefined;
  icon: string;
}

const PRESETS: AspectPreset[] = [
  { label: '1:1 Square', sublabel: 'Instagram Post / Avatar', aspect: 1 / 1, icon: '🟦' },
  { label: '9:16 Story', sublabel: 'Reels / Stories / TikTok', aspect: 9 / 16, icon: '📱' },
  { label: '16:9 Landscape', sublabel: 'YouTube Thumbnail / X', aspect: 16 / 9, icon: '🖥️' },
  { label: '4:5 Portrait', sublabel: 'Instagram Portrait Feed', aspect: 4 / 5, icon: '🖼️' },
  { label: 'Free Form', sublabel: 'Custom / Unconstrained', aspect: undefined, icon: '✂️' },
];

function getInitialCenterCrop(mediaWidth: number, mediaHeight: number, aspect?: number): Crop {
  if (!aspect) {
    return {
      unit: '%',
      x: 10,
      y: 10,
      width: 80,
      height: 80,
    };
  }

  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 85,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function CropperTool() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState<string>('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [activePresetIndex, setActivePresetIndex] = useState<number>(0);
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState<string | null>(null);
  const [isProcessingCrop, setIsProcessingCrop] = useState<boolean>(false);

  const imgRef = useRef<HTMLImageElement | null>(null);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    imgRef.current = e.currentTarget;
    const initialCrop = getInitialCenterCrop(naturalWidth, naturalHeight, PRESETS[0].aspect);
    setCrop(initialCrop);
  };

  const selectPreset = (index: number) => {
    setActivePresetIndex(index);
    const aspect = PRESETS[index].aspect;
    if (imgRef.current) {
      const { naturalWidth, naturalHeight } = imgRef.current;
      const newCrop = getInitialCenterCrop(naturalWidth, naturalHeight, aspect);
      setCrop(newCrop);
    }
  };

  const handleFilesSelected = (files: File[]) => {
    if (!files.length) return;
    const file = files[0];
    if (!file || file.size === 0) return;

    if (imgSrc) URL.revokeObjectURL(imgSrc);
    if (croppedPreviewUrl) URL.revokeObjectURL(croppedPreviewUrl);

    setSelectedFile(file);
    setCroppedBlob(null);
    setCroppedPreviewUrl(null);
    const url = URL.createObjectURL(file);
    setImgSrc(url);
    setActivePresetIndex(0);
  };

  const generateCroppedBlob = useCallback(async (): Promise<Blob | null> => {
    if (!completedCrop || !imgRef.current || completedCrop.width <= 0 || completedCrop.height <= 0) {
      return null;
    }

    const image = imgRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const pixelX = Math.round(completedCrop.x * scaleX);
    const pixelY = Math.round(completedCrop.y * scaleY);
    const pixelW = Math.round(completedCrop.width * scaleX);
    const pixelH = Math.round(completedCrop.height * scaleY);

    if (pixelW <= 0 || pixelH <= 0) return null;

    const canvas = document.createElement('canvas');
    canvas.width = pixelW;
    canvas.height = pixelH;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Fill white background for JPEG exports
    const isPng = selectedFile?.type === 'image/png';
    const targetMime = isPng ? 'image/png' : 'image/jpeg';
    if (!isPng) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, pixelW, pixelH);
    }

    ctx.drawImage(
      image,
      pixelX,
      pixelY,
      pixelW,
      pixelH,
      0,
      0,
      pixelW,
      pixelH
    );

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          try {
            ctx.clearRect(0, 0, pixelW, pixelH);
            canvas.width = 0;
            canvas.height = 0;
          } catch {
            // Ignore cleanup
          }

          if (blob) resolve(blob);
          else reject(new Error('Canvas crop export failed'));
        },
        targetMime,
        0.92
      );
    });
  }, [completedCrop, selectedFile]);

  // Update live preview when completedCrop updates
  useEffect(() => {
    let active = true;
    if (!completedCrop || completedCrop.width === 0 || completedCrop.height === 0) return;

    generateCroppedBlob().then((blob) => {
      if (!active || !blob) return;
      const url = URL.createObjectURL(blob);
      setCroppedBlob(blob);
      setCroppedPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    });

    return () => {
      active = false;
    };
  }, [completedCrop, generateCroppedBlob]);

  const handleDownload = async () => {
    setIsProcessingCrop(true);
    try {
      let blob = croppedBlob;
      if (!blob) {
        blob = await generateCroppedBlob();
      }
      if (!blob || !selectedFile) return;

      // QA Verification: assert 0 tags remain before download
      await verifyCleanBlob(blob);

      const baseName = selectedFile.name.replace(/\.[^/.]+$/, '');
      const presetLabel = PRESETS[activePresetIndex].label.split(' ')[0].toLowerCase();
      const ext = selectedFile.type === 'image/png' ? '.png' : '.jpg';
      const outFilename = `cropped_${baseName}_${presetLabel}${ext}`;

      saveAs(blob, outFilename);
      triggerSuccessConfetti();
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsProcessingCrop(false);
    }
  };

  const handleReset = () => {
    if (imgSrc) URL.revokeObjectURL(imgSrc);
    if (croppedPreviewUrl) URL.revokeObjectURL(croppedPreviewUrl);
    setSelectedFile(null);
    setImgSrc('');
    setCrop(undefined);
    setCompletedCrop(undefined);
    setCroppedBlob(null);
    setCroppedPreviewUrl(null);
  };

  return (
    <div className="paper-card p-4 sm:p-6 md:p-10 shadow-paper-lg mb-12 border border-slate-200/80 dark:border-slate-800 dark:bg-slate-900/90 transition-colors">
      {!selectedFile ? (
        <UploadDropzone
          onFilesSelected={handleFilesSelected}
          label="Drop photos here to crop for social media"
          description="JPEG, PNG, WebP — instant aspect ratio presets (1:1, 9:16, 16:9)"
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        />
      ) : (
        <div className="space-y-6">
          {/* Header controls bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 rounded-full text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-1.5">
                <span>✂️ SOCIAL MEDIA CROPPER</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {selectedFile.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formatFileSize(selectedFile.size)} • Select preset and drag to adjust framing
              </p>
            </div>
            <button
              onClick={handleReset}
              className="self-start sm:self-auto text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
            >
              Upload Different Photo
            </button>
          </div>

          {/* Preset Buttons */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Select Aspect Ratio Preset:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {PRESETS.map((preset, idx) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => selectPreset(idx)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    activePresetIndex === idx
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <span>{preset.icon}</span>
                    <span className="truncate">{preset.label}</span>
                  </div>
                  <div
                    className={`text-[10px] mt-1 truncate ${
                      activePresetIndex === idx ? 'text-indigo-100' : 'text-slate-400 dark:text-slate-400'
                    }`}
                  >
                    {preset.sublabel}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive ReactCrop Canvas */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-slate-100/60 dark:bg-slate-950/60 flex flex-col items-center justify-center overflow-auto shadow-inner">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={PRESETS[activePresetIndex].aspect}
              className="max-h-[500px]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={imgSrc}
                alt="Source for cropping"
                onLoad={onImageLoad}
                className="max-h-[500px] object-contain rounded-lg"
              />
            </ReactCrop>
          </div>

          {/* Live Preview Card & Dimensions */}
          {croppedPreviewUrl && (
            <div className="border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 bg-emerald-50/30 dark:bg-emerald-950/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-slate-900 rounded-xl overflow-hidden shadow-sm shrink-0 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={croppedPreviewUrl}
                    alt="Cropped thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                    <span>✓</span> Crop Preview Ready
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Preset:{' '}
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {PRESETS[activePresetIndex].label}
                    </span>
                    {croppedBlob && (
                      <span className="ml-2 font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                        ({formatFileSize(croppedBlob.size)})
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Metadata will be stripped automatically on export.
                  </p>
                </div>
              </div>

              <button
                onClick={handleDownload}
                disabled={isProcessingCrop || !croppedBlob}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all cursor-pointer"
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download Cropped Photo</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
