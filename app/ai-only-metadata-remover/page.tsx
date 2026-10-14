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
    <section className="max-w-5xl mx-auto px-6 py-16 md:py-20">
      <div className="paper-card p-8 md:p-12 mb-10 shadow-paper border border-slate-200/80 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300 text-xs font-semibold mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
          Selective AI Cleaner · Preserves Camera EXIF
        </div>
        <h1 className="font-[family-name:var(--font-merriweather)] text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
          AI-Only Metadata Remover
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Strip AI generation prompts, diffusion parameters, and workflow histories from your images while keeping authentic camera details completely intact.
        </p>
      </div>

      {/* Interactive Tool with Transparent Progress Stepper */}
      <CoreRemoverTool toolType="ai-only" />

      <section className="max-w-4xl mx-auto mt-16 space-y-12">
        {/* Explanatory Sections with Massive ELI5 Content */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="paper-card p-6 md:p-8 space-y-4 border border-slate-200/80 dark:border-slate-800">
            <h2 className="font-[family-name:var(--font-merriweather)] text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Why AI pictures remember secret spells (The magical recipe card)
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              When you ask a magic AI computer robot like Midjourney, DALL-E, or Stable Diffusion to paint a magnificent dragon or magical castle, you type out a special sentence called a &ldquo;prompt.&rdquo;
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              That prompt is like a magic spell recipe. You might have spent hours figuring out which magical words make the dragon’s scales shine brightest or make the castle glow in the sunset.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              The AI robot paints the dragon, but it secretly folds up your exact prompt spell and glues it inside the picture file! Anyone who downloads your dragon can read your exact magic words.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Our tool pulls out that folded secret spell and drops it into the paper shredder, so your dragon stays glorious while your secret magic words stay completely private!
            </p>
          </div>

          <div className="paper-card p-6 md:p-8 space-y-4 border border-slate-200/80 dark:border-slate-800">
            <h2 className="font-[family-name:var(--font-merriweather)] text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Selective cleaning: Erasing AI tags, keeping real memories
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              What if you took a real camera photo of your family on vacation, and then used an AI tool to touch up the lighting or remove a photobomber in the background?
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              You still want your photo album to remember that the picture was taken on family vacation with your camera lens. You just do not want the file to say &ldquo;Touched up by AI with prompt: remove stranger.&rdquo;
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Our tool uses a smart selective scanner. It searches specifically for AI words like Midjourney, Stable Diffusion, and prompt parameters, and deletes only those tags.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Your real camera model and vacation date stamps are preserved 100% intact, giving you the cleanest, most professional hybrid image possible!
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
              Discover how AI prompt metadata works and how selective cleaning keeps your creative recipes safe.
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
