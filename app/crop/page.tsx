import type { Metadata } from 'next';
import CropperTool from '@/app/components/CropperTool';

export const metadata: Metadata = {
  title: 'Social Media Image Cropper | 1:1, 9:16, 16:9 Aspect Presets',
  description:
    'Crop photos with aspect ratio presets for Instagram Posts (1:1), Stories & Reels (9:16), and YouTube (16:9). 100% in-browser with automatic metadata stripping.',
};

export default function Page() {
  const faqs = [
    {
      q: 'Which aspect ratio should I use for Instagram and TikTok?',
      a: [
        'Use 1:1 (Square) for standard Instagram grid posts, square profile avatars, and LinkedIn banners.',
        'Use 9:16 (Vertical) for Instagram Stories, Reels, TikTok videos, and YouTube Shorts.',
        'Use 16:9 (Widescreen) for YouTube thumbnails, landscape desktop headers, and Twitter/X previews.',
      ],
    },
    {
      q: 'Does cropping an image remove EXIF data and private location info?',
      a: [
        'Yes! When your cropped frame is extracted, it is re-drawn onto a brand-new HTML5 canvas raster. All previous camera tags, location GPS coordinates, and device timestamps are eliminated in the process.',
      ],
    },
    {
      q: 'Does cropping reduce visual quality or re-compress pixels aggressively?',
      a: [
        'No. The cropper extracts the exact native pixels from your source image at 0.92 quality for lossy formats or 100% lossless for PNG, preserving maximum visual sharpness.',
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      {/* Editorial Masthead */}
      <header className="mb-10 text-center max-w-3xl mx-auto">
        <div className="editorial-kicker mb-3">
          VOL. XVII // PROPORTION FRAMING &amp; ASPECT GEOMETRY
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-ink dark:text-chalk mb-4 leading-tight">
          Social Media Image Cropper
        </h1>
        <p className="font-serif italic text-base sm:text-lg text-ink/75 dark:text-chalk/75 leading-relaxed">
          Architectural cropping with aspect presets for 1:1, 9:16 vertical, and 16:9 widescreen formats. Re-rasters bounding boxes in RAM without metadata leakage.
        </p>

        {/* Technical Specification Bar */}
        <div className="mt-6 pt-4 border-t border-hairline flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] text-ink/60 dark:text-chalk/60 uppercase tracking-widest">
          <span>PRESETS: 1:1, 9:16, 16:9, 4:5, FREE</span>
          <span className="opacity-40">/</span>
          <span>RASTER REBUILD: ZERO EXIF</span>
          <span className="opacity-40">/</span>
          <span>AIR-GAPPED CANVAS</span>
        </div>
      </header>

      {/* Main Interactive Cropper Tool */}
      <CropperTool />

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
