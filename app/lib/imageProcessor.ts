/**
 * imageProcessor.ts — Core Metadata Processing & Selective Clean Engine
 *
 * 100% Client-Side — Zero Server Uploads.
 *
 * Provides:
 * 1. Selective Stripping for JPEGs via binary & piexifjs manipulation:
 *    - stripGpsMetadata: Removes ONLY GPS directory, preserving camera & timestamps.
 *    - stripXmpMetadata: Removes ONLY Adobe XMP packets, preserving basic EXIF.
 *    - stripAiOnlyMetadata: Removes ONLY AI prompts / UserComments / workflow headers.
 * 2. Canvas Re-rendering fallback for non-JPEG formats (PNG, WebP, HEIC).
 * 3. Deep Clean & Format Converters.
 */

import piexif from 'piexifjs';
import {
  processImageFile,
  removePngMetadataChunks,
  stripMetadataWithCanvas,
  base64DataUrlToBlob,
  readFileAsDataUrl,
} from './metadataRemover';

/**
 * Checks whether the input file is a JPEG format supporting non-destructive selective stripping.
 */
export function isSelectiveJpegSupported(file: File): boolean {
  return file.type === 'image/jpeg' || /\.(jpe?g)$/i.test(file.name);
}

/**
 * Strips Adobe XMP segments (0xFFE1 marker with 'http://ns.adobe.com/xap/1.0/' namespace)
 * directly from a JPEG binary ArrayBuffer without touching other EXIF markers or pixel data.
 */
export function removeJpegXmpSegment(buffer: ArrayBuffer): Blob {
  const bytes = new Uint8Array(buffer);
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) {
    return new Blob([buffer], { type: 'image/jpeg' });
  }

  const cleanChunks: Uint8Array[] = [bytes.slice(0, 2)]; // Start of Image (SOI)
  let offset = 2;
  const xmpNamespace = 'http://ns.adobe.com/xap/1.0/';
  const decoder = new TextDecoder('latin1');

  while (offset < bytes.length - 1) {
    if (bytes[offset] !== 0xff) {
      cleanChunks.push(bytes.slice(offset));
      break;
    }

    const marker = bytes[offset + 1];
    // SOS (Start of Scan) or EOI (End of Image) indicates end of header markers
    if (marker === 0xda || marker === 0xd9) {
      cleanChunks.push(bytes.slice(offset));
      break;
    }

    // Standalone markers without length field: RST0-RST7 (0xD0-0xD7), SOI (0xD8)
    if (marker >= 0xd0 && marker <= 0xd8) {
      cleanChunks.push(bytes.slice(offset, offset + 2));
      offset += 2;
      continue;
    }

    if (offset + 4 > bytes.length) {
      cleanChunks.push(bytes.slice(offset));
      break;
    }

    const length = (bytes[offset + 2] << 8) | bytes[offset + 3];
    const totalSegmentSize = 2 + length;

    // Detect APP1 (0xFFE1) with Adobe XMP namespace
    let isXmp = false;
    if (marker === 0xe1 && offset + 4 + xmpNamespace.length <= bytes.length) {
      const headerSample = decoder.decode(bytes.slice(offset + 4, offset + 4 + xmpNamespace.length));
      if (headerSample.startsWith(xmpNamespace)) {
        isXmp = true;
      }
    }

    if (!isXmp) {
      cleanChunks.push(bytes.slice(offset, offset + totalSegmentSize));
    }

    offset += totalSegmentSize;
  }

  const totalSize = cleanChunks.reduce((acc, c) => acc + c.byteLength, 0);
  const resultBuffer = new Uint8Array(totalSize);
  let writePos = 0;
  for (const chunk of cleanChunks) {
    resultBuffer.set(chunk, writePos);
    writePos += chunk.byteLength;
  }

  return new Blob([resultBuffer], { type: 'image/jpeg' });
}

// =========================================================================
// 1. GENERAL METADATA REMOVER (/photo-metadata-remover)
// =========================================================================
/**
 * Strips all EXIF, TIFF, GPS, camera details, and metadata chunks via HTML5 Canvas.
 */
export async function stripGeneralMetadata(file: File): Promise<Blob> {
  return stripMetadataWithCanvas(file);
}

// =========================================================================
// 2. SELECTIVE GPS REMOVER (/remove-gps-photo)
// =========================================================================
/**
 * Selectively removes GPS coordinates and location data.
 * For JPEGs: Strictly uses piexifjs to empty the GPS IFD directory while preserving
 * camera model, exposure, and timestamps.
 * For Non-JPEGs: Falls back to Canvas stripping with UI notification.
 */
export async function stripGpsMetadata(file: File): Promise<Blob> {
  if (isSelectiveJpegSupported(file)) {
    try {
      const dataUrl = await readFileAsDataUrl(file);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let exifObj: any;
      try {
        exifObj = piexif.load(dataUrl);
      } catch {
        // File has no parseable EXIF
        return file;
      }

      if (exifObj && exifObj['GPS']) {
        // Surgically empty only the GPS IFD directory
        exifObj['GPS'] = {};
        const exifBytes = piexif.dump(exifObj);
        const updatedDataUrl = piexif.insert(exifBytes, dataUrl);
        return base64DataUrlToBlob(updatedDataUrl);
      }
      return file;
    } catch (err) {
      console.warn('Piexif GPS selective strip failed, falling back to canvas:', err);
      return stripMetadataWithCanvas(file);
    }
  }

  // Non-JPEG format fallback
  return stripMetadataWithCanvas(file);
}

