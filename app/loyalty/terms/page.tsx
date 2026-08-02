import Link from 'next/link'

function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-12">
      <div className="flex items-baseline gap-3 mb-5">
        <span
          className="text-[11px] tracking-[0.22em] uppercase text-gold font-inter flex-shrink-0"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {number}
        </span>
        <h2
          className="font-playfair text-navy font-light"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(20px, 2.5vw, 28px)' }}
          dangerouslySetInnerHTML={{ __html: title }}
        />
      </div>
      <div className="pl-8 border-l border-gray-100 space-y-3 text-[14px] leading-[1.85] text-gray-600 font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
        {children}
      </div>
      <div className="mt-8 w-full h-px bg-gray-100" />
    </div>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 list-none">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5">
          <span className="w-3.5 h-px bg-gold/50 flex-shrink-0 mt-[11px]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function PolicyTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <table className="w-full text-[13px] font-inter border border-gray-100" style={{ fontFamily: "'Inter', sans-serif" }}>
        <thead>
          <tr className="bg-navy/5">
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-4 py-3 text-left text-[10px] tracking-[0.2em] uppercase text-navy/60 font-semibold border-b border-gray-100"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-3 border-b border-gray-100 text-gray-700">
                  {ci === row.length - 1 ? (
                    <span className="font-semibold text-navy">{cell}</span>
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function LoyaltyTermsPage() {
  return (
    <main>
      {/* Hero */}
      <section
        className="bg-navy text-center"
        style={{ paddingTop: 'clamp(100px, 15vw, 160px)', paddingBottom: 'clamp(48px, 6vw, 80px)' }}
      >
        <div className="px-5">
          <p
            className="text-[10px] tracking-[0.3em] uppercase text-gold mb-4 font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Mina Rewards Programme
          </p>
          <h1
            className="font-playfair text-white font-light leading-[1.08] mb-5"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(36px, 5vw, 68px)' }}
          >
            Terms &amp; <em className="italic text-gold">Conditions</em>
          </h1>
          <div className="w-16 h-0.5 bg-gold mx-auto mb-6" />
          <p
            className="text-[13px] text-white/40 max-w-sm mx-auto font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Effective June 2025 · Governed by the laws of the Federal Republic of Nigeria
          </p>
        </div>
      </section>

      {/* Document body */}
      <section className="bg-warm-white px-5 sm:px-8 py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <Link
              href="/loyalty"
              className="text-[11px] tracking-[0.18em] uppercase text-gold border-b border-gold/40 pb-0.5 hover:border-gold transition-colors font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              ← Back to Mina Rewards
            </Link>
          </div>

          <Section number="1" title="Introduction">
            <p>The Mina Hotels Rewards Programme ("Programme") is a guest loyalty programme operated by Mina Hotels ("Mina Hotels", "we", "our", or "us") for eligible guests staying at participating Mina Hotels properties.</p>
            <p>Membership in the Programme allows members to earn points and qualifying stay credits for eligible stays and redeem rewards subject to these Terms &amp; Conditions.</p>
            <p>By enrolling in the Programme, members agree to comply with these Terms &amp; Conditions.</p>
          </Section>

          <Section number="2" title="Membership Eligibility">
            <BulletList items={[
              'Membership is open to individuals aged 18 years and above.',
              'Membership is free of charge.',
              'Only one membership account may be maintained per individual.',
              'Membership accounts, points, rewards, and benefits are personal to the registered member and are non-transferable except where expressly permitted under these Terms.',
              'Mina Hotels reserves the right to refuse, suspend, or terminate membership where fraudulent, abusive, or inappropriate activity is suspected.',
            ]} />
          </Section>

          <Section number="3" title="Enrolment">
            <p>Guests may enrol:</p>
            <BulletList items={[
              'Online via the Mina Hotels website;',
              'At participating hotel reception desks; or',
              'Through authorised Mina Hotels digital channels.',
            ]} />
            <p>Members must provide accurate personal information during registration and are responsible for maintaining updated contact details.</p>
          </Section>

          <Section number="4" title="Earning Rewards">
            <p>Members earn points based on the room category booked and paid for during eligible stays.</p>

            <div className="mt-4">
              <p className="text-[10px] tracking-[0.22em] uppercase text-gold mb-3 font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                Standard Room Categories
              </p>
              <PolicyTable
                headers={['Room Category', 'Points Per Night']}
                rows={[
                  ['Standard Room', '100 Points'],
                  ['Deluxe Room', '150 Points'],
                  ['Royal Room', '175 Points'],
                ]}
              />
            </div>

            <div className="mt-6">
              <p className="text-[10px] tracking-[0.22em] uppercase text-gold mb-3 font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                Premium Room Categories
              </p>
              <PolicyTable
                headers={['Room Category', 'Points Per Night']}
                rows={[
                  ['Executive Room', '200 Points'],
                  ['Exclusive Suite', '250 Points'],
                  ['Luxury Suite', '300 Points'],
                ]}
              />
            </div>

            <p className="mt-4">Eligible stays include:</p>
            <BulletList items={[
              'Direct bookings made through Mina Hotels official website;',
              'Walk-in bookings paid directly to Mina Hotels; and',
              'Reservations made through approved Mina Hotels booking channels.',
            ]} />
            <p>Non-eligible stays include:</p>
            <BulletList items={[
              'Complimentary stays;',
              'Staff, employee, or heavily discounted industry rates;',
              'Third-party wholesale bookings unless otherwise approved; and',
              'Group bookings where individual room payment is not made by the member.',
            ]} />
            <p>Only one member may earn points per room. Members must provide their membership number during booking or at check-in to receive points.</p>
          </Section>

          <Section number="5" title="Free Night Redemption">
            <p>Free night redemption is based on the room category selected and the corresponding reward tier.</p>

            <div className="mt-4">
              <p className="text-[10px] tracking-[0.22em] uppercase text-gold mb-3 font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                Standard Redemption Tier
              </p>
              <PolicyTable
                headers={['Redeemable Room', 'Points Required']}
                rows={[
                  ['Standard Room', '500 Points'],
                  ['Deluxe Room', '700 Points'],
                  ['Royal Room', '850 Points'],
                ]}
              />
            </div>

            <div className="mt-6">
              <p className="text-[10px] tracking-[0.22em] uppercase text-gold mb-3 font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                Premium Redemption Tier
              </p>
              <PolicyTable
                headers={['Redeemable Room', 'Points Required']}
                rows={[
                  ['Executive Room', '1,000 Points'],
                  ['Exclusive Suite', '1,500 Points'],
                  ['Luxury Suite', '2,500 Points'],
                ]}
              />
            </div>

            <BulletList items={[
              'Reward stays are subject to room availability at the time of booking.',
              'Mina Hotels does not guarantee availability for reward nights during peak demand periods, public holidays, special event dates, or fully booked periods.',
              'Reward bookings must be made directly through Mina Hotels reservations channels.',
              'Free night rewards cannot be exchanged for cash, sold, or combined with unauthorised promotions.',
              'The value of a free night shall be based on the average daily room rate of the qualifying nights accumulated.',
            ]} />
          </Section>

          <Section number="6" title="Room Occupancy &amp; Member Stay Requirement">
            <BulletList items={[
              'Loyalty benefits and reward redemptions are intended solely for the personal use of the registered member.',
              'The member whose account is used for redemption must be included on the reservation and personally check in and occupy the room.',
              'Government-issued identification may be required at check-in to verify membership ownership.',
              'Members may not redeem points or free nights for resale, commercial use, or unauthorised third-party bookings.',
              'Mina Hotels reserves the right to deny benefits where fraudulent or abusive redemption activity is suspected.',
            ]} />
          </Section>

          <Section number="7" title="Guest &amp; Family Bookings">
            <p>Members may make paid reservations for family members or guests. Loyalty points will only be awarded if the registered member personally stays in the room.</p>
            <p>Limited gifted reward bookings may be permitted at Mina Hotels' discretion, subject to advance guest registration, identity verification, and annual gifting limits.</p>
          </Section>

          <Section number="8" title="Points Transfer Policy">
            <BulletList items={[
              'Points are non-transferable except as approved by Mina Hotels.',
              'Approved transfers may only occur between immediate family members, or between verified accounts approved by Mina Hotels management.',
              'Mina Hotels reserves the right to limit transfer frequency, charge administrative fees, or decline suspicious transfers.',
              'Buying, selling, bartering, or trading points is strictly prohibited.',
            ]} />
          </Section>

          <Section number="9" title="Expiry of Points">
            <p>Points shall expire after eighteen (18) consecutive months of account inactivity. Account activity includes:</p>
            <BulletList items={[
              'Eligible stays;',
              'Point earning;',
              'Reward redemption; or',
              'Qualifying promotional participation.',
            ]} />
            <p>Expired points shall not be reinstated except at Mina Hotels' sole discretion.</p>
          </Section>

          <Section number="10" title="Elite Membership Status">
            <p>Mina Hotels may introduce tiered membership levels. Higher tiers earn bonus points on eligible stays:</p>
            <div className="mt-4">
              <PolicyTable
                headers={['Membership Tier', 'Bonus Multiplier']}
                rows={[
                  ['Silver', 'Base Points'],
                  ['Gold', '+25% Bonus'],
                  ['Platinum', '+50% Bonus'],
                  ['Diamond', '+75% Bonus'],
                ]}
              />
            </div>
            <p className="mt-4">Benefits may include early check-in, late check-out, room upgrades, priority reservations, dining discounts, and exclusive member offers. Qualification criteria may be amended periodically.</p>
          </Section>

          <Section number="11" title="Reservations &amp; Cancellations">
            <BulletList items={[
              "Reward bookings are subject to the hotel's standard cancellation policies.",
              'Failure to check in for a confirmed reward booking may result in forfeiture of points, cancellation of reward certificates, or applicable no-show charges.',
              'Mina Hotels reserves the right to limit reward inventory during high occupancy periods.',
            ]} />
          </Section>

          <Section number="12" title="Fraud, Misuse &amp; Account Suspension">
            <p>The following activities are prohibited:</p>
            <BulletList items={[
              'Creation of duplicate accounts;',
              'False identity usage;',
              'Resale of rewards;',
              'Commercial exploitation of membership benefits; and',
              'Manipulation of points accumulation systems.',
            ]} />
            <p>Mina Hotels may suspend or terminate accounts involved in suspected abuse. In cases of fraud, Mina Hotels may cancel accumulated points, void reward bookings, and refuse future participation.</p>
          </Section>

          <Section number="13" title="Programme Modifications">
            <p>Mina Hotels reserves the right to modify Programme rules, change point earning structures, adjust redemption requirements, or terminate the Programme at any time. Reasonable notice shall be provided where practicable.</p>
          </Section>

          <Section number="14" title="Privacy">
            <p>Personal information collected through the Programme shall be handled in accordance with Mina Hotels' Privacy Policy. Members consent to receiving Programme updates, promotional offers, and membership communications. Members may opt out of marketing communications at any time.</p>
          </Section>

          <Section number="15" title="General Conditions">
            <BulletList items={[
              'Participation in the Programme constitutes acceptance of these Terms & Conditions.',
              'All interpretations of Programme rules shall be at the sole discretion of Mina Hotels.',
              'These Terms shall be governed by the laws of the Federal Republic of Nigeria.',
              'Any disputes arising under the Programme shall be subject to the jurisdiction of Nigerian courts.',
            ]} />
          </Section>

          {/* Dynamic pricing notice */}
          <div className="mb-12 p-6 border border-gold/20 bg-gold/5">
            <p
              className="text-[10px] tracking-[0.22em] uppercase text-gold mb-3 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Dynamic Pricing Notice
            </p>
            <p className="text-[13px] text-gray-600 leading-[1.75] font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
              Mina Hotels reserves the right to increase redemption point requirements during peak periods, public holidays, high-demand seasons, and special events. Reward room inventory may be limited based on occupancy levels and seasonal demand. Premium suites and specialty accommodations may have stricter redemption availability.
            </p>
          </div>

          {/* Promotional note */}
          <div className="mb-12 p-6 border border-gray-100 bg-cream">
            <p
              className="text-[10px] tracking-[0.22em] uppercase text-gold mb-3 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Promotional Offers
            </p>
            <p className="text-[13px] text-gray-600 leading-[1.75] font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
              Mina Hotels may periodically offer double points promotions, seasonal bonuses, tier accelerators, birthday rewards, or direct booking bonuses. Terms for individual promotions will be communicated separately. Promotional multipliers and bonus points are subject to change or withdrawal without prior notice.
            </p>
          </div>

          {/* Contact block */}
          <div className="p-8 bg-navy text-center">
            <p
              className="text-[10px] tracking-[0.28em] uppercase text-gold mb-4 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Contact Us
            </p>
            <p
              className="font-playfair text-white font-light mb-2"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px' }}
            >
              Mina Hotels Rewards Programme
            </p>
            <p
              className="text-[12px] text-white/35 mb-5 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Old GRA, Port Harcourt, Rivers State, Nigeria
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <a
                href="tel:+2349015525389"
                className="text-[13px] text-white/50 hover:text-gold transition-colors font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                +234 901 552 5389
              </a>
              <span className="hidden sm:block text-white/20">·</span>
              <a
                href="mailto:reservations@mina-hotels.com"
                className="text-[13px] text-white/50 hover:text-gold transition-colors font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                reservations@mina-hotels.com
              </a>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/loyalty"
              className="inline-block text-[11px] tracking-[0.22em] uppercase text-gold border-b border-gold/40 pb-0.5 hover:border-gold transition-colors font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Return to Mina Rewards
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
