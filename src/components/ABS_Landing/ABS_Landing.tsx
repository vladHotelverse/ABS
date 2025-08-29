import clsx from 'clsx'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
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
import { useBookingStore } from '../../stores/bookingStore'
import {
  generateAvailableSections,
  getDetailedCartCounts,
  getMultiBookingDetailedCounts,
  shouldShowSection,
  calculateNights,
} from './utils/dataConversion'
// Removed unused Customization import - using unified store items now

// Re-export types from sections for compatibility
export type { RoomOption, SpecialOffer } from './sections'

// Import safe type conversion utilities
import { convertToStoreRoomBooking, convertFromStoreRoomBooking, convertBookingItemToPricingItem } from '../../types/shared'

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

  // Use unified Zustand store for state management
  const bookingStore = useBookingStore()
  
  // Initialize store with provided values if needed with proper cleanup
  React.useEffect(() => {
    if (initialState && bookingStore.bookingStatus !== initialState) {
      bookingStore.setBookingStatus(initialState)
    }
    
    // Initialize single booking mode with initial room selection if provided
    if (!isMultiBooking && initialSelectedRoom) {
      // Ensure single mode is set
      bookingStore.setMode('single')
      
      // Get or create the single booking room
      const singleRoom = bookingStore.rooms[0]
      if (singleRoom) {
        // Check if initial room is already added to prevent duplicates
        const hasRoomItem = singleRoom.items.some(item => 
          item.type === 'room' && 
          item.metadata?.roomId === initialSelectedRoom.id
        )
        
        if (!hasRoomItem) {
          // Add initial room as an upgrade item if not already present
          const roomUpgradeItem = {
            name: initialSelectedRoom.title || initialSelectedRoom.roomType,
            price: initialSelectedRoom.price,
            type: 'room' as const,
            concept: 'choose-your-superior-room' as const,
            category: 'room-upgrade',
            metadata: {
              roomId: initialSelectedRoom.id,
              roomType: initialSelectedRoom.roomType,
              fullPrice: initialSelectedRoom.price,
            }
          }
          bookingStore.addItemToRoom(singleRoom.id, roomUpgradeItem)
        }
      }
    }
  }, [])
  
  // Remove legacy state - use unified store directly
  // Components now access store items directly via bookingStore.rooms[].items
  
  const showMobilePricing = bookingStore.showMobilePricing
  const bookingStatus = bookingStore.bookingStatus
  const showToast = bookingStore.showToast


  // Initialize multibooking in store if needed
  React.useEffect(() => {
    if (isMultiBooking && initialRoomBookings && initialRoomBookings.length > 0) {
      bookingStore.setMode('multi')
      
      // The store's addRoom already checks for duplicates, so we don't need to track them here
      initialRoomBookings.forEach(room => {
        try {
          const storeRoom = convertToStoreRoomBooking(room)
          bookingStore.addRoom(storeRoom)
        } catch (error) {
          console.error(`Failed to initialize room ${room.id}:`, error)
          bookingStore.showToast(`Failed to load room ${room.roomName}. Please try again.`, 'error')
        }
      })
    }
  }, []) // Empty dependency to run only once on mount

  // Use translations based on language
  const t = translations

  // Extract multibooking state from unified store
  const storeRoomBookings = bookingStore.rooms
  const activeRoomId = bookingStore.activeRoomId
  const isMobilePricingOverlayOpen = bookingStore.isMobilePricingOverlayOpen
  
  // Determine if we should show multi-booking mode
  const shouldShowMultiBooking = useMemo(() => 
    isMultiBooking && storeRoomBookings.length > 1, 
    [isMultiBooking, storeRoomBookings.length]
  )

  // Calculate cart item count using unified store (after shouldShowMultiBooking is defined)
  const cartItemCount = bookingStore.getItemCount()

  // Calculate detailed counts for mobile pricing badges
  const detailedCounts = shouldShowMultiBooking ?
    getMultiBookingDetailedCounts(bookingStore.rooms) :
    getDetailedCartCounts({
      selectedRoom: undefined, // Items are now in store
      selectedCustomizations: {}, // Items are now in store
      selectedOffers: [], // Items are now in store
      activeBid: null, // Items are now in store
    })

  // Calculate subtotal using unified store
  const subtotal = bookingStore.getTotalPrice()
  const tax = subtotal * 0.1 // Assuming a 10% tax rate

  // Calculate totalPrice for header (now that subtotal is defined)
  const multiBookingTotalPrice = bookingStore.getMultiBookingTotalPrice()
  const totalPrice = shouldShowMultiBooking ? multiBookingTotalPrice : subtotal
  
  // Convert store room bookings to component room bookings for UI consumption
  const roomBookings = useMemo(() => {
    return storeRoomBookings.map(room => {
      try {
        return convertFromStoreRoomBooking(room)
      } catch (error) {
        console.error(`Failed to convert room ${room.id} for UI:`, error instanceof Error ? error.message : String(error))
        // Return room as-is if conversion fails (for graceful degradation)
        return room as any
      }
    })
  }, [storeRoomBookings])

  // Calculate detailed counts for multibooking mode
  const multiBookingDetailedCounts = useMemo(() => 
    getMultiBookingDetailedCounts(roomBookings), 
    [roomBookings]
  )
  
  // Removed unused roomBookingsLength variable
  // multiBookingTotalPrice moved earlier to avoid duplicate declaration
  // Use direct store selector for totalItemCount to ensure reactivity to room item changes
  const totalItemCount = useBookingStore(state => state.getTotalItemCount())
  
  // Cleanup memoized calculations on unmount to prevent memory leaks
  React.useEffect(() => {
    return () => {
      // Memoized values will be automatically garbage collected
      // This cleanup is mainly for consistency and future-proofing
    }
  }, [])
  
  // Memoize shouldShowMultiBooking to prevent cascading re-renders
  // shouldShowMultiBooking moved earlier in component

  // Generate available sections if not provided with memoization
  const computedAvailableSections = useMemo(() =>
    availableSections ||
    generateAvailableSections(roomOptions.length > 0, sections.length > 0, specialOffers.length > 0, language),
    [availableSections, roomOptions.length, sections.length, specialOffers.length, language]
  )

  // Room-specific selection tracking for multibooking room upgrade isolation
  const [roomSpecificSelections, setRoomSpecificSelections] = useState<Record<string, string>>({})

  // Note: setRoomBookings is no longer needed as we use store methods directly
  const setIsMobilePricingOverlayOpen = bookingStore.setMobilePricingOverlayOpen
  // Wrapper to match the expected signature for onMultiBookingRemoveItem
  const handleMultiBookingRemoveItemWrapper = useCallback((roomId: string, itemId: string | number, _itemName: string, _itemType: string) => {
    // Check if we're removing a room upgrade
    const room = bookingStore.rooms.find(r => r.id === roomId)
    const itemToRemove = room?.items.find(item => item.id === String(itemId))
    
    if (itemToRemove?.type === 'room') {
      // Clear the room-specific selection when removing a room upgrade
      setRoomSpecificSelections(prev => {
        const newSelections = { ...prev }
        delete newSelections[roomId]
        return newSelections
      })
      
      // Restore original room name from baseRoom if available
      if (room?.baseRoom) {
        bookingStore.updateRoom(roomId, { 
          roomName: room.baseRoom.title || room.baseRoom.roomType 
        })
      }
    }
    
    bookingStore.removeItemFromRoom(roomId, String(itemId))
  }, [bookingStore, setRoomSpecificSelections])
  
  // Enhanced remove handler that also clears room selections when needed
  const handleMultiBookingRemoveItem = useCallback((roomId: string, itemId: string) => {
    // Check if we're removing a room upgrade
    const room = bookingStore.rooms.find(r => r.id === roomId)
    const itemToRemove = room?.items.find(item => item.id === itemId)
    
    if (itemToRemove?.type === 'room') {
      // Clear the room-specific selection when removing a room upgrade
      setRoomSpecificSelections(prev => {
        const newSelections = { ...prev }
        delete newSelections[roomId]
        return newSelections
      })
      
      // Restore original room name from baseRoom if available
      if (room?.baseRoom) {
        bookingStore.updateRoom(roomId, { 
          roomName: room.baseRoom.title || room.baseRoom.roomType 
        })
      }
    }
    
    bookingStore.removeItemFromRoom(roomId, itemId)
  }, [bookingStore, setRoomSpecificSelections])
  const handleMultiBookingEditSection = useCallback((roomId: string, _sectionName: string) => {
    // Implementation depends on section editing requirements
    bookingStore.handleRoomTabClick(roomId)
  }, [bookingStore])
  const handleMultiBookingConfirmAll = useCallback(async () => {
    if (onConfirmBooking) {
      // onConfirmBooking is synchronous (returns void), so we wrap it in a Promise
      return new Promise<void>((resolve) => {
        onConfirmBooking(roomBookings)
        resolve()
      })
    }
  }, [onConfirmBooking, roomBookings])
  const handleRoomTabClick = bookingStore.handleRoomTabClick
  const handleRoomUpgrade = bookingStore.handleRoomUpgrade
  const handleRoomBid = bookingStore.handleRoomBid
  
  // Cleanup room-specific selections on unmount to prevent memory leaks
  React.useEffect(() => {
    return () => {
      // Clear room-specific selections on component unmount
      setRoomSpecificSelections({})
    }
  }, [])

  // Clear room-specific selections when switching rooms to avoid showing stale selections
  // This ensures each room tab starts with clean upgrade selections  
  const stableActiveRoomId = useMemo(() => activeRoomId, [activeRoomId])
  
  useEffect(() => {
    if (shouldShowMultiBooking && stableActiveRoomId) {
      // Only clear if the room doesn't already have a selection
      if (!roomSpecificSelections[stableActiveRoomId]) {
        // Room is already clean, no action needed
      }
    }
    
    // Cleanup function for this effect
    return () => {
      // No specific cleanup needed for this effect as it only reads state
    }
  }, [stableActiveRoomId, shouldShowMultiBooking, roomSpecificSelections])

  // Calculate totalPrice using store methods (moved after subtotal calculation)
  // This will be recalculated after subtotal is defined

  // Helper function to get the correct room ID based on booking mode
  const getCurrentRoomId = useCallback((): string => {
    if (shouldShowMultiBooking) {
      // In multibooking mode, use the active room from room tabs
      return activeRoomId || roomBookings[0]?.id || 'default-room'
    } else {
      // In single booking mode, ensure we have a room
      if (bookingStore.rooms.length === 0) {
        bookingStore.setMode('single')
      }
      return bookingStore.rooms[0]?.id || 'single-booking-default'
    }
  }, [shouldShowMultiBooking, activeRoomId, roomBookings, bookingStore])

  // Handlers for user interactions
  const handleRoomSelect = useCallback((room: RoomOption) => {
    // Add room selection as an item in the default single booking room
    const roomId = getCurrentRoomId()
    
    // Remove any existing room selections
    const currentRoom = bookingStore.rooms.find(r => r.id === roomId)
    if (currentRoom) {
      const existingRoomItems = currentRoom.items.filter(item => item.type === 'room')
      existingRoomItems.forEach(item => {
        bookingStore.removeItemFromRoom(roomId, item.id)
      })
    }
    
    // Add new room selection
    const roomItem = {
      name: room.title || room.roomType,
      price: room.price,
      type: 'room' as const,
      concept: 'choose-your-superior-room' as const,
      category: 'room-upgrade',
      metadata: {
        roomId: room.id,
        roomType: room.roomType,
        fullPrice: room.price,
      }
    }
    bookingStore.addItemToRoom(roomId, roomItem)
  }, [getCurrentRoomId, bookingStore])

  const handleCustomizationChange = useCallback((
    category: string,
    optionId: string,
    optionLabel: string,
    optionPrice: number
  ) => {
    // Use unified Zustand store approach for both single and multi booking modes
    const roomId = getCurrentRoomId()
    const currentRoom = bookingStore.rooms.find(r => r.id === roomId)

    if (!currentRoom) {
      showToast('Unable to process customization - room not found', 'error')
      return
    }

    if (optionId) {
      // First remove any existing customization in the same category
      const existingCustomization = currentRoom.items.find(item =>
        item.type === 'customization' && item.category === category
      )
      if (existingCustomization) {
        bookingStore.removeItemFromRoom(roomId, String(existingCustomization.id))
      }

      // Add new customization item
      const newCustomizationItem = {
        name: optionLabel,
        price: optionPrice,
        type: 'customization' as const,
        concept: 'customize-your-room' as const,
        category: category,
        metadata: { originalOptionId: optionId },
      }

      bookingStore.addItemToRoom(roomId, newCustomizationItem)

      const roomContext = shouldShowMultiBooking ? ` to ${currentRoom.roomName}` : ''
      showToast(`${optionLabel} added${roomContext}`, 'success')
    } else {
      // Remove customization - find and remove by category
      const existingCustomization = currentRoom.items.find(item =>
        item.type === 'customization' && item.category === category
      )

      if (existingCustomization) {
        bookingStore.removeItemFromRoom(roomId, String(existingCustomization.id))
        const roomContext = shouldShowMultiBooking ? ` from ${currentRoom.roomName}` : ''
        showToast(`${existingCustomization.name} removed${roomContext}`, 'info')
      }
    }
  }, [getCurrentRoomId, shouldShowMultiBooking, bookingStore, showToast])

  const handleBookOffer = useCallback((offerData: OfferData) => {
    // Use unified Zustand store approach for both single and multi booking modes
    const roomId = getCurrentRoomId()
    const currentRoom = bookingStore.rooms.find(r => r.id === roomId)

    if (!currentRoom) {
      showToast('Unable to process offer - room not found', 'error')
      return
    }

    if (offerData.quantity === 0) {
      // Remove offer - find by originalOfferId
      const offerToRemove = currentRoom.items.find(item => 
        item.type === 'offer' && item.metadata?.originalOfferId === offerData.id
      )
      
      if (offerToRemove) {
        bookingStore.removeItemFromRoom(roomId, String(offerToRemove.id))
        const roomContext = shouldShowMultiBooking ? ` from ${currentRoom.roomName}` : ''
        showToast(`${offerData.name} removed${roomContext}`, 'info')
      }
    } else {
      // Add offer - check for duplicates first
      const existingOffer = currentRoom.items.find(item => 
        item.type === 'offer' && item.metadata?.originalOfferId === offerData.id
      )

      if (existingOffer) {
        const roomContext = shouldShowMultiBooking ? 'this room' : 'your stay'
        showToast(`${offerData.name} is already added to ${roomContext}`, 'error')
        return
      }

      // Add new offer to room
      const newOfferItem = {
        name: offerData.name,
        price: offerData.price,
        type: 'offer' as const,
        concept: 'enhance-your-stay' as const,
        metadata: {
          originalOfferId: offerData.id,
          quantity: offerData.quantity,
          offerType: offerData.type,
          persons: offerData.persons,
          nights: offerData.nights,
          selectedDate: offerData.selectedDate,
          selectedDates: offerData.selectedDates,
        }
      }

      bookingStore.addItemToRoom(roomId, newOfferItem)
      const roomContext = shouldShowMultiBooking ? ` to ${currentRoom.roomName}` : ' to your stay'
      showToast(`${offerData.name} added${roomContext}`, 'success')
    }
  }, [shouldShowMultiBooking, getCurrentRoomId, bookingStore, showToast])

  const handleLearnMore = useCallback((_room: RoomOption) => {
    console.log('Learn more about:', _room);
  }, [])

  const handleMakeOffer = useCallback((price: number, room: RoomOption) => {
    if (isMultiBooking && activeRoomId) {
      // Use multibooking bid handler
      handleRoomBid(activeRoomId, price, room.roomType)
      showToast(`Bid of ${translations.currencySymbol}${price} submitted for ${room.title || room.roomType}.`, 'success')
    } else {
      // Use single booking bid handler - add bid as item to default room
      const bidItem = {
        name: `Bid for ${room.title || room.roomType}`,
        price: price,
        type: 'bid' as const,
        concept: 'bid-for-upgrade' as const,
        category: 'bid',
        metadata: {
          bidStatus: 'submitted',
          roomType: room.roomType,
        }
      }
      const roomId = getCurrentRoomId()
      bookingStore.addItemToRoom(roomId, bidItem)
      showToast(`Bid of ${translations.currencySymbol}${price} submitted for ${room.title || room.roomType}.`, 'success')
    }
  }, [isMultiBooking, activeRoomId, handleRoomBid, showToast, translations.currencySymbol, bookingStore])

  const handleCancelBid = useCallback((roomId: string) => {
    // Remove bid items from the room
    const room = bookingStore.rooms.find(r => r.id === roomId)
    if (room) {
      const bidItems = room.items.filter(item => item.type === 'bid')
      bidItems.forEach(item => {
        bookingStore.removeItemFromRoom(roomId, item.id)
      })
    }
    showToast(`Bid for room ${roomId} cancelled.`, 'info')
  }, [bookingStore, showToast])

  const handleEditSection = useCallback((_section: 'room' | 'customizations' | 'offers') => {
    // This function can be used to navigate the user to the relevant section
  }, [])

  const handleShowMobilePricing = useCallback(() => {
    bookingStore.setShowMobilePricing(true);
  }, [bookingStore])

  const handleCloseMobilePricing = useCallback(() => {
    bookingStore.setShowMobilePricing(false);
  }, [bookingStore])

  // Handlers for booking state transitions
  const handleConfirm = useCallback(() => {
    if (onConfirmBooking) {
      // Create booking data from unified store
      const bookingData = {
        rooms: bookingStore.rooms,
        totalPrice: subtotal,
        nights
      };
      onConfirmBooking(bookingData);
    }
  }, [onConfirmBooking, bookingStore.rooms, subtotal, nights]);

  const handleRetry = useCallback(() => {
    bookingStore.resetState();
  }, [bookingStore]);

  const handleBackToNormal = useCallback(() => {
    bookingStore.resetState();
  }, [bookingStore]);

  // Unified handler for removing items from both single and multi-booking panels
  const handleRemoveItem = useCallback((
    itemId: string | number,
    itemName: string,
    itemType: 'room' | 'customization' | 'offer' | 'bid',
    _roomId?: string
  ) => {
    // Use unified Zustand store approach for all item types
    const roomId = _roomId || getCurrentRoomId()
    
    if (itemType === 'customization' || itemType === 'offer') {
      // Remove from unified store
      bookingStore.removeItemFromRoom(roomId, String(itemId))
      
      const roomContext = shouldShowMultiBooking && _roomId 
        ? ` from ${roomBookings.find(r => r.id === _roomId)?.roomName || 'room'}` 
        : ''
      
      const itemTypeLabel = itemType === 'customization' ? 'Customization' : 'Special offer'
      showToast(`${itemTypeLabel} "${itemName}" removed${roomContext}`, 'info')
    } else if (itemType === 'room') {
      if (shouldShowMultiBooking && _roomId) {
        // In multibooking mode, handle room upgrade removal using store methods
        handleMultiBookingRemoveItem(_roomId, String(itemId))
        
        const roomName = roomBookings.find(r => r.id === _roomId)?.roomName || 'room'
        showToast(`Room upgrade removed for ${roomName}`, 'info')
      } else {
        // Single booking mode - remove room item from default room
        bookingStore.removeItemFromRoom(roomId, String(itemId))
        showToast(translations.roomRemovedMessage, 'info')
      }
    } else if (itemType === 'bid') {
      // Bids can be removed using store method too
      bookingStore.removeItemFromRoom(roomId, String(itemId))
      showToast(`Bid removed for ${itemName}`, 'info')
    }
  }, [shouldShowMultiBooking, handleMultiBookingRemoveItem, roomBookings, showToast, translations.roomRemovedMessage, getCurrentRoomId, bookingStore]);

  // Convert store items to pricing items using proper conversion utility
  const pricingItems: PricingItem[] = useMemo(() => {
    const currentRoom = bookingStore.rooms[0]
    if (!currentRoom) return []
    
    // Use the proper conversion utility that preserves all fields including concept
    return currentRoom.items.map(item => convertBookingItemToPricingItem(item))
  }, [bookingStore.rooms])

  // Create section texts for subcomponents with memoization
  const roomTexts = useMemo(() => ({
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
  }), [t])

  const customizationTexts = useMemo(() => ({
    ...t,
    customizeTitle: t.customizeTitle,
    customizeSubtitle: t.customizeSubtitle,
  }), [t])

  const offersTexts = useMemo(() => ({
    offersTitle: t.offersTitle,
    offersSubtitle: t.offersSubtitle,
    currencySymbol: t.currencySymbol,
    specialOffersLabels: t.specialOffersLabels,
  }), [t])

  const selectionStateTexts = useMemo(() => ({
    loadingLabel: t.loadingLabel,
    errorTitle: t.errorTitle,
    errorMessage: t.errorMessage,
    tryAgainLabel: t.tryAgainLabel,
  }), [t])

  // Create room tabs data from room bookings with memoization and cleanup
  const roomTabs: RoomTab[] = useMemo(() => roomBookings.map((booking) => ({
    id: booking.id,
    roomName: booking.roomName,
    roomNumber: booking.roomNumber,
    guestName: booking.guestName,
    baseRoomRoomType: booking.baseRoom?.roomType, // Show upgrade indicator if baseRoom is available
  })), [roomBookings])
  
  // Master cleanup effect for all multibooking state on unmount
  React.useEffect(() => {
    return () => {
      // Comprehensive cleanup on component unmount to prevent memory leaks
      if (isMultiBooking) {
        // Clear room-specific selections
        setRoomSpecificSelections({})
        
        // Note: We don't reset the entire booking store here as it might be used by other components
        // The store's persistence mechanism and garbage collection will handle memory cleanup
      }
    }
  }, [isMultiBooking])

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
    <div className={clsx('min-h-screen flex flex-col', className)}>
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
          activeRoomId={activeRoomId || undefined}
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
            activeRoom: activeRoomId || undefined,
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
        <div className="flex-grow space-y-6 sm:space-y-8 w-full xl:max-w-[calc(100%-400px)]">
          {/* Room Selection Section */}
          <RoomSelectionSection
            roomOptions={roomOptions}
            selectedRoom={(() => {
              if (shouldShowMultiBooking) {
                // In multibooking mode, check if this room has a selection
                const roomId = getCurrentRoomId()
                const selectedRoomId = roomSpecificSelections[roomId]
                
                if (selectedRoomId) {
                  // Find the room option that matches the selected room ID
                  const selectedRoomOption = roomOptions.find(option => option.id === selectedRoomId)
                  return selectedRoomOption
                }
                
                // Check if there's a room upgrade item in the current booking
                const currentRoom = roomBookings.find(r => r.id === roomId)
                if (currentRoom) {
                  const roomItem = currentRoom.items.find((item: any) => 
                    item.type === 'room'
                  )
                  
                  if (roomItem && roomItem.metadata?.roomId) {
                    // Find the room option that matches the upgraded room
                    const matchingRoomOption = roomOptions.find(option =>
                      option.id === roomItem.metadata.roomId ||
                      option.roomType === roomItem.name ||
                      option.title === roomItem.name
                    )
                    return matchingRoomOption
                  }
                }
                
                return undefined
              } else {
                // Single booking mode - get selected room from store items
                const currentRoom = bookingStore.rooms[0]
                const roomItem = currentRoom?.items.find(item => item.type === 'room')
                if (roomItem) {
                  return {
                    id: (roomItem.metadata?.roomId as string) || 'selected',
                    roomType: (roomItem.metadata?.roomType as string) || 'Selected Room',
                    title: roomItem.name,
                    price: roomItem.price,
                    description: '',
                    image: '',
                    amenities: []
                  }
                }
                return undefined
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
                    const currentRoomPrice = currentRoom.items.find((item: any) => item.type === 'room')?.price || 129.99
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
                  // Room deselection - remove from room-specific selections AND remove room upgrade items
                  setRoomSpecificSelections(prev => {
                    const newSelections = { ...prev }
                    delete newSelections[roomId]
                    return newSelections
                  })

                  // Remove room upgrade - simplified logic
                  const currentRoom = roomBookings.find(r => r.id === roomId)
                  if (currentRoom) {
                    // Find and remove all room items
                    const roomItems = currentRoom.items.filter((item: any) => item.type === 'room')
                    
                    roomItems.forEach((item: any) => {
                      bookingStore.removeItemFromRoom(roomId, String(item.id))
                    })

                    // Restore original room name if we have baseRoom info
                    if (currentRoom.baseRoom) {
                      bookingStore.updateRoom(roomId, { 
                        roomName: currentRoom.baseRoom.title || currentRoom.baseRoom.roomType 
                      })
                    }

                    showToast(`Room upgrade removed for ${currentRoom.roomName}`, 'info')
                  }
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
            activeBid={(() => {
              const roomId = getCurrentRoomId()
              const currentRoom = bookingStore.rooms.find(r => r.id === roomId)
              const bidItem = currentRoom?.items.find(item => item.type === 'bid')
              return bidItem ? {
                roomId: roomId,
                bidAmount: bidItem.price,
                status: 'pending'
              } : undefined
            })()}
            contextRoomId={shouldShowMultiBooking ? activeRoomId || undefined : undefined}
            roomSpecificSelections={shouldShowMultiBooking ? roomSpecificSelections : undefined}
          />

          {/* Room Customization Section */}
          <CustomizationSection
            sections={sections}
            sectionOptions={sectionOptions}
            selectedCustomizations={(() => {
              const converted: SelectedCustomizations = {}
              const roomId = getCurrentRoomId()

              if (shouldShowMultiBooking) {
                // READ FROM MULTIBOOKING STATE
                const currentRoom = roomBookings.find(r => r.id === roomId)
                const customizationItems = currentRoom?.items.filter((item: any) => item.type === 'customization') || []

                customizationItems.forEach((item: any) => {
                  if (item.category) {
                    converted[item.category] = {
                      id: String(item.metadata?.originalOptionId || item.id),
                      label: item.name,
                      price: item.price,
                    }
                  }
                })
              } else {
                // READ FROM SINGLE BOOKING STATE (same pattern as multibooking)
                const currentRoom = bookingStore.rooms.find(r => r.id === roomId)
                const customizationItems = currentRoom?.items.filter(item => item.type === 'customization') || []

                customizationItems.forEach((item) => {
                  if (item.category) {
                    converted[item.category] = {
                      id: String(item.metadata?.originalOptionId || item.id),
                      label: item.name,
                      price: item.price,
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

          {/* ABS Room Selection Section */}
          {roomSelectionMap && (
            <ABS_RoomSelection
              title={roomSelectionMap.title}
              description={roomSelectionMap.description}
              url={roomSelectionMap.url}
              iframe={roomSelectionMap.iframe}
            />
          )}

          {/* Special Offers Section */}
          <section className="bg-transparent sm:shadow-none rounded-lg">
            <SpecialOffersSection
              specialOffers={specialOffers}
              selectedOffers={(() => {
                if (shouldShowMultiBooking) {
                  // In multibooking mode, get offers from the active room's items
                  const roomId = getCurrentRoomId()
                  const currentRoom = roomBookings.find(r => r.id === roomId)
                  const roomOffers = currentRoom?.items?.filter((item: any) => item.type === 'offer') || []

                  // Convert room offer items to the format expected by SpecialOffersSection
                  return roomOffers.map((item: any) => ({
                    id: item.metadata?.originalOfferId || item.id,
                    title: item.name,
                    name: item.name,
                    price: item.price,
                    quantity: item.metadata?.quantity || 1,
                    type: item.metadata?.offerType || 'perStay',
                    persons: item.metadata?.persons,
                    nights: item.metadata?.nights,
                    selectedDate: item.metadata?.selectedDate,
                    selectedDates: item.metadata?.selectedDates,
                  }))
                } else {
                  // In single booking mode, convert store items to special offers format
                  const roomId = getCurrentRoomId()
                  const currentRoom = bookingStore.rooms.find(r => r.id === roomId)
                  const offerItems = currentRoom?.items.filter(item => item.type === 'offer') || []
                  
                  return offerItems.map(item => ({
                    id: item.metadata?.originalOfferId || item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.metadata?.quantity || 1,
                    persons: item.metadata?.persons || 1,
                    nights: item.metadata?.nights || 1,
                    selectedDate: item.metadata?.selectedDate,
                    selectedDates: item.metadata?.selectedDates,
                  }))
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
                roomImage={(() => {
                  const roomId = getCurrentRoomId()
                  const currentRoom = bookingStore.rooms.find(r => r.id === roomId)
                  const roomItem = currentRoom?.items.find(item => item.type === 'room')
                  return (roomItem?.metadata?.image as string) || fallbackImageUrl
                })()}
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
                  else if (section === 'offers') handleEditSection('offers')
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
        total={shouldShowMultiBooking ? totalPrice : subtotal}
        currencySymbol={translations.currencySymbol}
        itemCount={shouldShowMultiBooking ? totalItemCount : cartItemCount}
        onShowPricing={shouldShowMultiBooking
          ? () => setIsMobilePricingOverlayOpen(true)
          : handleShowMobilePricing
        }
        isLoading={false} // isPriceCalculating is removed from useBookingState
        summaryButtonLabel={translations.summaryButtonLabel}
        
        // Detailed badge counts - works for both single and multi booking modes
        upgradeCount={shouldShowMultiBooking ? multiBookingDetailedCounts.upgradeCount : detailedCounts.upgradeCount}
        customizationCount={shouldShowMultiBooking ? multiBookingDetailedCounts.customizationCount : detailedCounts.customizationCount}
        offerCount={shouldShowMultiBooking ? multiBookingDetailedCounts.offerCount : detailedCounts.offerCount}
        upgradesLabel="upgrades"
        customizationsLabel="customizations"
        offersLabel="offers"
      />

      {/* Mobile Pricing Overlay */}
      <MobilePricingOverlay
        isOpen={shouldShowMultiBooking ? isMobilePricingOverlayOpen : showMobilePricing}
        onClose={shouldShowMultiBooking ? () => setIsMobilePricingOverlayOpen(false) : handleCloseMobilePricing}

        {...(shouldShowMultiBooking ? {
          // Multibooking props
          isMultiBooking: true,
          roomBookings: roomBookings,
          activeRoom: activeRoomId || undefined,
          onActiveRoomChange: handleRoomTabClick,
          multiBookingLabels: t.multiBookingLabels,
          onMultiBookingRemoveItem: handleMultiBookingRemoveItemWrapper,
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
          onRemoveItem: () => { },
          onConfirm: () => { }
        } : {
          // Single booking props (existing)
          roomImage: (() => {
            const roomId = getCurrentRoomId()
            const currentRoom = bookingStore.rooms.find(r => r.id === roomId)
            const roomItem = currentRoom?.items.find(item => item.type === 'room')
            return (roomItem?.metadata?.image as string) || fallbackImageUrl
          })(),
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
          onRemoveItem: (id: string | number, name: string, type: 'room' | 'customization' | 'offer' | 'bid') => {
            handleRemoveItem(id, name, type)
          },
          onConfirm: handleConfirm,
          onEditSection: (section: 'room' | 'customizations' | 'offers') => {
            if (section === 'room') handleEditSection('room')
            else if (section === 'customizations') handleEditSection('customizations')
            else if (section === 'offers') handleEditSection('offers')
          }
        })}
      />
    </div>
  )
}

export default ABSLanding
export { ABSLanding as ABS_Landing }
