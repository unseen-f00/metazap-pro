/**
 * exifEditor.ts
 * 100% Client-Side EXIF Metadata Editor & Injector.
 *
 * Uses:
 * 1. exifr: To accurately read existing Author, Copyright, Date, Software, and GPS coordinates.
 * 2. piexifjs: To rebuild the binary EXIF segment and inject it back into original JPEG files
 *    WITHOUT re-compressing image pixels, preserving 100% maximum visual quality.
 *
 * Provides graceful fallback to Canvas stripping for PNG and unsupported formats.
 */

import piexif from 'piexifjs';
import exifr from 'exifr';
import { stripMetadataWithCanvas, formatFileSize } from '@/app/lib/metadataRemover';

export interface ExifEditorFields {
  author: string;
  copyright: string;
  dateOriginal: string;
  software: string;
  latitude: string;
  longitude: string;
}

export interface ExifEditorResult {
  blob: Blob;
  fileName: string;
  originalSize: number;
  editedSize: number;
  sizeDiffBytes: number;
  sizeDiffFormatted: string;
  tagsCount: number;
  isJpeg: boolean;
}

/**
 * Format a Date object into standard EXIF date format: "YYYY:MM:DD HH:MM:SS"
 */
export function formatExifDate(date: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}:${month}:${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Convert decimal degrees (e.g. 37.7749) to EXIF DMS rational tuples
 */
export function decimalToDms(
  coord: number,
  isLat: boolean
): { ref: string; dms: [[number, number], [number, number], [number, number]] } {
  const ref = isLat ? (coord >= 0 ? 'N' : 'S') : coord >= 0 ? 'E' : 'W';
  const abs = Math.abs(coord);
  const deg = Math.floor(abs);
  const minFloat = (abs - deg) * 60;
  const min = Math.floor(minFloat);
  const sec = Math.round((minFloat - min) * 60 * 100);
  return {
    ref,
    dms: [
      [deg, 1],
      [min, 1],
      [sec, 100],
    ],
  };
}

/**
 * Helper: Read file as Data URL
 */
function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file as Data URL'));
    reader.readAsDataURL(file);
  });
}

/**
 * Convert base64 Data URL to Blob
 */
function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(',');
  const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const binaryStr = atob(parts[1]);
  const len = binaryStr.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
}

/**
 * Reads existing EXIF fields from an uploaded image file using exifr.
 * Extracts Author, Copyright, Date Taken, Software, and GPS coordinates.
 */
export async function readExifForEditor(
  file: File
): Promise<{ fields: ExifEditorFields; isJpeg: boolean; totalExistingTags: number }> {
  const isJpeg =
    file.type === 'image/jpeg' ||
    /\.(jpe?g)$/i.test(file.name);

  const defaults: ExifEditorFields = {
    author: '',
    copyright: '',
    dateOriginal: formatExifDate(),
    software: 'MetaZap Pro Metadata Studio',
    latitude: '',
    longitude: '',
  };

  let totalExistingTags = 0;

  try {
    const parsed = (await exifr.parse(file, {
      tiff: true,
      xmp: true,
      gps: true,
    })) as Record<string, unknown> | undefined;

    if (parsed && typeof parsed === 'object') {
      totalExistingTags = Object.keys(parsed).length;

      const author = parsed.Artist || parsed.XPAuthor || parsed.Creator || '';
      const copyright = parsed.Copyright || '';
      const software = parsed.Software || defaults.software;
      const dateOriginal = parsed.DateTimeOriginal
        ? String(parsed.DateTimeOriginal)
        : defaults.dateOriginal;

      let lat = '';
      let lon = '';
      try {
        const gps = await exifr.gps(file);
        if (gps && typeof gps.latitude === 'number' && typeof gps.longitude === 'number') {
          lat = gps.latitude.toFixed(6);
          lon = gps.longitude.toFixed(6);
        }
      } catch {
        // No GPS
      }

      return {
        fields: {
          author: String(author),
          copyright: String(copyright),
          dateOriginal: String(dateOriginal),
          software: String(software),
          latitude: lat,
          longitude: lon,
        },
        isJpeg,
        totalExistingTags,
      };
    }
  } catch {
    // Return standard defaults if no EXIF found
  }

  return { fields: defaults, isJpeg, totalExistingTags };
}

/**
 * Injects or updates EXIF tags (Author, Copyright, DateTimeOriginal, Software, GPS)
 * into a JPEG file completely client-side via piexifjs without re-compressing pixels.
 */
