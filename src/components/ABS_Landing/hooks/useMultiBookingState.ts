import { useState } from 'react'
import type { RoomBooking } from '../../ABS_PricingSummaryPanel/MultiBookingPricingSummaryPanel'
import type { PricingItem } from '../../ABS_PricingSummaryPanel'
import type { RoomOption } from '../types'

export interface UseMultiBookingStateProps {
  initialRoomBookings?: RoomBooking[]
  onMultiBookingChange?: (bookings: RoomBooking[]) => void
  onConfirmBooking?: (bookingData: any) => void
}

export interface UseMultiBookingStateReturn {
  // State
  roomBookings: RoomBooking[]
  activeRoomId: string | undefined
  isMobilePricingOverlayOpen: boolean

  // Actions
  setRoomBookings: (bookings: RoomBooking[]) => void
  setActiveRoomId: (roomId: string | undefined) => void
  setIsMobilePricingOverlayOpen: (open: boolean) => void

  // Handlers
  handleMultiBookingChange: (bookings: RoomBooking[]) => void
  handleMultiBookingRemoveItem: (
    roomId: string,
    itemId: string | number,
    _itemName: string,
    _itemType: PricingItem['type']
  ) => void
  handleMultiBookingEditSection: (roomId: string, sectionType: 'room' | 'customizations' | 'offers') => void
  handleMultiBookingConfirmAll: () => Promise<void>
  handleRoomTabClick: (roomId: string) => void
  handleRoomUpgrade: (roomId: string, newRoom: RoomOption, currentRoomPrice?: number) => void
  handleRoomBid: (roomId: string, bidAmount: number, roomType: string) => void

  // Computed values
  totalItemCount: number
  totalPrice: number
}

