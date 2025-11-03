import type { OfferCardData, OfferLabels, OfferSelection, OfferType, ReservationInfo } from '@/components/upsell/SpecialOffers/types'

/**
 * Data formatting layer for SpecialOffers component
 *
 * This layer handles ALL business logic and data transformation:
 * ✅ Calculate and format prices
 * ✅ Determine visibility and state based on business rules
 * ✅ Detect special offer types
 * ✅ Validate user selections
 * ✅ Pre-format all display values
 *
 * The UI component receives ONLY pre-formatted, pre-calculated data
 */

/**
 * Check if offer is a special type (All Inclusive, Online Check-in, Late Checkout)
 * Centralized detection logic (documented for future enum-based refactoring)
 */
function detectSpecialOfferType(offerTitle: string): {
  isAllInclusive: boolean
  isOnlineCheckin: boolean
  isLateCheckout: boolean
} {
  const lowerTitle = offerTitle.toLowerCase()
  return {
    isAllInclusive: lowerTitle.includes('all inclusive'),
    isOnlineCheckin: lowerTitle.includes('online check-in'),
    isLateCheckout: lowerTitle.includes('late checkout'),
  }
}

/**
 * Determine if quantity controls should be shown
 * Business rule: Don't show for date-required offers, perNight, or special offers
 */
function shouldShowQuantityControls(
  offer: OfferType,
  isAllInclusive: boolean,
  isOnlineCheckin: boolean,
  isLateCheckout: boolean
): boolean {
  return (
    !offer.requiresDateSelection &&
    offer.type !== 'perNight' &&
    !isAllInclusive &&
    !isOnlineCheckin &&
    !isLateCheckout
  )
}

/**
 * Determine if total should be displayed
 * Business rule: Show if quantity > 0, has selected date, or has date range
 */
function shouldShowTotal(offer: OfferType, selection: OfferSelection): boolean {
  return (
    selection.quantity > 0 ||
    (offer.requiresDateSelection &&
      (selection.selectedDate || (selection.selectedDates && selection.selectedDates.length > 0))) ||
    (offer.type === 'perNight' && selection.startDate && selection.endDate)
  )
}

/**
 * Generate validation messages based on offer requirements
 * Business rule: Validate selection completeness
 */
function generateValidationMessages(
  offer: OfferType,
  selection: OfferSelection,
  labels: OfferLabels
): string[] {
  const messages: string[] = []

  if (offer.requiresDateSelection) {
    if (offer.allowsMultipleDates) {
      if (!selection.selectedDates || selection.selectedDates.length === 0) {
        messages.push(labels.multipleDatesRequiredLabel)
      }
    } else {
      if (!selection.selectedDate) {
        messages.push(labels.dateRequiredLabel)
      }
    }
  }

  if (offer.type === 'perNight' && (!selection.startDate || !selection.endDate)) {
    messages.push('Please select start and end dates')
  }

  return messages
}

/**
 * Determine if button should be disabled
 * Business rule: Disable if selection incomplete and offer not yet booked
 */
function isButtonDisabled(
  offer: OfferType,
  selection: OfferSelection,
  isBooked: boolean,
  isAllInclusive: boolean,
  isOnlineCheckin: boolean,
  isLateCheckout: boolean
): boolean {
  if (isBooked) return false

  // Date-based offers require date selection
  if (
    offer.requiresDateSelection &&
    !selection.selectedDate &&
    (!selection.selectedDates || selection.selectedDates.length === 0)
  ) {
    return true
  }

  // perNight offers require date range
  if (offer.type === 'perNight' && (!selection.startDate || !selection.endDate)) {
    return true
  }

  // Quantity-based offers (non-special) require quantity > 0
  if (
    !offer.requiresDateSelection &&
    offer.type !== 'perNight' &&
    !isAllInclusive &&
    !isOnlineCheckin &&
    !isLateCheckout &&
    selection.quantity === 0
  ) {
    return true
  }

  return false
}

/**
 * Format offer data into pre-calculated card data for UI display
 *
 * All business logic and calculations happen HERE, not in UI component
 */
export function formatOfferCard(
  offer: OfferType,
  selection: OfferSelection,
  currencySymbol: string,
  labels: OfferLabels,
  formatPrice: (price: number) => string,
  calculateTotal: (offer: OfferType, selection: OfferSelection) => number,
  getUnitLabel: (type: OfferType['type'], labels: OfferLabels) => string,
  isBooked: boolean,
  showValidation: boolean
): OfferCardData {
  // Detect special offer type
  const { isAllInclusive, isOnlineCheckin, isLateCheckout } = detectSpecialOfferType(offer.title)

  // Calculate total price
  const total = calculateTotal(offer, selection)

  // Pre-format all display values
  const formattedBasePrice = formatPrice(offer.price)
  const formattedTotal = formatPrice(total)
  const unitLabel = getUnitLabel(offer.type, labels)

  // Determine visibility and state
  const shouldShowQuantControls = shouldShowQuantityControls(offer, isAllInclusive, isOnlineCheckin, isLateCheckout)
  const shouldShowTotalPrice = shouldShowTotal(offer, selection)
  const validationMessages = generateValidationMessages(offer, selection, labels)
  const isDisabled = isButtonDisabled(offer, selection, isBooked, isAllInclusive, isOnlineCheckin, isLateCheckout)

  return {
    offer,
    selection,
    formattedBasePrice,
    formattedTotal,
    unitLabel,
    isBooked,
    showValidation,
    shouldShowQuantityControls: shouldShowQuantControls,
    shouldShowTotal: shouldShowTotalPrice,
    isButtonDisabled: isDisabled,
    validationMessages,
    isAllInclusive,
    isOnlineCheckin,
    isLateCheckout,
  }
}

/**
 * Batch format multiple offers into card data
 */
export function formatOfferCards(
  offers: OfferType[],
  selections: Record<number, OfferSelection>,
  bookedOfferIds: number[],
  currencySymbol: string,
  labels: OfferLabels,
  formatPrice: (price: number) => string,
  calculateTotal: (offer: OfferType, selection: OfferSelection) => number,
  getUnitLabel: (type: OfferType['type']) => string,
  showValidation: Record<number, boolean> = {}
): OfferCardData[] {
  const bookedSet = new Set(bookedOfferIds)

  return offers.map((offer) => {
    const selection = selections[offer.id] || { quantity: 0 }
    const isBooked = bookedSet.has(offer.id)
    const showVal = showValidation[offer.id] || false

    return formatOfferCard(
      offer,
      selection,
      currencySymbol,
      labels,
      formatPrice,
      calculateTotal,
      getUnitLabel,
      isBooked,
      showVal
    )
  })
}
