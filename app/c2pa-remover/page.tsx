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
    <section className="max-w-5xl mx-auto px-6 py-16 md:py-20">
      <div className="paper-card p-8 md:p-12 mb-10 shadow-paper border border-slate-200/80 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-300 text-xs font-semibold mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-400"></span>
          C2PA Provenance Stripper · Neutralizes AI Manifests
        </div>
        <h1 className="font-[family-name:var(--font-merriweather)] text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
          C2PA Remover
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Strip C2PA provenance credentials, JUMBF manifest blocks, and cryptographic AI generation tags from your images in seconds.
        </p>
      </div>

      {/* Interactive Tool with Transparent Progress Stepper */}
      <CoreRemoverTool toolType="c2pa" />

      <section className="max-w-4xl mx-auto mt-16 space-y-12">
        {/* Explanatory Sections with Massive ELI5 Content */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="paper-card p-6 md:p-8 space-y-4 border border-slate-200/80 dark:border-slate-800">
            <h2 className="font-[family-name:var(--font-merriweather)] text-2xl font-bold text-slate-900 dark:text-white mb-2">
              What is C2PA? (The invisible government passport)
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Imagine every time you draw a picture or take a snapshot of a flower, a giant robot stamps an invisible official passport onto the back of your paper. That passport lists who made the drawing, what brand of crayons were used, what digital tools were clicked, and whether a computer robot helped you draw the trees.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Big tech corporations call this &ldquo;C2PA Content Credentials.&rdquo; It is a metadata specification that embeds digital tracking manifests directly inside image files.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Whenever you export a picture from modern software or AI platforms, C2PA records the application name, editing history, and cryptographic signatures in special JUMBF boxes.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Our C2PA Remover takes away that digital tracking passport so your photo is treated as a pure, clean image that belongs to you and nobody else!
            </p>
          </div>

          <div className="paper-card p-6 md:p-8 space-y-4 border border-slate-200/80 dark:border-slate-800">
            <h2 className="font-[family-name:var(--font-merriweather)] text-2xl font-bold text-slate-900 dark:text-white mb-2">
              How our deep clean destroys cryptographic stamps
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              You cannot simply scratch off a C2PA stamp with a normal eraser because it is locked with high-tech cryptographic math and woven into the pixel colors.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              If you try to delete just a piece of the tag, the file gets confused and might not open at all. Normal metadata tools do not know how to handle these advanced manifests.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Our tool uses HTML5 Canvas Re-Rendering to trace your picture onto a fresh, brand new canvas in browser memory. It applies subtle pixel micro-smoothing that shatters invisible watermark patterns.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Then it exports a brand-new image file that has zero ties to the old C2PA manifest. Your picture looks completely beautiful, but the digital tracking passport is gone forever!
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
              Learn how C2PA Content Credentials work and why removing them gives you total digital freedom.
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
