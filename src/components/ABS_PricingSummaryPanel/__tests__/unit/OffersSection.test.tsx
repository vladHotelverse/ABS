import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { render } from '../../../../__tests__/helpers'
import OffersSection from '../../components/OffersSection'
import type { PricingItem } from '../../types'
import { createMockPricingLabels, createMockPricingItem } from '../../../../__tests__/helpers'

const mockLabels = createMockPricingLabels()

describe('OffersSection', () => {
  const defaultProps = {
    labels: mockLabels,
    onRemoveItem: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render nothing when no offer items', () => {
      render(<OffersSection {...defaultProps} offerItems={[]} />)

      expect(screen.queryByText(mockLabels.specialOffersLabel)).not.toBeInTheDocument()
    })

    it('should render offers section with items', () => {
      const offerItems: PricingItem[] = [
        createMockPricingItem({ id: 1, name: 'Early Bird Discount', price: -20, type: 'offer' }),
        createMockPricingItem({ id: 2, name: 'Spa Package', price: 75, type: 'offer' }),
      ]

      render(<OffersSection {...defaultProps} offerItems={offerItems} />)

      expect(screen.getByText(mockLabels.specialOffersLabel)).toBeInTheDocument()
      expect(screen.getByText('Early Bird Discount')).toBeInTheDocument()
      expect(screen.getByText('Spa Package')).toBeInTheDocument()
    })

    it('should render remove buttons for each item', () => {
      const offerItems: PricingItem[] = [
        createMockPricingItem({ id: 1, name: 'Offer 1', type: 'offer' }),
        createMockPricingItem({ id: 2, name: 'Offer 2', type: 'offer' }),
      ]

      render(<OffersSection {...defaultProps} offerItems={offerItems} />)

      const removeButtons = screen.getAllByRole('button', { name: /Remove/ })
      expect(removeButtons).toHaveLength(2)
      expect(screen.getByRole('button', { name: 'Remove Offer 1' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Remove Offer 2' })).toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('should call onRemoveItem when remove button is clicked', () => {
      const offerItem = createMockPricingItem({ id: 1, name: 'Test Offer', type: 'offer' })
      const offerItems: PricingItem[] = [offerItem]

      render(<OffersSection {...defaultProps} offerItems={offerItems} />)

      const removeButton = screen.getByRole('button', { name: 'Remove Test Offer' })
      fireEvent.click(removeButton)

      expect(defaultProps.onRemoveItem).toHaveBeenCalledWith(offerItem)
    })

    it('should handle multiple item removals correctly', () => {
      const offerItems: PricingItem[] = [
        createMockPricingItem({ id: 1, name: 'Offer 1', type: 'offer' }),
        createMockPricingItem({ id: 2, name: 'Offer 2', type: 'offer' }),
      ]

      render(<OffersSection {...defaultProps} offerItems={offerItems} />)

      const removeButton1 = screen.getByRole('button', { name: 'Remove Offer 1' })
      const removeButton2 = screen.getByRole('button', { name: 'Remove Offer 2' })

      fireEvent.click(removeButton1)
      expect(defaultProps.onRemoveItem).toHaveBeenCalledWith(offerItems[0])

      fireEvent.click(removeButton2)
      expect(defaultProps.onRemoveItem).toHaveBeenCalledWith(offerItems[1])
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA structure', () => {
      const offerItems: PricingItem[] = [createMockPricingItem({ type: 'offer' })]

      render(<OffersSection {...defaultProps} offerItems={offerItems} />)

      const section = screen.getByRole('region')
      expect(section).toHaveAttribute('aria-labelledby')

      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toBeInTheDocument()
    })

    it('should have proper heading hierarchy', () => {
      const offerItems: PricingItem[] = [createMockPricingItem({ type: 'offer' })]

      render(<OffersSection {...defaultProps} offerItems={offerItems} />)

      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toHaveTextContent(mockLabels.specialOffersLabel)
    })

    it('should provide proper context for screen readers', () => {
      const offerItems: PricingItem[] = [createMockPricingItem({ name: 'Honeymoon Package', type: 'offer' })]

      render(<OffersSection {...defaultProps} offerItems={offerItems} />)

      const removeButton = screen.getByRole('button', { name: 'Remove Honeymoon Package' })
      expect(removeButton).toHaveAttribute('aria-label', 'Remove Honeymoon Package')
    })
  })

  describe('Special Offer Types', () => {
    it('should handle discount offers (negative prices)', () => {
      const offerItems: PricingItem[] = [createMockPricingItem({ name: '20% Discount', price: -50, type: 'offer' })]

      render(<OffersSection {...defaultProps} offerItems={offerItems} />)

      expect(screen.getByText('20% Discount')).toBeInTheDocument()
    })

    it('should handle premium offers (positive prices)', () => {
      const offerItems: PricingItem[] = [createMockPricingItem({ name: 'Premium Package', price: 100, type: 'offer' })]

      render(<OffersSection {...defaultProps} offerItems={offerItems} />)

      expect(screen.getByText('Premium Package')).toBeInTheDocument()
    })

    it('should handle free offers (zero price)', () => {
      const offerItems: PricingItem[] = [
        createMockPricingItem({ name: 'Complimentary Breakfast', price: 0, type: 'offer' }),
      ]

      render(<OffersSection {...defaultProps} offerItems={offerItems} />)

      expect(screen.getByText('Complimentary Breakfast')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle missing item properties gracefully', () => {
      const offerItems: PricingItem[] = [{ id: 1, name: '', price: 0, type: 'offer' } as PricingItem]

      render(<OffersSection {...defaultProps} offerItems={offerItems} />)

      expect(screen.getByText(mockLabels.specialOffersLabel)).toBeInTheDocument()
    })

    it('should handle items with long names', () => {
      const offerItems: PricingItem[] = [
        createMockPricingItem({
          name: 'Premium All-Inclusive Spa and Wellness Package with Complimentary Services',
          type: 'offer',
        }),
      ]

      render(<OffersSection {...defaultProps} offerItems={offerItems} />)

      expect(
        screen.getByText('Premium All-Inclusive Spa and Wellness Package with Complimentary Services')
      ).toBeInTheDocument()
    })

    it('should handle items with special characters in names', () => {
      const offerItems: PricingItem[] = [createMockPricingItem({ name: 'Café & Spa', type: 'offer' })]

      render(<OffersSection {...defaultProps} offerItems={offerItems} />)

      expect(screen.getByText('Café & Spa')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Remove Café & Spa' })).toBeInTheDocument()
    })

    it('should handle remove callback errors gracefully', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      const offerItems: PricingItem[] = [createMockPricingItem({ type: 'offer' })]

      const errorProps = {
        ...defaultProps,
        onRemoveItem: vi.fn(() => {
          throw new Error('Callback error')
        }),
      }

      render(<OffersSection {...errorProps} offerItems={offerItems} />)

      const removeButton = screen.getAllByRole('button')[0]

      // Should not crash the component and should log error
      expect(() => {
        fireEvent.click(removeButton)
      }).not.toThrow()

      expect(consoleError).toHaveBeenCalledWith('Error in remove item callback:', expect.any(Error))
      consoleError.mockRestore()
    })
  })
})
