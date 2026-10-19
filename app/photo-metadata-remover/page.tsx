import type { Metadata } from 'next';
import CoreRemoverTool from '@/app/components/CoreRemoverTool';

export const metadata: Metadata = {
  title: 'Photo Metadata Remover | Clean EXIF & Camera Info Online',
  description:
    'Quickly strip camera data, GPS coordinates, and timestamps from your photos before sharing. 100% private, free, and runs in your browser.',
};

export default function Page() {
  const faqs = [
    {
      q: 'What hidden data does this general remover peel away?',
      a: [
        'When you take a photo, your camera acts like an eager little secretary scribbling down everything in a secret notepad. It records the exact brand of the camera (like Apple iPhone, Canon Rebel, Samsung Galaxy, or Nikon), the exact model number, and which software version was running inside the camera when you clicked the button.',
        'It also writes down all your camera settings in tiny technical codes called EXIF and TIFF tags. It notes the shutter speed (how fast the camera eye blinked open and shut), the aperture (how wide the camera pupil opened to let light in), the ISO sensitivity, and whether the flash flashed like a little lightning bolt.',
        'Even more, it records the exact moment you snapped the photo down to the split second, as well as thumbnail images. Modern cameras embed small mini-photos inside the header so file folders can show previews quickly. Even if you crop your big photo later, that tiny hidden thumbnail might still show the uncropped original scene!',
        'It also sweeps away GPS coordinates, altitude markers, compass directions, and color space profiles. Our general remover goes through the file header with a clean digital broom and sweeps out every single one of these tags into the trash.',
        'When it finishes, only the pure picture pixels are left. The invisible notepad is discarded completely, leaving you with a fresh, safe picture file that has zero secrets attached to it.',
      ],
    },
    {
      q: 'Will my picture look washed out, blurry, or smaller after cleaning?',
      a: [
        'Not even a tiny bit! Your picture will look exactly as bright, sharp, and colorful as the very second you took it. There is zero loss in visual quality or resolution.',
        'Think of a delicious birthday cake inside a cardboard bakery box. On top of the box is a delivery sticker with the baker’s phone number and your home address. If you take a pair of scissors and carefully peel off that delivery sticker, does the cake inside lose its sprinkles, melt, or taste different? Of course not! The yummy cake stays totally perfect.',
        'In computer files, image pixels (the millions of tiny colored dots that make up the actual picture) live in their own special room. The metadata lives outside in the hallway in a separate header block right at the beginning of the file.',
        'Our tool never enters the pixel room with paintbrushes or scissors. It only sweeps the hallway. It leaves the pixel dimensions, the resolution (DPI), the color values, and the sharpness 100% untouched.',
        'If you compare the cleaned image and the original image side by side on a giant television or zoom in closely on your computer screen, your eyes will not be able to spot any difference at all. It is identical in visual beauty!',
      ],
    },
    {
      q: 'Why is it safer to clean my photos directly in my own browser window?',
      a: [
        'On the regular internet, when you use a typical file converter or free cleaner, your computer bundles up your photo and sends it across the internet to a giant computer server in a faraway warehouse owned by that company.',
        'That means your private photos—photos of your kids, your home, your vacation, or your private documents—are sitting on a stranger’s hard drive. Even if the website promises they delete files, you never truly know who has access or if someone could peek inside.',
        'Our tool works completely differently. We wrote special code that runs right inside your web browser (like Chrome, Safari, Edge, or Firefox). It is like giving your own computer its own private workshop right on your desk.',
        'Your photo is read directly from your device into your browser’s temporary memory. The metadata tags are sliced off right there on your own processor. The cleaned file is handed straight back to you without a single byte ever being sent over the internet wires.',
        'You could even load this web page, turn off your Wi-Fi completely, and drop a photo in—it will still clean your picture instantly! That gives you 100% peace of mind that your private memories never leave your hands.',
      ],
    },
    {
      q: 'Can I clean photos taken on any phone, camera, or tablet?',
      a: [
        'Yes! You can clean photos from any device in the world that saves standard digital picture files. That includes iPhones, iPads, Android phones, Google Pixel phones, digital compact cameras, and big professional cameras from brands like Sony, Canon, Fuji, and Nikon.',
        'Digital cameras all adhere to international standards for how they store pictures. Whether the file is a JPEG (.jpg, .jpeg), a PNG (.png), or a WebP (.webp), they all organize their files with a header section for metadata and a body section for image pixels.',
        'Our general cleaner knows how to navigate the internal blueprints of all these file formats. It looks for the APP1 markers in JPEGs, the text and chunk headers in PNGs, and the EXIF chunks in WebP files.',
        'It does not matter if your picture was taken ten minutes ago or ten years ago. It does not matter if it was taken in low light with a flash or outside in the bright sunshine. Our cleaner handles all of them effortlessly.',
        'Simply drop any photo up to 20MB into the dropzone box above, and the tool will instantly identify the format, read the headers, and strip all standard metadata tags cleanly.',
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      {/* Editorial Header */}
      <div className="text-center mb-10 max-w-3xl mx-auto">
        <span className="editorial-kicker text-stone-400 dark:text-stone-500 block mb-2">
          TOOL NO. 01 // GENERAL SANITIZER
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-stone-900 dark:text-stone-100 mb-4">
          Photo Metadata Remover
        </h1>
        <p className="text-base sm:text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto leading-relaxed">
          Remove hidden camera details, GPS location coordinates, and timestamps from your photos before posting them online. Clean, simple, and safe.
        </p>
      </div>

      {/* General Metadata Remover Tool */}
      <CoreRemoverTool toolType="general" />

      <section className="max-w-4xl mx-auto mt-20 space-y-12">
        {/* Explanatory Sections */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="editorial-card p-6 md:p-8 space-y-4 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
            <span className="editorial-kicker text-stone-400 dark:text-stone-500 block">
              THE MECHANISM // STICKER PEELING
            </span>
            <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">
              How photo metadata removal works
            </h2>
            <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
              Whenever you buy a new notebook or lunchbox for school, the store slaps a price sticker, a barcode label, and an inventory tag onto the front cover. Digital photos have the exact same kind of stickers, but they are invisible to your naked eyes.
            </p>
            <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
              When you drop your picture into our tool, our software acts like a gentle pair of fingernails sliding under the edge of those stickers. It reads the file header from front to back, identifies every single tag chunk, and peels them away one by one.
            </p>
            <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
              The camera model sticker, the date stamp sticker, and the GPS location sticker are all gently lifted off the file and dropped into the recycling bin.
            </p>
            <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
              Once all the tags are cleared away, the tool saves the clean photo as a fresh file. The original image pixels stay completely untouched, while the sneaky stickers are gone forever!
            </p>
          </div>

          <div className="editorial-card p-6 md:p-8 space-y-4 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
            <span className="editorial-kicker text-stone-400 dark:text-stone-500 block">
              ORIGINS // ARCHIVAL HERITAGE
            </span>
            <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">
              Why every picture carries a hidden pocket
            </h2>
            <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
              Imagine wearing a warm winter coat with a secret inside pocket you never knew about. Inside that pocket, someone tucked a business card with your name, a clock showing what time you left your house, and a map showing everywhere you walked today.
            </p>
            <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
              That is exactly how modern smartphones and digital cameras are designed to work. Camera manufacturers created metadata decades ago to help professional photographers organize thousands of photos in darkrooms and digital libraries.
            </p>
            <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
              While that was helpful for camera clubs in the 1990s, today almost everyone shares photos on public social media, forums, and chat apps. Carrying that hidden pocket into public places means strangers can look inside whenever they want.
            </p>
            <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
              Emptying that pocket with our tool ensures that when you show someone a picture of your dinner, your artwork, or your pet, they only see the picture—and nothing else!
            </p>
          </div>
        </div>

        {/* FAQs */}
        <div>
          <div className="text-center mb-8 pb-4 border-b border-stone-200 dark:border-stone-800">
            <span className="editorial-kicker text-stone-400 dark:text-stone-500 block mb-1">
              QUESTIONS &amp; ANSWERS
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm">
              Simple answers to help you understand how photo metadata works and why wiping it matters.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((item, i) => (
              <details
                key={i}
                className="group border border-stone-200 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-900 shadow-2xs hover:border-stone-400 dark:hover:border-stone-700 transition-all overflow-hidden"
              >
                <summary className="cursor-pointer px-6 py-4 font-serif font-bold text-stone-900 dark:text-stone-100 select-none flex items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-850 transition-colors">
                  <span className="text-sm sm:text-base pr-4">{item.q}</span>
                  <span className="font-mono text-xs text-stone-400 group-open:rotate-180 transition-transform duration-150 shrink-0">
                    ▼
                  </span>
                </summary>
                <div className="px-6 pb-6 pt-3 text-stone-600 dark:text-stone-400 text-xs sm:text-sm leading-relaxed border-t border-stone-100 dark:border-stone-800 space-y-3 font-sans">
                  {item.a.map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
