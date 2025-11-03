# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ABS UI Toolkit is a React component library playground built with Vite, Tailwind CSS 4, and Radix UI. This repository serves as a lightweight development environment for building and documenting reusable UI components using Storybook.

**Tech Stack:**
- React 19 with TypeScript
- Vite (build tool and dev server)
- Tailwind CSS 4 with design tokens
- Radix UI (accessibility primitives)
- Storybook 8 (component documentation)
- Vitest + Playwright (testing)
- i18next (internationalization: en, es)

## Development Commands

```bash
# Install dependencies
pnpm install

# Development server (http://localhost:5173)
pnpm dev

# Storybook (http://localhost:6006)
pnpm storybook

# Build for production
pnpm build

# Lint code
pnpm lint

# Run unit tests (watch mode)
pnpm test

# Run unit tests once
pnpm test run

# Run tests with coverage
pnpm test --coverage

# Build Storybook for deployment
pnpm build-storybook
```

## Architecture

### Component Organization

The repository follows a three-tier component structure:

1. **UI Primitives** (`src/components/ui/`)
   - Reusable, low-level components built on Radix UI
   - Examples: Button, Card, Dialog, Input, Label, etc.
   - Export all components through `src/index.ts` for external consumption
   - Based on shadcn/ui architecture (see `components.json`)

2. **Domain Components** (`src/components/`)
   - **`upsell/`**: Composite components for booking and pricing features
     - BookingBanner, PricingSummaryPanel, RoomCustomization, etc.
   - **`multimedia/`**: Media components (Matterport, Video)
   - These components compose UI primitives into higher-level features

3. **Stories** (`src/stories/`)
   - Storybook documentation for components
   - Located separately from component files
   - Named pattern: `ComponentName.stories.tsx`

### Path Aliases

All configurations use `@` alias for imports:
```typescript
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useBreakpoint } from '@/hooks/useBreakpoint'
```

### Styling System

- **Tailwind 4** with CSS variables for theming
- Design tokens defined in `src/index.css`
- `cn()` utility (`src/lib/utils.ts`) for merging Tailwind classes with clsx + tailwind-merge
- Component variants managed with `class-variance-authority`

### Internationalization

- i18next with react-i18next integration
- Language detection from localStorage → browser → HTML tag
- Translation files in `src/i18n/locales/` (en.json, es.json)
- Centralized translation types in `src/i18n/translations.ts`

### Custom Hooks

Responsive design hooks in `src/hooks/`:
- `useBreakpoint`: Detect current Tailwind breakpoint
- `useIsDesktop`: Desktop viewport detection
- `useMobile`: Mobile viewport detection
- `useDynamicMaxHeight`: Dynamic max-height calculations
- `useSmoothHeightTransition`: Animated height transitions

## Testing

### Unit Tests (Vitest)
- Test environment: `happy-dom`
- Setup file: `src/__tests__/setup/vitest.setup.ts` (if it exists)
- Coverage thresholds: 70% (branches, functions, lines, statements)
- Excludes: Stories, type files, mock data, config files

### E2E Tests (Playwright)
- Test directory: `src/__tests__/e2e/`
- Runs against `http://localhost:5173`
- Configured for Desktop Chrome/Firefox/Safari + Mobile Chrome/Safari
- Auto-starts dev server before tests

## Storybook Configuration

- Stories auto-discovered from `src/**/*.stories.@(ts|tsx)` and `src/**/*.mdx`
- Autodocs enabled with `autodocs: 'tag'`
- Tailwind plugin integrated in Vite final config
- Path alias `@` configured for story imports

## Important Conventions

- **UI components location**: Only reusable primitives belong in `src/components/ui/`
- **Icon library**: Uses `lucide-react` (as per `components.json`)
- **Component exports**: All UI primitives exported from `src/index.ts`
- **No prop drilling**: Complex state should use React Context or composition patterns
- **Accessibility**: All interactive components must use Radix UI primitives for ARIA compliance

## Key Configuration Files

- `components.json`: shadcn/ui configuration (New York style, neutral base color)
- `vite.config.ts`: Vite + React + Tailwind plugin, `@` alias
- `vitest.config.ts`: Test configuration with `@` alias resolution
- `.storybook/main.ts`: Storybook config with Tailwind integration
- `playwright.config.ts`: E2E test configuration
- `tsconfig.json`: TypeScript path aliases
