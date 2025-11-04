/**
 * Shared utilities and configurations for PricingSummaryPanel stories
 * Prevents code duplication across story files
 */
import type React from 'react'
import type { UILabels } from '../../components/upsell/PricingSummaryPanel/types'
import type { Booking } from '../../components/upsell/PricingSummaryPanel/components/BookingInfoSection'

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

/**
 * NOTE: The PricingStoryComponent has been removed as it referenced non-existent hooks.
 * For synchronized cart demos, use RoomCustomizationStoryWrapper from src/stories/components/
 * For static pricing panel demos, use MultiBookingPricingSummaryPanel directly with mock data.
 */

// Action handlers for Storybook
export const storyActions = {
  onItemRemove: (itemId: string | number) => {
    console.log(`Remove item: ${itemId}`)
  },
  onConfirm: () => {
    console.log('Confirm booking')
  },
}
