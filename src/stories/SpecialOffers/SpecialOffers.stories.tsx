import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import SpecialOffers from '@/components/upsell/SpecialOffers'
import type { OfferData, OfferSelection, OfferType } from '@/components/upsell/SpecialOffers/types'
import { useOfferPricing } from './hooks/useOfferPricing'
import { useOfferSelections } from './hooks/useOfferSelections'
import { useOfferBooking } from './hooks/useOfferBooking'
import { createOfferDataFromSelection } from './utils/offerItemConverter'
import { formatOfferCards } from './utils/offerFormatter'
import { getDefaultLabels } from './utils/labels'
import {
  mockOffers,
  mockFeaturedOffers,
  mockSingleOffer,
  mockDateSelectionOffers,
  mockReservationInfo,
  mockLongStayReservationInfo,
  mockShortStayReservationInfo,
} from './data/mockOffers'

const meta: Meta<typeof SpecialOffers> = {
  title: 'Upsell/SpecialOffers',
  component: SpecialOffers,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# SpecialOffers Component

A pure presentation component for displaying and managing special offer bookings.

## Architecture

This component is **fully controlled** - all state and business logic is handled externally:
- **UI Layer**: Pure presentation components in \`components/upsell/SpecialOffers/\`
- **Business Logic**: Hooks in \`stories/SpecialOffers/hooks/\` demonstrate integration patterns
- **State Management**: Parent component controls selections, bookings, and validation

## Integration

The component requires pricing utilities and callbacks from parent. See stories below for examples:
- Default: Basic integration with hooks
- Controlled: Manually controlled state
- Multibooking: Integration with bookingStore (see SpecialOffersMultibooking.stories.tsx)

## Hooks

Three hooks provide business logic:
- \`useOfferPricing\`: Price formatting and calculations
- \`useOfferSelections\`: Selection state management
- \`useOfferBooking\`: Booking validation and callbacks

NOTE: String-matching offer detection (All Inclusive, Late Checkout, Online Check-in) is documented for future refactoring.
        `,
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SpecialOffers>

/**
 * Wrapper component that integrates hooks with the controlled SpecialOffers component
 */
function SpecialOffersWithHooks({
  offers,
  currencySymbol = '€',
  reservationInfo,
  onOfferBooked,
}: {
  offers: OfferType[]
  currencySymbol?: string
  reservationInfo?: typeof mockReservationInfo
  onOfferBooked?: (offerData: OfferData) => void
}) {
  // Initialize pricing utilities
  const { formatPrice, calculateTotal, getUnitLabel } = useOfferPricing(currencySymbol, reservationInfo)

  // Initialize selection state
  const {
    selections,
    bookedOffers,
    bookingAttempts,
    updateQuantity,
    updateSelectedDate,
    updateSelectedDates,
    setBookedOffers,
    setBookingAttempts,
    setSelections,
  } = useOfferSelections({
    offers,
    reservationInfo,
  })

  // Get default labels
  const labels = getDefaultLabels()

  // Booking handler that creates OfferData
  const handleBook = (offerId: number) => {
    const offer = offers.find((o) => o.id === offerId)
    if (!offer) return

    const selection = selections[offerId]
    const calculatedPrice = calculateTotal(offer, selection)

    const offerData = createOfferDataFromSelection(offer, selection, calculatedPrice)

    // Toggle booking state
    if (bookedOffers.has(offerId)) {
      // Remove booking
      const newBooked = new Set(bookedOffers)
      newBooked.delete(offerId)
      setBookedOffers(newBooked)

      // Call with quantity 0 to signal removal
      onOfferBooked?.({ ...offerData, quantity: 0 })
    } else {
      // Add booking
      const newBooked = new Set(bookedOffers)
      newBooked.add(offerId)
      setBookedOffers(newBooked)

      onOfferBooked?.(offerData)
    }
  }

  // Convert Set to Record for validation display
  const showValidation: Record<number, boolean> = {}
  bookingAttempts.forEach((id) => {
    showValidation[id] = true
  })

  // Format offer cards with pre-calculated data
  const cardData = formatOfferCards(
    offers,
    selections,
    Array.from(bookedOffers),
    currencySymbol,
    labels,
    formatPrice,
    calculateTotal,
    getUnitLabel,
    showValidation
  )

  return (
    <SpecialOffers
      cardData={cardData}
      onUpdateQuantity={updateQuantity}
      onUpdateSelectedDate={updateSelectedDate}
      onUpdateSelectedDates={updateSelectedDates}
      onBookOffer={handleBook}
      labels={labels}
    />
  )
}

/**
 * Default story - standard grid with all offers
 */
export const Default: Story = {
  render: () => (
    <SpecialOffersWithHooks
      offers={mockOffers}
      reservationInfo={mockReservationInfo}
      onOfferBooked={(data) => console.log('Offer booked:', data)}
    />
  ),
}

/**
 * Featured offers only - smaller selection
 */
export const FeaturedOnly: Story = {
  render: () => (
    <SpecialOffersWithHooks
      offers={mockFeaturedOffers}
      reservationInfo={mockReservationInfo}
      onOfferBooked={(data) => console.log('Offer booked:', data)}
    />
  ),
}

/**
 * Single offer layout
 */
export const SingleOffer: Story = {
  render: () => (
    <SpecialOffersWithHooks
      offers={mockSingleOffer}
      reservationInfo={mockReservationInfo}
      onOfferBooked={(data) => console.log('Offer booked:', data)}
    />
  ),
}

/**
 * Date selection offers - demonstrates offers requiring date selection
 */
export const WithDateSelection: Story = {
  render: () => (
    <SpecialOffersWithHooks
      offers={mockDateSelectionOffers}
      reservationInfo={mockReservationInfo}
      onOfferBooked={(data) => console.log('Offer booked:', data)}
    />
  ),
}

/**
 * Long stay - demonstrates pricing with longer reservation
 */
export const LongStay: Story = {
  render: () => (
    <SpecialOffersWithHooks
      offers={mockOffers}
      reservationInfo={mockLongStayReservationInfo}
      onOfferBooked={(data) => console.log('Offer booked:', data)}
    />
  ),
}

/**
 * Short stay - demonstrates pricing with minimal stay
 */
export const ShortStay: Story = {
  render: () => (
    <SpecialOffersWithHooks
      offers={mockOffers}
      reservationInfo={mockShortStayReservationInfo}
      onOfferBooked={(data) => console.log('Offer booked:', data)}
    />
  ),
}

/**
 * Different currency - demonstrates currency symbol customization
 */
export const DifferentCurrency: Story = {
  render: () => (
    <SpecialOffersWithHooks
      offers={mockOffers}
      currencySymbol="$"
      reservationInfo={mockReservationInfo}
      onOfferBooked={(data) => console.log('Offer booked:', data)}
    />
  ),
}

/**
 * No reservation context - offers without reservation info
 */
export const NoReservationContext: Story = {
  render: () => (
    <SpecialOffersWithHooks offers={mockOffers} onOfferBooked={(data) => console.log('Offer booked:', data)} />
  ),
}

/**
 * Interactive example with booking log
 */
export const WithBookingLog: Story = {
  render: () => {
    const [bookingLog, setBookingLog] = useState<OfferData[]>([])

    const handleOfferBooked = (data: OfferData) => {
      setBookingLog((prev) => [...prev, data])
    }

    return (
      <div className="space-y-6">
        <SpecialOffersWithHooks offers={mockOffers} reservationInfo={mockReservationInfo} onOfferBooked={handleOfferBooked} />

        {bookingLog.length > 0 && (
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-4 text-lg font-semibold">Booking Log</h3>
            <div className="space-y-2">
              {bookingLog.map((booking, index) => (
                <div key={index} className="rounded border border-border/50 bg-muted p-3 text-sm">
                  <div className="font-medium">{booking.name}</div>
                  <div className="text-muted-foreground">
                    Price: €{booking.price.toFixed(2)} | Quantity: {booking.quantity} | Type: {booking.type}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  },
}

/**
 * Mobile viewport
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => (
    <SpecialOffersWithHooks
      offers={mockOffers}
      reservationInfo={mockReservationInfo}
      onOfferBooked={(data) => console.log('Offer booked:', data)}
    />
  ),
}

/**
 * Tablet viewport
 */
export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  render: () => (
    <SpecialOffersWithHooks
      offers={mockOffers}
      reservationInfo={mockReservationInfo}
      onOfferBooked={(data) => console.log('Offer booked:', data)}
    />
  ),
}
