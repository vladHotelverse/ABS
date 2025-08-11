import clsx from 'clsx'
import { Star, Tag } from 'lucide-react'
import type React from 'react'
import { useMemo, useCallback, useState, useRef, useEffect } from 'react'
import { PriceSlider } from './components'
import { useSlider } from './hooks'
import { UiButton } from '../ui/button'
import { UiTooltip, UiTooltipContent, UiTooltipTrigger, TooltipProvider } from '../ui/tooltip'
import { SegmentBadge } from '../ui/segment-badge'
import type { RoomOption } from './types'

interface RoomCardProps {
  room: RoomOption
  discountBadgeText: string
  nightText: string
  learnMoreText: string
  priceInfoText: string
  selectedText: string
  selectText: string
  removeText: string
  selectedRoom: RoomOption | null
  onSelectRoom: (room: RoomOption | null) => void
  activeImageIndex: number
  onImageChange: (newImageIndex: number) => void
  currencySymbol?: string
  onLearnMore?: (room: RoomOption) => void
  instantConfirmationText?: string
  activeBid?: {
    roomId: string | number
    bidAmount: number
    status: 'pending' | 'submitted' | 'accepted' | 'rejected'
  }
  bidSubmittedText?: string
  // Translation props for image navigation
  previousImageLabel?: string
  nextImageLabel?: string
  viewImageLabel?: string // Template: 'View image {index}'
  // Price slider props
  isActive?: boolean
  showPriceSlider?: boolean
  minPrice?: number
  onMakeOffer?: (price: number, room: RoomOption) => void
  onCancelBid?: (roomId: string) => void
  proposePriceText?: string
  availabilityText?: string
  currencyText?: string
  offerMadeText?: string
  updateBidText?: string
  cancelBidText?: string
  makeOfferText?: string
  // Dynamic amenities props
  dynamicAmenities?: string[]
  // Total price text
  totalPriceText?: string
  roomIndex?: number
}

