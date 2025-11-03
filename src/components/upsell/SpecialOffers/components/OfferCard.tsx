import { Star } from 'lucide-react'
import type React from 'react'
import { Badge } from '@/components/ui/badge'
import { SegmentBadge } from '@/components/ui/segment-badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import type { OfferCardData, OfferLabels } from '../types'
import OfferBookingButton from './OfferBookingButton'
import OfferImage from './OfferImage'
import OfferPriceDisplay from './OfferPriceDisplay'
import OfferTotalDisplay from './OfferTotalDisplay'

interface OfferCardProps {
  // Pre-formatted card data (ALL calculations done by parent)
  cardData: OfferCardData

  // Callbacks for user interactions
  onUpdateQuantity?: (change: number) => void
  onUpdateSelectedDate?: (date: Date | undefined) => void
  onUpdateSelectedDates?: (dates: Date[]) => void
  onBook?: () => void

  // UI labels
  labels: OfferLabels
}

/**
 * OfferCard - Pure presentation component
 *
 * ✅ UI Layer ONLY:
 * - Receives pre-formatted data via cardData
 * - All formatting, calculations, and decisions already done
 * - Simply displays the data and triggers callbacks
 *
 * ❌ Does NOT:
 * - Calculate anything (total, validation, visibility)
 * - Apply business rules or conditionals
 * - Make decisions based on data characteristics
 * - Format or transform any values
 */

const OfferCard: React.FC<OfferCardProps> = ({ cardData, onUpdateQuantity, onUpdateSelectedDate, onUpdateSelectedDates, onBook, labels }) => {
  const { offer, selection, formattedBasePrice, formattedTotal, unitLabel, isBooked, showValidation, shouldShowQuantityControls, shouldShowTotal, isButtonDisabled, validationMessages, isAllInclusive, isOnlineCheckin } = cardData

  // Create handlers conditionally - these are just callback wrappers (no business logic)
  const dateChangeHandler = onUpdateSelectedDate
  const multipleDatesHandler = onUpdateSelectedDates

  return (
    <Card
      data-testid="offer-card"
      className={`overflow-hidden border transition-all h-full flex flex-col ${
        isBooked ? 'border-green-300 bg-green-50/30' : 'border-neutral-100 hover:border-neutral-200'
      }`}
    >
      {/* Image Section */}
      <div className="h-32 sm:h-40 overflow-hidden relative">
        <OfferImage image={offer.image} title={offer.title} />
        {isBooked && (
          <Badge className="absolute top-2 left-2 bg-green-600 text-white text-xs flex items-center gap-1">
            <Star className="h-3 w-3" />
            {labels.addedLabel}
          </Badge>
        )}
        {offer.featured && (
          <Badge className="absolute top-2 right-2 bg-neutral-900 text-white text-xs flex items-center gap-1">
            <Star className="h-3 w-3" />
            {labels.popularLabel}
          </Badge>
        )}
        {offer.segmentDiscount && (
          <div className="absolute bottom-2 right-2">
            <SegmentBadge segmentDiscount={offer.segmentDiscount} />
          </div>
        )}
      </div>

      {/* Header Section */}
      <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6">
        <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
          {offer.title}
          {isBooked && <Star className="h-4 sm:h-5 w-4 sm:w-5 text-green-600" />}
        </CardTitle>
        <p className="text-xs sm:text-sm leading-relaxed line-clamp-2">{offer.description}</p>
      </CardHeader>

      {/* Content Section */}
      <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6 flex-grow">
        {/* Price Display - receives pre-formatted price */}
        <OfferPriceDisplay
          price={formattedBasePrice}
          unitLabel={unitLabel}
          description={offer.description}
          quantity={selection.quantity}
          onIncreaseQuantity={onUpdateQuantity ? () => onUpdateQuantity(1) : undefined}
          onDecreaseQuantity={onUpdateQuantity ? () => onUpdateQuantity(-1) : undefined}
          isBooked={isBooked}
          labels={labels}
          showQuantityControls={shouldShowQuantityControls}
          selectedDate={selection.selectedDate}
          selectedDates={selection.selectedDates}
          onDateChange={dateChangeHandler}
          onMultipleDatesChange={multipleDatesHandler}
          offerType={offer.type}
          reservationStartDate={undefined}
          reservationEndDate={undefined}
          offerId={offer.id}
        />

        {/* Total Display - pre-calculated and only shown if shouldShowTotal is true */}
        {shouldShowTotal && (
          <OfferTotalDisplay
            totalLabel={labels.total}
            totalPrice={formattedTotal}
            basePrice={formattedBasePrice}
            quantity={selection.quantity}
            persons={selection.persons}
            nights={selection.nights}
            offerType={offer.type}
            offerTitle={offer.title}
            isBooked={isBooked}
            labels={labels}
            reservationPersonCount={undefined}
          />
        )}
      </CardContent>

      {/* Footer Section */}
      <CardFooter className="px-3 sm:px-6 pb-3 sm:pb-4 space-y-2">
        {/* Validation messages - parent pre-determined which to show */}
        {validationMessages.length > 0 && showValidation && !isBooked && (
          <div className="w-full space-y-1">
            {validationMessages.map((message, idx) => (
              <p key={idx} className="text-sm text-orange-600 font-medium">
                {message}
              </p>
            ))}
          </div>
        )}

        {/* Booking button - state and disabled already determined by parent */}
        <OfferBookingButton
          onClick={onBook}
          disabled={isButtonDisabled}
          isBooked={isBooked}
          bookText={labels.bookNow}
          removeText={labels.removeOfferLabel}
          offerTitle={offer.title}
        />
      </CardFooter>
    </Card>
  )
}

export default OfferCard
