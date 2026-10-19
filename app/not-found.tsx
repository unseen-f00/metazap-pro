import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 py-20">
      <div className="editorial-card max-w-2xl w-full p-8 md:p-14 text-center border border-stone-200/90 dark:border-stone-800/90 shadow-2xs">
        {/* Editorial Status Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-md font-mono text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-6 uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span>404 · DOSSIER NOT LOCATED</span>
        </div>

        {/* Aperture Focus Glyph */}
        <div className="mb-6 flex justify-center">
          <div className="w-14 h-14 rounded-full border border-stone-300 dark:border-stone-700 flex items-center justify-center text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-900">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
          </div>
        </div>

        <h1 className="font-[family-name:var(--font-merriweather)] text-3xl md:text-5xl font-bold tracking-tight text-stone-950 dark:text-white mb-4 leading-tight">
          Lost in the Darkroom
        </h1>

        <p className="text-sm md:text-base text-stone-600 dark:text-stone-400 leading-relaxed font-[family-name:var(--font-inter)] max-w-lg mx-auto mb-8">
          The requested archive file or image privacy utility cannot be found in the local index. No photos were transmitted or exposed.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 bg-stone-900 hover:bg-black text-white dark:bg-stone-100 dark:hover:bg-white dark:text-stone-950 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 font-mono uppercase tracking-wider"
          >
            <span>← Return to Home</span>
          </Link>
          <Link
            href="/photo-metadata-remover"
            className="w-full sm:w-auto px-6 py-3 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold rounded-lg border border-stone-300 dark:border-stone-700 transition-colors flex items-center justify-center gap-2 font-mono uppercase tracking-wider"
          >
            <span>Launch Metadata Remover</span>
          </Link>
        </div>

        {/* Quick popular links */}
        <div className="border-t border-stone-200/80 dark:border-stone-800/80 pt-8 text-left">
          <span className="editorial-kicker text-stone-400 dark:text-stone-500 block mb-4 text-center sm:text-left">
            Index / Popular Privacy Tools
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <Link
              href="/remove-gps-photo"
              className="p-3.5 rounded-lg border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 bg-stone-50/50 dark:bg-stone-900/50 hover:bg-white dark:hover:bg-stone-900 transition-colors flex items-center justify-between text-stone-800 dark:text-stone-200 font-medium"
            >
              <span>Remove GPS Location</span>
              <span className="font-mono text-[10px] text-stone-400">01 →</span>
            </Link>
            <Link
              href="/exif-cleaner"
              className="p-3.5 rounded-lg border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 bg-stone-50/50 dark:bg-stone-900/50 hover:bg-white dark:hover:bg-stone-900 transition-colors flex items-center justify-between text-stone-800 dark:text-stone-200 font-medium"
            >
              <span>EXIF Deep Clean (Canvas)</span>
              <span className="font-mono text-[10px] text-stone-400">02 →</span>
            </Link>
            <Link
              href="/batch"
              className="p-3.5 rounded-lg border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 bg-stone-50/50 dark:bg-stone-900/50 hover:bg-white dark:hover:bg-stone-900 transition-colors flex items-center justify-between text-stone-800 dark:text-stone-200 font-medium"
            >
              <span>Batch Processor (ZIP)</span>
              <span className="font-mono text-[10px] text-stone-400">03 →</span>
            </Link>
            <Link
              href="/metadata-editor"
              className="p-3.5 rounded-lg border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 bg-stone-50/50 dark:bg-stone-900/50 hover:bg-white dark:hover:bg-stone-900 transition-colors flex items-center justify-between text-stone-800 dark:text-stone-200 font-medium"
            >
              <span>Metadata Editor</span>
              <span className="font-mono text-[10px] text-stone-400">04 →</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
