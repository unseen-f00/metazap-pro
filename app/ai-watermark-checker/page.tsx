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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      {/* Editorial Masthead */}
      <header className="mb-10 text-center max-w-3xl mx-auto">
        <div className="editorial-kicker mb-3">
          VOL. VIII // CONTAINER CHUNKS &amp; PROMPT PAYLOAD INSPECTOR
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-ink dark:text-chalk mb-4 leading-tight">
          AI Prompt &amp; Metadata Signature Scanner
        </h1>
        <p className="font-serif italic text-base sm:text-lg text-ink/75 dark:text-chalk/75 leading-relaxed">
          Deep structural diagnostic scanning PNG iTXt text chunks, JPEG APP1 segments, and XMP packets for embedded prompt recipes and model configurations.
        </p>

        {/* Technical Specification Bar */}
        <div className="mt-6 pt-4 border-t border-hairline flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] text-ink/60 dark:text-chalk/60 uppercase tracking-widest">
          <span>PARSERS: PNG iTXt, tEXt, zTXt, JPEG APP1</span>
          <span className="opacity-40">/</span>
          <span>SCOPES: PROMPT, SEED, SAMPLER, GRAPH</span>
          <span className="opacity-40">/</span>
          <span>AIR-GAPPED SCAN</span>
        </div>
      </header>

      {/* Interactive Analyzer Tool with Transparent Stepper */}
      <AnalyzerTool toolType="ai-watermark" />

      <section className="max-w-4xl mx-auto mt-16 space-y-10">
        {/* Explanatory Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          <article className="editorial-card p-6 md:p-8 space-y-4">
            <div className="editorial-kicker">DISPATCH // CONTAINER ENCODING</div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink dark:text-chalk">
              How AI generators stamp prompts &amp; metadata into files
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-ink/80 dark:text-chalk/80 leading-relaxed font-sans">
              <p>
                When software like Stable Diffusion, Midjourney, ComfyUI, or DALL-E generates an image, it automatically writes extensive recipe information directly into the file container.
              </p>
              <p>
                This data includes your raw prompt, negative prompts, model checkpoint hashes, CFG guidance scales, and even full execution graphs detailing every node used in rendering.
              </p>
              <p>
                Anyone with basic file-reading software can inspect these container chunks and view the exact techniques, parameters, and prompts you used to create your artwork.
              </p>
              <p>
                Our scanner checks these container headers and displays the exact indicators found, so you know exactly what is embedded before sharing your work.
              </p>
            </div>
          </article>

          <article className="editorial-card p-6 md:p-8 space-y-4">
            <div className="editorial-kicker">TECHNICAL CLARIFICATION // METHODOLOGY</div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink dark:text-chalk">
              Container metadata inspection vs. pixel steganography
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-ink/80 dark:text-chalk/80 leading-relaxed font-sans">
              <p>
                It is important to understand the difference between container metadata signatures and steganographic watermarks.
              </p>
              <p>
                Container metadata (such as PNG iTXt text chunks, JPEG APP1 XMP packets, and C2PA manifests) contains human-readable or structured binary dictionaries detailing how the image was generated.
              </p>
              <p>
                Imperceptible pixel steganography (like Google SynthID), on the other hand, subtly modifies pixel values across frequency domains and requires proprietary neural network models to read.
              </p>
              <p>
                Our tool specifically and honestly focuses on container metadata inspection—where the vast majority of practical AI prompts, seeds, and workflow signatures reside!
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
