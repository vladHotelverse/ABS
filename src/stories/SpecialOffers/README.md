# SpecialOffers Integration Guide

This directory contains business logic and integration examples for the SpecialOffers component.

## Architecture Overview

### Component Structure

```
src/
├── components/upsell/SpecialOffers/    # Pure UI components
│   ├── index.tsx                       # Main controlled component
│   ├── types.ts                        # TypeScript interfaces
│   ├── components/                     # Sub-components (cards, controls, etc.)
│   └── utils/                          # Pure utility functions
│
└── stories/SpecialOffers/              # Business logic & examples
    ├── hooks/                          # State management hooks
    │   ├── useOfferPricing.ts         # Price calculations
    │   ├── useOfferSelections.ts      # Selection state
    │   └── useOfferBooking.ts         # Booking validation
    ├── utils/
    │   └── offerItemConverter.ts      # Multibooking integration
    ├── data/
    │   └── mockOffers.ts              # Sample data
    ├── SpecialOffers.stories.tsx      # Basic usage examples
    └── SpecialOffersMultibooking.stories.tsx  # Multibooking examples
```

## Component Philosophy

The `SpecialOffers` component is **fully controlled** - it's a pure presentation component that:

- **Does NOT** manage its own state
- **Does NOT** contain business logic
- **Does NOT** perform calculations

All state, logic, and calculations are provided via props from the parent component.

## Integration Patterns

### 1. Basic Integration (Single Booking)

For simple single-booking scenarios:

```typescript
import SpecialOffers from '@/components/upsell/SpecialOffers'
import { useOfferPricing } from '@/stories/SpecialOffers/hooks/useOfferPricing'
import { useOfferSelections } from '@/stories/SpecialOffers/hooks/useOfferSelections'
import { createOfferDataFromSelection } from '@/stories/SpecialOffers/utils/offerItemConverter'

function MyBookingPage() {
  const reservationInfo = {
    personCount: 2,
    checkInDate: new Date('2025-12-15'),
    checkOutDate: new Date('2025-12-20'),
  }

  // Initialize pricing utilities
  const { formatPrice, calculateTotal, getUnitLabel } = useOfferPricing('€', reservationInfo)

  // Initialize selection state
  const {
    selections,
    bookedOffers,
    updateQuantity,
    updateSelectedDate,
    updateSelectedDates,
  } = useOfferSelections({
    offers: myOffers,
    reservationInfo,
  })

  // Handle booking
  const handleBook = (offerId: number) => {
    const offer = myOffers.find(o => o.id === offerId)
    const selection = selections[offerId]
    const price = calculateTotal(offer, selection)

    const offerData = createOfferDataFromSelection(offer, selection, price)

    // Your booking logic here
    submitBooking(offerData)
  }

  return (
    <SpecialOffers
      offers={myOffers}
      selections={selections}
      bookedOfferIds={Array.from(bookedOffers)}
      onUpdateQuantity={updateQuantity}
      onUpdateSelectedDate={updateSelectedDate}
      onUpdateSelectedDates={updateSelectedDates}
      onBookOffer={handleBook}
      formatPrice={formatPrice}
      calculateTotal={calculateTotal}
      getUnitLabel={getUnitLabel}
      currencySymbol="€"
      reservationInfo={reservationInfo}
    />
  )
}
```

### 2. Multibooking Integration

For room-based multibooking with Zustand bookingStore:

```typescript
import { convertOfferDataToBookingItem, isOfferAlreadyBooked } from '@/stories/SpecialOffers/utils/offerItemConverter'

function MyMultibookingPage() {
  const bookingStore = useBookingStore()

  const getCurrentRoomId = useCallback((): string => {
    return bookingStore.activeRoomId || bookingStore.rooms[0]?.id
  }, [bookingStore.activeRoomId])

  const handleBookOffer = useCallback((offerId: number) => {
    const roomId = getCurrentRoomId()
    const room = bookingStore.rooms.find(r => r.id === roomId)

    // Check for duplicates
    if (isOfferAlreadyBooked(room.items, offerId)) {
      showToast('Offer already added to this room', 'error')
      return
    }

    // Create and convert offer data
    const offer = offers.find(o => o.id === offerId)
    const selection = selections[offerId]
    const price = calculateTotal(offer, selection)

    const offerData = createOfferDataFromSelection(offer, selection, price)
    const bookingItem = convertOfferDataToBookingItem(offerData)

    // Add to store
    bookingStore.addItemToRoom(roomId, bookingItem)

    showToast(`${offer.title} added to ${room.roomName}`, 'success')
  }, [getCurrentRoomId, bookingStore, offers, selections, calculateTotal])

  return <SpecialOffers {...props} onBookOffer={handleBookOffer} />
}
```

## Business Logic Hooks

### `useOfferPricing`

Handles all pricing calculations and formatting.

