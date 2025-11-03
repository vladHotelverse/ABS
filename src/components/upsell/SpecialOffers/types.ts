import type { SegmentDiscount } from '../ABS_RoomSelectionCarousel/types'

export interface OfferType {
  id: number
  title: string
  description: string
  price: number
  type: 'perStay' | 'perPerson' | 'perNight'
  image?: string
  requiresDateSelection?: boolean
  allowsMultipleDates?: boolean // For multiple date selection
  featured?: boolean
  segmentDiscount?: SegmentDiscount
}

export interface OfferSelection {
  quantity: number
  persons?: number
  nights?: number
  selectedDate?: Date
  selectedDates?: Date[] // For multiple date selection
  startDate?: Date
  endDate?: Date
}

export interface OfferData {
  id: number
  name: string
  price: number
  basePrice: number // Add base price to preserve original offer price
  quantity: number
  type: 'perStay' | 'perPerson' | 'perNight'
  persons?: number
  nights?: number
  selectedDate?: Date
  selectedDates?: Date[] // For multiple date selection
  startDate?: Date
  endDate?: Date
}

export interface ReservationInfo {
  personCount?: number
  checkInDate?: Date
  checkOutDate?: Date
}

/**
 * Pre-formatted card data passed to OfferCard UI component
 * All calculations, formatting, and business logic should be done BEFORE creating this object
 */
export interface OfferCardData {
  // Raw offer data
  offer: OfferType
  selection: OfferSelection

  // Pre-formatted display values (already formatted for UI)
  formattedBasePrice: string
  formattedTotal: string
  unitLabel: string

  // Pre-calculated business decisions (UI just displays, doesn't calculate)
  isBooked: boolean
  showValidation: boolean
  shouldShowQuantityControls: boolean
  shouldShowTotal: boolean
  isButtonDisabled: boolean
  validationMessages: string[]

  // Special offer type indicators (pre-determined by parent)
  isAllInclusive: boolean
  isOnlineCheckin: boolean
  isLateCheckout: boolean
}

export interface SpecialOffersProps {
  className?: string
  id?: string

  // Pre-formatted card data (ALL formatting done by parent)
  cardData: OfferCardData[]

  // Callbacks for user interactions (ONLY callbacks, no data transformation)
  onUpdateQuantity?: (offerId: number, change: number) => void
  onUpdateSelectedDate?: (offerId: number, date: Date | undefined) => void
  onUpdateSelectedDates?: (offerId: number, dates: Date[]) => void
  onBookOffer?: (offerId: number) => void

  // UI labels (should be pre-selected/completed by parent)
  labels: OfferLabels
}

export interface OfferLabels {
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
  // Enhanced date selector labels
  selectDatesLabel?: string
  selectDatesTooltip?: string
  availableDatesLabel?: string
  noAvailableDatesLabel?: string
  clearDatesLabel?: string
  confirmDatesLabel?: string
  dateSelectedLabel?: string
  multipleDatesRequiredLabel?: string
}
