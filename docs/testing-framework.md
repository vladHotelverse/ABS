# ABS Testing Framework Setup

## Overview

This document outlines the testing framework implementation for the ABS (Advanced Booking System) project, adapted from proven patterns in the Webmap project.

## Testing Stack

- **Test Runner**: Vitest (fast, modern alternative to Jest)
- **Testing Library**: React Testing Library (component testing)
- **Environment**: Happy DOM (lightweight browser simulation)
- **Mocking**: Faker.js (realistic test data generation)
- **Coverage**: Built-in Vitest coverage reporting

## Project Structure

```
src/
├── __tests__/
│   ├── setup/
│   │   └── vitest.setup.ts          # Global test configuration and mocks
│   ├── helpers/
│   │   ├── index.ts                 # Exported test utilities
│   │   ├── custom-render.tsx        # Custom render with providers
│   │   ├── mock-factory.ts          # Test data factories
│   │   ├── test-builders.ts         # Builder pattern for complex scenarios
│   │   └── test-i18n.ts            # i18n configuration for tests
│   └── integration/                 # Cross-component integration tests
├── components/
│   └── [ComponentName]/
│       └── __tests__/               # Component-specific tests
└── hooks/
    └── __tests__/                   # Hook testing
```

## Configuration Files

### `vitest.config.ts`
- React plugin integration
- Happy DOM environment
- TypeScript path aliases (`@/` → `./src/`)
- Coverage thresholds (70% minimum)
- Test setup files

### Test Scripts (package.json)
```json
{
  "scripts": {
    "test": "vitest",              // Watch mode
    "test:ui": "vitest --ui",      // Visual UI
    "test:coverage": "vitest run --coverage", // Coverage report
    "test:run": "vitest run"       // Single run
  }
}
```

## Test Utilities

### Mock Factories
Pre-built factories for creating realistic test data:

```typescript
// Room options
const room = createMockRoomOption({
  name: 'Deluxe Suite',
  price: 250,
  currency: 'EUR'
})

// Pricing items
const pricing = createMockPricingItem({
  type: 'customization',
  price: 50
})

// Special offers
const offer = createMockSpecialOffer({
  discount: 20,
  category: 'spa'
})
```

### Test Builders
Builder pattern for complex test scenarios:

```typescript
// Complete booking flow
const bookingData = new BookingFlowBuilder()
  .withDefaultRooms(3)
  .withDefaultCustomizations(2)
  .withDefaultOffers(3)
  .withBookingState({ guests: { adults: 2, children: 1 } })
  .build()

// Pricing scenarios
const pricingData = new PricingScenarioBuilder()
  .withRoom({ price: 150 })
  .withCustomization({ price: 50 })
  .withTaxRate(0.21)
  .build()
```

### Custom Render
Enhanced render function with providers:

```typescript
import { render } from '@/__tests__/helpers'

// Automatically wraps with necessary providers:
// - React Router (BrowserRouter)
// - i18next (I18nextProvider)  
// - Test environment wrapper
```

## Testing Patterns

### Component Testing
```typescript
describe('ComponentName', () => {
  it('should render with required props', () => {
    render(<ComponentName {...requiredProps} />)
    expect(screen.getByTestId('component-name')).toBeInTheDocument()
  })

  it('should handle user interactions', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    
    render(<ComponentName onClick={handleClick} />)
    await user.click(screen.getByRole('button'))
    
    expect(handleClick).toHaveBeenCalled()
  })
})
```

### Hook Testing
```typescript
describe('useBookingState', () => {
  it('should manage booking state correctly', () => {
    const { result } = renderHook(() => useBookingState())
    
    act(() => {
      result.current.selectRoom(mockRoom)
    })
    
    expect(result.current.selectedRoom).toEqual(mockRoom)
  })
})
```

### Integration Testing
```typescript
describe('Booking Flow Integration', () => {
  it('should complete full booking process', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    
    render(<ABS_Landing onBookingComplete={onComplete} />)
    
    // Simulate complete user journey
    await user.click(screen.getByTestId('select-room'))
    await user.click(screen.getByTestId('add-customization'))
    await user.click(screen.getByTestId('complete-booking'))
    
    expect(onComplete).toHaveBeenCalledWith(expect.objectContaining({
      selectedRoom: expect.any(Object),
      totalPrice: expect.any(Number)
    }))
  })
})
```

## Global Mocks

### Browser APIs
- `IntersectionObserver` - For components with scroll-based triggers
- `ResizeObserver` - For responsive components
- `window.matchMedia` - For media queries
- `HTMLMediaElement` play/pause - For video/audio components

### Third-party Libraries
- **Supabase**: Database operations return mock data
- **React i18next**: Translation keys returned as-is
- **React Router**: Navigation mocks for testing

## Coverage Configuration

### Thresholds
- **Branches**: 70% minimum
- **Functions**: 70% minimum  
- **Lines**: 70% minimum
- **Statements**: 70% minimum

### Exclusions
- `node_modules/`
- Test files (`__tests__/`, `*.test.*`)
- Stories (`*.stories.*`)
- Configuration files
- Mock data files
- Build output (`dist/`)

## Running Tests

```bash
# Development (watch mode)
pnpm test

# Single run with coverage
pnpm test:coverage

# Visual test runner
pnpm test:ui

# CI/Production
pnpm test:run
```

## Best Practices

### 1. **Arrange, Act, Assert Pattern**
```typescript
it('should update total when item added', () => {
  // Arrange
  const { result } = renderHook(() => useBookingState())
  
  // Act
  act(() => {
    result.current.addItem(mockItem)
  })
  
  // Assert
  expect(result.current.total).toBe(mockItem.price)
})
```

### 2. **Use Descriptive Test Names**
- ✅ `should display error message when API call fails`
- ❌ `test error handling`

### 3. **Test Behavior, Not Implementation**
- Focus on user-visible behavior
- Avoid testing internal state directly
- Test the component's contract/API

### 4. **Use Test Builders for Complex Data**
```typescript
// ✅ Good - readable and maintainable
const bookingScenario = new BookingFlowBuilder()
  .withMultipleRooms()
  .withSpecialOffers()
  .build()

// ❌ Avoid - hard to read and maintain
const bookingScenario = {
  rooms: [/* large object */],
  offers: [/* another large object */]
}
```

### 5. **Mock External Dependencies**
- Database calls (Supabase)
- HTTP requests
- Browser APIs
- Third-party libraries

## Next Steps

### Phase 1: Component Tests (Week 1)
- [ ] `ABS_Landing` component tests
- [ ] `ABS_RoomCustomization` tests  
- [ ] `ABS_SpecialOffers` tests
- [ ] `ABS_PricingSummaryPanel` tests

### Phase 2: Hook Tests (Week 1-2)
- [ ] `useBookingState` test suite
- [ ] `useMultiBookingState` coverage
- [ ] `useSupabaseContent` integration tests

### Phase 3: Integration Tests (Week 2)
- [ ] End-to-end booking flow
- [ ] Multi-room booking scenarios
- [ ] Error handling workflows
- [ ] Accessibility compliance

### Phase 4: E2E Testing (Week 2-3)
- [ ] Playwright setup
- [ ] Critical user journeys
- [ ] Cross-browser testing
- [ ] Mobile responsiveness

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Webmap Testing Examples](../../../Webmap/lib/src/__tests__)

---

*This testing framework provides a solid foundation for maintaining high code quality and preventing regressions in the ABS project.*