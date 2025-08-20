import clsx from 'clsx'
import type React from 'react'
import { useMemo, useCallback, useState, useEffect } from 'react'
import { PriceSlider } from './components'
import { useSlider } from './hooks'
import type { RoomOption } from './types'

// Import subcomponents
import RoomImageCarousel from './components/RoomImageCarousel'
import RoomBadges from './components/RoomBadges'
import RoomDetails from './components/RoomDetails'
import RoomPricing from './components/RoomPricing'

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
    previousImageLabel = 'Previous image',
    nextImageLabel = 'Next image',
    viewImageLabel = 'View image {index}',
    proposePriceText,
    availabilityText,
    currencyText,
    offerMadeText,
    updateBidText,
    cancelBidText,
  } = translations

  const {
    onSelectRoom,
    onImageChange,
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
    activeImageIndex,
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
  // Memoized handlers
  const handleImageNavigation = useCallback(
    (direction: 'prev' | 'next') => {
      const totalImages = room.images.length
      if (direction === 'prev') {
        const newIndex = activeImageIndex > 0 ? activeImageIndex - 1 : totalImages - 1
        onImageChange(newIndex)
      } else {
        const newIndex = (activeImageIndex + 1) % totalImages
        onImageChange(newIndex)
      }
    },
    [room.images.length, activeImageIndex, onImageChange]
  )


  const handleSelectRoom = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation()
      // If the room is already selected, deselect it; otherwise, select it
      const isCurrentlySelected = selectedRoom?.id === room.id
      onSelectRoom(isCurrentlySelected ? null : room)
    },
    [onSelectRoom, room, selectedRoom]
  )

  // Image drag handlers using separate local state
  const [localImageDragState, setLocalImageDragState] = useState({
    isDragging: false,
    startX: 0,
    currentX: 0,
    deltaX: 0,
    startTime: 0,
  })

  // Create separate drag handlers specifically for image navigation
  const imageDragHandlers = useMemo(() => ({
    onMouseDown: (e: React.MouseEvent) => {
      if (room.images.length <= 1) return
      e.preventDefault()
      e.stopPropagation() // Prevent main carousel from responding
      
      const startX = e.clientX
      const startTime = Date.now()
      setLocalImageDragState({
        isDragging: true,
        startX,
        currentX: startX,
        deltaX: 0,
        startTime,
      })

      const handleMouseMove = (moveE: MouseEvent) => {
        const currentX = moveE.clientX
        const deltaX = currentX - startX
        setLocalImageDragState(prev => ({
          ...prev,
          currentX,
          deltaX,
        }))
      }

      const handleMouseUp = () => {
        setLocalImageDragState(currentState => {
          const duration = Date.now() - startTime
          const velocity = Math.abs(currentState.deltaX) / Math.max(duration, 1)
          
          // Navigation thresholds
          const DRAG_DISTANCE_THRESHOLD = 50
          const DRAG_VELOCITY_THRESHOLD = 0.5
          
          const shouldNavigate = Math.abs(currentState.deltaX) > DRAG_DISTANCE_THRESHOLD || velocity > DRAG_VELOCITY_THRESHOLD
          
          if (shouldNavigate && Math.abs(currentState.deltaX) > 10) {
            if (currentState.deltaX < 0) {
              // Swipe left - next image
              handleImageNavigation('next')
            } else {
              // Swipe right - previous image  
              handleImageNavigation('prev')
            }
          }
          
          return {
            isDragging: false,
            startX: 0,
            currentX: 0,
            deltaX: 0,
            startTime: 0,
          }
        })
        
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    onTouchStart: (e: React.TouchEvent) => {
      if (room.images.length <= 1) return
      e.stopPropagation() // Prevent main carousel from responding
      
      const touch = e.touches[0]
      if (!touch) return
      
      const startX = touch.clientX
      const startTime = Date.now()
      setLocalImageDragState({
        isDragging: true,
        startX,
        currentX: startX,
        deltaX: 0,
        startTime,
      })
    },
    onTouchMove: (e: React.TouchEvent) => {
      if (!localImageDragState.isDragging || room.images.length <= 1) return
      e.stopPropagation() // Prevent main carousel from responding
      
      const touch = e.touches[0]
      if (!touch) return
      
      const currentX = touch.clientX
      const deltaX = currentX - localImageDragState.startX
      setLocalImageDragState(prev => ({
        ...prev,
        currentX,
        deltaX,
      }))
    },
    onTouchEnd: (e: React.TouchEvent) => {
      e.stopPropagation() // Prevent main carousel from responding
      
      setLocalImageDragState(currentState => {
        if (!currentState.isDragging) return currentState
        
        const duration = Date.now() - currentState.startTime
        const velocity = Math.abs(currentState.deltaX) / Math.max(duration, 1)
        
        // Navigation thresholds
        const DRAG_DISTANCE_THRESHOLD = 50
        const DRAG_VELOCITY_THRESHOLD = 0.5
        
        const shouldNavigate = Math.abs(currentState.deltaX) > DRAG_DISTANCE_THRESHOLD || velocity > DRAG_VELOCITY_THRESHOLD
        
        if (shouldNavigate && Math.abs(currentState.deltaX) > 10) {
          if (currentState.deltaX < 0) {
            // Swipe left - next image
            handleImageNavigation('next')
          } else {
            // Swipe right - previous image
            handleImageNavigation('prev')
          }
        }
        
        return {
          isDragging: false,
          startX: 0,
          currentX: 0,
          deltaX: 0,
          startTime: 0,
        }
      })
    },
    style: {
      touchAction: room.images.length <= 1 ? 'auto' : 'none',
      userSelect: room.images.length <= 1 ? 'auto' : 'none',
      cursor: room.images.length <= 1 ? 'default' : 'grab',
    } as React.CSSProperties,
  }), [room.images.length, localImageDragState, handleImageNavigation])

  return (
    <div
      className={clsx(
        'relative rounded-lg overflow-visible md:shadow-sm max-w-lg transition-all duration-300',
        isActive && showPriceSlider ? 'bg-gray-50 md:ring-2 ring-gray-200' : 'bg-white',
        {
          'border-2 border-green-300 bg-green-50/30': selectedRoom?.id === room.id,
          'border-2 border-blue-300 bg-blue-50/30': isBidActive && selectedRoom?.id !== room.id,
          'border border-transparent': selectedRoom?.id !== room.id && !isBidActive,
        }
      )}
    >
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

      {/* Room Image Carousel */}
      <RoomImageCarousel
        images={room.images}
        activeImageIndex={activeImageIndex}
        title={room.title || room.roomType}
        dynamicAmenities={dynamicAmenities || room.amenities.slice(0, 3)}
        roomId={room.id}
        localImageDragState={localImageDragState}
        imageDragHandlers={imageDragHandlers}
        onImageChange={onImageChange}
        previousImageLabel={previousImageLabel}
        nextImageLabel={nextImageLabel}
        viewImageLabel={viewImageLabel}
      />

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
        selectedText={selectedText}
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
    </div>
  )
}

export default RoomCard
