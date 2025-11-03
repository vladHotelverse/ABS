'use client'

import type React from 'react'
import { useCallback } from 'react'
import HoverZoomImage from '@/components/upsell/RoomSelectionCarousel/components/HoverZoomImage'
import RoomBadges from '@/components/upsell/RoomSelectionCarousel/components/RoomBadges'
import type { RoomCardState, RoomCardTranslations, RoomOption } from '@/components/upsell/RoomSelectionCarousel/types'

export interface RoomImageSectionProps {
  room: RoomOption
  translations: RoomCardTranslations
  state: RoomCardState
  dynamicAmenities?: string[]
  onImageClick: () => void
  enableHoverZoom?: boolean
}

const RoomImageSection: React.FC<RoomImageSectionProps> = ({
  room,
  translations,
  state,
  dynamicAmenities,
  onImageClick,
}) => {
  const { selectedRoom } = state
  const { selectedText } = translations
  const currentImageIndex = 0 // For now, using first image

  // Get images from multimedia.images or fallback to room.images
  const multimediaImages = room.multimedia?.images
  const hasMultimediaImages = multimediaImages && multimediaImages.length > 0

  // For backward compatibility with simple string arrays
  const legacyImages = room.images ?? []
  const hasLegacyImages = legacyImages.length > 0

  const hasImages = hasMultimediaImages || hasLegacyImages
  const imageCount = hasMultimediaImages ? multimediaImages.length : legacyImages.length

  // Get the current image URL (prefer original from multimedia, fallback to legacy)
  let currentImageUrl = ''
  if (hasMultimediaImages) {
    currentImageUrl = multimediaImages[currentImageIndex]?.url || ''
  } else if (hasLegacyImages) {
    currentImageUrl = legacyImages[currentImageIndex] || ''
  }

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
          <span>No image available</span>
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
        {(dynamicAmenities || room.amenities.slice(0, 3)).map((amenity) => (
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
