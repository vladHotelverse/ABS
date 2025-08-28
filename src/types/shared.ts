/**
 * Shared Types for ABS Booking System
 * 
 * This file contains unified type definitions and safe conversion utilities
 * to resolve type mismatches between the booking store and UI components.
 */

import type { SegmentDiscount } from '../components/ABS_RoomSelectionCarousel/types'
import type { RoomOption } from '../components/ABS_Landing/sections/RoomSelectionSection'

// Core item interface - all items extend this base interface
export interface BaseBookingItem {
  id: string | number
  name: string
  price: number
  type: 'room' | 'customization' | 'offer' | 'bid'
  category?: string
  concept?: 'choose-your-superior-room' | 'customize-your-room' | 'enhance-your-stay' | 'choose-your-room' | 'bid-for-upgrade'
  
  // PricingItem fields
  bidStatus?: 'pending' | 'submitted' | 'accepted' | 'rejected' | 'expired'
  itemStatus?: 'sent_to_hotel' | 'accepted_by_hotel' | 'rejected_by_hotel'
  statusDescription?: string
  segmentDiscount?: SegmentDiscount
  originalOptionId?: string
}

// Extended PricingItem for components - allows flexible ID types and optional fields
export interface ExtendedPricingItem extends BaseBookingItem {
  id: string | number  // Can be string or number for component flexibility
  roomId?: string      // Optional for backward compatibility
  metadata?: Record<string, unknown>
  addedAt?: Date       // Optional for backward compatibility
}

// Enhanced BookingItem for store - requires strict types for state management
export interface EnhancedBookingItem extends BaseBookingItem {
  id: string           // Must be string for consistent store operations
  roomId: string       // Required for store state management
  metadata?: Record<string, unknown>
  addedAt: Date        // Required for store audit trail
}

// Base room booking interface with common fields
interface BaseRoomBooking {
  id: string
  roomName: string
  roomNumber: string
  guestName: string
  checkIn?: string
  checkOut?: string
  guests?: number
  nights: number
  baseRoom?: RoomOption
  isActive: boolean
  payAtHotel: boolean
  roomImage?: string
}

// Store-specific RoomBooking with strict typing for state management
export interface StoreRoomBooking extends BaseRoomBooking {
  items: EnhancedBookingItem[]  // Strict typing for store operations
}

// Component-specific RoomBooking with flexible typing for UI consumption
export interface ComponentRoomBooking extends BaseRoomBooking {
  items: ExtendedPricingItem[]  // Flexible typing for components
}

// Union type for maximum compatibility
export type UnifiedRoomBooking = StoreRoomBooking | ComponentRoomBooking

// Type guard to determine if a room booking is store-specific
export function isStoreRoomBooking(room: UnifiedRoomBooking): room is StoreRoomBooking {
  if (!room.items?.length) return false
  // Check if the first item has store-specific fields
  const firstItem = room.items[0]
  return typeof firstItem.id === 'string' && 
         typeof firstItem.roomId === 'string' && 
         firstItem.addedAt instanceof Date
}

/**
 * Type guard to check if an object is a valid ExtendedPricingItem
 */
export function isExtendedPricingItem(item: any): item is ExtendedPricingItem {
  return (
    item &&
    typeof item === 'object' &&
    (typeof item.id === 'string' || typeof item.id === 'number') &&
    typeof item.name === 'string' &&
    typeof item.price === 'number' &&
    ['room', 'customization', 'offer', 'bid'].includes(item.type)
  )
}

/**
 * Type guard to check if an object is a valid EnhancedBookingItem
 */
export function isEnhancedBookingItem(item: any): item is EnhancedBookingItem {
  return (
    item &&
    typeof item === 'object' &&
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.price === 'number' &&
    ['room', 'customization', 'offer', 'bid'].includes(item.type) &&
    typeof item.roomId === 'string' &&
    (item.addedAt instanceof Date || typeof item.addedAt === 'string')
  )
}

