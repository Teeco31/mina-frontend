import { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://minahotels.com'
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

async function fetchPublishedSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${API}/blog?limit=200`, { next: { revalidate: 3600 } })
    if (!res.ok) return []
    const json = await res.json()
    return (json.data || []).map((p: { slug: string }) => p.slug).filter(Boolean)
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                      lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/rooms`,           lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/dining`,          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/events`,          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/gallery`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/loyalty`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/reviews`,         lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/contact`,         lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.6 },
    { url: `${BASE}/book`,            lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/mina-updates`,    lastModified: new Date(), changeFrequency: 'daily',   priority: 0.8 },
  ]

  const slugs = await fetchPublishedSlugs()
  const blogPages: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${BASE}/mina-updates/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...blogPages]
}
