import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useRoomCalculations } from '../useRoomCalculations'
import type { RoomBooking } from '../../MultiBookingPricingSummaryPanel'

describe('useRoomCalculations', () => {
  const createMockRoomBooking = (id: string, items: { name: string; price: number }[]): RoomBooking => ({
    id,
    roomName: `Room ${id}`,
    roomNumber: `${id}01`,
    guestName: `Guest ${id}`,
    roomImage: 'mock-image.jpg',
    items: items.map((item, index) => ({
      id: `${id}-item-${index}`,
      name: item.name,
      price: item.price,
      type: 'room' as const,
      isRemovable: true,
    })),
  })

  describe('Empty Bookings', () => {
    it('should handle empty room bookings array', () => {
      const { result } = renderHook(() => useRoomCalculations([]))

      expect(result.current.roomTotals).toEqual({})
      expect(result.current.overallTotal).toBe(0)
    })

    it('should return 0 for non-existent room ID', () => {
      const { result } = renderHook(() => useRoomCalculations([]))

      expect(result.current.getRoomTotal('non-existent')).toBe(0)
    })
  })

  describe('Single Room Calculations', () => {
    it('should calculate total for single room with single item', () => {
      const roomBookings = [
        createMockRoomBooking('room1', [{ name: 'Standard Room', price: 150 }])
      ]

      const { result } = renderHook(() => useRoomCalculations(roomBookings))

      expect(result.current.roomTotals['room1']).toBe(150)
      expect(result.current.overallTotal).toBe(150)
      expect(result.current.getRoomTotal('room1')).toBe(150)
    })

    it('should calculate total for single room with multiple items', () => {
      const roomBookings = [
        createMockRoomBooking('room1', [
          { name: 'Deluxe Room', price: 200 },
          { name: 'Ocean View Upgrade', price: 50 },
          { name: 'Spa Package', price: 75 }
        ])
      ]

      const { result } = renderHook(() => useRoomCalculations(roomBookings))

      expect(result.current.roomTotals['room1']).toBe(325) // 200 + 50 + 75
      expect(result.current.overallTotal).toBe(325)
      expect(result.current.getRoomTotal('room1')).toBe(325)
    })

    it('should handle room with no items', () => {
      const roomBookings = [
        createMockRoomBooking('room1', [])
      ]

      const { result } = renderHook(() => useRoomCalculations(roomBookings))

      expect(result.current.roomTotals['room1']).toBe(0)
      expect(result.current.overallTotal).toBe(0)
      expect(result.current.getRoomTotal('room1')).toBe(0)
    })
  })

  describe('Multiple Room Calculations', () => {
    it('should calculate totals for multiple rooms', () => {
      const roomBookings = [
        createMockRoomBooking('room1', [
          { name: 'Standard Room', price: 150 },
          { name: 'Breakfast', price: 25 }
        ]),
        createMockRoomBooking('room2', [
          { name: 'Deluxe Room', price: 200 },
          { name: 'Spa Package', price: 75 }
        ]),
        createMockRoomBooking('room3', [
          { name: 'Suite', price: 300 }
        ])
      ]

      const { result } = renderHook(() => useRoomCalculations(roomBookings))

      expect(result.current.roomTotals['room1']).toBe(175) // 150 + 25
      expect(result.current.roomTotals['room2']).toBe(275) // 200 + 75
      expect(result.current.roomTotals['room3']).toBe(300)
      expect(result.current.overallTotal).toBe(750) // 175 + 275 + 300
    })

    it('should handle mixed rooms (some with items, some empty)', () => {
      const roomBookings = [
        createMockRoomBooking('room1', [{ name: 'Standard Room', price: 150 }]),
        createMockRoomBooking('room2', []), // Empty room
        createMockRoomBooking('room3', [{ name: 'Suite', price: 300 }])
      ]

      const { result } = renderHook(() => useRoomCalculations(roomBookings))

      expect(result.current.roomTotals['room1']).toBe(150)
      expect(result.current.roomTotals['room2']).toBe(0)
      expect(result.current.roomTotals['room3']).toBe(300)
      expect(result.current.overallTotal).toBe(450) // 150 + 0 + 300
    })
  })

  describe('Edge Cases', () => {
    it('should handle negative prices', () => {
      const roomBookings = [
        createMockRoomBooking('room1', [
          { name: 'Room', price: 200 },
          { name: 'Discount', price: -50 }
        ])
      ]

      const { result } = renderHook(() => useRoomCalculations(roomBookings))

      expect(result.current.roomTotals['room1']).toBe(150) // 200 - 50
      expect(result.current.overallTotal).toBe(150)
    })

    it('should handle zero prices', () => {
      const roomBookings = [
        createMockRoomBooking('room1', [
          { name: 'Free Item', price: 0 },
          { name: 'Another Free Item', price: 0 }
        ])
      ]

      const { result } = renderHook(() => useRoomCalculations(roomBookings))

      expect(result.current.roomTotals['room1']).toBe(0)
      expect(result.current.overallTotal).toBe(0)
    })

    it('should handle decimal prices', () => {
      const roomBookings = [
        createMockRoomBooking('room1', [
          { name: 'Room', price: 199.99 },
          { name: 'Tax', price: 20.01 }
        ])
      ]

      const { result } = renderHook(() => useRoomCalculations(roomBookings))

      expect(result.current.roomTotals['room1']).toBe(220) // 199.99 + 20.01
      expect(result.current.overallTotal).toBe(220)
    })
  })

  describe('Memoization', () => {
    it('should recalculate when room bookings change', () => {
      const initialBookings = [
        createMockRoomBooking('room1', [{ name: 'Room', price: 100 }])
      ]

      const { result, rerender } = renderHook(
        ({ bookings }) => useRoomCalculations(bookings),
        { initialProps: { bookings: initialBookings } }
      )

      expect(result.current.overallTotal).toBe(100)

      // Add new booking
      const updatedBookings = [
        ...initialBookings,
        createMockRoomBooking('room2', [{ name: 'Suite', price: 200 }])
      ]

      rerender({ bookings: updatedBookings })

      expect(result.current.overallTotal).toBe(300) // 100 + 200
      expect(result.current.roomTotals['room2']).toBe(200)
    })

    it('should maintain same reference when input does not change', () => {
      const roomBookings = [
        createMockRoomBooking('room1', [{ name: 'Room', price: 100 }])
      ]

      const { result, rerender } = renderHook(() => useRoomCalculations(roomBookings))

      const firstRoomTotals = result.current.roomTotals
      const firstOverallTotal = result.current.overallTotal

      rerender()

      // Should maintain same references due to memoization
      expect(result.current.roomTotals).toBe(firstRoomTotals)
      expect(result.current.overallTotal).toBe(firstOverallTotal)
    })
  })

  describe('Performance with Large Datasets', () => {
    it('should handle large number of rooms efficiently', () => {
      const roomBookings = Array.from({ length: 100 }, (_, i) =>
        createMockRoomBooking(`room${i}`, [
          { name: 'Room', price: 100 + i },
          { name: 'Service', price: 20 }
        ])
      )

      const { result } = renderHook(() => useRoomCalculations(roomBookings))

      // Verify calculations are correct
      expect(Object.keys(result.current.roomTotals)).toHaveLength(100)
      expect(result.current.getRoomTotal('room0')).toBe(120) // 100 + 20
      expect(result.current.getRoomTotal('room99')).toBe(219) // 199 + 20

      // Overall total should be sum of all rooms
      const expectedTotal = Array.from({ length: 100 }, (_, i) => 100 + i + 20).reduce((sum, val) => sum + val, 0)
      expect(result.current.overallTotal).toBe(expectedTotal)
    })

    it('should handle rooms with many items efficiently', () => {
      const manyItems = Array.from({ length: 50 }, (_, i) => ({
        name: `Item ${i}`,
        price: 10 + i
      }))

      const roomBookings = [
        createMockRoomBooking('room1', manyItems)
      ]

      const { result } = renderHook(() => useRoomCalculations(roomBookings))

      // Expected total: 10 + 11 + ... + 59 = sum of arithmetic sequence
      const expectedTotal = manyItems.reduce((sum, item) => sum + item.price, 0)
      expect(result.current.roomTotals['room1']).toBe(expectedTotal)
      expect(result.current.overallTotal).toBe(expectedTotal)
    })
  })
})