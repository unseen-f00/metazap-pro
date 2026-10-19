import type { Metadata } from 'next';
import FormatConverterTool from '@/app/components/FormatConverterTool';

export const metadata: Metadata = {
  title: 'Image to WebP Converter | Web Optimization & Space Saving',
  description:
    'Convert any JPEG, PNG, or HEIC image to high-efficiency WebP format in your browser. Boost page speed, reduce bandwidth, and sanitize all EXIF metadata.',
};

export default function Page() {
  const faqs = [
    {
      q: 'Why should I convert my images to WebP format?',
      a: [
        'WebP is Google’s modern image format that provides superior lossless and lossy compression for web assets. WebP images are typically 25% to 35% smaller in file size compared to JPEG while preserving identical visual fidelity.',
        'Converting your site’s assets to WebP improves Google Core Web Vitals (Largest Contentful Paint) and drastically speeds up mobile page load times.',
      ],
    },
    {
      q: 'Does WebP work across all modern web browsers?',
      a: [
        'Yes. All modern browsers including Google Chrome, Apple Safari, Mozilla Firefox, Microsoft Edge, and mobile operating systems natively decode WebP images.',
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      {/* Editorial Masthead */}
      <header className="mb-10 text-center max-w-3xl mx-auto">
        <div className="editorial-kicker mb-3">
          VOL. XXIII // NEXT-GEN WEBP ENCODING &amp; BANDWIDTH ECONOMY
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-ink dark:text-chalk mb-4 leading-tight">
          Image to WebP Converter
        </h1>
        <p className="font-serif italic text-base sm:text-lg text-ink/75 dark:text-chalk/75 leading-relaxed">
          Modern container conversion transforming legacy JPEG, PNG, and HEIC images into lightweight, web-optimized WebP files with zero metadata leakage.
        </p>

        {/* Technical Specification Bar */}
        <div className="mt-6 pt-4 border-t border-hairline flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] text-ink/60 dark:text-chalk/60 uppercase tracking-widest">
          <span>TARGET: WEBP RIFF CONTAINER</span>
          <span className="opacity-40">/</span>
          <span>PAYLOAD REDUCTION: 25–35%</span>
          <span className="opacity-40">/</span>
          <span>AIR-GAPPED COMPILATION</span>
        </div>
      </header>

      <FormatConverterTool type="image-to-webp" />

      {/* FAQ */}
      <section className="editorial-card p-6 md:p-10 max-w-4xl mx-auto mt-16">
        <div className="editorial-kicker mb-2">FIELD INQUIRIES // TECHNICAL DISPATCHES</div>
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-ink dark:text-chalk mb-8 tracking-tight">
          Frequently Addressed Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <details
              key={idx}
              className="group border border-hairline rounded-lg bg-surface-subtle open:bg-surface transition-colors overflow-hidden"
            >
              <summary className="cursor-pointer p-5 font-serif font-semibold text-ink dark:text-chalk select-none flex items-center justify-between hover:bg-hairline/30 transition-colors">
                <span className="text-base sm:text-lg pr-4">{faq.q}</span>
                <span className="shrink-0 font-mono text-xs text-ink/50 dark:text-chalk/50 group-open:rotate-180 transition-transform">
                  [+]
                </span>
              </summary>
              <div className="px-5 pb-5 text-ink/80 dark:text-chalk/80 leading-relaxed text-sm space-y-3 border-t border-hairline pt-4 font-sans">
                {faq.a.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
