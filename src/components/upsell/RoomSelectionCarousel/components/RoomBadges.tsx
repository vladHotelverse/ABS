import { Star } from 'lucide-react'
import type React from 'react'

export interface RoomBadgesProps {
  hasDiscount: boolean
  oldPrice?: number
  currentPrice: string
  isSelected: boolean
  selectedText: string
}

const RoomBadges: React.FC<RoomBadgesProps> = ({ hasDiscount, oldPrice, currentPrice, isSelected, selectedText }) => {
  // Calculate discount percentage
  const currentPriceNum = Number.parseFloat(currentPrice)
  const discountPercentage = oldPrice ? Math.round(((oldPrice - currentPriceNum) / oldPrice) * 100) : 0

  return (
    <>
      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute top-3 right-3 z-10 rounded bg-red-500 px-2 py-1 font-bold text-white text-xs">
          -{discountPercentage}%
        </div>
      )}

      {/* Selected Badge */}
      {isSelected && (
        <div className="absolute bottom-3 left-2 z-10 flex items-center gap-1 rounded bg-emerald-600 px-2 py-1 text-emerald-50 text-xs dark:bg-emerald-600 dark:text-white">
          <Star className="h-3 w-3" />
          <span>{selectedText}</span>
        </div>
      )}
    </>
  )
}

export default RoomBadges
