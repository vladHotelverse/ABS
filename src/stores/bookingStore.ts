/**
 * Unified Booking Store - Zustand Implementation
 * Replaces useBookingState and useMultiBookingState with unified state management
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { useShallow } from 'zustand/react/shallow'
import { enableMapSet } from 'immer'
import type { RoomOption } from '../components/ABS_Landing/sections/RoomSelectionSection'
import type { Customization, SpecialOffer, ActiveBid } from '../components/ABS_Landing/types'
import type { EnhancedBookingItem, StoreRoomBooking } from '../types/shared'

// Enable Immer MapSet plugin for Set support
enableMapSet()

// Core domain models - BookingItem is now an alias to avoid type conflicts
// This ensures complete compatibility with ExtendedPricingItem
export type BookingItem = EnhancedBookingItem

// Helper type for addItemToRoom function with optional metadata
export type BookingItemInput = Omit<BookingItem, 'id' | 'addedAt' | 'roomId'> & {
  metadata?: Record<string, unknown>
}

// RoomBooking uses StoreRoomBooking for the store to ensure strict typing
// This eliminates the interface mismatch while maintaining type safety
export type RoomBooking = StoreRoomBooking

export interface BookingState {
  // Core unified state - used by both single and multi booking modes
  mode: 'single' | 'multi'
  rooms: RoomBooking[] // Primary storage for all booking data
  activeRoomId: string | null
  
  // Legacy single booking support - KEPT FOR BACKWARD COMPATIBILITY
  // These are still actively used by ABS_Landing.tsx and other components
  // that haven't been fully migrated to the unified room-based system
  selectedRoom: RoomOption | null // Used in single booking mode only
  customizations: Record<string, Customization[]> // Legacy customization storage
  specialOffers: SpecialOffer[] // Legacy global offers storage
  activeBid: ActiveBid | null // Legacy single bid storage
  
  // UI state
  showMobilePricing: boolean
  bookingStatus: 'normal' | 'loading' | 'error'
  isMobilePricingOverlayOpen: boolean // For multibooking mobile overlay
  
  // Room-specific selections for multibooking UI state
  roomSpecificSelections: Record<string, string>
  
  // Reservation metadata
  reservationCode?: string
  checkIn?: string
  checkOut?: string
  occupancy?: string
  
  // Performance tracking
  lastUpdate: Date
  optimisticUpdates: Set<string>
  
  // Toast notification system
  toastQueue: Array<{
    id: string
    message: string
    type: 'success' | 'error' | 'info'
    timestamp: Date
  }>
}

export interface BookingActions {
  // Primary unified booking actions - preferred for new code
  setMode: (mode: 'single' | 'multi') => void
  
  // Room management - unified system
  addRoom: (room: RoomBooking) => void
  removeRoom: (roomId: string) => void
  updateRoom: (roomId: string, updates: Partial<RoomBooking>) => void
  setActiveRoom: (roomId: string) => void
  
  // Item management - unified system (works for both single and multi modes)
  addItemToRoom: (roomId: string, item: BookingItemInput) => void
  removeItemFromRoom: (roomId: string, itemId: string) => void
  updateItemInRoom: (roomId: string, itemId: string, updates: Partial<BookingItem>) => void
  
  // Multibooking operations - enhanced from useMultiBookingState
  handleRoomUpgrade: (roomId: string, newRoom: RoomOption, currentRoomPrice?: number) => void
  handleRoomBid: (roomId: string, bidAmount: number, roomType: string) => void
  handleRoomTabClick: (roomId: string) => void
  
  // Room-specific selections for UI state
  setRoomSpecificSelection: (roomId: string, selectionId: string) => void
  clearRoomSpecificSelections: () => void
  
  // Bulk operations
  clearRoom: (roomId: string) => void
  clearAllRooms: () => void
  
  // Legacy single booking actions - KEPT FOR BACKWARD COMPATIBILITY
  // These are still actively used by existing components (ABS_Landing.tsx, etc.)
  // TODO: Gradually migrate components to use the unified item-based system above
  selectRoom: (room: RoomOption | null) => void
  addCustomization: (customization: Customization, roomId: string) => void
  removeCustomization: (customizationId: string, roomId: string) => void
  addSpecialOffer: (offer: SpecialOffer) => void
  removeSpecialOffer: (offerId: string) => void
  makeOffer: (price: number, room: RoomOption) => void
  cancelBid: (roomId: string) => void
  
  // UI state management
  setShowMobilePricing: (show: boolean) => void
  setBookingStatus: (status: 'normal' | 'loading' | 'error') => void
  setMobilePricingOverlayOpen: (open: boolean) => void
  
  // Toast notification system
  showToast: (message: string, type: 'success' | 'error' | 'info') => void
  clearToast: (toastId: string) => void
  clearAllToasts: () => void
  
  // Reservation metadata
  setReservationDetails: (details: { 
    reservationCode?: string
    checkIn?: string
    checkOut?: string
    occupancy?: string
  }) => void
  
  // Performance optimizations
  startOptimisticUpdate: (operationId: string) => void
  completeOptimisticUpdate: (operationId: string) => void
  rollbackOptimisticUpdate: (operationId: string) => void
  
  // Utilities
  resetState: () => void
}

export interface BookingSelectors {
  // Current room
  getCurrentRoom: () => RoomBooking | undefined
  getCurrentRoomId: () => string
  
  // Pricing calculations  
  getRoomTotal: (roomId: string) => number
  getTotalPrice: () => number
  getItemCount: () => number
  getRoomItemCount: (roomId: string) => number
  
  // Multibooking totals (enhanced from useMultiBookingState)
  getTotalItemCount: () => number
  getMultiBookingTotalPrice: () => number
  
  // Validation
  isValidBooking: () => boolean
  hasConflicts: () => boolean
  
  // Room queries
  getRoomsByType: (type: string) => RoomBooking[]
  getActiveRooms: () => RoomBooking[]
  
  // Item queries
  getItemsByType: (roomId: string, type: BookingItem['type']) => RoomBooking['items']
  getItemsByCategory: (roomId: string, category: string) => RoomBooking['items']
  
  // Toast queries
  getActiveToasts: () => Array<{
    id: string
    message: string
    type: 'success' | 'error' | 'info'
    timestamp: Date
  }>
  
  // Note: Legacy selectors (getSelectedRoom, getCustomizations, getSpecialOffers, getActiveBid) 
  // have been removed as they were not being used. Direct state access is used instead.
}

type BookingStore = BookingState & BookingActions & BookingSelectors

const initialState: BookingState = {
  mode: 'single',
  rooms: [],
  activeRoomId: null,
  selectedRoom: null,
  customizations: {},
  specialOffers: [],
  activeBid: null,
  showMobilePricing: false,
  bookingStatus: 'normal',
  isMobilePricingOverlayOpen: false,
  roomSpecificSelections: {},
  lastUpdate: new Date(),
  optimisticUpdates: new Set(),
  toastQueue: [],
}

export const useBookingStore = create<BookingStore>()(
  devtools(
    persist(
      immer<BookingStore>((set, get) => ({
        ...initialState,
        
        // Mode management
        setMode: (mode: 'single' | 'multi') => set((state: BookingState) => {
          state.mode = mode
          state.lastUpdate = new Date()
        }),
        
        // Room management
        addRoom: (room: RoomBooking) => set((state: BookingState) => {
          // Check for duplicate room ID
          const existingRoom = state.rooms.find(r => r.id === room.id)
          if (existingRoom) {
            console.warn(`[BookingStore] Room with ID ${room.id} already exists, skipping duplicate`)
            return // Don't add duplicate room
          }
          
          const roomWithDefaults = { 
            ...room, 
            isActive: false,
            payAtHotel: room.payAtHotel ?? false 
          }
          state.rooms.push(roomWithDefaults)
          if (!state.activeRoomId) {
            state.activeRoomId = room.id
            const addedRoom = state.rooms.find(r => r.id === room.id)
            if (addedRoom) addedRoom.isActive = true
          }
          state.lastUpdate = new Date()
        }),
        
        removeRoom: (roomId) => set((state) => {
          state.rooms = state.rooms.filter((r: RoomBooking) => r.id !== roomId)
          if (state.activeRoomId === roomId) {
            state.activeRoomId = state.rooms.length > 0 ? state.rooms[0].id : null
            if (state.activeRoomId) {
              const activeRoom = state.rooms.find((r: RoomBooking) => r.id === state.activeRoomId)
              if (activeRoom) activeRoom.isActive = true
            }
          }
          state.lastUpdate = new Date()
        }),
        
        updateRoom: (roomId, updates) => set((state) => {
          const roomIndex = state.rooms.findIndex(r => r.id === roomId)
          if (roomIndex !== -1) {
            state.rooms[roomIndex] = { ...state.rooms[roomIndex], ...updates }
            state.lastUpdate = new Date()
          }
        }),
        
        setActiveRoom: (roomId) => set((state) => {
          // Deactivate current active room
          state.rooms.forEach((room: RoomBooking) => { room.isActive = false })
          
          // Activate new room
          const newActiveRoom = state.rooms.find((r: RoomBooking) => r.id === roomId)
          if (newActiveRoom) {
            newActiveRoom.isActive = true
            state.activeRoomId = roomId
          }
          
          state.lastUpdate = new Date()
        }),
        
        // Item management with optimistic updates
        addItemToRoom: (roomId, itemData) => set((state) => {
          const room = state.rooms.find((r: RoomBooking) => r.id === roomId)
          if (room) {
            const item: BookingItem = {
              ...itemData,
              id: `${itemData.type}-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
              roomId,
              addedAt: new Date(),
              metadata: itemData.metadata,
            }
            
            // Handle conflicts based on type
            if (itemData.type === 'customization' && itemData.category) {
              // Remove existing customizations in the same category
              room.items = room.items.filter(
                (existingItem) => !(existingItem.type === 'customization' && existingItem.category === itemData.category)
              )
            } else if (itemData.type === 'bid') {
              // Remove existing bids and room items (mutually exclusive)
              room.items = room.items.filter(
                (existingItem) => !(existingItem.type === 'bid' || existingItem.type === 'room')
              )
            } else if (itemData.type === 'room') {
              // Remove existing rooms and bids (mutually exclusive)
              room.items = room.items.filter(
                (existingItem) => !(existingItem.type === 'room' || existingItem.type === 'bid')
              )
            }
            
            room.items.push(item)
          }
          state.lastUpdate = new Date()
        }),
        
        removeItemFromRoom: (roomId, itemId) => set((state) => {
          const room = state.rooms.find((r: RoomBooking) => r.id === roomId)
          if (room) {
            room.items = room.items.filter((item) => String(item.id) !== itemId)
          }
          state.lastUpdate = new Date()
        }),
        
        updateItemInRoom: (roomId, itemId, updates) => set((state) => {
          const room = state.rooms.find((r: RoomBooking) => r.id === roomId)
          if (room) {
            const item = room.items.find((i) => String(i.id) === itemId)
            if (item) {
              Object.assign(item, updates)
            }
          }
          state.lastUpdate = new Date()
        }),
        
        // Bulk operations
        clearRoom: (roomId) => set((state) => {
          const room = state.rooms.find((r: RoomBooking) => r.id === roomId)
          if (room) {
            room.items = []
          }
          state.lastUpdate = new Date()
        }),
        
        clearAllRooms: () => set((state) => {
          state.rooms.forEach(room => {
            room.items = []
          })
          state.lastUpdate = new Date()
        }),
        
        // Legacy single booking support - KEPT FOR BACKWARD COMPATIBILITY
        // These actions are still actively used by ABS_Landing.tsx and other components
        selectRoom: (room) => set((state) => {
          state.selectedRoom = room
          state.activeBid = null // Clear active bid when room is selected
          state.lastUpdate = new Date()
        }),
        
        addCustomization: (customization, roomId) => set((state) => {
          if (!state.customizations[roomId]) {
            state.customizations[roomId] = []
          }
          // Remove existing customization in same category
          state.customizations[roomId] = state.customizations[roomId].filter(
            (c: Customization) => c.category !== customization.category
          )
          state.customizations[roomId].push(customization)
          state.lastUpdate = new Date()
        }),
        
        removeCustomization: (customizationId, roomId) => set((state) => {
          if (state.customizations[roomId]) {
            state.customizations[roomId] = state.customizations[roomId].filter(
              (c: Customization) => c.id !== customizationId
            )
          }
          state.lastUpdate = new Date()
        }),
        
        addSpecialOffer: (offer) => set((state) => {
          state.specialOffers.push(offer)
          state.lastUpdate = new Date()
        }),
        
        removeSpecialOffer: (offerId) => set((state) => {
          state.specialOffers = state.specialOffers.filter(
            (o: SpecialOffer) => o.id.toString() !== offerId
          )
          state.lastUpdate = new Date()
        }),
        
        makeOffer: (price, room) => set((state) => {
          state.selectedRoom = null // Clear selected room when bid is made
          state.activeBid = {
            id: room.id,
            roomId: room.id,
            bidAmount: price,
            status: 'submitted',
            roomName: room.title || room.roomType,
          }
          state.lastUpdate = new Date()
        }),
        
        cancelBid: (roomId) => set((state) => {
          if (state.activeBid?.roomId === roomId) {
            state.activeBid = null
          }
          state.lastUpdate = new Date()
        }),
        
        // UI state
        setShowMobilePricing: (show) => set((state) => {
          state.showMobilePricing = show
        }),
        
        setBookingStatus: (status) => set((state) => {
          state.bookingStatus = status
        }),
        
        // Metadata
        setReservationDetails: (details) => set((state) => {
          Object.assign(state, details)
          state.lastUpdate = new Date()
        }),
        
        // Optimistic updates
        startOptimisticUpdate: (operationId) => set((state) => {
          state.optimisticUpdates.add(operationId)
        }),
        
        completeOptimisticUpdate: (operationId) => set((state) => {
          state.optimisticUpdates.delete(operationId)
        }),
        
        rollbackOptimisticUpdate: (operationId) => set((state) => {
          state.optimisticUpdates.delete(operationId)
          // Additional rollback logic would be implemented based on operation type
        }),
        
        // Multibooking operations - enhanced from useMultiBookingState
        handleRoomUpgrade: (roomId, newRoom, currentRoomPrice) => set((state) => {
          const roomIndex = state.rooms.findIndex(room => room.id === roomId)
          if (roomIndex === -1) return
          
          const room = state.rooms[roomIndex]
          
          // Get the base room price - either from passed param, baseRoom, or existing room item
          let basePrice = currentRoomPrice
          if (!basePrice && room.baseRoom) {
            basePrice = room.baseRoom.price
          }
          if (!basePrice) {
            // Try to find existing room item price
            const existingRoomItem = room.items.find(item => item.type === 'room')
            basePrice = (existingRoomItem?.metadata?.originalRoom as any)?.price || 0
          }
          
          // Remove all existing room items and bids - only one room selection allowed
          room.items = room.items.filter(item => 
            item.type !== 'room' && 
            item.type !== 'bid' &&
            !(item.type === 'customization' && item.category?.startsWith('room-upgrade'))
          )
          
          // Calculate the upgrade price difference
          const upgradePrice = newRoom.price - (basePrice || 0)
          
          // Add the room upgrade as an item with the price difference
          const newRoomItem: BookingItem = {
            id: `room-upgrade-${roomId}-${Date.now()}`,
            name: `${newRoom.title || newRoom.roomType} (Upgrade)`,
            price: upgradePrice, // Use upgrade difference price
            type: 'room',
            concept: 'choose-your-superior-room',
            category: 'room-upgrade',
            roomId,
            addedAt: new Date(),
            metadata: {
              roomId: newRoom.id,
              roomType: newRoom.roomType,
              fullPrice: newRoom.price,
              basePrice: basePrice || 0,
              upgradePrice: upgradePrice,
              originalRoom: room.baseRoom || { roomType: room.roomName, price: basePrice || 0 },
            }
          }
          
          room.items.push(newRoomItem)
          
          // Update room display metadata
          room.roomName = newRoom.title || newRoom.roomType
          room.roomImage = newRoom.image || newRoom.images?.[0] || room.roomImage
          
          state.lastUpdate = new Date()
        }),
        
        handleRoomBid: (roomId, bidAmount, roomType) => set((state) => {
          const roomIndex = state.rooms.findIndex(room => room.id === roomId)
          if (roomIndex === -1) return
          
          const room = state.rooms[roomIndex]
          
          // Remove conflicting items (rooms, existing bids, room-upgrade customizations)
          room.items = room.items.filter(item => 
            !(item.type === 'room') &&
            !(item.type === 'bid' || item.concept === 'bid-for-upgrade') &&
            !(item.type === 'customization' && item.category?.startsWith('room-upgrade'))
          )
          
          // Add bid item
          const bidItem: BookingItem = {
            id: `bid-${roomId}-${Date.now()}`,
            name: `Bid for ${roomType}`,
            price: bidAmount,
            type: 'bid',
            concept: 'bid-for-upgrade',
            category: 'bid',
            roomId,
            addedAt: new Date(),
            metadata: {
              bidStatus: 'submitted',
              roomType,
            }
          }
          
          room.items.push(bidItem)
          state.lastUpdate = new Date()
        }),
        
        handleRoomTabClick: (roomId) => set((state) => {
          // Deactivate current active room
          state.rooms.forEach(room => { room.isActive = false })
          
          // Activate new room
          const newActiveRoom = state.rooms.find(r => r.id === roomId)
          if (newActiveRoom) {
            newActiveRoom.isActive = true
            state.activeRoomId = roomId
          }
          
          state.lastUpdate = new Date()
        }),
        
        // Room-specific selections for UI state
        setRoomSpecificSelection: (roomId, selectionId) => set((state) => {
          state.roomSpecificSelections[roomId] = selectionId
        }),
        
        clearRoomSpecificSelections: () => set((state) => {
          state.roomSpecificSelections = {}
        }),
        
        // UI state management - enhanced
        setMobilePricingOverlayOpen: (open) => set((state) => {
          state.isMobilePricingOverlayOpen = open
        }),
        
        // Toast notification system
        showToast: (message, type) => set((state) => {
          const toast = {
            id: `toast-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
            message,
            type,
            timestamp: new Date(),
          }
          state.toastQueue.push(toast)
          
          // Auto-clear toast after 5 seconds (handled by UI)
          // console.log is kept for backward compatibility with existing components
          console.log(`Toast: [${type}] ${message}`)
        }),
        
        clearToast: (toastId) => set((state) => {
          state.toastQueue = state.toastQueue.filter(toast => toast.id !== toastId)
        }),
        
        clearAllToasts: () => set((state) => {
          state.toastQueue = []
        }),
        
        // Reset
        resetState: () => set((state) => {
          Object.assign(state, {
            ...initialState,
            lastUpdate: new Date(),
            optimisticUpdates: new Set(),
            toastQueue: [],
          })
        }),
        
        // Selectors
        getCurrentRoom: () => {
          const { rooms, activeRoomId } = get()
          return rooms.find(room => room.id === activeRoomId)
        },
        
        getCurrentRoomId: () => {
          const { mode, activeRoomId, selectedRoom } = get()
          if (mode === 'multi') {
            return activeRoomId || 'default-room'
          } else {
            return selectedRoom?.id || 'default-room'
          }
        },
        
        getRoomTotal: (roomId) => {
          const { rooms } = get()
          const room = rooms.find(r => r.id === roomId)
          return room?.items.reduce((sum, item) => sum + item.price, 0) || 0
        },
        
        getTotalPrice: () => {
          const { mode, rooms, selectedRoom, customizations, specialOffers, activeBid } = get()
          
          if (mode === 'multi') {
            // Optimized multi-booking calculation
            return rooms.reduce((total, room) => 
              total + room.items.reduce((sum, item) => sum + item.price, 0), 0
            )
          } else {
            // Legacy single booking calculation - kept for backward compatibility
            // This supports existing ABS_Landing.tsx and other components that rely on single booking mode
            let total = 0
            
            if (selectedRoom) {
              total += selectedRoom.price
            }
            
            // Optimized customizations calculation
            for (const roomCustomizations of Object.values(customizations)) {
              for (const customization of roomCustomizations) {
                total += customization.price
              }
            }
            
            // Add special offers
            total += specialOffers.reduce((sum, offer) => sum + offer.price, 0)
            
            // Add active bid if it's in a valid state
            if (activeBid?.status && ['submitted', 'pending'].includes(activeBid.status)) {
              total += activeBid.bidAmount
            }
            
            return total
          }
        },
        
        getItemCount: () => {
          const { mode, rooms, selectedRoom, customizations, specialOffers, activeBid } = get()
          
          if (mode === 'multi') {
            return rooms.reduce((count, room) => count + room.items.length, 0)
          } else {
            // Legacy single booking calculation - kept for backward compatibility
            let count = 0
            
            if (selectedRoom) count++
            
            // Optimized customizations count
            count += Object.values(customizations).reduce(
              (sum, roomCustomizations) => sum + roomCustomizations.length, 0
            )
            
            count += specialOffers.length
            if (activeBid) count++
            
            return count
          }
        },
        
        getRoomItemCount: (roomId) => {
          const { rooms } = get()
          const room = rooms.find(r => r.id === roomId)
          return room?.items.length || 0
        },
        
        isValidBooking: () => {
          const { mode, rooms, selectedRoom } = get()
          
          if (mode === 'multi') {
            return rooms.length > 0 && rooms.every(room => room.items.length > 0)
          } else {
            return selectedRoom !== null
          }
        },
        
        hasConflicts: () => {
          // Implement compatibility rules checking
          return false
        },
        
        getRoomsByType: (type) => {
          const { rooms } = get()
          return rooms.filter(room => room.baseRoom?.roomType === type)
        },
        
        getActiveRooms: () => {
          const { rooms } = get()
          return rooms.filter(room => room.isActive)
        },
        
        getItemsByType: (roomId, type) => {
          const { rooms } = get()
          const room = rooms.find(r => r.id === roomId)
          return room?.items.filter(item => item.type === type) || []
        },
        
        getItemsByCategory: (roomId, category) => {
          const { rooms } = get()
          const room = rooms.find(r => r.id === roomId)
          return room?.items.filter(item => item.category === category) || []
        },
        
        // Multibooking totals (enhanced from useMultiBookingState)
        getTotalItemCount: () => {
          const { rooms } = get()
          return rooms.reduce((sum, room) => sum + room.items.length, 0)
        },
        
        getMultiBookingTotalPrice: () => {
          const { rooms } = get()
          return rooms.reduce((sum, room) => {
            const roomTotal = room.items.reduce((itemSum, item) => itemSum + item.price, 0)
            return sum + roomTotal
          }, 0)
        },
        
        // Toast queries
        getActiveToasts: () => {
          const { toastQueue } = get()
          return toastQueue
        },
        
        // Note: Legacy selector methods (getSelectedRoom, etc.) were removed as they were unused.
        // Components now access state directly via useShallow() for better performance.
      })),
      {
        name: 'booking-storage',
        // Only persist essential state that should survive page reloads
        partialize: (state) => ({
          mode: state.mode,
          rooms: state.rooms,
          activeRoomId: state.activeRoomId,
          roomSpecificSelections: state.roomSpecificSelections,
          // Legacy state - kept for backward compatibility
          selectedRoom: state.selectedRoom,
          customizations: state.customizations,
          specialOffers: state.specialOffers,
          activeBid: state.activeBid,
          // Reservation metadata
          reservationCode: state.reservationCode,
          checkIn: state.checkIn,
          checkOut: state.checkOut,
          occupancy: state.occupancy,
        }),
      }
    ),
    {
      name: 'booking-store',
    }
  )
)


/**
 * Migration compatibility hooks - these provide the same interface as legacy hooks
 * to make migration easier for components that haven't been fully updated yet
 */

