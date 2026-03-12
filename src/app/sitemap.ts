import { MetadataRoute } from 'next';
import { TYPE_GUIDES, GUIDE_ARTICLES } from '@/lib/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://pokemonteamevaluator.com';

  const typeRoutes = TYPE_GUIDES.map((guide) => ({
    url: `${baseUrl}/types/${guide.slug}`,
    lastModified: new Date(guide.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const guideRoutes = GUIDE_ARTICLES.map((guide) => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: new Date(guide.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...typeRoutes,
    ...guideRoutes,
  ];
}
