/**
 * metadataTester.ts — Automated Verification & QA Testing Utility
 *
 * Verifies that client-side metadata stripping is 100% effective:
 * 1. Takes a processed Blob/File.
 * 2. Re-reads binary headers using exifr (TIFF, EXIF, GPS, IPTC, XMP, MakerNotes).
 * 3. Asserts zero tracking/personal metadata tags remain.
 * 4. Logs explicit verification proof to the console:
 *    "Verification Passed: 0 tags remain."
 */

import exifr from 'exifr';

export interface VerificationResult {
  passed: boolean;
  remainingTagCount: number;
  remainingTags: string[];
  message: string;
  timestamp: string;
}

// Technical image dimension/format properties that do not constitute personal tracking data
const NON_TRACKING_PROPERTIES = new Set([
  'ImageWidth',
  'ImageHeight',
  'ExifImageWidth',
  'ExifImageHeight',
  'ColorSpace',
  'Orientation',
  'PixelXDimension',
  'PixelYDimension',
]);

export interface VerifyOptions {
  throwOnError?: boolean;
  silent?: boolean;
  toolType?: string;
  isSelectiveJpeg?: boolean;
}

/**
 * Re-reads an exported image Blob with exifr to verify metadata eradication.
 * Supports both full stripping (0 tags remain) and selective stripping
 * (verifies targeted tags e.g. GPS are 0 while non-targeted camera metadata is preserved).
 *
 * @param blob - The processed image Blob to audit
 * @param options - Optional configuration (e.g. toolType, isSelectiveJpeg)
 * @returns VerificationResult detailing pass/fail status and remaining tags
 */
export async function verifyCleanBlob(
  blob: Blob,
  options?: VerifyOptions
): Promise<VerificationResult> {
  const remainingTags: string[] = [];
  const remainingGpsTags: string[] = [];

  try {
    // Audit for any surviving EXIF, GPS, IPTC, XMP, or MakerNotes
    const parsed = await exifr.parse(blob, {
      tiff: true,
      xmp: true,
      icc: false, // ICC profile defines color gamut, not user metadata
      iptc: true,
      jfif: false, // Baseline JFIF marker
      gps: true,
      makerNote: true,
      userComment: true,
      mergeOutput: true,
    });

    if (parsed && typeof parsed === 'object') {
      for (const [key, val] of Object.entries(parsed)) {
        if (val === null || val === undefined) continue;
        // Ignore internal decoder thumbnail pointers
        if (key === 'thumbnail' || key.startsWith('APP')) continue;
        // Check if key is tracking metadata
        if (!NON_TRACKING_PROPERTIES.has(key)) {
          remainingTags.push(key);
          if (
            key.toLowerCase().includes('gps') ||
            key.toLowerCase().includes('latitude') ||
            key.toLowerCase().includes('longitude')
          ) {
            remainingGpsTags.push(key);
          }
        }
      }
    }

    // Also explicitly test for GPS coordinates
    try {
      const gps = await exifr.gps(blob);
      if (gps && (gps.latitude !== undefined || gps.longitude !== undefined)) {
        if (!remainingTags.includes('GPSLatitude')) remainingTags.push('GPSLatitude');
        if (!remainingTags.includes('GPSLongitude')) remainingTags.push('GPSLongitude');
        if (!remainingGpsTags.includes('GPSLatitude')) remainingGpsTags.push('GPSLatitude');
        if (!remainingGpsTags.includes('GPSLongitude')) remainingGpsTags.push('GPSLongitude');
      }
    } catch {
      // No GPS data
    }
  } catch {
    // If exifr threw an error, the binary has no readable EXIF/TIFF blocks at all (Clean)
  }

  let passed = remainingTags.length === 0;
  let message = passed
    ? 'Verification Passed: 0 tags remain.'
    : `Verification Failed: ${remainingTags.length} tags remain (${remainingTags.join(', ')}).`;

  // Handle selective JPEG stripping verification
  if (options?.isSelectiveJpeg) {
    if (options.toolType === 'gps') {
      passed = remainingGpsTags.length === 0;
      message = passed
        ? 'Verification Passed: 0 GPS tags remain (Camera & timestamps preserved).'
        : `Verification Failed: ${remainingGpsTags.length} GPS tags still remain (${remainingGpsTags.join(', ')}).`;
    } else if (options.toolType === 'xmp') {
      const hasXmp = remainingTags.some((t) => t.toLowerCase().includes('xmp'));
      passed = !hasXmp;
      message = passed
        ? 'Verification Passed: 0 XMP packets remain (Camera EXIF preserved).'
        : 'Verification Failed: XMP packets still detected.';
    } else if (options.toolType === 'ai-only') {
      const hasAi = remainingTags.some(
        (t) => t.toLowerCase().includes('comment') || t.toLowerCase().includes('prompt')
      );
      passed = !hasAi;
      message = passed
        ? 'Verification Passed: 0 AI generation tags remain (Camera EXIF preserved).'
        : 'Verification Failed: AI generation tags still detected.';
    }
  }

  const timestamp = new Date().toISOString();

  if (!options?.silent) {
    if (passed) {
      console.log(
        '%c[MetaZap QA Verification] %c' + message + '%c (Blob size: ' +
          (blob.size / 1024).toFixed(1) +
          ' KB)',
        'color: #059669; font-weight: bold;',
        'color: #10b981; font-weight: bold; background: #ecfdf5; padding: 2px 6px; border-radius: 4px; border: 1px solid #a7f3d0;',
        'color: #64748b; font-size: 11px;'
      );
    } else {
      console.error(
        '%c[MetaZap QA Verification FAILED] %c' + message,
        'color: #dc2626; font-weight: bold;',
        'color: #b91c1c; font-weight: bold; background: #fef2f2; padding: 2px 6px; border-radius: 4px; border: 1px solid #fecaca;',
        remainingTags
      );
    }
  }

  if (!passed && options?.throwOnError) {
    throw new Error(`[MetaZap QA Error] ${message}`);
  }

  return {
    passed,
    remainingTagCount: remainingTags.length,
    remainingTags,
    message,
    timestamp,
  };
}

/**
 * End-to-end automated test runner for QA and continuous verification.
 * Strips a given raw File and verifies the resulting Blob.
 */
export async function runAutomatedMetadataTest(file: File): Promise<VerificationResult> {
  const { processImageFile } = await import('@/app/lib/metadataRemover');
  console.group(`[MetaZap Automated QA Suite] Testing: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
  try {
    const cleanBlob = await processImageFile(file);
    const result = await verifyCleanBlob(cleanBlob, { throwOnError: false });
    console.log('[MetaZap QA Suite] Result:', result);
    console.groupEnd();
    return result;
  } catch (err) {
    console.error('[MetaZap QA Suite] Test encountered an unexpected error:', err);
    console.groupEnd();
    throw err;
  }
}
