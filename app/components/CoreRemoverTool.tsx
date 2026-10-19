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
import { saveAs } from 'file-saver';
import UploadDropzone from '@/app/components/UploadDropzone';
import ProcessingStepper from '@/app/components/ProcessingStepper';
import BeforeAfterStatusCard from '@/app/components/BeforeAfterStatusCard';
import { inspectMetadataBefore, BeforeAfterStatus } from '@/app/lib/metadataStatus';
import { triggerSuccessConfetti } from '@/app/lib/confetti';
import FileSizeAnalyticsCard from '@/app/components/FileSizeAnalyticsCard';
import { calculateSizeAnalytics, SizeAnalytics } from '@/app/lib/metadataRemover';
import { verifyCleanBlob } from '@/app/utils/metadataTester';
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
  isSelectiveJpegSupported,
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
  accept: string;
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
    accept:
      'image/jpeg,image/png,image/webp,image/tiff,image/gif,image/bmp,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.tiff,.gif,.bmp,.heic,.heif',
  },
  gps: {
    dropzoneLabel: 'Drop photos here to selectively remove GPS',
    dropzoneDescription: 'Targets only location coordinates — keeps camera model and date intact',
    badges: ['✓ GPS Coordinates Wiped', '✓ Camera & Date Preserved', '✓ 100% Private Location'],
    downloadButtonLabel: 'Download GPS-Clean Photo',
    filePrefix: 'nogps_',
    step3Label: 'Wiping GPS IFD Location Tags',
    step3Desc: 'Deleting latitude & longitude, preserving camera & date',
    accept:
      'image/jpeg,image/png,image/webp,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.heic,.heif',
  },
  xmp: {
    dropzoneLabel: 'Drop photos here to remove Adobe XMP metadata',
    dropzoneDescription: 'Targets XMP XML packets — keeps basic EXIF and camera settings',
    badges: ['✓ XMP XML Packets Removed', '✓ Edit History Stripped', '✓ EXIF Preserved'],
    downloadButtonLabel: 'Download XMP-Clean Photo',
    filePrefix: 'noxmp_',
    step3Label: 'Stripping XMP XML Packets',
    step3Desc: 'Removing Adobe edit history while preserving basic EXIF',
    accept: 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp',
  },
  canvas: {
    dropzoneLabel: 'Drop photos here for Deep Clean / Canvas Re-rendering',
    dropzoneDescription: 'Physically re-draws pixels to canvas — destroys watermarks & C2PA',
    badges: ['✓ Canvas Re-rendered', '✓ Steganography Neutralized', '✓ C2PA & Provenance Destroyed'],
    downloadButtonLabel: 'Download Deep Cleaned Photo',
    filePrefix: 'deepclean_',
    step3Label: 'HTML5 Canvas Re-Rendering',
    step3Desc: 'Regenerating fresh raster pixels & neutralizing steganography',
    accept:
      'image/jpeg,image/png,image/webp,image/tiff,image/gif,image/bmp,.jpg,.jpeg,.png,.webp,.tiff,.gif,.bmp',
  },
  'heic-clean': {
    dropzoneLabel: 'Drop Apple HEIC / HEIF photos here to clean metadata',
    dropzoneDescription: 'In-browser HEIC parser — strips iPhone GPS, camera model & iOS tags',
    badges: ['✓ Apple HEIC Cleaned', '✓ GPS Coordinates Wiped', '✓ 100% In-Browser'],
    downloadButtonLabel: 'Download Clean Photo',
    filePrefix: 'clean_heic_',
    step3Label: 'Parsing HEIC & Stripping Metadata',
    step3Desc: 'Decoding Apple HEIC container & wiping private GPS tags',
    accept: 'image/heic,image/heif,.heic,.heif',
  },
  'heic-convert': {
    dropzoneLabel: 'Drop Apple HEIC photos here to convert to clean JPG',
    dropzoneDescription: 'Universal high-quality JPG conversion — 100% metadata free',
    badges: ['✓ Universal JPG Format', '✓ All Metadata Stripped', '✓ Studio Quality'],
    downloadButtonLabel: 'Download Converted JPG',
    filePrefix: 'converted_',
    step3Label: 'Converting HEIC to Universal JPG',
    step3Desc: 'Exporting pristine JPG blob devoid of Apple tracking tags',
    accept: 'image/heic,image/heif,.heic,.heif',
  },
  'png-chunks': {
    dropzoneLabel: 'Drop PNG images here to strip text chunks & AI prompts',
    dropzoneDescription: 'Strips tEXt, iTXt, zTXt & eXIf chunks — preserves alpha transparency',
    badges: ['✓ PNG Text Chunks Stripped', '✓ Full Transparency Intact', '✓ AI Prompts Deleted'],
    downloadButtonLabel: 'Download Clean PNG',
    filePrefix: 'clean_png_',
    step3Label: 'Pruning PNG Binary Text Chunks',
    step3Desc: 'Stripping tEXt, iTXt & zTXt while preserving IHDR & IDAT',
    accept: 'image/png,.png',
  },
  c2pa: {
    dropzoneLabel: 'Drop images here to remove C2PA Content Credentials',
    dropzoneDescription: 'Destroys JUMBF manifest blocks & cryptographic AI watermarks',
    badges: ['✓ C2PA Credentials Destroyed', '✓ Cryptographic Signatures Wiped', '✓ Zero Tracking'],
    downloadButtonLabel: 'Download C2PA-Free Photo',
    filePrefix: 'noc2pa_',
    step3Label: 'Neutralizing C2PA & JUMBF Manifests',
    step3Desc: 'Wiping cryptographic signatures & Content Credentials',
    accept: 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp',
  },
  'ai-only': {
    dropzoneLabel: 'Drop AI artwork here to selectively strip prompts & workflows',
    dropzoneDescription: 'Deletes Midjourney, DALL-E & Stable Diffusion tags — preserves camera data',
    badges: ['✓ AI Prompts Removed', '✓ Workflow Chunks Cleared', '✓ Camera EXIF Preserved'],
    downloadButtonLabel: 'Download Clean AI Image',
    filePrefix: 'no_ai_meta_',
    step3Label: 'Filtering AI Prompt & Generator Tags',
    step3Desc: 'Scrubbing diffusion parameters, keeping authentic camera tags',
    accept: 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp',
  },
};

