# UI Layer Logic Removal - Remaining Tasks

This document tracks the remaining business logic violations that need to be removed from the UI layer. These were identified in the comprehensive audit but not yet addressed in the current branch.

---

## High Priority Tasks

### 1. PricingSummaryPanel - Accordion State Initialization Logic
**File:** `upsell/PricingSummaryPanel/MultiBookingPricingSummaryPanel.tsx:87-98`

**Issue:**
```typescript
const [internalActiveRooms, setInternalActiveRooms] = React.useState<string[]>(() => {
  // ❌ Business logic: Only open rooms that have items selected
  const roomsWithItems = rooms.filter((room) =>
    room.sections.some((section) => section.items.length > 0)
  )

  if (exclusiveAccordion) {
    // ❌ More business logic: exclusive mode rules
    return roomsWithItems.length > 0 ? [roomsWithItems[0].id] : []
  }
  return roomsWithItems.map((r) => r.id)
})
```

**Why Wrong:**
- UI component determines which accordions should be open based on data
- Business rule: "open rooms with items" belongs in app layer
- Exclusive mode logic is a business rule

**Solution:**
```typescript
// ✅ App layer computes initial state
const initialActiveRooms = useMemo(() => {
  const roomsWithItems = rooms
    .filter(room => room.sections.some(s => s.items.length > 0))
    .map(r => r.id)

  if (exclusiveAccordion && roomsWithItems.length > 0) {
    return [roomsWithItems[0]]
  }
  return roomsWithItems
}, [rooms, exclusiveAccordion])

// ✅ UI just receives the value
<MultiBookingPricingSummaryPanel
  initialActiveRooms={initialActiveRooms}
  // ... other props
/>
```

**Effort:** 2-3 hours
**Priority:** High
**Affected Apps:** upsell-app

---

### 2. AttributesCategories - Sorting Logic
**File:** `upsell/RoomCustomization/components/AttributesCategories.tsx:68-70`

**Issue:**
```typescript
// ❌ Sorting by exclusivityRatio is business logic
const sortedAttributes = [...category.attributes].sort(
  (a, b) => (a.exclusivityRatio ?? 0) - (b.exclusivityRatio ?? 0)
)
```

**Why Wrong:**
- Sorting by `exclusivityRatio` is a prioritization business rule
- UI should receive pre-sorted data
- Sorting happens on every render (performance issue)

**Solution:**
```typescript
// ✅ App layer sorts before passing to UI
interface Category {
  id: number
  name: string
  description?: string
  attributes: Attribute[]  // Already sorted by app layer
}

// In app layer:
const sortedCategories = categories.map(category => ({
  ...category,
  attributes: [...category.attributes].sort(
    (a, b) => (a.exclusivityRatio ?? 0) - (b.exclusivityRatio ?? 0)
  )
}))
```

**Effort:** 1-2 hours
**Priority:** High
**Affected Apps:** upsell-app

---

### 3. AttributesCategories - Display Item Limiting Logic
**File:** `upsell/RoomCustomization/components/AttributesCategories.tsx:71-76`

**Issue:**
```typescript
// ❌ Hardcoded business rule: 4 items threshold
const hasAccordion = category.attributes.length > 4

// ❌ Responsive business rules in UI
const initialItemsCount = breakpoint === '2xl' ? 3 : breakpoint === 'mobile' ? 1 : 2
const displayAttributes = showAll ? sortedAttributes : sortedAttributes.slice(0, initialItemsCount)
```

**Why Wrong:**
- The "4 items threshold" is a hardcoded business rule
- Responsive item counts are business decisions
- UI structure changes based on data characteristics

**Solution:**
```typescript
// ✅ Option 1: Configuration-driven
interface AttributesCategoriesProps {
  categories: Category[]
  config: {
    accordionThreshold: number  // e.g., 4
    initialVisibleCount: {
      mobile: number
      tablet: number
      desktop: number
    }
  }
}

// ✅ Option 2: Always use consistent UI pattern
// Don't change rendering strategy based on item count
// Always show accordion for consistency
```

**Effort:** 3-4 hours
**Priority:** Medium
**Affected Apps:** upsell-app

---

### 4. BookingsSummarySection - Price Breakdown Filtering
**File:** `upsell/ViewCards/BookingsSummarySection.tsx:28`

**Issue:**
```typescript
// ❌ Hardcoded limit: show only 5 extras
{extras.slice(0, 5).map((extra) => (
  <div key={extra.id}>...</div>
))}
{extras.length > 5 && (
  <p>{t('booking.view.andMore', { count: extras.length - 5 })}</p>
)}
```

**Why Wrong:**
- The "show only 5 extras" rule is business logic
- UI shouldn't decide data visibility limits
- Makes it harder to change business rules

**Solution:**
```typescript
// ✅ App layer provides processed data
interface BookingsSummarySectionProps {
  extras: {
    visible: PriceSummaryItem[]    // Already limited
    hiddenCount: number             // Pre-calculated
  }
}

// Component just renders
{extras.visible.map(extra => ...)}
{extras.hiddenCount > 0 && <p>+{extras.hiddenCount} more</p>}
```

**Effort:** 1-2 hours
**Priority:** Medium
**Affected Apps:** upsell-app

