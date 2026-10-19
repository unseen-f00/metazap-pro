import type { Metadata } from 'next';
import CoreRemoverTool from '@/app/components/CoreRemoverTool';

export const metadata: Metadata = {
  title: 'AI-Only Metadata Remover | Strip AI Prompts & Keep Camera EXIF',
  description:
    'Selectively remove Midjourney, Stable Diffusion, and DALL-E prompts from images while preserving authentic camera metadata. 100% free and in-browser.',
};

export default function Page() {
  const faqs = [
    {
      q: 'What kind of AI secrets and prompts get glued into my generated pictures?',
      a: [
        'Whenever you ask a magical computer robot—like Midjourney, Stable Diffusion, ComfyUI, DALL-E, or NovelAI—to paint a picture of a superhero, a flying dragon, or an enchanted forest, you type out a special sentence called a "prompt."',
        'That prompt took time and creativity to think up. You might have added special keywords like "cinematic lighting, octane render, 8k, photorealistic, intricate embroidery, award-winning illustration," plus a long list of negative prompts describing things you did not want to see.',
        'When the AI robot finishes drawing the artwork, it secretly folds up your exact prompt sentence like a little secret note and glues it right into the hidden text chunks or EXIF user comments of the image file!',
        'It also writes down your seed number (the secret random number used to generate that exact version), the sampler algorithm name, the CFG scale, the LoRA models you blended, and the exact software version.',
        'Anyone who downloads your artwork from Twitter, Reddit, or Discord can open the file in a free metadata inspector and copy your entire prompt word-for-word in less than two seconds, allowing them to recreate your style effortlessly!',
      ],
    },
    {
      q: 'Why should artists and creators remove AI prompts before sharing art online?',
      a: [
        'Creating breathtaking AI artwork is not just pressing a single button—it requires deep experimentation, artistic vision, and hours of prompt crafting and parameter tuning to discover unique visual aesthetics that stand out from the crowd.',
        'Your prompt craft and workflow recipes are your creative intellectual property. If you post raw files with embedded parameters, anyone can clone your style, reproduce your characters, and even sell variations of your work without doing any of the hard creative discovery themselves.',
        'Furthermore, many prompt fields accidentally capture private project notes, references to real people, or custom training checkpoints that contain proprietary studio assets or client names.',
        'Removing AI prompt metadata ensures that when the world sees your artwork, they judge and appreciate the visual illustration on its own merits without snooping on your behind-the-scenes recipes.',
        'Our selective AI cleaner sweeps away the recipe card while leaving the finished visual painting completely pristine and protected!',
      ],
    },
    {
      q: 'How does this tool keep authentic camera information while deleting only AI tags?',
      a: [
        'Many digital photographers and mixed-media artists use AI tools to touch up real-world photos. For example, you might take an authentic portrait of your friend with a Sony camera, and then use an AI inpainting tool to clean up a smudge in the background or remove a distraction.',
        'If you use a blunt, standard metadata stripper, it throws away everything with a giant broom—including the authentic camera make, the lens focal length, the aperture, and the calendar timestamp when the real photo was taken.',
        'Our AI-Only Remover is a smart, selective filter! It specifically inspects every single metadata tag in the file header, looking for known AI generators and parameter signatures like "Midjourney," "Stable Diffusion," "prompt," "workflow," "steps:," and "sampler:."',
        'If it finds an AI prompt tag, it carefully deletes only that specific tag. But if it sees authentic camera tags—like Sony A7IV, 85mm f/1.4, or DateTimeOriginal—it protects them and keeps them completely intact!',
        'This gives hybrid photographers and digital artists the perfect balance: your camera gear and timeline sorting stay accurate, while your AI prompts and diffusion parameters are wiped clean.',
      ],
    },
    {
      q: 'Does removing AI prompts change the dragon, character, or colors in my artwork?',
      a: [
        'No, not in any way whatsoever! Your artwork will look 100% identical in every color, brush stroke, and intricate detail. There is zero change to the visual pixels.',
        'Think of baking a delicious plate of cookies from a secret family recipe. If you take the recipe index card and lock it away in your desk drawer, do the cookies on the kitchen counter disappear or taste less sweet? Of course not! The cookies are already baked and delicious.',
        'In digital image files, the picture pixels are the delicious cookies. The AI prompt and parameters are just the paper recipe card tucked into the file header.',
        'Our tool only unclips the paper recipe card and drops it into the digital shredder. It never compresses, crops, or alters the pixels of your dragons, characters, or landscapes.',
        'When you share your cleaned artwork online, it will look just as stunning and breathtaking as the moment it was rendered, but your secret prompt recipe remains yours alone!',
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      {/* Editorial Masthead */}
      <header className="mb-10 text-center max-w-3xl mx-auto">
        <div className="editorial-kicker mb-3">
          VOL. XII // SELECTIVE PROMPT PURGE &amp; EXIF RETENTION
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-ink dark:text-chalk mb-4 leading-tight">
          AI-Only Metadata Remover
        </h1>
        <p className="font-serif italic text-base sm:text-lg text-ink/75 dark:text-chalk/75 leading-relaxed">
          Surgically purges Midjourney prompts, Stable Diffusion parameters, and diffusion workflows while preserving camera EXIF, lenses, and capture timestamps.
        </p>

        {/* Technical Specification Bar */}
        <div className="mt-6 pt-4 border-t border-hairline flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] text-ink/60 dark:text-chalk/60 uppercase tracking-widest">
          <span>FILTER: AI PARAMETERS ONLY</span>
          <span className="opacity-40">/</span>
          <span>CAMERA HARDWARE EXIF: PRESERVED</span>
          <span className="opacity-40">/</span>
          <span>AIR-GAPPED STREAM</span>
        </div>
      </header>

      {/* Interactive Tool with Transparent Progress Stepper */}
      <CoreRemoverTool toolType="ai-only" />

      <section className="max-w-4xl mx-auto mt-16 space-y-10">
        {/* Explanatory Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          <article className="editorial-card p-6 md:p-8 space-y-4">
            <div className="editorial-kicker">DISPATCH // INTELLECTUAL PROPERTY</div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink dark:text-chalk">
              Why AI pictures remember secret spells (The magical recipe card)
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-ink/80 dark:text-chalk/80 leading-relaxed font-sans">
              <p>
                When you ask a magic AI computer robot like Midjourney, DALL-E, or Stable Diffusion to paint a magnificent dragon or magical castle, you type out a special sentence called a &ldquo;prompt.&rdquo;
              </p>
              <p>
                That prompt is like a magic spell recipe. You might have spent hours figuring out which magical words make the dragon’s scales shine brightest or make the castle glow in the sunset.
              </p>
              <p>
                The AI robot paints the dragon, but it secretly folds up your exact prompt spell and glues it inside the picture file! Anyone who downloads your dragon can read your exact magic words.
              </p>
              <p>
                Our tool pulls out that folded secret spell and drops it into the paper shredder, so your dragon stays glorious while your secret magic words stay completely private!
              </p>
            </div>
          </article>

          <article className="editorial-card p-6 md:p-8 space-y-4">
            <div className="editorial-kicker">PROTOCOL // DUAL-TIER PRESERVATION</div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink dark:text-chalk">
              Selective cleaning: Erasing AI tags, keeping real memories
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-ink/80 dark:text-chalk/80 leading-relaxed font-sans">
              <p>
                What if you took a real camera photo of your family on vacation, and then used an AI tool to touch up the lighting or remove a photobomber in the background?
              </p>
              <p>
                You still want your photo album to remember that the picture was taken on family vacation with your camera lens. You just do not want the file to say &ldquo;Touched up by AI with prompt: remove stranger.&rdquo;
              </p>
              <p>
                Our tool uses a smart selective scanner. It searches specifically for AI words like Midjourney, Stable Diffusion, and prompt parameters, and deletes only those tags.
              </p>
              <p>
                Your real camera model and vacation date stamps are preserved 100% intact, giving you the cleanest, most professional hybrid image possible!
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
