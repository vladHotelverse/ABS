import type { SpecialOfferOption } from '../types'
import { roomOptions } from '../../ABS_Landing/mockData'

/**
 * Utility function to enrich special offers with room data from ABS_RoomSelectionCarousel
 * This ensures consistency between special offers and room carousel data
 */
export const enrichSpecialOffersWithRoomData = (offers: SpecialOfferOption[]): SpecialOfferOption[] => {
  return offers.map(offer => {
    const matchingRoom = roomOptions.find(room => room.id === offer.targetRoomId)
    
    if (matchingRoom) {
      return {
        ...offer,
        roomTitle: matchingRoom.title,
        roomType: matchingRoom.roomType,
        roomAmenities: matchingRoom.amenities,
        roomPrice: matchingRoom.price
      }
    }
    
    return offer
  })
}

/**
 * Validates that special offer data is consistent with room data
 */
export const validateSpecialOfferConsistency = (offer: SpecialOfferOption): boolean => {
  const matchingRoom = roomOptions.find(room => room.id === offer.targetRoomId)
  
  if (!matchingRoom) {
    console.warn(`Special offer ${offer.id} references non-existent room ${offer.targetRoomId}`)
    return false
  }
  
  if (offer.roomPrice && offer.roomPrice !== matchingRoom.price) {
    console.warn(`Special offer ${offer.id} has inconsistent pricing with room ${offer.targetRoomId}`)
    return false
  }
  
  return true
}