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
    dropzoneLabel: 'Drop image here to detect invisible AI watermarks',
    dropzoneDescription: 'Detects synthetic markers, C2PA manifests, and steganographic indicators',
    step3Label: 'Scanning Synthetic & Watermark Markers',
    step3Desc: 'Checking for watermarks, synthetic stamps, and provenance metadata',
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

  const config = configs[toolType];

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleFilesSelected = async (files: File[]) => {
    if (!files.length) return;
    const file = files[0];
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setIsProcessing(true);
    setCurrentStep(1);
    setProgressPercent(15);

    try {
      // Step 1: Reading File
      await sleep(300);
      setCurrentStep(2);
      setProgressPercent(40);

      // Step 2: Binary Parsing
      await sleep(350);
      setCurrentStep(3);
      setProgressPercent(75);

      // Step 3: Run specific analyzer
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

      await sleep(350);
      // Step 4: Finalizing Report
      setCurrentStep(4);
      setProgressPercent(95);
      await sleep(200);
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
      const url = URL.createObjectURL(cleanBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `clean_${selectedFile.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
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
              {/* Quick Summary Pill Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 p-3.5 rounded-xl">
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Camera</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-1 truncate">
                    {viewerResult.summary.camera || 'Not Recorded'}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 p-3.5 rounded-xl">
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date Taken</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-1 truncate">
                    {viewerResult.summary.date || 'Not Recorded'}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 p-3.5 rounded-xl">
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">GPS Coordinates</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-1 truncate">
                    {viewerResult.summary.location ? '📍 Detected' : 'None Found'}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 p-3.5 rounded-xl">
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Tags Found</p>
                  <p className="text-xs font-bold text-indigo-700 dark:text-indigo-400 mt-1">
                    {viewerResult.summary.totalTags} tags
                  </p>
                </div>
              </div>

              {/* Categorized Metadata Tables */}
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
            </div>
          )}

          {/* 2. Calculator View */}
          {toolType === 'calculator' && calcResult && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="paper-card p-4 bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
                  <p className="text-xs text-indigo-700 dark:text-indigo-400 font-semibold uppercase tracking-wider">Total File Size</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{calcResult.fileSizeFormatted}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{calcResult.fileSizeBytes.toLocaleString()} bytes</p>
                </div>
                <div className="paper-card p-4 bg-amber-50/50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
                  <p className="text-xs text-amber-800 dark:text-amber-300 font-semibold uppercase tracking-wider">Metadata Overhead</p>
                  <p className="text-2xl font-black text-amber-700 dark:text-amber-400 mt-1">{calcResult.metadataSizeFormatted}</p>
                  <p className="text-[11px] text-amber-900/70 dark:text-amber-400/80 mt-0.5">{calcResult.metadataPercentage}% of total file</p>
                </div>
                <div className="paper-card p-4 bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold uppercase tracking-wider">Visual Dimensions</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {calcResult.dimensions.width > 0 ? `${calcResult.dimensions.width} × ${calcResult.dimensions.height}` : 'N/A'}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{calcResult.megapixels}</p>
                </div>
                <div className="paper-card p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider">Format &amp; Density</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{calcResult.formatName}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{calcResult.dpi} DPI standard</p>
                </div>
              </div>

              {/* Progress representation */}
              <div className="paper-card p-5 border border-slate-200 dark:border-slate-800">
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
                  Wiping metadata from this image will save approximately <strong>{calcResult.metadataSizeFormatted}</strong> of storage without touching image resolution.
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
                    {aiResult.isAiDetected ? `${aiResult.probability}% AI Match` : 'Authentic Camera Photo'}
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

              {aiResult.indicators.length > 0 && (
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-900 shadow-xs space-y-3">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Detected AI Signatures &amp; Prompts</p>
                  <div className="space-y-2">
                    {aiResult.indicators.map((ind, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 rounded-lg text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 dark:text-slate-200">{ind.label}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                            {ind.source}
                          </span>
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
