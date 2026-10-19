import type { Metadata } from 'next';
import CoreRemoverTool from '@/app/components/CoreRemoverTool';

export const metadata: Metadata = {
  title: 'XMP Remover | Strip Adobe Lightroom & Photoshop Tags',
  description:
    'Remove hidden Adobe XMP tags, edit history, and star ratings from JPEG, PNG, and TIFF photos. 100% free and runs in your browser.',
};

export default function Page() {
  const faqs = [
    {
      q: 'What is an XMP packet and what kind of secrets does it hold?',
      a: [
        'XMP stands for "Extensible Metadata Platform," which is a fancy computer name created by Adobe—the company that makes popular creative apps like Photoshop and Lightroom. You can think of an XMP packet as a little digital diary written in a special code called XML.',
        'Unlike basic camera tags that only hold simple numbers, an XMP packet is like a whole miniature book glued inside your image file. It sits inside a special digital compartment known as an APP1 marker segment in JPEG files or a text chunk in PNG files.',
        'It keeps a detailed logbook of everything you did in your photo editing program. If you brightened the shadows, adjusted skin tones, cropped the edges, or applied custom color grading curves, the XMP packet can remember every single slider adjustment you moved!',
        'It can also store star ratings (like giving a picture 5 stars), color labels, copyright notices, author names, and even the exact folder path on your computer where the project was saved (like /Users/YourName/Documents/SecretProject/).',
        'When you share the photo, anyone with a simple text editor or metadata inspection tool can open up that diary and read everything you did. Our XMP cleaner removes that entire diary cleanly in the blink of an eye!',
      ],
    },
    {
      q: 'Why do professional artists and photographers clean XMP before sharing files?',
      a: [
        'Professional photographers and digital artists work for hours or even days perfecting a special visual style. They tweak color balances, contrast curves, and lighting recipes to create their signature look that makes their work famous.',
        'If they send a JPEG with intact XMP data to a client or upload it online, someone else could open the XMP data and see the exact recipes, slider values, and presets used to create that look. It is just like giving away your grandma’s secret chocolate chip cookie recipe to everyone on the street!',
        'Furthermore, in creative agencies and commercial studios, files often pass through multiple designers, retouchers, and art directors. Leaving XMP can leak internal revision comments, old draft timestamps, and previous editor usernames.',
        'Stripping XMP guarantees that you are delivering a clean, final, polished master file. The client gets the gorgeous visual output without any unnecessary digital baggage or confidential internal notes.',
        'It protects your trade secrets, maintains your professional polish, and ensures your creative workflow and artistic recipes stay yours alone.',
      ],
    },
    {
      q: 'Does stripping XMP ruin the colors, filters, or edits I worked so hard on?',
      a: [
        'Absolutely not! When you export a photo from Photoshop or Lightroom as a JPEG or PNG, all your edits are already permanently baked into the visual pixel dots.',
        'The vibrant colors, the cropped edges, the smoothed lighting, and the artistic filters are part of the image itself. The XMP packet is just a text diary describing what you did in the past.',
        'Think of baking a delicious birthday cake: once the cake is fully baked and frosted, throwing away the written recipe card does not make the cake disappear or change its taste! The cake is already baked and ready to eat.',
        'Our tool leaves every single pixel untouched. It only searches the file for the specific XML block (the APP1 segment starting with http://ns.adobe.com/xap/1.0/) and neatly unhooks it from the file.',
        'The resulting image looks 100% identical in every color, tone, and line, but it no longer carries the heavy diary of past edits.',
      ],
    },
    {
      q: 'Can people see what other software or computer folders I used if I leave XMP on?',
      a: [
        'Yes, very often they can. Adobe applications frequently write your computer’s internal file system paths directly into the XMP payload.',
        'For example, an XMP block might contain an entry showing that the file was originally opened from a folder like C:\\Users\\YourRealName\\Desktop\\SecretProject\\Draft3.psd.',
        'That leaks your real operating system username, your computer folder naming scheme, and even private client project names that you might have agreed to keep confidential under a non-disclosure agreement.',
        'It also records the exact software version number you used, such as Adobe Photoshop 2024, and whether any third-party plugins or filters were active on your computer.',
        'Running your exported photos through our XMP remover wipes all these computer traces in less than a second, ensuring your private computer files and usernames remain completely invisible.',
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      {/* Editorial Masthead */}
      <header className="mb-10 text-center max-w-3xl mx-auto">
        <div className="editorial-kicker mb-3">
          VOL. XIII // ADOBE XMP PACKET DECOUPLING &amp; WORKFLOW SANITIZATION
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-ink dark:text-chalk mb-4 leading-tight">
          XMP Remover
        </h1>
        <p className="font-serif italic text-base sm:text-lg text-ink/75 dark:text-chalk/75 leading-relaxed">
          Strips embedded Adobe Photoshop revision logs, Lightroom develop presets, and XML workflow packets from image container headers.
        </p>

        {/* Technical Specification Bar */}
        <div className="mt-6 pt-4 border-t border-hairline flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] text-ink/60 dark:text-chalk/60 uppercase tracking-widest">
          <span>SEGMENT: APP1 (http://ns.adobe.com/xap/1.0/)</span>
          <span className="opacity-40">/</span>
          <span>DEVELOP PRESETS: PURGED</span>
          <span className="opacity-40">/</span>
          <span>AIR-GAPPED BYTE FILTER</span>
        </div>
      </header>

      {/* XMP Specific Remover Tool */}
      <CoreRemoverTool toolType="xmp" />

      <section className="max-w-4xl mx-auto mt-16 space-y-10">
        {/* Explanatory Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          <article className="editorial-card p-6 md:p-8 space-y-4">
            <div className="editorial-kicker">DISPATCH // WORKFLOW ARTIFACTS</div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink dark:text-chalk">
              What is Adobe XMP? (The artist’s secret sketchbook)
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-ink/80 dark:text-chalk/80 leading-relaxed font-sans">
              <p>
                Imagine an artist painting a magnificent portrait of a superhero. Then, on the back of the wooden canvas frame, they tape a secret notebook showing every sketch they erased, every color mix they tried, what store they bought their paints from, and their private diary entries.
              </p>
              <p>
                That secret taped notebook is exactly what Adobe XMP metadata is! When you use powerful editing tools like Photoshop, Lightroom, or Illustrator, the software silently creates an XML packet that documents your editing steps.
              </p>
              <p>
                It stores details about your color balance changes, exposure adjustments, crop ratios, star ratings, and even private revision notes from earlier versions of the file.
              </p>
              <p>
                Our XMP remover gently detaches that secret notebook from the back of the canvas. The finished artwork stays 100% flawless, while the private notes and sketches stay safely in your hands!
              </p>
            </div>
          </article>

          <article className="editorial-card p-6 md:p-8 space-y-4">
            <div className="editorial-kicker">COMMERCIAL PRIVACY // INTELLECTUAL DEFENSE</div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink dark:text-chalk">
              Why removing XMP protects your creative secrets
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-ink/80 dark:text-chalk/80 leading-relaxed font-sans">
              <p>
                If you deliver artwork or photos to a client, you want them to see the beautiful finished result. You do not want them to know your internal computer folder paths, which software version you ran, or how many times you had to redo a specific layer.
              </p>
              <p>
                Leaving XMP packets attached to your files can also reveal confidential project code names, timestamps showing you finished a project at 3:00 AM, or preset settings you worked months to develop.
              </p>
              <p>
                Competitors or curious inspectors can easily open these packets with free online tools and reverse-engineer your artistic process.
              </p>
              <p>
                Our tool strips out the XMP XML packet cleanly while leaving standard camera EXIF data alone if you want it. Your delivery stays clean, professional, and completely leak-free!
              </p>
            </div>
          </article>
        </div>

        {/* FAQs */}
        <section className="editorial-card p-6 md:p-10">
          <div className="editorial-kicker mb-2">FIELD INQUIRIES // TECHNICAL DISPATCHES</div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-ink dark:text-chalk mb-8 tracking-tight">
            Frequently Addressed Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((item, i) => (
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
                  {item.a.map((paragraph, pIdx) => (
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
