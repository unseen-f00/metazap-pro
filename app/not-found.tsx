import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="min-h-[75vh] flex items-center justify-center px-6 py-20">
      <div className="paper-card max-w-2xl w-full p-8 md:p-14 text-center border border-slate-200/80 dark:border-slate-800 shadow-paper-lg bg-white dark:bg-slate-900">
        {/* 404 Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-full text-xs font-bold text-amber-800 dark:text-amber-300 mb-6 tracking-wide">
          <span>⚠️ 404 ERROR • FILE NOT FOUND</span>
        </div>

        {/* Big visual icon */}
        <div className="mb-6 text-6xl">
          🔍
        </div>

        <h1 className="font-[family-name:var(--font-merriweather)] text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 leading-tight">
          Lost in the Darkroom
        </h1>

        <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-[family-name:var(--font-inter)] max-w-lg mx-auto mb-8">
          The page or image tool you are looking for doesn&apos;t seem to exist or may have been moved to a new route. Don&apos;t worry, no photos were harmed or exposed!
        </p>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <Link
            href="/"
            className="w-full sm:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <span>← Return to Home</span>
          </Link>
          <Link
            href="/photo-metadata-remover"
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <span>Launch Metadata Remover</span>
          </Link>
        </div>

        {/* Quick popular links */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-8 text-left">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 text-center sm:text-left">
            Popular Privacy Tools
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <Link
              href="/remove-gps-photo"
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/30 transition-colors flex items-center gap-2.5 text-slate-700 dark:text-slate-300 font-medium"
            >
              <span className="text-base">📍</span>
              <span>Remove GPS Location</span>
            </Link>
            <Link
              href="/exif-cleaner"
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/30 transition-colors flex items-center gap-2.5 text-slate-700 dark:text-slate-300 font-medium"
            >
              <span className="text-base">⚡</span>
              <span>Deep Clean (Social Bypass)</span>
            </Link>
            <Link
              href="/batch"
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/30 transition-colors flex items-center gap-2.5 text-slate-700 dark:text-slate-300 font-medium"
            >
              <span className="text-base">📦</span>
              <span>Batch Processor (ZIP)</span>
            </Link>
            <Link
              href="/metadata-editor"
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/30 transition-colors flex items-center gap-2.5 text-slate-700 dark:text-slate-300 font-medium"
            >
              <span className="text-base">✏️</span>
              <span>EXIF Metadata Editor</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
