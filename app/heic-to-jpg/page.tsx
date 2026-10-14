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
    <section className="max-w-5xl mx-auto px-6 py-16 md:py-20">
      <div className="paper-card p-8 md:p-12 mb-10 shadow-paper border border-slate-200/80 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400"></span>
          Privacy-First HEIC Converter · 100% Client-Side
        </div>
        <h1 className="font-[family-name:var(--font-merriweather)] text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
          HEIC to JPG Converter
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Convert Apple HEIC photos into universal JPG images with all personal metadata and GPS tags cleanly removed. Fast, free, and completely in your browser.
        </p>
      </div>

      {/* Interactive Tool with Transparent Progress Stepper */}
      <CoreRemoverTool toolType="heic-convert" />

      <section className="max-w-4xl mx-auto mt-16 space-y-12">
        {/* Explanatory Sections with Massive ELI5 Content */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="paper-card p-6 md:p-8 space-y-4 border border-slate-200/80 dark:border-slate-800">
            <h2 className="font-[family-name:var(--font-merriweather)] text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Why turn Apple HEIC into universal JPG? (The universal key)
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Imagine an iPhone speaks a special private language that only Apple devices can understand. If you send that file to your grandmother’s Windows computer, a school website, or an Android phone, the computer says: &ldquo;I do not know how to read this strange file!&rdquo;
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              JPG is the friendly universal language of digital pictures. Every single computer, phone, website, and digital photo frame on the planet understands JPG instantly.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              When you convert your iPhone photos into JPGs, you never have to worry about whether a website or friend can open your picture. It opens everywhere without any errors.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Our converter does this translation in one quick second, making your photos easy to share, print, and enjoy anywhere you go!
            </p>
          </div>

          <div className="paper-card p-6 md:p-8 space-y-4 border border-slate-200/80 dark:border-slate-800">
            <h2 className="font-[family-name:var(--font-merriweather)] text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Converting with 100% privacy (No snooping clouds)
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Most free converter websites on the internet make you upload your private photos to their giant computer servers in a faraway warehouse. But why would you send private photos of your kids or vacation across the world just to change a file format?
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Sending photos to unfamiliar servers is risky because you never know who might save a copy or use your photos to train robot computers.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Our tool does the entire conversion right inside your own web browser. Your photo never travels across the internet wires, and no server ever sees your picture.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              It also scrubs away all GPS map coordinates during the conversion, so the JPG you download is both universally compatible and completely private!
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
              Everything you need to know about converting Apple HEIC photos into clean, universal JPGs.
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
