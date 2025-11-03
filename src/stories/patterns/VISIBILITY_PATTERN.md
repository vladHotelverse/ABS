# Visibility Logic Pattern Guide

## Overview

Visibility logic (deciding whether to render a component) should NOT live in UI components. Instead, parent components should decide what to render based on business rules.

## The Problem

### ❌ Anti-Pattern: Component Decides Visibility

```typescript
// BAD: Component has business rule logic
const ServicePriceDisplay: React.FC<Props> = ({ servicePrice }) => {
  // Business rule embedded in component
  if (servicePrice.amount <= 0) return null

  return <div>{servicePrice.formattedPrice}</div>
}
```

**Problems:**
- Business rule is hidden inside component
- Hard to test visibility logic
- Component can't be used with different rules
- Violates single responsibility principle

## The Solution

### ✅ Pattern 1: Conditional in Parent (Simplest)

For simple visibility decisions, use conditional rendering in the parent:

```typescript
const ServicesList: React.FC<Props> = ({ services }) => {
  return (
    <div>
      {services.map(service =>
        // Parent decides visibility
        service.amount > 0 ? (
          <ServicePriceDisplay key={service.id} servicePrice={service} />
        ) : null
      )}
    </div>
  )
}

// Component is now pure display logic
const ServicePriceDisplay: React.FC<Props> = ({ servicePrice }) => {
  return <div>{servicePrice.formattedPrice}</div>
}
```

**When to use:**
- Simple visibility rules
- Depends on single condition
- Rule is easy to understand

**Benefits:**
- Component is simple and testable
- Visibility rule is explicit
- Easy to modify rules

---

### ✅ Pattern 2: Inline Conditional (Lists with Empty State)

For list rendering with visibility rules:

```typescript
interface Extra {
  id: string
  price: number
}

const ExtrasList: React.FC<{ extras: Extra[] }> = ({ extras }) => {
  const visibleExtras = extras.filter(extra => extra.price > 0)

  if (visibleExtras.length === 0) {
    return <p>No extras available</p>
  }

  return (
    <ul>
      {visibleExtras.map(extra => (
        <ExtraItem key={extra.id} extra={extra} />
      ))}
    </ul>
  )
}

// Pure display component
const ExtraItem: React.FC<{ extra: Extra }> = ({ extra }) => {
  return <li>{extra.name} - ${extra.price}</li>
}
```

**When to use:**
- Filtering lists by condition
- Need empty state handling
- Multiple items with same rule

**Benefits:**
- Clear filtering logic
- Handles empty state
- Separation of concerns

---

### ✅ Pattern 3: Filter Before Map (Complex Cases)

For advanced visibility with multiple conditions:

```typescript
interface Booking {
  id: string
  status: 'pending' | 'confirmed' | 'cancelled'
  isPaid: boolean
}

const BookingsList: React.FC<{ bookings: Booking[] }> = ({ bookings }) => {
  // Complex filtering logic in parent
  const visibleBookings = bookings.filter(booking => {
    // Show only confirmed and paid bookings
    return booking.status === 'confirmed' && booking.isPaid
  })

  return (
    <div>
      {visibleBookings.length > 0 ? (
        <ul>
          {visibleBookings.map(booking => (
            <BookingItem key={booking.id} booking={booking} />
          ))}
        </ul>
      ) : (
        <EmptyState message="No paid bookings" />
      )}
    </div>
  )
}

// Pure display - no visibility logic
const BookingItem: React.FC<{ booking: Booking }> = ({ booking }) => {
  return <li>{booking.id} - {booking.status}</li>
}
```

**When to use:**
- Multiple visibility conditions
- Complex business rules
- Reusable filter logic

**Benefits:**
- Clear separation of concerns
- Easy to test filter logic
- Reusable filtering functions

---

### ✅ Pattern 4: Explicit Visibility Prop (When Needed)

For cases where visibility is dynamically determined:

```typescript
interface Props {
  price: number
  // Explicit prop instead of component logic
  isVisible: boolean
}

const Price: React.FC<Props> = ({ price, isVisible }) => {
  if (!isVisible) return null
  return <span>${price}</span>
}

// Parent calculates visibility
const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
  const shouldShow = service.price > 0 && service.isAvailable

  return (
    <div>
      <h3>{service.name}</h3>
      <Price price={service.price} isVisible={shouldShow} />
    </div>
  )
}
```

**When to use:**
- Component is reused in many contexts
- Visibility rules vary by use case
- Need explicit control from parent

