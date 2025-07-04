import clsx from 'clsx'
import type React from 'react'
import BookingInfoBar from '../ABS_BookingInfoBar'
import Header, { RoomTabs, type RoomTab } from '../ABS_Header'
import PricingSummaryPanel from '../ABS_PricingSummaryPanel'
import type { AvailableSection, PricingItem } from '../ABS_PricingSummaryPanel'
import MobilePricingOverlay from '../ABS_PricingSummaryPanel/components/MobilePricingOverlay'
import MobilePricingWidget from '../ABS_PricingSummaryPanel/components/MobilePricingWidget'
import MultiBookingPricingSummaryPanel from '../ABS_PricingSummaryPanel/MultiBookingPricingSummaryPanel'
import type { RoomBooking, MultiBookingLabels } from '../ABS_PricingSummaryPanel/MultiBookingPricingSummaryPanel'
import type {
  CustomizationOption,
  RoomCustomizationTexts,
  SectionConfig,
  SelectedCustomizations,
  ViewOption,
  ExactViewOption,
} from '../ABS_RoomCustomization/types'
import type { OfferData } from '../ABS_SpecialOffers/types'

// Import new section components
import { RoomSelectionSection, RoomSelectionMapSection, CustomizationSection, SpecialOffersSection, BookingStateSection } from './sections'
import type { RoomOption, SpecialOffer, SelectedOffer } from './sections'

// Import hooks and utilities
import { useBookingState, useMultiBookingState } from './hooks'
import {
  convertRoomToPricingItem,
  convertCustomizationsToPricingItems,
  convertOffersToPricingItems,
  generateAvailableSections,
  countCartItems,
  shouldShowSection,
  calculateNights,
} from './utils/dataConversion'

// Re-export types from sections for compatibility
export type { RoomOption, SpecialOffer, SelectedOffer } from './sections'

export interface Translations extends RoomCustomizationTexts {
  // Room section
  roomTitle: string
  roomSubtitle: string
  selectText: string
  selectedText: string
  nightText: string
  learnMoreText: string
  priceInfoText: string

  // Customization section
  customizeTitle: string
  customizeSubtitle: string
  bedsTitle: string
  locationTitle: string
  floorTitle: string
  viewTitle: string

  // Special offers section
  offersTitle: string
  offersSubtitle: string
  specialOffersLabels: {
    perStay: string
    perPerson: string
    perNight: string
    total: string
    bookNow: string
    numberOfPersons: string
    numberOfNights: string
    addedLabel: string
    popularLabel: string
    personsTooltip: string
    personsSingularUnit: string
    personsPluralUnit: string
    nightsTooltip: string
    nightsSingularUnit: string
    nightsPluralUnit: string
    personSingular: string
    personPlural: string
    nightSingular: string
    nightPlural: string
    removeOfferLabel: string
    decreaseQuantityLabel: string
    increaseQuantityLabel: string
    selectDateLabel: string
    selectDateTooltip: string
    dateRequiredLabel: string
  }

  // Booking state section
  loadingLabel: string
  errorTitle: string
  errorMessage: string
  tryAgainLabel: string
  bookingConfirmedTitle: string
  confirmationMessage: string
  backToHomeLabel: string

  // Pricing and cart
  emptyCartMessage: string
  totalLabel: string
  currencySymbol: string
  selectedRoomLabel: string
  upgradesLabel: string
  specialOffersLabel: string
  subtotalLabel: string
  taxesLabel: string
  payAtHotelLabel: string
  viewTermsLabel: string
  confirmButtonLabel: string
  noUpgradesSelectedLabel: string
  noOffersSelectedLabel: string
  editLabel: string
  roomRemovedMessage: string
  offerRemovedMessagePrefix: string
  customizationRemovedMessagePrefix: string
  addedMessagePrefix: string
  euroSuffix: string

  // Booking info
  checkInLabel: string
  checkOutLabel: string
  occupancyLabel: string
  reservationCodeLabel: string

