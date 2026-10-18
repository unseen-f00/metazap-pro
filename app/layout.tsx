import type { Metadata, Viewport } from 'next';
import { Inter, Merriweather } from 'next/font/google';
import './globals.css';

import GlobalHeader from './components/GlobalHeader';
import GlobalFooter from './components/GlobalFooter';
import { ThemeProvider } from './components/ThemeProvider';

/**
 * Mobile-First Responsive Viewport Configuration.
 * Fixes mobile 980px zoom-out emulation bug and adapts status bar color to dark/light theme.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#090d16' },
  ],
};

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const merriweather = Merriweather({
  variable: '--font-merriweather',
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap',
});

/**
 * Page metadata for SEO with updated MetaZap branding.
 */
export const metadata: Metadata = {
  title: {
    default: 'MetaZap | 100% In-Browser Photo Privacy & Metadata Toolkit',
    template: '%s | MetaZap',
  },
  description:
    'Free online tool to strip EXIF data, GPS location coordinates, camera models, and private metadata from your photos. 100% private, zero server uploads, running locally in your browser.',
  openGraph: {
    title: 'MetaZap | The Privacy-First Photo Metadata Toolkit',
    description:
      'Remove hidden EXIF tags, GPS coordinates, and camera info from your images instantly. Runs 100% locally in your browser — zero server uploads, complete privacy.',
    url: 'https://metazap.app',
    siteName: 'MetaZap',
    images: [
      {
        url: 'https://metazap.app/og-preview.png',
        width: 1200,
        height: 630,
        alt: 'MetaZap Photo Privacy and Metadata Toolkit',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MetaZap | The Privacy-First Photo Metadata Toolkit',
    description:
      'Strip hidden EXIF, GPS, and camera metadata from your images instantly. Runs 100% locally in your browser.',
  },
  keywords: [
    'metazap',
    'photo metadata remover',
    'remove EXIF data',
    'remove GPS from photos',
    'photo privacy toolkit',
    'exif cleaner online',
    'image metadata stripper',
    'clean photo metadata',
  ],
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${merriweather.variable} h-full antialiased`}
    >
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1649623506369592"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#fafafa] dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {/* Global Navigation Header */}
          <GlobalHeader />

          {/* Semantic Main Content Container */}
          <main className="flex-1 w-full">{children}</main>

          {/* Global Footer */}
          <GlobalFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
