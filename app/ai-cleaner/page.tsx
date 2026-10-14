import type { Metadata } from 'next';
import AICleanerTool from './AICleanerTool';

export const metadata: Metadata = {
  title: 'AI Data Cleaner | Remove AI Prompts and C2PA Metadata',
  description: 'Strip AI generation prompts, C2PA provenance data, and synthetic image tags from your photos. Clean AI metadata locally — zero uploads, full privacy.',
};

export default function AICleanerPage() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      <h1 className="font-[family-name:var(--font-merriweather)] text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
        AI Data Cleaner
      </h1>
      <p className="text-xl text-slate-600 dark:text-slate-300 mb-12 max-w-2xl leading-relaxed font-[family-name:var(--font-inter)]">
        Remove AI generation prompts, C2PA provenance tags, synthetic image markers, and AI editing metadata from your images. All processing stays in your browser.
      </p>

      <AICleanerTool />

      <section className="max-w-4xl">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight font-[family-name:var(--font-merriweather)]">What AI Metadata Contains</h2>
        <div className="space-y-6 text-[17px] leading-relaxed text-slate-600 dark:text-slate-300 mb-16">
          <p>Modern AI image generation and editing tools embed rich metadata tags that describe the synthetic origin of images. C2PA (Coalition for Content Provenance and Authenticity) tags indicate whether an image was AI-generated or AI-edited. Diffusion model prompts are sometimes embedded directly in the EXIF block by software like Midjourney, Stable Diffusion, or DALL-E integrations.</p>
          <p>These tags reveal the exact text prompt used to generate or alter the image, the AI model version, the editing steps applied, and provenance information that traces the image back to its synthetic source. While transparency is valuable, many creators prefer to remove these tags before sharing professional work or distributing images commercially.</p>
          <p>Our AI Data Cleaner removes all C2PA provenance blocks, AI generation prompts, synthetic markers, diffusion parameters, and AI software tags — giving you full control over what metadata travels with your final image.</p>
        </div>

        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight font-[family-name:var(--font-merriweather)]">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {[
            { q: 'Does this remove AI generation prompts?', a: 'Yes. Any prompt text embedded in EXIF or C2PA metadata is completely stripped during the cleaning process.' },
            { q: 'Can it clean C2PA provenance tags?', a: 'Yes. The cleaner specifically targets C2PA provenance data, synthetic content labels, and AI model metadata.' },
            { q: 'Is the image quality preserved?', a: 'Yes. Only metadata is removed. Pixel data, resolution, and compression remain exactly as in the original.' },
          ].map((item, i) => (
            <details key={i} className="group border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm open:shadow-md transition-all overflow-hidden">
              <summary className="cursor-pointer p-6 font-semibold text-slate-900 dark:text-white select-none flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">{item.q}<span className="ml-4 text-indigo-500 dark:text-indigo-400 text-sm">▾</span></summary>
              <div className="px-6 pb-6 text-slate-600 dark:text-slate-300 leading-relaxed text-[15px]">{item.a}</div>
            </details>
          ))}
        </div>
      </section>
    </section>
  );
}
