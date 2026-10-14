import type { Metadata } from 'next';
import CompressorTool from '@/app/components/CompressorTool';

export const metadata: Metadata = {
  title: 'Photo Size Editor & Image Compressor | Reduce KB/MB In-Browser',
  description:
    'Compress and resize photos dynamically with interactive quality and resolution sliders. Reduce file size in KB/MB with 100% client-side privacy.',
};

export default function Page() {
  const faqs = [
    {
      q: 'How does dynamic in-browser photo compression work?',
      a: [
        'Our photo compressor utilizes the HTML5 Canvas API directly within your web browser memory. When you drag the quality or resolution sliders, the browser recalculates the pixel density and re-encodes the image without uploading a single byte to an external server.',
        'This means your private photographs are never exposed to third-party databases, cloud buckets, or remote servers.',
      ],
    },
    {
      q: 'Does compressing an image remove all hidden EXIF and GPS tracking data?',
      a: [
        'Yes! When an image is re-rasterized through an off-screen HTML5 canvas at your specified compression ratio, all ancillary EXIF headers, camera serial numbers, and GPS satellite coordinates are completely eliminated.',
        'Before download, our automated verification engine verifies that zero metadata tags remain in the exported file.',
      ],
    },
    {
      q: 'What compression ratio should I choose for standard web use?',
      a: [
        'For most websites, social media, and portfolio galleries, a quality setting of 75% to 85% delivers the optimal balance: the file size is reduced by 60% to 85%, while visual clarity remains virtually indistinguishable from the original to the human eye.',
      ],
    },
  ];

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <div className="paper-card p-6 md:p-12 mb-10 shadow-paper border border-slate-200/80 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300 text-xs font-semibold mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
          Dynamic Photo Size Editor · 100% In-Browser
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white font-[family-name:var(--font-merriweather)] leading-tight mb-4">
          Photo Size Editor &amp; Compressor
        </h1>

        <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          Reduce image file sizes dynamically by adjusting compression quality and resolution sliders with real-time Before vs After analytics. Completely private with zero server uploads.
        </p>
      </div>

      {/* Main Interactive Compressor Tool */}
      <CompressorTool />

      {/* Educational & FAQ Section */}
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
