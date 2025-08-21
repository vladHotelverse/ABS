import React, { useCallback, useEffect, useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import clsx from 'clsx'

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

  // Update current image when modal opens with new initial index
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(initialImageIndex)
    }
  }, [isOpen, initialImageIndex])

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goToNext()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const goToPrevious = useCallback(() => {
    setCurrentImageIndex(prev => 
      prev === 0 ? images.length - 1 : prev - 1
    )
  }, [images.length])

  const goToNext = useCallback(() => {
    setCurrentImageIndex(prev => 
      prev === images.length - 1 ? 0 : prev + 1
    )
  }, [images.length])

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }, [onClose])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
        aria-label="Close image modal"
      >
        <X size={24} />
      </button>

      {/* Image container */}
      <div className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center">
        <img
          src={images[currentImageIndex]}
          alt={`${roomTitle} - Image ${currentImageIndex + 1}`}
          className="max-w-full max-h-full object-contain"
          draggable={false}
        />

        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Image indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={clsx(
                  'w-2 h-2 rounded-full transition-colors',
                  index === currentImageIndex 
                    ? 'bg-white' 
                    : 'bg-white/40 hover:bg-white/60'
                )}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentImageIndex + 1} / {images.length}
        </div>
      )}
    </div>
  )
}

export default ImageModal