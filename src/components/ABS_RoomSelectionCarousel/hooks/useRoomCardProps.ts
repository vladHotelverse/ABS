import { useMemo } from 'react'
import type { 
  RoomOption, 
  RoomCardTranslations, 
  RoomCardHandlers, 
  RoomCardConfig, 
  RoomCardState 
} from '../types'

interface UseRoomCardPropsParams {
  roomOptions: RoomOption[]
  resolvedTexts: any
  selectedRoom: RoomOption | null
  activeImageIndices: Record<number, number>
  activeBid?: any
  dynamicAmenitiesMap: Map<string, any>
  shouldShowSlider: boolean
  minPrice: number
  readonly: boolean
  mode: string
  handleRoomSelection: (room: RoomOption | null) => void
  handleImageChange: (roomIndex: number, imageIndex: number) => void
  onLearnMore?: (room: RoomOption) => void
  onMakeOffer?: (price: number, room: RoomOption) => void
  onCancelBid?: (roomId: string) => void
}

export const useRoomCardProps = ({
  roomOptions,
  resolvedTexts,
  selectedRoom,
  activeImageIndices,
  activeBid,
  dynamicAmenitiesMap,
  shouldShowSlider,
  minPrice,
  readonly,
  mode,
  handleRoomSelection,
  handleImageChange,
  onLearnMore,
  onMakeOffer,
  onCancelBid,
}: UseRoomCardPropsParams) => {
  return useMemo(() => {
    const createRoomCardProps = (room: RoomOption, roomIndex: number) => {
      const translations: RoomCardTranslations = {
        discountBadgeText: resolvedTexts.discountBadgeText,
        nightText: resolvedTexts.nightText,
        learnMoreText: resolvedTexts.learnMoreText,
        priceInfoText: resolvedTexts.priceInfoText,
        selectedText: resolvedTexts.selectedText,
        selectText: resolvedTexts.upgradeNowText || resolvedTexts.selectText,
        removeText: resolvedTexts.removeText,
        instantConfirmationText: 'Instant Confirmation',
        bidSubmittedText: resolvedTexts.bidSubmittedText,
        previousImageLabel: resolvedTexts.previousImage,
        nextImageLabel: resolvedTexts.nextImage,
        viewImageLabel: resolvedTexts.viewImage,
        proposePriceText: resolvedTexts.proposePriceText,
        availabilityText: resolvedTexts.availabilityText,
        currencyText: resolvedTexts.currencyText,
        offerMadeText: resolvedTexts.offerMadeText,
        updateBidText: resolvedTexts.updateBidText,
        cancelBidText: resolvedTexts.cancelBidText,
        makeOfferText: resolvedTexts.makeOfferText,
      }

      const handlers: RoomCardHandlers = {
        onSelectRoom: readonly || mode === 'consultation' ? () => {} : handleRoomSelection,
        onImageChange: (newImageIndex: number) => handleImageChange(roomIndex, newImageIndex),
        onLearnMore,
        onMakeOffer,
        onCancelBid,
      }

      const config: RoomCardConfig = {
        currencySymbol: resolvedTexts.currencySymbol,
        isActive: true,
        showPriceSlider: shouldShowSlider,
        minPrice,
        dynamicAmenities: dynamicAmenitiesMap.get(room.id),
        roomIndex,
      }

      const cardState: RoomCardState = {
        selectedRoom,
        activeImageIndex: activeImageIndices[roomIndex] || 0,
        activeBid,
      }

      return {
        room,
        translations,
        handlers,
        config,
        state: cardState,
      }
    }

    return roomOptions.map((room, index) => createRoomCardProps(room, index))
  }, [
    roomOptions,
    resolvedTexts,
    selectedRoom,
    activeImageIndices,
    activeBid,
    dynamicAmenitiesMap,
    shouldShowSlider,
    minPrice,
    readonly,
    mode,
    handleRoomSelection,
    handleImageChange,
    onLearnMore,
    onMakeOffer,
    onCancelBid,
  ])
}