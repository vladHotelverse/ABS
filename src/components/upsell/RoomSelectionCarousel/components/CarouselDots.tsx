'use client'

import type React from 'react'
import type { CarouselApi } from '@/components/ui/carousel'
import { cn } from '@/lib/utils'

interface CarouselDotsProps {
  count: number
  current: number
  roomCarouselApi?: CarouselApi
  roomIds?: string[]
  className?: string
}

export const CarouselDots: React.FC<CarouselDotsProps> = ({
  count,
  current,
  roomCarouselApi,
  roomIds = [],
  className,
}) => {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      {Array.from({ length: count }, (_, index) => (
        <button
          key={`dot-${roomIds[index] ?? index}`}
          className={cn(
            'relative flex h-10 w-8 items-center justify-center rounded-full transition-colors',
            "after:flex after:h-[14px] after:w-[14px] after:items-center after:rounded-full after:border-2 after:content-['']",
            current === index + 1 ? 'after:border-foreground' : 'after:border-muted-foreground'
          )}
          onClick={() => roomCarouselApi?.scrollTo(index)}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  )
}

export default CarouselDots
