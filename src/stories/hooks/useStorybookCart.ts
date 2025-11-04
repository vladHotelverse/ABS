/**
 * Storybook-specific cart management hook
 * Provides local state management for cart items in stories
 * Simulates async operations without needing Zustand or server integration
 */

import { useCallback, useState } from 'react'

export interface CartItem {
  id: string
  name: string
  amount: number
  bookingKey: string // Which room/booking this item belongs to
  categoryId?: number // For attributes
  attributeId?: number // For room attributes
  type: 'upgrade' | 'attribute' | 'offer'
}

export interface CartState {
  items: CartItem[]
  isLoading: Record<string, boolean>
}

export interface UseStorybookCartOptions {
  initialItems?: CartItem[]
  onStateChange?: (state: CartState) => void
}

export interface UseStorybookCartReturn {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (itemId: string) => void
  toggleItem: (item: CartItem) => void
  reset: () => void
  isLoading: Record<string, boolean>
  getItemsByBooking: (bookingKey: string) => CartItem[]
}

export const useStorybookCart = (options: UseStorybookCartOptions = {}): UseStorybookCartReturn => {
  const { initialItems = [], onStateChange } = options

  const [items, setItems] = useState<CartItem[]>(initialItems)
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})

  // Notify state changes
  const notifyChange = useCallback(
    (newItems: CartItem[], newLoading: Record<string, boolean>) => {
      if (onStateChange) {
        onStateChange({ items: newItems, isLoading: newLoading })
      }
    },
    [onStateChange]
  )

  // Add item to cart with simulated async loading
  const addItem = useCallback(
    (item: CartItem) => {
      // Simulate async loading
      setIsLoading((prev) => ({ ...prev, [item.id]: true }))

      setTimeout(() => {
        setItems((prevItems) => {
          // Avoid duplicates
          if (prevItems.some((existing) => existing.id === item.id)) {
            return prevItems
          }
          const newItems = [...prevItems, item]
          setIsLoading((prev) => {
            const newLoading = { ...prev }
            delete newLoading[item.id]
            notifyChange(newItems, newLoading)
            return newLoading
          })
          return newItems
        })
      }, 300) // Simulate network delay
    },
    [notifyChange]
  )

  // Remove item from cart with simulated async loading
  const removeItem = useCallback(
    (itemId: string) => {
      setIsLoading((prev) => ({ ...prev, [itemId]: true }))

      setTimeout(() => {
        setItems((prevItems) => {
          const newItems = prevItems.filter((item) => item.id !== itemId)
          setIsLoading((prev) => {
            const newLoading = { ...prev }
            delete newLoading[itemId]
            notifyChange(newItems, newLoading)
            return newLoading
          })
          return newItems
        })
      }, 300)
    },
    [notifyChange]
  )

  // Toggle item (add if not present, remove if present)
  const toggleItem = useCallback(
    (item: CartItem) => {
      const exists = items.some((existing) => existing.id === item.id)
      if (exists) {
        removeItem(item.id)
      } else {
        addItem(item)
      }
    },
    [items, addItem, removeItem]
  )

  // Reset cart to initial state
  const reset = useCallback(() => {
    setItems(initialItems)
    setIsLoading({})
    notifyChange(initialItems, {})
  }, [initialItems, notifyChange])

  // Get items for a specific booking
  const getItemsByBooking = useCallback(
    (bookingKey: string) => {
      return items.filter((item) => item.bookingKey === bookingKey)
    },
    [items]
  )

  return {
    items,
    addItem,
    removeItem,
    toggleItem,
    reset,
    isLoading,
    getItemsByBooking,
  }
}
