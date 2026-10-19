'use client';

/**
 * GlobalHeader.tsx
 * Editorial Masthead Navigation for MetaZap.
 * Features:
 * - Editorial Top Meta Bar (Broadsheet kicker)
 * - Constrained Architectural Brandmark
 * - Catalog Index Mega-Menu (3 structured editorial columns)
 * - Clean tactile ThemeToggle
 * - Mobile Broadsheet Drawer
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
  kicker: string;
  description: string;
  items: ToolItem[];
}

const toolCategories: ToolCategory[] = [
  {
    category: 'Removers & Strippers',
    kicker: 'SECTION 01',
    description: 'Purge location, camera tags & edit histories',
    items: [
      {
        title: 'Metadata Remover',
        description: 'Strip all hidden EXIF tags in one click',
        href: '/photo-metadata-remover',
        badge: 'CORE',
        icon: (props) => (
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        ),
      },
      {
        title: 'Remove GPS Location',
        description: 'Wipe exact latitude & longitude coordinates',
        href: '/remove-gps-photo',
        badge: 'GPS',
        icon: (props) => (
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
      },
      {
        title: 'XMP Remover',
        description: 'Strip Adobe & software edit history packets',
        href: '/xmp-remover',
        icon: (props) => (
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        ),
      },
      {
        title: 'PNG Chunk Remover',
        description: 'Clean tEXt, zTXt & iTXt chunks cleanly',
        href: '/png-metadata-remover',
        icon: (props) => (
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ),
      },
      {
        title: 'C2PA Provenance Remover',
        description: 'Destroy synthetic content credentials',
        href: '/c2pa-remover',
        icon: (props) => (
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        ),
      },
      {
        title: 'HEIC Metadata Stripper',
        description: 'Sanitize Apple iPhone HEIC & HEIF photos',
        href: '/heic-metadata-remover',
        icon: (props) => (
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        ),
      },
      {
        title: 'AI Marker Remover',
        description: 'Purge Midjourney, DALL-E & prompt tags',
        href: '/ai-only-metadata-remover',
        icon: (props) => (
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        ),
      },
    ],
  },
  {
    category: 'Forensic Analysis',
    kicker: 'SECTION 02',
    description: 'Audit private leaks & inspect embedded tags',
    items: [
      {
        title: 'EXIF Deep Clean (Canvas)',
        description: 'Pure raster re-render destroys all tracking',
        href: '/exif-cleaner',
        badge: 'PRO',
        icon: (props) => (
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        ),
      },
      {
        title: 'Photo Privacy Analyzer',
        description: 'Audit leak severity & exposure score (0-100)',
        href: '/photo-privacy-analyzer',
        icon: (props) => (
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      {
        title: 'AI Watermark Scanner',
        description: 'Audit container headers for AI prompts',
        href: '/ai-watermark-checker',
        icon: (props) => (
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        ),
      },
      {
        title: 'AI Image Checker',
        description: 'Detect synthetic generation tags',
        href: '/ai-image-checker',
        icon: (props) => (
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        ),
      },
      {
        title: 'Calculate Metadata Weight',
        description: 'Weigh exact byte overhead vs visual pixels',
        href: '/calculate-metadata',
        icon: (props) => (
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        ),
      },
      {
        title: 'Inspect Metadata Report',
        description: 'Generate full printable dossier of all tags',
        href: '/tell-me-my-metadata',
        icon: (props) => (
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        ),
      },
      {
        title: 'C2PA Certificate Checker',
        description: 'Verify digital signatures & provenance',
        href: '/c2pa-checker',
        icon: (props) => (
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
          </svg>
        ),
      },
    ],
  },
  {
    category: 'Studio & Converters',
    kicker: 'SECTION 03',
    description: 'Bulk process, compress, crop & convert',
    items: [
      {
        title: 'Batch Processor',
        description: 'Clean multiple images with 1-click ZIP export',
        href: '/batch',
        badge: 'MULTI',
        icon: (props) => (
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        ),
      },
      {
        title: 'Dynamic Compressor',
        description: 'Interactive quality & scale reduction sliders',
        href: '/compress',
        icon: (props) => (
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        ),
      },
      {
        title: 'Social Media Cropper',
        description: '1:1 square, 9:16 vertical & 16:9 aspect presets',
        href: '/crop',
        icon: (props) => (
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ),
      },
      {
        title: 'Metadata Editor',
        description: 'Customize copyright, author & timestamp tags',
        href: '/metadata-editor',
        icon: (props) => (
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        ),
      },
      {
        title: 'PNG to JPG Converter',
        description: 'Solid white background fill without dark alpha',
        href: '/png-to-jpg',
        icon: (props) => (
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        ),
      },
      {
        title: 'JPG to PNG Converter',
        description: 'Clean lossless conversion with stripped headers',
        href: '/jpg-to-png',
        icon: (props) => (
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ),
      },
      {
        title: 'Image to WebP Converter',
        description: 'Next-gen high efficiency web compression',
        href: '/image-to-webp',
        icon: (props) => (
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        ),
      },
      {
        title: 'HEIC to JPG Converter',
        description: 'Apple HEIC to universal high-quality JPG',
        href: '/heic-to-jpg',
        icon: (props) => (
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        ),
      },
    ],
  },
];

export default function GlobalHeader() {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const catalogRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (catalogRef.current && !catalogRef.current.contains(event.target as Node)) {
        setIsCatalogOpen(false);
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
    setIsCatalogOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsCatalogOpen(false);
    }, 180);
  };

  const closeAllMenus = () => {
    setIsCatalogOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/90 dark:border-stone-800/90 bg-[var(--background)]/95 backdrop-blur-md transition-colors duration-200">
      {/* Editorial Top Meta Kicker */}
      <div className="w-full border-b border-stone-200/60 dark:border-stone-800/60 bg-stone-100/60 dark:bg-stone-900/60 py-1 px-4 text-center">
        <p className="font-mono text-[10px] tracking-widest uppercase text-stone-500 dark:text-stone-400">
          Client-Side Sandbox Architecture · Zero Remote Packets · All Calculations In Device RAM
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 md:h-18 items-center justify-between">
          {/* Left: Brandmark & Primary Links */}
          <div className="flex items-center gap-6 lg:gap-10">
            <Link
              href="/"
              onClick={closeAllMenus}
              className="group shrink-0 focus:outline-none focus:ring-1 focus:ring-stone-900 dark:focus:ring-stone-100 rounded-lg p-0.5"
              aria-label="MetaZap Home"
            >
              <Logo size="md" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-7">
              <Link
                href="/"
                onClick={closeAllMenus}
                className="text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white transition-colors"
              >
                Overview
              </Link>

              {/* Tools Catalog Dropdown */}
              <div
                ref={catalogRef}
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setIsCatalogOpen((prev) => !prev)}
                  className={`text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 py-2 cursor-pointer ${
                    isCatalogOpen
                      ? 'text-stone-950 dark:text-white'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white'
                  }`}
                  aria-expanded={isCatalogOpen}
                  aria-haspopup="true"
                >
                  <span>Directory / Tools</span>
                  <svg
                    width="12"
                    height="12"
                    className={`w-3 h-3 transition-transform duration-200 shrink-0 ${
                      isCatalogOpen ? 'rotate-180 text-stone-950 dark:text-white' : 'text-stone-400'
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

                {/* Catalog Index Mega-Menu Dropdown */}
                {isCatalogOpen && (
                  <div className="absolute top-full -left-12 mt-1.5 w-[840px] bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-paper-lg p-6 transition-all duration-200 animate-in fade-in slide-in-from-top-1">
                    <div className="grid grid-cols-3 gap-6 divide-x divide-stone-100 dark:divide-stone-800">
                      {toolCategories.map((category, idx) => (
                        <div key={category.category} className={idx > 0 ? 'pl-6' : ''}>
                          {/* Column Header */}
                          <div className="mb-4 pb-2 border-b border-stone-100 dark:border-stone-800">
                            <span className="editorial-kicker text-stone-400 dark:text-stone-500 block">
                              {category.kicker}
                            </span>
                            <span className="font-serif text-sm font-bold text-stone-900 dark:text-stone-100 mt-0.5 block">
                              {category.category}
                            </span>
                            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 leading-snug">
                              {category.description}
                            </p>
                          </div>

                          {/* Tool Links */}
                          <div className="space-y-1">
                            {category.items.map((tool) => (
                              <Link
                                key={tool.href}
                                href={tool.href}
                                onClick={closeAllMenus}
                                className="group/item flex items-start gap-2.5 p-2 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800/60 transition-colors"
                              >
                                <div className="mt-0.5 text-stone-400 group-hover/item:text-stone-900 dark:group-hover/item:text-stone-100 transition-colors shrink-0">
                                  {tool.icon({ className: 'w-4 h-4' })}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 group-hover/item:text-stone-950 dark:group-hover/item:white transition-colors truncate">
                                      {tool.title}
                                    </span>
                                    {tool.badge && (
                                      <span className="font-mono text-[9px] font-semibold px-1 py-0.2 rounded border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 shrink-0">
                                        {tool.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-stone-400 dark:text-stone-500 truncate mt-0.5">
                                    {tool.description}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Catalog Colophon Footer */}
                    <div className="mt-6 pt-3.5 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 bg-stone-50/60 dark:bg-stone-950/40 -mx-6 -mb-6 px-6 py-3 rounded-b-xl">
                      <span className="font-mono text-[11px] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400"></span>
                        Status: 100% In-Browser Memory Execution
                      </span>
                      <Link
                        href="/batch"
                        onClick={closeAllMenus}
                        className="font-mono text-[11px] font-semibold text-stone-900 dark:text-stone-200 hover:underline"
                      >
                        Batch Processing Lab →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/batch"
                onClick={closeAllMenus}
                className="text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white transition-colors"
              >
                Batch Lab
              </Link>

              <Link
                href="/about"
                onClick={closeAllMenus}
                className="text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white transition-colors"
              >
                About
              </Link>
            </nav>
          </div>

          {/* Right: Actions & Theme Toggle */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Editorial Action Buttons (Desktop) */}
            <div className="hidden lg:flex items-center gap-2.5">
              <Link
                href="/exif-cleaner"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-transparent hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-semibold transition-colors"
              >
                <span>Deep Clean</span>
                <span className="font-mono text-[9px] uppercase px-1 py-0.2 rounded bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                  PRO
                </span>
              </Link>

              <Link
                href="/photo-metadata-remover"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-black dark:bg-stone-100 dark:hover:bg-white text-stone-50 dark:text-stone-950 text-xs font-bold transition-colors shadow-2xs"
              >
                <span>Strip Metadata</span>
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="md:hidden">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="p-2 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors border border-stone-200 dark:border-stone-800 flex items-center justify-center cursor-pointer"
                aria-label={isMobileMenuOpen ? 'Close navigation index' : 'Open navigation index'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Editorial Broadsheet Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-[var(--background)] px-5 py-6 max-h-[85vh] overflow-y-auto shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-5">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/photo-metadata-remover"
                onClick={closeAllMenus}
                className="py-2.5 px-3 rounded-lg bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-950 text-xs font-bold text-center"
              >
                Strip Metadata
              </Link>
              <Link
                href="/exif-cleaner"
                onClick={closeAllMenus}
                className="py-2.5 px-3 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold text-center"
              >
                Deep Clean [PRO]
              </Link>
            </div>

            {/* Categorized Tools Index */}
            <div className="space-y-5 pt-3 border-t border-stone-200 dark:border-stone-800">
              <span className="editorial-kicker text-stone-400 dark:text-stone-500 block">
                Catalog Index
              </span>

              {toolCategories.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="font-serif text-xs font-bold text-stone-900 dark:text-stone-100 border-b border-stone-200 dark:border-stone-800 pb-1 flex items-center justify-between">
                    <span>{category.category}</span>
                    <span className="font-mono text-[9px] text-stone-400">{category.kicker}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {category.items.map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={closeAllMenus}
                        className="py-2 px-2.5 text-xs text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-md transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-stone-400 shrink-0">
                            {tool.icon({ className: 'w-4 h-4' })}
                          </span>
                          <span className="truncate">{tool.title}</span>
                        </div>
                        {tool.badge && (
                          <span className="font-mono text-[9px] font-semibold px-1 rounded border border-stone-300 dark:border-stone-700 text-stone-500 shrink-0">
                            {tool.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Drawer Colophon Links */}
            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-col gap-2 text-xs font-medium text-stone-500 dark:text-stone-400">
              <Link href="/" onClick={closeAllMenus} className="hover:text-stone-950 dark:hover:text-white">Home / Overview</Link>
              <Link href="/about" onClick={closeAllMenus} className="hover:text-stone-950 dark:hover:text-white">About MetaZap Studio</Link>
              <Link href="/privacy-policy" onClick={closeAllMenus} className="hover:text-stone-950 dark:hover:text-white">Privacy Manifesto</Link>
              <Link href="/terms-of-service" onClick={closeAllMenus} className="hover:text-stone-950 dark:hover:text-white">Terms of Service</Link>
              <Link href="/contact" onClick={closeAllMenus} className="hover:text-stone-950 dark:hover:text-white">Contact & Inquiries</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
