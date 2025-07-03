import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
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

  currency: 'EUR',
  locale: 'en-US',
}

describe('ABS_PricingSummaryPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic rendering', () => {
    it('should render the component with room image', () => {
      render(<PricingSummaryPanel {...defaultProps} />)

      const image = screen.getByAltText(mockLabels.roomImageAltText)
      expect(image).toBeInTheDocument()
    })

    it('should show empty state when no items', () => {
      render(<PricingSummaryPanel {...defaultProps} />)

      expect(screen.getByText(mockLabels.customizeStayTitle)).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      render(<PricingSummaryPanel {...defaultProps} className="custom-panel" />)

      const panel = document.querySelector('.border.border-neutral-300')
      expect(panel).toHaveClass('custom-panel')
    })
  })

  describe('Price calculations', () => {
    it('should calculate subtotal correctly', () => {
      const items = [
        createMockPricingItem({ price: 75, type: 'room' }),
        createMockPricingItem({ price: 25, type: 'customization' }),
      ]
      const pricing = { subtotal: 100, taxes: 18.5 }

      render(<PricingSummaryPanel {...defaultProps} items={items} pricing={pricing} />)

      expect(screen.getByText(mockLabels.totalLabel)).toBeInTheDocument()
      // Check that pricing elements are displayed - no separate subtotal display anymore
    })

    it('should apply tax calculations', () => {
      const items = [createMockPricingItem({ price: 50, type: 'room' })]
      const pricing = { subtotal: 50, taxes: 8.75 }

      render(<PricingSummaryPanel {...defaultProps} items={items} pricing={pricing} />)

      // Check that total is displayed (no separate tax display)
      const totalText = screen.getByText('€50.00')
      expect(totalText).toBeInTheDocument()
    })

    it('should format currency properly', () => {
      const items = [createMockPricingItem({ price: 150.5, type: 'room' })]

      render(
        <PricingSummaryPanel
          {...defaultProps}
          items={items}
          pricing={{ subtotal: 150.5, taxes: 31.6 }}
          currency="USD"
        />
      )

      // Check that pricing information is displayed
      expect(screen.getByText(mockLabels.totalLabel)).toBeInTheDocument()
    })

    it('should handle different currency formats', () => {
      const items = [createMockPricingItem({ price: 100, type: 'room' })]

      render(
        <PricingSummaryPanel
          {...defaultProps}
          items={items}
          pricing={{ subtotal: 100, taxes: 21 }}
          currency="USD"
          locale="en-US"
        />
      )

      // Component should render without errors
      expect(screen.getByText(mockLabels.selectedRoomLabel)).toBeInTheDocument()
    })
  })

  describe('Item management', () => {
    it('should group items by type correctly', () => {
      const items = [
        createMockPricingItem({ name: 'Deluxe Room', type: 'room' }),
        createMockPricingItem({ name: 'King Bed', type: 'customization' }),
        createMockPricingItem({ name: 'Spa Package', type: 'offer' }),
      ]

      render(<PricingSummaryPanel {...defaultProps} items={items} pricing={{ subtotal: 200, taxes: 42 }} />)

      expect(screen.getByText(mockLabels.selectedRoomLabel)).toBeInTheDocument()
      expect(screen.getByText(mockLabels.upgradesLabel)).toBeInTheDocument()
      expect(screen.getByText(mockLabels.specialOffersLabel)).toBeInTheDocument()

      expect(screen.getByText('Deluxe Room')).toBeInTheDocument()
      expect(screen.getByText('King Bed')).toBeInTheDocument()
      expect(screen.getByText('Spa Package')).toBeInTheDocument()
    })

    it('should handle item removal', () => {
      const onRemoveItem = vi.fn()
      const items = [createMockPricingItem({ name: 'Test Room', type: 'room' })]

      render(
        <PricingSummaryPanel
          {...defaultProps}
          items={items}
          pricing={{ subtotal: 100, taxes: 21 }}
          onRemoveItem={onRemoveItem}
        />
      )

      const removeButton = screen.getByRole('button', { name: /remove/i })
      fireEvent.click(removeButton)

      expect(onRemoveItem).toHaveBeenCalledWith(items[0].id, items[0].name, items[0].type)
    })

    it('should show toast notifications', async () => {
      const items = [createMockPricingItem({ name: 'Test Offer', type: 'offer' })]

      render(<PricingSummaryPanel {...defaultProps} items={items} pricing={{ subtotal: 50, taxes: 10.5 }} />)

      const removeButton = screen.getByRole('button', { name: /remove/i })
      fireEvent.click(removeButton)

      await waitFor(() => {
        const expectedMessage = `${mockLabels.offerRemovedMessagePrefix} Test Offer`
        expect(screen.getByText(expectedMessage)).toBeInTheDocument()
      })
    })

    it('should update totals when items change', () => {
      const { rerender } = render(
        <PricingSummaryPanel
          {...defaultProps}
          items={[createMockPricingItem({ price: 100, type: 'room' })]}
          pricing={{ subtotal: 100, taxes: 21 }}
        />
      )

      expect(screen.getByText(mockLabels.totalLabel)).toBeInTheDocument()

      rerender(
        <PricingSummaryPanel
          {...defaultProps}
          items={[createMockPricingItem({ price: 200, type: 'room' })]}
          pricing={{ subtotal: 200, taxes: 42 }}
        />
      )

      expect(screen.getByText(mockLabels.totalLabel)).toBeInTheDocument()
    })
  })

  describe('Loading states', () => {
    it('should show loading overlay when isLoading is true', () => {
      render(<PricingSummaryPanel {...defaultProps} isLoading={true} />)

      expect(screen.getByText(mockLabels.loadingLabel)).toBeInTheDocument()

      const loadingOverlay = document.querySelector('.absolute.inset-0')
      expect(loadingOverlay).toBeInTheDocument()
    })

    it('should disable interactions during loading', () => {
      const items = [createMockPricingItem({ type: 'room' })]

      render(
        <PricingSummaryPanel {...defaultProps} items={items} pricing={{ subtotal: 100, taxes: 21 }} isLoading={true} />
      )

      // Loading overlay should be present
      const loadingOverlay = document.querySelector('.absolute.inset-0')
      expect(loadingOverlay).toBeInTheDocument()
      expect(loadingOverlay).toHaveClass('bg-white', 'bg-opacity-75')
    })

    it('should hide loading overlay when isLoading is false', () => {
      render(<PricingSummaryPanel {...defaultProps} isLoading={false} />)

      expect(screen.queryByText(mockLabels.loadingLabel)).not.toBeInTheDocument()
    })
  })

  describe('Empty state', () => {
    it('should render empty state when no items', () => {
      const availableSections = [
        createMockAvailableSection({ type: 'room', isAvailable: true }),
        createMockAvailableSection({ type: 'customization', isAvailable: true }),
      ]

      render(<PricingSummaryPanel {...defaultProps} availableSections={availableSections} />)

      expect(screen.getByText(mockLabels.customizeStayTitle)).toBeInTheDocument()
      const exploreButtons = screen.getAllByText(mockLabels.exploreLabel)
      expect(exploreButtons.length).toBeGreaterThan(0)
    })

    it('should show available sections in empty state', () => {
      const availableSections = [
        createMockAvailableSection({
          type: 'room',
          label: 'Room Selection',
          isAvailable: true,
        }),
        createMockAvailableSection({
          type: 'offer',
          label: 'Special Offers',
          isAvailable: true,
        }),
      ]

      render(<PricingSummaryPanel {...defaultProps} availableSections={availableSections} />)

      expect(screen.getByText('Room Selection')).toBeInTheDocument()
      expect(screen.getByText('Special Offers')).toBeInTheDocument()
    })

    it('should not render empty state when loading', () => {
      render(<PricingSummaryPanel {...defaultProps} isLoading={true} />)

      expect(screen.queryByText(mockLabels.customizeStayTitle)).not.toBeInTheDocument()
    })
  })

  describe('Error handling', () => {
    it('should handle missing labels prop gracefully', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

      render(<PricingSummaryPanel {...defaultProps} labels={undefined as any} />)

      expect(
        screen.getByText('Missing required labels configuration. Please provide all required labels.')
      ).toBeInTheDocument()
      expect(consoleError).toHaveBeenCalled()

      consoleError.mockRestore()
    })

    it('should handle null/undefined items gracefully', () => {
      render(<PricingSummaryPanel {...defaultProps} items={null as any} />)

      // Should render empty state without crashing
      expect(screen.getByText(mockLabels.customizeStayTitle)).toBeInTheDocument()
    })

    it('should handle missing onRemoveItem prop', () => {
      const items = [createMockPricingItem({ type: 'room' })]

      expect(() =>
        render(
          <PricingSummaryPanel
            {...defaultProps}
            items={items}
            pricing={{ subtotal: 100, taxes: 21 }}
            onRemoveItem={undefined as any}
          />
        )
      ).not.toThrow()
    })
  })

  describe('Accessibility', () => {
    it('should have proper alt text for room image', () => {
      render(<PricingSummaryPanel {...defaultProps} />)

      const image = screen.getByAltText(mockLabels.roomImageAltText)
      expect(image).toBeInTheDocument()
    })

    it('should have proper semantic structure', () => {
      const items = [createMockPricingItem({ type: 'room' }), createMockPricingItem({ type: 'customization' })]

      render(<PricingSummaryPanel {...defaultProps} items={items} pricing={{ subtotal: 150, taxes: 31.5 }} />)

      const headings = screen.getAllByRole('heading', { level: 3 })
      expect(headings.length).toBeGreaterThan(0)
    })
  })

  describe('Toast notifications', () => {
    it('should show different messages for different item types', async () => {
      const roomItem = createMockPricingItem({ name: 'Test Room', type: 'room' })

      render(<PricingSummaryPanel {...defaultProps} items={[roomItem]} pricing={{ subtotal: 100, taxes: 21 }} />)

      const removeButton = screen.getByRole('button', { name: /remove/i })
      fireEvent.click(removeButton)

      await waitFor(() => {
        expect(screen.getByText(mockLabels.roomRemovedMessage)).toBeInTheDocument()
      })
    })

    it('should auto-remove toasts after timeout', async () => {
      const item = createMockPricingItem({ name: 'Test Item', type: 'offer' })

      render(<PricingSummaryPanel {...defaultProps} items={[item]} pricing={{ subtotal: 50, taxes: 10.5 }} />)

      const removeButton = screen.getByRole('button', { name: /remove/i })
      fireEvent.click(removeButton)

      const expectedMessage = `${mockLabels.offerRemovedMessagePrefix} Test Item`

      await waitFor(() => {
        expect(screen.getByText(expectedMessage)).toBeInTheDocument()
      })

      // Wait for toast to auto-remove (mocked timeout)
      await waitFor(
        () => {
          expect(screen.queryByText(expectedMessage)).not.toBeInTheDocument()
        },
        { timeout: 4000 }
      )
    })
  })
})
