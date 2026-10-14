'use client';

/**
 * GlobalHeader.tsx
 * Mobile-First, Accessible, Dark-Mode-Ready Navigation Header for MetaZap.
 * Features:
 * - Strictly constrained <Logo /> component
 * - Desktop Horizontal Mega Menu (hidden md:flex)
 * - Mobile Drawer with Hamburger toggle (md:hidden)
 * - Sleek <ThemeToggle /> for dark/light mode
 * - Strict SVG constraints (width/height attributes to prevent mobile layout shifts)
 */

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Logo from '@/app/components/Logo';
import ThemeToggle from '@/app/components/ThemeToggle';

interface ToolItem {
  title: string;
  description: string;
  href: string;
  badge?: string;
  icon: (props: { className?: string }) => React.JSX.Element;
}

interface ToolCategory {
  category: string;
  description: string;
  badgeColor: string;
  items: ToolItem[];
}

const toolCategories: ToolCategory[] = [
  {
    category: 'Removers',
    description: 'Strip location and private data',
    badgeColor: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    items: [
      {
        title: 'Metadata Remover',
        description: 'Strip all hidden tags in one click',
        href: '/photo-metadata-remover',
        badge: '🔥 CORE',
        icon: (props) => (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        ),
      },
      {
        title: 'Remove GPS Location',
        description: 'Wipe exact latitude and longitude',
        href: '/remove-gps-photo',
        badge: '📍 POPULAR',
        icon: (props) => (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
      },
      {
        title: 'XMP Remover',
        description: 'Strip Adobe & software edit history',
        href: '/xmp-remover',
        icon: (props) => (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        ),
      },
      {
        title: 'PNG Metadata Remover',
        description: 'Clean tEXt, zTXt and iTXt chunks',
        href: '/png-metadata-remover',
        icon: (props) => (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ),
      },
      {
        title: 'C2PA Remover',
        description: 'Wipe synthetic content provenance',
        href: '/c2pa-remover',
        icon: (props) => (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        ),
      },
      {
        title: 'HEIC Metadata Remover',
        description: 'Clean iPhone and Apple HEIC photos',
        href: '/heic-metadata-remover',
        icon: (props) => (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        ),
      },
      {
        title: 'AI Metadata Remover',
        description: 'Strip Midjourney & DALL-E tags',
        href: '/ai-only-metadata-remover',
        icon: (props) => (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        ),
      },
    ],
  },
  {
    category: 'Analyzers',
    description: 'Inspect hidden properties & tags',
    badgeColor: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    items: [
      {
        title: 'EXIF Cleaner (Deep Clean)',
        description: 'Canvas re-rendering bypass',
        href: '/exif-cleaner',
        badge: '⚡ PRO',
        icon: (props) => (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        ),
      },
      {
        title: 'Privacy Analyzer',
        description: 'Audit privacy leak severity',
        href: '/photo-privacy-analyzer',
        icon: (props) => (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      {
        title: 'AI Watermark Checker',
        description: 'Scan container metadata & AI prompts',
        href: '/ai-watermark-checker',
        icon: (props) => (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        ),
      },
      {
        title: 'AI Image Checker',
        description: 'Spot synthetic generation flags',
        href: '/ai-image-checker',
        icon: (props) => (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        ),
      },
      {
        title: 'Calculate Metadata',
        description: 'Inspect exact byte payload size',
        href: '/calculate-metadata',
        icon: (props) => (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        ),
      },
      {
        title: 'Tell Me My Metadata',
        description: 'Generate complete metadata report',
        href: '/tell-me-my-metadata',
        icon: (props) => (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        ),
      },
      {
        title: 'C2PA Checker',
        description: 'Verify digital content provenance',
        href: '/c2pa-checker',
        icon: (props) => (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        ),
      },
    ],
  },
  {
    category: 'Converters & Tools',
    description: 'Edit, batch and convert formats',
    badgeColor: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    items: [
      {
        title: 'Metadata Editor',
        description: 'Customize copyright, author & date tags',
        href: '/metadata-editor',
        icon: (props) => (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        ),
      },
      {
        title: 'Batch Processor',
        description: 'Clean multiple images at once',
        href: '/batch',
        badge: '⚡ MULTI',
        icon: (props) => (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        ),
      },
      {
        title: 'Photo Compressor',
        description: 'Dynamic slider file size reduction',
        href: '/compress',
        badge: '⚡ NEW',
        icon: (props) => (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        ),
      },
      {
        title: 'Social Media Cropper',
        description: '1:1, 9:16 and 16:9 presets',
        href: '/crop',
        badge: '⚡ NEW',
        icon: (props) => (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ),
      },
      {
        title: 'PNG to JPG Converter',
        description: 'Clean white background fill',
        href: '/png-to-jpg',
        icon: (props) => (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        ),
      },
      {
        title: 'JPG to PNG Converter',
        description: 'Lossless PNG format conversion',
        href: '/jpg-to-png',
        icon: (props) => (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ),
      },
      {
        title: 'Image to WebP',
        description: 'Web optimization & space saving',
        href: '/image-to-webp',
        icon: (props) => (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        ),
      },
      {
        title: 'HEIC to JPG Converter',
        description: 'Convert Apple HEIC photos cleanly',
        href: '/heic-to-jpg',
        icon: (props) => (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        ),
      },
    ],
  },
];

export default function GlobalHeader() {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close mega menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMegaMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsMegaMenuOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 200);
  };

  const closeAllMenus = () => {
    setIsMegaMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Left Group: Logo + Main Nav Links */}
          <div className="flex items-center gap-6 lg:gap-8">
            {/* Strictly Sized Logo */}
            <Link
              href="/"
              onClick={closeAllMenus}
              className="group shrink-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl"
              aria-label="MetaZap Homepage"
            >
              <Logo size="md" />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                onClick={closeAllMenus}
                className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Home
              </Link>

              {/* Tools Mega Menu Wrapper */}
              <div
                ref={menuRef}
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setIsMegaMenuOpen((prev) => !prev)}
                  className={`text-sm font-semibold transition-colors flex items-center gap-1.5 py-2 cursor-pointer ${
                    isMegaMenuOpen
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                  aria-expanded={isMegaMenuOpen}
                  aria-haspopup="true"
                >
                  <span>Tools</span>
                  <svg
                    width="14"
                    height="14"
                    className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
                      isMegaMenuOpen ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Mega Menu Dropdown (Desktop Only) */}
                {isMegaMenuOpen && (
                  <div className="absolute top-full -left-8 mt-2 w-[820px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xl p-6 transition-all duration-200 animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-3 gap-6 divide-x divide-slate-100 dark:divide-slate-800">
                      {toolCategories.map((category, idx) => (
                        <div key={category.category} className={idx > 0 ? 'pl-6' : ''}>
                          {/* Category Header */}
                          <div className="mb-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900 dark:text-white tracking-wide uppercase">
                                {category.category}
                              </span>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${category.badgeColor}`}>
                                {category.items.length}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{category.description}</p>
                          </div>

                          {/* Category Tool Links */}
                          <div className="space-y-1">
                            {category.items.map((tool) => (
                              <Link
                                key={tool.href}
                                href={tool.href}
                                onClick={closeAllMenus}
                                className="group/item flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                              >
                                <div className="mt-0.5 p-1 rounded-lg text-slate-500 dark:text-slate-400 group-hover/item:text-indigo-600 dark:group-hover/item:text-indigo-400 group-hover/item:bg-indigo-50 dark:group-hover/item:bg-indigo-950/50 transition-colors shrink-0">
                                  {tool.icon({ className: 'w-4 h-4 shrink-0' })}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover/item:text-indigo-600 dark:group-hover/item:text-indigo-400 transition-colors truncate">
                                      {tool.title}
                                    </span>
                                    {tool.badge && (
                                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 shrink-0">
                                        {tool.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                                    {tool.description}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Mega Menu Callout */}
                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-slate-50/70 dark:bg-slate-800/40 -mx-6 -mb-6 p-4 rounded-b-2xl">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        All tools run 100% locally in your web browser — zero server uploads.
                      </span>
                      <Link
                        href="/batch"
                        onClick={closeAllMenus}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Batch Clean Photos →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/about"
                onClick={closeAllMenus}
                className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                About
              </Link>
            </nav>
          </div>

          {/* Right Group: Dark Mode Toggle + Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Dark Mode Switcher */}
            <ThemeToggle />

            {/* Featured Action Badges (Desktop/Tablet) */}
            <div className="hidden lg:flex items-center gap-2.5">
              <Link
                href="/exif-cleaner"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-bold transition-all shadow-2xs"
              >
                <span>⚡ Deep Clean</span>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100">
                  PRO
                </span>
              </Link>

              <Link
                href="/photo-metadata-remover"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all"
              >
                <span>🔥 Metadata Remover</span>
              </Link>
            </div>

            {/* Mobile Menu Trigger (Hamburger) */}
            <div className="md:hidden">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors border border-slate-200 dark:border-slate-800 flex items-center justify-center cursor-pointer"
                aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <svg width="20" height="20" className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg width="20" height="20" className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Visible only below md breakpoint) */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-5 max-h-[85vh] overflow-y-auto shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-4">
            {/* Top Quick Links */}
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/photo-metadata-remover"
                onClick={closeAllMenus}
                className="py-2.5 px-3 rounded-xl bg-indigo-600 text-white text-xs font-bold text-center shadow-xs"
              >
                🔥 Quick Remover
              </Link>
              <Link
                href="/exif-cleaner"
                onClick={closeAllMenus}
                className="py-2.5 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800 text-xs font-bold text-center"
              >
                ⚡ Deep Clean
              </Link>
            </div>

            {/* Categorized Tools List on Mobile */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                All Privacy Tools
              </span>

              {toolCategories.map((category) => (
                <div key={category.category} className="space-y-1.5">
                  <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide px-1">
                    {category.category}
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {category.items.map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={closeAllMenus}
                        className="py-2 px-3 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-slate-400 dark:text-slate-500 shrink-0">
                            {tool.icon({ className: 'w-4 h-4 shrink-0' })}
                          </span>
                          <span className="truncate">{tool.title}</span>
                        </div>
                        {tool.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 shrink-0">
                            {tool.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Navigation Links */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <Link href="/" onClick={closeAllMenus} className="py-1 px-1 hover:text-indigo-600">Home</Link>
              <Link href="/about" onClick={closeAllMenus} className="py-1 px-1 hover:text-indigo-600">About MetaZap</Link>
              <Link href="/privacy-policy" onClick={closeAllMenus} className="py-1 px-1 hover:text-indigo-600">Privacy Policy</Link>
              <Link href="/terms-of-service" onClick={closeAllMenus} className="py-1 px-1 hover:text-indigo-600">Terms of Service</Link>
              <Link href="/contact" onClick={closeAllMenus} className="py-1 px-1 hover:text-indigo-600">Contact Support</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
