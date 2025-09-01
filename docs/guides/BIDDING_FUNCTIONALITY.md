# Bidding Functionality Documentation

## Overview

This document provides comprehensive instructions for re-enabling bidding functionality in the ABS (Advanced Booking System) application. The bidding feature allows users to make price offers for room upgrades instead of accepting fixed prices.

**Current Status:** DISABLED (as of August 29, 2025)  
**Reason for Disabling:** Bidding functionality was temporarily disabled to simplify the booking experience while maintaining all other features.

---

## Architecture Overview

### Core Components Involved in Bidding

1. **Store Layer**: `src/stores/bookingStore.ts`
2. **UI Components**: 
   - `src/components/ABS_RoomSelectionCarousel/RoomCard.tsx`
   - `src/components/ABS_RoomSelectionCarousel/PriceSlider.tsx`
   - `src/components/ABS_PricingSummaryPanel/components/BidUpgradesSection.tsx`
3. **Business Logic**: 
   - `src/hooks/useBidUpgrade.ts`
   - `src/utils/orderGenerator.ts`
4. **Type Definitions**: 
   - `src/components/ABS_RoomSelectionCarousel/types.ts`
   - `src/types/shared.ts`

---

## Changes Made to Disable Bidding

### 1. Store Configuration (`src/stores/bookingStore.ts`)

```typescript
// CHANGED: Added bidding feature flag (currently disabled)
export interface BookingState {
  // Feature flags
  biddingEnabled: boolean  // ← ADDED
  // ... other properties
}

// CHANGED: Set bidding disabled in initial state
const initialState: BookingState = {
  mode: 'single',
  rooms: [],
  activeRoomId: null,
  biddingEnabled: false,  // ← SET TO FALSE
  // ... other properties
}

// CHANGED: Added validation to prevent bid items when disabled
addItemToRoom: (roomId, itemData) => set((state) => {
  // Prevent adding bid items if bidding is disabled
  if (itemData.type === 'bid' && !state.biddingEnabled) {
    console.warn('Bidding is disabled, cannot add bid item')
    return
  }
  // ... rest of method
}),

// ADDED: New method to filter out bid items when disabled
getFilteredPricingItems: () => {
  const { rooms, biddingEnabled } = get()
  const allItems = rooms.flatMap(room => room.items)
  
  if (!biddingEnabled) {
    return allItems.filter(item => item.type !== 'bid')
  }
  
  return allItems
},
```

### 2. UI Components

#### RoomCard Component (`src/components/ABS_RoomSelectionCarousel/RoomCard.tsx`)

```typescript
// CHANGED: Added conditional rendering around PriceSlider
{/* Price Slider - integrated within the card (only show if bidding is enabled) */}
{showPriceSlider && (
  <div className={clsx(/* slider container styles */)}>
    <PriceSlider
      // ... all slider props
    />
  </div>
)}
```

#### Main Landing Component (`src/components/ABS_Landing/ABS_Landing.tsx`)

```typescript
// CHANGED: Disabled price slider
<RoomSelectionSection
  // ... other props
  showPriceSlider={false}  // ← CHANGED FROM true
  // ... rest of props
/>
```

#### Room Selection Carousel (`src/components/ABS_RoomSelectionCarousel/index.tsx`)

```typescript
// CHANGED: Default value set to false
const RoomSelectionCarousel: React.FC<RoomSelectionCarouselProps> = (props) => {
  const {
    // ... other props
    showPriceSlider = false,  // ← CHANGED FROM true
    // ... rest of destructuring
  } = props
```

### 3. Pricing Summary Panel

#### Main Panel (`src/components/ABS_PricingSummaryPanel/index.tsx`)

```typescript
// REMOVED: BidUpgradesSection import and usage
// import BidUpgradesSection from './components/BidUpgradesSection'  // ← REMOVED

// REMOVED: bidForUpgradeItems from memoized filtering
const { 
  chooseYourSuperiorRoomItems, 
  customizeYourRoomItems, 
  chooseYourRoomItems, 
  enhanceYourStayItems,
  // bidForUpgradeItems,  // ← REMOVED
  isEmpty 
} = useMemo(() => {
  const safeItems = items || []
  return {
    chooseYourSuperiorRoomItems: safeItems.filter((item) => item.concept === 'choose-your-superior-room'),
    customizeYourRoomItems: safeItems.filter((item) => item.concept === 'customize-your-room'),
    chooseYourRoomItems: safeItems.filter((item) => item.concept === 'choose-your-room'),
    enhanceYourStayItems: safeItems.filter((item) => item.concept === 'enhance-your-stay'),
    // bidForUpgradeItems: safeItems.filter((item) => item.concept === 'bid-for-upgrade'),  // ← REMOVED
    isEmpty: safeItems.length === 0,
  }
}, [items])

// REMOVED: BidUpgradesSection component usage
// <BidUpgradesSection
//   bidForUpgradeItems={bidForUpgradeItems}
//   euroSuffix={labels.euroSuffix}
//   onRemoveItem={handleRemoveItem}
// />
```

