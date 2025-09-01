/**
 * Unified Booking Store - Zustand Implementation
 * Replaces useBookingState and useMultiBookingState with unified state management
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { enableMapSet } from 'immer'
import type { RoomOption } from '../components/ABS_Landing/sections/RoomSelectionSection'
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
  
  
  // Feature flags
  biddingEnabled: boolean
  
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
  
}

type BookingStore = BookingState & BookingActions & BookingSelectors

// Create default room for single booking mode
const createDefaultSingleBookingRoom = (): RoomBooking => ({
  id: 'single-booking-default',
  roomName: 'Your Stay',
  roomNumber: '1',
  guestName: 'Guest',
  nights: 1,
  items: [],
  isActive: true,
  payAtHotel: false,
  baseRoom: {
    id: 'single-booking-default',
    roomType: 'Your Stay',
    title: 'Your Stay',
    price: 0,
    description: '',
    image: '',
    amenities: []
  }
})

const initialState: BookingState = {
  mode: 'single',
  rooms: [], // Start with empty rooms array - will be initialized when needed
  activeRoomId: null,
  biddingEnabled: false, // Bidding is disabled by default
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
    immer<BookingStore>((set, get) => ({
        ...initialState,
        
        // Mode management
        setMode: (mode: 'single' | 'multi') => set((state: BookingState) => {
          state.mode = mode
          
          if (mode === 'single') {
            // For single mode, ensure we have exactly one room
            if (state.rooms.length === 0) {
              // Create default room only if no rooms exist
              state.rooms = [createDefaultSingleBookingRoom()]
              state.activeRoomId = 'single-booking-default'
            } else if (state.rooms.length > 1) {
              // If multiple rooms exist, keep only the first one for single mode
              const firstRoom = state.rooms[0]
              state.rooms = [firstRoom]
              state.activeRoomId = firstRoom.id
            }
          } else if (mode === 'multi') {
            // Clear the default single booking room when switching to multi mode
            state.rooms = state.rooms.filter(r => r.id !== 'single-booking-default')
            // Reset activeRoomId, it will be set by the first room added via addRoom
            state.activeRoomId = state.rooms.length > 0 ? state.rooms[0].id : null
          }
          
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
            payAtHotel: room.payAtHotel ?? false,
            // Ensure baseRoom is set for upgrade reset functionality
            baseRoom: room.baseRoom || {
              id: room.id,
              roomType: room.roomName,
              title: room.roomName,
              price: 0,
              description: '',
              image: room.roomImage || '',
              amenities: []
            }
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
          // Prevent adding bid items if bidding is disabled
          if (itemData.type === 'bid' && !state.biddingEnabled) {
            console.warn('Bidding is disabled, cannot add bid item')
            return
          }
          
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
            // Find the item being removed to check if it's a room upgrade
            const itemToRemove = room.items.find((item) => String(item.id) === itemId)
            
            // Remove the item
            room.items = room.items.filter((item) => String(item.id) !== itemId)
            
            // If we removed a room upgrade, check if this was the last room upgrade and restore original name
            if (itemToRemove?.type === 'room' && itemToRemove?.category === 'room-upgrade') {
              // Check if there are any remaining room upgrade items
              const hasRemainingRoomUpgrades = room.items.some(item => 
                item.type === 'room' && item.category === 'room-upgrade'
              )
              
              // If no more room upgrades, restore original room name from baseRoom
              if (!hasRemainingRoomUpgrades && room.baseRoom) {
                const originalName = room.baseRoom.title || room.baseRoom.roomType
                console.log(`[BookingStore] Restoring room name from "${room.roomName}" to "${originalName}" for room ${roomId}`)
                room.roomName = originalName
              } else {
                console.log(`[BookingStore] Room upgrade removed but ${hasRemainingRoomUpgrades ? 'other upgrades remain' : 'no baseRoom available'} for room ${roomId}`)
              }
            }
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
        handleRoomUpgrade: (roomId, newRoom) => set((state) => {
          const roomIndex = state.rooms.findIndex(room => room.id === roomId)
          if (roomIndex === -1) return
          
          const room = state.rooms[roomIndex]
          
          // Remove all existing room items and bids - only one room selection allowed
          room.items = room.items.filter(item => 
            item.type !== 'room' && 
            item.type !== 'bid' &&
            !(item.type === 'customization' && item.category?.startsWith('room-upgrade'))
          )
          
          // SIMPLIFIED FOR DEMO: Use absolute room price instead of complex upgrade difference logic
          // This prevents negative prices and makes the demo much cleaner
          const newRoomItem: BookingItem = {
            id: `room-upgrade-${roomId}-${Date.now()}`,
            name: `${newRoom.title || newRoom.roomType}`,  // Removed "(Upgrade)" suffix
            price: newRoom.price, // Use absolute room price
            type: 'room',
            concept: 'choose-your-superior-room',
            category: 'room-upgrade',
            roomId,
            addedAt: new Date(),
            metadata: {
              roomId: newRoom.id,
              roomType: newRoom.roomType,
              fullPrice: newRoom.price,
              originalRoom: room.baseRoom || { roomType: room.roomName, price: 0 },
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
          const { mode, activeRoomId, rooms } = get()
          if (mode === 'multi') {
            return activeRoomId || (rooms.length > 0 ? rooms[0].id : 'default-room')
          } else {
            // In single mode, ensure we have a room and return its ID
            if (rooms.length === 0) {
              // Initialize single booking room if not exists
              const store = get()
              store.setMode('single')
              return 'single-booking-default'
            }
            return rooms[0].id
          }
        },
        
        getRoomTotal: (roomId) => {
          const { rooms } = get()
          const room = rooms.find(r => r.id === roomId)
          if (!room) return 0
          
          const nights = Math.max(room.nights || 0, 0)
          return room.items.reduce((sum, item) => {
            // Only multiply per-night items by nights
            // Special offers (type: 'offer') should not be multiplied by nights
            if (item.type === 'offer') {
              return sum + item.price
            }
            // All other items (room upgrades, customizations) are per-night
            return sum + (item.price * nights)
          }, 0)
        },
        
        getTotalPrice: () => {
          const { rooms } = get()
          
          // Unified calculation for both single and multi modes
          return rooms.reduce((total, room) => {
            const nights = Math.max(room.nights || 1, 1)
            const roomTotal = room.items.reduce((sum, item) => {
              // Only multiply per-night items by nights
              // Special offers (type: 'offer') should not be multiplied by nights
              if (item.type === 'offer') {
                return sum + item.price
              }
              // All other items (room upgrades, customizations) are per-night
              return sum + (item.price * nights)
            }, 0)
            return total + roomTotal
          }, 0)
        },
        
        getItemCount: () => {
          const { rooms } = get()
          
          // Unified calculation for both single and multi modes
          return rooms.reduce((count, room) => count + room.items.length, 0)
        },
        
        getRoomItemCount: (roomId) => {
          const { rooms } = get()
          const room = rooms.find(r => r.id === roomId)
          return room?.items.length || 0
        },
        
        isValidBooking: () => {
          const { mode, rooms } = get()
          
          if (mode === 'multi') {
            return rooms.length > 0 && rooms.every(room => room.items.length > 0)
          } else {
            // For single mode, check if there are any items in the first room
            return rooms.length > 0 && rooms[0].items.length > 0
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
        
        // Get all items for pricing display, filtering out bids if bidding is disabled
        getFilteredPricingItems: () => {
          const { rooms, biddingEnabled } = get()
          const allItems = rooms.flatMap(room => room.items)
          
          if (!biddingEnabled) {
            return allItems.filter(item => item.type !== 'bid')
          }
          
          return allItems
        },
        
        // Multibooking totals (enhanced from useMultiBookingState)
        getTotalItemCount: () => {
          const { rooms } = get()
          return rooms.reduce((sum, room) => sum + room.items.length, 0)
        },
        
        getMultiBookingTotalPrice: () => {
          const { rooms } = get()
          return rooms.reduce((sum, room) => {
            const nights = Math.max(room.nights || 0, 0)
            const roomTotal = room.items.reduce((itemSum, item) => {
              // Only multiply per-night items by nights
              // Special offers (type: 'offer') should not be multiplied by nights
              if (item.type === 'offer') {
                return itemSum + item.price
              }
              // All other items (room upgrades, customizations) are per-night
              return itemSum + (item.price * nights)
            }, 0)
            return sum + roomTotal
          }, 0)
        },
        
        // Toast queries
        getActiveToasts: () => {
          const { toastQueue } = get()
          return toastQueue
        },
        
      })),
    {
      name: 'booking-store',
    }
  )
)


/**
 * LEGACY COMPATIBILITY HOOKS REMOVED
 * Components now use unified store directly via useBookingStore()
 * 
 * Migration completed:
 * - All components use addItemToRoom/removeItemFromRoom instead of legacy actions
 * - State is accessed directly from bookingStore.rooms[].items
 * - No more dual state management between legacy and unified systems
 */

