import React, { useEffect, useState, useCallback } from 'react'
import clsx from 'clsx'
import useEmblaCarousel from 'embla-carousel-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'

interface ImageModalProps {
  images: string[]
  isOpen: boolean
  initialImageIndex: number
  onClose: () => void
  roomTitle: string
}

const ImageModal: React.FC<ImageModalProps> = ({
  images,
  isOpen,
  initialImageIndex,
  onClose,
  roomTitle,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(initialImageIndex)

  // Main carousel
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel({ loop: true })

  // Thumbnails carousel
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true
  })

  // Handle thumbnail click
  const onThumbClick = useCallback((index: number) => {
    if (!emblaMainApi || !emblaThumbsApi) return
    emblaMainApi.scrollTo(index)
  }, [emblaMainApi, emblaThumbsApi])

  // Sync main carousel selection with thumbnails
  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return
    setCurrentImageIndex(emblaMainApi.selectedScrollSnap())
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap())
  }, [emblaMainApi, emblaThumbsApi])

  // Initialize carousel when modal opens
  useEffect(() => {
    if (isOpen && emblaMainApi) {
      emblaMainApi.scrollTo(initialImageIndex)
      setCurrentImageIndex(initialImageIndex)
    }
  }, [isOpen, initialImageIndex, emblaMainApi])

  // Setup event listeners for main carousel
  useEffect(() => {
    if (!emblaMainApi) return
    onSelect()
    emblaMainApi.on('select', onSelect).on('reInit', onSelect)

    return () => {
      emblaMainApi.off('select', onSelect).off('reInit', onSelect)
    }
  }, [emblaMainApi, onSelect])

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        emblaMainApi?.scrollPrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        emblaMainApi?.scrollNext()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, emblaMainApi])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-[95vw] max-h-[95vh] w-full h-full bg-white border-none p-6 gap-0 z-[101]"
        hideClose={true}
      >
        {/* Hidden title for accessibility */}
        <DialogTitle className="sr-only">
          {roomTitle} Image Gallery
        </DialogTitle>

        {/* Header */}
        <div className="flex items-center justify-end mb-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close image modal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Main carousel container */}
        <div className="flex-1 flex flex-col">
          {/* Main image carousel */}
          <div className="flex-1 mb-4 relative">
            <div
              className="h-full overflow-hidden rounded-lg"
              ref={emblaMainRef}
              style={{ cursor: 'grab' }}
              onMouseDown={(e) => e.currentTarget.style.cursor = 'grabbing'}
              onMouseUp={(e) => e.currentTarget.style.cursor = 'grab'}
              onMouseLeave={(e) => e.currentTarget.style.cursor = 'grab'}
            >
              <div className="flex h-full touch-pan-y">
                {images.map((image, index) => (
                  <div key={index} className="flex-none w-full h-full flex items-center justify-center">
                    <img
                      src={image}
                      alt={`${roomTitle} - Image ${index + 1}`}
                      className="max-w-full max-h-full object-contain select-none rounded"
                      draggable={false}
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Thumbnail carousel */}
          {images.length > 1 && (
            <div className="mt-4">
              <div className="overflow-hidden" ref={emblaThumbsRef}>
                <div className="flex items-center justify-center w-full gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="flex-none">
                      <button
                        onClick={() => onThumbClick(index)}
                        className={clsx(
                          "w-16 h-16 rounded overflow-hidden border-2 transition-all duration-200",
                          index === currentImageIndex
                            ? 'border-blue-500 ring-2 ring-blue-200'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                        aria-label={`Go to image ${index + 1}`}
                      >
                        <img
                          src={image}
                          alt={`${roomTitle} thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                          draggable={false}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ImageModal