'use client';

/**
 * MetadataEditorTool.tsx
 * Advanced Client-Side EXIF Metadata Editor & Injector:
 * 1. Reads existing Author, Copyright, Software, Date, and GPS coordinates via exifr.
 * 2. Allows full editing of all 5 core fields + GPS Latitude/Longitude.
 * 3. Shows an interactive OpenStreetMap mini map for GPS pins with Google Maps export.
 * 4. Rebuilds EXIF binary and injects into JPEG via piexifjs without re-compressing pixels.
 * 5. Provides graceful fallback to Canvas stripping for PNG and non-JPEG formats.
 * 6. Displays Before vs After file size analytics and tag counters.
 */

import { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import UploadDropzone from '@/app/components/UploadDropzone';
import {
  readExifForEditor,
  injectExifData,
  stripFallbackCanvas,
  formatExifDate,
  ExifEditorFields,
  ExifEditorResult,
} from '@/app/lib/exifEditor';
import { triggerSuccessConfetti } from '@/app/lib/confetti';
import { formatFileSize } from '@/app/lib/metadataRemover';

export default function MetadataEditorTool() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isJpeg, setIsJpeg] = useState(true);
  const [totalExistingTags, setTotalExistingTags] = useState(0);

  // Form fields
  const [fields, setFields] = useState<ExifEditorFields>({
    author: '',
    copyright: '',
    dateOriginal: '',
    software: '',
    latitude: '',
    longitude: '',
  });

  const [initialFields, setInitialFields] = useState<ExifEditorFields | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isStrippingFallback, setIsStrippingFallback] = useState(false);
  const [lastResult, setLastResult] = useState<ExifEditorResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [geoLocating, setGeoLocating] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFilesSelected = async (files: File[]) => {
    if (!files.length) return;
    const file = files[0];
    if (!file || file.size === 0) {
      setErrorMessage('Selected file is empty or corrupted (0 bytes).');
      return;
    }

    setSelectedFile(file);
    setErrorMessage(null);
    setLastResult(null);

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Read image dimensions safely
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

    setIsAnalyzing(true);

    try {
      const { fields: loadedFields, isJpeg: fileIsJpeg, totalExistingTags: tagCount } =
        await readExifForEditor(file);

      setIsJpeg(fileIsJpeg);
      setTotalExistingTags(tagCount);
      setFields(loadedFields);
      setInitialFields(loadedFields);
    } catch {
      const fallbackDefaults: ExifEditorFields = {
        author: '',
        copyright: `© ${new Date().getFullYear()} All Rights Reserved`,
        dateOriginal: formatExifDate(),
        software: 'MetaZap Pro Metadata Studio',
        latitude: '',
        longitude: '',
      };
      setFields(fallbackDefaults);
      setInitialFields(fallbackDefaults);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyAndDownload = async () => {
    if (!selectedFile) return;
    setIsApplying(true);
    setErrorMessage(null);

    try {
      const result = await injectExifData(selectedFile, fields);
      saveAs(result.blob, result.fileName);
      setLastResult(result);
      triggerSuccessConfetti();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to inject EXIF data';
      setErrorMessage(message);
    } finally {
      setIsApplying(false);
    }
  };

  const handleFallbackCanvasStrip = async () => {
    if (!selectedFile) return;
    setIsStrippingFallback(true);
    setErrorMessage(null);

    try {
      const cleanBlob = await stripFallbackCanvas(selectedFile);
      const downloadName = `clean_${selectedFile.name}`;
      saveAs(cleanBlob, downloadName);
      triggerSuccessConfetti();
    } catch {
      setErrorMessage('Failed to strip metadata from this file.');
    } finally {
      setIsStrippingFallback(false);
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
      latitude: '',
      longitude: '',
    });
  };

  const handleRestoreInitial = () => {
    if (initialFields) {
      setFields(initialFields);
    }
  };

  const handleClearGps = () => {
    setFields((prev) => ({
      ...prev,
      latitude: '',
      longitude: '',
    }));
  };

  const handleGetCurrentLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }

    setGeoLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLocating(false);
        setFields((prev) => ({
          ...prev,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
      },
      (err) => {
        setGeoLocating(false);
        setErrorMessage(`Could not access GPS location: ${err.message}`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setDimensions(null);
    setIsAnalyzing(false);
    setLastResult(null);
    setErrorMessage(null);
    setInitialFields(null);
    setFields({
      author: '',
      copyright: '',
      dateOriginal: '',
      software: '',
      latitude: '',
      longitude: '',
    });
  };

  // Valid GPS coordinates for mini map
  const parsedLat = parseFloat(fields.latitude);
  const parsedLon = parseFloat(fields.longitude);
  const hasValidGps =
    !isNaN(parsedLat) &&
    !isNaN(parsedLon) &&
    parsedLat >= -90 &&
    parsedLat <= 90 &&
    parsedLon >= -180 &&
    parsedLon <= 180;

  return (
    <div className="paper-card p-6 md:p-10 shadow-paper-lg mb-12 border border-slate-200/80 dark:border-slate-800">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300 mb-2">
            <span>✏️ EXIF TAG CUSTOMIZER &amp; GPS INJECTOR</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white font-[family-name:var(--font-merriweather)]">
            Manual EXIF Metadata Editor
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Read, customize, or inject author credits, copyright, timestamps, and GPS coordinates directly into JPEG headers.
          </p>
        </div>
        {selectedFile && !isAnalyzing && (
          <button
            onClick={handleReset}
            className="self-start md:self-auto text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:hover:text-white dark:bg-slate-800 dark:hover:bg-slate-700 px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
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
          description="JPEG photos supported for direct EXIF header injection (PNGs supported via Canvas)"
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        />
      ) : isAnalyzing ? (
        <div className="p-8 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Reading image metadata with exifr...
          </p>
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
                <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                  {selectedFile.name}
                </p>
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
                  <span className="font-semibold text-indigo-700 dark:text-indigo-300">
                    {totalExistingTags} Tags Detected
                  </span>
                  <span>•</span>
                  {isJpeg ? (
                    <span className="text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded border border-emerald-200 text-[11px] font-semibold">
                      ✓ Direct JPEG EXIF Support
                    </span>
                  ) : (
                    <span className="text-amber-700 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800 px-2 py-0.5 rounded border border-amber-200 text-[11px] font-semibold">
                      Non-JPEG Format
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleSetCurrentDate}
                className="text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-900/60 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                title="Update timestamp to right now"
              >
                🕒 Set Today&apos;s Time
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/60 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                title="Wipe all form inputs"
              >
                🗑️ Clear All
              </button>
              {initialFields && (
                <button
                  type="button"
                  onClick={handleRestoreInitial}
                  className="text-xs font-medium text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:border-slate-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  title="Restore original extracted values"
                >
                  ↺ Restore Original
                </button>
              )}
            </div>
          </div>

          {/* Graceful Fallback Notice for Non-JPEG Files */}
          {!isJpeg && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 space-y-3">
              <div className="flex items-start gap-2.5">
                <span className="text-xl">⚠️</span>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm">
                    JPEG-Only Direct EXIF Header Injection
                  </h4>
                  <p className="text-xs text-amber-800 dark:text-amber-300 mt-1 leading-relaxed">
                    Direct binary EXIF header injection without re-compressing pixels is exclusively supported for JPEG files. PNG and WebP files do not use standard EXIF APP1 markers. You can strip all metadata chunks from this image using our client-side Canvas engine instead.
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t border-amber-200/80 dark:border-amber-800 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleFallbackCanvasStrip}
                  disabled={isStrippingFallback}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {isStrippingFallback ? (
                    <span>Stripping Metadata...</span>
                  ) : (
                    <span>✨ Deep Clean / Strip via Canvas Instead</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Form fields */}
          <div className="grid md:grid-cols-2 gap-5">
            {/* Author */}
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

            {/* Copyright */}
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

            {/* DateTimeOriginal */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Date &amp; Time (DateTimeOriginal)
              </label>
              <input
                type="text"
                value={fields.dateOriginal}
                onChange={(e) => setFields({ ...fields, dateOriginal: e.target.value })}
                placeholder="YYYY:MM:DD HH:MM:SS"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm font-mono"
              />
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Standard format: <code className="text-slate-600 dark:text-slate-300 font-mono">YYYY:MM:DD HH:MM:SS</code>.
              </p>
            </div>

            {/* Software */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Software / Program Name
              </label>
              <input
                type="text"
                value={fields.software}
                onChange={(e) => setFields({ ...fields, software: e.target.value })}
                placeholder="e.g., MetaZap Pro Metadata Studio"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
              />
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Mapped to EXIF <code className="text-slate-600 dark:text-slate-300 font-mono">ImageIFD.Software</code>.
              </p>
            </div>
          </div>

          {/* GPS Coordinates Section */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <span>📍</span>
                  <span>GPS Geolocation Coordinates</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Embed custom location coordinates or clear GPS tags to remove physical location tracking.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  disabled={geoLocating}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {geoLocating ? (
                    <span>Locating...</span>
                  ) : (
                    <>
                      <span>🎯</span>
                      <span>Use Current Location</span>
                    </>
                  )}
                </button>
                {(fields.latitude || fields.longitude) && (
                  <button
                    type="button"
                    onClick={handleClearGps}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                  >
                    Clear GPS
                  </button>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400">
                  Latitude (-90 to +90)
                </label>
                <input
                  type="text"
                  value={fields.latitude}
                  onChange={(e) => setFields({ ...fields, latitude: e.target.value })}
                  placeholder="e.g. 37.774929"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400">
                  Longitude (-180 to +180)
                </label>
                <input
                  type="text"
                  value={fields.longitude}
                  onChange={(e) => setFields({ ...fields, longitude: e.target.value })}
                  placeholder="e.g. -122.419416"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>

            {/* Interactive Mini Map Preview if GPS coordinates are valid */}
            {hasValidGps && (
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 mt-3">
                <div className="relative w-full h-48 sm:h-56">
                  <iframe
                    title="GPS Mini Map Preview"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${parsedLon - 0.008}%2C${parsedLat - 0.008}%2C${parsedLon + 0.008}%2C${parsedLat + 0.008}&layer=mapnik&marker=${parsedLat}%2C${parsedLon}`}
                    className="w-full h-full border-0"
                  />
                </div>
                <div className="p-2.5 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    📍 {parsedLat.toFixed(6)}°, {parsedLon.toFixed(6)}°
                  </span>
                  <a
                    href={`https://www.google.com/maps?q=${parsedLat},${parsedLon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 font-semibold flex items-center gap-1"
                  >
                    <span>View on Google Maps</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 text-xs font-medium">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Data Calculator & Analytics on success */}
          {lastResult && (
            <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎉</span>
                  <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-100">
                    EXIF Metadata Successfully Updated &amp; Injected!
                  </h4>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                  100% Quality Preserved
                </span>
              </div>

              {/* Analytics metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white dark:bg-slate-800/80 p-3 rounded-xl border border-emerald-200/70 dark:border-emerald-800/70 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                    Original Size
                  </span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100 font-mono">
                    {formatFileSize(lastResult.originalSize)}
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-800/80 p-3 rounded-xl border border-emerald-200/70 dark:border-emerald-800/70 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                    Edited Size
                  </span>
                  <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300 font-mono">
                    {formatFileSize(lastResult.editedSize)}
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-800/80 p-3 rounded-xl border border-emerald-200/70 dark:border-emerald-800/70 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                    Size Difference
                  </span>
                  <span className="text-sm font-bold text-indigo-700 dark:text-indigo-400 font-mono">
                    {lastResult.sizeDiffFormatted}
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-800/80 p-3 rounded-xl border border-emerald-200/70 dark:border-emerald-800/70 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                    Tags Modified
                  </span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100 font-mono">
                    {lastResult.tagsCount} Tags
                  </span>
                </div>
              </div>

              <p className="text-xs text-emerald-800 dark:text-emerald-300">
                ✓ Image pixels were unmodified. Only the binary EXIF container was rewritten and inserted into your file.
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleApplyAndDownload}
              disabled={isApplying || !isJpeg}
              className="px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              {isApplying ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Injecting EXIF Binary...</span>
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
              className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 text-sm font-medium rounded-xl transition-colors cursor-pointer"
            >
              Reset All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
