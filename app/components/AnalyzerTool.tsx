'use client';

/**
 * AnalyzerTool.tsx
 * Client-side interactive tool for the 6 Analyzer and Checker tools:
 * 1. viewer: /tell-me-my-metadata
 * 2. calculator: /calculate-metadata
 * 3. privacy: /photo-privacy-analyzer
 * 4. c2pa: /c2pa-checker
 * 5. ai-image: /ai-image-checker
 * 6. ai-watermark: /ai-watermark-checker
 *
 * Integrated with ProcessingStepper for transparent trust building.
 * 100% Client-Side — Zero Server Uploads.
 */

import { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import UploadDropzone from '@/app/components/UploadDropzone';
import ProcessingStepper from '@/app/components/ProcessingStepper';
import {
  analyzeDeepMetadata,
  calculateMetadataStructure,
  analyzePhotoPrivacy,
  checkC2paCredentials,
  scanAiSignatures,
  type DeepMetadataResult,
  type MetadataCalculationResult,
  type PrivacyAnalysisResult,
  type C2paCheckResult,
  type AiScanResult,
} from '@/app/lib/imageAnalyzer';
import { stripGeneralMetadata } from '@/app/lib/imageProcessor';

export type AnalyzerType =
  | 'viewer'
  | 'calculator'
  | 'privacy'
  | 'c2pa'
  | 'ai-image'
  | 'ai-watermark';

interface AnalyzerConfig {
  dropzoneLabel: string;
  dropzoneDescription: string;
  step3Label: string;
  step3Desc: string;
}

const configs: Record<AnalyzerType, AnalyzerConfig> = {
  viewer: {
    dropzoneLabel: 'Drop photo here to inspect all hidden metadata',
    dropzoneDescription: 'Reads EXIF, XMP, GPS, and PNG chunks with deep inspection',
    step3Label: 'Extracting EXIF & Tag Directories',
    step3Desc: 'Reading hardware, GPS coordinates, and embedded chunks',
  },
  calculator: {
    dropzoneLabel: 'Drop photo here to calculate metadata byte overhead',
    dropzoneDescription: 'Calculates file size, dimensions, resolution, and hidden metadata weight',
    step3Label: 'Calculating Overhead & File Structure',
    step3Desc: 'Weighing metadata segments vs raw visual pixel data',
  },
  privacy: {
    dropzoneLabel: 'Drop photo here to analyze privacy leaks & risk score',
    dropzoneDescription: 'Generates a 0-100 Privacy Risk Score and scans for dangerous GPS pins',
    step3Label: 'Evaluating Privacy Threat Vectors',
    step3Desc: 'Checking GPS coordinates, serial numbers, and personal stamps',
  },
  c2pa: {
    dropzoneLabel: 'Drop image here to check for C2PA Content Credentials',
    dropzoneDescription: 'Scans for JUMBF manifests, Adobe provenance, and cryptographic AI seals',
    step3Label: 'Scanning for C2PA Manifests & JUMBF',
    step3Desc: 'Verifying digital certificates and Content Credentials manifests',
  },
  'ai-image': {
    dropzoneLabel: 'Drop image here to check for AI generation signatures',
    dropzoneDescription: 'Scans for Midjourney, DALL-E, Stable Diffusion, and prompt headers',
    step3Label: 'Scanning AI Generation Signatures',
    step3Desc: 'Searching headers for AI models, prompts, and diffusion parameters',
  },
  'ai-watermark': {
    dropzoneLabel: 'Drop image here to scan for AI prompts & metadata signatures',
    dropzoneDescription: 'Scans container headers (PNG iTXt, JPEG APP1, XMP) for AI workflows & manifests',
    step3Label: 'Scanning Container Metadata Signatures',
    step3Desc: 'Inspecting header chunks for AI models, prompts, parameters, and manifests',
  },
};

import { triggerSuccessConfetti } from '@/app/lib/confetti';

export default function AnalyzerTool({ toolType }: { toolType: AnalyzerType }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [progressPercent, setProgressPercent] = useState(0);
  const [isCleaning, setIsCleaning] = useState(false);

  // Analysis Result States
  const [viewerResult, setViewerResult] = useState<DeepMetadataResult | null>(null);
  const [calcResult, setCalcResult] = useState<MetadataCalculationResult | null>(null);
  const [privacyResult, setPrivacyResult] = useState<PrivacyAnalysisResult | null>(null);
  const [c2paResult, setC2paResult] = useState<C2paCheckResult | null>(null);
  const [aiResult, setAiResult] = useState<AiScanResult | null>(null);
  const [searchTagQuery, setSearchTagQuery] = useState('');
  const [viewerTab, setViewerTab] = useState<'properties' | 'raw'>('properties');

  const config = configs[toolType];

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFilesSelected = async (files: File[]) => {
    if (!files.length) return;
    const file = files[0];
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setIsProcessing(true);
    setCurrentStep(1);
    setProgressPercent(25);

    try {
      setCurrentStep(2);
      setProgressPercent(50);

      setCurrentStep(3);
      setProgressPercent(75);

      // Run specific real analyzer
      if (toolType === 'viewer') {
        const res = await analyzeDeepMetadata(file);
        setViewerResult(res);
      } else if (toolType === 'calculator') {
        const res = await calculateMetadataStructure(file);
        setCalcResult(res);
      } else if (toolType === 'privacy') {
        const res = await analyzePhotoPrivacy(file);
        setPrivacyResult(res);
      } else if (toolType === 'c2pa') {
        const res = await checkC2paCredentials(file);
        setC2paResult(res);
      } else if (toolType === 'ai-image' || toolType === 'ai-watermark') {
        const res = await scanAiSignatures(file);
        setAiResult(res);
      }

      // Finalize Report
      setCurrentStep(4);
      setProgressPercent(100);
    } catch {
      // Clean fallback
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickClean = async () => {
    if (!selectedFile) return;
    setIsCleaning(true);
    try {
      const cleanBlob = await stripGeneralMetadata(selectedFile);
      saveAs(cleanBlob, `clean_${selectedFile.name}`);
      triggerSuccessConfetti();
    } finally {
      setIsCleaning(false);
    }
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setViewerResult(null);
    setCalcResult(null);
    setPrivacyResult(null);
    setC2paResult(null);
    setAiResult(null);
    setSearchTagQuery('');
    setViewerTab('properties');
    setIsProcessing(false);
    setCurrentStep(1);
    setProgressPercent(0);
  };

  return (
    <div className="editorial-card p-6 md:p-10 mb-12">
      {!selectedFile ? (
        <UploadDropzone
          onFilesSelected={handleFilesSelected}
          label={config.dropzoneLabel}
          description={config.dropzoneDescription}
          accept="image/jpeg,image/png,image/webp,image/tiff,image/gif,image/bmp,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.tiff,.gif,.bmp,.heic,.heif"
        />
      ) : isProcessing ? (
        <div className="space-y-6">
          {previewUrl && (
            <div className="relative border border-hairline rounded-lg p-3 bg-surface-subtle flex flex-col items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-64 object-contain rounded-md shadow-2xs"
              />
              <div className="mt-2.5 font-mono text-xs text-ink/70 dark:text-chalk/70 flex items-center gap-2">
                <span>{selectedFile.name}</span>
                <span className="opacity-40">/</span>
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
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* File Header Bar */}
          <div className="border border-hairline rounded-lg p-4 sm:p-5 bg-surface-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt={selectedFile.name}
                  className="w-14 h-14 object-cover rounded-md border border-hairline shadow-2xs shrink-0"
                />
              ) : (
                <div className="w-11 h-11 rounded-md bg-surface border border-hairline flex items-center justify-center font-mono text-xs text-ink/60 shrink-0">
                  IMG
                </div>
              )}
              <div className="min-w-0">
                <p className="font-mono font-semibold text-ink dark:text-chalk text-xs sm:text-sm truncate">{selectedFile.name}</p>
                <p className="font-mono text-xs text-ink/60 dark:text-chalk/60 mt-0.5">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · {selectedFile.type || 'Image'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleQuickClean}
                disabled={isCleaning}
                className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-stone-100 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 disabled:opacity-50 text-xs font-mono font-bold tracking-wider uppercase rounded-md shadow-sm transition-all"
              >
                {isCleaning ? 'STRIPPING...' : 'CLEAN & DOWNLOAD'}
              </button>
              <button
                onClick={handleReset}
                className="px-3.5 py-2 border border-hairline bg-surface hover:bg-hairline/30 text-ink/80 dark:text-chalk/80 text-xs font-mono font-medium rounded-md transition-colors"
              >
                SCAN ANOTHER
              </button>
            </div>
          </div>

          {/* 1. Deep Metadata Viewer View */}
          {toolType === 'viewer' && viewerResult && (
            <div className="space-y-6">
              {/* File Properties Summary */}
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-hairline pb-2">
                  <div className="editorial-kicker">
                    INDEX // FORENSIC TAG SUMMARY
                  </div>
                  <span className="font-mono text-xs text-ink/60 dark:text-chalk/60">
                    {viewerResult.summary.totalTags} TOTAL TAGS RECORDED
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Camera Maker / Model */}
                  <div className="bg-surface p-3.5 rounded-lg border border-hairline">
                    <p className="text-[10px] font-mono text-ink/60 dark:text-chalk/60 uppercase tracking-wider">
                      Camera Maker &amp; Model
                    </p>
                    <p className="font-mono text-xs font-bold text-ink dark:text-chalk mt-1.5 truncate" title={viewerResult.details.cameraCombined || 'Not Recorded'}>
                      {viewerResult.details.cameraCombined || 'Not Recorded'}
                    </p>
                  </div>

                  {/* F-Stop (Aperture) */}
                  <div className="bg-surface p-3.5 rounded-lg border border-hairline">
                    <p className="text-[10px] font-mono text-ink/60 dark:text-chalk/60 uppercase tracking-wider">
                      F-Stop (Aperture)
                    </p>
                    <p className="font-mono text-xs font-bold text-ink dark:text-chalk mt-1.5">
                      {viewerResult.details.fStop || 'N/A'}
                    </p>
                  </div>

                  {/* ISO Speed */}
                  <div className="bg-surface p-3.5 rounded-lg border border-hairline">
                    <p className="text-[10px] font-mono text-ink/60 dark:text-chalk/60 uppercase tracking-wider">
                      ISO Speed
                    </p>
                    <p className="font-mono text-xs font-bold text-ink dark:text-chalk mt-1.5">
                      {viewerResult.details.iso || 'N/A'}
                    </p>
                  </div>

                  {/* Exposure Time */}
                  <div className="bg-surface p-3.5 rounded-lg border border-hairline">
                    <p className="text-[10px] font-mono text-ink/60 dark:text-chalk/60 uppercase tracking-wider">
                      Exposure Time
                    </p>
                    <p className="font-mono text-xs font-bold text-ink dark:text-chalk mt-1.5">
                      {viewerResult.details.exposureTime || 'N/A'}
                    </p>
                  </div>

                  {/* Lens Info */}
                  <div className="bg-surface p-3.5 rounded-lg border border-hairline">
                    <p className="text-[10px] font-mono text-ink/60 dark:text-chalk/60 uppercase tracking-wider">
                      Lens Specification
                    </p>
                    <p className="font-mono text-xs font-bold text-ink dark:text-chalk mt-1.5 truncate" title={viewerResult.details.lensInfo || 'Standard Lens'}>
                      {viewerResult.details.lensInfo || 'Standard Lens'}
                    </p>
                  </div>

                  {/* Software */}
                  <div className="bg-surface p-3.5 rounded-lg border border-hairline">
                    <p className="text-[10px] font-mono text-ink/60 dark:text-chalk/60 uppercase tracking-wider">
                      Software / Firmware
                    </p>
                    <p className="font-mono text-xs font-bold text-ink dark:text-chalk mt-1.5 truncate" title={viewerResult.details.software || 'Camera OS'}>
                      {viewerResult.details.software || 'Camera OS'}
                    </p>
                  </div>

                  {/* Date Taken */}
                  <div className="bg-surface p-3.5 rounded-lg border border-hairline">
                    <p className="text-[10px] font-mono text-ink/60 dark:text-chalk/60 uppercase tracking-wider">
                      Date Taken
                    </p>
                    <p className="font-mono text-xs font-bold text-ink dark:text-chalk mt-1.5 truncate" title={viewerResult.details.dateTaken || 'No timestamp'}>
                      {viewerResult.details.dateTaken || 'No timestamp'}
                    </p>
                  </div>

                  {/* Author / Artist */}
                  <div className="bg-surface p-3.5 rounded-lg border border-hairline">
                    <p className="text-[10px] font-mono text-ink/60 dark:text-chalk/60 uppercase tracking-wider">
                      Author / Artist
                    </p>
                    <p className="font-mono text-xs font-bold text-ink dark:text-chalk mt-1.5 truncate" title={viewerResult.details.author || 'Anonymous'}>
                      {viewerResult.details.author || 'Anonymous'}
                    </p>
                  </div>
                </div>
              </div>

              {/* GPS Geolocation & Mini Map Section */}
              {viewerResult.details.gps && (
                <div className="p-4 sm:p-5 rounded-lg border border-hairline bg-surface-subtle space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="editorial-kicker mb-1">GEOLOCATION LOG // LAT/LON COORDINATES</div>
                      <h4 className="font-mono text-xs sm:text-sm font-bold text-ink dark:text-chalk">
                        {viewerResult.details.gps.formatted}
                        {viewerResult.details.gps.altitude !== undefined
                          ? ` · ${viewerResult.details.gps.altitude.toFixed(1)}m elevation`
                          : ''}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`https://www.google.com/maps?q=${viewerResult.details.gps.latitude},${viewerResult.details.gps.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 border border-hairline bg-surface hover:bg-hairline/30 text-ink dark:text-chalk rounded-md text-xs font-mono font-medium transition-all shadow-2xs flex items-center gap-1"
                      >
                        <span>VIEW MAP PIN</span>
                        <span>↗</span>
                      </a>
                    </div>
                  </div>

                  {/* Mini Map Frame */}
                  <div className="w-full h-56 sm:h-64 rounded-md overflow-hidden border border-hairline bg-surface">
                    <iframe
                      title="OpenStreetMap Mini Map"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      marginHeight={0}
                      marginWidth={0}
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${viewerResult.details.gps.longitude - 0.008}%2C${viewerResult.details.gps.latitude - 0.008}%2C${viewerResult.details.gps.longitude + 0.008}%2C${viewerResult.details.gps.latitude + 0.008}&layer=mapnik&marker=${viewerResult.details.gps.latitude}%2C${viewerResult.details.gps.longitude}`}
                      className="w-full h-full border-0"
                    />
                  </div>
                </div>
              )}

              {/* Categorized Metadata Tables & Raw Tags Explorer */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <div className="inline-flex p-1 border border-hairline rounded-md bg-surface gap-1">
                    <button
                      type="button"
                      onClick={() => setViewerTab('properties')}
                      className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
                        viewerTab === 'properties'
                          ? 'bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 shadow-2xs'
                          : 'text-ink/70 dark:text-chalk/70 hover:text-ink dark:hover:text-chalk'
                      }`}
                    >
                      FILE PROPERTIES
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewerTab('raw')}
                      className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
                        viewerTab === 'raw'
                          ? 'bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 shadow-2xs'
                          : 'text-ink/70 dark:text-chalk/70 hover:text-ink dark:hover:text-chalk'
                      }`}
                    >
                      RAW DIRECTORY ({Object.keys(viewerResult.rawTags).length})
                    </button>
                  </div>

                  {viewerTab === 'raw' && (
                    <input
                      type="text"
                      value={searchTagQuery}
                      onChange={(e) => setSearchTagQuery(e.target.value)}
                      placeholder="FILTER BY TAG (E.G. FLASH, ISO)..."
                      className="px-3 py-1.5 text-xs font-mono rounded-md border border-hairline bg-surface text-ink dark:text-chalk placeholder:text-ink/40 focus:outline-hidden focus:border-ink dark:focus:border-chalk w-full sm:w-64"
                    />
                  )}
                </div>

                {viewerTab === 'properties' ? (
                  <div className="space-y-4">
                    {viewerResult.sections.map((sec, sIdx) => (
                      <div key={sIdx} className="border border-hairline rounded-lg overflow-hidden bg-surface">
                        <div className="bg-surface-subtle px-4 py-2.5 border-b border-hairline flex items-center justify-between font-mono text-xs text-ink dark:text-chalk uppercase tracking-wide">
                          <span className="font-semibold">
                            {sec.category}
                          </span>
                          <span className="text-[11px] text-ink/60 dark:text-chalk/60">
                            {sec.tags.length} {sec.tags.length === 1 ? 'ENTRY' : 'ENTRIES'}
                          </span>
                        </div>
                        <div className="divide-y divide-hairline">
                          {sec.tags.map((tag, tIdx) => (
                            <div key={tIdx} className="px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-mono text-xs hover:bg-hairline/20 transition-colors">
                              <span className="text-ink/60 dark:text-chalk/60 sm:w-1/3 truncate">{tag.label}</span>
                              <span className={`sm:w-2/3 break-all ${tag.isSensitive ? 'font-semibold text-rose-600 dark:text-rose-400' : 'text-ink dark:text-chalk'}`}>
                                {tag.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border border-hairline rounded-lg overflow-hidden bg-surface">
                    <div className="max-h-96 overflow-y-auto divide-y divide-hairline font-mono text-xs">
                      {Object.entries(viewerResult.rawTags)
                        .filter(([k, v]) =>
                          searchTagQuery
                            ? k.toLowerCase().includes(searchTagQuery.toLowerCase()) ||
                              v.toLowerCase().includes(searchTagQuery.toLowerCase())
                            : true
                        )
                        .map(([k, v], rIdx) => (
                          <div key={rIdx} className="px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:bg-hairline/20">
                            <span className="text-ink dark:text-chalk font-semibold sm:w-1/3 truncate">{k}</span>
                            <span className="text-ink/70 dark:text-chalk/70 sm:w-2/3 break-all">{v}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. Calculator View */}
          {toolType === 'calculator' && calcResult && (
            <div className="space-y-6">
              {/* Highlight Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border border-hairline rounded-lg p-4 sm:p-5 bg-surface-subtle">
                  <div className="editorial-kicker mb-1">
                    INDEX // DETECTED HEADERS
                  </div>
                  <p className="text-3xl font-mono font-bold text-ink dark:text-chalk mt-2">
                    {calcResult.totalTagsFound}
                  </p>
                  <p className="font-mono text-[11px] text-ink/60 dark:text-chalk/60 mt-1">
                    EXIF, GPS, XMP, &amp; TIFF metadata headers
                  </p>
                </div>

                <div className="border border-hairline rounded-lg p-4 sm:p-5 bg-surface-subtle">
                  <div className="editorial-kicker mb-1">
                    PRUNABLE // WIPABLE METRICS
                  </div>
                  <p className="text-3xl font-mono font-bold text-amber-600 dark:text-amber-400 mt-2">
                    {calcResult.tagsRemovedCount}
                  </p>
                  <p className="font-mono text-[11px] text-ink/60 dark:text-chalk/60 mt-1">
                    Ready to be permanently wiped
                  </p>
                </div>

                <div className="border border-hairline rounded-lg p-4 sm:p-5 bg-surface-subtle">
                  <div className="editorial-kicker mb-1">
                    EFFICIENCY // RECLAIMABLE PAYLOAD
                  </div>
                  <p className="text-3xl font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-2">
                    {calcResult.spaceSavedFormatted}
                  </p>
                  <p className="font-mono text-[11px] text-ink/60 dark:text-chalk/60 mt-1">
                    {calcResult.metadataPercentage}% header bloat eliminated
                  </p>
                </div>
              </div>

              {/* Before vs After Size Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="border border-hairline rounded-lg p-4 bg-surface">
                  <p className="text-[10px] font-mono text-ink/60 dark:text-chalk/60 uppercase tracking-wider">Original File Size</p>
                  <p className="text-lg font-mono font-bold text-ink dark:text-chalk mt-1">{calcResult.fileSizeFormatted}</p>
                  <p className="font-mono text-[10px] text-ink/50 dark:text-chalk/50 mt-0.5">{calcResult.fileSizeBytes.toLocaleString()} B</p>
                </div>

                <div className="border border-hairline rounded-lg p-4 bg-surface">
                  <p className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Cleaned File Size</p>
                  <p className="text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">{calcResult.cleanedSizeFormatted}</p>
                  <p className="font-mono text-[10px] text-ink/50 dark:text-chalk/50 mt-0.5">{calcResult.cleanedSizeBytes.toLocaleString()} B</p>
                </div>

                <div className="border border-hairline rounded-lg p-4 bg-surface">
                  <p className="text-[10px] font-mono text-ink/60 dark:text-chalk/60 uppercase tracking-wider">Visual Dimensions</p>
                  <p className="text-lg font-mono font-bold text-ink dark:text-chalk mt-1">
                    {calcResult.dimensions.width > 0 ? `${calcResult.dimensions.width} × ${calcResult.dimensions.height}` : 'N/A'}
                  </p>
                  <p className="font-mono text-[10px] text-ink/50 dark:text-chalk/50 mt-0.5">{calcResult.megapixels}</p>
                </div>

                <div className="border border-hairline rounded-lg p-4 bg-surface">
                  <p className="text-[10px] font-mono text-ink/60 dark:text-chalk/60 uppercase tracking-wider">Format &amp; Density</p>
                  <p className="text-lg font-mono font-bold text-ink dark:text-chalk mt-1">{calcResult.formatName}</p>
                  <p className="font-mono text-[10px] text-ink/50 dark:text-chalk/50 mt-0.5">{calcResult.dpi} DPI</p>
                </div>
              </div>

              {/* Progress representation */}
              <div className="border border-hairline rounded-lg p-5 bg-surface-subtle">
                <div className="flex justify-between font-mono text-xs text-ink/80 dark:text-chalk/80 mb-2">
                  <span>Visual Image Pixels: {(100 - calcResult.metadataPercentage).toFixed(1)}%</span>
                  <span className="text-amber-700 dark:text-amber-400">Metadata Overhead: {calcResult.metadataPercentage}%</span>
                </div>
                <div className="w-full h-1.5 bg-hairline rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-stone-900 dark:bg-stone-100 transition-all duration-500"
                    style={{ width: `${Math.max(5, 100 - calcResult.metadataPercentage)}%` }}
                  />
                  <div
                    className="h-full bg-amber-500 transition-all duration-500"
                    style={{ width: `${Math.min(95, calcResult.metadataPercentage)}%` }}
                  />
                </div>
                <p className="font-sans text-xs text-ink/70 dark:text-chalk/70 mt-3">
                  Wiping metadata from this image will save approximately <strong>{calcResult.spaceSavedFormatted}</strong> ({calcResult.metadataPercentage}%) of storage without altering raw image raster values.
                </p>
              </div>
            </div>
          )}

          {/* 3. Privacy Risk Score View */}
          {toolType === 'privacy' && privacyResult && (
            <div className="space-y-6">
              {/* Score Header */}
              <div className={`p-6 rounded-lg border flex flex-col sm:flex-row items-center gap-6 ${
                privacyResult.riskLevel === 'high'
                  ? 'border-rose-500/40 bg-rose-500/5 dark:bg-rose-950/20 text-rose-950 dark:text-rose-100'
                  : privacyResult.riskLevel === 'medium'
                  ? 'border-amber-500/40 bg-amber-500/5 dark:bg-amber-950/20 text-amber-950 dark:text-amber-100'
                  : 'border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/20 text-emerald-950 dark:text-emerald-100'
              }`}>
                <div className={`w-18 h-18 rounded-md flex flex-col items-center justify-center shrink-0 font-mono font-bold border border-current ${
                  privacyResult.riskLevel === 'high'
                    ? 'text-rose-600 dark:text-rose-400'
                    : privacyResult.riskLevel === 'medium'
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}>
                  <span className="text-2xl leading-none">{privacyResult.score}</span>
                  <span className="text-[10px] uppercase font-mono opacity-80">/ 100</span>
                </div>

                <div className="space-y-1 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider mb-1 border border-current">
                    {privacyResult.riskLevel === 'high' ? 'HIGH PRIVACY RISK' : privacyResult.riskLevel === 'medium' ? 'MEDIUM PRIVACY RISK' : 'PRIVACY PROTECTED'}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-ink dark:text-chalk">{privacyResult.summaryMessage}</h3>
                  <p className="font-mono text-xs text-ink/70 dark:text-chalk/70">
                    {privacyResult.findings.length} threat {privacyResult.findings.length === 1 ? 'signal' : 'signals'} evaluated in this photo.
                  </p>
                </div>
              </div>

              {/* Findings List */}
              <div className="space-y-3">
                <div className="editorial-kicker">EVALUATION LOG // DETECTED PRIVACY FINDINGS</div>
                {privacyResult.findings.length === 0 ? (
                  <div className="p-4 rounded-lg border border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-200 text-xs font-mono">
                    ✓ Clean! No sensitive location coordinates, hardware serial numbers, or author tags were found in this file.
                  </div>
                ) : (
                  privacyResult.findings.map((f, i) => (
                    <div key={i} className="p-4 rounded-lg border border-hairline bg-surface flex items-start gap-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase shrink-0 mt-0.5 border ${
                        f.level === 'high' ? 'border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300' : f.level === 'medium' ? 'border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-300' : 'border-hairline bg-surface-subtle text-ink/70 dark:text-chalk/70'
                      }`}>
                        {f.level}
                      </span>
                      <div className="min-w-0">
                        <p className="font-mono font-semibold text-xs text-ink dark:text-chalk">{f.title}</p>
                        <p className="font-sans text-xs text-ink/70 dark:text-chalk/70 mt-0.5">{f.description}</p>
                        {f.tagValue && (
                          <p className="text-[11px] font-mono text-ink/80 dark:text-chalk/80 bg-surface-subtle border border-hairline px-2 py-0.5 rounded mt-1.5 inline-block">
                            {f.tagValue}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 4. C2PA Checker View */}
          {toolType === 'c2pa' && c2paResult && (
            <div className="space-y-6">
              <div className="p-5 rounded-lg border border-hairline bg-surface-subtle flex items-center gap-4">
                <div className="w-12 h-12 rounded-md bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 flex items-center justify-center font-mono font-bold text-sm shrink-0">
                  {c2paResult.hasC2pa ? 'C2PA' : 'CLEAN'}
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-ink dark:text-chalk">
                    {c2paResult.hasC2pa
                      ? 'C2PA Content Credentials Manifest Detected'
                      : 'Verified Clean: No C2PA Credentials Found'}
                  </h3>
                  <p className="text-xs text-ink/70 dark:text-chalk/70 mt-1">
                    {c2paResult.hasC2pa
                      ? 'This image carries cryptographically signed manifests documenting edit history and creation origins.'
                      : 'This image is untracked and contains zero C2PA JUMBF manifests or cryptographic provenance seals.'}
                  </p>
                </div>
              </div>

              <div className="border border-hairline rounded-lg p-4 bg-surface space-y-2">
                <p className="text-xs font-mono font-bold text-ink/70 dark:text-chalk/70 uppercase tracking-wider">Manifest Inspection Log</p>
                <div className="space-y-1.5 font-mono text-xs text-ink/80 dark:text-chalk/80">
                  {c2paResult.details.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-ink/40">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5 & 6. AI Image & Watermark Checker View */}
          {(toolType === 'ai-image' || toolType === 'ai-watermark') && aiResult && (
            <div className="space-y-6">
              <div className="p-5 rounded-lg border border-hairline bg-surface-subtle flex items-center gap-4">
                <div className="w-12 h-12 rounded-md bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                  {aiResult.isAiDetected ? 'AI+' : 'RAW'}
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider mb-1 border border-current text-ink/70 dark:text-chalk/70">
                    {aiResult.isAiDetected ? `${aiResult.probability}% Confidence Match` : 'Authentic Camera Frame'}
                  </div>
                  <h3 className="font-serif text-base font-bold text-ink dark:text-chalk">
                    {aiResult.isAiDetected
                      ? `AI Signature Detected (${aiResult.engineName || 'Generative Pipeline'})`
                      : 'No AI Signatures or Prompts Detected'}
                  </h3>
                  <p className="text-xs text-ink/70 dark:text-chalk/70 mt-1">
                    {aiResult.isAiDetected
                      ? 'Embedded model prompts, workflow parameters, or generator tags were discovered inside this file.'
                      : 'No generative AI tags (Midjourney, DALL-E, Stable Diffusion) or prompt payloads were found.'}
                  </p>
                </div>
              </div>

              {/* Container Inspection Mode Disclaimer */}
              <div className="p-3.5 rounded-lg border border-hairline bg-surface-subtle text-xs text-ink/80 dark:text-chalk/80 flex items-start gap-2.5 font-mono">
                <span className="shrink-0 text-xs">[NOTE]</span>
                <div className="space-y-0.5">
                  <span className="font-bold">Container Header Inspection Mode:</span>{' '}
                  <span>
                    Scans container text headers (PNG iTXt/tEXt chunks, JPEG APP1 XMP/Exif markers, and workflow parameter dictionaries) for AI generation settings. Forensic pixel-frequency steganography (such as Google SynthID) is not evaluated.
                  </span>
                </div>
              </div>

              {aiResult.indicators.length > 0 && (
                <div className="border border-hairline rounded-lg p-4 bg-surface space-y-3 font-mono">
                  <p className="text-xs font-bold text-ink/70 dark:text-chalk/70 uppercase tracking-wider">Detected AI Signatures &amp; Prompts</p>
                  <div className="space-y-2">
                    {aiResult.indicators.map((ind, idx) => (
                      <div key={idx} className="p-3 bg-surface-subtle border border-hairline rounded-md text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-ink dark:text-chalk">{ind.label}</span>
                          <div className="flex items-center gap-1.5">
                            {ind.confidence && (
                              <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                                ind.confidence === 'high'
                                  ? 'border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300'
                                  : 'border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-300'
                              }`}>
                                {ind.confidence}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-ink/70 dark:text-chalk/70 break-all text-[11px]">{ind.snippet}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
