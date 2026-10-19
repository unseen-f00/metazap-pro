import type { Metadata } from 'next';
import AnalyzerTool from '@/app/components/AnalyzerTool';

export const metadata: Metadata = {
  title: 'Tell Me My Metadata | Deep EXIF, XMP & Tag Inspector Online',
  description:
    'Inspect all hidden EXIF, GPS location, and camera metadata buried inside your photos. 100% private, free, and runs entirely in your browser.',
};

export default function Page() {
  const faqs = [
    {
      q: 'What kind of hidden tags and notes will this viewer reveal?',
      a: [
        'Whenever you drop a picture into this tool, it acts like a super detective with a giant magnifying glass! It searches through every nook and cranny of the file to find all the secret notes your camera or phone wrote down.',
        'First, it looks at the Camera and Device Hardware tags. It reveals the exact brand of your camera—like Apple, Samsung, Canon, or Sony—along with the exact model name, the software version, and even the serial number of your camera glass lens.',
        'Next, it inspects the Exposure and Shutter settings. It tells you how bright the sunshine was, what fraction of a second the camera eyelid blinked open, how wide the pupil opened, and whether the flash flashed like a tiny lightning strike.',
        'Most importantly, it checks for GPS location tags. If your phone knew where you were standing, it reveals the exact latitude and longitude numbers pointing to your street, house, or playground, along with how high up in the air you were.',
        'It also checks for Adobe XMP editing history and PNG text chunks. If someone edited the image in Photoshop or generated it with a computer program, it displays all the software notes and timestamps in a clean, readable table!',
      ],
    },
    {
      q: 'Why do some photos show lots of camera tags while others are completely empty?',
      a: [
        'Have you ever noticed that a picture taken directly with your phone has dozens of tags, but a picture you saved from WhatsApp, Instagram, or Twitter has zero tags at all? That can seem like a mystery, but there is a very simple reason!',
        'When you take a fresh picture with your phone’s camera app, the phone saves the raw, original file with its full invisible backpack attached. It has the camera model, the date, and the GPS coordinates all packed inside.',
        'However, when you send a photo through certain messaging apps or upload it to social media, those big social networks run their own cleaning broom over the file. They strip the metadata away on their servers so other people cannot easily see your location.',
        'Screenshots taken on your computer or phone also usually have very few tags because a screenshot is just a quick copy of your screen rather than a photo captured by a real camera lens.',
        'If your photo comes back completely empty in our viewer, that means the file is already clean and pristine! But if it shows dozens of tags, you know it is an uncleaned camera photo that still holds private information.',
      ],
    },
    {
      q: 'Can I wipe all these discovered tags after inspecting them?',
      a: [
        'Yes, with just one simple click! That is why we built a shiny green "Clean & Download" button right at the top of your inspection results.',
        'Once you look through the table and see all the private facts—like your camera model, the exact time you took the shot, or your GPS location—you do not have to go to another website to fix it.',
        'You simply click the green button, and our in-browser cleaning engine instantly snips off all the EXIF headers, GPS directories, and text chunks in memory.',
        'It immediately downloads a clean, safe version of your picture straight into your downloads folder. The downloaded picture will look 100% identical to your original photo, but the metadata will be completely empty.',
        'You can then drag that new clean photo right back into the inspector to verify for yourself that every single private tag was wiped away forever!',
      ],
    },
    {
      q: 'Are my photos uploaded to a server or saved in a database while scanning?',
      a: [
        'No, never! Your privacy is protected with 100% local processing. When you drop your picture into this tool, your file never travels across telephone poles, Wi-Fi antennas, or internet wires to a faraway computer.',
        'Everything happens directly on your own computer or phone inside the web browser tab you are looking at right now. Our JavaScript code reads the file bytes directly from your device’s memory.',
        'Think of it like reading a secret letter with a magnifying glass on your own kitchen table. You do not have to mail the letter to a stranger in another city just to read what is written on it!',
        'Because no files are uploaded to any server, nobody else can ever see your photos, your faces, your pets, or your home coordinates. We do not have any databases or image storage drives.',
        'As soon as you close your browser tab or click "Scan Another," all temporary data is instantly cleared from memory. It is the safest, most private way to inspect your digital photos.',
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      {/* Editorial Masthead */}
      <header className="mb-10 text-center max-w-3xl mx-auto">
        <div className="editorial-kicker mb-3">
          VOL. III // FORENSIC EXIF &amp; METADATA INSPECTOR
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-ink dark:text-chalk mb-4 leading-tight">
          Tell Me My Metadata
        </h1>
        <p className="font-serif italic text-base sm:text-lg text-ink/75 dark:text-chalk/75 leading-relaxed">
          Deep structural diagnostic reading hidden camera settings, GPS coordinates, timestamps, and software tags buried inside your digital photos.
        </p>

        {/* Technical Specification Bar */}
        <div className="mt-6 pt-4 border-t border-hairline flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] text-ink/60 dark:text-chalk/60 uppercase tracking-widest">
          <span>PARSER: EXIF, XMP, IPTC</span>
          <span className="opacity-40">/</span>
          <span>DIAGNOSTIC: MULTI-TIER LEDGER</span>
          <span className="opacity-40">/</span>
          <span>AIR-GAPPED RAM: ZERO NETWORK IO</span>
        </div>
      </header>

      {/* Interactive Analyzer Tool with Transparent Stepper */}
      <AnalyzerTool toolType="viewer" />

      <section className="max-w-4xl mx-auto mt-16 space-y-10">
        {/* Explanatory Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          <article className="editorial-card p-6 md:p-8 space-y-4">
            <div className="editorial-kicker">DISPATCH // RADIOLOGICAL SCAN</div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink dark:text-chalk">
              What is this viewer? (The magic x-ray machine)
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-ink/80 dark:text-chalk/80 leading-relaxed font-sans">
              <p>
                Imagine finding a mysterious birthday present wrapped in colorful paper. From the outside, all you can see is the shiny wrapping and the ribbon. But what if you had a magic superhero x-ray machine that could peek right through the paper?
              </p>
              <p>
                That magic x-ray machine is exactly what this tool is for digital photos! When you look at an image on your phone screen, you only see the visual picture—the trees, the sunset, or your smiling friends.
              </p>
              <p>
                Our tool looks beneath the visual surface and reads all the hidden notes tucked inside the file header. It shows you the camera model, the exact time you took the shot, and whether there are map coordinates pointing to your house.
              </p>
              <p>
                It organizes everything into clean, easy-to-read tables so you can see exactly what secrets your photo is carrying before you show it to anyone else!
              </p>
            </div>
          </article>

          <article className="editorial-card p-6 md:p-8 space-y-4">
            <div className="editorial-kicker">ANALYSIS // DEFENSIVE HYGIENE</div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink dark:text-chalk">
              Why looking inside is the smartest thing to do
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-ink/80 dark:text-chalk/80 leading-relaxed font-sans">
              <p>
                Before you hand your backpack to a friend or leave it at school, it is always a smart idea to unzip the front pockets and make sure you did not leave your house keys or secret diary inside.
              </p>
              <p>
                Checking your photos works the exact same way. Most people share pictures on the internet without ever realizing that their phone stamped their home address or camera serial number inside the file.
              </p>
              <p>
                By using this viewer, you get to see the honest truth. If you see your home address or sensitive timestamps in the table, you know you should clean the photo before uploading it.
              </p>
              <p>
                Knowledge is your superpower! When you know what is hiding inside your pictures, you are in total control of your own digital privacy.
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
