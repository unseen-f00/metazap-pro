import type { Metadata } from 'next';
import CoreRemoverTool from '@/app/components/CoreRemoverTool';

export const metadata: Metadata = {
  title: 'Remove GPS Location from Photos Online',
  description:
    'Strip GPS coordinates and location data from your photos before sharing. Protect your home and private locations — 100% free and in-browser.',
};

export default function Page() {
  const faqs = [
    {
      q: 'Can a stranger actually find out where I sleep or play from a photo?',
      a: [
        'Yes, they really can, and that is why this tool exists! Modern smartphones have tiny radio antennas inside them that listen to satellites floating high up in outer space. Every single time you snap a photo with location turned on, those satellites calculate your exact spot on Earth.',
        'Your phone takes those numbers—called latitude and longitude—and writes them right into the invisible header of the photo file. These are not general city names; they are super precise coordinates that pinpoint your location down to a single square foot of ground!',
        'Anyone who downloads your raw picture—from an online marketplace, an online forum, a social network, or an email—can open the file in a free map app or right-click to inspect properties. The computer drops a bright red pin on a satellite photo showing your exact house, front driveway, or schoolyard.',
        'If you took the photo in your bedroom, the red pin points straight through your roof. If you take pictures of your pets in your backyard every afternoon, strangers can see where you spend your time without ever talking to you. That is why parents and privacy experts always warn against sharing raw camera photos.',
        'Wiping the GPS numbers with our tool turns off that red beacon completely. When anyone checks the photo, there is zero location data left. Your home, your school, and your secret hideouts stay 100% private and protected!',
      ],
    },
    {
      q: 'Why do we keep the camera name but only erase the GPS map numbers?',
      a: [
        'Many people, photographers, and families love keeping the story of how their pictures were made. They want their digital photo album to remember that a photo was taken on Christmas morning at 8:00 AM, using an iPhone or a special portrait camera lens.',
        'If you use a basic metadata stripper, it throws away everything with a giant broom—including the date, the time, and the camera model. That can break how your phone sorts photos in your timeline, making your photo albums messy and jumbled up.',
        'Our selective GPS remover acts like a precision laser surgeon instead of a blunt hammer! It opens up the photo file and carefully leaves the camera brand, the lens focal length, and the capture date totally intact.',
        'It targets only the specific GPS compartment (known to computer coders as the GPSIFD directory). It gently snips away the latitude, the longitude, the altitude, and the compass heading, and then neatly closes the file back up.',
        'This gives you the best of both worlds: your photos remain perfectly organized in your timeline by date and camera, but all dangerous map breadcrumbs leading to your home are erased forever!',
      ],
    },
    {
      q: 'Does removing GPS location change the picture quality or color in any way?',
      a: [
        'No, not even a fraction of a percent! The actual picture you see with your eyes is made up of millions of tiny colored dots called pixels.',
        'The GPS coordinates are stored in a tiny text block in the file header. They take up less than a couple hundred bytes of space—about as much text as a sentence or two scribbled on the back of an index card.',
        'When our tool wipes those GPS tags, it never touches the pixel values, the colors, the lighting, or the compression settings. It only erases those few lines of text in the header.',
        'Your photo retains 100% of its original sharpness, vibrant colors, and visual resolution. Whether you look at it on a phone screen, display it on a giant 4K television, or print it out on glossy photo paper, it looks identical to the original shot.',
        'Only the invisible map coordinates are gone. It is a completely lossless, risk-free operation that protects your family without sacrificing any picture quality.',
      ],
    },
    {
      q: 'How does my phone know where I am when I take a picture anyway?',
      a: [
        'High above the Earth, dozens of GPS satellites orbit our planet day and night, sending out radio signals like invisible lighthouses in the sky. Your smartphone has a tiny radio receiver built right into its circuit board that listens to these satellite signals.',
        'By measuring how many tiny fractions of a second it takes for signals from four or more satellites to reach your phone, your phone’s computer calculates exactly where you are standing on the planet.',
        'When your camera app has location permission turned on, it asks the GPS receiver: "Where are we right now?" the exact millisecond you tap the round shutter button.',
        'The camera app silently writes those satellite numbers into the image file header alongside the photo pixels before saving the image to your camera roll or photo library.',
        'Even if you turn off location services on your phone later, older photos you took months or years ago still hold those coordinates forever! That is why our selective GPS cleaner is so helpful for cleaning up your existing photo library before you share it.',
      ],
    },
  ];

    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      {/* Editorial Masthead */}
      <header className="mb-10 text-center max-w-3xl mx-auto">
        <div className="editorial-kicker mb-3">
          VOL. II // SELECTIVE GEOLOCATION SANITIZATION
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-ink dark:text-chalk mb-4 leading-tight">
          Remove GPS Location from Photos
        </h1>
        <p className="font-serif italic text-base sm:text-lg text-ink/75 dark:text-chalk/75 leading-relaxed">
          Surgically sever satellite geolocation pins and elevation records from photo headers. Preserves camera metadata, capture timestamps, and optical profile settings.
        </p>

        {/* Technical Specification Bar */}
        <div className="mt-6 pt-4 border-t border-hairline flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] text-ink/60 dark:text-chalk/60 uppercase tracking-widest">
          <span>TARGET: GPSIFD DIRECTORY</span>
          <span className="opacity-40">/</span>
          <span>DATE &amp; TIME: PRESERVED</span>
          <span className="opacity-40">/</span>
          <span>ACCURACY: AIR-GAPPED RAM</span>
        </div>
      </header>

      {/* Selective GPS Remover Tool */}
      <CoreRemoverTool toolType="gps" />

      {/* Editorial Dispatches / ELI5 Content & FAQs */}
      <section className="max-w-4xl mx-auto mt-16 space-y-10">
        <div className="grid md:grid-cols-2 gap-6">
          <article className="editorial-card p-6 md:p-8 space-y-4">
            <div className="editorial-kicker">ANALYSIS // GEOGRAPHIC EXPOSURE</div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink dark:text-chalk">
              Why erase hidden map pins? (The trail of breadcrumbs)
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-ink/80 dark:text-chalk/80 leading-relaxed font-sans">
              <p>
                Have you ever heard the fairy tale of Hansel and Gretel leaving breadcrumbs along the forest path so they could find their way home? When your phone takes a picture with location enabled, it leaves digital breadcrumbs everywhere you go!
              </p>
              <p>
                Every time you snap a photo of your breakfast, your bedroom, your garden, or your school playground, a shiny breadcrumb is baked right into the photo. Anyone who downloads that photo can follow those breadcrumbs right to your front door.
              </p>
              <p>
                Strangers on the internet do not need to know where you live or what route you walk your dog every morning. Your neighborhood and home are private spaces meant just for you, your family, and your close friends.
              </p>
              <p>
                Our GPS remover sweeps away those breadcrumbs before you post your pictures online. It leaves the photo beautiful, while turning off the invisible trail so nobody can ever follow you home!
              </p>
            </div>
          </article>

          <article className="editorial-card p-6 md:p-8 space-y-4">
            <div className="editorial-kicker">PROTOCOL // SELECTIVE SURGERY</div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink dark:text-chalk">
              How selective GPS removal works (Keeping the good memories)
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-ink/80 dark:text-chalk/80 leading-relaxed font-sans">
              <p>
                Imagine drawing a lovely picture in art class. In the corner of the paper, you write: &ldquo;Drawn by me on my birthday with my favorite colored markers.&rdquo; But the teacher also stamped your home street address at the bottom of the page.
              </p>
              <p>
                You want to show everyone the picture and let them know which markers you used, but you definitely do not want your home address stamped there for all the kids to see. That is exactly what our selective cleaner does!
              </p>
              <p>
                It uses a precision digital eraser that rubs away only the street address and map numbers, while keeping the date stamp, the time, and the camera model completely untouched.
              </p>
              <p>
                This way, your photo album on your computer stays neatly organized in chronological order, but anyone who downloads the photo sees zero clues about where on Earth you were standing!
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
}
