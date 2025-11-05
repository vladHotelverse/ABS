---
name: Testing and Quality
description: Comprehensive testing guidelines for unit tests with Vitest, E2E tests with Playwright, and quality assurance standards
tags: [testing, vitest, playwright, quality, accessibility]
version: 1.0.0
---

# Testing and Quality

This skill provides comprehensive guidelines for testing React components in the ABS UI Toolkit using Vitest for unit tests and Playwright for end-to-end tests, ensuring 70% minimum coverage and accessibility compliance.

## Unit Testing with Vitest

### Test Environment Setup

Vitest is configured with `happy-dom` test environment:

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    setupFiles: ['./src/__tests__/setup/vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        '**/*.stories.tsx',
        '**/*.d.ts',
        '**/mockData.ts',
        'src/main.tsx',
        'vite.config.ts',
        '.storybook/**',
      ],
      thresholds: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### Setup File

```typescript
// src/__tests__/setup/vitest.setup.ts
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}
```

## Test File Organization

### Directory Structure

```
src/
├── __tests__/
│   ├── setup/
│   │   └── vitest.setup.ts
│   ├── unit/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── Button.test.tsx
│   │   │   │   ├── Card.test.tsx
│   │   │   │   └── Dialog.test.tsx
│   │   │   └── upsell/
│   │   │       ├── BookingBanner.test.tsx
│   │   │       └── PricingSummaryPanel.test.tsx
│   │   ├── hooks/
│   │   │   ├── useBreakpoint.test.ts
│   │   │   └── useMobile.test.ts
│   │   └── lib/
│   │       └── utils.test.ts
│   └── e2e/
│       ├── button.spec.ts
│       ├── dialog.spec.ts
│       └── booking-flow.spec.ts
└── components/
    └── ui/
        └── button.tsx
```

### File Naming Convention

- Unit tests: `ComponentName.test.tsx` or `hookName.test.ts`
- E2E tests: `feature-name.spec.ts`

## Testing Component Rendering and Props

### Basic Component Rendering

```typescript
// src/__tests__/unit/components/ui/Button.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders with children text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('applies default variant classes', () => {
    render(<Button>Default</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-primary')
  })

  it('applies custom className', () => {
    render(<Button className="custom-class">Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = vi.fn()
    render(<Button ref={ref}>Button</Button>)
    expect(ref).toHaveBeenCalled()
  })
})
```

### Testing Props and Variants

```typescript
describe('Button variants', () => {
  it('renders destructive variant', () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-destructive')
  })

  it('renders outline variant', () => {
    render(<Button variant="outline">Outline</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('border')
  })

  it('renders different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    let button = screen.getByRole('button')
    expect(button).toHaveClass('h-9')

    rerender(<Button size="lg">Large</Button>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('h-11')
  })
})
```

### Testing Conditional Rendering

```typescript
describe('Card', () => {
  it('renders header when provided', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
      </Card>
    )
    expect(screen.getByText('Title')).toBeInTheDocument()
  })

  it('renders without header', () => {
    render(
      <Card>
        <CardContent>Content only</CardContent>
      </Card>
    )
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    expect(screen.getByText('Content only')).toBeInTheDocument()
  })

  it('renders footer when provided', () => {
    render(
      <Card>
        <CardFooter>Footer content</CardFooter>
      </Card>
    )
    expect(screen.getByText('Footer content')).toBeInTheDocument()
  })
})
```

## Testing User Interactions and Events

### Click Events

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/button'

