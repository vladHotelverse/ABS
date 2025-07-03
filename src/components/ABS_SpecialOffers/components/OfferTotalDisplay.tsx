import type React from 'react'
import type { OfferLabels } from '../types'

export interface OfferTotalDisplayProps {
  totalLabel: string
  totalPrice: string
  basePrice: string
  quantity: number
  persons?: number
  nights?: number
  offerType: 'perStay' | 'perPerson' | 'perNight'
  isBooked?: boolean
  labels: OfferLabels
}

const OfferTotalDisplay: React.FC<OfferTotalDisplayProps> = ({
  totalLabel,
  totalPrice,
  basePrice,
  quantity,
  persons,
  nights,
  offerType,
  isBooked = false,
  labels,
}) => {
  const showBreakdown =
    (offerType === 'perPerson' && (persons || 1) > 1) || (offerType === 'perNight' && (nights || 1) > 1) || quantity > 1

  return (
    <div
      className={`rounded-lg p-4 border ${isBooked ? 'bg-green-50 border-green-200' : 'bg-neutral-50/50 border-neutral-200'}`}
    >
      <div className="flex justify-between items-center">
        <span className="font-medium text-base">{totalLabel}:</span>
        <div className="flex flex-col items-end">
          <span className="text-xl font-bold">{totalPrice}</span>
          {showBreakdown && (
            <span className="text-xs text-neutral-500 mt-1">
              {basePrice} × {quantity}
              {offerType === 'perPerson' &&
                ` × ${persons || 1} ${(persons || 1) === 1 ? labels.personSingular : labels.personPlural}`}
              {offerType === 'perNight' &&
                ` × ${nights || 1} ${(nights || 1) === 1 ? labels.nightSingular : labels.nightPlural}`}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default OfferTotalDisplay
