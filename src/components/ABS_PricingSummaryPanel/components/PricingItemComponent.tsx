import { X } from 'lucide-react'
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
  return (
    <div className="flex justify-between items-center py-2 transition-all duration-300 ease-in-out rounded">
      <span className="text-sm max-w-[200px]">{item.name}</span>
      <div className="flex items-center space-x-2">
        {item.price > 0 && <PriceChangeIndicator price={item.price} euroSuffix={euroSuffix} />}
        <UiButton
          variant="outline"
          size="icon-xs"
          onClick={onRemove}
          className={cn(
            'rounded-full h-6 w-6 flex items-center justify-center hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200'
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
