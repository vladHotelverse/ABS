# PricingSummaryPanel Stories - Updated Architecture

The PricingSummaryPanel stories have been updated to reflect the new clean architecture with separated business logic and improved reusability.

## Story Structure

### 1. **Legacy Stories** (`PricingSummaryPanel/Legacy`)
Backward compatible stories using the original component with business logic included.
- `LegacyDefault` - Basic functionality with mixed items
- `LegacyEmpty` - Empty state
- `LegacyLoading` - Loading state

### 2. **Pure Component Stories** (`PricingSummaryPanel/Pure`)
New architecture stories using the pure UI component with configurable business logic.
- `Default` - Standard hotel configuration
- `Empty` - Empty state with pure component
- `FullyLoaded` - All item types included
- `Loading` - Loading state
- `EnglishVersion` - English labels and USD currency
- `UpsellConfiguration` - Demonstrates upsell-app configuration
- `MultiBookingScenario` - Multiple bookings
- `OnlyRoomUpgrades` - Single item type scenarios
- `OnlyCustomizations` - Single item type scenarios
- `OnlySpecialOffers` - Single item type scenarios
- `WithLongNames` - Text truncation testing

### 3. **Multi-Booking Stories** (Legacy)
Stories for the multi-booking component variant with embedded business logic.
- `MultiBookingDefault` - Mixed items across rooms
- `MultiBookingLoading` - Loading state
- `MultiBookingEmpty` - Empty rooms
- `MultiBookingFullyLoaded` - Maximum items

### 4. **Pure Multi-Booking Stories** (New Architecture)
Pure UI component stories demonstrating custom business logic integration.
- `PureMultiBookingCustomUpsell` - Custom upsell services with different section titles and pricing
- `PureMultiBookingEmpty` - Empty state with custom labels
- `PureMultiBookingWithBookingInfo` - Multi-booking with booking header information
- `PureMultiBookingLoading` - Loading state demonstration

## Key Improvements

### ✅ **Eliminated Code Duplication**
- Created `helpers/pricingStoryHelpers.tsx` with shared utilities
- Reusable components and configuration presets
- Common action handlers and mock data transformations

### ✅ **Clean Architecture Integration**
- `PricingStoryComponent` demonstrates pure single-booking component usage
- `PureMultiBookingPricingSummaryPanel` demonstrates pure multi-booking UI
- Configurable business logic via `sectionConfig` and `cartConfig`
- Complete separation of concerns between UI and business logic

### ✅ **Enhanced Configurability**
- Pre-built configurations for hotel and upsell contexts
- Easy currency and locale switching
- Flexible item type and section organization

### ✅ **Better Developer Experience**
- Clear story categorization (Legacy vs Pure)
- Interactive controls for currency, locale, and loading states
- Comprehensive test scenarios for edge cases

## Usage Examples

### Single Booking - Hotel Configuration (Default)
```typescript
// Using hotel-specific business logic
args: createStoryArgs({
  items: hotelItems,
  ...AppConfigurations.hotel,
  onItemRemove: storyActions.onItemRemove,
  onConfirm: storyActions.onConfirm,
})
```

### Single Booking - Upsell Configuration
```typescript
// Using upsell-specific business logic
args: createStoryArgs({
  items: upsellItems,
  ...AppConfigurations.upsell,
  onItemRemove: storyActions.onItemRemove,
  onConfirm: storyActions.onConfirm,
})
```

### Multi-Booking - Pure Component (Custom Business Logic)
```typescript
// Using pure multi-booking component with custom data
<PureMultiBookingPricingSummaryPanel
  rooms={[
    {
      id: 'room-101',
      name: 'Executive Suite',
      guestName: 'John Smith',
      total: '$299.99',
      sections: [
        {
          title: 'Premium Services',
          items: [
            {
              id: 'concierge',
              name: '24/7 Concierge Service',
              price: '$75.00',
              removable: true,
            }
          ]
        }
      ]
    }
  ]}
  overallTotal="$299.99"
  labels={customUILabels}
  onRemoveItem={(roomId, itemId) => handleCustomRemoval(roomId, itemId)}
  onConfirm={() => handleCustomConfirm()}
/>
```

### Custom Single Booking Configuration
```typescript
// Using custom business logic for single booking
args: createStoryArgs({
  items: customItems,
  sectionConfig: CUSTOM_SECTION_CONFIG,
  cartConfig: CUSTOM_CART_CONFIG,
  labels: customLabels,
})
```

## Shared Utilities

### `pricingStoryHelpers.tsx`
- **PricingStoryComponent**: Wrapper component with business logic
- **convertBookingsToDisplay**: Transform legacy booking data
- **createUILabels**: Factory for UI label configurations
- **AppConfigurations**: Pre-built app-specific settings
- **storyActions**: Common action handlers

### Benefits
- **Consistency**: All stories use the same utilities
- **Maintainability**: Single source of truth for configurations
- **Reusability**: Easy to create new story variants
- **Type Safety**: Full TypeScript support

## Migration Notes

### For Existing Stories
- Legacy stories maintain backward compatibility
- New pure stories demonstrate clean architecture
- Both can coexist during migration period

### For New Stories
- **Single Booking**: Use `PricingStoryComponent` for pure component stories with business logic
- **Multi-Booking**: Use `PureMultiBookingPricingSummaryPanel` directly for custom business logic demonstrations
- Leverage `AppConfigurations` for quick setup of single booking stories
- Import utilities from `helpers/pricingStoryHelpers`

## Component Portability

### Single Booking
- ✅ **Pure UI**: `PurePricingSummaryPanel` - Accepts pre-calculated sections and pricing
- ✅ **Business Logic Integration**: Via configurable services and hooks
- ✅ **App Flexibility**: Hotel vs Upsell configurations available

### Multi-Booking
- ✅ **Pure UI**: `PureMultiBookingPricingSummaryPanel` - Accepts pre-formatted room data
- ✅ **Complete Flexibility**: Any business logic can format data for the pure component
- ✅ **Room-Based Organization**: Items grouped by room with custom sections

This updated architecture provides a solid foundation for testing both legacy components (for backward compatibility) and new pure component architecture (for maximum portability across different apps).