import type React from 'react'
import { Star, Tag } from 'lucide-react'
import { useMemo } from 'react'

export interface RoomBadgesProps {
  hasDiscount: boolean
  oldPrice?: number
  currentPrice: number
  discountBadgeText: string
  isSelected: boolean
  selectedText: string
  isBidActive: boolean
  bidSubmittedText: string
}

const RoomBadges: React.FC<RoomBadgesProps> = ({
  hasDiscount,
  oldPrice,
  currentPrice,
  discountBadgeText,
  isSelected,
  selectedText,
  isBidActive,
  bidSubmittedText,
}) => {
  const discountBadge = useMemo(() => {
    if (!hasDiscount || !oldPrice || oldPrice === 0) return null
    
    const discountPercentage = Math.round((1 - currentPrice / oldPrice) * 100)
    const badgeText = discountBadgeText.includes('{percentage}')
      ? discountBadgeText.replace('{percentage}', discountPercentage.toString())
      : `${discountBadgeText}${discountPercentage}%`
    
    return (
      <div className="absolute top-3 right-3 bg-black text-white py-1 px-2 rounded text-xs font-bold z-10">
        <span>{badgeText}</span>
      </div>
    )
  }, [hasDiscount, oldPrice, currentPrice, discountBadgeText])

  return (
    <>
      {/* Discount Badge */}
      {hasDiscount && !isSelected && !isBidActive && discountBadge}

      {/* Bid Submitted Badge */}
      {isBidActive && !isSelected && (
        <div className="absolute bottom-3 left-2 z-10 bg-blue-600 text-white text-xs flex items-center gap-1 py-1 px-2 rounded">
          <Tag className="h-3 w-3" />
          <span>{bidSubmittedText}</span>
        </div>
      )}

      {/* Selected Badge */}
      {isSelected && (
        <div className="absolute bottom-3 left-2 z-10 bg-green-600 text-white text-xs flex items-center gap-1 py-1 px-2 rounded">
          <Star className="h-3 w-3" />
          <span>{selectedText}</span>
        </div>
      )}
    </>
  )
}

export default RoomBadges