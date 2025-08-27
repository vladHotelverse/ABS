import type React from 'react'
import { useMemo } from 'react'
import SpecialOffers from '../../ABS_SpecialOffers'
import type { OfferData, OfferSelection, OfferType } from '../../ABS_SpecialOffers/types'
import type { ReservationInfo } from '../../ABS_SpecialOffers/types'

export interface SpecialOffer {
  id: string | number
  title: string
  description: string
  image: string
  price: number
  priceType?: 'per-stay' | 'per-person' | 'per-night' // Legacy field for backward compatibility
  type?: 'perStay' | 'perPerson' | 'perNight' | string // New preferred field
  maxQuantity?: number
  requiresDateSelection?: boolean
  allowsMultipleDates?: boolean
}

export interface SelectedOffer {
  id: string | number
  name: string
  price: number
  quantity?: number
  persons?: number
  nights?: number
  selectedDate?: Date
  selectedDates?: Date[]
}

export interface SpecialOffersTexts {
  offersTitle: string
  offersSubtitle: string
  currencySymbol: string
  specialOffersLabels: {
    perStay: string
    perPerson: string
    perNight: string
    total: string
    bookNow: string
    numberOfPersons: string
    numberOfNights: string
    addedLabel: string
    popularLabel: string
    personsTooltip: string
    personsSingularUnit: string
    personsPluralUnit: string
    nightsTooltip: string
    nightsSingularUnit: string
    nightsPluralUnit: string
    personSingular: string
    personPlural: string
    nightSingular: string
    nightPlural: string
    removeOfferLabel: string
    decreaseQuantityLabel: string
    increaseQuantityLabel: string
    selectDateLabel: string
    selectDateTooltip: string
    dateRequiredLabel: string
    selectDatesLabel?: string
    selectDatesTooltip?: string
    availableDatesLabel?: string
    noAvailableDatesLabel?: string
    clearDatesLabel?: string
    confirmDatesLabel?: string
    dateSelectedLabel?: string
    multipleDatesRequiredLabel?: string
  }
}

export interface SpecialOffersSectionProps {
  specialOffers: SpecialOffer[]
  selectedOffers: SelectedOffer[]
  onBookOffer: (offerData: OfferData) => void
  reservationInfo?: ReservationInfo
  texts: SpecialOffersTexts
  className?: string
  isVisible?: boolean
  useEnhancedDateSelector?: boolean
}

// Convert SpecialOffer to OfferType for SpecialOffers component
const convertToOfferType = (offer: SpecialOffer, index: number): OfferType => {
  let type: 'perStay' | 'perPerson' | 'perNight'

  // Check if offer has the new type field format first
  if (offer.type) {
    if (offer.type === 'perStay' || offer.type === 'perPerson' || offer.type === 'perNight') {
      type = offer.type as 'perStay' | 'perPerson' | 'perNight'
    } else {
      type = 'perStay' // fallback
    }
  } else {
    // Fallback to old priceType format for backward compatibility
    switch (offer.priceType) {
      case 'per-stay':
        type = 'perStay'
        break
      case 'per-person':
        type = 'perPerson'
        break
      case 'per-night':
        type = 'perNight'
        break
      default:
        type = 'perStay'
    }
  }

  return {
    id: typeof offer.id === 'string' ? index + 1 : offer.id,
    title: offer.title,
    description: offer.description,
    price: (offer as any).basePrice || offer.price, // Use basePrice if available
    type,
    image: offer.image,
    requiresDateSelection: offer.requiresDateSelection,
    allowsMultipleDates: offer.allowsMultipleDates,
  }
}

export const SpecialOffersSection: React.FC<SpecialOffersSectionProps> = ({
  specialOffers,
  selectedOffers,
  onBookOffer,
  reservationInfo,
  texts,
  className = '',
  isVisible = true,
  useEnhancedDateSelector = true,
}) => {
  if (!isVisible || specialOffers.length === 0) {
    return null
  }


  return (
    <section className={`bg-card p-4 md:p-6 rounded-lg md:shadow border border-border ${className}`}>
      <h2 className="text-3xl font-bold mb-4 text-card-foreground">{texts.offersTitle}</h2>
      <p className="mb-6 text-muted-foreground">{texts.offersSubtitle}</p>
      <SpecialOffers
        id="special-offers-section"
        offers={specialOffers.map(convertToOfferType)}
        onBookOffer={onBookOffer}
        reservationInfo={reservationInfo}
        currencySymbol={texts.currencySymbol}
        labels={texts.specialOffersLabels}
        useEnhancedDateSelector={useEnhancedDateSelector}
      />
    </section>
  )
}

export default SpecialOffersSection
