import type { Metadata } from 'next';
import BatchTool from './BatchTool';

export const metadata: Metadata = {
  title: 'Batch Photo Metadata Remover | Clean Multiple Images & Download ZIP',
  description:
    'Upload multiple photos simultaneously to strip EXIF, GPS location tags, and camera data in bulk. Download all cleaned images in one organized ZIP archive. 100% private in-browser.',
};

export default function BatchPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      {/* Editorial Masthead */}
      <header className="mb-10 text-center max-w-3xl mx-auto">
        <div className="editorial-kicker mb-3">
          VOL. IV // BATCH INGESTION &amp; ARCHIVE COMPILATION
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-ink dark:text-chalk mb-4 leading-tight">
          Batch Photo Metadata Sanitizer
        </h1>
        <p className="font-serif italic text-base sm:text-lg text-ink/75 dark:text-chalk/75 leading-relaxed">
          Clean entire portfolios, shoots, or albums in a single continuous client-side pass. Strips location coordinates, hardware identifiers, and creator footprints before archiving to a private ZIP container.
        </p>

        {/* Technical Specification Bar */}
        <div className="mt-6 pt-4 border-t border-hairline flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] text-ink/60 dark:text-chalk/60 uppercase tracking-widest">
          <span>CAPACITY: 25 ASSETS / SESSION</span>
          <span className="opacity-40">/</span>
          <span>EXECUTION: LOCAL RAM LOOP</span>
          <span className="opacity-40">/</span>
          <span>OUTPUT: VERIFIED ZIP</span>
        </div>
      </header>

      {/* Main Interactive Batch Engine */}
      <BatchTool />

      {/* Editorial Dispatches / ELI5 Analysis & FAQs */}
      <section className="max-w-4xl mx-auto mt-16 space-y-10">
        {/* ELI5 Explanation Section */}
        <article className="editorial-card p-6 md:p-10">
          <div className="editorial-kicker mb-2">FIELD MANUAL // MECHANICAL EXPLANATION</div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-ink dark:text-chalk mb-6 tracking-tight">
            How Batch Processing Operates in Your Device Memory
          </h2>
          <div className="space-y-4 text-sm sm:text-base leading-relaxed text-ink/80 dark:text-chalk/80 font-sans">
            <p>
              Imagine having a stack of twenty post-office parcels to mail across the country. On the underside of every box, an adhesive shipping docket records the exact home coordinate, warehouse timestamp, and clerk workstation number where the parcel was packed. Peeling those tags off each package manually would be painstaking and error-prone.
            </p>
            <p>
              Our batch engine establishes an automated, localized inspection line directly inside your browser window. Instead of processing a single snapshot and halting, your browser queues the entire collection into a managed memory stream.
            </p>
            <p>
              Sequential workers traverse the file queue item-by-item: parsing binary APP markers, surgically severing GPS and EXIF headers, validating visual image integrity, and collecting the sanitized pixel stream into an isolated client-side memory ledger.
            </p>
            <p>
              Once every frame is certified clean, the browser bundles the images into a standardized DEFLATE ZIP container. With a single click, your entire cleaned collection is delivered directly to your disk without ever routing a solitary byte through external infrastructure.
            </p>
          </div>
        </article>

        {/* ELI5 FAQ Section */}
        <section className="editorial-card p-6 md:p-10">
          <div className="editorial-kicker mb-2">DISPATCH ARCHIVE // INQUIRIES &amp; PROTOCOLS</div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-ink dark:text-chalk mb-8 tracking-tight">
            Frequently Addressed Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'How many photos can I clean at the same time?',
                a: [
                  'You can drop up to 25 photos into a single batch session! That means you can grab an entire weekend trip album, an afternoon birthday party folder, or a whole collection of camera shots and clean them together.',
                  'Each photo can be up to 20 megabytes in size, which easily handles high-resolution photos taken on the latest iPhones, Samsung Galaxy phones, Google Pixels, or professional DSLR cameras.',
                  'If you have more than 25 photos, don\'t worry! Once you download your first ZIP archive, you can simply click "Clear All / Start Over" and drop in your next batch of 25 images immediately. There are no daily limits, subscriptions, or paywalls.',
                  'Because your own computer does all the work, you can clean as many hundreds of photos as you need without waiting in long server queues.',
                ],
              },
              {
                q: 'How does the ZIP archive download work without uploading to a server?',
                a: [
                  'Most websites that give you a ZIP file take all your files, upload them across the internet to a giant computer in another country, pack them into a folder over there, and then send the folder back down to you.',
                  'Our batch tool works differently: it builds the entire ZIP archive directly inside your web browser\'s temporary memory using modern JavaScript and Web Workers.',
                  'As each photo is cleaned, its safe bytes are held in memory. When you click "Download All as ZIP", your browser quickly zips the files together like folding clothes into a neat travel bag and serves the file directly to your downloads folder.',
                  'Not a single byte of your photos or your ZIP file ever travels over the internet. You can even unplug your ethernet cable or turn off your Wi-Fi, and the ZIP creator will still pack your photos perfectly.',
                ],
              },
              {
                q: 'Can I mix different photo formats in the same batch session?',
                a: [
                  'Yes, absolutely! You can drop a mixture of standard JPEG photos from your camera, PNG screenshots from your computer, WebP graphics from the web, and even TIFF files together in the exact same batch.',
                  'Our engine looks at every photo individually as it enters the queue. If it finds a JPEG, it uses surgical EXIF segment removal. If it finds a PNG, it strips the text and chunk headers where AI prompts or software history might hide.',
                  'Every photo is treated with its own specialized cleaning recipe so that its visual picture data is 100% preserved while its private metadata tags are safely erased.',
                  'When the ZIP file is created, each image keeps its original format type with a clean prefix so you can easily tell them apart in your photo collection.',
                ],
              },
              {
                q: 'Will batch processing slow down my computer or phone?',
                a: [
                  'We designed our batch engine to be gentle and courteous to your device\'s processor and memory. Instead of trying to calculate all 25 images at the exact same fraction of a second, the queue processes them in a steady, sequential flow.',
                  'This sequential rhythm prevents your browser from freezing, crashing, or using up too much battery power. You can watch the friendly progress bar advance file-by-file with live feedback.',
                  'Once each image is cleaned and placed into the queue, unnecessary temporary scratch buffers are discarded so your device stays fast and responsive.',
                  'Whether you are using a powerful desktop computer or a lightweight smartphone, batch cleaning runs smoothly and predictably.',
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
