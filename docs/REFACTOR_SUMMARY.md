# SpecialOffers Component Refactoring Summary

## Objective
Move all data calculations and formatting OUT of UI components and into utility functions, following the architecture rule:

**✅ UI Layer SHOULD:**
- Receive pre-formatted display data
- Handle user interactions via callbacks
- Manage visual state (open/closed, hover, focus)
- Apply styling and layout
- Trigger provided callbacks

**❌ UI Layer SHOULD NOT:**
- Transform data structures
- Calculate or format values
- Sort, filter, or limit data
- Contain business rules

---

## Changes Made

### 1. ✅ Created Date Formatting Utilities
**File:** `src/components/upsell/SpecialOffers/utils/dateFormatting.ts`

#### `calculateAvailableDates(options)`
- **Purpose:** Pre-calculate all available dates with formatted labels
- **Moved from:** `SimpleListPicker.useMemo()`
- **Returns:** `AvailableDate[]` with key, label, and date objects
- **Handles:** Date range logic, filtering, formatting

#### `formatSelectedDates(selectedDates)`
- **Purpose:** Format selected dates for button display
- **Moved from:** `EnhancedDateSelector.formatSelectedDates()`
- **Returns:** Human-readable string ("Mon 15, Jan" or "3 dates selected")
- **Handles:** Different formatting based on count

---

### 2. ✅ Refactored SimpleListPicker
**File:** `src/components/upsell/SpecialOffers/components/SimpleListPicker.tsx`

**Before:**
- Calculated available dates using `useMemo()` with reservation date logic
- Formatted date labels ("Mon 15, Jan")
- 47 lines of business logic inside component

**After:**
- **Receives:** `availableDates: AvailableDate[]` (pre-calculated)
- **No calculation:** All date logic moved to utility function
- **Pure UI:** Only renders dates and handles user interactions
- Cleaner, simpler component

**Props Changed:**
```typescript
// REMOVED:
- reservationStartDate?: Date
- reservationEndDate?: Date
- maxDates?: number

// ADDED:
+ availableDates: AvailableDate[]  // Pre-calculated with labels
```

---

### 3. ✅ Refactored EnhancedDateSelector
**File:** `src/components/upsell/SpecialOffers/components/EnhancedDateSelector.tsx`

**Before:**
- Calculated available dates
- Formatted selected dates for display
- Made decisions about display format

**After:**
- **Receives:** `formattedSelectedDates: string` (pre-formatted)
- **Receives:** `availableDates: AvailableDate[]` (pre-calculated)
- **Pure UI:** Only renders popover and manages open/close state
- No formatting or calculation logic

**Props Changed:**
```typescript
// REMOVED:
- reservationStartDate?: Date
- reservationEndDate?: Date
- formatSelectedDates() method

// ADDED:
+ formattedSelectedDates: string    // Pre-formatted for display
+ availableDates: AvailableDate[]   // Pre-calculated with labels
```

---

### 4. ✅ Updated OfferPriceDisplay
**File:** `src/components/upsell/SpecialOffers/components/OfferPriceDisplay.tsx`

**Now Acts As:** Business Logic Layer (between UI and parent)

**Responsibilities:**
- Imports and uses `calculateAvailableDates()` and `formatSelectedDates()`
- Calculates dates once using `useMemo()`
- Formats selected dates for display
- Passes pre-calculated data to child UI components

**Example:**
```typescript
// Calculate available dates once
const availableDates = useMemo(() => {
  return calculateAvailableDates({
    reservationStartDate,
    reservationEndDate,
    maxDates: maxDateSelections,
  })
}, [reservationStartDate, reservationEndDate, maxDateSelections])

// Format selected dates for display
const formattedSelectedDates = formatSelectedDates(
  selectedDates || (selectedDate ? [selectedDate] : [])
)

// Pass pre-calculated data to EnhancedDateSelector
<EnhancedDateSelector
  formattedSelectedDates={formattedSelectedDates}
  availableDates={availableDates}
  // ... other props
/>
```

---

### 5. ✅ Updated OfferCard
**File:** `src/components/upsell/SpecialOffers/components/OfferCard.tsx`

