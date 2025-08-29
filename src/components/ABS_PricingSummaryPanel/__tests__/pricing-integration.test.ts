import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useRoomCalculations } from '../hooks/useRoomCalculations'
import type { RoomBooking } from '../MultiBookingPricingSummaryPanel'

describe('Pricing Integration Tests', () => {
  const createTestRoomBooking = (
    id: string, 
    nights: number, 
    items: Array<{ name: string; price: number; type?: 'room' | 'customization' | 'offer' }>
  ): RoomBooking => ({
    id,
    roomName: `Room ${id}`,
    roomNumber: `${id}01`,
    guestName: `Guest ${id}`,
    nights,
    payAtHotel: false,
    isActive: false,
    items: items.map((item, index) => ({
      id: `${id}-item-${index}`,
      name: item.name,
      price: item.price,
      type: item.type || 'room',
    }))
  })

  describe('Nights Multiplication Integration', () => {
    it('should calculate correct totals for multi-night multi-room booking', () => {
      const roomBookings = [
        createTestRoomBooking('room1', 3, [
          { name: 'Standard Room', price: 100 },
          { name: 'Breakfast', price: 25 }
        ]),
        createTestRoomBooking('room2', 5, [
          { name: 'Suite', price: 200 },
          { name: 'Spa Package', price: 50 }
        ])
      ]

      const { result } = renderHook(() => useRoomCalculations(roomBookings))

      // Room 1: (100 + 25) * 3 nights = 375
      expect(result.current.roomTotals['room1']).toBe(375)
      
      // Room 2: (200 + 50) * 5 nights = 1250  
      expect(result.current.roomTotals['room2']).toBe(1250)
      
      // Overall total: 375 + 1250 = 1625
      expect(result.current.overallTotal).toBe(1625)
    })

    it('should handle rooms with different night counts correctly', () => {
      const roomBookings = [
        createTestRoomBooking('weekend', 2, [
          { name: 'Weekend Room', price: 150 }
        ]),
        createTestRoomBooking('business', 7, [
          { name: 'Business Room', price: 120 }
        ])
      ]

      const { result } = renderHook(() => useRoomCalculations(roomBookings))

      expect(result.current.roomTotals['weekend']).toBe(300) // 150 * 2
      expect(result.current.roomTotals['business']).toBe(840) // 120 * 7
      expect(result.current.overallTotal).toBe(1140) // 300 + 840
    })
  })

  describe('Demo Pricing Scenarios', () => {
    it('should handle all positive prices for demo', () => {
      const roomBookings = [
        createTestRoomBooking('demo-room', 4, [
          { name: 'Deluxe Room', price: 180 },
          { name: 'Ocean View', price: 40 },
          { name: 'Room Service', price: 30 }
        ])
      ]

      const { result } = renderHook(() => useRoomCalculations(roomBookings))

      const roomTotal = result.current.roomTotals['demo-room']
      // (180 + 40 + 30) * 4 nights = 1000
      expect(roomTotal).toBe(1000)
      expect(roomTotal).toBeGreaterThan(0) // Ensure positive for demo
      expect(result.current.overallTotal).toBe(1000)
    })

    it('should handle single night bookings', () => {
      const roomBookings = [
        createTestRoomBooking('single-night', 1, [
          { name: 'Standard Room', price: 100 }
        ])
      ]

      const { result } = renderHook(() => useRoomCalculations(roomBookings))

      expect(result.current.roomTotals['single-night']).toBe(100) // 100 * 1
      expect(result.current.overallTotal).toBe(100)
    })
  })

  describe('Edge Cases', () => {
    it('should handle rooms with zero items but positive nights', () => {
      const roomBookings = [
        createTestRoomBooking('empty-room', 3, [])
      ]

      const { result } = renderHook(() => useRoomCalculations(roomBookings))

      expect(result.current.roomTotals['empty-room']).toBe(0) // 0 * 3 = 0
      expect(result.current.overallTotal).toBe(0)
    })

    it('should handle mixed positive and zero prices correctly', () => {
      const roomBookings = [
        createTestRoomBooking('mixed-room', 2, [
          { name: 'Room', price: 100 },
          { name: 'Free WiFi', price: 0 },
          { name: 'Parking', price: 20 }
        ])
      ]

      const { result } = renderHook(() => useRoomCalculations(roomBookings))

      // (100 + 0 + 20) * 2 nights = 240
      expect(result.current.roomTotals['mixed-room']).toBe(240)
      expect(result.current.overallTotal).toBe(240)
    })
  })
})