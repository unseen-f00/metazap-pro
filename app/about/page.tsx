import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us | The Privacy-First Photo Metadata Removal Toolkit',
  description:
    'Learn about ImageClean and our mission to protect digital photo privacy. Discover how our 100% client-side, zero-server-upload architecture safeguards your personal data.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 md:py-16">
      <article className="editorial-card p-6 md:p-14">
        {/* Editorial Masthead Kicker */}
        <div className="editorial-kicker mb-3">
          LAB MANIFESTO // ZERO-KNOWLEDGE RAM ARCHITECTURE
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-ink dark:text-chalk mb-6 leading-tight">
          About MetaZap Lab
        </h1>

        <p className="font-serif italic text-lg sm:text-xl text-ink/75 dark:text-chalk/75 leading-relaxed mb-10 pb-8 border-b border-hairline">
          We built MetaZap with a radical yet simple principle: you should never have to sacrifice your private photos to an unknown cloud server just to wipe your home GPS coordinates or camera serial numbers.
        </p>

        <div className="space-y-10 text-ink/80 dark:text-chalk/80 text-sm sm:text-base leading-relaxed font-sans">
          {/* Section 1 */}
          <div>
            <div className="editorial-kicker mb-1">01 // FORENSIC BACKGROUND</div>
            <h2 className="font-serif text-2xl font-bold text-ink dark:text-chalk mb-4">
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
          <div className="bg-surface-subtle border border-hairline rounded-lg p-6 md:p-8">
            <div className="editorial-kicker mb-1">02 // ARCHITECTURAL CRITIQUE</div>
            <h2 className="font-serif text-2xl font-bold text-ink dark:text-chalk mb-4">
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
            <div className="editorial-kicker mb-1">03 // CLIENT-SIDE ENCLAVE</div>
            <h2 className="font-serif text-2xl font-bold text-ink dark:text-chalk mb-4">
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
            <div className="editorial-kicker mb-1">04 // USER DEMOGRAPHICS</div>
            <h2 className="font-serif text-2xl font-bold text-ink dark:text-chalk mb-4">
              Who We Serve
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 my-6">
              <div className="p-5 rounded-lg border border-hairline bg-surface">
                <h3 className="font-serif font-bold text-ink dark:text-chalk mb-1.5 text-base">Photographers &amp; Creators</h3>
                <p className="text-xs sm:text-sm text-ink/70 dark:text-chalk/70 leading-relaxed">
                  Embed custom copyright licenses and author credits while stripping proprietary camera sensor serial numbers before delivering portfolios to clients.
                </p>
              </div>
              <div className="p-5 rounded-lg border border-hairline bg-surface">
                <h3 className="font-serif font-bold text-ink dark:text-chalk mb-1.5 text-base">Families &amp; Parents</h3>
                <p className="text-xs sm:text-sm text-ink/70 dark:text-chalk/70 leading-relaxed">
                  Safely share vacation snapshots and school activities online without broadcasting exact GPS coordinates of your home, parks, or neighborhoods.
                </p>
              </div>
              <div className="p-5 rounded-lg border border-hairline bg-surface">
                <h3 className="font-serif font-bold text-ink dark:text-chalk mb-1.5 text-base">Journalists &amp; Sources</h3>
                <p className="text-xs sm:text-sm text-ink/70 dark:text-chalk/70 leading-relaxed">
                  Sanitize documents and on-the-ground reporting photos to protect confidential sources, hidden locations, and device fingerprints.
                </p>
              </div>
              <div className="p-5 rounded-lg border border-hairline bg-surface">
                <h3 className="font-serif font-bold text-ink dark:text-chalk mb-1.5 text-base">Marketplace Sellers</h3>
                <p className="text-xs sm:text-sm text-ink/70 dark:text-chalk/70 leading-relaxed">
                  List items for sale on Craigslist, eBay, or Facebook Marketplace without inadvertently giving buyers your physical residential address.
                </p>
              </div>
            </div>
          </div>

          {/* Section 5 */}
          <div className="border-t border-hairline pt-8">
            <div className="editorial-kicker mb-1">05 // COMMUNITY COVENANT</div>
            <h2 className="font-serif text-2xl font-bold text-ink dark:text-chalk mb-4">
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

        {/* Navigation Colophon Footer */}
        <div className="mt-12 pt-8 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <Link
            href="/"
            className="text-ink dark:text-chalk hover:underline flex items-center gap-1.5 uppercase font-bold"
          >
            <span>←</span> RETURN TO TOOLKIT INDEX
          </Link>
          <div className="flex items-center gap-6 text-ink/60 dark:text-chalk/60 uppercase">
            <Link href="/privacy-policy" className="hover:text-ink dark:hover:text-chalk transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-ink dark:hover:text-chalk transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
