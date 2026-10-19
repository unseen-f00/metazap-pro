import type { Metadata } from 'next';
import CoreRemoverTool from '@/app/components/CoreRemoverTool';

export const metadata: Metadata = {
  title: 'HEIC to JPG Converter | Fast, Clean & 100% Private In-Browser',
  description:
    'Convert Apple HEIC photos into universal high-quality JPG images while completely stripping hidden GPS and camera data. 100% free and in-browser.',
};

export default function Page() {
  const faqs = [
    {
      q: 'Will my converted JPG picture work on any computer, tablet, or phone?',
      a: [
        'Yes, absolutely everywhere in the entire world! JPG (also called JPEG) is the most famous and friendly picture format in computer history. It is like a magical universal key that opens every single lock on every digital device.',
        'Whether your friend uses a Windows laptop, an Android phone, a Chromebook at school, a Kindle reader, or a smart television in the living room, every single gadget knows how to display a JPG picture in a split second.',
        'Apple’s HEIC format, on the other hand, is like a secret code book that only newer iPhones and iPads know how to read. When you try to upload HEIC to older photo printing websites, job portals, or email services, the website gets confused and rejects the file.',
        'By converting your HEIC photo into a crisp JPG right here, you transform it into a universal picture that anyone can open, print, edit, and enjoy without needing special apps or software.',
        'It makes sharing your memories completely effortless, no matter what kind of computer or phone your friends and family are using!',
      ],
    },
    {
      q: 'Are the GPS location tags and camera serial numbers erased during conversion?',
      a: [
        'Yes! That is what makes our converter completely different from ordinary file converters on the internet. Most basic converters just copy all your hidden metadata straight into the new file, which means your home address and private camera notes travel right along with it.',
        'Our converter is built with privacy as the number one rule. When it takes the visual picture out of the Apple HEIC container, it leaves behind all the hidden tracking tags, device serial numbers, and satellite map coordinates.',
        'It creates a brand new, clean JPG file that contains 100% of the visual picture and 0% of the tracking data. Latitude and longitude are completely wiped.',
        'That means you get the best of both worlds: a universal JPG file that anyone can view, plus complete peace of mind that your home address and daily habits are kept safely hidden.',
        'You can post the resulting JPG on public forums, upload it to photo printing kiosks, or email it to coworkers without worrying about who might inspect the file header.',
      ],
    },
    {
      q: 'Does turning HEIC into JPG make the picture blurry or lose its sharp details?',
      a: [
        'Not at all! Your converted picture will look just as sharp, clear, and bright as the moment you clicked the shutter button on your phone. There is zero visible blurriness or fuzziness.',
        'To understand how this works, imagine drawing a colorful picture in a small pocket sketchbook. If you redraw that exact same picture onto a standard sheet of printing paper with the exact same colored pencils, does the drawing get blurry? No, it looks just as wonderful!',
        'Our conversion engine renders the HEIC image at maximum quality (0.95 studio rating). It copies every eyelash, every leaf on a tree, and every sparkle of sunshine with extreme optical fidelity.',
        'The picture dimensions remain identical—if your original photo was 4000 pixels wide and 3000 pixels tall, the converted JPG is also 4000 pixels wide and 3000 pixels tall.',
        'Unless you zoom in 500 times with a computer microscope looking for microscopic pixels, your eyes will see the exact same gorgeous masterpiece!',
      ],
    },
    {
      q: 'How does our browser translate the Apple file without sending it over the internet?',
      a: [
        'Almost all other file converter websites tell your computer: "Send your picture across the internet wires to our giant computer server in another country so we can convert it for you." But that means a stranger’s computer holds your personal photos!',
        'We believe your private family pictures should never leave your own hands. That is why our converter uses modern web technology (called WebAssembly and client-side JavaScript) to run the entire translation engine directly inside your web browser tab.',
        'Think of it like having a miniature photo processing darkroom built right inside your Google Chrome or Apple Safari window on your desk. Your computer does all the work using its own internal brain.',
        'Because your file never leaves your computer, the conversion happens almost instantly without waiting for slow internet upload bars or buffering wheels.',
        'You could even disconnect your Wi-Fi router completely while converting, and the tool will still convert your HEIC images into clean JPGs with flying colors!',
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      {/* Editorial Masthead */}
      <header className="mb-10 text-center max-w-3xl mx-auto">
        <div className="editorial-kicker mb-3">
          VOL. XXII // HEIC CONTAINER DECODING &amp; UNIVERSAL JPEG EMISSION
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-ink dark:text-chalk mb-4 leading-tight">
          HEIC to JPG Converter
        </h1>
        <p className="font-serif italic text-base sm:text-lg text-ink/75 dark:text-chalk/75 leading-relaxed">
          Air-gapped translation decoding Apple HEIC containers into universal high-fidelity JPEGs with complete elimination of satellite GPS pins and device serials.
        </p>

        {/* Technical Specification Bar */}
        <div className="mt-6 pt-4 border-t border-hairline flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] text-ink/60 dark:text-chalk/60 uppercase tracking-widest">
          <span>SOURCE: HEIC / HEIF</span>
          <span className="opacity-40">/</span>
          <span>TARGET: HIGH-FIDELITY JPEG</span>
          <span className="opacity-40">/</span>
          <span>AIR-GAPPED COMPILATION</span>
        </div>
      </header>

      {/* Interactive Tool with Transparent Progress Stepper */}
      <CoreRemoverTool toolType="heic-convert" />

      <section className="max-w-4xl mx-auto mt-16 space-y-10">
        {/* Explanatory Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          <article className="editorial-card p-6 md:p-8 space-y-4">
            <div className="editorial-kicker">INTEROPERABILITY // UNIVERSALITY</div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink dark:text-chalk">
              Why turn Apple HEIC into universal JPG? (The universal key)
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-ink/80 dark:text-chalk/80 leading-relaxed font-sans">
              <p>
                Imagine an iPhone speaks a special private language that only Apple devices can understand. If you send that file to your grandmother’s Windows computer, a school website, or an Android phone, the computer says: &ldquo;I do not know how to read this strange file!&rdquo;
              </p>
              <p>
                JPG is the friendly universal language of digital pictures. Every single computer, phone, website, and digital photo frame on the planet understands JPG instantly.
              </p>
              <p>
                When you convert your iPhone photos into JPGs, you never have to worry about whether a website or friend can open your picture. It opens everywhere without any errors.
              </p>
              <p>
                Our converter does this translation in one quick second, making your photos easy to share, print, and enjoy anywhere you go!
              </p>
            </div>
          </article>

          <article className="editorial-card p-6 md:p-8 space-y-4">
            <div className="editorial-kicker">SECURITY // ISOLATED CONVERSION</div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink dark:text-chalk">
              Converting with 100% privacy (No snooping clouds)
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-ink/80 dark:text-chalk/80 leading-relaxed font-sans">
              <p>
                Most free converter websites on the internet make you upload your private photos to their giant computer servers in a faraway warehouse. But why would you send private photos of your kids or vacation across the world just to change a file format?
              </p>
              <p>
                Sending photos to unfamiliar servers is risky because you never know who might save a copy or use your photos to train robot computers.
              </p>
              <p>
                Our tool does the entire conversion right inside your own web browser. Your photo never travels across the internet wires, and no server ever sees your picture.
              </p>
              <p>
                It also scrubs away all GPS map coordinates during the conversion, so the JPG you download is both universally compatible and completely private!
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
