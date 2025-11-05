---
name: Design System Alignment
description: Guidelines for maintaining design consistency using Tailwind CSS 4 design tokens, Radix UI patterns, and WCAG 2.1 Level AA accessibility standards
tags: [design-system, accessibility, tailwind, radix-ui, wcag]
version: 1.0.0
---

# Design System Alignment

This skill provides comprehensive guidelines for maintaining design system consistency in the ABS UI Toolkit using Tailwind CSS 4 design tokens, Radix UI compound component patterns, responsive design best practices, and WCAG 2.1 Level AA accessibility compliance.

## Tailwind CSS 4 Design Tokens

### Design Token Location

All design tokens are defined in `src/index.css` using CSS variables within the `@theme` directive:

```css
@import 'tailwindcss';

@theme {
  /* Color Tokens */
  --color-background: oklch(100% 0 0);
  --color-foreground: oklch(9.84% 0 0);
  --color-card: oklch(100% 0 0);
  --color-card-foreground: oklch(9.84% 0 0);
  --color-popover: oklch(100% 0 0);
  --color-popover-foreground: oklch(9.84% 0 0);

  --color-primary: oklch(47.48% 0.246 262.93);
  --color-primary-foreground: oklch(98.04% 0 0);

  --color-secondary: oklch(96.08% 0 0);
  --color-secondary-foreground: oklch(9.84% 0 0);

  --color-muted: oklch(96.08% 0 0);
  --color-muted-foreground: oklch(45.1% 0.004 286.75);

  --color-accent: oklch(96.08% 0 0);
  --color-accent-foreground: oklch(9.84% 0 0);

  --color-destructive: oklch(57.6% 0.242 29.23);
  --color-destructive-foreground: oklch(98.04% 0 0);

  --color-border: oklch(89.84% 0 0);
  --color-input: oklch(89.84% 0 0);
  --color-ring: oklch(47.48% 0.246 262.93);

  /* Typography Tokens */
  --font-sans: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;

  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;

  --line-height-xs: 1rem;
  --line-height-sm: 1.25rem;
  --line-height-base: 1.5rem;
  --line-height-lg: 1.75rem;
  --line-height-xl: 1.75rem;

  /* Spacing Tokens */
  --spacing-0: 0;
  --spacing-px: 1px;
  --spacing-0\.5: 0.125rem;
  --spacing-1: 0.25rem;
  --spacing-1\.5: 0.375rem;
  --spacing-2: 0.5rem;
  --spacing-2\.5: 0.625rem;
  --spacing-3: 0.75rem;
  --spacing-3\.5: 0.875rem;
  --spacing-4: 1rem;
  --spacing-5: 1.25rem;
  --spacing-6: 1.5rem;
  --spacing-7: 1.75rem;
  --spacing-8: 2rem;
  --spacing-9: 2.25rem;
  --spacing-10: 2.5rem;
  --spacing-11: 2.75rem;
  --spacing-12: 3rem;
  --spacing-14: 3.5rem;
  --spacing-16: 4rem;
  --spacing-20: 5rem;
  --spacing-24: 6rem;
  --spacing-28: 7rem;
  --spacing-32: 8rem;

  /* Border Radius Tokens */
  --radius-sm: 0.125rem;
  --radius-base: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-3xl: 1.5rem;
  --radius-full: 9999px;

  /* Shadow Tokens */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-base: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

  /* Breakpoint Tokens */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;

  /* Animation Tokens */
  --duration-75: 75ms;
  --duration-100: 100ms;
  --duration-150: 150ms;
  --duration-200: 200ms;
  --duration-300: 300ms;
  --duration-500: 500ms;
  --duration-700: 700ms;
  --duration-1000: 1000ms;

  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Dark Mode Support

```css
@media (prefers-color-scheme: dark) {
  @theme {
    --color-background: oklch(9.84% 0 0);
    --color-foreground: oklch(98.04% 0 0);
    --color-card: oklch(9.84% 0 0);
    --color-card-foreground: oklch(98.04% 0 0);

    --color-primary: oklch(70.7% 0.196 262.93);
    --color-primary-foreground: oklch(26.08% 0.049 262.93);

    --color-secondary: oklch(19.61% 0 0);
    --color-secondary-foreground: oklch(98.04% 0 0);

    --color-muted: oklch(19.61% 0 0);
    --color-muted-foreground: oklch(64.71% 0.004 286.75);

    --color-accent: oklch(19.61% 0 0);
    --color-accent-foreground: oklch(98.04% 0 0);

    --color-border: oklch(19.61% 0 0);
    --color-input: oklch(19.61% 0 0);
  }
}
```

## Design Token Categories

### Color System

**Usage in Components:**

```typescript
// Use semantic color tokens, not raw colors
export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm',
        className
      )}
      {...props}
    />
  )
}

