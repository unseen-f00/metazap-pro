# Security & Privacy Architecture

## Zero Server Uploads — Verified

Every image processing step runs exclusively inside the user's browser using the native File API, FileReader, and Blob constructors. No `fetch()` request, `XMLHttpRequest`, or `WebSocket` connection sends image data to any server. The server receives zero file uploads — only static HTML responses. All binary processing is handled by `piexifjs` (JPEG) and a custom binary chunk parser (PNG) running in JavaScript.

## XSS Prevention

All EXIF text values (Author, Software, DateTime) are sanitized with the `sanitizeHtml()` function from `app/lib/sanitize.ts` before any UI rendering. This function converts `&`, `<`, `>`, `"`, `'`, and `/` into HTML entities, preventing any embedded HTML or script injection from malicious EXIF fields. The `sanitizeUrl()` function strips `javascript:`, `vbscript:`, and event handler prefixes to prevent URL-based XSS. `sanitizeAttribute()` secures any attribute contexts. Additionally, `stripHtmlTags()` provides a fallback that removes all HTML tags while preserving safe text content.

## HTTP Security Headers

Next.js `headers()` in `next.config.ts` applies strict headers to every route:
- `Content-Security-Policy`: strict self-origin policy with `blob:` for preview URLs
- `X-Frame-Options`: DENY (clickjacking protection)
- `X-Content-Type-Options`: nosniff (MIME sniffing blocked)
- `Strict-Transport-Security`: max-age 63072000 (2-year HTTPS enforcement)
- `Referrer-Policy`: strict-origin-when-cross-origin

## Client-Side Processing Flow

1. User selects or drops an image file
2. `FileReader.readAsDataURL()` reads the file locally into memory
3. `piexif.remove()` strips EXIF segments locally (JPEG) or binary chunk parser removes PNG metadata
4. `new Blob()` creates the cleaned file in memory
5. `URL.createObjectURL()` generates a temporary local URL for download
6. The original file data is never transmitted over the network
7. All memory buffers are garbage-collected when the user navigates away
