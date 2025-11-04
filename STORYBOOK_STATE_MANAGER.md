a---
  Storybook State Management Guide

  Overview

  This document explains how to replicate the state management and synchronization patterns from the upsell-app in Storybook for component
  development and testing.

  Current Architecture in Upsell-App

  Cart Store (Zustand)

  Location: apps/upsell-app/src/app/stores/cart-store.ts

  The app uses a Zustand store with:
  - Optimistic updates for instant UI feedback
  - Per-booking granularity for multi-room scenarios
  - Server reconciliation to replace temporary IDs with real ones
  - Complex validation for attribute combinations

  Data Transformation Layer

  Location: apps/upsell-app/src/app/[locale]/(booking)/components/cart/hooks/usePricingSummaryPanel.ts

  The usePricingSummaryPanel hook:
  - Subscribes to cart store updates
  - Transforms raw cart data into pre-formatted display data
  - Builds sections (Upgrade, Customization) from cart items
  - Formats prices, dates, and guest information
  - Provides handlers for add/remove/confirm actions

  Component Integration

  - AttributeCard: Wrapper component that connects to cart store
  - AttributesCategories: Transforms pricing data into categories
  - MultiBookingPricingSummaryPanel: Pure UI receiving pre-formatted data

  Storybook Best Practices (Research Summary)

  Official Patterns

  1. Decorators (Recommended for global state)
  const preview: Preview = {
    decorators: [
      (Story) => (
        <ContextProvider>
          <Story />
        </ContextProvider>
      ),
    ],
  };
  2. useArgs Hook (For Controls panel sync)
  const [{ value }, updateArgs] = useArgs();
  3. Local State in Render (Simplest approach)
  render: (args) => {
    const [state, setState] = useState(initial);
    return <Component {...args} state={state} />;
  }

  Zustand in Storybook

  - No provider needed - Hooks work directly
  - Reset between stories - Use decorators with useEffect
  - Consider context-based stores for story isolation

  Recommended Implementation Plan

  Approach: Hybrid Pattern

  Use story-level wrapper components with React Context (no Zustand dependency for Storybook).

  Architecture

  Story Wrapper Component
    ↓
  CartStoryContext.Provider
    ↓
    ├─→ useStorybookCart (state + handlers)
    ├─→ cartTransformers (data formatting)
    └─→ Shared context value
         ↓
         ├─→ AttributesCategories (consumer)
         └─→ MultiBookingPricingSummaryPanel (consumer)

  Files to Create

  1. packages/ui/src/stories/hooks/useStorybookCart.ts

  interface UseStorybookCartOptions {
    initialItems?: CartItem[];
    onStateChange?: (state: CartState) => void;
  }

  interface UseStorybookCartReturn {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (itemId: string) => void;
    toggleItem: (item: CartItem) => void;
    reset: () => void;
    isLoading: Record<string, boolean>;
  }

  export const useStorybookCart = (options: UseStorybookCartOptions): UseStorybookCartReturn

  Features:
  - Basic add/remove/toggle operations
  - Simulated async loading states
  - No complex validation (simplified for stories)
  - State change callbacks for actions addon

  2. packages/ui/src/stories/helpers/cartTransformers.ts

  // Transform cart items to MultiBookingPricingSummaryPanel format
  export const transformItemsToRooms = (
    items: CartItem[],
    bookings: BookingInfo[],
    config: TransformConfig
  ) => Room[]

  // Group items into sections (Upgrade, Customization)
  export const buildSections = (
    items: CartItem[],
    sectionConfig: SectionConfig
  ) => CartSection[]

  // Calculate totals
  export const calculateTotals = (
    items: CartItem[],
    currency: string,
    locale: string
  ) => { perRoom: Record<string, string>, overall: string }

  Purpose: Mirror usePricingSummaryPanel transformation logic for Storybook

  3. packages/ui/src/stories/contexts/CartStoryContext.tsx

  interface CartStoryContextValue {
    items: CartItem[];
    rooms: Room[];
    sections: Record<string, CartSection[]>;
    formattedTotals: {
      perRoom: Record<string, string>;
      overall: string;
    };
    toggleItem: (item: CartItem) => void;
    removeItem: (roomId: string, itemId: string) => void;
    reset: () => void;
    isLoading: Record<string, boolean>;
  }

  export const CartStoryProvider: React.FC<CartStoryProviderProps>
  export const useCartStory = () => CartStoryContextValue

  Features:
  - Combines useStorybookCart + cartTransformers
  - Provides ready-to-use data for all components
  - Single source of truth within one story

  4. packages/ui/src/stories/components/RoomCustomizationStoryWrapper.tsx

  interface RoomCustomizationStoryWrapperProps {
    initialItems?: CartItem[];
    bookings: BookingInfo[];
    attributeCategories: AttributeCategory[];
    labels: UILabels;
    onStateChange?: (state: CartState) => void;
  }

  export const RoomCustomizationStoryWrapper: React.FC<RoomCustomizationStoryWrapperProps>

  Purpose: Render AttributesCategories + MultiBookingPricingSummaryPanel with shared state

  5. packages/ui/src/stories/RoomCustomizationWithSync.stories.tsx

  export const SideBySide: Story = {
    render: (args) => (
      <RoomCustomizationStoryWrapper
        initialItems={[]}
        bookings={mockBookings}
        attributeCategories={mockAttributes}
        labels={uiLabels}
      />
    ),
  };

  export const MultipleRooms: Story = { ... };
  export const PrefilledCart: Story = { ... };

  Files to Update

  packages/ui/src/stories/helpers/pricingStoryHelpers.tsx

  Problem: Contains phantom imports that don't exist
  // ❌ Remove these
  import {
    useCartManagement,    // Doesn't exist
    usePricingLogic,      // Doesn't exist
    PurePricingSummaryPanel,  // Doesn't exist
    HOTEL_CART_CONFIG,    // Doesn't exist
  } from '../../components/upsell/PricingSummaryPanel'

  // ✅ Replace with
  import { useStorybookCart } from '../hooks/useStorybookCart'
  import { transformItemsToRooms, buildSections } from './cartTransformers'

  packages/ui/src/stories/PricingSummaryPanel.stories.tsx

  - Update to use new utilities
  - Keep existing multi-booking stories working
  - Fix single-booking stories that reference phantom components

  Mock Data Structure

  packages/ui/src/stories/data/bookingsMockData.ts

  export const mockBookings: BookingInfo[] = [
    {
      id: 'booking-1',
      bookingKey: 'booking-1',
      roomTypeCode: 'DLX',
      firstName: 'John',
      lastName: 'Smith',
      checkIn: '2024-12-15',
      checkOut: '2024-12-18',
      nights: 3,
      guests: 2,
    },
  ];

  packages/ui/src/stories/data/attributesMockData.ts

  export const mockAttributeCategories: AttributeCategory[] = [
    {
      id: '1',
      name: 'Room Views',
      description: 'Choose your preferred view',
      order: 1,
      attributes: [
        {
          id: '101',
          name: 'Ocean View',
          amount: 25.00,
          exclusivityRatio: 0.3,
          icon: '/icons/ocean.svg',
          description: 'Stunning ocean views',
        },
      ],
    },
  ];

  Data Transformation Examples

  Input (Raw Cart Data)

  cartBookings: {
    "booking-123": {
      roomUpgrade: {
        itemId: "item-456",
        upgradeRoomTypeId: 789,
        itemName: "Deluxe Suite Upgrade",
        amount: 120.50
      },
      roomAttributes: {
        "101": {
          itemId: "item-789",
          attributeId: 101,
          itemName: "Ocean View",
          amount: 25.00
        }
      }
    }
  }

  Output (Pre-formatted for UI)

  rooms: [{
    id: "booking-123",
    displayName: "Deluxe Suite",
    guestName: "John Smith",
    formattedNights: "3 nights",
    formattedTotal: "€145.50",
    sections: [
      {
        title: "Choose Your Superior Room",
        type: SectionType.Upgrade,
        items: [{
          id: "item-456",
          name: "Deluxe Suite Upgrade",
          formattedPrice: "€120.50"
        }]
      },
      {
        title: "Customize Your Room",
        type: SectionType.Customization,
        items: [{
          id: "item-789",
          name: "Ocean View",
          formattedPrice: "€25.00"
        }]
      }
    ]
  }]

  Handler Signatures

  MultiBookingPricingSummaryPanel

  onRemoveItem?: (roomId: string, itemId: string, itemName: string) => void
  onConfirm?: () => void

  AttributeCard

  onToggle?: () => void
  isSelected: boolean
  disabled?: boolean

  Usage Example

  // In a story
  export const InteractiveBooking: Story = {
    render: () => {
      return (
        <CartStoryProvider
          initialItems={[]}
          bookings={mockBookings}
          config={{ currency: 'EUR', locale: 'en-US' }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h2>Select Attributes</h2>
              <AttributesCategories
                categories={mockAttributeCategories}
                renderAttributeCard={(attribute) => {
                  const { items, toggleItem } = useCartStory();
                  const isSelected = items.some(i => i.id === attribute.id);

                  return (
                    <AttributeCard
                      attribute={attribute}
                      isSelected={isSelected}
                      onToggle={() => toggleItem(attribute)}
                    />
                  );
                }}
              />
            </div>

            <div>
              <h2>Cart Summary</h2>
              <PricingSummaryPanelConnected />
            </div>
          </div>
        </CartStoryProvider>
      );
    },
  };

  Key Decisions

  ✅ What We Include

  - Local React state (useState) - No Zustand for Storybook
  - React Context for cross-component sharing
  - Basic add/remove operations
  - Pre-formatted data transformation
  - Simulated loading states

  ❌ What We Exclude

  - Complex attribute combination validation
  - Server actions and optimistic updates
  - Real API calls
  - Temporary ID reconciliation
  - canSelectAttributeByBookingKeyAndAttributeId logic

  Why This Approach?

  1. Simplicity - No external state management dependencies
  2. Isolation - State resets between stories automatically
  3. Familiar - Follows existing PricingStoryComponent pattern
  4. Flexible - Easy to extend with more features later
  5. Official - Uses recommended Storybook patterns

  Testing in Storybook

  Visual Testing Checklist

  - Click AttributeCard → PricingSummary updates
  - Remove from PricingSummary → AttributeCard deselects
  - Totals recalculate correctly
  - Multiple rooms work independently
  - Loading states display properly
  - Reset button clears all state

  Playwright Integration

  // Take screenshots of synchronized state
  await page.goto('http://localhost:6006/?path=/story/...');
  await page.click('[data-testid="attribute-card-101"]');
  await page.screenshot({ path: 'attribute-selected.png' });

  Migration Guide

  For Existing Stories

  1. Replace phantom imports with new utilities
  2. Update story render functions to use RoomCustomizationStoryWrapper
  3. Convert raw item arrays to use transformItemsToRooms
  4. Test that all interactive features still work

  For New Stories

  1. Import CartStoryProvider or RoomCustomizationStoryWrapper
  2. Provide initial cart items and bookings
  3. Use useCartStory() hook in child components
  4. Follow the examples in RoomCustomizationWithSync.stories.tsx

  Future Enhancements

  Potential Additions

  - Zustand integration if needed across many stories
  - Global decorator for cart context if heavily reused
  - Advanced validation with mock pricing combinations
  - Storybook addon for cart state inspection
  - URL state persistence using parameters

  When to Add Zustand

  Consider adding Zustand if:
  - 10+ stories need cart state
  - Complex cross-story scenarios
  - Need to test store interactions directly
  - Want to share state patterns with app code

  ---
  References

  - https://storybook.js.org/docs/react/writing-stories/decorators
  - https://docs.pmnd.rs/zustand/guides/testing
  - https://dpurdy.me
  - Internal: apps/upsell-app/src/app/stores/cart-store.ts
  - Internal: packages/ui/src/stories/helpers/pricingStoryHelpers.tsx

  ---
  Document Status: Implementation PlanLast Updated: 2025-11-04Author: System AnalysisRelated Issues: Storybook state synchronization for
  PricingSummary + Attributes

  ---