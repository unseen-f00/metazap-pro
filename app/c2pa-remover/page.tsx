import type { Metadata } from 'next';
import CoreRemoverTool from '@/app/components/CoreRemoverTool';

export const metadata: Metadata = {
  title: 'C2PA Remover | Strip AI Content Credentials & Provenance Online',
  description:
    'Remove C2PA provenance metadata, JUMBF manifests, and cryptographic AI generation tags from your photos. 100% private, free, and in-browser.',
};

export default function Page() {
  const faqs = [
    {
      q: 'What is C2PA Content Credentials and why are big companies putting it on photos?',
      a: [
        'Imagine if every single time you drew a picture with crayons or took a snapshot on your camera, a giant robot from a huge technology corporation stamped a thick, invisible government passport onto the back of your paper! That passport is what tech companies call "C2PA Content Credentials."',
        'C2PA was created by a group of giant tech and camera companies (like Adobe, Microsoft, Sony, and OpenAI). Their goal was to create a digital birth certificate for images. Every time an image is made or edited, the software writes down who made it, which camera snapped it, which software opened it, and whether an artificial intelligence robot painted any part of the scene.',
        'This birth certificate is locked with heavy cryptographic math (like an unbreakable digital padlock) called a manifest. It sits inside special data containers called JUMBF boxes embedded right into the JPEG or PNG file.',
        'Whenever someone inspects the photo on a website or with special browser buttons (like the little "CR" icon you might see on news websites), a little popup window appears showing the entire history of who touched the picture and what edits were made.',
        'While that was invented to fight fake news, it also means your personal creative workflow, your software license information, your computer name, and your private edit steps are stamped onto your artwork forever unless you wipe it clean!',
      ],
    },
    {
      q: 'Why do artists, creators, and photographers want to remove C2PA stamps?',
      a: [
        'Creative people love having freedom and privacy over their work! If you are a digital artist, a freelance designer, or a photographer delivering photos to a paying client, you might not want the client or your competitors knowing your internal secrets.',
        'Leaving C2PA credentials attached can reveal which AI models you used to generate backgrounds, which Photoshop plugins you installed, how many hours you spent retouching, and what your computer username is.',
        'Some social media algorithms and platforms also use C2PA stamps to demote, penalize, or slap warning labels on artwork that used any digital enhancements, even if you just used a simple sharpening tool.',
        'Additionally, photographers who value freedom of expression do not like the idea that a centralized database or big tech consortium has to "verify" their family photos before people are allowed to look at them.',
        'Removing C2PA credentials puts you back in the driver’s seat. It strips away the digital tracking passport so your photo is treated as a pure, clean visual image with zero corporate surveillance tags attached.',
      ],
    },
    {
      q: 'How does our browser physically destroy cryptographic AI manifests?',
      a: [
        'You cannot simply erase a C2PA manifest with a regular eraser because the manifest is tied to the file with cryptographic mathematical hashes. If you only delete half of the tag, the file becomes broken or corrupted.',
        'Furthermore, some AI generators weave invisible watermark signatures directly into the subtle colors of the pixels themselves, acting like invisible steganographic fingerprints across the whole canvas.',
        'Our tool uses the revolutionary HTML5 Canvas Re-Rendering method to defeat both layers at once! When you drop your image in, your browser creates a brand new, spotless drawing canvas in its local memory.',
        'It paints your picture onto the fresh canvas and introduces an imperceptible micro-dither to the color values. This micro-dither is completely invisible to human eyes, but it shatters the mathematical patterns of invisible watermarks.',
        'Then, it exports a completely fresh JPEG or PNG file from the canvas. The newly born file has never touched a C2PA manifest, contains zero JUMBF boxes, and has zero cryptographic tracking signatures. It is 100% clean!',
      ],
    },
    {
      q: 'Will removing C2PA credentials make my picture look any different to human eyes?',
      a: [
        'Not at all! Your picture will look exactly as gorgeous, sharp, colorful, and vibrant as the original artwork. The visual light hitting your eyes is completely identical.',
        'Think of an expensive designer jacket that comes with an electronic security tag clamped onto the zipper. When the shopkeeper removes the plastic security tag with a special magnet, does the jacket tear, shrink, or change color? Of course not! The jacket looks just as fashionable, but now you can wear it home without setting off store alarms.',
        'Our canvas engine operates at full 1:1 hardware pixel resolution. If your artwork is 3840 pixels wide and 2160 pixels tall (4K resolution), the canvas copies every single one of those pixels with studio fidelity.',
        'Every character’s face, every brush stroke, and every vivid contrast is preserved with absolute optical beauty.',
        'The only difference is that the invisible corporate tracking tag is gone forever. Your art is ready to be shared, printed, or published anywhere in total privacy!',
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      {/* Editorial Masthead */}
      <header className="mb-10 text-center max-w-3xl mx-auto">
        <div className="editorial-kicker mb-3">
          VOL. XI // PROVENANCE PURGE &amp; MANIFEST STRIPPING
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-ink dark:text-chalk mb-4 leading-tight">
          C2PA Remover
        </h1>
        <p className="font-serif italic text-base sm:text-lg text-ink/75 dark:text-chalk/75 leading-relaxed">
          Surgical decoupling of JUMBF provenance containers, Adobe Content Credentials manifests, and cryptographic AI tracking headers.
        </p>

        {/* Technical Specification Bar */}
        <div className="mt-6 pt-4 border-t border-hairline flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] text-ink/60 dark:text-chalk/60 uppercase tracking-widest">
          <span>CONTAINER: JUMBF EXCLUSION</span>
          <span className="opacity-40">/</span>
          <span>CRYPTOGRAPHIC MANIFEST: PURGED</span>
          <span className="opacity-40">/</span>
          <span>AIR-GAPPED OPERATION</span>
        </div>
      </header>

      {/* Interactive Tool with Transparent Progress Stepper */}
      <CoreRemoverTool toolType="c2pa" />

      <section className="max-w-4xl mx-auto mt-16 space-y-10">
        {/* Explanatory Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          <article className="editorial-card p-6 md:p-8 space-y-4">
            <div className="editorial-kicker">DISPATCH // CORPORATE WATERMARKING</div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink dark:text-chalk">
              What is C2PA? (The invisible government passport)
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-ink/80 dark:text-chalk/80 leading-relaxed font-sans">
              <p>
                Imagine every time you draw a picture or take a snapshot of a flower, a giant robot stamps an invisible official passport onto the back of your paper. That passport lists who made the drawing, what brand of crayons were used, what digital tools were clicked, and whether a computer robot helped you draw the trees.
              </p>
              <p>
                Big tech corporations call this &ldquo;C2PA Content Credentials.&rdquo; It is a metadata specification that embeds digital tracking manifests directly inside image files.
              </p>
              <p>
                Whenever you export a picture from modern software or AI platforms, C2PA records the application name, editing history, and cryptographic signatures in special JUMBF boxes.
              </p>
              <p>
                Our C2PA Remover takes away that digital tracking passport so your photo is treated as a pure, clean image that belongs to you and nobody else!
              </p>
            </div>
          </article>

          <article className="editorial-card p-6 md:p-8 space-y-4">
            <div className="editorial-kicker">TECHNICAL RESYNTHESIS // SHATTERING HASHES</div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink dark:text-chalk">
              How our deep clean destroys cryptographic stamps
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-ink/80 dark:text-chalk/80 leading-relaxed font-sans">
              <p>
                You cannot simply scratch off a C2PA stamp with a normal eraser because it is locked with high-tech cryptographic math and woven into the pixel colors.
              </p>
              <p>
                If you try to delete just a piece of the tag, the file gets confused and might not open at all. Normal metadata tools do not know how to handle these advanced manifests.
              </p>
              <p>
                Our tool uses HTML5 Canvas Re-Rendering to trace your picture onto a fresh, brand new canvas in browser memory. It applies subtle pixel micro-smoothing that shatters invisible watermark patterns.
              </p>
              <p>
                Then it exports a brand-new image file that has zero ties to the old C2PA manifest. Your picture looks completely beautiful, but the digital tracking passport is gone forever!
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
