'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { CarouselApi } from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import type { RoomOption } from '../types'

export interface RoomCarouselNavigationProps {
  roomCarouselApi: CarouselApi | undefined
  current: number
  count: number
  roomOptions: RoomOption[]
  showArrows?: boolean
  showDots?: boolean
  className?: string
}

const RoomCarouselNavigation = ({
  roomCarouselApi,
  current,
  count,
  roomOptions,
  showArrows = true,
  showDots = true,
  className,
}: RoomCarouselNavigationProps) => {
  const isFirst = current === 1
  const isLast = current === count

  const handlePrevious = () => {
    if (roomCarouselApi && !isFirst) {
      roomCarouselApi.scrollPrev()
    }
  }

  const handleNext = () => {
    if (roomCarouselApi && !isLast) {
      roomCarouselApi.scrollNext()
    }
  }

  return (
    <>
      {/* Navigation Arrows */}
      {showArrows && (
        <div className="-translate-y-1/2 absolute top-1/2 z-10 hidden w-full transform items-center justify-between px-2 md:flex">
          <Button
            variant="outline"
            size="icon"
            className={cn(
              'relative left-2 z-30 h-8 w-8 rounded-full border-0 bg-background/80 backdrop-blur-sm hover:bg-background',
              'disabled:pointer-events-none disabled:opacity-50'
            )}
            onClick={handlePrevious}
            disabled={!roomCarouselApi || isFirst}
            aria-label={`Previous room (${current - 1} of ${count})`}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              'relative right-2 z-30 h-8 w-8 rounded-full border-0 bg-background/80 backdrop-blur-sm hover:bg-background',
              'disabled:pointer-events-none disabled:opacity-50'
            )}
            onClick={handleNext}
            disabled={!roomCarouselApi || isLast}
            aria-label={`Next room (${current + 1} of ${count})`}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Navigation Dots */}
      {showDots && (
        <div className={cn('flex justify-center', className)}>
          <div className="mr-2 flex items-center justify-center">
            {Array.from({ length: count }, (_, y) => {
              const roomTitle = roomOptions[y]?.title || roomOptions[y]?.roomType
              return (
                <button
                  key={`dot-${roomOptions[y]?.id ?? y}`}
                  className={cn(
                    'relative flex h-10 w-8 items-center justify-center rounded-full transition-colors',
                    "after:flex after:h-[14px] after:w-[14px] after:items-center after:rounded-full after:border-2 after:content-['']",
                    current === y + 1 ? 'after:border-foreground' : 'after:border-muted-foreground'
                  )}
                  onClick={() => roomCarouselApi?.scrollTo(y)}
                  aria-label={`View ${roomTitle} (room ${y + 1} of ${count})`}
                  aria-current={current === y + 1 ? 'page' : undefined}
                />
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}

export default RoomCarouselNavigation
