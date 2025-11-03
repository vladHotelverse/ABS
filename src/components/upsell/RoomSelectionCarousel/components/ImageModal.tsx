'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight, Play, Rotate3DIcon } from 'lucide-react'
import type React from 'react'
import { useCallback, useEffect, useState } from 'react'
import Matterport from '@/components/multimedia/Matterport'
import Video from '@/components/multimedia/Video'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type { MediaItem } from '../types'
import { MediaType } from '../types'

interface ImageModalProps {
  images?: string[] // Deprecated: use mediaItems instead
  mediaItems?: MediaItem[]
  isOpen: boolean
  initialImageIndex: number
  onClose: () => void
  roomTitle: string
}

const isStandardImageType = (type: MediaItem['type']) =>
  typeof type === 'number' && (type === MediaType.Image || type === MediaType.Image180)

const isVideoType = (type: MediaItem['type']) => type === MediaType.Video
const isTourType = (type: MediaItem['type']) => type === MediaType.Image360

const getMediaTypeLabel = (type: MediaItem['type']) => {
  if (isStandardImageType(type)) return 'image'
  if (isVideoType(type)) return 'video'
  if (isTourType(type)) return '360 tour'
  return 'media'
}

const ImageModal: React.FC<ImageModalProps> = ({
  images,
  mediaItems,
  isOpen,
  initialImageIndex,
  onClose,
  roomTitle,
}) => {
  // Support backward compatibility: convert images array to mediaItems if needed
  const media: MediaItem[] =
    mediaItems || (images ? images.map((url) => ({ type: MediaType.Image, url })) : [])

  const [currentImageIndex, setCurrentImageIndex] = useState(initialImageIndex)
  const hasMedia = media && media.length > 0

  // Main carousel
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel({ loop: true })

  // Thumbnails carousel
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  })

  // Handle thumbnail click
  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return
      emblaMainApi.scrollTo(index)
    },
    [emblaMainApi, emblaThumbsApi]
  )

  // Sync main carousel selection with thumbnails
  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return
    const newIndex = emblaMainApi.selectedScrollSnap()
    setCurrentImageIndex(newIndex)
    emblaThumbsApi.scrollTo(newIndex)
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
        className="z-[101] flex h-full max-h-[100dvh] w-full max-w-[100dvw] flex-col gap-0 border-none bg-transparent p-0"
        hideClose={true}
      >
        {/* Hidden title for accessibility */}
        <DialogTitle className="sr-only">{roomTitle} Media Gallery</DialogTitle>
        <DialogDescription className="sr-only">
          Browse through {hasMedia ? media.length : 0} media {hasMedia && media.length === 1 ? 'item' : 'items'} for{' '}
          {roomTitle}. Use arrow keys or swipe to navigate.
        </DialogDescription>

        {/* Header */}
        <div className="absolute top-6 right-6 z-10 flex flex-shrink-0 items-center justify-end">
          <Button onClick={onClose} variant="outline" className="hover:cursor-pointer" aria-label="Close image modal">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        {/* Main carousel container */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Main media carousel */}
          <div className="relative min-h-0 flex-1 overflow-hidden">
            {/* Navigation Arrow Buttons */}
            {hasMedia && media.length > 1 && (
              <>
                <Button
                  size="icon"
                  className={cn(
                    '-translate-y-1/2 absolute top-1/2 z-30 rounded-full border border-white bg-black text-white shadow-lg backdrop-blur-sm hover:bg-background',
                    'transition-all duration-200 hover:scale-110',
                    'left-1 h-8 w-8 md:left-4 md:h-10 md:w-10'
                  )}
                  onClick={() => emblaMainApi?.scrollPrev()}
                  aria-label="Previous media"
                >
                  <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
                <Button
                  size="icon"
                  className={cn(
                    '-translate-y-1/2 absolute top-1/2 z-30 rounded-full border border-white bg-black text-white shadow-lg backdrop-blur-sm hover:bg-background',
                    'transition-all duration-200 hover:scale-110',
                    'right-1 h-8 w-8 md:right-4 md:h-10 md:w-10'
                  )}
                  onClick={() => emblaMainApi?.scrollNext()}
                  aria-label="Next media"
                >
                  <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </>
            )}

            <section
              className="h-full overflow-hidden"
              ref={emblaMainRef}
              style={{ cursor: 'grab' }}
              onMouseDown={(e) => {
                e.currentTarget.style.cursor = 'grabbing'
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.cursor = 'grab'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.cursor = 'grab'
              }}
              aria-label="Media carousel"
            >
              <div className="flex h-full touch-pan-y">
                {hasMedia ? (
                  media.map((item, index) => (
                    <div
                      key={`${String(item.type)}-${item.url}-${index}`}
                      className="flex h-full w-full flex-none items-center justify-center p-0 md:p-4"
                    >
                      {isStandardImageType(item.type) && (
                        <img
                          src={item.url}
                          alt={`${roomTitle} - ${index + 1} of ${media.length}`}
                          className="h-full select-none rounded-lg object-contain lg:w-full lg:object-cover"
                          draggable={false}
                        />
                      )}
                      {isVideoType(item.type) && (
                        <div className="h-full w-full">
                          <Video url={item.url} aspectRatio={null} className="h-full w-full" />
                        </div>
                      )}
                      {isTourType(item.type) && (
                        <div className="h-full w-full">
                          <Matterport url={item.url} aspectRatio={null} className="h-full w-full" />
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="flex h-full w-full flex-none items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <p>No media available</p>
                      <p className="text-sm">for {roomTitle}</p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Thumbnail carousel */}
          {hasMedia && media.length > 1 && (
            <div className="md:-translate-x-1/2 mt-4 flex-shrink-0 px-4 md:absolute md:bottom-4 md:left-1/2 md:z-40 md:w-auto md:px-0">
              <div
                className="overflow-x-auto overflow-y-hidden md:overflow-hidden md:rounded-lg md:bg-background/80 md:p-2 md:backdrop-blur-sm"
                ref={emblaThumbsRef}
              >
                <div className="flex w-full items-center justify-start gap-2 md:justify-center">
                  {media.map((item, index) => (
                    <div key={`${String(item.type)}-${item.url}-${index}`} className="flex-none">
                      <button
                        onClick={() => onThumbClick(index)}
                        className={cn(
                          'relative h-16 w-16 overflow-hidden rounded border-2 transition-all duration-200',
                          index === currentImageIndex
                            ? 'border-primary ring-2 ring-primary/20'
                            : 'border-border hover:border-ring'
                        )}
                        aria-label={`Go to ${getMediaTypeLabel(item.type)} ${index + 1}`}
                      >
                        {/* Thumbnail preview */}
                        {isStandardImageType(item.type) && (
                          <img
                            src={item.thumbnailUrl || item.url}
                            alt={`${roomTitle} - ${index + 1} of ${media.length}`}
                            className="h-full w-full object-cover"
                            draggable={false}
                          />
                        )}
                        {isVideoType(item.type) && (
                          <div className="flex h-full w-full items-center justify-center">
                            {/* Play button icon */}
                            <Play className="h-6 w-6 fill-white text-white drop-shadow-md" />
                          </div>
                        )}
                        {isTourType(item.type) && (
                          <div className="flex h-full w-full flex-col items-center justify-center">
                            {/* 360 view icon */}
                            <Rotate3DIcon className="h-6 w-6 text-black drop-shadow-md" />
                            <span>360</span>
                          </div>
                        )}

                        {/* Media type icon overlay */}
                        {isVideoType(item.type) && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24" strokeWidth={0}>
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        )}
                        {isTourType(item.type) && (
                          <div className="absolute top-0.5 right-0.5 rounded bg-black/60 px-1 py-0.5">
                            <span className="font-medium text-[10px] text-white">360°</span>
                          </div>
                        )}
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
