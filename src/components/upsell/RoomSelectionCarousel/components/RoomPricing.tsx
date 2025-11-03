'use client'

import type React from 'react'
import { UiButton } from '@/components/ui/button'

export interface RoomPricingProps {
  price: string
  oldPrice?: number
  currencySymbol: string
  nightText: string
  isSelected: boolean
  selectText: string
  removeText: string
  instantConfirmationText?: string
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
  instantConfirmationText = '',
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
        </div>
        {instantConfirmationText && (
          <span className="text-xs font-medium uppercase text-emerald-600">{instantConfirmationText}</span>
        )}
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
        </div>
      )}
    </div>
  )
}

export default RoomPricing
