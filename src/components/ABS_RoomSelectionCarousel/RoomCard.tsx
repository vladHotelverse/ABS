import clsx from 'clsx'
import type React from 'react'
import { useMemo, useCallback, useState, useRef, useEffect } from 'react'
import type { RoomOption } from './types'
import { UiTooltip, UiTooltipContent, UiTooltipTrigger, TooltipProvider } from '../ui/tooltip'

interface RoomCardProps {
  room: RoomOption
  discountBadgeText: string
  nightText: string
  learnMoreText: string
  priceInfoText: string
  selectedText: string
  selectText: string
  selectedRoom: RoomOption | null
  onSelectRoom: (room: RoomOption | null) => void
  activeImageIndex: number
  onImageChange: (newImageIndex: number) => void
  currencySymbol?: string
  onLearnMore?: (room: RoomOption) => void
  // Translation props for image navigation
  previousImageLabel?: string
  nextImageLabel?: string
  viewImageLabel?: string // Template: 'View image {index}'
  // Price slider props
  isActive?: boolean
  showPriceSlider?: boolean
  priceSliderElement?: React.ReactNode
}

const RoomCard: React.FC<RoomCardProps> = ({
  room,
  discountBadgeText,
  nightText,
  learnMoreText,
  priceInfoText,
  selectedText,
  selectText,
  selectedRoom,
  onSelectRoom,
  activeImageIndex,
  onImageChange,
  currencySymbol = '€',
  onLearnMore,
  previousImageLabel = 'Previous image',
  nextImageLabel = 'Next image',
  viewImageLabel = 'View image {index}',
  isActive = false,
  showPriceSlider = false,
  priceSliderElement,
}) => {
  // State for checking if description is truncated
  const [isDescriptionTruncated, setIsDescriptionTruncated] = useState(false)
  const descriptionRef = useRef<HTMLParagraphElement>(null)

  // Check if description needs truncation
  useEffect(() => {
    if (descriptionRef.current) {
      const element = descriptionRef.current
      setIsDescriptionTruncated(element.scrollHeight > element.clientHeight)
    }
  }, [room.description])
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

  const handleLearnMore = useCallback(() => {
    if (onLearnMore) {
      onLearnMore(room)
    } else {
      // Default behavior - could open a modal, navigate to room details, etc.
      console.log('Learn more about room:', room.title || room.roomType)
    }
  }, [onLearnMore, room])

  const handleSelectRoom = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      // If the room is already selected, deselect it; otherwise, select it
      const isCurrentlySelected = selectedRoom?.id === room.id
      onSelectRoom(isCurrentlySelected ? null : room)
    },
    [onSelectRoom, room, selectedRoom]
  )

  return (
    <div className={clsx(
      "relative rounded-lg overflow-visible md:shadow-sm max-w-lg transition-all duration-300",
      isActive && showPriceSlider ? "bg-gray-50 ring-2 ring-gray-200" : "bg-white"
    )}>
      {/* Discount Badge */}
      {room.oldPrice && (
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

      {/* Room Image Carousel */}
      <div className="relative h-64 bg-neutral-100 group">
        <img src={room.images[activeImageIndex]} alt={room.title || room.roomType} className="object-cover w-full h-full" />

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

        {/* Amenities */}
        <div className="flex flex-nowrap gap-2 mb-2 w-full overflow-auto">
          {room.amenities.map((amenity) => (
            <span
              key={`${room.id}-${amenity}`}
              className="text-xs border border-neutral-200 px-3 py-1 rounded-md text-nowrap"
            >
              {amenity}
            </span>
          ))}
        </div>

        {/* Price Display */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl font-bold">{`${currencySymbol}${room.price}`}</span>
          {room.oldPrice && (
            <span className="text-neutral-500 line-through text-sm">{`${currencySymbol}${room.oldPrice}`}</span>
          )}
          <span className="text-sm text-neutral-500">{nightText}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mt-2">
          <button
            className={clsx(
              'px-6 py-2.5 text-sm font-medium rounded-md uppercase tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black',
              {
                'bg-green-600 text-white shadow-md': selectedRoom?.id === room.id,
                'bg-black text-white hover:bg-neutral-900': selectedRoom?.id !== room.id,
              }
            )}
            onClick={handleSelectRoom}
          >
            <span>{selectedRoom?.id === room.id ? selectedText : selectText}</span>
          </button>

          <button
            className="text-sm text-neutral-500 underline hover:text-neutral-700 transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation()
              handleLearnMore()
            }}
          >
            {learnMoreText}
          </button>
        </div>

        {/* Additional Info */}
        <p className="text-xs text-neutral-500 mt-2">{priceInfoText}</p>
      </div>

      {/* Price Slider - integrated within the card */}
      {isActive && showPriceSlider && priceSliderElement && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          {priceSliderElement}
        </div>
      )}
    </div>
  )
}

export default RoomCard
