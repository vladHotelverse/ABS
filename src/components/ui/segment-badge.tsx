import { type VariantProps, cva } from 'class-variance-authority'
import type * as React from 'react'
import { cn } from '../../lib/utils'
import type { SegmentDiscount, SegmentType } from '../ABS_RoomSelectionCarousel/types'

const segmentBadgeVariants = cva(
  'inline-flex items-center rounded px-2 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      color: {
        blue: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400',
        green: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-400',
        purple: 'bg-purple-500 text-white hover:bg-purple-600 focus:ring-purple-400',
        orange: 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-400',
        red: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400',
        gold: 'bg-yellow-400 text-black hover:bg-yellow-500 focus:ring-yellow-300',
      },
    },
    defaultVariants: {
      color: 'blue',
    },
  }
)

// Default colors for each segment type
const segmentTypeColors: Record<SegmentType, 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gold'> = {
  business: 'blue',
  leisure: 'green', 
  luxury: 'gold',
  budget: 'orange',
  family: 'purple',
  loyalty: 'gold',
  group: 'blue',
  'extended-stay': 'green',
}

export interface SegmentBadgeProps 
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>, 
  VariantProps<typeof segmentBadgeVariants> {
  segmentDiscount: SegmentDiscount
  showIcon?: boolean
}

function SegmentBadge({ 
  className, 
  color, 
  segmentDiscount, 
  showIcon = false,
  ...props 
}: SegmentBadgeProps) {
  const badgeColor = color || (segmentTypeColors[segmentDiscount.segmentType] as 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gold')
  
  const formatDiscount = (discount: SegmentDiscount) => {
    if (discount.discountType === 'percentage') {
      return `${discount.discountAmount}%`
    }
    return `€${discount.discountAmount}`
  }

  const getSegmentIcon = (segmentType: SegmentType) => {
    if (!showIcon) return null
    
    const iconClasses = "h-3 w-3 mr-1"
    switch (segmentType) {
      case 'business':
        return <svg className={iconClasses} fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/></svg>
      case 'luxury':
        return <svg className={iconClasses} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
      case 'family':
        return <svg className={iconClasses} fill="currentColor" viewBox="0 0 20 20"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      case 'group':
        return <svg className={iconClasses} fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/></svg>
      default:
        return null
    }
  }

  return (
    <div 
      className={cn(segmentBadgeVariants({ color: badgeColor }), className)} 
      title={`${segmentDiscount.label} - ${formatDiscount(segmentDiscount)}`}
      {...props}
    >
      {getSegmentIcon(segmentDiscount.segmentType)}
      <span>{segmentDiscount.label} {formatDiscount(segmentDiscount)}</span>
    </div>
  )
}

export { SegmentBadge, segmentBadgeVariants }