describe('Button interactions', () => {
  it('calls onClick handler when clicked', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click me</Button>)

    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(
      <Button onClick={handleClick} disabled>
        Disabled
      </Button>
    )

    await user.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('supports double click events', async () => {
    const handleDoubleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button onDoubleClick={handleDoubleClick}>Double click</Button>)

    await user.dblClick(screen.getByRole('button'))
    expect(handleDoubleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Form Interactions

```typescript
describe('Input interactions', () => {
  it('updates value on typing', async () => {
    const user = userEvent.setup()
    render(<Input placeholder="Enter text" />)

    const input = screen.getByPlaceholderText('Enter text')
    await user.type(input, 'Hello World')

    expect(input).toHaveValue('Hello World')
  })

  it('calls onChange handler', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()

    render(<Input onChange={handleChange} />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'test')

    expect(handleChange).toHaveBeenCalled()
  })

  it('supports controlled input', async () => {
    const TestComponent = () => {
      const [value, setValue] = React.useState('')
      return (
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          data-testid="controlled-input"
        />
      )
    }

    const user = userEvent.setup()
    render(<TestComponent />)

    const input = screen.getByTestId('controlled-input')
    await user.type(input, 'controlled')

    expect(input).toHaveValue('controlled')
  })
})
```

### Dialog and Modal Interactions

```typescript
describe('Dialog interactions', () => {
  it('opens dialog on trigger click', async () => {
    const user = userEvent.setup()

    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog content</DialogDescription>
        </DialogContent>
      </Dialog>
    )

    await user.click(screen.getByRole('button', { name: /open/i }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Dialog Title')).toBeInTheDocument()
  })

  it('closes dialog on close button click', async () => {
    const user = userEvent.setup()

    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>Dialog</DialogTitle>
          <DialogDescription>Content</DialogDescription>
        </DialogContent>
      </Dialog>
    )

    const closeButton = screen.getByRole('button', { name: /close/i })
    await user.click(closeButton)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes dialog on escape key', async () => {
    const user = userEvent.setup()

    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    )

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
```

## E2E Testing with Playwright

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
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
```

### Basic E2E Tests

```typescript
// src/__tests__/e2e/button.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Button Component', () => {
  test('renders and is clickable', async ({ page }) => {
    await page.goto('/iframe.html?id=ui-button--default')

    const button = page.getByRole('button', { name: /button/i })
    await expect(button).toBeVisible()
    await button.click()
  })

  test('shows correct variants', async ({ page }) => {
    await page.goto('/iframe.html?id=ui-button--variants')

    await expect(page.getByRole('button', { name: /default/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /destructive/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /outline/i })).toBeVisible()
  })

  test('disabled button is not clickable', async ({ page }) => {
    await page.goto('/iframe.html?id=ui-button--disabled')

    const button = page.getByRole('button').first()
    await expect(button).toBeDisabled()
  })
})
```

### Navigation and Interaction Tests

```typescript
// src/__tests__/e2e/booking-flow.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Booking Flow', () => {
  test('completes booking process', async ({ page }) => {
    await page.goto('/')

    // Select room
    await page.getByRole('button', { name: /book now/i }).first().click()

    // Fill form
    await page.getByLabel(/full name/i).fill('John Doe')
    await page.getByLabel(/email/i).fill('john@example.com')
    await page.getByLabel(/phone/i).fill('555-0123')

    // Select dates
    await page.getByLabel(/check-in/i).fill('2024-12-25')
    await page.getByLabel(/check-out/i).fill('2024-12-30')

    // Submit
    await page.getByRole('button', { name: /confirm booking/i }).click()

    // Verify confirmation
    await expect(page.getByText(/booking confirmed/i)).toBeVisible()
  })

  test('validates required fields', async ({ page }) => {
    await page.goto('/booking')

    await page.getByRole('button', { name: /confirm booking/i }).click()

    await expect(page.getByText(/name is required/i)).toBeVisible()
    await expect(page.getByText(/email is required/i)).toBeVisible()
  })
})
```

### Responsive E2E Tests

```typescript
test.describe('Responsive Layout', () => {
  test('displays mobile navigation on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    const mobileMenu = page.getByRole('button', { name: /menu/i })
    await expect(mobileMenu).toBeVisible()
  })

  test('displays desktop navigation on large screens', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')

    const desktopNav = page.getByRole('navigation')
    await expect(desktopNav).toBeVisible()

    const mobileMenu = page.getByRole('button', { name: /menu/i })
    await expect(mobileMenu).not.toBeVisible()
  })
})
```

## Accessibility Testing Patterns

### Basic Accessibility Tests

```typescript
describe('Button accessibility', () => {
  it('has accessible name', () => {
    render(<Button>Submit</Button>)
    const button = screen.getByRole('button', { name: /submit/i })
    expect(button).toBeInTheDocument()
  })

  it('supports aria-label', () => {
    render(<Button aria-label="Close dialog">×</Button>)
    const button = screen.getByRole('button', { name: /close dialog/i })
    expect(button).toBeInTheDocument()
  })

  it('indicates disabled state', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-disabled', 'true')
  })
})
```

### Form Accessibility

```typescript
describe('Form accessibility', () => {
  it('associates labels with inputs', () => {
    render(
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" />
      </div>
    )

    const input = screen.getByLabelText(/email/i)
    expect(input).toBeInTheDocument()
  })

  it('provides error descriptions', () => {
    render(
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          aria-invalid="true"
          aria-describedby="email-error"
        />
        <p id="email-error">Please enter a valid email</p>
      </div>
    )

    const input = screen.getByLabelText(/email/i)
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAttribute('aria-describedby', 'email-error')
  })

  it('marks required fields', () => {
    render(
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" required aria-required="true" />
      </div>
    )

    const input = screen.getByLabelText(/name/i)
    expect(input).toBeRequired()
    expect(input).toHaveAttribute('aria-required', 'true')
  })
})
```

### Keyboard Navigation Tests

```typescript
describe('Keyboard navigation', () => {
  it('focuses on tab key press', async () => {
    const user = userEvent.setup()

    render(
      <div>
        <Button>First</Button>
        <Button>Second</Button>
        <Button>Third</Button>
      </div>
    )

    await user.tab()
    expect(screen.getByRole('button', { name: /first/i })).toHaveFocus()

    await user.tab()
    expect(screen.getByRole('button', { name: /second/i })).toHaveFocus()

    await user.tab()
    expect(screen.getByRole('button', { name: /third/i })).toHaveFocus()
  })

  it('activates on Enter key', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Activate</Button>)

    const button = screen.getByRole('button')
    button.focus()
    await user.keyboard('{Enter}')

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('activates on Space key', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Activate</Button>)

    const button = screen.getByRole('button')
    button.focus()
    await user.keyboard(' ')

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

## Coverage Measurement and Requirements

### Running Coverage

```bash
# Run tests with coverage
pnpm test --coverage

# Run tests with coverage in watch mode
pnpm test --coverage --watch

# Generate HTML coverage report
pnpm test --coverage --reporter=html
```

### Coverage Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        '**/*.stories.tsx',
        '**/*.d.ts',
        '**/mockData.ts',
        'src/main.tsx',
        'vite.config.ts',
        'vitest.config.ts',
        'playwright.config.ts',
        '.storybook/**',
        'src/__tests__/**',
      ],
      thresholds: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70,
      },
      all: true,
      include: ['src/**/*.{ts,tsx}'],
    },
  },
})
```

### Coverage Targets

**Minimum Requirements (70%):**
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

**Priority for High Coverage:**
1. UI primitive components (Button, Input, Card, etc.)
2. Custom hooks
3. Utility functions
4. Business logic in domain components

**Acceptable Lower Coverage:**
- Story files (excluded)
- Type definition files (excluded)
- Mock data files (excluded)
- Configuration files (excluded)

## Mocking Strategies

### Mocking Modules

```typescript
import { vi } from 'vitest'

