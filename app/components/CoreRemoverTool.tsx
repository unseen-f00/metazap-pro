'use client';

/**
 * CoreRemoverTool.tsx
 * Client-side interactive tool for the Core Removers with:
 * 1. Live Image Preview (Visual Feedback with rounded-2xl, shadow-md, object-contain)
 * 2. 'Before & After' Metadata Status comparison card
 * 3. Confetti celebratory animation & success banner on completion
 * 4. Transparent ProcessingStepper trust-building
 */

import { useState, useEffect } from 'react';
import UploadDropzone from '@/app/components/UploadDropzone';
import ProcessingStepper from '@/app/components/ProcessingStepper';
import BeforeAfterStatusCard from '@/app/components/BeforeAfterStatusCard';
import { inspectMetadataBefore, BeforeAfterStatus } from '@/app/lib/metadataStatus';
import { triggerSuccessConfetti } from '@/app/lib/confetti';
import {
  stripGeneralMetadata,
  stripGpsMetadata,
  stripXmpMetadata,
  deepCleanCanvasReRender,
  cleanHeicMetadata,
  convertHeicToJpg,
  stripPngMetadataChunks,
  removeC2paCredentials,
  stripAiOnlyMetadata,
} from '@/app/lib/imageProcessor';

export type CoreRemoverType =
  | 'general'
  | 'gps'
  | 'xmp'
  | 'canvas'
  | 'heic-clean'
  | 'heic-convert'
  | 'png-chunks'
  | 'c2pa'
  | 'ai-only';

interface CoreRemoverConfig {
  dropzoneLabel: string;
  dropzoneDescription: string;
  badges: string[];
  downloadButtonLabel: string;
  filePrefix: string;
  step3Label: string;
  step3Desc: string;
}

