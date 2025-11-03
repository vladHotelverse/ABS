import { useMemo } from 'react'
import type {
  RoomCardConfig,
  RoomCardHandlers,
  RoomCardState,
  RoomCardTranslations,
  UseRoomCardPropsParams,
} from '../types'

export const useRoomCardProps = ({
  roomOptions,
  resolvedTexts,
  selectedRoom,
  activeImageIndices,
  dynamicAmenitiesMap,
  readonly,
  mode,
  handleRoomSelection,
  handleImageChange,
  onLearnMore,
  enableHoverZoom = true,
  handleRoomSelectionWithCenter,
}: UseRoomCardPropsParams) => {
  // Memoize translations object to avoid recreation
  const stableTranslations = useMemo<RoomCardTranslations>(
    () => ({
      nightText: resolvedTexts.nightText,
      learnMoreText: resolvedTexts.learnMoreText,
      priceInfoText: resolvedTexts.priceInfoText,
      selectedText: resolvedTexts.selectedText,
      selectText: resolvedTexts.upgradeNowText || resolvedTexts.selectText,
      removeText: resolvedTexts.removeText || 'Remove',
      instantConfirmationText: 'Instant Confirmation',
      previousImageLabel: resolvedTexts.navigationLabels?.previousImage || 'Previous image',
      nextImageLabel: resolvedTexts.navigationLabels?.nextImage || 'Next image',
      viewImageLabel: resolvedTexts.navigationLabels?.viewImage || 'View image',
    }),
    [resolvedTexts]
  )

  // Memoize handler functions to prevent recreation
  const stableOnSelectRoom = useMemo(() => {
    if (readonly || mode === 'consultation') {
      return () => {}
    }
    // Use auto-center handler for multi-room scenarios if provided
    if (handleRoomSelectionWithCenter && roomOptions.length > 2) {
      return handleRoomSelectionWithCenter
    }
    return handleRoomSelection
  }, [readonly, mode, handleRoomSelection, handleRoomSelectionWithCenter, roomOptions.length])

  // Create stable image change handlers for each room
  const imageChangeHandlers = useMemo(() => {
    const handlers: { [roomIndex: number]: (newImageIndex: number) => void } = {}
    roomOptions.forEach((_, roomIndex) => {
      handlers[roomIndex] = (newImageIndex: number) => handleImageChange(roomIndex, newImageIndex)
    })
    return handlers
  }, [handleImageChange, roomOptions.length])

  // Memoize config values
  const stableConfig = useMemo(
    () => ({
      currencySymbol: resolvedTexts.currencySymbol,
      isActive: true,
      readonly: readonly || mode === 'consultation',
      enableHoverZoom,
    }),
    [resolvedTexts.currencySymbol, readonly, mode, enableHoverZoom]
  )

  return useMemo(() => {
    return roomOptions.map((room, roomIndex) => {
      const handlers: RoomCardHandlers = {
        onSelectRoom: stableOnSelectRoom,
        onImageChange: imageChangeHandlers[roomIndex],
        onLearnMore,
      }

      const config: RoomCardConfig = {
        ...stableConfig,
        dynamicAmenities: dynamicAmenitiesMap.get(room.id),
        roomIndex,
      }

      const cardState: RoomCardState = {
        selectedRoom,
        activeImageIndex: activeImageIndices[roomIndex] || 0,
      }

      return {
        room,
        translations: stableTranslations,
        handlers,
        config,
        state: cardState,
      }
    })
  }, [
    roomOptions,
    stableTranslations,
    stableOnSelectRoom,
    imageChangeHandlers,
    stableConfig,
    selectedRoom,
    activeImageIndices,
    dynamicAmenitiesMap,
    onLearnMore,
  ])
}
