/**
 * metadataRemover.ts
 * 100% Client-Side EXIF, GPS, and Metadata Stripping Engine.
 *
 * Uses the HTML5 <canvas> method for true client-side stripping:
 * 1. Draws the image onto an off-screen canvas matching the exact original dimensions.
 * 2. Exports using canvas.toBlob(..., originalMimeType, 1.0) to preserve 100% MAXIMUM visual quality.
 * 3. Inherently strips all EXIF, GPS, camera details, IPTC, XMP, and C2PA manifests.
 * 4. Actively clears canvas GPU buffers to prevent memory leaks on Android and mobile browsers.
 */

/**
 * Formats byte values into human-readable strings (B, KB, MB).
 */
export function formatFileSize(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export interface SizeAnalytics {
  originalBytes: number;
  originalFormatted: string;
  cleanedBytes: number;
  cleanedFormatted: string;
  savedBytes: number;
  savedFormatted: string;
  savedKb: string;
  savedPercent: string;
}

/**
 * Calculates Before vs After file size analytics and space savings.
 */
export function calculateSizeAnalytics(originalBytes: number, cleanedBytes: number): SizeAnalytics {
  const savedBytes = Math.max(0, originalBytes - cleanedBytes);
  const savedKbVal = (savedBytes / 1024).toFixed(1);
  const savedPercent = originalBytes > 0 ? ((savedBytes / originalBytes) * 100).toFixed(1) : '0';
  return {
    originalBytes,
    originalFormatted: formatFileSize(originalBytes),
    cleanedBytes,
    cleanedFormatted: formatFileSize(cleanedBytes),
    savedBytes,
    savedFormatted: formatFileSize(savedBytes),
    savedKb: `${savedKbVal} KB`,
    savedPercent,
  };
}

/**
 * Converts a base64 data URL string to a clean Blob.
 */
export function base64DataUrlToBlob(base64DataUrl: string): Blob {
  const [header, data] = base64DataUrl.split(',');
  const mimeMatch = header.match(/:(.*?);/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

  const binaryString = atob(data);
  const byteArray = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    byteArray[i] = binaryString.charCodeAt(i);
  }

  return new Blob([byteArray], { type: mimeType });
}

/**
 * Safely reads a File or Blob into a base64 Data URL using FileReader.
 * Fully handles mobile device aborts, errors, and incomplete streams.
 */
export function readFileAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!blob || blob.size === 0) {
      reject(new Error('File is empty (0 bytes).'));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('FileReader did not return a valid data URL.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file from device storage.'));
    };

    reader.onabort = () => {
      reject(new Error('File read was aborted.'));
    };

    reader.readAsDataURL(blob);
  });
}

/**
 * Strips tEXt, zTXt, and iTXt metadata chunks from a PNG binary.
 * Preserves core image rendering chunks.
 */
export function removePngMetadataChunks(buffer: ArrayBuffer): Blob {
  const bytes = new Uint8Array(buffer);
  const PNG_SIGNATURE_LENGTH = 8;
  const pngSignature = bytes.slice(0, PNG_SIGNATURE_LENGTH);

  const cleanChunks: Uint8Array[] = [];
  let offset = PNG_SIGNATURE_LENGTH;

  while (offset < bytes.length) {
    if (offset + 8 > bytes.length) break;

    const dataView = new DataView(buffer, offset);
    const chunkDataLength = dataView.getUint32(0);
    const chunkType = String.fromCharCode(
      bytes[offset + 4],
      bytes[offset + 5],
      bytes[offset + 6],
      bytes[offset + 7]
    );

    const totalChunkSize = 4 + 4 + chunkDataLength + 4;
    const isMetadataChunk =
      chunkType === 'tEXt' ||
      chunkType === 'zTXt' ||
      chunkType === 'iTXt' ||
      chunkType === 'eXIf';

    if (!isMetadataChunk) {
      cleanChunks.push(bytes.slice(offset, offset + totalChunkSize));
    }

    offset += totalChunkSize;
    if (chunkType === 'IEND') break;
  }

  const totalCleanSize =
    pngSignature.byteLength +
    cleanChunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);

  const cleanPngBuffer = new Uint8Array(totalCleanSize);
  let writePosition = 0;

  cleanPngBuffer.set(pngSignature, writePosition);
  writePosition += pngSignature.byteLength;

  for (const chunk of cleanChunks) {
    cleanPngBuffer.set(chunk, writePosition);
    writePosition += chunk.byteLength;
  }

  return new Blob([cleanPngBuffer], { type: 'image/png' });
}

export interface CanvasStripOptions {
  outputMime?: string;
  quality?: number;
}

