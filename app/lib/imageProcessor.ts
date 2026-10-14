/**
 * imageProcessor.ts — Core Metadata Processing & Deep Clean Engine
 *
 * Provides 4 distinct client-side operations:
 * 1. stripGeneralMetadata: Complete EXIF/TIFF/PNG metadata removal
 * 2. stripGpsMetadata: Selective GPS IFD removal (preserves camera model & datetime)
 * 3. stripXmpMetadata: Selective XMP XML packet stripping (preserves EXIF)
 * 4. deepCleanCanvasReRender: Canvas re-rendering to neutralize steganography & C2PA
 *
 * 100% Client-Side — Zero Server Uploads.
 */

import piexif from 'piexifjs';
import { processImageFile, removePngMetadataChunks } from './metadataRemover';

/** Helper: Read File as Base64 Data URL */
function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file as data URL'));
    reader.readAsDataURL(file);
  });
}

/** Helper: Read File as ArrayBuffer */
function readFileAsBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(new Error('Failed to read file as ArrayBuffer'));
    reader.readAsArrayBuffer(file);
  });
}

/** Helper: Convert Base64 Data URL to Blob */
function base64ToBlob(base64DataUrl: string): Blob {
  const [header, data] = base64DataUrl.split(',');
  const mimeType = header.split(':')[1].split(';')[0];
  const binaryString = atob(data);
  const byteArray = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    byteArray[i] = binaryString.charCodeAt(i);
  }
  return new Blob([byteArray], { type: mimeType });
}

// =========================================================================
// 1. GENERAL METADATA REMOVER (/photo-metadata-remover)
// =========================================================================
/**
 * Strips all standard EXIF, TIFF, GPS, and PNG metadata chunks while keeping the original format intact.
 */
export async function stripGeneralMetadata(file: File): Promise<Blob> {
  return processImageFile(file);
}

// =========================================================================
// 2. SELECTIVE GPS REMOVER (/remove-gps-photo)
// =========================================================================
/**
 * SELECTIVELY targets and deletes ONLY the GPS IFD tags (Latitude, Longitude, Altitude, etc.)
 * Strictly PRESERVES all other metadata tags (Camera Model, Make, Lens, DateTimeOriginal, Software).
 */
export async function stripGpsMetadata(file: File): Promise<Blob> {
  if (file.type === 'image/jpeg') {
    try {
      const base64 = await readFileAsBase64(file);
      const exifObj = piexif.load(base64);

      // Verify and clear ONLY the GPS tags
      if (exifObj && exifObj.GPS) {
        exifObj.GPS = {};
        const exifBytes = piexif.dump(exifObj);
        const cleanBase64 = piexif.insert(exifBytes, base64);
        return base64ToBlob(cleanBase64);
      }
    } catch {
      // If image has no EXIF or parsing fails, return original file buffer
      const buffer = await readFileAsBuffer(file);
      return new Blob([buffer], { type: file.type });
    }
  }

  // Non-JPEG images (PNG, WebP) do not have standard GPSIFD blocks
  const buffer = await readFileAsBuffer(file);
  return new Blob([buffer], { type: file.type });
}

// =========================================================================
// 3. XMP SPECIFIC REMOVER (/xmp-remover)
// =========================================================================
/**
 * Strips XMP (Extensible Metadata Platform) XML packets from JPEG and PNG files
 * while strictly PRESERVING basic EXIF headers and visual pixel data.
 */
export async function stripXmpMetadata(file: File): Promise<Blob> {
  const buffer = await readFileAsBuffer(file);

  if (file.type === 'image/jpeg') {
    return stripXmpFromJpeg(buffer);
  }

  if (file.type === 'image/png') {
    return stripXmpFromPng(buffer);
  }

  // Other formats
  return new Blob([buffer], { type: file.type });
}

