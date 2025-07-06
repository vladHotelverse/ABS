import { X, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import type React from 'react'
import { cn } from '../../../lib/utils'
import { UiButton } from '../../ui/button'
import PriceChangeIndicator from './PriceChangeIndicator'
import type { PricingItem } from '../types'

interface PricingItemComponentProps {
  item: PricingItem
  euroSuffix: string
  removeLabel: string
  onRemove: () => void
}

const PricingItemComponent: React.FC<PricingItemComponentProps> = ({ item, euroSuffix, removeLabel, onRemove }) => {
  // Get bid status icon and color (only show for certain statuses)
  const getBidStatusIcon = () => {
    if (item.type !== 'bid' || !item.bidStatus) return null
    
    switch (item.bidStatus) {
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'expired':
        return <AlertCircle className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }

  const isBid = item.type === 'bid'

  return (
    <div className={cn(
      "flex justify-between items-center py-2 transition-all duration-300 ease-in-out rounded")}>
      <div className="flex items-center gap-2">
        <span className={cn(
          "text-sm max-w-[200px]",
          isBid && "font-medium text-blue-900"
        )}>{item.name}</span>
        {getBidStatusIcon()}
      </div>
      <div className="flex items-center space-x-2">
        <PriceChangeIndicator 
          price={item.price} 
          euroSuffix={euroSuffix}
          className={isBid ? "text-blue-700" : ""}
        />
        <UiButton
          variant="outline"
          size="icon-xs"
          onClick={onRemove}
          className={cn(
            'rounded-full h-6 w-6 flex items-center justify-center transition-all duration-200',
            isBid 
              ? 'hover:bg-blue-100 hover:border-blue-300 hover:text-blue-600 border-blue-200'
              : 'hover:bg-red-50 hover:border-red-300 hover:text-red-600'
          )}
          aria-label={removeLabel}
        >
          <X size={12} strokeWidth={2} className="h-3 w-3" />
        </UiButton>
      </div>
    </div>
  )
}

export default PricingItemComponent
