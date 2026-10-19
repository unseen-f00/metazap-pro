import type { Metadata } from 'next';
import AICleanerTool from './AICleanerTool';

export const metadata: Metadata = {
  title: 'AI Data Cleaner | Remove AI Prompts and C2PA Metadata',
  description: 'Strip AI generation prompts, C2PA provenance data, and synthetic image tags from your photos. Clean AI metadata locally — zero uploads, full privacy.',
};

export default function AICleanerPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      {/* Editorial Masthead */}
      <header className="mb-10 text-center max-w-3xl mx-auto">
        <div className="editorial-kicker mb-3">
          VOL. XXIV // PROVENANCE CLEANER &amp; SYNTHETIC MARKER STRIPPER
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-ink dark:text-chalk mb-4 leading-tight">
          AI Data Cleaner
        </h1>
        <p className="font-serif italic text-base sm:text-lg text-ink/75 dark:text-chalk/75 leading-relaxed">
          Remove AI generation prompts, C2PA provenance tags, synthetic image markers, and diffusion parameters from your images in browser RAM.
        </p>

        {/* Technical Specification Bar */}
        <div className="mt-6 pt-4 border-t border-hairline flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] text-ink/60 dark:text-chalk/60 uppercase tracking-widest">
          <span>PARSERS: PROMPTS, C2PA, DIFFUSION WORKFLOWS</span>
          <span className="opacity-40">/</span>
          <span>PIXEL QUALITY: 100% LOSSLESS</span>
          <span className="opacity-40">/</span>
          <span>AIR-GAPPED COMPILATION</span>
        </div>
      </header>

      <AICleanerTool />

      <section className="max-w-4xl mx-auto mt-16 space-y-10">
        <article className="editorial-card p-6 md:p-8 space-y-4">
          <div className="editorial-kicker">DISPATCH // FORENSIC CONTEXT</div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink dark:text-chalk">
            What AI Metadata Contains
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-ink/80 dark:text-chalk/80 leading-relaxed font-sans">
            <p>
              Modern AI image generation and editing tools embed rich metadata tags that describe the synthetic origin of images. C2PA (Coalition for Content Provenance and Authenticity) tags indicate whether an image was AI-generated or AI-edited. Diffusion model prompts are sometimes embedded directly in the EXIF block by software like Midjourney, Stable Diffusion, or DALL-E integrations.
            </p>
            <p>
              These tags reveal the exact text prompt used to generate or alter the image, the AI model version, the editing steps applied, and provenance information that traces the image back to its synthetic source. While transparency is valuable, many creators prefer to remove these tags before sharing professional work or distributing images commercially.
            </p>
            <p>
              Our AI Data Cleaner removes all C2PA provenance blocks, AI generation prompts, synthetic markers, diffusion parameters, and AI software tags — giving you full control over what metadata travels with your final image.
            </p>
          </div>
        </article>

        {/* FAQs */}
        <section className="editorial-card p-6 md:p-10">
          <div className="editorial-kicker mb-2">FIELD INQUIRIES // TECHNICAL DISPATCHES</div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-ink dark:text-chalk mb-8 tracking-tight">
            Frequently Addressed Questions
          </h2>
          <div className="space-y-4">
            {[
              { q: 'Does this remove AI generation prompts?', a: 'Yes. Any prompt text embedded in EXIF or C2PA metadata is completely stripped during the cleaning process.' },
              { q: 'Can it clean C2PA provenance tags?', a: 'Yes. The cleaner specifically targets C2PA provenance data, synthetic content labels, and AI model metadata.' },
              { q: 'Is the image quality preserved?', a: 'Yes. Only metadata is removed. Pixel data, resolution, and compression remain exactly as in the original.' },
            ].map((item, i) => (
              <details
                key={i}
                className="group border border-hairline rounded-lg bg-surface-subtle open:bg-surface transition-colors overflow-hidden"
              >
                <summary className="cursor-pointer p-5 font-serif font-semibold text-ink dark:text-chalk select-none flex items-center justify-between hover:bg-hairline/30 transition-colors">
                  <span className="text-base sm:text-lg pr-4">{item.q}</span>
                  <span className="shrink-0 font-mono text-xs text-ink/50 dark:text-chalk/50 group-open:rotate-180 transition-transform">
                    [+]
                  </span>
                </summary>
                <div className="px-5 pb-5 text-ink/80 dark:text-chalk/80 leading-relaxed text-sm space-y-3 border-t border-hairline pt-4 font-sans">
                  <p>{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