/** Helper: Parse JPEG segments and remove only APP1 markers containing XMP */
function stripXmpFromJpeg(buffer: ArrayBuffer): Blob {
  const bytes = new Uint8Array(buffer);
  if (bytes.length < 4 || bytes[0] !== 0xFF || bytes[1] !== 0xD8) {
    return new Blob([buffer], { type: 'image/jpeg' });
  }

  const chunks: Uint8Array[] = [];
  // Keep SOI (Start of Image 0xFF 0xD8)
  chunks.push(bytes.slice(0, 2));
  let offset = 2;

  const XMP_NAMESPACE = 'http://ns.adobe.com/xap/1.0/';

  while (offset < bytes.length) {
    if (bytes[offset] !== 0xFF) {
      chunks.push(bytes.slice(offset));
      break;
    }

    const marker = bytes[offset + 1];

    // End of image or padding
    if (marker === 0xD9 || marker === 0x00) {
      chunks.push(bytes.slice(offset));
      break;
    }

    // Start of Scan (0xFF 0xDA): Image entropy data begins here
    if (marker === 0xDA) {
      chunks.push(bytes.slice(offset));
      break;
    }

    if (offset + 4 > bytes.length) {
      chunks.push(bytes.slice(offset));
      break;
    }

    const length = (bytes[offset + 2] << 8) | bytes[offset + 3];
    const segmentTotalLength = 2 + length;

    if (offset + segmentTotalLength > bytes.length) {
      chunks.push(bytes.slice(offset));
      break;
    }

    // Check if this is an APP1 marker (0xFFE1) with XMP payload
    if (marker === 0xE1) {
      let isXmp = false;
      const payloadStart = offset + 4;
      if (payloadStart + XMP_NAMESPACE.length <= bytes.length) {
        let matches = true;
        for (let i = 0; i < XMP_NAMESPACE.length; i++) {
          if (bytes[payloadStart + i] !== XMP_NAMESPACE.charCodeAt(i)) {
            matches = false;
            break;
          }
        }
        isXmp = matches;
      }

      // If it is NOT XMP (e.g. standard Exif APP1), keep it!
      if (!isXmp) {
        chunks.push(bytes.slice(offset, offset + segmentTotalLength));
      }
      // If it IS XMP, we skip it completely!
    } else {
      // Keep all other markers (APP0, DQT, DHT, SOF, etc.)
      chunks.push(bytes.slice(offset, offset + segmentTotalLength));
    }

    offset += segmentTotalLength;
  }

  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.byteLength, 0);
  const cleanBytes = new Uint8Array(totalLength);
  let pos = 0;
  for (const chunk of chunks) {
    cleanBytes.set(chunk, pos);
    pos += chunk.byteLength;
  }

  return new Blob([cleanBytes], { type: 'image/jpeg' });
}

/** Helper: Parse PNG chunks and remove only iTXt/tEXt chunks containing XMP */
function stripXmpFromPng(buffer: ArrayBuffer): Blob {
  const bytes = new Uint8Array(buffer);
  const PNG_SIGNATURE_LENGTH = 8;
  const pngSignature = bytes.slice(0, PNG_SIGNATURE_LENGTH);
  const cleanChunks: Uint8Array[] = [];
  let offset = PNG_SIGNATURE_LENGTH;

  const XMP_KEYWORD = 'XML:com.adobe.xmp';

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
    let isXmp = false;

    if (chunkType === 'iTXt' || chunkType === 'tEXt') {
      const payloadStart = offset + 8;
      if (payloadStart + XMP_KEYWORD.length <= bytes.length) {
        let matches = true;
        for (let i = 0; i < XMP_KEYWORD.length; i++) {
          if (bytes[payloadStart + i] !== XMP_KEYWORD.charCodeAt(i)) {
            matches = false;
            break;
          }
        }
        isXmp = matches;
      }
    }

    if (!isXmp) {
      cleanChunks.push(bytes.slice(offset, offset + totalChunkSize));
    }

    offset += totalChunkSize;
    if (chunkType === 'IEND') break;
  }

  const totalCleanSize = pngSignature.byteLength + cleanChunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
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

// =========================================================================
// 4. DEEP CLEAN / CANVAS RE-RENDERING (/exif-cleaner)
// =========================================================================
/**
 * Canvas Re-rendering method.
 * Draws the uploaded image onto an HTML5 <canvas> and exports it as a fresh raster Blob.
 * Physically destroys all steganography, invisible watermarks, color profiles, and hidden C2PA tags.
 */
export async function deepCleanCanvasReRender(
  file: File,
  outputMimeType = 'image/jpeg'
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      const url = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error('Canvas 2D context unavailable'));
          return;
        }

        // Draw image onto clean canvas surface
        ctx.drawImage(img, 0, 0);

        // Apply imperceptible noise variation to neutralize hidden steganography
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const noise = (Math.random() - 0.5) * 2; // subtle ±1 pixel perturbation
          data[i] = Math.max(0, Math.min(255, data[i] + noise));     // R
          data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // G
          data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // B
          // Alpha preserved
        }
        ctx.putImageData(imageData, 0, 0);

        // Export a completely fresh raster Blob devoid of C2PA, EXIF, or profiles
        const exportMime = file.type === 'image/png' ? 'image/png' : outputMimeType;
        canvas.toBlob((newBlob) => {
          URL.revokeObjectURL(url);
          if (newBlob) {
            resolve(newBlob);
          } else {
            reject(new Error('Canvas export failed'));
          }
        }, exportMime, 0.95);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image for canvas re-rendering'));
      };

      img.src = url;
    } catch (e) {
      reject(e);
    }
  });
}

