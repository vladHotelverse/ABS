'use client'

import type React from 'react'
import type { CarouselApi } from '@/components/ui/carousel'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import RoomCard from '../RoomCard'
import type { RoomCardProps } from '../types'

export interface RoomCarouselContentProps {
  roomCardPropsArray: RoomCardProps[]
  current: number
  setRoomCarouselApi: (api: CarouselApi) => void
  className?: string
}

const RoomCarouselContent: React.FC<RoomCarouselContentProps> = ({
  roomCardPropsArray,
  current,
  setRoomCarouselApi,
  className,
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
        </Carousel>
      </div>
    </div>
  )
}

export default RoomCarouselContent
