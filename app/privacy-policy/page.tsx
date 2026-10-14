import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | 100% In-Browser Zero-Knowledge Photo Toolkit',
  description:
    'Read our complete Privacy Policy. Learn why MetaZap never uploads, stores, intercepts, or sells your photos, personal metadata, or browsing information.',
};

export default function PrivacyPolicyPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16 md:py-24">
      <div className="paper-card p-8 md:p-14 shadow-paper border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-full text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-6 tracking-wide">
          <span>🔒 PRIVACY BY DESIGN &amp; DEFAULT</span>
        </div>

        <h1 className="font-[family-name:var(--font-merriweather)] text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 leading-tight">
          Privacy Policy
        </h1>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
          Last Updated: October 13, 2026 • Effective Immediately Across All Tools
        </p>

        {/* Highlight Architecture Callout */}
        <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/90 dark:border-emerald-800/80 rounded-2xl p-6 md:p-8 mb-10 text-emerald-950 dark:text-emerald-100">
          <h2 className="font-bold text-lg md:text-xl mb-3 flex items-center gap-2 text-emerald-950 dark:text-emerald-100">
            <span>🛡️ Core Architectural Guarantee: Zero Server Uploads</span>
          </h2>
          <p className="text-sm md:text-base text-emerald-900 dark:text-emerald-200 leading-relaxed">
            Every photo selected, inspected, edited, or cleaned on MetaZap is processed 100% locally inside your device&apos;s web browser. We do not have an image upload backend. Your image bytes never leave your machine, are never transmitted over HTTP/HTTPS to any remote computer, and are never saved in any database or cloud storage.
          </p>
        </div>

        <div className="space-y-10 text-slate-700 dark:text-slate-300 text-base md:text-lg leading-relaxed">
          {/* Section 1 */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-[family-name:var(--font-merriweather)]">
              1. Information We Do NOT Collect
            </h2>
            <p className="mb-4">
              Unlike traditional web services that harvest personal records to build user profiles, our service is intentionally designed to be blind to your identity. Specifically:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300 text-base">
              <li>
                <strong className="text-slate-900 dark:text-white">No Photo or File Content:</strong> We never receive, view, replicate, or store any of the images, photos, or documents you drag or upload into our toolkit.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">No Location Records:</strong> Even when you inspect or strip GPS tags (latitude, longitude, altitude) from photos, that coordinate analysis happens purely in your browser&apos;s memory. No location data is sent to our servers.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">No User Accounts:</strong> You do not need to register, log in, provide an email address, or link any social media profile to use our tools.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">No Hardware Fingerprints:</strong> We do not log camera body serial numbers, lens IDs, or smartphone identifiers found in EXIF tags.
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-[family-name:var(--font-merriweather)]">
              2. How In-Browser Local Processing Works
            </h2>
            <p className="mb-4">
              When you interact with any of our tools (such as the Photo Metadata Remover, GPS Remover, Deep Clean Canvas Bypass, or EXIF Editor), your browser uses native Web APIs including <code className="font-mono text-sm bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-800 dark:text-slate-200">FileReader</code>, <code className="font-mono text-sm bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-800 dark:text-slate-200">HTMLCanvasElement</code>, and <code className="font-mono text-sm bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-800 dark:text-slate-200">URL.createObjectURL</code>.
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
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-[family-name:var(--font-merriweather)]">
              3. Web Analytics and Standard Server Logs
            </h2>
            <p className="mb-4">
              Like virtually all websites on the World Wide Web, our web host collects minimal, standard technical connection data when your browser requests the static HTML, JavaScript, and CSS bundle files.
            </p>
            <p className="mb-4">
              These standard web server logs may record your browser type (User-Agent), referring URL, requested page path (such as <code className="font-mono text-sm bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-800 dark:text-slate-200">/about</code>), and standard IP address solely for rate limiting, DDoS defense, and ensuring network stability.
            </p>
            <p>
              These network connection logs contain zero information about what photos you process or the contents of your files, because your files never reach our web servers.
            </p>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-[family-name:var(--font-merriweather)]">
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
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 underline font-medium"
              >
                Google Ads Settings
              </a>{' '}
              or through the{' '}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 underline font-medium"
              >
                Network Advertising Initiative opt-out page
              </a>
              .
            </p>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-[family-name:var(--font-merriweather)]">
              5. Global Privacy Rights (GDPR &amp; CCPA / CPRA)
            </h2>
            <p className="mb-4">
              Because MetaZap does not store, process, or sell personal data or image records on our servers, we inherently comply with the core principles of data minimization and privacy-by-design under the European General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA/CPRA).
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300 text-base">
              <li>
                <strong className="text-slate-900 dark:text-white">Right to Access &amp; Portability:</strong> Since we store no user records or photos, there is no personal data stored on our servers to retrieve or export.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Right to Erasure (&ldquo;Right to be Forgotten&rdquo;):</strong> There is no personal data or image archive to delete from our servers; your data is purged from your device&apos;s memory as soon as you close your browser tab.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Sale of Personal Information:</strong> We do not sell, rent, or trade your personal information or photos to any third party under any circumstances.
              </li>
            </ul>
          </div>

          {/* Section 6 */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-[family-name:var(--font-merriweather)]">
              6. How You Can Verify Our Privacy Claims
            </h2>
            <p className="mb-4">
              You do not have to take our word for it. In the spirit of radical transparency, we encourage any technically inclined user to inspect our operation:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-slate-600 dark:text-slate-300 text-base">
              <li>Open your favorite web browser (Chrome, Firefox, Safari, Edge, or Brave).</li>
              <li>Press <kbd className="font-mono bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded text-xs text-slate-800 dark:text-slate-200">F12</kbd> or right-click anywhere and choose &ldquo;Inspect&rdquo; to launch Developer Tools.</li>
              <li>Click on the <strong>Network</strong> tab.</li>
              <li>Upload a photo to any tool, edit its metadata, or run a batch clean.</li>
              <li>You will observe that <strong>zero upload requests (POST, PUT, or WebSocket messages)</strong> containing your file data are dispatched.</li>
            </ol>
          </div>

          {/* Section 7 */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-[family-name:var(--font-merriweather)]">
              7. Contact Information
            </h2>
            <p className="mb-4">
              If you have any questions, feedback, or inquiries regarding our Privacy Policy or the cryptographic client-side architecture of MetaZap, please feel free to reach out via our{' '}
              <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 underline font-semibold">
                Contact Page
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors flex items-center gap-1.5"
          >
            <span>←</span> Return to Homepage
          </Link>
          <div className="flex items-center gap-6 text-sm font-semibold text-slate-500 dark:text-slate-400">
            <Link href="/about" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              About MetaZap
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
