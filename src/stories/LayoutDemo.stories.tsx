import type { Meta, StoryObj } from '@storybook/react'
import { useEffect, useMemo, useState } from 'react'
import { UiButton } from '@/components/ui/button'
import BookingBanner from '@/components/upsell/BookingBanner'
import MultiBookingPricingSummaryPanel, {
  type MultiBookingPricingSummaryPanelProps,
} from '@/components/upsell/PricingSummaryPanel/MultiBookingPricingSummaryPanel'
import { RoomUpgradeCarousel } from '@/components/upsell/RoomSelectionCarousel'
import type { RoomOption } from '@/components/upsell/RoomSelectionCarousel/types'
import { BookingAccordionCard } from '@/components/upsell/ViewCards'
import { TabsStrip } from './components'
import {
  bookingViewCards,
  bookingViewTranslations,
  goldThemeOverride,
  layoutPricingBookings,
  layoutPricingLabels,
  layoutPricingRooms,
  layoutUpgradeTranslations,
  roomOptions,
} from './mockData'
import { adaptRoomsForCarousel, createTranslator, formatBookingDate } from './utils'

type UpsellLayoutStoryProps = {
  showTabs?: boolean
  carouselRooms?: RoomOption[]
  pricingRooms?: MultiBookingPricingSummaryPanelProps['rooms']
  pricingBookings?: MultiBookingPricingSummaryPanelProps['formattedBookings']
  formattedOverallTotal?: string
}

const layoutCarouselRooms = adaptRoomsForCarousel(roomOptions.slice(0, 3))

const bookingViewT = createTranslator(bookingViewTranslations)

const UpsellLayoutStory: React.FC<UpsellLayoutStoryProps> = ({
  showTabs = true,
  carouselRooms = layoutCarouselRooms,
  pricingRooms = layoutPricingRooms,
  pricingBookings = layoutPricingBookings,
  formattedOverallTotal = '€1,045.00',
}) => {
  const initialIndex = carouselRooms.length > 1 ? 1 : 0
  const [selectedRoom, setSelectedRoom] = useState<RoomOption | null>(
    carouselRooms[initialIndex] ?? carouselRooms[0] ?? null
  )
  useEffect(() => {
    setSelectedRoom(carouselRooms[initialIndex] ?? carouselRooms[0] ?? null)
  }, [carouselRooms, initialIndex])

  const [activeRooms, setActiveRooms] = useState<string[]>(() => (pricingRooms[0] ? [pricingRooms[0].id] : []))
  useEffect(() => {
    setActiveRooms(pricingRooms[0] ? [pricingRooms[0].id] : [])
  }, [pricingRooms])

  const themeOverrides = useMemo(() => goldThemeOverride, [])

  return (
    <div className="min-h-screen bg-muted pb-16" style={themeOverrides}>
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pt-10">
        <BookingBanner
          className="px-0"
          welcomeText={{ salutation: 'Welcome to Hotelverse!', greeting: 'Enjoy your stay!' }}
          hotelName="Salobre Hotel Resort & Serenity"
          hotelImage="https://cdn.hotelverse.tech/renderimages/h323/views/01_main-0060/37fd4da9-4801-458d-9886-33a5d8521482/original.webp"
          companyLogo="https://cdn.hotelverse.tech/logos/h323/fc48c20e-9a2e-414d-ba2e-2863aa069ae5/original.webp"
          bookingDateRange="2026-03-02 - 2026-03-10"
          bookingReference="# multi-3-vlad-addsafsfddsf·cu=EUR·email=vlad@hotelverse.tech·chin=2026:03:02·chout=2026:03:10"
        />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            {showTabs && (
              <div className="mb-4 flex w-full">
                <TabsStrip
                  tabs={pricingBookings.map((b) => ({
                    id: b.id,
                    label: b.displayName,
                    badge: <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{b.formattedGuests}</span>,
                  }))}
                  activeId={activeRooms[0]}
                  sticky={false}
                  className="border-0 bg-transparent"
                  onChange={(id) => setActiveRooms(id ? [id] : [])}
                />
              </div>
            )}
            <header className="space-y-2">
              <h2 className="font-bold text-2xl text-foreground">Upgrade Your Room - TRIPLE DELUXE GOLF VIEW</h2>
              <p className="text-muted-foreground text-sm">Choose an upgrade for your currently selected room.</p>
            </header>
            <div className="mt-6 overflow-hidden rounded-[24px] bg-white p-4 shadow-depth-1 ring-1 ring-border/40">
              <RoomUpgradeCarousel
                roomOptions={carouselRooms}
                initialSelectedRoom={selectedRoom}
                onRoomSelected={setSelectedRoom}
                translations={layoutUpgradeTranslations}
                enableHoverZoom
                className="w-full"
              />
            </div>
          </div>

          <MultiBookingPricingSummaryPanel
            rooms={pricingRooms}
            formattedBookings={pricingBookings}
            formattedOverallTotal={formattedOverallTotal}
            labels={layoutPricingLabels}
            activeRooms={activeRooms}
            onActiveRoomsChange={setActiveRooms}
            exclusiveAccordion
            isSticky={false}
            hideFooter={false}
          />
        </div>
      </div>
    </div>
  )
}

