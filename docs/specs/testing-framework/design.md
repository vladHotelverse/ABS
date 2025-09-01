# Testing Framework - Design

## Architecture Overview

### Testing Stack Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    Testing Framework                    │
├─────────────────────────────────────────────────────────┤
│  Unit & Integration Tests          │  End-to-End Tests  │
│  ├── Vitest Test Runner           │  ├── Playwright     │
│  ├── React Testing Library        │  ├── Cross-Browser  │
│  ├── Happy DOM Environment        │  ├── Mobile Testing │
│  └── Coverage Reporting           │  └── Visual Testing │
├─────────────────────────────────────────────────────────┤
│  Test Utilities & Mocks           │  Development Tools  │
│  ├── Mock Factories (Faker.js)    │  ├── Watch Mode     │
│  ├── Test Builders                │  ├── Visual UI      │
│  ├── Custom Render               │  ├── Coverage HTML  │
│  └── Global Mocks                │  └── Debug Support  │
├─────────────────────────────────────────────────────────┤
│  CI/CD Integration                │  Quality Gates     │
│  ├── Jest-compatible Reporting    │  ├── 70% Coverage  │
│  ├── Parallel Execution          │  ├── Performance    │
│  ├── Artifact Storage            │  ├── Accessibility  │
│  └── Caching                     │  └── Cross-browser  │
└─────────────────────────────────────────────────────────┘
```

### Directory Structure Design
```
src/
├── __tests__/
│   ├── setup/
│   │   ├── vitest.setup.ts          # Global configuration
│   │   ├── browser-mocks.ts         # Browser API mocks
│   │   └── test-environment.ts      # Environment setup
│   ├── helpers/
│   │   ├── index.ts                 # Public API exports
│   │   ├── custom-render.tsx        # Provider wrapper
│   │   ├── mock-factory.ts          # Data factories
│   │   ├── test-builders.ts         # Builder patterns
│   │   ├── test-i18n.ts            # i18n test config
│   │   └── accessibility-helpers.ts  # A11y utilities
│   ├── integration/
│   │   ├── booking-flow.test.ts     # Full booking tests
│   │   ├── multi-room.test.ts       # Multi-booking tests
│   │   └── error-scenarios.test.ts  # Error handling
│   └── e2e/
│       ├── booking-journey.spec.ts  # E2E user journeys
│       ├── mobile-experience.spec.ts # Mobile-specific tests
│       └── accessibility.spec.ts    # A11y compliance
├── components/
│   └── [ComponentName]/
│       └── __tests__/
│           ├── [ComponentName].test.tsx
│           ├── [ComponentName].a11y.test.tsx
│           └── [ComponentName].integration.test.tsx
└── hooks/
    └── __tests__/
        ├── [hookName].test.ts
        └── [hookName].performance.test.ts
```

## Test Infrastructure Design

### Vitest Configuration
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    // Environment
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/__tests__/setup/vitest.setup.ts'],
    
    // Coverage
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70
        },
        // Higher thresholds for critical components
        'src/components/ABS_Landing/**': {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85
        }
      },
      exclude: [
        'node_modules/',
        'src/__tests__/',
        '**/*.test.*',
        '**/*.stories.*',
        'src/mockData.ts',
        'dist/'
      ]
    },
    
    // Performance
    testTimeout: 10000,
    hookTimeout: 5000,
    isolate: true,
    
    // TypeScript
    typecheck: {
      tsconfig: './tsconfig.json'
    }
  }
})
```

### Global Test Setup
```typescript
// src/__tests__/setup/vitest.setup.ts
import { afterEach, beforeAll, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// Global mocks
import './browser-mocks'
import './third-party-mocks'

// Cleanup after each test
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

// Global test configuration
beforeAll(() => {
  // Set timezone for consistent date testing
  process.env.TZ = 'UTC'
  
  // Mock console methods in tests to reduce noise
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

// Global test utilities
global.createMockRoom = (overrides = {}) => ({
  id: 'room-1',
  title: 'Deluxe Room',
  price: 250,
  currency: 'EUR',
  ...overrides
})

// Performance monitoring
global.measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now()
  fn()
  const end = performance.now()
  console.log(`${name}: ${end - start}ms`)
}
```

## Test Utilities Design

