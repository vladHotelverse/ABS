'use client'

import type React from 'react'
import { useCallback } from 'react'
import HoverZoomImage from '@/components/upsell/RoomSelectionCarousel/components/HoverZoomImage'
import RoomBadges from '@/components/upsell/RoomSelectionCarousel/components/RoomBadges'
import type {
  MediaItem,
  RoomCardState,
  RoomCardTranslations,
  RoomOption,
} from '@/components/upsell/RoomSelectionCarousel/types'
import { MediaType } from '@/components/upsell/RoomSelectionCarousel/types'

const isStaticImageType = (type: MediaItem['type']) =>
  typeof type === 'number' && (type === MediaType.Image || type === MediaType.Image180)

export interface RoomImageSectionProps {
  room: RoomOption
  translations: RoomCardTranslations
  state: RoomCardState
  onImageClick: () => void
}

const RoomImageSection: React.FC<RoomImageSectionProps> = ({ room, translations, state, onImageClick }) => {
  const { selectedRoom } = state
  const { selectedText } = translations
  const currentImageIndex = 0 // For now, using first image

  // Get images from pre-flattened mediaItems
  const mediaItems = room.mediaItems || []
  const imageItems = mediaItems.filter((item) => isStaticImageType(item.type))
  const hasImages = imageItems.length > 0
  const imageCount = imageItems.length

  // Get the current image URL
  const currentImageUrl = imageItems[currentImageIndex]?.url || ''

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onImageClick()
        e.preventDefault()
      }
    },
    [onImageClick]
  )

  return (
    <button
      className="group relative cursor-zoom-in rounded-t-lg bg-muted"
      onClick={onImageClick}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Current image with hover zoom */}
      {hasImages && currentImageUrl ? (
        <HoverZoomImage
          src={currentImageUrl}
          alt={`${room.title || room.roomType} - ${currentImageIndex + 1} of ${imageCount}`}
          className="rounded-t-lg"
          draggable={false}
          enableHoverZoom={false}
        />
      ) : (
        <div className="flex aspect-[16/9] h-[80%] w-full items-center justify-center rounded-t-lg bg-muted text-muted-foreground">
          <span>No images available</span>
        </div>
      )}

      {/* Multiple images indicator */}
      {hasImages && imageCount > 1 && (
        <div className="absolute right-3 bottom-3 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-white text-xs">
          <span>{imageCount} photos</span>
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6"
            />
          </svg>
        </div>
      )}

      {/* Amenities overlay */}
      <div className="absolute top-3 left-3 z-30 flex max-w-[85%] flex-wrap gap-1">
        {(room.displayAmenities || []).map((amenity) => (
          <span
            key={`${room.id}-${amenity}`}
            className="rounded-md border border-border bg-background/90 px-2 py-1 text-foreground text-xs shadow-sm backdrop-blur-sm"
          >
            {amenity}
          </span>
        ))}
      </div>

      {/* Badges */}
      <RoomBadges
        hasDiscount={!!room.oldPrice && !selectedRoom?.id}
        oldPrice={room.oldPrice}
        currentPrice={room.price}
        isSelected={selectedRoom?.id === room.id}
        selectedText={selectedText}
      />
    </button>
  )
}

export default RoomImageSection
