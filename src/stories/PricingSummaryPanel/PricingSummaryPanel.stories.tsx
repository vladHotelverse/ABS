import type { Meta, StoryObj } from '@storybook/react'
import React, { useCallback } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import BookingBanner from '@/components/upsell/BookingBanner'
import {
  ResponsiveContent,
  ResponsiveHeader,
  ResponsiveLayout,
  ResponsiveMain,
  ResponsiveMobileWidget,
  ResponsiveSidebar,
} from '@/components/upsell/Layout'
import MultiBookingPricingSummaryPanel from '@/components/upsell/PricingSummaryPanel/MultiBookingPricingSummaryPanel'
import useAccordionState from './hooks/useAccordionState'
import {
  defaultRoomCustomizationCategories,
  fourRoomsBookings,
  fourRoomsSummary,
  multiBookingSummary,
  multiRoomSummary,
  pricingSummaryLabels,
  singleBookingSummary,
  singleRoomSummary,
} from '../mockData'
import { RoomCustomizationPreview } from '../utils/RoomCustomizationPreview'

const PricingLayoutPreview: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ResponsiveLayout showMobileWidget className="bg-slate-100">
    <ResponsiveHeader>
      <div className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-64" />
          </div>
          <Skeleton className="h-10 w-36 rounded-md" />
        </div>
      </div>
    </ResponsiveHeader>

    <div className="bg-white shadow-sm">
      <BookingBanner
        welcomeText={{ salutation: 'Welcome back, Alex!' }}
        hotelName="Hotel Paradise Resort"
        hotelImage="https://cdn.hotelverse.tech/renderimages/h323/views/01_main-0060/37fd4da9-4801-458d-9886-33a5d8521482/original.webp"
        companyLogo="https://cdn.hotelverse.tech/logos/h323/fc48c20e-9a2e-414d-ba2e-2863aa069ae5/original.webp"
        bookingDateRange="12 Aug 2024 - 19 Aug 2024"
        bookingReference="BCN-458921"
      />
    </div>

    <ResponsiveMain>
      <ResponsiveContent>
        <div className="space-y-6">
          <RoomCustomizationPreview
            title="Customize your stay"
            description="Pick room add-ons to tailor the experience before guests arrive."
            currency="EUR"
            nights={4}
            categories={defaultRoomCustomizationCategories}
          />

          <section className="rounded-lg bg-white p-6 shadow-sm">
            <div className="space-y-3">
              <Skeleton className="h-6 w-56" />
              <Skeleton className="h-4 w-72" />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Skeleton className="h-32 rounded-lg" />
              <Skeleton className="h-32 rounded-lg" />
            </div>
          </section>
        </div>
      </ResponsiveContent>
      <ResponsiveSidebar>{children}</ResponsiveSidebar>
    </ResponsiveMain>

    <ResponsiveMobileWidget>
      <div className="border-border border-t bg-white p-4 shadow-[0_-4px_12px_rgba(15,23,42,0.08)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="space-y-1">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
          <Skeleton className="h-10 w-28 rounded-md" />
        </div>
      </div>
    </ResponsiveMobileWidget>
  </ResponsiveLayout>
)

const meta = {
  title: 'Upsell/PricingSummaryPanel',
  component: MultiBookingPricingSummaryPanel,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story: React.ComponentType) => (
      <PricingLayoutPreview>
        <Story />
      </PricingLayoutPreview>
    ),
  ],
  argTypes: {
    loading: { control: 'boolean' },
    readonly: { control: 'boolean' },
    exclusiveAccordion: { control: 'boolean' },
  },
} satisfies Meta<typeof MultiBookingPricingSummaryPanel>

export default meta
type Story = StoryObj<typeof meta>

