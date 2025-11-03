# Component Refactoring Integration Guide

Complete step-by-step guide for refactoring components to follow clean architecture patterns established in Phases 1-2.

## Quick Overview

This guide shows you how to refactor ANY component to:
1. Remove business logic from UI
2. Handle visibility properly
3. Implement proper error handling
4. Make components reusable and testable

**Time per component:** 1-2 hours (depending on complexity)

---

## The 6-Step Refactoring Process

### Step 1: Analyze Current Component

**Questions to ask:**
- What props does it need?
- What logic does it contain?
- Does it transform data?
- Does it decide visibility?
- Does it validate inputs?
- Does it handle errors?

**Checklist:**
- [ ] Read the component code top-to-bottom
- [ ] Identify all business logic
- [ ] List all props
- [ ] Note any state management
- [ ] Check for conditional rendering based on data

**Example:** Looking at `ServicePriceDisplay`
```typescript
const ServicePriceDisplay = ({ servicePrice }) => {
  // Business logic: decides visibility based on amount
  if (servicePrice.amount <= 0) return null

  return <div>{servicePrice.formattedPrice}</div>
}
```

---

### Step 2: Identify Which Patterns Apply

**Use this flowchart:**

```
Does component have business logic?
├─ YES: Is it visibility logic?
│  ├─ YES → Use VISIBILITY_PATTERN.md
│  └─ NO: Is it validation?
│     └─ YES → Use VALIDATION_PATTERN.md
│
└─ NO: Does it render errors?
   └─ YES → Wrap with ConfigurationErrorBoundary
```

**For our example:**
- ✅ Has visibility logic → Use VISIBILITY_PATTERN.md
- ✅ Hardcoded threshold (amount <= 0) → Parent should filter

---

### Step 3: Extract Business Logic

**Create location:** `src/stories/<ComponentName>/`

**Create files:**
- `utils/` - For pure functions
- `hooks/` - For custom hooks
- `types.ts` - For shared types (optional)

**For visibility logic example:**

Parent filtering logic:
```typescript
// Before: Component decides
{services.map(s => <ServicePriceDisplay service={s} />)}

// After: Parent decides
{services
  .filter(s => s.amount > 0)
  .map(s => <ServicePriceDisplay service={s} />)
}
```

**More complex example - with helper function:**

```typescript
// Create: src/stories/ServicePriceDisplay/utils/filterVisibleServices.ts
export const filterVisibleServices = (services: Service[]): Service[] => {
  return services.filter(s => s.amount > 0)
}

// Use in parent:
const visibleServices = filterVisibleServices(services)
return (
  <ul>
    {visibleServices.map(s => <ServicePriceDisplay key={s.id} service={s} />)}
  </ul>
)
```

**Testing the extracted logic:**
```typescript
describe('filterVisibleServices', () => {
  it('filters out zero-amount services', () => {
    const services = [
      { id: '1', amount: 10 },
      { id: '2', amount: 0 },
      { id: '3', amount: 5 },
    ]

    const result = filterVisibleServices(services)
    expect(result).toHaveLength(2)
    expect(result.map(s => s.id)).toEqual(['1', '3'])
  })
})
```

---

### Step 4: Update Component Interface

**Update props:**
```typescript
// Before: Component receives everything
interface Props {
  servicePrice?: Service  // Optional, might not exist
}

// After: Component assumes props are valid
interface ServicePriceDisplayProps {
  service: Service  // Required, no optional
}
```

**Remove validation:**
```typescript
// Before: Component validates
if (!servicePrice) return null

// After: Component assumes valid
// (Parent ensures it's valid before rendering)
```

**Remove business rules:**
```typescript
// Before: Component has logic
if (servicePrice.amount <= 0) return null

// After: Just render
return <div>{service.formattedPrice}</div>
```

---

### Step 5: Update or Create Stories

**Update existing stories to show new patterns:**

```typescript
// File: src/stories/ServicePriceDisplay/ServicePriceDisplay.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ServicePriceDisplay } from '@/components/upsell/ServicePriceDisplay'
import { filterVisibleServices } from './utils/filterVisibleServices'

const meta = {
  title: 'Upsell/ServicePriceDisplay',
  component: ServicePriceDisplay,
} satisfies Meta<typeof ServicePriceDisplay>

export default meta
type Story = StoryObj<typeof meta>

// Show filtered list (proper pattern)
export const WithFiltering: Story = {
  render: () => {
    const allServices = [
      { id: '1', name: 'Premium', amount: 50, formattedPrice: '$50' },
      { id: '2', name: 'Basic', amount: 0, formattedPrice: '$0' },
      { id: '3', name: 'Standard', amount: 25, formattedPrice: '$25' },
    ]

    const visibleServices = filterVisibleServices(allServices)

    return (
      <ul>
        {visibleServices.map(service => (
          <li key={service.id}>
            <ServicePriceDisplay service={service} />
          </li>
        ))}
      </ul>
    )
  },
}

// Show single service (pure display)
export const SingleService: Story = {
  args: {
    service: {
      id: '1',
      name: 'Premium Service',
      amount: 50,
      formattedPrice: '$50',
    },
  },
}
```

