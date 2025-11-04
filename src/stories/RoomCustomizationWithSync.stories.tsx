/**
 * Synchronized Room Customization + Pricing Summary Stories
 * Demonstrates the full interactive flow: select attribute → update cart → see in pricing
 */

import type { Meta, StoryObj } from '@storybook/react'
import { RoomCustomizationStoryWrapper } from './components/RoomCustomizationStoryWrapper'
import type { BookingInfo } from './helpers/cartTransformers'
import type { CartItem } from './hooks/useStorybookCart'
import {
  defaultRoomCustomizationCategories,
  limitedAvailabilityAttributeIds,
  pricingSummaryLabels,
} from './mockData'

const meta = {
  title: 'Upsell/RoomCustomization/Synchronized',
  component: RoomCustomizationStoryWrapper,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
**Interactive Room Customization with Live Cart Sync**

This story demonstrates the full production-like user flow where:
1. Users select/deselect attributes from categories
2. Cart state updates with simulated loading
3. Pricing summary reflects changes in real-time
4. Remove actions work bidirectionally

Built with React Context + useState (no Zustand) for Storybook isolation.
        `,
      },
    },
  },
} satisfies Meta<typeof RoomCustomizationStoryWrapper>

export default meta
type Story = StoryObj<typeof meta>

// Mock bookings for single-room scenario
const singleRoomBooking: BookingInfo[] = [
  {
    id: 'booking-1',
    bookingKey: 'booking-1',
    displayName: 'Skyline Suite',
    guestName: 'Sarah Johnson',
    checkIn: '2024-12-15',
    checkOut: '2024-12-18',
    nights: 3,
    guests: 2,
  },
]

// Mock bookings for multi-room scenario
const multiRoomBookings: BookingInfo[] = [
  {
    id: 'booking-1',
    bookingKey: 'booking-1',
    displayName: 'Skyline Suite',
    guestName: 'Sarah Johnson',
    checkIn: '2024-12-15',
    checkOut: '2024-12-18',
    nights: 3,
    guests: 2,
  },
  {
    id: 'booking-2',
    bookingKey: 'booking-2',
    displayName: 'Deluxe King Room',
    guestName: 'Miguel Torres',
    checkIn: '2024-12-15',
    checkOut: '2024-12-17',
    nights: 2,
    guests: 3,
  },
]

// Pre-filled cart items for demonstration
const prefilledCartItems: CartItem[] = [
  {
    id: 'attr-101',
    name: 'Premium Bedding Package',
    amount: 72,
    bookingKey: 'booking-1',
    categoryId: 1,
    attributeId: 101,
    type: 'attribute',
  },
  {
    id: 'attr-201',
    name: 'Sunset Ocean View',
    amount: 84,
    bookingKey: 'booking-1',
    categoryId: 2,
    attributeId: 201,
    type: 'attribute',
  },
]

/**
 * Interactive Selection - Start with empty cart
 *
 * User flow:
 * 1. Click "Add" on any attribute card
 * 2. Watch cart summary update on the right
 * 3. Click "Remove" from either location
 * 4. See totals recalculate
 */
export const InteractiveSelection: Story = {
  args: {
    initialItems: [],
    bookings: singleRoomBooking,
    categories: defaultRoomCustomizationCategories,
    labels: pricingSummaryLabels,
    currency: 'EUR',
    nights: 3,
    config: {
      currency: 'EUR',
      locale: 'en-US',
      includeNightMultiplier: false,
    },
    title: 'Customize your stay',
    description: 'Select room add-ons to see them appear in the pricing summary on the right.',
  },
  parameters: {
    docs: {
      description: {
        story: `
Start with an empty cart. Click "Add" on attribute cards to see real-time updates in the pricing summary.
The cart simulates async loading with a 300ms delay for realistic interaction.
        `,
      },
    },
  },
}

/**
 * Pre-filled Cart - Start with items already selected
 *
 * Simulates the consultation/review flow where selections come from a previous step.
 */
export const PrefilledCart: Story = {
  args: {
    initialItems: prefilledCartItems,
    bookings: singleRoomBooking,
    categories: defaultRoomCustomizationCategories,
    labels: pricingSummaryLabels,
    currency: 'EUR',
    nights: 3,
    config: {
      currency: 'EUR',
      locale: 'en-US',
      includeNightMultiplier: false,
    },
    title: 'Review your selections',
    description: 'Previously selected add-ons are highlighted. Click to adjust your choices.',
  },
  parameters: {
    docs: {
      description: {
        story: `
Demonstrates starting with pre-selected items (e.g., from URL params, previous step, or consultation call).
Users can remove existing selections or add more.
        `,
      },
    },
  },
}

/**
 * Limited Inventory - Some attributes unavailable
 *
 * Shows disabled state when attributes are out of stock or restricted.
 */
export const LimitedInventory: Story = {
  args: {
    initialItems: [],
    bookings: singleRoomBooking,
    categories: defaultRoomCustomizationCategories,
    labels: pricingSummaryLabels,
    currency: 'EUR',
    nights: 3,
    config: {
      currency: 'EUR',
      locale: 'en-US',
      includeNightMultiplier: false,
    },
    disabledAttributes: limitedAvailabilityAttributeIds,
    title: 'Limited availability',
    description: 'Some upgrades are temporarily unavailable for this booking window.',
  },
  parameters: {
    docs: {
      description: {
        story: `
Simulates service inventory fallback when availability rules disable certain attributes.
Disabled cards show tooltips and cannot be selected.
        `,
      },
    },
  },
}

/**
 * Read-only Mode - Consultation review flow
 *
 * Locked selections for review before final confirmation.
 */
export const ReadOnlyConsultation: Story = {
  args: {
    initialItems: prefilledCartItems,
    bookings: singleRoomBooking,
    categories: defaultRoomCustomizationCategories,
    labels: {
      ...pricingSummaryLabels,
      confirmButtonLabel: 'Confirm and proceed',
    },
    currency: 'EUR',
    nights: 3,
    config: {
      currency: 'EUR',
      locale: 'en-US',
      includeNightMultiplier: false,
    },
    readonly: true,
    title: 'Requested add-ons',
    description: 'Guest requested these amenities during consultation. Review before confirming.',
  },
  parameters: {
    docs: {
      description: {
        story: `
Matches the consultation/read-only flow where selections are locked for review.
Add/Remove buttons are hidden, and pricing is display-only.
        `,
      },
    },
  },
}

/**
 * Multi-booking Scenario - Independent carts per room
 *
 * NOTE: Current implementation uses single booking key for attribute selection.
 * For true multi-booking support, extend ConnectedAttributesCategories to support
 * multiple booking contexts or show separate sections per booking.
 */
export const MultipleRooms: Story = {
  args: {
    initialItems: [],
    bookings: multiRoomBookings,
    categories: defaultRoomCustomizationCategories,
    labels: pricingSummaryLabels,
    currency: 'EUR',
    nights: 3,
    config: {
      currency: 'EUR',
      locale: 'en-US',
      includeNightMultiplier: false,
    },
    exclusiveAccordion: true,
    title: 'Customize all rooms',
    description: 'Add customizations for each booking. Selections are tracked per room.',
  },
  parameters: {
    docs: {
      description: {
        story: `
Shows multi-booking scenario with accordion-based pricing summary.
Current implementation assigns all attributes to the first booking.
For production, implement per-booking attribute selection UI.
        `,
      },
    },
  },
}

/**
 * Loading State - Simulated async operations
 *
 * Demonstrates loading overlay while cart operations are in progress.
 */
export const LoadingState: Story = {
  args: {
    initialItems: prefilledCartItems,
    bookings: singleRoomBooking,
    categories: defaultRoomCustomizationCategories,
    labels: pricingSummaryLabels,
    currency: 'EUR',
    nights: 3,
    config: {
      currency: 'EUR',
      locale: 'en-US',
      includeNightMultiplier: false,
    },
    loading: true,
    title: 'Customize your stay',
    description: 'Loading state demonstration',
  },
  parameters: {
    docs: {
      description: {
        story: `
Shows the loading overlay while cart recalculates.
In practice, this would display during API calls for pricing validation.
        `,
      },
    },
  },
}

/**
 * Stacked Layout - Mobile-friendly vertical layout
 */
export const StackedLayout: Story = {
  args: {
    initialItems: [],
    bookings: singleRoomBooking,
    categories: defaultRoomCustomizationCategories,
    labels: pricingSummaryLabels,
    currency: 'EUR',
    nights: 3,
    config: {
      currency: 'EUR',
      locale: 'en-US',
      includeNightMultiplier: false,
    },
    layout: 'stacked',
    title: 'Customize your stay',
    description: 'Stacked layout for smaller viewports.',
  },
  parameters: {
    docs: {
      description: {
        story: `
Vertical layout where pricing summary appears below attribute selection.
Better for mobile or narrow viewports.
        `,
      },
    },
  },
}
