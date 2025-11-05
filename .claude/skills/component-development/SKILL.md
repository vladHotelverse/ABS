---
name: component-development
description: Help create new React components following ABS UI Toolkit architecture. Use when building new UI components, setting up component structure, creating component props, implementing component logic, and ensuring Radix UI compliance.
version: 1.0.0
author: ABS UI Toolkit Team
tags: [react, components, radix-ui, tailwind, typescript]
---

# Component Development Skill

This skill provides comprehensive guidance for creating React components in the ABS UI Toolkit project, ensuring consistency, accessibility, and maintainability.

## Project Architecture Overview

The ABS UI Toolkit follows a structured component architecture:

```
src/
├── components/
│   ├── ui/              # Radix UI primitive wrappers
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   └── [domain]/        # Domain-specific components
│       ├── booking-timeline.tsx
│       └── ...
├── lib/
│   └── utils.ts         # Utility functions (cn helper)
└── index.ts             # Public API exports
```

## Component Location Guidelines

### Radix UI Primitives (`src/components/ui/`)
Place components here when they:
- Wrap Radix UI primitives (Button, Dialog, Dropdown, etc.)
- Provide low-level, reusable UI building blocks
- Are framework/design system level components
- Need to be consumed across multiple domain contexts

### Domain Components (`src/components/[domain]/`)
Place components here when they:
- Implement business-specific functionality
- Combine multiple UI primitives
- Are specific to a particular feature area (booking, guests, inventory, etc.)
- Contain domain logic or specialized behavior

## Component Structure Template

### Basic Component Structure

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// 1. Variant definitions (if needed)
const componentVariants = cva(
  "base-classes-here",
  {
    variants: {
      variant: {
        default: "variant-classes",
        secondary: "variant-classes",
      },
      size: {
        default: "size-classes",
        sm: "size-classes",
        lg: "size-classes",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// 2. Props interface with JSDoc
/**
 * Props for the Component
 * 
 * @property {string} [className] - Additional CSS classes
 * @property {React.ReactNode} children - Component children
 */
export interface ComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {
  /** Additional description if needed */
  asChild?: boolean
}

// 3. Component implementation
const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(componentVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)

Component.displayName = "Component"

// 4. Export
export { Component, componentVariants }
```

## Radix UI Integration Patterns

### Pattern 1: Simple Primitive Wrapper (Button)

```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
```

### Pattern 2: Compound Component (Dialog)

```tsx
import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
```

### Pattern 3: Form Input Component

```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Error message to display */
  error?: string
  /** Label for the input */
  label?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, id, ...props }, ref) => {
    const inputId = id || React.useId()
    
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 block text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1 text-sm text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }
```

## TypeScript Prop Patterns

### Extending HTML Attributes

```tsx
// For native HTML elements
export interface ComponentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  customProp?: string
}

// For buttons
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
}

// For inputs
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}
```

### Using Radix Primitive Props

```tsx
// Extend Radix component props
export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  showCloseButton?: boolean
}
```

### Discriminated Unions for Variants

```tsx
type ButtonVariant =
  | { variant: "default"; loading?: boolean }
  | { variant: "ghost"; loading?: never }
  | { variant: "destructive"; confirmText: string }

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "variant">,
    ButtonVariant {}
```

## Tailwind CSS 4 and Design Tokens

### Using Design Tokens

```tsx
// Correct: Use semantic design tokens
className="bg-primary text-primary-foreground"
className="border border-input"
className="text-muted-foreground"

// Avoid: Hardcoded colors
className="bg-blue-600 text-white"  // ❌
```

### Common Design Token Categories

```tsx
// Colors
bg-background, bg-foreground
bg-primary, text-primary-foreground
bg-secondary, text-secondary-foreground
bg-muted, text-muted-foreground
bg-accent, text-accent-foreground
bg-destructive, text-destructive-foreground
border-input, border-border

