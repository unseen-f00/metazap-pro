import type { Metadata } from 'next';
import CoreRemoverTool from '@/app/components/CoreRemoverTool';

export const metadata: Metadata = {
  title: 'HEIC Metadata Remover | Clean iPhone Photo Data Online',
  description:
    'Strip hidden GPS coordinates, iPhone camera models, and timestamps from Apple HEIC photos. 100% private, free, and runs entirely in your browser.',
};

export default function Page() {
  const faqs = [
    {
      q: 'What kind of private secrets are hiding inside Apple iPhone HEIC photos?',
      a: [
        'Whenever someone in your family snaps a photo with an Apple iPhone or iPad, the device does something very sneaky. It does not just save the pretty smiling faces or the birthday cake; it also acts like a little secret agent writing in a private diary tucked inside the picture file!',
        'This diary is saved in a special digital language called EXIF and Apple MakerNotes. It writes down the exact iPhone model you own—like iPhone 15 Pro or iPhone 13—and even the exact lens sensor serial numbers. It notes whether you had your screen brightness turned up, how wide the camera lens opened, and the exact software version running on your phone.',
        'Worst of all, if location permissions are turned on, your iPhone listens to satellites in outer space and writes down your exact latitude and longitude numbers. These map pins are so accurate that they point directly to your front porch, your living room couch, or your school playground.',
        'It even embeds a tiny miniature preview picture called a thumbnail. If you cropped out something private from the big picture, that tiny hidden thumbnail inside the Apple file might still show the private background you thought you cut away!',
        'Our HEIC Metadata Remover opens up that secret Apple diary right in your browser, takes an eraser to all those private numbers and locations, and hands you back a clean, safe photo with zero secrets attached.',
      ],
    },
    {
      q: 'Why can’t regular Windows computers or older web browsers open HEIC photos?',
      a: [
        'Imagine if everyone in your neighborhood spoke English, but someone invented their own private secret code language that only their family understood. If you gave a book written in that secret language to your teacher, your teacher would say: "I cannot read this book at all!"',
        'That is exactly what happened with HEIC! Apple started using the High Efficiency Image Container (HEIC) format because it squeezes pictures into smaller file sizes so your phone memory does not fill up as fast. But older Windows laptops, Android phones, and many internet websites never learned how to read Apple’s secret format.',
        'When you try to double-click an HEIC photo on an older computer, it often shows a blank gray box or an error message saying the file is unsupported. That makes it really frustrating when you want to show your vacation photos to friends who do not own iPhones.',
        'Our browser tool has a built-in translator! It knows how to read Apple’s HEIC format directly in your web browser, unpack the picture pixels, and turn it into a high-quality, universal image that every computer on Earth can open effortlessly.',
        'Best of all, during that translation, it sweeps away all the dangerous GPS coordinates and Apple device serial numbers, so your converted picture is both universally viewable and completely private!',
      ],
    },
    {
      q: 'Does cleaning an iPhone photo make it look less colorful or grainy?',
      a: [
        'Not even a tiny speck! Your picture will look just as colorful, bright, sharp, and gorgeous as it did on your iPhone’s OLED retina screen. There is zero loss in visual beauty.',
        'Think of a new toy that comes inside a shiny cardboard box. On the outside of the box is a big mailing sticker with your home address and the store receipt. If you peel that mailing sticker off the cardboard box and throw it into the trash, does the superhero toy inside break or change color? Of course not!',
        'In digital photography, the visual picture is made of millions of microscopic colored light dots called pixels. The metadata is just a tiny text tag glued to the file header on the outside of the pixel box.',
        'Our tool only touches the text tags on the outside. It never shrinks your picture dimensions, never compresses your colors into dull shades, and never makes the edges fuzzy.',
        'When you download your cleaned photo and show it to your family, they will see the exact same crisp, vibrant memories—just without any hidden tracking beacons attached.',
      ],
    },
    {
      q: 'Are my family pictures uploaded to a cloud computer or server?',
      a: [
        'No, never! This is the most important promise of our entire toolkit. When you use typical free converter websites on the internet, they make you upload your personal photos over the internet wires to a giant computer server in a faraway warehouse.',
        'That means complete strangers or computer companies could store copies of your family photos, your vacation moments, or your private documents on their hard drives. Even if they claim they delete files later, you never truly know who had access to them.',
        'Our tool does not work like that at all. We built our tool using smart browser code that runs 100% locally on your own computer, tablet, or phone. It is like giving your web browser a pair of clean safety scissors and an eraser.',
        'Your iPhone picture is read directly into your device’s memory, converted and cleaned by your device’s own processor, and saved straight back to your downloads folder. Not a single pixel or byte is ever sent over the internet.',
        'You could even load this web page, turn your computer onto Airplane Mode or unplug your Wi-Fi router, and clean your HEIC photos smoothly. That proves your privacy is completely secure in your own hands!',
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      {/* Editorial Masthead */}
      <header className="mb-10 text-center max-w-3xl mx-auto">
        <div className="editorial-kicker mb-3">
          VOL. XIV // APPLE HEIC CONTAINER &amp; MAKERNOTE PURGE
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-ink dark:text-chalk mb-4 leading-tight">
          HEIC Metadata Remover
        </h1>
        <p className="font-serif italic text-base sm:text-lg text-ink/75 dark:text-chalk/75 leading-relaxed">
          In-browser decoding and sanitization of Apple HEIC/HEIF containers. Purges iOS GPS coordinates, hardware lens serials, and MakerNote payloads.
        </p>

        {/* Technical Specification Bar */}
        <div className="mt-6 pt-4 border-t border-hairline flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] text-ink/60 dark:text-chalk/60 uppercase tracking-widest">
          <span>PARSER: HEIC2ANY / CLIENT DECODER</span>
          <span className="opacity-40">/</span>
          <span>APPLE MAKERNOTES: DESTROYED</span>
          <span className="opacity-40">/</span>
          <span>AIR-GAPPED OPERATION</span>
        </div>
      </header>

      {/* Interactive Tool with Transparent Progress Stepper */}
      <CoreRemoverTool toolType="heic-clean" />

      <section className="max-w-4xl mx-auto mt-16 space-y-10">
        {/* Explanatory Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          <article className="editorial-card p-6 md:p-8 space-y-4">
            <div className="editorial-kicker">DISPATCH // APPLE CONTAINER FORENSICS</div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink dark:text-chalk">
              What is an Apple HEIC photo? (The shiny Apple gift box)
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-ink/80 dark:text-chalk/80 leading-relaxed font-sans">
              <p>
                When you take a photo with an Apple iPhone, Apple wraps the picture inside a high-tech digital container called HEIC. Think of it like a very fancy, shiny gift box with a special electronic lock on top.
              </p>
              <p>
                Apple designed this shiny box so pictures take up less room on your phone. But inside that same box, Apple also slips in a secret paper note. That note writes down the exact iPhone model you were holding, which iOS software version you had, and whether your camera lens had dust or scratches.
              </p>
              <p>
                Even worse, if your iPhone knows where you are in the world, it drops a shiny satellite map pin into the box! That pin points straight down to your bedroom, your backyard, or your school bus stop.
              </p>
              <p>
                Our tool acts like a friendly helper who unlocks the shiny Apple box in your browser, dumps the secret paper note and map pin into the trash, and hands you back a clean, safe photo that you can share with total confidence!
              </p>
            </div>
          </article>

          <article className="editorial-card p-6 md:p-8 space-y-4">
            <div className="editorial-kicker">DEFENSIVE HYGIENE // GEOGRAPHIC BOUNDARIES</div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink dark:text-chalk">
              Why cleaning iPhone photos protects your private home
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-ink/80 dark:text-chalk/80 leading-relaxed font-sans">
              <p>
                Think about inviting a friend over to play video games or eat cookies. You give them your address because you know them and trust them. But you would never tape your home address and bedroom floor plan to a telephone pole on the street corner for any stranger to see!
              </p>
              <p>
                When you post an uncleaned iPhone photo onto social media, a public marketplace, or a group chat, anyone who downloads that file can open the secret Apple diary. They can see the exact street where you took the picture and what time you were there.
              </p>
              <p>
                If you post photos of your pet in your backyard every afternoon, a stranger could piece together your daily schedule without ever talking to you. That is information that should always stay private and protected.
              </p>
              <p>
                Running your iPhone pictures through our HEIC cleaner erases that digital trail completely. Your friends still get to see the cute puppy and the delicious birthday cake, but your home and your personal life stay your safe secrets!
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
