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
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <div className="paper-card p-6 md:p-12 mb-10 shadow-paper border border-slate-200/80 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300 text-xs font-semibold mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
          Social Media Cropper · 100% In-Browser
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white font-[family-name:var(--font-merriweather)] leading-tight mb-4">
          Social Media Image Cropper
        </h1>

        <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          Crop and reframe your photos for Instagram, TikTok, Reels, Stories, and YouTube thumbnails. Includes preset aspect ratios with zero metadata leaks.
        </p>
      </div>

      {/* Main Interactive Cropper Tool */}
      <CropperTool />

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
