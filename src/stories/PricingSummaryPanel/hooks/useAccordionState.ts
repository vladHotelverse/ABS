import { useCallback, useEffect, useMemo, useState } from 'react'
import type { MultiBookingPricingSummaryPanelProps } from '@/components/upsell/PricingSummaryPanel/MultiBookingPricingSummaryPanel'

type Room = MultiBookingPricingSummaryPanelProps['rooms'][number]

interface UseAccordionStateOptions {
  rooms: MultiBookingPricingSummaryPanelProps['rooms']
  exclusiveAccordion?: boolean
  initialRoomIds?: string[]
}

const hasItems = (room: Room) => room.sections.some((section) => section.items.length > 0)

const selectInitialRooms = (rooms: Room[], exclusive: boolean, preset?: string[]) => {
  if (preset && preset.length > 0) {
    return [...preset]
  }

  const roomsWithItems = rooms.filter(hasItems).map((room) => room.id)

  if (exclusive) {
    return roomsWithItems.length > 0 ? [roomsWithItems[0]] : []
  }

  return roomsWithItems
}

export const useAccordionState = ({
  rooms,
  exclusiveAccordion = false,
  initialRoomIds,
}: UseAccordionStateOptions) => {
  const initialActiveRooms = useMemo(
    () => selectInitialRooms(rooms, exclusiveAccordion, initialRoomIds),
    [rooms, exclusiveAccordion, initialRoomIds]
  )

  const [activeRooms, setActiveRooms] = useState<string[]>(initialActiveRooms)

  useEffect(() => {
    if (initialRoomIds !== undefined) {
      setActiveRooms(initialActiveRooms)
    }
  }, [initialActiveRooms, initialRoomIds])

  const handleToggle = useCallback(
    (roomId: string) => {
      setActiveRooms((prev) => {
        if (exclusiveAccordion) {
          return prev.includes(roomId) ? [] : [roomId]
        }

        if (prev.includes(roomId)) {
          return prev.filter((id) => id !== roomId)
        }

        return [...prev, roomId]
      })
    },
    [exclusiveAccordion]
  )

  return {
    activeRooms,
    setActiveRooms,
    toggleRoom: handleToggle,
    initialActiveRooms,
  }
}

export default useAccordionState
