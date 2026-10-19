import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Us | Feedback & Inquiries',
  description:
    'Have questions or suggestions regarding our image metadata remover? Contact our team anytime.',
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 md:py-16">
      <article className="editorial-card p-6 md:p-12">
        <div className="editorial-kicker mb-3">
          DISPATCH DESK // COMMUNICATIONS &amp; INQUIRIES
        </div>

        <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-ink dark:text-chalk mb-6">
          Contact the Lab
        </h1>
        <div className="text-ink/80 dark:text-chalk/80 text-sm sm:text-base leading-relaxed space-y-5 font-sans">
          <p>
            Have technical inquiries, bug reports on specific camera models, or feedback on our privacy engine? The engineering team welcomes direct dispatches.
          </p>
          <div className="bg-surface-subtle border border-hairline rounded-lg p-6 text-center my-6">
            <p className="font-mono text-[11px] text-ink/60 dark:text-chalk/60 uppercase tracking-widest mb-1">Electronic Mail Inquiries</p>
            <p className="font-mono text-base sm:text-lg font-bold text-ink dark:text-chalk select-all">hello@metazap.com</p>
            <p className="font-mono text-[11px] text-ink/50 dark:text-chalk/50 mt-2">Standard dispatch response time: 24–48 hours.</p>
          </div>
          <p className="text-xs text-ink/70 dark:text-chalk/70 italic border-l-2 border-hairline pl-4">
            Notice: Because MetaZap executes strictly client-side within browser RAM, our team maintains zero server logs, databases, or access to your image files. We cannot retrieve or restore files once your browser tab is closed.
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-hairline flex items-center justify-between font-mono text-xs">
          <Link
            href="/"
            className="text-ink dark:text-chalk hover:underline uppercase font-bold"
          >
            ← RETURN TO TOOLKIT INDEX
          </Link>
          <Link
            href="/privacy-policy"
            className="text-ink/60 dark:text-chalk/60 hover:text-ink dark:hover:text-chalk uppercase"
          >
            Privacy Policy →
          </Link>
        </div>
      </article>
    </div>
  );
}
