'use client'

import BookingCardHeader from '@/components/upsell/ViewCards/BookingCardHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface Occupancy {
  adults: number
  childs: number
  infants: number
}

interface Amenity {
  attributeName: string
  attributeId: number
  amountFormatted: string
}

interface Upgrade {
  roomTypeName: string
  amountFormatted: string
}

interface BookingAccordionCardProps {
  roomType: string
  checkInDate: string
  checkOutDate: string
  occupancy: Occupancy
  roomImage?: string
  amenities?: string[]
  hasUpgrade: boolean
  hasExtras: boolean
  statusText: string
  isCancelled: boolean
  bookingKey: string
  internalLocator?: string
  attributesBreakdown?: Amenity[]
  upgrade?: Upgrade
  isPending?: boolean
  onCancelBookingClick?: (locator: string) => void
  formatDate: (date: string) => string
  t: (key: string, values?: Record<string, string | number>) => string
}

const BookingAccordionCard = ({
  roomType,
  checkInDate,
  checkOutDate,
  occupancy,
  roomImage,
  amenities,
  hasUpgrade,
  hasExtras,
  statusText,
  isCancelled,
  bookingKey,
  internalLocator,
  attributesBreakdown,
  upgrade,
  isPending = false,
  onCancelBookingClick,
  formatDate,
  t,
}: BookingAccordionCardProps) => {
  return (
    <Card className="relative overflow-hidden border-none bg-card shadow-sm">
      <CardContent className="flex flex-col gap-0 p-4 sm:p-6">
        {/* Main Content - Header */}
        <div className="flex flex-col gap-4 pb-4">
          {/* Header Section */}
          <div className="min-w-0 flex-1">
            <BookingCardHeader
              roomType={roomType}
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              occupancy={occupancy}
              roomImage={roomImage}
              amenities={amenities}
              hasUpgrade={hasUpgrade}
              hasExtras={hasExtras}
              attributesBreakdown={attributesBreakdown}
              statusText={statusText}
              isCancelled={isCancelled}
              formatDate={formatDate}
              t={t}
            />
          </div>

          {/* Pricing Section */}
          {(hasUpgrade || hasExtras) && (
            <div className="mt-2 mb-3 space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
              {hasUpgrade && upgrade && (
                <div className="flex justify-between gap-2 text-sm">
                  <span className="text-gray-700">{`Upgrade to ${upgrade.roomTypeName}`}</span>
                  <span className="font-medium text-green-600">{upgrade.amountFormatted}</span>
                </div>
              )}
              {hasExtras &&
                attributesBreakdown?.map((attr, index) => (
                  <div key={`${attr.attributeName}-${index}`} className="flex justify-between gap-2 text-sm">
                    <span className="text-gray-700">{attr.attributeName}</span>
                    <span className="font-medium text-green-600">{attr.amountFormatted}</span>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Action Button - Cancel on Left */}
        {onCancelBookingClick && !isCancelled && (
          <Button
            size="sm"
            variant="outline"
            disabled={isPending}
            onClick={() => onCancelBookingClick(internalLocator ?? bookingKey)}
            className="ml-auto w-fit border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive dark:border-destructive/50 dark:hover:bg-destructive/10"
          >
            {t('booking.cancelRequest')}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export default BookingAccordionCard