**Benefits:**
- Component is flexible
- Clear prop indicates visibility decision
- Works in different contexts

---

## Anti-Patterns to Avoid

### ❌ Don't: Hardcode Thresholds

```typescript
// BAD
if (items.length > 5) return <ShowMore />
```

Move to configuration:
```typescript
// GOOD
const config = { maxVisibleItems: 5 }
if (items.length > config.maxVisibleItems) return <ShowMore />
```

### ❌ Don't: Mix Visibility with Display Logic

```typescript
// BAD
const Card = ({ item }) => {
  if (!item.isVisible) return null
  if (item.type === 'premium') return <PremiumCard item={item} />
  return <StandardCard item={item} />
}
```

Separate concerns:
```typescript
// GOOD - parent decides what to render
const render = (item) => {
  if (!item.isVisible) return null
  return item.type === 'premium' ? <PremiumCard /> : <StandardCard />
}
```

### ❌ Don't: Use State for Business Rules

```typescript
// BAD
const [show, setShow] = useState(data.price > 0)
```

Use parent logic:
```typescript
// GOOD
const shouldShow = data.price > 0
return shouldShow ? <Component /> : null
```

---

## Testing Visibility Logic

### Test in Parent, Not Component

```typescript
// Test the filtering/visibility logic
describe('BookingsList visibility', () => {
  it('shows only confirmed bookings', () => {
    const bookings = [
      { id: '1', status: 'confirmed' },
      { id: '2', status: 'pending' },
    ]

    const visibleBookings = bookings.filter(b => b.status === 'confirmed')
    expect(visibleBookings).toHaveLength(1)
    expect(visibleBookings[0].id).toBe('1')
  })
})

// Component just renders what it receives
describe('BookingItem', () => {
  it('displays booking', () => {
    render(<BookingItem booking={mockBooking} />)
    expect(screen.getByText('booking-1')).toBeInTheDocument()
  })
})
```

---

## Decision Tree: Which Pattern?

```
Does visibility depend on component data?
├─ YES: Component decides visibility
│  └─ Use Pattern 4 (Explicit Visibility Prop)
│     "Parent passes isVisible prop"
│
└─ NO: Parent has the data
   ├─ Is it a simple condition?
   │  └─ YES: Use Pattern 1 (Conditional in Parent)
   │         "Simple ? renderA : renderB"
   │
   └─ Is it a list with filtering?
      ├─ YES: Is it complex filtering?
      │  ├─ NO: Use Pattern 2 (Inline Conditional)
      │  │      "Filter and render"
      │  │
      │  └─ YES: Use Pattern 3 (Filter Before Map)
      │         "Extract filter function"
      │
      └─ NO: Reconsider your data structure
```

---

## Key Principles

1. **Parent Controls Rendering**
   - Parent component decides what to render
   - UI components don't check conditions

2. **Push Logic Up**
   - Move visibility rules to parent
   - Keep components pure display

3. **Make it Explicit**
   - Use conditional statements in parent
   - Don't hide logic in components

4. **Separate Concerns**
   - Visibility logic ≠ display logic
   - Each component has one responsibility

5. **Enable Reusability**
   - Component works in different contexts
   - Same component, different rules

---

## Examples from ABS Codebase

### ServicePriceDisplay (Task 6)

**Before:**
```typescript
// ❌ Component decides visibility
const ServicePriceDisplay = ({ servicePrice }) => {
  if (servicePrice.amount <= 0) return null
  return <div>{servicePrice.formattedPrice}</div>
}
```

**After:**
```typescript
// ✅ Parent decides visibility
const ServicesList = ({ services }) => {
  return (
    <div>
      {services
        .filter(s => s.amount > 0)
        .map(s => <ServicePriceDisplay key={s.id} service={s} />)}
    </div>
  )
}

const ServicePriceDisplay = ({ service }) => {
  return <div>{service.formattedPrice}</div>
}
```

---

## Migration Checklist

When refactoring visibility logic:

- [ ] Identify component with visibility logic
- [ ] Find parent component
- [ ] Move visibility rule to parent
- [ ] Pass filtered data to component
- [ ] Remove conditional from component
- [ ] Test parent visibility logic
- [ ] Test component display logic
- [ ] Update component prop interface
- [ ] Update Storybook stories
- [ ] Update component documentation

---

## See Also

- [VALIDATION_PATTERN.md](./VALIDATION_PATTERN.md) - Handling required props and validation
- [ConfigurationErrorBoundary.tsx](../components/ConfigurationErrorBoundary.tsx) - Error handling