---

### Step 6: Test and Validate

**Test layers (in order):**

1. **Business Logic Tests** (Utilities)
```typescript
// Test: filterVisibleServices.test.ts
describe('filterVisibleServices', () => {
  it('returns only services with amount > 0', () => {
    // Test the utility function
  })
})
```

2. **Component Tests** (Happy path only)
```typescript
// Test: ServicePriceDisplay.test.tsx
describe('ServicePriceDisplay', () => {
  it('displays service price', () => {
    render(<ServicePriceDisplay service={mockService} />)
    expect(screen.getByText('$50')).toBeInTheDocument()
  })

  // No tests for visibility - that's parent's job
})
```

3. **Parent/Integration Tests**
```typescript
// Test: ServicesList.test.tsx
describe('ServicesList', () => {
  it('filters and displays only visible services', () => {
    render(<ServicesList services={mixedServices} />)
    expect(screen.getByText('Premium')).toBeInTheDocument()
    expect(screen.queryByText('Basic')).not.toBeInTheDocument()
  })
})
```

**Validation checklist:**
- [ ] Component tests pass (happy path)
- [ ] Utility tests pass
- [ ] Parent/integration tests pass
- [ ] Storybook stories render correctly
- [ ] TypeScript compiles without errors
- [ ] No runtime validation in component
- [ ] No hardcoded business rules in component

---

## Real-World Examples from ABS

### Example 1: PricingSummaryPanel (Task 1 - Phase 1)

**Before:** Component calculated initial accordion state
```typescript
// ❌ Business logic in component
const [internalActiveRooms] = useState(() => {
  const roomsWithItems = rooms.filter(r => r.sections.some(s => s.items.length > 0))
  if (exclusiveAccordion) {
    return roomsWithItems.length > 0 ? [roomsWithItems[0].id] : []
  }
  return roomsWithItems.map(r => r.id)
})
```

**After:** Hook handles initialization, component receives prop
```typescript
// ✅ Hook in stories layer
export const useAccordionState = ({ rooms, exclusiveAccordion }) => {
  return useMemo(() => {
    const roomsWithItems = rooms.filter(r => r.sections.some(s => s.items.length > 0))
    if (exclusiveAccordion) {
      return roomsWithItems.length > 0 ? [roomsWithItems[0].id] : []
    }
    return roomsWithItems.map(r => r.id)
  }, [rooms, exclusiveAccordion])
}

// ✅ Component receives pre-calculated value
<MultiBookingPricingSummaryPanel
  initialActiveRooms={useAccordionState({ rooms, exclusiveAccordion }).initialActiveRooms}
/>
```

---

### Example 2: AttributesCategories (Task 2-3 - Phase 1)

**Before:** Component sorted and limited display
```typescript
// ❌ Sorting in component
const sortedAttributes = [...category.attributes].sort(
  (a, b) => (a.exclusivityRatio ?? 0) - (b.exclusivityRatio ?? 0)
)

// ❌ Hardcoded threshold
const initialItemsCount = breakpoint === '2xl' ? 3 : breakpoint === 'mobile' ? 1 : 2
const displayAttributes = showAll ? sortedAttributes : sortedAttributes.slice(0, initialItemsCount)
```

**After:** Utilities handle logic, component receives formatted data
```typescript
// ✅ Pure sorting function
export const sortAttributesByExclusivity = (categories) => {
  return categories.map(cat => ({
    ...cat,
    attributes: [...cat.attributes].sort(
      (a, b) => (a.exclusivityRatio ?? 0) - (b.exclusivityRatio ?? 0)
    ),
  }))
}

// ✅ Configurable display settings
export const useAttributeDisplaySettings = (config: AttributeDisplayConfig) => {
  const breakpoint = useBreakpoint()
  return useMemo(() => {
    const initialVisibleCount = resolveInitialVisibleCount(breakpoint, config)
    return { initialVisibleCount, showMoreThreshold: config.showMoreThreshold }
  }, [breakpoint, config])
}

// ✅ Component receives pre-sorted data and config
<AttributesCategories
  categories={sortAttributesByExclusivity(rawCategories)}
  displayConfig={displayConfig}
/>
```

---

### Example 3: BookingsSummarySection (Task 4 - Phase 1)

