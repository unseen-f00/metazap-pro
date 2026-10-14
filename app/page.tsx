import type { Metadata } from 'next';
import HomeClientTool from '@/app/components/HomeClientTool';

export const metadata: Metadata = {
  title: 'MetaZap - The Ultimate Photo Privacy & Metadata Toolkit',
  description:
    'Remove hidden EXIF data, GPS location coordinates, camera models, and private timestamps from your photos before sharing. 100% free and private in your browser.',
};

export default function HomePage() {
  const faqs = [
    {
      q: 'What kind of secret information is hiding inside my pictures?',
      a: [
        'Imagine you go to a toy store and buy a brand-new superhero toy. When you look closely at the box, there is a big price tag, a barcode sticker, a factory stamp showing which machine built it, and a paper receipt tucked in the corner. Digital photos have something very similar, but instead of paper stickers on a cardboard box, they are digital sticky notes tucked inside the file itself!',
        'Every single time you press the round button to take a picture, your phone’s computer brain writes down a whole diary entry. It writes down the exact brand of your phone—whether it is an iPhone, a Samsung, or a Pixel—and even the exact model number. It writes down the serial number of your camera lens, how fast the camera eye blinked open and shut, and whether the flash flashed like a little lightning bolt.',
        'It also writes down the exact calendar date, the hour, the minute, and the exact second you snapped the photo. If your clock said 3:42 PM and 18 seconds on a sunny Tuesday afternoon, that exact timestamp is frozen into the file forever until somebody peels it off.',
        'But the biggest secret of all is the GPS location. If your phone knows where you are in the world, it calculates tiny numbers called latitude and longitude. Those numbers act like a magic laser beam pointing straight down from space onto the exact tile on your floor or the patch of grass in your backyard where you were standing.',
        'All of these tiny notes together are called "metadata." You cannot see them when looking at your puppy’s fuzzy ears or the birthday cake candles, but any computer program designed to inspect files can read them in less than a second. Peeling these notes off keeps all those private facts to yourself!',
      ],
    },
    {
      q: 'Can strangers really find my home or school just by looking at a photo?',
      a: [
        'Yes, they really can, and that is why learning about this is so important! When you share an uncleaned picture online, you might think people can only see the colors and shapes on their screen. But on a computer, a picture is not just an image—it is a package of data that comes with that secret diary we talked about.',
        'If someone downloads your photo to their laptop or phone, they can right-click on it and choose "Get Info" or open it in a free map app. If your camera recorded your GPS breadcrumbs, the map app will immediately drop a big red pin right onto a satellite map of the whole world!',
        'That red pin can zoom all the way down from the clouds straight to your street. It can show your front driveway, the color of your front door, and even your neighbors’ houses. If you took a picture of your homework or your pet in your bedroom, the red pin points right at your bedroom window!',
        'The same thing happens with photos taken at school or at soccer practice. If you take a picture every Tuesday after soccer, someone could look at five different photos and figure out your weekly schedule without ever speaking to you. That is why parents and privacy experts always warn against sharing raw camera photos.',
        'By putting your photo through our cleaner first, you erase the red map pin completely. When a stranger or a computer tries to look for the location, they just find an empty note that says nothing at all. Your home and school stay your private secrets!',
      ],
    },
    {
      q: 'Do my photos get sent across the internet to a faraway computer?',
      a: [
        'No, absolutely never! This is one of the most special things about our website. When you use most other websites on the internet, they tell your computer: "Hey, send that file over the wires to our giant computer server in a faraway warehouse so we can look at it and fix it." But doing that means a stranger’s computer has a copy of your personal picture!',
        'We think that is the wrong way to do things, especially when you are trying to protect your privacy. Why would you give your private family photos to an unknown server just to delete a location tag? That would defeat the whole purpose of being safe!',
        'Instead, our entire tool is built using smart code that runs directly inside your own web browser—like Google Chrome, Apple Safari, or Mozilla Firefox. Think of it like giving your own computer a pair of clean safety scissors and a little instruction manual. Your computer does all the cutting and peeling right on your own desk!',
        'If you want to test this, you could even load this website, turn off your Wi-Fi or unplug your internet cable completely, and drop a photo into the box. It will still clean your picture instantly! That proves no internet connection is being used to handle your image.',
        'Once you are finished and you close your browser tab or shut off your screen, all temporary memory is wiped clean automatically. We never see your face, we never see your pets, and we never keep a single byte of your data.',
      ],
    },
    {
      q: 'Will peeling off these secret stickers make my picture look blurry or messy?',
      a: [
        'Not at all! Your picture will look exactly as bright, colorful, and sharp as the moment you took it. To understand why, let’s picture a delicious chocolate candy bar wrapped in shiny foil.',
        'On the outside of the foil wrapper, there is a paper price tag stuck with a dab of glue. If you peel the paper price tag off and throw it in the trash, does the chocolate candy bar inside get smushed, melt, or taste different? Of course not! The yummy chocolate bar stays totally perfect because the price tag was just sitting on the outside.',
        'In an image file, the picture itself is made of millions of tiny colored dots called pixels. The pixels are the yummy chocolate bar. The metadata—like the camera model and the GPS coordinates—is just the paper price tag glued onto the file header at the very beginning.',
        'Our tool is very gentle. It carefully snips off the paper tag without touching a single one of your colored pixel dots. It does not shrink the picture, it does not change the lighting, and it does not make the edges fuzzy or jagged.',
        'When you download your cleaned picture and put it side-by-side with your original photo, your eyes will not be able to spot any difference at all. It will be the exact same beautiful picture, just completely free of snooping tags!',
      ],
    },
    {
      q: 'Can I clean photos from an iPhone, an Android tablet, or a big camera?',
      a: [
        'Yes, you can clean photos from almost any device in the whole world! Whether your family uses an Apple iPhone, a Samsung Galaxy phone, a Google Pixel, a tablet you play games on, or a big professional camera with a giant glass lens like a Sony, Canon, or Nikon—all of them can be cleaned here.',
        'Every single one of these gadgets speaks the same digital language when saving images. They almost always create files that end in .jpg, .jpeg, .png, or .webp. Even though each company designs their cameras a little differently, they all put their secret sticky notes in standard header boxes.',
        'Our tool knows how to open all of these standard digital boxes. When you drag in a photo from an iPhone, it knows right where Apple puts the location tags. When you drag in a photo from a Samsung, it knows where Samsung puts the camera settings.',
        'You do not have to change any confusing settings or tell the website what kind of phone you used. You just drop the picture in, and our code automatically figures out what kind of file it is and sweeps it completely clean.',
        'You can even use this on photos you took five years ago that have been sitting in an old photo album on your computer. If they have metadata hiding inside them, our tool will find it and sweep it away in the blink of an eye!',
      ],
    },
  ];

  return (
    <section className="max-w-5xl mx-auto px-6 py-16 md:py-20">
      {/* Hero Section */}
      <div className="paper-card p-8 md:p-14 text-center mb-10 shadow-paper border border-slate-200/80 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300 text-xs font-semibold mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
          100% Browser-Based Privacy · Zero Uploads
        </div>
        <h1 className="font-[family-name:var(--font-merriweather)] text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-5 leading-tight">
          MetaZap: The Ultimate Photo Privacy &amp; Metadata Toolkit
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Remove hidden EXIF tags, GPS location markers, and camera details before sharing pictures online. Fast, simple, and processed right inside your browser.
        </p>
      </div>

      {/* Interactive Tool Area */}
      <HomeClientTool />

      {/* Human-Readable Editorial & Explanatory Sections */}
      <section className="mt-16 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="paper-card p-6 md:p-8 space-y-4 border border-slate-200/80 dark:border-slate-800">
            <h2 className="font-[family-name:var(--font-merriweather)] text-2xl font-bold text-slate-900 dark:text-white mb-2">
              What is photo metadata? (The invisible backpack)
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Imagine you take a sweet picture of your pet dog in the backyard. When you look at the screen, you just see your puppy wagging his tail. But your camera is secretly playing detective! Without asking you, it straps a tiny invisible backpack onto the back of your picture. Inside that backpack, it packs a bunch of little sticky notes.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              On the first sticky note, it writes down the exact minute and second you clicked the button. On another note, it writes down the exact phone you were holding, how big the camera glass was, and how bright the sunshine was outside. It even writes down whether your flash blinked like a little lightning bolt.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Even worse, if your phone has a map turned on, it drops a bright shiny breadcrumb right into the backpack! That breadcrumb has the exact numbers pointing to your backyard, your street, and your bedroom window. If you give that photo to anyone else, they do not just get the puppy—they get the whole invisible backpack, too.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Computer scientists call this backpack &ldquo;EXIF metadata.&rdquo; But you can just think of it as a bunch of sneaky label stickers glued to the back of your drawing. Our website is like a friendly helper who gently unzips the invisible backpack, dumps out all the private sticky notes into the trash, and hands you back just the clean puppy photo!
            </p>
          </div>

          <div className="paper-card p-6 md:p-8 space-y-4 border border-slate-200/80 dark:border-slate-800">
            <h2 className="font-[family-name:var(--font-merriweather)] text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Why remove it before sharing? (Keeping secrets safe)
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Think about what would happen if you drew a secret treasure map of your bedroom and left it on a playground park bench for anyone to pick up. A stranger could look at it and know exactly where you keep your favorite teddy bear, what time you eat dinner, and which door leads into your house. That would not feel very safe, would it?
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              When you send a photo across the internet or put it on a public website, that photo travels to hundreds of computers. If the photo still has its invisible backpack on, curious people or greedy computer robots can open it up. They can read the map numbers to see where you live, where you go to school, and what playground you visit every weekend.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              They can also see when you were away on a trip! If you post a photo from the swimming pool while you are still splashing in the water, the little sticky note says, &ldquo;Taken today at 2 PM three states away!&rdquo; Now people know your real house is empty. That is private information you never wanted to give away to strangers.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Cleaning your picture is just like locking your front door before you go to bed. It does not mean you are doing anything wrong—it just means your home, your family, and your private spaces belong to you and nobody else. When you wipe away the metadata, your photo becomes a simple, pretty picture that keeps your secret clubhouse completely safe!
            </p>
          </div>
        </div>

        {/* How it Works Step-by-Step */}
        <div className="paper-card p-8 md:p-10 mb-16 border border-slate-200/80 dark:border-slate-800">
          <h2 className="font-[family-name:var(--font-merriweather)] text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 text-center">
            How It Works (Easy as 1, 2, 3!)
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-center max-w-2xl mx-auto mb-8 text-sm md:text-base leading-relaxed">
            Cleaning your pictures here is as easy as putting toys into a toy chest. You do not need any special computer skills, no passwords, and no complicated downloads.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-slate-50/70 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center mx-auto mb-3">
                1
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-base mb-2">Drop in Your Picture</h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs md:text-sm leading-relaxed">
                Pick up your picture file and drop it into the upload box. It opens immediately right on your screen without signing up or asking for an email address.
              </p>
            </div>
            <div className="text-center p-4 bg-slate-50/70 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center mx-auto mb-3">
                2
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-base mb-2">The Local Robot Cleans</h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs md:text-sm leading-relaxed">
                A tiny helper robot inside your web browser snips off the invisible backpack, throws away the sticky notes, and leaves your colored pixels untouched.
              </p>
            </div>
            <div className="text-center p-4 bg-slate-50/70 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center mx-auto mb-3">
                3
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-base mb-2">Save &amp; Share Proudly</h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs md:text-sm leading-relaxed">
                Click download to get your brand-new clean photo. Now you can show your photo to friends, post it online, and know your private home is 100% protected.
              </p>
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div>
          <div className="text-center mb-8">
            <h2 className="font-[family-name:var(--font-merriweather)] text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
              Frequently Asked Questions (Explained for Everyone)
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Clear, simple answers with zero confusing words so anyone can understand photo privacy.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((item, index) => (
              <details
                key={index}
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
