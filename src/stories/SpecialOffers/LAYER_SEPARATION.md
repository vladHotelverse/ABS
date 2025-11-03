# UI Layer Separation Architecture

This document explains how the SpecialOffers component follows strict UI layer separation principles.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│             PARENT/STORY (Business Logic Layer)          │
│  - Manage state (selections, bookedOffers)               │
│  - Calculate prices and totals                           │
│  - Apply business rules and validation                   │
│  - Format prices, labels, unit labels                    │
│  - Detect special offer types                            │
│  - Generate validation messages                          │
│  - Determine visibility and disabled states              │
└─────────────────────────────────────────────────────────┘
                          ↓
              formatOfferCards() → OfferCardData[]
                          ↓
┌─────────────────────────────────────────────────────────┐
│        SpecialOffers Component (UI Layer)                │
│  ✅ Receives pre-formatted OfferCardData                 │
│  ✅ Maps callbacks with no transformation                │
│  ✅ Handles only UI concerns (grid layout, styling)      │
│  ✅ Passes callbacks without modification                │
└─────────────────────────────────────────────────────────┘
                          ↓
                   OfferCard Component
                   (Pure Presentation)
```

## What Each Layer Does

### 🔧 Business Logic Layer (Parent/Story)

**Responsibilities:**
- State management (selections, bookings, validation state)
- Price calculations via `calculateTotal()`
- Price formatting via `formatPrice()`
- Label formatting
- Business rules (special offers, validation)
- Data transformation via `formatOfferCards()`

**Example:**
```typescript
import { formatOfferCards } from '@/stories/SpecialOffers/utils/offerFormatter'

function MyComponent() {
  const { formatPrice, calculateTotal, getUnitLabel } = useOfferPricing(...)
  const { selections, bookedOffers } = useOfferSelections(...)

  // Format data BEFORE passing to UI component
  const cardData = formatOfferCards(
    offers,
    selections,
    Array.from(bookedOffers),
    '€',
    labels,
    formatPrice,
    calculateTotal,
    getUnitLabel
  )

  return (
    <SpecialOffers
      cardData={cardData}
      onUpdateQuantity={handleQuantityChange}
      onBookOffer={handleBook}
      labels={labels}
    />
  )
}
```

### 🎨 UI Layer (SpecialOffers Component)

**Responsibilities:**
- ✅ Display pre-formatted data
- ✅ Handle user interactions via callbacks
- ✅ Manage visual state (hover, focus, active)
- ✅ Grid layout and styling
- ✅ Pass interactions to callbacks without transformation

**Constraints:**
- ❌ NO calculations
- ❌ NO data transformations
- ❌ NO business logic or conditionals
- ❌ NO decisions based on data characteristics
- ❌ NO formatting or value manipulation

## Data Flow

### 1. Formatting Phase (Parent/Story)

```typescript
const cardData = formatOfferCards(
  offers,          // Raw offer data
  selections,      // User selections
  bookedOffers,    // Which offers are booked
  '€',             // Currency
  labels,          // Labels
  formatPrice,     // Price formatter function
  calculateTotal,  // Total calculator function
  getUnitLabel     // Unit label getter
)
// Returns: OfferCardData[] with ALL pre-calculated values
```

### 2. Display Phase (UI Component)

```typescript
<SpecialOffers
  cardData={cardData}  // Pre-formatted, pre-calculated data
  onUpdateQuantity={handleQuantityChange}
  onUpdateSelectedDate={handleDateChange}
  onBookOffer={handleBook}
  labels={labels}
/>
```

The UI component receives everything it needs, already formatted and ready to display.

## OfferCardData Structure

Each card data object contains:

```typescript
{
  // Raw data (for display)
  offer: OfferType
  selection: OfferSelection

  // Pre-formatted display values (READY TO SHOW)
  formattedBasePrice: '€45.00'
  formattedTotal: '€135.00'
  unitLabel: 'per person'

  // Pre-calculated decisions (NO LOGIC IN UI)
  isBooked: boolean
  showValidation: boolean
  shouldShowQuantityControls: boolean  // Business rule decided
  shouldShowTotal: boolean             // Business rule decided
  isButtonDisabled: boolean            // Business rule decided
  validationMessages: string[]         // Pre-generated messages

  // Special offer type indicators
  isAllInclusive: boolean              // Detected by formatter
  isOnlineCheckin: boolean
  isLateCheckout: boolean
}
```

## Benefits of This Architecture

### ✅ Clarity
- UI layer is OBVIOUSLY just display logic
- All business logic is centralized in one place
- Easy to understand what each layer does

### ✅ Testability
- Business logic can be tested independently
- UI components are simple and deterministic
- No complex conditional logic to test in UI

### ✅ Maintainability
- Change business rules? Update formatter only
- Change UI design? Update component only
- No entangled concerns

### ✅ Performance
- No unnecessary re-calculations in UI
- No complex conditionals causing re-renders
- Pre-calculated values are stable

### ✅ Type Safety
- `OfferCardData` enforces structure
- Parent must provide all required values
- UI component can't request missing data

## What OfferCardData Replaces

### Before (Violations)
```typescript
// ❌ Component receives raw data and must calculate
<OfferCard
  offer={offer}
  selection={selection}
  formatPrice={formatPrice}           // Function
  calculateTotal={calculateTotal}     // Function
  getUnitLabel={getUnitLabel}        // Function
  // Component internally:
  // - Calls calculateTotal()
  // - Calls formatPrice()
  // - Makes decisions about visibility
  // - Detects special offer types
