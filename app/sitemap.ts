import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://metazap.app';
  const now = new Date();

  const routes = [
    '',
    '/about',
    '/ai-cleaner',
    '/ai-image-checker',
    '/ai-only-metadata-remover',
    '/ai-watermark-checker',
    '/batch',
    '/c2pa-checker',
    '/c2pa-remover',
    '/calculate-metadata',
    '/compress',
    '/contact',
    '/crop',
    '/editor',
    '/exif-cleaner',
    '/heic-metadata-remover',
    '/heic-to-jpg',
    '/image-to-webp',
    '/jpg-to-png',
    '/metadata-editor',
    '/photo-metadata-remover',
    '/photo-privacy-analyzer',
    '/png-metadata-remover',
    '/png-to-jpg',
    '/privacy-policy',
    '/remove-gps-photo',
    '/remover',
    '/tell-me-my-metadata',
    '/terms',
    '/terms-of-service',
    '/xmp-remover',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority:
      route === ''
        ? 1.0
        : route.startsWith('/about') ||
          route.startsWith('/terms') ||
          route.startsWith('/privacy') ||
          route.startsWith('/contact')
        ? 0.5
        : 0.8,
  }));
}
