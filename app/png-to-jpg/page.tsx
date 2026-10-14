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
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <div className="paper-card p-6 md:p-12 mb-10 shadow-paper border border-slate-200/80 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400"></span>
          Smart Background Alpha Handling · 100% Private
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white font-[family-name:var(--font-merriweather)] leading-tight mb-4">
          PNG to JPG Converter
        </h1>

        <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          Convert PNG graphics and illustrations to universal JPG format with clean white background fill. Completely eliminates transparent alpha darkening and scrubs hidden metadata.
        </p>
      </div>

      <FormatConverterTool type="png-to-jpg" />

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
