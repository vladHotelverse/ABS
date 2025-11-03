'use client'

import type React from 'react'
import type { CarouselApi } from '@/components/ui/carousel'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import RoomCard from '../RoomCard'
import type { RoomCardProps, RoomOption } from '../types'

export interface UnifiedCarouselProps {
  roomCardPropsArray: RoomCardProps[]
  current: number
  count: number
  roomOptions: RoomOption[]
  setRoomCarouselApi: (api: CarouselApi) => void
  className?: string
  showArrows?: boolean
  showDots?: boolean
  navigationClassName?: string
}

const UnifiedCarousel: React.FC<UnifiedCarouselProps> = ({
  roomCardPropsArray,
  current,
  count,
  roomOptions,
  setRoomCarouselApi,
  className,
  showArrows = true,
  showDots = true,
  navigationClassName,
}) => {
  return (
    <div className={cn('relative mx-auto w-full', className)}>
      <div className="overflow-hidden">
        <Carousel
          setApi={setRoomCarouselApi}
          opts={{
            align: 'center',
            loop: roomCardPropsArray.length > 2,
            containScroll: false,
            slidesToScroll: 1,
            dragFree: false,
            skipSnaps: false,
          }}
          className="w-full"
        >
          <CarouselContent
            className="flex pb-1"
            style={{
              width: '100%',
            }}
          >
            {roomCardPropsArray.map((roomCardProps, index) => (
              <CarouselItem
                key={roomCardProps.room.id}
                className={cn('flex w-full flex-shrink-0 basis-full justify-center pt-1 xl:w-[50%] xl:basis-[50%]', {
                  // Handle slide opacity and pointer events based on current slide
                  'pointer-events-none opacity-50': current !== index + 1 && roomCardPropsArray.length > 2,
                })}
              >
                <RoomCard {...roomCardProps} />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Arrows - inside Carousel context */}
          {showArrows && (
            <div className="-translate-y-1/2 absolute top-1/2 z-10 hidden w-full transform items-center justify-between px-2 md:flex">
              <CarouselPrevious className={cn('relative left-2 z-30')} />
              <CarouselNext className={cn('relative right-2 z-30')} />
            </div>
          )}
        </Carousel>

        {/* Navigation Dots - outside Carousel but using API */}
        {showDots && (
          <div className={cn('flex justify-center', navigationClassName)}>
            <div className="mr-2 flex items-center justify-center">
              {Array.from({ length: count }, (_, y) => (
                <button
                  key={`dot-${roomOptions[y]?.id ?? y}`}
                  className={cn(
                    'relative flex h-10 w-8 items-center justify-center rounded-full transition-colors',
                    "after:flex after:h-[14px] after:w-[14px] after:items-center after:rounded-full after:border-2 after:content-['']",
                    current === y + 1 ? 'after:border-foreground' : 'after:border-muted-foreground'
                  )}
                  onClick={() => {
                    // Use a ref to store the API for dot navigation
                    const api = (setRoomCarouselApi as any).__currentApi
                    if (api) {
                      api.scrollTo(y)
                    }
                  }}
                  aria-label={`Go to slide ${y + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UnifiedCarousel
