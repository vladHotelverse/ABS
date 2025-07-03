import type React from 'react'
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
    price: offer.price,
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

  // Create initial selections from selected offers
  const initialSelections =
    selectedOffers.length > 0
      ? selectedOffers.reduce(
          (acc, offer) => {
            acc[offer.id] = {
              quantity: offer.quantity ?? 1,
              // persons and nights will be managed automatically by reservation data
            }
            return acc
          },
          {} as Record<string | number, OfferSelection>
        )
      : undefined

  return (
    <section className={`bg-white p-4 md:p-6 rounded-lg shadow border border-neutral-300 ${className}`}>
      <h2 className="text-2xl font-bold mb-4">{texts.offersTitle}</h2>
      <p className="mb-6">{texts.offersSubtitle}</p>
      <SpecialOffers
        id="special-offers-section"
        offers={specialOffers.map(convertToOfferType)}
        onBookOffer={onBookOffer}
        reservationInfo={reservationInfo}
        currencySymbol={texts.currencySymbol}
        labels={texts.specialOffersLabels}
        initialSelections={initialSelections}
        useEnhancedDateSelector={useEnhancedDateSelector}
      />
    </section>
  )
}

export default SpecialOffersSection