/>
```

### After (Clean)
```typescript
// ✅ Component receives pre-formatted, pre-calculated data
<OfferCard
  cardData={{
    formattedBasePrice: '€45.00',     // Already formatted
    formattedTotal: '€135.00',        // Already formatted
    unitLabel: 'per person',          // Already determined
    shouldShowQuantityControls: true, // Already calculated
    isButtonDisabled: false,          // Already calculated
    // ... all other pre-calculated values
  }}
/>
```

## Common Patterns

### Pattern 1: Using the Formatter

```typescript
import { formatOfferCards } from '@/stories/SpecialOffers/utils/offerFormatter'
import { useOfferPricing } from '@/stories/SpecialOffers/hooks/useOfferPricing'
import { useOfferSelections } from '@/stories/SpecialOffers/hooks/useOfferSelections'

function BookingComponent() {
  const { formatPrice, calculateTotal, getUnitLabel } = useOfferPricing('€', reservationInfo)
  const { selections, bookedOffers } = useOfferSelections({ offers, reservationInfo })

  // Format all offers at once
  const cardData = formatOfferCards(
    offers,
    selections,
    Array.from(bookedOffers),
    '€',
    labels,
    formatPrice,
    calculateTotal,
    getUnitLabel,
    showValidation
  )

  return (
    <SpecialOffers
      cardData={cardData}
      onUpdateQuantity={updateQuantity}
      onBookOffer={handleBook}
      labels={labels}
    />
  )
}
```

### Pattern 2: When Selection Changes

```typescript
// Whenever user changes selection, parent re-formats
useEffect(() => {
  const updated = formatOfferCards(...)
  // SpecialOffers re-renders with new formatted data
}, [selections, bookedOffers])
```

### Pattern 3: Multibooking Integration

```typescript
const handleBook = (offerId: number) => {
  const room = bookingStore.rooms.find(r => r.id === roomId)

  // Parent decides to book (ALL business logic)
  if (isOfferAlreadyBooked(room.items, offerId)) {
    showToast('Already added', 'error')
    return
  }

  const offerData = createOfferDataFromSelection(offer, selection, price)
  bookingStore.addItemToRoom(roomId, convertOfferDataToBookingItem(offerData))

  // Update formatted data
  setBookedOffers(new Set([...bookedOffers, offerId]))
}

// UI component receives updated formatted data automatically
```

## Migration from Old Pattern

### Step 1: Create Formatter Call
```typescript
const cardData = formatOfferCards(...)
```

### Step 2: Update Component Props
```typescript
// Remove these:
// - formatPrice prop
// - calculateTotal prop
// - getUnitLabel prop
// - reservationInfo prop
// - selections prop
// - bookedOfferIds prop
// - showValidation prop

// Add this:
// + cardData prop
```

### Step 3: Update Callbacks
```typescript
// Still pass callbacks, but they're simpler now
onUpdateQuantity={(offerId, change) => { ... }}
onBookOffer={(offerId) => { ... }}
```

## Future Improvements

### 1. Move to Constants
```typescript
// Replace string-matching with constants
const SPECIAL_OFFER_TYPES = {
  ALL_INCLUSIVE: 'all-inclusive',
  ONLINE_CHECKIN: 'online-checkin',
  LATE_CHECKOUT: 'late-checkout'
}

// Then in offer type:
type: SPECIAL_OFFER_TYPES.ALL_INCLUSIVE
```

### 2. Validation Rules as Config
```typescript
const validationRules = {
  requiresQuantity: true,
  requiresDate: true,
  requiresDateRange: false
}

// Check rules instead of offer properties
```

### 3. Custom Formatters
```typescript
// Allow parent to customize formatting
interface FormattingConfig {
  formatPrice: (price: number) => string
  currencySymbol: string
  dateFormat: 'DD/MM' | 'MM/DD'
}
```

## Summary

✅ **Parent/Story** - All business logic, calculations, formatting
✅ **UI Component** - Pure display, handles interactions via callbacks
✅ **Data** - Pre-calculated `OfferCardData` with all needed values
✅ **Separation** - Clear boundary between logic and presentation
✅ **Testability** - Each layer independently testable
✅ **Maintainability** - Easy to understand and modify
