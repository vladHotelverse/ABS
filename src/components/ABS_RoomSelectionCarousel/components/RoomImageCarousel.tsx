import type React from 'react'
import clsx from 'clsx'
import { useMemo } from 'react'

export interface RoomImageCarouselProps {
  images: string[]
  activeImageIndex: number
  title: string
  dynamicAmenities?: string[]
  roomId: string | number
  localImageDragState: {
    isDragging: boolean
    startX: number
    currentX: number
    deltaX: number
    startTime: number
  }
  imageDragHandlers: {
    onMouseDown: (e: React.MouseEvent) => void
    onTouchStart: (e: React.TouchEvent) => void
    onTouchMove: (e: React.TouchEvent) => void
    onTouchEnd: (e: React.TouchEvent) => void
    style: React.CSSProperties
  }
  onImageChange: (index: number) => void
  previousImageLabel: string
  nextImageLabel: string
  viewImageLabel: string
}

const RoomImageCarousel: React.FC<RoomImageCarouselProps> = ({
  images,
  activeImageIndex,
  title,
  dynamicAmenities = [],
  roomId,
  localImageDragState,
  imageDragHandlers,
  onImageChange,
  previousImageLabel,
  nextImageLabel,
  viewImageLabel,
}) => {
  const handleImageNavigation = (direction: 'prev' | 'next') => {
    const totalImages = images.length
    if (direction === 'prev') {
      const newIndex = activeImageIndex > 0 ? activeImageIndex - 1 : totalImages - 1
      onImageChange(newIndex)
    } else {
      const newIndex = (activeImageIndex + 1) % totalImages
      onImageChange(newIndex)
    }
  }

  return (
    <div 
      className="relative h-64 bg-neutral-100 group"
      {...imageDragHandlers}
      style={{
        ...imageDragHandlers.style,
        transform: localImageDragState.isDragging ? `translateX(${localImageDragState.deltaX * 0.5}px)` : undefined,
        transition: localImageDragState.isDragging ? 'none' : 'transform 0.3s ease-out',
      }}
    >
      <img src={images[activeImageIndex]} alt={title} className="object-cover w-full h-full rounded-t-lg" />
      
      {/* Amenities overlay - top left */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1 max-w-[85%]">
        {dynamicAmenities.slice(0, 3).map((amenity) => (
          <span
            key={`${roomId}-${amenity}`}
            className="text-xs bg-white/90 backdrop-blur-sm border border-white/20 px-2 py-1 rounded-md text-gray-800 shadow-sm"
          >
            {amenity}
          </span>
        ))}
      </div>

      {/* Image Navigation Arrows - only show if multiple images */}
      {images.length > 1 && (
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
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {images.map((_, imgIndex) => (
            <button
              key={`${roomId}-img-${imgIndex}`}
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
  )
}

export default RoomImageCarousel