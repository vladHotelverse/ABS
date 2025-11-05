---
name: Storybook Enhancement
description: Guidelines for creating comprehensive Storybook stories with variants, responsive views, and interactive controls
tags: [storybook, documentation, testing, components]
version: 1.0.0
---

# Storybook Enhancement

This skill provides comprehensive guidelines for creating high-quality Storybook stories for components in the ABS UI Toolkit, including variant documentation, responsive testing, and interactive controls.

## Story File Structure and Naming

### File Location and Naming Convention

Stories are located in `src/stories/` directory, separate from component files:

```
src/
├── components/
│   └── ui/
│       └── button.tsx
└── stories/
    └── Button.stories.tsx
```

**Naming Pattern**: `ComponentName.stories.tsx`

### Basic Story Structure

```typescript
// src/stories/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@/components/ui/button'

/**
 * The Button component provides a versatile, accessible button with multiple variants.
 * Built on Radix UI Slot for composition flexibility.
 */
const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'Button size',
    },
    asChild: {
      control: 'boolean',
      description: 'Render as child component using Radix Slot',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the button',
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

/**
 * The default button variant with primary styling.
 */
export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'default',
    size: 'default',
  },
}

/**
 * All button variants displayed together.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
}

/**
 * All button sizes displayed together.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}

/**
 * Disabled state for all variants.
 */
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button disabled>Default</Button>
      <Button disabled variant="destructive">
        Destructive
      </Button>
      <Button disabled variant="outline">
        Outline
      </Button>
    </div>
  ),
}
```

## Meta Object Configuration

### Complete Meta Configuration

```typescript
const meta: Meta<typeof Component> = {
  // Story hierarchy and title
  title: 'Category/Subcategory/ComponentName',

  // The component to document
  component: Component,

  // Subcomponents (for compound components)
  subcomponents: {
    ComponentItem,
    ComponentTrigger,
    ComponentContent,
  },

  // Enable autodocs
  tags: ['autodocs'],

  // Story layout and behavior
  parameters: {
    layout: 'centered', // 'centered' | 'fullscreen' | 'padded'
    docs: {
      description: {
        component: 'Detailed component description for documentation.',
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#000000' },
      ],
    },
  },

  // Control panel configuration
  argTypes: {
    propName: {
      control: 'select', // 'text' | 'number' | 'boolean' | 'select' | 'radio' | 'color'
      options: ['option1', 'option2'],
      description: 'Description of the prop',
      defaultValue: 'option1',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'option1' },
      },
    },
    onEventHandler: {
      action: 'clicked', // Creates action logger
    },
  },

  // Global decorators
  decorators: [
    (Story) => (
      <div className="p-8">
        <Story />
      </div>
    ),
  ],
}
```

### Title Hierarchy Best Practices

```typescript
// UI Primitives
title: 'UI/Button'
title: 'UI/Input'
title: 'UI/Card'

// Domain Components
title: 'Upsell/BookingBanner'
title: 'Upsell/PricingSummaryPanel'
title: 'Multimedia/MatterportViewer'

// Patterns and Compositions
title: 'Patterns/Forms/LoginForm'
title: 'Patterns/Navigation/Sidebar'
```

## Creating Primary Stories with All Required Props

### Simple Component Stories

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { Input } from '@/components/ui/input'

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof Input>

/**
 * Default input with placeholder text.
 */
export const Default: Story = {
  args: {
    type: 'text',
    placeholder: 'Enter text...',
  },
}

/**
 * Input with a label.
 */
export const WithLabel: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <label htmlFor="email" className="text-sm font-medium">
        Email
      </label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  ),
}

/**
 * Disabled input state.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled input',
  },
}

/**
 * Input with error state.
 */
export const WithError: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <label htmlFor="email-error" className="text-sm font-medium">
        Email
      </label>
      <Input
        id="email-error"
        type="email"
        placeholder="you@example.com"
        className="border-destructive"
        aria-invalid="true"
        aria-describedby="email-error-message"
      />
      <p id="email-error-message" className="text-sm text-destructive">
        Please enter a valid email address.
      </p>
    </div>
  ),
}
```

### Complex Component Stories

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const meta: Meta<typeof Dialog> = {
  title: 'UI/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  subcomponents: {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
  },
}

export default meta
type Story = StoryObj<typeof Dialog>

/**
 * A basic dialog with a form.
 */
export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" defaultValue="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" defaultValue="@peduarte" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}
```

## Component Variants (Sizes, Colors, States, Responsive)