// Variants using color tokens
export function Alert({ variant, className, ...props }: AlertProps) {
  return (
    <div
      className={cn(
        'rounded-lg border p-4',
        variant === 'default' && 'bg-background text-foreground',
        variant === 'destructive' && 'bg-destructive/15 text-destructive border-destructive/50',
        className
      )}
      {...props}
    />
  )
}
```

**Color Token Guidelines:**
- Always use semantic tokens (`bg-primary`, `text-foreground`)
- Never use raw color values (`bg-blue-500`, `text-gray-900`)
- Ensure foreground/background pairings meet contrast requirements
- Use opacity modifiers for subtle effects (`bg-primary/10`)

### Typography System

**Font Families:**
- `font-sans`: Default UI text
- `font-mono`: Code, technical content

**Font Sizes:**
```typescript
// Use consistent typography scale
export function Text({ size = 'base', className, children }: TextProps) {
  return (
    <p
      className={cn(
        size === 'xs' && 'text-xs',
        size === 'sm' && 'text-sm',
        size === 'base' && 'text-base',
        size === 'lg' && 'text-lg',
        size === 'xl' && 'text-xl',
        size === '2xl' && 'text-2xl',
        size === '3xl' && 'text-3xl',
        className
      )}
    >
      {children}
    </p>
  )
}
```

**Typography Guidelines:**
- Use appropriate font size for hierarchy
- Maintain consistent line heights
- Use font weights intentionally (400 normal, 500 medium, 600 semibold, 700 bold)
- Ensure readable line lengths (45-75 characters)

### Spacing System

**Consistent Spacing:**

```typescript
// Use spacing tokens consistently
export function Stack({ gap = '4', className, children }: StackProps) {
  return (
    <div
      className={cn(
        'flex flex-col',
        gap === '1' && 'gap-1',
        gap === '2' && 'gap-2',
        gap === '3' && 'gap-3',
        gap === '4' && 'gap-4',
        gap === '6' && 'gap-6',
        gap === '8' && 'gap-8',
        className
      )}
    >
      {children}
    </div>
  )
}
```

**Spacing Guidelines:**
- Use 4px base unit (spacing scale)
- Prefer consistent gaps (4, 8, 12, 16, 24, 32)
- Use padding tokens for internal spacing
- Use margin tokens sparingly (prefer gap/space utilities)

### Border and Radius

**Border Radius:**

```typescript
export function Button({ rounded = 'md', className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        rounded === 'none' && 'rounded-none',
        rounded === 'sm' && 'rounded-sm',
        rounded === 'md' && 'rounded-md',
        rounded === 'lg' && 'rounded-lg',
        rounded === 'full' && 'rounded-full',
        className
      )}
      {...props}
    />
  )
}
```

**Border Guidelines:**
- Use `border` (1px) for default borders
- Use `border-2` for emphasis
- Use `divide-*` utilities for separators
- Match border radius to component size (smaller = tighter radius)

### Shadows and Elevation

**Shadow System:**

```typescript
export function Card({ elevation = 'sm', className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-card',
        elevation === 'none' && 'shadow-none',
        elevation === 'sm' && 'shadow-sm',
        elevation === 'base' && 'shadow',
        elevation === 'md' && 'shadow-md',
        elevation === 'lg' && 'shadow-lg',
        className
      )}
      {...props}
    />
  )
}
```

**Shadow Guidelines:**
- Use shadows to indicate elevation and interaction
- Increase shadow on hover for interactive elements
- Use subtle shadows for depth
- Avoid excessive shadowing (keep it minimal)

## Radix UI Compound Component Patterns

### Accordion Pattern

```typescript
import * as AccordionPrimitive from '@radix-ui/react-accordion'

// Root compound component
export function Accordion({ type = 'single', ...props }: AccordionProps) {
  return <AccordionPrimitive.Root type={type} collapsible {...props} />
}

// Item component
export function AccordionItem({ className, ...props }: AccordionItemProps) {
  return (
    <AccordionPrimitive.Item
      className={cn('border-b', className)}
      {...props}
    />
  )
}

// Trigger component with visual states
export function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionTriggerProps) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          'flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline',
          'data-[state=open]:text-primary',
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-180" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