```typescript
const { formatPrice, calculateTotal, getUnitLabel } = useOfferPricing(
  currencySymbol: string,
  reservationInfo?: ReservationInfo
)
```

**Functions:**
- `formatPrice(price: number): string` - Formats price with currency symbol
- `calculateTotal(offer: OfferType, selection: OfferSelection): number` - Calculates final price
- `getUnitLabel(offer: OfferType): string` - Returns unit label (per stay/person/night)

**Special Logic:**
- **All Inclusive**: Uses full reservation person count and night count
- **Online Check-in**: Flat fee per stay (not multiplied)
- **Late Checkout**: Flat fee per stay (not multiplied)
- **Multiple Dates**: Multiplies by selected dates count

⚠️ **Note**: Special offer type detection uses string matching (e.g., `title.includes('all inclusive')`). This is documented for future refactoring with proper enums/constants.

### `useOfferSelections`

Manages selection state for all offers.

```typescript
const {
  selections,               // Current user selections
  bookedOffers,            // Set of booked offer IDs
  bookingAttempts,         // Set of offers with validation errors
  updateQuantity,          // Update quantity (+/-)
  updateSelectedDate,      // Update single date
  updateSelectedDates,     // Update multiple dates
  setBookedOffers,         // Set booked offers
  setBookingAttempts,      // Set validation attempts
  setSelections,           // Set all selections
} = useOfferSelections({
  offers: OfferType[],
  initialSelections?: Record<number, OfferSelection>,
  reservationInfo?: ReservationInfo
})
```

**Initialization:**
- All Inclusive offers start with `quantity: 1`
- Other offers start with `quantity: 0`
- Person count defaults to `reservationInfo.personCount`
- Night count calculated from check-in/check-out dates

### `useOfferBooking`

Provides booking validation and state management.

```typescript
const { handleBookOrCancel } = useOfferBooking({
  offers,
  selections,
  bookedOffers,
  bookingAttempts,
  setBookedOffers,
  setBookingAttempts,
  setSelections,
  onBookOffer,
  calculateTotal,
  reservationInfo,
})
```

**Validation Rules:**
- Requires date selection if `offer.requiresDateSelection`
- Requires multiple dates if `offer.allowsMultipleDates`
- Validates quantity > 0 (except for special offers)
- Creates `OfferData` with calculated price

## Multibooking Utilities

### `convertOfferDataToBookingItem`

Converts component's `OfferData` to bookingStore's `EnhancedBookingItem`.

```typescript
const bookingItem = convertOfferDataToBookingItem(offerData)
// Returns:
{
  type: 'offer',
  concept: 'enhance-your-stay',
  name: 'Spa Package',
  price: 240.00,
  metadata: {
    originalOfferId: 4,
    quantity: 1,
    offerType: 'perPerson',
    persons: 2,
    selectedDate: Date,
    // ... all other offer data
  }
}
```

### `isOfferAlreadyBooked`

Checks if an offer already exists in room's items using `metadata.originalOfferId`.

```typescript
if (isOfferAlreadyBooked(room.items, offerId)) {
  showToast('Already added', 'error')
  return
}
```

### `findBookedOfferItem`

Finds a specific offer in room's items by original offer ID.

```typescript
const item = findBookedOfferItem(room.items, offerId)
if (item?.id) {
  bookingStore.removeItemFromRoom(roomId, item.id)
}
```

### `createOfferDataFromSelection`

Creates `OfferData` from offer definition and user selection.

```typescript
const offerData = createOfferDataFromSelection(
  offer: OfferType,
  selection: OfferSelection,
  calculatedPrice: number
)
```

## Type Definitions

### `OfferType`

Offer definition from API/backend:

```typescript
interface OfferType {
  id: number
  title: string
  description: string
  price: number
  type: 'perStay' | 'perPerson' | 'perNight'
  image?: string
  requiresDateSelection?: boolean
  allowsMultipleDates?: boolean
  featured?: boolean
  segmentDiscount?: SegmentDiscount
}
```

### `OfferSelection`

User's selection state for an offer:

```typescript
interface OfferSelection {
  quantity: number
  persons?: number
  nights?: number
  selectedDate?: Date
  selectedDates?: Date[]
  startDate?: Date
  endDate?: Date
}
```

### `OfferData`

Output format for booking callback:

```typescript
interface OfferData {
  id: number
  name: string
  price: number           // Final calculated price
  basePrice: number       // Original offer price
  quantity: number
  type: 'perStay' | 'perPerson' | 'perNight'
  persons?: number
  nights?: number
  selectedDate?: Date
  selectedDates?: Date[]
  startDate?: Date
  endDate?: Date
}
```

### `EnhancedBookingItem`

BookingStore format (from feat/multibooking):

