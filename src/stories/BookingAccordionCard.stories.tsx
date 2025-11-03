import type { Meta, StoryObj } from '@storybook/react'
import { BookingAccordionCard } from '@/components/upsell/ViewCards'
import { bookingAccordionCardArgs, bookingAccordionTranslations } from './mockData'
import { createTranslator, passthroughDate } from './utils'

const meta = {
  title: 'Upsell/BookingAccordionCard',
  component: BookingAccordionCard,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof BookingAccordionCard>

export default meta
type Story = StoryObj<typeof meta>

const bookingAccordionT = createTranslator(bookingAccordionTranslations)

export const SingleCard: Story = {
  args: {
    ...bookingAccordionCardArgs,
    onCancelBookingClick: () => {},
    formatDate: passthroughDate,
    t: bookingAccordionT,
  },
}

export const TwoCardsStacked: Story = {
  render: () => (
    <div className="space-y-6">
      <BookingAccordionCard
        {...bookingAccordionCardArgs}
        onCancelBookingClick={() => {}}
        formatDate={passthroughDate}
        t={bookingAccordionT}
      />
      <BookingAccordionCard
        {...bookingAccordionCardArgs}
        occupancy={{ adults: 4, childs: 0, infants: 0 }}
        formattedTotalPrice="€480.00"
        onCancelBookingClick={() => {}}
        formatDate={passthroughDate}
        t={bookingAccordionT}
      />
    </div>
  ),
}
