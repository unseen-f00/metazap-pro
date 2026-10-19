import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | Usage Guidelines & Legal Terms',
  description:
    'Read our complete Terms of Service. Understand your rights, our zero-upload client-side architecture, intellectual property ownership, and acceptable use guidelines.',
};

export default function TermsOfServicePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 md:py-16">
      <article className="editorial-card p-6 md:p-14">
        <div className="editorial-kicker mb-3">
          LEGAL DOCKET // ACCEPTABLE USE COVENANT
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-ink dark:text-chalk mb-4 leading-tight">
          Terms of Service
        </h1>
        <p className="font-mono text-xs text-ink/60 dark:text-chalk/60 mb-8 pb-6 border-b border-hairline uppercase tracking-wider">
          Last Updated: October 13, 2026 • Effective Across All Interactive Tools
        </p>

        <div className="space-y-10 text-ink/80 dark:text-chalk/80 text-sm sm:text-base leading-relaxed font-sans">
          {/* Section 1 */}
          <div>
            <div className="editorial-kicker mb-1">SECTION 01</div>
            <h2 className="font-serif text-2xl font-bold text-ink dark:text-chalk mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="mb-4">
              Welcome to MetaZap (&ldquo;the Website&rdquo;, &ldquo;the Service&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). By accessing, browsing, or using any feature, webpage, or client-side utility on this website, you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service, along with our Privacy Policy.
            </p>
            <p>
              If you do not agree to all terms and conditions set forth herein, you must immediately discontinue your use of the website.
            </p>
          </div>

          {/* Section 2 */}
          <div className="bg-surface-subtle border border-hairline rounded-lg p-6 md:p-8">
            <div className="editorial-kicker mb-1">SECTION 02 // TITLE &amp; INTELLECTUAL PROPERTY</div>
            <h2 className="font-serif text-2xl font-bold text-ink dark:text-chalk mb-4">
              2. Intellectual Property &amp; Image Ownership
            </h2>
            <p className="mb-4 font-semibold text-ink dark:text-chalk">
              You retain 100% full, unencumbered ownership and all copyright rights to every image you process with MetaZap.
            </p>
            <p className="mb-4">
              Because all image processing is performed exclusively inside your web browser without sending files to any server, we never receive, store, or host your images. Consequently, MetaZap makes no claim of ownership, license, or right of inspection over your photographs or digital creations.
            </p>
            <p>
              The design, source code, logos, layout, and written content of this website are the intellectual property of MetaZap and are protected by applicable copyright, trademark, and unfair competition laws.
            </p>
          </div>

          {/* Section 3 */}
          <div>
            <div className="editorial-kicker mb-1">SECTION 03</div>
            <h2 className="font-serif text-2xl font-bold text-ink dark:text-chalk mb-4">
              3. Permitted &amp; Acceptable Use
            </h2>
            <p className="mb-4">
              MetaZap is provided free of charge for personal, commercial, non-profit, educational, and journalistic purposes. You may freely use our tools to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-ink/75 dark:text-chalk/75 text-sm sm:text-base mb-4">
              <li>Strip private GPS coordinates, timestamps, and device serial numbers before sharing photos online.</li>
              <li>Clean photos before publishing them on public marketplaces, news publications, and social media platforms.</li>
              <li>Inject custom artist credits, software tags, and copyright statements into your creative works.</li>
              <li>Perform batch sanitization and local ZIP compilation of photo archives.</li>
            </ul>
            <p className="font-semibold text-ink dark:text-chalk mb-2">Prohibited Activities:</p>
            <p className="text-ink/75 dark:text-chalk/75 text-sm sm:text-base">
              You agree not to use the EXIF Editor or other utilities to commit fraud, forge legal or criminal evidence, impersonate another individual, or remove copyright notices from works for which you lack legal authorization or fair use rights.
            </p>
          </div>

          {/* Section 4 */}
          <div>
            <div className="editorial-kicker mb-1">SECTION 04</div>
            <h2 className="font-serif text-2xl font-bold text-ink dark:text-chalk mb-4">
              4. Disclaimer of Warranties (&ldquo;AS-IS&rdquo;)
            </h2>
            <p className="mb-4">
              The services, tools, and content on MetaZap are provided on an &ldquo;AS-IS&rdquo; and &ldquo;AS-AVAILABLE&rdquo; basis without warranties of any kind, whether express, implied, or statutory, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
            </p>
            <p className="mb-4">
              While our metadata removal algorithms and binary chunk strippers are designed to preserve visual pixel fidelity while removing EXIF, GPS, and XMP tags, software anomalies or browser-specific limitations can occasionally occur.
            </p>
            <p className="border border-hairline bg-surface-subtle rounded-md p-4 text-ink/80 dark:text-chalk/80 font-mono text-xs">
              <strong>[RECOMMENDED PROTOCOL]</strong> Always keep a separate, untouched backup of your original high-resolution master photographs before performing batch sanitization or metadata modifications.
            </p>
          </div>

          {/* Section 5 */}
          <div>
            <div className="editorial-kicker mb-1">SECTION 05</div>
            <h2 className="font-serif text-2xl font-bold text-ink dark:text-chalk mb-4">
              5. Limitation of Liability
            </h2>
            <p className="mb-4">
              To the fullest extent permitted by applicable law, in no event shall MetaZap, its creators, contributors, or affiliates be liable for any direct, indirect, incidental, special, consequential, or punitive damages (including, without limitation, loss of data, lost profits, computer malfunction, or business interruption) arising out of or in connection with your use or inability to use the tools or website.
            </p>
          </div>

          {/* Section 6 */}
          <div>
            <div className="editorial-kicker mb-1">SECTION 06</div>
            <h2 className="font-serif text-2xl font-bold text-ink dark:text-chalk mb-4">
              6. Service Availability &amp; Modifications
            </h2>
            <p className="mb-4">
              We reserve the right to modify, update, enhance, or temporarily suspend any feature, tool, or design on this website at any time without prior notice. We may also revise these Terms of Service periodically to reflect updates to our architecture or regulatory requirements.
            </p>
            <p>
              Your continued use of the website following the posting of any revisions constitutes your acceptance of the updated terms.
            </p>
          </div>

          {/* Section 7 */}
          <div className="border-t border-hairline pt-8">
            <div className="editorial-kicker mb-1">SECTION 07</div>
            <h2 className="font-serif text-2xl font-bold text-ink dark:text-chalk mb-4">
              7. Governing Law &amp; Severability
            </h2>
            <p className="mb-4">
              These Terms shall be governed by and construed in accordance with the laws applicable in your jurisdiction, without regard to conflict of law principles. If any provision of these Terms is deemed unlawful, void, or for any reason unenforceable, that provision shall be deemed severable and shall not affect the validity and enforceability of any remaining provisions.
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
            <Link href="/privacy-policy" className="hover:text-ink dark:hover:text-chalk transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
