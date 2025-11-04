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
  offerTitle?: string
  isBooked?: boolean
  labels: OfferLabels
  reservationPersonCount?: number
  // Pre-calculated quantity unit label from parent (e.g., "people", "nights", "days", "times")
  quantityUnit?: string
}

const OfferTotalDisplay: React.FC<OfferTotalDisplayProps> = ({
  totalLabel,
  totalPrice,
  basePrice,
  quantity,
  persons,
  nights,
  offerType,
  offerTitle,
  isBooked = false,
  labels,
  reservationPersonCount,
  quantityUnit = '',
}) => {
  const showBreakdown =
    (offerType === 'perPerson' && (persons || 1) > 1) || (offerType === 'perNight' && (nights || 1) > 1) || quantity > 1
  
  return (
    <div
      className={`rounded-lg p-4 border ${isBooked ? 'bg-green-50 border-green-200' : 'bg-neutral-50/50 border-neutral-200'}`}
    >
      {/* Display person count info above the total for perPerson offers */}
      {offerType === 'perPerson' && reservationPersonCount && (
        <div className="text-sm text-neutral-600 mb-2">
          {`For ${reservationPersonCount} ${reservationPersonCount === 1 ? labels.personSingular : labels.personPlural}`}
        </div>
      )}

      <div className="flex justify-between items-center">
        <span className="font-medium text-base">{totalLabel}:</span>
        <div className="flex flex-col items-end">
          <span className="text-xl font-bold">{totalPrice}</span>
          {showBreakdown && (
            <span className="text-xs text-neutral-500 mt-1">
              {basePrice}
              {quantity > 1 && quantityUnit && `, ${quantity} ${quantityUnit}`}
              {offerType === 'perPerson' && (persons || 1) > 1 &&
                `, ${persons || 1} ${(persons || 1) === 1 ? labels.personSingular : labels.personPlural}`}
              {offerType === 'perNight' && (nights || 1) > 1 &&
                `, ${nights || 1} ${(nights || 1) === 1 ? labels.nightSingular : labels.nightPlural}`}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default OfferTotalDisplay
