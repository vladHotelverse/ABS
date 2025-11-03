'use client'

import type React from 'react'
import { BottomBar } from './components'
import type { BookingFooterProps } from './types'

const BookingFooter: React.FC<BookingFooterProps> = ({ text = {}, hotelName, className }) => {
  return (
    <footer
      className={`relative border-t bg-background text-foreground transition-colors duration-300 ${className || ''}`}
    >
      <div className="container mx-auto px-4 py-4 md:px-6 lg:px-8">
        <BottomBar
          text={{
            copyrightText: text.copyrightText,
          }}
          hotelName={hotelName}
        />
      </div>
    </footer>
  )
}

export { BookingFooter }
export default BookingFooter
