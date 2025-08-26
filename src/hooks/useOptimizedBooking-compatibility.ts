/**
 * Enhanced useOptimizedBooking Hook with Full API Compatibility
 * Provides backward compatibility with useBookingState and useMultiBookingState
 */

import { useCallback, useMemo, useRef } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useBookingStore, type BookingItem, type RoomBooking } from '../stores/bookingStore'
import { businessRulesEngine, type ValidationResult } from '../stores/businessRulesEngine'
import { debounce } from 'lodash-es'
import type { RoomOption, Customization, SpecialOffer } from '../components/ABS_Landing/types'

// Performance monitoring
interface PerformanceMetrics {
  roomSwitchTime: number
  itemAddTime: number
  validationTime: number
  renderTime: number
}

// Full compatibility interface matching useBookingState return
interface BookingStateCompatibility {
  state: {
    selectedRoom: RoomOption | null
    customizations: Record<string, Customization[]>
    specialOffers: SpecialOffer[]
    activeBid: any | null
    texts: any
  }
  texts: any
  showMobilePricing: boolean
  bookingStatus: 'normal' | 'loading' | 'error'
  actions: {
    selectRoom: (room: RoomOption | null) => void
    addCustomization: (customization: Customization, roomId: string) => void
    removeCustomization: (customizationId: string, roomId: string) => void
    addSpecialOffer: (offer: SpecialOffer) => void
    removeSpecialOffer: (offerId: string) => void
    addBid: (bid: any) => void
    removeBid: (bidId: string) => void
    makeOffer: (price: number, room: RoomOption) => void
    cancelBid: (roomId: string) => void
    showToast: (message: string, type: 'success' | 'error' | 'info') => void
    setShowMobilePricing: (show: boolean) => void
    resetState: () => void
  }
}

// Full compatibility interface matching useMultiBookingState return
interface MultiBookingStateCompatibility {
  roomBookings: RoomBooking[]
  activeRoomId: string | undefined
  isMobilePricingOverlayOpen: boolean
  setRoomBookings: (bookings: RoomBooking[]) => void
  setActiveRoomId: (roomId: string | undefined) => void
  setIsMobilePricingOverlayOpen: (open: boolean) => void
  handleMultiBookingChange: (bookings: RoomBooking[]) => void
  handleMultiBookingRemoveItem: (roomId: string, itemId: string | number, itemName: string, itemType: any) => void
  handleMultiBookingEditSection: (roomId: string, sectionType: 'room' | 'customizations' | 'offers') => void
  handleMultiBookingConfirmAll: () => Promise<void>
  handleRoomTabClick: (roomId: string) => void
  handleRoomUpgrade: (roomId: string, newRoom: RoomOption, currentRoomPrice?: number) => void
  handleRoomBid: (roomId: string, bidAmount: number, roomType: string) => void
  totalItemCount: number
  totalPrice: number
}