### Mock Factory System
```typescript
// src/__tests__/helpers/mock-factory.ts
import { faker } from '@faker-js/faker'
import type { RoomOption, PricingItem, SpecialOffer } from '@/types'

export interface MockOptions {
  seed?: number
  locale?: string
}

export class MockFactory {
  constructor(private options: MockOptions = {}) {
    if (options.seed) {
      faker.seed(options.seed)
    }
    if (options.locale) {
      faker.setLocale(options.locale)
    }
  }

  createRoomOption(overrides: Partial<RoomOption> = {}): RoomOption {
    return {
      id: faker.datatype.uuid(),
      title: faker.commerce.productName(),
      type: faker.helpers.arrayElement(['standard', 'deluxe', 'suite']),
      description: faker.lorem.paragraph(),
      price: faker.datatype.number({ min: 100, max: 500 }),
      currency: faker.helpers.arrayElement(['EUR', 'USD']),
      mainImage: faker.image.imageUrl(400, 300, 'hotel'),
      images: Array.from({ length: 3 }, () => 
        faker.image.imageUrl(400, 300, 'hotel')
      ),
      amenities: this.createAmenities(3),
      maxOccupancy: faker.datatype.number({ min: 1, max: 4 }),
      size: faker.datatype.number({ min: 20, max: 80 }),
      bedConfiguration: faker.helpers.arrayElements(['king', 'queen', 'twin']),
      view: faker.helpers.arrayElement(['ocean', 'city', 'garden']),
      floor: faker.datatype.number({ min: 1, max: 20 }).toString(),
      segmentDiscounts: {
        business: faker.datatype.number({ min: 5, max: 15 }),
        leisure: faker.datatype.number({ min: 10, max: 25 })
      },
      availability: {
        available: faker.datatype.boolean(),
        reason: faker.helpers.maybe(() => faker.lorem.sentence())
      },
      ...overrides
    }
  }

  createPricingItem(overrides: Partial<PricingItem> = {}): PricingItem {
    return {
      id: faker.datatype.uuid(),
      name: faker.commerce.productName(),
      type: faker.helpers.arrayElement(['room', 'customization', 'offer']),
      price: faker.datatype.number({ min: 10, max: 200 }),
      currency: 'EUR',
      period: faker.helpers.arrayElement(['perNight', 'perStay', 'perPerson']),
      quantity: faker.datatype.number({ min: 1, max: 3 }),
      description: faker.lorem.sentence(),
      ...overrides
    }
  }

  createSpecialOffer(overrides: Partial<SpecialOffer> = {}): SpecialOffer {
    const basePrice = faker.datatype.number({ min: 50, max: 300 })
    return {
      id: faker.datatype.uuid(),
      title: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      category: faker.helpers.arrayElement(['spa', 'dining', 'activity']),
      basePrice,
      discountedPrice: basePrice * 0.8,
      discount: 20,
      image: faker.image.imageUrl(300, 200, 'spa'),
      availability: {
        startDate: faker.date.future().toISOString(),
        endDate: faker.date.future().toISOString(),
        available: faker.datatype.boolean()
      },
      terms: faker.lorem.sentences(2),
      ...overrides
    }
  }

  private createAmenities(count: number) {
    return Array.from({ length: count }, () => ({
      id: faker.datatype.uuid(),
      name: faker.helpers.arrayElement([
        'WiFi', 'AC', 'TV', 'Minibar', 'Safe', 'Balcony'
      ]),
      category: faker.helpers.arrayElement([
        'comfort', 'entertainment', 'business', 'accessibility'
      ]),
      icon: faker.helpers.arrayElement(['wifi', 'tv', 'coffee']),
      featured: faker.datatype.boolean()
    }))
  }

  // Batch creation methods
  createRoomOptions(count: number, template?: Partial<RoomOption>): RoomOption[] {
    return Array.from({ length: count }, () => 
      this.createRoomOption(template)
    )
  }

  createPricingItems(count: number, template?: Partial<PricingItem>): PricingItem[] {
    return Array.from({ length: count }, () => 
      this.createPricingItem(template)
    )
  }
}

// Convenience exports
export const mockFactory = new MockFactory()
export const createMockRoomOption = mockFactory.createRoomOption.bind(mockFactory)
export const createMockPricingItem = mockFactory.createPricingItem.bind(mockFactory)
export const createMockSpecialOffer = mockFactory.createSpecialOffer.bind(mockFactory)
```

