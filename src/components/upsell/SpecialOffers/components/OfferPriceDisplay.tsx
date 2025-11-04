import { Info } from 'lucide-react'
import type React from 'react'
import { useMemo } from 'react'
import { TooltipProvider, UiTooltip, UiTooltipContent, UiTooltipTrigger } from '@/components/ui/tooltip'
import type { OfferLabels } from '../types'
import { calculateAvailableDates, formatSelectedDates } from '../utils/dateFormatting'

import EnhancedDateSelector from './EnhancedDateSelector'
import QuantityControls from './QuantityControls'

export interface OfferPriceDisplayProps {
  price: string
  unitLabel: string
  description?: string
  quantity: number
  onIncreaseQuantity?: () => void
  onDecreaseQuantity?: () => void
  isBooked?: boolean
  labels: OfferLabels
  showQuantityControls?: boolean
  minQuantity?: number
  maxQuantity?: number
  // Date selector props - parent must provide all data pre-calculated/formatted
  selectedDate?: Date
  selectedDates?: Date[]
  onDateChange?: (date: Date | undefined) => void
  onMultipleDatesChange?: (dates: Date[]) => void
  onDoneDateSelectAndBook?: () => void
  reservationStartDate?: Date
  reservationEndDate?: Date
  maxDateSelections?: number
  offerId?: string | number
  offerType?: 'perStay' | 'perPerson' | 'perNight'
}

const OfferPriceDisplay: React.FC<OfferPriceDisplayProps> = ({
  price,
  unitLabel,
  description,
  quantity,
  onIncreaseQuantity,
  onDecreaseQuantity,
  isBooked = false,
  labels,
  showQuantityControls = true,
  minQuantity,
  maxQuantity,
  selectedDate,
  selectedDates,
  onDateChange,
  onMultipleDatesChange,
  onDoneDateSelectAndBook,
  reservationStartDate,
  reservationEndDate,
  maxDateSelections = 10,
  offerId,
  offerType,
}) => {
  /**
   * ✅ Business Logic Layer - Pre-calculate and format data for UI
   * This parent component handles all calculations before passing to UI children
   */

  // Calculate available dates once
  const availableDates = useMemo(() => {
    return calculateAvailableDates({
      reservationStartDate,
      reservationEndDate,
      maxDates: maxDateSelections,
    })
  }, [reservationStartDate, reservationEndDate, maxDateSelections])

  // Format selected dates for display
  const formattedSelectedDates = formatSelectedDates(
    selectedDates || (selectedDate ? [selectedDate] : [])
  )

  return (
  <div
    className={`rounded-lg p-3 flex gap-2 justify-between ${isBooked ? 'bg-green-50 border border-green-200' : 'bg-neutral-50/50'}`}
  >
    <div className="flex items-center justify-between mb-2">
      <div className="flex gap-1 flex-col">
        <div className="flex flex-wrap items-baseline gap-1">
          <span className="text-xl font-bold">{price}</span>
          <span className="text-sm text-neutral-500">{unitLabel}</span>
        </div>
        {description && (
          <TooltipProvider>
            <UiTooltip>
              <UiTooltipTrigger asChild>
                <div className="flex items-center text-xs text-neutral-600 cursor-help mt-1">
                  <Info className="h-3 w-3 mr-1" />
                  <span>{labels.whatsIncludedLabel}</span>
                </div>
              </UiTooltipTrigger>
              <UiTooltipContent>
                <p>{description}</p>
              </UiTooltipContent>
            </UiTooltip>
          </TooltipProvider>
        )}
      </div>
    </div>

    {/* Date selector - only show when handlers are provided */}
    {(onDateChange || onMultipleDatesChange) && (
      <EnhancedDateSelector
        id={`enhanced-date-${offerId}`}
        label=""
        formattedSelectedDates={formattedSelectedDates}
        availableDates={availableDates}
        selectedDates={selectedDates || (selectedDate ? [selectedDate] : [])}
        onChange={(dates) => {
          if (onMultipleDatesChange) {
            onMultipleDatesChange(dates)
          } else if (onDateChange) {
            // For single date selection, use the first date or undefined
            onDateChange(dates.length > 0 ? dates[0] : undefined)
          }
        }}
        disabled={isBooked}
        tooltipText={labels.selectDateTooltip}
        className="min-w-0"
        multiple={!!onMultipleDatesChange}
        onDoneAndBook={onDoneDateSelectAndBook}
        labels={labels}
      />
    )}

    {/* Show quantity controls for perStay and perNight offers */}
    {showQuantityControls && (
      <QuantityControls
        quantity={quantity}
        onIncrease={onIncreaseQuantity || (() => {})}
        onDecrease={onDecreaseQuantity || (() => {})}
        disabled={false}
        isBooked={isBooked}
        labels={labels}
        minQuantity={minQuantity}
        maxQuantity={maxQuantity}
      />
    )}
  </div>
  )
}

export default OfferPriceDisplay
