import type { Metadata } from 'next';
import BatchTool from './BatchTool';

export const metadata: Metadata = {
  title: 'Batch Photo Metadata Remover | Clean Multiple Images & Download ZIP',
  description:
    'Upload multiple photos simultaneously to strip EXIF, GPS location tags, and camera data in bulk. Download all cleaned images in one organized ZIP archive. 100% private in-browser.',
};

export default function BatchPage() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16 md:py-20">
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-200 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300 rounded-full text-xs font-bold text-indigo-700 mb-4 tracking-wide">
          <span>⚡ BULK PRIVACY ENGINE</span>
        </div>
        <h1 className="font-[family-name:var(--font-merriweather)] text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 leading-tight">
          Batch Photo Metadata Remover
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-[family-name:var(--font-inter)]">
          Clean an entire photo album or photoshoot at once. Strip hidden GPS coordinates, serial numbers, and device tags in bulk and download everything as a single ZIP file.
        </p>
      </div>

      <BatchTool />

      <section className="max-w-4xl mx-auto mt-16 space-y-12">
        <div className="paper-card p-8 md:p-12 shadow-paper border border-slate-200/80 dark:border-slate-800">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight font-[family-name:var(--font-merriweather)]">
            How Batch Photo Cleaning Works (Explained for a 6-Year-Old)
          </h2>
          <div className="space-y-5 text-base md:text-lg leading-relaxed text-slate-700 dark:text-slate-300">
            <p>
              Imagine you have a big pile of twenty birthday postcards that you want to send to all your friends. But on the back of every single postcard, there is a sticky price tag showing the store address and the time you bought it. Taking those stickers off one postcard at a time might take you forever!
            </p>
            <p>
              Batch processing is like having a magical, super-fast assembly line right on your desk. Instead of picking up one picture, cleaning it, and putting it away before starting the next one, you just drop the whole stack of photos into the box at once.
            </p>
            <p>
              Our little robot workers inside your browser line the pictures up neatly in a row. One by one, the robot quickly inspects the picture, gently peels off the hidden GPS tracking numbers, wipes away the camera serial numbers, and checks the image to make sure it looks just as beautiful as before.
            </p>
            <p>
              Once every single picture in the line has been cleaned, our tool neatly packs all of them into a shiny digital suitcase called a ZIP file. With just one click on the &ldquo;Download All as ZIP&rdquo; button, you get all your safe photos packed together, ready to share with friends or post online without any worries!
            </p>
          </div>
        </div>

        <div className="paper-card p-8 md:p-12 shadow-paper border border-slate-200/80 dark:border-slate-800">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-8 tracking-tight font-[family-name:var(--font-merriweather)]">
            Frequently Asked Questions (ELI5 Style)
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
                className="group border border-slate-200/80 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm open:shadow-md transition-all overflow-hidden"
              >
                <summary className="cursor-pointer p-6 font-bold text-slate-900 dark:text-white select-none flex items-center justify-between hover:bg-slate-50/70 dark:hover:bg-slate-800/60 transition-colors">
                  <span className="text-base md:text-lg pr-4">{faq.q}</span>
                  <span className="shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 group-open:bg-indigo-100 dark:group-open:bg-indigo-950/70 group-open:text-indigo-600 dark:group-open:text-indigo-400 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors text-sm">
                    ▾
                  </span>
                </summary>
                <div className="px-6 pb-6 text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4 bg-slate-50/30 dark:bg-slate-900/30">
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
