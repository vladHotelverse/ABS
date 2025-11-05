import type { Meta, StoryObj } from '@storybook/react'
import { BookingAccordionCardV2 } from '@/components/upsell/ViewCards'
import {
  bookingAccordionCardArgs,
  bookingAccordionCardArgsWithSpecialOffers,
  bookingAccordionTranslations,
} from './mockData'
import { createTranslator, passthroughDate } from './utils'

const meta = {
  title: 'Upsell/BookingAccordionCardV2',
  component: BookingAccordionCardV2,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# BookingAccordionCard V2 - Airline-Style Upsell Receipt

Redesigned booking card with progressive disclosure and scannable layout patterns.

## ✨ Key Features

### 1. **Collapsible Item Cards**
- **Pill-like summary**: Icon + Title + Price in one line
- **Expand for details**: 2-column spec table with metadata
- **Progressive disclosure**: Hide complexity, show on demand

### 2. **Visual Receipt Panel**
- **Clear price breakdown**: All items with aligned prices
- **Consistent formatting**: Easy math perception
- **Sticky positioning**: Always visible when scrolling

### 3. **Icon System**
- **Visual categorization**: Unique icon per benefit type
- **Automatic detection**: Smart icon assignment based on title
- **Types**: upgrade, all-inclusive, spa, transport, dining, room

### 4. **Chips & Tags**
- **Amenity badges**: Compact, scannable room features
- **Status badges**: Visual confirmation states
- **Detail chips**: Expandable metadata as tags

### 5. **Information Architecture**
- **Chunking**: Each add-on in its own micro-card
- **Hierarchy**: Clear section titles with counts
- **Spacing**: Generous padding for breathing room

## 🎨 Design Patterns

Following best practices from:
- ✈️ **Airlines**: Ryanair, Emirates add-ons UI
- 🏨 **Hotels**: Hotels.com, Hilton receipt layouts
- 🛒 **E-commerce**: Amazon order summary

## 🎯 UX Principles

| Principle | Implementation |
|-----------|---------------|
| Information density control | Collapse & summarize groups |
| Chunking | Micro-cards per upgrade |
| Pattern recognition | Icons, consistent price column |
| Cognitive ease | Visual receipt breakdown |
| User control | Expand only when needed |

## 📐 Layout Enhancements

- ✅ Raised card padding & line height
- ✅ Stronger section titles with item counts
- ✅ Iconography for each benefit type
- ✅ Subtitle for grouped add-ons
- ✅ Generous divider spacing
- ✅ Visual receipt panel
        `,
      },
    },
  },
} satisfies Meta<typeof BookingAccordionCardV2>

export default meta
type Story = StoryObj<typeof meta>

const bookingAccordionT = createTranslator(bookingAccordionTranslations)

export const BasicWithUpgrade: Story = {
  name: '✨ Basic (Upgrade + Customizations)',
  args: {
    ...bookingAccordionCardArgs,
    onCancelBookingClick: () => {},
    formatDate: passthroughDate,
    t: bookingAccordionT,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows a booking with room upgrade and customizations using collapsible cards. Click items to expand and see details.',
      },
    },
  },
}

export const WithSpecialOffers: Story = {
  name: '🎁 Full Package (Upgrade + Offers + Extras)',
  args: {
    ...bookingAccordionCardArgsWithSpecialOffers,
    onCancelBookingClick: () => {},
    formatDate: passthroughDate,
    t: bookingAccordionT,
  },
  parameters: {
    docs: {
      description: {
        story: `
Shows a complete booking with all add-on types:
- 🏨 Room Upgrade (green pricing)
- 🎁 Special Offers (blue pricing) - All-Inclusive, Spa, Airport Transfer
- ✨ Extras (green pricing) - Late Checkout, Pillow Menu

Features:
- Each item is collapsible with expand/collapse
- Icons automatically matched to benefit type
- Visual receipt shows total breakdown
- 2-column spec table in expanded state
- Amenities shown as compact chips
        `,
      },
    },
  },
}

export const ComparisonView: Story = {
  name: '📊 Before/After Comparison',
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 font-bold text-lg">Basic Booking</h3>
        <BookingAccordionCardV2
          {...bookingAccordionCardArgs}
          onCancelBookingClick={() => {}}
          formatDate={passthroughDate}
          t={bookingAccordionT}
        />
      </div>
      <div>
        <h3 className="mb-4 font-bold text-lg">Premium Package</h3>
        <BookingAccordionCardV2
          {...bookingAccordionCardArgsWithSpecialOffers}
          onCancelBookingClick={() => {}}
          formatDate={passthroughDate}
          t={bookingAccordionT}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of basic booking vs. premium package with all add-ons.',
      },
    },
  },
}

export const MobileView: Story = {
  name: '📱 Mobile Responsive',
  args: {
    ...bookingAccordionCardArgsWithSpecialOffers,
    onCancelBookingClick: () => {},
    formatDate: passthroughDate,
    t: bookingAccordionT,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Optimized for mobile screens with responsive layout and touch-friendly controls.',
      },
    },
  },
}