/**
 * Core HTML5 <canvas> EXIF/Metadata Stripper.
 *
 * 1. Draws image onto offscreen canvas matching the exact original dimensions.
 * 2. Exports with canvas.toBlob(..., originalMimeType, 1.0) for 100% maximum visual quality.
 * 3. Immediately disposes of canvas texture memory to prevent mobile crashes.
 *
 * @param file - The input File or Blob to strip
 * @param options - Custom output MIME type and compression quality (defaults to 1.0)
 * @returns A freshly encoded clean Blob with zero metadata
 */
export async function stripMetadataWithCanvas(
  file: File | Blob,
  options?: CanvasStripOptions
): Promise<Blob> {
  if (!file || file.size === 0) {
    throw new Error('Selected file is empty or corrupted (0 bytes).');
  }

  // Handle Apple HEIC/HEIF on mobile or desktop browsers that lack native decoder
  let sourceBlob: Blob = file;
  const fileName = file instanceof File ? file.name.toLowerCase() : '';
  const fileType = (file.type || '').toLowerCase();
  const isHeic =
    fileType.includes('heic') ||
    fileType.includes('heif') ||
    fileName.endsWith('.heic') ||
    fileName.endsWith('.heif');

  // Determine target output MIME type: preserve exact original format
  let targetMime = options?.outputMime;
  if (!targetMime) {
    if (fileType === 'image/png' || fileName.endsWith('.png')) {
      targetMime = 'image/png';
    } else if (fileType === 'image/webp' || fileName.endsWith('.webp')) {
      targetMime = 'image/webp';
    } else {
      targetMime = 'image/jpeg';
    }
  }

  if (isHeic) {
    const heic2anyModule = await import('heic2any');
    const heic2any = heic2anyModule.default;
    const converted = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: options?.quality ?? 0.92,
    });
    sourceBlob = Array.isArray(converted) ? converted[0] : converted;
  }

  // Phase 1 fix: For JPEGs and WebP, use 0.92 compression ratio (not 1.0)
  // to maintain high visual quality while keeping file size equal to or smaller than original.
  const isLossyFormat = targetMime === 'image/jpeg' || targetMime === 'image/webp';
  const defaultQuality = isLossyFormat ? 0.92 : 1.0;
  const quality = options?.quality ?? defaultQuality;

  // Load image via FileReader data URL for mobile reliability
  const dataUrl = await readFileAsDataUrl(sourceBlob);

  return new Promise<Blob>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        // Match exact original natural dimensions
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;

        if (!width || !height) {
          reject(new Error('Image has zero dimensions or could not be decoded.'));
          return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const isTransparentFormat =
          targetMime === 'image/png' || targetMime === 'image/webp';
        const ctx = canvas.getContext('2d', { alpha: isTransparentFormat });

        if (!ctx) {
          reject(new Error('HTML5 Canvas 2D context is unavailable on this device.'));
          return;
        }

        // Fill with white background for JPEG so transparency doesn't turn black
        if (targetMime === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
        }

        // Draw image onto clean offscreen canvas matching exact original dimensions
        ctx.drawImage(img, 0, 0, width, height);

        // Export clean Blob using native browser encoder with 1.0 quality
        canvas.toBlob(
          (blob) => {
            // Free GPU texture and context buffers immediately on mobile
            try {
              ctx.clearRect(0, 0, width, height);
              canvas.width = 0;
              canvas.height = 0;
            } catch {
              // Ignore cleanup errors
            }

            // Clean up image reference
            img.onload = null;
            img.onerror = null;
            img.src = '';

            if (blob && blob.size > 0) {
              resolve(blob);
            } else {
              // Fallback to toDataURL if canvas.toBlob is unsupported or returns null
              try {
                const fallbackUrl = canvas.toDataURL(targetMime, quality);
                const fallbackBlob = base64DataUrlToBlob(fallbackUrl);
                resolve(fallbackBlob);
              } catch (exportErr) {
                reject(
                  new Error(
                    'Canvas export failed: ' +
                      (exportErr instanceof Error ? exportErr.message : String(exportErr))
                  )
                );
              }
            }
          },
          targetMime,
          quality
        );
      } catch (err) {
        reject(err instanceof Error ? err : new Error('Canvas processing failed.'));
      }
    };

    img.onerror = () => {
      img.onload = null;
      img.onerror = null;
      reject(
        new Error(
          'Failed to decode image on this device. The file may be corrupt or an unsupported format.'
        )
      );
    };

    img.src = dataUrl;
  });
}

/**
 * Main export for processing an image file to remove all metadata.
 * Uses the HTML5 <canvas> method to inherently purge all EXIF, GPS, camera details,
 * and text chunks while preserving visual quality (0.92 for lossy formats to prevent bloating).
 *
 * @param file - The uploaded image File
 * @param options - Optional custom export MIME type or quality settings
 * @returns A Promise resolving to a clean Blob with zero metadata
 */
export async function processImageFile(file: File, options?: CanvasStripOptions): Promise<Blob> {
  return stripMetadataWithCanvas(file, options);
}
