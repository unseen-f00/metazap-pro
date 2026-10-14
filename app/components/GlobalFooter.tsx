/**
 * GlobalFooter.tsx
 * Accessible, Dark-Mode-Ready Footer for MetaZap.
 */

import Link from 'next/link';
import Logo from '@/app/components/Logo';

export default function GlobalFooter() {
  return (
    <footer className="w-full border-t border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="py-10 md:py-14 flex flex-col md:flex-row items-start justify-between gap-8">
          {/* Brand Column */}
          <div className="max-w-xs">
            <Link href="/" className="inline-block mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl" aria-label="MetaZap Home">
              <Logo size="sm" />
            </Link>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              The privacy-first photo metadata toolkit. Processed 100% locally in your browser memory — zero server uploads, zero storage.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap gap-12 sm:gap-16">
            <nav className="flex flex-col gap-2.5" aria-label="Footer navigation">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                Navigation
              </span>
              <Link href="/" className="text-xs md:text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-xs md:text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                About MetaZap
              </Link>
              <Link href="/batch" className="text-xs md:text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Batch Processor
              </Link>
              <Link href="/metadata-editor" className="text-xs md:text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                EXIF Editor
              </Link>
              <Link href="/contact" className="text-xs md:text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Contact
              </Link>
            </nav>

            <nav className="flex flex-col gap-2.5" aria-label="Legal and privacy">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                Privacy &amp; Legal
              </span>
              <Link href="/privacy-policy" className="text-xs md:text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-xs md:text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/photo-privacy-analyzer" className="text-xs md:text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Privacy Audit
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200/60 dark:border-slate-800/80 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 dark:text-slate-500">
          <p>© 2026 MetaZap. All rights reserved. 100% Client-Side Private.</p>
          <p className="flex items-center gap-1.5">
            <span>Built with Next.js &amp; Tailwind CSS</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
