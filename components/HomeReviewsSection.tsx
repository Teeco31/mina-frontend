import Link from 'next/link'
import FadeIn from './FadeIn'

interface Review {
  _id: string
  guestName: string
  overallRating: number
  body: string
  roomCategory?: string
  createdAt: string
}

async function fetchReviews(): Promise<Review[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/reviews?status=approved&limit=3&sort=-createdAt`,
      { next: { revalidate: 600 } }
    )
    if (!res.ok) throw new Error('non-ok')
    const json = await res.json()
    return json.data || []
  } catch {
    return []
  }
}

export default async function HomeReviewsSection() {
  const reviews = await fetchReviews()

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
          Be the first to share your Mina Hotels experience.
        </p>
        <Link
          href="/reviews"
          className="inline-block mt-4 px-8 py-3.5 border border-gold text-gold text-[11px] tracking-[0.22em] uppercase hover:bg-gold hover:text-navy font-semibold transition-all duration-300 no-underline font-inter"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Write a Review
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* Testimonial cards — cream bg, gold quotation, italic serif */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {reviews.slice(0, 3).map((r, i) => (
          <FadeIn key={r._id} delay={`${i * 0.1}s`}>
            <div
              className="relative p-8 sm:p-10 text-left h-full flex flex-col bg-cream border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-500"
            >
              {/* Gold quotation mark */}
              <span
                className="absolute top-6 right-8 text-[64px] leading-none text-gold/20 font-playfair select-none"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                &rdquo;
              </span>

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, j) => (
                  <span key={j} className={`text-[14px] ${j < r.overallRating ? 'text-gold' : 'text-gray-200'}`}>
                    ★
                  </span>
                ))}
              </div>

              {/* Review text — italic serif */}
              <p
                className="font-playfair text-[16px] sm:text-[17px] italic font-light leading-[1.7] text-navy mb-6 flex-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                &ldquo;{r.body}&rdquo;
              </p>

              {/* Guest name + date */}
              <div className="border-t border-gray-200 pt-4">
                <strong
                  className="block text-[12px] tracking-[0.08em] uppercase text-navy font-semibold mb-0.5 font-inter"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {r.guestName}
                </strong>
                <span
                  className="text-[11px] text-gray-400 font-inter"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {new Date(r.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      <div className="text-center mt-10">
        <Link
          href="/reviews"
          className="inline-block px-8 py-3.5 border border-gold text-gold text-[11px] tracking-[0.22em] uppercase hover:bg-gold hover:text-navy font-semibold transition-all duration-300 no-underline font-inter"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Read All Reviews
        </Link>
      </div>
    </>
  )
}