const configs: Record<CoreRemoverType, CoreRemoverConfig> = {
  general: {
    dropzoneLabel: 'Drop photos here to remove all metadata',
    dropzoneDescription: 'JPEG, PNG, WebP, TIFF — up to 20MB · Full metadata strip',
    badges: ['✓ All EXIF Removed', '✓ Camera & GPS Wiped', '✓ Original Quality Kept'],
    downloadButtonLabel: 'Download Clean Photo',
    filePrefix: 'clean_',
    step3Label: 'Stripping All EXIF & Tags',
    step3Desc: 'Wiping all EXIF, GPS, camera details & text chunks',
  },
  gps: {
    dropzoneLabel: 'Drop photos here to selectively remove GPS',
    dropzoneDescription: 'Targets only location coordinates — keeps camera model and date intact',
    badges: ['✓ GPS Coordinates Wiped', '✓ Camera & Date Preserved', '✓ 100% Private Location'],
    downloadButtonLabel: 'Download GPS-Clean Photo',
    filePrefix: 'nogps_',
    step3Label: 'Wiping GPS IFD Location Tags',
    step3Desc: 'Deleting latitude & longitude, preserving camera & date',
  },
  xmp: {
    dropzoneLabel: 'Drop photos here to remove Adobe XMP metadata',
    dropzoneDescription: 'Targets XMP XML packets — keeps basic EXIF and camera settings',
    badges: ['✓ XMP XML Packets Removed', '✓ Edit History Stripped', '✓ EXIF Preserved'],
    downloadButtonLabel: 'Download XMP-Clean Photo',
    filePrefix: 'noxmp_',
    step3Label: 'Stripping XMP XML Packets',
    step3Desc: 'Removing Adobe edit history while preserving basic EXIF',
  },
  canvas: {
    dropzoneLabel: 'Drop photos here for Deep Clean / Canvas Re-rendering',
    dropzoneDescription: 'Physically re-draws pixels to canvas — destroys watermarks & C2PA',
    badges: ['✓ Canvas Re-rendered', '✓ Steganography Neutralized', '✓ C2PA & Provenance Destroyed'],
    downloadButtonLabel: 'Download Deep Cleaned Photo',
    filePrefix: 'deepclean_',
    step3Label: 'HTML5 Canvas Re-Rendering',
    step3Desc: 'Regenerating fresh raster pixels & neutralizing steganography',
  },
  'heic-clean': {
    dropzoneLabel: 'Drop Apple HEIC / HEIF photos here to clean metadata',
    dropzoneDescription: 'In-browser HEIC parser — strips iPhone GPS, camera model & iOS tags',
    badges: ['✓ Apple HEIC Cleaned', '✓ GPS Coordinates Wiped', '✓ 100% In-Browser'],
    downloadButtonLabel: 'Download Clean Photo',
    filePrefix: 'clean_heic_',
    step3Label: 'Parsing HEIC & Stripping Metadata',
    step3Desc: 'Decoding Apple HEIC container & wiping private GPS tags',
  },
  'heic-convert': {
    dropzoneLabel: 'Drop Apple HEIC photos here to convert to clean JPG',
    dropzoneDescription: 'Universal high-quality JPG conversion — 100% metadata free',
    badges: ['✓ Universal JPG Format', '✓ All Metadata Stripped', '✓ Studio Quality'],
    downloadButtonLabel: 'Download Converted JPG',
    filePrefix: 'converted_',
    step3Label: 'Converting HEIC to Universal JPG',
    step3Desc: 'Exporting pristine JPG blob devoid of Apple tracking tags',
  },
  'png-chunks': {
    dropzoneLabel: 'Drop PNG images here to strip text chunks & AI prompts',
    dropzoneDescription: 'Strips tEXt, iTXt, zTXt & eXIf chunks — preserves alpha transparency',
    badges: ['✓ PNG Text Chunks Stripped', '✓ Full Transparency Intact', '✓ AI Prompts Deleted'],
    downloadButtonLabel: 'Download Clean PNG',
    filePrefix: 'clean_png_',
    step3Label: 'Pruning PNG Binary Text Chunks',
    step3Desc: 'Stripping tEXt, iTXt & zTXt while preserving IHDR & IDAT',
  },
  c2pa: {
    dropzoneLabel: 'Drop images here to remove C2PA Content Credentials',
    dropzoneDescription: 'Destroys JUMBF manifest blocks & cryptographic AI watermarks',
    badges: ['✓ C2PA Credentials Destroyed', '✓ Cryptographic Signatures Wiped', '✓ Zero Tracking'],
    downloadButtonLabel: 'Download C2PA-Free Photo',
    filePrefix: 'noc2pa_',
    step3Label: 'Neutralizing C2PA & JUMBF Manifests',
    step3Desc: 'Wiping cryptographic signatures & Content Credentials',
  },
  'ai-only': {
    dropzoneLabel: 'Drop AI artwork here to selectively strip prompts & workflows',
    dropzoneDescription: 'Deletes Midjourney, DALL-E & Stable Diffusion tags — preserves camera data',
    badges: ['✓ AI Prompts Removed', '✓ Workflow Chunks Cleared', '✓ Camera EXIF Preserved'],
    downloadButtonLabel: 'Download Clean AI Image',
    filePrefix: 'no_ai_meta_',
    step3Label: 'Filtering AI Prompt & Generator Tags',
    step3Desc: 'Scrubbing diffusion parameters, keeping authentic camera tags',
  },
};