---

## Medium Priority Tasks

### 5. HtmlToTextParser - HTML Parsing Logic
**File:** `upsell/HtmlToTextParser.tsx:28-35`

**Issue:**
```typescript
// ❌ HTML parsing in UI component
const parsedContent = React.useMemo(() => {
  if (!isMounted) return htmlContent

  try {
    return parse(htmlContent)  // Parsing + sanitization should happen earlier
  } catch (error) {
    console.error('Error parsing HTML content:', error)
    return htmlContent
  }
}, [htmlContent, isMounted])
```

**Why Wrong:**
- HTML parsing and sanitization should happen in app/data layer
- Security concerns (XSS) should be handled before data reaches UI
- Hydration workaround indicates architectural issue

**Solution:**
```typescript
// ✅ Option 1: Receive sanitized React nodes
interface Props {
  content: React.ReactNode  // Pre-parsed by app layer
}

// ✅ Option 2: Use sanitized HTML string
interface Props {
  sanitizedHtml: string  // Already validated and safe
}
function Component({ sanitizedHtml }: Props) {
  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
}

// App layer sanitization (using DOMPurify):
import DOMPurify from 'isomorphic-dompurify'

const sanitizedHtml = useMemo(() =>
  DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em'],
    ALLOWED_ATTR: []
  }),
  [rawHtml]
)
```

**Effort:** 2-3 hours
**Priority:** Medium (Security concern)
**Affected Apps:** upsell-app

---

### 6. ServicePriceDisplay - Visibility Logic
**File:** `upsell/ServicePriceDisplay/index.tsx:13-14`

**Issue:**
```typescript
// ❌ Business rule: don't show if amount <= 0
if (servicePrice.amount <= 0) return null
```

**Why Wrong:**
- The rule "don't show if amount <= 0" is business logic
- UI shouldn't make visibility decisions based on data values
- Should be handled by parent

**Solution:**
```typescript
// ✅ Parent decides whether to render
const ServiceDisplay = () => {
  const servicePrice = useServicePrice()

  // App logic decides visibility
  if (!servicePrice.shouldDisplay) {
    return null
  }

  return <ServicePriceDisplay price={servicePrice} />
}

// Or use conditional rendering
{servicePrice.shouldDisplay && (
  <ServicePriceDisplay price={servicePrice} />
)}
```

**Effort:** 1 hour
**Priority:** Low
**Affected Apps:** upsell-app

---

### 7. PricingSummaryPanel - Error Boundary Logic
**File:** `upsell/PricingSummaryPanel/MultiBookingPricingSummaryPanel.tsx:108-115`

**Issue:**
```typescript
// ❌ Runtime validation in component
if (!labels) {
  console.error('PureMultiBookingPricingSummaryPanel: labels prop is required')
  return (
    <div className="rounded-lg border border-destructive...">
      <h3>Configuration Error</h3>
      <p>Missing required labels configuration...</p>
    </div>
  )
}
```

**Why Wrong:**
- Runtime validation should be in app layer or use TypeScript
- Error UI rendering mixed with validation
- Should use proper error boundaries

**Solution:**
```typescript
// ✅ Type safety enforces at compile time
interface Props {
  labels: UILabels  // TypeScript enforces this is required
}

// ✅ App layer wraps with error boundary
<ErrorBoundary
  fallback={<ConfigurationError message="Missing labels" />}
>
  <PricingPanel labels={labels} />
</ErrorBoundary>
```

**Effort:** 1-2 hours
**Priority:** Low
**Affected Apps:** upsell-app

---

## Summary Statistics

| Priority | Count | Estimated Effort |
|----------|-------|-----------------|
| High     | 4     | 9-13 hours      |
| Medium   | 2     | 3-5 hours       |
| Low      | 2     | 2-3 hours       |
| **Total**| **8** | **14-21 hours** |

---

## Implementation Strategy

### Phase 1: High Priority (Next Sprint)
1. PricingSummaryPanel accordion state
2. AttributesCategories sorting
3. AttributesCategories display limits
4. BookingsSummarySection filtering

### Phase 2: Medium Priority
5. HtmlToTextParser (Security)
6. ServicePriceDisplay visibility

### Phase 3: Low Priority (Technical Debt)
7. PricingSummaryPanel error boundary

---

## Principles to Follow

When refactoring, ensure:

✅ **UI Layer SHOULD:**
- Receive pre-formatted display data
- Handle user interactions via callbacks
- Manage visual state (open/closed, hover, focus)
- Apply styling and layout
- Trigger provided callbacks

❌ **UI Layer SHOULD NOT:**
- Transform data structures
- Calculate or format values
- Sort, filter, or limit data
- Contain business rules (thresholds, limits, conditions)
- Make decisions based on data characteristics
- Manage complex orchestration

---

## Related Documentation

- UI Component Guidelines: `/docs/ui-component-guidelines.md` (to be created)
- ViewModel Pattern: `/docs/viewmodel-pattern.md` (to be created)

---

## Notes

- Each task should be done in a separate branch
- Update this document as tasks are completed
- Add tests for app layer logic after extraction
- Document breaking changes in CHANGELOG.md