export const useMultiBookingState = ({
  initialRoomBookings = [],
  onMultiBookingChange,
  onConfirmBooking,
}: UseMultiBookingStateProps): UseMultiBookingStateReturn => {
  // State management
  const [roomBookings, setRoomBookings] = useState<RoomBooking[]>(initialRoomBookings)
  const [activeRoomId, setActiveRoomId] = useState<string | undefined>(
    initialRoomBookings.length > 0 ? initialRoomBookings[0].id : undefined
  )
  const [isMobilePricingOverlayOpen, setIsMobilePricingOverlayOpen] = useState<boolean>(false)

  // Handlers
  const handleMultiBookingChange = (bookings: RoomBooking[]) => {
    setRoomBookings(bookings)
    onMultiBookingChange?.(bookings)
  }

  const handleMultiBookingRemoveItem = (
    roomId: string,
    itemId: string | number,
    itemName: string,
    itemType: PricingItem['type']
  ) => {
    console.log(`[MultiBooking] Removing item: ${itemName} (ID: ${itemId}, Type: ${itemType}) from room: ${roomId}`)
    
    const targetBooking = roomBookings.find(booking => booking.id === roomId)
    if (!targetBooking) {
      console.error(`[MultiBooking] Room ${roomId} not found`)
      return
    }

    const itemToRemove = targetBooking.items.find(item => item.id === itemId)
    if (!itemToRemove) {
      console.error(`[MultiBooking] Item ${itemId} not found in room ${roomId}`)
      console.log(`[MultiBooking] Available items in room:`, targetBooking.items.map(item => ({ id: item.id, name: item.name, type: item.type })))
      return
    }

    const updatedBookings = roomBookings.map((booking) =>
      booking.id === roomId
        ? {
            ...booking,
            items: booking.items.filter((item) => item.id !== itemId),
          }
        : booking
    )
    
    console.log(`[MultiBooking] Successfully removed item ${itemName} from room ${roomId}`)
    handleMultiBookingChange(updatedBookings)
  }

  const handleMultiBookingEditSection = (roomId: string, sectionType: 'room' | 'customizations' | 'offers') => {
    // Handle edit section for multi-booking
    console.log('Edit section:', roomId, sectionType)
    // TODO: Implement edit functionality
  }

  const handleMultiBookingConfirmAll = async () => {
    // Handle confirm all for multi-booking
    if (onConfirmBooking) {
      onConfirmBooking(roomBookings)
    }
  }

  const handleRoomBid = (roomId: string, bidAmount: number, roomType: string) => {
    const updatedBookings = roomBookings.map(booking => {
      if (booking.id === roomId) {
        // Remove ALL room items (base rooms, upgraded rooms) and existing bids (mutually exclusive)
        const itemsWithoutConflicts = booking.items.filter(item => 
          !(item.type === 'room') && // Remove ALL room items regardless of concept
          !(item.type === 'bid' || item.concept === 'bid-for-upgrade') &&
          !(item.type === 'customization' && (item.category === 'room-upgrade' || item.category?.startsWith('room-upgrade')))
        )
        
        // Create bid item
        const bidItem = {
          id: `bid-${roomId}-${Date.now()}`,
          name: `Bid for ${roomType}`,
          price: bidAmount,
          type: 'bid' as const,
          concept: 'bid-for-upgrade' as const,
          bidStatus: 'submitted' as const,
          roomId: roomId,
        }
        
        return {
          ...booking,
          items: [...itemsWithoutConflicts, bidItem],
        }
      }
      return booking
    })
    
    setRoomBookings(updatedBookings)
    handleMultiBookingChange(updatedBookings)
  }

  const handleRoomTabClick = (roomId: string) => {
    setActiveRoomId(roomId)
  }

  const handleRoomUpgrade = (roomId: string, newRoom: RoomOption, currentRoomPrice?: number) => {
    const updatedBookings = roomBookings.map(booking => {
      if (booking.id === roomId) {
        // Find the current base room item
        const currentRoomItem = booking.items.find(item => item.type === 'room')
        const currentPrice = currentRoomPrice || currentRoomItem?.price || 129.99
        
        // Remove existing bids (mutually exclusive) but keep non-room items
        const itemsWithoutConflicts = booking.items.filter(item => 
          !(item.type === 'customization' && (item.category === 'room-upgrade' || item.category?.startsWith('room-upgrade'))) &&
          !(item.type === 'bid' || item.concept === 'bid-for-upgrade')
        )
        
        let updatedItems
        if (currentRoomItem) {
          // Update existing room item
          updatedItems = itemsWithoutConflicts.map(item => {
            if (item.type === 'room') {
              return {
                ...item,
                name: newRoom.roomType,
                price: newRoom.price,
                concept: 'choose-your-superior-room' as const,
                // Add upgrade metadata for tracking
                isUpgraded: true,
                originalPrice: currentPrice,
                upgradePrice: newRoom.price - currentPrice,
              }
            }
            return item
          })
        } else {
          // Create new room item if none exists
          const newRoomItem = {
            id: `room-${roomId}`,
            name: newRoom.roomType,
            price: newRoom.price,
            type: 'room' as const,
            concept: 'choose-your-superior-room' as const,
            isUpgraded: true,
            originalPrice: currentPrice,
            upgradePrice: newRoom.price - currentPrice,
          }
          updatedItems = [...itemsWithoutConflicts, newRoomItem]
        }

        // Update the room booking with new room information
        return {
          ...booking,
          roomName: newRoom.roomType,
          roomImage: newRoom.image || newRoom.images?.[0] || booking.roomImage,
          items: updatedItems,
        }
      }
      return booking
    })

    setRoomBookings(updatedBookings)
    handleMultiBookingChange(updatedBookings)
  }

  // Computed values
  const totalItemCount = roomBookings.reduce((sum, booking) => sum + booking.items.length, 0)
  const totalPrice = roomBookings.reduce((sum, booking) => {
    const bookingTotal = booking.items.reduce((itemSum, item) => itemSum + item.price, 0)
    return sum + bookingTotal
  }, 0) // Removed tax to match pricing panel

  return {
    // State
    roomBookings,
    activeRoomId,
    isMobilePricingOverlayOpen,

    // Actions
    setRoomBookings,
    setActiveRoomId,
    setIsMobilePricingOverlayOpen,

    // Handlers
    handleMultiBookingChange,
    handleMultiBookingRemoveItem,
    handleMultiBookingEditSection,
    handleMultiBookingConfirmAll,
    handleRoomTabClick,
    handleRoomUpgrade,
    handleRoomBid,

    // Computed values
    totalItemCount,
    totalPrice,
  }
}
