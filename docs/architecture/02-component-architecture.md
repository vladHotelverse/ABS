# Component Architecture

## 🏗️ Architecture Overview

The ABS system follows a modular component architecture with clear separation of concerns, reusable UI components, and predictable data flow patterns.

## 📦 Component Hierarchy

```
App.tsx (Root)
├── BrowserRouter
│   ├── Home Component (/)
│   │   └── ABSLanding
│   │       ├── BookingInfoBar
│   │       ├── ABS_Header
│   │       ├── RoomSelectionSection
│   │       ├── CustomizationSection
│   │       ├── SpecialOffersSection
│   │       ├── BookingStateSection
│   │       └── PricingSummaryPanel
│   ├── OrderStatusPage (/order/:id)
│   │   ├── OrderAccessForm
│   │   └── ABS_OrderStatus
│   └── NewOrderStatusPage (/new-order/:id)
│       └── ABS_OrderStatus
```

## 🧩 Core Components

### 1. ABS_Landing Component
**Location**: `src/components/ABS_Landing/`
**Purpose**: Main booking interface container

**Key Features**:
- Orchestrates the complete booking flow
- Manages booking state across sections
- Handles data conversion from Supabase
- Responsive layout management

**Sub-components**:
- `BookingStateSection`: Current booking status display
- `RoomSelectionSection`: Room browsing and selection
- `CustomizationSection`: Room upgrade options
- `SpecialOffersSection`: Dynamic offers display
- `RoomSelectionMapSection`: Interactive room maps

**State Management** (Unified Zustand Architecture - August 2025):
```typescript
// Single unified store for all booking operations
const useBookingStore = create<BookingState>()(
  immer((set, get) => ({
    // State
    mode: 'single',
    rooms: [],
    activeRoomId: null,
    biddingEnabled: false, // System-wide bidding control
    showMobilePricing: false,
    bookingStatus: 'normal',
    performanceMetrics: {},
    
    // Actions with optimistic updates
    addItemToRoom: (roomId, itemData) => set((state) => {
      if (itemData.type === 'bid' && !state.biddingEnabled) {
        console.warn('Bidding is disabled')
        return
      }
      const room = state.rooms.find(r => r.id === roomId)
      if (room) {
        room.items.push(createBookingItem(itemData))
      }
    }),
    
    // Business rule validation
    handleRoomUpgrade: (roomId, newRoom) => set((state) => {
      const room = state.rooms.find(r => r.id === roomId)
      if (room) {
        // Remove conflicting items automatically
        room.items = room.items.filter(item => 
          !hasConflict(item.type, 'room-upgrade')
        )
        room.items.push(createRoomUpgradeItem(newRoom))
        room.baseRoom = newRoom
      }
    }),
    
    // Performance monitoring
    trackPerformance: (operation, duration) => set((state) => {
      state.performanceMetrics[operation] = duration
    })
  }))
)

// Usage in components - selective subscriptions
const currentRoom = useBookingStore(state => 
  state.rooms.find(r => r.id === state.activeRoomId),
  shallow
)
const roomCount = useBookingStore(state => state.rooms.length)
const totalPrice = useBookingStore(state => state.getTotalPrice())

// Utility hooks (maintained)
const { formatCurrency } = useCurrencyFormatter({ currency: 'EUR', locale: 'en-US' })
const { sectionConfiguration } = useSectionConfiguration()
```

**Key Architecture Changes**:
- **Single Source of Truth**: All booking state in one unified Zustand store
- **Optimistic Updates**: Immediate UI feedback with automatic error rollback
- **Business Rules Integration**: Conflict resolution built into store actions
- **Performance Monitoring**: Real-time performance tracking and optimization
- **Bidding Control**: System-wide feature flag with conditional rendering

### 2. ABS_OrderStatus Component
**Location**: `src/components/ABS_OrderStatus/`
**Purpose**: Order tracking and management interface

**Key Features**:
- Real-time order status updates
- Hotel proposal comparisons
- Order modification capabilities
- Multi-language order details

**Sub-components**:
- `OrderHeader`: Order ID and status display
- `HotelProposalsSection`: Available proposals
- `ProposalWidget`: Individual proposal display
- `SelectedRoomDisplay`: Current room selection
- `SpecialOffersDisplay`: Applied offers
- `CustomizationsDisplay`: Room upgrades

### 3. ABS_RoomCustomization Component
**Location**: `src/components/ABS_RoomCustomization/`
**Purpose**: Room upgrade and customization interface

**Key Features**:
- Dynamic customization categories
- Compatibility rule enforcement
- Visual option previews
- Price impact calculations

**Categories**:
- Bed configurations
- Room views and locations
- Floor preferences
- Special amenities

**Compatibility System**:
```typescript
interface CompatibilityRules {
  mutuallyExclusive: string[][]  // Options that can't be selected together
  conflicts: ConflictRule[]      // Complex conflict rules
}
```

### 4. ABS_SpecialOffers Component
**Location**: `src/components/ABS_SpecialOffers/`
**Purpose**: Dynamic special offers management

**Key Features**:
- Date-sensitive offers
- Person/night/stay pricing models
- Quantity controls
- Dynamic pricing calculations

**Offer Types**:
- Per-person offers (spa, activities)
- Per-night offers (room upgrades)
- Per-stay offers (packages)
- Date-specific promotions

### 5. ABS_PricingSummaryPanel Component (Refactored)
**Location**: `src/components/ABS_PricingSummaryPanel/`
**Purpose**: Shopping cart and pricing display with enhanced multi-booking support

**Key Features**:
- **Multi-room pricing summaries** with collapsible sections
- **Section-based rendering** with configurable visibility
- **Performance optimizations** with React.memo and shallow comparison
- **Enhanced component composition** with dedicated sub-components
- **Improved accessibility** with ARIA labels and keyboard navigation

**New Component Structure**:
```
ABS_PricingSummaryPanel/
├── components/
│   ├── BidUpgradesSection.tsx      # Bid upgrade items display
│   ├── PricingSummaryHeader.tsx    # Header with room context
│   ├── SectionRenderer.tsx         # Generic section renderer
│   ├── PriceBreakdown.tsx          # Enhanced price calculations
│   ├── RoomSection.tsx             # Individual room pricing
│   └── index.ts                    # Component exports
├── hooks/
│   ├── useSectionConfiguration.ts  # Section visibility management
│   └── index.ts                    # Hook exports
├── examples/                       # Usage examples
└── MultiBookingPricingSummaryPanel.tsx # Main component
```

**Updated BookingItem Interface**:
```typescript
export interface BookingItem {
  id: string
  name: string
  price: number
  type: 'room' | 'customization' | 'offer' | 'bid'
  concept?: 'choose-your-superior-room' | 'customize-your-room' | 'enhance-your-stay' | 'choose-your-room' | 'bid-for-upgrade'
  category?: string
  roomId: string              // New: Room association
  metadata?: Record<string, unknown>
  addedAt: Date              // New: Timestamp tracking
}

export interface RoomBooking {
  id: string
  roomName: string
  roomNumber: string
  guestName: string
  nights: number
  items: BookingItem[]
  baseRoom?: RoomOption
  isActive: boolean
  payAtHotel: boolean        // Multi-booking compatibility
  roomImage?: string         // Visual enhancements
}
```

### 6. ABS_RoomSelectionCarousel Component
**Location**: `src/components/ABS_RoomSelectionCarousel/`
**Purpose**: Interactive room browsing interface

**Key Features**:
- Touch-enabled carousel navigation
- Room image galleries
- Amenity displays
- Price comparisons
- Multi-room layouts (1-3 rooms)

## 🎯 UI Component System

### Base Components (`src/components/ui/`)
Built on Radix UI primitives with Tailwind CSS styling:

| Component | Purpose | Key Features |
|-----------|---------|--------------|
| `button` | Interactive buttons | Variants, sizes, loading states |
| `card` | Content containers | Header, content, footer sections |
| `dialog` | Modal dialogs | Accessible, keyboard navigation |
| `input` | Form inputs | Validation states, icons |
| `select` | Dropdown selectors | Search, multiple selection |
| `tabs` | Tab navigation | Horizontal/vertical orientations |
| `tooltip` | Help tooltips | Positioning, animations |
| `slider` | Range controls | Price filtering, quantity selection |
| `calendar` | Date selection | Booking dates, offer periods |

### Custom Components
- `segment-badge`: Customer segment indicators  
- `dialogHeadless`: Unstyled dialog base
- `skeleton`: Enhanced loading state placeholders with animation variants
- `sonner`: Toast notification system for user feedback

### Shared Components (`src/components/shared/`)
**New shared component library for reusable UI patterns:**

- **Currency formatters**: Consistent price display across components
- **Loading states**: Standardized skeleton loaders and spinners  
- **Form components**: Enhanced form inputs with validation
- **Layout primitives**: Flexible containers and spacing utilities

## 🚨 Recent Architectural Updates (August 2025)

### State Management Migration
The ABS system has undergone a major architectural migration from dual hook systems to a unified Zustand store:

**Before (Legacy Architecture)**:
- Separate `useBookingState` and `useMultiBookingState` hooks
- Manual state synchronization between components
- Performance issues with multiple state systems

**After (Current Architecture)**:
- Single `useBookingStore` with unified room-based state model
- Automatic business rule validation and conflict resolution
- Optimistic updates with rollback capabilities
- Real-time performance monitoring

### Bidding System Status
The bidding functionality has been temporarily disabled across the entire system:
- **UI Components**: PriceSlider components conditionally rendered based on `biddingEnabled` flag
- **Store Logic**: Bid items rejected at store level with warning messages
- **Component Props**: `showPriceSlider={false}` throughout component tree
- **Future Re-enabling**: Complete restoration guide available in `BIDDING_FUNCTIONALITY.md`

### Performance Enhancements
- **Selective Subscriptions**: Components only re-render when relevant data changes
- **Shallow Comparison**: `useShallow` prevents unnecessary re-renders on object references
- **Optimistic Updates**: Immediate UI feedback with background validation
- **Real-time Monitoring**: Performance metrics collection for operations <50ms target

## 🔄 Data Flow Patterns

### 1. Props Down, Events Up
```typescript
// Parent component passes data down
<RoomCustomization
  options={customizationOptions}
  selectedOptions={selectedCustomizations}
  compatibilityRules={rules}
  onSelectionChange={handleCustomizationChange}
/>

// Child component emits events up
const handleOptionSelect = (optionId: string) => {
  onSelectionChange(optionId, !isSelected)
}
```

### 2. Zustand Store for State Logic (Current Architecture)
```typescript
// Unified state management with Zustand
const useBookingStore = create<BookingState>()(
  subscribeWithSelector(
    immer((set, get) => ({
      // State
      mode: 'single',
      rooms: [],
      activeRoomId: null,
      biddingEnabled: false,
      
      // Actions with automatic business rule validation
      updateRoomSelection: (roomId: string, room: RoomOption) => set((state) => {
        const targetRoom = state.rooms.find(r => r.id === roomId)
        if (targetRoom) {
          // Business rule: Remove conflicting room upgrades
          targetRoom.items = targetRoom.items.filter(item => 
            !hasConflict(item.type, 'room-upgrade')
          )
          targetRoom.baseRoom = room
          targetRoom.items.push(createRoomUpgradeItem(room))
        }
      }),
      
      getTotalPrice: () => {
        const state = get()
        return state.rooms.reduce((total, room) => {
          return total + room.items.reduce((roomTotal, item) => {
            return roomTotal + calculateItemPrice(item, room.nights)
          }, 0)
        }, 0)
      }
    }))
  )
)

// Component usage with selective subscriptions
const MyComponent = () => {
  const totalPrice = useBookingStore(state => state.getTotalPrice())
  const updateRoom = useBookingStore(state => state.updateRoomSelection)
  
  // Only re-renders when totalPrice changes
  return <div>Total: €{totalPrice}</div>
}
```

### 3. Legacy Context for Specialized State (Auth & Content)
```typescript
// Authentication context (maintained for auth-specific logic)
const AuthContext = createContext<AuthState | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

// Supabase content hooks (maintained for database operations)
const useSupabaseContent = (tableName: string) => {
  // Database-specific logic remains in specialized hooks
}
```

## 📱 Responsive Design Strategy

### Breakpoint System
- **Mobile**: 0-767px (primary focus)
- **Tablet**: 768-1023px
- **Desktop**: 1024px+

### Component Adaptations
```typescript
// Mobile-first component variants
const PricingSummaryPanel = ({ isMobile }: { isMobile: boolean }) => {
  if (isMobile) {
    return <MobilePricingWidget />
  }
  return <DesktopPricingPanel />
}

// Responsive hooks
const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkDevice = () => setIsMobile(window.innerWidth < 768)
    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])
  
  return { isMobile }
}
```

## 🧪 Component Testing Strategy

### Unit Testing
- Component rendering tests
- Event handler testing
- State management verification
- Props validation

### Integration Testing
- Component interaction flows
- Data flow between components
- Error boundary testing
- Accessibility compliance

### Visual Testing
- Component visual regression
- Responsive design validation
- Cross-browser compatibility
- Loading state appearance

## 🔧 Component Development Guidelines

### 1. Component Structure
```typescript
// Standard component structure
interface ComponentProps {
  // Props interface
}

export const Component: React.FC<ComponentProps> = ({ 
  prop1, 
  prop2,
  ...props 
}) => {
  // Hooks
  // State
  // Effects
  // Handlers
  // Render
}

export default Component
```

### 2. TypeScript Best Practices
- Define clear prop interfaces
- Use generic types where appropriate
- Leverage discriminated unions for variants
- Export types for component consumers

### 3. Performance Optimization (Enhanced)
- **Zustand with shallow comparison**: `useShallow` prevents unnecessary re-renders
- **Optimistic updates**: Immediate UI feedback with background validation
- **React.memo with custom comparison**: Strategic memoization for expensive components
- **Performance monitoring**: Real-time metrics for room switching (<50ms target)
- **Debounced operations**: Rate-limited state updates for rapid user interactions
- **Lazy loading**: Code splitting for non-critical components
- **Bundle optimization**: Tree shaking and selective imports

### 4. Accessibility Standards
- Semantic HTML structure
- ARIA attributes where needed
- Keyboard navigation support
- Screen reader compatibility
- Focus management

## 🎨 Styling Approach

### Tailwind CSS Patterns
```typescript
// Consistent spacing scale
const spacing = {
  xs: 'p-2',    // 8px
  sm: 'p-4',    // 16px
  md: 'p-6',    // 24px
  lg: 'p-8',    // 32px
  xl: 'p-12'    // 48px
}

// Color system
const colors = {
  primary: 'bg-blue-600 text-white',
  secondary: 'bg-gray-200 text-gray-900',
  accent: 'bg-amber-500 text-white',
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white'
}
```

### Component Variants
```typescript
// Using class-variance-authority
const buttonVariants = cva('button-base', {
  variants: {
    variant: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
      outline: 'border border-gray-300 bg-transparent hover:bg-gray-50'
    },
    size: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    }
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md'
  }
})
```