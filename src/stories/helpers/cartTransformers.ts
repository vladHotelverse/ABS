/**
 * Transform cart items to MultiBookingPricingSummaryPanel format
 * Converts raw cart data into pre-formatted display data for stories
 */

import type { CartSection, FormattedCartItem } from '@/components/upsell/PricingSummaryPanel/types'
import { SectionType } from '@/components/upsell/PricingSummaryPanel/types'
import type { CartItem } from '../hooks/useStorybookCart'

export interface BookingInfo {
  id: string
  bookingKey: string
  displayName: string
  guestName: string
  checkIn: string
  checkOut: string
  nights: number
  guests: number
}

export interface TransformConfig {
  currency: string
  locale: string
  includeNightMultiplier?: boolean
}

export interface Room {
  id: string
  displayName: string
  guestName: string
  formattedNights: string
  formattedTotal: string
  sections: CartSection[]
  guestCount?: number
}

export interface FormattedBooking {
  id: string
  displayName: string
  bookingKey: string
  formattedDateRange: string
  formattedNights: string
  formattedGuests: string
}

/**
 * Format currency amount to localized string
 */
export const formatCurrency = (amount: number, currency: string, locale: string): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Format date range for display
 */
export const formatDateRange = (checkIn: string, checkOut: string, locale: string): string => {
  const checkInDate = new Date(checkIn)
  const checkOutDate = new Date(checkOut)

  const formatter = new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' })
  return `${formatter.format(checkInDate)} - ${formatter.format(checkOutDate)}`
}

/**
 * Group cart items into sections by type
 */
export const buildSections = (items: CartItem[], config: TransformConfig): CartSection[] => {
  const sections: CartSection[] = []

  // Group items by type
  const upgradeItems = items.filter((item) => item.type === 'upgrade')
  const attributeItems = items.filter((item) => item.type === 'attribute')
  const offerItems = items.filter((item) => item.type === 'offer')

  // Build upgrade section
  if (upgradeItems.length > 0) {
    sections.push({
      title: 'Choose your superior room',
      type: SectionType.Upgrade,
      items: upgradeItems.map((item) => ({
        id: item.id,
        name: item.name,
        formattedPrice: formatCurrency(item.amount, config.currency, config.locale),
      })),
    })
  }

  // Build customization section
  if (attributeItems.length > 0) {
    sections.push({
      title: 'Customize your room',
      type: SectionType.Customization,
      items: attributeItems.map((item) => ({
        id: item.id,
        name: item.name,
        formattedPrice: formatCurrency(item.amount, config.currency, config.locale),
      })),
    })
  }

  // Build offers section
  if (offerItems.length > 0) {
    sections.push({
      title: 'Special offers',
      type: SectionType.Offer,
      items: offerItems.map((item) => ({
        id: item.id,
        name: item.name,
        formattedPrice: formatCurrency(item.amount, config.currency, config.locale),
      })),
    })
  }

  return sections
}

/**
 * Calculate total for a specific booking's items
 */
export const calculateBookingTotal = (
  items: CartItem[],
  bookingKey: string,
  config: TransformConfig,
  nights?: number
): number => {
  const bookingItems = items.filter((item) => item.bookingKey === bookingKey)
  const subtotal = bookingItems.reduce((sum, item) => sum + item.amount, 0)

  // Multiply by nights if specified and config allows
  if (config.includeNightMultiplier && nights) {
    return subtotal * nights
  }

  return subtotal
}

/**
 * Transform cart items to rooms format for MultiBookingPricingSummaryPanel
 */
export const transformItemsToRooms = (
  items: CartItem[],
  bookings: BookingInfo[],
  config: TransformConfig
): Room[] => {
  return bookings.map((booking) => {
    const bookingItems = items.filter((item) => item.bookingKey === booking.bookingKey)
    const sections = buildSections(bookingItems, config)
    const total = calculateBookingTotal(items, booking.bookingKey, config, booking.nights)

    return {
      id: booking.id,
      displayName: booking.displayName,
      guestName: booking.guestName,
      formattedNights: `${booking.nights} ${booking.nights === 1 ? 'night' : 'nights'}`,
      formattedTotal: formatCurrency(total, config.currency, config.locale),
      sections,
      guestCount: booking.guests,
    }
  })
}

/**
 * Transform bookings to formatted booking info
 */
export const transformBookingsToFormatted = (
  bookings: BookingInfo[],
  config: TransformConfig
): FormattedBooking[] => {
  return bookings.map((booking) => ({
    id: booking.id,
    displayName: booking.displayName,
    bookingKey: booking.bookingKey,
    formattedDateRange: formatDateRange(booking.checkIn, booking.checkOut, config.locale),
    formattedNights: `${booking.nights} ${booking.nights === 1 ? 'night' : 'nights'}`,
    formattedGuests: `${booking.guests} ${booking.guests === 1 ? 'guest' : 'guests'}`,
  }))
}

/**
 * Calculate overall total across all bookings
 */
export const calculateOverallTotal = (
  items: CartItem[],
  bookings: BookingInfo[],
  config: TransformConfig
): string => {
  const total = bookings.reduce((sum, booking) => {
    return sum + calculateBookingTotal(items, booking.bookingKey, config, booking.nights)
  }, 0)

  return formatCurrency(total, config.currency, config.locale)
}

/**
 * Calculate per-room totals
 */
export const calculatePerRoomTotals = (
  items: CartItem[],
  bookings: BookingInfo[],
  config: TransformConfig
): Record<string, string> => {
  const totals: Record<string, string> = {}

  bookings.forEach((booking) => {
    const total = calculateBookingTotal(items, booking.bookingKey, config, booking.nights)
    totals[booking.bookingKey] = formatCurrency(total, config.currency, config.locale)
  })

  return totals
}
