import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | 100% In-Browser Zero-Knowledge Photo Toolkit',
  description:
    'Read our complete Privacy Policy. Learn why MetaZap never uploads, stores, intercepts, or sells your photos, personal metadata, or browsing information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 md:py-16">
      <article className="editorial-card p-6 md:p-14">
        <div className="editorial-kicker mb-3">
          LEGAL DOCKET // PRIVACY BY DESIGN &amp; DEFAULT
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-ink dark:text-chalk mb-4 leading-tight">
          Privacy Policy
        </h1>
        <p className="font-mono text-xs text-ink/60 dark:text-chalk/60 mb-8 pb-6 border-b border-hairline uppercase tracking-wider">
          Last Updated: October 13, 2026 • Effective Immediately Across All Client Enclaves
        </p>

        {/* Highlight Architecture Callout */}
        <div className="border border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/20 rounded-lg p-6 md:p-8 mb-10 text-ink dark:text-chalk">
          <div className="editorial-kicker mb-1">FOUNDATIONAL GUARANTEE // AIR-GAPPED BY DESIGN</div>
          <h2 className="font-serif font-bold text-lg md:text-xl mb-3 text-ink dark:text-chalk">
            Core Architectural Covenant: Zero Server Ingestion
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-ink/80 dark:text-chalk/80 font-sans">
            Every photo selected, inspected, edited, or cleaned on MetaZap is processed 100% locally inside your device&apos;s web browser. We do not operate an image upload backend. Your image bytes never leave your machine, are never transmitted over HTTP/HTTPS to any remote computer, and are never saved in any database or cloud storage.
          </p>
        </div>

        <div className="space-y-10 text-ink/80 dark:text-chalk/80 text-sm sm:text-base leading-relaxed font-sans">
          {/* Section 1 */}
          <div>
            <div className="editorial-kicker mb-1">SECTION 01</div>
            <h2 className="font-serif text-2xl font-bold text-ink dark:text-chalk mb-4">
              1. Information We Do NOT Collect
            </h2>
            <p className="mb-4">
              Unlike traditional web services that harvest personal records to build user profiles, our service is intentionally designed to be blind to your identity. Specifically:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-ink/75 dark:text-chalk/75 text-sm sm:text-base">
              <li>
                <strong className="text-ink dark:text-chalk font-semibold">No Photo or File Content:</strong> We never receive, view, replicate, or store any of the images, photos, or documents you drag or upload into our toolkit.
              </li>
              <li>
                <strong className="text-ink dark:text-chalk font-semibold">No Location Records:</strong> Even when you inspect or strip GPS tags (latitude, longitude, altitude) from photos, that coordinate analysis happens purely in your browser&apos;s memory. No location data is sent to our servers.
              </li>
              <li>
                <strong className="text-ink dark:text-chalk font-semibold">No User Accounts:</strong> You do not need to register, log in, provide an email address, or link any social media profile to use our tools.
              </li>
              <li>
                <strong className="text-ink dark:text-chalk font-semibold">No Hardware Fingerprints:</strong> We do not log camera body serial numbers, lens IDs, or smartphone identifiers found in EXIF tags.
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div>
            <div className="editorial-kicker mb-1">SECTION 02</div>
            <h2 className="font-serif text-2xl font-bold text-ink dark:text-chalk mb-4">
              2. How In-Browser Local Processing Works
            </h2>
            <p className="mb-4">
              When you interact with any of our tools (such as the Photo Metadata Remover, GPS Remover, Deep Clean Canvas Bypass, or EXIF Editor), your browser uses native Web APIs including <code className="font-mono text-xs bg-surface-subtle border border-hairline px-1.5 py-0.5 rounded text-ink dark:text-chalk">FileReader</code>, <code className="font-mono text-xs bg-surface-subtle border border-hairline px-1.5 py-0.5 rounded text-ink dark:text-chalk">HTMLCanvasElement</code>, and <code className="font-mono text-xs bg-surface-subtle border border-hairline px-1.5 py-0.5 rounded text-ink dark:text-chalk">URL.createObjectURL</code>.
            </p>
            <p className="mb-4">
              All memory buffers allocated to hold your images exist solely within the sandboxed RAM space allocated by your operating system to that browser tab. The moment you click &ldquo;Clear&rdquo;, refresh the webpage, or close your browser tab, all object URLs are automatically revoked and all temporary image memory is instantly reclaimed by your system&apos;s garbage collector.
            </p>
            <p>
              Nothing is written to your browser&apos;s persistent local storage or IndexedDB.
            </p>
          </div>

          {/* Section 3 */}
          <div>
            <div className="editorial-kicker mb-1">SECTION 03</div>
            <h2 className="font-serif text-2xl font-bold text-ink dark:text-chalk mb-4">
              3. Web Analytics and Standard Server Logs
            </h2>
            <p className="mb-4">
              Like virtually all websites on the World Wide Web, our web host collects minimal, standard technical connection data when your browser requests the static HTML, JavaScript, and CSS bundle files.
            </p>
            <p className="mb-4">
              These standard web server logs may record your browser type (User-Agent), referring URL, requested page path (such as <code className="font-mono text-xs bg-surface-subtle border border-hairline px-1.5 py-0.5 rounded text-ink dark:text-chalk">/about</code>), and standard IP address solely for rate limiting, DDoS defense, and ensuring network stability.
            </p>
            <p>
              These network connection logs contain zero information about what photos you process or the contents of your files, because your files never reach our web servers.
            </p>
          </div>

          {/* Section 4 */}
          <div>
            <div className="editorial-kicker mb-1">SECTION 04</div>
            <h2 className="font-serif text-2xl font-bold text-ink dark:text-chalk mb-4">
              4. Cookies and Advertising Disclosure
            </h2>
            <p className="mb-4">
              MetaZap does not use proprietary tracking cookies to monitor your browsing across other websites or build advertising profiles.
            </p>
            <p className="mb-4">
              To keep our toolkit 100% free for everyone around the world, we may display third-party advertisements (such as Google AdSense). These third-party vendors, including Google, may use cookies (such as the DoubleClick cookie) to serve relevant ads based on prior visits to our site or other sites on the internet.
            </p>
            <p>
              Users may opt out of personalized advertising by visiting{' '}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink dark:text-chalk underline font-semibold"
              >
                Google Ads Settings
              </a>{' '}
              or through the{' '}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink dark:text-chalk underline font-semibold"
              >
                Network Advertising Initiative opt-out page
              </a>
              .
            </p>
          </div>

          {/* Section 5 */}
          <div>
            <div className="editorial-kicker mb-1">SECTION 05</div>
            <h2 className="font-serif text-2xl font-bold text-ink dark:text-chalk mb-4">
              5. Global Privacy Rights (GDPR &amp; CCPA / CPRA)
            </h2>
            <p className="mb-4">
              Because MetaZap does not store, process, or sell personal data or image records on our servers, we inherently comply with the core principles of data minimization and privacy-by-design under the European General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA/CPRA).
            </p>
            <ul className="list-disc pl-6 space-y-2 text-ink/75 dark:text-chalk/75 text-sm sm:text-base">
              <li>
                <strong className="text-ink dark:text-chalk font-semibold">Right to Access &amp; Portability:</strong> Since we store no user records or photos, there is no personal data stored on our servers to retrieve or export.
              </li>
              <li>
                <strong className="text-ink dark:text-chalk font-semibold">Right to Erasure (&ldquo;Right to be Forgotten&rdquo;):</strong> There is no personal data or image archive to delete from our servers; your data is purged from your device&apos;s memory as soon as you close your browser tab.
              </li>
              <li>
                <strong className="text-ink dark:text-chalk font-semibold">Sale of Personal Information:</strong> We do not sell, rent, or trade your personal information or photos to any third party under any circumstances.
              </li>
            </ul>
          </div>

          {/* Section 6 */}
          <div>
            <div className="editorial-kicker mb-1">SECTION 06</div>
            <h2 className="font-serif text-2xl font-bold text-ink dark:text-chalk mb-4">
              6. How You Can Verify Our Privacy Claims
            </h2>
            <p className="mb-4">
              You do not have to take our word for it. In the spirit of radical transparency, we encourage any technically inclined user to inspect our operation:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-ink/75 dark:text-chalk/75 text-sm sm:text-base">
              <li>Open your favorite web browser (Chrome, Firefox, Safari, Edge, or Brave).</li>
              <li>Press <kbd className="font-mono bg-surface-subtle border border-hairline px-1.5 py-0.5 rounded text-xs text-ink dark:text-chalk">F12</kbd> or right-click anywhere and choose &ldquo;Inspect&rdquo; to launch Developer Tools.</li>
              <li>Click on the <strong>Network</strong> tab.</li>
              <li>Upload a photo to any tool, edit its metadata, or run a batch clean.</li>
              <li>You will observe that <strong>zero upload requests (POST, PUT, or WebSocket messages)</strong> containing your file data are dispatched.</li>
            </ol>
          </div>

          {/* Section 7 */}
          <div className="border-t border-hairline pt-8">
            <div className="editorial-kicker mb-1">SECTION 07</div>
            <h2 className="font-serif text-2xl font-bold text-ink dark:text-chalk mb-4">
              7. Inquiries &amp; Legal Contact
            </h2>
            <p className="mb-4">
              If you have any questions, feedback, or inquiries regarding our Privacy Policy or the cryptographic client-side architecture of MetaZap, please reach out via our{' '}
              <Link href="/contact" className="text-ink dark:text-chalk underline font-semibold">
                Contact Desk
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <Link
            href="/"
            className="text-ink dark:text-chalk hover:underline flex items-center gap-1.5 uppercase font-bold"
          >
            <span>←</span> RETURN TO TOOLKIT INDEX
          </Link>
          <div className="flex items-center gap-6 text-ink/60 dark:text-chalk/60 uppercase">
            <Link href="/about" className="hover:text-ink dark:hover:text-chalk transition-colors">
              About MetaZap
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
