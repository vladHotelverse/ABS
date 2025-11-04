/**
 * Story wrapper that combines AttributesCategories + MultiBookingPricingSummaryPanel
 * with synchronized cart state via CartStoryContext
 */

import React, { useCallback, useMemo } from 'react'
import AttributeCard from '@/components/upsell/RoomCustomization/components/AttributeCard'
import AttributesCategories from '@/components/upsell/RoomCustomization/components/AttributesCategories'
import MultiBookingPricingSummaryPanel from '@/components/upsell/PricingSummaryPanel/MultiBookingPricingSummaryPanel'
import type { UILabels } from '@/components/upsell/PricingSummaryPanel/types'
import type { CartItem } from '../hooks/useStorybookCart'
import type { BookingInfo, TransformConfig } from '../helpers/cartTransformers'
import { CartStoryProvider, useCartStory } from '../contexts/CartStoryContext'
import type { RoomCustomizationCategory } from '../mockData'
import useAccordionState from '../PricingSummaryPanel/hooks/useAccordionState'
import {
  DEFAULT_ATTRIBUTE_DISPLAY_CONFIG,
  sortAttributesByExclusivity,
  useAttributeDisplaySettings,
} from '../RoomCustomization/utils/attributeFormatter'

interface ConnectedAttributesCategoriesProps {
  categories: RoomCustomizationCategory[]
  bookingKey: string
  currency: string
  nights: number
  disabledAttributes?: number[]
  readonly?: boolean
}

/**
 * AttributesCategories connected to cart context
 */
const ConnectedAttributesCategories: React.FC<ConnectedAttributesCategoriesProps> = ({
  categories,
  bookingKey,
  currency,
  nights,
  disabledAttributes = [],
  readonly = false,
}) => {
  const { toggleItem, isItemSelected, isItemLoading } = useCartStory()
  const disabledSet = useMemo(() => new Set(disabledAttributes), [disabledAttributes])
  const sortedCategories = useMemo(() => sortAttributesByExclusivity(categories), [categories])
  const displaySettings = useAttributeDisplaySettings(DEFAULT_ATTRIBUTE_DISPLAY_CONFIG)

  const handleToggle = useCallback(
    (attribute: RoomCustomizationCategory['attributes'][0], categoryId: number) => {
      const cartItem: CartItem = {
        id: `attr-${attribute.id}`,
        name: attribute.name,
        amount: attribute.amount,
        bookingKey,
        categoryId,
        attributeId: attribute.id,
        type: 'attribute',
      }
      toggleItem(cartItem)
    },
    [bookingKey, toggleItem]
  )

  return (
    <AttributesCategories
      categories={sortedCategories}
      renderAttributeCard={(attribute, categoryId) => {
        const itemId = `attr-${attribute.id}`
        const isSelected = isItemSelected(itemId)
        const isLoading = isItemLoading(itemId)
        const disabled = Boolean(attribute.disabled || disabledSet.has(attribute.id) || isLoading)
        const pricePerNight = nights ? attribute.amount / nights : attribute.amount

        return (
          <AttributeCard
            key={attribute.id}
            attribute={attribute}
            isSelected={isSelected}
            disabled={disabled}
            onToggle={() => handleToggle(attribute, categoryId)}
            originalPrice={pricePerNight}
            displayCurrency={currency}
            readonly={readonly}
          />
        )
      }}
      displayConfig={{
        initialVisibleCount: displaySettings.initialVisibleCount,
        showMoreThreshold: displaySettings.showMoreThreshold,
        showMoreLabel: displaySettings.showMoreLabel,
        showLessLabel: displaySettings.showLessLabel,
      }}
    />
  )
}

interface ConnectedPricingSummaryPanelProps {
  labels: UILabels
  loading?: boolean
  readonly?: boolean
  exclusiveAccordion?: boolean
  onConfirm?: () => void
}

/**
 * MultiBookingPricingSummaryPanel connected to cart context
 */
