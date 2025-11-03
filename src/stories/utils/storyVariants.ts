// Story variants system for consistent state management across stories

export interface StoryVariant<T = any> {
  name: string
  description?: string
  args: Partial<T>
  parameters?: Record<string, any>
}

// Common variants that can be applied to most components
export const COMMON_VARIANTS = {
  loading: {
    name: 'Loading',
    description: 'Component in loading state',
    args: { isLoading: true },
  },
  error: {
    name: 'Error',
    description: 'Component in error state',
    args: { hasError: true, error: 'Something went wrong' },
  },
  empty: {
    name: 'Empty',
    description: 'Component with no data',
    args: { isEmpty: true },
  },
  disabled: {
    name: 'Disabled',
    description: 'Component in disabled state',
    args: { disabled: true },
  },
  readonly: {
    name: 'Read Only',
    description: 'Component in read-only mode',
    args: { readonly: true },
  },
} as const

// Component-specific variants
export const ROOM_SELECTION_VARIANTS = {
  singleRoom: {
    name: 'Single Room',
    description: 'Display with only one room option',
    args: { roomOptions: [] }, // Will be populated by component
  },
  manyRooms: {
    name: 'Many Rooms',
    description: 'Display with multiple room options',
    args: { roomOptions: [] }, // Will be populated by component
  },
  withBidding: {
    name: 'With Price Bidding',
    description: 'Room selection with bidding functionality',
    args: {
      showPriceSlider: true,
      variant: 'with-slider',
      minPrice: 100,
    },
  },
} as const

export const PRICING_VARIANTS = {
  highValue: {
    name: 'High Value',
    description: 'High-value booking with premium items',
    args: {
      /* Will be populated by component */
    },
  },
  withTaxes: {
    name: 'With Taxes',
    description: 'Pricing breakdown including taxes',
    args: { pricing: { subtotal: 335, taxes: 50.25 } },
  },
  emptyCart: {
    name: 'Empty Cart',
    description: 'No items in the cart',
    args: { items: [] },
  },
} as const

export const SPECIAL_OFFERS_VARIANTS = {
  popular: {
    name: 'Popular Offers',
    description: 'Display with popular/featured offers',
    args: {
      /* Will be populated by component */
    },
  },
  unavailable: {
    name: 'With Unavailable',
    description: 'Some offers are unavailable',
    args: { unavailableOffers: [2, 3] },
  },
  singleOffer: {
    name: 'Single Offer',
    description: 'Display with only one offer',
    args: {
      /* Will be populated by component */
    },
  },
} as const

// Utility functions for creating variant combinations
export function createVariantsWithCommon(
  componentVariants: Record<string, StoryVariant>,
  includeCommon: (keyof typeof COMMON_VARIANTS)[] = ['loading', 'error', 'empty']
): Record<string, StoryVariant> {
  const result: Record<string, StoryVariant> = { ...componentVariants }

  includeCommon.forEach((key) => {
    if (COMMON_VARIANTS[key]) {
      result[key] = COMMON_VARIANTS[key]
    }
  })

  return result
}

export function createResponsiveVariants<T>(
  baseArgs: Partial<T>,
  breakpoints: ('mobile' | 'tablet' | 'desktop')[] = ['mobile', 'tablet', 'desktop']
): Record<string, StoryVariant<T>> {
  const variants: Record<string, StoryVariant<T>> = {}

  breakpoints.forEach((breakpoint) => {
    variants[`${breakpoint}View`] = {
      name: `${breakpoint.charAt(0).toUpperCase() + breakpoint.slice(1)} View`,
      description: `Optimized for ${breakpoint} viewport`,
      args: baseArgs,
      parameters: {
        viewport: {
          defaultViewport: breakpoint,
        },
      },
    }
  })

  return variants
}

// Theme variants for different visual themes
export const THEME_VARIANTS = {
  light: {
    name: 'Light Theme',
    description: 'Default light theme',
    parameters: {
      backgrounds: { default: 'light' },
    },
  },
  dark: {
    name: 'Dark Theme',
    description: 'Dark theme variant',
    parameters: {
      backgrounds: { default: 'dark' },
    },
  },
} as const

// Accessibility variants
export const ACCESSIBILITY_VARIANTS = {
  highContrast: {
    name: 'High Contrast',
    description: 'High contrast mode for accessibility',
    parameters: {
      a11y: { highContrast: true },
    },
  },
  reducedMotion: {
    name: 'Reduced Motion',
    description: 'Reduced motion for accessibility',
    parameters: {
      a11y: { reducedMotion: true },
    },
  },
} as const

// Utility to merge variant args with base args
export function mergeVariantArgs<T>(baseArgs: Partial<T>, variantArgs: Partial<T>): Partial<T> {
  return { ...baseArgs, ...variantArgs }
}

// Type-safe variant creator
export function createTypedVariants() {
  return {
    loading: (): StoryVariant => ({
      name: 'Loading',
      description: 'Loading state',
      args: { isLoading: true },
    }),
    error: (message = 'An error occurred'): StoryVariant => ({
      name: 'Error',
      description: 'Error state',
      args: { hasError: true, error: message },
    }),
    empty: (): StoryVariant => ({
      name: 'Empty',
      description: 'Empty state',
      args: { isEmpty: true },
    }),
  }
}
