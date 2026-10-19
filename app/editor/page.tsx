import type { Metadata } from 'next';
import MetadataEditorTool from '@/app/components/MetadataEditorTool';

export const metadata: Metadata = {
  title: 'Edit EXIF Data Online | Free Image Metadata Editor & Injector',
  description:
    'Manually edit or inject EXIF fields like Author, DateTimeOriginal, Copyright, and Software tags into your images locally in your browser. 100% private — no uploads.',
};

export default function EditorPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      {/* Editorial Masthead */}
      <header className="mb-10 text-center max-w-3xl mx-auto">
        <div className="editorial-kicker mb-3">
          VOL. XIX // TAG CUSTOMIZER &amp; HEADER INJECTOR
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-ink dark:text-chalk mb-4 leading-tight">
          EXIF Metadata Editor
        </h1>
        <p className="font-serif italic text-base sm:text-lg text-ink/75 dark:text-chalk/75 leading-relaxed">
          Manually customize, inject, or update author credits, legal copyright covenants, and capture dates with complete client-side privacy.
        </p>

        {/* Technical Specification Bar */}
        <div className="mt-6 pt-4 border-t border-hairline flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] text-ink/60 dark:text-chalk/60 uppercase tracking-widest">
          <span>PARSERS: IN-MEMORY BYTE MANIPULATION</span>
          <span className="opacity-40">/</span>
          <span>COMPRESSION LOSS: 0.00%</span>
          <span className="opacity-40">/</span>
          <span>AIR-GAPPED COMPILATION</span>
        </div>
      </header>

      <MetadataEditorTool />

      <section className="max-w-4xl mx-auto mt-16 space-y-10">
        <article className="editorial-card p-6 md:p-8 space-y-4">
          <div className="editorial-kicker">TECHNICAL MEMORANDUM // LEDGER ACCESS</div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink dark:text-chalk">
            How In-Browser EXIF Editing Works
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-ink/80 dark:text-chalk/80 leading-relaxed font-sans">
            <p>
              When a digital camera takes a snapshot, it packages the picture into a standard digital container. Inside that container, alongside the colored pixel data, sits a dedicated compartment known as the EXIF segment. This compartment acts like a tiny ledger where technical details are stored.
            </p>
            <p>
              Our client-side editor reads that internal ledger directly within your browser&apos;s memory using the native HTML5 FileReader API. It locates the specific IFD (Image File Directory) tags corresponding to the artist, legal copyright notice, capture date, and processing software.
            </p>
            <p>
              When you adjust the values in the form and click the &ldquo;Apply &amp; Download&rdquo; button, the tool compiles a fresh binary EXIF data block using binary byte manipulation. It replaces the old tags with your newly specified values while preserving the core image fidelity.
            </p>
            <p>
              Because all of these computations happen strictly on your device, you never have to worry about your high-resolution original images or proprietary metadata being indexed by external search engines or cloud databases.
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
              {
                q: 'Can I inject copyright and author info into an image that has no previous EXIF tags?',
                a: [
                  'Yes, absolutely! If you took an image with an app that didn&apos;t save any EXIF data, or if you created a digital artwork in a design program, the image might have an empty metadata compartment.',
                  'When you upload an image without EXIF data, our editor automatically constructs a clean, standardized EXIF structure from scratch. It builds the primary IFD directories and attaches your custom author and copyright entries.',
                  'When you click &ldquo;Apply &amp; Download&rdquo;, the newly created EXIF segment is injected right into the file headers. When opened in photo software or file explorers, your artist credits and copyright will appear seamlessly.',
                  'This is especially useful for illustrators, digital artists, and photographers who want to safeguard their work with legal notices before sharing online.',
                ],
              },
              {
                q: 'Will my original image quality be preserved when saving?',
                a: [
                  'Yes. For JPEG files, the image compression is not re-encoded when editing EXIF tags. The underlying compressed DCT blocks that represent your visual picture remain untouched byte-for-byte.',
                  'We only rewrite the APP1 header section that contains the textual metadata strings. This ensures that zero compression artifacts or generation loss occurs.',
                  'If you upload a non-JPEG format such as PNG, the tool converts it into a high-fidelity 95% quality JPEG container so that the standardized EXIF header standard can be properly applied.',
                  'In all cases, your download produces a crisp, ready-to-use image that matches the visual look of your original photo.',
                ],
              },
              {
                q: 'Is there a limit on how long the author or copyright notice can be?',
                a: [
                  'EXIF specifications allow ASCII and UTF-8 strings up to several hundred characters in the Artist, Copyright, and Software fields, which is more than enough for complete creator names, studio titles, and licensing statements.',
                  'You can comfortably write statements such as &ldquo;© 2026 Jane Doe Photography. Licensed for editorial use only.&rdquo; without running into length issues.',
                  'Our tool automatically trims and formats the strings so they adhere to standard EXIF byte alignments recognized by Adobe Lightroom, Windows File Explorer, and Apple macOS Finder.',
                  'Everything is checked client-side before binary injection to prevent corrupted tags or formatting errors.',
                ],
              },
            ].map((faq, index) => (
              <details
                key={index}
                className="group border border-hairline rounded-lg bg-surface-subtle open:bg-surface transition-colors overflow-hidden"
              >
                <summary className="cursor-pointer p-5 font-serif font-semibold text-ink dark:text-chalk select-none flex items-center justify-between hover:bg-hairline/30 transition-colors">
                  <span className="text-base sm:text-lg pr-4">{faq.q}</span>
                  <span className="shrink-0 font-mono text-xs text-ink/50 dark:text-chalk/50 group-open:rotate-180 transition-transform">
                    [+]
                  </span>
                </summary>
                <div className="px-5 pb-5 text-ink/80 dark:text-chalk/80 leading-relaxed text-sm space-y-3 border-t border-hairline pt-4 font-sans">
                  {faq.a.map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
