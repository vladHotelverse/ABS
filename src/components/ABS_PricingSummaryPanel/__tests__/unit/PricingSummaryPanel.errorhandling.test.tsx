import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
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

describe('ABS_PricingSummaryPanel Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Props validation', () => {
    it('should handle missing required labels prop', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

      render(<PricingSummaryPanel {...defaultProps} labels={undefined as any} />)

      expect(
        screen.getByText('Missing required labels configuration. Please provide all required labels.')
      ).toBeInTheDocument()
      expect(consoleError).toHaveBeenCalledWith('PricingSummaryPanel: labels prop is required')

      consoleError.mockRestore()
    })

    it('should handle malformed labels object', () => {
      const partialLabels = {
        selectedRoomLabel: 'Room',
        // Missing other required labels
      } as any

      // Should not crash with partial labels
      expect(() => {
        render(<PricingSummaryPanel {...defaultProps} labels={partialLabels} />)
      }).not.toThrow()
    })

    it('should handle null/undefined items gracefully', () => {
      render(<PricingSummaryPanel {...defaultProps} items={null as any} />)

      // Should render empty state without crashing
      expect(screen.getByText(mockLabels.customizeStayTitle)).toBeInTheDocument()
    })

    it('should handle undefined pricing object', () => {
      const items = [createMockPricingItem({ type: 'room' })]

      render(<PricingSummaryPanel {...defaultProps} items={items} pricing={undefined as any} />)

      // Should handle gracefully with fallback values
      expect(screen.getByText(mockLabels.selectedRoomLabel)).toBeInTheDocument()
    })

    it('should handle malformed pricing object', () => {
      const items = [createMockPricingItem({ type: 'room' })]

      render(
        <PricingSummaryPanel
          {...defaultProps}
          items={items}
          pricing={{ subtotal: 'invalid' as any, taxes: null as any }}
        />
      )

      // Should not crash with invalid pricing data
      expect(screen.getByText(mockLabels.selectedRoomLabel)).toBeInTheDocument()
    })
  })

  describe('Item data validation', () => {
    it('should handle items with missing properties', () => {
      const malformedItems = [
        { id: 1, name: 'Item 1' }, // Missing price, type
        { id: 2, price: 100 }, // Missing name, type
        { id: 3, type: 'room' }, // Missing name, price
      ] as any

      render(<PricingSummaryPanel {...defaultProps} items={malformedItems} pricing={{ subtotal: 100, taxes: 21 }} />)

      // Should render without crashing
      expect(screen.getByText(mockLabels.selectedRoomLabel)).toBeInTheDocument()
    })

    it('should handle items with invalid types', () => {
      const itemsWithInvalidTypes = [
        createMockPricingItem({ type: 'invalid-type' as any }),
        createMockPricingItem({ type: null as any }),
        createMockPricingItem({ type: undefined as any }),
      ]

      render(
        <PricingSummaryPanel {...defaultProps} items={itemsWithInvalidTypes} pricing={{ subtotal: 300, taxes: 63 }} />
      )

      // Should handle gracefully without crashing
      expect(document.body).toBeInTheDocument()
    })

    it('should handle negative prices', () => {
      const itemsWithNegativePrices = [
        createMockPricingItem({ price: -50, type: 'room' }),
        createMockPricingItem({ price: -25, type: 'customization' }),
      ]

      render(
        <PricingSummaryPanel
          {...defaultProps}
          items={itemsWithNegativePrices}
          pricing={{ subtotal: -75, taxes: -15.75 }}
        />
      )

      // Should handle negative prices gracefully
      expect(screen.getByText(mockLabels.selectedRoomLabel)).toBeInTheDocument()
      expect(screen.getByText(mockLabels.upgradesLabel)).toBeInTheDocument()
    })

    it('should handle extremely large numbers', () => {
      const itemsWithLargeNumbers = [
        createMockPricingItem({ price: Number.MAX_SAFE_INTEGER, type: 'room' }),
        createMockPricingItem({ price: 999999999.99, type: 'customization' }),
      ]

      render(
        <PricingSummaryPanel
          {...defaultProps}
          items={itemsWithLargeNumbers}
          pricing={{ subtotal: Number.MAX_SAFE_INTEGER, taxes: 999999999.99 }}
        />
      )

      // Should handle large numbers without overflow
      expect(screen.getByText(mockLabels.selectedRoomLabel)).toBeInTheDocument()
    })

    it('should handle NaN and Infinity values', () => {
      const itemsWithSpecialNumbers = [
        createMockPricingItem({ price: Number.NaN, type: 'room' }),
        createMockPricingItem({ price: Number.POSITIVE_INFINITY, type: 'customization' }),
        createMockPricingItem({ price: Number.NEGATIVE_INFINITY, type: 'offer' }),
      ]

      render(
        <PricingSummaryPanel
          {...defaultProps}
          items={itemsWithSpecialNumbers}
          pricing={{ subtotal: Number.NaN, taxes: Number.POSITIVE_INFINITY }}
        />
      )

      // Should handle special number values gracefully
      expect(document.body).toBeInTheDocument()
    })
  })

  describe('Callback error handling', () => {
    it('should handle callback errors gracefully', () => {
      const errorThrowingCallback = vi.fn(() => {
        throw new Error('Callback error')
      })

      const items = [createMockPricingItem({ type: 'room' })]

      render(
        <PricingSummaryPanel
          {...defaultProps}
          items={items}
          pricing={{ subtotal: 100, taxes: 21 }}
          onRemoveItem={errorThrowingCallback}
        />
      )

      const removeButton = screen.getByRole('button', { name: /remove/i })

      // Should not crash when callback throws
      expect(() => {
        fireEvent.click(removeButton)
      }).not.toThrow()
    })

    it('should handle missing callback functions', () => {
      const items = [createMockPricingItem({ type: 'room' })]

      render(
        <PricingSummaryPanel
          {...defaultProps}
          items={items}
          pricing={{ subtotal: 100, taxes: 21 }}
          onRemoveItem={undefined as any}
          onConfirm={undefined as any}
        />
      )

      // Should render without crashing
      expect(screen.getByText(mockLabels.selectedRoomLabel)).toBeInTheDocument()

      // Buttons should still be present but safe to click
      const removeButton = screen.getByRole('button', { name: /remove/i })
      const confirmButton = screen.getByRole('button', { name: mockLabels.confirmButtonLabel })

      expect(() => {
        fireEvent.click(removeButton)
        fireEvent.click(confirmButton)
      }).not.toThrow()
    })
  })

  describe('Network and async error handling', () => {
    it('should handle image loading errors', () => {
      render(<PricingSummaryPanel {...defaultProps} roomImage="https://invalid-url.com/nonexistent.jpg" />)

      const image = screen.getByAltText(mockLabels.roomImageAltText)

      // Should have image element even if src is invalid
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', 'https://invalid-url.com/nonexistent.jpg')
    })

    it('should handle toast system errors', () => {
      const items = [createMockPricingItem({ name: 'Test Item', type: 'offer' })]

      // Mock setTimeout to throw error
      const originalSetTimeout = global.setTimeout
      global.setTimeout = vi.fn(() => {
        throw new Error('Timer error')
      }) as any

      render(<PricingSummaryPanel {...defaultProps} items={items} pricing={{ subtotal: 50, taxes: 10.5 }} />)

      const removeButton = screen.getByRole('button', { name: /remove/i })

      // Should not crash when toast system has issues
      expect(() => {
        fireEvent.click(removeButton)
      }).not.toThrow()

      // Restore original setTimeout
      global.setTimeout = originalSetTimeout
    })
  })

  describe('Memory and performance error handling', () => {
    it('should handle extremely large item arrays', () => {
      // Create a very large array of items
      const largeItemArray = Array.from({ length: 10000 }, (_, index) =>
        createMockPricingItem({
          id: index,
          name: `Item ${index}`,
          type: 'room',
        })
      )

      const startTime = performance.now()

      render(
        <PricingSummaryPanel {...defaultProps} items={largeItemArray} pricing={{ subtotal: 1000000, taxes: 210000 }} />
      )

      const endTime = performance.now()
      const renderTime = endTime - startTime

      // Should handle large arrays without crashing or excessive time
      expect(renderTime).toBeLessThan(5000) // 5 second threshold
      expect(screen.getByText(mockLabels.selectedRoomLabel)).toBeInTheDocument()
    })

    it('should handle rapid prop changes without memory leaks', () => {
      const items = [createMockPricingItem({ type: 'room' })]

      const { rerender } = render(
        <PricingSummaryPanel {...defaultProps} items={items} pricing={{ subtotal: 100, taxes: 21 }} />
      )

      // Rapidly change props many times
      for (let i = 0; i < 1000; i++) {
        rerender(
          <PricingSummaryPanel
            {...defaultProps}
            items={[...items, createMockPricingItem({ id: i })]}
            pricing={{ subtotal: 100 + i, taxes: 21 + i }}
            isLoading={i % 2 === 0}
          />
        )
      }

      // Should handle rapid changes without issues
      expect(screen.getByText(mockLabels.selectedRoomLabel)).toBeInTheDocument()
    })
  })

  describe('Environment error handling', () => {
    it('should handle missing browser APIs gracefully', () => {
      // Mock missing Intl support
      const originalIntl = (global as any).Intl
      ;(global as any).Intl = undefined

      const items = [createMockPricingItem({ price: 100, type: 'room' })]

      render(
        <PricingSummaryPanel
          {...defaultProps}
          items={items}
          pricing={{ subtotal: 100, taxes: 21 }}
          currency="EUR"
          locale="en-US"
        />
      )

      // Should fallback gracefully without Intl
      expect(screen.getByText(mockLabels.selectedRoomLabel)).toBeInTheDocument()

      // Restore Intl
      ;(global as any).Intl = originalIntl
    })

    it('should handle missing performance API', () => {
      const originalPerformance = global.performance
      ;(global as any).performance = undefined

      const items = [createMockPricingItem({ type: 'room' })]

      expect(() => {
        render(<PricingSummaryPanel {...defaultProps} items={items} pricing={{ subtotal: 100, taxes: 21 }} />)
      }).not.toThrow()

      // Restore performance
      global.performance = originalPerformance
    })
  })

  describe('Edge case scenarios', () => {
    it('should handle empty strings and whitespace in item names', () => {
      const itemsWithEmptyNames = [
        createMockPricingItem({ name: '', type: 'room' }),
        createMockPricingItem({ name: '   ', type: 'customization' }),
        createMockPricingItem({ name: '\n\t\r', type: 'offer' }),
      ]

      render(
        <PricingSummaryPanel {...defaultProps} items={itemsWithEmptyNames} pricing={{ subtotal: 300, taxes: 63 }} />
      )

      // Should handle empty/whitespace names gracefully
      expect(screen.getByText(mockLabels.selectedRoomLabel)).toBeInTheDocument()
      expect(screen.getByText(mockLabels.upgradesLabel)).toBeInTheDocument()
      expect(screen.getByText(mockLabels.specialOffersLabel)).toBeInTheDocument()
    })

    it('should handle circular references in props', () => {
      const circularObject: any = { type: 'room' }
      circularObject.self = circularObject

      const items = [createMockPricingItem(circularObject)]

      expect(() => {
        render(<PricingSummaryPanel {...defaultProps} items={items} pricing={{ subtotal: 100, taxes: 21 }} />)
      }).not.toThrow()
    })
  })
})