// Sizing
h-9, h-10  // Standard heights
px-3, px-4, py-2  // Standard padding
gap-2, gap-4  // Standard gaps
rounded-md, rounded-lg  // Standard radius

// Shadows and Effects
shadow-sm, shadow-md
ring-1, ring-ring
focus-visible:ring-1, focus-visible:ring-ring
```

### Responsive Design

```tsx
className="flex flex-col sm:flex-row md:gap-4 lg:px-8"
className="text-sm md:text-base"
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

## Class Variance Authority (CVA) Usage

### Basic CVA Pattern

```tsx
import { cva, type VariantProps } from "class-variance-authority"

const componentVariants = cva(
  // Base classes (always applied)
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  {
    variants: {
      // Variant options
      variant: {
        default: "bg-primary text-primary-foreground",
        outline: "border border-input bg-background",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    // Compound variants (combinations)
    compoundVariants: [
      {
        variant: "outline",
        size: "lg",
        class: "border-2",
      },
    ],
    // Default values
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

// Extract variant props type
export interface ComponentProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof componentVariants> {}
```

## Accessibility Best Practices

### Semantic HTML

```tsx
// Good: Use semantic elements
<button type="button">Click me</button>
<nav aria-label="Main navigation">...</nav>
<main>...</main>

// Avoid: Non-semantic divs
<div onClick={handleClick}>Click me</div>  // ❌
```

### ARIA Attributes

```tsx
// Labels and descriptions
<button aria-label="Close dialog">
  <X />
</button>

<input
  aria-describedby="email-hint"
  aria-invalid={!!error}
/>
<p id="email-hint">We'll never share your email</p>

// Live regions
<div role="alert" aria-live="polite">
  {statusMessage}
</div>

// States
<button aria-expanded={isOpen} aria-controls="menu">
  Menu
</button>
<div id="menu" hidden={!isOpen}>...</div>
```

### Focus Management

```tsx
// Visible focus indicators
className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"

// Trap focus in modals (Radix handles this)
<DialogContent>
  {/* Focus automatically trapped */}
</DialogContent>

// Skip to main content
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

### Screen Reader Support

```tsx
// Visually hidden but screen-reader accessible
<span className="sr-only">Close</span>

// Hide decorative elements
<svg aria-hidden="true">...</svg>

// Meaningful alt text
<img src="profile.jpg" alt="John Doe's profile picture" />
<img src="decorative.jpg" alt="" />  // Decorative images
```

## Export Patterns

### Component Exports from `src/index.ts`

```tsx
// Export UI primitives
export { Button, buttonVariants } from "./components/ui/button"
export { Dialog, DialogContent, DialogHeader, DialogTitle } from "./components/ui/dialog"
export { Input } from "./components/ui/input"

// Export domain components
export { BookingTimeline } from "./components/booking/booking-timeline"
export type { BookingTimelineProps } from "./components/booking/booking-timeline"

// Export utilities
export { cn } from "./lib/utils"

// Group exports by feature
export * from "./components/ui/button"
export * from "./components/ui/dialog"
```

### File-level Exports

```tsx
// Named exports (preferred)
export { Component }
export type { ComponentProps }

// Default exports (avoid for components)
export default Component  // ❌ Avoid

// Export variants for external use
export { componentVariants }
```

## Common Component Patterns

### Card Component

```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

### Select/Dropdown Component

```tsx
import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-9 w-full items-center justify-between gap-2 whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
```

## Common Pitfalls to Avoid

### 1. Forgetting forwardRef for Radix Components
```tsx
// ❌ Wrong: Radix won't work properly
const Component = (props: ComponentProps) => {
  return <RadixPrimitive.Root {...props} />
}

// ✅ Correct: Use forwardRef
const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  (props, ref) => {
    return <RadixPrimitive.Root ref={ref} {...props} />
  }
)
```

### 2. Not Setting displayName
```tsx
// ❌ Wrong: Debug tools show "Anonymous"
const Component = React.forwardRef(...)

// ✅ Correct: Set displayName
const Component = React.forwardRef(...)
Component.displayName = "Component"
```

