import type { Metadata } from 'next';
import AnalyzerTool from '@/app/components/AnalyzerTool';

export const metadata: Metadata = {
  title: 'Photo Privacy Analyzer | Free Privacy Risk Score & GPS Detector',
  description:
    'Scan photos for privacy leaks and calculate your Privacy Risk Score. Detect GPS pins, serial numbers, and personal timestamps locally in your browser.',
};

export default function Page() {
  const faqs = [
    {
      q: 'How does the Privacy Risk Score calculate its number from 0 to 100?',
      a: [
        'Our Privacy Risk Analyzer works just like a watchful digital security guard with a clipboard and a checklist! Every time you drop a photo in, it examines the file headers and looks for specific clues that could expose your private life to strangers.',
        'If it finds exact GPS location tags (latitude and longitude), it immediately adds 55 penalty points to the score because your physical home address is the most sensitive secret you have. That immediately turns the score into the High Risk zone!',
        'If it finds permanent hardware serial numbers from your camera body or phone sensor, it adds another 25 penalty points because companies and trackers can use serial numbers to connect different photos you took across multiple websites.',
        'If it finds exact capture timestamps (like 3:14 PM on a Tuesday), it adds 15 points because timestamps reveal when you were home or away. If it finds your personal name or copyright artist tags, it adds 10 points.',
        'If your photo has zero sensitive tags, the score stays at a perfect 0 out of 100 with a shining green "Safe & Protected" badge, confirming that nobody can track you from this file!',
      ],
    },
    {
      q: 'Why are GPS coordinates considered a High Risk (Red) danger?',
      a: [
        'Think about what would happen if you drew a giant red chalk arrow on the sidewalk right in front of your house, pointing straight at your front door, with your name written in big letters. Anyone walking down the street would know exactly where you live!',
        'GPS coordinates in digital photos do something even more powerful than chalk on a sidewalk. They calculate numbers that link directly to satellite maps in space. Those numbers are so accurate that a mapping app can drop a red pin right through your bedroom window.',
        'If you post a picture of your kitten or your new bicycle to an online forum, a marketplace, or a public chat group, anyone who downloads that file can open the map and see your exact house number, street name, and neighborhood.',
        'If you post photos regularly, someone could even figure out what school you attend or what park you play at every Saturday morning. That is why privacy experts and police departments always warn people to never share raw camera photos with GPS tags.',
        'Wiping the GPS tags turns off that satellite beacon forever. Your friends still get to see the cute kitten, but your home stays your safe, private sanctuary!',
      ],
    },
    {
      q: 'What does a Medium Risk (Yellow) score mean for my family photos?',
      a: [
        'A Medium Risk score means your photo does not reveal your physical street address, but it still contains personal clues that you might not want strangers to know.',
        'The most common reason for a yellow score is the DateTimeOriginal timestamp. When your camera records the exact date, hour, minute, and second a picture was taken, it creates a digital paper trail of your activities.',
        'For example, if you post a photo from a water park while you are still on vacation, a yellow timestamp tells people: "Taken today at 2 PM, 500 miles away from home!" That reveals to anyone watching that your real house is currently empty.',
        'A Medium Risk score can also be triggered if your photo has your full name stamped in the Artist or Author field, or if it lists the exact brand and model of an expensive professional camera you own.',
        'While a yellow score is not as dangerous as a red GPS pin, cleaning away these medium clues ensures that nobody can build a timeline of your personal habits or daily schedule.',
      ],
    },
    {
      q: 'How can I turn a High Risk photo into a completely Safe Green photo?',
      a: [
        'Turning a scary red score into a sparkling green score takes literally one second on this page! You do not need any special technical skills or complex software.',
        'Right at the top of your analysis report, next to your file name, you will see a bright green button that says "✨ Clean & Download."',
        'When you click that button, our in-browser privacy engine sweeps through the file header in your device’s memory. It gently snips off the GPS coordinates, the camera serial numbers, the timestamps, and the author names.',
        'It hands you back a clean, safe version of your picture that downloads instantly to your computer or phone. The downloaded file looks identical in visual beauty, colors, and sharpness.',
        'If you drag that newly downloaded photo back into the analyzer, you will see the score drop all the way down to a beautiful green 0 / 100 with a verified Safe badge!',
      ],
    },
  ];

  return (
    <section className="max-w-5xl mx-auto px-6 py-16 md:py-20">
      <div className="paper-card p-8 md:p-12 mb-10 shadow-paper border border-slate-200/80 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300 text-xs font-semibold mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
          Privacy Risk Scoring · 100% Client-Side
        </div>
        <h1 className="font-[family-name:var(--font-merriweather)] text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
          Photo Privacy Analyzer
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Scan your photos for dangerous privacy leaks. Get an instant 0–100 Privacy Risk Score and detect hidden GPS coordinates, serial numbers, and timestamps.
        </p>
      </div>

      {/* Interactive Analyzer Tool with Transparent Stepper */}
      <AnalyzerTool toolType="privacy" />

      <section className="max-w-4xl mx-auto mt-16 space-y-12">
        {/* Explanatory Sections with Massive ELI5 Content */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="paper-card p-6 md:p-8 space-y-4 border border-slate-200/80 dark:border-slate-800">
            <h2 className="font-[family-name:var(--font-merriweather)] text-2xl font-bold text-slate-900 dark:text-white mb-2">
              What is a Privacy Risk Score? (The safety report card)
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Imagine getting a school report card, but instead of grading spelling, reading, or math, it grades how safe your secret treehouse is from curious spies!
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              If your photo receives a red badge and a high score, that means your photo has a giant neon arrow pointing straight to your treehouse! It contains exact GPS map coordinates or hardware serial numbers that anyone can read.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              If it receives a yellow badge, it means there are smaller clues—like what time you took the shot or your camera brand—that give away parts of your daily routine.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              And if your photo gets a shining green badge, that means your treehouse is completely invisible! There are zero clues, zero map pins, and zero tracking tags. You can share it proudly with anyone in the world!
            </p>
          </div>

          <div className="paper-card p-6 md:p-8 space-y-4 border border-slate-200/80 dark:border-slate-800">
            <h2 className="font-[family-name:var(--font-merriweather)] text-2xl font-bold text-slate-900 dark:text-white mb-2">
              How the three risk colors work (Traffic light rules)
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Our privacy scoring system uses the same simple rules as traffic lights on the street corner: Red, Yellow, and Green!
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Red means STOP and look out! Exact GPS numbers and permanent camera serial numbers are active in the file. You should definitely clean these tags before posting the photo online.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Yellow means CAUTION and think carefully. The file has timestamps or author names. If you are sharing with close family, it is fine, but for public websites, wiping it is best.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Green means GO and share freely! The file has been completely cleaned and holds zero private surprises. It is safe, private, and ready for the world!
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
              Learn how privacy risk scores work and how to keep your personal photos safe.
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
