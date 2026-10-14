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
    <div className="paper-card p-6 md:p-10 shadow-paper-lg mb-12 border border-slate-200/80 dark:border-slate-800">
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
            <div className="relative border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 bg-slate-100/50 dark:bg-slate-800/50 flex flex-col items-center justify-center overflow-hidden shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-64 object-contain rounded-xl shadow-xs"
              />
              <div className="mt-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2">
                <span>🔍 {selectedFile.name}</span>
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
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* File Header Bar */}
          <div className="border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 bg-slate-50/70 dark:bg-slate-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt={selectedFile.name}
                  className="w-14 h-14 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm shrink-0"
                />
              ) : (
                <div className="w-11 h-11 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xl shadow-xs shrink-0">
                  🔍
                </div>
              )}
              <div className="min-w-0">
                <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{selectedFile.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · {selectedFile.type || 'Image'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleQuickClean}
                disabled={isCleaning}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-xs hover:shadow transition-all"
              >
                {isCleaning ? 'Cleaning...' : '✨ Clean & Download'}
              </button>
              <button
                onClick={handleReset}
                className="px-3.5 py-2 bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-xl transition-colors"
              >
                Scan Another
              </button>
            </div>
          </div>

          {/* 1. Deep Metadata Viewer View */}
          {toolType === 'viewer' && viewerResult && (
            <div className="space-y-6">
              {/* Windows File Properties Overview Cards */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🗂️</span>
                    <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      Windows File Properties Summary
                    </h3>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    {viewerResult.summary.totalTags} Total Tags Found
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Camera Maker / Model */}
                  <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <span>📷</span> Camera Maker &amp; Model
                    </p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white mt-1.5 truncate" title={viewerResult.details.cameraCombined || 'Not Recorded'}>
                      {viewerResult.details.cameraCombined || 'Not Recorded'}
                    </p>
                  </div>

                  {/* F-Stop (Aperture) */}
                  <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <span>🔘</span> F-Stop (Aperture)
                    </p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white mt-1.5 font-mono">
                      {viewerResult.details.fStop || 'N/A'}
                    </p>
                  </div>

                  {/* ISO Speed */}
                  <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <span>⚡</span> ISO Speed
                    </p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white mt-1.5 font-mono">
                      {viewerResult.details.iso || 'N/A'}
                    </p>
                  </div>

                  {/* Exposure Time */}
                  <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <span>⏱️</span> Exposure Time
                    </p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white mt-1.5 font-mono">
                      {viewerResult.details.exposureTime || 'N/A'}
                    </p>
                  </div>

                  {/* Lens Info */}
                  <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <span>🔭</span> Lens Specification
                    </p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white mt-1.5 truncate" title={viewerResult.details.lensInfo || 'Standard Lens'}>
                      {viewerResult.details.lensInfo || 'Standard Lens'}
                    </p>
                  </div>

                  {/* Software */}
                  <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <span>💻</span> Software / Firmware
                    </p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white mt-1.5 truncate" title={viewerResult.details.software || 'Camera OS'}>
                      {viewerResult.details.software || 'Camera OS'}
                    </p>
                  </div>

                  {/* Date Taken */}
                  <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <span>🕒</span> Date Taken
                    </p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white mt-1.5 truncate" title={viewerResult.details.dateTaken || 'No timestamp'}>
                      {viewerResult.details.dateTaken || 'No timestamp'}
                    </p>
                  </div>

                  {/* Author / Artist */}
                  <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <span>👤</span> Author / Artist
                    </p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white mt-1.5 truncate" title={viewerResult.details.author || 'Anonymous'}>
                      {viewerResult.details.author || 'Anonymous'}
                    </p>
                  </div>
                </div>
              </div>

              {/* GPS Geolocation & Mini Map Section */}
              {viewerResult.details.gps && (
                <div className="p-4 sm:p-5 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📍</span>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          GPS Geolocation Pinpoint
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {viewerResult.details.gps.formatted}
                          {viewerResult.details.gps.altitude !== undefined
                            ? ` · ${viewerResult.details.gps.altitude.toFixed(1)}m elevation`
                            : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`https://www.google.com/maps?q=${viewerResult.details.gps.latitude},${viewerResult.details.gps.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                      >
                        <span>Open in Google Maps</span>
                        <span>↗</span>
                      </a>
                    </div>
                  </div>

                  {/* Interactive Mini Map Frame */}
                  <div className="w-full h-56 sm:h-64 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xs bg-slate-100 dark:bg-slate-800">
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
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setViewerTab('properties')}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        viewerTab === 'properties'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      Windows File Properties
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewerTab('raw')}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        viewerTab === 'raw'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      Raw Tags Directory ({Object.keys(viewerResult.rawTags).length})
                    </button>
                  </div>

                  {viewerTab === 'raw' && (
                    <input
                      type="text"
                      value={searchTagQuery}
                      onChange={(e) => setSearchTagQuery(e.target.value)}
                      placeholder="Search any tag (e.g. Flash, Lens, ISO)..."
                      className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
                    />
                  )}
                </div>

                {viewerTab === 'properties' ? (
                  <div className="space-y-4">
                    {viewerResult.sections.map((sec, sIdx) => (
                      <div key={sIdx} className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-xs">
                        <div className="bg-slate-100/70 dark:bg-slate-800/80 px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                          <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                            {sec.category}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            {sec.tags.length} {sec.tags.length === 1 ? 'entry' : 'entries'}
                          </span>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                          {sec.tags.map((tag, tIdx) => (
                            <div key={tIdx} className="px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                              <span className="font-medium text-slate-600 dark:text-slate-400 sm:w-1/3 truncate">{tag.label}</span>
                              <span className={`sm:w-2/3 break-all ${tag.isSensitive ? 'font-semibold text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-slate-100'}`}>
                                {tag.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-xs">
                    <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs">
                      {Object.entries(viewerResult.rawTags)
                        .filter(([k, v]) =>
                          searchTagQuery
                            ? k.toLowerCase().includes(searchTagQuery.toLowerCase()) ||
                              v.toLowerCase().includes(searchTagQuery.toLowerCase())
                            : true
                        )
                        .map(([k, v], rIdx) => (
                          <div key={rIdx} className="px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <span className="text-indigo-600 dark:text-indigo-400 font-semibold sm:w-1/3 truncate">{k}</span>
                            <span className="text-slate-700 dark:text-slate-300 sm:w-2/3 break-all">{v}</span>
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
                <div className="paper-card p-4 sm:p-5 bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 rounded-2xl shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                    <span>🏷️</span> Total Tags Found
                  </div>
                  <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">
                    {calcResult.totalTagsFound}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    EXIF, GPS, XMP, &amp; TIFF metadata headers
                  </p>
                </div>

                <div className="paper-card p-4 sm:p-5 bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-2xl shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                    <span>✂️</span> Tags Removed / Wipeable
                  </div>
                  <p className="text-3xl font-black text-amber-700 dark:text-amber-400 mt-2">
                    {calcResult.tagsRemovedCount}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Ready to be permanently wiped
                  </p>
                </div>

                <div className="paper-card p-4 sm:p-5 bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                    <span>📉</span> Space Saved
                  </div>
                  <p className="text-3xl font-black text-emerald-700 dark:text-emerald-400 mt-2">
                    {calcResult.spaceSavedFormatted}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {calcResult.metadataPercentage}% header bloat eliminated
                  </p>
                </div>
              </div>

              {/* Before vs After Size Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="paper-card p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Original File Size</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white mt-1 font-mono">{calcResult.fileSizeFormatted}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{calcResult.fileSizeBytes.toLocaleString()} bytes</p>
                </div>

                <div className="paper-card p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">Cleaned File Size</p>
                  <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">{calcResult.cleanedSizeFormatted}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{calcResult.cleanedSizeBytes.toLocaleString()} bytes</p>
                </div>

                <div className="paper-card p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Visual Dimensions</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white mt-1 font-mono">
                    {calcResult.dimensions.width > 0 ? `${calcResult.dimensions.width} × ${calcResult.dimensions.height}` : 'N/A'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{calcResult.megapixels}</p>
                </div>

                <div className="paper-card p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Format &amp; Density</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{calcResult.formatName}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{calcResult.dpi} DPI</p>
                </div>
              </div>

              {/* Progress representation */}
              <div className="paper-card p-5 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  <span>Visual Image Pixels: {(100 - calcResult.metadataPercentage).toFixed(1)}%</span>
                  <span className="text-amber-700 dark:text-amber-400">Metadata Overhead: {calcResult.metadataPercentage}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-500"
                    style={{ width: `${Math.max(5, 100 - calcResult.metadataPercentage)}%` }}
                  />
                  <div
                    className="h-full bg-amber-500 transition-all duration-500"
                    style={{ width: `${Math.min(95, calcResult.metadataPercentage)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                  Wiping metadata from this image will save approximately <strong>{calcResult.spaceSavedFormatted}</strong> ({calcResult.metadataPercentage}%) of storage without touching image resolution.
                </p>
              </div>
            </div>
          )}

          {/* 3. Privacy Risk Score View */}
          {toolType === 'privacy' && privacyResult && (
            <div className="space-y-6">
              {/* Big Score Header */}
              <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-center gap-6 ${
                privacyResult.riskLevel === 'high'
                  ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-950 dark:text-rose-100'
                  : privacyResult.riskLevel === 'medium'
                  ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 text-amber-950 dark:text-amber-100'
                  : 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60 text-emerald-950 dark:text-emerald-100'
              }`}>
                <div className={`w-20 h-20 rounded-full flex flex-col items-center justify-center shrink-0 font-black shadow-sm ${
                  privacyResult.riskLevel === 'high'
                    ? 'bg-rose-600 text-white'
                    : privacyResult.riskLevel === 'medium'
                    ? 'bg-amber-500 text-white'
                    : 'bg-emerald-600 text-white'
                }`}>
                  <span className="text-2xl leading-none">{privacyResult.score}</span>
                  <span className="text-[10px] uppercase font-bold opacity-80">/ 100</span>
                </div>

                <div className="space-y-1 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider mb-1 bg-white/70 dark:bg-slate-900/70 border border-current">
                    {privacyResult.riskLevel === 'high' ? '⚠️ High Privacy Risk' : privacyResult.riskLevel === 'medium' ? '⚡ Medium Privacy Risk' : '🛡️ Safe & Protected'}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{privacyResult.summaryMessage}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {privacyResult.findings.length} threat {privacyResult.findings.length === 1 ? 'signal' : 'signals'} evaluated in this photo.
                  </p>
                </div>
              </div>

              {/* Findings List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Detected Privacy Findings</h4>
                {privacyResult.findings.length === 0 ? (
                  <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 text-xs font-medium">
                    ✓ Clean! No sensitive location coordinates, hardware serial numbers, or author tags were found in this file.
                  </div>
                ) : (
                  privacyResult.findings.map((f, i) => (
                    <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-start gap-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 mt-0.5 ${
                        f.level === 'high' ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300' : f.level === 'medium' ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {f.level}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{f.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{f.description}</p>
                        {f.tagValue && (
                          <p className="text-[11px] font-mono text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded mt-1.5 inline-block">
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
              <div className={`p-6 rounded-2xl border flex items-center gap-5 ${
                c2paResult.hasC2pa
                  ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60'
                  : 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60'
              }`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-xs shrink-0 ${
                  c2paResult.hasC2pa ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
                }`}>
                  {c2paResult.hasC2pa ? '📜' : '🛡️'}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {c2paResult.hasC2pa
                      ? 'C2PA Content Credentials Detected'
                      : 'Verified Clean: No C2PA Credentials Found'}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    {c2paResult.hasC2pa
                      ? 'This image carries cryptographically signed manifests documenting edit history and creation origins.'
                      : 'This image is untracked and contains zero C2PA JUMBF manifests or cryptographic provenance seals.'}
                  </p>
                </div>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-900 shadow-xs space-y-2">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Manifest Inspection Log</p>
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  {c2paResult.details.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400">•</span>
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
              <div className={`p-6 rounded-2xl border flex items-center gap-5 ${
                aiResult.isAiDetected
                  ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60'
                  : 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60'
              }`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-xs shrink-0 ${
                  aiResult.isAiDetected ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                }`}>
                  {aiResult.isAiDetected ? '🤖' : '📷'}
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider mb-1 bg-white/70 dark:bg-slate-900/70 border border-current">
                    {aiResult.isAiDetected ? `${aiResult.probability}% Confidence match` : 'Authentic Camera Photo'}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {aiResult.isAiDetected
                      ? `AI Signature Detected (${aiResult.engineName || 'Generative Pipeline'})`
                      : 'No AI Signatures or Prompts Detected'}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    {aiResult.isAiDetected
                      ? 'Embedded model prompts, workflow parameters, or generator tags were found inside this file.'
                      : 'No generative AI tags (Midjourney, DALL-E, Stable Diffusion) or prompt payloads were found.'}
                  </p>
                </div>
              </div>

              {/* Honest Container Inspection Mode Disclaimer */}
              <div className="p-3.5 rounded-xl border border-blue-200/80 dark:border-blue-900/50 bg-blue-50/60 dark:bg-blue-950/30 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
                <span className="shrink-0 text-base leading-none">ℹ️</span>
                <div className="space-y-0.5">
                  <span className="font-bold">Container Metadata Inspection Mode:</span>{' '}
                  <span>
                    Scans container text headers (PNG iTXt/tEXt chunks, JPEG APP1 XMP/Exif markers, and workflow parameter dictionaries) for AI generation settings. Forensic pixel-frequency steganography (such as Google SynthID) is not evaluated.
                  </span>
                </div>
              </div>

              {aiResult.indicators.length > 0 && (
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-900 shadow-xs space-y-3">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Detected AI Signatures &amp; Prompts</p>
                  <div className="space-y-2">
                    {aiResult.indicators.map((ind, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 rounded-lg text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 dark:text-slate-200">{ind.label}</span>
                          <div className="flex items-center gap-1.5">
                            {ind.confidence && (
                              <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                ind.confidence === 'high'
                                  ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
                                  : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
                              }`}>
                                {ind.confidence}
                              </span>
                            )}
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                              {ind.source}
                            </span>
                          </div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 break-all font-mono text-[11px]">{ind.snippet}</p>
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
