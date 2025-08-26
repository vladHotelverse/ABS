# Development Guide

## 🚀 Getting Started

### Prerequisites
- **Node.js**: 18.0.0 or higher
- **pnpm**: 8.0.0 or higher (preferred package manager)
- **Git**: For version control
- **Supabase Account**: For database integration

### Initial Setup

#### 1. Clone and Install
```bash
# Clone the repository
git clone [repository-url]
cd ABS

# Install dependencies
pnpm install
```

#### 2. Environment Configuration
```bash
# Create environment file
cp .env.example .env.local

# Add your Supabase credentials
echo "VITE_SUPABASE_URL=your_supabase_project_url" >> .env.local
echo "VITE_SUPABASE_ANON_KEY=your_supabase_anon_key" >> .env.local
```

#### 3. Database Setup
```bash
# Apply database migrations (in Supabase dashboard SQL editor)
# Run migration files in order:
# 1. supabase/migrations/001_create_translations_schema.sql
# 2. supabase/migrations/002_seed_translations_data_fixed.sql
# ... (continue with remaining migrations)
```

#### 4. Start Development Server
```bash
# Start the development server
pnpm dev

# Server will start at http://localhost:5173
```

## 🛠️ Development Workflow

### Daily Development Process

#### 1. Start Development Environment
```bash
# Pull latest changes
git pull origin main

# Install new dependencies (if any)
pnpm install

# Start development server
pnpm dev
```

#### 2. Code Quality Checks
```bash
# Run linter
pnpm lint

# Run type checker
pnpm build  # TypeScript compilation check
```

#### 3. Testing (when implemented)
```bash
# Run unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run E2E tests
pnpm test:e2e
```

## 📁 Project Structure Deep Dive

### Component Organization
```
src/components/
├── ABS_Landing/                    # Main booking interface
│   ├── ABS_Landing.tsx            # Main component
│   ├── hooks/                     # Landing-specific hooks
│   ├── sections/                  # Section components
│   ├── types.ts                   # Component types
│   ├── utils/                     # Utility functions
│   └── mockData.ts               # Development data
│
├── ABS_RoomCustomization/         # Room upgrade interface
│   ├── index.tsx                  # Main component
│   ├── components/                # Sub-components
│   ├── hooks/                     # Customization hooks
│   ├── types.ts                   # Customization types
│   ├── compatibilityRules.ts     # Business logic
│   └── utils/                     # Helper functions
│
└── ui/                            # Reusable UI components
    ├── button.tsx                 # Button variants
    ├── card.tsx                   # Card layouts
    ├── dialog.tsx                 # Modal dialogs
    └── ...                        # Other UI primitives
```

### Hook Organization
```
src/hooks/
├── useAuth.ts                     # Authentication logic
├── useBidUpgrade.ts              # Bid upgrade functionality
├── useSupabaseContent.ts         # Content fetching
└── ...                           # Domain-specific hooks
```

### Utility Organization
```
src/utils/
├── bookingIdGenerator.ts         # Order ID generation
├── createSampleData.ts          # Mock data creation
├── orderGenerator.ts            # Order creation logic
└── supabaseDataConverter.ts     # Data transformation
```

## 🎨 Styling Guidelines

### Tailwind CSS Patterns

#### Component Styling Structure
```typescript
// Consistent class organization
const Component = () => (
  <div className={clsx(
    // Layout classes first
    'flex items-center justify-between',
    // Spacing classes
    'p-4 mb-6',
    // Appearance classes
    'bg-white border border-gray-200 rounded-lg shadow-sm',
    // Interactive states
    'hover:shadow-md transition-shadow duration-200',
    // Responsive classes last
    'md:p-6 lg:mb-8'
  )}>
    Content
  </div>
)
```

#### Design Token Usage
```typescript
// Consistent spacing scale
const SPACING = {
  xs: 'p-2',    // 8px
  sm: 'p-4',    // 16px
  md: 'p-6',    // 24px
  lg: 'p-8',    // 32px
  xl: 'p-12'    // 48px
}

// Color system
const COLORS = {
  primary: 'bg-blue-600 text-white',
  secondary: 'bg-gray-200 text-gray-900',
  accent: 'bg-amber-500 text-white',
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white'
}
```

