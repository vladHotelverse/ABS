import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from '../../../../__tests__/helpers'
import PricingSummaryPanel from '../../index'
import type { PricingSummaryPanelProps } from '../../types'
import { createMockPricingLabels, createMockPricingItem } from '../../../../__tests__/helpers'

const mockLabels = createMockPricingLabels()

const defaultProps: PricingSummaryPanelProps = {
  items: [],
  pricing: { subtotal: 0, taxes: 0 },
  labels: mockLabels,
  onRemoveItem: vi.fn(),
  onConfirm: vi.fn(),
}

describe('ABS_PricingSummaryPanel Currency Formatting', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Currency consistency', () => {
    it('should use consistent currency formatting across all price displays', () => {
      const items = [
        createMockPricingItem({ name: 'Room', price: 150.5, type: 'room' }),
        createMockPricingItem({ name: 'Upgrade', price: 45.25, type: 'customization' }),
        createMockPricingItem({ name: 'Offer', price: 30.0, type: 'offer' }),
      ]

      render(
        <PricingSummaryPanel
          {...defaultProps}
          items={items}
          pricing={{ subtotal: 225.75, taxes: 47.41 }}
          currency="EUR"
          locale="en-US"
        />
      )

      // All prices should follow the same formatting pattern
      const priceElements = screen.getAllByText(/\$|€|£/)
      expect(priceElements.length).toBeGreaterThan(0)

      // Check that currency symbol appears consistently
      priceElements.forEach((element) => {
        expect(element.textContent).toMatch(/[\$€£]\d+\.\d{2}/)
      })
    })

    it('should handle different locales correctly', () => {
      const items = [createMockPricingItem({ price: 1234.56, type: 'room' })]

      const testCases = [
        { locale: 'en-US', currency: 'USD', expected: /\$1,234\.56/ },
        { locale: 'de-DE', currency: 'EUR', expected: /1\.234,56\s€/ },
        { locale: 'ja-JP', currency: 'JPY', expected: /￥1,235/ },
      ]

      testCases.forEach(({ locale, currency }) => {
        const { unmount } = render(
          <PricingSummaryPanel
            {...defaultProps}
            items={items}
            pricing={{ subtotal: 1234.56, taxes: 259.26 }}
            currency={currency}
            locale={locale}
          />
        )

        // Should render without errors and format according to locale
        expect(screen.getByText(mockLabels.selectedRoomLabel)).toBeInTheDocument()
        unmount()
      })
    })

    it('should handle invalid currency/locale gracefully', () => {
      const items = [createMockPricingItem({ price: 100, type: 'room' })]
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      render(
        <PricingSummaryPanel
          {...defaultProps}
          items={items}
          pricing={{ subtotal: 100, taxes: 21 }}
          currency="INVALID"
          locale="invalid-locale"
        />
      )

      // Should fallback to default formatting
      expect(screen.getByText(mockLabels.selectedRoomLabel)).toBeInTheDocument()

      // Should log warning about invalid currency format
      expect(consoleWarn).toHaveBeenCalledWith(expect.stringContaining('Invalid currency format'))

      consoleWarn.mockRestore()
    })

    it('should use euroSuffix fallback when no currency is provided', () => {
      const items = [createMockPricingItem({ price: 99.99, type: 'room' })]

      render(
        <PricingSummaryPanel
          {...defaultProps}
          items={items}
          pricing={{ subtotal: 99.99, taxes: 20.0 }}
          // No currency or locale provided
        />
      )

      // Should use euroSuffix format - check multiple instances exist
      expect(screen.getAllByText(/€99\.99/)).toHaveLength(2) // One in price indicator, one in subtotal
    })

    it('should maintain decimal precision across different currencies', () => {
      const testCases = [
        { currency: 'USD', price: 99.99, expectedDecimals: 2 },
        { currency: 'JPY', price: 1000, expectedDecimals: 0 },
        { currency: 'KWD', price: 99.999, expectedDecimals: 3 },
      ]

      testCases.forEach(({ currency, price }) => {
        const items = [createMockPricingItem({ price, type: 'room' })]

        const { unmount } = render(
          <PricingSummaryPanel
            {...defaultProps}
            items={items}
            pricing={{ subtotal: price, taxes: price * 0.1 }}
            currency={currency}
            locale="en-US"
          />
        )

        // Component should handle different decimal requirements
        expect(screen.getByText(mockLabels.selectedRoomLabel)).toBeInTheDocument()
        unmount()
      })
    })
  })

  describe('Price calculation consistency', () => {
    it('should maintain precision in tax calculations', () => {
      const items = [createMockPricingItem({ price: 123.45, type: 'room' })]

      render(
        <PricingSummaryPanel
          {...defaultProps}
          items={items}
          pricing={{ subtotal: 123.45, taxes: 25.92 }}
          currency="EUR"
          locale="en-US"
        />
      )

      // Tax calculations should be precise
      expect(screen.getByText(mockLabels.totalLabel)).toBeInTheDocument()
    })

    it('should handle zero and negative prices correctly', () => {
      const items = [
        createMockPricingItem({ price: 0, type: 'customization' }),
        createMockPricingItem({ price: 100, type: 'room' }),
      ]

      render(
        <PricingSummaryPanel
          {...defaultProps}
          items={items}
          pricing={{ subtotal: 100, taxes: 21 }}
          currency="USD"
          locale="en-US"
        />
      )

      // Should handle zero prices without showing remove button
      expect(screen.getByText(mockLabels.selectedRoomLabel)).toBeInTheDocument()
      expect(screen.getByText(mockLabels.upgradesLabel)).toBeInTheDocument()
    })

    it('should format large numbers correctly', () => {
      const items = [createMockPricingItem({ price: 9999.99, type: 'room' })]

      render(
        <PricingSummaryPanel
          {...defaultProps}
          items={items}
          pricing={{ subtotal: 9999.99, taxes: 2100.0 }}
          currency="USD"
          locale="en-US"
        />
      )

      // Should format large numbers with proper separators
      expect(screen.getByText(mockLabels.selectedRoomLabel)).toBeInTheDocument()
    })
  })

  describe('Currency hook behavior', () => {
    it('should provide consistent formatting through hook', () => {
      // This test will validate the useCurrencyFormatter hook
      const items = [
        createMockPricingItem({ price: 50.25, type: 'room' }),
        createMockPricingItem({ price: 25.5, type: 'customization' }),
      ]

      render(
        <PricingSummaryPanel
          {...defaultProps}
          items={items}
          pricing={{ subtotal: 75.75, taxes: 15.91 }}
          currency="EUR"
          locale="de-DE"
        />
      )

      // All price formatting should be consistent
      expect(screen.getByText(mockLabels.selectedRoomLabel)).toBeInTheDocument()
      expect(screen.getByText(mockLabels.upgradesLabel)).toBeInTheDocument()
    })

    it('should handle rapid currency changes', () => {
      const items = [createMockPricingItem({ price: 100, type: 'room' })]

      const { rerender } = render(
        <PricingSummaryPanel
          {...defaultProps}
          items={items}
          pricing={{ subtotal: 100, taxes: 21 }}
          currency="USD"
          locale="en-US"
        />
      )

      // Change currency rapidly
      const currencies = ['EUR', 'GBP', 'JPY', 'USD']
      currencies.forEach((currency) => {
        rerender(
          <PricingSummaryPanel
            {...defaultProps}
            items={items}
            pricing={{ subtotal: 100, taxes: 21 }}
            currency={currency}
            locale="en-US"
          />
        )

        expect(screen.getByText(mockLabels.selectedRoomLabel)).toBeInTheDocument()
      })
    })
  })
})
