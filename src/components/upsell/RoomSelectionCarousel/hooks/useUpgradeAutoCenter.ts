import { useCallback, useEffect } from 'react'
import type { CarouselApi } from '@/components/ui/carousel'
import type { RoomOption } from '../types'

interface UseUpgradeAutoCenterParams {
  selectedRoomId: string | null
  roomCarouselApi: CarouselApi | undefined
  roomOptions: RoomOption[]
  onRoomSelection: (room: RoomOption | null) => void
}

interface UseUpgradeAutoCenterReturn {
  handleRoomSelectionWithCenter: (room: RoomOption | null, shouldCenter?: boolean) => void
}

export const useUpgradeAutoCenter = ({
  selectedRoomId,
  roomCarouselApi,
  roomOptions,
  onRoomSelection,
}: UseUpgradeAutoCenterParams): UseUpgradeAutoCenterReturn => {
  // Auto-center selected room when it changes (for multi-booking navigation)
  useEffect(() => {
    if (selectedRoomId && roomCarouselApi && roomOptions.length > 2) {
      const roomIndex = roomOptions.findIndex((room) => room.id === selectedRoomId)
      if (roomIndex !== -1 && roomIndex !== roomCarouselApi.selectedScrollSnap()) {
        roomCarouselApi.scrollTo(roomIndex, false) // false for no snap animation during auto-center
      }
    }
  }, [selectedRoomId, roomCarouselApi, roomOptions])

  // Handle room selection with auto-centering
  const handleRoomSelectionWithCenter = useCallback(
    (room: RoomOption | null, shouldCenter = true) => {
      const roomId = room?.id || null

      // If selecting a room and it's not in center position, center it first
      if (shouldCenter && roomId && roomCarouselApi && roomOptions.length > 2) {
        const roomIndex = roomOptions.findIndex((r) => r.id === roomId)
        const currentCenter = roomCarouselApi.selectedScrollSnap()

        if (roomIndex !== -1 && roomIndex !== currentCenter) {
          // Move room to center with smooth animation, then select after animation completes
          roomCarouselApi.scrollTo(roomIndex)

          // Wait for animation to complete before setting selection
          setTimeout(() => {
            onRoomSelection(room)
          }, 300) // Animation duration
          return
        }
      }

      // Direct selection (already centered or no centering needed)
      onRoomSelection(room)
    },
    [onRoomSelection, roomCarouselApi, roomOptions]
  )

  return {
    handleRoomSelectionWithCenter,
  }
}
