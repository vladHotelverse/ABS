import clsx from 'clsx'
import { ShoppingCart } from 'lucide-react'
import React, { useCallback, useMemo } from 'react'
import { UiButton } from '../../ui/button'

export interface MobilePricingWidgetProps {
  total: number
  currencySymbol: string
  itemCount: number
  onShowPricing: () => void
  isLoading?: boolean
  className?: string
  summaryButtonLabel: string
  totalUpgradesLabel?: string
  itemsLabel?: string
  locale?: string
  disabled?: boolean
  testId?: string
  
  // Multibooking support
  isMultiBooking?: boolean
  roomCount?: number
  roomsLabel?: string
}

const MobilePricingWidget: React.FC<MobilePricingWidgetProps> = ({
  total,
  currencySymbol,
  itemCount,
  onShowPricing,
  isLoading = false,
  className,
  summaryButtonLabel,
  totalUpgradesLabel = 'Total Upgrades',
  itemsLabel = 'items',
  locale = 'en-US',
  disabled = false,
  testId = 'mobile-pricing-widget',
  
  // Multibooking props
  isMultiBooking = false,
  roomCount,
  roomsLabel = 'rooms',
}) => {
  const formatPrice = useCallback((price: number): string => {
    try {
      if (typeof price !== 'number' || isNaN(price)) {
        return `${currencySymbol}0.00`
      }
      
      const formattedNumber = price.toLocaleString(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
      return `${currencySymbol}${formattedNumber}`
    } catch (error) {
      console.error('Error formatting price:', error)
      return `${currencySymbol}${price.toFixed(2)}`
    }
  }, [currencySymbol, locale])

  const formattedTotal = useMemo(() => formatPrice(total), [formatPrice, total])

  const isDisabled = disabled || isLoading

  return (
    <div
      className={clsx(
        'fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-100 shadow-lg',
        'lg:hidden', // Only show on mobile/tablet
        'transition-transform duration-300 ease-in-out',
        'safe-area-inset-bottom', // Handle device safe areas
        className
      )}
      data-testid={testId}
      role="complementary"
      aria-label="Mobile pricing summary"
    >
      <div className="flex items-center justify-between px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:px-6">
        <div className="flex flex-col text-left">
          <span className="text-sm text-neutral-500" id="pricing-label">
            {isMultiBooking && roomCount 
              ? `${roomCount} ${roomsLabel} • ${totalUpgradesLabel}`
              : totalUpgradesLabel
            }
          </span>
          {isLoading ? (
            <div className="animate-pulse" aria-label="Loading price">
              <div className="h-4 w-24 bg-neutral-200 rounded mb-1" />
              <div className="h-6 w-20 bg-neutral-100 rounded" />
            </div>
          ) : (
            <span 
              className="text-lg font-bold text-blue-600 whitespace-nowrap"
              aria-labelledby="pricing-label"
            >
              {formattedTotal}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {itemCount > 0 && (
            <span 
              className={clsx(
                "inline-flex items-center rounded-xl bg-green-100 px-3 py-1 text-sm font-medium text-green-700",
                "transition-all duration-200 ease-in-out"
              )}
              id="item-count"
              aria-label={`${itemCount} ${itemsLabel} selected`}
            >
              {itemCount} {itemsLabel}
            </span>
          )}
          <UiButton
            onClick={onShowPricing}
            variant="outline"
            disabled={isDisabled}
            className={clsx(
              "h-10 px-4 py-2 border border-neutral-200 bg-white hover:bg-neutral-50",
              "transition-all duration-200 ease-in-out",
              "hover:scale-[1.02] active:scale-[0.98]",
              isDisabled && "opacity-50 cursor-not-allowed"
            )}
            aria-label={`${summaryButtonLabel} - ${itemCount} ${itemsLabel}, total ${formattedTotal}`}
            aria-describedby={itemCount > 0 ? "item-count" : undefined}
          >
            <ShoppingCart className="w-5 h-5" aria-hidden="true" />
          </UiButton>
        </div>
      </div>
    </div>
  )
}

export default React.memo(MobilePricingWidget)
