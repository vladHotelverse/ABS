# Validation & Error Handling Pattern Guide

## Overview

Validation and error handling should use THREE LAYERS:
1. **TypeScript** - Compile-time type safety
2. **Error Boundaries** - Runtime error catching
3. **Parent Validation** - Business rule validation

## The Problem

### ❌ Anti-Pattern: Component Validates Runtime

```typescript
// BAD: Component validates props at runtime
const PricingSummaryPanel = ({ labels, rooms, bookings }) => {
  // Runtime validation in component
  if (!labels) {
    console.error('PricingSummaryPanel: labels prop is required')
    return (
      <div className="border border-red-500 p-4">
        <h3>Configuration Error</h3>
        <p>Missing required labels configuration.</p>
      </div>
    )
  }

  return <div>{/* component content */}</div>
}
```

**Problems:**
- TypeScript doesn't prevent missing props
- Error handling logic mixed with display logic
- Hard to distinguish missing props from runtime errors
- Error UI is component-specific, not reusable

## The Solution: Three-Layer Validation

### Layer 1: TypeScript (Compile-Time Safety)

Make required props non-optional:

```typescript
// Define required props
interface PricingSummaryPanelProps {
  labels: PricingSummaryLabels  // ← Required (no ?)
  rooms: Room[]                  // ← Required
  bookings: Booking[]            // ← Required
  loading?: boolean              // ← Optional
  readonly?: boolean             // ← Optional
}

// Component assumes props are always provided
const PricingSummaryPanel: React.FC<PricingSummaryPanelProps> = ({
  labels,
  rooms,
  bookings,
  loading = false,
  readonly = false,
}) => {
  // TypeScript guarantees labels, rooms, bookings exist
  // No runtime checks needed
  return (
    <div>
      <h2>{labels.title}</h2>
      {rooms.map(room => (
        <RoomCard key={room.id} room={room} labels={labels} />
      ))}
    </div>
  )
}
```

**Benefits:**
- TypeScript prevents missing props at compile time
- IDE autocomplete works correctly
- Component code is simpler and cleaner
- Fails fast during development

**Testing:**
```typescript
// TypeScript enforces required props
// This won't compile:
// <PricingSummaryPanel rooms={[]} bookings={[]} />
//                                                   ↑ missing labels

// This compiles:
<PricingSummaryPanel
  labels={mockLabels}
  rooms={[]}
  bookings={[]}
/>
```

---

### Layer 2: Parent Validation (Runtime Business Rules)

Parent handles loading states and missing data:

```typescript
const BookingFlow = () => {
  const { labels, loading, error } = useBookingLabels()
  const { rooms, roomsLoading } = useRooms()
  const { bookings, bookingsLoading } = useBookings()

  // Parent handles loading state
  if (loading || roomsLoading || bookingsLoading) {
    return <LoadingSpinner />
  }

  // Parent handles error state
  if (error) {
    return <ErrorAlert message={error.message} />
  }

  // Parent ensures data exists before rendering
  if (!labels || !rooms.length || !bookings.length) {
    return <EmptyState message="No booking data available" />
  }

  // Only render when all data is ready
  // Component can assume props are valid
  return (
    <PricingSummaryPanel
      labels={labels}
      rooms={rooms}
      bookings={bookings}
    />
  )
}
```

**Benefits:**
- Handles API loading and errors gracefully
- Consistent error/loading UI across app
- Component doesn't know about data fetching
- Easy to test loading/error states

**Testing:**
```typescript
describe('BookingFlow', () => {
  it('shows loading spinner while fetching', () => {
    useBookingLabels.mockReturnValue({ loading: true })
    render(<BookingFlow />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('shows error when fetch fails', () => {
    useBookingLabels.mockReturnValue({ error: new Error('API failed') })
    render(<BookingFlow />)
    expect(screen.getByText(/API failed/)).toBeInTheDocument()
  })

  it('renders panel when data is ready', () => {
    useBookingLabels.mockReturnValue({ labels: mockLabels })
    render(<BookingFlow />)
    expect(screen.getByText(mockLabels.title)).toBeInTheDocument()
  })
})
```

---

### Layer 3: Error Boundaries (Unexpected Runtime Errors)

Catch unexpected errors during render:

