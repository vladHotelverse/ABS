// Room-related types (aligned with RoomOption from sections)
export interface Room {
  id: string
  title?: string
  roomType: string
  description: string
  price: number
  perNight?: boolean
  image: string
  images?: string[]
  amenities: string[]
  oldPrice?: number
}

// Import RoomOption type
import type { RoomOption } from './sections/RoomSelectionSection'

// Type alias for backward compatibility
export type { RoomOption } from './sections/RoomSelectionSection'

// Customization types
export interface Customization {
  id: string
  name: string
  price: number
  category?: string
  quantity?: number
}

// Special offer types matching ABS_SpecialOffers
export interface SpecialOffer {
  id: string | number
  title: string
  description: string
  image: string
  price: number
  priceType?: 'per-stay' | 'per-person' | 'per-night' // Legacy field
  type?: 'perStay' | 'perPerson' | 'perNight' | string // New preferred field
  maxQuantity?: number
  requiresDateSelection?: boolean
  allowsMultipleDates?: boolean
  name: string // Required for compatibility with SelectedOffer
}

// Selected offer type
export interface SelectedOffer {
  id: string | number
  name: string
  price: number
  quantity?: number
  persons?: number
  nights?: number
}

// Bid-related types
export interface ActiveBid {
  id: string
  roomId: string
  bidAmount: number
  status: 'pending' | 'submitted' | 'accepted' | 'rejected'
  roomName: string
}

// Booking state type
export interface BookingState {
  selectedRoom: RoomOption | null
  customizations: Record<string, Customization[]>
  specialOffers: SpecialOffer[]
  activeBid: ActiveBid | null
  status?: 'loading' | 'error' | 'normal' | 'confirmation'
  texts: {
    [key: string]: string
  }
}

// Note: RoomOption is already exported above