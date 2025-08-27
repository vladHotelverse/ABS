import type React from 'react'
import { UiButton } from '../../ui/button'
import { SegmentBadge } from '../../ui/segment-badge'
import type { RoomOption } from '../types'

export interface RoomPricingProps {
  price: number
  oldPrice?: number
  currencySymbol: string
  nightText: string
  isSelected: boolean
  selectText: string
  removeText: string
  instantConfirmationText: string
  segmentDiscount?: RoomOption['segmentDiscount']
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
  instantConfirmationText,
  segmentDiscount,
  onSelect,
}) => {
  return (
    <div className="flex items-start justify-between gap-4 mt-2 mx-2">
      <div className='flex flex-col'>
        {/* Price Display */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-2xl md:text-3xl font-bold">{`${currencySymbol}${price}`}</span>
          {oldPrice && (
            <span className="text-muted-foreground line-through text-sm">{`${currencySymbol}${oldPrice}`}</span>
          )}
          <span className="text-base text-muted-foreground">{nightText}</span>
          {/* Segment Badge */}
          {segmentDiscount && (
            <SegmentBadge segmentDiscount={segmentDiscount} />
          )}
        </div>
      </div>
      <div className="flex flex-col items-end">
        <UiButton
          variant={isSelected ? 'destructive' : 'black'}
          className="w-fit uppercase tracking-wide"
          onClick={(e) => onSelect(e)}
        >
          <span>{isSelected ? removeText : selectText}</span>
        </UiButton>
        {/* Instant Confirmation - positioned below the button */}
        <span className="text-xs text-green-600 dark:text-green-400 font-medium mt-2">{instantConfirmationText}</span>
      </div>
    </div>
  )
}

export default RoomPricing