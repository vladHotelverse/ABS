import type { Meta, StoryObj } from '@storybook/react'
import { useState, useCallback } from 'react'
import SpecialOffers from '@/components/upsell/SpecialOffers'
import type { OfferSelection } from '@/components/upsell/SpecialOffers/types'
import { useOfferPricing } from './hooks/useOfferPricing'
import { useOfferSelections } from './hooks/useOfferSelections'
import { formatOfferCards } from './utils/offerFormatter'
import { getDefaultLabels } from './utils/labels'
import {
  convertOfferDataToBookingItem,
  isOfferAlreadyBooked,
  findBookedOfferItem,
  createOfferDataFromSelection,
  type EnhancedBookingItem,
} from './utils/offerItemConverter'
import { mockOffers, mockReservationInfo } from './data/mockOffers'

const meta: Meta<typeof SpecialOffers> = {
  title: 'Upsell/SpecialOffers/Multibooking',
  component: SpecialOffers,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# SpecialOffers with Multibooking Integration

Demonstrates how to integrate SpecialOffers with a multibooking system using Zustand bookingStore pattern.

## Key Concepts

### Room-Aware Booking
- Each room maintains its own offer collection
- Active room context determines where offers are added
- Prevents conflicts across rooms

### Offer Storage Format
Offers are stored as \`EnhancedBookingItem\` with:
- \`type: 'offer'\`
- \`concept: 'enhance-your-stay'\`
- \`metadata.originalOfferId\`: For tracking and duplicate detection
- \`price\`: Final calculated price (NOT multiplied by nights)

### Bidirectional Sync
- **Add Offer**: Component → bookingStore → Pricing Panel
- **Remove Offer**: Pricing Panel → bookingStore → Component
- State synchronization via \`bookedOfferIds\`

### Duplicate Prevention
Uses \`metadata.originalOfferId\` to check if offer already exists before adding.

### Integration Pattern
\`\`\`typescript
const handleBookOffer = (offerId: number) => {
  const roomId = getCurrentRoomId()
  const room = bookingStore.rooms.find(r => r.id === roomId)

  // Check for duplicate
  if (isOfferAlreadyBooked(room.items, offerId)) {
    showToast('Already added', 'error')
    return
  }

  // Convert and add
  const offerItem = convertOfferDataToBookingItem(offerData)
  bookingStore.addItemToRoom(roomId, offerItem)
}
\`\`\`

See stories below for complete examples.
        `,
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SpecialOffers>

/**
 * Mock room booking structure (mimics bookingStore)
 */
interface MockRoomBooking {
  id: string
  roomName: string
  items: EnhancedBookingItem[]
  isActive: boolean
}

/**
 * Mock booking store for demonstration
 */
function useMockBookingStore() {
  const [rooms, setRooms] = useState<MockRoomBooking[]>([
    { id: 'room-1', roomName: 'Deluxe Ocean View', items: [], isActive: true },
    { id: 'room-2', roomName: 'Premium Suite', items: [], isActive: false },
  ])

  const [activeRoomId, setActiveRoomId] = useState('room-1')

  const addItemToRoom = useCallback((roomId: string, item: EnhancedBookingItem) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.id === roomId
          ? {
              ...room,
              items: [...room.items, { ...item, id: `item-${Date.now()}` }],
            }
          : room
      )
    )
  }, [])

  const removeItemFromRoom = useCallback((roomId: string, itemId: string) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.id === roomId
          ? {
              ...room,
              items: room.items.filter((item) => item.id !== itemId),
            }
          : room
      )
    )
  }, [])

  const setActiveRoom = useCallback((roomId: string) => {
    setActiveRoomId(roomId)
    setRooms((prev) => prev.map((room) => ({ ...room, isActive: room.id === roomId })))
  }, [])

  return {
    rooms,
    activeRoomId,
    addItemToRoom,
    removeItemFromRoom,
    setActiveRoom,
  }
}

/**
 * Wrapper component demonstrating multibooking integration
 */
