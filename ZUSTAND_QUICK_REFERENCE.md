# Zustand Store - Quick Reference Guide

## Table of Contents
- [Basic Usage](#basic-usage)
- [Performance Best Practices](#performance-best-practices)
- [Common Patterns](#common-patterns)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## Basic Usage

### Accessing State

```typescript
import { useBookingStore } from '@/stores/bookingStore'

// ❌ BAD: Subscribes to entire store (causes excessive re-renders)
const bookingStore = useBookingStore()

// ✅ GOOD: Subscribe to specific state
const rooms = useBookingStore(state => state.rooms)
const activeRoomId = useBookingStore(state => state.activeRoomId)

// ✅ BETTER: Subscribe to multiple values with shallow comparison
import { shallow } from 'zustand/shallow'

const { rooms, activeRoomId, mode } = useBookingStore(
  state => ({
    rooms: state.rooms,
    activeRoomId: state.activeRoomId,
    mode: state.mode
  }),
  shallow
)
```

### Calling Actions

```typescript
// ✅ Actions don't cause re-renders when extracted
const addItemToRoom = useBookingStore(state => state.addItemToRoom)
const removeItem = useBookingStore(state => state.removeItemFromRoom)
const setActiveRoom = useBookingStore(state => state.setActiveRoom)

// Use them in event handlers
const handleAddItem = () => {
  addItemToRoom(roomId, {
    name: 'Ocean View',
    price: 50,
    type: 'customization',
    concept: 'customize-your-room',
    category: 'view'
  })
}
```

### Using Selectors

```typescript
// ✅ Computed values via selectors
const totalPrice = useBookingStore(state => state.getTotalPrice())
const itemCount = useBookingStore(state => state.getItemCount())
const currentRoom = useBookingStore(state => state.getCurrentRoom())

// ✅ Room-specific selectors
const roomTotal = useBookingStore(state => state.getRoomTotal(roomId))
const roomItems = useBookingStore(state => state.getRoomItemCount(roomId))
```

---

## Performance Best Practices

### ✅ Do This

```typescript
// 1. Extract actions (they never change, so no re-renders)
const addItem = useBookingStore(state => state.addItemToRoom)

// 2. Use specific selectors
const rooms = useBookingStore(state => state.rooms)

// 3. Use shallow comparison for objects
import { shallow } from 'zustand/shallow'
const { rooms, activeRoomId } = useBookingStore(
  state => ({ rooms: state.rooms, activeRoomId: state.activeRoomId }),
  shallow
)

// 4. Memoize expensive computations
const filteredRooms = useMemo(
  () => rooms.filter(r => r.items.length > 0),
  [rooms]
)
```

### ❌ Don't Do This

```typescript
// 1. Don't subscribe to entire store
const bookingStore = useBookingStore()  // ❌ Re-renders on every change

// 2. Don't access nested properties without selector
const roomName = useBookingStore(state => state.rooms[0].roomName)  // ❌ Re-renders when any room changes

// 3. Don't use anonymous functions in render
{rooms.map(room => (
  <RoomCard
    onClick={() => useBookingStore.getState().setActiveRoom(room.id)}  // ❌ Creates new function each render
  />
))}
```

---

## Common Patterns

### Pattern 1: Single Booking Mode

```typescript
const MyComponent = () => {
  // Initialize single booking mode
  useEffect(() => {
    const store = useBookingStore.getState()
    if (store.rooms.length === 0) {
      store.setMode('single')
    }
  }, [])

  // Get the single room
  const room = useBookingStore(state => 
    state.mode === 'single' ? state.rooms[0] : null
  )

  // Add items to the single room
  const addItem = useBookingStore(state => state.addItemToRoom)
  
  const handleAddCustomization = (customization) => {
    if (room) {
      addItem(room.id, {
        name: customization.name,
        price: customization.price,
        type: 'customization',
        concept: 'customize-your-room',
        category: customization.category
      })
    }
  }

  return <div>{/* UI */}</div>
}
```

### Pattern 2: Multi-Booking Mode

```typescript
const MultiBookingComponent = () => {
  // Initialize multi-booking mode
  useEffect(() => {
    const store = useBookingStore.getState()
    store.setMode('multi')
    
    // Add rooms
    initialRooms.forEach(room => {
      store.addRoom({
        id: room.id,
        roomName: room.name,
        roomNumber: room.number,
        guestName: room.guest,
        nights: room.nights,
        items: [],
        isActive: false,
        payAtHotel: false,
        baseRoom: room.baseRoom
      })
    })
  }, [])

  // Get active room
  const activeRoom = useBookingStore(state => state.getCurrentRoom())
  const activeRoomId = useBookingStore(state => state.activeRoomId)
  
  // Switch between rooms
  const setActiveRoom = useBookingStore(state => state.setActiveRoom)
  
  return (
    <div>
      <RoomTabs
        rooms={rooms}
        activeRoomId={activeRoomId}
        onRoomClick={setActiveRoom}
      />
      {activeRoom && <RoomDetails room={activeRoom} />}
    </div>
  )
}
```

### Pattern 3: Adding Room Items

```typescript
const RoomSelectionComponent = () => {
  const addItemToRoom = useBookingStore(state => state.addItemToRoom)
  const currentRoomId = useBookingStore(state => state.getCurrentRoomId())

  const handleRoomSelect = (room: RoomOption) => {
    addItemToRoom(currentRoomId, {
      name: room.title,
      price: room.price,
      type: 'room',
      concept: 'choose-your-superior-room',
      category: 'room-upgrade',
      metadata: {
        roomId: room.id,
        roomType: room.roomType,
        image: room.image
      }
    })
  }

  return <RoomGrid onSelect={handleRoomSelect} />
}
```

### Pattern 4: Customizations

```typescript
const CustomizationComponent = () => {
  const currentRoomId = useBookingStore(state => state.getCurrentRoomId())
  const addItem = useBookingStore(state => state.addItemToRoom)
  
  // Get current customizations for the room
  const customizations = useBookingStore(state => {
    const room = state.rooms.find(r => r.id === currentRoomId)
    return room?.items.filter(item => item.type === 'customization') || []
  })

  const handleSelectView = (view: ViewOption) => {
    addItem(currentRoomId, {
      name: view.name,
      price: view.price,
      type: 'customization',
      concept: 'customize-your-room',
      category: 'view'  // Important: same category replaces previous selection
    })
  }

  return <ViewSelector onSelect={handleSelectView} />
}
```

### Pattern 5: Special Offers

```typescript
const SpecialOffersComponent = () => {
  const currentRoomId = useBookingStore(state => state.getCurrentRoomId())
  const addItem = useBookingStore(state => state.addItemToRoom)
  const removeItem = useBookingStore(state => state.removeItemFromRoom)
  
  // Get offers for current room
  const offers = useBookingStore(state => {
    const room = state.rooms.find(r => r.id === currentRoomId)
    return room?.items.filter(item => item.type === 'offer') || []
  })

  const handleAddOffer = (offer: OfferData) => {
    addItem(currentRoomId, {
      name: offer.title,
      price: offer.price,
      type: 'offer',
      concept: 'enhance-your-stay',
      metadata: {
        offerId: offer.id,
        description: offer.description,
        image: offer.image
      }
    })
  }

  const handleRemoveOffer = (offerId: string) => {
    removeItem(currentRoomId, offerId)
  }

  return <OfferGrid offers={offers} onAdd={handleAddOffer} onRemove={handleRemoveOffer} />
}
```

### Pattern 6: Pricing Summary

```typescript
const PricingSummaryComponent = () => {
  // Get pricing data
  const totalPrice = useBookingStore(state => state.getTotalPrice())
  const itemCount = useBookingStore(state => state.getItemCount())
  
  // Get all rooms and their items for detailed breakdown
  const rooms = useBookingStore(state => state.rooms)
  
  // Calculate per-room totals
  const roomTotals = rooms.map(room => ({
    roomId: room.id,
    roomName: room.roomName,
    items: room.items,
    total: useBookingStore.getState().getRoomTotal(room.id)
  }))

  return (
    <div>
      <h3>Total: ${totalPrice}</h3>
      <p>{itemCount} items</p>
      
      {roomTotals.map(room => (
        <div key={room.roomId}>
          <h4>{room.roomName}</h4>
          <p>Subtotal: ${room.total}</p>
          <ul>
            {room.items.map(item => (
              <li key={item.id}>{item.name} - ${item.price}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
```

---

## Testing

### Testing Components Using the Store

```typescript
import { renderHook, act } from '@testing-library/react'
import { useBookingStore } from '@/stores/bookingStore'

describe('MyComponent', () => {
  beforeEach(() => {
    // Reset store before each test
    useBookingStore.getState().resetState()
  })

  it('should add item to room', () => {
    const { result } = renderHook(() => useBookingStore())
    
    // Initialize with a room
    act(() => {
      result.current.addRoom({
        id: 'room-1',
        roomName: 'Deluxe Room',
        roomNumber: '101',
        guestName: 'John Doe',
        nights: 3,
        items: [],
        isActive: true,
        payAtHotel: false
      })
    })

    // Add an item
    act(() => {
      result.current.addItemToRoom('room-1', {
        name: 'Ocean View',
        price: 50,
        type: 'customization',
        concept: 'customize-your-room',
        category: 'view'
      })
    })

    // Assert
    expect(result.current.rooms[0].items).toHaveLength(1)
    expect(result.current.rooms[0].items[0].name).toBe('Ocean View')
  })

  it('should calculate total price correctly', () => {
    const { result } = renderHook(() => useBookingStore())
    
    act(() => {
      result.current.addRoom({
        id: 'room-1',
        roomName: 'Deluxe Room',
        roomNumber: '101',
        guestName: 'John Doe',
        nights: 3,
        items: [],
        isActive: true,
        payAtHotel: false
      })

      // Add customization (per night)
      result.current.addItemToRoom('room-1', {
        name: 'Ocean View',
        price: 50,
        type: 'customization',
        concept: 'customize-your-room',
        category: 'view'
      })

      // Add offer (per stay)
      result.current.addItemToRoom('room-1', {
        name: 'Spa Package',
        price: 100,
        type: 'offer',
        concept: 'enhance-your-stay'
      })
    })

    // Ocean View: 50 * 3 nights = 150
    // Spa Package: 100 (per stay)
    // Total: 250
    expect(result.current.getTotalPrice()).toBe(250)
  })
})
```

### Testing with Mocked Store

```typescript
import { render, screen } from '@testing-library/react'
import { useBookingStore } from '@/stores/bookingStore'

// Mock the store
vi.mock('@/stores/bookingStore', () => ({
  useBookingStore: vi.fn()
}))

describe('MyComponent', () => {
  it('should display room name', () => {
    // Setup mock return value
    useBookingStore.mockImplementation((selector) => {
      const mockStore = {
        rooms: [{ id: '1', roomName: 'Test Room', items: [] }],
        activeRoomId: '1'
      }
      return selector(mockStore)
    })

    render(<MyComponent />)
    expect(screen.getByText('Test Room')).toBeInTheDocument()
  })
})
```

---

## Troubleshooting

### Issue: Component Re-renders Too Often

**Symptoms:** Component flashes or feels sluggish

**Cause:** Subscribing to entire store

**Solution:**
```typescript
// ❌ BAD
const store = useBookingStore()

// ✅ GOOD
const rooms = useBookingStore(state => state.rooms)
const addItem = useBookingStore(state => state.addItemToRoom)
```

---

### Issue: State Not Updating

**Symptoms:** UI doesn't reflect changes

**Cause:** Mutating state directly (not using immer properly)

**Solution:**
```typescript
// ❌ BAD
const room = state.rooms.find(r => r.id === roomId)
room.items.push(newItem)  // Direct mutation outside immer

// ✅ GOOD (inside set() with immer)
set((state) => {
  const room = state.rooms.find(r => r.id === roomId)
  if (room) {
    room.items.push(newItem)  // Immer handles this
  }
})
```

---

### Issue: Data Lost on Page Refresh

**Symptoms:** Cart empties when user refreshes

**Cause:** No persistence middleware

**Solution:**
Add persist middleware (see REVIEW_ACTION_ITEMS.md #2)

---

### Issue: "Cannot read property of undefined"

**Symptoms:** Errors accessing room or item properties

**Cause:** Accessing data before initialization

**Solution:**
```typescript
// ❌ BAD
const roomName = useBookingStore(state => state.rooms[0].roomName)

// ✅ GOOD
const roomName = useBookingStore(state => state.rooms[0]?.roomName || 'Default')
```

---

### Issue: Tests Fail with "Cannot find module"

**Symptoms:** Import errors in tests

**Cause:** Zustand not installed

**Solution:**
```bash
pnpm install zustand immer
```

---

## Store API Reference

### State

```typescript
interface BookingState {
  mode: 'single' | 'multi'
  rooms: RoomBooking[]
  activeRoomId: string | null
  biddingEnabled: boolean
  showMobilePricing: boolean
  bookingStatus: 'normal' | 'loading' | 'error'
  isMobilePricingOverlayOpen: boolean
  roomSpecificSelections: Record<string, string>
  reservationCode?: string
  checkIn?: string
  checkOut?: string
  occupancy?: string
  lastUpdate: Date
  optimisticUpdates: Set<string>
  toastQueue: Array<Toast>
}
```

### Actions

| Action | Parameters | Description |
|--------|-----------|-------------|
| `setMode` | `mode: 'single' \| 'multi'` | Switch booking mode |
| `addRoom` | `room: RoomBooking` | Add a new room |
| `removeRoom` | `roomId: string` | Remove a room |
| `updateRoom` | `roomId: string, updates: Partial<RoomBooking>` | Update room properties |
| `setActiveRoom` | `roomId: string` | Set active room |
| `addItemToRoom` | `roomId: string, item: BookingItemInput` | Add item to room |
| `removeItemFromRoom` | `roomId: string, itemId: string` | Remove item from room |
| `updateItemInRoom` | `roomId: string, itemId: string, updates: Partial<BookingItem>` | Update item |
| `clearRoom` | `roomId: string` | Clear all items from room |
| `clearAllRooms` | `()` | Clear items from all rooms |
| `setShowMobilePricing` | `show: boolean` | Toggle mobile pricing |
| `setBookingStatus` | `status: 'normal' \| 'loading' \| 'error'` | Set booking status |
| `showToast` | `message: string, type: 'success' \| 'error' \| 'info'` | Show toast notification |
| `resetState` | `()` | Reset entire store |

### Selectors

| Selector | Returns | Description |
|----------|---------|-------------|
| `getCurrentRoom()` | `RoomBooking \| undefined` | Get active room |
| `getCurrentRoomId()` | `string` | Get active room ID |
| `getRoomTotal(roomId)` | `number` | Calculate room total |
| `getTotalPrice()` | `number` | Calculate total price |
| `getItemCount()` | `number` | Count all items |
| `getRoomItemCount(roomId)` | `number` | Count items in room |
| `isValidBooking()` | `boolean` | Check if booking is valid |
| `getItemsByType(roomId, type)` | `BookingItem[]` | Get items by type |
| `getItemsByCategory(roomId, category)` | `BookingItem[]` | Get items by category |

---

## Tips and Tricks

### Tip 1: Use DevTools
```typescript
// Open Redux DevTools in browser to inspect state
// Actions and state changes are automatically logged
```

### Tip 2: Access Store Outside React
```typescript
// Get current state without subscription
const state = useBookingStore.getState()

// Call actions
useBookingStore.getState().addItemToRoom(roomId, item)

// Subscribe to changes
const unsubscribe = useBookingStore.subscribe(
  state => console.log('State changed:', state)
)

// Clean up
unsubscribe()
```

### Tip 3: Conditional Selectors
```typescript
// Only subscribe when condition is met
const roomName = useBookingStore(state => 
  state.mode === 'single' ? state.rooms[0]?.roomName : null
)
```

### Tip 4: Selector Composition
```typescript
// Compose multiple selectors
const bookingData = useBookingStore(state => ({
  rooms: state.rooms,
  total: state.getTotalPrice(),
  itemCount: state.getItemCount(),
  isValid: state.isValidBooking()
}), shallow)
```

---

## Resources

- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Full Review](./ZUSTAND_MIGRATION_REVIEW.md)
- [Action Items](./REVIEW_ACTION_ITEMS.md)
- Team Slack: #abs-development