const AccordionStateStory: React.FC<React.ComponentProps<typeof MultiBookingPricingSummaryPanel>> = ({
  rooms,
  exclusiveAccordion = false,
  onActiveRoomsChange,
  ...rest
}) => {
  const safeRooms = rooms ?? []
  const { activeRooms, setActiveRooms, initialActiveRooms } = useAccordionState({
    rooms: safeRooms,
    exclusiveAccordion,
  })

  const handleActiveRoomsChange = useCallback(
    (nextRooms: string[]) => {
      setActiveRooms(nextRooms)
      onActiveRoomsChange?.(nextRooms)
    },
    [onActiveRoomsChange, setActiveRooms]
  )

  return (
    <MultiBookingPricingSummaryPanel
      {...rest}
      rooms={safeRooms}
      exclusiveAccordion={exclusiveAccordion}
      activeRooms={activeRooms}
      initialActiveRooms={initialActiveRooms}
      onActiveRoomsChange={handleActiveRoomsChange}
    />
  )
}

export const Default: Story = {
  args: {
    rooms: multiRoomSummary,
    formattedBookings: multiBookingSummary,
    formattedOverallTotal: '€1,045.00',
    labels: pricingSummaryLabels,
    exclusiveAccordion: true,
    onRemoveItem: (bookingKey, itemId) => {
      console.log('Remove item', { bookingKey, itemId })
    },
    onConfirm: () => console.log('Confirm selection'),
  },
  render: (args) => <AccordionStateStory {...args} />,
  parameters: {
    docs: {
      description: {
        story: `
Matches the sidebar integration used in \`apps/upsell-app\`. The \`MultiBookingPricingSummaryPanel\` receives the same
pre-formatted rooms, booking metadata, and labels that \`usePricingSummaryPanel\` delivers so designers can preview the
cart summary without opening the full application.
        `,
      },
    },
  },
}

export const SingleRoom: Story = {
  args: {
    rooms: singleRoomSummary,
    formattedBookings: singleBookingSummary,
    formattedOverallTotal: '€1,120.00',
    labels: pricingSummaryLabels,
    exclusiveAccordion: true,
    onConfirm: () => console.log('Confirm single room'),
  },
  render: (args) => <AccordionStateStory {...args} />,
  parameters: {
    docs: {
      description: {
        story: `
Single-booking scenario where the accordion collapses into the compact card used for one room stays.
        `,
      },
    },
  },
}

export const Loading: Story = {
  args: {
    rooms: multiRoomSummary,
    formattedBookings: multiBookingSummary,
    formattedOverallTotal: '€1,045.00',
    labels: pricingSummaryLabels,
    loading: true,
    exclusiveAccordion: true,
  },
  render: (args) => <AccordionStateStory {...args} />,
  parameters: {
    docs: {
      description: {
        story: `
Displays the loading veil shown while the cart recalculates after adding or removing upgrades.
        `,
      },
    },
  },
}

export const ReadOnly: Story = {
  args: {
    rooms: multiRoomSummary,
    formattedBookings: multiBookingSummary,
    formattedOverallTotal: '€1,045.00',
    labels: pricingSummaryLabels,
    readonly: true,
    exclusiveAccordion: true,
  },
  render: (args) => <AccordionStateStory {...args} />,
  parameters: {
    docs: {
      description: {
        story: `
Read-only mode for confirmation flows where guests review selections but cannot edit the cart.
        `,
      },
    },
  },
}

export const DynamicHeightTest: Story = {
  args: {
    rooms: fourRoomsSummary,
    formattedBookings: fourRoomsBookings,
    formattedOverallTotal: '€5,965.00',
    labels: pricingSummaryLabels,
    exclusiveAccordion: false,
    onRemoveItem: (bookingKey, itemId) => {
      console.log('Remove item', { bookingKey, itemId })
    },
    onConfirm: () => console.log('Confirm selection'),
  },
  render: (args) => <AccordionStateStory {...args} />,
  parameters: {
    viewport: {
      defaultViewport: 'smallDesktop',
    },
  },
}
