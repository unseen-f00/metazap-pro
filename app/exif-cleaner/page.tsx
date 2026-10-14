import type { Metadata } from 'next';
import CoreRemoverTool from '@/app/components/CoreRemoverTool';

export const metadata: Metadata = {
  title: 'EXIF Cleaner | Deep Clean & Canvas Re-Rendering Online',
  description:
    'Deep clean photos and bypass social media tracking using HTML5 Canvas re-rendering. Physically wipes all steganography, invisible watermarks, and C2PA tags.',
};

export default function Page() {
  const faqs = [
    {
      q: 'What is HTML5 Canvas re-rendering and how is it like tracing paper?',
      a: [
        'HTML5 Canvas is like an invisible digital drawing easel built directly into your web browser. When you drop your picture into this tool, your computer creates a brand new, completely blank white canvas in its memory that is the exact same width and height as your original photo.',
        'Next, it looks at your photo and paints every single visual color dot onto this fresh canvas, just like a master artist placing a sheet of clear glass over a drawing and tracing every line and color with fresh crayons.',
        'None of the old file’s baggage—no camera serial numbers, no GPS map breadcrumbs, no color profile chunks, no editing histories, and no tracking tags—are allowed onto the canvas. The canvas only accepts visual light and color dots.',
        'Once the painting is finished on the canvas, the browser takes a brand new digital snapshot of the canvas and exports it as a freshly created image file (Blob).',
        'This means the output file was literally born one second ago right on your computer screen. It has no past, no parents, and no hidden attachments. It is the cleanest possible digital picture file that can exist!',
      ],
    },
    {
      q: 'What are invisible watermarks, steganography, and C2PA credentials?',
      a: [
        'When you hear the word "watermark," you probably picture a big logo or translucent text stamped across a photo. But modern computer watermarks can be completely invisible to human eyes!',
        'Steganography is a fancy computer trick where secret messages or tracking codes are hidden inside the tiny, subtle color variations of individual pixels. A computer can tweak one blue pixel out of ten thousand by 0.1% brightness to spell out a tracking number across the whole photo without you ever seeing it.',
        'Newer systems like C2PA (Content Credentials) and AI watermarks attach cryptographic digital signatures to images to track where they came from, who edited them, and which cameras or AI models generated them.',
        'Normal EXIF strippers only delete file header text. They cannot touch steganography or pixel-level watermarks because those watermarks live inside the picture data itself.',
        'Canvas re-rendering completely defeats this! By decoding the image into raw color arrays and re-encoding it into a fresh JPEG or WebP container with imperceptible micro-dither, all hidden mathematical patterns and C2PA markers are physically destroyed.',
      ],
    },
    {
      q: 'Why is Deep Cleaning the best choice for social media and private sharing?',
      a: [
        'When you upload photos to social media networks, messaging platforms, or public forums, many companies scan incoming files for tracking markers, camera signatures, and image hashes to build profiles about you and your habits.',
        'Even if an app claims they remove EXIF data upon upload, they might inspect and log that data on their servers first before discarding it. Or they might inject their own invisible tracking hashes into the file so they can track where your photo travels across the web!',
        'Deep Cleaning your photos beforehand ensures that the platform receives a completely virgin, untracked image file. There are zero previous hashes, zero metadata, and zero embedded tracking markers for algorithms to grab onto.',
        'It gives journalists, privacy-conscious families, activists, and everyday internet users the ultimate shield against algorithmic surveillance and image fingerprinting.',
        'You get pure peace of mind knowing that what you post is strictly visual art, completely stripped of digital surveillance trackers.',
      ],
    },
    {
      q: 'Does redrawing the picture onto a fresh canvas make the image lose its sharp details?',
      a: [
        'No! Our canvas re-renderer works at full 1:1 hardware pixel resolution. If your photo is 4000 pixels wide and 3000 pixels tall, the canvas is created at the exact same 4000 by 3000 pixel dimensions.',
        'Every face, tree leaf, sparkle in someone’s eye, and line of text is copied with extreme optical fidelity. The image does not get blurry, fuzzy, or resized.',
        'When the canvas exports the new image file, it uses high-quality image encoding (0.95 quality rating) so the colors, contrast, and crispness are preserved with studio-grade fidelity.',
        'Unless you zoom in 800% with a microscope looking for single-pixel sub-quantization, the re-rendered image looks virtually identical to the original file.',
        'You get complete forensic destruction of hidden watermarks without sacrificing the stunning visual beauty and sharpness of your photography!',
      ],
    },
  ];

  return (
    <section className="max-w-5xl mx-auto px-6 py-16 md:py-20">
      <div className="paper-card p-8 md:p-12 mb-10 shadow-paper border border-slate-200/80 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-300 text-xs font-semibold mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-400"></span>
          HTML5 Canvas Re-Rendering · Steganography & C2PA Bypass
        </div>
        <h1 className="font-[family-name:var(--font-merriweather)] text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
          EXIF Cleaner &amp; Deep Clean
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Neutralize invisible watermarks, steganography, and hidden C2PA tags using HTML5 Canvas re-rendering for complete privacy.
        </p>
      </div>

      {/* Deep Clean Canvas Re-rendering Tool */}
      <CoreRemoverTool toolType="canvas" />

      <section className="max-w-4xl mx-auto mt-16 space-y-12">
        {/* Explanatory Sections with Massive ELI5 Content */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="paper-card p-6 md:p-8 space-y-4 border border-slate-200/80 dark:border-slate-800">
            <h2 className="font-[family-name:var(--font-merriweather)] text-2xl font-bold text-slate-900 dark:text-white mb-2">
              How Canvas Re-Rendering works (Tracing onto clean paper)
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Imagine you have an old drawing on a piece of cardboard. On the back of the cardboard, someone stamped invisible robot barcodes, dirty fingerprints, and tracking numbers. Even if you try to scrub the back, some of the ink soaked right through into the paper fibers.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Instead of trying to wash the dirty cardboard, what if you laid a brand new, spotless sheet of tracing paper on top? With clean crayons, you trace the exact same colorful picture onto the fresh sheet.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Then you take the old stamped cardboard and throw it into the paper shredder! You walk away holding only the fresh new paper, which has never touched a stamp or dirty fingerprint in its life.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              That is exactly how HTML5 Canvas re-rendering works inside your web browser. It recreates your image on a brand new virtual canvas and exports an entirely new file, completely severing all ties to the original file’s hidden history!
            </p>
          </div>

          <div className="paper-card p-6 md:p-8 space-y-4 border border-slate-200/80 dark:border-slate-800">
            <h2 className="font-[family-name:var(--font-merriweather)] text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Why deep cleaning destroys invisible watermarks
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Did you know that some high-tech websites and artificial intelligence tools hide secret messages right inside the tiny color tints of your picture? It is called steganography, and it works like writing in invisible ink between the pixels.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Standard metadata strippers only erase text headers like camera brands and dates. They cannot touch steganography because those secret codes are hidden inside the image pixels themselves.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Our Deep Clean tool draws the picture onto an HTML5 Canvas, applies imperceptible pixel micro-smoothing, and re-compresses it as a brand new image Blob.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              This process physically scrambles and shatters the mathematical patterns of invisible watermarks, steganographic payloads, and C2PA credentials while leaving the visual picture crisp and clear to human eyes!
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
              Everything you need to know about Canvas re-rendering, steganography, and deep cleaning.
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
