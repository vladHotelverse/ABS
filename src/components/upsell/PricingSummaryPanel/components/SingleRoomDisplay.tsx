'use client'

import { Users } from 'lucide-react'
import type React from 'react'
import RoomContent from '@/components/upsell/PricingSummaryPanel/components/RoomContent'
import type { CartSection, UILabels } from '@/components/upsell/PricingSummaryPanel/types'

export interface SingleRoomDisplayProps {
  id: string
  displayName: string
  formattedNights: string
  formattedTotal: string
  sections: CartSection[]
  guestCount?: number
  labels: UILabels
  onRemoveItem?: (itemId: string, itemName: string) => void
  readonly?: boolean
}

/**
 * Displays a single room with guest count, name, nights, and content
 */
const SingleRoomDisplay: React.FC<SingleRoomDisplayProps> = ({
  displayName,
  formattedNights,
  formattedTotal,
  sections,
  guestCount,
  labels,
  onRemoveItem,
  readonly,
}) => {
  return (
    <div className="px-4">
      <div className="rounded-t-lg bg-card p-4">
        <div className="flex items-center justify-between gap-2">
          <section className="flex gap-2">
            <div className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground text-xs">
              <Users size={12} aria-hidden="true" />
              <span> {guestCount}</span>
            </div>
            <h3 className="font-semibold text-card-foreground text-md">{displayName}</h3>
          </section>
          <p className="text-muted-foreground text-xs">{formattedNights}</p>
        </div>
      </div>
      <RoomContent
        sections={sections}
        formattedTotal={formattedTotal}
        labels={labels}
        onRemoveItem={(itemId, itemName) => onRemoveItem?.(itemId, itemName)}
        readonly={readonly}
      />
    </div>
  )
}

export default SingleRoomDisplay