export default function CoreRemoverTool({ toolType }: { toolType: CoreRemoverType }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cleanedUrl, setCleanedUrl] = useState<string | null>(null);
  const [cleanedBlob, setCleanedBlob] = useState<Blob | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [beforeAfter, setBeforeAfter] = useState<BeforeAfterStatus | null>(null);
  const [sizeAnalytics, setSizeAnalytics] = useState<SizeAnalytics | null>(null);

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

  const handleFilesSelected = async (files: File[]) => {
    if (!files.length) return;
    const file = files[0];

    // Mobile & empty file validation
    if (!file || file.size === 0) {
      setErrorMessage('Selected file is empty or corrupted (0 bytes). Please select a valid photo.');
      return;
    }

    // Strict tool-type enforcement
    if (toolType === 'png-chunks') {
      const isPng = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png');
      if (!isPng) {
        setErrorMessage(`Invalid format: "${file.name}" is not a PNG file. The PNG Metadata Remover strictly accepts only PNG (.png) images.`);
        return;
      }
    } else if (toolType === 'heic-clean' || toolType === 'heic-convert') {
      const isHeic = file.type.includes('heic') || file.type.includes('heif') || /\.(heic|heif)$/i.test(file.name);
      if (!isHeic) {
        setErrorMessage(`Invalid format: "${file.name}" is not an Apple HEIC/HEIF photo. Please upload a .heic or .heif file.`);
        return;
      }
    }

    setSelectedFile(file);
    setIsProcessing(true);
    setErrorMessage(null);
    setCurrentStep(1);
    setProgressPercent(20);

    // Generate instant live preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Read natural dimensions safely on mobile
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      }
    };
    img.onerror = () => {
      setDimensions(null);
    };
    img.src = objectUrl;

    try {
      // Step 1: Reading File & Inspecting initial metadata
      const initialMetadata = await inspectMetadataBefore(file, toolType);
      setBeforeAfter(initialMetadata);
      setCurrentStep(2);
      setProgressPercent(45);

      // Step 2 & 3: Stripping Data via actual processing engine (HTML5 Canvas method)
      setCurrentStep(3);
      setProgressPercent(75);

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

      // Step 4: Finalizing & calculating analytics
      setCurrentStep(4);
      setProgressPercent(100);

      const analytics = calculateSizeAnalytics(file.size, resultBlob.size);
      setSizeAnalytics(analytics);

      // Automated QA verification: assert targeted tags are wiped and preserved tags intact
      const isSelective =
        (toolType === 'gps' || toolType === 'xmp' || toolType === 'ai-only') &&
        isSelectiveJpegSupported(file);
      await verifyCleanBlob(resultBlob, { toolType, isSelectiveJpeg: isSelective });

      // Store clean blob and preview URL
      setCleanedBlob(resultBlob);
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

  const handleDownload = async () => {
    if (!selectedFile) return;
    let outName = selectedFile.name;
    if (toolType === 'heic-clean' || toolType === 'heic-convert') {
      outName = outName.replace(/\.hei[cf]$/i, '.jpg');
      if (!outName.toLowerCase().endsWith('.jpg') && !outName.toLowerCase().endsWith('.jpeg')) {
        outName += '.jpg';
      }
    }
    const downloadFilename = `${config.filePrefix}${outName}`;

    // Serve the newly generated clean Blob with verification
    if (cleanedBlob) {
      const isSelective =
        (toolType === 'gps' || toolType === 'xmp' || toolType === 'ai-only') &&
        isSelectiveJpegSupported(selectedFile);
      await verifyCleanBlob(cleanedBlob, { toolType, isSelectiveJpeg: isSelective });
      saveAs(cleanedBlob, downloadFilename);
    } else if (cleanedUrl) {
      const a = document.createElement('a');
      a.href = cleanedUrl;
      a.download = downloadFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (cleanedUrl) URL.revokeObjectURL(cleanedUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setCleanedUrl(null);
    setCleanedBlob(null);
    setSizeAnalytics(null);
    setDimensions(null);
    setBeforeAfter(null);
    setErrorMessage(null);
    setIsProcessing(false);
    setCurrentStep(1);
    setProgressPercent(0);
  };

  return (
    <div className="editorial-card p-5 sm:p-8 md:p-10 mb-14 shadow-paper border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 transition-colors">
      {!selectedFile ? (
        <UploadDropzone
          onFilesSelected={handleFilesSelected}
          label={config.dropzoneLabel}
          description={config.dropzoneDescription}
          accept={config.accept}
        />
      ) : isProcessing ? (
        <div className="space-y-6">
          {/* Live Preview Card during processing */}
          {previewUrl && (
            <div className="relative border border-stone-200 dark:border-stone-800 rounded-xl p-4 bg-stone-50/60 dark:bg-stone-950/60 flex flex-col items-center justify-center overflow-hidden shadow-2xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-64 object-contain rounded-lg shadow-2xs"
              />
              <div className="mt-3 font-mono text-xs text-stone-600 dark:text-stone-400 flex items-center gap-2">
                <span>{selectedFile.name}</span>
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
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Live Preview & Action Section */}
          <div className="border border-stone-200 dark:border-stone-800 rounded-xl p-5 sm:p-6 bg-stone-50/50 dark:bg-stone-900/50 flex flex-col lg:flex-row items-center gap-6">
            {/* Live Image Preview (Darkroom Framed Print) */}
            {previewUrl && (
              <div className="w-full lg:w-72 shrink-0 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl p-3 shadow-2xs flex flex-col items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt={selectedFile.name}
                  className="w-full h-48 object-contain rounded-lg bg-stone-50 dark:bg-stone-900/50"
                />
                <div className="w-full mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between font-mono text-[11px] text-stone-500 dark:text-stone-400">
                  <span className="font-semibold text-stone-800 dark:text-stone-200 truncate max-w-[140px]">
                    {selectedFile.name}
                  </span>
                  <span>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                </div>
                {dimensions && (
                  <p className="font-mono text-[10px] text-stone-400 dark:text-stone-500 mt-0.5">
                    {dimensions.width} × {dimensions.height} px
                  </p>
                )}
              </div>
            )}

            {/* Status & Download Controls */}
            <div className="w-full flex-1 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3 font-mono text-[11px]">
                  {config.badges.map((badge, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200"
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                <h3 className="font-serif text-lg md:text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">
                  Photograph Successfully Sanitized
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
                  Your image has been processed 100% locally on your machine. All sensitive headers, tracking markers, and private tags have been removed while keeping the original visual clarity intact.
                </p>

                {selectedFile &&
                  (toolType === 'gps' || toolType === 'xmp' || toolType === 'ai-only') &&
                  !isSelectiveJpegSupported(selectedFile) && (
                    <div className="mt-3.5 p-3 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-mono text-xs flex items-center gap-2">
                      <span className="text-base shrink-0">[!]</span>
                      <span>
                        Selective stripping is fully supported for JPEGs. Other formats will undergo full metadata stripping.
                      </span>
                    </div>
                  )}

                {errorMessage && (
                  <p className="font-mono text-xs text-rose-700 dark:text-rose-400 mt-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 p-2.5 rounded-lg">
                    [ERROR] {errorMessage}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-5 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center gap-3">
                {cleanedUrl && (
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-6 py-3.5 bg-stone-900 hover:bg-black dark:bg-stone-100 dark:hover:bg-white text-stone-50 dark:text-stone-950 font-mono text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
                  >
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>{config.downloadButtonLabel}</span>
                  </button>
                )}

                <button
                  onClick={handleReset}
                  className="px-5 py-3.5 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-mono text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Clean Another Photo
                </button>
              </div>
            </div>
          </div>

          {/* File Size Analytics (Before vs After) */}
          {sizeAnalytics && (
            <FileSizeAnalyticsCard analytics={sizeAnalytics} />
          )}

          {/* 'Before & After' Metadata Status Comparison */}
          {beforeAfter && (
            <BeforeAfterStatusCard status={beforeAfter} fileName={selectedFile.name} />
          )}
        </div>
      )}
    </div>
  );
}
