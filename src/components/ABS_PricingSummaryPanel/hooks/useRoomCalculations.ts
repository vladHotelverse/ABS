import { useMemo } from 'react'
import type { RoomBooking } from '../MultiBookingPricingSummaryPanel'

export const useRoomCalculations = (roomBookings: RoomBooking[]) => {
  const roomTotals = useMemo(() => {
    return roomBookings.reduce(
      (acc, room) => {
        const nights = Math.max(room.nights || 0, 0)
        const total = room.items.reduce((sum, item) => {
          // Only multiply per-night items by nights
          // Special offers (type: 'offer') should not be multiplied by nights
          if (item.type === 'offer') {
            return sum + item.price
          }
          // All other items (room upgrades, customizations) are per-night
          return sum + (item.price * nights)
        }, 0)
        acc[room.id] = total
        return acc
      },
      {} as Record<string, number>
    )
  }, [roomBookings])

  const overallTotal = useMemo(() => {
    return Object.values(roomTotals).reduce((sum, total) => sum + total, 0)
  }, [roomTotals])

  const totalItemsCount = useMemo(() => {
    return roomBookings.reduce((count, room) => count + room.items.length, 0)
  }, [roomBookings])

  const getRoomTotal = (roomId: string) => roomTotals[roomId] || 0

  return {
    roomTotals,
    overallTotal,
    totalItemsCount,
    getRoomTotal,
  }
}
