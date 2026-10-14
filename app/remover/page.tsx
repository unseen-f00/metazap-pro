import type { Metadata } from 'next';
import RemoverTool from './RemoverTool';

export const metadata: Metadata = {
  title: 'Free Image Metadata Remover | Strip EXIF, GPS Online',
  description: 'Remove hidden EXIF data, GPS coordinates, and camera metadata from your images instantly. 100% private browser processing — no uploads, no servers.',
};

export default function RemoverPage() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      <h1 className="font-[family-name:var(--font-merriweather)] text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
        Metadata Remover
      </h1>
      <p className="text-xl text-slate-600 dark:text-slate-300 mb-12 max-w-2xl leading-relaxed font-[family-name:var(--font-inter)]">
        Upload an image to instantly strip hidden EXIF, GPS, and camera data. Everything runs locally in your browser.
      </p>

      <RemoverTool />

      <section className="mt-16 max-w-4xl">
        <h2 className="font-[family-name:var(--font-merriweather)] text-3xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">How It Works</h2>
        <div className="space-y-6 text-[17px] leading-relaxed text-slate-600 dark:text-slate-300 mb-16">
          <p>When you upload an image, the tool opens the file using a pure browser-based parser that reads its binary structure. It identifies all embedded EXIF segments and metadata chunks, then creates a new image file by copying only the visual pixel data. Every metadata block — camera details, GPS tags, software stamps — is discarded.</p>
          <p>The regeneration process preserves the exact original encoding. JPEG compression settings, PNG transparency, TIFF multi-page structures, and WebP compression ratios all remain unchanged. Only the hidden metadata is stripped.</p>
          <p>Because everything runs inside your browser&apos;s sandboxed environment, no file is transmitted over the network. Your privacy is guaranteed by architecture — not by policy.</p>
        </div>

        <h2 className="font-[family-name:var(--font-merriweather)] text-3xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {[
            { q: 'Does my file leave my computer?', a: 'No. All processing is done locally using FileReader and native browser APIs. Nothing is uploaded.' },
            { q: 'Can I process many files at once?', a: 'Yes. Batch uploads are supported with individual progress tracking and a single Download All button.' },
          ].map((item, i) => (
            <details key={i} className="group border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm open:shadow-md transition-all overflow-hidden">
              <summary className="cursor-pointer p-5 font-semibold text-slate-900 dark:text-white select-none flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">{item.q}<span className="ml-4 text-indigo-500 dark:text-indigo-400 text-sm">▾</span></summary>
              <div className="px-5 pb-5 text-slate-600 dark:text-slate-300 leading-relaxed text-[15px]">{item.a}</div>
            </details>
          ))}
        </div>
      </section>
    </section>
  );
}
