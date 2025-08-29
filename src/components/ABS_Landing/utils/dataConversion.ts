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
export const convertCustomizationsToPricingItems = (customizations: Record<string, any[]> | SelectedCustomizations, nights = 1): PricingItem[] => {
  const items: PricingItem[] = []
  
  // Handle both formats: Record<string, Customization[]> and SelectedCustomizations
  if (customizations && typeof customizations === 'object') {
    Object.entries(customizations).forEach(([_key, value]) => {
      if (Array.isArray(value)) {
        // Handle Record<string, Customization[]> format
        value.forEach((c) => {
          const concept = c.name?.toLowerCase().includes('upgrade') || c.name?.toLowerCase().includes('superior') 
            ? 'choose-your-superior-room' 
            : 'customize-your-room'
          
          const totalPrice = c.price * nights
          const displayName = nights > 1 ? `${c.name} (${nights} nights)` : c.name

          items.push({
            id: c.id,
            name: displayName,
            price: totalPrice,
            type: 'customization' as const,
            concept,
          })
        })
      } else if (value && typeof value === 'object' && 'id' in value) {
        // Handle SelectedCustomizations format
        const c = value as { id: string; label: string; price: number }
        const concept = c.label.toLowerCase().includes('upgrade') || c.label.toLowerCase().includes('superior') 
          ? 'choose-your-superior-room' 
          : 'customize-your-room'
        
        const totalPrice = c.price * nights
        const displayName = nights > 1 ? `${c.label} (${nights} nights)` : c.label

        items.push({
          id: c.id,
          name: displayName,
          price: totalPrice,
          type: 'customization' as const,
          concept,
        })
      }
    })
  }
  
  return items
}

/**
 * Helper function to get the appropriate unit for quantity display in pricing
 */
const getQuantityUnit = (quantity: number, offerName: string): string => {
  if (quantity <= 1) return ''
  
  const lowerName = offerName.toLowerCase()
  
  // Check if it's a transfer/transport related offer
  const isTransfer = lowerName.includes('transfer') || 
                    lowerName.includes('transport') ||
                    lowerName.includes('pickup') ||
                    lowerName.includes('shuttle')
  
  if (isTransfer) {
    return quantity === 1 ? 'person' : 'people'
  }
  
  // For spa, activities, access - use days
  const isDateBased = lowerName.includes('spa') ||
                     lowerName.includes('access') ||
                     lowerName.includes('pass')
  
  if (isDateBased) {
    return quantity === 1 ? 'day' : 'days'
  }
  
  // Default fallback
  return quantity === 1 ? 'time' : 'times'
}

/**
 * Converts selected offers to PricingItems
 */
