import type { Metadata } from 'next'
import Link from 'next/link'
import { fetchBlogPosts, type PublicBlogPost } from '@/lib/api'

export const metadata: Metadata = {
  title: 'Mina Updates',
  description: 'Stories, news and offers from Mina Hotels, Port Harcourt — stay up to date with our latest events, dining specials, and lifestyle features.',
  openGraph: {
    title: 'Mina Updates — Mina Hotels',
    description: 'Stories, news & offers from Mina Hotels Port Harcourt.',
    type: 'website',
  },
}

const CATEGORIES = ['All', 'News', 'Events', 'Offers', 'Dining', 'Lifestyle', 'Travel']

function estimateReadTime(excerpt?: string) {
  if (!excerpt) return 1
  return Math.max(1, Math.ceil(excerpt.split(/\s+/).length / 40))
}

function fmtDate(d?: string) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function BlogCard({ post }: { post: PublicBlogPost }) {
  return (
    <Link
      href={`/mina-updates/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-sm border border-[#E8E0D0] bg-white hover:shadow-lg transition-shadow duration-300 no-underline"
    >
      {/* Cover image */}
      <div className="relative overflow-hidden aspect-[16/9] bg-[#F5F0E8]">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[#C9A84C] text-4xl font-playfair font-light">M</span>
          </div>
        )}
        {post.category && (
          <span
            className="absolute top-3 left-3 text-[10px] tracking-[0.18em] uppercase font-semibold px-2.5 py-1"
            style={{ background: '#C9A84C', color: '#0A1628', fontFamily: "'Inter', sans-serif" }}
          >
            {post.category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h2
          className="text-[17px] font-light leading-snug mb-2 text-[#0A1628] group-hover:text-[#C9A84C] transition-colors"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {post.title}
        </h2>

        {post.excerpt && (
          <p className="text-[13px] text-[#4A5568] leading-relaxed mb-4 line-clamp-3" style={{ fontFamily: "'Inter', sans-serif" }}>
            {post.excerpt}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between text-[11px] text-[#9CA3AF]" style={{ fontFamily: "'Inter', sans-serif" }}>
          <div className="flex items-center gap-2">
            {post.author && (
              <span>{post.author.firstName} {post.author.lastName}</span>
            )}
            {post.author && post.publishedAt && <span>·</span>}
            {post.publishedAt && <span>{fmtDate(post.publishedAt)}</span>}
          </div>
          <div className="flex items-center gap-3">
            <span>{estimateReadTime(post.excerpt)} min read</span>
            <span>{post.views.toLocaleString()} views</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

interface PageProps {
  searchParams: { category?: string; page?: string }
}

export default async function MinaUpdatesPage({ searchParams }: PageProps) {
  const category = searchParams.category?.toLowerCase()
  const page = parseInt(searchParams.page || '1')

  const params: Record<string, string> = { page: String(page), limit: '12' }
  if (category && category !== 'all') params.category = category

  const { data: posts, total, pages } = await fetchBlogPosts(params)

  return (
    <main className="pt-24 pb-20" style={{ background: '#FFFDF7' }}>
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 md:px-12">

        {/* Heading */}
        <div className="text-center mb-12">
          <p
            className="text-[10px] tracking-[0.32em] uppercase mb-4"
            style={{ color: '#C9A84C', fontFamily: "'Inter', sans-serif" }}
          >
            From the hotel
          </p>
          <h1
            className="text-[42px] sm:text-[56px] font-light leading-none mb-4"
            style={{ fontFamily: "'Playfair Display', serif", color: '#0A1628' }}
          >
            Mina Updates
          </h1>
          <p
            className="text-[14px] text-[#4A5568] max-w-md mx-auto"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Stories, news &amp; offers from Mina Hotels
          </p>
        </div>

        {/* Category filter tabs */}
        <div className="flex gap-1 flex-wrap justify-center mb-10">
          {CATEGORIES.map((cat) => {
            const isActive = (!category && cat === 'All') || category === cat.toLowerCase()
            return (
              <Link
                key={cat}
                href={cat === 'All' ? '/mina-updates' : `/mina-updates?category=${cat.toLowerCase()}`}
                className="px-4 py-2 text-[11px] tracking-[0.12em] uppercase transition-all duration-200 no-underline"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  background: isActive ? '#0A1628' : 'transparent',
                  color: isActive ? '#fff' : '#4A5568',
                  border: isActive ? '1px solid #0A1628' : '1px solid #E8E0D0',
                }}
              >
                {cat}
              </Link>
            )
          })}
        </div>

        {/* Posts grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[14px] text-[#9CA3AF]" style={{ fontFamily: "'Inter', sans-serif" }}>
              No posts yet in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-2">
            {page > 1 && (
              <Link
                href={`/mina-updates?${category ? `category=${category}&` : ''}page=${page - 1}`}
                className="px-4 py-2 text-[12px] border border-[#E8E0D0] text-[#4A5568] hover:border-[#0A1628] transition-colors no-underline"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                ← Previous
              </Link>
            )}
            <span className="text-[12px] text-[#9CA3AF] px-3" style={{ fontFamily: "'Inter', sans-serif" }}>
              Page {page} of {pages}
            </span>
            {page < pages && (
              <Link
                href={`/mina-updates?${category ? `category=${category}&` : ''}page=${page + 1}`}
                className="px-4 py-2 text-[12px] border border-[#E8E0D0] text-[#4A5568] hover:border-[#0A1628] transition-colors no-underline"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Next →
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