// Content component with animation
export function AccordionContent({
  className,
  children,
  ...props
}: AccordionContentProps) {
  return (
    <AccordionPrimitive.Content
      className={cn(
        'overflow-hidden text-sm transition-all',
        'data-[state=closed]:animate-accordion-up',
        'data-[state=open]:animate-accordion-down',
        className
      )}
      {...props}
    >
      <div className="pb-4 pt-0">{children}</div>
    </AccordionPrimitive.Content>
  )
}

// Usage
<Accordion type="single">
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>
      Yes. It adheres to the WAI-ARIA design pattern.
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

### Tabs Pattern

```typescript
import * as TabsPrimitive from '@radix-ui/react-tabs'

export function Tabs({ className, ...props }: TabsProps) {
  return (
    <TabsPrimitive.Root
      className={cn('w-full', className)}
      {...props}
    />
  )
}

export function TabsList({ className, ...props }: TabsListProps) {
  return (
    <TabsPrimitive.List
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
        className
      )}
      {...props}
    />
  )
}

export function TabsTrigger({ className, ...props }: TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
        className
      )}
      {...props}
    />
  )
}

export function TabsContent({ className, ...props }: TabsContentProps) {
  return (
    <TabsPrimitive.Content
      className={cn(
        'mt-2 ring-offset-background',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
      {...props}
    />
  )
}

// Usage
<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account content</TabsContent>
  <TabsContent value="password">Password content</TabsContent>
</Tabs>
```

### Dropdown Menu Pattern

```typescript
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'

export const DropdownMenu = DropdownMenuPrimitive.Root
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
export const DropdownMenuGroup = DropdownMenuPrimitive.Group

export function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}: DropdownMenuContentProps) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

export function DropdownMenuItem({
  className,
  inset,
  ...props
}: DropdownMenuItemProps) {
  return (
    <DropdownMenuPrimitive.Item
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
        'transition-colors focus:bg-accent focus:text-accent-foreground',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        inset && 'pl-8',
        className
      )}
      {...props}
    />
  )
}

// Usage
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuItem>Logout</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Responsive Design with Breakpoints

### Breakpoint System

**Tailwind Breakpoints:**
- `sm`: 640px (small tablets)
- `md`: 768px (tablets)
- `lg`: 1024px (laptops)
- `xl`: 1280px (desktops)
- `2xl`: 1536px (large desktops)

### Mobile-First Approach

```typescript
export function ResponsiveGrid({ children }: ResponsiveGridProps) {
  return (
    <div
      className={cn(
        // Mobile: single column
        'grid grid-cols-1 gap-4',
        // Tablet: 2 columns
        'md:grid-cols-2 md:gap-6',
        // Desktop: 3 columns
        'lg:grid-cols-3 lg:gap-8'
      )}
    >
      {children}
    </div>
  )
}
```

### Responsive Typography

```typescript
export function Hero({ title, description }: HeroProps) {
  return (
    <div className="space-y-4">
      <h1
        className={cn(
          // Mobile
          'text-3xl font-bold',
          // Tablet
          'md:text-4xl',
          // Desktop
          'lg:text-5xl xl:text-6xl'
        )}
      >
        {title}
      </h1>
      <p
        className={cn(
          // Mobile
          'text-base text-muted-foreground',
          // Tablet and above
          'md:text-lg lg:text-xl'
        )}
      >
        {description}
      </p>
    </div>
  )
}
```

### Responsive Layout

```typescript
export function Sidebar({ children, aside }: SidebarProps) {
  return (
    <div
      className={cn(
        // Mobile: stacked layout
        'flex flex-col gap-4',
        // Desktop: side-by-side layout
        'lg:flex-row lg:gap-8'
      )}
    >
      <main className="flex-1 lg:order-1">{children}</main>
      <aside className="lg:order-2 lg:w-80">{aside}</aside>
    </div>
  )
}
```

## Custom Hooks Usage

### useBreakpoint Hook

```typescript
// src/hooks/useBreakpoint.ts
import { useEffect, useState } from 'react'

type Breakpoint = 'mobile' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('mobile')

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth
      if (width >= 1536) setBreakpoint('2xl')
      else if (width >= 1280) setBreakpoint('xl')
      else if (width >= 1024) setBreakpoint('lg')
      else if (width >= 768) setBreakpoint('md')
      else if (width >= 640) setBreakpoint('sm')
      else setBreakpoint('mobile')
    }

    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])

  return breakpoint
}