export const convertOffersToPricingItems = (offers: SelectedOffer[]): PricingItem[] => {
  return offers.map((o) => ({
    id: o.id,
    name: o.quantity && o.quantity > 1 ? `${o.name} (${o.quantity} ${getQuantityUnit(o.quantity, o.name)})` : o.name,
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
      const displayName =
        nights > 1 ? `Bid for ${bid.roomName} (${nights} nights)` : `Bid for ${bid.roomName}`

      return {
        id: `bid-${bid.id}`, // Ensure a unique ID for the pricing item
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
  selectedCustomizations: Record<string, any[]> | SelectedCustomizations,
  selectedOffers: SelectedOffer[],
  activeBid: BidItem | undefined | null,
  taxRate = 0.1,
  nights = 1
): { subtotal: number; tax: number; total: number } => {
  let subtotal = 0

  // Add room price (multiply by nights if it's a per-night price)
  if (selectedRoom) {
    subtotal += selectedRoom.price * (selectedRoom.perNight ? nights : 1)
  }

  // Add customizations - handle both formats
  if (selectedCustomizations && typeof selectedCustomizations === 'object') {
    Object.entries(selectedCustomizations).forEach(([_key, value]) => {
      if (Array.isArray(value)) {
        // Handle Record<string, Customization[]> format
        value.forEach((c) => {
          subtotal += c.price * nights
        })
      } else if (value && typeof value === 'object' && 'price' in value) {
        // Handle SelectedCustomizations format
        subtotal += value.price * nights
      }
    })
  }

  // Add special offers
  selectedOffers.forEach((offer) => {
    subtotal += offer.price
  })

  // Add active bid if submitted
  if (activeBid && (activeBid.status === 'submitted' || activeBid.status === 'pending')) {
    subtotal += activeBid.bidAmount * nights
  }

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
  state: {
    selectedRoom?: RoomOption
    selectedCustomizations?: Record<string, any[]> | SelectedCustomizations
    selectedOffers?: SelectedOffer[]
    activeBid?: { roomId: string; bidAmount: number; status: string } | null
  }
): number => {
  if (!state) return 0
  
  const roomCount = state.selectedRoom ? 1 : 0
  
  // Count customizations - handle both formats
  let customizationCount = 0
  if (state.selectedCustomizations && typeof state.selectedCustomizations === 'object') {
    Object.entries(state.selectedCustomizations).forEach(([_key, value]) => {
      if (Array.isArray(value)) {
        // Handle Record<string, Customization[]> format
        customizationCount += value.length
      } else if (value && typeof value === 'object' && 'id' in value) {
        // Handle SelectedCustomizations format
        customizationCount += 1
      }
    })
  }
  
  const offerCount = state.selectedOffers ? state.selectedOffers.length : 0
  const bidCount = state.activeBid ? 1 : 0
  
  return roomCount + customizationCount + offerCount + bidCount
}

/**
 * Get detailed counts for mobile pricing badges
 */
export const getDetailedCartCounts = (
  state: {
    selectedRoom?: RoomOption
    selectedCustomizations?: Record<string, any[]> | SelectedCustomizations
    selectedOffers?: SelectedOffer[]
    activeBid?: { roomId: string; bidAmount: number; status: string } | null
  }
): {
  upgradeCount: number
  customizationCount: number
  offerCount: number
} => {
  if (!state) return { upgradeCount: 0, customizationCount: 0, offerCount: 0 }
  
  let upgradeCount = 0
  let customizationCount = 0
  
  // Count upgrades vs regular customizations
  if (state.selectedCustomizations && typeof state.selectedCustomizations === 'object') {
    Object.entries(state.selectedCustomizations).forEach(([_key, value]) => {
      if (Array.isArray(value)) {
        // Handle Record<string, Customization[]> format
        value.forEach((c) => {
          const isUpgrade = c.name?.toLowerCase().includes('upgrade') || 
                           c.name?.toLowerCase().includes('superior') ||
                           c.name?.toLowerCase().includes('suite') ||
                           c.name?.toLowerCase().includes('deluxe')
          if (isUpgrade) {
            upgradeCount++
          } else {
            customizationCount++
          }
        })
      } else if (value && typeof value === 'object' && 'id' in value) {
        // Handle SelectedCustomizations format
        const c = value as { id: string; label: string; price: number }
        const isUpgrade = c.label.toLowerCase().includes('upgrade') || 
                         c.label.toLowerCase().includes('superior') ||
                         c.label.toLowerCase().includes('suite') ||
                         c.label.toLowerCase().includes('deluxe')
        if (isUpgrade) {
          upgradeCount++
        } else {
          customizationCount++
        }
      }
    })
  }
  
  // Add room as upgrade if it's a superior/premium room
  if (state.selectedRoom) {
    const room = state.selectedRoom
    const isRoomUpgrade = room.roomType?.toLowerCase().includes('suite') ||
                         room.roomType?.toLowerCase().includes('deluxe') ||
                         room.roomType?.toLowerCase().includes('superior') ||
                         room.title?.toLowerCase().includes('luxury') ||
                         room.title?.toLowerCase().includes('premium')
    if (isRoomUpgrade) {
      upgradeCount++
    }
  }
  
  // Add bid as upgrade
  if (state.activeBid) {
    upgradeCount++
  }
  
  const offerCount = state.selectedOffers ? state.selectedOffers.length : 0
  
  return {
    upgradeCount,
    customizationCount, 
    offerCount
  }
}

/**
 * Get detailed counts for multibooking mobile pricing badges
 */
export const getMultiBookingDetailedCounts = (
  roomBookings: Array<{
    items: Array<{
      type: 'room' | 'customization' | 'offer' | 'bid'
      name?: string
      category?: string
      concept?: string
    }>
  }>
): {
  upgradeCount: number
  customizationCount: number
  offerCount: number
} => {
  if (!roomBookings || roomBookings.length === 0) {
    return { upgradeCount: 0, customizationCount: 0, offerCount: 0 }
  }
  
  let upgradeCount = 0
  let customizationCount = 0
  let offerCount = 0
  
  roomBookings.forEach(room => {
    if (!room.items) return
    
    room.items.forEach(item => {
      switch (item.type) {
        case 'offer':
          offerCount++
          break
        case 'bid':
          upgradeCount++
          break
        case 'room':
          // Rooms with upgrade-related concepts or categories are upgrades
          if (item.concept === 'choose-your-superior-room' || 
              item.category?.includes('upgrade')) {
            upgradeCount++
          }
          break
        case 'customization':
          // Check if customization is an upgrade
          const isUpgrade = item.name?.toLowerCase().includes('upgrade') ||
                           item.name?.toLowerCase().includes('superior') ||
                           item.name?.toLowerCase().includes('suite') ||
                           item.name?.toLowerCase().includes('deluxe') ||
                           item.concept === 'choose-your-superior-room' ||
                           item.category?.includes('upgrade')
          
          if (isUpgrade) {
            upgradeCount++
          } else {
            customizationCount++
          }
          break
      }
    })
  })
  
  return {
    upgradeCount,
    customizationCount,
    offerCount
  }
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