const RoomCard: React.FC<RoomCardProps> = ({
  room,
  discountBadgeText,
  nightText,
  learnMoreText: _learnMoreText,
  priceInfoText,
  selectedText,
  selectText,
  removeText,
  selectedRoom,
  onSelectRoom,
  activeImageIndex,
  onImageChange,
  currencySymbol = '€',
  onLearnMore: _onLearnMore,
  instantConfirmationText = 'Instant Confirmation',
  activeBid,
  bidSubmittedText = 'Bid Submitted',
  previousImageLabel = 'Previous image',
  nextImageLabel = 'Next image',
  viewImageLabel = 'View image {index}',
  isActive = false,
  showPriceSlider = false,
  minPrice = 10,
  onMakeOffer,
  onCancelBid,
  proposePriceText,
  availabilityText,
  currencyText,
  offerMadeText,
  updateBidText,
  cancelBidText,
  makeOfferText: _makeOfferText,
  dynamicAmenities,
}) => {
  const isBidActive = activeBid?.roomId === room.id
  // State for checking if description is truncated
  const [isDescriptionTruncated, setIsDescriptionTruncated] = useState(false)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  
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

  // Check if description needs truncation
  useEffect(() => {
    if (descriptionRef.current) {
      const element = descriptionRef.current
      setIsDescriptionTruncated(element.scrollHeight > element.clientHeight)
    }
  }, [room.description])
  
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
    (e: React.MouseEvent) => {
      e.stopPropagation()
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
        isActive && showPriceSlider ? 'bg-gray-50 ring-2 ring-gray-200' : 'bg-white',
        {
          'border-2 border-green-300 bg-green-50/30': selectedRoom?.id === room.id,
          'border-2 border-blue-300 bg-blue-50/30': isBidActive && selectedRoom?.id !== room.id,
          'border border-transparent': selectedRoom?.id !== room.id && !isBidActive,
        }
      )}
    >
      {/* Discount Badge */}
      {room.oldPrice && !selectedRoom?.id && !isBidActive && (
        <div className="absolute top-3 right-3 bg-black text-white py-1 px-2 rounded text-xs font-bold z-10">
          <span>
            {useMemo(() => {
              if (!room.oldPrice || room.oldPrice === 0) return ''
              const discountPercentage = Math.round((1 - room.price / room.oldPrice) * 100)
              return discountBadgeText.includes('{percentage}')
                ? discountBadgeText.replace('{percentage}', discountPercentage.toString())
                : `${discountBadgeText}${discountPercentage}%`
            }, [discountBadgeText, room.price, room.oldPrice])}
          </span>
        </div>
      )}

      {/* Bid Submitted Badge */}
      {isBidActive && selectedRoom?.id !== room.id && (
        <div className="absolute top-2 left-2 z-10 bg-blue-600 text-white text-xs flex items-center gap-1 py-1 px-2 rounded">
          <Tag className="h-3 w-3" />
          <span>{bidSubmittedText}</span>
        </div>
      )}

      {/* Selected Badge */}
      {selectedRoom?.id === room.id && (
        <div className="absolute top-2 left-2 z-10 bg-green-600 text-white text-xs flex items-center gap-1 py-1 px-2 rounded">
          <Star className="h-3 w-3" />
          <span>{selectedText}</span>
        </div>
      )}

      {/* Room Image Carousel */}
      <div 
        className="relative h-64 bg-neutral-100 group"
        {...imageDragHandlers}
        style={{
          ...imageDragHandlers.style,
          transform: localImageDragState.isDragging ? `translateX(${localImageDragState.deltaX * 0.5}px)` : undefined,
          transition: localImageDragState.isDragging ? 'none' : 'transform 0.3s ease-out',
        }}
      >
        <img src={room.images[activeImageIndex]} alt={room.title || room.roomType} className="object-cover w-full h-full" />
        
        {/* Amenities overlay - top left */}
        <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1 max-w-[85%]">
          {(dynamicAmenities || room.amenities.slice(0, 3)).map((amenity) => (
            <span
              key={`${room.id}-${amenity}`}
              className="text-xs bg-white/90 backdrop-blur-sm border border-white/20 px-2 py-1 rounded-md text-gray-800 shadow-sm"
            >
              {amenity}
            </span>
          ))}
        </div>

        {/* Image Navigation Arrows - only show if multiple images */}
        {room.images.length > 1 && (
          <>
            {/* Previous Image */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleImageNavigation('prev')
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 text-white rounded-full p-1 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
              aria-label={previousImageLabel}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Next Image */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleImageNavigation('next')
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 text-white rounded-full p-1 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
              aria-label={nextImageLabel}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        )}

        {/* Image Indicators */}
        {room.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {room.images.map((_, imgIndex) => (
              <button
                key={`${room.id}-img-${imgIndex}`}
                className={clsx('block h-2 w-2 rounded-full transition-colors duration-200', {
                  'bg-white': activeImageIndex === imgIndex,
                  'bg-white/50': activeImageIndex !== imgIndex,
                })}
                onClick={(e) => {
                  e.stopPropagation()
                  onImageChange(imgIndex)
                }}
                aria-label={viewImageLabel.replace('{index}', (imgIndex + 1).toString())}
              />
            ))}
          </div>
        )}
      </div>

      {/* Room Details */}
      <div className="p-4">
        {room.title && (
          <h3 className="text-xl font-bold mb-1">{room.title}</h3>
        )}
        <h4 className={clsx('font-medium mb-1 text-neutral-600', {
          'text-base': !room.title,
          'text-sm': room.title
        })}>{room.roomType}</h4>
        <div className="mb-2">
          <TooltipProvider>
            <UiTooltip>
              <UiTooltipTrigger asChild>
                <p
                  ref={descriptionRef}
                  className="text-sm min-h-10 overflow-hidden line-clamp-2 cursor-help"
                  style={{ maxHeight: '2.5rem' }}
                >
                  {room.description}
                </p>
              </UiTooltipTrigger>
              {isDescriptionTruncated && (
                <UiTooltipContent className="max-w-xs">
                  <p className="text-sm">{room.description}</p>
                </UiTooltipContent>
              )}
            </UiTooltip>
          </TooltipProvider>
        </div>


        {/* Action Buttons */}
        <div className="flex items-start justify-between gap-4 mt-2">
          <div className='flex flex-col'>
            {/* Price Display */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-3xl font-bold">{`${currencySymbol}${room.price}`}</span>
              {room.oldPrice && (
                <span className="text-neutral-500 line-through text-sm">{`${currencySymbol}${room.oldPrice}`}</span>
              )}
              <span className="text-base text-neutral-500">{nightText}</span>
              {/* Segment Badge */}
              {room.segmentDiscount && (
                <SegmentBadge segmentDiscount={room.segmentDiscount} />
              )}
            </div>
            
            {/* Total Price Display */}
            {/* {nights > 1 && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-base font-semibold text-neutral-700">{`${currencySymbol}${totalPrice}`}</span>
                {totalOldPrice && (
                  <span className="text-neutral-400 line-through text-sm">{`${currencySymbol}${totalOldPrice}`}</span>
                )}
                <span className="text-sm text-neutral-500">{totalPriceText}</span>
              </div>
            )} */}
          </div>
          <div className="flex flex-col items-end">
            <UiButton
              variant={selectedRoom?.id === room.id ? 'destructive' : 'black'}
              className="w-fit uppercase tracking-wide"
              onClick={handleSelectRoom}
            >
              <span>{selectedRoom?.id === room.id ? removeText : selectText}</span>
            </UiButton>
            {/* Instant Confirmation - positioned below the button */}
            <span className="text-xs text-green-600 font-medium mt-2">{instantConfirmationText}</span>
          </div>
        </div>

        {/* Additional Info */}
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