// Usage in components
export function ResponsiveComponent() {
  const breakpoint = useBreakpoint()

  return (
    <div>
      {breakpoint === 'mobile' && <MobileLayout />}
      {breakpoint === 'md' && <TabletLayout />}
      {(breakpoint === 'lg' || breakpoint === 'xl') && <DesktopLayout />}
    </div>
  )
}
```

### useMobile Hook

```typescript
// src/hooks/useMobile.ts
import { useEffect, useState } from 'react'

export function useMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [breakpoint])

  return isMobile
}

// Usage
export function Navigation() {
  const isMobile = useMobile()

  return isMobile ? <MobileNav /> : <DesktopNav />
}
```

### useIsDesktop Hook

```typescript
// src/hooks/useIsDesktop.ts
import { useEffect, useState } from 'react'

export function useIsDesktop(breakpoint: number = 1024): boolean {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= breakpoint)
    }

    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [breakpoint])

  return isDesktop
}

// Usage
export function DataTable() {
  const isDesktop = useIsDesktop()

  return (
    <div>
      {isDesktop ? (
        <FullDataTable />
      ) : (
        <CompactDataTable />
      )}
    </div>
  )
}
```

## WCAG 2.1 Level AA Compliance Checklist

### Color Contrast

**Requirements:**
- Normal text (< 18pt): 4.5:1 contrast ratio
- Large text (≥ 18pt or ≥ 14pt bold): 3:1 contrast ratio
- UI components and graphics: 3:1 contrast ratio

**Implementation:**

```typescript
// Ensure sufficient contrast
export function Button({ variant, children }: ButtonProps) {
  return (
    <button
      className={cn(
        // Default: white text on primary (meets 4.5:1)
        variant === 'default' && 'bg-primary text-primary-foreground',
        // Outline: colored border and text (meets 3:1 for UI components)
        variant === 'outline' && 'border-2 border-primary text-primary',
        // Ghost: subtle but accessible
        variant === 'ghost' && 'text-foreground hover:bg-accent hover:text-accent-foreground'
      )}
    >
      {children}
    </button>
  )
}
```

**Checklist:**
- [ ] All text meets minimum contrast ratios
- [ ] Interactive elements have 3:1 contrast against background
- [ ] Focus indicators have sufficient contrast
- [ ] Error states use color + text/icons (not color alone)
- [ ] Disabled states maintain readability

### Semantic HTML Requirements

**Use Proper HTML Elements:**

```typescript
// Good: Semantic HTML
export function Article({ title, content }: ArticleProps) {
  return (
    <article>
      <header>
        <h1>{title}</h1>
      </header>
      <main>{content}</main>
      <footer>Published on {date}</footer>
    </article>
  )
}

// Bad: Div soup
export function Article({ title, content }: ArticleProps) {
  return (
    <div>
      <div className="text-2xl font-bold">{title}</div>
      <div>{content}</div>
    </div>
  )
}
```

**Semantic Checklist:**
- [ ] Use `<button>` for actions, `<a>` for navigation
- [ ] Use heading hierarchy (`<h1>` through `<h6>`)
- [ ] Use `<nav>` for navigation regions
- [ ] Use `<main>` for primary content
- [ ] Use `<article>`, `<section>`, `<aside>` appropriately
- [ ] Use `<form>` for form submissions
- [ ] Use `<label>` associated with form controls
- [ ] Use `<table>` for tabular data (not layout)

### ARIA Labeling

**Proper ARIA Usage:**

```typescript
// Button with icon needs aria-label
export function IconButton({ icon: Icon, label, ...props }: IconButtonProps) {
  return (
    <button aria-label={label} {...props}>
      <Icon className="h-4 w-4" />
      <span className="sr-only">{label}</span>
    </button>
  )
}

// Complex widget needs role and state
export function CustomSelect({ value, options, onChange }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-controls="select-listbox"
    >
      <button
        aria-label="Select option"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value || 'Select...'}
      </button>
      {isOpen && (
        <ul role="listbox" id="select-listbox">
          {options.map((option) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

**ARIA Checklist:**
- [ ] All images have `alt` text
- [ ] Icon-only buttons have `aria-label`
- [ ] Form inputs have labels (visible or `aria-label`)
- [ ] Required fields marked with `aria-required`
- [ ] Invalid fields marked with `aria-invalid` and `aria-describedby`
- [ ] Dynamic content changes announced with `aria-live`
- [ ] Modal dialogs have `role="dialog"` and `aria-modal="true"`
- [ ] Disclosure widgets use `aria-expanded`

### Keyboard Navigation

**Full Keyboard Support:**

```typescript
export function Menu({ items }: MenuProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex((prev) => (prev + 1) % items.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex((prev) => (prev - 1 + items.length) % items.length)
        break
      case 'Home':
        e.preventDefault()
        setActiveIndex(0)
        break
      case 'End':
        e.preventDefault()
        setActiveIndex(items.length - 1)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        items[activeIndex].onClick()
        break
      case 'Escape':
        e.preventDefault()
        onClose()
        break
    }
  }

  return (
    <ul role="menu" onKeyDown={handleKeyDown}>
      {items.map((item, index) => (
        <li
          key={item.id}
          role="menuitem"
          tabIndex={index === activeIndex ? 0 : -1}
          className={cn(
            'px-4 py-2',
            index === activeIndex && 'bg-accent'
          )}
        >
          {item.label}
        </li>
      ))}
    </ul>
  )
}
```

**Keyboard Checklist:**
- [ ] All interactive elements reachable via Tab
- [ ] Focus order is logical and follows visual layout
- [ ] Focus indicators are visible (2px outline minimum)
- [ ] No keyboard traps (can Tab out of all components)
- [ ] Arrow keys work for menus, tabs, and lists
- [ ] Escape closes modals and dropdowns
- [ ] Enter/Space activates buttons and controls
- [ ] Skip links provided for navigation

### Color Contrast Validation

**Testing Tools:**
- WebAIM Contrast Checker
- Chrome DevTools Accessibility Panel
- axe DevTools browser extension

**Automated Testing:**

```typescript
// Example test with jest-axe
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('Button accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<Button>Click me</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('meets contrast requirements', () => {
    render(<Button variant="default">Button</Button>)
    const button = screen.getByRole('button')

    // Verify contrast programmatically or visually
    expect(button).toHaveClass('bg-primary text-primary-foreground')
  })
})
```

## Design System Violations and Fixes

### Common Violations

#### Violation: Using Raw Colors

```typescript
// ❌ Bad: Raw colors
<div className="bg-blue-500 text-white">Content</div>

// ✅ Good: Semantic tokens
<div className="bg-primary text-primary-foreground">Content</div>
```

#### Violation: Inconsistent Spacing

```typescript
// ❌ Bad: Arbitrary spacing
<div className="mt-3 mb-5 p-7">Content</div>

// ✅ Good: Consistent spacing tokens
<div className="my-4 p-6">Content</div>
```

#### Violation: Missing Focus States

```typescript
// ❌ Bad: No focus indicator
<button className="bg-primary">Click</button>

// ✅ Good: Visible focus state
<button className="bg-primary focus:ring-2 focus:ring-ring focus:ring-offset-2">
  Click
</button>
```

#### Violation: Poor Color Contrast

```typescript
// ❌ Bad: Insufficient contrast
<p className="text-gray-400 bg-white">Light gray on white</p>

// ✅ Good: Sufficient contrast
<p className="text-muted-foreground bg-background">Readable text</p>
```

#### Violation: Missing ARIA Labels

```typescript
// ❌ Bad: Icon without label
<button><XIcon /></button>

// ✅ Good: Accessible label
<button aria-label="Close">
  <XIcon />
  <span className="sr-only">Close</span>
</button>
```

#### Violation: Non-semantic HTML

```typescript
// ❌ Bad: Div as button
<div onClick={handleClick} className="cursor-pointer">
  Click me
</div>

// ✅ Good: Proper button element
<button onClick={handleClick}>
  Click me
</button>
```

### Design System Compliance Checklist

#### Colors
- [ ] Only semantic color tokens used
- [ ] No hardcoded color values
- [ ] Contrast ratios meet WCAG AA standards
- [ ] Dark mode support included

#### Typography
- [ ] Consistent font scale used
- [ ] Proper heading hierarchy
- [ ] Line heights appropriate for font sizes
- [ ] Responsive typography implemented

#### Spacing
- [ ] Consistent spacing scale (4px base)
- [ ] No arbitrary margin/padding values
- [ ] Gap utilities used instead of margins
- [ ] Responsive spacing adjustments

#### Components
- [ ] Built on Radix UI primitives
- [ ] Proper forwardRef usage
- [ ] Variants use class-variance-authority
- [ ] Exported from src/index.ts

#### Accessibility
- [ ] WCAG 2.1 Level AA compliant
- [ ] Keyboard navigation supported
- [ ] ARIA labels where needed
- [ ] Focus indicators visible
- [ ] Semantic HTML used
- [ ] Screen reader tested

#### Responsive
- [ ] Mobile-first approach
- [ ] Works on all breakpoints (sm, md, lg, xl, 2xl)
- [ ] Touch-friendly on mobile
- [ ] Proper responsive hooks used