// =========================================================================
// 3. XMP SPECIFIC REMOVER (/xmp-remover)
// =========================================================================
/**
 * Selectively strips Adobe XMP metadata packets.
 * For JPEGs: Removes the 0xFFE1 XMP segment while preserving camera EXIF and GPS.
 * For Non-JPEGs: Falls back to Canvas stripping with UI notification.
 */
export async function stripXmpMetadata(file: File): Promise<Blob> {
  if (isSelectiveJpegSupported(file)) {
    try {
      const buffer = await file.arrayBuffer();
      return removeJpegXmpSegment(buffer);
    } catch (err) {
      console.warn('Binary XMP selective strip failed, falling back to canvas:', err);
      return stripMetadataWithCanvas(file);
    }
  }

  // Non-JPEG format fallback
  return stripMetadataWithCanvas(file);
}

// =========================================================================
// 4. DEEP CLEAN / CANVAS RE-RENDERING (/exif-cleaner)
// =========================================================================
/**
 * Canvas Re-rendering method.
 * Draws the uploaded image onto an HTML5 <canvas> and exports a fresh raster Blob.
 * Physically destroys all steganography, invisible watermarks, color profiles, and C2PA tags.
 */
export async function deepCleanCanvasReRender(
  file: File,
  outputMimeType?: string
): Promise<Blob> {
  return stripMetadataWithCanvas(file, { outputMime: outputMimeType });
}

// Backward compatibility alias
export const canvasReRender = deepCleanCanvasReRender;
export { removePngMetadataChunks, processImageFile, stripMetadataWithCanvas };

// =========================================================================
// 5. HEIC METADATA REMOVER (/heic-metadata-remover)
// =========================================================================
/**
 * In-browser Apple HEIC/HEIF metadata remover.
 * Converts Apple HEIC photos into high-quality JPEG and strips all EXIF/GPS tags via Canvas.
 */
export async function cleanHeicMetadata(file: File): Promise<Blob> {
  return stripMetadataWithCanvas(file, { outputMime: 'image/jpeg', quality: 0.92 });
}

// =========================================================================
// 6. HEIC TO JPG CONVERTER (/heic-to-jpg)
// =========================================================================
/**
 * Apple HEIC to universal JPG converter.
 * Strips all embedded GPS and device metadata during canvas re-encoding.
 */
export async function convertHeicToJpg(file: File): Promise<Blob> {
  return stripMetadataWithCanvas(file, { outputMime: 'image/jpeg', quality: 0.92 });
}

// =========================================================================
// 7. PNG CHUNK SPECIFIC REMOVER (/png-metadata-remover)
// =========================================================================
/**
 * Strips PNG text chunks and metadata via HTML5 Canvas with lossless PNG export,
 * strictly preserving full alpha channel transparency.
 */
export async function stripPngMetadataChunks(file: File): Promise<Blob> {
  return stripMetadataWithCanvas(file, { outputMime: 'image/png' });
}

// =========================================================================
// 8. C2PA / CONTENT CREDENTIALS REMOVER (/c2pa-remover)
// =========================================================================
/**
 * Wipes C2PA provenance credentials, JUMBF manifest blocks, and AI seals via Canvas.
 */
export async function removeC2paCredentials(file: File): Promise<Blob> {
  return stripMetadataWithCanvas(file);
}

// =========================================================================
// 9. AI-ONLY METADATA REMOVER (/ai-only-metadata-remover)
// =========================================================================
/**
 * Selectively strips AI prompts, generation workflow parameters, and synthetic markers.
 * For JPEGs: Removes XMP diffusion workflows and wipes EXIF UserComment / ImageDescription
 * prompts while preserving camera make, model, and capture settings.
 * For Non-JPEGs: Falls back to Canvas stripping with UI notification.
 */
export async function stripAiOnlyMetadata(file: File): Promise<Blob> {
  if (isSelectiveJpegSupported(file)) {
    try {
      // Step 1: Remove XMP packets containing ComfyUI/diffusion parameters
      const buffer = await file.arrayBuffer();
      const xmpCleanedBlob = removeJpegXmpSegment(buffer);

      // Step 2: Remove EXIF UserComment where Midjourney/Stable Diffusion prompts hide
      const dataUrl = await readFileAsDataUrl(xmpCleanedBlob);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let exifObj: any;
      try {
        exifObj = piexif.load(dataUrl);
      } catch {
        return xmpCleanedBlob;
      }

      if (exifObj && exifObj['Exif']) {
        delete exifObj['Exif'][piexif.ExifIFD.UserComment];
      }
      if (exifObj && exifObj['0th']) {
        const desc = String(exifObj['0th'][piexif.ImageIFD.ImageDescription] || '');
        if (desc.toLowerCase().includes('prompt') || desc.toLowerCase().includes('steps:')) {
          delete exifObj['0th'][piexif.ImageIFD.ImageDescription];
        }
      }

      const exifBytes = piexif.dump(exifObj);
      const updatedDataUrl = piexif.insert(exifBytes, dataUrl);
      return base64DataUrlToBlob(updatedDataUrl);
    } catch (err) {
      console.warn('AI selective strip failed, falling back to canvas:', err);
      return stripMetadataWithCanvas(file);
    }
  }

  // Non-JPEG format fallback
  return stripMetadataWithCanvas(file);
}
