'use client'

import { ArrowUp, InfoIcon } from 'lucide-react'
import BookingCardHeader from '@/components/upsell/ViewCards/BookingCardHeader'
import {
  Badge,
  Card,
  CardContent,
  TooltipProvider,
  UiButton,
  UiTooltip,
  UiTooltipContent,
  UiTooltipTrigger,
} from '@/index'

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

interface BookingAccordionCardProps {
  roomType: string
  checkInDate: string
  checkOutDate: string
  occupancy: Occupancy
  roomImage?: string
  amenities?: string[]
  hasUpgrade: boolean
  hasExtras: boolean
  statusCode?: number
  statusText: string
  isCancelled: boolean
  formattedTotalPrice?: string
  bookingKey: string
  internalLocator?: string
  attributesBreakdown?: Amenity[]
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
  formattedTotalPrice,
  bookingKey,
  internalLocator,
  attributesBreakdown,
  isPending = false,
  onCancelBookingClick,
  formatDate,
  t,
}: BookingAccordionCardProps) => {
  return (
    <Card className="relative overflow-hidden border-none bg-card shadow-sm">
      <CardContent className="flex flex-col gap-0 p-4 sm:p-6">
        {/* Main Content - Header */}
        <div className="flex flex-col gap-4 pb-4 lg:flex-row lg:justify-between">
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
              formatDate={formatDate}
              t={t}
            />
          </div>

          {/* Upgrade Cost - Side Section on Desktop */}
          <div className="flex flex-row-reverse items-end justify-between gap-4 md:flex-col lg:border-border/50 lg:border-l lg:pl-6">
            {/* Status Badge with Tooltip */}
            {statusText && (
              <TooltipProvider>
                <UiTooltip>
                  <UiTooltipTrigger asChild>
                    <Badge
                      className={`cursor-help gap-1 rounded-full px-3 py-1 font-medium text-[11px] ${
                        isCancelled
                          ? 'border border-destructive/30 bg-destructive/10 text-destructive'
                          : 'border border-emerald-300 bg-emerald-50 text-emerald-800'
                      }`}
                    >
                      <InfoIcon className="mr-1 h-3 w-3" aria-hidden="true" />
                      {statusText}
                    </Badge>
                  </UiTooltipTrigger>
                  <UiTooltipContent>{statusText}</UiTooltipContent>
                </UiTooltip>
              </TooltipProvider>
            )}

            {/* Cost Section */}
            {formattedTotalPrice && (
              <div className="flex flex-col gap-2 md:items-end">
                <div className="flex items-center gap-1.5 font-medium text-xs">
                  <ArrowUp className="h-4 w-4 text-emerald-500" />
                  {t('booking.view.upgradeCost')}
                </div>
                <div className="font-semibold text-lg sm:text-xl">{formattedTotalPrice}</div>
              </div>
            )}
          </div>
        </div>

        {/* Action Button - Cancel on Left */}
        {onCancelBookingClick && !isCancelled && (
          <UiButton
            size="sm"
            variant="outline"
            disabled={isPending}
            onClick={() => onCancelBookingClick(internalLocator ?? bookingKey)}
            className="ml-auto w-fit border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive dark:border-destructive/50 dark:hover:bg-destructive/10"
          >
            {t('booking.cancelRequest')}
          </UiButton>
        )}
      </CardContent>
    </Card>
  )
}

export default BookingAccordionCard