```typescript
import { ConfigurationErrorBoundary } from '@/stories/components'

const App = () => {
  return (
    <ConfigurationErrorBoundary onError={(error) => {
      // Log to error tracking service
      console.error('Unexpected error:', error)
    }}>
      <BookingFlow />
    </ConfigurationErrorBoundary>
  )
}
```

**Benefits:**
- Catches unexpected render errors
- Shows graceful fallback UI
- Prevents white screen of death
- Logs errors for debugging

**Testing:**
```typescript
describe('ConfigurationErrorBoundary', () => {
  it('catches errors and displays fallback', () => {
    const ErrorComponent = () => {
      throw new Error('Render failed')
    }

    render(
      <ConfigurationErrorBoundary>
        <ErrorComponent />
      </ConfigurationErrorBoundary>
    )

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
  })

  it('calls onError callback', () => {
    const onError = vi.fn()
    const ErrorComponent = () => {
      throw new Error('Test error')
    }

    render(
      <ConfigurationErrorBoundary onError={onError}>
        <ErrorComponent />
      </ConfigurationErrorBoundary>
    )

    expect(onError).toHaveBeenCalled()
  })
})
```

---

## Complete Example

### Before (Anti-Pattern)

```typescript
// ❌ Component handles validation
const OrderConfirmation = ({ order, customer, payment }) => {
  // Runtime validation mixed with display logic
  if (!order || !order.id) {
    return (
      <div className="error">
        <h3>Configuration Error</h3>
        <p>Order data is missing</p>
      </div>
    )
  }

  if (!customer || !customer.name) {
    return <div className="error">Customer data missing</div>
  }

  if (!payment) {
    return <div className="error">Payment info required</div>
  }

  return (
    <div>
      <h2>Order {order.id}</h2>
      <p>{customer.name}</p>
      <p>${payment.amount}</p>
    </div>
  )
}
```

### After (Clean Pattern)

**Component:**
```typescript
// ✅ Component is pure display
interface OrderConfirmationProps {
  order: Order           // ← TypeScript ensures these exist
  customer: Customer     // ← No optional checks needed
  payment: Payment       // ← No validation logic
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  order,
  customer,
  payment,
}) => {
  return (
    <div>
      <h2>Order {order.id}</h2>
      <p>{customer.name}</p>
      <p>${payment.amount}</p>
    </div>
  )
}
```

**Parent:**
```typescript
// ✅ Parent handles validation and errors
const OrderPage = () => {
  const { order, loading: orderLoading, error: orderError } = useOrder()
  const { customer, loading: customerLoading } = useCustomer()
  const { payment } = usePayment()

  // Handle loading
  if (orderLoading || customerLoading) {
    return <LoadingSpinner />
  }

  // Handle error
  if (orderError) {
    return <ErrorAlert message={orderError.message} />
  }

  // Handle missing data
  if (!order || !customer || !payment) {
    return <EmptyState message="Order data not available" />
  }

  // Only render when all data is ready
  return (
    <ConfigurationErrorBoundary>
      <OrderConfirmation
        order={order}
        customer={customer}
        payment={payment}
      />
    </ConfigurationErrorBoundary>
  )
}
```

---

## Validation Checklist

When creating components:

- [ ] Make required props non-optional
- [ ] Remove runtime prop validation
- [ ] Remove error handling UI from component
- [ ] Let parent handle loading states
- [ ] Let parent handle error states
- [ ] Let parent check data availability
- [ ] Use Error Boundary for unexpected errors
- [ ] Component assumes all props are valid
- [ ] Test component with valid props only
- [ ] Test parent for loading/error/empty states

---

## When to Use Each Layer

### Use TypeScript When...
- Defining component interfaces
- Specifying required vs optional props
- Building type-safe applications

### Use Parent Validation When...
- Data comes from API
- Loading time matters
- Multiple data sources
- Complex data dependencies

### Use Error Boundaries When...
- You want graceful error recovery
- Building production applications
- Unexpected errors might occur

---

## Anti-Patterns to Avoid

### ❌ Don't: Optional Props With Runtime Checks

```typescript
// BAD
interface Props {
  labels?: Labels  // Optional
}

const Component = ({ labels }: Props) => {
  if (!labels) return <Error />  // Runtime check
}
```