  // UI text
  summaryButtonLabel: string
  removeRoomUpgradeLabel: string
  exploreLabel: string
  roomImageAltText: string
  fromLabel: string

  // Multi-booking labels
  multiBookingLabels: MultiBookingLabels
}

export interface ABSLandingProps {
  className?: string
  roomOptions: RoomOption[]
  sections: SectionConfig[]
  sectionOptions: Record<string, CustomizationOption[] | ViewOption[] | ExactViewOption[]>
  specialOffers: SpecialOffer[]
  roomSelectionMap?: {
    id: string
    title: string
    description: string
    url: string
    type: 'iframe'
    iframe: {
      width: string
      height: string
      frameBorder: number
      allowFullScreen: boolean
      title: string
    }
  }
  initialSelectedRoom?: RoomOption
  translations: Translations
  language?: 'en' | 'es'
  initialState?: 'loading' | 'error' | 'normal'
  initialSubtotal?: number
  initialTax?: number
  onCartClick?: () => void
  onConfirmBooking?: (bookingData: any) => void
  reservationCode?: string
  checkIn?: string
  checkOut?: string
  occupancy?: string
  fallbackImageUrl?: string
  availableSections?: AvailableSection[]
  // Multi-booking support
  isMultiBooking?: boolean
  initialRoomBookings?: RoomBooking[]
  onMultiBookingChange?: (bookings: RoomBooking[]) => void
}

