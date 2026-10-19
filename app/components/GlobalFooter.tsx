/**
 * GlobalFooter.tsx
 * Broadsheet Editorial Colophon for MetaZap.
 * Features:
 * - Editorial manifesto statement & local execution guarantee
 * - Clean multi-column directory
 * - Minimalist colophon credits
 */

import Link from 'next/link';
import Logo from '@/app/components/Logo';

export default function GlobalFooter() {
  return (
    <footer className="w-full border-t border-stone-200/90 dark:border-stone-800/90 bg-[var(--background)] transition-colors duration-200 mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="py-12 md:py-16 grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand & Manifesto Column (2 cols wide on desktop) */}
          <div className="md:col-span-2 max-w-sm">
            <Link
              href="/"
              className="inline-block mb-3.5 focus:outline-none focus:ring-1 focus:ring-stone-900 dark:focus:ring-stone-100 rounded-lg p-0.5"
              aria-label="MetaZap Home"
            >
              <Logo size="sm" />
            </Link>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-sans mb-4">
              MetaZap is an in-browser photo privacy workshop. It scrubs dangerous GPS coordinates, camera hardware serials, and personal timestamps locally inside your browser RAM. Zero server uploads.
            </p>
            <div className="font-mono text-[10px] tracking-wider uppercase text-stone-400 dark:text-stone-500 border-l border-stone-300 dark:border-stone-700 pl-2.5 space-y-0.5">
              <p>STANDARDS: EXIF 2.32 · TIFF 6.0 · C2PA JUMBF</p>
              <p>ENCRYPTION: LOCAL SANDBOX BUFFER ONLY</p>
            </div>
          </div>

          {/* Directory Column 1: Removers */}
          <div className="space-y-3">
            <span className="editorial-kicker text-stone-400 dark:text-stone-500 block">
              01 / Removers
            </span>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/photo-metadata-remover" className="text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white transition-colors">
                  Photo Metadata Remover
                </Link>
              </li>
              <li>
                <Link href="/remove-gps-photo" className="text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white transition-colors">
                  Remove GPS Location
                </Link>
              </li>
              <li>
                <Link href="/exif-cleaner" className="text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white transition-colors">
                  EXIF Deep Clean
                </Link>
              </li>
              <li>
                <Link href="/xmp-remover" className="text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white transition-colors">
                  XMP Packet Remover
                </Link>
              </li>
              <li>
                <Link href="/png-metadata-remover" className="text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white transition-colors">
                  PNG Chunk Remover
                </Link>
              </li>
              <li>
                <Link href="/heic-metadata-remover" className="text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white transition-colors">
                  Apple HEIC Stripper
                </Link>
              </li>
            </ul>
          </div>

          {/* Directory Column 2: Studio & Tools */}
          <div className="space-y-3">
            <span className="editorial-kicker text-stone-400 dark:text-stone-500 block">
              02 / Studio &amp; Tools
            </span>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/batch" className="text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white transition-colors">
                  Batch Processor (ZIP)
                </Link>
              </li>
              <li>
                <Link href="/compress" className="text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white transition-colors">
                  Dynamic Compressor
                </Link>
              </li>
              <li>
                <Link href="/crop" className="text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white transition-colors">
                  Social Media Cropper
                </Link>
              </li>
              <li>
                <Link href="/metadata-editor" className="text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white transition-colors">
                  Metadata Editor &amp; Tags
                </Link>
              </li>
              <li>
                <Link href="/photo-privacy-analyzer" className="text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white transition-colors">
                  Photo Privacy Audit
                </Link>
              </li>
              <li>
                <Link href="/png-to-jpg" className="text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white transition-colors">
                  Format Converters
                </Link>
              </li>
            </ul>
          </div>

          {/* Directory Column 3: Policy & Colophon */}
          <div className="space-y-3">
            <span className="editorial-kicker text-stone-400 dark:text-stone-500 block">
              03 / Publishing &amp; Legal
            </span>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/about" className="text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white transition-colors">
                  About the Studio
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white transition-colors">
                  Privacy Manifesto
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white transition-colors">
                  Inquiries &amp; Support
                </Link>
              </li>
              <li>
                <Link href="/c2pa-checker" className="text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white transition-colors">
                  Provenance Audit
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Broadsheet Colophon Bottom Rule */}
        <div className="border-t border-stone-200/80 dark:border-stone-800/80 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500 dark:text-stone-400">
          <p className="font-mono text-[11px]">
            © 2026 MetaZap Studio. 100% Client-Side Private.
          </p>
          <p className="font-mono text-[11px] flex items-center gap-2">
            <span>Set in Merriweather &amp; Inter</span>
            <span>·</span>
            <span>Zero Remote Storage</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