const BookingViewPageStory = () => (
  <div className="relative min-h-screen bg-muted pb-4" style={goldThemeOverride}>
    <div className="bg-muted max-w-6xl flex-col gap-6 px-4 py-10 mx-auto">
      <BookingBanner
        className="px-0"
        welcomeText={{ salutation: 'Welcome to Hotelverse!', greeting: 'Enjoy your stay!' }}
        hotelName="Salobre Hotel Resort & Serenity"
        hotelImage="https://cdn.hotelverse.tech/renderimages/h323/views/01_main-0060/37fd4da9-4801-458d-9886-33a5d8521482/original.webp"
        companyLogo="https://cdn.hotelverse.tech/logos/h323/fc48c20e-9a2e-414d-ba2e-2863aa069ae5/original.webp"
        bookingDateRange="2025-12-12 - 2025-12-20"
        bookingReference="# multi-3-view-page·cu=EUR·email=guest@example.com·chin=2025:12:12·chout=2025:12:20"
      />
    </div>

    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10">
      <section className="space-y-2">
        <h1 className="font-bold text-3xl text-foreground">Booking Summary</h1>
        <p className="text-muted-foreground text-sm">Manage your requests, upgrades, and extras.</p>
      </section>

      <section className="space-y-6">
        {bookingViewCards.map((booking) => (
          <BookingAccordionCard
            key={booking.bookingKey}
            {...booking}
            onCancelBookingClick={() => {}}
            formatDate={formatBookingDate}
            t={bookingViewT}
          />
        ))}
      </section>
    </main>

    <div className="sticky bottom-0 z-10 bg-muted px-4 py-4 backdrop-blur max-w-6xl mx-auto">
      <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-3 rounded-xl border p-4 text-foreground bg-white">
          <p className="text-muted-foreground text-sm">Modify your selection to change rooms, upgrades or extras.</p>
          <UiButton className="w-full sm:w-auto">Modify Selection</UiButton>
        </div>
        <div className="flex flex-col gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4">
          <p className="font-medium text-destructive text-sm">This action will cancel all requests at once.</p>
          <UiButton variant="destructive" className="w-full sm:w-auto">
            Cancel All Requests
          </UiButton>
        </div>
      </div>
    </div>
  </div>
)

const meta = {
  title: 'Upsell/LayoutDemo',
  component: UpsellLayoutStory,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof UpsellLayoutStory>

export default meta

type Story = StoryObj<typeof meta>

export const MultiBooking: Story = {
  args: {},
}

export const SingleBooking: Story = {
  args: {
    showTabs: false,
    pricingRooms: [layoutPricingRooms[0]],
    pricingBookings: [layoutPricingBookings[0]],
    formattedOverallTotal: '€685.00',
  },
}

export const BookingViewPage: Story = {
  render: () => <BookingViewPageStory />,
}
