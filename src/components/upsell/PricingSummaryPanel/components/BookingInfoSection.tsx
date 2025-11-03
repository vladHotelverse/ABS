'use client'

import type React from 'react'
import { memo } from 'react'

export interface BookingInfoSectionProps {
  roomCount: number
  sectionTitle: string
  labels?: {
    roomsCountLabel?: string
  }
  className?: string
}

/**
 * Pure UI component - displays room count and customization title
 * Simplified version for showing only essential booking section info
 */
const BookingInfoSection: React.FC<BookingInfoSectionProps> = memo(
  ({ roomCount, sectionTitle, labels, className = '' }) => {
    return (
      <div className={`w-full overflow-hidden rounded-t-lg bg-white border-b ${className}`}>
        <div className="flex items-center justify-between p-4">
          {/* Section Title */}
          <div>
            <h3 className="font-semibold text-base text-foreground">{sectionTitle}</h3>
          </div>

          {/* Room Count Badge */}
          <span className="rounded bg-primary/10 px-3 py-1.5 font-medium text-primary text-xs">
            {roomCount} {labels?.roomsCountLabel || 'Rooms'}
          </span>
        </div>
      </div>
    )
  }
)

BookingInfoSection.displayName = 'BookingInfoSection'

export default BookingInfoSection