**Before:** Component sliced array inline
```typescript
// ❌ Business logic in render
{extras.slice(0, 5).map(extra => <ExtraItem key={extra.id} extra={extra} />)}
{extras.length > 5 && <p>+{extras.length - 5} more</p>}
```

**After:** Utility processes data, component receives filtered list
```typescript
// ✅ Pure utility function
export const limitExtras = <T,>(items: T[], maxVisible: number = 5) => {
  return {
    visible: items.slice(0, maxVisible),
    hiddenCount: Math.max(0, items.length - maxVisible),
  }
}

// ✅ Parent processes data before rendering
const { visible, hiddenCount } = limitExtras(extras, 5)

// ✅ Component receives pre-processed data
<BookingsSummarySection
  visibleExtras={visible}
  hiddenExtrasCount={hiddenCount}
/>

// ✅ Component just renders
{visibleExtras.map(extra => <ExtraItem key={extra.id} extra={extra} />)}
{hiddenExtrasCount > 0 && <p>+{hiddenExtrasCount} more</p>}
```

---

## Decision Tree: Which Pattern?

```
Component has logic to refactor?
├─ VISIBILITY LOGIC
│  └─ Does parent have the data?
│     ├─ YES: Filter in parent (Pattern 1-2)
│     └─ NO: Use visibility prop (Pattern 4)
│
├─ DATA TRANSFORMATION
│  ├─ Simple (sort, slice, map)?
│     └─ Use pure function in stories/utils/
│  │
│  └─ Complex (multiple steps, state)?
│     └─ Use hook in stories/hooks/
│
├─ VALIDATION
│  ├─ Required props?
│     └─ Remove optional, use TypeScript
│  │
│  ├─ Business rule validation?
│     └─ Move to parent component
│  │
│  └─ Unexpected runtime errors?
│     └─ Wrap with ConfigurationErrorBoundary
│
└─ STATE MANAGEMENT
   ├─ Simple toggle/flag?
      └─ Use useState in parent
   │
   └─ Complex multi-step?
      └─ Use useReducer or custom hook in stories/
```

---

## Migration Checklist (40+ items)

### Phase 1: Analysis
- [ ] Read component code thoroughly
- [ ] Identify all business logic
- [ ] Identify visibility decisions
- [ ] Identify validation logic
- [ ] List all props and their usage
- [ ] Check for hardcoded values/thresholds
- [ ] Review current tests
- [ ] Document current behavior

### Phase 2: Planning
- [ ] Decide which patterns apply
- [ ] Identify extraction location (utils vs hooks)
- [ ] Plan new file structure
- [ ] Plan prop changes
- [ ] Plan parent component changes
- [ ] Plan test changes
- [ ] Estimate effort
- [ ] Schedule work

### Phase 3: Implementation - Logic Extraction
- [ ] Create utils directory
- [ ] Create pure function(s)
- [ ] Write tests for utilities
- [ ] Create hooks directory (if needed)
- [ ] Create custom hook(s)
- [ ] Write tests for hooks
- [ ] Verify utilities work independently
- [ ] Ensure no side effects

### Phase 4: Implementation - Component Refactoring
- [ ] Update component props interface
- [ ] Remove business logic from component
- [ ] Remove validation from component
- [ ] Remove hardcoded values
- [ ] Remove visibility logic
- [ ] Make props required (remove ?)
- [ ] Simplify component code
- [ ] Verify component still renders

### Phase 5: Implementation - Parent Updates
- [ ] Create/update parent wrapper
- [ ] Add data processing logic
- [ ] Add loading state handling
- [ ] Add error state handling
- [ ] Add data availability checks
- [ ] Import and use utilities/hooks
- [ ] Pass pre-processed data to component
- [ ] Test parent component

### Phase 6: Testing & Validation
- [ ] All utility tests pass
- [ ] All hook tests pass
- [ ] All component tests pass (happy path)
- [ ] All parent tests pass
- [ ] Storybook stories render
- [ ] TypeScript compiles without errors
- [ ] No ESLint warnings
- [ ] No runtime errors in console

### Phase 7: Documentation & Cleanup
- [ ] Update component documentation
- [ ] Update prop descriptions (JSDoc)
- [ ] Create/update Storybook stories
- [ ] Add examples for common patterns
- [ ] Document breaking changes
- [ ] Update README if applicable
- [ ] Review code for cleanup
- [ ] Remove old comments

### Phase 8: Review & Merge
- [ ] Code review (self-check)
- [ ] Peer review (if applicable)
- [ ] Check merge conflicts
- [ ] Final test run
- [ ] Update changelog
- [ ] Merge to main branch
- [ ] Document lessons learned

---

## Common Pitfalls & Solutions