export const ABSLanding: React.FC<ABSLandingProps> = ({
  className,
  roomOptions,
  sections,
  sectionOptions,
  specialOffers,
  roomSelectionMap,
  initialSelectedRoom,
  translations,
  language,
  initialState = 'normal',
  initialSubtotal = 0,
  initialTax = 0,
  onCartClick,
  onConfirmBooking,
  reservationCode,
  checkIn,
  checkOut,
  occupancy,
  fallbackImageUrl,
  availableSections,
  // Multi-booking support
  isMultiBooking = false,
  initialRoomBookings = [],
  onMultiBookingChange,
}) => {
  // Calculate nights from check-in and check-out dates
  const nights = calculateNights(checkIn, checkOut)

  // Use custom hooks for state management
  const bookingState = useBookingState({
    initialSelectedRoom,
    initialState,
    initialSubtotal,
    initialTax,
    onConfirmBooking,
    nights,
  })

  const multiBookingState = useMultiBookingState({
    initialRoomBookings,
    onMultiBookingChange,
    onConfirmBooking,
  })

  // Use translations based on language
  const t = translations

  // Determine if we should show multi-booking UI (only if more than 1 room)
  const shouldShowMultiBooking = isMultiBooking && multiBookingState.roomBookings.length > 1

  // Generate available sections if not provided
  const computedAvailableSections =
    availableSections ||
    generateAvailableSections(roomOptions.length > 0, sections.length > 0, specialOffers.length > 0, language)

  // Extract state from hooks for easier access
  const {
    selectedRoom,
    selectedCustomizations,
    selectedOffers,
    subtotal,
    tax,
    total,
    state,
    isPriceCalculating,
    isMobilePricingOverlayOpen,
    setSelectedRoom,
    setSelectedCustomizations,
    setSelectedOffers,
    setIsMobilePricingOverlayOpen,
    handleConfirmBooking,
    handleRetry,
    handleBackToNormal,
  } = bookingState

  const {
    roomBookings,
    activeRoomId,
    totalItemCount: multiBookingItemCount,
    totalPrice: multiBookingTotalPrice,
    handleMultiBookingRemoveItem,
    handleMultiBookingEditSection,
    handleMultiBookingConfirmAll,
    handleRoomTabClick,
  } = multiBookingState

  // Calculate items and totals
  const singleBookingItemCount = countCartItems(selectedRoom, selectedCustomizations, selectedOffers)
  const itemCount = shouldShowMultiBooking ? multiBookingItemCount : singleBookingItemCount
  const totalPrice = shouldShowMultiBooking ? multiBookingTotalPrice : total

  // Handlers for user interactions
  const handleRoomSelect = (room: RoomOption) => {
    setSelectedRoom(room)
  }

  const handleCustomizationChange = (category: string, optionId: string, optionLabel: string, optionPrice: number) => {
    setSelectedCustomizations((prev) => {
      const updated = { ...prev }
      const categoryKey = category.toLowerCase() as keyof SelectedCustomizations

      if (!optionId) {
        delete updated[categoryKey]
      } else {
        updated[categoryKey] = {
          id: optionId,
          label: optionLabel,
          price: optionPrice,
        }
      }

      return updated
    })
  }

  // Create reservation info for special offers
  const reservationInfo = {
    personCount: occupancy ? Number.parseInt(occupancy.split(' ')[0]) || 2 : 2,
    checkInDate: checkIn ? new Date(checkIn) : undefined,
    checkOutDate: checkOut ? new Date(checkOut) : undefined,
  }

  const handleBookOffer = (offerData: OfferData) => {
    const originalOffer = specialOffers.find(
      (offer, index) => (typeof offer.id === 'string' ? index + 1 : offer.id) === offerData.id
    )

    const newOffer: SelectedOffer = {
      id: originalOffer?.id || offerData.id,
      name: offerData.name,
      price: offerData.price,
      quantity: offerData.quantity,
      persons: offerData.persons,
      nights: offerData.nights,
    }

    const existingIndex = selectedOffers.findIndex((offer) => offer.id === newOffer.id)
    if (existingIndex >= 0) {
      setSelectedOffers((prev) => {
        const updatedOffers = [...prev]
        updatedOffers[existingIndex] = { ...updatedOffers[existingIndex], quantity: newOffer.quantity }
        return updatedOffers
      })
    } else {
      setSelectedOffers((prev) => [...prev, newOffer])
    }
  }

  const handleRemoveRoomUpgrade = () => {
    setSelectedRoom(undefined)
    setSelectedCustomizations({})
  }

  const handleRemoveCustomization = (optionId: string | number, label: string) => {
    setSelectedCustomizations((prev) => {
      const updated = { ...prev }
      for (const key in updated) {
        if (updated[key]?.id === optionId && updated[key]?.label === label) {
          delete updated[key]
          break
        }
      }
      return updated
    })
  }

  const handleRemoveSpecialOffer = (offerId: string | number, _offerName: string) => {
    setSelectedOffers((prev) => prev.filter((offer) => offer.id !== offerId))
  }

  const handleLearnMore = (room: RoomOption) => {
    console.log('Open room details modal for room:', room)
  }

  const handleEditSection = (_section: 'room' | 'customizations' | 'offer') => {
    if (state === 'confirmation') {
      handleBackToNormal()
    }
  }

  const handleShowMobilePricing = () => {
    setIsMobilePricingOverlayOpen(true)
  }

  const handleCloseMobilePricing = () => {
    setIsMobilePricingOverlayOpen(false)
  }

  // Create section texts for subcomponents
  const roomTexts = {
    roomTitle: t.roomTitle,
    roomSubtitle: t.roomSubtitle,
    selectText: t.selectText,
    selectedText: t.selectedText,
    nightText: t.nightText,
    learnMoreText: t.learnMoreText,
    priceInfoText: t.priceInfoText,
  }

  const customizationTexts = {
    ...t,
    customizeTitle: t.customizeTitle,
    customizeSubtitle: t.customizeSubtitle,
  }

  const offersTexts = {
    offersTitle: t.offersTitle,
    offersSubtitle: t.offersSubtitle,
    currencySymbol: t.currencySymbol,
    specialOffersLabels: t.specialOffersLabels,
  }

  const bookingStateTexts = {
    loadingLabel: t.loadingLabel,
    errorTitle: t.errorTitle,
    errorMessage: t.errorMessage,
    tryAgainLabel: t.tryAgainLabel,
    bookingConfirmedTitle: t.bookingConfirmedTitle,
    confirmationMessage: t.confirmationMessage,
    backToHomeLabel: t.backToHomeLabel,
  }

  // Create room tabs data from room bookings
  const roomTabs: RoomTab[] = roomBookings.map((booking) => ({
    id: booking.id,
    roomName: booking.roomName,
    roomNumber: booking.roomNumber,
    guestName: booking.guestName,
  }))

  // Return early for non-normal states
  if (state !== 'normal') {
    return (
      <BookingStateSection
        state={state}
        texts={bookingStateTexts}
        onRetry={handleRetry}
        onBackToNormal={handleBackToNormal}
        className={className}
      />
    )
  }

  return (
    <div className={clsx('min-h-screen bg-neutral-50/30 flex flex-col', className)}>
      <Header
        onCartClick={onCartClick}
        itemsInCart={itemCount}
        totalPrice={totalPrice}
        totalLabel={t.totalLabel}
        currencySymbol={t.currencySymbol}
        isLoading={isPriceCalculating}
        isSticky={!shouldShowMultiBooking}
      />

      {/* Room Tabs - conditionally rendered for multi-booking */}
      {shouldShowMultiBooking && (
        <RoomTabs
          roomTabs={roomTabs}
          activeRoomId={activeRoomId}
          onRoomTabClick={handleRoomTabClick}
          headerHeight={50}
        />
      )}

      <BookingInfoBar
        {...(shouldShowMultiBooking
          ? {
              roomBookings: roomBookings.map((booking) => ({
                id: booking.id,
                roomName: booking.roomName,
                roomNumber: booking.roomNumber,
                guestName: booking.guestName,
                roomImage: booking.roomImage,
                items: [
                  { label: t.checkInLabel || 'Check-in', value: checkIn || 'N/A', icon: 'Calendar' },
                  { label: t.checkOutLabel || 'Check-out', value: checkOut || 'N/A', icon: 'Calendar' },
                  {
                    label: t.occupancyLabel || 'Guests',
                    value: `${(booking as any).guests || 2} guests`,
                    icon: 'Users',
                  },
                  { label: t.reservationCodeLabel || 'Reservation Code', value: reservationCode || 'N/A', icon: 'Tag' },
                ],
              })),
              labels: {
                multiRoomBookingsTitle: t.multiBookingLabels.multiRoomBookingsTitle,
                roomsCountLabel: t.multiBookingLabels.roomsCountLabel,
                singleRoomLabel: t.multiBookingLabels.singleRoomLabel || 'habitación',
                clickToExpandLabel: t.multiBookingLabels.clickToExpandLabel,
                roomLabel: 'Habitación',
                guestLabel: 'Huésped',
              },
            }
          : {
              items: [
                { label: t.checkInLabel || 'Check-in', value: checkIn || 'N/A', icon: 'Calendar' },
                { label: t.checkOutLabel || 'Check-out', value: checkOut || 'N/A', icon: 'Calendar' },
                { label: t.occupancyLabel || 'Occupancy', value: occupancy || 'N/A', icon: 'Users' },
                { label: t.reservationCodeLabel || 'Reservation Code', value: reservationCode || 'N/A', icon: 'Tag' },
              ],
            })}
      />

      <main className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 flex-grow pb-24 lg:pb-8">
        <div className="flex-grow space-y-8 w-full">
          {/* Room Selection Section */}
          <RoomSelectionSection
            roomOptions={roomOptions}
            selectedRoom={selectedRoom}
            onRoomSelected={handleRoomSelect}
            onLearnMore={handleLearnMore}
            texts={roomTexts}
            isVisible={shouldShowSection('room', computedAvailableSections)}
          />

          {/* Room Customization Section */}
          <CustomizationSection
            sections={sections}
            sectionOptions={sectionOptions}
            selectedCustomizations={selectedCustomizations}
            onCustomizationChange={handleCustomizationChange}
            texts={customizationTexts}
            fallbackImageUrl={fallbackImageUrl}
            isVisible={shouldShowSection('customization', computedAvailableSections)}
          />

          {/* Special Offers Section */}
          <SpecialOffersSection
            specialOffers={specialOffers}
            selectedOffers={selectedOffers}
            onBookOffer={handleBookOffer}
            reservationInfo={reservationInfo}
            texts={offersTexts}
            isVisible={shouldShowSection('offer', computedAvailableSections)}
          />

          {/* Room Selection Map Section */}
          {roomSelectionMap && (
            <RoomSelectionMapSection
              roomSelectionConfig={roomSelectionMap}
              isVisible={true}
            />
          )}
        </div>

        <aside className="flex-shrink-0 max-w-md">
          {shouldShowMultiBooking ? (
            <MultiBookingPricingSummaryPanel
              roomBookings={roomBookings}
              labels={t.multiBookingLabels}
              currency="EUR"
              locale={language === 'en' ? 'en-US' : 'es-ES'}
              isLoading={isPriceCalculating}
              onRemoveItem={handleMultiBookingRemoveItem}
              onEditSection={handleMultiBookingEditSection}
              onConfirmAll={handleMultiBookingConfirmAll}
            />
          ) : (
            <PricingSummaryPanel
              roomImage={selectedRoom?.image || fallbackImageUrl}
              items={[
                ...(selectedRoom
                  ? [convertRoomToPricingItem(selectedRoom, nights)].filter((item): item is PricingItem => item !== null)
                  : []),
                ...convertCustomizationsToPricingItems(selectedCustomizations),
                ...convertOffersToPricingItems(selectedOffers),
              ]}
              pricing={{ subtotal, taxes: tax }}
              isLoading={isPriceCalculating}
              availableSections={computedAvailableSections}
              labels={{
                selectedRoomLabel: t.selectedRoomLabel,
                upgradesLabel: t.upgradesLabel,
                specialOffersLabel: t.specialOffersLabel,
                subtotalLabel: t.subtotalLabel,
                taxesLabel: t.taxesLabel,
                totalLabel: t.totalLabel,
                payAtHotelLabel: t.payAtHotelLabel,
                viewTermsLabel: t.viewTermsLabel,
                confirmButtonLabel: t.confirmButtonLabel,
                noUpgradesSelectedLabel: t.noUpgradesSelectedLabel,
                noOffersSelectedLabel: t.noOffersSelectedLabel,
                emptyCartMessage: t.emptyCartMessage,
                editLabel: t.editLabel,
                roomRemovedMessage: t.roomRemovedMessage,
                offerRemovedMessagePrefix: t.offerRemovedMessagePrefix,
                customizationRemovedMessagePrefix: t.customizationRemovedMessagePrefix,
                addedMessagePrefix: t.addedMessagePrefix,
                euroSuffix: t.euroSuffix,
                loadingLabel: t.loadingLabel,
                roomImageAltText: t.roomImageAltText,
                removeRoomUpgradeLabel: t.removeRoomUpgradeLabel,
                exploreLabel: t.exploreLabel,
                fromLabel: t.fromLabel,
                customizeStayTitle: t.customizeTitle || 'Customize Your Stay',
                chooseOptionsSubtitle: t.customizeSubtitle || 'Choose your preferred options',

                // Error messages (i18n)
                missingLabelsError: 'Missing labels error',
                invalidPricingError: 'Invalid pricing error',
                currencyFormatError: 'Currency format error',
                performanceWarning: 'Performance warning',

                // Accessibility labels (i18n)
                notificationsLabel: 'Notifications',
                closeNotificationLabel: 'Close notification',
                pricingSummaryLabel: 'Pricing summary',
                processingLabel: 'Processing',
              }}
              currency="EUR"
              locale={language === 'en' ? 'en-US' : 'es-ES'}
              onRemoveItem={(id, name, type) => {
                if (type === 'room') {
                  handleRemoveRoomUpgrade()
                } else if (type === 'customization') {
                  handleRemoveCustomization(id, name)
                } else if (type === 'offer') {
                  handleRemoveSpecialOffer(id, name)
                }
              }}
              onConfirm={handleConfirmBooking}
              onEditSection={(section) => {
                if (section === 'room') handleEditSection('room')
                else if (section === 'customizations') handleEditSection('customizations')
                else if (section === 'offers') handleEditSection('offer')
              }}
            />
          )}
        </aside>
      </main>

      {/* Mobile Pricing Widget */}
      <MobilePricingWidget
        total={totalPrice}
        currencySymbol={t.currencySymbol}
        itemCount={itemCount}
        onShowPricing={handleShowMobilePricing}
        isLoading={isPriceCalculating}
        summaryButtonLabel={t.summaryButtonLabel}
      />

      {/* Mobile Pricing Overlay */}
      <MobilePricingOverlay
        isOpen={isMobilePricingOverlayOpen}
        onClose={handleCloseMobilePricing}
        roomImage={selectedRoom?.image || fallbackImageUrl}
        items={[
          ...(selectedRoom
            ? [convertRoomToPricingItem(selectedRoom, nights)].filter((item): item is PricingItem => item !== null)
            : []),
          ...convertCustomizationsToPricingItems(selectedCustomizations),
          ...convertOffersToPricingItems(selectedOffers),
        ]}
        pricing={{ subtotal, taxes: tax }}
        isLoading={isPriceCalculating}
        availableSections={computedAvailableSections}
        labels={{
          selectedRoomLabel: t.selectedRoomLabel,
          upgradesLabel: t.upgradesLabel,
          specialOffersLabel: t.specialOffersLabel,
          subtotalLabel: t.subtotalLabel,
          taxesLabel: t.taxesLabel,
          totalLabel: t.totalLabel,
          payAtHotelLabel: t.payAtHotelLabel,
          viewTermsLabel: t.viewTermsLabel,
          confirmButtonLabel: t.confirmButtonLabel,
          noUpgradesSelectedLabel: t.noUpgradesSelectedLabel,
          noOffersSelectedLabel: t.noOffersSelectedLabel,
          emptyCartMessage: t.emptyCartMessage,
          editLabel: t.editLabel,
          roomRemovedMessage: t.roomRemovedMessage,
          offerRemovedMessagePrefix: t.offerRemovedMessagePrefix,
          customizationRemovedMessagePrefix: t.customizationRemovedMessagePrefix,
          addedMessagePrefix: t.addedMessagePrefix,
          euroSuffix: t.euroSuffix,
          loadingLabel: t.loadingLabel,
          roomImageAltText: t.roomImageAltText,
          removeRoomUpgradeLabel: t.removeRoomUpgradeLabel,
          exploreLabel: t.exploreLabel,
          fromLabel: t.fromLabel,
          customizeStayTitle: t.customizeTitle || 'Customize Your Stay',
          chooseOptionsSubtitle: t.customizeSubtitle || 'Choose your preferred options',

          // Error messages (i18n)
          missingLabelsError: 'Missing labels error',
          invalidPricingError: 'Invalid pricing error',
          currencyFormatError: 'Currency format error',
          performanceWarning: 'Performance warning',

          // Accessibility labels (i18n)
          notificationsLabel: 'Notifications',
          closeNotificationLabel: 'Close notification',
          pricingSummaryLabel: 'Pricing summary',
          processingLabel: 'Processing',
        }}
        currency="EUR"
        locale={language === 'en' ? 'en-US' : 'es-ES'}
        onRemoveItem={(id: string | number, name: string, type: PricingItem['type']) => {
          if (type === 'room') {
            handleRemoveRoomUpgrade()
          } else if (type === 'customization') {
            handleRemoveCustomization(id, name)
          } else if (type === 'offer') {
            handleRemoveSpecialOffer(id, name)
          }
        }}
        onConfirm={handleConfirmBooking}
        onEditSection={(section: 'room' | 'customizations' | 'offers') => {
          if (section === 'room') handleEditSection('room')
          else if (section === 'customizations') handleEditSection('customizations')
          else if (section === 'offers') handleEditSection('offer')
        }}
      />
    </div>
  )
}

export default ABSLanding
export { ABSLanding as ABS_Landing }