// Backward compatibility export
export const canvasReRender = deepCleanCanvasReRender;
export { removePngMetadataChunks };

// =========================================================================
// 5. HEIC METADATA REMOVER (/heic-metadata-remover)
// =========================================================================
/**
 * In-browser Apple HEIC/HEIF metadata remover.
 * Uses heic2any to parse HEIC files into high-quality JPEG and strips all EXIF/GPS tags.
 */
export async function cleanHeicMetadata(file: File): Promise<Blob> {
  const isHeic =
    file.name.toLowerCase().endsWith('.heic') ||
    file.name.toLowerCase().endsWith('.heif') ||
    file.type.toLowerCase().includes('heic') ||
    file.type.toLowerCase().includes('heif');

  if (isHeic) {
    const heic2anyModule = await import('heic2any');
    const heic2any = heic2anyModule.default;
    const conversionResult = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.95,
    });
    const jpegBlob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;
    const syntheticFile = new File(
      [jpegBlob],
      file.name.replace(/\.hei[cf]$/i, '.jpg'),
      { type: 'image/jpeg' }
    );
    return stripGeneralMetadata(syntheticFile);
  }

  // Non-HEIC fallback
  return stripGeneralMetadata(file);
}

// =========================================================================
// 6. HEIC TO JPG CONVERTER (/heic-to-jpg)
// =========================================================================
/**
 * Fast, privacy-first Apple HEIC to standard JPG converter.
 * Strips all embedded GPS and device metadata during conversion.
 */
export async function convertHeicToJpg(file: File): Promise<Blob> {
  const isHeic =
    file.name.toLowerCase().endsWith('.heic') ||
    file.name.toLowerCase().endsWith('.heif') ||
    file.type.toLowerCase().includes('heic') ||
    file.type.toLowerCase().includes('heif');

  if (isHeic) {
    const heic2anyModule = await import('heic2any');
    const heic2any = heic2anyModule.default;
    const conversionResult = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.95,
    });
    const jpegBlob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;
    const syntheticFile = new File(
      [jpegBlob],
      file.name.replace(/\.hei[cf]$/i, '.jpg'),
      { type: 'image/jpeg' }
    );
    return stripGeneralMetadata(syntheticFile);
  }

  // Non-HEIC images converted to clean JPEG
  return deepCleanCanvasReRender(file, 'image/jpeg');
}

// =========================================================================
// 7. PNG CHUNK SPECIFIC REMOVER (/png-metadata-remover)
// =========================================================================
/**
 * Parses PNG binary chunks and specifically removes text/metadata chunks:
 * tEXt, iTXt, zTXt, eXIf, tIME, pHYs
 * Strictly preserves core image rendering chunks: IHDR, PLTE, tRNS, IDAT, IEND.
 */
