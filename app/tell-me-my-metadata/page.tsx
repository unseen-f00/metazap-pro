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
    <section className="max-w-5xl mx-auto px-6 py-16 md:py-20">
      <div className="paper-card p-8 md:p-12 mb-10 shadow-paper border border-slate-200/80 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300 text-xs font-semibold mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
          Deep Metadata Inspector · 100% Client-Side
        </div>
        <h1 className="font-[family-name:var(--font-merriweather)] text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
          Tell Me My Metadata
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Inspect all hidden camera settings, GPS coordinates, timestamps, and software tags buried inside your photos before you share them online.
        </p>
      </div>

      {/* Interactive Analyzer Tool with Transparent Stepper */}
      <AnalyzerTool toolType="viewer" />

      <section className="max-w-4xl mx-auto mt-16 space-y-12">
        {/* Explanatory Sections with Massive ELI5 Content */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="paper-card p-6 md:p-8 space-y-4 border border-slate-200/80 dark:border-slate-800">
            <h2 className="font-[family-name:var(--font-merriweather)] text-2xl font-bold text-slate-900 dark:text-white mb-2">
              What is this viewer? (The magic x-ray machine)
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Imagine finding a mysterious birthday present wrapped in colorful paper. From the outside, all you can see is the shiny wrapping and the ribbon. But what if you had a magic superhero x-ray machine that could peek right through the paper?
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              That magic x-ray machine is exactly what this tool is for digital photos! When you look at an image on your phone screen, you only see the visual picture—the trees, the sunset, or your smiling friends.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Our tool looks beneath the visual surface and reads all the hidden notes tucked inside the file header. It shows you the camera model, the exact time you took the shot, and whether there are map coordinates pointing to your house.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              It organizes everything into clean, easy-to-read tables so you can see exactly what secrets your photo is carrying before you show it to anyone else!
            </p>
          </div>

          <div className="paper-card p-6 md:p-8 space-y-4 border border-slate-200/80 dark:border-slate-800">
            <h2 className="font-[family-name:var(--font-merriweather)] text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Why looking inside is the smartest thing to do
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Before you hand your backpack to a friend or leave it at school, it is always a smart idea to unzip the front pockets and make sure you did not leave your house keys or secret diary inside.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Checking your photos works the exact same way. Most people share pictures on the internet without ever realizing that their phone stamped their home address or camera serial number inside the file.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              By using this viewer, you get to see the honest truth. If you see your home address or sensitive timestamps in the table, you know you should clean the photo before uploading it.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Knowledge is your superpower! When you know what is hiding inside your pictures, you are in total control of your own digital privacy.
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
              Discover what hidden metadata tags are and how inspecting them protects your privacy.
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
