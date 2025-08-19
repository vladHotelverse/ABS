import type React from 'react'
import { useMemo } from 'react'
import RoomSelectionCarousel from '../../ABS_RoomSelectionCarousel'
import type { RoomOption as CarouselRoomOption } from '../../ABS_RoomSelectionCarousel/types'

export interface RoomOption {
  id: string
  title?: string
  roomType: string
  description: string
  price: number
  perNight?: boolean
  image: string
  images?: string[]
  amenities: string[]
  oldPrice?: number
}

export interface RoomSelectionTexts {
  roomTitle: string
  roomSubtitle: string
  selectText: string
  selectedText: string
  nightText: string
  learnMoreText: string
  priceInfoText: string
  makeOfferText?: string
  proposePriceText?: string
  availabilityText?: string
  offerMadeText?: string
  bidSubmittedText?: string
  updateBidText?: string
  cancelBidText?: string
}

export interface RoomSelectionSectionProps {
  roomOptions: RoomOption[]
  selectedRoom?: RoomOption
  onRoomSelected: (room: RoomOption) => void
  onLearnMore?: (room: RoomOption) => void
  onMakeOffer?: (price: number, room: RoomOption) => void
  onCancelBid?: (roomId: string) => void
  texts: RoomSelectionTexts
  className?: string
  isVisible?: boolean
  showPriceSlider?: boolean
  activeBid?: {
    roomId: string
    bidAmount: number
    status: 'pending' | 'submitted' | 'accepted' | 'rejected'
  }
}

// Convert RoomOption to CarouselRoomOption for compatibility
const convertToCarouselRoomOption = (room: RoomOption): CarouselRoomOption => ({
  id: room.id,
  title: room.title,
  roomType: room.roomType,
  description: room.description,
  amenities: room.amenities,
  price: room.price,
  oldPrice: room.oldPrice,
  images: room.images || [room.image],
})

// Convert CarouselRoomOption back to RoomOption
const convertFromCarouselRoomOption = (room: CarouselRoomOption): RoomOption => ({
  id: room.id,
  title: room.title,
  roomType: room.roomType,
  description: room.description,
  price: room.price,
  perNight: true,
  image: room.images[0],
  images: room.images,
  amenities: room.amenities,
  oldPrice: room.oldPrice,
})

export const RoomSelectionSection: React.FC<RoomSelectionSectionProps> = ({
  roomOptions,
  selectedRoom,
  onRoomSelected,
  onLearnMore,
  onMakeOffer,
  onCancelBid,
  texts,
  className = '',
  isVisible = true,
  showPriceSlider = false,
  activeBid,
}) => {
  if (!isVisible || roomOptions.length === 0) {
    return null
  }

  const handleRoomSelect = (room: CarouselRoomOption | null) => {
    if (room === null) {
      // Handle deselection
      onRoomSelected(null as any)
      return
    }
    onRoomSelected(convertFromCarouselRoomOption(room))
  }

  const handleLearnMore = (room: CarouselRoomOption) => {
    if (onLearnMore) {
      onLearnMore(convertFromCarouselRoomOption(room))
    }
  }

  const handleMakeOffer = (price: number, room: CarouselRoomOption) => {
    if (onMakeOffer) {
      onMakeOffer(price, convertFromCarouselRoomOption(room))
    }
  }

  // Memoize the converted room options to prevent unnecessary re-renders in the carousel
  const carouselRoomOptions = useMemo(
    () => roomOptions.map(convertToCarouselRoomOption),
    [roomOptions]
  )

  return (
    <section className={`bg-white md:p-6 rounded-lg md:shadow md:border md:border-neutral-300 ${className}`}>
      <h2 className="text-3xl font-bold mb-4">{texts.roomTitle}</h2>
      <p className="mb-6">{texts.roomSubtitle}</p>
      <RoomSelectionCarousel
        roomOptions={carouselRoomOptions}
        onRoomSelected={handleRoomSelect}
        initialSelectedRoom={selectedRoom ? convertToCarouselRoomOption(selectedRoom) : null}
        selectText={texts.selectText}
        selectedText={texts.selectedText}
        nightText={texts.nightText}
        learnMoreText={texts.learnMoreText}
        priceInfoText={texts.priceInfoText}
        onLearnMore={handleLearnMore}
        onMakeOffer={handleMakeOffer}
        onCancelBid={onCancelBid}
        showPriceSlider={showPriceSlider}
        makeOfferText={texts.makeOfferText}
        proposePriceText={texts.proposePriceText}
        availabilityText={texts.availabilityText}
        offerMadeText={texts.offerMadeText}
        bidSubmittedText={texts.bidSubmittedText}
        updateBidText={texts.updateBidText}
        cancelBidText={texts.cancelBidText}
        activeBid={activeBid}
      />
    </section>
  )
}

export default RoomSelectionSection
