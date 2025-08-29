/**
 * Booking Store Test Suite
 * Comprehensive tests for the Zustand booking store
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useBookingStore, type BookingItem, type RoomBooking } from '../bookingStore'

// Mock data
const mockRoom: RoomBooking = {
  id: 'room-1',
  roomName: 'Deluxe Room',
  roomNumber: '101',
  guestName: 'John Doe',
  nights: 3,
  items: [],
  isActive: false,
  payAtHotel: false,
}

const mockCustomization: Omit<BookingItem, 'id' | 'addedAt' | 'roomId'> = {
  name: 'Ocean View',
  price: 50,
  type: 'customization',
  concept: 'customize-your-room',
  category: 'view',
}

const mockOffer: Omit<BookingItem, 'id' | 'addedAt' | 'roomId'> = {
  name: 'Spa Package',
  price: 100,
  type: 'offer',
  concept: 'enhance-your-stay',
}

const mockRoomItem: Omit<BookingItem, 'id' | 'addedAt' | 'roomId'> = {
  name: 'Premium Suite',
  price: 200,
  type: 'room',
  concept: 'choose-your-superior-room',
}

describe('BookingStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useBookingStore.getState().resetState()
  })

  describe('Initialization', () => {
    it('should initialize with default single booking mode', () => {
      const { result } = renderHook(() => useBookingStore())
      
      expect(result.current.mode).toBe('single')
      expect(result.current.rooms).toEqual([])
      expect(result.current.activeRoomId).toBeNull()
      expect(result.current.selectedRoom).toBeNull()
      expect(result.current.bookingStatus).toBe('normal')
    })
  })

  describe('Mode Management', () => {
    it('should switch between single and multi booking modes', () => {
      const { result } = renderHook(() => useBookingStore())
      
      act(() => {
        result.current.setMode('multi')
      })
      
      expect(result.current.mode).toBe('multi')
      
      act(() => {
        result.current.setMode('single')
      })
      
      expect(result.current.mode).toBe('single')
    })
  })

  describe('Room Management', () => {
    it('should add a room and set it as active if no active room exists', () => {
      const { result } = renderHook(() => useBookingStore())
      
      act(() => {
        result.current.addRoom(mockRoom)
      })
      
      expect(result.current.rooms).toHaveLength(1)
      expect(result.current.rooms[0].id).toBe('room-1')
      expect(result.current.activeRoomId).toBe('room-1')
      expect(result.current.rooms[0].isActive).toBe(true)
    })

    it('should add multiple rooms with only first one active', () => {
      const { result } = renderHook(() => useBookingStore())
      
      const room2 = { ...mockRoom, id: 'room-2', roomName: 'Suite' }
      
      act(() => {
        result.current.addRoom(mockRoom)
        result.current.addRoom(room2)
      })
      
      expect(result.current.rooms).toHaveLength(2)
      expect(result.current.activeRoomId).toBe('room-1')
      expect(result.current.rooms[0].isActive).toBe(true)
      expect(result.current.rooms[1].isActive).toBe(false)
    })

    it('should remove a room and update active room', () => {
      const { result } = renderHook(() => useBookingStore())
      
      const room2 = { ...mockRoom, id: 'room-2' }
      
      act(() => {
        result.current.addRoom(mockRoom)
        result.current.addRoom(room2)
        result.current.removeRoom('room-1')
      })
      
      expect(result.current.rooms).toHaveLength(1)
      expect(result.current.activeRoomId).toBe('room-2')
    })

    it('should set active room correctly', () => {
      const { result } = renderHook(() => useBookingStore())
      
      const room2 = { ...mockRoom, id: 'room-2' }
      
      act(() => {
        result.current.addRoom(mockRoom)
        result.current.addRoom(room2)
        result.current.setActiveRoom('room-2')
      })
      
      expect(result.current.activeRoomId).toBe('room-2')
      expect(result.current.rooms[0].isActive).toBe(false)
      expect(result.current.rooms[1].isActive).toBe(true)
    })
  })

  describe('Item Management', () => {
    beforeEach(() => {
      const { result } = renderHook(() => useBookingStore())
      
      act(() => {
        result.current.addRoom(mockRoom)
      })
    })

    it('should add item to room', () => {
      const { result } = renderHook(() => useBookingStore())
      
      act(() => {
        result.current.addItemToRoom('room-1', mockCustomization)
      })
      
      const room = result.current.rooms[0]
      expect(room.items).toHaveLength(1)
      expect(room.items[0].name).toBe('Ocean View')
      expect(room.items[0].type).toBe('customization')
      expect(room.items[0].roomId).toBe('room-1')
      expect(room.items[0].id).toBeDefined()
      expect(room.items[0].addedAt).toBeInstanceOf(Date)
    })

    it('should remove existing customization when adding new one in same category', () => {
      const { result } = renderHook(() => useBookingStore())
      
      const cityView = { ...mockCustomization, name: 'City View', category: 'view' }
      
      act(() => {
        result.current.addItemToRoom('room-1', mockCustomization)
        result.current.addItemToRoom('room-1', cityView)
      })
      
      const room = result.current.rooms[0]
      expect(room.items).toHaveLength(1)
      expect(room.items[0].name).toBe('City View')
    })

    it('should handle bid and room mutual exclusion', () => {
      const { result } = renderHook(() => useBookingStore())
      
      const bidItem: Omit<BookingItem, 'id' | 'addedAt' | 'roomId'> = {
        name: 'Bid for Premium Suite',
        price: 150,
        type: 'bid',
        concept: 'bid-for-upgrade',
      }
      
      act(() => {
        result.current.addItemToRoom('room-1', mockRoomItem)
        result.current.addItemToRoom('room-1', bidItem)
      })
      
      const room = result.current.rooms[0]
      expect(room.items).toHaveLength(1)
      expect(room.items[0].type).toBe('bid')
      expect(room.items.find(item => item.type === 'room')).toBeUndefined()
    })

    it('should remove item from room', () => {
      const { result } = renderHook(() => useBookingStore())
      
      act(() => {
        result.current.addItemToRoom('room-1', mockCustomization)
      })
      
      const room = result.current.rooms[0]
      const itemId = room.items[0].id
      
      act(() => {
        result.current.removeItemFromRoom('room-1', String(itemId))
      })
      
      expect(result.current.rooms[0].items).toHaveLength(0)
    })

    it('should update item in room', () => {
      const { result } = renderHook(() => useBookingStore())
      
      act(() => {
        result.current.addItemToRoom('room-1', mockCustomization)
      })
      
      const room = result.current.rooms[0]
      const itemId = room.items[0].id
      
      act(() => {
        result.current.updateItemInRoom('room-1', String(itemId), { price: 75 })
      })
      
      expect(result.current.rooms[0].items[0].price).toBe(75)
    })
  })

  describe('Bulk Operations', () => {
    it('should clear all items from a room', () => {
      const { result } = renderHook(() => useBookingStore())
      
      act(() => {
        result.current.addRoom(mockRoom)
        result.current.addItemToRoom('room-1', mockCustomization)
        result.current.addItemToRoom('room-1', mockOffer)
        result.current.clearRoom('room-1')
      })
      
      expect(result.current.rooms[0].items).toHaveLength(0)
    })

    it('should clear all rooms', () => {
      const { result } = renderHook(() => useBookingStore())
      
      const room2 = { ...mockRoom, id: 'room-2' }
      
      act(() => {
        result.current.addRoom(mockRoom)
        result.current.addRoom(room2)
        result.current.addItemToRoom('room-1', mockCustomization)
        result.current.addItemToRoom('room-2', mockOffer)
        result.current.clearAllRooms()
      })
      
      expect(result.current.rooms[0].items).toHaveLength(0)
      expect(result.current.rooms[1].items).toHaveLength(0)
    })
  })

  describe('Selectors', () => {
    beforeEach(() => {
      const { result } = renderHook(() => useBookingStore())
      
      const room2 = { ...mockRoom, id: 'room-2', roomName: 'Suite' }
      
      act(() => {
        result.current.setMode('multi')
        result.current.addRoom(mockRoom)
        result.current.addRoom(room2)
        result.current.addItemToRoom('room-1', mockCustomization)
        result.current.addItemToRoom('room-1', mockOffer)
        result.current.addItemToRoom('room-2', { ...mockOffer, name: 'Different Offer' })
      })
    })

    it('should get current room', () => {
      const { result } = renderHook(() => useBookingStore())
      
      const currentRoom = result.current.getCurrentRoom()
      expect(currentRoom?.id).toBe('room-1')
      expect(currentRoom?.isActive).toBe(true)
    })

    it('should calculate room total', () => {
      const { result } = renderHook(() => useBookingStore())
      
      const room1Total = result.current.getRoomTotal('room-1')
      const room2Total = result.current.getRoomTotal('room-2')
      
      expect(room1Total).toBe(250) // (50 * 3 nights) + 100 = 150 + 100 = 250
      expect(room2Total).toBe(100) // 100 (offers not multiplied by nights)
    })

    it('should calculate total price', () => {
      const { result } = renderHook(() => useBookingStore())
      
      const totalPrice = result.current.getTotalPrice()
      expect(totalPrice).toBe(350) // 250 (room-1) + 100 (room-2) = 350
    })

    it('should count items correctly', () => {
      const { result } = renderHook(() => useBookingStore())
      
      const itemCount = result.current.getItemCount()
      const room1ItemCount = result.current.getRoomItemCount('room-1')
      const room2ItemCount = result.current.getRoomItemCount('room-2')
      
      expect(itemCount).toBe(3)
      expect(room1ItemCount).toBe(2)
      expect(room2ItemCount).toBe(1)
    })

    it('should validate booking', () => {
      const { result } = renderHook(() => useBookingStore())
      
      expect(result.current.isValidBooking()).toBe(true)
      
      act(() => {
        result.current.clearAllRooms()
      })
      
      expect(result.current.isValidBooking()).toBe(false)
    })

    it('should get items by type', () => {
      const { result } = renderHook(() => useBookingStore())
      
      const customizations = result.current.getItemsByType('room-1', 'customization')
      const offers = result.current.getItemsByType('room-1', 'offer')
      
      expect(customizations).toHaveLength(1)
      expect(offers).toHaveLength(1)
      expect(customizations[0].name).toBe('Ocean View')
      expect(offers[0].name).toBe('Spa Package')
    })

    it('should get items by category', () => {
      const { result } = renderHook(() => useBookingStore())
      
      const viewItems = result.current.getItemsByCategory('room-1', 'view')
      expect(viewItems).toHaveLength(1)
      expect(viewItems[0].name).toBe('Ocean View')
    })
  })

  describe('Legacy Compatibility', () => {
    it('should support single booking room selection', () => {
      const { result } = renderHook(() => useBookingStore())
      
      const mockRoomOption = {
        id: 'deluxe',
        title: 'Deluxe Room',
        roomType: 'DELUXE',
        price: 200,
        image: 'test.jpg',
        description: 'Test room',
        amenities: [],
      }
      
      // Initialize single booking mode first
      act(() => {
        result.current.setMode('single')
      })
      
      // Now add room item to the first room
      act(() => {
        const roomId = result.current.rooms[0]?.id
        if (roomId) {
          result.current.addItemToRoom(roomId, {
            name: mockRoomOption.title,
            price: mockRoomOption.price,
            type: 'room',
            concept: 'choose-your-room',
            metadata: {
              roomId: mockRoomOption.id,
              roomType: mockRoomOption.roomType,
              image: mockRoomOption.image
            }
          })
        }
      })
      
      const room = result.current.rooms[0]
      const roomItem = room?.items.find(item => item.type === 'room')
      expect(roomItem?.name).toBe(mockRoomOption.title)
      expect(roomItem?.price).toBe(mockRoomOption.price)
    })

    it('should support customizations via unified store', () => {
      const { result } = renderHook(() => useBookingStore())
      
      // Initialize single booking mode first
      act(() => {
        result.current.setMode('single')
      })
      
      const customization = {
        name: 'Ocean View',
        price: 50,
        type: 'customization' as const,
        concept: 'customize-your-room' as const,
        category: 'view',
        metadata: {
          category: 'view'
        }
      }
      
      act(() => {
        const roomId = result.current.rooms[0]?.id
        if (roomId) {
          result.current.addItemToRoom(roomId, customization)
        }
      })
      
      const room = result.current.rooms[0]
      const customizationItem = room?.items.find(item => item.type === 'customization')
      expect(customizationItem?.name).toBe('Ocean View')
      expect(customizationItem?.price).toBe(50)
    })

    it('should support special offers via unified store', () => {
      const { result } = renderHook(() => useBookingStore())
      
      // Initialize single booking mode first
      act(() => {
        result.current.setMode('single')
      })
      
      const offer = {
        name: 'Spa Package',
        price: 100,
        type: 'offer' as const,
        concept: 'enhance-your-stay' as const,
        metadata: {
          description: 'Relaxing spa experience',
          image: 'spa.jpg',
          offerType: 'perStay'
        }
      }
      
      act(() => {
        const roomId = result.current.rooms[0]?.id
        if (roomId) {
          result.current.addItemToRoom(roomId, offer)
        }
      })
      
      const room = result.current.rooms[0]
      const offerItem = room?.items.find(item => item.type === 'offer')
      expect(offerItem?.name).toBe('Spa Package')
      expect(offerItem?.price).toBe(100)
    })

    it('should support bidding via unified store', () => {
      const { result } = renderHook(() => useBookingStore())
      
      // Initialize single booking mode first
      act(() => {
        result.current.setMode('single')
      })
      
      const bidItem = {
        name: 'Premium Suite Bid',
        price: 250,
        type: 'bid' as const,
        concept: 'bid-for-upgrade' as const,
        metadata: {
          roomId: 'premium',
          bidAmount: 250,
          status: 'submitted',
          roomName: 'Premium Suite'
        }
      }
      
      act(() => {
        const roomId = result.current.rooms[0]?.id
        if (roomId) {
          result.current.addItemToRoom(roomId, bidItem)
        }
      })
      
      const room = result.current.rooms[0]
      const bidEntry = room?.items.find(item => item.type === 'bid')
      expect(bidEntry?.name).toBe('Premium Suite Bid')
      expect(bidEntry?.price).toBe(250)
      expect(bidEntry?.metadata?.status).toBe('submitted')
    })
  })

  describe('Optimistic Updates', () => {
    it('should handle optimistic updates', () => {
      const { result } = renderHook(() => useBookingStore())
      
      act(() => {
        result.current.startOptimisticUpdate('test-operation')
      })
      
      expect(result.current.optimisticUpdates.has('test-operation')).toBe(true)
      
      act(() => {
        result.current.completeOptimisticUpdate('test-operation')
      })
      
      expect(result.current.optimisticUpdates.has('test-operation')).toBe(false)
    })

    it('should handle rollback of optimistic updates', () => {
      const { result } = renderHook(() => useBookingStore())
      
      act(() => {
        result.current.startOptimisticUpdate('test-operation')
        result.current.rollbackOptimisticUpdate('test-operation')
      })
      
      expect(result.current.optimisticUpdates.has('test-operation')).toBe(false)
    })
  })

  describe('State Reset', () => {
    it('should reset state completely', () => {
      const { result } = renderHook(() => useBookingStore())
      
      act(() => {
        result.current.setMode('multi')
        result.current.addRoom(mockRoom)
        result.current.addItemToRoom('room-1', mockCustomization)
        result.current.setShowMobilePricing(true)
        result.current.setBookingStatus('loading')
      })
      
      act(() => {
        result.current.resetState()
      })
      
      expect(result.current.mode).toBe('single')
      expect(result.current.rooms).toHaveLength(0)
      expect(result.current.activeRoomId).toBeNull()
      expect(result.current.showMobilePricing).toBe(false)
      expect(result.current.bookingStatus).toBe('normal')
    })
  })

  describe('Performance Tests', () => {
    it('should handle large number of rooms efficiently', () => {
      const { result } = renderHook(() => useBookingStore())
      
      const startTime = performance.now()
      
      act(() => {
        result.current.setMode('multi')
        for (let i = 0; i < 100; i++) {
          result.current.addRoom({
            ...mockRoom,
            id: `room-${i}`,
            roomName: `Room ${i}`,
            roomNumber: i.toString(),
          })
        }
      })
      
      const addRoomsTime = performance.now() - startTime
      
      const calculateStartTime = performance.now()
      const totalPrice = result.current.getTotalPrice()
      const calculateTime = performance.now() - calculateStartTime
      
      expect(result.current.rooms).toHaveLength(100)
      expect(totalPrice).toBe(0) // No items added
      expect(addRoomsTime).toBeLessThan(100) // Should be fast
      expect(calculateTime).toBeLessThan(10) // Calculations should be very fast
    })
  })
})