### Pitfall 1: Leaving Validation in Component

❌ **Bad:**
```typescript
const Component = ({ data }: { data?: Data }) => {
  if (!data) return <Error />  // Still validating in component
  return <div>{data.value}</div>
}
```

✅ **Good:**
```typescript
// Type guarantees data exists
const Component = ({ data }: { data: Data }) => {
  return <div>{data.value}</div>
}

// Parent ensures data exists
const Parent = () => {
  if (!data) return <EmptyState />
  return <Component data={data} />
}
```

---

### Pitfall 2: Mixing Patterns

❌ **Bad:**
```typescript
const Component = ({ items, maxVisible = 5 }) => {
  // Visibility logic mixed with display logic
  const filtered = items.filter(i => i.amount > 0)
  const displayed = filtered.slice(0, maxVisible)

  return displayed.map(item => <Item key={item.id} item={item} />)
}
```

✅ **Good:**
```typescript
// Pure function handles visibility
const visibleItems = items.filter(i => i.amount > 0)
const displayedItems = limitItems(visibleItems, 5)

// Component just renders
<Component items={displayedItems} />
```

---

### Pitfall 3: Forgetting Memoization

❌ **Bad:**
```typescript
// Will recalculate every render
const sorted = [...items].sort((a, b) => a.priority - b.priority)
return <Component items={sorted} />
```

✅ **Good:**
```typescript
// Memoized - only recalculates when items change
const sorted = useMemo(
  () => [...items].sort((a, b) => a.priority - b.priority),
  [items]
)
return <Component items={sorted} />
```

---

### Pitfall 4: Making Utility Functions Impure

❌ **Bad:**
```typescript
// Has side effects - not pure
let lastId = 0
export const processItems = (items) => {
  lastId = items.length  // Side effect!
  return items.map(i => ({ ...i, id: ++lastId }))
}
```

✅ **Good:**
```typescript
// Pure function - same input always gives same output
export const processItems = (items) => {
  return items.map((i, idx) => ({ ...i, id: idx + 1 }))
}
```

---

### Pitfall 5: Optional Props With Required Data

❌ **Bad:**
```typescript
// Says it's optional, but component needs it
const Component = ({ required }: { required?: Data }) => {
  // Assumes it exists
  return <div>{required.value}</div>  // Will crash if undefined
}
```

✅ **Good:**
```typescript
// TypeScript reflects reality
const Component = ({ required }: { required: Data }) => {
  return <div>{required.value}</div>  // Type-safe
}
```

---

## Quick Reference Tables

### When to Use Each Pattern

| Scenario | Pattern | Location |
|----------|---------|----------|
| Parent filters list | Visibility Pattern 2 | Parent component |
| Component can't be shown | Visibility Pattern 1 | Parent `{condition && <Component />}` |
| Many conditions to check | Visibility Pattern 3 | Extract to filter function |
| Component reused differently | Visibility Pattern 4 | Pass `isVisible` prop |
| Sort/slice/map array | Pure function | `stories/utils/` |
| Calculate initial state | Custom hook | `stories/hooks/` |
| Check required props | TypeScript types | Component interface |
| Handle missing data | Parent validation | Parent component |
| Unexpected errors | Error Boundary | ConfigurationErrorBoundary |

### File Organization Template

```
src/stories/<ComponentName>/
├── hooks/
│   ├── __tests__/
│   │   └── useYourHook.test.ts
│   └── useYourHook.ts
├── utils/
│   ├── __tests__/
│   │   └── yourUtility.test.ts
│   └── yourUtility.ts
├── types.ts (optional)
├── <ComponentName>.stories.tsx
└── README.md (optional)
```

---

## Performance Checklist

- [ ] Using useMemo for expensive calculations
- [ ] Dependency arrays are correct
- [ ] Not creating functions in loop
- [ ] Not creating objects in render unnecessarily
- [ ] Filtering before mapping (not after)
- [ ] Lazy loading components if needed
- [ ] Pagination for large lists

---

## Next Steps

1. **Pick a component** to refactor
2. **Follow the 6-step process** above
3. **Use the checklist** to ensure completeness
4. **Test thoroughly** at each layer
5. **Document your changes** for the team
6. **Share learnings** in team discussion

---

## See Also

- [VISIBILITY_PATTERN.md](./VISIBILITY_PATTERN.md) - Pattern reference
- [VALIDATION_PATTERN.md](./VALIDATION_PATTERN.md) - Error handling patterns
- [BestPracticesExample.stories.tsx](./BestPracticesExample.stories.tsx) - Complete working example
- [ConfigurationErrorBoundary.tsx](../components/ConfigurationErrorBoundary.tsx) - Error boundary component
