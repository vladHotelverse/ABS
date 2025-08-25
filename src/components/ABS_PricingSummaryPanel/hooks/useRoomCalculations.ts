import { useMemo } from 'react'
import type { RoomBooking } from '../MultiBookingPricingSummaryPanel'

export const useRoomCalculations = (roomBookings: RoomBooking[]) => {
  const roomTotals = useMemo(() => {
    return roomBookings.reduce(
      (acc, room) => {
        const total = room.items.reduce((sum, item) => sum + item.price, 0)
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
