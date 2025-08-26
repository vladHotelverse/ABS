import clsx from 'clsx'
import type React from 'react'
import { useCallback, useState, useEffect } from 'react'
import { PriceSlider } from './components'
import { useSlider } from './hooks'
import type { RoomOption } from './types'

// Import subcomponents
import RoomBadges from './components/RoomBadges'
import RoomDetails from './components/RoomDetails'
import RoomPricing from './components/RoomPricing'
import ImageModal from './components/ImageModal'

export interface RoomCardTranslations {
  discountBadgeText: string
  nightText: string
  learnMoreText: string
  priceInfoText: string
  selectedText: string
  selectText: string
  removeText: string
  instantConfirmationText?: string
  bidSubmittedText?: string
  previousImageLabel?: string
  nextImageLabel?: string
  viewImageLabel?: string // Template: 'View image {index}'
  proposePriceText?: string
  availabilityText?: string
  currencyText?: string
  offerMadeText?: string
  updateBidText?: string
  cancelBidText?: string
  makeOfferText?: string
  totalPriceText?: string
}

export interface RoomCardHandlers {
  onSelectRoom: (room: RoomOption | null) => void
  onImageChange: (newImageIndex: number) => void
  onLearnMore?: (room: RoomOption) => void
  onMakeOffer?: (price: number, room: RoomOption) => void
  onCancelBid?: (roomId: string) => void
}

export interface RoomCardConfig {
  currencySymbol?: string
  isActive?: boolean
  showPriceSlider?: boolean
  minPrice?: number
  dynamicAmenities?: string[]
  roomIndex?: number
}

export interface RoomCardState {
  selectedRoom: RoomOption | null
  activeImageIndex: number
  activeBid?: {
    roomId: string | number
    bidAmount: number
    status: 'pending' | 'submitted' | 'accepted' | 'rejected'
  }
}

export interface RoomCardProps {
  room: RoomOption
  translations: RoomCardTranslations
  handlers: RoomCardHandlers
  config?: RoomCardConfig
  state: RoomCardState
}