#### Components Export (`src/components/ABS_PricingSummaryPanel/components/index.ts`)

```typescript
// REMOVED: BidUpgradesSection exports
// export { default as BidUpgradesSection } from './BidUpgradesSection'  // ← REMOVED
// export type { BidUpgradesSectionProps } from './BidUpgradesSection'  // ← REMOVED
```

#### Room Content Component (`src/components/ABS_PricingSummaryPanel/components/RoomContent.tsx`)

```typescript
// REMOVED: bidForUpgradeItems filtering and rendering
// const bidForUpgradeItems = room.items.filter((item) => item.concept === 'bid-for-upgrade')  // ← REMOVED

// REMOVED: Bid for Upgrade Section
// <ItemsSection
//   title="Bid for Upgrade"
//   items={bidForUpgradeItems}
//   euroSuffix={labels.euroSuffix}
//   removingItems={removingItems}
//   roomId={room.id}
//   onRemoveItemMulti={onRemoveItem}
// />
```

#### Section Configuration Hook (`src/components/ABS_PricingSummaryPanel/hooks/useSectionConfiguration.ts`)

```typescript
// REMOVED: bidForUpgradeItems from interface and hook
export interface SectionConfigurationProps {
  chooseYourSuperiorRoomItems: PricingItem[]
  customizeYourRoomItems: PricingItem[]
  chooseYourRoomItems: PricingItem[]
  enhanceYourStayItems: PricingItem[]
  // bidForUpgradeItems: PricingItem[]  // ← REMOVED
}

export const useSectionConfiguration = ({
  chooseYourSuperiorRoomItems,
  customizeYourRoomItems,
  chooseYourRoomItems,
  enhanceYourStayItems,
  // bidForUpgradeItems,  // ← REMOVED
}: SectionConfigurationProps): SectionConfig[] => {
  return useMemo(() => {
    const configurations: SectionConfig[] = [
      {
        id: 'room-selection',
        title: chooseYourSuperiorRoomItems.length > 0 ? 'Superior Room Selection' : 'Room Selection',
        items: [...chooseYourRoomItems, ...chooseYourSuperiorRoomItems],
        shouldRender: chooseYourRoomItems.length > 0 || chooseYourSuperiorRoomItems.length > 0,
        className: "bg-gray-50 rounded-lg p-3 mb-4",
        ariaLabelledBy: "room-section-title"
      },
      // REMOVED: bid-upgrades configuration
      // {
      //   id: 'bid-upgrades',
      //   title: 'Bid for Upgrades',
      //   items: bidForUpgradeItems,
      //   shouldRender: bidForUpgradeItems.length > 0,
      //   className: "bg-gray-50 rounded-lg p-3 mb-4",
      //   ariaLabelledBy: "bid-section-title"
      // },
      {
        id: 'room-customization',
        title: 'Room Customization',
        items: customizeYourRoomItems,
        shouldRender: customizeYourRoomItems.length > 0,
        className: "bg-gray-50 rounded-lg p-3 mb-4"
      },
      {
        id: 'stay-enhancement',
        title: 'Stay Enhancement',
        items: enhanceYourStayItems,
        shouldRender: enhanceYourStayItems.length > 0,
        className: "bg-gray-50 rounded-lg p-3 mb-4"
      }
    ]

    return configurations
  }, [
    chooseYourSuperiorRoomItems,
    customizeYourRoomItems,
    chooseYourRoomItems,
    enhanceYourStayItems,
    // bidForUpgradeItems,  // ← REMOVED
  ])
}
```

---

## How to Re-Enable Bidding Functionality

### Step 1: Update Store Configuration

**File:** `src/stores/bookingStore.ts`

```typescript
// CHANGE: Enable bidding in initial state
const initialState: BookingState = {
  mode: 'single',
  rooms: [],
  activeRoomId: null,
  biddingEnabled: true,  // ← CHANGE TO true
  showMobilePricing: false,
  bookingStatus: 'normal',
  isMobilePricingOverlayOpen: false,
  roomSpecificSelections: {},
  lastUpdate: new Date(),
  optimisticUpdates: new Set(),
  toastQueue: [],
}
```

### Step 2: Re-enable Price Sliders in UI Components

**File:** `src/components/ABS_Landing/ABS_Landing.tsx`

