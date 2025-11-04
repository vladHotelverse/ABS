import type { Meta, StoryObj } from '@storybook/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { UiButton } from '@/components/ui/button'
import BookingBanner from '@/components/upsell/BookingBanner'
import MultiBookingPricingSummaryPanel, {
  type MultiBookingPricingSummaryPanelProps,
} from '@/components/upsell/PricingSummaryPanel/MultiBookingPricingSummaryPanel'
import { SectionType } from '@/components/upsell/PricingSummaryPanel/types'
import { AttributeCard, AttributesCategories } from '@/components/upsell/RoomCustomization/components'
import { RoomUpgradeCarousel } from '@/components/upsell/RoomSelectionCarousel'
import type { RoomOption } from '@/components/upsell/RoomSelectionCarousel/types'
import { BookingAccordionCard } from '@/components/upsell/ViewCards'
import SpecialOffers from '@/components/upsell/SpecialOffers'
import type { OfferSelection, OfferType } from '@/components/upsell/SpecialOffers/types'
import { TabsStrip } from './components'
import useAccordionState from './PricingSummaryPanel/hooks/useAccordionState'
import { formatOfferCards } from './SpecialOffers/utils/offerFormatter'
import { getDefaultLabels } from './SpecialOffers/utils/labels'
import { useOfferPricing } from './SpecialOffers/hooks/useOfferPricing'
import { useOfferSelections } from './SpecialOffers/hooks/useOfferSelections'
import { mockOffers, mockReservationInfo } from './SpecialOffers/data/mockOffers'
import {
  bookingViewCards,
  bookingViewTranslations,
  defaultRoomCustomizationCategories,
  brandDefaults,
  createBrandTheme,
  layoutPricingBookings,
  layoutPricingLabels,
  layoutPricingRooms,
  layoutUpgradeTranslations,
  roomOptions,
  type RoomCustomizationAttribute,
} from './mockData'
import { adaptRoomsForCarousel, createTranslator, formatBookingDate } from './utils'

type UpsellLayoutStoryProps = {
  showTabs?: boolean
  carouselRooms?: RoomOption[]
  pricingRooms?: MultiBookingPricingSummaryPanelProps['rooms']
  pricingBookings?: MultiBookingPricingSummaryPanelProps['formattedBookings']
  formattedOverallTotal?: string
  brandPrimary?: string
  brandPrimaryForeground?: string
}

type BrandThemeArgs = Pick<UpsellLayoutStoryProps, 'brandPrimary' | 'brandPrimaryForeground'>

const layoutCarouselRooms = adaptRoomsForCarousel(roomOptions.slice(0, 3))

const bookingViewT = createTranslator(bookingViewTranslations)