export const useOptimizedBooking = (options?: {
  compatibilityMode?: 'single' | 'multi' | 'auto'
  onMultiBookingChange?: (bookings: RoomBooking[]) => void
  onConfirmBooking?: (bookingData: any) => void
}) => {
  const performanceRef = useRef<PerformanceMetrics>({
    roomSwitchTime: 0,
    itemAddTime: 0,
    validationTime: 0,
    renderTime: 0,
  })

  // Optimized selectors using shallow comparison
  const {
    mode,
    rooms,
    activeRoomId,
    selectedRoom,
    customizations,
    specialOffers,
    activeBid,
    showMobilePricing,
    bookingStatus,
  } = useBookingStore(
    useShallow(state => ({
      mode: state.mode,
      rooms: state.rooms,
      activeRoomId: state.activeRoomId,
      selectedRoom: state.selectedRoom,
      customizations: state.customizations,
      specialOffers: state.specialOffers,
      activeBid: state.activeBid,
      showMobilePricing: state.showMobilePricing,
      bookingStatus: state.bookingStatus,
    }))
  )

  // Actions with optimistic updates
  const {
    setActiveRoom,
    addItemToRoom,
    removeItemFromRoom,
    selectRoom,
    addCustomization,
    removeCustomization,
    addSpecialOffer,
    removeSpecialOffer,
    makeOffer,
    cancelBid,
    setShowMobilePricing,
    setBookingStatus,
    startOptimisticUpdate,
    completeOptimisticUpdate,
    rollbackOptimisticUpdate,
    getCurrentRoom,
    getCurrentRoomId,
    getTotalPrice,
    getItemCount,
    resetState,
    addRoom,
    setMode,
  } = useBookingStore(
    useShallow(state => ({
      setActiveRoom: state.setActiveRoom,
      addItemToRoom: state.addItemToRoom,
      removeItemFromRoom: state.removeItemFromRoom,
      selectRoom: state.selectRoom,
      addCustomization: state.addCustomization,
      removeCustomization: state.removeCustomization,
      addSpecialOffer: state.addSpecialOffer,
      removeSpecialOffer: state.removeSpecialOffer,
      makeOffer: state.makeOffer,
      cancelBid: state.cancelBid,
      setShowMobilePricing: state.setShowMobilePricing,
      setBookingStatus: state.setBookingStatus,
      startOptimisticUpdate: state.startOptimisticUpdate,
      completeOptimisticUpdate: state.completeOptimisticUpdate,
      rollbackOptimisticUpdate: state.rollbackOptimisticUpdate,
      getCurrentRoom: state.getCurrentRoom,
      getCurrentRoomId: state.getCurrentRoomId,
      getTotalPrice: state.getTotalPrice,
      getItemCount: state.getItemCount,
      resetState: state.resetState,
      addRoom: state.addRoom,
      setMode: state.setMode,
    }))
  )

  // Memoized computed values for performance
  const currentRoom = useMemo(() => getCurrentRoom(), [getCurrentRoom])
  const totalPrice = useMemo(() => getTotalPrice(), [getTotalPrice])
  const itemCount = useMemo(() => getItemCount(), [getItemCount])
  const shouldShowMultiBooking = useMemo(() => 
    mode === 'multi' && rooms.length > 1, 
    [mode, rooms.length]
  )

  // Performance optimized room switching
  const switchRoom = useCallback(async (roomId: string) => {
    const startTime = performance.now()
    const operationId = `switch-room-${Date.now()}`
    
    try {
      startOptimisticUpdate(operationId)
      setActiveRoom(roomId)
      
      const endTime = performance.now()
      performanceRef.current.roomSwitchTime = endTime - startTime
      
      completeOptimisticUpdate(operationId)
      
      if (performanceRef.current.roomSwitchTime > 50) {
        console.warn(`Room switching took ${performanceRef.current.roomSwitchTime}ms (target: <50ms)`)
      }
    } catch (error) {
      console.error('Room switching failed:', error)
      rollbackOptimisticUpdate(operationId)
      throw error
    }
  }, [setActiveRoom, startOptimisticUpdate, completeOptimisticUpdate, rollbackOptimisticUpdate])

  // Enhanced item management with validation
  const addItem = useCallback(async (
    roomId: string, 
    item: Omit<BookingItem, 'id' | 'addedAt' | 'roomId'>
  ): Promise<ValidationResult> => {
    const startTime = performance.now()
    const operationId = `add-item-${Date.now()}`
    
    try {
      const room = rooms.find(r => r.id === roomId)
      if (!room) {
        throw new Error(`Room ${roomId} not found`)
      }

      const validationStart = performance.now()
      const tempItem: BookingItem = {
        ...item,
        id: 'temp-validation',
        roomId,
        addedAt: new Date(),
      }
      
      const validationResult = businessRulesEngine.checkCompatibility(tempItem, room.items, room)
      performanceRef.current.validationTime = performance.now() - validationStart
      
      if (!validationResult.isValid) {
        return validationResult
      }

      startOptimisticUpdate(operationId)
      addItemToRoom(roomId, item)
      
      performanceRef.current.itemAddTime = performance.now() - startTime
      completeOptimisticUpdate(operationId)
      
      return validationResult
    } catch (error) {
      console.error('Item addition failed:', error)
      rollbackOptimisticUpdate(operationId)
      throw error
    }
  }, [rooms, addItemToRoom, startOptimisticUpdate, completeOptimisticUpdate, rollbackOptimisticUpdate])

  const removeItem = useCallback(async (roomId: string, itemId: string) => {
    const operationId = `remove-item-${Date.now()}`
    
    try {
      startOptimisticUpdate(operationId)
      removeItemFromRoom(roomId, itemId)
      completeOptimisticUpdate(operationId)
    } catch (error) {
      console.error('Item removal failed:', error)
      rollbackOptimisticUpdate(operationId)
      throw error
    }
  }, [removeItemFromRoom, startOptimisticUpdate, completeOptimisticUpdate, rollbackOptimisticUpdate])

  // Enhanced multi-booking handlers with proper types
  const handleMultiBookingChange = useCallback((bookings: RoomBooking[]) => {
    // Sync with store
    bookings.forEach(booking => {
      if (!rooms.find(r => r.id === booking.id)) {
        addRoom(booking)
      }
    })
    
    options?.onMultiBookingChange?.(bookings)
  }, [rooms, addRoom, options])

  const handleMultiBookingRemoveItem = useCallback((
    roomId: string,
    itemId: string | number,
    _itemName: string,
    _itemType: string
  ) => {
    removeItem(roomId, itemId.toString()).catch(console.error)
  }, [removeItem])

  const handleMultiBookingEditSection = useCallback((
    roomId: string, 
    sectionType: 'room' | 'customizations' | 'offers'
  ) => {
    switchRoom(roomId).then(() => {
      // Navigate to section
      console.log(`Editing ${sectionType} for room ${roomId}`)
    }).catch(console.error)
  }, [switchRoom])

  const handleMultiBookingConfirmAll = useCallback(async () => {
    console.log('Confirming all room bookings:', rooms)
    options?.onConfirmBooking?.(rooms)
  }, [rooms, options])

  const handleRoomTabClick = useCallback((roomId: string) => {
    switchRoom(roomId).catch(console.error)
  }, [switchRoom])

  const handleRoomUpgrade = useCallback((
    roomId: string, 
    newRoom: RoomOption, 
    currentRoomPrice?: number
  ) => {
    const upgradePrice = newRoom.price - (currentRoomPrice || 0)
    
    addItem(roomId, {
      name: newRoom.roomType,
      price: upgradePrice > 0 ? upgradePrice : newRoom.price,
      type: 'room',
      concept: 'choose-your-superior-room',
      metadata: {
        originalRoom: newRoom,
        isUpgrade: upgradePrice > 0,
        upgradePrice: upgradePrice
      }
    }).catch(console.error)
  }, [addItem])

  const handleRoomBid = useCallback((
    roomId: string, 
    bidAmount: number, 
    roomType: string
  ) => {
    addItem(roomId, {
      name: `Bid for ${roomType}`,
      price: bidAmount,
      type: 'bid',
      concept: 'bid-for-upgrade',
      metadata: {
        bidStatus: 'submitted',
        roomType: roomType
      }
    }).catch(console.error)
  }, [addItem])

  // Legacy compatibility methods
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    console.log(`Toast: [${type}] ${message}`)
  }, [])

  const addBid = useCallback((bid: any) => {
    console.log('Adding bid:', bid)
  }, [])

  const removeBid = useCallback((bidId: string) => {
    console.log('Removing bid:', bidId)
  }, [])

  // Debounced validation for performance
  const debouncedValidation = useMemo(
    () => debounce((roomId: string) => {
      const room = rooms.find(r => r.id === roomId)
      if (room) {
        return businessRulesEngine.validateRoom(room)
      }
      return null
    }, 100),
    [rooms]
  )

  const getPerformanceMetrics = useCallback(() => ({
    ...performanceRef.current,
    averageRoomSwitchTime: performanceRef.current.roomSwitchTime,
    isPerformanceOptimal: performanceRef.current.roomSwitchTime < 50,
  }), [])

  // Auto-detect compatibility mode
  const effectiveMode = options?.compatibilityMode || (shouldShowMultiBooking ? 'multi' : 'single')

  // Return enhanced interface with full backward compatibility
  return {
    // Core state
    mode,
    rooms,
    activeRoomId,
    selectedRoom,
    currentRoom,
    shouldShowMultiBooking,
    showMobilePricing,
    bookingStatus,
    
    // Computed values
    totalPrice,
    itemCount,
    
    // Enhanced actions
    switchRoom,
    addItem,
    removeItem,
    
    // Direct store actions
    selectRoom,
    makeOffer,
    cancelBid,
    setShowMobilePricing,
    setBookingStatus,
    resetState,
    setMode,
    
    // Multi-booking compatibility
    roomBookings: rooms,
    isMobilePricingOverlayOpen: showMobilePricing,
    setRoomBookings: handleMultiBookingChange,
    setActiveRoomId: switchRoom,
    setIsMobilePricingOverlayOpen: setShowMobilePricing,
    handleMultiBookingChange,
    handleMultiBookingRemoveItem,
    handleMultiBookingEditSection,
    handleMultiBookingConfirmAll,
    handleRoomTabClick,
    handleRoomUpgrade,
    handleRoomBid,
    totalItemCount: itemCount,
    
    // Single booking compatibility
    state: {
      selectedRoom,
      customizations,
      specialOffers,
      activeBid,
      texts: {}, // Placeholder for texts
    },
    texts: {}, // Placeholder for texts
    actions: {
      selectRoom,
      addCustomization,
      removeCustomization,
      addSpecialOffer,
      removeSpecialOffer,
      addBid,
      removeBid,
      makeOffer,
      cancelBid,
      showToast,
      setShowMobilePricing,
      resetState,
    },
    
    // Utilities
    debouncedValidation,
    getPerformanceMetrics,
    getCurrentRoomId,
    
    // Compatibility flags
    compatibilityMode: effectiveMode,
    isBackwardCompatible: true,
  } as const
}

