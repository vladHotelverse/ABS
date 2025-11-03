import { useMemo } from 'react'
import { useBreakpoint, type Breakpoint } from '@/hooks/useBreakpoint'
import type { RoomCustomizationCategory } from '../../mockData'

export interface AttributeDisplayConfig {
  /**
   * Map of breakpoint -> number of attributes visible before the user expands a category.
   * Provide a `default` value to be used when a breakpoint is not explicitly configured.
   */
  initialVisibleCount: Partial<Record<Breakpoint | 'default', number>>

  /**
   * Minimum number of attributes required before the "show more" button appears.
   * Defaults to the resolved `initialVisibleCount`.
   */
  showMoreThreshold?: number

  /**
   * Custom label to render when the category is collapsed. Receives the number of hidden items.
   */
  showMoreLabel?: (hiddenCount: number) => string

  /**
   * Custom label to render when the category is expanded.
   */
  showLessLabel?: string
}

export interface FormattedAttributeCategory extends RoomCustomizationCategory {
  attributes: RoomCustomizationCategory['attributes']
}

export const sortAttributesByExclusivity = (
  categories: RoomCustomizationCategory[]
): FormattedAttributeCategory[] => {
  return categories.map((category) => ({
    ...category,
    attributes: [...category.attributes].sort(
      (a, b) => (a.exclusivityRatio ?? 0) - (b.exclusivityRatio ?? 0)
    ),
  }))
}

export const resolveInitialVisibleCount = (
  breakpoint: Breakpoint,
  config: AttributeDisplayConfig
): number => {
  const { initialVisibleCount } = config
  const fallbackOrder: Array<Breakpoint | 'default'> = [breakpoint, 'default', 'lg', 'md', 'sm', 'mobile']

  for (const key of fallbackOrder) {
    const value = initialVisibleCount[key]
    if (typeof value === 'number' && value >= 0) {
      return value
    }
  }

  const firstDefined = Object.values(initialVisibleCount).find((value): value is number => typeof value === 'number')
  return typeof firstDefined === 'number' ? firstDefined : 0
}

export const useAttributeDisplaySettings = (config: AttributeDisplayConfig) => {
  const breakpoint = useBreakpoint()

  return useMemo(() => {
    const initialVisibleCount = resolveInitialVisibleCount(breakpoint, config)
    return {
      initialVisibleCount,
      showMoreThreshold: config.showMoreThreshold ?? initialVisibleCount,
      showMoreLabel: config.showMoreLabel,
      showLessLabel: config.showLessLabel,
    }
  }, [breakpoint, config])
}

export const DEFAULT_ATTRIBUTE_DISPLAY_CONFIG: AttributeDisplayConfig = {
  initialVisibleCount: {
    default: 2,
    mobile: 1,
    sm: 2,
    md: 2,
    lg: 2,
    xl: 3,
    '2xl': 3,
  },
  showMoreThreshold: 4,
  showMoreLabel: (hidden) => (hidden > 0 ? `Show More (${hidden} more)` : 'Show More'),
  showLessLabel: 'Show Less',
}
