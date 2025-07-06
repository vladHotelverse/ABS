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
  ViewOption,
  ExactViewOption,
  CompatibilityRules,
} from '../ABS_RoomCustomization/types'
import type { OfferData } from '../ABS_SpecialOffers/types'

// Import new section components
import { RoomSelectionSection, RoomSelectionMapSection, CustomizationSection, SpecialOffersSection, BookingStateSection } from './sections'
import type { RoomOption, SpecialOffer } from './sections'

// Import hooks and utilities
import { useBookingState, useMultiBookingState } from './hooks'
import {
  convertRoomToPricingItem,
  convertCustomizationsToPricingItems,
  convertOffersToPricingItems,
  convertBidsToPricingItems,
  generateAvailableSections,
  countCartItems,
  shouldShowSection,
  calculateNights,
  calculateTotalPrice,
} from './utils/dataConversion'

// Re-export types from sections for compatibility
export type { RoomOption, SpecialOffer } from './sections'

export interface Translations extends RoomCustomizationTexts {
  // Room section
  roomTitle: string
  roomSubtitle: string
  selectText: string
  selectedText: string
  nightText: string
  learnMoreText: string
  priceInfoText: string
  makeOfferText: string
  proposePriceText: string
  availabilityText: string
  offerMadeText: string
  bidSubmittedText: string
  updateBidText: string
  cancelBidText: string

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
  chooseYourSuperiorRoomLabel: string
  customizeYourRoomLabel: string
  enhanceYourStayLabel: string
  chooseYourRoomLabel: string
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
  customizeStayTitle: string
  chooseOptionsSubtitle: string

