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

  return (
    <section className="max-w-5xl mx-auto px-6 py-16 md:py-20">
      <div className="paper-card p-8 md:p-12 mb-10 shadow-paper border border-slate-200/80 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300 text-xs font-semibold mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
          Selective GPS Stripper · Preserves Camera & Date
        </div>
        <h1 className="font-[family-name:var(--font-merriweather)] text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
          Remove GPS from Photos
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Strip exact GPS location tags from your photos before sharing them online. Keep your home, school, and workplace private.
        </p>
      </div>

      {/* Selective GPS Remover Tool */}
      <CoreRemoverTool toolType="gps" />

      <section className="max-w-4xl mx-auto mt-16 space-y-12">
        {/* Explanatory Sections with Massive ELI5 Content */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="paper-card p-6 md:p-8 space-y-4 border border-slate-200/80 dark:border-slate-800">
            <h2 className="font-[family-name:var(--font-merriweather)] text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Why erase hidden map pins? (The trail of breadcrumbs)
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Have you ever heard the fairy tale of Hansel and Gretel leaving breadcrumbs along the forest path so they could find their way home? When your phone takes a picture with location enabled, it leaves digital breadcrumbs everywhere you go!
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Every time you snap a photo of your breakfast, your bedroom, your garden, or your school playground, a shiny breadcrumb is baked right into the photo. Anyone who downloads that photo can follow those breadcrumbs right to your front door.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Strangers on the internet do not need to know where you live or what route you walk your dog every morning. Your neighborhood and home are private spaces meant just for you, your family, and your close friends.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Our GPS remover sweeps away those breadcrumbs before you post your pictures online. It leaves the photo beautiful, while turning off the invisible trail so nobody can ever follow you home!
            </p>
          </div>

          <div className="paper-card p-6 md:p-8 space-y-4 border border-slate-200/80 dark:border-slate-800">
            <h2 className="font-[family-name:var(--font-merriweather)] text-2xl font-bold text-slate-900 dark:text-white mb-2">
              How selective GPS removal works (Keeping the good memories)
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Imagine drawing a lovely picture in art class. In the corner of the paper, you write: &ldquo;Drawn by me on my birthday with my favorite colored markers.&rdquo; But the teacher also stamped your home street address at the bottom of the page.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              You want to show everyone the picture and let them know which markers you used, but you definitely do not want your home address stamped there for all the kids to see. That is exactly what our selective cleaner does!
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              It uses a precision digital eraser that rubs away only the street address and map numbers, while keeping the date stamp, the time, and the camera model completely untouched.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              This way, your photo album on your computer stays neatly organized in chronological order, but anyone who downloads the photo sees zero clues about where on Earth you were standing!
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
              Learn how GPS coordinates get inside your pictures and how our selective tool keeps you safe.
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