export async function injectExifData(
  file: File,
  fields: ExifEditorFields
): Promise<ExifEditorResult> {
  const isJpeg =
    file.type === 'image/jpeg' ||
    /\.(jpe?g)$/i.test(file.name);

  if (!isJpeg) {
    throw new Error(
      'DIRECT_JPEG_ONLY: EXIF header injection without pixel recompression is strictly supported for JPEG images.'
    );
  }

  const targetDataUrl = await readFileAsDataUrl(file);

  // Initialize clean or loaded EXIF dictionary
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let exifObj: any = {
    '0th': {},
    'Exif': {},
    'GPS': {},
    'Interop': {},
    '1st': {},
    'thumbnail': null,
  };

  try {
    const loaded = piexif.load(targetDataUrl);
    if (loaded && loaded['0th']) {
      exifObj = loaded;
    }
  } catch {
    // If no existing EXIF segment, start fresh
  }

  if (!exifObj['0th']) exifObj['0th'] = {};
  if (!exifObj['Exif']) exifObj['Exif'] = {};
  if (!exifObj['GPS']) exifObj['GPS'] = {};

  let tagsCount = 0;

  // 1. Author / Artist (0th IFD)
  if (fields.author.trim()) {
    exifObj['0th'][piexif.ImageIFD.Artist] = fields.author.trim();
    tagsCount++;
  } else {
    delete exifObj['0th'][piexif.ImageIFD.Artist];
  }

  // 2. Copyright (0th IFD)
  if (fields.copyright.trim()) {
    exifObj['0th'][piexif.ImageIFD.Copyright] = fields.copyright.trim();
    tagsCount++;
  } else {
    delete exifObj['0th'][piexif.ImageIFD.Copyright];
  }

  // 3. Software / Program Name (0th IFD)
  if (fields.software.trim()) {
    exifObj['0th'][piexif.ImageIFD.Software] = fields.software.trim();
    tagsCount++;
  } else {
    delete exifObj['0th'][piexif.ImageIFD.Software];
  }

  // 4. Date Taken / DateTimeOriginal (Exif IFD)
  if (fields.dateOriginal.trim()) {
    exifObj['Exif'][piexif.ExifIFD.DateTimeOriginal] = fields.dateOriginal.trim();
    exifObj['Exif'][piexif.ExifIFD.DateTimeDigitized] = fields.dateOriginal.trim();
    exifObj['0th'][piexif.ImageIFD.DateTime] = fields.dateOriginal.trim();
    tagsCount += 3;
  } else {
    delete exifObj['Exif'][piexif.ExifIFD.DateTimeOriginal];
    delete exifObj['Exif'][piexif.ExifIFD.DateTimeDigitized];
    delete exifObj['0th'][piexif.ImageIFD.DateTime];
  }

  // 5. GPS Geolocation Coordinates (GPS IFD)
  const latNum = parseFloat(fields.latitude);
  const lonNum = parseFloat(fields.longitude);
  const hasValidGps = !isNaN(latNum) && !isNaN(lonNum) && latNum >= -90 && latNum <= 90 && lonNum >= -180 && lonNum <= 180;

  if (hasValidGps) {
    const latDms = decimalToDms(latNum, true);
    const lonDms = decimalToDms(lonNum, false);
    exifObj['GPS'][piexif.GPSIFD.GPSVersionID] = [2, 2, 0, 0];
    exifObj['GPS'][piexif.GPSIFD.GPSLatitudeRef] = latDms.ref;
    exifObj['GPS'][piexif.GPSIFD.GPSLatitude] = latDms.dms;
    exifObj['GPS'][piexif.GPSIFD.GPSLongitudeRef] = lonDms.ref;
    exifObj['GPS'][piexif.GPSIFD.GPSLongitude] = lonDms.dms;
    tagsCount += 5;
  } else {
    delete exifObj['GPS'][piexif.GPSIFD.GPSVersionID];
    delete exifObj['GPS'][piexif.GPSIFD.GPSLatitudeRef];
    delete exifObj['GPS'][piexif.GPSIFD.GPSLatitude];
    delete exifObj['GPS'][piexif.GPSIFD.GPSLongitudeRef];
    delete exifObj['GPS'][piexif.GPSIFD.GPSLongitude];
  }

  // Encode binary EXIF string
  const exifBytes = piexif.dump(exifObj);

  // Inject into original JPEG — RAW PIXELS ARE 100% PRESERVED WITHOUT RECOMPRESSION
  const updatedDataUrl = piexif.insert(exifBytes, targetDataUrl);
  const blob = dataUrlToBlob(updatedDataUrl);

  const baseName = file.name.replace(/\.[^/.]+$/, '');
  const fileName = `edited_${baseName}.jpg`;

  const originalSize = file.size;
  const editedSize = blob.size;
  const sizeDiffBytes = Math.abs(editedSize - originalSize);
  const sizeDiffFormatted = formatFileSize(sizeDiffBytes);

  return {
    blob,
    fileName,
    originalSize,
    editedSize,
    sizeDiffBytes,
    sizeDiffFormatted,
    tagsCount,
    isJpeg: true,
  };
}

/**
 * Fallback: Canvas-based metadata stripping for PNG and non-JPEG files
 */
export async function stripFallbackCanvas(file: File): Promise<Blob> {
  return stripMetadataWithCanvas(file, { quality: 1.0 });
}
