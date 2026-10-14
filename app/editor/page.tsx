import type { Metadata } from 'next';
import MetadataEditorTool from '@/app/components/MetadataEditorTool';

export const metadata: Metadata = {
  title: 'Edit EXIF Data Online | Free Image Metadata Editor & Injector',
  description:
    'Manually edit or inject EXIF fields like Author, DateTimeOriginal, Copyright, and Software tags into your images locally in your browser. 100% private — no uploads.',
};

export default function EditorPage() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16 md:py-20">
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-200 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300 rounded-full text-xs font-bold text-indigo-700 mb-4 tracking-wide">
          <span>✏️ EXIF TAG CUSTOMIZER</span>
        </div>
        <h1 className="font-[family-name:var(--font-merriweather)] text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 leading-tight">
          EXIF Metadata Editor
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-[family-name:var(--font-inter)]">
          Manually customize or inject EXIF fields before saving your photo. Change author, copyright, timestamp, or software tags with complete client-side privacy.
        </p>
      </div>

      <MetadataEditorTool />

      <section className="max-w-4xl mx-auto mt-16 space-y-12">
        <div className="paper-card p-8 md:p-12 shadow-paper border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight font-[family-name:var(--font-merriweather)]">
            How In-Browser EXIF Editing Works
          </h2>
          <div className="space-y-5 text-base md:text-lg leading-relaxed text-slate-700 dark:text-slate-300">
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
        </div>

        <div className="paper-card p-8 md:p-12 shadow-paper border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-8 tracking-tight font-[family-name:var(--font-merriweather)]">
            Frequently Asked Questions
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
                className="group border border-slate-200/80 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm open:shadow-md transition-all overflow-hidden"
              >
                <summary className="cursor-pointer p-6 font-bold text-slate-900 dark:text-white select-none flex items-center justify-between hover:bg-slate-50/70 dark:hover:bg-slate-800/60 transition-colors">
                  <span className="text-base md:text-lg pr-4">{faq.q}</span>
                  <span className="shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 group-open:bg-indigo-100 dark:group-open:bg-indigo-950/70 group-open:text-indigo-600 dark:group-open:text-indigo-400 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors text-sm">
                    ▾
                  </span>
                </summary>
                <div className="px-6 pb-6 text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4 bg-slate-50/30 dark:bg-slate-900/50">
                  {faq.a.map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}
