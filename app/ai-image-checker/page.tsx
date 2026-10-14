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
    <section className="max-w-5xl mx-auto px-6 py-16 md:py-20">
      <div className="paper-card p-8 md:p-12 mb-10 shadow-paper border border-slate-200/80 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300 text-xs font-semibold mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
          AI Model &amp; Prompt Scanner · 100% Client-Side
        </div>
        <h1 className="font-[family-name:var(--font-merriweather)] text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
          AI Image Checker
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Check if an image contains synthetic model tags, generation prompts, or workflow parameters from Midjourney, DALL-E, or Stable Diffusion.
        </p>
      </div>

      {/* Interactive Analyzer Tool with Transparent Stepper */}
      <AnalyzerTool toolType="ai-image" />

      <section className="max-w-4xl mx-auto mt-16 space-y-12">
        {/* Explanatory Sections with Massive ELI5 Content */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="paper-card p-6 md:p-8 space-y-4 border border-slate-200/80 dark:border-slate-800">
            <h2 className="font-[family-name:var(--font-merriweather)] text-2xl font-bold text-slate-900 dark:text-white mb-2">
              How does this checker catch AI art? (The robot fingerprints)
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Imagine two artists painting a picture of a magical castle. The first artist is a human painter who uses real wooden easels, hair brushes, and oil paints. The second artist is a futuristic robot who uses laser beams and electric styluses!
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              To the naked human eye, both castle paintings look colorful, bright, and magnificent. You might not be able to tell which one was drawn by the human and which one was drawn by the robot just by glancing at them.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              However, if a detective uses a special ultraviolet magnifying glass, they can spot tiny metal robot shavings and laser calibration stamps pressed into the canvas!
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Our AI Image Checker is that ultraviolet magnifying glass! It looks inside the digital file header for software stamps left behind by Midjourney, DALL-E, Stable Diffusion, and ComfyUI, giving you clear factual proof of how the art was made!
            </p>
          </div>

          <div className="paper-card p-6 md:p-8 space-y-4 border border-slate-200/80 dark:border-slate-800">
            <h2 className="font-[family-name:var(--font-merriweather)] text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Why metadata signatures are better than guessing pixels
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Many websites on the internet claim they can tell if a photo is AI just by looking at the colored pixels. But those pixel-guessing tools make mistakes all the time!
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              They often look at an authentic photo of a smooth sunset and wrongly accuse it of being AI, or they look at a real AI picture with grainy filters and mistakenly say it is a camera photo.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Our tool does not make random guesses! Instead, it inspects the exact file header metadata. If the file contains the words &ldquo;Midjourney&rdquo; or &ldquo;Prompt: a cute dragon,&rdquo; that is 100% indisputable, factual proof.
            </p>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              It is as reliable as reading the signature at the bottom of a signed letter. You get clear, honest insights without any false accusations!
            </p>
          </div>
        </div>

        {/* FAQs */}
        <div>
          <div className="text-center mb-8">
            <h2 className="font-[family-name:var(--font-merriweather)] text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
              Frequently Asked Questions (Explained for Everyone)
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Discover how AI generators stamp images and how our signature scanner detects them.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((item, i) => (
              <details
                key={i}
                className="group border border-slate-200/90 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:border-indigo-200 dark:hover:border-indigo-800 transition-all overflow-hidden"
              >
                <summary className="cursor-pointer px-6 py-4.5 font-semibold text-slate-900 dark:text-white select-none flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-800/60 transition-colors">
                  <span className="text-base text-slate-800 dark:text-slate-200 pr-4">{item.q}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 transition-transform duration-200 group-open:rotate-180 shrink-0 text-sm">
                    ▾
                  </span>
                </summary>
                <div className="px-6 pb-6 pt-3 text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed border-t border-slate-100/60 dark:border-slate-800 space-y-3">
                  {item.a.map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}
