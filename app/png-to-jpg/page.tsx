import type { Metadata } from 'next';
import FormatConverterTool from '@/app/components/FormatConverterTool';

export const metadata: Metadata = {
  title: 'PNG to JPG Converter | Solid White Background Fill & No Metadata',
  description:
    'Convert PNG to JPG cleanly in your browser. Replaces transparent alpha channels with solid white background to avoid black rectangles, while erasing all EXIF tags.',
};

export default function Page() {
  const faqs = [
    {
      q: 'Why do transparent PNGs often turn black when converted to JPG?',
      a: [
        'The JPG format does not support transparency (alpha channels). Standard naive converters simply drop the alpha channel, turning all transparent pixels completely black.',
        'Our converter explicitly fills the background with crisp, solid white (#FFFFFF) before rasterizing, guaranteeing your graphics and logos look clean and professional without dark boxes.',
      ],
    },
    {
      q: 'Is my private image uploaded to a remote server for conversion?',
      a: [
        'Never. The conversion happens 100% inside your local browser memory using hardware-accelerated HTML5 Canvas. Your files never touch any external server.',
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      {/* Editorial Masthead */}
      <header className="mb-10 text-center max-w-3xl mx-auto">
        <div className="editorial-kicker mb-3">
          VOL. XX // ALPHA SOLIDIFICATION &amp; CONTAINER CONVERSION
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-ink dark:text-chalk mb-4 leading-tight">
          PNG to JPG Converter
        </h1>
        <p className="font-serif italic text-base sm:text-lg text-ink/75 dark:text-chalk/75 leading-relaxed">
          Universal container translation converting transparent PNGs into pristine JPEGs with solid white (#FFFFFF) background fill and automated metadata neutralization.
        </p>

        {/* Technical Specification Bar */}
        <div className="mt-6 pt-4 border-t border-hairline flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] text-ink/60 dark:text-chalk/60 uppercase tracking-widest">
          <span>ALPHA FILL: #FFFFFF HARD SOLID</span>
          <span className="opacity-40">/</span>
          <span>BLACK ARTIFACT PREVENTION</span>
          <span className="opacity-40">/</span>
          <span>AIR-GAPPED STREAM</span>
        </div>
      </header>

      <FormatConverterTool type="png-to-jpg" />

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