### Comprehensive Variant Display

```typescript
/**
 * All card variants in a grid layout.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Default Card</CardTitle>
          <CardDescription>Standard card styling</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card content goes here.</p>
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardHeader>
          <CardTitle>Outlined Card</CardTitle>
          <CardDescription>With thicker border</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card content goes here.</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Elevated Card</CardTitle>
          <CardDescription>With shadow</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card content goes here.</p>
        </CardContent>
      </Card>
    </div>
  ),
}

/**
 * Interactive card with hover effects.
 */
export const Interactive: Story = {
  render: () => (
    <Card className="cursor-pointer transition-all hover:shadow-lg">
      <CardHeader>
        <CardTitle>Interactive Card</CardTitle>
        <CardDescription>Hover to see effect</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card responds to hover interactions.</p>
      </CardContent>
    </Card>
  ),
}
```

### State Variations

```typescript
/**
 * Demonstrates all possible states of the component.
 */
export const States: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Default State</h3>
        <Button>Normal Button</Button>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Hover State</h3>
        <Button className="hover:bg-primary/90">Hover Me</Button>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Active State</h3>
        <Button className="active:scale-95">Click Me</Button>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Focus State</h3>
        <Button className="focus:ring-2 focus:ring-ring focus:ring-offset-2">
          Tab to Focus
        </Button>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Disabled State</h3>
        <Button disabled>Disabled</Button>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Loading State</h3>
        <Button disabled>
          <span className="mr-2 h-4 w-4 animate-spin">⏳</span>
          Loading...
        </Button>
      </div>
    </div>
  ),
}
```

## Responsive Story Setup

### Viewport Configuration

```typescript
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof ResponsiveComponent> = {
  title: 'Patterns/ResponsiveComponent',
  component: ResponsiveComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1440px', height: '900px' },
        },
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof ResponsiveComponent>
```

### Multi-Viewport Stories

```typescript
/**
 * Mobile view (375px width).
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
  },
  render: () => (
    <div className="p-4">
      <h1 className="text-xl">Mobile View</h1>
      <p className="text-sm">Optimized for small screens</p>
    </div>
  ),
}

/**
 * Tablet view (768px width).
 */
export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  render: () => (
    <div className="p-6">
      <h1 className="text-2xl">Tablet View</h1>
      <p className="text-base">Optimized for medium screens</p>
    </div>
  ),
}

/**
 * Desktop view (1440px width).
 */
export const Desktop: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
  render: () => (
    <div className="p-8">
      <h1 className="text-3xl">Desktop View</h1>
      <p className="text-lg">Optimized for large screens</p>
    </div>
  ),
}

/**
 * Responsive layout that adapts to all screen sizes.
 */
export const Responsive: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <CardTitle>Item {i + 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This layout adapts to screen size.</p>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
}
```

## Story Decorators and Layout Parameters

### Global Decorators

```typescript
const meta: Meta<typeof Component> = {
  title: 'UI/Component',
  component: Component,
  decorators: [
    // Add padding around all stories
    (Story) => (
      <div className="p-8">
        <Story />
      </div>
    ),
    // Add theme wrapper
    (Story) => (
      <div className="min-h-screen bg-background text-foreground">
        <Story />
      </div>
    ),
    // Add i18n provider
    (Story) => (
      <I18nextProvider i18n={i18n}>
        <Story />
      </I18nextProvider>
    ),
  ],
}
```

### Per-Story Decorators

```typescript
/**
 * Component with dark background.
 */
export const DarkBackground: Story = {
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-slate-900 p-8">
        <Story />
      </div>
    ),
  ],
  render: () => <Button className="text-white">Light Button on Dark BG</Button>,
}

/**
 * Component with custom container width.
 */
export const Constrained: Story = {
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-md">
        <Story />
      </div>
    ),
  ],
  render: () => <Card>Constrained width card</Card>,
}
```

### Layout Parameters

```typescript
/**
 * Fullscreen layout for page components.
 */
export const FullPage: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="min-h-screen bg-background">
      <header className="border-b p-4">Header</header>
      <main className="p-8">Main Content</main>
      <footer className="border-t p-4">Footer</footer>
    </div>
  ),
}

/**
 * Centered layout for small components.
 */
export const Centered: Story = {
  parameters: {
    layout: 'centered',
  },
  render: () => <Button>Centered Button</Button>,
}

/**
 * Padded layout for medium components.
 */
export const Padded: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => <Card>Padded Card</Card>,
}
```

