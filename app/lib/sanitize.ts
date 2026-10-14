/**
 * sanitize.ts
 * XSS sanitization utilities for user-facing metadata display.
 *
 * EXIF metadata extracted from image files may contain arbitrary text
 * that could potentially include malicious scripts or HTML. This module
 * provides safe sanitization functions before rendering any extracted
 * metadata in the UI.
 */

/**
 * Sanitizes a string by escaping HTML entities.
 * Converts &, <, >, ", and ' to their HTML entity equivalents.
 *
 * @param input - The raw string to sanitize
 * @returns A new string with all HTML special characters escaped
 */
export function sanitizeHtml(input: string | null | undefined): string {
  if (input === null || input === undefined || input === '') {
    return 'Not detected';
  }

  return String(input)
    .replace(/&/g, '&amp;')    // Must be first
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitizes a string for use in an attribute value.
 * Strips dangerous characters that could break out of quotes.
 *
 * @param input - The raw string to sanitize
 * @returns A safe attribute value
 */
export function sanitizeAttribute(input: string | null | undefined): string {
  if (input === null || input === undefined || input === '') {
    return '';
  }

  return String(input)
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * Sanitizes a string for URL construction.
 * Removes characters that could enable XSS via JavaScript URLs.
 *
 * @param input - The raw string to sanitize
 * @returns A safe URL fragment
 */
export function sanitizeUrl(input: string | null | undefined): string {
  if (input === null || input === undefined || input === '') {
    return '';
  }

  // Remove any JavaScript: or vbscript: prefixes
  let sanitized = String(input)
    .replace(/javascript\s*:/gi, '')
    .replace(/vbscript\s*:/gi, '')
    .replace(/data\s*:\s*text\/html/gi, '');

  // Remove event handler prefixes
  sanitized = sanitized.replace(/on\w+\s*=/gi, '');

  return sanitized.trim();
}

/**
 * Strips all HTML tags from a string, leaving only plain text.
 *
 * @param input - The raw string to sanitize
 * @returns Plain text with all HTML removed
 */
export function stripHtmlTags(input: string | null | undefined): string {
  if (input === null || input === undefined || input === '') {
    return 'Not detected';
  }

  // Remove all HTML tags
  const noTags = String(input).replace(/<[^>]*>/g, '');

  // Also sanitize any remaining special chars for safety
  return sanitizeHtml(noTags);
}
