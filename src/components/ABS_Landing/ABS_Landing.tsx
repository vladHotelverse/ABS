import clsx from 'clsx'
import React, { useState, useEffect } from 'react'
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
  SelectedCustomizations,
} from '../ABS_RoomCustomization/types'
import type { OfferData } from '../ABS_SpecialOffers/types'

// Import new section components
import { RoomSelectionSection, CustomizationSection, SpecialOffersSection, BookingStateSection } from './sections'
import type { RoomOption, SpecialOffer } from './sections'
import { ABS_RoomSelection } from '../ABS_RoomSelection'

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
import type { Customization } from './types'

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
  
  // Create reservation info for special offers
  const reservationInfo = checkIn && checkOut ? {
    checkInDate: new Date(checkIn),
    checkOutDate: new Date(checkOut),
    personCount: occupancy ? parseInt(occupancy.match(/\d+/)?.[0] || '1', 10) : 1
  } : undefined

  // Use custom hooks for state management
  const { state, actions, showMobilePricing, bookingStatus } = useBookingState({
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
    selectedCustomizations: state.customizations,
    selectedOffers: state.specialOffers as any,
    activeBid: state.activeBid,
  })

  const { subtotal, tax, total } = calculateTotalPrice(
    state.selectedRoom || undefined,
    state.customizations,
    state.specialOffers as any || [],
    state.activeBid,
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
    totalPrice: multiBookingTotalPrice,
    totalItemCount,
    setRoomBookings,
    setIsMobilePricingOverlayOpen,
    isMobilePricingOverlayOpen,
    handleMultiBookingRemoveItem,
    handleMultiBookingEditSection,
    handleMultiBookingConfirmAll,
    handleRoomTabClick,
    handleRoomUpgrade,
    handleRoomBid,
  } = multiBookingState

  // Room-specific selection tracking for multibooking room upgrade isolation
  const [roomSpecificSelections, setRoomSpecificSelections] = useState<Record<string, string>>({})

  // Clear room-specific selections when switching rooms to avoid showing stale selections
  // This ensures each room tab starts with clean upgrade selections
  useEffect(() => {
    if (shouldShowMultiBooking && activeRoomId) {
      // Only clear if the room doesn't already have a selection
      if (!roomSpecificSelections[activeRoomId]) {
        // Room is already clean, no action needed
      }
    }
  }, [activeRoomId, shouldShowMultiBooking, roomSpecificSelections])

  // Use subtotal for header to match pricing panel (taxes removed)
  const totalPrice = shouldShowMultiBooking ? multiBookingTotalPrice : subtotal

  // Helper function to get the correct room ID based on booking mode
  const getCurrentRoomId = (): string => {
    if (shouldShowMultiBooking) {
      // In multibooking mode, use the active room from room tabs
      return activeRoomId || roomBookings[0]?.id || 'default-room'
    } else {
      // In single booking mode, use the selected room from state
      return state.selectedRoom?.id || 'default-room'
    }
  }

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
    const roomId = getCurrentRoomId()
    
    if (shouldShowMultiBooking) {
      // MULTIBOOKING MODE: Add/remove directly to roomBookings[].items
      const currentRoom = roomBookings.find(r => r.id === roomId)
      
      if (!currentRoom) {
        showToast('Please select a room first', 'error')
        return
      }

      if (optionId) {
        // Add customization item
        const newCustomizationItem = {
          id: `customization-${optionId}-${Date.now()}`,
          name: optionLabel,
          price: optionPrice,
          type: 'customization' as const,
          concept: 'customize-your-room' as const,
          category: category,
          // Store original option ID for UI state matching
          originalOptionId: optionId,
        }
        
        // Remove existing customization in same category first, then add new one
        const updatedBookings = roomBookings.map(booking => {
          if (booking.id === roomId) {
            const itemsWithoutCategory = booking.items.filter(item => 
              !(item.type === 'customization' && item.category === category)
            )
            return { ...booking, items: [...itemsWithoutCategory, newCustomizationItem] }
          }
          return booking
        })
        setRoomBookings(updatedBookings)
        
        const roomContext = ` to ${currentRoom.roomName}`
        showToast(`${optionLabel} added${roomContext}`, 'success')
      } else {
        // Remove customization
        const updatedBookings = roomBookings.map(booking => {
          if (booking.id === roomId) {
            const existingCustomization = booking.items.find(item => 
              item.type === 'customization' && item.category === category
            )
            
            if (existingCustomization) {
              return {
                ...booking,
                items: booking.items.filter(item => 
                  !(item.type === 'customization' && item.category === category)
                )
              }
            }
          }
          return booking
        })
        setRoomBookings(updatedBookings)
        
        // Find the existing customization for toast message
        const existingCustomization = currentRoom.items.find(item => 
          item.type === 'customization' && item.category === category
        )
        
        if (existingCustomization) {
          const roomContext = ` from ${currentRoom.roomName}`
          showToast(`${existingCustomization.name} removed${roomContext}`, 'info')
        }
      }
    } else {
      // SINGLE BOOKING MODE: Use existing logic
      if (optionId) {
        // Add customization
        const customization: Customization = {
          id: optionId,
          name: optionLabel,
          price: optionPrice,
          category: category,
        }
        actions.addCustomization(customization, roomId)
        showToast(`${optionLabel} added`, 'success')
      } else {
        // Remove customization (optionId is empty when deselecting)
        const existingCustomization = state.customizations[roomId]?.find(c => c.category === category)
        if (existingCustomization) {
          actions.removeCustomization(existingCustomization.id, roomId)
          showToast(`${existingCustomization.name} removed`, 'info')
        }
      }
    }
  }

  const handleBookOffer = (offerData: OfferData) => {
    if (shouldShowMultiBooking) {
      // In multibooking mode, add/remove offers to/from the active room
      const roomId = getCurrentRoomId()
      const currentRoom = roomBookings.find(r => r.id === roomId)
      
      if (!currentRoom) {
        showToast('Please select a room first', 'error')
        return
      }

      if (offerData.quantity === 0) {
        // Remove offer from the active room
        handleMultiBookingRemoveItem(roomId, offerData.id, offerData.name, 'offer')
        
        const roomContext = ` from ${currentRoom.roomName}`
        showToast(`${offerData.name} removed${roomContext}`, 'info')
      } else {
        // Add offer to the active room
        const newOfferItem = {
          id: `offer-${offerData.id}-${Date.now()}`, // Unique ID for the room item
          name: offerData.name,
          price: offerData.price,
          type: 'offer' as const,
          concept: 'enhance-your-stay' as const,
          // Store offer-specific data
          originalOfferId: offerData.id,
          quantity: offerData.quantity,
          offerType: offerData.type,
          persons: offerData.persons,
          nights: offerData.nights,
          selectedDate: offerData.selectedDate,
          selectedDates: offerData.selectedDates,
        }

        // Add the offer to the current room's items
        const updatedBookings = roomBookings.map(booking =>
          booking.id === roomId
            ? { ...booking, items: [...booking.items, newOfferItem] }
            : booking
        )
        setRoomBookings(updatedBookings)

        const roomContext = ` to ${currentRoom.roomName}`
        showToast(`${offerData.name} added${roomContext}`, 'success')
      }
    } else {
      // Single booking mode - use existing global logic
      if (offerData.quantity === 0) {
        actions.removeSpecialOffer(offerData.id.toString())
        showToast(`${offerData.name} removed from your stay.`, 'info')
      } else {
        const offer = {
          id: offerData.id,
          title: offerData.name,
          description: '',
          image: '',
          price: offerData.price, // Use calculated total for price summary
          basePrice: offerData.basePrice, // Store base price separately
          name: offerData.name,
          // Store selection data to preserve state
          quantity: offerData.quantity,
          type: offerData.type,
          persons: offerData.persons,
          nights: offerData.nights,
          selectedDate: offerData.selectedDate,
          selectedDates: offerData.selectedDates,
        } as any
        actions.addSpecialOffer(offer)
        showToast(`${offer.title} added to your stay.`, 'success')
      }
    }
  }

  const handleLearnMore = (_room: RoomOption) => {
    console.log('Learn more about:', _room);
  }

  const handleMakeOffer = (price: number, room: RoomOption) => {
    if (isMultiBooking && activeRoomId) {
      // Use multibooking bid handler
      handleRoomBid(activeRoomId, price, room.roomType)
      showToast(`Bid of ${translations.currencySymbol}${price} submitted for ${room.title || room.roomType}.`, 'success')
    } else {
      // Use single booking bid handler
      actions.makeOffer(price, room)
      showToast(`Bid of ${translations.currencySymbol}${price} submitted for ${room.title || room.roomType}.`, 'success')
    }
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
    if (onConfirmBooking) {
      // Create booking data from current state
      const bookingData = {
        selectedRoom: state.selectedRoom,
        customizations: Object.values(state.customizations).flat(),
        selectedOffers: state.specialOffers,
        activeBids: state.activeBid ? [state.activeBid] : [],
        totalPrice: subtotal,
        nights
      };
      onConfirmBooking(bookingData);
    }
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
      if (shouldShowMultiBooking && _roomId) {
        // In multibooking mode, remove from specific room's items array
        handleMultiBookingRemoveItem(_roomId, itemId, itemName, 'customization');
        const roomContext = ` from ${roomBookings.find(r => r.id === _roomId)?.roomName || 'room'}`
        showToast(`Customization "${itemName}" removed${roomContext}`, 'info');
      } else {
        // In single booking mode, use the single booking state
        const roomId = _roomId || getCurrentRoomId() || Object.keys(state.customizations).find(
          (key) => state.customizations[key]?.some(c => c.id === itemId)
        );
        if (roomId) {
          actions.removeCustomization(itemId.toString(), roomId);
          showToast(`Customization "${itemName}" removed`, 'info');
        }
      }
    } else if (itemType === 'offer') {
      if (shouldShowMultiBooking && _roomId) {
        // In multibooking mode, remove from specific room
        handleMultiBookingRemoveItem(_roomId, itemId, itemName, 'offer');
        const roomContext = ` from ${roomBookings.find(r => r.id === _roomId)?.roomName || 'room'}`
        showToast(`Special offer "${itemName}" removed${roomContext}`, 'info');
      } else {
        // In single booking mode, use global removal
        actions.removeSpecialOffer(itemId.toString());
        showToast(`Special offer "${itemName}" removed`, 'info');
      }
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
    ...convertCustomizationsToPricingItems(state.customizations, nights),
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

  const selectionStateTexts = {
    loadingLabel: t.loadingLabel,
    errorTitle: t.errorTitle,
    errorMessage: t.errorMessage,
    tryAgainLabel: t.tryAgainLabel,
  }

  // Create room tabs data from room bookings
  const roomTabs: RoomTab[] = roomBookings.map((booking) => ({
    id: booking.id,
    roomName: booking.roomName,
    roomNumber: booking.roomNumber,
    guestName: booking.guestName,
  }))

  // Return early for non-normal states
  if (bookingStatus !== 'normal') {
    return (
      <BookingStateSection
        state={bookingStatus}
        texts={selectionStateTexts}
        onRetry={handleRetry}
        onBackToNormal={handleBackToNormal}
        className={className}
      />
    )
  }

  return (
    <div className={clsx('min-h-screen bg-neutral-50/30 flex flex-col', className)}>
      <Header
        totalPrice={totalPrice}
        totalLabel={t.totalLabel}
        currencySymbol={t.currencySymbol}
        isSticky={!shouldShowMultiBooking}
      />

      {/* Room Tabs - conditionally rendered for multi-booking */}
      {shouldShowMultiBooking && (
        <RoomTabs
          roomTabs={roomTabs}
          activeRoomId={activeRoomId}
          onRoomTabClick={handleRoomTabClick}
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
              activeRoom: activeRoomId,
              onRoomActiveChange: handleRoomTabClick,
              labels: {
                multiRoomBookingsTitle: t.multiBookingLabels.multiRoomBookingsTitle,
                roomsCountLabel: t.multiBookingLabels.roomsCountLabel,
                singleRoomLabel: t.multiBookingLabels.singleRoomLabel || 'habitación',
                clickToExpandLabel: t.multiBookingLabels.clickToExpandLabel,
                roomLabel: 'Habitación',
                guestLabel: 'Huésped',
                selectionLabel: t.selectedText || 'Selected',
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

      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 flex flex-col lg:flex-row gap-6 sm:gap-8 flex-grow pb-20 lg:pb-8">
        <div className="flex-grow space-y-6 sm:space-y-8 w-full xl:max-w-[calc(100%-480px)]">
          {/* Room Selection Section */}
          <section className="sm:bg-transparent sm:shadow-none sm:p-0 bg-white rounded-lg p-4 shadow-sm">
            <RoomSelectionSection
            roomOptions={roomOptions}
            selectedRoom={(() => {
              if (shouldShowMultiBooking) {
                // In multibooking mode, show the current room from active room booking
                const roomId = getCurrentRoomId()
                const currentRoom = roomBookings.find(r => r.id === roomId)
                if (currentRoom) {
                  // Find the room option that matches the current room
                  const matchingRoomOption = roomOptions.find(option => 
                    option.roomType === currentRoom.roomName || 
                    (option.title && option.title.includes(currentRoom.roomName)) ||
                    option.roomType.includes(currentRoom.roomName.toUpperCase())
                  )
                  return matchingRoomOption
                }
                return undefined
              } else {
                // Single booking mode - use selected room from state
                return state.selectedRoom || undefined
              }
            })()}
            onRoomSelected={(room) => {
              if (shouldShowMultiBooking) {
                // In multibooking mode, handle room upgrade
                const roomId = getCurrentRoomId()
                const currentRoom = roomBookings.find(r => r.id === roomId)
                
                if (room) {
                  // Update room-specific selection tracking
                  setRoomSpecificSelections(prev => ({
                    ...prev,
                    [roomId]: room.id
                  }))
                  
                  if (currentRoom) {
                    // Get current room price for upgrade calculation
                    const currentRoomPrice = currentRoom.items.find(item => item.type === 'room')?.price || 129.99
                    const originalRoomName = currentRoom.roomName
                    
                    // Use the new room upgrade handler
                    handleRoomUpgrade(roomId, room, currentRoomPrice)
                    
                    // Show upgrade confirmation toast
                    const upgradePrice = room.price - currentRoomPrice
                    const upgradeText = upgradePrice > 0 
                      ? ` (+€${upgradePrice.toFixed(2)})` 
                      : upgradePrice < 0 
                        ? ` (-€${Math.abs(upgradePrice).toFixed(2)})` 
                        : ''
                    showToast(`Room upgraded from ${originalRoomName} to ${room.roomType}${upgradeText}`, 'success')
                  }
                } else {
                  // Room deselection - remove from room-specific selections
                  setRoomSpecificSelections(prev => {
                    const newSelections = { ...prev }
                    delete newSelections[roomId]
                    return newSelections
                  })
                }
              } else {
                // Single booking mode - use existing handler
                handleRoomSelect(room)
              }
            }}
            onLearnMore={handleLearnMore}
            onMakeOffer={handleMakeOffer}
            onCancelBid={handleCancelBid}
            texts={{
              ...roomTexts,
              // Override texts for multibooking context
              roomTitle: shouldShowMultiBooking 
                ? `Upgrade Your Room ${(() => {
                    const roomId = getCurrentRoomId()
                    const currentRoom = roomBookings.find(r => r.id === roomId)
                    return currentRoom ? `(${currentRoom.roomName})` : ''
                  })()} ` 
                : roomTexts.roomTitle,
              roomSubtitle: shouldShowMultiBooking 
                ? 'Choose an upgrade for your currently selected room'
                : roomTexts.roomSubtitle,
            }}
            isVisible={shouldShowSection('room', computedAvailableSections)}
            showPriceSlider={true}
            activeBid={state.activeBid ? {
              roomId: state.activeBid.roomId,
              bidAmount: state.activeBid.bidAmount,
              status: state.activeBid.status
            } : undefined}
            contextRoomId={shouldShowMultiBooking ? activeRoomId : undefined}
            roomSpecificSelections={shouldShowMultiBooking ? roomSpecificSelections : undefined}
          />
          </section>

          {/* Room Customization Section */}
          <section className="sm:shadow-none sm:p-0 bg-neutral-50/30 rounded-lg lg:p-4">
            <CustomizationSection
            sections={sections}
            sectionOptions={sectionOptions}
            selectedCustomizations={(() => {
              const converted: SelectedCustomizations = {}
              const roomId = getCurrentRoomId()
              
              if (shouldShowMultiBooking) {
                // READ FROM MULTIBOOKING STATE
                const currentRoom = roomBookings.find(r => r.id === roomId)
                const customizationItems = currentRoom?.items.filter(item => item.type === 'customization') || []
                
                customizationItems.forEach((item) => {
                  if (item.category) {
                    converted[item.category] = {
                      id: item.originalOptionId || item.id.toString(),
                      label: item.name,
                      price: item.price,
                    }
                  }
                })
              } else {
                // READ FROM SINGLE BOOKING STATE
                const customizationsForRoom = state.customizations[roomId] || []
                
                // For each customization, use its category as the key
                customizationsForRoom.forEach((customization) => {
                  if (customization.category) {
                    converted[customization.category] = {
                      id: customization.id,
                      label: customization.name,
                      price: customization.price,
                    }
                  }
                })
              }
              
              return converted
            })()}
            onCustomizationChange={handleCustomizationChange}
            texts={(() => {
              if (shouldShowMultiBooking) {
                // Add room context to customization texts in multibooking mode
                const roomId = getCurrentRoomId()
                const currentRoom = roomBookings.find(r => r.id === roomId)
                const roomContext = currentRoom ? ` - ${currentRoom.roomName} (Room ${currentRoom.roomNumber})` : ''
                
                return {
                  ...customizationTexts,
                  customizeTitle: `${customizationTexts.customizeTitle}${roomContext}`,
                  customizeSubtitle: shouldShowMultiBooking 
                    ? 'Customize the currently selected room with your preferred options'
                    : customizationTexts.customizeSubtitle,
                }
              } else {
                return customizationTexts
              }
            })()}
            fallbackImageUrl={fallbackImageUrl}
            isVisible={shouldShowSection('customization', computedAvailableSections)}
            compatibilityRules={compatibilityRules}
          />
          </section>

          {/* ABS Room Selection Section */}
          {roomSelectionMap && (
            <section className="sm:bg-transparent sm:shadow-none sm:p-0 bg-white rounded-lg p-4 shadow-sm">
              <ABS_RoomSelection
                title={roomSelectionMap.title}
                description={roomSelectionMap.description}
                url={roomSelectionMap.url}
                iframe={roomSelectionMap.iframe}
              />
            </section>
          )}

          {/* Special Offers Section */}
          <section className="sm:bg-transparent sm:shadow-none sm:p-0 bg-neutral-50/30 rounded-lg lg:p-4">
            <SpecialOffersSection
            specialOffers={specialOffers}
            selectedOffers={(() => {
              if (shouldShowMultiBooking) {
                // In multibooking mode, get offers from the active room's items
                const roomId = getCurrentRoomId()
                const currentRoom = roomBookings.find(r => r.id === roomId)
                const roomOffers = currentRoom?.items?.filter(item => item.type === 'offer') || []
                
                // Convert room offer items to the format expected by SpecialOffersSection
                return roomOffers.map(item => ({
                  id: (item as any).originalOfferId || item.id,
                  title: item.name,
                  name: item.name,
                  price: item.price,
                  quantity: (item as any).quantity || 1,
                  type: (item as any).offerType || 'perStay',
                  persons: (item as any).persons,
                  nights: (item as any).nights,
                  selectedDate: (item as any).selectedDate,
                  selectedDates: (item as any).selectedDates,
                }))
              } else {
                // In single booking mode, use global special offers
                return state.specialOffers as any
              }
            })()}
            onBookOffer={handleBookOffer}
            reservationInfo={reservationInfo}
            texts={(() => {
              if (shouldShowMultiBooking) {
                // Add room context to special offers texts in multibooking mode
                const roomId = getCurrentRoomId()
                const currentRoom = roomBookings.find(r => r.id === roomId)
                const roomContext = currentRoom ? ` - ${currentRoom.roomName} (Room ${currentRoom.roomNumber})` : ''
                
                return {
                  ...offersTexts,
                  offersTitle: `${offersTexts.offersTitle}${roomContext}`,
                  offersSubtitle: shouldShowMultiBooking 
                    ? 'Add special offers to enhance the currently selected room'
                    : offersTexts.offersSubtitle,
                }
              } else {
                return offersTexts
              }
            })()}
            isVisible={shouldShowSection('offer', computedAvailableSections)}
          />
          </section>
        </div>

        <aside className="flex-shrink-0 md:max-w-md sticky top-24 self-start w-full ">
          {shouldShowMultiBooking ? (
            <MultiBookingPricingSummaryPanel
              roomBookings={roomBookings}
              labels={t.multiBookingLabels}
              currency="EUR"
              locale={language === 'en' ? 'en-US' : 'es-ES'}
              isLoading={false} // isPriceCalculating is removed from useBookingState
              // Removed activeRooms and onActiveRoomsChange to fix accordion click issue
              // Accordion will now manage its own expansion state independently
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
                  bidForUpgradeLabel: 'Bid for Upgrade',
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
                    {/* {roomSelectionMap && (
            <RoomSelectionMapSection
              roomSelectionConfig={roomSelectionMap}
              isVisible={true}
            />
          )} */}
      {/* Mobile Pricing Widget */}
      <MobilePricingWidget
        total={shouldShowMultiBooking ? totalPrice : total}
        currencySymbol={translations.currencySymbol}
        itemCount={shouldShowMultiBooking ? totalItemCount : cartItemCount}
        onShowPricing={shouldShowMultiBooking 
          ? () => setIsMobilePricingOverlayOpen(true)
          : handleShowMobilePricing
        }
        isLoading={false} // isPriceCalculating is removed from useBookingState
        summaryButtonLabel={translations.summaryButtonLabel}
        
        // Multibooking props
        isMultiBooking={shouldShowMultiBooking}
        roomCount={shouldShowMultiBooking ? roomBookings.length : undefined}
        roomsLabel={shouldShowMultiBooking ? "rooms" : undefined}
      />

      {/* Mobile Pricing Overlay */}
      <MobilePricingOverlay
        isOpen={shouldShowMultiBooking ? isMobilePricingOverlayOpen : showMobilePricing}
        onClose={shouldShowMultiBooking ? () => setIsMobilePricingOverlayOpen(false) : handleCloseMobilePricing}
        
        {...(shouldShowMultiBooking ? {
          // Multibooking props
          isMultiBooking: true,
          roomBookings: roomBookings,
          activeRoom: activeRoomId,
          onActiveRoomChange: handleRoomTabClick,
          multiBookingLabels: t.multiBookingLabels,
          onMultiBookingRemoveItem: handleMultiBookingRemoveItem,
          onMultiBookingEditSection: handleMultiBookingEditSection,
          onMultiBookingConfirmAll: handleMultiBookingConfirmAll,
          multiBookingCurrency: "EUR",
          multiBookingLocale: language === 'en' ? 'en-US' : 'es-ES',
          // Required base props (even though they won't be used in multibooking mode)
          roomImage: fallbackImageUrl,
          items: [],
          pricing: { subtotal: 0 },
          labels: {
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
            missingLabelsError: 'Missing labels error',
            invalidPricingError: 'Invalid pricing error',
            currencyFormatError: 'Currency format error',
            performanceWarning: 'Performance warning',
            notificationsLabel: 'Notifications',
            closeNotificationLabel: 'Close notification',
            pricingSummaryLabel: 'Pricing summary',
            processingLabel: 'Processing',
            bidForUpgradeLabel: 'Bid for Upgrade',
          },
          onRemoveItem: () => {},
          onConfirm: () => {}
        } : {
          // Single booking props (existing)
          roomImage: state.selectedRoom?.image || fallbackImageUrl,
          items: pricingItems,
          pricing: { subtotal, taxes: tax },
          isLoading: false,
          availableSections: computedAvailableSections,
          labels: {
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
            missingLabelsError: 'Missing labels error',
            invalidPricingError: 'Invalid pricing error',
            currencyFormatError: 'Currency format error',
            performanceWarning: 'Performance warning',
            notificationsLabel: 'Notifications',
            closeNotificationLabel: 'Close notification',
            pricingSummaryLabel: 'Pricing summary',
            processingLabel: 'Processing',
            bidForUpgradeLabel: 'Bid for Upgrade',
          },
          currency: "EUR",
          locale: language === 'en' ? 'en-US' : 'es-ES',
          onRemoveItem: (id: string | number, name: string, type: PricingItem['type']) => {
            handleRemoveItem(id, name, type)
          },
          onConfirm: handleConfirm,
          onEditSection: (section: 'room' | 'customizations' | 'offers') => {
            if (section === 'room') handleEditSection('room')
            else if (section === 'customizations') handleEditSection('customizations')
            else if (section === 'offers') handleEditSection('offer')
          }
        })}
      />
    </div>
  )
}

export default ABSLanding
export { ABSLanding as ABS_Landing }
