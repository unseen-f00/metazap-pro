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
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <div className="paper-card p-6 md:p-12 mb-10 shadow-paper border border-slate-200/80 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400"></span>
          Next-Gen Web Optimization · 100% In-Browser
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white font-[family-name:var(--font-merriweather)] leading-tight mb-4">
          Image to WebP Converter
        </h1>

        <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          Convert JPEG, PNG, and HEIC photos into lightweight, web-optimized WebP files. Dramatically shrink byte payloads and speed up website load times with zero metadata leaks.
        </p>
      </div>

      <FormatConverterTool type="image-to-webp" />

      {/* FAQ */}
      <div className="mt-16 paper-card p-6 md:p-10 border border-slate-200/80 dark:border-slate-800 shadow-paper">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-6 font-[family-name:var(--font-merriweather)]">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border-b border-slate-100 dark:border-slate-800 pb-5 last:border-b-0">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2">
                {faq.q}
              </h3>
              {faq.a.map((p, pIdx) => (
                <p key={pIdx} className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-2 last:mb-0">
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
