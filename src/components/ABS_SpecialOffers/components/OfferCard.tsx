import { Star } from 'lucide-react'
import type React from 'react'
import { Badge } from '../../ui/badge'
import { SegmentBadge } from '../../ui/segment-badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../ui/card'
import type { OfferLabels, OfferSelection, OfferType, ReservationInfo } from '../types'
import OfferBookingButton from './OfferBookingButton'
import OfferImage from './OfferImage'
import OfferPriceDisplay from './OfferPriceDisplay'
import OfferTotalDisplay from './OfferTotalDisplay'

interface OfferCardProps {
  offer: OfferType
  selection: OfferSelection
  onUpdateQuantity: (change: number) => void
  onUpdateSelectedDate: (date: Date | undefined) => void
  onUpdateSelectedDates: (dates: Date[]) => void
  onBook: () => void
  formatPrice: (price: number) => string
  calculateTotal: (offer: OfferType, selection: OfferSelection) => number
  getUnitLabel: (type: OfferType['type'], labels: OfferLabels) => string
  labels: OfferLabels
  reservationInfo?: ReservationInfo
  isBooked?: boolean
  showValidation?: boolean
}

const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  selection,
  onUpdateQuantity,
  onUpdateSelectedDate,
  onUpdateSelectedDates,
  onBook,
  formatPrice,
  calculateTotal,
  getUnitLabel,
  labels,
  reservationInfo,
  isBooked = false,
  showValidation = false,
}) => {
  const total = calculateTotal(offer, selection)
  
  // Check if this is an All Inclusive package, Online Check-in, or Late Checkout
  const isAllInclusive = offer.title.toLowerCase().includes('all inclusive')
  const isOnlineCheckin = offer.title.toLowerCase().includes('online check-in')
  const isLateCheckout = offer.title.toLowerCase().includes('late checkout')

  // Create appropriate handlers based on offer requirements
  const dateChangeHandler = offer.requiresDateSelection && !offer.allowsMultipleDates ? onUpdateSelectedDate : undefined
  const multipleDatesHandler =
    offer.requiresDateSelection && !!offer.allowsMultipleDates ? onUpdateSelectedDates : undefined

  return (
    <Card
      data-testid="offer-card"
      className={`overflow-hidden border transition-all h-full flex flex-col shadow-sm ${
        isBooked ? 'border-green-300 bg-green-50/30' : 'border-neutral-200 hover:border-neutral-300 hover:shadow-md'
      }`}
    >
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
        {/* Segment Badge - positioned below other badges */}
        {offer.segmentDiscount && (
          <div className="absolute bottom-2 right-2">
            <SegmentBadge segmentDiscount={offer.segmentDiscount} />
          </div>
        )}
      </div>

      <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6">
        <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
          {offer.title}
          {isBooked && <Star className="h-4 sm:h-5 w-4 sm:w-5 text-green-600" />}
        </CardTitle>
        <p className="text-sm sm:text-base leading-relaxed line-clamp-2">{offer.description}</p>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6 flex-grow">
        {/* Price Display */}
        <OfferPriceDisplay
          price={formatPrice(offer.price)}
          unitLabel={getUnitLabel(offer.type, labels)}
          description={offer.description}
          quantity={selection.quantity}
          onIncreaseQuantity={() => onUpdateQuantity(1)}
          onDecreaseQuantity={() => onUpdateQuantity(-1)}
          isBooked={isBooked}
          labels={labels}
          showQuantityControls={!offer.requiresDateSelection && offer.type !== 'perNight' && !isAllInclusive && !isOnlineCheckin && !isLateCheckout}
          selectedDate={selection.selectedDate}
          selectedDates={selection.selectedDates}
          onDateChange={dateChangeHandler}
          onMultipleDatesChange={multipleDatesHandler}
          offerType={offer.type}
          reservationStartDate={reservationInfo?.checkInDate}
          reservationEndDate={reservationInfo?.checkOutDate}
          offerId={offer.id}
        />


        {/* Total Display - show for quantity-based offers, date-based offers with selected date, or perNight offers with date range */}
        {(selection.quantity > 0 ||
          (offer.requiresDateSelection &&
            (selection.selectedDate || (selection.selectedDates && selection.selectedDates.length > 0))) ||
          (offer.type === 'perNight' && selection.startDate && selection.endDate)) && (
          <OfferTotalDisplay
            totalLabel={labels.total}
            totalPrice={formatPrice(total)}
            basePrice={formatPrice(offer.price)}
            quantity={selection.quantity}
            persons={selection.persons}
            nights={selection.nights}
            offerType={offer.type}
            offerTitle={offer.title}
            isBooked={isBooked}
            labels={labels}
            reservationPersonCount={reservationInfo?.personCount}
          />
        )}
      </CardContent>

      <CardFooter className="px-4 sm:px-6 pb-3 sm:pb-4 space-y-2">
        {/* Show validation messages only when user attempted to book */}
        {!isBooked && showValidation && (
          <>
            {!!offer.requiresDateSelection &&
              !selection.selectedDate &&
              (!selection.selectedDates || selection.selectedDates.length === 0) && (
                <p className="text-sm text-orange-600 font-medium">{labels.dateRequiredLabel}</p>
              )}
            {offer.type === 'perNight' && (!selection.startDate || !selection.endDate) && (
              <p className="text-sm text-orange-600 font-medium">Please select start and end dates</p>
            )}
          </>
        )}

        <OfferBookingButton
          onClick={onBook}
          disabled={
            !isBooked &&
            ((offer.requiresDateSelection &&
              !selection.selectedDate &&
              (!selection.selectedDates || selection.selectedDates.length === 0)) ||
              (offer.type === 'perNight' && (!selection.startDate || !selection.endDate)) ||
              (!offer.requiresDateSelection && offer.type !== 'perNight' && !isAllInclusive && !isOnlineCheckin && !isLateCheckout && selection.quantity === 0))
          }
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
