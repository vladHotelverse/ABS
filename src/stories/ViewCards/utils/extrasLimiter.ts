/**
 * Data filtering utilities for ViewCards components
 *
 * This layer handles item limiting logic that was previously embedded in UI components.
 * Following the pattern from SpecialOffers/utils (pure functions, structured returns).
 */

/**
 * Result of limiting items with visibility information
 *
 * @template T - Type of items being limited
 */
export interface LimitedItems<T> {
  /** Items that should be displayed (up to maxVisible) */
  visible: T[]
  /** Number of items hidden from view */
  hiddenCount: number
}

/**
 * Limits an array of items to a maximum visible count
 *
 * Business rule: Display up to N items with indication of how many are hidden.
 * Used to prevent overwhelming UI with long lists (e.g., extras, customizations).
 *
 * @template T - Type of items in the array (generic for reusability)
 * @param items - Array of items to limit
 * @param maxVisible - Maximum number of items to show (default: 5)
 * @returns Object with visible items and hidden count
 *
 * @example
 * ```typescript
 * const extras = [item1, item2, item3, item4, item5, item6, item7]
 * const { visible, hiddenCount } = limitExtras(extras, 5)
 * // visible: [item1, item2, item3, item4, item5]
 * // hiddenCount: 2
 * ```
 */
export function limitExtras<T>(items: T[], maxVisible: number = 5): LimitedItems<T> {
  // Guard: Ensure maxVisible is non-negative
  const safeMaxVisible = Math.max(0, maxVisible)

  // Calculate visible items and hidden count
  const visible = items.slice(0, safeMaxVisible)
  const hiddenCount = Math.max(0, items.length - safeMaxVisible)

  return {
    visible,
    hiddenCount,
  }
}
