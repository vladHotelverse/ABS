import clsx from 'clsx'
import type React from 'react'
import type { CarouselApi } from '@/components/ui/carousel'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { RoomCard } from '../components'
import type { RoomOption } from '../types'
import { cn } from '@/lib/utils'

interface MultiRoomLayoutProps {
  title?: string
  subtitle?: string
  className?: string
  roomCardPropsArray: any[]
  roomOptions: RoomOption[]
  roomCarouselApi?: CarouselApi
  setRoomCarouselApi: (api: CarouselApi) => void
  current: number
  count: number
}

export const MultiRoomLayout: React.FC<MultiRoomLayoutProps> = ({
  title,
  subtitle,
  className,
  roomCardPropsArray,
  roomOptions,
  setRoomCarouselApi,
  current,
  count,
  roomCarouselApi,
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

      <div className="relative w-full mx-auto">
        <div className="overflow-hidden">
          <Carousel
            setApi={setRoomCarouselApi}
            opts={{
              align: "center",
              loop: roomOptions.length > 2,
              containScroll: false,
              watchResize: true,
              watchSlides: true,
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
              {roomCardPropsArray.map((roomCardProps) => (
                <CarouselItem
                  key={roomCardProps.room.id}
                  className="flex-shrink-0 lg:basis-[50%] lg:w-[50%] basis-full w-full flex justify-center"
                >
                  <RoomCard {...roomCardProps} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className='flex justify-between'>
              <div>
                <CarouselPrevious className={cn('relative left-2 -bottom-4 z-30')} />
                <CarouselNext className={cn('relative -right-4  -bottom-4 z-30')} />
              </div>
              {/* Dots indicator for mobile */}
              <div className="flex items-center justify-center mr-2">
                {Array.from({ length: count }, (_, index) => (
                  <button
                    key={index}
                    className={cn(
                      "w-8 h-10 flex items-center justify-center rounded-full relative transition-colors",
                      "after:content-[''] after:w-[14px] after:h-[14px] after:rounded-full after:flex after:items-center after:border-2",
                      current === index + 1
                        ? "after:border-gray-800"
                        : "after:border-gray-400"
                    )}
                    onClick={() => roomCarouselApi?.scrollTo(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </Carousel>
        </div>
      </div>
    </div>
  )
}