// Separate hooks for specific compatibility needs
export const useBookingStateCompatibility = (_initialState?: unknown): BookingStateCompatibility => {
  const optimizedBooking = useOptimizedBooking({ compatibilityMode: 'single' })
  
  return {
    state: optimizedBooking.state,
    texts: optimizedBooking.texts,
    showMobilePricing: optimizedBooking.showMobilePricing,
    bookingStatus: optimizedBooking.bookingStatus,
    actions: optimizedBooking.actions,
  }
}

export const useMultiBookingStateCompatibility = (props?: {
  initialRoomBookings?: RoomBooking[]
  onMultiBookingChange?: (bookings: RoomBooking[]) => void
  onConfirmBooking?: (bookingData: any) => void
}): MultiBookingStateCompatibility => {
  const optimizedBooking = useOptimizedBooking({ 
    compatibilityMode: 'multi',
    ...props 
  })
  
  return {
    roomBookings: optimizedBooking.roomBookings,
    activeRoomId: optimizedBooking.activeRoomId || undefined,
    isMobilePricingOverlayOpen: optimizedBooking.isMobilePricingOverlayOpen,
    setRoomBookings: optimizedBooking.setRoomBookings,
    setActiveRoomId: (roomId: string | undefined) => {
      if (roomId) {
        optimizedBooking.setActiveRoomId(roomId)
      }
    },
    setIsMobilePricingOverlayOpen: optimizedBooking.setIsMobilePricingOverlayOpen,
    handleMultiBookingChange: optimizedBooking.handleMultiBookingChange,
    handleMultiBookingRemoveItem: optimizedBooking.handleMultiBookingRemoveItem,
    handleMultiBookingEditSection: optimizedBooking.handleMultiBookingEditSection,
    handleMultiBookingConfirmAll: optimizedBooking.handleMultiBookingConfirmAll,
    handleRoomTabClick: optimizedBooking.handleRoomTabClick,
    handleRoomUpgrade: optimizedBooking.handleRoomUpgrade,
    handleRoomBid: optimizedBooking.handleRoomBid,
    totalItemCount: optimizedBooking.totalItemCount,
    totalPrice: optimizedBooking.totalPrice,
  }
}