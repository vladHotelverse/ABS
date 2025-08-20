import type React from 'react'
import clsx from 'clsx'
import { RoomCard } from '../components'
import type { RoomCardProps } from '../types'
import type { CarouselState } from '../hooks/useCarouselState'

export interface TwoRoomLayoutProps {
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
    previousRoomMobile: string
    nextRoomMobile: string
    goToRoom: string
  }
}

const TwoRoomLayout: React.FC<TwoRoomLayoutProps> = ({
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

      {/* Desktop: Side by side layout */}
      <div className="hidden lg:grid lg:grid-cols-2 gap-6">
        {roomCardPropsArray.map((roomCardProps) => (
          <div key={roomCardProps.room.id}>
            <RoomCard {...roomCardProps} />
          </div>
        ))}
      </div>

      {/* Mobile/Tablet: Carousel layout */}
      <div className="lg:hidden">
        <div className="relative w-full overflow-visible h-full">
          <div 
            className="w-full relative perspective-[1000px] min-h-[550px] overflow-visible"
            {...dragHandlers}
            style={{
              ...dragHandlers.style,
              transform: state.dragState.isDragging ? `translateX(${state.dragState.deltaX * 0.5}px)` : undefined,
              transition: state.dragState.isDragging ? 'none' : 'transform 0.3s ease-out',
            }}
          >
            {roomCardPropsArray.map((roomCardProps, index) => (
              <div
                key={roomCardProps.room.id}
                className={clsx('w-full absolute transition-all duration-500 ease-in-out', {
                  'left-0 z-10': state.activeIndex === index,
                  'left-[-100%] z-5 opacity-70': state.activeIndex !== index && index === 0,
                  'left-[100%] z-5 opacity-70': state.activeIndex !== index && index === 1,
                })}
              >
                <RoomCard {...roomCardProps} />
              </div>
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="flex justify-center items-center gap-4 mt-4">
            <button
              onClick={onPrevSlide}
              className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors duration-200"
              aria-label={navigationLabels.previousRoomMobile}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div className="flex gap-2">
              {roomCardPropsArray.map((roomCardProps, index) => (
                <button
                  key={`room-dot-${roomCardProps.room.id}`}
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
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TwoRoomLayout