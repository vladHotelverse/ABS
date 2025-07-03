import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { render } from '../../../../__tests__/helpers'
import Header from '../../index'
import type { HeaderProps } from '../../index'

// Mock the currency utility
vi.mock('../../../lib/currency', () => ({
  formatPrice: (price: number, symbol: string) => `${symbol}${price.toFixed(2)}`,
}))

const defaultProps: HeaderProps = {
  totalPrice: 150.0,
  currencySymbol: '€',
  totalLabel: 'Total:',
  onCartClick: vi.fn(),
  itemsInCart: 3,
  isLoading: false,
  isSticky: true,
}

describe('ABS_Header', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic functionality', () => {
    it('should render logo animation on mount', async () => {
      render(<Header {...defaultProps} />)

      // Check that animation elements are present
      const logoContainer = document.querySelector('.logo-container')
      expect(logoContainer).toBeInTheDocument()

      const initialH = document.querySelector('#initialH')
      const fullText = document.querySelector('#fullText')
      expect(initialH).toBeInTheDocument()
      expect(fullText).toBeInTheDocument()
    })

    it('should display formatted price correctly', () => {
      render(<Header {...defaultProps} />)

      expect(screen.getByText('€150.00')).toBeInTheDocument()
      expect(screen.getByText('Total:')).toBeInTheDocument()
    })

    it('should show cart items count in aria-label', () => {
      render(<Header {...defaultProps} />)

      const cartButton = screen.getByLabelText(/Shopping cart with 3 items/i)
      expect(cartButton).toBeInTheDocument()
    })

    it('should handle cart click events', () => {
      const onCartClick = vi.fn()
      render(<Header {...defaultProps} onCartClick={onCartClick} />)

      const cartButton = screen.getByRole('button', { name: /shopping cart/i })
      fireEvent.click(cartButton)

      expect(onCartClick).toHaveBeenCalledTimes(1)
    })

    it('should disable cart button when loading', () => {
      render(<Header {...defaultProps} isLoading={true} />)

      const cartButton = screen.getByRole('button', { name: /shopping cart/i })
      expect(cartButton).toBeDisabled()
    })
  })

  describe('Price formatting', () => {
    it('should format price with different currency symbols', () => {
      render(<Header {...defaultProps} currencySymbol="$" totalPrice={99.99} />)

      expect(screen.getByText('$99.99')).toBeInTheDocument()
    })

    it('should handle zero price', () => {
      render(<Header {...defaultProps} totalPrice={0} />)

      expect(screen.getByText('€0.00')).toBeInTheDocument()
    })

    it('should handle undefined price (defaults to 0)', () => {
      render(<Header {...defaultProps} totalPrice={undefined} />)

      expect(screen.getByText('€0.00')).toBeInTheDocument()
    })
  })

  describe('Styling and layout', () => {
    it('should apply sticky positioning when isSticky is true', () => {
      render(<Header {...defaultProps} isSticky={true} />)

      const header = screen.getByRole('banner')
      expect(header).toHaveClass('sticky', 'top-0', 'z-50')
    })

    it('should not apply sticky positioning when isSticky is false', () => {
      render(<Header {...defaultProps} isSticky={false} />)

      const header = screen.getByRole('banner')
      expect(header).not.toHaveClass('sticky')
    })

    it('should apply custom className', () => {
      render(<Header {...defaultProps} className="custom-header" />)

      const header = screen.getByRole('banner')
      expect(header).toHaveClass('custom-header')
    })

    it('should have correct background and text colors', () => {
      render(<Header {...defaultProps} />)

      const header = screen.getByRole('banner')
      expect(header).toHaveClass('bg-black', 'text-white')
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels for cart button', () => {
      render(<Header {...defaultProps} itemsInCart={5} totalPrice={200.5} />)

      const cartButton = screen.getByLabelText('Shopping cart with 5 items. Total: €200.50')
      expect(cartButton).toBeInTheDocument()
    })

    it('should be keyboard accessible', () => {
      const onCartClick = vi.fn()
      render(<Header {...defaultProps} onCartClick={onCartClick} />)

      const cartButton = screen.getByRole('button', { name: /shopping cart/i })

      // Test that button can receive focus
      cartButton.focus()
      expect(cartButton).toHaveFocus()

      // Button should be activatable (this implicitly tests keyboard accessibility)
      expect(cartButton).not.toBeDisabled()
      expect(cartButton).toHaveAttribute('aria-label')
    })

    it('should have proper semantic header element', () => {
      render(<Header {...defaultProps} />)

      const header = screen.getByRole('banner')
      expect(header.tagName).toBe('HEADER')
    })
  })

  describe('Animation behavior', () => {
    it('should initialize logo animation on mount', () => {
      render(<Header {...defaultProps} />)

      // Check that SVG elements for animation are present
      const initialH = document.querySelector('#initialH')
      const fullText = document.querySelector('#fullText')

      expect(initialH).toBeInTheDocument()
      expect(fullText).toBeInTheDocument()
    })

    it('should have animation CSS classes', () => {
      render(<Header {...defaultProps} />)

      const initialH = document.querySelector('#initialH')
      expect(initialH).toHaveClass('transform-gpu')

      const logoContainer = document.querySelector('.logo-container')
      expect(logoContainer).toBeInTheDocument()
    })
  })

  describe('Edge cases', () => {
    it('should handle missing onCartClick prop gracefully', () => {
      const props = { ...defaultProps }
      props.onCartClick = undefined

      expect(() => render(<Header {...props} />)).not.toThrow()

      const cartButton = screen.getByRole('button', { name: /shopping cart/i })
      expect(() => fireEvent.click(cartButton)).not.toThrow()
    })

    it('should handle large item counts', () => {
      render(<Header {...defaultProps} itemsInCart={999} />)

      const cartButton = screen.getByLabelText(/Shopping cart with 999 items/i)
      expect(cartButton).toBeInTheDocument()
    })

    it('should handle very large prices', () => {
      render(<Header {...defaultProps} totalPrice={9999.99} />)

      expect(screen.getByText('€9999.99')).toBeInTheDocument()
    })
  })
})