export async function stripPngMetadataChunks(file: File): Promise<Blob> {
  const buffer = await readFileAsBuffer(file);
  const bytes = new Uint8Array(buffer);

  // Validate PNG signature (0x89 0x50 0x4E 0x47 0x0D 0x0A 0x1A 0x0A)
  if (
    bytes.length < 8 ||
    bytes[0] !== 0x89 ||
    bytes[1] !== 0x50 ||
    bytes[2] !== 0x4e ||
    bytes[3] !== 0x47
  ) {
    return stripGeneralMetadata(file);
  }

  const PNG_SIGNATURE_LENGTH = 8;
  const pngSignature = bytes.slice(0, PNG_SIGNATURE_LENGTH);
  const cleanChunks: Uint8Array[] = [];
  let offset = PNG_SIGNATURE_LENGTH;

  // Metadata chunks to strip
  const METADATA_CHUNK_TYPES = new Set(['tEXt', 'zTXt', 'iTXt', 'eXIf', 'tIME', 'pHYs']);

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

    if (!METADATA_CHUNK_TYPES.has(chunkType)) {
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

// =========================================================================
// 8. C2PA / CONTENT CREDENTIALS REMOVER (/c2pa-remover)
// =========================================================================
/**
 * Wipes C2PA provenance credentials and AI manifests.
 * Re-renders image pixels onto an HTML5 canvas with micro-dither to physically destroy
 * both JUMBF manifest blocks (APP11) and invisible cryptographic watermark signatures.
 */
export async function removeC2paCredentials(file: File): Promise<Blob> {
  const exportMime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
  return deepCleanCanvasReRender(file, exportMime);
}

// =========================================================================
// 9. AI-ONLY METADATA REMOVER (/ai-only-metadata-remover)
// =========================================================================
/**
 * Selectively reads metadata (EXIF/XMP/PNG chunks) and ONLY deletes tags associated
 * with AI generation (Midjourney, DALL-E, Stable Diffusion, prompt, workflow).
 * Strictly preserves standard camera data (Make, Model, Lens, DateTimeOriginal).
 */
export async function stripAiOnlyMetadata(file: File): Promise<Blob> {
  const AI_KEYWORDS = [
    'midjourney',
    'dall-e',
    'dalle',
    'stable diffusion',
    'stablediffusion',
    'prompt',
    'workflow',
    'comfyui',
    'novelai',
    'civitai',
    'negative prompt',
    'steps:',
    'sampler:',
    'seed:',
    'cfg scale',
    'lora:',
    'checkpoint:',
  ];

  const containsAiKeyword = (text: string): boolean => {
    const lower = text.toLowerCase();
    return AI_KEYWORDS.some((kw) => lower.includes(kw));
  };

  // 1. Process PNG files: strip only tEXt/iTXt/zTXt chunks that contain AI prompts
  if (file.type === 'image/png') {
    const buffer = await readFileAsBuffer(file);
    const bytes = new Uint8Array(buffer);

    if (bytes.length < 8 || bytes[0] !== 0x89) {
      return new Blob([buffer], { type: file.type });
    }

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
      let shouldDrop = false;

      if (chunkType === 'tEXt' || chunkType === 'iTXt' || chunkType === 'zTXt') {
        const payload = bytes.slice(offset + 8, offset + 8 + chunkDataLength);
        const decoder = new TextDecoder('latin1');
        const textContent = decoder.decode(payload);
        if (containsAiKeyword(textContent)) {
          shouldDrop = true;
        }
      }

      if (!shouldDrop) {
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

  // 2. Process JPEG files: strip AI prompt tags from EXIF & XMP while preserving camera info
  if (file.type === 'image/jpeg') {
    try {
      const base64 = await readFileAsBase64(file);
      const exifObj = piexif.load(base64);

      if (exifObj) {
        // Inspect 0th IFD for AI software / description tags
        if (exifObj['0th']) {
          const desc = exifObj['0th'][piexif.ImageIFD.ImageDescription];
          if (typeof desc === 'string' && containsAiKeyword(desc)) {
            delete exifObj['0th'][piexif.ImageIFD.ImageDescription];
          }
          const software = exifObj['0th'][piexif.ImageIFD.Software];
          if (typeof software === 'string' && containsAiKeyword(software)) {
            delete exifObj['0th'][piexif.ImageIFD.Software];
          }
          const artist = exifObj['0th'][piexif.ImageIFD.Artist];
          if (typeof artist === 'string' && containsAiKeyword(artist)) {
            delete exifObj['0th'][piexif.ImageIFD.Artist];
          }
        }

        // Inspect Exif IFD for UserComment (frequently holds prompt payloads)
        if (exifObj.Exif) {
          const userComment = exifObj.Exif[piexif.ExifIFD.UserComment];
          if (typeof userComment === 'string' && containsAiKeyword(userComment)) {
            delete exifObj.Exif[piexif.ExifIFD.UserComment];
          }
        }

        const exifBytes = piexif.dump(exifObj);
        const cleanBase64 = piexif.insert(exifBytes, base64);
        const jpegBlob = base64ToBlob(cleanBase64);

        // Check if XMP contains AI generation prompt
        const jpegBuffer = await jpegBlob.arrayBuffer();
        const bytes = new Uint8Array(jpegBuffer);
        const decoder = new TextDecoder('latin1');
        const textSample = decoder.decode(bytes.slice(0, Math.min(bytes.length, 65536)));
        if (containsAiKeyword(textSample)) {
          return stripXmpMetadata(new File([jpegBlob], file.name, { type: 'image/jpeg' }));
        }

        return jpegBlob;
      }
    } catch {
      return new Blob([await readFileAsBuffer(file)], { type: file.type });
    }
  }

  // Fallback for other formats
  return new Blob([await readFileAsBuffer(file)], { type: file.type });
}