/**
 * Safely converts a PricingItem to a BookingItem
 * Handles all type mismatches and provides proper defaults
 */
export function convertPricingItemToBookingItem(
  item: ExtendedPricingItem,
  roomId: string,
  fallbackMetadata: Record<string, unknown> = {}
): EnhancedBookingItem {
  if (!isExtendedPricingItem(item)) {
    throw new Error(`Invalid PricingItem: ${JSON.stringify(item)}`)
  }

  // Ensure ID is a string
  const stringId = typeof item.id === 'number' ? String(item.id) : item.id

  // Determine type based on concept or existing type
  let itemType = item.type
  if (item.concept) {
    if (item.concept.includes('customization')) itemType = 'customization'
    else if (item.concept.includes('offer')) itemType = 'offer'
    else if (item.concept.includes('bid')) itemType = 'bid'
    else if (item.concept.includes('room')) itemType = 'room'
  }

  return {
    id: stringId,
    name: item.name,
    price: item.price,
    type: itemType,
    concept: item.concept,
    category: item.category,
    roomId: item.roomId || roomId,
    metadata: Object.keys(fallbackMetadata).length > 0 || item.metadata ? {
      ...fallbackMetadata,
      ...(item.metadata || {}),
      // Preserve PricingItem-specific data
      originalOptionId: item.originalOptionId,
      bidStatus: item.bidStatus,
      itemStatus: item.itemStatus,
      statusDescription: item.statusDescription,
      segmentDiscount: item.segmentDiscount,
    } : undefined,
    addedAt: item.addedAt || new Date(),
    
    // Copy PricingItem-specific fields
    bidStatus: item.bidStatus,
    itemStatus: item.itemStatus,
    statusDescription: item.statusDescription,
    segmentDiscount: item.segmentDiscount,
    originalOptionId: item.originalOptionId,
  }
}

/**
 * Safely converts a BookingItem to a PricingItem
 * Preserves all data and handles type differences
 */
export function convertBookingItemToPricingItem(item: EnhancedBookingItem): ExtendedPricingItem {
  // Create a normalized version with proper Date object
  const normalizedItem = {
    ...item,
    addedAt: typeof item.addedAt === 'string' ? new Date(item.addedAt) : item.addedAt
  }
  
  if (!isEnhancedBookingItem(normalizedItem)) {
    throw new Error(`Invalid BookingItem: ${JSON.stringify(item)}`)
  }

  return {
    id: normalizedItem.id, // Already a string
    name: normalizedItem.name,
    price: normalizedItem.price,
    type: normalizedItem.type,
    category: normalizedItem.category,
    concept: normalizedItem.concept,
    bidStatus: normalizedItem.bidStatus,
    itemStatus: normalizedItem.itemStatus,
    statusDescription: normalizedItem.statusDescription,
    segmentDiscount: normalizedItem.segmentDiscount,
    originalOptionId: normalizedItem.originalOptionId,
    
    // Include BookingItem-specific fields for compatibility
    roomId: normalizedItem.roomId,
    metadata: normalizedItem.metadata,
    addedAt: normalizedItem.addedAt,
  }
}

/**
 * Safely converts a component RoomBooking to a store RoomBooking
 * Replaces the unsafe convertToStoreRoomBooking function
 */
