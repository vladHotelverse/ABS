import type { AvailableSection } from '../../ABS_PricingSummaryPanel'
import type { PricingItem } from '../../ABS_PricingSummaryPanel'
import type { SelectedCustomizations } from '../../ABS_RoomCustomization/types'
import type { RoomOption } from '../sections/RoomSelectionSection'
import type { SelectedOffer } from '../sections/SpecialOffersSection'
import type { BidItem } from '../../../hooks/useBidUpgrade'

/**
 * Converts a RoomOption to a PricingItem for the pricing summary
 */
export const convertRoomToPricingItem = (room: RoomOption | undefined, nights = 1, isUpgrade = false): PricingItem | null => {
  if (!room) return null
  const totalPrice = room.price * (room.perNight ? nights : 1)
  const displayName = room.perNight && nights > 1 ? `${room.title || room.roomType} (${nights} nights)` : room.title || room.roomType
  
  // Determine if this is a superior room based on room type or explicit upgrade flag
  const isSuperiorRoom = isUpgrade || 
    room.roomType?.toLowerCase().includes('suite') ||
    room.roomType?.toLowerCase().includes('deluxe') ||
    room.roomType?.toLowerCase().includes('superior') ||
    room.title?.toLowerCase().includes('luxury') ||
    room.title?.toLowerCase().includes('premium')
  
  return {
    id: room.id,
    name: displayName,
    price: totalPrice,
    type: 'room',
    concept: isSuperiorRoom ? 'choose-your-superior-room' : 'choose-your-room',
  }
}

/**
 * Converts selected customizations to PricingItems
 */
export const convertCustomizationsToPricingItems = (customizations: SelectedCustomizations, nights = 1): PricingItem[] => {
  return Object.values(customizations)
    .filter((c) => c !== undefined)
    .map((c) => {
      // Determine concept based on customization type
      const concept = c.label.toLowerCase().includes('upgrade') || c.label.toLowerCase().includes('superior') 
        ? 'choose-your-superior-room' 
        : 'customize-your-room'
      
      const totalPrice = c.price * nights
      const displayName = nights > 1 ? `${c.label} (${nights} nights)` : c.label

      return {
        id: c.id,
        name: displayName,
        price: totalPrice,
        type: 'customization' as const,
        concept,
      }
    })
}

/**
 * Converts selected offers to PricingItems
 */
export const convertOffersToPricingItems = (offers: SelectedOffer[]): PricingItem[] => {
  return offers.map((o) => ({
    id: o.id,
    name: o.quantity && o.quantity > 1 ? `${o.name} (x${o.quantity})` : o.name,
    price: o.price,
    type: 'offer' as const,
    concept: 'enhance-your-stay',
  }))
}

/**
 * Converts bids to PricingItems
 */
export const convertBidsToPricingItems = (bids: BidItem[], nights = 1): PricingItem[] => {
  return bids
    .filter((bid) => bid.status === 'submitted' || bid.status === 'pending')
    .map((bid) => {
      const totalPrice = bid.bidAmount * nights
      const displayName = nights > 1 
        ? `Bid for ${bid.roomName} (${nights} nights)` 
        : `Bid for ${bid.roomName}`
      
      return {
        id: bid.id,
        name: displayName,
        price: totalPrice,
        type: 'bid' as const,
        concept: 'bid-for-upgrade',
        bidStatus: bid.status as 'pending' | 'submitted',
      }
    })
}

/**
 * Calculates the total price from all selected items
 */
export const calculateTotalPrice = (
  selectedRoom: RoomOption | undefined,
  selectedCustomizations: SelectedCustomizations,
  selectedOffers: SelectedOffer[],
  taxRate = 0.1,
  nights = 1
): { subtotal: number; tax: number; total: number } => {
  let subtotal = 0

  // Add room price (multiply by nights if it's a per-night price)
  if (selectedRoom) {
    subtotal += selectedRoom.price * (selectedRoom.perNight ? nights : 1)
  }

  // Add customizations
  for (const categoryKey in selectedCustomizations) {
    const customization = selectedCustomizations[categoryKey]
    if (customization) {
      subtotal += customization.price * nights
    }
  }

  // Add special offers
  selectedOffers.forEach((offer) => {
    subtotal += offer.price
  })

  const tax = subtotal * taxRate
  const total = subtotal + tax

  return { subtotal, tax, total }
}

