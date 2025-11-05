'use client'

import { Calendar, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { TooltipProvider, UiTooltip, UiTooltipContent, UiTooltipTrigger } from '@/components/ui/tooltip'
import { CollapsibleItemCard, type ItemDetail } from './CollapsibleItemCard'
import { VisualReceipt, type ReceiptLineItem } from './VisualReceipt'
import { getBenefitIcon, detectBenefitType } from './utils/icons'

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

interface SpecialOfferSummary {
  id: number
  title: string
  formattedPrice: string
  pricingType: 'perStay' | 'perPerson' | 'perNight'
  quantity?: number
  details?: string
}

interface BookingAccordionCardV2Props {
  roomType: string
  checkInDate: string
  checkOutDate: string
  occupancy: Occupancy
  roomImage?: string
  amenities?: string[]
  hasUpgrade: boolean
  hasExtras: boolean
  hasSpecialOffers?: boolean
  statusText: string
  isCancelled: boolean
  bookingKey: string
  internalLocator?: string
  attributesBreakdown?: Amenity[]
  upgrade?: Upgrade
  specialOffers?: SpecialOfferSummary[]
  isPending?: boolean
  onCancelBookingClick?: (locator: string) => void
  formatDate: (date: string) => string
  t: (key: string, values?: Record<string, string | number>) => string
}

const BookingAccordionCardV2 = ({
  roomType,
  checkInDate,
  checkOutDate,
  occupancy,
  roomImage,
  amenities = [],
  hasUpgrade,
  hasExtras,
  hasSpecialOffers = false,
  statusText,
  isCancelled,
  bookingKey,
  internalLocator,
  attributesBreakdown,
  upgrade,
  specialOffers = [],
  isPending = false,
  onCancelBookingClick,
  formatDate,
  t,
}: BookingAccordionCardV2Props) => {
  const totalOccupancy = (occupancy?.adults || 0) + (occupancy?.childs || 0) + (occupancy?.infants || 0)

  // Build receipt items
  const receiptItems: ReceiptLineItem[] = []

  if (hasUpgrade && upgrade) {
    receiptItems.push({
      id: 'upgrade',
      label: `Upgrade to ${upgrade.roomTypeName}`,
      price: upgrade.amountFormatted,
      highlight: true,
    })
  }

  specialOffers.forEach((offer) => {
    receiptItems.push({
      id: `offer-${offer.id}`,
      label: offer.title,
      price: offer.formattedPrice,
    })
  })

  attributesBreakdown?.forEach((attr, idx) => {
    receiptItems.push({
      id: `extra-${idx}`,
      label: attr.attributeName,
      price: attr.amountFormatted,
      included: attr.amountFormatted.toLowerCase().includes('included'),
    })
  })

  return (
    <Card className="relative overflow-hidden border-none bg-card shadow-sm">
      <CardContent className="flex flex-col gap-6 p-6">
        {/* Header Section - Room Info */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch sm:gap-4">
          {/* Room Image */}
          <button
            className="relative h-full min-h-32 w-full overflow-hidden rounded-xl bg-muted shadow-sm ring-1 ring-border/50 transition-transform hover:ring-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 sm:h-28 sm:w-40 sm:flex-shrink-0 lg:h-32 lg:w-48"
            aria-label={`View ${roomType || 'room'} photos`}
            title="Click to view room photos"
          >
            {roomImage ? (
              <img
                src={roomImage}
                alt={`${roomType || 'Room'} - primary view`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs">—</div>
            )}
          </button>

          <div className="flex min-w-0 flex-1 flex-col gap-3">
            {/* Room Title + Status */}
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-base text-foreground">{roomType}</h3>
              {statusText && (
                <TooltipProvider>
                  <UiTooltip>
                    <UiTooltipTrigger asChild>
                      <Badge
                        className={`cursor-help rounded-full px-3 py-1 font-medium text-xs ${
                          isCancelled
                            ? 'border border-destructive/30 bg-destructive/10 text-destructive'
                            : 'border border-emerald-300 bg-emerald-50 text-emerald-800'
                        }`}
                      >
                        {statusText}
                      </Badge>
                    </UiTooltipTrigger>
                    <UiTooltipContent>{statusText}</UiTooltipContent>
                  </UiTooltip>
                </TooltipProvider>
              )}
            </div>

            {/* Dates + Guests */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                <span>
                  {formatDate(checkInDate)} - {formatDate(checkOutDate)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4" aria-hidden="true" />
                <span>{totalOccupancy === 1 ? '1 guest' : `${totalOccupancy} guests`}</span>
              </div>
            </div>

            {/* Amenity Chips */}
            {amenities.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {amenities.slice(0, 4).map((amenity, idx) => (
                  <Badge key={idx} variant="outline" className="rounded-full text-xs">
                    {amenity}
                  </Badge>
                ))}
                {amenities.length > 4 && (
                  <Badge variant="outline" className="rounded-full text-xs">
                    +{amenities.length - 4} more
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Upgrades & Extras Section */}
        {(hasUpgrade || hasSpecialOffers || hasExtras) && (
          <div className="space-y-4">
            {/* Section Header */}
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-foreground text-sm">
                Your Add-ons{' '}
                <span className="text-muted-foreground">
                  ({[hasUpgrade, hasSpecialOffers, hasExtras].filter(Boolean).reduce((sum) => sum + 1, 0)} included)
                </span>
              </h4>
            </div>

            {/* Upgrade Card */}
            {hasUpgrade && upgrade && (
              <CollapsibleItemCard
                icon={getBenefitIcon('upgrade')}
                title={`Upgrade to ${upgrade.roomTypeName}`}
                price={upgrade.amountFormatted}
                priceColor="green"
                badge="Upgraded"
                badgeVariant="success"
                details={[
                  { label: 'Room Type', value: upgrade.roomTypeName },
                  { label: 'Upgrade Cost', value: upgrade.amountFormatted },
                ]}
              />
            )}

            {/* Special Offers Cards */}
            {hasSpecialOffers &&
              specialOffers.map((offer) => {
                const benefitType = detectBenefitType(offer.title)
                const details: ItemDetail[] = []

                if (offer.pricingType) {
                  const typeLabels = {
                    perStay: 'Per Stay',
                    perPerson: 'Per Person',
                    perNight: 'Per Night',
                  }
                  details.push({ label: 'Pricing', value: typeLabels[offer.pricingType] })
                }

                if (offer.quantity) {
                  details.push({ label: 'Quantity', value: String(offer.quantity) })
                }

                return (
                  <CollapsibleItemCard
                    key={offer.id}
                    icon={getBenefitIcon(benefitType)}
                    title={offer.title}
                    subtitle={offer.details}
                    price={offer.formattedPrice}
                    priceColor="blue"
                    details={details.length > 0 ? details : undefined}
                  />
                )
              })}

            {/* Extras Cards */}
            {hasExtras &&
              attributesBreakdown?.map((attr, index) => {
                const benefitType = detectBenefitType(attr.attributeName)
                const isIncluded = attr.amountFormatted.toLowerCase().includes('included')

                return (
                  <CollapsibleItemCard
                    key={`${attr.attributeName}-${index}`}
                    icon={getBenefitIcon(benefitType)}
                    title={attr.attributeName}
                    price={attr.amountFormatted}
                    priceColor="green"
                    included={isIncluded}
                  />
                )
              })}
          </div>
        )}

        {/* Visual Receipt */}
        {receiptItems.length > 0 && (
          <VisualReceipt
            items={receiptItems}
            totalLabel="Total"
            totalAmount="€1,850.00"
            className="sticky bottom-4"
          />
        )}

        {/* Action Button */}
        {onCancelBookingClick && !isCancelled && (
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="outline"
              disabled={isPending}
              onClick={() => onCancelBookingClick(internalLocator ?? bookingKey)}
              className="border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              {t('booking.cancelRequest')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default BookingAccordionCardV2
