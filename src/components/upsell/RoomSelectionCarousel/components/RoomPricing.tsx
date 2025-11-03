'use client'

import type React from 'react'
import { UiButton } from '@/components/ui/button'
import type { RoomOption } from '@/components/upsell/RoomSelectionCarousel/types'
import { SegmentBadge } from '@/components/upsell/segment-badge'

export interface RoomPricingProps {
  price: string
  oldPrice?: number
  currencySymbol: string
  nightText: string
  isSelected: boolean
  selectText: string
  removeText: string
  instantConfirmationText: string
  segmentDiscount?: RoomOption['segmentDiscount']
  readonly?: boolean
  onSelect: (e?: React.MouseEvent) => void
}

const RoomPricing: React.FC<RoomPricingProps> = ({
  price,
  oldPrice,
  currencySymbol,
  nightText,
  isSelected,
  selectText,
  removeText,
  segmentDiscount,
  readonly = false,
  onSelect,
}) => {
  return (
    <div className="mx-4 mt-2 flex flex-wrap items-start justify-between gap-4">
      <div className="flex flex-col">
        {/* Price Display */}
        <div className="flex flex-wrap items-end gap-1">
          <span className="font-bold text-2xl md:text-3xl">{`${price}`}</span>
          {oldPrice && (
            <span className="text-muted-foreground text-sm line-through">{`${currencySymbol}${oldPrice}`}</span>
          )}
          <span className="text-base text-muted-foreground">{`${currencySymbol} / ${nightText}`}</span>
          {/* Segment Badge */}
          {segmentDiscount && <SegmentBadge segmentDiscount={segmentDiscount} />}
        </div>
      </div>
      {!readonly && (
        <div className="flex flex-col items-end">
          <UiButton
            variant={isSelected ? 'destructive' : 'default'}
            className="w-fit uppercase tracking-wide"
            onClick={(e) => onSelect(e)}
          >
            <span>{isSelected ? removeText : selectText}</span>
          </UiButton>
          {/* Instant Confirmation - positioned below the button */}
          {/* <span className="mt-2 font-medium text-emerald-800 text-xs dark:text-emerald-600">{instantConfirmationText}</span> */}
        </div>
      )}
    </div>
  )
}

export default RoomPricing
