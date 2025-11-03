'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { UiButton as Button } from '@/components/ui/button'
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
  const handlePrevious = () => {
    if (roomCarouselApi) {
      roomCarouselApi.scrollPrev()
    }
  }

  const handleNext = () => {
    if (roomCarouselApi) {
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
            disabled={!roomCarouselApi}
            aria-label="Previous room"
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
            disabled={!roomCarouselApi}
            aria-label="Next room"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Navigation Dots */}
      {showDots && (
        <div className={cn('flex justify-center', className)}>
          <div className="mr-2 flex items-center justify-center">
            {Array.from({ length: count }, (_, y) => (
              <button
                key={`dot-${roomOptions[y]?.id ?? y}`}
                className={cn(
                  'relative flex h-10 w-8 items-center justify-center rounded-full transition-colors',
                  "after:flex after:h-[14px] after:w-[14px] after:items-center after:rounded-full after:border-2 after:content-['']",
                  current === y + 1 ? 'after:border-foreground' : 'after:border-muted-foreground'
                )}
                onClick={() => roomCarouselApi?.scrollTo(y)}
                aria-label={`Go to slide ${y + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default RoomCarouselNavigation