// Mock entire module
vi.mock('@/lib/api', () => ({
  fetchUser: vi.fn(),
  updateUser: vi.fn(),
}))

// Use mocked functions
import { fetchUser } from '@/lib/api'

describe('UserProfile', () => {
  it('displays user data', async () => {
    ;(fetchUser as any).mockResolvedValue({
      name: 'John Doe',
      email: 'john@example.com',
    })

    render(<UserProfile userId="123" />)

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })
})
```

### Mocking React Hooks

```typescript
import { vi } from 'vitest'
import * as hooks from '@/hooks/useBreakpoint'

describe('ResponsiveComponent', () => {
  it('renders mobile layout', () => {
    vi.spyOn(hooks, 'useBreakpoint').mockReturnValue('mobile')

    render(<ResponsiveComponent />)

    expect(screen.getByTestId('mobile-layout')).toBeInTheDocument()
  })

  it('renders desktop layout', () => {
    vi.spyOn(hooks, 'useBreakpoint').mockReturnValue('desktop')

    render(<ResponsiveComponent />)

    expect(screen.getByTestId('desktop-layout')).toBeInTheDocument()
  })
})
```

### Mocking Context

```typescript
import { vi } from 'vitest'

const mockContextValue = {
  user: { id: '1', name: 'Test User' },
  logout: vi.fn(),
}

describe('UserMenu', () => {
  it('displays user info', () => {
    render(
      <AuthContext.Provider value={mockContextValue}>
        <UserMenu />
      </AuthContext.Provider>
    )

    expect(screen.getByText('Test User')).toBeInTheDocument()
  })

  it('calls logout on button click', async () => {
    const user = userEvent.setup()

    render(
      <AuthContext.Provider value={mockContextValue}>
        <UserMenu />
      </AuthContext.Provider>
    )

    await user.click(screen.getByRole('button', { name: /logout/i }))

    expect(mockContextValue.logout).toHaveBeenCalled()
  })
})
```

## Testing Best Practices Checklist

### Unit Testing
- [ ] Test file named `ComponentName.test.tsx`
- [ ] Located in `src/__tests__/unit/` directory
- [ ] Tests component rendering
- [ ] Tests all props and variants
- [ ] Tests user interactions (click, type, submit)
- [ ] Tests accessibility (ARIA labels, roles, keyboard nav)
- [ ] Tests error states and edge cases
- [ ] Uses `screen` queries from Testing Library
- [ ] Uses `userEvent` for interactions (not `fireEvent`)
- [ ] Cleans up after tests with `cleanup()`
- [ ] Achieves 70% minimum coverage

### E2E Testing
- [ ] Test file named `feature-name.spec.ts`
- [ ] Located in `src/__tests__/e2e/` directory
- [ ] Tests real user workflows
- [ ] Tests navigation between pages
- [ ] Tests form submissions
- [ ] Tests responsive layouts
- [ ] Includes mobile and desktop viewports
- [ ] Uses semantic locators (role, label, text)
- [ ] Handles async operations with `waitFor`
- [ ] Verifies success and error states
- [ ] Tests cross-browser compatibility

### Quality Standards
- [ ] No hardcoded test IDs (use semantic queries)
- [ ] Tests are independent (no shared state)
- [ ] Tests are deterministic (no random values)
- [ ] Clear test descriptions (what is being tested)
- [ ] Arrange-Act-Assert pattern followed
- [ ] Edge cases covered (empty, null, undefined)
- [ ] Error handling tested
- [ ] Loading states tested
- [ ] Accessibility requirements verified
- [ ] Coverage meets 70% threshold
