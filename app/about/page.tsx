import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us | The Privacy-First Photo Metadata Removal Toolkit',
  description:
    'Learn about ImageClean and our mission to protect digital photo privacy. Discover how our 100% client-side, zero-server-upload architecture safeguards your personal data.',
};

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16 md:py-24">
      <div className="paper-card p-8 md:p-14 shadow-paper border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-200 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300 rounded-full text-xs font-bold text-indigo-700 mb-6 tracking-wide">
          <span>🛡️ ZERO-KNOWLEDGE ARCHITECTURE</span>
        </div>

        <h1 className="font-[family-name:var(--font-merriweather)] text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
          About MetaZap
        </h1>

        <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-[family-name:var(--font-inter)] mb-10 pb-8 border-b border-slate-100 dark:border-slate-800">
          We built MetaZap with a radical yet simple principle: you should never have to sacrifice your private photos to an unknown cloud server just to wipe your home GPS coordinates or camera serial numbers.
        </p>

        <div className="space-y-10 text-slate-700 dark:text-slate-300 text-base md:text-lg leading-relaxed">
          {/* Section 1 */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-[family-name:var(--font-merriweather)]">
              The Invisible Privacy Threat in Modern Photography
            </h2>
            <p className="mb-4">
              Whenever you snap a photograph with your smartphone, digital camera, or drone, your device records far more than just visual light. Embedded silently within each image file is an extensive dossier known as EXIF (Exchangeable Image File Format) metadata.
            </p>
            <p className="mb-4">
              This hidden payload routinely contains your exact GPS latitude and longitude coordinates (accurate within meters of your front door or children&apos;s school), the precise timestamp down to the second, the unique hardware serial number of your phone or camera sensor, the lens model, and even the software editing history.
            </p>
            <p>
              When you upload these photos to online marketplaces, social networks, forums, blogs, or dating apps, you may inadvertently publish a map of your daily life, your home address, and your personal travel habits to strangers, scrapers, and automated bots.
            </p>
          </div>

          {/* Section 2 */}
          <div className="bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-[family-name:var(--font-merriweather)]">
              The Flawed Traditional Solution: Cloud Converters
            </h2>
            <p className="mb-4">
              For years, the standard advice for removing photo metadata was to use online &ldquo;free converter&rdquo; websites. However, standard websites operate by requiring you to upload your raw photo files to remote cloud servers in another state or country.
            </p>
            <p className="mb-4">
              Once your files leave your computer, you have zero guarantees about what happens to them. Those servers might cache your images on unencrypted disks, analyze your photos for commercial advertising algorithms, retain web access logs with your IP address, or suffer database breaches.
            </p>
            <p>
              Handing over your personal family memories or sensitive investigative photographs to an unknown server just to strip metadata defeats the entire purpose of wanting privacy in the first place.
            </p>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-[family-name:var(--font-merriweather)]">
              Our Answer: 100% In-Browser, Zero Server Uploads
            </h2>
            <p className="mb-4">
              MetaZap was engineered from day one to operate on a completely decentralized, zero-knowledge architecture. When you load our website, all the necessary image parsing, binary EXIF manipulation, and canvas processing code downloads directly into your browser.
            </p>
            <p className="mb-4">
              Your device acts as its own private processing laboratory. Whether you are stripping GPS tags, wiping Adobe XMP edit histories, inspecting PNG chunks, or deep cleaning with HTML5 canvas re-rendering, every single calculation executes locally using your device&apos;s own CPU and RAM.
            </p>
            <p>
              You can verify this yourself: open your browser&apos;s Developer Tools (F12), switch to the Network tab, disconnect your internet connection or turn on Airplane Mode, and drag in an image. Every tool on our site will clean, analyze, or edit your photo flawlessly without transmitting a single byte over the wire.
            </p>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-[family-name:var(--font-merriweather)]">
              Who We Serve
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 my-6">
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">📸 Photographers &amp; Creators</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Embed custom copyright licenses and author credits while stripping proprietary camera sensor serial numbers before delivering portfolios to clients.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">👨‍👩‍👧 Families &amp; Parents</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Safely share vacation snapshots and school activities online without broadcasting exact GPS coordinates of your home, parks, or neighborhoods.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">📰 Journalists &amp; Whistleblowers</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Sanitize documents and on-the-ground reporting photos to protect confidential sources, hidden locations, and device fingerprints.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">🛍️ Marketplace Sellers</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  List items for sale on Craigslist, eBay, or Facebook Marketplace without inadvertently giving buyers your physical residential address.
                </p>
              </div>
            </div>
          </div>

          {/* Section 5 */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-[family-name:var(--font-merriweather)]">
              Free, Transparent, and Always Respectful
            </h2>
            <p className="mb-4">
              MetaZap is completely free to use. We do not require accounts, logins, email addresses, credit cards, or software installations. We believe that basic digital privacy and personal safety tools should be accessible to everyone on the planet without friction.
            </p>
            <p>
              Thank you for caring about your digital privacy and taking control of the data you share with the world. If you find our tools helpful, please share them with friends, colleagues, and family members who share photos online.
            </p>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors flex items-center gap-1.5"
          >
            <span>←</span> Back to Photo Privacy Tools
          </Link>
          <div className="flex items-center gap-6 text-sm font-semibold text-slate-500 dark:text-slate-400">
            <Link href="/privacy-policy" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
