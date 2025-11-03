'use client'

import type React from 'react'
import type { CarouselApi } from '@/components/ui/carousel'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import RoomCard from '@/components/upsell/RoomSelectionCarousel/RoomCard'
import { cn } from '@/lib/utils'
import { CarouselDots } from './CarouselDots'

interface TwoRoomLayoutProps {
  className?: string
  roomCardPropsArray: any[]
  roomCarouselApi?: CarouselApi
  setRoomCarouselApi: (api: CarouselApi) => void
  current: number
}

export const TwoRoomLayout: React.FC<TwoRoomLayoutProps> = ({
  className,
  roomCardPropsArray,
  setRoomCarouselApi,
  current,
  roomCarouselApi,
}) => {
  return (
    <div className={cn(className)}>
      {/* Desktop: Side by side */}
      <div className="hidden gap-6 xl:grid xl:grid-cols-2">
        {roomCardPropsArray.map((roomCardProps) => (
          <RoomCard key={roomCardProps.room.id} {...roomCardProps} />
        ))}
      </div>

      {/* Mobile and Tablet: Carousel */}
      <div className="xl:hidden">
        <div className="overflow-hidden px-6">
          <Carousel
            setApi={setRoomCarouselApi}
            opts={{
              align: 'center',
              loop: false,
              containScroll: false,
              watchResize: true,
              watchSlides: true,
              dragFree: false,
              skipSnaps: false,
            }}
            className="w-full"
          >
            <CarouselContent className="flex">
              {roomCardPropsArray.map((roomCardProps) => (
                <CarouselItem
                  key={roomCardProps.room.id}
                  className="flex-shrink-0"
                  style={{
                    flexBasis: '100%',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '0 4px',
                  }}
                >
                  <div style={{ width: '320px', maxWidth: '320px' }}>
                    <RoomCard {...roomCardProps} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className={cn('absolute bottom-0 left-2 z-30')} />
            <CarouselNext className={cn('absolute right-2 bottom-0 z-30')} />
          </Carousel>

          {/* Dots indicator for mobile */}
          <CarouselDots
            count={roomCardPropsArray.length}
            current={current}
            roomCarouselApi={roomCarouselApi}
            roomIds={roomCardPropsArray.map((room) => room.room.id)}
            className="mt-6"
          />
        </div>
      </div>
    </div>
  )
}
