/**
 * Shared utilities and configurations for PricingSummaryPanel stories
 * Prevents code duplication across story files
 */
import type React from 'react'
import {
  type BookingDisplay,
  type CartServiceConfig,
  HOTEL_CART_CONFIG,
  HOTEL_SECTION_CONFIG,
  type PricingItem,
  PurePricingSummaryPanel,
  type SectionConfig,
  type UILabels,
  UPSELL_CART_CONFIG,
  UPSELL_SECTION_CONFIG,
  useCartManagement,
  usePricingLogic,
} from '../../components/upsell/PricingSummaryPanel'
import type { Booking } from '../../components/upsell/PricingSummaryPanel/components/BookingInfoSection'
import { formatCurrency } from '../../lib/currency'

// Story decorator for consistent layout
export const PricingPanelDecorator = (Story: React.ComponentType) => (
  <div className="mx-auto max-w-md p-4">
    <Story />
  </div>
)

// Convert legacy bookings to display format
export const convertBookingsToDisplay = (
  bookings: Booking[],
  roomTypesDict: Record<string, { roomTypeName: string }> = {}
): BookingDisplay[] => {
  return bookings.map((booking) => ({
    id: booking.bookingKey,
    bookingKey: booking.bookingKey,
    checkInDate: booking.checkInDate,
    checkOutDate: booking.checkOutDate,
    guestName: `${booking.firstName || ''} ${booking.lastName || ''}`.trim(),
    roomTypeName: roomTypesDict[booking.internalRoomTypeCode || '']?.roomTypeName,
    nights:
      booking.checkInDate && booking.checkOutDate
        ? Math.ceil(
            (new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) / (1000 * 60 * 60 * 24)
          )
        : 1,
    totalGuests: (booking.occupancy?.adults || 0) + (booking.occupancy?.childs || 0),
  }))
}

// Standard UI labels for stories
export const createUILabels = (overrides: Partial<UILabels> = {}): UILabels => ({
  subtotalLabel: 'Subtotal',
  totalLabel: 'Total',
  payAtHotelLabel: 'Pay at hotel',
  viewTermsLabel: 'View terms',
  confirmButtonLabel: 'Confirm Booking',
  loadingLabel: 'Loading...',
  emptyCartMessage: 'Your selection is empty',
  removeLabel: 'Remove',
  guestsLabel: 'guests',
  guestLabel: 'guest',
  nightsLabel: 'nights',
  nightLabel: 'night',
  roomsCountLabel: 'rooms',
  singleRoomLabel: 'room',
  exploreLabel: 'Explore',
  fromLabel: 'from',
  customizeStayTitle: 'Customize your stay',
  chooseOptionsSubtitle: 'Choose from our available options',
  currencySymbol: '€',
  pricingSummaryLabel: 'Pricing Summary',
  processingLabel: 'Processing...',
  ...overrides,
})

// Spanish UI labels
export const spanishUILabels: UILabels = createUILabels({
  subtotalLabel: 'Subtotal',
  totalLabel: 'Total',
  payAtHotelLabel: 'Pagar en hotel',
  viewTermsLabel: 'Ver términos',
  confirmButtonLabel: 'Confirmar Reserva',
  loadingLabel: 'Cargando...',
  emptyCartMessage: 'Tu selección está vacía',
  removeLabel: 'Eliminar',
  guestsLabel: 'huéspedes',
  guestLabel: 'huésped',
  nightsLabel: 'noches',
  nightLabel: 'noche',
  roomsCountLabel: 'habitaciones',
  singleRoomLabel: 'habitación',
  pricingSummaryLabel: 'Resumen de Precios',
  processingLabel: 'Procesando...',
})

// Story component for pure pricing panel with business logic
interface PricingStoryProps {
  items: PricingItem[]
  bookings: BookingDisplay[]
  labels?: UILabels
  currency?: string
  locale?: string
  loading?: boolean
  disabled?: boolean
  sectionConfig?: SectionConfig
  cartConfig?: CartServiceConfig
  onItemRemove?: (itemId: string | number) => void
  onConfirm?: () => void
}

export const PricingStoryComponent: React.FC<PricingStoryProps> = ({
  items,
  bookings,
  labels = createUILabels(),
  currency = 'EUR',
  locale = 'en-US',
  loading = false,
  disabled = false,
  sectionConfig = HOTEL_SECTION_CONFIG,
  cartConfig = HOTEL_CART_CONFIG,
  onItemRemove,
  onConfirm,
}) => {
  // Set up cart management
  const cartManagement = useCartManagement({
    initialItems: items,
    config: cartConfig,
    onItemsChange: undefined,
    onOperationResult: (result) => {
      console.log('Cart operation:', result)
    },
  })

  // Set up pricing logic
  const pricingLogic = usePricingLogic({
    items: cartManagement.items,
    sectionConfig,
    formatCurrency,
    options: {
      currency,
      locale,
      includeNightMultiplier: true,
      nights: bookings[0]?.nights || 1,
      euroSuffix: currency === 'EUR' ? '€' : currency,
    },
  })

  // Update sections to include removability information
  const sectionsWithRemovability = pricingLogic.sections.map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      removable: cartManagement.canRemoveItem(item.originalItem),
    })),
  }))

  const handleItemRemove = async (itemId: string | number) => {
    const result = await cartManagement.removeItem(itemId)
    if (onItemRemove) {
      onItemRemove(itemId)
    }
    return result
  }

  return (
    <PurePricingSummaryPanel
      sections={sectionsWithRemovability}
      pricing={pricingLogic.pricing}
      bookings={bookings}
      labels={labels}
      loading={loading || cartManagement.isRemoving}
      disabled={disabled}
      onItemRemove={handleItemRemove}
      onConfirm={onConfirm}
    />
  )
}

// Preset configurations for different app contexts
export const AppConfigurations = {
  hotel: {
    sectionConfig: HOTEL_SECTION_CONFIG,
    cartConfig: HOTEL_CART_CONFIG,
    labels: spanishUILabels,
  },
  upsell: {
    sectionConfig: UPSELL_SECTION_CONFIG,
    cartConfig: UPSELL_CART_CONFIG,
    labels: createUILabels({
      emptyCartMessage: 'No services selected',
      confirmButtonLabel: 'Confirm Selection',
      pricingSummaryLabel: 'Service Summary',
    }),
  },
}

// Common story args
export const createStoryArgs = (overrides: Partial<PricingStoryProps> = {}): PricingStoryProps => ({
  items: [],
  bookings: [],
  labels: spanishUILabels,
  currency: 'EUR',
  locale: 'es-ES',
  loading: false,
  disabled: false,
  sectionConfig: HOTEL_SECTION_CONFIG,
  cartConfig: HOTEL_CART_CONFIG,
  ...overrides,
})

// Action handlers for Storybook
export const storyActions = {
  onItemRemove: (itemId: string | number) => {
    console.log(`Remove item: ${itemId}`)
  },
  onConfirm: () => {
    console.log('Confirm booking')
  },
}