### Test Builder Pattern
```typescript
// src/__tests__/helpers/test-builders.ts
import type { RoomBooking, BookingState } from '@/types'
import { mockFactory } from './mock-factory'

export class BookingFlowBuilder {
  private rooms: RoomOption[] = []
  private customizations: SelectedCustomizations = {}
  private offers: SpecialOffer[] = []
  private bookingState: Partial<BookingState> = {}

  withDefaultRooms(count: number = 1): this {
    this.rooms = mockFactory.createRoomOptions(count)
    return this
  }

  withRooms(rooms: RoomOption[]): this {
    this.rooms = rooms
    return this
  }

  withCustomRoom(overrides: Partial<RoomOption>): this {
    this.rooms.push(mockFactory.createRoomOption(overrides))
    return this
  }

  withDefaultCustomizations(count: number = 1): this {
    this.customizations = Object.fromEntries(
      Array.from({ length: count }, (_, i) => [
        `customization-${i}`,
        {
          id: `custom-${i}`,
          name: `Customization ${i}`,
          price: 50 + (i * 25),
          selected: true
        }
      ])
    )
    return this
  }

  withDefaultOffers(count: number = 1): this {
    this.offers = mockFactory.createSpecialOffers(count)
    return this
  }

  withBookingState(state: Partial<BookingState>): this {
    this.bookingState = { ...this.bookingState, ...state }
    return this
  }

  withGuests(adults: number, children: number = 0): this {
    this.bookingState.guests = { adults, children }
    return this
  }

  withDates(checkIn: string, checkOut: string): this {
    this.bookingState.checkIn = checkIn
    this.bookingState.checkOut = checkOut
    return this
  }

  build(): BookingFlowTestData {
    return {
      rooms: this.rooms,
      selectedRooms: this.rooms.slice(0, 1),
      customizations: this.customizations,
      offers: this.offers,
      selectedOffers: this.offers.slice(0, 1),
      bookingState: {
        guests: { adults: 2, children: 0 },
        checkIn: '2024-12-01',
        checkOut: '2024-12-05',
        ...this.bookingState
      },
      expectedTotal: this.calculateExpectedTotal()
    }
  }

  private calculateExpectedTotal(): number {
    const roomTotal = this.rooms.reduce((sum, room) => sum + room.price, 0) * 4 // 4 nights
    const customizationTotal = Object.values(this.customizations)
      .reduce((sum, custom) => sum + (custom.price || 0), 0)
    const offerTotal = this.offers.reduce((sum, offer) => sum + offer.basePrice, 0)
    
    return roomTotal + customizationTotal + offerTotal
  }
}

export class PricingScenarioBuilder {
  private basePrice: number = 200
  private customizations: Array<{ name: string; price: number }> = []
  private taxRate: number = 0.21
  private discountRate: number = 0
  private nights: number = 4

  withRoom(config: { price: number; nights?: number }): this {
    this.basePrice = config.price
    if (config.nights) this.nights = config.nights
    return this
  }

  withCustomization(config: { name?: string; price: number }): this {
    this.customizations.push({
      name: config.name || 'Custom Option',
      price: config.price
    })
    return this
  }

  withTaxRate(rate: number): this {
    this.taxRate = rate
    return this
  }

  withDiscount(rate: number): this {
    this.discountRate = rate
    return this
  }

  build(): PricingTestScenario {
    const subtotal = this.basePrice * this.nights + 
                    this.customizations.reduce((sum, c) => sum + c.price, 0)
    const discountAmount = subtotal * this.discountRate
    const afterDiscount = subtotal - discountAmount
    const taxAmount = afterDiscount * this.taxRate
    const total = afterDiscount + taxAmount

    return {
      basePrice: this.basePrice,
      nights: this.nights,
      customizations: this.customizations,
      taxRate: this.taxRate,
      discountRate: this.discountRate,
      calculations: {
        subtotal,
        discountAmount,
        afterDiscount,
        taxAmount,
        total
      }
    }
  }
}

// Convenience exports
export const createBookingFlow = () => new BookingFlowBuilder()
export const createPricingScenario = () => new PricingScenarioBuilder()
```

### Custom Render Utility
```typescript
// src/__tests__/helpers/custom-render.tsx
import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { createTestI18n } from './test-i18n'

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialRoute?: string
  i18nOptions?: {
    language?: string
    resources?: Record<string, any>
  }
}

function TestProviders({ children, options }: {
  children: React.ReactNode
  options?: CustomRenderOptions
}) {
  const i18n = createTestI18n(options?.i18nOptions)

  return (
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    </BrowserRouter>
  )
}

export function customRender(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) {
  const { initialRoute = '/', i18nOptions, ...renderOptions } = options

  // Navigate to initial route if specified
  if (initialRoute !== '/') {
    window.history.pushState({}, 'Test page', initialRoute)
  }

  return render(ui, {
    wrapper: ({ children }) => (
      <TestProviders options={{ i18nOptions }}>
        {children}
      </TestProviders>
    ),
    ...renderOptions
  })
}

// Re-export everything from React Testing Library
export * from '@testing-library/react'
export { customRender as render }

// Additional test utilities
export const waitForLoadingToFinish = () => 
  waitFor(() => expect(screen.queryByTestId('loading')).not.toBeInTheDocument())

export const expectElementToBeVisible = (element: HTMLElement) => {
  expect(element).toBeInTheDocument()
  expect(element).toBeVisible()
}

export const findByTextWithTimeout = (text: string, timeout = 5000) =>
  screen.findByText(text, undefined, { timeout })
```

