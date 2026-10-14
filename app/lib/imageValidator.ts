/**
 * imageValidator.ts
 * Handles all client-side file validation before processing.
 * Keeps validation logic separate from UI and processing logic.
 */

// Maximum allowed file size: 20MB in bytes
const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;

// Human-readable max size label used in error messages
const MAX_FILE_SIZE_LABEL = '20MB';

// Supported image MIME types that this tool can process
const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/tiff',
  'image/gif',
  'image/bmp',
];

/** The result shape returned after validating a file */
export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
}

/**
 * Validates a single image file against size and type rules.
 *
 * @param file - The File object selected or dropped by the user
 * @returns A ValidationResult with isValid flag and a human-readable error message if invalid
 */
export function validateImageFile(file: File): ValidationResult {
  // Check if the file type is one we support
  const isKnownImageType = SUPPORTED_IMAGE_TYPES.includes(file.type);
  if (!isKnownImageType) {
    return {
      isValid: false,
      errorMessage: `"${file.name}" is not a supported image type. Please upload a JPEG, PNG, WebP, TIFF, GIF, or BMP file.`,
    };
  }

  // Check if the file exceeds the 20MB size limit
  const isFileTooLarge = file.size > MAX_FILE_SIZE_BYTES;
  if (isFileTooLarge) {
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      errorMessage: `"${file.name}" is ${fileSizeMB}MB, which exceeds the ${MAX_FILE_SIZE_LABEL} limit. Please upload a smaller file.`,
    };
  }

  // File passed all checks
  return { isValid: true, errorMessage: null };
}
