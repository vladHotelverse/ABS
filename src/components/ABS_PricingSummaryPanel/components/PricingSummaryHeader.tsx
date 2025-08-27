import type React from 'react'
import { memo } from 'react'

export interface PricingSummaryHeaderProps {
  roomImage: string
  roomImageAltText: string
  className?: string
}

const PricingSummaryHeader: React.FC<PricingSummaryHeaderProps> = memo(({
  roomImage,
  roomImageAltText,
  className = ''
}) => {
  return (
    <div className={`w-full md:h-40 bg-muted overflow-hidden ${className}`}>
      <img 
        src={roomImage} 
        alt={roomImageAltText} 
        className="w-full h-full object-cover" 
      />
    </div>
  )
})

PricingSummaryHeader.displayName = 'PricingSummaryHeader'

export default PricingSummaryHeader