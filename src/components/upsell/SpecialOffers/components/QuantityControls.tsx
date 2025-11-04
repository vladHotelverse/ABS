import { Minus, Plus } from 'lucide-react'
import type React from 'react'
import { UiButton } from '@/components/ui/button'
import type { OfferLabels } from '../types'

export interface QuantityControlsProps {
  quantity: number
  onIncrease?: () => void
  onDecrease?: () => void
  disabled?: boolean
  isBooked?: boolean
  labels: OfferLabels
  minQuantity?: number
  maxQuantity?: number
}

const QuantityControls: React.FC<QuantityControlsProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  disabled = false,
  labels,
  minQuantity = 0,
  maxQuantity,
}) => {
  const canDecrease = quantity > minQuantity
  const canIncrease = !maxQuantity || quantity < maxQuantity

  return (
    <div className="flex items-center bg-white border rounded-lg shadow-sm max-h-11">
      <UiButton
        variant="ghost"
        size="icon"
        onClick={() => onDecrease?.()}
        disabled={disabled || !canDecrease}
        aria-label={labels.decreaseQuantityLabel}
        className="h-10 w-10 touch-manipulation"
      >
        <Minus className="h-4 w-4" />
      </UiButton>
      <span className="w-10 text-center font-medium text-lg">{quantity}</span>
      <UiButton
        variant="ghost"
        size="icon"
        onClick={() => onIncrease?.()}
        disabled={disabled || !canIncrease}
        aria-label={labels.increaseQuantityLabel}
        className="h-10 w-10 touch-manipulation"
      >
        <Plus className="h-4 w-4" />
      </UiButton>
    </div>
  )
}

export default QuantityControls