const RoomCard: React.FC<RoomCardProps> = ({
  room,
  translations,
  handlers,
  config = {},
  state,
}) => {
  // Destructure grouped props with defaults
  const {
    discountBadgeText,
    nightText,
    priceInfoText,
    selectedText,
    selectText,
    removeText,
    instantConfirmationText = 'Instant Confirmation',
    bidSubmittedText = 'Bid Submitted',
    proposePriceText,
    availabilityText,
    currencyText,
    offerMadeText,
    updateBidText,
    cancelBidText,
  } = translations

  const {
    onSelectRoom,
    onMakeOffer,
    onCancelBid,
  } = handlers

  const {
    currencySymbol = '€',
    isActive = false,
    showPriceSlider = false,
    minPrice = 10,
    dynamicAmenities,
  } = config

  const {
    selectedRoom,
    activeBid,
  } = state
  const isBidActive = activeBid?.roomId === room.id

  // State to control slider visibility with smooth transition
  const [sliderVisible, setSliderVisible] = useState(false)


  // Slider logic is now local to each card
  const {
    proposedPrice,
    setProposedPrice,
    maxPrice,
    makeOffer,
    resetBid,
    bidStatus,
    submittedPrice,
  } = useSlider({
    room,
    minPrice,
    onMakeOffer,
    offerMadeText,
    activeBid,
  })

  // Handle slider visibility with a small delay to ensure smooth transition
  useEffect(() => {
    if (isActive && showPriceSlider) {
      // Small delay to ensure the Slider component is ready
      const timer = setTimeout(() => {
        setSliderVisible(true)
      }, 50)
      return () => clearTimeout(timer)
    } else {
      setSliderVisible(false)
    }
  }, [isActive, showPriceSlider])

  // Image modal state
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [currentImageIndex] = useState(0)

  const handleImageClick = useCallback(() => {
    setIsImageModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsImageModalOpen(false)
  }, [])

  const handleSelectRoom = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation()
      // If the room is already selected, deselect it; otherwise, select it
      const isCurrentlySelected = selectedRoom?.id === room.id
      onSelectRoom(isCurrentlySelected ? null : room)
    },
    [onSelectRoom, room, selectedRoom]
  )

  return (
    <div
      className={clsx(
        'cq-container relative rounded-lg overflow-visible md:shadow-sm w-full max-w-md transition-all duration-300',
        isActive && showPriceSlider ? 'bg-gray-50 md:ring-2 ring-gray-200' : 'bg-white',
        {
          'border-2 border-green-300 bg-green-50/30': selectedRoom?.id === room.id,
          'border-2 border-blue-300 bg-blue-50/30': isBidActive && selectedRoom?.id !== room.id,
          'border border-transparent': selectedRoom?.id !== room.id && !isBidActive,
        }
      )}
    >
      {/* Room Image Display with Click-to-Modal */}
      <div className="relative h-64 bg-neutral-100 group cursor-zoom-in" onClick={handleImageClick}>
        {/* Current image */}
        <img
          src={room.images[currentImageIndex]}
          alt={`${room.title || room.roomType} - Image ${currentImageIndex + 1}`}
          className="object-cover w-full h-full rounded-t-lg"
          draggable={false}
        />

        {/* Multiple images indicator - simple overlay */}
        {room.images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <span>{room.images.length} photos</span>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
            </svg>
          </div>
        )}

        {/* Amenities overlay - top left */}
        <div className="absolute top-3 left-3 z-30 flex flex-wrap gap-1 max-w-[85%]">
          {(dynamicAmenities || room.amenities.slice(0, 3)).map((amenity) => (
            <span
              key={`${room.id}-${amenity}`}
              className="text-xs bg-white/90 backdrop-blur-sm border border-white/20 px-2 py-1 rounded-md text-gray-800 shadow-sm"
            >
              {amenity}
            </span>
          ))}
        </div>

        {/* Badges */}
        <RoomBadges
          hasDiscount={!!room.oldPrice && !selectedRoom?.id && !isBidActive}
          oldPrice={room.oldPrice}
          currentPrice={room.price}
          discountBadgeText={discountBadgeText}
          isSelected={selectedRoom?.id === room.id}
          selectedText={selectedText}
          isBidActive={isBidActive && selectedRoom?.id !== room.id}
          bidSubmittedText={bidSubmittedText}
        />
      </div>

      {/* Room Details */}
      <RoomDetails
        title={room.title}
        roomType={room.roomType}
        description={room.description}
      />

      {/* Room Pricing */}
      <RoomPricing
        price={room.price}
        oldPrice={room.oldPrice}
        currencySymbol={currencySymbol}
        nightText={nightText}
        isSelected={selectedRoom?.id === room.id}
        selectText={selectText}
        removeText={removeText}
        instantConfirmationText={instantConfirmationText}
        segmentDiscount={room.segmentDiscount}
        onSelect={handleSelectRoom}
      />

      {/* Additional Info */}
      <div className="px-4 pb-4">
        <p className="text-xs text-neutral-500 mt-2">{priceInfoText}</p>
      </div>

      {/* Price Slider - integrated within the card */}
      <div
        className={clsx(
          'overflow-hidden',
          // Apply transition only when expanding to make it smooth
          sliderVisible ? 'transition-all duration-500 ease-in-out max-h-96 opacity-100' : 'transition-none max-h-0 opacity-0'
        )}
      >
        <div className={clsx(
          "border-t border-gray-200 p-4 bg-gray-50 rounded-b-lg",
          sliderVisible ? 'opacity-100' : 'opacity-0'
        )}>
          <PriceSlider
            proposedPrice={proposedPrice}
            minPrice={minPrice}
            maxPrice={maxPrice}
            nightText={nightText}
            proposePriceText={proposePriceText}
            availabilityText={availabilityText}
            currencyText={currencyText}
            bidStatus={bidStatus}
            submittedPrice={submittedPrice}
            bidSubmittedText={bidSubmittedText}
            updateBidText={updateBidText}
            cancelBidText={cancelBidText}
            roomName={room.roomType}
            onPriceChange={setProposedPrice}
            onMakeOffer={makeOffer}
            onCancelBid={() => {
              if (onCancelBid) {
                onCancelBid(room.id)
              }
              resetBid()
            }}
          />
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        images={room.images}
        isOpen={isImageModalOpen}
        initialImageIndex={currentImageIndex}
        onClose={handleCloseModal}
        roomTitle={room.title || room.roomType}
      />
    </div>
  )
}

export default RoomCard
