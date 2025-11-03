import type { Meta, StoryObj } from '@storybook/react'
import type React from 'react'
import { useEffect, useMemo, useState } from 'react'
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
import { RoomUpgradeCarousel } from '@/components/upsell/RoomSelectionCarousel'
import type { RoomOption, RoomUpgradeCarouselTranslations } from '@/components/upsell/RoomSelectionCarousel/types'
import { defaultRoomCustomizationCategories, roomOptions, upgradeCarouselTranslations } from './mockData'
import { adaptRoomsForCarousel } from './utils'
import { RoomCustomizationPreview } from './utils/RoomCustomizationPreview'

type RoomSelectionStoryProps = {
  rooms: RoomOption[]
  translations?: RoomUpgradeCarouselTranslations
  enableHoverZoom?: boolean
  loading?: boolean
}

const baseRoomOptions = adaptRoomsForCarousel(roomOptions.slice(0, 4))

const PricingSidebarSkeleton: React.FC = () => (
  <div className="space-y-4">
    <div className="rounded-lg bg-white p-5 shadow-sm">
      <Skeleton className="h-5 w-40" />
      <div className="mt-4 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="mt-6 space-y-2 border-border border-t pt-4">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-5 w-3/5" />
      </div>
      <Skeleton className="mt-5 h-10 w-full rounded-md" />
    </div>
    <div className="rounded-lg bg-white p-5 shadow-sm">
      <Skeleton className="h-5 w-32" />
      <div className="mt-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  </div>
)

const RoomSelectionLayoutPreview: React.FC<{ children: React.ReactNode }> = ({ children }) => (
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
        welcomeText={{ salutation: 'Welcome back,', greeting: 'Alex!' }}
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
          <section className="rounded-lg bg-white p-6 shadow-sm">{children}</section>
          <RoomCustomizationPreview
            title="Customize your stay"
            description="Upgrades selected in the carousel will surface here for cross-checking."
            currency="EUR"
            nights={4}
            categories={defaultRoomCustomizationCategories}
          />
        </div>
      </ResponsiveContent>
      <ResponsiveSidebar>
        <PricingSidebarSkeleton />
      </ResponsiveSidebar>
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

const RoomSelectionStory: React.FC<RoomSelectionStoryProps> = ({
  rooms,
  translations = upgradeCarouselTranslations,
  enableHoverZoom = true,
  loading = false,
}) => {
  const [selectedRoom, setSelectedRoom] = useState<RoomOption | null>(rooms[0] ?? null)

  useEffect(() => {
    setSelectedRoom(rooms[0] ?? null)
  }, [rooms])

  const formattedPrice = useMemo(() => {
    if (!selectedRoom) return null
    return `${translations.currencySymbol}${selectedRoom.price}`
  }, [selectedRoom, translations.currencySymbol])

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-semibold text-foreground text-xl">Choose your upgrade</h2>
        <p className="text-muted-foreground text-sm">
          Mirrors the upsell flow where guests review upgrade rooms before customising extras.
        </p>
      </div>

      <div className="relative">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/70 backdrop-blur">
            <div className="space-y-2 rounded-lg bg-white p-4 shadow-md">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-6 w-6 animate-spin rounded-full" />
            </div>
          </div>
        )}

        <RoomUpgradeCarousel
          roomOptions={rooms}
          initialSelectedRoom={selectedRoom}
          onRoomSelected={setSelectedRoom}
          translations={translations}
          enableHoverZoom={enableHoverZoom}
          className="w-full"
        />
      </div>

      <div className="rounded-lg bg-muted p-4 shadow-inner">
        {selectedRoom ? (
          <>
            <p className="font-medium text-foreground">Selected room</p>
            <p className="mt-1 text-muted-foreground text-sm">{selectedRoom.roomType}</p>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span>{selectedRoom.title ?? selectedRoom.roomType}</span>
              <span className="font-semibold">{formattedPrice}</span>
            </div>
          </>
        ) : (
          <p className="text-muted-foreground text-sm">Select a room to preview pricing and details.</p>
        )}
      </div>
    </div>
  )
}

const meta = {
  title: 'Upsell/RoomSelectionCarousel',
  component: RoomSelectionStory,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story: React.ComponentType) => (
      <RoomSelectionLayoutPreview>
        <Story />
      </RoomSelectionLayoutPreview>
    ),
  ],
  argTypes: {
    rooms: { control: false },
    translations: { control: false },
    enableHoverZoom: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
} satisfies Meta<typeof RoomSelectionStory>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    rooms: baseRoomOptions,
  },
  parameters: {
    docs: {
      description: {
        story: `
Matches the multi-room upgrade carousel embedded in \`apps/upsell-app\`. The decorator keeps the sidebar and extra
sections visible using skeletons so the spacing mirrors production.
        `,
      },
    },
  },
}

export const TwoRooms: Story = {
  args: {
    rooms: baseRoomOptions.slice(0, 2),
  },
  parameters: {
    docs: {
      description: {
        story: `
Demonstrates the two-room layout that switches between side-by-side cards on desktop and carousel on mobile viewports.
        `,
      },
    },
  },
}

export const SingleRoom: Story = {
  args: {
    rooms: baseRoomOptions.slice(0, 1),
  },
  parameters: {
    docs: {
      description: {
        story: `
Single-room scenario collapses the carousel into a compact card, matching properties that only upsell one upgrade choice.
        `,
      },
    },
  },
}

export const HoverDisabled: Story = {
  args: {
    rooms: baseRoomOptions,
    enableHoverZoom: false,
  },
  parameters: {
    docs: {
      description: {
        story: `
Use this variant to review the component without the hover zoom overlay (useful for accessibility audits or low-bandwidth
setups).
        `,
      },
    },
  },
}

export const Loading: Story = {
  args: {
    rooms: baseRoomOptions,
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: `
Simulates the optimistic loading veil shown while the upgrade list fetches from the engine or revalidates pricing.
        `,
      },
    },
  },
}
