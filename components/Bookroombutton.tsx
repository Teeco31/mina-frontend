'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import BookingModal from './BookingModal'
import { type FallbackRoom } from '@/lib/fallback'

interface Props {
  room: FallbackRoom
}

export default function BookRoomButton({ room }: Props) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Wait for client mount before using portals
  useEffect(() => { setMounted(true) }, [])

  const modal = open && mounted
    ? createPortal(
        <BookingModal
          isOpen={open}
          onClose={() => setOpen(false)}
          preSelectedRoom={room}
        />,
        document.body
      )
    : null

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-block px-8 py-3 bg-gold text-white text-[11px] tracking-[0.2em] uppercase hover:bg-gold-light transition-colors"
      >
        Book Now
      </button>
      {modal}
    </>
  )
}