### 3. Hardcoding Colors Instead of Tokens
```tsx
// ❌ Wrong: Hardcoded colors break theming
className="bg-blue-600 text-white border-gray-300"

// ✅ Correct: Use design tokens
className="bg-primary text-primary-foreground border-input"
```

### 4. Not Spreading Props Last
```tsx
// ❌ Wrong: Props override is impossible
<div className="fixed-class" {...props} />

// ✅ Correct: Allow prop overrides
<div {...props} className={cn("base-class", className)} />
```

### 5. Missing Accessibility Attributes
```tsx
// ❌ Wrong: No accessibility
<button onClick={handleClick}>
  <X />
</button>

// ✅ Correct: Include ARIA labels
<button onClick={handleClick} aria-label="Close">
  <X />
  <span className="sr-only">Close</span>
</button>
```

### 6. Not Using the cn() Helper
```tsx
// ❌ Wrong: Manual class merging
<div className={`base-class ${className || ''}`} />

// ✅ Correct: Use cn() helper
<div className={cn("base-class", className)} />
```

### 7. Incorrect Variant Type Extraction
```tsx
// ❌ Wrong: Manual type definition
type ComponentVariant = "default" | "secondary"

// ✅ Correct: Extract from CVA
export interface ComponentProps
  extends VariantProps<typeof componentVariants> {}
```

### 8. Not Handling asChild Pattern
```tsx
// ❌ Wrong: Missing Slot support
const Button = ({ children, ...props }: ButtonProps) => {
  return <button {...props}>{children}</button>
}

// ✅ Correct: Support asChild with Slot
const Button = ({ asChild, children, ...props }: ButtonProps) => {
  const Comp = asChild ? Slot : "button"
  return <Comp {...props}>{children}</Comp>
}
```

## Testing Component Integration

### Manual Testing Checklist
- [ ] Component renders without errors
- [ ] All variants display correctly
- [ ] Responsive behavior works across breakpoints
- [ ] Focus states are visible
- [ ] Keyboard navigation works (Tab, Enter, Escape, arrows)
- [ ] Screen reader announces content correctly
- [ ] Component works in light and dark themes
- [ ] Props are properly typed and validated

### Usage Example Template
```tsx
// In a test file or Storybook story
import { Component } from "@/components/ui/component"

export function ComponentDemo() {
  return (
    <div className="space-y-4">
      <Component variant="default">Default variant</Component>
      <Component variant="secondary" size="sm">Small secondary</Component>
      <Component variant="outline" size="lg">Large outline</Component>
    </div>
  )
}
```

## Quick Reference Commands

### Create new component file
```bash
# UI primitive
touch src/components/ui/component-name.tsx

# Domain component
mkdir -p src/components/domain-name
touch src/components/domain-name/component-name.tsx
```

### Add to exports
```typescript
// In src/index.ts
export { ComponentName } from "./components/ui/component-name"
export type { ComponentNameProps } from "./components/ui/component-name"
```

### Install dependencies (if needed)
```bash
npm install @radix-ui/react-[primitive-name]
npm install lucide-react  # For icons
```

## Summary Checklist

When creating a new component, ensure:

- [ ] Component is in the correct directory (ui/ or domain/)
- [ ] TypeScript props interface with JSDoc comments
- [ ] React.forwardRef for ref forwarding
- [ ] displayName is set
- [ ] CVA variants defined (if applicable)
- [ ] cn() helper used for className merging
- [ ] Design tokens used (not hardcoded colors)
- [ ] Accessibility attributes included (ARIA, labels, focus)
- [ ] Component and types exported from src/index.ts
- [ ] Component follows established patterns
- [ ] No common pitfalls present

---

**Version:** 1.0.0
**Last Updated:** 2025-11-05
**Maintained By:** ABS UI Toolkit Team
