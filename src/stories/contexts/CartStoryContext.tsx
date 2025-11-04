/**
 * Cart Story Context - Central state management for Storybook
 * Combines useStorybookCart + cartTransformers to provide complete cart state
 */

import React, { createContext, useContext, useMemo } from 'react'
import type { UILabels } from '@/components/upsell/PricingSummaryPanel/types'
import type { CartItem, UseStorybookCartReturn } from '../hooks/useStorybookCart'
import { useStorybookCart } from '../hooks/useStorybookCart'
import type {
  BookingInfo,
  FormattedBooking,
  Room,
  TransformConfig,
} from '../helpers/cartTransformers'
import {
  calculateOverallTotal,
  calculatePerRoomTotals,
  transformBookingsToFormatted,
  transformItemsToRooms,
} from '../helpers/cartTransformers'

export interface CartStoryContextValue {
  // Cart state
  items: CartItem[]
  isLoading: Record<string, boolean>

  // Transformed data (ready for components)
  rooms: Room[]
  formattedBookings: FormattedBooking[]
  formattedOverallTotal: string
  formattedPerRoomTotals: Record<string, string>

  // Actions
  addItem: UseStorybookCartReturn['addItem']
  removeItem: UseStorybookCartReturn['removeItem']
  toggleItem: UseStorybookCartReturn['toggleItem']
  reset: UseStorybookCartReturn['reset']
  getItemsByBooking: UseStorybookCartReturn['getItemsByBooking']

  // Helpers
  isItemSelected: (itemId: string) => boolean
  isItemLoading: (itemId: string) => boolean
}

const CartStoryContext = createContext<CartStoryContextValue | undefined>(undefined)

export interface CartStoryProviderProps {
  children: React.ReactNode
  initialItems?: CartItem[]
  bookings: BookingInfo[]
  config?: Partial<TransformConfig>
  onStateChange?: (state: { items: CartItem[]; isLoading: Record<string, boolean> }) => void
}

/**
 * Provider component that manages cart state and provides transformed data
 */
export const CartStoryProvider: React.FC<CartStoryProviderProps> = ({
  children,
  initialItems = [],
  bookings,
  config: configOverrides = {},
  onStateChange,
}) => {
  // Default config
  const config: TransformConfig = useMemo(
    () => ({
      currency: 'EUR',
      locale: 'en-US',
      includeNightMultiplier: false,
      ...configOverrides,
    }),
    [configOverrides]
  )

  // Cart management
  const cart = useStorybookCart({
    initialItems,
    onStateChange,
  })

  // Transform cart items to display format
  const rooms = useMemo(
    () => transformItemsToRooms(cart.items, bookings, config),
    [cart.items, bookings, config]
  )

  const formattedBookings = useMemo(
    () => transformBookingsToFormatted(bookings, config),
    [bookings, config]
  )

  const formattedOverallTotal = useMemo(
    () => calculateOverallTotal(cart.items, bookings, config),
    [cart.items, bookings, config]
  )

  const formattedPerRoomTotals = useMemo(
    () => calculatePerRoomTotals(cart.items, bookings, config),
    [cart.items, bookings, config]
  )

  // Helper functions
  const isItemSelected = (itemId: string): boolean => {
    return cart.items.some((item) => item.id === itemId)
  }

  const isItemLoading = (itemId: string): boolean => {
    return cart.isLoading[itemId] || false
  }

  const value: CartStoryContextValue = {
    // Cart state
    items: cart.items,
    isLoading: cart.isLoading,

    // Transformed data
    rooms,
    formattedBookings,
    formattedOverallTotal,
    formattedPerRoomTotals,

    // Actions
    addItem: cart.addItem,
    removeItem: cart.removeItem,
    toggleItem: cart.toggleItem,
    reset: cart.reset,
    getItemsByBooking: cart.getItemsByBooking,

    // Helpers
    isItemSelected,
    isItemLoading,
  }

  return <CartStoryContext.Provider value={value}>{children}</CartStoryContext.Provider>
}

/**
 * Hook to access cart story context
 * Throws error if used outside provider
 */
export const useCartStory = (): CartStoryContextValue => {
  const context = useContext(CartStoryContext)
  if (!context) {
    throw new Error('useCartStory must be used within CartStoryProvider')
  }
  return context
}

/**
 * Hook to check if context is available (no error if not)
 */
export const useCartStoryOptional = (): CartStoryContextValue | undefined => {
  return useContext(CartStoryContext)
}
