/**
 * Unified Booking Store - Zustand Implementation
 * Replaces useBookingState and useMultiBookingState with unified state management
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { enableMapSet } from 'immer'
import type { RoomOption } from '../components/ABS_Landing/sections/RoomSelectionSection'
import type { Customization, SpecialOffer, ActiveBid } from '../components/ABS_Landing/types'

// Enable Immer MapSet plugin for Set support
enableMapSet()

// Core domain models
export interface BookingItem {
  id: string
  name: string
  price: number
  type: 'room' | 'customization' | 'offer' | 'bid'
  concept?: 'choose-your-superior-room' | 'customize-your-room' | 'enhance-your-stay' | 'choose-your-room' | 'bid-for-upgrade'
  category?: string
  roomId: string
  metadata?: Record<string, unknown>
  addedAt: Date
}

export interface RoomBooking {
  id: string
  roomName: string
  roomNumber: string
  guestName: string
  checkIn?: string
  checkOut?: string
  guests?: number
  nights: number
  items: BookingItem[]
  baseRoom?: RoomOption
  isActive: boolean
  payAtHotel: boolean // For compatibility with MultiBookingPricingSummaryPanel
  roomImage?: string // For compatibility with MultiBookingPricingSummaryPanel
}

export interface BookingState {
  // Core state
  mode: 'single' | 'multi'
  rooms: RoomBooking[]
  activeRoomId: string | null
  
  // Single booking legacy support
  selectedRoom: RoomOption | null
  customizations: Record<string, Customization[]>
  specialOffers: SpecialOffer[]
  activeBid: ActiveBid | null
  
  // UI state
  showMobilePricing: boolean
  bookingStatus: 'normal' | 'loading' | 'error'
  
  // Metadata
  reservationCode?: string
  checkIn?: string
  checkOut?: string
  occupancy?: string
  
  // Performance tracking
  lastUpdate: Date
  optimisticUpdates: Set<string>
}

export interface BookingActions {
  // Mode management
  setMode: (mode: 'single' | 'multi') => void
  
  // Room management
  addRoom: (room: RoomBooking) => void
  removeRoom: (roomId: string) => void
  setActiveRoom: (roomId: string) => void
  
  // Item management
  addItemToRoom: (roomId: string, item: Omit<BookingItem, 'id' | 'addedAt' | 'roomId'>) => void
  removeItemFromRoom: (roomId: string, itemId: string) => void
  updateItemInRoom: (roomId: string, itemId: string, updates: Partial<BookingItem>) => void
  
  // Bulk operations
  clearRoom: (roomId: string) => void
  clearAllRooms: () => void
  
  // Legacy single booking support
  selectRoom: (room: RoomOption | null) => void
  addCustomization: (customization: Customization, roomId: string) => void
  removeCustomization: (customizationId: string, roomId: string) => void
  addSpecialOffer: (offer: SpecialOffer) => void
  removeSpecialOffer: (offerId: string) => void
  makeOffer: (price: number, room: RoomOption) => void
  cancelBid: (roomId: string) => void
  
  // UI state
  setShowMobilePricing: (show: boolean) => void
  setBookingStatus: (status: 'normal' | 'loading' | 'error') => void
  
  // Metadata
  setReservationDetails: (details: { 
    reservationCode?: string
    checkIn?: string
    checkOut?: string
    occupancy?: string
  }) => void
  
  // Optimistic updates
  startOptimisticUpdate: (operationId: string) => void
  completeOptimisticUpdate: (operationId: string) => void
  rollbackOptimisticUpdate: (operationId: string) => void
  
  // Reset
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
  
  // Validation
  isValidBooking: () => boolean
  hasConflicts: () => boolean
  
  // Room queries
  getRoomsByType: (type: string) => RoomBooking[]
  getActiveRooms: () => RoomBooking[]
  
  // Item queries
  getItemsByType: (roomId: string, type: BookingItem['type']) => BookingItem[]
  getItemsByCategory: (roomId: string, category: string) => BookingItem[]
  
  // Legacy selectors for backwards compatibility
  getSelectedRoom: () => RoomOption | null
  getCustomizations: () => Record<string, Customization[]>
  getSpecialOffers: () => SpecialOffer[]
  getActiveBid: () => ActiveBid | null
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
  lastUpdate: new Date(),
  optimisticUpdates: new Set(),
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
            }
            
            // Handle conflicts based on type
            if (itemData.type === 'customization' && itemData.category) {
              // Remove existing customizations in the same category
              room.items = room.items.filter(
                (existingItem: BookingItem) => !(existingItem.type === 'customization' && existingItem.category === itemData.category)
              )
            } else if (itemData.type === 'bid') {
              // Remove existing bids and room items (mutually exclusive)
              room.items = room.items.filter(
                (existingItem: BookingItem) => !(existingItem.type === 'bid' || existingItem.type === 'room')
              )
            } else if (itemData.type === 'room') {
              // Remove existing rooms and bids (mutually exclusive)
              room.items = room.items.filter(
                (existingItem: BookingItem) => !(existingItem.type === 'room' || existingItem.type === 'bid')
              )
            }
            
            room.items.push(item)
          }
          state.lastUpdate = new Date()
        }),
        
        removeItemFromRoom: (roomId, itemId) => set((state) => {
          const room = state.rooms.find((r: RoomBooking) => r.id === roomId)
          if (room) {
            room.items = room.items.filter((item: BookingItem) => item.id !== itemId)
          }
          state.lastUpdate = new Date()
        }),
        
        updateItemInRoom: (roomId, itemId, updates) => set((state) => {
          const room = state.rooms.find((r: RoomBooking) => r.id === roomId)
          if (room) {
            const item = room.items.find((i: BookingItem) => i.id === itemId)
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
          state.rooms.forEach((room: RoomBooking) => { room.items = [] })
          state.lastUpdate = new Date()
        }),
        
        // Legacy single booking support
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
        
        // Reset
        resetState: () => set((state) => {
          Object.assign(state, {
            ...initialState,
            lastUpdate: new Date(),
            optimisticUpdates: new Set(),
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
            return rooms.reduce((total, room) => {
              return total + room.items.reduce((sum, item) => sum + item.price, 0)
            }, 0)
          } else {
            // Legacy single booking calculation
            let total = 0
            
            if (selectedRoom) {
              total += selectedRoom.price
            }
            
            Object.values(customizations).forEach(roomCustomizations => {
              roomCustomizations.forEach(c => { total += c.price })
            })
            
            specialOffers.forEach(offer => { total += offer.price })
            
            if (activeBid && (activeBid.status === 'submitted' || activeBid.status === 'pending')) {
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
            // Legacy single booking calculation
            let count = 0
            if (selectedRoom) count++
            
            Object.values(customizations).forEach(roomCustomizations => {
              count += roomCustomizations.length
            })
            
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
        
        // Legacy selectors
        getSelectedRoom: () => get().selectedRoom,
        getCustomizations: () => get().customizations,
        getSpecialOffers: () => get().specialOffers,
        getActiveBid: () => get().activeBid,
      })),
      {
        name: 'booking-storage',
        partialize: (state) => ({
          mode: state.mode,
          rooms: state.rooms,
          activeRoomId: state.activeRoomId,
          selectedRoom: state.selectedRoom,
          customizations: state.customizations,
          specialOffers: state.specialOffers,
          activeBid: state.activeBid,
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

// Performance monitoring hook
export const useBookingPerformance = () => {
  const lastUpdate = useBookingStore(state => state.lastUpdate)
  const optimisticUpdates = useBookingStore(state => state.optimisticUpdates)
  
  return {
    lastUpdate,
    hasOptimisticUpdates: optimisticUpdates.size > 0,
    optimisticUpdateCount: optimisticUpdates.size,
  }
}