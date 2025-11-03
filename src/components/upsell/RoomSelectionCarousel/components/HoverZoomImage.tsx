import type React from 'react'
import { useCursorZoom } from '@/components/upsell/RoomSelectionCarousel/hooks/useCursorZoom'
import { cn } from '@/lib/utils'
import CursorZoomOverlay from './CursorZoomOverlay'

export interface HoverZoomImageProps {
  src: string
  alt: string
  className?: string
  onClick?: () => void
  onKeyDown?: (e: React.KeyboardEvent) => void
  draggable?: boolean
  enableHoverZoom?: boolean
}

const HoverZoomImage: React.FC<HoverZoomImageProps> = ({
  src,
  alt,
  className,
  onClick,
  onKeyDown,
  draggable = false,
  enableHoverZoom = false,
}) => {
  const {
    isVisible,
    sourceRect,
    mousePosition,
    zoomLevel,
    zoomSize,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseMove,
  } = useCursorZoom({
    enabled: enableHoverZoom,
    delay: 150, // Quick response for cursor following
    zoomLevel: 2,
    // zoomSize will default to 50% of screen size from the hook
  })

  return (
    <>
      <div className="aspect-[16/9] w-full overflow-hidden">
        <img
          src={src}
          alt={alt}
          className={cn('h-full w-full object-cover transition-transform duration-300 hover:scale-110', className)}
          onClick={onClick}
          onKeyDown={onKeyDown}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          draggable={draggable}
        />
      </div>

      {/* Cursor-following zoom overlay */}
      {enableHoverZoom && (
        <CursorZoomOverlay
          src={src}
          alt={alt}
          isVisible={isVisible}
          mousePosition={mousePosition}
          sourceRect={sourceRect}
          zoomLevel={zoomLevel}
          zoomSize={zoomSize}
        />
      )}
    </>
  )
}

export default HoverZoomImage