## JSDoc Documentation in Stories

### Component-Level Documentation

```typescript
/**
 * The PricingSummaryPanel component displays booking costs with optional
 * enhancement options. It supports responsive layouts and handles both
 * desktop and mobile views.
 *
 * ## Features
 * - Responsive layout (mobile/desktop)
 * - Optional enhancement offers
 * - Accessibility compliant
 * - Internationalization support
 *
 * ## Usage
 * ```tsx
 * <PricingSummaryPanel
 *   roomType="Deluxe Suite"
 *   checkIn="2024-03-15"
 *   checkOut="2024-03-20"
 *   guests={{ adults: 2, children: 1 }}
 *   pricing={{
 *     baseRate: 250,
 *     nights: 5,
 *     subtotal: 1250,
 *     taxes: 150,
 *     total: 1400
 *   }}
 * />
 * ```
 *
 * @see {@link https://storybook.js.org/docs | Storybook Docs}
 */
const meta: Meta<typeof PricingSummaryPanel> = {
  // ...
}
```

### Story-Level Documentation

```typescript
/**
 * Default pricing summary with basic booking information.
 *
 * This story demonstrates the standard layout with:
 * - Room type and dates
 * - Guest information
 * - Price breakdown
 * - Total cost
 */
export const Default: Story = {
  args: {
    // ...
  },
}

/**
 * Pricing summary with enhancement offers.
 *
 * Shows how the component displays optional add-ons:
 * - Early check-in
 * - Late checkout
 * - Room upgrade options
 *
 * Users can select enhancements to see updated pricing.
 */
export const WithEnhancements: Story = {
  args: {
    // ...
  },
}

/**
 * Mobile-optimized layout.
 *
 * Displays the component in a mobile viewport with:
 * - Stacked layout
 * - Touch-friendly controls
 * - Condensed information display
 *
 * @viewport mobile
 */
export const MobileView: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
  // ...
}
```

## Accessibility Features in Stories

### Accessibility Testing Story

```typescript
/**
 * Accessibility testing story.
 *
 * This story is optimized for accessibility testing with:
 * - Proper ARIA labels
 * - Keyboard navigation support
 * - Focus management
 * - Screen reader announcements
 */
export const Accessibility: Story = {
  render: () => (
    <div role="region" aria-label="Booking form">
      <h2 id="form-title">Complete Your Booking</h2>

      <form aria-labelledby="form-title">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              aria-required="true"
              aria-describedby="name-hint"
            />
            <p id="name-hint" className="text-sm text-muted-foreground">
              Enter your full legal name as it appears on your ID
            </p>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              aria-required="true"
              aria-invalid="false"
            />
          </div>

          <Button type="submit" aria-label="Submit booking form">
            Complete Booking
          </Button>
        </div>
      </form>
    </div>
  ),
}
```

### Keyboard Navigation Story

```typescript
/**
 * Keyboard navigation demonstration.
 *
 * Test keyboard accessibility:
 * - Tab: Navigate forward
 * - Shift + Tab: Navigate backward
 * - Enter/Space: Activate buttons
 * - Escape: Close dialogs/dropdowns
 * - Arrow keys: Navigate within components
 */
export const KeyboardNavigation: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Use Tab to navigate, Enter to activate, Escape to close.
      </p>

      <div className="flex gap-4">
        <Button>First Button</Button>
        <Button>Second Button</Button>
        <Button>Third Button</Button>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog (Escape to close)</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>
              Press Escape to close this dialog.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button>Action</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  ),
}
```

## Storybook Best Practices Checklist

- [ ] Story file named `ComponentName.stories.tsx`
- [ ] Located in `src/stories/` directory
- [ ] Meta object includes `title`, `component`, `tags: ['autodocs']`
- [ ] All component props have `argTypes` definitions
- [ ] Event handlers use `action()` for logging
- [ ] Primary story (`Default`) demonstrates typical usage
- [ ] Variant stories show all visual variations
- [ ] State stories show interactive states (hover, focus, disabled)
- [ ] Responsive stories demonstrate mobile/tablet/desktop layouts
- [ ] Complex components include usage examples in JSDoc
- [ ] Accessibility features are documented and demonstrated
- [ ] Stories use proper decorators for context (theme, i18n)
- [ ] Layout parameters match story content (`centered`, `fullscreen`, `padded`)
- [ ] Compound components have `subcomponents` defined
- [ ] Interactive stories use `render()` for custom implementations