```typescript
interface EnhancedBookingItem {
  id?: string
  name: string
  price: number
  type: 'room' | 'offer' | 'customization' | 'bid'
  concept?: string
  metadata?: {
    originalOfferId?: number
    quantity?: number
    offerType?: 'perStay' | 'perPerson' | 'perNight'
    persons?: number
    nights?: number
    selectedDate?: Date
    selectedDates?: Date[]
    // ...
  }
}
```

## Important Notes

### 1. Price Storage in Multibooking

Offers store the **final calculated price**, NOT multiplied by nights in the bookingStore:

```typescript
// ✅ Correct
bookingItem.price = 240.00  // Total price for 2 people

// ❌ Wrong
bookingItem.price = 120.00  // Per-person price
```

The bookingStore's `getTotalPrice()` does NOT multiply offers by nights:

```typescript
if (item.type === 'offer') {
  return sum + item.price  // Direct addition
}
return sum + (item.price * nights)  // Other items multiplied
```

### 2. Offer Type Detection

Current implementation uses string matching:

```typescript
const isAllInclusive = offer.title.toLowerCase().includes('all inclusive')
const isOnlineCheckin = offer.title.toLowerCase().includes('online check-in')
const isLateCheckout = offer.title.toLowerCase().includes('late checkout')
```

⚠️ **Documented for future refactoring** - should use proper enum/constant-based detection instead.

### 3. Bidirectional Synchronization

When offers are removed from the pricing panel:

```typescript
// Pricing panel removes item
bookingStore.removeItemFromRoom(roomId, itemId)

// Component should reset state
const newBooked = new Set(bookedOffers)
newBooked.delete(offerId)
setBookedOffers(newBooked)
```

This ensures the "Added" badge disappears and "Book Now" button reappears.

### 4. Room Context in Messages

Toast messages should include room context in multibooking mode:

```typescript
showToast(
  `${offer.title} added${isMultiBooking ? ` to ${room.roomName}` : ''}`,
  'success'
)
```

## Examples

See the Storybook stories for complete working examples:

- **SpecialOffers.stories.tsx** - Basic integration patterns
- **SpecialOffersMultibooking.stories.tsx** - Multibooking integration with mock store

## Testing Integration

For E2E tests (Playwright):

```typescript
// Add offer
await page.click('[data-testid="offer-book-button-1"]')
await expect(page.locator('[data-testid="offer-added-badge-1"]')).toBeVisible()

// Verify in pricing panel
await expect(page.locator('.pricing-panel')).toContainText('Spa Package')

// Remove from pricing panel
await page.click('[data-testid="remove-offer-1"]')
await expect(page.locator('[data-testid="offer-added-badge-1"]')).not.toBeVisible()
```

## Migration from ABS_SpecialOffers

If migrating from the original `ABS_SpecialOffers` component:

### Breaking Changes

1. **Props Changed:**
   - ❌ Removed: `initialSelections` (now controlled via `selections`)
   - ✅ Added: `selections`, `bookedOfferIds`, `showValidation`
   - ✅ Added: `formatPrice`, `calculateTotal`, `getUnitLabel` (utility functions)
   - ✅ Changed: `onBookOffer` now receives `offerId` instead of `OfferData`

2. **Hooks Moved:**
   - All hooks moved to `src/stories/SpecialOffers/hooks/`
   - Import from new location in your code

3. **State Management:**
   - Component no longer manages state internally
   - Parent must provide state and callbacks

### Migration Example

**Before:**
```typescript
<ABS_SpecialOffers
  offers={offers}
  initialSelections={selections}
  onBookOffer={(offerData) => handleBook(offerData)}
  currencySymbol="€"
  reservationInfo={reservationInfo}
/>
```

**After:**
```typescript
// In parent component
const { formatPrice, calculateTotal, getUnitLabel } = useOfferPricing('€', reservationInfo)
const { selections, bookedOffers, updateQuantity, ... } = useOfferSelections({ offers, reservationInfo })

<SpecialOffers
  offers={offers}
  selections={selections}
  bookedOfferIds={Array.from(bookedOffers)}
  onUpdateQuantity={updateQuantity}
  onUpdateSelectedDate={updateSelectedDate}
  onUpdateSelectedDates={updateSelectedDates}
  onBookOffer={handleBookOffer}
  formatPrice={formatPrice}
  calculateTotal={calculateTotal}
  getUnitLabel={getUnitLabel}
  currencySymbol="€"
  reservationInfo={reservationInfo}
/>
```

## Future Improvements

1. **Offer Type Detection**: Replace string matching with proper enum-based detection
2. **Validation**: Extract validation rules to configuration object
3. **Pricing Logic**: Consider moving complex pricing to backend API
4. **Type Safety**: Add stricter typing for offer metadata
5. **Accessibility**: Add ARIA labels and keyboard navigation improvements

## Support

For questions or issues:
- See Storybook stories for examples
- Check this README for integration patterns
- Review component TypeScript interfaces for prop requirements