/**
 * Generates available sections based on what's actually available
 */
export const generateAvailableSections = (
  hasRoomOptions: boolean,
  hasCustomizations: boolean,
  hasSpecialOffers: boolean,
  language: 'en' | 'es' = 'en',
  onRoomNavigate?: () => void,
  onCustomizationNavigate?: () => void,
  onOffersNavigate?: () => void
): AvailableSection[] => {
  const sections: AvailableSection[] = []

  if (hasRoomOptions) {
    sections.push({
      type: 'room',
      label: language === 'es' ? 'Mejoras de habitación' : 'Room Upgrades',
      description:
        language === 'es'
          ? 'Mejora tu experiencia con opciones premium como vistas al mar o habitaciones de categoría superior'
          : 'Upgrade your experience with premium options like sea views or superior room categories',
      startingPrice: 25,
      isAvailable: true,
      onClick: onRoomNavigate,
    })
  }

  if (hasCustomizations) {
    sections.push({
      type: 'customization',
      label: language === 'es' ? 'Servicios adicionales' : 'Additional Services',
      description:
        language === 'es'
          ? 'Añade servicios como desayuno, traslado al aeropuerto o acceso al spa'
          : 'Add services like breakfast, airport transfer or spa access',
      startingPrice: 10,
      isAvailable: true,
      onClick: onCustomizationNavigate,
    })
  }

  if (hasSpecialOffers) {
    sections.push({
      type: 'offer',
      label: language === 'es' ? 'Ofertas especiales' : 'Special Offers',
      description:
        language === 'es'
          ? 'Descubre promociones exclusivas y paquetes con descuento'
          : 'Discover exclusive promotions and discounted packages',
      startingPrice: 5,
      isAvailable: true,
      onClick: onOffersNavigate,
    })
  }

  return sections
}

/**
 * Counts total items in the cart
 */
export const countCartItems = (
  selectedRoom: RoomOption | undefined,
  selectedCustomizations: SelectedCustomizations,
  selectedOffers: SelectedOffer[]
): number => {
  return selectedOffers.length + Object.keys(selectedCustomizations).length + (selectedRoom ? 1 : 0)
}

/**
 * Determines if a section should be visible based on availability
 */
export const shouldShowSection = (
  sectionType: 'room' | 'customization' | 'offer',
  availableSections?: AvailableSection[]
): boolean => {
  if (!availableSections) return true // Default to showing all sections

  return availableSections.some((section) => section.type === sectionType && section.isAvailable)
}

/**
 * Calculates the number of nights between two dates
 */
export const calculateNights = (checkIn?: string, checkOut?: string): number => {
  if (!checkIn || !checkOut) return 1
  
  // Helper function to parse date strings in various formats
  const parseDate = (dateStr: string): Date => {
    // Try ISO format first (YYYY-MM-DD)
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return new Date(dateStr)
    }
    
    // Try DD/MM/YYYY format
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
      const parts = dateStr.split('/')
      // Check if it's likely DD/MM/YYYY (day > 12)
      if (parseInt(parts[0]) > 12) {
        // DD/MM/YYYY - convert to MM/DD/YYYY for Date constructor
        return new Date(`${parts[1]}/${parts[0]}/${parts[2]}`)
      }
    }
    
    // Default: try parsing as-is (handles MM/DD/YYYY and other formats)
    return new Date(dateStr)
  }
  
  const checkInDate = parseDate(checkIn)
  const checkOutDate = parseDate(checkOut)
  
  // Check if dates are valid
  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
    return 1
  }
  
  if (checkOutDate <= checkInDate) return 1
  
  const diffTime = checkOutDate.getTime() - checkInDate.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays > 0 ? diffDays : 1
}
