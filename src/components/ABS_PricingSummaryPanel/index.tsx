import clsx from 'clsx'
import type React from 'react'
import { useMemo, useCallback } from 'react'
import { toast } from 'sonner'
import EmptyState from './components/EmptyState'
import PriceBreakdown from './components/PriceBreakdown'
import PricingSummaryHeader from './components/PricingSummaryHeader'
import RoomSection from './components/RoomSection'
import ItemsSection from './components/ItemsSection'
import { LoadingOverlay } from '../shared'
import type { PricingItem, PricingSummaryPanelProps } from './types'
import { DEFAULT_ROOM_IMAGE } from './constants'

const PricingSummaryPanel: React.FC<PricingSummaryPanelProps> = ({
  className,
  roomImage = DEFAULT_ROOM_IMAGE,
  items = [],
  pricing = { subtotal: 0 },
  isLoading = false,
  availableSections = [],
  labels,
  currency,
  locale,
  onRemoveItem,
  onConfirm,
}) => {

  // Memoize expensive filtering operations - now grouped by concept
  const { chooseYourSuperiorRoomItems, customizeYourRoomItems, chooseYourRoomItems, enhanceYourStayItems, isEmpty } = useMemo(() => {
    const safeItems = items || []
    return {
      chooseYourSuperiorRoomItems: safeItems.filter((item) => item.concept === 'choose-your-superior-room'),
      customizeYourRoomItems: safeItems.filter((item) => item.concept === 'customize-your-room'),
      chooseYourRoomItems: safeItems.filter((item) => item.concept === 'choose-your-room'),
      enhanceYourStayItems: safeItems.filter((item) => item.concept === 'enhance-your-stay'),
      isEmpty: safeItems.length === 0,
    }
  }, [items])

  // Filter available sections (memoized)
  const availableActiveSections = useMemo(() => {
    return availableSections?.filter((section) => section.isAvailable) || []
  }, [availableSections])

  // Memoize handlers to prevent unnecessary re-renders
  const handleRemoveItem = useCallback(
    (item: PricingItem) => {
      if (onRemoveItem) {
        onRemoveItem(item.id, item.name, item.type)

        // Show appropriate toast message based on concept
        let toastMessage = labels.roomRemovedMessage
        if (item.concept === 'customize-your-room') {
          toastMessage = `${labels.customizationRemovedMessagePrefix} ${item.name}`
        } else if (item.concept === 'enhance-your-stay') {
          toastMessage = `${labels.offerRemovedMessagePrefix} ${item.name}`
        } else if (item.concept === 'choose-your-superior-room') {
          toastMessage = `Superior room removed: ${item.name}`
        } else if (item.concept === 'choose-your-room') {
          toastMessage = `Room selection removed: ${item.name}`
        }

        toast.info(toastMessage)
      }
    },
    [onRemoveItem, labels]
  )

  // Enhanced safety checks for required props
  if (!labels) {
    console.error('PricingSummaryPanel: labels prop is required')
    return (
      <div className="p-4 text-destructive border border-destructive rounded-lg bg-destructive/5">
        <h3 className="font-semibold mb-2">Configuration Error</h3>
        <p>Missing required labels configuration. Please provide all required labels.</p>
      </div>
    )
  }

  // Validate pricing object
  const safePricing = useMemo(() => {
    if (!pricing || typeof pricing !== 'object') {
      console.warn(`PricingSummaryPanel: ${labels.invalidPricingError}`)
      return { subtotal: 0 }
    }

    const subtotal = typeof pricing.subtotal === 'number' && !Number.isNaN(pricing.subtotal) ? pricing.subtotal : 0

    return { subtotal }
  }, [pricing])

  return (
    <section
      className={clsx(
        'border border-border rounded-lg overflow-hidden bg-card text-card-foreground shadow-sm w-full md:w-[400px] sticky top-28 ',
        className
      )}
      aria-label={labels.pricingSummaryLabel}
    >
      {/* Room image header */}
      <PricingSummaryHeader 
        roomImage={roomImage}
        roomImageAltText={labels.roomImageAltText}
      />

      {/* Content container with padding */}
      <div className="p-4 space-y-4 relative">
        <LoadingOverlay isLoading={isLoading} loadingLabel={labels.loadingLabel} />

        {/* Empty State */}
        {isEmpty && !isLoading && (
          <div className="py-6">
            <EmptyState
              availableActiveSections={availableActiveSections}
              emptyCartMessage={labels.emptyCartMessage}
              exploreLabel={labels.exploreLabel}
              fromLabel={labels.fromLabel}
              euroSuffix={labels.euroSuffix}
              customizeStayTitle={labels.customizeStayTitle}
              chooseOptionsSubtitle={labels.chooseOptionsSubtitle}
            />
          </div>
        )}

        {/* Room Section - combining all room-related items */}
        <RoomSection
          chooseYourRoomItems={chooseYourRoomItems}
          chooseYourSuperiorRoomItems={chooseYourSuperiorRoomItems}
          euroSuffix={labels.euroSuffix}
          removeRoomUpgradeLabel={labels.removeRoomUpgradeLabel}
          onRemoveItem={handleRemoveItem}
        />

        {/* Customizations Section */}
        <ItemsSection
          title="Room Customization"
          items={customizeYourRoomItems}
          euroSuffix={labels.euroSuffix}
          onRemoveItem={handleRemoveItem}
        />


        {/* Special Offers Section */}
        <ItemsSection
          title="Stay Enhancement"
          items={enhanceYourStayItems}
          euroSuffix={labels.euroSuffix}
          onRemoveItem={handleRemoveItem}
        />

        {/* Price Breakdown - Always show to display totals and confirm button */}
        <div className="border-t pt-4">
          <PriceBreakdown
            subtotal={safePricing.subtotal}
            isLoading={isLoading}
            labels={{
              subtotalLabel: labels.subtotalLabel,
              totalLabel: labels.totalLabel,
              payAtHotelLabel: labels.payAtHotelLabel,
              viewTermsLabel: labels.viewTermsLabel,
              confirmButtonLabel: labels.confirmButtonLabel,
              loadingLabel: labels.loadingLabel,
              euroSuffix: labels.euroSuffix,
            }}
            currency={currency}
            locale={locale}
            onConfirm={onConfirm}
          />
        </div>
      </div>
    </section>
  )
}

export default PricingSummaryPanel
export { PricingSummaryPanel as ABS_PricingSummaryPanel }
export type { PricingSummaryPanelProps, PricingItem, AvailableSection, PricingLabels } from './types'

// Export focused sub-components
export { 
  PricingSummaryHeader,
  RoomSection,
  SectionRenderer
} from './components'

// Export hooks
export { useSectionConfiguration } from './hooks'

// Export additional types
export type { 
  PricingSummaryHeaderProps,
  RoomSectionProps,
  SectionConfig,
  SectionRendererProps,
  SectionConfigurationProps
} from './components'
