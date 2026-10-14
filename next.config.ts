import type { NextConfig } from 'next';

/**
 * next.config.ts
 * Production-hardened Next.js configuration.
 *
 * Security headers are set here at the HTTP layer so every response
 * from the application — including the homepage, API routes, and static
 * assets — carries the full header set to protect against XSS and clickjacking.
 */

// Content Security Policy string.
// We use a strict policy because this tool processes sensitive user files locally.
// 'self'           — allow scripts/styles from same origin only
// fonts.gstatic    — allow Google Fonts
// fonts.googleapis — allow the fonts CSS loader
// worker-src / child-src blob: — needed for in-browser Web Workers (heic2any, JSZip compression)
// img-src blob: data: — needed for local canvas rendering and blob previews
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // unsafe-eval needed for Next.js dev & Turbopack
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' blob: data:",                       // blob: for local Blob URL previews
  "worker-src 'self' blob:",                          // needed for client-side worker compression
  "child-src 'self' blob:",                           // needed for worker frame sandboxing
  "connect-src 'self'",                               // zero external API calls permitted
  "object-src 'none'",                                // block Flash and legacy plugins
  "frame-ancestors 'none'",                           // equivalent to X-Frame-Options DENY
  "form-action 'self'",                               // form submissions only to same origin
  "base-uri 'self'",                                  // block base-tag injection
  "upgrade-insecure-requests",                        // force HTTPS
].join('; ');

// Strict HTTP security headers applied to every route
const securityHeaders = [
  {
    // Prevent rendering in iframes to block clickjacking attacks
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    // Block MIME-type sniffing to prevent content-type confusion attacks
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    // Control referrer info sent with cross-origin requests
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    // Force HTTPS for all future requests for 2 years
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    // Limit browser features and APIs available to this page
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    // Cross-site scripting filter protection
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    // Prevent Adobe Flash/Acrobat cross-domain leaks
    key: 'X-Permitted-Cross-Domain-Policies',
    value: 'none',
  },
  {
    // Prevent cross-origin info leakage via the Timing-Allow-Origin header
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    // Full Content Security Policy — most important header
    key: 'Content-Security-Policy',
    value: contentSecurityPolicy,
  },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
  // Apply security headers to all routes
  async headers() {
    return [
      {
        source: '/(.*)', // Match every route
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
