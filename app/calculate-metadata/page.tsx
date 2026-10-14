import type { Metadata } from 'next';
import AnalyzerTool from '@/app/components/AnalyzerTool';

export const metadata: Metadata = {
  title: 'Calculate Metadata Size | Inspect Image Overhead & Bloat Online',
  description:
    'Calculate how much file size and byte overhead hidden metadata takes up in your photos. 100% free, private, and runs in your browser.',
};

export default function Page() {
  const faqs = [
    {
      q: 'How does metadata add extra weight to my photo files?',
      a: [
        'Think of an image file like a shipping box you get in the mail. Inside the box is the nice pair of shoes you ordered (the visual image pixels). But the shipping company also filled the rest of the box with plastic packing peanuts, bubble wrap, advertising flyers, and thick paper cardboard!',
        'In digital photography, the camera and editing software do something very similar. When a camera saves a JPEG or PNG, it does not just write down the colored dots of the picture. It also adds camera MakerNotes, color profile lookup tables, and preview thumbnails.',
        'These preview thumbnails are actually whole extra miniature photos compressed into the header! A single thumbnail can weigh between 10 kilobytes to 100 kilobytes all on its own.',
        'If you edit your photo in apps like Photoshop or Lightroom, the software embeds long XML text packets called XMP that describe every brush stroke and revision history, easily adding another 20 to 50 kilobytes of pure text bloat.',
        'When you multiply that extra weight across hundreds or thousands of photos on your phone, you end up wasting hundreds of megabytes of storage space on invisible text notes that you never even look at!',
      ],
    },
    {
      q: 'Will stripping metadata overhead make my photos load faster on websites?',
      a: [
        'Yes, noticeably faster! If you run a website, an online store, a photography portfolio, or a blog, page speed is one of the most important things for keeping visitors happy.',
        'When someone visits your website on their smartphone, their phone has to download every single byte of every image file over cellular signals or Wi-Fi before the page finishes loading.',
        'If an image file is 500 kilobytes, but 50 kilobytes of that is hidden EXIF and thumbnail bloat, you are forcing your visitors to download 10% more data than necessary for zero extra visual benefit!',
        'By stripping away the metadata overhead with our tool, your image files become leaner and more streamlined. The visual picture stays 100% identical in sharpness and resolution, but the file loads much quicker.',
        'Google and search engines also love fast-loading websites, so stripping metadata bloat can actually help your website rank higher in search results!',
      ],
    },
    {
      q: 'Does removing the byte overhead shrink the image width or height in pixels?',
      a: [
        'Not even by a single pixel! Your image dimensions—such as 4032 pixels wide by 3024 pixels tall—will remain completely identical before and after cleaning.',
        'To understand why, let’s imagine a framed painting hanging on a museum wall. On the wooden frame at the bottom is a brass nameplate that says who painted it and what year it was made. If you unscrew the brass nameplate, does the canvas painting shrink or get smaller? Of course not! The painting stays the exact same size.',
        'In digital picture files, image dimensions are controlled by the pixel raster grid. The metadata is just the brass nameplate sitting in the header block.',
        'When our tool calculates and strips the metadata overhead, it only removes the nameplate and the packing peanuts. It leaves every single pixel of your drawing or photo untouched.',
        'Your megapixels, aspect ratio, and optical sharpness stay 100% intact, while your file sheds the invisible dead weight!',
      ],
    },
    {
      q: 'How does the calculator measure the exact weight of metadata in my browser?',
      a: [
        'Our calculator works by opening up the digital blueprint of your image file right inside your web browser using client-side JavaScript binary parsers.',
        'Every image format follows strict international file rules. In JPEG files, the file starts with marker 0xFFD8, followed by marker segments like APP0, APP1 (which holds EXIF and XMP), APP2 (which holds ICC color profiles), and APP13 (which holds Photoshop IPTC).',
        'Our code walks through these marker segments byte-by-byte and measures their exact byte lengths. It calculates the sum of all header markers and compares that number to the Start of Scan (SOS) marker where the actual picture pixels begin.',
        'For PNG files, our tool measures the exact size of text chunks like tEXt, zTXt, and iTXt, along with timestamp chunks like tIME.',
        'It then divides the metadata bytes by the total file size to give you an exact, transparent percentage showing you precisely how much invisible overhead is attached to your picture!',
      ],
    },
  ];

  return (
    <section className="max-w-5xl mx-auto px-6 py-16 md:py-20">
      <div className="paper-card p-8 md:p-12 mb-10 shadow-paper border border-slate-200/80 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300 text-xs font-semibold mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
          Structure &amp; Overhead Calculator · 100% Client-Side
        </div>
        <h1 className="font-[family-name:var(--font-merriweather)] text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
          Calculate Metadata
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          See how much invisible byte overhead, thumbnail bloat, and EXIF payload is embedded in your photos, and calculate potential storage savings.
        </p>
      </div>

      {/* Interactive Analyzer Tool with Transparent Stepper */}
      <AnalyzerTool toolType="calculator" />

      <section className="max-w-4xl mx-auto mt-16 space-y-12">
        {/* Explanatory Sections with Massive ELI5 Content */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="paper-card p-6 md:p-8 space-y-4 border border-slate-200/80 dark:border-slate-800">
            <h2 className="font-[family-name:var(--font-merriweather)] text-2xl font-bold text-slate-900 dark:text-white mb-2">
              What is metadata overhead? (Weighing the backpack)
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Imagine getting ready to walk to school in the morning. You put your backpack on your shoulders, and it feels surprisingly heavy! You set the bag on the bathroom scale, and the scale reads 10 pounds.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Your mom opens up the bottom zipper pocket and finds five heavy rocks and old toy batteries that you forgot were in there! When you take the rocks out, your textbooks and homework are still completely safe, but the bag is suddenly light and easy to carry.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              That is exactly what metadata overhead is for digital pictures! Every time you save a photo, your phone packs extra digital rocks into the file header—like preview thumbnails and long software history notes.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Our calculator acts like the bathroom scale! It tells you the exact weight of the picture, how many kilobytes are taken up by invisible rocks, and how much lighter your file could be!
            </p>
          </div>

          <div className="paper-card p-6 md:p-8 space-y-4 border border-slate-200/80 dark:border-slate-800">
            <h2 className="font-[family-name:var(--font-merriweather)] text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Why trimming metadata overhead saves storage
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Have you ever seen a red warning message on your phone that says: &ldquo;Storage Almost Full! Please delete apps or photos&rdquo;? It is one of the most annoying warnings in the world!
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Most people assume all the file space is taken up by their beautiful pictures. But if you have 5,000 photos on your phone, and each photo carries 30 kilobytes of hidden metadata bloat, that adds up to 150 megabytes of completely wasted space!
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Trimming that metadata away gives you back your storage space without having to delete a single one of your precious memories or lowering the picture quality.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              It keeps your photo gallery lean, speeds up backups to your computer, and ensures your device runs smoothly and quickly!
            </p>
          </div>
        </div>

        {/* FAQs */}
        <div>
          <div className="text-center mb-8">
            <h2 className="font-[family-name:var(--font-merriweather)] text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
              Frequently Asked Questions (Explained for Everyone)
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Learn how metadata bloat affects file size and how our calculator measures byte overhead.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((item, i) => (
              <details
                key={i}
                className="group border border-slate-200/90 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:border-indigo-200 dark:hover:border-indigo-800 transition-all overflow-hidden"
              >
                <summary className="cursor-pointer px-6 py-4.5 font-semibold text-slate-900 dark:text-white select-none flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-800/60 transition-colors">
                  <span className="text-base text-slate-800 dark:text-slate-200 pr-4">{item.q}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 transition-transform duration-200 group-open:rotate-180 shrink-0 text-sm">
                    ▾
                  </span>
                </summary>
                <div className="px-6 pb-6 pt-3 text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed border-t border-slate-100/60 dark:border-slate-800 space-y-3">
                  {item.a.map((paragraph, pIdx) => (
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
