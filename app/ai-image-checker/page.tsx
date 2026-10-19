import type { Metadata } from 'next';
import AnalyzerTool from '@/app/components/AnalyzerTool';

export const metadata: Metadata = {
  title: 'AI Image Checker | Detect Midjourney, DALL-E & Stable Diffusion Online',
  description:
    'Check if a picture was generated with AI. Scan for hidden Midjourney, DALL-E, Stable Diffusion, and prompt tags locally in your browser with zero uploads.',
};

export default function Page() {
  const faqs = [
    {
      q: 'Which artificial intelligence models and pipelines can this tool detect?',
      a: [
        'Our AI Image Checker is equipped with a comprehensive library of known generative AI signatures and workflow markers. It searches for both commercial cloud generators and open-source local pipelines.',
        'It actively scans for signatures from Midjourney (including v5, v6, and Niji models), OpenAI’s DALL-E (DALL-E 2 and DALL-E 3), Stable Diffusion (SD 1.5, SDXL, SD 3), ComfyUI node workflows, and Automatic1111 web UI parameters.',
        'It also checks for community pipelines like NovelAI, Civitai model checkpoints, Fooocus, InvokeAI, DreamStudio, FLUX.1, and Adobe Firefly.',
        'Beyond just model names, it inspects technical generation parameters. If it spots phrases like "negative prompt," "CFG scale," "sampler: Euler," or "model hash," it knows with high probability that a diffusion model generated the file.',
        'When matches are found, it highlights the exact engine name and displays the matching parameter snippets directly in your report!',
      ],
    },
    {
      q: 'Does this tool upload my image to an online machine learning server?',
      a: [
        'No, never! This is what makes our checker so unique and trustworthy. Most "AI detector" websites on the internet make you upload your image to their cloud servers so their giant computer networks can scan it.',
        'That means a third-party company gets a permanent copy of your artwork, your private photos, or your concept drafts. That is not very private!',
        'Our tool operates 100% locally inside your web browser. It does not need a massive cloud server because it does not guess based on blurry pixel patterns. Instead, it reads the actual binary header tags directly on your device using fast JavaScript parsers.',
        'Your file never leaves your computer, and not a single pixel travels over the internet. You could even turn off your internet router and run the scan smoothly.',
        'Once you are done, closing your browser tab wipes all temporary memory automatically. Your private art and images stay completely safe in your own hands.',
      ],
    },
    {
      q: 'Why do some AI pictures from social media not trigger the scanner?',
      a: [
        'If you download an image from Twitter, Instagram, or TikTok and run it through this tool, you might sometimes see a clean result even if you know the picture was created with AI. There is a very specific technical reason for this!',
        'When an AI generator (like Midjourney or Stable Diffusion) creates a fresh image, it writes the prompt and model name into the file header. If you download the raw file directly from Discord or your local PC, our scanner catches it with 99% certainty.',
        'However, major social media platforms and image compression bots often strip all metadata from files upon upload to save server bandwidth. When they compress the image, they wipe away the header notes containing the AI prompt.',
        'Once those header notes are wiped, the file no longer carries the text signature of the AI model. Our tool is designed to provide factual metadata proof rather than making random guesses on pixels.',
        'If you have the original file downloaded from the creation app or artist portfolio, our scanner will find the digital fingerprint in the blink of an eye!',
      ],
    },
    {
      q: 'Can I remove the AI tags from my image after scanning?',
      a: [
        'Yes! If our scanner detects that your artwork has embedded AI prompts, model tags, or diffusion workflows, you can clean it immediately with a single click.',
        'At the top of the scan results, you will see a green button that says "✨ Clean & Download." Clicking that button processes your image locally in your browser memory.',
        'It strips away the prompt tags, model parameters, and software stamps while preserving 100% of the image resolution, colors, and sharpness.',
        'The newly downloaded image will look visually identical, but your creative prompt words and model configurations will be stripped clean.',
        'You can then re-scan the downloaded file to verify that the AI signatures are gone and the file is safe to share anonymously!',
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      {/* Editorial Masthead */}
      <header className="mb-10 text-center max-w-3xl mx-auto">
        <div className="editorial-kicker mb-3">
          VOL. VII // SYNTHETIC SIGNATURE &amp; DIFFUSION PROMPT INSPECTOR
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-ink dark:text-chalk mb-4 leading-tight">
          AI Image Checker
        </h1>
        <p className="font-serif italic text-base sm:text-lg text-ink/75 dark:text-chalk/75 leading-relaxed">
          Forensic scanner identifying embedded Midjourney prompts, DALL-E parameters, Stable Diffusion node trees, and FLUX generation tags.
        </p>

        {/* Technical Specification Bar */}
        <div className="mt-6 pt-4 border-t border-hairline flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] text-ink/60 dark:text-chalk/60 uppercase tracking-widest">
          <span>PARSERS: PNG TXT, EXIF USERCOMMENT, XMP</span>
          <span className="opacity-40">/</span>
          <span>MODELS: SD, MJ, DALL-E, COMFYUI</span>
          <span className="opacity-40">/</span>
          <span>ZERO CLOUD TELEMETRY</span>
        </div>
      </header>

      {/* Interactive Analyzer Tool with Transparent Stepper */}
      <AnalyzerTool toolType="ai-image" />

      <section className="max-w-4xl mx-auto mt-16 space-y-10">
        {/* Explanatory Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          <article className="editorial-card p-6 md:p-8 space-y-4">
            <div className="editorial-kicker">DISPATCH // SYNTHESIS FORENSICS</div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink dark:text-chalk">
              How does this checker catch AI art? (The robot fingerprints)
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-ink/80 dark:text-chalk/80 leading-relaxed font-sans">
              <p>
                Imagine two artists painting a picture of a magical castle. The first artist is a human painter who uses real wooden easels, hair brushes, and oil paints. The second artist is a futuristic robot who uses laser beams and electric styluses!
              </p>
              <p>
                To the naked human eye, both castle paintings look colorful, bright, and magnificent. You might not be able to tell which one was drawn by the human and which one was drawn by the robot just by glancing at them.
              </p>
              <p>
                However, if a detective uses a special ultraviolet magnifying glass, they can spot tiny metal robot shavings and laser calibration stamps pressed into the canvas!
              </p>
              <p>
                Our AI Image Checker is that ultraviolet magnifying glass! It looks inside the digital file header for software stamps left behind by Midjourney, DALL-E, Stable Diffusion, and ComfyUI, giving you clear factual proof of how the art was made!
              </p>
            </div>
          </article>

          <article className="editorial-card p-6 md:p-8 space-y-4">
            <div className="editorial-kicker">EPISTEMOLOGY // BINARY CERTAINTY</div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink dark:text-chalk">
              Why metadata signatures are better than guessing pixels
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-ink/80 dark:text-chalk/80 leading-relaxed font-sans">
              <p>
                Many websites on the internet claim they can tell if a photo is AI just by looking at the colored pixels. But those pixel-guessing tools make mistakes all the time!
              </p>
              <p>
                They often look at an authentic photo of a smooth sunset and wrongly accuse it of being AI, or they look at a real AI picture with grainy filters and mistakenly say it is a camera photo.
              </p>
              <p>
                Our tool does not make random guesses! Instead, it inspects the exact file header metadata. If the file contains the words &ldquo;Midjourney&rdquo; or &ldquo;Prompt: a cute dragon,&rdquo; that is 100% indisputable, factual proof.
              </p>
              <p>
                It is as reliable as reading the signature at the bottom of a signed letter. You get clear, honest insights without any false accusations!
              </p>
            </div>
          </article>
        </div>

        {/* FAQs */}
        <section className="editorial-card p-6 md:p-10">
          <div className="editorial-kicker mb-2">FIELD INQUIRIES // TECHNICAL DISPATCHES</div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-ink dark:text-chalk mb-8 tracking-tight">
            Frequently Addressed Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((item, i) => (
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
                  {item.a.map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