**Fix:** Make it required
```typescript
// GOOD
interface Props {
  labels: Labels  // Required
}

const Component = ({ labels }: Props) => {
  // No checks needed - TypeScript guarantees it exists
}
```

### ❌ Don't: Mix Validation and Display

```typescript
// BAD
const Card = ({ item }) => {
  if (!item) return <Error />
  if (item.type === 'premium') return <PremiumCard />
  return <StandardCard />
}
```

**Fix:** Separate concerns
```typescript
// GOOD - Parent handles availability
const Container = ({ item }) => {
  if (!item) return <Error />
  return <CardRenderer item={item} />
}

// Component only handles display
const CardRenderer = ({ item }: { item: Item }) => {
  return item.type === 'premium' ? <PremiumCard /> : <StandardCard />
}
```

### ❌ Don't: Ignore TypeScript Errors

```typescript
// BAD
const Component = ({ data }: { data: Data | undefined }) => {
  // TypeScript complains, you ignore it
  // @ts-ignore
  return <div>{data.value}</div>
}
```

**Fix:** Trust TypeScript
```typescript
// GOOD
const Component = ({ data }: { data: Data }) => {
  // TypeScript is happy, no @ts-ignore needed
  return <div>{data.value}</div>
}
```

---

## Error Recovery Patterns

### Pattern 1: Retry Logic

```typescript
const OrderList = () => {
  const [retryCount, setRetryCount] = useState(0)
  const { data, error, refetch } = useOrders()

  if (error && retryCount < 3) {
    return (
      <div>
        <p>Failed to load orders</p>
        <button onClick={() => {
          setRetryCount(r => r + 1)
          refetch()
        }}>
          Retry ({retryCount}/3)
        </button>
      </div>
    )
  }

  if (error) {
    return <ErrorAlert message="Unable to load orders" />
  }

  return <Component data={data} />
}
```

### Pattern 2: Fallback Data

```typescript
const Dashboard = () => {
  const { data = defaultData, error } = useAnalytics()

  if (error) {
    console.warn('Analytics failed, using default data')
  }

  // Show data even if error (using fallback)
  return <AnalyticsPanel data={data} />
}
```

### Pattern 3: Graceful Degradation

```typescript
const Report = ({ includeAnalytics = true }) => {
  const { data: analyticsData, error } = useAnalytics()

  return (
    <div>
      <Content />
      {!error && includeAnalytics && (
        <AnalyticsPanel data={analyticsData} />
      )}
    </div>
  )
}
```

---

## Testing Strategies

### Test TypeScript Types

```typescript
// Use type testing to verify types
import { expectType } from 'vitest'

const props: PricingSummaryPanelProps = {
  labels: mockLabels,
  rooms: [],
  bookings: [],
}

expectType<PricingSummaryPanelProps>(props)
```

### Test Error Boundaries

```typescript
describe('ConfigurationErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('displays error message', () => {
    const ThrowComponent = () => {
      throw new Error('Test error')
    }

    render(
      <ConfigurationErrorBoundary>
        <ThrowComponent />
      </ConfigurationErrorBoundary>
    )

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
  })
})
```

### Test Parent Validation

```typescript
describe('BookingFlow validation', () => {
  it('shows loading when fetching', () => {
    useOrder.mockReturnValue({ loading: true })
    render(<BookingFlow />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('shows empty state when data is missing', () => {
    useOrder.mockReturnValue({ loading: false, data: null })
    render(<BookingFlow />)
    expect(screen.getByText(/no booking data/i)).toBeInTheDocument()
  })
})
```

---

## Migration Checklist

When refactoring validation:

- [ ] Make required props non-optional
- [ ] Remove runtime prop validation from component
- [ ] Remove error handling UI from component
- [ ] Create parent wrapper component
- [ ] Add loading state handling in parent
- [ ] Add error state handling in parent
- [ ] Add data availability checks in parent
- [ ] Wrap with ConfigurationErrorBoundary
- [ ] Update component tests (happy path only)
- [ ] Add parent validation tests
- [ ] Update Storybook stories
- [ ] Update component documentation

---

## See Also

- [VISIBILITY_PATTERN.md](./VISIBILITY_PATTERN.md) - Handling conditional rendering
- [ConfigurationErrorBoundary.tsx](../components/ConfigurationErrorBoundary.tsx) - Error boundary implementation
