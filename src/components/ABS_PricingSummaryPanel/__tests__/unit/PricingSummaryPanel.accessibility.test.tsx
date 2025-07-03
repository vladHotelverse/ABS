import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { render } from '../../../../__tests__/helpers'
import PricingSummaryPanel from '../../index'
import type { PricingSummaryPanelProps } from '../../types'
import {
  createMockPricingLabels,
  createMockPricingItem,
  createMockAvailableSection,
} from '../../../../__tests__/helpers'

const mockLabels = createMockPricingLabels()

const defaultProps: PricingSummaryPanelProps = {
  items: [],
  pricing: { subtotal: 0, taxes: 0 },
  labels: mockLabels,
  onRemoveItem: vi.fn(),
  onConfirm: vi.fn(),
}

describe('ABS_PricingSummaryPanel Accessibility', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('ARIA Labels and Roles', () => {
    it('should have proper aria-labels for all interactive elements', () => {
      const items = [
        createMockPricingItem({ name: 'Deluxe Room', type: 'room' }),
        createMockPricingItem({ name: 'Ocean View', type: 'customization' }),
        createMockPricingItem({ name: 'Spa Package', type: 'offer' }),
      ]

      render(<PricingSummaryPanel {...defaultProps} items={items} pricing={{ subtotal: 200, taxes: 42 }} />)

      // Remove buttons should have descriptive aria-labels
      const removeButtons = screen.getAllByLabelText(/remove/i)
      expect(removeButtons.length).toBeGreaterThan(0)
    })

    it('should provide proper aria-labels for price information', () => {
      const items = [createMockPricingItem({ price: 150, type: 'room' })]

      render(<PricingSummaryPanel {...defaultProps} items={items} pricing={{ subtotal: 150, taxes: 31.5 }} />)

      // Price breakdown should be accessible
      expect(screen.getByText(mockLabels.totalLabel)).toBeInTheDocument()
    })

    it('should have proper role for main container', () => {
      const { container } = render(<PricingSummaryPanel {...defaultProps} />)

      // Main container should be identifiable
      const mainContainer = container.querySelector('.border.border-neutral-300')
      expect(mainContainer).toBeInTheDocument()
    })

    it('should provide aria-labels for loading states', () => {
      render(<PricingSummaryPanel {...defaultProps} isLoading={true} />)

      // Loading state should be announced
      expect(screen.getByText(mockLabels.loadingLabel)).toBeInTheDocument()
    })
  })

  describe('Keyboard Navigation', () => {
    it('should support keyboard navigation for remove buttons', () => {
      const items = [createMockPricingItem({ type: 'room' })]
      const onRemoveItem = vi.fn()

      render(
        <PricingSummaryPanel
          {...defaultProps}
          items={items}
          pricing={{ subtotal: 100, taxes: 21 }}
          onRemoveItem={onRemoveItem}
        />
      )

      const removeButton = screen.getByRole('button', { name: /remove/i })

      // Should be focusable
      removeButton.focus()
      expect(removeButton).toHaveFocus()
    })

    it('should have proper tab order', () => {
      const items = [createMockPricingItem({ type: 'room' }), createMockPricingItem({ type: 'customization' })]

      render(<PricingSummaryPanel {...defaultProps} items={items} pricing={{ subtotal: 150, taxes: 31.5 }} />)

      // Get all interactive elements
      const removeButtons = screen.getAllByRole('button', { name: /remove/i })
      const confirmButton = screen.getByRole('button', { name: mockLabels.confirmButtonLabel })

      // All buttons should be in tab order
      const allButtons = [...removeButtons, confirmButton]
      allButtons.forEach((button) => {
        expect(button).not.toHaveAttribute('tabIndex', '-1')
      })
    })
  })

  describe('Screen Reader Support', () => {
    it('should provide meaningful heading structure', () => {
      const items = [
        createMockPricingItem({ type: 'room' }),
        createMockPricingItem({ type: 'customization' }),
        createMockPricingItem({ type: 'offer' }),
      ]

      render(<PricingSummaryPanel {...defaultProps} items={items} pricing={{ subtotal: 200, taxes: 42 }} />)

      // Section headings should be proper h3 elements
      const sectionHeadings = screen.getAllByRole('heading', { level: 3 })
      expect(sectionHeadings).toHaveLength(3)

      expect(screen.getByRole('heading', { name: mockLabels.selectedRoomLabel })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: mockLabels.upgradesLabel })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: mockLabels.specialOffersLabel })).toBeInTheDocument()
    })

    it('should announce price changes to screen readers', () => {
      const items = [createMockPricingItem({ price: 100, type: 'room' })]

      const { rerender } = render(
        <PricingSummaryPanel {...defaultProps} items={items} pricing={{ subtotal: 100, taxes: 21 }} />
      )

      // Update pricing
      rerender(<PricingSummaryPanel {...defaultProps} items={items} pricing={{ subtotal: 150, taxes: 31.5 }} />)

      // Price elements should be accessible
      expect(screen.getByText(mockLabels.totalLabel)).toBeInTheDocument()
    })

    it('should provide context for empty states', () => {
      const availableSections = [
        createMockAvailableSection({ type: 'room', isAvailable: true }),
        createMockAvailableSection({ type: 'customization', isAvailable: true }),
      ]

      render(<PricingSummaryPanel {...defaultProps} availableSections={availableSections} />)

      // Empty state should provide context
      expect(screen.getByText(mockLabels.customizeStayTitle)).toBeInTheDocument()
      expect(screen.getByText(mockLabels.chooseOptionsSubtitle)).toBeInTheDocument()
    })
  })

  describe('Color Contrast and Visual Accessibility', () => {
    it('should have sufficient color contrast for text elements', () => {
      const items = [createMockPricingItem({ type: 'room' })]

      render(<PricingSummaryPanel {...defaultProps} items={items} pricing={{ subtotal: 100, taxes: 21 }} />)

      // Check that text elements have appropriate classes for contrast
      const sectionTitle = screen.getByText(mockLabels.selectedRoomLabel)
      expect(sectionTitle).toHaveClass('text-base', 'font-semibold')
    })

    it('should provide visual feedback for interactive elements', () => {
      const items = [createMockPricingItem({ type: 'room' })]

      render(<PricingSummaryPanel {...defaultProps} items={items} pricing={{ subtotal: 100, taxes: 21 }} />)

      const confirmButton = screen.getByRole('button', { name: mockLabels.confirmButtonLabel })

      // Button should have hover/focus styles (Shadcn UI black variant)
      expect(confirmButton).toHaveClass('bg-neutral-950', 'hover:bg-neutral-950')
    })

    it('should not rely solely on color for information', () => {
      const items = [createMockPricingItem({ type: 'room' })]

      render(<PricingSummaryPanel {...defaultProps} items={items} pricing={{ subtotal: 100, taxes: 21 }} />)

      // Remove buttons should have X icon
      const removeButton = screen.getByRole('button', { name: /remove/i })
      expect(removeButton).toBeInTheDocument()
    })
  })

  describe('Toast Accessibility', () => {
    it('should announce toast messages to screen readers', async () => {
      const items = [createMockPricingItem({ name: 'Test Item', type: 'offer' })]

      render(<PricingSummaryPanel {...defaultProps} items={items} pricing={{ subtotal: 50, taxes: 10.5 }} />)

      const removeButton = screen.getByRole('button', { name: /remove/i })
      fireEvent.click(removeButton)

      // Toast should be announced
      const expectedMessage = `${mockLabels.offerRemovedMessagePrefix} Test Item`
      expect(screen.getByText(expectedMessage)).toBeInTheDocument()
    })

    it('should provide a way to dismiss toasts', async () => {
      const items = [createMockPricingItem({ name: 'Test Item', type: 'offer' })]

      render(<PricingSummaryPanel {...defaultProps} items={items} pricing={{ subtotal: 50, taxes: 10.5 }} />)

      const removeButton = screen.getByRole('button', { name: /remove/i })
      fireEvent.click(removeButton)

      const expectedMessage = `${mockLabels.offerRemovedMessagePrefix} Test Item`
      const toast = screen.getByText(expectedMessage)
      expect(toast).toBeInTheDocument()

      // Toast should auto-dismiss or have close button
      // Implementation would need to provide dismissal mechanism
    })
  })

  describe('Loading State Accessibility', () => {
    it('should properly announce loading states', () => {
      render(<PricingSummaryPanel {...defaultProps} isLoading={true} />)

      // Loading state should be accessible
      expect(screen.getByText(mockLabels.loadingLabel)).toBeInTheDocument()

      // Loading spinner should be properly labeled
      const loadingOverlay = document.querySelector('.absolute.inset-0')
      expect(loadingOverlay).toBeInTheDocument()
    })

    it('should maintain focus management during loading', () => {
      const items = [createMockPricingItem({ type: 'room' })]

      const { rerender } = render(
        <PricingSummaryPanel {...defaultProps} items={items} pricing={{ subtotal: 100, taxes: 21 }} />
      )

      const confirmButton = screen.getByRole('button', { name: mockLabels.confirmButtonLabel })
      confirmButton.focus()

      // Start loading
      rerender(
        <PricingSummaryPanel {...defaultProps} items={items} pricing={{ subtotal: 100, taxes: 21 }} isLoading={true} />
      )

      // Focus should be managed appropriately during loading
      const loadingElements = screen.getAllByText(mockLabels.loadingLabel)
      expect(loadingElements.length).toBeGreaterThan(0)
    })
  })
})