export default function CoreRemoverTool({ toolType }: { toolType: CoreRemoverType }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cleanedUrl, setCleanedUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [beforeAfter, setBeforeAfter] = useState<BeforeAfterStatus | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [progressPercent, setProgressPercent] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const config = configs[toolType];

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (cleanedUrl) URL.revokeObjectURL(cleanedUrl);
    };
  }, [previewUrl, cleanedUrl]);

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleFilesSelected = async (files: File[]) => {
    if (!files.length) return;
    const file = files[0];
    setSelectedFile(file);
    setIsProcessing(true);
    setErrorMessage(null);
    setCurrentStep(1);
    setProgressPercent(15);

    // Generate instant live preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Read natural dimensions
    const img = new Image();
    img.onload = () => {
      setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = objectUrl;

    try {
      // Step 1: Reading File & Inspecting initial metadata
      const initialMetadata = await inspectMetadataBefore(file, toolType);
      setBeforeAfter(initialMetadata);

      await sleep(350);
      setCurrentStep(2);
      setProgressPercent(40);

      // Step 2: Analyzing Tags
      await sleep(400);
      setCurrentStep(3);
      setProgressPercent(70);

      // Step 3: Stripping Data via actual processing engine
      let resultBlob: Blob;
      switch (toolType) {
        case 'general':
          resultBlob = await stripGeneralMetadata(file);
          break;
        case 'gps':
          resultBlob = await stripGpsMetadata(file);
          break;
        case 'xmp':
          resultBlob = await stripXmpMetadata(file);
          break;
        case 'canvas':
          resultBlob = await deepCleanCanvasReRender(file);
          break;
        case 'heic-clean':
          resultBlob = await cleanHeicMetadata(file);
          break;
        case 'heic-convert':
          resultBlob = await convertHeicToJpg(file);
          break;
        case 'png-chunks':
          resultBlob = await stripPngMetadataChunks(file);
          break;
        case 'c2pa':
          resultBlob = await removeC2paCredentials(file);
          break;
        case 'ai-only':
          resultBlob = await stripAiOnlyMetadata(file);
          break;
        default:
          resultBlob = await stripGeneralMetadata(file);
      }

      await sleep(350);
      // Step 4: Finalizing
      setCurrentStep(4);
      setProgressPercent(95);
      await sleep(250);
      setProgressPercent(100);

      const url = URL.createObjectURL(resultBlob);
      setCleanedUrl(url);

      // Trigger celebratory confetti animation
      triggerSuccessConfetti();
    } catch {
      setErrorMessage('Could not process this image. Please try another file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!cleanedUrl || !selectedFile) return;
    const a = document.createElement('a');
    a.href = cleanedUrl;
    let outName = selectedFile.name;
    if (toolType === 'heic-clean' || toolType === 'heic-convert') {
      outName = outName.replace(/\.hei[cf]$/i, '.jpg');
      if (!outName.toLowerCase().endsWith('.jpg') && !outName.toLowerCase().endsWith('.jpeg')) {
        outName += '.jpg';
      }
    }
    a.download = `${config.filePrefix}${outName}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (cleanedUrl) URL.revokeObjectURL(cleanedUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setCleanedUrl(null);
    setDimensions(null);
    setBeforeAfter(null);
    setErrorMessage(null);
    setIsProcessing(false);
    setCurrentStep(1);
    setProgressPercent(0);
  };

  return (
    <div className="paper-card p-4 sm:p-6 md:p-10 shadow-paper-lg mb-12 border border-slate-200/80 dark:border-slate-800 dark:bg-slate-900/90 transition-colors">
      {!selectedFile ? (
        <UploadDropzone
          onFilesSelected={handleFilesSelected}
          label={config.dropzoneLabel}
          description={config.dropzoneDescription}
        />
      ) : isProcessing ? (
        <div className="space-y-6">
          {/* Live Preview Card during processing */}
          {previewUrl && (
            <div className="relative border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 bg-slate-100/50 dark:bg-slate-950/50 flex flex-col items-center justify-center overflow-hidden shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-64 object-contain rounded-xl shadow-xs"
              />
              <div className="mt-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2">
                <span>📷 {selectedFile.name}</span>
                <span>•</span>
                <span>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
            </div>
          )}

          <ProcessingStepper
            currentStep={currentStep}
            progressPercent={progressPercent}
            customStep3Label={config.step3Label}
            customStep3Desc={config.step3Desc}
            fileName={selectedFile.name}
          />
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Live Preview & Action Section */}
          <div className="border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 bg-slate-50/70 dark:bg-slate-900/60 flex flex-col lg:flex-row items-center gap-6">
            {/* Live Image Preview (Visual Feedback) */}
            {previewUrl && (
              <div className="w-full lg:w-72 shrink-0 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 shadow-md flex flex-col items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt={selectedFile.name}
                  className="w-full h-48 object-contain rounded-xl bg-slate-50 dark:bg-slate-950/40"
                />
                <div className="w-full mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[140px]">
                    {selectedFile.name}
                  </span>
                  <span>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                </div>
                {dimensions && (
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    {dimensions.width} × {dimensions.height} px
                  </p>
                )}
              </div>
            )}

            {/* Status & Download Controls */}
            <div className="w-full flex-1 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {config.badges.map((badge, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full shadow-2xs"
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Photo Successfully Sanitized
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Your image has been processed 100% locally on your machine. All sensitive headers, tracking markers, and private tags have been removed while keeping the original visual clarity intact.
                </p>

                {errorMessage && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 p-2.5 rounded-lg">
                    {errorMessage}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center gap-3">
                {cleanedUrl && (
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-bold rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
                  >
                    <svg width="16" height="16" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>{config.downloadButtonLabel}</span>
                  </button>
                )}

                <button
                  onClick={handleReset}
                  className="px-5 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs md:text-sm font-medium rounded-xl transition-colors cursor-pointer"
                >
                  Clean Another Photo
                </button>
              </div>
            </div>
          </div>

          {/* 'Before & After' Metadata Status Comparison */}
          {beforeAfter && (
            <BeforeAfterStatusCard status={beforeAfter} fileName={selectedFile.name} />
          )}
        </div>
      )}
    </div>
  );
}
