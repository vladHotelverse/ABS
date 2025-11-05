import type { Meta, StoryObj } from '@storybook/react'
import { BookingAccordionCard } from '@/components/upsell/ViewCards'
import {
  bookingAccordionCardArgs,
  bookingAccordionCardArgsWithSpecialOffers,
  bookingAccordionTranslations,
} from './mockData'
import { createTranslator, passthroughDate } from './utils'

const meta = {
  title: 'Upsell/BookingAccordionCard',
  component: BookingAccordionCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# BookingAccordionCard Component

Displays booking information with upgrades, special offers, and customizations.

## Features
- Room details with image
- Upgrade information
- Special offers with pricing details
- Room customizations
- Status badges (confirmed, cancelled, etc.)
- Cancel request functionality

## Pricing Categories
1. **Upgrades**: Room type upgrades (green price indicator)
2. **Special Offers**: Ancillary services like spa, transfers, all-inclusive (blue price indicator)
3. **Customizations**: Room attributes and add-ons (green price indicator)
        `,
      },
    },
  },
} satisfies Meta<typeof BookingAccordionCard>

export default meta
type Story = StoryObj<typeof meta>

const bookingAccordionT = createTranslator(bookingAccordionTranslations)

export const SingleCard: Story = {
  name: 'Basic Card (Upgrade + Customizations)',
  args: {
    ...bookingAccordionCardArgs,
    onCancelBookingClick: () => {},
    formatDate: passthroughDate,
    t: bookingAccordionT,
  },
}

export const WithSpecialOffers: Story = {
  name: 'Card with Special Offers',
  args: {
    ...bookingAccordionCardArgsWithSpecialOffers,
    onCancelBookingClick: () => {},
    formatDate: passthroughDate,
    t: bookingAccordionT,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates how special offers appear alongside upgrades and customizations. Special offers use blue pricing to distinguish from other items.',
      },
    },
  },
}

export const TwoCardsStacked: Story = {
  name: 'Multiple Cards Comparison',
  render: () => (
    <div className="space-y-6">
      <BookingAccordionCard
        {...bookingAccordionCardArgs}
        onCancelBookingClick={() => {}}
        formatDate={passthroughDate}
        t={bookingAccordionT}
      />
      <BookingAccordionCard
        {...bookingAccordionCardArgsWithSpecialOffers}
        onCancelBookingClick={() => {}}
        formatDate={passthroughDate}
        t={bookingAccordionT}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows comparison between a basic booking and one with special offers.',
      },
    },
  },
}
