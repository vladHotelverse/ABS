import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { render } from '../../../../__tests__/helpers'
import CustomizationsSection from '../../components/CustomizationsSection'
import type { PricingItem } from '../../types'
import { createMockPricingLabels, createMockPricingItem } from '../../../../__tests__/helpers'

const mockLabels = createMockPricingLabels()

describe('CustomizationsSection', () => {
  const defaultProps = {
    labels: mockLabels,
    onRemoveItem: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render nothing when no customization items', () => {
      render(<CustomizationsSection {...defaultProps} customizationItems={[]} />)

      expect(screen.queryByText(mockLabels.upgradesLabel)).not.toBeInTheDocument()
    })

    it('should render customizations section with items', () => {
      const customizationItems: PricingItem[] = [
        createMockPricingItem({ id: 1, name: 'Premium Bedding', price: 25, type: 'customization' }),
        createMockPricingItem({ id: 2, name: 'Late Checkout', price: 30, type: 'customization' }),
      ]

      render(<CustomizationsSection {...defaultProps} customizationItems={customizationItems} />)

      expect(screen.getByText(mockLabels.upgradesLabel)).toBeInTheDocument()
      expect(screen.getByText('Premium Bedding')).toBeInTheDocument()
      expect(screen.getByText('Late Checkout')).toBeInTheDocument()
    })

    it('should render remove buttons for each item', () => {
      const customizationItems: PricingItem[] = [
        createMockPricingItem({ id: 1, name: 'Customization 1', type: 'customization' }),
        createMockPricingItem({ id: 2, name: 'Customization 2', type: 'customization' }),
      ]

      render(<CustomizationsSection {...defaultProps} customizationItems={customizationItems} />)

      const removeButtons = screen.getAllByRole('button', { name: /Remove/ })
      expect(removeButtons).toHaveLength(2)
      expect(screen.getByRole('button', { name: 'Remove Customization 1' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Remove Customization 2' })).toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('should call onRemoveItem when remove button is clicked', () => {
      const customizationItem = createMockPricingItem({ id: 1, name: 'Test Customization', type: 'customization' })
      const customizationItems: PricingItem[] = [customizationItem]

      render(<CustomizationsSection {...defaultProps} customizationItems={customizationItems} />)

      const removeButton = screen.getByRole('button', { name: 'Remove Test Customization' })
      fireEvent.click(removeButton)

      expect(defaultProps.onRemoveItem).toHaveBeenCalledWith(customizationItem)
    })

    it('should handle multiple item removals correctly', () => {
      const customizationItems: PricingItem[] = [
        createMockPricingItem({ id: 1, name: 'Customization 1', type: 'customization' }),
        createMockPricingItem({ id: 2, name: 'Customization 2', type: 'customization' }),
      ]

      render(<CustomizationsSection {...defaultProps} customizationItems={customizationItems} />)

      const removeButton1 = screen.getByRole('button', { name: 'Remove Customization 1' })
      const removeButton2 = screen.getByRole('button', { name: 'Remove Customization 2' })

      fireEvent.click(removeButton1)
      expect(defaultProps.onRemoveItem).toHaveBeenCalledWith(customizationItems[0])

      fireEvent.click(removeButton2)
      expect(defaultProps.onRemoveItem).toHaveBeenCalledWith(customizationItems[1])
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA structure', () => {
      const customizationItems: PricingItem[] = [createMockPricingItem({ type: 'customization' })]

      render(<CustomizationsSection {...defaultProps} customizationItems={customizationItems} />)

      const section = screen.getByRole('region')
      expect(section).toHaveAttribute('aria-labelledby')

      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toBeInTheDocument()
    })

    it('should have proper heading hierarchy', () => {
      const customizationItems: PricingItem[] = [createMockPricingItem({ type: 'customization' })]

      render(<CustomizationsSection {...defaultProps} customizationItems={customizationItems} />)

      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toHaveTextContent(mockLabels.upgradesLabel)
    })

    it('should provide proper context for screen readers', () => {
      const customizationItems: PricingItem[] = [
        createMockPricingItem({ name: 'Wi-Fi Upgrade', type: 'customization' }),
      ]

      render(<CustomizationsSection {...defaultProps} customizationItems={customizationItems} />)

      const removeButton = screen.getByRole('button', { name: 'Remove Wi-Fi Upgrade' })
      expect(removeButton).toHaveAttribute('aria-label', 'Remove Wi-Fi Upgrade')
    })
  })

  describe('Edge Cases', () => {
    it('should handle missing item properties gracefully', () => {
      const customizationItems: PricingItem[] = [{ id: 1, name: '', price: 0, type: 'customization' } as PricingItem]

      render(<CustomizationsSection {...defaultProps} customizationItems={customizationItems} />)

      expect(screen.getByText(mockLabels.upgradesLabel)).toBeInTheDocument()
    })

    it('should handle items with special characters in names', () => {
      const customizationItems: PricingItem[] = [
        createMockPricingItem({ name: 'Café & Breakfast', type: 'customization' }),
      ]

      render(<CustomizationsSection {...defaultProps} customizationItems={customizationItems} />)

      expect(screen.getByText('Café & Breakfast')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Remove Café & Breakfast' })).toBeInTheDocument()
    })

    it('should handle remove callback errors gracefully', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      const customizationItems: PricingItem[] = [createMockPricingItem({ type: 'customization' })]

      const errorProps = {
        ...defaultProps,
        onRemoveItem: vi.fn(() => {
          throw new Error('Callback error')
        }),
      }

      render(<CustomizationsSection {...errorProps} customizationItems={customizationItems} />)

      const removeButton = screen.getAllByRole('button')[0]

      // Should not crash the component and should log error
      expect(() => {
        fireEvent.click(removeButton)
      }).not.toThrow()

      expect(consoleError).toHaveBeenCalledWith('Error in remove item callback:', expect.any(Error))
      consoleError.mockRestore()
    })

    it('should handle large numbers of customizations', () => {
      const customizationItems: PricingItem[] = Array.from({ length: 10 }, (_, i) =>
        createMockPricingItem({
          id: i + 1,
          name: `Customization ${i + 1}`,
          type: 'customization',
        })
      )

      render(<CustomizationsSection {...defaultProps} customizationItems={customizationItems} />)

      expect(screen.getByText(mockLabels.upgradesLabel)).toBeInTheDocument()
      expect(screen.getAllByRole('button', { name: /Remove/ })).toHaveLength(10)
    })
  })
})
