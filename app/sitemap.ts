import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://image-metadata-remover.vercel.app';
  const now = new Date();

  const routes = [
    '',
    '/remover',
    '/photo-metadata-remover',
    '/remove-gps-photo',
    '/exif-cleaner',
    '/png-metadata-remover',
    '/xmp-remover',
    '/c2pa-remover',
    '/heic-metadata-remover',
    '/ai-only-metadata-remover',
    '/photo-privacy-analyzer',
    '/ai-watermark-checker',
    '/ai-image-checker',
    '/calculate-metadata',
    '/tell-me-my-metadata',
    '/c2pa-checker',
    '/editor',
    '/batch',
    '/ai-cleaner',
    '/heic-to-jpg',
    '/about',
    '/privacy-policy',
    '/terms',
    '/contact',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route.startsWith('/about') || route.startsWith('/terms') || route.startsWith('/privacy') ? 0.5 : 0.8,
  }));
}