function SpecialOffersMultibookingDemo() {
  const [toastMessage, setToastMessage] = useState<string>('')
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success')

  const mockStore = useMockBookingStore()
  const { formatPrice, calculateTotal, getUnitLabel } = useOfferPricing('€', mockReservationInfo)

  const { selections, bookedOffers, updateQuantity, updateSelectedDate, updateSelectedDates, setBookedOffers } =
    useOfferSelections({
      offers: mockOffers,
      reservationInfo: mockReservationInfo,
    })

  // Get default labels
  const labels = getDefaultLabels()

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToastMessage(message)
    setToastType(type)
    setTimeout(() => setToastMessage(''), 3000)
  }

  const getCurrentRoomId = useCallback((): string => {
    return mockStore.activeRoomId
  }, [mockStore.activeRoomId])

  const handleBookOffer = useCallback(
    (offerId: number) => {
      const roomId = getCurrentRoomId()
      const currentRoom = mockStore.rooms.find((r) => r.id === roomId)
      if (!currentRoom) return

      const offer = mockOffers.find((o) => o.id === offerId)
      if (!offer) return

      const selection = selections[offerId]
      const calculatedPrice = calculateTotal(offer, selection)

      // Check if removing (already booked)
      if (bookedOffers.has(offerId)) {
        const offerToRemove = findBookedOfferItem(currentRoom.items, offerId)
        if (offerToRemove && offerToRemove.id) {
          mockStore.removeItemFromRoom(roomId, offerToRemove.id)

          const newBooked = new Set(bookedOffers)
          newBooked.delete(offerId)
          setBookedOffers(newBooked)

          showToast(`${offer.title} removed from ${currentRoom.roomName}`, 'info')
        }
        return
      }

      // Check for duplicate
      if (isOfferAlreadyBooked(currentRoom.items, offerId)) {
        showToast(`${offer.title} is already added to ${currentRoom.roomName}`, 'error')
        return
      }

      // Create offer data and convert to booking item
      const offerData = createOfferDataFromSelection(offer, selection, calculatedPrice)
      const bookingItem = convertOfferDataToBookingItem(offerData)

      // Add to store
      mockStore.addItemToRoom(roomId, bookingItem)

      // Update booked state
      const newBooked = new Set(bookedOffers)
      newBooked.add(offerId)
      setBookedOffers(newBooked)

      showToast(`${offer.title} added to ${currentRoom.roomName}`, 'success')
    },
    [
      getCurrentRoomId,
      mockStore,
      mockOffers,
      selections,
      calculateTotal,
      bookedOffers,
      setBookedOffers,
      showToast,
    ]
  )

  // Format offer cards with pre-calculated data
  const cardData = formatOfferCards(
    mockOffers,
    selections,
    Array.from(bookedOffers),
    '€',
    labels,
    formatPrice,
    calculateTotal,
    getUnitLabel
  )

  const activeRoom = mockStore.rooms.find((r) => r.id === mockStore.activeRoomId)

  return (
    <div className="space-y-6">
      {/* Toast notification */}
      {toastMessage && (
        <div
          className={`fixed right-4 top-4 z-50 rounded-lg border px-4 py-3 shadow-lg ${
            toastType === 'success'
              ? 'border-green-200 bg-green-50 text-green-900'
              : toastType === 'error'
                ? 'border-red-200 bg-red-50 text-red-900'
                : 'border-blue-200 bg-blue-50 text-blue-900'
          }`}
        >
          {toastMessage}
        </div>
      )}

      {/* Room selector */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Select Active Room</h3>
        <div className="flex gap-2">
          {mockStore.rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => mockStore.setActiveRoom(room.id)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                room.isActive
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background hover:bg-accent'
              }`}
            >
              {room.roomName}
              {room.items.length > 0 && (
                <span className="ml-2 rounded-full bg-background/20 px-2 py-0.5 text-xs">{room.items.length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Special Offers component */}
      <SpecialOffers
        cardData={cardData}
        onUpdateQuantity={updateQuantity}
        onUpdateSelectedDate={updateSelectedDate}
        onUpdateSelectedDates={updateSelectedDates}
        onBookOffer={handleBookOffer}
        labels={labels}
      />

      {/* Booking summary per room */}
      <div className="grid gap-4 sm:grid-cols-2">
        {mockStore.rooms.map((room) => (
          <div key={room.id} className="rounded-lg border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">{room.roomName}</h3>
              {room.isActive && (
                <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">Active</span>
              )}
            </div>

            {room.items.length === 0 ? (
              <p className="text-sm text-muted-foreground">No offers added yet</p>
            ) : (
              <div className="space-y-2">
                {room.items.map((item, index) => (
                  <div key={index} className="rounded border border-border/50 bg-muted p-3 text-sm">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-muted-foreground">
                      €{item.price.toFixed(2)} | {item.metadata?.offerType}
                      {item.metadata?.quantity && ` | Qty: ${item.metadata.quantity}`}
                    </div>
                    <button
                      onClick={() => {
                        if (item.id && item.metadata?.originalOfferId) {
                          mockStore.removeItemFromRoom(room.id, item.id)
                          const newBooked = new Set(bookedOffers)
                          newBooked.delete(item.metadata.originalOfferId)
                          setBookedOffers(newBooked)
                          showToast(`${item.name} removed`, 'info')
                        }
                      }}
                      className="mt-2 text-xs text-destructive hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-3 border-t border-border pt-3">
              <div className="flex justify-between text-sm font-semibold">
                <span>Total:</span>
                <span>€{room.items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Complete multibooking integration demo
 */
export const MultibookingIntegration: Story = {
  render: () => <SpecialOffersMultibookingDemo />,
}

/**
 * Documentation story explaining the integration pattern
 */
export const IntegrationPattern: Story = {
  render: () => (
    <div className="prose max-w-4xl">
      <h2>Multibooking Integration Pattern</h2>

      <h3>1. Room Context</h3>
      <pre className="rounded-lg bg-muted p-4">
        {`const getCurrentRoomId = useCallback((): string => {
  if (shouldShowMultiBooking) {
    return activeRoomId || roomBookings[0]?.id || 'default-room'
  } else {
    return bookingStore.rooms[0]?.id || 'single-booking-default'
  }
}, [shouldShowMultiBooking, activeRoomId])`}
      </pre>

      <h3>2. Adding Offers</h3>
      <pre className="rounded-lg bg-muted p-4">
        {`const handleBookOffer = (offerId: number) => {
  const roomId = getCurrentRoomId()
  const room = bookingStore.rooms.find(r => r.id === roomId)

  // Check duplicate
  if (isOfferAlreadyBooked(room.items, offerId)) {
    showToast('Already added', 'error')
    return
  }

  // Convert and add
  const offerData = createOfferDataFromSelection(offer, selection, price)
  const bookingItem = convertOfferDataToBookingItem(offerData)
  bookingStore.addItemToRoom(roomId, bookingItem)
}`}
      </pre>

      <h3>3. Removing Offers</h3>
      <pre className="rounded-lg bg-muted p-4">
        {`// From pricing panel
const handleRemove = (itemId: string) => {
  bookingStore.removeItemFromRoom(roomId, itemId)
}

// From special offers component
if (bookedOffers.has(offerId)) {
  const item = findBookedOfferItem(room.items, offerId)
  if (item?.id) {
    bookingStore.removeItemFromRoom(roomId, item.id)
  }
}`}
      </pre>

      <h3>4. Offer Item Structure</h3>
      <pre className="rounded-lg bg-muted p-4">
        {`{
  type: 'offer',
  concept: 'enhance-your-stay',
  name: 'Spa Package',
  price: 240.00,  // Final calculated price
  metadata: {
    originalOfferId: 4,
    quantity: 1,
    offerType: 'perPerson',
    persons: 2,
    selectedDate: Date,
  }
}`}
      </pre>

      <h3>5. Important Notes</h3>
      <ul>
        <li>
          <strong>Price Storage:</strong> Offers store final price (NOT multiplied by nights in bookingStore)
        </li>
        <li>
          <strong>Duplicate Detection:</strong> Uses <code>metadata.originalOfferId</code>
        </li>
        <li>
          <strong>Room Context:</strong> Always add offers to active room
        </li>
        <li>
          <strong>Bidirectional Sync:</strong> Removing from panel resets component state
        </li>
        <li>
          <strong>Toast Messages:</strong> Include room name in multibooking mode
        </li>
      </ul>
    </div>
  ),
}
