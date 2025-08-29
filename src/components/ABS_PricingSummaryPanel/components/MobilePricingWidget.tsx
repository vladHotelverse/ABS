import clsx from 'clsx'
import { ShoppingCart, TrendingUp, Settings, Gift } from 'lucide-react'
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
  
  // Detailed badge counts
  upgradeCount?: number
  customizationCount?: number
  offerCount?: number
  upgradesLabel?: string
  customizationsLabel?: string
  offersLabel?: string
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
  
  // Detailed badge props
  upgradeCount,
  customizationCount,
  offerCount,
  upgradesLabel = 'upgrades',
  customizationsLabel = 'customizations',
  offersLabel = 'offers',
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

  // Determine which badges to show
  const hasDetailedBadges = upgradeCount !== undefined || customizationCount !== undefined || offerCount !== undefined
  const showFallbackBadge = !hasDetailedBadges && itemCount > 0

  // Create badge items with enhanced styling and icons
  const badges = useMemo(() => {
    if (!hasDetailedBadges) return []
    
    const badgeItems = []
    if (upgradeCount && upgradeCount > 0) {
      badgeItems.push({ 
        count: upgradeCount, 
        label: upgradesLabel, 
        key: 'upgrades',
        icon: TrendingUp,
        colors: 'bg-emerald-50 border-emerald-200 text-emerald-700'
      })
    }
    if (customizationCount && customizationCount > 0) {
      badgeItems.push({ 
        count: customizationCount, 
        label: customizationsLabel, 
        key: 'customizations',
        icon: Settings,
        colors: 'bg-blue-50 border-blue-200 text-blue-700'
      })
    }
    if (offerCount && offerCount > 0) {
      badgeItems.push({ 
        count: offerCount, 
        label: offersLabel, 
        key: 'offers',
        icon: Gift,
        colors: 'bg-purple-50 border-purple-200 text-purple-700'
      })
    }
    return badgeItems
  }, [upgradeCount, customizationCount, offerCount, upgradesLabel, customizationsLabel, offersLabel, hasDetailedBadges])

  return (
    <div
      className={clsx(
        'fixed bottom-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-md border-t border-gray-200/60 shadow-2xl',
        'lg:hidden', // Only show on mobile/tablet
        'transition-transform duration-300 ease-in-out',
        'safe-area-inset-bottom', // Handle device safe areas
        className
      )}
      data-testid={testId}
      role="complementary"
      aria-label="Mobile pricing summary"
    >
      <div className="flex flex-col px-3 py-2 pb-[calc(1.25rem+env(safe-area-inset-bottom))] gap-2">
        {/* Top Row: Room count, Price, and Button */}
        {/* Bottom Row: Enhanced Badges */}
        {(hasDetailedBadges || showFallbackBadge) && (
          <div className="flex items-center gap-2.5 flex-wrap">
            {hasDetailedBadges ? (
              badges.map((badge) => {
                const Icon = badge.icon
                return (
                  <span 
                    key={badge.key}
                    className={clsx(
                      "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold",
                      "transition-all duration-200 ease-in-out shadow-sm hover:shadow-md",
                      "transform hover:scale-105 active:scale-95",
                      badge.colors
                    )}
                    aria-label={`${badge.count} ${badge.label} selected`}
                  >
                    <Icon className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                    <span className="font-bold">{badge.count}</span>
                    <span className="ml-1">{badge.label}</span>
                  </span>
                )
              })
            ) : (
              <span 
                className={clsx(
                  "inline-flex items-center rounded-full bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700",
                  "transition-all duration-200 ease-in-out shadow-sm hover:shadow-md",
                  "transform hover:scale-105 active:scale-95"
                )}
                id="item-count"
                aria-label={`${itemCount} ${itemsLabel} selected`}
              >
                <ShoppingCart className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                <span className="font-bold">{itemCount}</span>
                <span className="ml-1">{itemsLabel}</span>
              </span>
            )}
          </div>
        )}
                <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="flex flex-col gap-1">
              {isLoading ? (
                <div className="animate-pulse" aria-label="Loading price">
                  <div className="h-8 w-28 bg-gray-200 rounded-md" />
                </div>
              ) : (
                <span 
                  className="text-3xl font-bold text-gray-900 whitespace-nowrap tracking-tight"
                  aria-labelledby="pricing-label"
                >
                  {formattedTotal}
                </span>
              )}
            </div>
          </div>

          <UiButton
            onClick={onShowPricing}
            variant="default"
            disabled={isDisabled}
            aria-label={`${summaryButtonLabel} - total ${formattedTotal}`}
          >
            <ShoppingCart className="w-4 h-4 mr-2" aria-hidden="true" />
            {summaryButtonLabel}
          </UiButton>
        </div>
      </div>
    </div>
  )
}

export default React.memo(MobilePricingWidget)