const ConnectedPricingSummaryPanel: React.FC<ConnectedPricingSummaryPanelProps> = ({
  labels,
  loading = false,
  readonly = false,
  exclusiveAccordion = true,
  onConfirm,
}) => {
  const { rooms, formattedBookings, formattedOverallTotal, removeItem, isLoading } = useCartStory()

  // Combine loading states
  const isAnyLoading = loading || Object.keys(isLoading).length > 0

  // Accordion state management
  const { activeRooms, setActiveRooms, initialActiveRooms } = useAccordionState({
    rooms: rooms ?? [],
    exclusiveAccordion,
  })

  const handleRemoveItem = useCallback(
    (bookingKey: string, itemId: string) => {
      removeItem(itemId)
    },
    [removeItem]
  )

  const handleActiveRoomsChange = useCallback(
    (nextRooms: string[]) => {
      setActiveRooms(nextRooms)
    },
    [setActiveRooms]
  )

  return (
    <MultiBookingPricingSummaryPanel
      rooms={rooms}
      formattedBookings={formattedBookings}
      formattedOverallTotal={formattedOverallTotal}
      labels={labels}
      loading={isAnyLoading}
      readonly={readonly}
      exclusiveAccordion={exclusiveAccordion}
      activeRooms={activeRooms}
      initialActiveRooms={initialActiveRooms}
      onActiveRoomsChange={handleActiveRoomsChange}
      onRemoveItem={handleRemoveItem}
      onConfirm={onConfirm}
    />
  )
}

export interface RoomCustomizationStoryWrapperProps {
  // Cart configuration
  initialItems?: CartItem[]
  bookings: BookingInfo[]
  config?: Partial<TransformConfig>

  // UI configuration
  categories: RoomCustomizationCategory[]
  labels: UILabels
  currency: string
  nights: number

  // Optional props
  disabledAttributes?: number[]
  readonly?: boolean
  loading?: boolean
  exclusiveAccordion?: boolean
  onConfirm?: () => void
  onStateChange?: (state: { items: CartItem[]; isLoading: Record<string, boolean> }) => void

  // Layout configuration
  layout?: 'side-by-side' | 'stacked'
  showTitle?: boolean
  title?: string
  description?: string
}

/**
 * Wrapper component that provides synchronized state between
 * AttributesCategories and MultiBookingPricingSummaryPanel
 */
export const RoomCustomizationStoryWrapper: React.FC<RoomCustomizationStoryWrapperProps> = ({
  initialItems = [],
  bookings,
  config,
  categories,
  labels,
  currency,
  nights,
  disabledAttributes,
  readonly = false,
  loading = false,
  exclusiveAccordion = true,
  onConfirm,
  onStateChange,
  layout = 'side-by-side',
  showTitle = true,
  title = 'Customize your stay',
  description = 'Pick room add-ons to tailor the experience. Selections update the cart in real-time.',
}) => {
  // For single booking, use the first booking key
  const primaryBookingKey = bookings[0]?.bookingKey || 'default'

  return (
    <CartStoryProvider
      initialItems={initialItems}
      bookings={bookings}
      config={config}
      onStateChange={onStateChange}
    >
      <div className={layout === 'side-by-side' ? 'grid grid-cols-1 gap-6 lg:grid-cols-2' : 'space-y-6'}>
        {/* Left side: Attribute selection */}
        <div className="space-y-6">
          {showTitle && (
            <div className="space-y-2">
              <h2 className="font-semibold text-foreground text-xl">{title}</h2>
              <p className="text-muted-foreground text-sm">{description}</p>
            </div>
          )}
          <ConnectedAttributesCategories
            categories={categories}
            bookingKey={primaryBookingKey}
            currency={currency}
            nights={nights}
            disabledAttributes={disabledAttributes}
            readonly={readonly}
          />
        </div>

        {/* Right side: Pricing summary */}
        <div className={layout === 'side-by-side' ? 'lg:sticky lg:top-6 lg:self-start' : ''}>
          <ConnectedPricingSummaryPanel
            labels={labels}
            loading={loading}
            readonly={readonly}
            exclusiveAccordion={exclusiveAccordion}
            onConfirm={onConfirm}
          />
        </div>
      </div>
    </CartStoryProvider>
  )
}
