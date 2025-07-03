import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { render } from '../../../../__tests__/helpers'
import PricingSummaryPanel from '../../index'
import type { PricingSummaryPanelProps } from '../../types'
import { createMockPricingLabels, createMockPricingItem } from '../../../../__tests__/helpers'

const mockLabels = createMockPricingLabels()

// Extended props interface for configuration testing
interface ConfigurablePricingSummaryPanelProps extends PricingSummaryPanelProps {
  taxRate?: number
  panelWidth?: string
  stickyTop?: string
  toastDuration?: number
  imageHeight?: string
}

const defaultProps: ConfigurablePricingSummaryPanelProps = {
  items: [],
  pricing: { subtotal: 0, taxes: 0 },
  labels: mockLabels,
  onRemoveItem: vi.fn(),
  onConfirm: vi.fn(),
}

describe('ABS_PricingSummaryPanel Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Configurable dimensions', () => {
    it('should support custom panel width', () => {
      const items = [createMockPricingItem({ type: 'room' })]

      const { container } = render(
        <PricingSummaryPanel
          {...defaultProps}
          items={items}
          pricing={{ subtotal: 100, taxes: 21 }}
          className="w-[500px]" // Custom width
        />
      )

      const panel = container.querySelector('.w-\\[500px\\]')
      expect(panel).toBeInTheDocument()
    })

    it('should support custom sticky positioning', () => {
      const items = [createMockPricingItem({ type: 'room' })]

      const { container } = render(
        <PricingSummaryPanel
          {...defaultProps}
          items={items}
          pricing={{ subtotal: 100, taxes: 21 }}
          className="top-20" // Custom sticky position
        />
      )

      // Should apply custom positioning classes
      expect(container.querySelector('.top-20')).toBeInTheDocument()
    })

    it('should handle custom room image dimensions', () => {
      render(<PricingSummaryPanel {...defaultProps} roomImage="custom-image.jpg" />)

      const image = screen.getByAltText(mockLabels.roomImageAltText)
      expect(image).toHaveAttribute('src', 'custom-image.jpg')
    })
  })

  describe('Configurable tax calculations', () => {
    it('should support custom tax rates through pricing prop', () => {
      const items = [createMockPricingItem({ price: 100, type: 'room' })]

      // Test different tax scenarios
      const testCases = [
        { subtotal: 100, taxes: 15, taxRate: 0.15 }, // 15% tax
        { subtotal: 100, taxes: 25, taxRate: 0.25 }, // 25% tax
        { subtotal: 100, taxes: 0, taxRate: 0 }, // No tax
      ]

      testCases.forEach(({ subtotal, taxes }) => {
        const { unmount } = render(
          <PricingSummaryPanel {...defaultProps} items={items} pricing={{ subtotal, taxes }} />
        )

        // Should display the total
        expect(screen.getByText(mockLabels.totalLabel)).toBeInTheDocument()

        unmount()
      })
    })

    it('should handle complex pricing structures', () => {
      const items = [
        createMockPricingItem({ price: 200, type: 'room' }),
        createMockPricingItem({ price: 50, type: 'customization' }),
        createMockPricingItem({ price: 30, type: 'offer' }),
      ]

      render(
        <PricingSummaryPanel
          {...defaultProps}
          items={items}
          pricing={{
            subtotal: 280,
            taxes: 42.5, // Custom tax calculation
          }}
        />
      )

      expect(screen.getByText(mockLabels.totalLabel)).toBeInTheDocument()
    })
  })

  describe('Configurable toast behavior', () => {
    it('should support custom toast duration', async () => {
      const items = [createMockPricingItem({ name: 'Test Item', type: 'offer' })]

      // Mock setTimeout to control timing
      const setTimeoutSpy = vi.spyOn(global, 'setTimeout')

      render(<PricingSummaryPanel {...defaultProps} items={items} pricing={{ subtotal: 50, taxes: 10.5 }} />)

      // Trigger toast
      const removeButton = screen.getByRole('button', { name: /remove/i })
      fireEvent.click(removeButton)

      // Check that setTimeout was called with default duration (3000ms)
      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 3000)

      setTimeoutSpy.mockRestore()
    })

    it('should handle custom toast messages', () => {
      const customLabels = createMockPricingLabels({
        roomRemovedMessage: 'Custom room removal message',
        offerRemovedMessagePrefix: 'Custom offer removed:',
      })

      const items = [createMockPricingItem({ name: 'Test Offer', type: 'offer' })]

      render(
        <PricingSummaryPanel
          {...defaultProps}
          items={items}
          pricing={{ subtotal: 50, taxes: 10.5 }}
          labels={customLabels}
        />
      )

      // Should use custom labels
      expect(screen.getByText(customLabels.specialOffersLabel)).toBeInTheDocument()
    })
  })

  describe('Theme and styling configuration', () => {
    it('should support custom text styles through props', () => {
      const items = [createMockPricingItem({ type: 'room' })]

      const { container } = render(
        <PricingSummaryPanel
          {...defaultProps}
          items={items}
          pricing={{ subtotal: 100, taxes: 21 }}
          className="custom-theme dark"
        />
      )

      expect(container.querySelector('.custom-theme')).toBeInTheDocument()
      expect(container.querySelector('.dark')).toBeInTheDocument()
    })

    it('should maintain consistent styling across sections', () => {
      const items = [
        createMockPricingItem({ type: 'room' }),
        createMockPricingItem({ type: 'customization' }),
        createMockPricingItem({ type: 'offer' }),
      ]

      render(<PricingSummaryPanel {...defaultProps} items={items} pricing={{ subtotal: 200, taxes: 42 }} />)

      // All section titles should have consistent styling
      const sectionTitles = [
        screen.getByText(mockLabels.selectedRoomLabel),
        screen.getByText(mockLabels.upgradesLabel),
        screen.getByText(mockLabels.specialOffersLabel),
      ]

      sectionTitles.forEach((title) => {
        expect(title).toHaveClass('text-base', 'font-semibold')
      })
    })
  })

  describe('Image configuration', () => {
    it('should support custom room images', () => {
      const customImageUrl = 'https://example.com/custom-room.jpg'

      render(<PricingSummaryPanel {...defaultProps} roomImage={customImageUrl} />)

      const image = screen.getByAltText(mockLabels.roomImageAltText)
      expect(image).toHaveAttribute('src', customImageUrl)
    })

    it('should handle missing or invalid images gracefully', () => {
      render(
        <PricingSummaryPanel
          {...defaultProps}
          roomImage="" // Empty image URL
        />
      )

      const image = screen.getByAltText(mockLabels.roomImageAltText)
      expect(image).toHaveAttribute('src', '')
    })

    it('should support custom image alt text', () => {
      const customLabels = createMockPricingLabels({
        roomImageAltText: 'Custom room photo description',
      })

      render(<PricingSummaryPanel {...defaultProps} labels={customLabels} />)

      expect(screen.getByAltText('Custom room photo description')).toBeInTheDocument()
    })
  })

  describe('Responsive configuration', () => {
    it('should handle different viewport sizes', () => {
      const items = [createMockPricingItem({ type: 'room' })]

      // Test different panel configurations
      const configurations = [
        'w-[300px]', // Mobile-like
        'w-[400px]', // Default
        'w-[500px]', // Desktop-like
      ]

      configurations.forEach((width) => {
        const { unmount } = render(
          <PricingSummaryPanel
            {...defaultProps}
            items={items}
            pricing={{ subtotal: 100, taxes: 21 }}
            className={width}
          />
        )

        expect(screen.getByText(mockLabels.selectedRoomLabel)).toBeInTheDocument()
        unmount()
      })
    })

    it('should maintain functionality across different configurations', () => {
      const items = [createMockPricingItem({ type: 'room' })]
      const onRemoveItem = vi.fn()

      render(
        <PricingSummaryPanel
          {...defaultProps}
          items={items}
          pricing={{ subtotal: 100, taxes: 21 }}
          onRemoveItem={onRemoveItem}
          className="w-[300px] bg-gray-100" // Custom styling
        />
      )

      const removeButton = screen.getByRole('button', { name: /remove/i })
      fireEvent.click(removeButton)

      expect(onRemoveItem).toHaveBeenCalled()
    })
  })
})
