/**
 * exifEditor.ts
 * 100% Client-Side EXIF Metadata Editor & Injector.
 * Allows reading, modifying, and embedding Author, Copyright, DateTimeOriginal,
 * and Software tags into images using piexifjs without server communication.
 */

import piexif from 'piexifjs';

export interface ExifEditorFields {
  author: string;
  copyright: string;
  dateOriginal: string;
  software: string;
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
 * Reads existing EXIF fields from an uploaded image file.
 * Returns populated fields if found, or sensible default suggestions.
 */
export async function readExifForEditor(file: File): Promise<ExifEditorFields> {
  const defaults: ExifEditorFields = {
    author: '',
    copyright: `© ${new Date().getFullYear()} All Rights Reserved`,
    dateOriginal: formatExifDate(),
    software: 'ImageClean EXIF Editor',
  };

  if (!file.type.includes('jpeg') && !file.type.includes('jpg')) {
    return defaults;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const dataUrl = e.target?.result as string;
        if (!dataUrl) {
          resolve(defaults);
          return;
        }

        const exifObj = piexif.load(dataUrl);
        const zeroth = exifObj['0th'] || {};
        const exifIFD = exifObj['Exif'] || {};

        const author = typeof zeroth[piexif.ImageIFD.Artist] === 'string'
          ? (zeroth[piexif.ImageIFD.Artist] as string)
          : defaults.author;

        const copyright = typeof zeroth[piexif.ImageIFD.Copyright] === 'string'
          ? (zeroth[piexif.ImageIFD.Copyright] as string)
          : defaults.copyright;

        const software = typeof zeroth[piexif.ImageIFD.Software] === 'string'
          ? (zeroth[piexif.ImageIFD.Software] as string)
          : defaults.software;

        const dateOriginal = typeof exifIFD[piexif.ExifIFD.DateTimeOriginal] === 'string'
          ? (exifIFD[piexif.ExifIFD.DateTimeOriginal] as string)
          : defaults.dateOriginal;

        resolve({ author, copyright, dateOriginal, software });
      } catch {
        // If file doesn't have an EXIF header yet, return standard defaults
        resolve(defaults);
      }
    };
    reader.onerror = () => resolve(defaults);
    reader.readAsDataURL(file);
  });
}

/**
 * Converts a non-JPEG image file (PNG, WebP, etc.) to a JPEG Data URL via HTML5 Canvas
 * so that standard EXIF segments can be injected.
 */
async function fileToJpegDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context could not be created'));
        return;
      }

      // Draw white background for transparency in PNGs
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.95);
      resolve(jpegDataUrl);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image for canvas conversion'));
    };

    img.src = objectUrl;
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
 * Injects or updates EXIF tags (Author, Copyright, DateTimeOriginal, Software)
 * into an image file, completely client-side.
 */
export async function injectExifData(
  file: File,
  fields: ExifEditorFields
): Promise<{ blob: Blob; fileName: string }> {
  let targetDataUrl: string;

  if (file.type.includes('jpeg') || file.type.includes('jpg')) {
    targetDataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error('Failed to read JPEG file'));
      reader.readAsDataURL(file);
    });
  } else {
    // Convert to high-quality JPEG first
    targetDataUrl = await fileToJpegDataUrl(file);
  }

  // Load existing EXIF or create a clean dictionary
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
    // Start with fresh object if no valid EXIF segment exists
  }

  if (!exifObj['0th']) exifObj['0th'] = {};
  if (!exifObj['Exif']) exifObj['Exif'] = {};

  // Inject user-defined fields
  if (fields.author.trim()) {
    exifObj['0th'][piexif.ImageIFD.Artist] = fields.author.trim();
  } else {
    delete exifObj['0th'][piexif.ImageIFD.Artist];
  }

  if (fields.copyright.trim()) {
    exifObj['0th'][piexif.ImageIFD.Copyright] = fields.copyright.trim();
  } else {
    delete exifObj['0th'][piexif.ImageIFD.Copyright];
  }

  if (fields.software.trim()) {
    exifObj['0th'][piexif.ImageIFD.Software] = fields.software.trim();
  } else {
    delete exifObj['0th'][piexif.ImageIFD.Software];
  }

  if (fields.dateOriginal.trim()) {
    exifObj['Exif'][piexif.ExifIFD.DateTimeOriginal] = fields.dateOriginal.trim();
    // Also mirror to DateTimeDigitized and DateTime if desirable
    exifObj['Exif'][piexif.ExifIFD.DateTimeDigitized] = fields.dateOriginal.trim();
    exifObj['0th'][piexif.ImageIFD.DateTime] = fields.dateOriginal.trim();
  }

  // Encode EXIF binary bytes
  const exifBytes = piexif.dump(exifObj);

  // Insert into target JPEG
  const updatedDataUrl = piexif.insert(exifBytes, targetDataUrl);
  const blob = dataUrlToBlob(updatedDataUrl);

  const baseName = file.name.replace(/\.[^/.]+$/, '');
  const fileName = `edited_${baseName}.jpg`;

  return { blob, fileName };
}
