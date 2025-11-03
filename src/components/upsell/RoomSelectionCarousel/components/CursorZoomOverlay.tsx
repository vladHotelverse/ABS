import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

export interface CursorZoomOverlayProps {
  src: string
  alt: string
  isVisible: boolean
  mousePosition: { x: number; y: number }
  sourceRect?: DOMRect | null
  zoomLevel?: number
  zoomSize?: { width: number; height: number }
  className?: string
}

const CursorZoomOverlay: React.FC<CursorZoomOverlayProps> = ({
  src,
  alt,
  isVisible,
  mousePosition,
  sourceRect,
  zoomLevel = 2,
  zoomSize = { width: Math.min(window.innerWidth * 0.5, 600), height: Math.min(window.innerHeight * 0.5, 400) },
  className,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const imageRef = useRef<HTMLImageElement>(null)

  // Calculate zoom window position with intelligent positioning for larger windows
  useEffect(() => {
    if (!isVisible) return

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const offset = 30

    // For larger zoom windows, prefer side-by-side positioning
    let x = mousePosition.x + offset
    let y = mousePosition.y - zoomSize.height / 2 // Center vertically relative to cursor

    // Check if there's space on the right
    if (x + zoomSize.width > viewportWidth) {
      // Try left side
      x = mousePosition.x - zoomSize.width - offset
    }

    // If still doesn't fit, try above/below positioning
    if (x < 0) {
      x = Math.max(20, mousePosition.x - zoomSize.width / 2) // Center horizontally

      // Try below first
      y = mousePosition.y + offset
      if (y + zoomSize.height > viewportHeight) {
        // Try above
        y = mousePosition.y - zoomSize.height - offset
      }
    }

    // Final bounds check - ensure it stays within viewport with some margin
    x = Math.max(20, Math.min(x, viewportWidth - zoomSize.width - 20))
    y = Math.max(20, Math.min(y, viewportHeight - zoomSize.height - 20))

    setZoomPosition({ x, y })
  }, [mousePosition, isVisible, zoomSize])

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight })
    setImageLoaded(true)
  }

  // Calculate which part of the image to show based on cursor position relative to source image
  const getImageTransform = () => {
    if (!sourceRect || !imageLoaded || !imageDimensions.width || !imageDimensions.height) {
      return { backgroundPosition: '50% 50%', backgroundSize: `${zoomLevel * 100}%` }
    }

    // Calculate cursor position relative to the source image (0-1 range)
    const relativeX = Math.max(0, Math.min(1, (mousePosition.x - sourceRect.left) / sourceRect.width))
    const relativeY = Math.max(0, Math.min(1, (mousePosition.y - sourceRect.top) / sourceRect.height))

    // Convert to percentage for background-position
    const backgroundX = relativeX * 100
    const backgroundY = relativeY * 100

    return {
      backgroundPosition: `${backgroundX}% ${backgroundY}%`,
      backgroundSize: `${zoomLevel * 100}%`,
    }
  }

  if (!isVisible) return null

  const transform = getImageTransform()

  const zoomElement = (
    <div
      className={cn(
        'pointer-events-none fixed z-[10000] overflow-hidden rounded-lg border-2 border-white bg-white shadow-2xl',
        'transition-opacity duration-200 ease-out',
        'motion-reduce:transition-none',
        imageLoaded ? 'opacity-100' : 'opacity-0',
        className
      )}
      style={{
        left: zoomPosition.x,
        top: zoomPosition.y,
        width: zoomSize.width,
        height: zoomSize.height,
      }}
    >
      {/* Zoomed image */}
      <div
        className="h-full w-full"
        style={{
          backgroundImage: `url(${src})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: transform.backgroundPosition,
          backgroundSize: transform.backgroundSize,
        }}
      />

      {/* Loading state */}
      {!imageLoaded && (
        <div className="absolute inset-0 flex animate-pulse items-center justify-center bg-gray-100">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
        </div>
      )}

      {/* Hidden image for loading detection */}
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className="absolute h-0 w-0 opacity-0"
        onLoad={handleImageLoad}
        draggable={false}
      />
    </div>
  )

  // Render using portal to append to body and avoid z-index issues
  return createPortal(zoomElement, document.body)
}

export default CursorZoomOverlay
