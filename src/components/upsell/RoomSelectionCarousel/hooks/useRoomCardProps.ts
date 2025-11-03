import { useMemo } from 'react'
import type { RoomCardConfig, RoomCardHandlers, RoomCardState, RoomCardTranslations, RoomOption } from '../types'

interface UseRoomCardPropsParams {
  roomOptions: RoomOption[]
  translations: RoomCardTranslations
  selectedRoom: RoomOption | null
  activeImageIndices: Record<number, number>
  readonly: boolean
  handleRoomSelection: (room: RoomOption | null) => void
  handleImageChange: (roomIndex: number, imageIndex: number) => void
  enableHoverZoom?: boolean
}

export const useRoomCardProps = ({
  roomOptions,
  translations,
  selectedRoom,
  activeImageIndices,
  readonly,
  handleRoomSelection,
  handleImageChange,
  enableHoverZoom = true,
}: UseRoomCardPropsParams) => {
  // Memoize handler functions to prevent recreation
  const stableOnSelectRoom = useMemo(() => {
    if (readonly) {
      return () => {}
    }
    return handleRoomSelection
  }, [readonly, handleRoomSelection])

  // Create stable image change handlers for each room
  const imageChangeHandlers = useMemo(() => {
    const handlers: { [roomIndex: number]: (newImageIndex: number) => void } = {}
    roomOptions.forEach((_, roomIndex) => {
      handlers[roomIndex] = (newImageIndex: number) => handleImageChange(roomIndex, newImageIndex)
    })
    return handlers
  }, [handleImageChange, roomOptions.length])

  return useMemo(() => {
    return roomOptions.map((room, roomIndex) => {
      const handlers: RoomCardHandlers = {
        onSelectRoom: stableOnSelectRoom,
        onImageChange: imageChangeHandlers[roomIndex],
      }

      const config: RoomCardConfig = {
        isActive: true,
        readonly,
        enableHoverZoom,
        roomIndex,
      }

      const cardState: RoomCardState = {
        selectedRoom,
        activeImageIndex: activeImageIndices[roomIndex] || 0,
      }

      return {
        room,
        translations,
        handlers,
        config,
        state: cardState,
      }
    })
  }, [
    roomOptions,
    translations,
    stableOnSelectRoom,
    imageChangeHandlers,
    readonly,
    enableHoverZoom,
    selectedRoom,
    activeImageIndices,
  ])
}
