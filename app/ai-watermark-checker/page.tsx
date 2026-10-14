import type { Metadata } from 'next';
import AnalyzerTool from '@/app/components/AnalyzerTool';

export const metadata: Metadata = {
  title: 'AI Prompt & Metadata Signature Scanner | Container Header Inspection',
  description:
    'Inspect container headers (PNG iTXt, JPEG APP1, XMP) for AI generation prompts, diffusion workflows, model parameters, and C2PA credentials. 100% private in-browser analysis.',
};

export default function Page() {
  const faqs = [
    {
      q: 'What is an AI metadata signature and where does it hide inside an image?',
      a: [
        'When generative AI engines like Midjourney, Stable Diffusion, ComfyUI, DALL-E, or Fooocus create an image, they do not just output raw pixels. They also package rich generation metadata into the file container!',
        'These metadata signatures include the exact text prompt you typed, negative prompts, random seed numbers, sampler names, CFG guidance scales, step counts, model checkpoint hashes, and even full ComfyUI node execution graphs.',
        'In PNG files, these signatures are stored inside ancillary text chunks named iTXt, tEXt, and zTXt. In JPEG files, they are embedded within APP1 segments (such as Adobe XMP or EXIF UserComment fields) and COM comment markers.',
        'Our AI Prompt & Metadata Signature Scanner reads these container segments in milliseconds right in your browser, decoding the hidden generation payloads without uploading your file to any server.',
      ],
    },
    {
      q: 'Does this tool scan container metadata or imperceptible pixel steganography?',
      a: [
        'This tool is an AI Prompt & Container Metadata Scanner. It inspects the binary headers, text chunks (PNG iTXt/tEXt/zTXt), JPEG APP1/XMP markers, and workflow parameter dictionaries embedded by AI engines.',
        'It does not claim to perform forensic pixel-frequency steganography detection (such as Google SynthID or statistical pixel-noise analysis), which requires specialized neural network models and watermark keys.',
        'Most AI images shared across the web carry complete, uncompressed workflow dictionaries in their container headers. Our scanner extracts and displays these exact parameters so you can verify what generator tags and prompts accompany the image.',
      ],
    },
    {
      q: 'Why do generative AI platforms embed prompts and workflow settings into files?',
      a: [
        'AI generators embed workflow parameters to help creators keep track of their creative pipeline. If you generate a character with Stable Diffusion or ComfyUI, having the prompt, seed, and sampler saved in the image lets you drag and drop the file back into the software to reproduce or iterate on the render.',
        'Additionally, companies like Adobe and OpenAI embed provenance manifests (such as C2PA Content Credentials or digitalSourceType tags) to provide transparency about synthetic media creation.',
        'However, leaving these parameters attached can reveal your proprietary prompts, business workflows, or creative techniques when delivering final artwork to clients or posting publicly.',
      ],
    },
    {
      q: 'Can AI prompts and metadata signatures be completely stripped away?',
      a: [
        'Yes! If you want your artwork to be clean, anonymous, and free of generator signatures, our tool provides an immediate 1-click solution.',
        'At the top of your scan report, clicking the green "✨ Clean & Download" button strips all container metadata blocks, prompt chunks, and provenance tags in memory.',
        'For selective cleaning where you only want to wipe AI parameters while keeping camera data, or for deep canvas re-rendering, you can also use our dedicated AI Only Metadata Remover or EXIF Cleaner tools.',
        'The resulting file is 100% clean, untracked, and free of AI prompt dictionaries while preserving all visual image quality!',
      ],
    },
    {
      q: 'Does this scanner work on authentic photos taken with cameras?',
      a: [
        'Yes, absolutely! You can drop any digital photo—taken on an iPhone, an Android phone, or a DSLR camera—into this tool.',
        'When you scan a real camera photo, our scanner verifies that no generative AI signatures, diffusion parameters, or synthetic workflow dictionaries exist in the headers.',
        'It will display a verified green "Authentic Camera Photo" badge, giving you peace of mind that your photo does not carry any synthetic generation tags.',
        'Everything processes locally in your browser with zero server uploads, keeping all your camera photos completely private.',
      ],
    },
  ];

  return (
    <section className="max-w-5xl mx-auto px-6 py-16 md:py-20">
      <div className="paper-card p-8 md:p-12 mb-10 shadow-paper border border-slate-200/80 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300 text-xs font-semibold mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
          AI Prompt &amp; Metadata Signature Scanner · 100% Client-Side
        </div>
        <h1 className="font-[family-name:var(--font-merriweather)] text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
          AI Prompt &amp; Metadata Signature Scanner
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Scan container headers (PNG iTXt, JPEG APP1, XMP) for embedded AI prompts, diffusion parameters, and model signatures with zero server uploads.
        </p>
      </div>

      {/* Interactive Analyzer Tool with Transparent Stepper */}
      <AnalyzerTool toolType="ai-watermark" />

      <section className="max-w-4xl mx-auto mt-16 space-y-12">
        {/* Explanatory Sections */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="paper-card p-6 md:p-8 space-y-4 border border-slate-200/80 dark:border-slate-800">
            <h2 className="font-[family-name:var(--font-merriweather)] text-2xl font-bold text-slate-900 dark:text-white mb-2">
              How AI generators stamp prompts &amp; metadata into files
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              When software like Stable Diffusion, Midjourney, ComfyUI, or DALL-E generates an image, it automatically writes extensive recipe information directly into the file container.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              This data includes your raw prompt, negative prompts, model checkpoint hashes, CFG guidance scales, and even full execution graphs detailing every node used in rendering.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Anyone with basic file-reading software can inspect these container chunks and view the exact techniques, parameters, and prompts you used to create your artwork.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Our scanner checks these container headers and displays the exact indicators found, so you know exactly what is embedded before sharing your work.
            </p>
          </div>

          <div className="paper-card p-6 md:p-8 space-y-4 border border-slate-200/80 dark:border-slate-800">
            <h2 className="font-[family-name:var(--font-merriweather)] text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Container metadata inspection vs. pixel steganography
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              It is important to understand the difference between container metadata signatures and steganographic watermarks.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Container metadata (such as PNG iTXt text chunks, JPEG APP1 XMP packets, and C2PA manifests) contains human-readable or structured binary dictionaries detailing how the image was generated.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Imperceptible pixel steganography (like Google SynthID), on the other hand, subtly modifies pixel values across frequency domains and requires proprietary neural network models to read.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Our tool specifically and honestly focuses on container metadata inspection—where the vast majority of practical AI prompts, seeds, and workflow signatures reside!
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
              Learn how AI metadata signatures work and how to detect them in your images.
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
