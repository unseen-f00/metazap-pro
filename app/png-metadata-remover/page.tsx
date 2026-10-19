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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      {/* Editorial Masthead */}
      <header className="mb-10 text-center max-w-3xl mx-auto">
        <div className="editorial-kicker mb-3">
          VOL. X // ANCILLARY CHUNK DISSECTION &amp; TRANSPARENCY PRESERVATION
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-ink dark:text-chalk mb-4 leading-tight">
          PNG Metadata Remover
        </h1>
        <p className="font-serif italic text-base sm:text-lg text-ink/75 dark:text-chalk/75 leading-relaxed">
          Lossless binary stream dissection stripping text chunks (tEXt, iTXt, zTXt), AI prompts, and creation timestamps while rigorously preserving alpha transparency.
        </p>

        {/* Technical Specification Bar */}
        <div className="mt-6 pt-4 border-t border-hairline flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] text-ink/60 dark:text-chalk/60 uppercase tracking-widest">
          <span>ALGORITHM: BINARY STREAM CHUNK FILTER</span>
          <span className="opacity-40">/</span>
          <span>ALPHA CHANNEL: 100% PRESERVED</span>
          <span className="opacity-40">/</span>
          <span>AIR-GAPPED BUFFER</span>
        </div>
      </header>

      {/* Interactive Tool with Transparent Progress Stepper */}
      <CoreRemoverTool toolType="png-chunks" />

      <section className="max-w-4xl mx-auto mt-16 space-y-10">
        {/* Explanatory Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          <article className="editorial-card p-6 md:p-8 space-y-4">
            <div className="editorial-kicker">DISPATCH // CONTAINER ARCHITECTURE</div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink dark:text-chalk">
              How PNG files store secret messages (The plastic toy blocks)
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-ink/80 dark:text-chalk/80 leading-relaxed font-sans">
              <p>
                Unlike ordinary JPEG photos that put all their notes in one big envelope, a PNG picture is built out of little plastic toy blocks stacked in a row. In computer terms, these blocks are called &ldquo;chunks.&rdquo;
              </p>
              <p>
                Some blocks hold the actual colors and shapes (IDAT), some hold the image dimensions (IHDR), and other sneaky blocks hold written words, timestamps, and computer notes (tEXt, iTXt, zTXt).
              </p>
              <p>
                When you edit a PNG in Photoshop or generate an image with an AI tool, the software quietly inserts a text block into the stack. It records your software version, the date and minute you clicked save, and even the exact prompt you typed!
              </p>
              <p>
                Our PNG cleaner goes through the stack, unclips those sneaky text blocks, and throws them away. The blocks holding your visual picture snap right back together, leaving your graphic clean, safe, and private!
              </p>
            </div>
          </article>

          <article className="editorial-card p-6 md:p-8 space-y-4">
            <div className="editorial-kicker">TECHNICAL FIDELITY // ALPHA CHANNEL DEFENSE</div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink dark:text-chalk">
              Preserving pure transparency while discarding notes
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-ink/80 dark:text-chalk/80 leading-relaxed font-sans">
              <p>
                PNG pictures are super popular because they can have invisible glass backgrounds. If you make a cartoon sticker or a brand logo, you can paste it over any background color and you will never see an ugly white box around it.
              </p>
              <p>
                Many cheap converter tools break this invisible glass when trying to clean metadata because they convert the picture into a JPEG or flatten the layers into white paper. That ruins all your hard design work!
              </p>
              <p>
                Our tool is built specifically for PNG files. It parses the binary chunk structure and protects the transparency keys (tRNS) and color palette (PLTE) with absolute care.
              </p>
              <p>
                You get back the exact same transparent cutout with razor-sharp edges and beautiful colors, just completely scrubbed of any private software tags or author info!
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
