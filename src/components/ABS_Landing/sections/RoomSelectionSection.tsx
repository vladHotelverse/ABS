import type React from 'react'
import RoomSelectionCarousel from '../../ABS_RoomSelectionCarousel'
import type { RoomOption as CarouselRoomOption } from '../../ABS_RoomSelectionCarousel/types'

export interface RoomOption {
  id: string
  name: string
  description: string
  price: number
  perNight: boolean
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
}

export interface RoomSelectionSectionProps {
  roomOptions: RoomOption[]
  selectedRoom?: RoomOption
  onRoomSelected: (room: RoomOption) => void
  onLearnMore?: (room: RoomOption) => void
  texts: RoomSelectionTexts
  className?: string
  isVisible?: boolean
}

// Convert RoomOption to CarouselRoomOption for compatibility
const convertToCarouselRoomOption = (room: RoomOption): CarouselRoomOption => ({
  id: room.id,
  name: room.name,
  description: room.description,
  amenities: room.amenities,
  price: room.price,
  oldPrice: room.oldPrice,
  images: room.images || [room.image],
})

// Convert CarouselRoomOption back to RoomOption
const convertFromCarouselRoomOption = (room: CarouselRoomOption): RoomOption => ({
  id: room.id,
  name: room.name,
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
  texts,
  className = '',
  isVisible = true,
}) => {
  if (!isVisible || roomOptions.length === 0) {
    return null
  }

  const handleRoomSelect = (room: CarouselRoomOption | null) => {
    if (room === null) {
      // Handle deselection - pass null or undefined based on your API design
      // Option 1: If your onRoomSelected supports null
      // onRoomSelected(null as any)
      // Option 2: If you want to ignore deselection in this component
      return
    }
    onRoomSelected(convertFromCarouselRoomOption(room))
  }

  const handleLearnMore = (room: CarouselRoomOption) => {
    if (onLearnMore) {
      onLearnMore(convertFromCarouselRoomOption(room))
    }
  }

  return (
    <section className={`bg-white p-4 md:p-6 rounded-lg shadow border border-neutral-300 ${className}`}>
      <h2 className="text-2xl font-bold mb-4">{texts.roomTitle}</h2>
      <p className="mb-6">{texts.roomSubtitle}</p>
      <RoomSelectionCarousel
        roomOptions={roomOptions.map(convertToCarouselRoomOption)}
        onRoomSelected={handleRoomSelect}
        initialSelectedRoom={selectedRoom ? convertToCarouselRoomOption(selectedRoom) : null}
        selectText={texts.selectText}
        selectedText={texts.selectedText}
        nightText={texts.nightText}
        learnMoreText={texts.learnMoreText}
        priceInfoText={texts.priceInfoText}
        onLearnMore={handleLearnMore}
      />
    </section>
  )
}

export default RoomSelectionSection
