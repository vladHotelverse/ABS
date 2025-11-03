'use client'

import { ArrowUpRight, Calendar, Users } from 'lucide-react'
import { Badge } from '@/index'

interface Occupancy {
  adults: number
  childs: number
  infants: number
}

interface Amenity {
  attributeName: string
  amountFormatted: string
}

interface BookingCardHeaderProps {
  roomType: string
  checkInDate: string
  checkOutDate: string
  occupancy: Occupancy
  roomImage?: string
  amenities?: string[]
  hasUpgrade: boolean
  hasExtras: boolean
  attributesBreakdown?: Amenity[]
  formatDate: (date: string) => string
  t: (key: string, values?: Record<string, string | number>) => string
}

const BookingCardHeader = ({
  roomType,
  checkInDate,
  checkOutDate,
  occupancy,
  roomImage,
  amenities = [],
  hasUpgrade,
  hasExtras,
  attributesBreakdown = [],
  formatDate,
  t,
}: BookingCardHeaderProps) => {
  const amenitiesText = amenities.slice(0, 3).join(' • ')
  const totalOccupancy = (occupancy?.adults || 0) + (occupancy?.childs || 0) + (occupancy?.infants || 0)
  const attributeNames = attributesBreakdown?.map((attr) => attr.attributeName).filter(Boolean) || []
  const attributesText = attributeNames.join(', ')

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-3 lg:gap-4">
      <button
        className="relative h-48 w-full overflow-hidden rounded-lg bg-muted shadow-[var(--shadow-depth-1)] ring-1 ring-border/50 transition-transform hover:ring-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 sm:h-24 sm:w-32 sm:flex-shrink-0 md:h-28 md:w-40 lg:h-auto lg:w-48 lg:flex-shrink-0 lg:rounded-xl"
        aria-label={`View ${roomType || 'room'} photos`}
        title="Click to view room photos"
      >
        {roomImage ? (
          <img
            src={roomImage}
            alt={`${roomType || 'Room'} - primary view showing accommodation with amenities`}
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs">—</div>
        )}
      </button>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
        {/* Room Title + Upgrade Badge */}
        <div className="flex flex-wrap items-center gap-1.5 max-md:justify-between sm:gap-2">
          <h3 className="truncate font-semibold text-base text-foreground">{roomType}</h3>
          {hasUpgrade && (
            <Badge
              variant="outline"
              className="gap-1 rounded-full border-blue-300 bg-blue-50 px-2 py-0.5 font-medium text-[11px] text-blue-700"
            >
              <ArrowUpRight className="h-2.5 w-2.5" />
              {t('booking.view.upgraded')}
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            <span>
              {formatDate(checkInDate)} - {formatDate(checkOutDate)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{totalOccupancy === 1 ? '1 guest' : `${totalOccupancy} guests`}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {amenitiesText && (
            <p className="truncate text-muted-foreground text-xs sm:text-sm" title={amenitiesText}>
              {amenitiesText}
            </p>
          )}
          {hasExtras && attributesText && (
            <Badge variant="outline" className="gap-1" title={attributesText}>
              <span className="max-w-xs truncate">{attributesText}</span>
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookingCardHeader
