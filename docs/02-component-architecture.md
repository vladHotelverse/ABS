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

**State Management** (Updated Implementation):
```typescript
// Unified Zustand store with performance optimization
const {
  rooms,
  activeRoomId,
  mode,
  addRoom,
  setActiveRoom,
  addItemToRoom,
  removeItemFromRoom,
  getRoomTotal,
  getTotalPrice
} = useBookingStore()

// Performance-optimized hook for high-frequency operations
const {
  addItemOptimistically,
  switchRoomOptimistically,
  performanceMetrics
} = useOptimizedBooking()

// Specialized hooks for specific features
const {
  sectionConfiguration,
  updateSectionVisibility
} = useSectionConfiguration()

const {
  formatCurrency,
  formatPriceWithCurrency
} = useCurrencyFormatter({ currency: 'EUR', locale: 'en-US' })
```

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

### 2. Custom Hooks for State Logic
```typescript
// Encapsulate complex state logic
const useBookingState = () => {
  const [selectedRooms, setSelectedRooms] = useState([])
  const [selectedCustomizations, setSelectedCustomizations] = useState({})
  
  const updateRoomSelection = useCallback((room: RoomOption) => {
    // Complex selection logic
  }, [])
  
  const getTotalPrice = useCallback(() => {
    // Price calculation logic
  }, [selectedRooms, selectedCustomizations])
  
  return { selectedRooms, selectedCustomizations, updateRoomSelection, getTotalPrice }
}
```

### 3. Context for Global State
```typescript
// Authentication context
const AuthContext = createContext<AuthState | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
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