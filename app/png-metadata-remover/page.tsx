import type { Metadata } from 'next';
import CoreRemoverTool from '@/app/components/CoreRemoverTool';

export const metadata: Metadata = {
  title: 'PNG Metadata Remover | Clean PNG Text Chunks Online',
  description:
    'Strip hidden text chunks (tEXt, zTXt, iTXt) and timestamps from PNG files without recompressing. 100% free and private in your browser.',
};

export default function Page() {
  const faqs = [
    {
      q: 'What are PNG chunks and why do editing apps hide text inside them?',
      a: [
        'Think of a PNG picture file like a colorful toy tower built out of plastic Lego blocks stacked neatly in a row. In computer speak, each plastic block is called a "chunk." Every chunk has a specific four-letter name printed on the side that tells your computer what is inside.',
        'The most important blocks are the ones that hold the visual shapes, colors, and transparent stickers—like the header block named IHDR and the image pixel block named IDAT. Without those blocks, the picture would not exist at all.',
        'But software programs like Photoshop, GIMP, Blender, and web browsers often sneak their own extra blocks into the stack! These extra blocks have names like tEXt (plain written words), zTXt (squeezed secret text), and iTXt (international letters).',
        'Inside these text blocks, editing programs write down the name of your computer, which software version you ran, the date and second you saved the file, and sometimes even secret messages or user notes from older versions of the image.',
        'Our PNG Metadata Remover acts like a careful builder who lifts those unnecessary text blocks right out of the plastic tower, slides them into the recycling bin, and snaps the core picture blocks right back together without touching the artwork!',
      ],
    },
    {
      q: 'Will stripping PNG text blocks mess up my transparent background or cutouts?',
      a: [
        'Never! Your transparent background will remain 100% crisp, clean, and see-through. Not a single pixel of your artwork or cutout silhouette will be affected.',
        'PNG files are famous because they can have invisible glass backgrounds. If you draw a cartoon sticker or a company logo, you can paste it over a blue website, a green video game, or a pink poster, and only the sticker shows—the background is completely invisible!',
        'This invisible glass magic is controlled by the alpha channel stored deep inside the IDAT image data block. It has nothing to do with the text chunks like tEXt or iTXt where metadata lives.',
        'Our cleaner is specially programmed to know the difference between image rendering blocks and metadata annotation blocks. It strictly preserves the IHDR, PLTE (palette colors), tRNS (transparency keys), and IDAT blocks.',
        'When you download your cleaned PNG, you will have the exact same transparent sticker with sharp, smooth edges—just with zero hidden text notes or author stamps attached.',
      ],
    },
    {
      q: 'Can artificial intelligence tools hide prompts inside PNG text chunks?',
      a: [
        'Yes, they do this all the time! If you use AI art generators like Stable Diffusion, ComfyUI, Automatic1111, or NovelAI to generate images, the software usually outputs a PNG file.',
        'When it saves that PNG, it secretly writes a huge essay inside a tEXt or iTXt chunk named "parameters" or "prompt." That essay contains the exact words you typed, the negative prompt, the seed number, the sampler name, and how many steps the AI robot took to draw the picture.',
        'Anyone who downloads your artwork from a forum, Discord server, or social media feed can drag that PNG file into an inspection tool or even a simple text viewer and read your entire creative prompt verbatim in less than two seconds!',
        'If you worked hard for hours testing combinations of adjectives, lighting terms, and artist styles to get a breathtaking image, leaving that text chunk attached gives away your secret recipe to everyone on the internet.',
        'Our PNG cleaner scans for those text chunks and wipes them clean, giving you complete ownership and privacy over your digital artwork and prompt craft.',
      ],
    },
    {
      q: 'Does cleaning PNG chunks compress or lower the sharp edges of my graphic?',
      a: [
        'No, not even a fraction of a hair! In technical terms, PNG is what computer scientists call a "lossless" format. That means every single pixel is mathematically exact and never gets blurry or degraded.',
        'When our tool cleans your PNG, it does NOT re-encode or re-compress the image data at all. It does not run the pixels through a canvas or convert them into a JPEG.',
        'Instead, it performs a pure binary stream operation. It walks through the file byte-by-byte, copies the exact original pixel chunks (IDAT), and only skips over the metadata text chunks.',
        'Because the pixel chunks are copied bit-for-bit, the visual quality of your PNG remains 100% identical to the original master file. Lines stay razor-sharp, text stays perfectly crisp, and colors stay vibrant.',
        'In fact, your cleaned PNG file will actually be slightly smaller in file size because the discarded text blocks no longer take up space on your hard drive!',
      ],
    },
  ];

  return (
    <section className="max-w-5xl mx-auto px-6 py-16 md:py-20">
      <div className="paper-card p-8 md:p-12 mb-10 shadow-paper border border-slate-200/80 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300 text-xs font-semibold mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
          PNG Chunk Parser · Preserves Alpha Transparency
        </div>
        <h1 className="font-[family-name:var(--font-merriweather)] text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
          PNG Metadata Remover
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Strip hidden text chunks (tEXt, iTXt, zTXt), AI prompts, and creation timestamps from your PNG images without losing transparency or image quality.
        </p>
      </div>

      {/* Interactive Tool with Transparent Progress Stepper */}
      <CoreRemoverTool toolType="png-chunks" />

      <section className="max-w-4xl mx-auto mt-16 space-y-12">
        {/* Explanatory Sections with Massive ELI5 Content */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="paper-card p-6 md:p-8 space-y-4 border border-slate-200/80 dark:border-slate-800">
            <h2 className="font-[family-name:var(--font-merriweather)] text-2xl font-bold text-slate-900 dark:text-white mb-2">
              How PNG files store secret messages (The plastic toy blocks)
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Unlike ordinary JPEG photos that put all their notes in one big envelope, a PNG picture is built out of little plastic toy blocks stacked in a row. In computer terms, these blocks are called &ldquo;chunks.&rdquo;
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Some blocks hold the actual colors and shapes (IDAT), some hold the image dimensions (IHDR), and other sneaky blocks hold written words, timestamps, and computer notes (tEXt, iTXt, zTXt).
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              When you edit a PNG in Photoshop or generate an image with an AI tool, the software quietly inserts a text block into the stack. It records your software version, the date and minute you clicked save, and even the exact prompt you typed!
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Our PNG cleaner goes through the stack, unclips those sneaky text blocks, and throws them away. The blocks holding your visual picture snap right back together, leaving your graphic clean, safe, and private!
            </p>
          </div>

          <div className="paper-card p-6 md:p-8 space-y-4 border border-slate-200/80 dark:border-slate-800">
            <h2 className="font-[family-name:var(--font-merriweather)] text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Preserving pure transparency while discarding notes
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              PNG pictures are super popular because they can have invisible glass backgrounds. If you make a cartoon sticker or a brand logo, you can paste it over any background color and you will never see an ugly white box around it.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Many cheap converter tools break this invisible glass when trying to clean metadata because they convert the picture into a JPEG or flatten the layers into white paper. That ruins all your hard design work!
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Our tool is built specifically for PNG files. It parses the binary chunk structure and protects the transparency keys (tRNS) and color palette (PLTE) with absolute care.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              You get back the exact same transparent cutout with razor-sharp edges and beautiful colors, just completely scrubbed of any private software tags or author info!
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
              Learn how PNG binary chunks work and why cleaning them keeps your graphics pristine.
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
