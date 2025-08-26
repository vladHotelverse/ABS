/**
 * Optimized Booking Hook Test Suite
 * Tests for performance-optimized booking hook
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useOptimizedBooking } from '../useOptimizedBooking'
import { useBookingStore } from '../../stores/bookingStore'

// Mock performance API
Object.defineProperty(global, 'performance', {
  value: {
    now: vi.fn(() => Date.now()),
  },
})

describe('useOptimizedBooking', () => {
  beforeEach(() => {
    // Reset store before each test
    useBookingStore.getState().resetState()
    // Ensure clean state
    useBookingStore.setState({
      mode: 'single',
      rooms: [],
      activeRoomId: null,
      selectedRoom: null,
      customizations: {},
      specialOffers: [],
      activeBid: null,
      showMobilePricing: false,
      bookingStatus: 'normal',
      lastUpdate: new Date(),
      optimisticUpdates: new Set(),
    })
    vi.clearAllMocks()
  })

  describe('Performance Tracking', () => {
    it('should track room switching performance', async () => {
      const { result } = renderHook(() => useOptimizedBooking())
      
      // Add rooms first
      act(() => {
        useBookingStore.getState().addRoom({
          id: 'room-1',
          roomName: 'Test Room 1',
          roomNumber: '101',
          guestName: 'Test Guest',
          nights: 3,
          items: [],
          isActive: false,
          payAtHotel: false,
        })
      })
      
      act(() => {
        result.current.addItem('room-1', {
          name: 'Test Room Item',
          price: 100,
          type: 'customization',
        })
      })
      
      // Mock performance.now to return predictable values
      const mockNow = vi.mocked(performance.now)
      mockNow.mockReturnValueOnce(0).mockReturnValueOnce(30) // 30ms switch time
      
      await act(async () => {
        await result.current.switchRoom('room-1')
      })
      
      const metrics = result.current.getPerformanceMetrics()
      expect(metrics.roomSwitchTime).toBe(30)
      expect(metrics.isPerformanceOptimal).toBe(true) // < 50ms
    })

    it('should warn when performance target is missed', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const { result } = renderHook(() => useOptimizedBooking())
      
      // Mock slow performance
      const mockNow = vi.mocked(performance.now)
      mockNow.mockReturnValueOnce(0).mockReturnValueOnce(100) // 100ms switch time
      
      await act(async () => {
        await result.current.switchRoom('room-1')
      })
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Room switching took 100ms (target: <50ms)')
      )
      
      consoleSpy.mockRestore()
    })
  })

  describe('Optimistic Updates', () => {
    it('should handle successful optimistic updates', async () => {
      const { result } = renderHook(() => useOptimizedBooking())
      
      // Add a room first
      act(() => {
        useBookingStore.getState().addRoom({
          id: 'room-1',
          roomName: 'Test Room',
          roomNumber: '101',
          guestName: 'Test Guest',
          nights: 3,
          items: [],
          isActive: false,
          payAtHotel: false,
        })
      })
      
      const validationResult = await act(async () => {
        return await result.current.addItem('room-1', {
          name: 'Ocean View',
          price: 50,
          type: 'customization',
          category: 'view',
        })
      })
      
      expect(validationResult.isValid).toBe(true)
      expect(validationResult.errors).toHaveLength(0)
      
      const room = useBookingStore.getState().rooms.find(r => r.id === 'room-1')
      expect(room?.items).toHaveLength(1)
      expect(room?.items[0].name).toBe('Ocean View')
    })

    it('should handle failed optimistic updates', async () => {
      const { result } = renderHook(() => useOptimizedBooking())
      
      // Try to add item to non-existent room
      await expect(
        act(async () => {
          await result.current.addItem('non-existent-room', {
            name: 'Test Item',
            price: 50,
            type: 'customization',
          })
        })
      ).rejects.toThrow('Room non-existent-room not found')
    })

    it('should rollback on error', async () => {
      const { result } = renderHook(() => useOptimizedBooking())
      
      // Add a room
      act(() => {
        useBookingStore.getState().addRoom({
          id: 'room-1',
          roomName: 'Test Room',
          roomNumber: '101',
          guestName: 'Test Guest',
          nights: 3,
          items: [],
          isActive: false,
          payAtHotel: false,
        })
      })
      
      // Mock an error during item addition
      const originalAddItemToRoom = useBookingStore.getState().addItemToRoom
      vi.spyOn(useBookingStore.getState(), 'addItemToRoom').mockImplementation(() => {
        throw new Error('Mock error')
      })
      
      await expect(
        act(async () => {
          await result.current.addItem('room-1', {
            name: 'Test Item',
            price: 50,
            type: 'customization',
          })
        })
      ).rejects.toThrow('Mock error')
      
      // Restore original implementation
      useBookingStore.getState().addItemToRoom = originalAddItemToRoom
    })
  })

  describe('Legacy Compatibility', () => {
    it('should handle room selection in single booking mode', () => {
      const { result } = renderHook(() => useOptimizedBooking())
      
      const mockRoom = {
        id: 'deluxe',
        title: 'Deluxe Room',
        roomType: 'DELUXE',
        price: 200,
        image: 'test.jpg',
        description: 'Test room',
        amenities: [],
      }
      
      act(() => {
        result.current.handleRoomSelect(mockRoom)
      })
      
      expect(result.current.selectedRoom).toEqual(mockRoom)
    })

    it('should handle room selection in multi booking mode', async () => {
      const { result } = renderHook(() => useOptimizedBooking())
      
      // Switch to multi mode and add rooms
      act(() => {
        useBookingStore.getState().setMode('multi')
        useBookingStore.getState().addRoom({
          id: 'room-1',
          roomName: 'Test Room 1',
          roomNumber: '101',
          guestName: 'Test Guest 1',
          nights: 3,
          items: [],
          isActive: false,
          payAtHotel: false,
        })
        useBookingStore.getState().addRoom({
          id: 'room-2',
          roomName: 'Test Room 2',
          roomNumber: '102',
          guestName: 'Test Guest 2',
          nights: 3,
          items: [],
          isActive: false,
          payAtHotel: false,
        })
        // Set active room
        useBookingStore.getState().setActiveRoom('room-1')
      })
      
      const mockRoom = {
        id: 'premium',
        title: 'Premium Suite',
        roomType: 'PREMIUM',
        price: 300,
        image: 'premium.jpg',
        description: 'Premium room',
        amenities: [],
      }
      
      await act(async () => {
        result.current.handleRoomSelect(mockRoom)
      })
      
      const room = useBookingStore.getState().rooms.find(r => r.id === 'room-1')
      expect(room?.items).toHaveLength(1)
      expect(room?.items[0].name).toBe('PREMIUM')
      expect(room?.items[0].type).toBe('room')
    })

    it('should handle customization changes', async () => {
      const { result } = renderHook(() => useOptimizedBooking())
      
      // Switch to multi mode and add rooms
      act(() => {
        useBookingStore.getState().setMode('multi')
        useBookingStore.getState().addRoom({
          id: 'room-1',
          roomName: 'Test Room 1',
          roomNumber: '101',
          guestName: 'Test Guest 1',
          nights: 3,
          items: [],
          isActive: false,
          payAtHotel: false,
        })
        useBookingStore.getState().addRoom({
          id: 'room-2',
          roomName: 'Test Room 2',
          roomNumber: '102',
          guestName: 'Test Guest 2',
          nights: 3,
          items: [],
          isActive: false,
          payAtHotel: false,
        })
        // Set active room
        useBookingStore.getState().setActiveRoom('room-1')
      })
      
      await act(async () => {
        result.current.handleCustomizationChange(
          'view',
          'ocean-view',
          'Ocean View',
          50
        )
      })
      
      const room = useBookingStore.getState().rooms.find(r => r.id === 'room-1')
      expect(room?.items).toHaveLength(1)
      expect(room?.items[0].name).toBe('Ocean View')
      expect(room?.items[0].category).toBe('view')
    })

    it('should handle offer booking', async () => {
      const { result } = renderHook(() => useOptimizedBooking())
      
      // Switch to multi mode and add rooms
      act(() => {
        useBookingStore.getState().setMode('multi')
        useBookingStore.getState().addRoom({
          id: 'room-1',
          roomName: 'Test Room 1',
          roomNumber: '101',
          guestName: 'Test Guest 1',
          nights: 3,
          items: [],
          isActive: false,
          payAtHotel: false,
        })
        useBookingStore.getState().addRoom({
          id: 'room-2',
          roomName: 'Test Room 2',
          roomNumber: '102',
          guestName: 'Test Guest 2',
          nights: 3,
          items: [],
          isActive: false,
          payAtHotel: false,
        })
        // Set active room
        useBookingStore.getState().setActiveRoom('room-1')
      })
      
      const offerData = {
        id: 'spa-1',
        name: 'Spa Package',
        price: 100,
        quantity: 1,
        type: 'perStay',
      }
      
      await act(async () => {
        await result.current.handleOfferBooking(offerData)
      })
      
      const room = useBookingStore.getState().rooms.find(r => r.id === 'room-1')
      expect(room?.items).toHaveLength(1)
      expect(room?.items[0].name).toBe('Spa Package')
      expect(room?.items[0].type).toBe('offer')
    })

    it('should remove offer when quantity is 0', async () => {
      const { result } = renderHook(() => useOptimizedBooking())
      
      // Switch to multi mode and add a room
      act(() => {
        useBookingStore.getState().setMode('multi')
        useBookingStore.getState().addRoom({
          id: 'room-1',
          roomName: 'Test Room',
          roomNumber: '101',
          guestName: 'Test Guest',
          nights: 3,
          items: [],
          isActive: false,
          payAtHotel: false,
        })
      })
      
      // Add offer first
      const offerData = {
        id: 'spa-1',
        name: 'Spa Package',
        price: 100,
        quantity: 1,
        type: 'perStay',
      }
      
      await act(async () => {
        await result.current.handleOfferBooking(offerData)
      })
      
      // Remove offer
      await act(async () => {
        await result.current.handleOfferBooking({ ...offerData, quantity: 0 })
      })
      
      const room = useBookingStore.getState().rooms.find(r => r.id === 'room-1')
      expect(room?.items).toHaveLength(0)
    })
  })

  describe('Computed Values', () => {
    beforeEach(() => {
      // Set up test data
      act(() => {
        useBookingStore.getState().setMode('multi')
        useBookingStore.getState().addRoom({
          id: 'room-1',
          roomName: 'Deluxe Room',
          roomNumber: '101',
          guestName: 'John Doe',
          nights: 3,
          items: [],
          isActive: false,
          payAtHotel: false,
        })
        useBookingStore.getState().addRoom({
          id: 'room-2',
          roomName: 'Suite',
          roomNumber: '201',
          guestName: 'Jane Doe',
          nights: 3,
          items: [],
          isActive: false,
          payAtHotel: false,
        })
      })
    })

    it('should calculate total price correctly', async () => {
      const { result } = renderHook(() => useOptimizedBooking())
      
      // Setup rooms first
      act(() => {
        useBookingStore.getState().setMode('multi')
        useBookingStore.getState().addRoom({
          id: 'room-1',
          roomName: 'Test Room 1',
          roomNumber: '101',
          guestName: 'Test Guest 1',
          nights: 3,
          items: [],
          isActive: false,
          payAtHotel: false,
        })
        useBookingStore.getState().addRoom({
          id: 'room-2',
          roomName: 'Test Room 2',
          roomNumber: '102',
          guestName: 'Test Guest 2',
          nights: 3,
          items: [],
          isActive: false,
          payAtHotel: false,
        })
      })
      
      await act(async () => {
        await result.current.addItem('room-1', {
          name: 'Ocean View',
          price: 50,
          type: 'customization',
        })
        await result.current.addItem('room-2', {
          name: 'Spa Package',
          price: 100,
          type: 'offer',
        })
      })
      
      expect(result.current.totalPrice).toBe(150)
    })

    it('should count items correctly', async () => {
      const { result } = renderHook(() => useOptimizedBooking())
      
      // Setup rooms first
      act(() => {
        useBookingStore.getState().setMode('multi')
        useBookingStore.getState().addRoom({
          id: 'room-1',
          roomName: 'Test Room 1',
          roomNumber: '101',
          guestName: 'Test Guest 1',
          nights: 3,
          items: [],
          isActive: false,
          payAtHotel: false,
        })
        useBookingStore.getState().addRoom({
          id: 'room-2',
          roomName: 'Test Room 2',
          roomNumber: '102',
          guestName: 'Test Guest 2',
          nights: 3,
          items: [],
          isActive: false,
          payAtHotel: false,
        })
      })
      
      await act(async () => {
        await result.current.addItem('room-1', {
          name: 'Ocean View',
          price: 50,
          type: 'customization',
        })
        await result.current.addItem('room-1', {
          name: 'Spa Package',
          price: 100,
          type: 'offer',
        })
        await result.current.addItem('room-2', {
          name: 'City View',
          price: 30,
          type: 'customization',
        })
      })
      
      expect(result.current.itemCount).toBe(3)
    })

    it('should determine multi booking mode correctly', () => {
      const { result } = renderHook(() => useOptimizedBooking())
      
      expect(result.current.shouldShowMultiBooking).toBe(true)
      
      act(() => {
        useBookingStore.getState().setMode('single')
      })
      
      expect(result.current.shouldShowMultiBooking).toBe(false)
    })
  })

  describe('Error Handling', () => {
    it('should handle room switching errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      // Mock setActiveRoom to throw error
      const originalSetActiveRoom = useBookingStore.getState().setActiveRoom
      vi.spyOn(useBookingStore.getState(), 'setActiveRoom').mockImplementation(() => {
        throw new Error('Room switching failed')
      })
      
      const { result } = renderHook(() => useOptimizedBooking())
      
      await expect(
        act(async () => {
          await result.current.switchRoom('room-1')
        })
      ).rejects.toThrow('Room switching failed')
      
      expect(consoleSpy).toHaveBeenCalledWith('Room switching failed:', expect.any(Error))
      
      // Restore original implementation
      useBookingStore.getState().setActiveRoom = originalSetActiveRoom
      consoleSpy.mockRestore()
    })

    it('should handle item removal errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      // Mock removeItemFromRoom to throw error
      const originalRemoveItemFromRoom = useBookingStore.getState().removeItemFromRoom
      vi.spyOn(useBookingStore.getState(), 'removeItemFromRoom').mockImplementation(() => {
        throw new Error('Item removal failed')
      })
      
      const { result } = renderHook(() => useOptimizedBooking())
      
      await expect(
        act(async () => {
          await result.current.removeItem('room-1', 'item-1')
        })
      ).rejects.toThrow('Item removal failed')
      
      expect(consoleSpy).toHaveBeenCalledWith('Item removal failed:', expect.any(Error))
      
      // Restore original implementation
      useBookingStore.getState().removeItemFromRoom = originalRemoveItemFromRoom
      consoleSpy.mockRestore()
    })
  })
})