export function convertToStoreRoomBooking(
  room: ComponentRoomBooking
): StoreRoomBooking {
  // Validate input
  if (!room || typeof room !== 'object') {
    throw new Error('Invalid room booking data')
  }

  if (!room.id || !room.roomName) {
    throw new Error('Room booking missing required fields: id, roomName')
  }

  // Convert items safely
  const convertedItems = (room.items || []).map((item, index) => {
    try {
      return convertPricingItemToBookingItem(item, room.id, { 
        conversionIndex: index,
        conversionTimestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error(`Failed to convert item ${item?.id || index}:`, error instanceof Error ? error.message : String(error))
      // Return a safe fallback item rather than crashing
      return {
        id: `fallback-${room.id}-${index}`,
        name: item?.name || `Unknown Item ${index}`,
        price: item?.price || 0,
        type: (item?.type || 'room') as 'room' | 'customization' | 'offer' | 'bid',
        concept: item?.concept,
        category: item?.category,
        roomId: room.id,
        metadata: { 
          isFallback: true,
          originalItem: item,
          error: error instanceof Error ? error.message : String(error)
        },
        addedAt: new Date(),
      } as EnhancedBookingItem
    }
  })

  return {
    id: room.id,
    roomName: room.roomName,
    roomNumber: room.roomNumber || '',
    guestName: room.guestName || '',
    checkIn: room.checkIn,
    checkOut: room.checkOut,
    guests: room.guests,
    nights: room.nights || 1,
    items: convertedItems,
    baseRoom: room.baseRoom,
    isActive: room.isActive || false,
    payAtHotel: room.payAtHotel || false,
    roomImage: room.roomImage,
  }
}

/**
 * Safely converts a store RoomBooking to a component RoomBooking
 */
export function convertFromStoreRoomBooking(
  room: StoreRoomBooking
): ComponentRoomBooking {
  // Validate input
  if (!room || typeof room !== 'object') {
    throw new Error('Invalid store room booking data')
  }

  // Convert items safely
  const convertedItems = (room.items || []).map((item: any, index: number) => {
    try {
      // Ensure addedAt is converted to Date if it's a string
      const normalizedItem = {
        ...item,
        addedAt: typeof item.addedAt === 'string' ? new Date(item.addedAt) : item.addedAt
      }
      return convertBookingItemToPricingItem(normalizedItem as EnhancedBookingItem)
    } catch (error) {
      console.error(`Failed to convert store item ${item?.id || index}:`, error instanceof Error ? error.message : String(error))
      // Return a safe fallback item
      return {
        id: item?.id || `fallback-${room.id}-${index}`,
        name: item?.name || `Unknown Item ${index}`,
        price: item?.price || 0,
        type: (item?.type || 'room') as 'room' | 'customization' | 'offer' | 'bid',
        concept: item?.concept,
        category: item?.category,
        roomId: room.id,
        metadata: { 
          isFallback: true,
          originalItem: item,
          error: error instanceof Error ? error.message : String(error),
          ...item?.metadata // Preserve original metadata
        },
        addedAt: typeof item?.addedAt === 'string' ? new Date(item.addedAt) : (item?.addedAt || new Date()),
      } as ExtendedPricingItem
    }
  })

  return {
    id: room.id,
    roomName: room.roomName,
    roomNumber: room.roomNumber,
    guestName: room.guestName,
    checkIn: room.checkIn,
    checkOut: room.checkOut,
    guests: room.guests,
    nights: room.nights,
    items: convertedItems,
    baseRoom: room.baseRoom,
    isActive: room.isActive,
    payAtHotel: room.payAtHotel,
    roomImage: room.roomImage,
  }
}

/**
 * Validates that a conversion is safe and data is preserved
 */
export function validateConversion(
  original: any,
  converted: any,
  conversionType: 'item' | 'room'
): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!original || !converted) {
    errors.push('Missing original or converted data')
    return { isValid: false, errors }
  }

  // Check essential fields
  if (original.id !== converted.id && String(original.id) !== String(converted.id)) {
    errors.push(`ID mismatch: ${original.id} !== ${converted.id}`)
  }
  
  if (original.name !== converted.name) {
    errors.push(`Name mismatch: ${original.name} !== ${converted.name}`)
  }
  
  if (original.price !== converted.price) {
    errors.push(`Price mismatch: ${original.price} !== ${converted.price}`)
  }

  if (original.type !== converted.type) {
    errors.push(`Type mismatch: ${original.type} !== ${converted.type}`)
  }

  if (conversionType === 'room') {
    if (original.roomName !== converted.roomName) {
      errors.push(`Room name mismatch: ${original.roomName} !== ${converted.roomName}`)
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}