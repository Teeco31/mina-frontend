'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Heart, Share2, ArrowLeft, MessageCircle } from 'lucide-react'
import { fetchBlogPostBySlug, likePost, submitComment, fetchBlogPosts, type PublicBlogPost } from '@/lib/api'

function fmtDate(d?: string) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function RelatedCard({ post }: { post: PublicBlogPost }) {
  return (
    <Link href={`/mina-updates/${post.slug}`} className="group flex flex-col overflow-hidden border border-[#E8E0D0] bg-white no-underline hover:shadow-md transition-shadow">
      {post.coverImage && (
        <div className="aspect-[16/9] overflow-hidden">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      )}
      <div className="p-4">
        <h3 className="text-[14px] font-light leading-snug text-[#0A1628] group-hover:text-[#C9A84C] transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
          {post.title}
        </h3>
        {post.publishedAt && (
          <p className="text-[11px] text-[#9CA3AF] mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>{fmtDate(post.publishedAt)}</p>
        )}
      </div>
    </Link>
  )
}

export default function BlogPostClient({ slug }: { slug: string }) {
  const [post, setPost] = useState<PublicBlogPost | null>(null)
  const [related, setRelated] = useState<PublicBlogPost[]>([])
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)
  const [copied, setCopied] = useState(false)
  const [commentForm, setCommentForm] = useState({ name: '', email: '', content: '' })
  const [commentStatus, setCommentStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchBlogPostBySlug(slug).then((p) => {
      setPost(p)
      setLikes(p?.likes || 0)
      if (p?.category) {
        fetchBlogPosts({ category: p.category, limit: '3' }).then(({ data }) => {
          setRelated(data.filter((r) => r.slug !== slug).slice(0, 3))
        })
      }
      setLoading(false)
    })
  }, [slug])

  const handleLike = async () => {
    if (liked || !post) return
    setLiked(true)
    const newCount = await likePost(post._id)
    setLikes(newCount)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!post) return
    setCommentStatus('submitting')
    const result = await submitComment(post._id, commentForm)
    setCommentStatus(result.success ? 'done' : 'error')
    if (result.success) setCommentForm({ name: '', email: '', content: '' })
  }

  const whatsappUrl = typeof window !== 'undefined'
    ? `https://wa.me/?text=${encodeURIComponent(`${post?.title || ''} — ${window.location.href}`)}`
    : '#'

  const twitterUrl = typeof window !== 'undefined'
    ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post?.title || '')}`
    : '#'

  if (loading) {
    return (
      <main className="pt-28 pb-20 min-h-screen" style={{ background: '#FFFDF7' }}>
        <div className="max-w-[760px] mx-auto px-5">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-[#E8E0D0] rounded w-3/4" />
            <div className="h-4 bg-[#E8E0D0] rounded w-1/2" />
            <div className="h-64 bg-[#E8E0D0] rounded" />
          </div>
        </div>
      </main>
    )
  }

  if (!post) {
    return (
      <main className="pt-28 pb-20 min-h-screen flex items-center justify-center" style={{ background: '#FFFDF7' }}>
        <div className="text-center">
          <p className="text-[16px] text-[#4A5568]" style={{ fontFamily: "'Inter', sans-serif" }}>Post not found.</p>
          <Link href="/mina-updates" className="text-[13px] text-[#C9A84C] underline mt-3 inline-block" style={{ fontFamily: "'Inter', sans-serif" }}>
            Back to Mina Updates
          </Link>
        </div>
      </main>
    )
  }

  const approvedComments = (post.comments || []).filter((c) => c.isApproved)

  return (
    <main style={{ background: '#FFFDF7' }}>
      {/* Cover image header */}
      <div className="relative" style={{ height: '55vh', minHeight: '320px' }}>
        {post.coverImage ? (
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-[#0A1628]" />
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,22,40,0.3) 0%, rgba(10,22,40,0.75) 100%)' }} />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 px-5 text-center">
          {post.category && (
            <span className="text-[10px] tracking-[0.22em] uppercase mb-3 px-3 py-1" style={{ background: '#C9A84C', color: '#0A1628', fontFamily: "'Inter', sans-serif" }}>
              {post.category}
            </span>
          )}
          <h1 className="text-white text-[28px] sm:text-[38px] font-light leading-tight max-w-[760px]" style={{ fontFamily: "'Playfair Display', serif" }}>
            {post.title}
          </h1>
          {post.publishedAt && (
            <p className="text-white/60 text-[12px] mt-3" style={{ fontFamily: "'Inter', sans-serif" }}>
              {post.author && <>{post.author.firstName} {post.author.lastName} · </>}
              {fmtDate(post.publishedAt)} · {post.views.toLocaleString()} views
            </p>
          )}
        </div>
      </div>

      <div className="max-w-[760px] mx-auto px-5 sm:px-8 py-10">
        {/* Back link */}
        <Link href="/mina-updates" className="inline-flex items-center gap-1.5 text-[12px] text-[#9CA3AF] hover:text-[#0A1628] transition-colors mb-8 no-underline" style={{ fontFamily: "'Inter', sans-serif" }}>
          <ArrowLeft size={14} /> Back to Mina Updates
        </Link>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 text-[10px] tracking-[0.12em] uppercase border border-[#E8E0D0] text-[#4A5568]" style={{ fontFamily: "'Inter', sans-serif" }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        {post.content ? (
          <div
            className="prose prose-lg max-w-none mb-10"
            style={{ fontFamily: "'Inter', sans-serif", color: '#374151' }}
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }}
          />
        ) : post.excerpt ? (
          <p className="text-[15px] leading-relaxed text-[#374151] mb-10" style={{ fontFamily: "'Inter', sans-serif" }}>
            {post.excerpt}
          </p>
        ) : null}

        {/* Like + Share */}
        <div className="flex flex-wrap items-center gap-4 py-6 border-t border-b border-[#E8E0D0] mb-10">
          <button
            onClick={handleLike}
            disabled={liked}
            className="flex items-center gap-2 text-[13px] transition-colors disabled:opacity-60"
            style={{ color: liked ? '#E53E3E' : '#4A5568', fontFamily: "'Inter', sans-serif" }}
          >
            <Heart size={16} fill={liked ? '#E53E3E' : 'none'} />
            {likes} {likes === 1 ? 'like' : 'likes'}
          </button>

          <button onClick={handleCopy} className="flex items-center gap-2 text-[13px] text-[#4A5568] hover:text-[#0A1628] transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
            <Share2 size={14} /> {copied ? 'Copied!' : 'Copy link'}
          </button>

          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[13px] text-[#4A5568] hover:text-green-600 transition-colors no-underline" style={{ fontFamily: "'Inter', sans-serif" }}>
            WhatsApp
          </a>

          <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[13px] text-[#4A5568] hover:text-[#0A1628] transition-colors no-underline" style={{ fontFamily: "'Inter', sans-serif" }}>
            X / Twitter
          </a>
        </div>

        {/* Comments */}
        <div className="mb-12">
          <h2 className="text-[22px] font-light mb-6" style={{ fontFamily: "'Playfair Display', serif", color: '#0A1628' }}>
            <MessageCircle size={18} className="inline mr-2 text-[#C9A84C]" />
            Comments ({approvedComments.length})
          </h2>

          {approvedComments.length > 0 && (
            <div className="space-y-4 mb-8">
              {approvedComments.map((c, i) => (
                <div key={i} className="border border-[#E8E0D0] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-medium text-[#0A1628]" style={{ fontFamily: "'Inter', sans-serif" }}>{c.name}</span>
                    <span className="text-[11px] text-[#9CA3AF]" style={{ fontFamily: "'Inter', sans-serif" }}>{fmtDate(c.createdAt)}</span>
                  </div>
                  <p className="text-[13px] text-[#4A5568] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{c.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Comment form */}
          {commentStatus === 'done' ? (
            <div className="border border-[#C9A84C]/30 bg-[#C9A84C]/5 p-5 text-[13px] text-[#4A5568]" style={{ fontFamily: "'Inter', sans-serif" }}>
              Thank you — your comment is awaiting moderation.
            </div>
          ) : (
            <form onSubmit={handleComment} className="space-y-4">
              <h3 className="text-[16px] font-light mb-4" style={{ fontFamily: "'Playfair Display', serif", color: '#0A1628' }}>Leave a comment</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] tracking-[0.1em] uppercase text-[#4A5568] mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>Name *</label>
                  <input
                    type="text"
                    required
                    value={commentForm.name}
                    onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                    className="w-full px-3 py-2.5 border border-[#E8E0D0] text-[13px] focus:outline-none focus:border-[#0A1628] transition-colors bg-white"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
                <div>
                  <label className="block text-[11px] tracking-[0.1em] uppercase text-[#4A5568] mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>Email *</label>
                  <input
                    type="email"
                    required
                    value={commentForm.email}
                    onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                    className="w-full px-3 py-2.5 border border-[#E8E0D0] text-[13px] focus:outline-none focus:border-[#0A1628] transition-colors bg-white"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] tracking-[0.1em] uppercase text-[#4A5568] mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>Comment *</label>
                <textarea
                  required
                  rows={4}
                  value={commentForm.content}
                  onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                  className="w-full px-3 py-2.5 border border-[#E8E0D0] text-[13px] focus:outline-none focus:border-[#0A1628] transition-colors bg-white resize-none"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>
              {commentStatus === 'error' && (
                <p className="text-[12px] text-red-600" style={{ fontFamily: "'Inter', sans-serif" }}>Failed to submit. Please try again.</p>
              )}
              <button
                type="submit"
                disabled={commentStatus === 'submitting'}
                className="px-8 py-3.5 bg-gold text-navy text-[11px] tracking-[0.22em] uppercase font-semibold hover:bg-gold-light transition-colors disabled:opacity-50 cursor-pointer font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {commentStatus === 'submitting' ? 'Submitting…' : 'Submit Comment'}
              </button>
            </form>
          )}
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div>
            <h2 className="text-[22px] font-light mb-6" style={{ fontFamily: "'Playfair Display', serif", color: '#0A1628' }}>
              More from Mina
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((r) => <RelatedCard key={r._id} post={r} />)}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