```typescript
// CHANGE: Enable price slider
<RoomSelectionSection
  // ... other props
  showPriceSlider={true}  // ← CHANGE TO true
  // ... rest of props
/>
```

**File:** `src/components/ABS_RoomSelectionCarousel/index.tsx`

```typescript
// CHANGE: Default value back to true
const RoomSelectionCarousel: React.FC<RoomSelectionCarouselProps> = (props) => {
  const {
    // ... other props
    showPriceSlider = true,  // ← CHANGE TO true
    // ... rest of destructuring
  } = props
```

### Step 3: Restore BidUpgradesSection Components

**File:** `src/components/ABS_PricingSummaryPanel/index.tsx`

```typescript
// RESTORE: BidUpgradesSection import
import BidUpgradesSection from './components/BidUpgradesSection'

// RESTORE: bidForUpgradeItems in memoized filtering
const { 
  chooseYourSuperiorRoomItems, 
  customizeYourRoomItems, 
  chooseYourRoomItems, 
  enhanceYourStayItems,
  bidForUpgradeItems,  // ← RESTORE
  isEmpty 
} = useMemo(() => {
  const safeItems = items || []
  return {
    chooseYourSuperiorRoomItems: safeItems.filter((item) => item.concept === 'choose-your-superior-room'),
    customizeYourRoomItems: safeItems.filter((item) => item.concept === 'customize-your-room'),
    chooseYourRoomItems: safeItems.filter((item) => item.concept === 'choose-your-room'),
    enhanceYourStayItems: safeItems.filter((item) => item.concept === 'enhance-your-stay'),
    bidForUpgradeItems: safeItems.filter((item) => item.concept === 'bid-for-upgrade'),  // ← RESTORE
    isEmpty: safeItems.length === 0,
  }
}, [items])

// RESTORE: Add BidUpgradesSection component back to render
{/* Bid Upgrades Section */}
<BidUpgradesSection
  bidForUpgradeItems={bidForUpgradeItems}
  euroSuffix={labels.euroSuffix}
  onRemoveItem={handleRemoveItem}
/>
```

**File:** `src/components/ABS_PricingSummaryPanel/components/index.ts`

```typescript
// RESTORE: BidUpgradesSection exports
export { default as BidUpgradesSection } from './BidUpgradesSection'
export type { BidUpgradesSectionProps } from './BidUpgradesSection'
```

**File:** `src/components/ABS_PricingSummaryPanel/index.tsx` (exports section)

```typescript
// RESTORE: BidUpgradesSection in exports
export { 
  PricingSummaryHeader,
  RoomSection,
  BidUpgradesSection,  // ← RESTORE
  SectionRenderer
} from './components'

// RESTORE: BidUpgradesSectionProps in type exports
export type { 
  PricingSummaryHeaderProps,
  RoomSectionProps,
  BidUpgradesSectionProps,  // ← RESTORE
  SectionConfig,
  SectionRendererProps,
  SectionConfigurationProps
} from './components'
```

### Step 4: Restore Room Content Bidding Section

**File:** `src/components/ABS_PricingSummaryPanel/components/RoomContent.tsx`

```typescript
// RESTORE: bidForUpgradeItems filtering
const bidForUpgradeItems = room.items.filter((item) => item.concept === 'bid-for-upgrade')

// RESTORE: Bid for Upgrade Section in render
{/* Bid for Upgrade Section */}
<ItemsSection
  title="Bid for Upgrade"
  items={bidForUpgradeItems}
  euroSuffix={labels.euroSuffix}
  removingItems={removingItems}
  roomId={room.id}
  onRemoveItemMulti={onRemoveItem}
/>
```

### Step 5: Restore Section Configuration Hook

**File:** `src/components/ABS_PricingSummaryPanel/hooks/useSectionConfiguration.ts`