### Component Variant Patterns
```typescript
// Using class-variance-authority for consistent variants
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground'
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)
```

## 🔧 Component Development Standards

### Component Template
```typescript
import clsx from 'clsx'
import type React from 'react'

// Define props interface
interface ComponentProps {
  className?: string
  children?: React.ReactNode
  // ... other props
}

// Main component
export const Component: React.FC<ComponentProps> = ({
  className,
  children,
  ...props
}) => {
  // Hooks (in order of complexity)
  const [state, setState] = useState(initialState)
  const customHook = useCustomHook()
  
  // Event handlers
  const handleEvent = useCallback((event: Event) => {
    // Handler logic
  }, [dependencies])
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies])
  
  // Render helpers (if complex)
  const renderSubComponent = () => (
    <div>Sub component</div>
  )
  
  // Main render
  return (
    <div className={clsx('base-classes', className)} {...props}>
      {children}
      {renderSubComponent()}
    </div>
  )
}

// Default export
export default Component
```

### TypeScript Best Practices

#### Prop Interface Design
```typescript
// Use descriptive and specific types
interface RoomCardProps {
  room: RoomOption                    // Domain-specific types
  isSelected: boolean                 // Clear boolean props
  onSelect: (roomId: string) => void  // Specific event handlers
  className?: string                  // Optional styling
  children?: React.ReactNode          // Optional children
}

// Use union types for variants
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost'
  size: 'sm' | 'md' | 'lg'
  disabled?: boolean
}
```

#### Custom Hook Patterns
```typescript
// Clear return object pattern
export const useBookingState = () => {
  const [selectedRooms, setSelectedRooms] = useState<RoomOption[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  
  const addRoom = useCallback((room: RoomOption) => {
    setSelectedRooms(prev => [...prev, room])
  }, [])
  
  const removeRoom = useCallback((roomId: string) => {
    setSelectedRooms(prev => prev.filter(room => room.id !== roomId))
  }, [])
  
  const getTotalPrice = useCallback(() => {
    return selectedRooms.reduce((sum, room) => sum + room.price, 0)
  }, [selectedRooms])
  
  // Clear return interface
  return {
    // State
    selectedRooms,
    totalPrice,
    // Actions
    addRoom,
    removeRoom,
    // Computed values
    getTotalPrice,
  } as const  // Maintain type inference
}
```

## 🧪 Testing Strategy (Future Implementation)

### Unit Testing Approach
```typescript
// Component testing pattern
import { render, screen, fireEvent } from '@testing-library/react'
import { RoomCard } from './RoomCard'

const mockRoom = {
  id: 'deluxe-1',
  title: 'Deluxe Ocean View',
  price: 250,
  // ... other properties
}

describe('RoomCard', () => {
  test('renders room information correctly', () => {
    render(
      <RoomCard 
        room={mockRoom}
        isSelected={false}
        onSelect={jest.fn()}
      />
    )
    
    expect(screen.getByText('Deluxe Ocean View')).toBeInTheDocument()
    expect(screen.getByText('€250')).toBeInTheDocument()
  })
  
  test('calls onSelect when clicked', () => {
    const mockOnSelect = jest.fn()
    
    render(
      <RoomCard 
        room={mockRoom}
        isSelected={false}
        onSelect={mockOnSelect}
      />
    )
    
    fireEvent.click(screen.getByText('Select'))
    expect(mockOnSelect).toHaveBeenCalledWith('deluxe-1')
  })
})
```

### Integration Testing Patterns
```typescript
// Hook testing
import { renderHook, act } from '@testing-library/react'
import { useBookingState } from './useBookingState'

describe('useBookingState', () => {
  test('adds rooms correctly', () => {
    const { result } = renderHook(() => useBookingState())
    
    act(() => {
      result.current.addRoom(mockRoom)
    })
    
    expect(result.current.selectedRooms).toHaveLength(1)
    expect(result.current.selectedRooms[0]).toEqual(mockRoom)
  })
})
```

## 📊 Performance Guidelines

