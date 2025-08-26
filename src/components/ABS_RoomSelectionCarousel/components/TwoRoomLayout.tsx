import clsx from 'clsx'
import type React from 'react'
import type { CarouselApi } from '@/components/ui/carousel'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { RoomCard } from '../components'
import { cn } from '@/lib/utils'

interface TwoRoomLayoutProps {
  title?: string
  subtitle?: string
  className?: string
  roomCardPropsArray: any[]
  roomCarouselApi?: CarouselApi
  setRoomCarouselApi: (api: CarouselApi) => void
  current: number
  count: number
}

export const TwoRoomLayout: React.FC<TwoRoomLayoutProps> = ({
  title,
  subtitle,
  className,
  roomCardPropsArray,
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

      {/* Desktop: Side by side */}
      <div className="hidden xl:grid xl:grid-cols-2 gap-6">
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
              align: "center",
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
            <CarouselPrevious className={cn('absolute left-2 bottom-0 z-30')} />
            <CarouselNext className={cn('absolute right-2  bottom-0 z-30')} />
          </Carousel>

          {/* Dots indicator for mobile */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center">
              {Array.from({ length: count }, (_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-10 h-10 flex items-center justify-center rounded-full relative transition-colors",
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
        </div>
      </div>
    </div>
  )
}