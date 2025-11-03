import type { OfferData, OfferSelection, OfferType } from '@/components/upsell/SpecialOffers/types'

/**
 * EnhancedBookingItem type from bookingStore
 * This represents how offers are stored in the multibooking system
 */
export interface EnhancedBookingItem {
  id?: string
  name: string
  price: number
  type: 'room' | 'offer' | 'customization' | 'bid'
  concept?: string
  metadata?: {
    originalOfferId?: number
    quantity?: number
    offerType?: 'perStay' | 'perPerson' | 'perNight'
    persons?: number
    nights?: number
    selectedDate?: Date
    selectedDates?: Date[]
    startDate?: Date
    endDate?: Date
    [key: string]: unknown
  }
}

/**
 * Converts OfferData (from component) to EnhancedBookingItem (for bookingStore)
 *
 * This follows the pattern from feat/multibooking:
 * - type: 'offer'
 * - concept: 'enhance-your-stay'
 * - metadata contains all offer-specific data including originalOfferId
 * - price is stored as final calculated value (NOT multiplied by nights)
 *
 * @param offerData - Offer data from SpecialOffers component
 * @returns EnhancedBookingItem ready for bookingStore.addItemToRoom()
 */
export function convertOfferDataToBookingItem(offerData: OfferData): EnhancedBookingItem {
  return {
    name: offerData.name,
    price: offerData.price,
    type: 'offer',
    concept: 'enhance-your-stay',
    metadata: {
      originalOfferId: offerData.id,
      quantity: offerData.quantity,
      offerType: offerData.type,
      persons: offerData.persons,
      nights: offerData.nights,
      selectedDate: offerData.selectedDate,
      selectedDates: offerData.selectedDates,
      startDate: offerData.startDate,
      endDate: offerData.endDate,
    },
  }
}

/**
 * Converts EnhancedBookingItem back to OfferData
 * Useful for displaying booked offers or syncing state
 *
 * @param item - Booking item from store
 * @param basePrice - Original offer price (before calculations)
 * @returns OfferData or null if item is not an offer
 */
export function convertBookingItemToOfferData(item: EnhancedBookingItem, basePrice?: number): OfferData | null {
  if (item.type !== 'offer' || !item.metadata?.originalOfferId) {
    return null
  }

  return {
    id: item.metadata.originalOfferId,
    name: item.name,
    price: item.price,
    basePrice: basePrice || item.price,
    quantity: item.metadata.quantity || 1,
    type: item.metadata.offerType || 'perStay',
    persons: item.metadata.persons,
    nights: item.metadata.nights,
    selectedDate: item.metadata.selectedDate,
    selectedDates: item.metadata.selectedDates,
    startDate: item.metadata.startDate,
    endDate: item.metadata.endDate,
  }
}

/**
 * Checks if an offer already exists in a room's items
 * Uses metadata.originalOfferId for comparison
 *
 * @param items - Room's booking items
 * @param offerId - Offer ID to check
 * @returns true if offer is already booked
 */
export function isOfferAlreadyBooked(items: EnhancedBookingItem[], offerId: number): boolean {
  return items.some((item) => item.type === 'offer' && item.metadata?.originalOfferId === offerId)
}

/**
 * Finds a booked offer item by its original offer ID
 *
 * @param items - Room's booking items
 * @param offerId - Original offer ID
 * @returns The booking item or undefined
 */
export function findBookedOfferItem(items: EnhancedBookingItem[], offerId: number): EnhancedBookingItem | undefined {
  return items.find((item) => item.type === 'offer' && item.metadata?.originalOfferId === offerId)
}

/**
 * Creates OfferData from offer and selection (used for booking callback)
 *
 * @param offer - Offer type definition
 * @param selection - User's selection state
 * @param calculatedPrice - Final calculated price
 * @returns OfferData ready for onBookOffer callback
 */
export function createOfferDataFromSelection(
  offer: OfferType,
  selection: OfferSelection,
  calculatedPrice: number
): OfferData {
  return {
    id: offer.id,
    name: offer.title,
    price: calculatedPrice,
    basePrice: offer.price,
    quantity: selection.quantity,
    type: offer.type,
    persons: selection.persons,
    nights: selection.nights,
    selectedDate: selection.selectedDate,
    selectedDates: selection.selectedDates,
    startDate: selection.startDate,
    endDate: selection.endDate,
  }
}