**No changes needed** - Already pure UI, just passes props to OfferPriceDisplay

---

### 6. ✅ Added to Translation Types
**File:** `src/components/upsell/SpecialOffers/types.ts`

Added to `OfferLabels` interface:
- `selectDatesLabel`
- `selectDatesTooltip`
- `noAvailableDatesLabel`
- `clearDatesLabel`
- `selectAllDatesLabel`
- `confirmDatesLabel`
- `whatsIncludedLabel`

---

### 7. ✅ Updated Translation Files
**Files:** `src/i18n/locales/en.json`, `src/i18n/locales/es.json`

Added complete translations for all new labels in both English and Spanish

---

### 8. ✅ Updated Translation Hook
**File:** `src/i18n/translations.ts`

Updated `useABSTranslations()` to include all new label keys

---

### 9. ✅ Updated Story Defaults
**File:** `src/stories/SpecialOffers/utils/labels.ts`

Added default values for all new labels used in Storybook

---

## Component Hierarchy (After Refactoring)

```
OfferCard (Pure UI)
  └─ OfferPriceDisplay (Business Logic Layer)
      ├─ calculateAvailableDates()  ← Utility function
      ├─ formatSelectedDates()      ← Utility function
      └─ EnhancedDateSelector (Pure UI)
          └─ SimpleListPicker (Pure UI)
              └─ (Receives pre-calculated availableDates)
```

---

## Benefits

✅ **Separation of Concerns** - UI components don't calculate or format data
✅ **Testability** - Date logic can be tested independently via utility functions
✅ **Reusability** - Formatting utilities can be used elsewhere
✅ **Performance** - Date calculations memoized at component level
✅ **Maintainability** - Clear responsibility for each layer
✅ **TypeSafety** - `AvailableDate` interface ensures correct data shape
✅ **Compliance** - Follows project architecture rules

---

## Data Flow Example

**Parent passes:**
```typescript
reservationStartDate={new Date('2025-01-01')}
reservationEndDate={new Date('2025-01-31')}
selectedDates={[new Date('2025-01-15')]}
```

**OfferPriceDisplay calculates:**
```typescript
availableDates = [
  { key: '2025-01-01', label: 'Wed 1, Jan', date: Date },
  { key: '2025-01-02', label: 'Thu 2, Jan', date: Date },
  // ... more dates
]
formattedSelectedDates = 'Jan 15'
```

**Passes to EnhancedDateSelector:**
```typescript
<EnhancedDateSelector
  formattedSelectedDates="Jan 15"
  availableDates={[...]} // Pre-calculated
/>
```

**EnhancedDateSelector passes to SimpleListPicker:**
```typescript
<SimpleListPicker
  availableDates={[...]} // Pre-calculated
  selectedDates={new Set(['2025-01-15'])}
/>
```

**SimpleListPicker renders pure UI:**
- Lists dates from `availableDates`
- Renders checkboxes from `selectedDates` Set
- Handles clicks via callbacks
- Uses labels from `labels` prop

---

## Files Modified

1. ✅ `src/components/upsell/SpecialOffers/utils/dateFormatting.ts` (NEW)
2. ✅ `src/components/upsell/SpecialOffers/types.ts`
3. ✅ `src/components/upsell/SpecialOffers/components/SimpleListPicker.tsx`
4. ✅ `src/components/upsell/SpecialOffers/components/EnhancedDateSelector.tsx`
5. ✅ `src/components/upsell/SpecialOffers/components/OfferPriceDisplay.tsx`
6. ✅ `src/components/upsell/SpecialOffers/components/OfferCard.tsx`
7. ✅ `src/i18n/locales/en.json`
8. ✅ `src/i18n/locales/es.json`
9. ✅ `src/i18n/translations.ts`
10. ✅ `src/stories/SpecialOffers/utils/labels.ts`

---

## Testing Notes

- Stories should work without changes (OfferPriceDisplay handles the calculation internally)
- Date formatting utilities can be unit tested independently
- Component props are now more clearly defined and type-safe
- All UI components are now pure presentation components