## End-to-End Testing Design

### Playwright Configuration
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './src/__tests__/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['junit', { outputFile: 'playwright-report/results.xml' }]
  ],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },

    // Mobile devices
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] }
    },

    // Tablet
    {
      name: 'tablet',
      use: { ...devices['iPad Pro'] }
    }
  ],

  webServer: {
    command: 'pnpm dev',
    port: 5173,
    timeout: 30000,
    reuseExistingServer: !process.env.CI
  }
})
```

### E2E Test Patterns
```typescript
// src/__tests__/e2e/booking-journey.spec.ts
import { test, expect } from '@playwright/test'
import { BookingJourneyPage } from './page-objects/booking-journey'

test.describe('Complete Booking Journey', () => {
  let bookingPage: BookingJourneyPage

  test.beforeEach(async ({ page }) => {
    bookingPage = new BookingJourneyPage(page)
    await bookingPage.goto()
  })

  test('should complete single room booking flow', async () => {
    // Room selection
    await bookingPage.selectRoom('Deluxe Suite')
    await expect(bookingPage.selectedRoomIndicator).toBeVisible()

    // Customization
    await bookingPage.addCustomization('Ocean View')
    await expect(bookingPage.pricingPanel).toContainText('Ocean View')

    // Special offers
    await bookingPage.selectOffer('Spa Package')
    
    // Verify pricing
    const totalPrice = await bookingPage.getTotalPrice()
    expect(totalPrice).toBeGreaterThan(0)

    // Complete booking
    await bookingPage.completeBooking()
    await expect(bookingPage.confirmationMessage).toBeVisible()
  })

  test('should handle multi-room booking', async ({ page }) => {
    // Start multi-room flow
    await page.goto('/booking/MULTI123')
    
    // Verify room tabs
    const roomTabs = page.locator('[data-testid="room-tab"]')
    await expect(roomTabs).toHaveCount(3)

    // Customize each room
    for (let i = 0; i < 3; i++) {
      await roomTabs.nth(i).click()
      await bookingPage.addCustomization('Premium Bed')
      
      // Verify customization applies to correct room
      const roomTitle = await roomTabs.nth(i).textContent()
      await expect(bookingPage.pricingPanel)
        .toContainText(`Premium Bed - ${roomTitle}`)
    }

    // Complete multi-room booking
    await bookingPage.completeBooking()
    await expect(page.locator('text=3 rooms confirmed')).toBeVisible()
  })

  test('should be accessible', async ({ page }) => {
    await injectAxe(page)
    
    const accessibilityScanResults = await checkA11y(page)
    expect(accessibilityScanResults.violations).toHaveLength(0)
    
    // Test keyboard navigation
    await page.keyboard.press('Tab')
    await expect(page.locator(':focus')).toBeVisible()
    
    // Test screen reader labels
    const roomCard = page.locator('[data-testid="room-card"]').first()
    await expect(roomCard).toHaveAttribute('aria-label')
  })

  test('should perform well on mobile', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile-specific test')

    // Measure performance
    const startTime = Date.now()
    await bookingPage.goto()
    const loadTime = Date.now() - startTime
    
    expect(loadTime).toBeLessThan(3000)

    // Test touch interactions
    await bookingPage.swipeRoomCarousel('left')
    await expect(bookingPage.currentRoomTitle).toContainText('Premium')

    // Test mobile-specific UI
    await expect(bookingPage.mobilePricingWidget).toBeVisible()
  })
})
```

## Performance Testing Design

### Performance Measurement Utilities
```typescript
// src/__tests__/helpers/performance-helpers.ts
export class PerformanceMonitor {
  private measurements: Map<string, number[]> = new Map()

  measure<T>(name: string, fn: () => T): T {
    const start = performance.now()
    const result = fn()
    const duration = performance.now() - start
    
    if (!this.measurements.has(name)) {
      this.measurements.set(name, [])
    }
    this.measurements.get(name)!.push(duration)
    
    return result
  }

  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now()
    const result = await fn()
    const duration = performance.now() - start
    
    if (!this.measurements.has(name)) {
      this.measurements.set(name, [])
    }
    this.measurements.get(name)!.push(duration)
    
