import type { Metadata } from 'next'
import { fetchBlogPostBySlug } from '@/lib/api'
import BlogPostClient from './BlogPostClient'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://minahotels.com'

type Props = { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await fetchBlogPostBySlug(params.slug)

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'This article could not be found.',
      robots: { index: false, follow: false },
    }
  }

  const title = post.seo?.metaTitle || post.title
  const description = post.seo?.metaDescription || post.excerpt || `Read "${post.title}" on the Mina Hotels blog.`
  const url = `${SITE_URL}/mina-updates/${post.slug}`

  return {
    title,
    description,
    keywords: post.seo?.keywords || post.tags,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      siteName: 'Mina Hotels',
      locale: 'en_NG',
      publishedTime: post.publishedAt,
      authors: post.author ? [`${post.author.firstName} ${post.author.lastName}`] : ['Mina Hotels'],
      tags: post.tags,
      images: post.coverImage
        ? [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }]
        : [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Mina Hotels' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.coverImage ? [post.coverImage] : ['/og-image.jpg'],
    },
  }
}

export default function BlogPostPage({ params }: Props) {
  return <BlogPostClient slug={params.slug} />
}