  // Multi-booking support
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
  roomType?: string
  occupancy?: string
  fallbackImageUrl?: string
  availableSections?: AvailableSection[]
  // Multi-booking support
  isMultiBooking?: boolean
  initialRoomBookings?: RoomBooking[]
  onMultiBookingChange?: (bookings: RoomBooking[]) => void
  // Compatibility rules for room customization
  compatibilityRules?: CompatibilityRules
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
  onCartClick,
  onConfirmBooking,
  reservationCode,
  checkIn,
  checkOut,
  roomType,
  occupancy,
  fallbackImageUrl,
  availableSections,
  // Multi-booking support
  isMultiBooking = false,
  initialRoomBookings = [],
  onMultiBookingChange,
  // Compatibility rules
  compatibilityRules,
}) => {
  // Calculate nights from check-in and check-out dates
  const nights = calculateNights(checkIn, checkOut)
  
  // Create combined stay dates display
  const stayDates = checkIn && checkOut ? `From ${checkIn} to ${checkOut}` : 'N/A'

  // Use custom hooks for state management
  const { state, actions, showMobilePricing, bookingStatus: _bookingStatus } = useBookingState({
    selectedRoom: initialSelectedRoom || null,
    customizations: {},
    specialOffers: [],
    activeBid: null,
    status: initialState,
    texts: translations as any,
  })

  const { showToast } = actions
  
  // Calculate cart item count
  const cartItemCount = countCartItems({
    selectedRoom: state.selectedRoom || undefined,
    selectedCustomizations: {},
    selectedOffers: state.specialOffers as any,
    activeBid: state.activeBid,
  })

  const { subtotal, tax, total } = calculateTotalPrice(
    state.selectedRoom || undefined,
    {} as any,
    state.specialOffers as any || [],
    0.1, // Assuming a 10% tax rate
    nights
  )

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
    roomBookings,
    activeRoomId,
    totalItemCount: multiBookingItemCount,
    totalPrice: multiBookingTotalPrice,
    handleMultiBookingEditSection,
    handleMultiBookingConfirmAll,
    handleRoomTabClick,
  } = multiBookingState

  // Calculate items and totals
  const singleBookingItemCount = countCartItems({
    selectedRoom: state.selectedRoom || undefined,
    selectedCustomizations: {} as any,
    selectedOffers: state.specialOffers as any,
    activeBid: state.activeBid,
  })
  const itemCount = shouldShowMultiBooking ? multiBookingItemCount : singleBookingItemCount
  // Use subtotal for header to match pricing panel (taxes removed)
  const totalPrice = shouldShowMultiBooking ? multiBookingTotalPrice : subtotal

  // Handlers for user interactions
  const handleRoomSelect = (room: RoomOption) => {
    actions.selectRoom(room)
  }

  const handleCustomizationChange = (
    category: string,
    optionId: string,
    optionLabel: string,
    optionPrice: number
  ) => {
    // This logic needs to be adapted based on how you want to handle customizations
    // For now, we'll just log it
    console.log('Customization changed:', { category, optionId, optionLabel, optionPrice })
    // A real implementation would call an action like:
    // actions.addCustomization({ id: optionId, name: optionLabel, price: optionPrice, category }, 'room-id');
  }

  const handleBookOffer = (offerData: OfferData) => {
    const offer = {
      id: offerData.id,
      title: offerData.name,
      description: '',
      image: '',
      price: offerData.price,
      name: offerData.name,
    } as any
    actions.addSpecialOffer(offer)
    showToast(`${offer.title} added to your stay.`, 'success')
  }

  const handleLearnMore = (_room: RoomOption) => {
    console.log('Learn more about:', _room);
  }

  const handleMakeOffer = (price: number, room: RoomOption) => {
    actions.makeOffer(price, room)
    showToast(`Bid of ${translations.currencySymbol}${price} submitted for ${room.title || room.roomType}.`, 'success')
  }

  const handleCancelBid = (roomId: string) => {
    actions.cancelBid(roomId)
    showToast(`Bid for room ${roomId} cancelled.`, 'info')
  }

  const handleEditSection = (_section: 'room' | 'customizations' | 'offer') => {
    // This function can be used to navigate the user to the relevant section
  }

  const handleShowMobilePricing = () => {
    actions.setShowMobilePricing(true);
  }

  const handleCloseMobilePricing = () => {
    actions.setShowMobilePricing(false);
  }

  // Handlers for booking state transitions
  const handleConfirm = () => {
    actions.confirmBooking();
  };

  const handleRetry = () => {
    actions.resetState();
  };

  const handleBackToNormal = () => {
    actions.resetState();
  };

  // Unified handler for removing items from both single and multi-booking panels
  const handleRemoveItem = (
    itemId: string | number,
    itemName: string,
    itemType: PricingItem['type'],
    _roomId?: string
  ) => {
    if (itemType === 'customization') {
      const category = Object.keys(state.customizations).find(
        (key) => state.customizations[key]?.some(c => c.id === itemId)
      );
      if (category) {
        actions.removeCustomization(itemId.toString(), _roomId || '');
      }
      showToast(`Customization "${itemName}" removed`, 'info');
    } else if (itemType === 'offer') {
      actions.removeSpecialOffer(itemId.toString());
    } else if (itemType === 'room') {
      actions.selectRoom(null);
      showToast(translations.roomRemovedMessage, 'info');
    } else if (itemType === 'bid') {
      actions.cancelBid(itemId as string);
      showToast(`Bid removed for ${itemName}`, 'info');
    }
  };

  // Convert state to pricing items
  const pricingItems: PricingItem[] = [
    convertRoomToPricingItem(state.selectedRoom || undefined, nights),
    ...convertCustomizationsToPricingItems({} as any, nights),
    ...convertOffersToPricingItems(state.specialOffers as any || []),
    ...convertBidsToPricingItems(state.activeBid ? [state.activeBid as any] : [], nights),
  ].filter((item): item is PricingItem => item !== null)

  // Create section texts for subcomponents
  const roomTexts = {
    roomTitle: t.roomTitle,
    roomSubtitle: t.roomSubtitle,
    selectText: t.selectText,
    selectedText: t.selectedText,
    nightText: t.nightText,
    learnMoreText: t.learnMoreText,
    priceInfoText: t.priceInfoText,
    makeOfferText: t.makeOfferText,
    proposePriceText: t.proposePriceText,
    availabilityText: t.availabilityText,
    offerMadeText: t.offerMadeText,
    bidSubmittedText: t.bidSubmittedText,
    updateBidText: t.updateBidText,
    cancelBidText: t.cancelBidText,
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
  if (state.status !== 'normal') {
    return (
      <BookingStateSection
        state={state.status || 'normal'}
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
        isLoading={false} // isPriceCalculating is removed from useBookingState
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
                  { label: t.reservationCodeLabel || 'Reservation Code', value: reservationCode || 'N/A', icon: 'Tag' },
                  { label: 'Stay Dates', value: stayDates, icon: 'Calendar' },
                  { label: 'Room Type', value: roomType || 'N/A', icon: 'Home' },
                  { label: t.occupancyLabel || 'Occupancy', value: occupancy || 'N/A', icon: 'Users' },
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
                { label: t.reservationCodeLabel || 'Reservation Code', value: reservationCode || 'N/A', icon: 'Tag' },
                { label: 'Stay Dates', value: stayDates, icon: 'Calendar' },
                { label: 'Room Type', value: roomType || 'N/A', icon: 'Home' },
                { label: t.occupancyLabel || 'Occupancy', value: occupancy || 'N/A', icon: 'Users' },
              ],
            })}
      />

      <main className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 flex-grow pb-24 lg:pb-8">
        <div className="flex-grow space-y-8 w-full">
          {/* Room Selection Section */}
          <RoomSelectionSection
            roomOptions={roomOptions}
            selectedRoom={state.selectedRoom || undefined}
            onRoomSelected={handleRoomSelect}
            onLearnMore={handleLearnMore}
            onMakeOffer={handleMakeOffer}
            onCancelBid={handleCancelBid}
            texts={roomTexts}
            isVisible={shouldShowSection('room', computedAvailableSections)}
            showPriceSlider={true}
            activeBid={state.activeBid ? {
              roomId: state.activeBid.roomId,
              bidAmount: state.activeBid.bidAmount,
              status: state.activeBid.status
            } : undefined}
          />

          {/* Room Customization Section */}
          <CustomizationSection
            sections={sections}
            sectionOptions={sectionOptions}
            selectedCustomizations={{} as any}
            onCustomizationChange={handleCustomizationChange}
            texts={customizationTexts}
            fallbackImageUrl={fallbackImageUrl}
            isVisible={shouldShowSection('customization', computedAvailableSections)}
            compatibilityRules={compatibilityRules}
          />

          {/* Special Offers Section */}
          <SpecialOffersSection
            specialOffers={specialOffers}
            selectedOffers={state.specialOffers as any}
            onBookOffer={handleBookOffer}
            reservationInfo={undefined} // reservationInfo is not used in this component's state
            texts={offersTexts}
            isVisible={shouldShowSection('offer', computedAvailableSections)}
          />
        </div>

        <aside className="flex-shrink-0 max-w-md">
          {shouldShowMultiBooking ? (
            <MultiBookingPricingSummaryPanel
              roomBookings={roomBookings}
              labels={t.multiBookingLabels}
              currency="EUR"
              locale={language === 'en' ? 'en-US' : 'es-ES'}
              isLoading={false} // isPriceCalculating is removed from useBookingState
              onRemoveItem={(roomId, itemId, itemName, itemType) =>
                handleRemoveItem(itemId, itemName, itemType, roomId)
              }
              onEditSection={handleMultiBookingEditSection}
              onConfirmAll={handleMultiBookingConfirmAll}
            />
          ) : (
            <div className={clsx('transition-opacity duration-300', isMultiBooking ? 'opacity-0' : 'opacity-100')}>
              <PricingSummaryPanel
                roomImage={state.selectedRoom?.image || fallbackImageUrl}
                items={pricingItems}
                pricing={{ subtotal, taxes: tax }}
                isLoading={false} // isPriceCalculating is removed from useBookingState
                availableSections={computedAvailableSections}
                labels={{
                  selectedRoomLabel: t.selectedRoomLabel,
                  upgradesLabel: t.upgradesLabel,
                  specialOffersLabel: t.specialOffersLabel,
                  chooseYourSuperiorRoomLabel: t.chooseYourSuperiorRoomLabel,
                  customizeYourRoomLabel: t.customizeYourRoomLabel,
                  enhanceYourStayLabel: t.enhanceYourStayLabel,
                  chooseYourRoomLabel: t.chooseYourRoomLabel,
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
                  handleRemoveItem(id, name, type)
                }}
                onConfirm={handleConfirm}
                onEditSection={(section) => {
                  if (section === 'room') handleEditSection('room')
                  else if (section === 'customizations') handleEditSection('customizations')
                  else if (section === 'offers') handleEditSection('offer')
                }}
              />
            </div>
          )}
        </aside>
      </main>
                    {/* Room Selection Map Section */}
                    {roomSelectionMap && (
            <RoomSelectionMapSection
              roomSelectionConfig={roomSelectionMap}
              isVisible={true}
            />
          )}
      {/* Mobile Pricing Widget */}
      <MobilePricingWidget
        total={total}
        currencySymbol={translations.currencySymbol}
        itemCount={cartItemCount}
        onShowPricing={handleShowMobilePricing}
        isLoading={false} // isPriceCalculating is removed from useBookingState
        summaryButtonLabel={translations.summaryButtonLabel}
      />

      {/* Mobile Pricing Overlay */}
      <MobilePricingOverlay
        isOpen={showMobilePricing}
        onClose={handleCloseMobilePricing}
        roomImage={state.selectedRoom?.image || fallbackImageUrl}
        items={pricingItems}
        pricing={{ subtotal, taxes: tax }}
        isLoading={false} // isPriceCalculating is removed from useBookingState
        availableSections={computedAvailableSections}
        labels={{
          selectedRoomLabel: t.selectedRoomLabel,
          upgradesLabel: t.upgradesLabel,
          specialOffersLabel: t.specialOffersLabel,
          chooseYourSuperiorRoomLabel: t.chooseYourSuperiorRoomLabel,
          customizeYourRoomLabel: t.customizeYourRoomLabel,
          enhanceYourStayLabel: t.enhanceYourStayLabel,
          chooseYourRoomLabel: t.chooseYourRoomLabel,
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
          handleRemoveItem(id, name, type)
        }}
        onConfirm={handleConfirm}
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
