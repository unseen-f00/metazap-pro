import type { Metadata } from 'next';
import MetadataEditorTool from '@/app/components/MetadataEditorTool';

export const metadata: Metadata = {
  title: 'EXIF Metadata Editor Online | Manually Edit & Inject Image Tags',
  description:
    'Manually customize, edit, or inject EXIF tags like Author, Copyright, DateTimeOriginal, and Software into photos 100% in your browser. Completely private with zero server uploads.',
};

export default function MetadataEditorPage() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16 md:py-20">
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-200 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300 rounded-full text-xs font-bold text-indigo-700 mb-4 tracking-wide">
          <span>🛠️ IN-BROWSER EXIF INJECTOR</span>
        </div>
        <h1 className="font-[family-name:var(--font-merriweather)] text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 leading-tight">
          Image Metadata Editor
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-[family-name:var(--font-inter)]">
          Manually write custom photographer credits, legal copyright notices, capture timestamps, and software tags directly into your image file with zero server uploads.
        </p>
      </div>

      <MetadataEditorTool />

      <section className="max-w-4xl mx-auto mt-16 space-y-12">
        <div className="paper-card p-8 md:p-12 shadow-paper border border-slate-200/80 dark:border-slate-800">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight font-[family-name:var(--font-merriweather)]">
            What is an EXIF Metadata Editor? (Explained Simply)
          </h2>
          <div className="space-y-5 text-base md:text-lg leading-relaxed text-slate-700 dark:text-slate-300">
            <p>
              Imagine you drew a wonderful picture in art class, and on the back of the paper, you have a blank index card where you can write your name, the date you finished it, and a note saying that this drawing belongs to you. If someone finds the picture on the classroom floor, they can just flip it over to see who created it!
            </p>
            <p>
              When a digital camera takes a photo, it automatically fills out that hidden index card with technical numbers and device information. But what if the camera forgot to add your name? Or what if you want to make sure your name and a copyright stamp are clearly written on the file before you share it on the internet with your friends or clients?
            </p>
            <p>
              That is exactly what this metadata editor does. Instead of erasing everything, it allows you to pick up a digital pen and write custom information onto the secret index card attached to your picture. You can write your name in the Author box, add a copyright notice to protect your work, or adjust the date and time.
            </p>
            <p>
              Best of all, all of this writing happens right inside your web browser on your computer. Your photo is never sent to our servers, never saved in a database, and never examined by strangers. You make your edits, download the finished photo, and keep total ownership of your files.
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
                q: 'Why would I want to edit metadata instead of just deleting it?',
                a: [
                  'Imagine you are a baker who bakes delicious cookies. If you leave your bakery name on the box, everyone knows who made the yummy treats! Professional photographers and creators often want their name and copyright stamped onto their photos so people give them credit when the image is published.',
                  'Sometimes cameras have the wrong date and time set because you forgot to change the clock when traveling to a different time zone. When you look at your family photo album years later, your summer vacation photos might show up in the middle of winter!',
                  'By editing the metadata, you can fix that clock error without changing the picture itself. You can also put a polite copyright notice saying that people must ask permission before using your work for commercial advertisements.',
                  'This tool gives you full control: you can delete what you don\'t want (like your home address coordinates) while preserving or adding the helpful tags that protect your creative ownership.',
                ],
              },
              {
                q: 'Does editing the EXIF data change the visual quality of my picture?',
                a: [
                  'Think of your photo as a framed painting hanging in a museum. The visual pixels are the colorful paint on the front of the canvas, while the metadata is a tiny paper sticker pasted on the back of the wooden frame.',
                  'When you type a new author name or update the copyright notice in this tool, we are only writing letters on that paper sticker on the back of the frame. We do not touch, re-paint, or alter the paint on the front of your picture at all.',
                  'For JPEG photos, the raw pixel bytes remain completely untouched. The colors, sharpness, focus, and detail of your image remain identical to how they were when you snapped the shutter.',
                  'If you upload a PNG image, the tool will package it into a crisp, high-quality JPEG container so that the standardized camera metadata tags can be embedded cleanly.',
                ],
              },
              {
                q: 'What format should I use for the Date & Time field?',
                a: [
                  'Computers are very polite but can be a little bit picky about how dates are written down. While humans might write "July 4th, 2025" or "10/13/2026", digital cameras across the world agreed to write dates using a standard pattern: Year:Month:Day Hour:Minute:Second.',
                  'For example, if your photo was taken on Christmas morning at ten o\'clock, the camera writes it as "2025:12:25 10:00:00". The colons separate the numbers so every computer in the world can understand it without getting confused.',
                  'To make your life super easy, our editor includes a "Set Today\'s Time" button that automatically creates the exact, perfect date format for you in a single tap!',
                  'If you prefer to type your own date, just make sure to keep the numbers and colons in that order, and any photo viewer or gallery app will instantly recognize your timestamp.',
                ],
              },
              {
                q: 'Does anyone on your team see my photos or the author names I type?',
                a: [
                  'No, absolutely never! This is the most important promise of our entire toolkit. Most websites on the internet take your photo, upload it to their cloud computers across the world, modify it on their servers, and then send it back.',
                  'Our website does not work that way at all. When you open this page, our code downloads right into your browser and turns your computer into a private darkroom studio.',
                  'All the reading, editing, and saving of your image happens inside the temporary memory of your web browser. If you turn off your Wi-Fi after opening this page, the tool still works perfectly!',
                  'We never see your photos, we never store what you type, and the moment you close the tab, everything disappears from your browser memory forever.',
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