```typescript
// RESTORE: bidForUpgradeItems in interface
export interface SectionConfigurationProps {
  chooseYourSuperiorRoomItems: PricingItem[]
  customizeYourRoomItems: PricingItem[]
  chooseYourRoomItems: PricingItem[]
  enhanceYourStayItems: PricingItem[]
  bidForUpgradeItems: PricingItem[]  // ← RESTORE
}

// RESTORE: bidForUpgradeItems parameter
export const useSectionConfiguration = ({
  chooseYourSuperiorRoomItems,
  customizeYourRoomItems,
  chooseYourRoomItems,
  enhanceYourStayItems,
  bidForUpgradeItems,  // ← RESTORE
}: SectionConfigurationProps): SectionConfig[] => {
  return useMemo(() => {
    const configurations: SectionConfig[] = [
      {
        id: 'room-selection',
        title: chooseYourSuperiorRoomItems.length > 0 ? 'Superior Room Selection' : 'Room Selection',
        items: [...chooseYourRoomItems, ...chooseYourSuperiorRoomItems],
        shouldRender: chooseYourRoomItems.length > 0 || chooseYourSuperiorRoomItems.length > 0,
        className: "bg-gray-50 rounded-lg p-3 mb-4",
        ariaLabelledBy: "room-section-title"
      },
      // RESTORE: bid-upgrades configuration
      {
        id: 'bid-upgrades',
        title: 'Bid for Upgrades',
        items: bidForUpgradeItems,
        shouldRender: bidForUpgradeItems.length > 0,
        className: "bg-gray-50 rounded-lg p-3 mb-4",
        ariaLabelledBy: "bid-section-title"
      },
      {
        id: 'room-customization',
        title: 'Room Customization',
        items: customizeYourRoomItems,
        shouldRender: customizeYourRoomItems.length > 0,
        className: "bg-gray-50 rounded-lg p-3 mb-4"
      },
      {
        id: 'stay-enhancement',
        title: 'Stay Enhancement',
        items: enhanceYourStayItems,
        shouldRender: enhanceYourStayItems.length > 0,
        className: "bg-gray-50 rounded-lg p-3 mb-4"
      }
    ]

    return configurations
  }, [
    chooseYourSuperiorRoomItems,
    customizeYourRoomItems,
    chooseYourRoomItems,
    enhanceYourStayItems,
    bidForUpgradeItems,  // ← RESTORE
  ])
}
```

---

## Important Files Not Modified (Still Available)

The following components and utilities were **NOT modified** and are still available for bidding functionality:

### Core Bidding Components
- ✅ `src/components/ABS_RoomSelectionCarousel/PriceSlider.tsx` - Complete bidding slider UI
- ✅ `src/components/ABS_PricingSummaryPanel/components/BidUpgradesSection.tsx` - Bidding summary section
- ✅ `src/hooks/useBidUpgrade.ts` - Bidding state management hook

### Supporting Components
- ✅ `src/components/ABS_RoomSelectionCarousel/hooks/useSlider.ts` - Slider interaction logic
- ✅ `src/components/ABS_RoomSelectionCarousel/components/RoomBadges.tsx` - Bid status badges

### Business Logic
- ✅ `src/utils/orderGenerator.ts` - Order generation with bid support (has bid handling logic)
- ✅ `src/stores/bookingStore.ts` - All bid-related store methods are intact

### Type Definitions
- ✅ All bidding-related TypeScript interfaces and types are preserved

---

## Testing Checklist for Re-enabling

When re-enabling bidding functionality, test the following:

### UI Testing
- [ ] Price sliders appear on room upgrade cards
- [ ] "Propon tu precio" text displays correctly
- [ ] Bidding range indicators show min/max prices
- [ ] "Sujeto a disponibilidad" disclaimers appear
- [ ] Both fixed price and bidding buttons are available

### Functional Testing
- [ ] Price sliders are interactive and respond to user input
- [ ] Bid submission creates bid items in the store
- [ ] Pricing summary panel shows "Bid for Upgrades" section
- [ ] Bid items appear in pricing calculations
- [ ] Bid removal functionality works
- [ ] Bid status updates (pending, submitted, accepted, rejected)

### Integration Testing
- [ ] Store `biddingEnabled` flag controls UI visibility
- [ ] Store prevents bid items when flag is false
- [ ] Order generation handles bid items correctly
- [ ] Bid conflicts with room selections work properly

### End-to-End Testing
- [ ] Complete bidding flow from slider to order confirmation
- [ ] Bidding works in both single and multi-booking modes
- [ ] Mobile responsive design with bidding elements
- [ ] Error handling for failed bids

---

## Additional Considerations

### Performance
- The bidding functionality adds some computational overhead due to price calculations and state management
- Consider implementing lazy loading for bidding components if performance becomes an issue

### UX/UI Improvements
- Consider adding bid confirmation dialogs
- Implement bid history for users
- Add bid expiration timers
- Consider A/B testing fixed prices vs bidding to measure conversion rates

### Business Logic
- Define bid acceptance/rejection criteria
- Implement bid notification system
- Set up bid analytics and reporting
- Consider bid limits per user/session

### Security
- Validate bid ranges on server side
- Implement rate limiting for bid submissions
- Add bid audit logging
- Secure bid data transmission

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|---------|
| 1.0 | 2025-08-29 | Initial documentation - bidding functionality disabled | Claude Code |

---

## Contact

For questions about re-enabling bidding functionality, refer to:
- This documentation file
- Code comments in the affected components
- Git commit history for detailed change logs
- The original bidding implementation in the preserved components

**Note:** All original bidding components are preserved and functional. Re-enabling only requires configuration changes and restoring the removed UI integrations as documented above.