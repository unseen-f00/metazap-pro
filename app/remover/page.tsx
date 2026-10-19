import type { Metadata } from 'next';
import RemoverTool from './RemoverTool';

export const metadata: Metadata = {
  title: 'Free Image Metadata Remover | Strip EXIF, GPS Online',
  description: 'Remove hidden EXIF data, GPS coordinates, and camera metadata from your images instantly. 100% private browser processing — no uploads, no servers.',
};

export default function RemoverPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      {/* Editorial Masthead */}
      <header className="mb-10 text-center max-w-3xl mx-auto">
        <div className="editorial-kicker mb-3">
          VOL. XV // CLIENT-SIDE METADATA SANITIZER
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-ink dark:text-chalk mb-4 leading-tight">
          Metadata Remover
        </h1>
        <p className="font-serif italic text-base sm:text-lg text-ink/75 dark:text-chalk/75 leading-relaxed">
          Instantly strip hidden EXIF segments, GPS coordinates, camera hardware serials, and timestamp trails entirely inside your browser.
        </p>

        {/* Technical Specification Bar */}
        <div className="mt-6 pt-4 border-t border-hairline flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] text-ink/60 dark:text-chalk/60 uppercase tracking-widest">
          <span>PARSERS: EXIF, GPS, XMP, IPTC</span>
          <span className="opacity-40">/</span>
          <span>PIXEL QUALITY: 100% UNTOUCHED</span>
          <span className="opacity-40">/</span>
          <span>AIR-GAPPED RAM</span>
        </div>
      </header>

      <RemoverTool />

      <section className="mt-16 max-w-4xl mx-auto space-y-10">
        <article className="editorial-card p-6 md:p-8 space-y-4">
          <div className="editorial-kicker">ENGINEERING // HOW IT WORKS</div>
          <h2 className="font-serif text-2xl font-bold text-ink dark:text-chalk">
            Pure Client-Side In-Memory Binary Parsing
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-ink/80 dark:text-chalk/80 leading-relaxed font-sans">
            <p>
              When you upload an image, the tool opens the file using a pure browser-based parser that reads its binary structure. It identifies all embedded EXIF segments and metadata chunks, then creates a new image file by copying only the visual pixel data. Every metadata block — camera details, GPS tags, software stamps — is discarded.
            </p>
            <p>
              The regeneration process preserves the exact original encoding. JPEG compression settings, PNG transparency, TIFF multi-page structures, and WebP compression ratios all remain unchanged. Only the hidden metadata is stripped.
            </p>
            <p>
              Because everything runs inside your browser&apos;s sandboxed environment, no file is transmitted over the network. Your privacy is guaranteed by architecture — not by policy.
            </p>
          </div>
        </article>

        {/* FAQs */}
        <section className="editorial-card p-6 md:p-10">
          <div className="editorial-kicker mb-2">FIELD INQUIRIES // TECHNICAL DISPATCHES</div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-ink dark:text-chalk mb-8 tracking-tight">
            Frequently Addressed Questions
          </h2>
          <div className="space-y-4">
            {[
              { q: 'Does my file leave my computer?', a: 'No. All processing is done locally using FileReader and native browser APIs. Nothing is uploaded.' },
              { q: 'Can I process many files at once?', a: 'Yes. Batch uploads are supported with individual progress tracking and a single Download All button on our Batch Processing page.' },
            ].map((item, i) => (
              <details
                key={i}
                className="group border border-hairline rounded-lg bg-surface-subtle open:bg-surface transition-colors overflow-hidden"
              >
                <summary className="cursor-pointer p-5 font-serif font-semibold text-ink dark:text-chalk select-none flex items-center justify-between hover:bg-hairline/30 transition-colors">
                  <span className="text-base sm:text-lg pr-4">{item.q}</span>
                  <span className="shrink-0 font-mono text-xs text-ink/50 dark:text-chalk/50 group-open:rotate-180 transition-transform">
                    [+]
                  </span>
                </summary>
                <div className="px-5 pb-5 text-ink/80 dark:text-chalk/80 leading-relaxed text-sm space-y-3 border-t border-hairline pt-4 font-sans">
                  <p>{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
