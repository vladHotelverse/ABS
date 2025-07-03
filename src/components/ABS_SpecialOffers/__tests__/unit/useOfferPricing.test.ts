import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useOfferPricing } from '../../hooks/useOfferPricing'
import { createMockOfferType, createMockOfferLabels } from '../../../../__tests__/helpers'

describe('useOfferPricing', () => {
  describe('formatPrice', () => {
    it('should format prices with Euro symbol', () => {
      const { result } = renderHook(() => useOfferPricing('€'))

      expect(result.current.formatPrice(99.99)).toBe('€99.99')
      expect(result.current.formatPrice(100)).toBe('€100.00')
      expect(result.current.formatPrice(0)).toBe('€0.00')
    })

    it('should format prices with Dollar symbol', () => {
      const { result } = renderHook(() => useOfferPricing('$'))

      expect(result.current.formatPrice(99.99)).toBe('$99.99')
      expect(result.current.formatPrice(100)).toBe('$100.00')
    })

    it('should handle decimal places correctly', () => {
      const { result } = renderHook(() => useOfferPricing('€'))

      expect(result.current.formatPrice(99.9)).toBe('€99.90')
      expect(result.current.formatPrice(99.999)).toBe('€100.00')
      expect(result.current.formatPrice(99.001)).toBe('€99.00')
    })
  })

  describe('calculateTotal', () => {
    it('should calculate per-stay pricing correctly', () => {
      const { result } = renderHook(() => useOfferPricing('€'))

      const offer = createMockOfferType({
        price: 100,
        type: 'perStay',
      })

      const selection = { quantity: 2, persons: 3, nights: 4 }

      // For per-stay, only quantity matters
      expect(result.current.calculateTotal(offer, selection)).toBe(200)
    })

    it('should calculate per-person pricing correctly', () => {
      const { result } = renderHook(() => useOfferPricing('€'))

      const offer = createMockOfferType({
        price: 50,
        type: 'perPerson',
      })

      const selection = { quantity: 2, persons: 3, nights: 4 }

      // For per-person: price * quantity * persons
      expect(result.current.calculateTotal(offer, selection)).toBe(300) // 50 * 2 * 3
    })

    it('should calculate per-night pricing correctly', () => {
      const { result } = renderHook(() => useOfferPricing('€'))

      const offer = createMockOfferType({
        price: 25,
        type: 'perNight',
      })

      const selection = { quantity: 2, persons: 3, nights: 4 }

      // For per-night: price * quantity * nights
      expect(result.current.calculateTotal(offer, selection)).toBe(200) // 25 * 2 * 4
    })

    it('should return 0 when quantity is 0', () => {
      const { result } = renderHook(() => useOfferPricing('€'))

      const offer = createMockOfferType({
        price: 100,
        type: 'perStay',
      })

      const selection = { quantity: 0, persons: 3, nights: 4 }

      expect(result.current.calculateTotal(offer, selection)).toBe(0)
    })

    it('should handle missing persons/nights gracefully', () => {
      const { result } = renderHook(() => useOfferPricing('€'))

      const perPersonOffer = createMockOfferType({
        price: 50,
        type: 'perPerson',
      })

      const perNightOffer = createMockOfferType({
        price: 25,
        type: 'perNight',
      })

      // Selection without persons/nights
      const selectionWithoutPersons = { quantity: 2, persons: undefined, nights: undefined }

      // Should default to 1 person
      expect(result.current.calculateTotal(perPersonOffer, selectionWithoutPersons)).toBe(100) // 50 * 2 * 1

      // Should default to 1 night
      expect(result.current.calculateTotal(perNightOffer, selectionWithoutPersons)).toBe(50) // 25 * 2 * 1
    })

    it('should handle edge cases', () => {
      const { result } = renderHook(() => useOfferPricing('€'))

      const offer = createMockOfferType({
        price: 0,
        type: 'perStay',
      })

      const selection = { quantity: 5, persons: 1, nights: 1 }

      // Free offer should still return 0
      expect(result.current.calculateTotal(offer, selection)).toBe(0)
    })
  })

  describe('getUnitLabel', () => {
    const mockLabels = createMockOfferLabels()

    it('should return correct label for per-stay', () => {
      const { result } = renderHook(() => useOfferPricing('€'))

      expect(result.current.getUnitLabel('perStay', mockLabels)).toBe(mockLabels.perStay)
    })

    it('should return correct label for per-person', () => {
      const { result } = renderHook(() => useOfferPricing('€'))

      expect(result.current.getUnitLabel('perPerson', mockLabels)).toBe(mockLabels.perPerson)
    })

    it('should return correct label for per-night', () => {
      const { result } = renderHook(() => useOfferPricing('€'))

      expect(result.current.getUnitLabel('perNight', mockLabels)).toBe(mockLabels.perNight)
    })

    it('should return empty string for unknown type', () => {
      const { result } = renderHook(() => useOfferPricing('€'))

      expect(result.current.getUnitLabel('unknown' as any, mockLabels)).toBe('')
    })

    it('should use fallback labels when labels are missing', () => {
      const { result } = renderHook(() => useOfferPricing('€'))

      const emptyLabels = {} as any

      expect(result.current.getUnitLabel('perStay', emptyLabels)).toBe('per stay')
      expect(result.current.getUnitLabel('perPerson', emptyLabels)).toBe('per person')
      expect(result.current.getUnitLabel('perNight', emptyLabels)).toBe('per night')
    })
  })

  describe('Hook stability', () => {
    it('should maintain stable function references', () => {
      const { result, rerender } = renderHook(({ currency }) => useOfferPricing(currency), {
        initialProps: { currency: '€' },
      })

      const firstFormatPrice = result.current.formatPrice
      const firstCalculateTotal = result.current.calculateTotal
      const firstGetUnitLabel = result.current.getUnitLabel

      // Rerender with same currency
      rerender({ currency: '€' })

      // formatPrice should change because it depends on currency
      expect(result.current.formatPrice).toBe(firstFormatPrice)

      // calculateTotal and getUnitLabel should be stable
      expect(result.current.calculateTotal).toBe(firstCalculateTotal)
      expect(result.current.getUnitLabel).toBe(firstGetUnitLabel)
    })

    it('should update when currency changes', () => {
      const { result, rerender } = renderHook(({ currency }) => useOfferPricing(currency), {
        initialProps: { currency: '€' },
      })

      const euroFormatPrice = result.current.formatPrice

      // Change currency
      rerender({ currency: '$' })

      // formatPrice should be different
      expect(result.current.formatPrice).not.toBe(euroFormatPrice)

      // But should still work correctly
      expect(result.current.formatPrice(100)).toBe('$100.00')
    })
  })

  describe('Complex calculations', () => {
    it('should handle complex multi-person, multi-night scenarios', () => {
      const { result } = renderHook(() => useOfferPricing('€'))

      const perPersonOffer = createMockOfferType({
        price: 75,
        type: 'perPerson',
      })

      const perNightOffer = createMockOfferType({
        price: 40,
        type: 'perNight',
      })

      // Complex selection
      const selection = { quantity: 3, persons: 4, nights: 5 }

      // Per-person: 75 * 3 * 4 = 900
      expect(result.current.calculateTotal(perPersonOffer, selection)).toBe(900)

      // Per-night: 40 * 3 * 5 = 600
      expect(result.current.calculateTotal(perNightOffer, selection)).toBe(600)
    })

    it('should handle floating point precision', () => {
      const { result } = renderHook(() => useOfferPricing('€'))

      const offer = createMockOfferType({
        price: 33.33,
        type: 'perPerson',
      })

      const selection = { quantity: 3, persons: 3, nights: 1 }

      // Should handle floating point correctly
      const total = result.current.calculateTotal(offer, selection)
      expect(total).toBeCloseTo(299.97, 2) // 33.33 * 3 * 3
    })
  })
})
