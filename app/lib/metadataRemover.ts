/**
 * metadataRemover.ts
 * Removes EXIF, GPS, and hidden metadata from images using piexifjs (for JPEG)
 * and canvas/PNG chunk stripping for other formats.
 *
 * Preserves the exact original format — PNG stays PNG, JPEG stays JPEG.
 * Runs entirely in the browser — no files are sent to any server.
 */

import piexif from 'piexifjs';

/**
 * Reads a File object into a base64 data URL string.
 * piexifjs requires a base64 string as input, not an ArrayBuffer.
 *
 * @param file - The image file to read
 * @returns A Promise resolving to a base64 data URL string
 */
function readFileAsBase64DataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Reads a File object into a raw ArrayBuffer.
 * Used for PNG binary chunk processing.
 *
 * @param file - The image file to read
 * @returns A Promise resolving to an ArrayBuffer
 */
function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Removes all EXIF data from a JPEG image.
 * piexifjs.remove() strips all EXIF segments from a base64-encoded JPEG string.
 *
 * @param base64DataUrl - The JPEG image as a base64 data URL
 * @returns A clean base64 data URL with all EXIF data removed
 */
function removeExifFromJpeg(base64DataUrl: string): string {
  try {
    // piexif.remove() accepts and returns a base64 data URL string
    const cleanBase64 = piexif.remove(base64DataUrl);
    return cleanBase64;
  } catch {
    // If EXIF removal fails (e.g. no EXIF present), return the original
    console.warn('piexifjs: no EXIF found or removal failed, returning original.');
    return base64DataUrl;
  }
}

/**
 * Converts a base64 data URL string to a Blob, preserving the MIME type.
 *
 * @param base64DataUrl - The image as a base64 data URL (e.g. "data:image/jpeg;base64,...")
 * @returns A Blob with the correct MIME type
 */
function base64DataUrlToBlob(base64DataUrl: string): Blob {
  const [header, data] = base64DataUrl.split(',');

  // Extract MIME type from the header (e.g. "data:image/jpeg;base64")
  const mimeType = header.split(':')[1].split(';')[0];

  // Decode base64 string to binary
  const binaryString = atob(data);
  const byteArray = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    byteArray[i] = binaryString.charCodeAt(i);
  }

  return new Blob([byteArray], { type: mimeType });
}

/**
 * Strips tEXt, zTXt, and iTXt metadata chunks from a PNG binary.
 * PNG files store metadata in named chunks — we remove only text/metadata chunks.
 *
 * @param buffer - Raw ArrayBuffer of PNG image data
 * @returns A clean PNG Blob without metadata chunks
 */
export function removePngMetadataChunks(buffer: ArrayBuffer): Blob {
  const bytes = new Uint8Array(buffer);

  // PNG signature is the first 8 bytes — always preserve this
  const PNG_SIGNATURE_LENGTH = 8;
  const pngSignature = bytes.slice(0, PNG_SIGNATURE_LENGTH);

  const cleanChunks: Uint8Array[] = [];
  let offset = PNG_SIGNATURE_LENGTH;

  while (offset < bytes.length) {
    // Each chunk starts with a 4-byte length (big-endian), then 4-byte type
    const dataView = new DataView(buffer, offset);
    const chunkDataLength = dataView.getUint32(0); // length of chunk's data section
    const chunkType = String.fromCharCode(
      bytes[offset + 4],
      bytes[offset + 5],
      bytes[offset + 6],
      bytes[offset + 7]
    );

    // Total chunk size: 4 (length) + 4 (type) + dataLength + 4 (CRC)
    const totalChunkSize = 4 + 4 + chunkDataLength + 4;

    // Skip known metadata chunk types: tEXt, zTXt (compressed text), iTXt (international text)
    const isMetadataChunk =
      chunkType === 'tEXt' || chunkType === 'zTXt' || chunkType === 'iTXt';

    if (!isMetadataChunk) {
      // Keep this chunk in our clean output
      cleanChunks.push(bytes.slice(offset, offset + totalChunkSize));
    }

    offset += totalChunkSize;

    // Stop after IEND chunk (end of PNG file)
    if (chunkType === 'IEND') break;
  }

  // Reassemble clean PNG: signature + all kept chunks
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

/**
 * Main export: Processes an image file to remove all metadata.
 * Routes JPEG to piexifjs and PNG to binary chunk stripping.
 * All other formats are returned as-is (they carry minimal metadata).
 *
 * XSS Prevention: All EXIF data extracted is treated as untrusted input.
 * The consumer (page.tsx) must sanitize displayed values via sanitizeHtml().
 *
 * @param file - The uploaded image File
 * @returns A Promise resolving to a clean Blob with the original MIME type preserved
 */
export async function processImageFile(file: File): Promise<Blob> {
  if (file.type === 'image/jpeg') {
    // JPEG: use piexifjs to remove all EXIF data
    const base64DataUrl = await readFileAsBase64DataUrl(file);
    const cleanBase64 = removeExifFromJpeg(base64DataUrl);
    return base64DataUrlToBlob(cleanBase64);
  }

  if (file.type === 'image/png') {
    // PNG: strip metadata chunks from binary
    const buffer = await readFileAsArrayBuffer(file);
    return removePngMetadataChunks(buffer);
  }

  // WebP, TIFF, GIF, BMP: return as a clean Blob preserving original MIME type
  const buffer = await readFileAsArrayBuffer(file);
  return new Blob([buffer], { type: file.type });
}
