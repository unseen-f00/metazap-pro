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
    <div className="editorial-card p-6 md:p-10 mb-12">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-hairline">
        <div>
          <div className="editorial-kicker mb-2">
            MANUAL AUTHORING // EXIF HEADER INJECTOR
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-ink dark:text-chalk">
            EXIF Metadata Editor &amp; GPS Injector
          </h2>
          <p className="text-sm text-ink/70 dark:text-chalk/70 mt-1 font-sans">
            Read, customize, or inject author credits, copyright declarations, timestamps, and GPS coordinates directly into JPEG headers.
          </p>
        </div>
        {selectedFile && !isAnalyzing && (
          <button
            onClick={handleReset}
            className="self-start md:self-auto text-xs font-mono font-medium text-ink/80 dark:text-chalk/80 border border-hairline hover:bg-hairline/30 px-3.5 py-2 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>↺</span> UPLOAD DIFFERENT ASSET
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
          <div className="w-6 h-6 border-2 border-stone-900 dark:border-stone-100 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-mono text-xs text-ink/70 dark:text-chalk/70">
            PARSING BINARY APP MARKERS VIA EXIFR...
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* File summary preview bar */}
          <div className="border border-hairline rounded-lg p-4 bg-surface-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              {previewUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-14 h-14 object-cover rounded-md border border-hairline shadow-2xs shrink-0"
                />
              )}
              <div className="min-w-0">
                <p className="font-mono font-semibold text-xs sm:text-sm text-ink dark:text-chalk truncate">
                  {selectedFile.name}
                </p>
                <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-ink/60 dark:text-chalk/60 mt-0.5">
                  <span>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                  {dimensions && (
                    <>
                      <span className="opacity-40">/</span>
                      <span>
                        {dimensions.width} × {dimensions.height} px
                      </span>
                    </>
                  )}
                  <span className="opacity-40">/</span>
                  <span className="font-semibold text-ink dark:text-chalk">
                    {totalExistingTags} TAGS FOUND
                  </span>
                  <span className="opacity-40">/</span>
                  {isJpeg ? (
                    <span className="text-emerald-700 dark:text-emerald-300 font-semibold">
                      ✓ DIRECT JPEG EXIF
                    </span>
                  ) : (
                    <span className="text-amber-700 dark:text-amber-300 font-semibold">
                      NON-JPEG FORMAT
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
                className="text-xs font-mono text-ink dark:text-chalk border border-hairline bg-surface hover:bg-hairline/30 px-3 py-1.5 rounded-md transition-colors cursor-pointer"
                title="Update timestamp to right now"
              >
                SET CURRENT TIME
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs font-mono text-rose-700 dark:text-rose-300 border border-hairline bg-surface hover:bg-rose-500/10 px-3 py-1.5 rounded-md transition-colors cursor-pointer"
                title="Wipe all form inputs"
              >
                CLEAR ALL
              </button>
              {initialFields && (
                <button
                  type="button"
                  onClick={handleRestoreInitial}
                  className="text-xs font-mono text-ink/70 dark:text-chalk/70 border border-hairline bg-surface hover:bg-hairline/30 px-3 py-1.5 rounded-md transition-colors cursor-pointer"
                  title="Restore original extracted values"
                >
                  RESTORE ORIGINAL
                </button>
              )}
            </div>
          </div>

          {/* Fallback Notice for Non-JPEG Files */}
          {!isJpeg && (
            <div className="p-4 rounded-lg bg-surface-subtle border border-hairline text-ink dark:text-chalk space-y-3 font-mono text-xs">
              <div className="flex items-start gap-2.5">
                <span className="text-xs">[NOTICE]</span>
                <div>
                  <h4 className="font-bold uppercase tracking-wider">
                    JPEG-Only Direct EXIF Header Injection
                  </h4>
                  <p className="text-ink/70 dark:text-chalk/70 mt-1 leading-relaxed font-sans text-xs">
                    Direct binary EXIF header injection without re-compressing pixels is exclusively supported for JPEG files. PNG and WebP files do not use standard EXIF APP1 markers. You can strip all metadata chunks from this image using our client-side Canvas engine instead.
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t border-hairline flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleFallbackCanvasStrip}
                  disabled={isStrippingFallback}
                  className="px-4 py-2 bg-stone-900 text-stone-100 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 text-xs font-mono font-bold tracking-wider uppercase rounded-md transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  {isStrippingFallback ? (
                    <span>STRIPPING METADATA...</span>
                  ) : (
                    <span>STRIP VIA CANVAS INSTEAD</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Form fields */}
          <div className="grid md:grid-cols-2 gap-5">
            {/* Author */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-ink/70 dark:text-chalk/70">
                Author / Artist / Creator
              </label>
              <input
                type="text"
                value={fields.author}
                onChange={(e) => setFields({ ...fields, author: e.target.value })}
                placeholder="e.g., Alex Morgan Photography"
                className="w-full px-3.5 py-2.5 rounded-md border border-hairline bg-surface text-xs font-mono text-ink dark:text-chalk placeholder:text-ink/40 focus:outline-hidden focus:border-ink dark:focus:border-chalk transition-all"
              />
              <p className="font-mono text-[10px] text-ink/50 dark:text-chalk/50">
                Mapped to EXIF <code className="font-mono text-ink/80 dark:text-chalk/80">ImageIFD.Artist</code>.
              </p>
            </div>

            {/* Copyright */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-ink/70 dark:text-chalk/70">
                Copyright Notice
              </label>
              <input
                type="text"
                value={fields.copyright}
                onChange={(e) => setFields({ ...fields, copyright: e.target.value })}
                placeholder="e.g., © 2026 Alex Morgan. All rights reserved."
                className="w-full px-3.5 py-2.5 rounded-md border border-hairline bg-surface text-xs font-mono text-ink dark:text-chalk placeholder:text-ink/40 focus:outline-hidden focus:border-ink dark:focus:border-chalk transition-all"
              />
              <p className="font-mono text-[10px] text-ink/50 dark:text-chalk/50">
                Mapped to EXIF <code className="font-mono text-ink/80 dark:text-chalk/80">ImageIFD.Copyright</code>.
              </p>
            </div>

            {/* DateTimeOriginal */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-ink/70 dark:text-chalk/70">
                Date &amp; Time (DateTimeOriginal)
              </label>
              <input
                type="text"
                value={fields.dateOriginal}
                onChange={(e) => setFields({ ...fields, dateOriginal: e.target.value })}
                placeholder="YYYY:MM:DD HH:MM:SS"
                className="w-full px-3.5 py-2.5 rounded-md border border-hairline bg-surface text-xs font-mono text-ink dark:text-chalk placeholder:text-ink/40 focus:outline-hidden focus:border-ink dark:focus:border-chalk transition-all"
              />
              <p className="font-mono text-[10px] text-ink/50 dark:text-chalk/50">
                Standard format: <code className="font-mono text-ink/80 dark:text-chalk/80">YYYY:MM:DD HH:MM:SS</code>.
              </p>
            </div>

            {/* Software */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-ink/70 dark:text-chalk/70">
                Software / Program Name
              </label>
              <input
                type="text"
                value={fields.software}
                onChange={(e) => setFields({ ...fields, software: e.target.value })}
                placeholder="e.g., MetaZap Pro Metadata Studio"
                className="w-full px-3.5 py-2.5 rounded-md border border-hairline bg-surface text-xs font-mono text-ink dark:text-chalk placeholder:text-ink/40 focus:outline-hidden focus:border-ink dark:focus:border-chalk transition-all"
              />
              <p className="font-mono text-[10px] text-ink/50 dark:text-chalk/50">
                Mapped to EXIF <code className="font-mono text-ink/80 dark:text-chalk/80">ImageIFD.Software</code>.
              </p>
            </div>
          </div>

          {/* GPS Coordinates Section */}
          <div className="p-5 rounded-lg border border-hairline bg-surface-subtle space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="editorial-kicker mb-1">COORDINATE MAPPING // GPS IFD</div>
                <h3 className="font-mono text-xs sm:text-sm font-bold text-ink dark:text-chalk">
                  Geolocation Coordinates
                </h3>
                <p className="font-sans text-xs text-ink/70 dark:text-chalk/70 mt-0.5">
                  Embed custom location coordinates or clear GPS tags to remove physical location tracking.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  disabled={geoLocating}
                  className="px-3 py-1.5 border border-hairline bg-surface hover:bg-hairline/30 text-ink dark:text-chalk text-xs font-mono font-medium rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {geoLocating ? (
                    <span>LOCATING...</span>
                  ) : (
                    <span>GET CURRENT GPS</span>
                  )}
                </button>
                {(fields.latitude || fields.longitude) && (
                  <button
                    type="button"
                    onClick={handleClearGps}
                    className="px-2.5 py-1.5 border border-hairline bg-surface hover:bg-rose-500/10 text-rose-700 dark:text-rose-300 rounded-md text-xs font-mono transition-colors cursor-pointer"
                  >
                    CLEAR GPS
                  </button>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-mono uppercase text-ink/70 dark:text-chalk/70">
                  Latitude (-90 to +90)
                </label>
                <input
                  type="text"
                  value={fields.latitude}
                  onChange={(e) => setFields({ ...fields, latitude: e.target.value })}
                  placeholder="e.g. 37.774929"
                  className="w-full px-3.5 py-2.5 rounded-md border border-hairline bg-surface text-xs font-mono text-ink dark:text-chalk placeholder:text-ink/40 focus:outline-hidden focus:border-ink dark:focus:border-chalk"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-mono uppercase text-ink/70 dark:text-chalk/70">
                  Longitude (-180 to +180)
                </label>
                <input
                  type="text"
                  value={fields.longitude}
                  onChange={(e) => setFields({ ...fields, longitude: e.target.value })}
                  placeholder="e.g. -122.419416"
                  className="w-full px-3.5 py-2.5 rounded-md border border-hairline bg-surface text-xs font-mono text-ink dark:text-chalk placeholder:text-ink/40 focus:outline-hidden focus:border-ink dark:focus:border-chalk"
                />
              </div>
            </div>

            {/* Interactive Mini Map Preview if GPS coordinates are valid */}
            {hasValidGps && (
              <div className="rounded-lg overflow-hidden border border-hairline bg-surface mt-3">
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
                <div className="p-2.5 bg-surface-subtle border-t border-hairline flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <span className="text-ink dark:text-chalk">
                    MAP PIN: {parsedLat.toFixed(6)}°, {parsedLon.toFixed(6)}°
                  </span>
                  <a
                    href={`https://www.google.com/maps?q=${parsedLat},${parsedLon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-ink/70 dark:text-chalk/70 hover:text-ink dark:hover:text-chalk font-semibold flex items-center gap-1"
                  >
                    <span>OPEN GOOGLE MAPS</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/40 rounded-lg text-rose-700 dark:text-rose-300 text-xs font-mono">
              [ERROR] {errorMessage}
            </div>
          )}

          {/* Data Calculator & Analytics on success */}
          {lastResult && (
            <div className="p-5 rounded-lg border border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/20 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-sm font-bold text-ink dark:text-chalk">
                    EXIF Metadata Successfully Updated &amp; Injected
                  </h4>
                  <p className="font-mono text-[11px] text-ink/70 dark:text-chalk/70 mt-0.5">
                    Binary EXIF container rebuilt with zero loss to pixel clarity.
                  </p>
                </div>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/40 text-emerald-800 dark:text-emerald-300">
                  100% QUALITY PRESERVED
                </span>
              </div>

              {/* Analytics metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-surface p-3 rounded-md border border-hairline font-mono">
                  <span className="text-[10px] uppercase text-ink/60 dark:text-chalk/60 block">
                    Original Size
                  </span>
                  <span className="text-sm font-bold text-ink dark:text-chalk">
                    {formatFileSize(lastResult.originalSize)}
                  </span>
                </div>

                <div className="bg-surface p-3 rounded-md border border-hairline font-mono">
                  <span className="text-[10px] uppercase text-emerald-600 dark:text-emerald-400 block">
                    Edited Size
                  </span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {formatFileSize(lastResult.editedSize)}
                  </span>
                </div>

                <div className="bg-surface p-3 rounded-md border border-hairline font-mono">
                  <span className="text-[10px] uppercase text-ink/60 dark:text-chalk/60 block">
                    Size Delta
                  </span>
                  <span className="text-sm font-bold text-ink dark:text-chalk">
                    {lastResult.sizeDiffFormatted}
                  </span>
                </div>

                <div className="bg-surface p-3 rounded-md border border-hairline font-mono">
                  <span className="text-[10px] uppercase text-ink/60 dark:text-chalk/60 block">
                    Tags Injected
                  </span>
                  <span className="text-sm font-bold text-ink dark:text-chalk">
                    {lastResult.tagsCount} Tags
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-4 border-t border-hairline flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleApplyAndDownload}
              disabled={isApplying || !isJpeg}
              className="px-6 py-2.5 bg-stone-900 text-stone-100 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 disabled:opacity-50 text-xs font-mono font-bold tracking-wider uppercase rounded-md shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              {isApplying ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                  <span>INJECTING EXIF BINARY...</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 shrink-0" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>APPLY &amp; DOWNLOAD PHOTO</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2.5 border border-hairline bg-surface hover:bg-hairline/30 text-ink/80 dark:text-chalk/80 text-xs font-mono font-medium rounded-md transition-colors cursor-pointer"
            >
              RESET ALL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
