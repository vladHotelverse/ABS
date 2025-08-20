import type React from 'react'
import clsx from 'clsx'
import { RoomCard, CarouselNavigation } from '../components'
import type { RoomCardProps } from '../types'
import type { CarouselState } from '../hooks/useCarouselState'

export interface MultiRoomLayoutProps {
  className?: string
  title?: string
  subtitle?: string
  roomCardPropsArray: RoomCardProps[]
  state: CarouselState
  dragHandlers: {
    onMouseDown: (e: React.MouseEvent) => void
    onTouchStart: (e: React.TouchEvent) => void
    onTouchMove: (e: React.TouchEvent) => void
    onTouchEnd: (e: React.TouchEvent) => void
    style: React.CSSProperties
  }
  onPrevSlide: () => void
  onNextSlide: () => void
  onSetActiveIndex: (index: number) => void
  navigationLabels: {
    previousRoom: string
    nextRoom: string
    previousRoomMobile: string
    nextRoomMobile: string
    goToRoom: string
  }
}

const MultiRoomLayout: React.FC<MultiRoomLayoutProps> = ({
  className,
  title,
  subtitle,
  roomCardPropsArray,
  state,
  dragHandlers,
  onPrevSlide,
  onNextSlide,
  onSetActiveIndex,
  navigationLabels,
}) => {
  return (
    <div className={clsx(className)}>
      {/* Title and Subtitle */}
      {(title || subtitle) && (
        <div className="mb-6 text-center">
          {title && <h2 className="text-2xl font-bold mb-2">{title}</h2>}
          {subtitle && <p className="text-neutral-600">{subtitle}</p>}
        </div>
      )}

      <div className="lg:col-span-2">
        {/* Slider Container with Visible Cards */}
        <div className="relative w-full overflow-visible h-full">
          {/* Main Carousel Area */}
          <div 
            className="w-full relative perspective-[1000px] h-[750px] overflow-hidden"
            {...dragHandlers}
            style={{
              ...dragHandlers.style,
              transform: state.dragState.isDragging ? `translateX(${state.dragState.deltaX * 0.3}px)` : undefined,
              transition: state.dragState.isDragging ? 'none' : 'transform 0.3s ease-out',
            }}
          >
            {roomCardPropsArray.map((roomCardProps, index) => {
              // Calculate if this card should be visible (previous, current, or next)
              const prevIndex = (state.activeIndex - 1 + roomCardPropsArray.length) % roomCardPropsArray.length
              const nextIndex = (state.activeIndex + 1) % roomCardPropsArray.length
              
              // Only show previous, current, and next cards
              const isVisible = index === state.activeIndex || index === prevIndex || index === nextIndex
              
              if (!isVisible) {
                return null
              }
              
              return (
                <div
                  key={roomCardProps.room.id}
                  className={clsx('w-full absolute transition-all duration-500 ease-in-out', {
                    'left-0 z-10 sm:w-1/2 sm:left-1/4': state.activeIndex === index,
                    'left-[-100%] z-5 opacity-70 sm:w-1/2 sm:left-[-30%]': index === prevIndex,
                    'left-[100%] z-5 opacity-70 sm:w-1/2 sm:left-[80%]': index === nextIndex,
                  })}
                >
                  <RoomCard {...roomCardProps} />
                </div>
              )
            })}
          </div>

          {/* Desktop Carousel Navigation - Only visible on Desktop */}
          <CarouselNavigation
            onPrev={onPrevSlide}
            onNext={onNextSlide}
            previousLabel={navigationLabels.previousRoom}
            nextLabel={navigationLabels.nextRoom}
          />
        </div>

        {/* Mobile/Tablet Carousel Controls */}
        <div className="lg:hidden flex justify-center items-center gap-4 mt-4">
          <button
            onClick={onPrevSlide}
            className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors duration-200"
            aria-label={navigationLabels.previousRoomMobile}
          >
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="flex gap-2">
            {roomCardPropsArray.map((roomCardProps, index) => (
              <button
                key={`${roomCardProps.room.id}-indicator`}
                onClick={() => onSetActiveIndex(index)}
                className={clsx('h-2 w-2 rounded-full transition-all duration-200', {
                  'bg-black': state.activeIndex === index,
                  'bg-neutral-300': state.activeIndex !== index,
                })}
                aria-label={navigationLabels.goToRoom.replace('{index}', (index + 1).toString())}
              />
            ))}
          </div>

          <button
            onClick={onNextSlide}
            className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors duration-200"
            aria-label={navigationLabels.nextRoomMobile}
          >
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default MultiRoomLayout