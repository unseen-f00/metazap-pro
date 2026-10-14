import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Us | Feedback & Inquiries',
  description:
    'Have questions or suggestions regarding our image metadata remover? Contact our team anytime.',
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 md:py-20">
      <div className="paper-card p-8 md:p-12 shadow-paper border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
        <h1 className="font-[family-name:var(--font-merriweather)] text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
          Contact Us
        </h1>
        <div className="text-slate-600 dark:text-slate-300 text-base leading-relaxed space-y-5">
          <p>
            Have questions, feedback, or need help with a specific image format? We are here to help.
          </p>
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-6 text-center my-6">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Email Inquiries</p>
            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 select-all">hello@metazap.com</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">We typically reply within 24–48 hours.</p>
          </div>
          <p>
            Because our tool runs 100% locally in your browser, please note that we do not have access to any photos you clean, and we cannot recover files once your browser tab is closed.
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <Link
            href="/"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
          >
            ← Back to Photo Cleaner
          </Link>
          <Link
            href="/privacy-policy"
            className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            Privacy Policy →
          </Link>
        </div>
      </div>
    </section>
  );
}
