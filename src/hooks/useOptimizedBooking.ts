/**
 * Optimized Booking Hook
 * High-performance wrapper around Zustand store with optimistic updates
 * Targets <50ms room switching performance
 */

import { useCallback, useMemo, useRef, useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useBookingStore, type BookingItem } from '../stores/bookingStore'
import { businessRulesEngine, type ValidationResult } from '../stores/businessRulesEngine'
import type { RoomOption, SpecialOffer } from '../components/ABS_Landing/types'
import { debounce } from 'lodash-es'

// Performance monitoring
interface PerformanceMetrics {
  roomSwitchTime: number
  itemAddTime: number
  validationTime: number
  renderTime: number
}

export const useOptimizedBooking = () => {
  const performanceRef = useRef<PerformanceMetrics>({
    roomSwitchTime: 0,
    itemAddTime: 0,
    validationTime: 0,
    renderTime: 0,
  })

  // Cleanup ref for memory management
  const cleanupFunctionsRef = useRef<Array<() => void>>([])

  // Optimized selectors using shallow comparison
  const {
    mode,
    rooms,
    activeRoomId,
    selectedRoom,
    customizations,
    showMobilePricing,
    bookingStatus,
  } = useBookingStore(
    useShallow(state => ({
      mode: state.mode,
      rooms: state.rooms,
      activeRoomId: state.activeRoomId,
      selectedRoom: state.selectedRoom,
      customizations: state.customizations,
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

  // Optimized room switching with performance tracking
  const switchRoom = useCallback(async (roomId: string) => {
    const startTime = performance.now()
    const operationId = `switch-room-${Date.now()}`
    
    try {
      // Start optimistic update
      startOptimisticUpdate(operationId)
      
      // Immediate UI update
      setActiveRoom(roomId)
      
      // Track performance
      const endTime = performance.now()
      performanceRef.current.roomSwitchTime = endTime - startTime
      
      // Complete optimistic update
      completeOptimisticUpdate(operationId)
      
      // Log warning if performance target missed
      if (performanceRef.current.roomSwitchTime > 50) {
        console.warn(`Room switching took ${performanceRef.current.roomSwitchTime}ms (target: <50ms)`)
      }
      
    } catch (error) {
      console.error('Room switching failed:', error)
      rollbackOptimisticUpdate(operationId)
      throw error
    }
  }, [setActiveRoom, startOptimisticUpdate, completeOptimisticUpdate, rollbackOptimisticUpdate])

  // Optimized item addition with validation
  const addItem = useCallback(async (
    roomId: string, 
    item: Omit<BookingItem, 'id' | 'addedAt' | 'roomId'>
  ): Promise<ValidationResult> => {
    const startTime = performance.now()
    const operationId = `add-item-${Date.now()}`
    
    try {
      // Get current room and items for validation
      const room = rooms.find(r => r.id === roomId)
      if (!room) {
        throw new Error(`Room ${roomId} not found`)
      }

      // Pre-validate the item
      const validationStart = performance.now()
      const tempItem: BookingItem = {
        ...item,
        id: 'temp-validation',
        roomId,
        addedAt: new Date(),
      }
      
      const validationResult = businessRulesEngine.checkCompatibility(
        tempItem, 
        room.items, 
        room
      )
      
      performanceRef.current.validationTime = performance.now() - validationStart
      
      // If validation fails with errors, don't add
      if (!validationResult.isValid) {
        return validationResult
      }

      // Start optimistic update
      startOptimisticUpdate(operationId)
      
      // Add item optimistically
      addItemToRoom(roomId, item)
      
      // Track performance
      performanceRef.current.itemAddTime = performance.now() - startTime
      
      // Complete optimistic update
      completeOptimisticUpdate(operationId)
      
      return validationResult
      
    } catch (error) {
      console.error('Item addition failed:', error)
      rollbackOptimisticUpdate(operationId)
      throw error
    }
  }, [rooms, addItemToRoom, startOptimisticUpdate, completeOptimisticUpdate, rollbackOptimisticUpdate])

  // Optimized item removal
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

  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    return () => {
      // Cancel any pending debounced validations and cleanup
      cleanupFunctionsRef.current.forEach(cleanup => cleanup())
      cleanupFunctionsRef.current = []
    }
  }, [])

  // Debounced validation for performance
  const debouncedValidation = useMemo(
    () => {
      const debouncedFn = debounce((roomId: string) => {
        const room = rooms.find(r => r.id === roomId)
        if (room) {
          return businessRulesEngine.validateRoom(room)
        }
        return null
      }, 100)
      
      // Store cleanup function
      cleanupFunctionsRef.current.push(() => debouncedFn.cancel())
      
      return debouncedFn
    },
    [rooms]
  )

  // Performance monitoring utilities
  const getPerformanceMetrics = useCallback(() => ({
    ...performanceRef.current,
    averageRoomSwitchTime: performanceRef.current.roomSwitchTime,
    isPerformanceOptimal: performanceRef.current.roomSwitchTime < 50,
  }), [])

  // Legacy compatibility helpers  
  const handleRoomSelect = useCallback((room: RoomOption) => {
    if (shouldShowMultiBooking) {
      // In multibooking mode, treat as room upgrade for active room
      const roomId = getCurrentRoomId()
      addItem(roomId, {
        name: room.roomType,
        price: room.price,
        type: 'room',
        concept: 'choose-your-superior-room',
        metadata: room as unknown as Record<string, unknown>,
      })
    } else {
      selectRoom(room)
    }
  }, [shouldShowMultiBooking, getCurrentRoomId, addItem, selectRoom])

  const handleCustomizationChange = useCallback((
    category: string,
    optionId: string,
    optionLabel: string,
    optionPrice: number
  ) => {
    const roomId = getCurrentRoomId()
    
    if (shouldShowMultiBooking) {
      if (optionId) {
        addItem(roomId, {
          name: optionLabel,
          price: optionPrice,
          type: 'customization',
          concept: 'customize-your-room',
          category: category,
          metadata: { originalOptionId: optionId },
        })
      } else {
        // Remove existing customization in category
        const room = rooms.find(r => r.id === roomId)
        if (room) {
          const existingItem = room.items.find(item => 
            item.type === 'customization' && item.category === category
          )
          if (existingItem) {
            removeItem(roomId, existingItem.id)
          }
        }
      }
    } else {
      // Legacy single booking mode
      if (optionId) {
        const customization = {
          id: optionId,
          name: optionLabel,
          price: optionPrice,
          category: category,
        }
        addCustomization(customization, roomId)
      } else {
        const existingCustomization = customizations[roomId]?.find(c => c.category === category)
        if (existingCustomization) {
          removeCustomization(existingCustomization.id, roomId)
        }
      }
    }
  }, [
    getCurrentRoomId, 
    shouldShowMultiBooking, 
    addItem, 
    removeItem, 
    rooms, 
    addCustomization, 
    removeCustomization, 
    customizations
  ])

  const handleOfferBooking = useCallback(async (offerData: {
    id: string | number
    name: string
    price: number
    basePrice?: number
    quantity: number
    type: string
    persons?: number
    nights?: number
    selectedDate?: string
    selectedDates?: string[]
  }) => {
    if (shouldShowMultiBooking) {
      const roomId = getCurrentRoomId()
      
      if (offerData.quantity === 0) {
        // Remove offer
        const room = rooms.find(r => r.id === roomId)
        if (room) {
          const existingOffer = room.items.find(item => 
            item.type === 'offer' && item.metadata?.originalOfferId === offerData.id
          )
          if (existingOffer) {
            await removeItem(roomId, existingOffer.id)
          }
        }
      } else {
        // Add offer
        await addItem(roomId, {
          name: offerData.name,
          price: offerData.price,
          type: 'offer',
          concept: 'enhance-your-stay',
          metadata: {
            originalOfferId: offerData.id,
            quantity: offerData.quantity,
            offerType: offerData.type,
            persons: offerData.persons,
            nights: offerData.nights,
            selectedDate: offerData.selectedDate,
            selectedDates: offerData.selectedDates,
          },
        })
      }
    } else {
      // Legacy single booking mode
      if (offerData.quantity === 0) {
        removeSpecialOffer(offerData.id.toString())
      } else {
        const offer = {
          id: offerData.id,
          title: offerData.name,
          name: offerData.name,
          description: '',
          image: '',
          price: offerData.price,
          basePrice: offerData.basePrice,
          quantity: offerData.quantity,
          type: offerData.type,
          persons: offerData.persons,
          nights: offerData.nights,
          selectedDate: offerData.selectedDate,
          selectedDates: offerData.selectedDates,
        }
        addSpecialOffer(offer as SpecialOffer)
      }
    }
  }, [
    shouldShowMultiBooking,
    getCurrentRoomId,
    rooms,
    removeItem,
    addItem,
    removeSpecialOffer,
    addSpecialOffer
  ])

  return {
    // State
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
    
    // Optimized actions
    switchRoom,
    addItem,
    removeItem,
    
    // Legacy compatibility
    handleRoomSelect,
    handleCustomizationChange,
    handleOfferBooking,
    
    // Direct store actions
    selectRoom,
    makeOffer,
    cancelBid,
    setShowMobilePricing,
    setBookingStatus,
    
    // Utilities
    debouncedValidation,
    getPerformanceMetrics,
    
    // Helpers
    getCurrentRoomId,
  }
}

// Hook for performance monitoring
export const useBookingPerformanceMonitor = () => {
  const metrics = useBookingStore(state => ({
    lastUpdate: state.lastUpdate,
    optimisticUpdates: state.optimisticUpdates,
  }))

  return {
    ...metrics,
    hasOptimisticUpdates: metrics.optimisticUpdates.size > 0,
    optimisticUpdateCount: metrics.optimisticUpdates.size,
  }
}

// Hook for room-specific operations
export const useRoomOperations = (roomId?: string) => {
  const targetRoomId = roomId || useBookingStore(state => state.getCurrentRoomId())
  
  const roomData = useBookingStore(
    useShallow(state => {
      const room = state.rooms.find(r => r.id === targetRoomId)
      return room ? {
        room,
        total: state.getRoomTotal(targetRoomId),
        itemCount: state.getRoomItemCount(targetRoomId),
        items: room.items,
      } : null
    })
  )

  const addItemToThisRoom = useCallback((
    item: Omit<BookingItem, 'id' | 'addedAt' | 'roomId'>
  ) => {
    return useBookingStore.getState().addItemToRoom(targetRoomId, item)
  }, [targetRoomId])

  const removeItemFromThisRoom = useCallback((itemId: string) => {
    return useBookingStore.getState().removeItemFromRoom(targetRoomId, itemId)
  }, [targetRoomId])

  return {
    roomId: targetRoomId,
    roomData,
    addItem: addItemToThisRoom,
    removeItem: removeItemFromThisRoom,
  }
}