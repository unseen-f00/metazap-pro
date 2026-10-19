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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      {/* Editorial Masthead */}
      <header className="mb-10 text-center max-w-3xl mx-auto">
        <div className="editorial-kicker mb-3">
          VOL. XVI // DYNAMIC QUANTIZATION &amp; PAYLOAD COMPRESSION
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-ink dark:text-chalk mb-4 leading-tight">
          Photo Size Editor &amp; Compressor
        </h1>
        <p className="font-serif italic text-base sm:text-lg text-ink/75 dark:text-chalk/75 leading-relaxed">
          Dynamic quality tuning and resolution downsampling via client-side canvas rasterization. Drops metadata payload and reduces storage footprint in RAM.
        </p>

        {/* Technical Specification Bar */}
        <div className="mt-6 pt-4 border-t border-hairline flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] text-ink/60 dark:text-chalk/60 uppercase tracking-widest">
          <span>ALGORITHM: DYNAMIC BITMAP RESAMPLE</span>
          <span className="opacity-40">/</span>
          <span>EXIF: SANITIZED</span>
          <span className="opacity-40">/</span>
          <span>AIR-GAPPED COMPILATION</span>
        </div>
      </header>

      {/* Main Interactive Compressor Tool */}
      <CompressorTool />

      {/* Educational & FAQ Section */}
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
