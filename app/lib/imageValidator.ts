/**
 * imageValidator.ts
 * Handles all client-side file validation before processing.
 * Keeps validation logic separate from UI and processing logic.
 */

// Maximum allowed file size: 20MB in bytes
const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;

// Human-readable max size label used in error messages
const MAX_FILE_SIZE_LABEL = '20MB';

// Supported image MIME types across the suite
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/tiff',
  'image/gif',
  'image/bmp',
  'image/heic',
  'image/heif',
  'image/avif',
];

/** The result shape returned after validating a file */
export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
}

/**
 * Infers an image MIME type from the file's extension if the browser/OS
 * (e.g. Android gallery or file picker) leaves file.type empty or generic.
 */
export function inferMimeType(file: File): string {
  if (file.type && file.type.startsWith('image/')) {
    return file.type.toLowerCase();
  }

  const name = file.name.toLowerCase();
  if (name.endsWith('.png')) return 'image/png';
  if (name.endsWith('.jpg') || name.endsWith('.jpeg')) return 'image/jpeg';
  if (name.endsWith('.webp')) return 'image/webp';
  if (name.endsWith('.heic')) return 'image/heic';
  if (name.endsWith('.heif')) return 'image/heif';
  if (name.endsWith('.tiff') || name.endsWith('.tif')) return 'image/tiff';
  if (name.endsWith('.gif')) return 'image/gif';
  if (name.endsWith('.bmp')) return 'image/bmp';
  if (name.endsWith('.avif')) return 'image/avif';

  return file.type ? file.type.toLowerCase() : 'application/octet-stream';
}

/**
 * Checks whether a given file matches an HTML input accept string.
 * Supports comma-separated MIME types ('image/png', 'image/*') and extensions ('.png', '.heic').
 */
export function matchesAcceptCriteria(file: File, acceptString?: string): boolean {
  if (!acceptString || acceptString.trim() === '' || acceptString === '*' || acceptString === 'image/*') {
    const inferred = inferMimeType(file);
    return SUPPORTED_IMAGE_TYPES.includes(inferred);
  }

  const tokens = acceptString
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  const fileMime = inferMimeType(file);
  const fileName = file.name.toLowerCase();

  return tokens.some((token) => {
    // Extension match (e.g. ".png", ".heic")
    if (token.startsWith('.')) {
      return fileName.endsWith(token);
    }
    // Wildcard MIME match (e.g. "image/*")
    if (token.endsWith('/*')) {
      const typePrefix = token.slice(0, -1);
      return fileMime.startsWith(typePrefix);
    }
    // Exact MIME match (e.g. "image/png")
    return fileMime === token;
  });
}

/**
 * Validates a single image file against size, corruption, and required format rules.
 *
 * @param file - The File object selected or dropped by the user
 * @param accept - Optional accept pattern (e.g. "image/png" or "image/heic,image/heif,.heic,.heif")
 * @returns A ValidationResult with isValid flag and a human-readable error message if invalid
 */
export function validateImageFile(file: File, accept?: string): ValidationResult {
  // Check for empty or 0-byte files (common mobile glitch on incomplete downloads)
  if (!file || file.size === 0) {
    return {
      isValid: false,
      errorMessage: `"${file?.name || 'File'}" is empty (0 bytes). Please select a valid photo.`,
    };
  }

  // Check if the file exceeds the 20MB size limit
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      errorMessage: `"${file.name}" is ${fileSizeMB}MB, which exceeds the ${MAX_FILE_SIZE_LABEL} limit. Please upload a smaller file.`,
    };
  }

  // Check strict format restriction if accept pattern is specified
  if (accept && !matchesAcceptCriteria(file, accept)) {
    const lowerAccept = accept.toLowerCase();
    if (lowerAccept.includes('image/png') && !lowerAccept.includes('jpeg') && !lowerAccept.includes('heic')) {
      return {
        isValid: false,
        errorMessage: `Invalid format: "${file.name}" is not a PNG image. The PNG Metadata Remover strictly accepts only PNG (.png) files.`,
      };
    }
    if ((lowerAccept.includes('heic') || lowerAccept.includes('heif')) && !lowerAccept.includes('png')) {
      return {
        isValid: false,
        errorMessage: `Invalid format: "${file.name}" is not an Apple HEIC/HEIF photo. Please upload a .heic or .heif file.`,
      };
    }
    return {
      isValid: false,
      errorMessage: `Invalid format: "${file.name}" does not match the required format (${accept}).`,
    };
  }

  // General image type validation
  const inferredMime = inferMimeType(file);
  const isKnownImageType = SUPPORTED_IMAGE_TYPES.includes(inferredMime);
  if (!isKnownImageType) {
    return {
      isValid: false,
      errorMessage: `"${file.name}" is not a supported image format. Please upload a JPEG, PNG, WebP, HEIC, TIFF, or GIF file.`,
    };
  }

  // File passed all checks
  return { isValid: true, errorMessage: null };
}