    return result
  }

  getStats(name: string) {
    const measurements = this.measurements.get(name) || []
    if (measurements.length === 0) return null

    const sorted = [...measurements].sort((a, b) => a - b)
    return {
      count: measurements.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      median: sorted[Math.floor(sorted.length / 2)],
      average: measurements.reduce((sum, val) => sum + val, 0) / measurements.length,
      p95: sorted[Math.floor(sorted.length * 0.95)]
    }
  }

  expectPerformance(name: string, maxDuration: number) {
    const stats = this.getStats(name)
    expect(stats).toBeTruthy()
    expect(stats!.average).toBeLessThan(maxDuration)
  }

  reset() {
    this.measurements.clear()
  }
}

export const performanceMonitor = new PerformanceMonitor()
```

### Memory Usage Testing
```typescript
// src/__tests__/helpers/memory-helpers.ts
export class MemoryMonitor {
  private initialMemory: number = 0

  start() {
    // Force garbage collection if available
    if (global.gc) {
      global.gc()
    }
    this.initialMemory = process.memoryUsage().heapUsed
  }

  measure() {
    const currentMemory = process.memoryUsage().heapUsed
    return {
      initial: this.initialMemory,
      current: currentMemory,
      difference: currentMemory - this.initialMemory,
      formatted: {
        initial: this.formatMemory(this.initialMemory),
        current: this.formatMemory(currentMemory),
        difference: this.formatMemory(currentMemory - this.initialMemory)
      }
    }
  }

  expectMemoryUsage(maxIncrease: number) {
    const usage = this.measure()
    expect(usage.difference).toBeLessThan(maxIncrease)
  }

  private formatMemory(bytes: number): string {
    const mb = bytes / 1024 / 1024
    return `${mb.toFixed(2)} MB`
  }
}

export const memoryMonitor = new MemoryMonitor()
```

## Quality Gates Design

### Coverage Analysis
```typescript
// scripts/coverage-analysis.js
const fs = require('fs')
const path = require('path')

class CoverageAnalyzer {
  constructor(coverageFile) {
    this.coverage = JSON.parse(fs.readFileSync(coverageFile, 'utf8'))
  }

  analyzeByComponent() {
    const components = {}
    
    for (const [filePath, data] of Object.entries(this.coverage)) {
      if (filePath.includes('components/ABS_')) {
        const component = this.extractComponentName(filePath)
        if (!components[component]) {
          components[component] = {
            files: [],
            totalLines: 0,
            coveredLines: 0
          }
        }
        
        components[component].files.push(filePath)
        components[component].totalLines += Object.keys(data.s).length
        components[component].coveredLines += Object.values(data.s)
          .filter(hits => hits > 0).length
      }
    }

    return Object.entries(components).map(([name, data]) => ({
      component: name,
      coverage: (data.coveredLines / data.totalLines * 100).toFixed(2),
      files: data.files.length
    }))
  }

  identifyLowCoverage(threshold = 70) {
    return this.analyzeByComponent()
      .filter(component => parseFloat(component.coverage) < threshold)
  }

  generateReport() {
    const analysis = this.analyzeByComponent()
    const lowCoverage = this.identifyLowCoverage()

    return {
      summary: {
        totalComponents: analysis.length,
        lowCoverageComponents: lowCoverage.length,
        averageCoverage: (analysis.reduce((sum, c) => 
          sum + parseFloat(c.coverage), 0) / analysis.length).toFixed(2)
      },
      components: analysis,
      recommendations: lowCoverage.map(c => ({
        component: c.component,
        currentCoverage: c.coverage,
        recommendation: `Add tests to reach 70% coverage (need ${(70 - parseFloat(c.coverage)).toFixed(1)}% more)`
      }))
    }
  }

  extractComponentName(filePath) {
    const match = filePath.match(/components\/(ABS_[^/]+)/)
    return match ? match[1] : 'Unknown'
  }
}
```

## CI/CD Integration Design

### GitHub Actions Workflow
```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run unit tests
        run: pnpm test:run
      
      - name: Generate coverage
        run: pnpm test:coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/coverage-final.json

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Install Playwright browsers
        run: pnpm playwright install --with-deps
      
      - name: Run E2E tests
        run: pnpm test:e2e
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/

  quality-gates:
    runs-on: ubuntu-latest
    needs: [unit-tests, e2e-tests]
    steps:
      - name: Check coverage threshold
        run: node scripts/check-coverage.js
      
      - name: Analyze test quality
        run: node scripts/test-quality-check.js
```

This comprehensive testing framework design provides a robust foundation for maintaining code quality throughout the ABS project development lifecycle, with clear patterns for unit testing, integration testing, E2E testing, and quality assurance.