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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      {/* Editorial Masthead */}
      <header className="mb-10 text-center max-w-3xl mx-auto">
        <div className="editorial-kicker mb-3">
          VOL. IV // THREAT AUDIT &amp; RISK DOCKET
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-ink dark:text-chalk mb-4 leading-tight">
          Photo Privacy Analyzer
        </h1>
        <p className="font-serif italic text-base sm:text-lg text-ink/75 dark:text-chalk/75 leading-relaxed">
          Forensic risk assessment calculating an exact 0–100 privacy leak quotient. Detects satellite geolocation beacons, camera serials, and timestamp trails.
        </p>

        {/* Technical Specification Bar */}
        <div className="mt-6 pt-4 border-t border-hairline flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] text-ink/60 dark:text-chalk/60 uppercase tracking-widest">
          <span>ALGORITHM: 100-PT WEIGHTED THREAT MATRIX</span>
          <span className="opacity-40">/</span>
          <span>AIR-GAPPED SCAN</span>
          <span className="opacity-40">/</span>
          <span>INSTANT SANITIZE HOOK</span>
        </div>
      </header>

      {/* Interactive Analyzer Tool with Transparent Stepper */}
      <AnalyzerTool toolType="privacy" />

      <section className="max-w-4xl mx-auto mt-16 space-y-10">
        {/* Explanatory Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          <article className="editorial-card p-6 md:p-8 space-y-4">
            <div className="editorial-kicker">ASSESSMENT // REPORT CARD</div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink dark:text-chalk">
              What is a Privacy Risk Score? (The safety report card)
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-ink/80 dark:text-chalk/80 leading-relaxed font-sans">
              <p>
                Imagine getting a school report card, but instead of grading spelling, reading, or math, it grades how safe your secret treehouse is from curious spies!
              </p>
              <p>
                If your photo receives a red badge and a high score, that means your photo has a giant neon arrow pointing straight to your treehouse! It contains exact GPS map coordinates or hardware serial numbers that anyone can read.
              </p>
              <p>
                If it receives a yellow badge, it means there are smaller clues—like what time you took the shot or your camera brand—that give away parts of your daily routine.
              </p>
              <p>
                And if your photo gets a shining green badge, that means your treehouse is completely invisible! There are zero clues, zero map pins, and zero tracking tags. You can share it proudly with anyone in the world!
              </p>
            </div>
          </article>

          <article className="editorial-card p-6 md:p-8 space-y-4">
            <div className="editorial-kicker">TAXONOMY // TRIAGE PROTOCOL</div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink dark:text-chalk">
              How the three risk colors work (Traffic light rules)
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-ink/80 dark:text-chalk/80 leading-relaxed font-sans">
              <p>
                Our privacy scoring system uses the same simple rules as traffic lights on the street corner: Red, Yellow, and Green!
              </p>
              <p>
                Red means STOP and look out! Exact GPS numbers and permanent camera serial numbers are active in the file. You should definitely clean these tags before posting the photo online.
              </p>
              <p>
                Yellow means CAUTION and think carefully. The file has timestamps or author names. If you are sharing with close family, it is fine, but for public websites, wiping it is best.
              </p>
              <p>
                Green means GO and share freely! The file has been completely cleaned and holds zero private surprises. It is safe, private, and ready for the world!
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