### Code Splitting Best Practices
```typescript
// Lazy load heavy components
const ABS_OrderStatus = lazy(() => 
  import('@/components/ABS_OrderStatus').then(m => ({
    default: m.ABS_OrderStatus
  }))
)

// Use Suspense for loading states
<Suspense fallback={<LoadingSpinner />}>
  <ABS_OrderStatus />
</Suspense>
```

### Optimization Patterns
```typescript
// Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return complexCalculation(data)
}, [data])

// Memoize event handlers
const handleClick = useCallback((id: string) => {
  onItemClick(id)
}, [onItemClick])

// Memoize components when needed
const MemoizedComponent = React.memo(({ data, onAction }) => {
  return <ExpensiveComponent data={data} onAction={onAction} />
}, (prevProps, nextProps) => {
  // Custom comparison logic
  return prevProps.data.id === nextProps.data.id
})
```

### Bundle Analysis
```bash
# Analyze bundle size
pnpm build
npx vite-bundle-analyzer dist

# Check for large dependencies
pnpm ls --depth=0
```

## 🚀 Deployment Process

### Build Process
```bash
# Production build
pnpm build

# Preview production build locally
pnpm preview

# Check build artifacts
ls -la dist/
```

### Environment-Specific Configuration
```typescript
// Environment detection
const isDevelopment = import.meta.env.DEV
const isProduction = import.meta.env.PROD

// Environment-specific settings
const config = {
  apiUrl: isDevelopment ? 'http://localhost:5173' : 'https://api.production.com',
  debug: isDevelopment,
  analytics: isProduction
}
```

## 🐛 Debugging Tips

### Development Tools

#### React DevTools
- Install React Developer Tools browser extension
- Inspect component props and state
- Profile component performance

#### Browser DevTools
```javascript
// Debug Supabase queries in console
window.supabase = supabase  // Expose for debugging
```

#### Common Issues and Solutions

**Issue**: Supabase connection fails
**Solution**: 
```bash
# Check environment variables
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Verify Supabase project settings
# Check RLS policies in Supabase dashboard
```

**Issue**: Component not re-rendering
**Solution**:
```typescript
// Check dependency arrays in hooks
useEffect(() => {
  // Effect logic
}, [dependency1, dependency2]) // Ensure all dependencies are listed

// Verify state updates are creating new objects/arrays
setState(prevState => ({
  ...prevState,
  newProperty: newValue
}))
```

**Issue**: Build fails with TypeScript errors
**Solution**:
```bash
# Run TypeScript check
pnpm run build

# Check for missing type definitions
pnpm add --save-dev @types/package-name
```

## 📝 Code Review Guidelines

### Checklist for Pull Requests
- [ ] **Functionality**: Does the code work as expected?
- [ ] **TypeScript**: Are all types properly defined?
- [ ] **Performance**: Are there any obvious performance issues?
- [ ] **Accessibility**: Are accessibility standards followed?
- [ ] **Responsive**: Does it work on mobile devices?
- [ ] **Tests**: Are appropriate tests included?
- [ ] **Documentation**: Is code properly documented?

### Review Process
1. **Self-review**: Review your own code before submitting
2. **Automated checks**: Ensure linting and build passes
3. **Manual testing**: Test functionality in development environment
4. **Code review**: Wait for peer review approval
5. **Final testing**: Test in staging environment before merge

## 🎯 Git Workflow

### Branch Naming Convention
```bash
# Feature branches
feature/room-selection-enhancement
feature/multi-language-support

# Bug fixes
fix/pricing-calculation-error
fix/mobile-responsive-issue

# Refactoring
refactor/component-structure-cleanup
refactor/state-management-optimization
```

### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

Examples:
```bash
feat(room-selection): add drag & drop functionality
fix(pricing): resolve calculation error for special offers
refactor(components): extract reusable UI components
docs(api): update Supabase integration guide
```

### Common Git Commands
```bash
# Create and switch to feature branch
git checkout -b feature/new-feature

# Stage and commit changes
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature

# Merge latest main changes
git checkout main
git pull origin main
git checkout feature/new-feature
git merge main

# Interactive rebase for clean history
git rebase -i main
```