const UpsellLayoutStory: React.FC<UpsellLayoutStoryProps> = ({
  showTabs = true,
  carouselRooms = layoutCarouselRooms,
  pricingRooms = layoutPricingRooms,
  pricingBookings = layoutPricingBookings,
  formattedOverallTotal: initialOverallTotal = '€1,045.00',
  brandPrimary = brandDefaults.primary,
  brandPrimaryForeground = brandDefaults.primaryForeground,
}) => {
  const initialIndex = carouselRooms.length > 1 ? 1 : 0
  const [selectedRoom, setSelectedRoom] = useState<RoomOption | null>(
    carouselRooms[initialIndex] ?? carouselRooms[0] ?? null
  )
  useEffect(() => {
    setSelectedRoom(carouselRooms[initialIndex] ?? carouselRooms[0] ?? null)
  }, [carouselRooms, initialIndex])

  // State for room customization selections (per room)
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, Record<number, boolean>>>(() => {
    const initial: Record<string, Record<number, boolean>> = {}
    pricingRooms.forEach((room) => {
      initial[room.id] = {}
    })
    return initial
  })

  // State for room upgrades (per room)
  const [selectedRoomUpgrades, setSelectedRoomUpgrades] = useState<Record<string, string | null>>(() => {
    const initial: Record<string, string | null> = {}
    pricingRooms.forEach((room) => {
      initial[room.id] = null
    })
    return initial
  })

  // SpecialOffers state and hooks
  const { formatPrice, calculateTotal, getUnitLabel } = useOfferPricing('€', mockReservationInfo)
  const {
    selections: offerSelections,
    bookedOffers,
    updateQuantity,
    updateSelectedDate,
    updateSelectedDates,
    setBookedOffers,
  } = useOfferSelections({
    offers: mockOffers,
    reservationInfo: mockReservationInfo,
  })

  // Compute pricing rooms with customization items, room upgrades, and special offers included
  const computedPricingRooms = useMemo(() => {
    return pricingRooms.map((room) => {
      const roomSelections = selectedAttributes[room.id] || {}
      const customizationItems = Object.entries(roomSelections)
        .filter(([, isSelected]) => isSelected)
        .map(([attributeId]) => {
          const attr = defaultRoomCustomizationCategories
            .flatMap((cat) => cat.attributes)
            .find((a) => a.id === Number(attributeId))
          if (!attr) return null
          return {
            id: `attr-${attr.id}`,
            name: attr.name,
            formattedPrice: `€${attr.amount.toFixed(2)}`,
          }
        })
        .filter(Boolean) as Array<{ id: string; name: string; formattedPrice: string }>

      // Get room upgrade if selected
      const selectedUpgradeId = selectedRoomUpgrades[room.id]
      let upgradeItem: { id: string; name: string; formattedPrice: string } | undefined
      if (selectedUpgradeId) {
        const selectedUpgradeOption = carouselRooms.find((r) => r.id === selectedUpgradeId)
        if (selectedUpgradeOption) {
          const upgradePrice = parseFloat(selectedUpgradeOption.price) * 8 // 8 nights
          upgradeItem = {
            id: `room-upgrade-${selectedUpgradeId}`,
            name: selectedUpgradeOption.roomType || selectedUpgradeOption.title || selectedUpgradeId,
            formattedPrice: `€${upgradePrice.toFixed(2)}`,
          }
        }
      }

      // Compute special offers items for this room
      const specialOffersItems = Array.from(bookedOffers)
        .map((offerId) => {
          const offer = mockOffers.find((o) => o.id === offerId)
          if (!offer) return null
          const selection = offerSelections[offerId] || { quantity: 0 }
          const total = calculateTotal(offer, selection)
          return {
            id: `offer-${offer.id}`,
            name: offer.title,
            formattedPrice: formatPrice(total),
          }
        })
        .filter(Boolean) as Array<{ id: string; name: string; formattedPrice: string }>

      // Find existing sections but filter out old upgrade/offer/customization sections
      const existingSections = room.sections.filter(
        (s) => s.type !== SectionType.Customization && s.type !== SectionType.Offer && s.type !== SectionType.Upgrade
      )

      // Create new sections
      const upgradeSection =
        upgradeItem
          ? {
              title: 'Choose your superior room',
              type: SectionType.Upgrade,
              items: [upgradeItem],
            }
          : undefined

      const customizationSection =
        customizationItems.length > 0
          ? {
              title: 'Customize your room',
              type: SectionType.Customization,
              items: customizationItems,
            }
          : undefined

      const offersSection =
        specialOffersItems.length > 0
          ? {
              title: 'Special Offers',
              type: SectionType.Offer,
              items: specialOffersItems,
            }
          : undefined

      const sections = existingSections
      if (upgradeSection) sections.push(upgradeSection)
      if (customizationSection) sections.push(customizationSection)
      if (offersSection) sections.push(offersSection)

      // Calculate room total: base price + upgrade + customizations + offers
      const basePrice = parseFloat(room.formattedTotal.replace('€', '').replace(',', ''))
      const upgradeTotal = upgradeItem ? parseFloat(upgradeItem.formattedPrice.replace('€', '').replace(',', '')) : 0
      const customizationTotal = customizationItems.reduce((sum, item) => {
        const price = parseFloat(item.formattedPrice.replace('€', '').replace(',', ''))
        return sum + price
      }, 0)
      const offersTotal = specialOffersItems.reduce((sum, item) => {
        const price = parseFloat(item.formattedPrice.replace('€', '').replace(',', ''))
        return sum + price
      }, 0)
      const roomTotal = basePrice + upgradeTotal + customizationTotal + offersTotal
      const formattedRoomTotal = `€${roomTotal.toFixed(2)}`

      return {
        ...room,
        sections,
        formattedTotal: formattedRoomTotal,
      }
    })
  }, [pricingRooms, selectedAttributes, selectedRoomUpgrades, carouselRooms, bookedOffers, offerSelections, calculateTotal, formatPrice])

  // Calculate dynamic overall total from computed rooms
  const computedOverallTotal = useMemo(() => {
    const total = computedPricingRooms.reduce((sum, room) => {
      const price = parseFloat(room.formattedTotal.replace('€', '').replace(',', ''))
      return sum + price
    }, 0)
    return `€${total.toFixed(2)}`
  }, [computedPricingRooms])

  const { activeRooms, setActiveRooms, initialActiveRooms } = useAccordionState({
    rooms: computedPricingRooms,
    exclusiveAccordion: true,
  })

  const toggleAttribute = useCallback((roomId: string, attributeId: number) => {
    setSelectedAttributes((prev) => {
      const roomSelections = { ...(prev[roomId] || {}) }
      roomSelections[attributeId] = !roomSelections[attributeId]
      if (!roomSelections[attributeId]) {
        delete roomSelections[attributeId]
      }
      return {
        ...prev,
        [roomId]: roomSelections,
      }
    })
  }, [])

  // Handle removing items from pricing summary
  const handleRemoveItem = useCallback((bookingKey: string, itemId: string) => {
    if (itemId.startsWith('attr-')) {
      // Remove customization attribute
      const attributeId = Number(itemId.replace('attr-', ''))
      setSelectedAttributes((prev) => {
        const roomSelections = { ...(prev[bookingKey] || {}) }
        delete roomSelections[attributeId]
        return {
          ...prev,
          [bookingKey]: roomSelections,
        }
      })
    } else if (itemId.startsWith('room-upgrade-')) {
      // Remove room upgrade
      setSelectedRoomUpgrades((prev) => ({
        ...prev,
        [bookingKey]: null,
      }))
    } else if (itemId.startsWith('offer-')) {
      // Remove special offer (convert string ID to number to match bookedOffers set)
      const offerId = Number(itemId.replace('offer-', ''))
      const newBooked = new Set(bookedOffers)
      newBooked.delete(offerId)
      setBookedOffers(newBooked)
    }
  }, [bookedOffers])

  const themeOverrides = useMemo(
    () => createBrandTheme(brandPrimary, brandPrimaryForeground),
    [brandPrimary, brandPrimaryForeground]
  )

  // Get the currently active room for display
  const activeRoom = useMemo(() => {
    const activeRoomId = activeRooms[0] || initialActiveRooms[0] || pricingRooms[0]?.id
    return pricingRooms.find((r) => r.id === activeRoomId)
  }, [activeRooms, initialActiveRooms, pricingRooms])

  const activeRoomDisplayName = activeRoom?.displayName?.toUpperCase() || 'TRIPLE DELUXE GOLF VIEW'

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

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            {showTabs && (
              <div className="sticky top-0 z-20 mb-4 w-full border-b border-border bg-muted/90 backdrop-blur-sm">
                <TabsStrip
                  tabs={pricingBookings.map((b) => ({
                    id: b.id,
                    label: b.displayName,
                    badge: <span className="rounded-lg bg-white/20 px-2 py-0.5 text-xs">{b.formattedGuests}</span>,
                  }))}
                  activeId={activeRooms[0] || initialActiveRooms[0]}
                  sticky={false}
                  className="border-0 bg-transparent"
                  onChange={(id) => setActiveRooms(id ? [id] : [])}
                />
              </div>
            )}
            <header className="space-y-2">
              <h2 className="font-bold text-2xl text-foreground">Upgrade Your Room - {activeRoomDisplayName}</h2>
              <p className="text-muted-foreground text-sm">Choose an upgrade for your currently selected room.</p>
            </header>
            <div className="mt-6 overflow-hidden rounded-3xl bg-white p-4 shadow-depth-1 ring-1 ring-border/40">
              <RoomUpgradeCarousel
                roomOptions={carouselRooms}
                initialSelectedRoom={selectedRoom}
                onRoomSelected={(room) => {
                  setSelectedRoom(room)
                  const currentRoomId = activeRooms[0] || initialActiveRooms[0] || pricingRooms[0]?.id
                  if (currentRoomId) {
                    // Handle both selection and deselection (null)
                    setSelectedRoomUpgrades((prev) => ({
                      ...prev,
                      [currentRoomId]: room?.id || null,
                    }))
                  }
                }}
                translations={layoutUpgradeTranslations}
                enableHoverZoom
                className="w-full"
              />
            </div>

            <header className="mt-10 space-y-2">
              <h2 className="font-bold text-2xl text-foreground">Customize your stay - {activeRoomDisplayName}</h2>
              <p className="text-muted-foreground text-sm">Pick room add-ons to tailor the experience before guests arrive.</p>
            </header>
            <div className="mt-6 overflow-hidden rounded-3xl bg-white p-4 shadow-depth-1 ring-1 ring-border/40">
              <AttributesCategories
                categories={defaultRoomCustomizationCategories}
                renderAttributeCard={(attribute) => {
                  const currentRoomId = activeRooms[0] || initialActiveRooms[0] || pricingRooms[0]?.id
                  if (!currentRoomId || !attribute.amount) return null
                  const isSelected = Boolean(selectedAttributes[currentRoomId]?.[attribute.id])
                  const pricePerNight = attribute.amount / 8
                  return (
                    <AttributeCard
                      key={attribute.id}
                      attribute={attribute as RoomCustomizationAttribute}
                      isSelected={isSelected}
                      disabled={false}
                      onToggle={() => toggleAttribute(currentRoomId, attribute.id)}
                      originalPrice={pricePerNight}
                      displayCurrency="EUR"
                      readonly={false}
                    />
                  )
                }}
              />
            </div>

            <header className="mt-10 space-y-2">
              <h2 className="font-bold text-2xl text-foreground">Special Offers - {activeRoomDisplayName}</h2>
              <p className="text-muted-foreground text-sm">Enhance your stay with our exclusive special offers.</p>
            </header>
            <div className="mt-6 overflow-hidden rounded-3xl bg-white p-4 shadow-depth-1 ring-1 ring-border/40">
              <SpecialOffers
                cardData={formatOfferCards(
                  mockOffers,
                  offerSelections,
                  Array.from(bookedOffers),
                  '€',
                  getDefaultLabels(),
                  formatPrice,
                  calculateTotal,
                  (type) => getUnitLabel(type, getDefaultLabels())
                )}
                onUpdateQuantity={updateQuantity}
                onUpdateSelectedDate={updateSelectedDate}
                onUpdateSelectedDates={updateSelectedDates}
                onBookOffer={(offerId) => {
                  const newBooked = new Set(bookedOffers)
                  if (newBooked.has(offerId)) {
                    newBooked.delete(offerId)
                  } else {
                    newBooked.add(offerId)
                  }
                  setBookedOffers(newBooked)
                }}
                labels={getDefaultLabels()}
              />
            </div>
          </div>

          <MultiBookingPricingSummaryPanel
            rooms={computedPricingRooms}
            formattedBookings={pricingBookings}
            formattedOverallTotal={computedOverallTotal}
            labels={layoutPricingLabels}
            activeRooms={activeRooms}
            initialActiveRooms={initialActiveRooms}
            onActiveRoomsChange={setActiveRooms}
            onRemoveItem={handleRemoveItem}
            exclusiveAccordion
            isSticky={true}
            hideFooter={false}
            className="lg:self-start"
          />
        </div>
      </div>
    </div>
  )
}

const BookingViewPageStory = (
  { brandPrimary = brandDefaults.primary, brandPrimaryForeground = brandDefaults.primaryForeground }: BrandThemeArgs = {}
) => (
  <div className="relative min-h-screen bg-muted pb-4" style={createBrandTheme(brandPrimary, brandPrimaryForeground)}>
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
  argTypes: {
    brandPrimary: {
      control: 'color',
      description: 'Primary brand color token applied via CSS variables.',
    },
    brandPrimaryForeground: {
      control: 'color',
      description: 'Foreground color used on primary surfaces.',
    },
  },
  args: {
    brandPrimary: brandDefaults.primary,
    brandPrimaryForeground: brandDefaults.primaryForeground,
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
  args: {},
  render: (args) => <BookingViewPageStory {...args} />,
}
