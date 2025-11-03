'use client'

import clsx from 'clsx'
import { Settings, ShoppingCart, TrendingUp } from 'lucide-react'
import React, { useId, useMemo } from 'react'
import { Button } from '@/components/ui/button'

export interface MobilePricingWidgetProps {
  formattedTotal: string
  itemCount: number
  onShowPricing: () => void
  isLoading?: boolean
  className?: string
  summaryButtonLabel: string
  itemsLabel?: string
  disabled?: boolean
  testId?: string

  // Detailed badge counts
  upgradeCount?: number
  customizationCount?: number
  upgradesLabel?: string
  customizationsLabel?: string
  upgradeLabel?: string // singular form
  customizationLabel?: string // singular form
}

const MobilePricingWidget: React.FC<MobilePricingWidgetProps> = ({
  formattedTotal,
  itemCount,
  onShowPricing,
  isLoading = false,
  className,
  summaryButtonLabel,
  itemsLabel = 'items',
  disabled = false,
  testId = 'mobile-pricing-widget',

  // Detailed badge props
  upgradeCount,
  customizationCount,
  upgradesLabel = 'upgrades',
  customizationsLabel = 'customizations',
  upgradeLabel = 'upgrade',
  customizationLabel = 'customization',
}) => {
  const itemCountId = useId()
  const pricingLabelId = useId()

  const isDisabled = disabled || isLoading

  // Determine which badges to show
  const hasDetailedBadges = upgradeCount !== undefined || customizationCount !== undefined
  const showFallbackBadge = !hasDetailedBadges && itemCount > 0

  // Create badge items with enhanced styling and icons
  const badges = useMemo(() => {
    if (!hasDetailedBadges) return []

    const badgeItems = []
    if (upgradeCount && upgradeCount > 0) {
      badgeItems.push({
        count: upgradeCount,
        label: upgradeCount === 1 ? upgradeLabel : upgradesLabel,
        key: 'upgrades',
        icon: TrendingUp,
        colors: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      })
    }
    if (customizationCount && customizationCount > 0) {
      badgeItems.push({
        count: customizationCount,
        label: customizationCount === 1 ? customizationLabel : customizationsLabel,
        key: 'customizations',
        icon: Settings,
        colors: 'bg-blue-50 border-blue-200 text-blue-700',
      })
    }
    return badgeItems
  }, [upgradeCount, customizationCount, upgradesLabel, customizationsLabel, upgradeLabel, customizationLabel])

  return (
    <aside
      className={clsx(
        'fixed right-0 bottom-0 left-0 z-50 border-gray-200/60 border-t bg-white/98 shadow-depth-3 backdrop-blur-md',
        'lg:hidden', // Only show on mobile/tablet
        'transition-transform duration-300 ease-in-out',
        'safe-area-inset-bottom', // Handle device safe areas
        'touch-manipulation', // Optimize touch interactions
        className
      )}
      data-testid={testId}
      aria-label="Mobile pricing summary"
      aria-describedby={pricingLabelId}
    >
      <div className="flex flex-col gap-2 px-3 py-2 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        {/* Single Row Layout: Price | Badges | Button */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {isLoading ? (
              <output className="animate-pulse">
                <div className="h-7 w-24 rounded-md bg-gray-200" />
              </output>
            ) : (
              <output
                className="whitespace-nowrap font-bold text-2xl text-gray-900 tracking-tight"
                id={pricingLabelId}
                aria-live="polite"
                aria-atomic="true"
              >
                {formattedTotal}
              </output>
            )}
          </div>

          {/* Inline Badges - Icon Only */}
          {(hasDetailedBadges || showFallbackBadge) && (
            <div className="flex items-center gap-1.5">
              {hasDetailedBadges ? (
                badges.map((badge) => {
                  const Icon = badge.icon
                  return (
                    <span
                      key={badge.key}
                      className={clsx(
                        'inline-flex items-center justify-center rounded-full border p-1.5 shadow-sm',
                        badge.colors
                      )}
                      title={`${badge.count} ${badge.label} selected`}
                      aria-label={`${badge.count} ${badge.label} selected`}
                      role="img"
                    >
                      <div className="flex flex-col items-center">
                        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                        <span className="font-bold text-xs leading-none">{badge.count}</span>
                      </div>
                    </span>
                  )
                })
              ) : (
                <span
                  className={clsx(
                    'inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 p-1.5 shadow-sm'
                  )}
                  id={itemCountId}
                  title={`${itemCount} ${itemsLabel} selected`}
                  aria-label={`${itemCount} ${itemsLabel} selected`}
                  role="img"
                >
                  <div className="flex flex-col items-center">
                    <ShoppingCart className="h-3.5 w-3.5 text-slate-700" aria-hidden="true" />
                    <span className="font-bold text-slate-700 text-xs leading-none">{itemCount}</span>
                  </div>
                </span>
              )}
            </div>
          )}

          <Button
            onClick={onShowPricing}
            variant="default"
            disabled={isDisabled}
            aria-label={
              isLoading
                ? `Loading - ${summaryButtonLabel}`
                : `${summaryButtonLabel} - total ${formattedTotal}, ${itemCount} ${itemsLabel} selected`
            }
            aria-describedby={pricingLabelId}
            aria-expanded={false}
            aria-haspopup="dialog"
            className="min-h-[44px] min-w-[44px] px-4 py-2"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>{summaryButtonLabel}</span>
              </div>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" aria-hidden="true" />
                {summaryButtonLabel}
              </>
            )}
          </Button>
        </div>
      </div>
    </aside>
  )
}

export default React.memo(MobilePricingWidget)