// Compatibility hook that mimics useBookingState interface
export const useBookingStateCompat = () => {
  const store = useBookingStore(
    useShallow(state => ({
      selectedRoom: state.selectedRoom,
      customizations: state.customizations,
      specialOffers: state.specialOffers,
      activeBid: state.activeBid,
      showMobilePricing: state.showMobilePricing,
      bookingStatus: state.bookingStatus,
    }))
  )
  
  const actions = useBookingStore(
    useShallow(state => ({
      selectRoom: state.selectRoom,
      addCustomization: state.addCustomization,
      removeCustomization: state.removeCustomization,
      addSpecialOffer: state.addSpecialOffer,
      removeSpecialOffer: state.removeSpecialOffer,
      makeOffer: state.makeOffer,
      cancelBid: state.cancelBid,
      setShowMobilePricing: state.setShowMobilePricing,
      showToast: state.showToast,
      resetState: state.resetState,
    }))
  )
  
  return {
    state: store,
    showMobilePricing: store.showMobilePricing,
    bookingStatus: store.bookingStatus,
    actions,
  }
}

// Compatibility hook that mimics useMultiBookingState interface
export const useMultiBookingStateCompat = () => {
  const store = useBookingStore(
    useShallow(state => ({
      rooms: state.rooms,
      activeRoomId: state.activeRoomId,
      isMobilePricingOverlayOpen: state.isMobilePricingOverlayOpen,
      roomSpecificSelections: state.roomSpecificSelections,
    }))
  )
  
  const actions = useBookingStore(
    useShallow(state => ({
      handleRoomUpgrade: state.handleRoomUpgrade,
      handleRoomBid: state.handleRoomBid,
      handleRoomTabClick: state.handleRoomTabClick,
      removeItemFromRoom: state.removeItemFromRoom,
      setMobilePricingOverlayOpen: state.setMobilePricingOverlayOpen,
      getTotalItemCount: state.getTotalItemCount,
      getMultiBookingTotalPrice: state.getMultiBookingTotalPrice,
      getCurrentRoomId: state.getCurrentRoomId,
    }))
  )
  
  return {
    // State
    roomBookings: store.rooms,
    activeRoomId: store.activeRoomId,
    isMobilePricingOverlayOpen: store.isMobilePricingOverlayOpen,
    roomSpecificSelections: store.roomSpecificSelections,
    
    // Actions
    setRoomBookings: (_bookings: RoomBooking[]) => {
      // TODO: Implement room bookings setter
      console.warn('setRoomBookings not yet implemented in unified store')
    },
    setActiveRoomId: (roomId: string | undefined) => {
      if (roomId) actions.handleRoomTabClick(roomId)
    },
    setIsMobilePricingOverlayOpen: actions.setMobilePricingOverlayOpen,
    
    // Handlers
    handleMultiBookingChange: (_bookings: RoomBooking[]) => {
      console.warn('handleMultiBookingChange not yet implemented in unified store')
    },
    handleMultiBookingRemoveItem: actions.removeItemFromRoom,
    handleMultiBookingEditSection: (roomId: string, sectionType: string) => {
      console.log('Edit section:', roomId, sectionType)
    },
    handleMultiBookingConfirmAll: async () => {
      console.log('Confirm all bookings')
    },
    handleRoomTabClick: actions.handleRoomTabClick,
    handleRoomUpgrade: actions.handleRoomUpgrade,
    handleRoomBid: actions.handleRoomBid,
    
    // Computed values
    totalItemCount: actions.getTotalItemCount(),
    totalPrice: actions.getMultiBookingTotalPrice(),
    getCurrentRoomId: actions.getCurrentRoomId,
  }
}

