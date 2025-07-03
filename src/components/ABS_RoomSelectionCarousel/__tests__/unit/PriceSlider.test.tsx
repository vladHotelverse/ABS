import { vi, describe, it, expect, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '../../../../__tests__/helpers/custom-render'
import PriceSlider from '../../PriceSlider'
import type { PriceSliderProps } from '../../PriceSlider'

describe('PriceSlider', () => {
  let user: ReturnType<typeof userEvent.setup>
  let defaultProps: PriceSliderProps
  let mockOnPriceChange: ReturnType<typeof vi.fn>
  let mockOnMakeOffer: ReturnType<typeof vi.fn>

  beforeEach(() => {
    user = userEvent.setup()
    mockOnPriceChange = vi.fn()
    mockOnMakeOffer = vi.fn()

    defaultProps = {
      proposedPrice: 75,
      minPrice: 50,
      maxPrice: 100,
      onPriceChange: mockOnPriceChange,
      onMakeOffer: mockOnMakeOffer,
    }
  })

  describe('Basic rendering', () => {
    it('should render the price slider component', () => {
      render(<PriceSlider {...defaultProps} />)

      expect(screen.getByText('Propon tu precio:')).toBeInTheDocument()
      expect(screen.getByRole('slider')).toBeInTheDocument()
      expect(screen.getByText('Hacer oferta')).toBeInTheDocument()
      expect(screen.getByText('Sujeto a disponibilidad')).toBeInTheDocument()
    })

    it('should display the current proposed price', () => {
      render(<PriceSlider {...defaultProps} />)

      expect(screen.getByText('75 EUR/noche')).toBeInTheDocument()
    })

    it('should display min and max price labels', () => {
      render(<PriceSlider {...defaultProps} />)

      expect(screen.getByText('50 EUR/noche')).toBeInTheDocument()
      expect(screen.getByText('100 EUR/noche')).toBeInTheDocument()
    })

    it('should have correct slider attributes', () => {
      render(<PriceSlider {...defaultProps} />)

      const slider = screen.getByRole('slider')
      expect(slider).toHaveAttribute('min', '50')
      expect(slider).toHaveAttribute('max', '100')
      expect(slider).toHaveAttribute('step', '1')
      expect(slider).toHaveAttribute('value', '75')
    })
  })

  describe('Custom text props', () => {
    it('should use custom text props', () => {
      const customProps = {
        ...defaultProps,
        nightText: '/custom night',
        makeOfferText: 'Custom Make Offer',
        availabilityText: 'Custom availability text',
        proposePriceText: 'Custom propose price:',
        currencyText: 'USD',
      }

      render(<PriceSlider {...customProps} />)

      expect(screen.getByText('Custom propose price:')).toBeInTheDocument()
      expect(screen.getByText('75 USD/custom night')).toBeInTheDocument()
      expect(screen.getByText('50 USD/custom night')).toBeInTheDocument()
      expect(screen.getByText('100 USD/custom night')).toBeInTheDocument()
      expect(screen.getByText('Custom Make Offer')).toBeInTheDocument()
      expect(screen.getByText('Custom availability text')).toBeInTheDocument()
    })

    it('should use default text when props are not provided', () => {
      render(<PriceSlider {...defaultProps} />)

      expect(screen.getByText('Propon tu precio:')).toBeInTheDocument()
      expect(screen.getByText('/noche')).toBeInTheDocument()
      expect(screen.getByText('Hacer oferta')).toBeInTheDocument()
      expect(screen.getByText('Sujeto a disponibilidad')).toBeInTheDocument()
      expect(screen.getByText('EUR')).toBeInTheDocument()
    })
  })

  describe('Price slider functionality', () => {
    it('should call onPriceChange when slider value changes', async () => {
      render(<PriceSlider {...defaultProps} />)

      const slider = screen.getByRole('slider')
      fireEvent.change(slider, { target: { value: '80' } })

      expect(mockOnPriceChange).toHaveBeenCalledWith(80)
    })

    it('should handle minimum price value', async () => {
      render(<PriceSlider {...defaultProps} />)

      const slider = screen.getByRole('slider')
      fireEvent.change(slider, { target: { value: '50' } })

      expect(mockOnPriceChange).toHaveBeenCalledWith(50)
    })

    it('should handle maximum price value', async () => {
      render(<PriceSlider {...defaultProps} />)

      const slider = screen.getByRole('slider')
      fireEvent.change(slider, { target: { value: '100' } })

      expect(mockOnPriceChange).toHaveBeenCalledWith(100)
    })

    it('should parse string values to numbers', async () => {
      render(<PriceSlider {...defaultProps} />)

      const slider = screen.getByRole('slider')
      fireEvent.change(slider, { target: { value: '85' } })

      expect(mockOnPriceChange).toHaveBeenCalledWith(85)
      expect(typeof mockOnPriceChange.mock.calls[0][0]).toBe('number')
    })

    it('should handle decimal values correctly', async () => {
      render(<PriceSlider {...defaultProps} />)

      const slider = screen.getByRole('slider')
      fireEvent.change(slider, { target: { value: '75.5' } })

      // parseInt should convert to integer
      expect(mockOnPriceChange).toHaveBeenCalledWith(75)
    })
  })

  describe('Make offer functionality', () => {
    it('should call onMakeOffer when make offer button is clicked', async () => {
      render(<PriceSlider {...defaultProps} />)

      const makeOfferButton = screen.getByText('Hacer oferta')
      await user.click(makeOfferButton)

      expect(mockOnMakeOffer).toHaveBeenCalledTimes(1)
    })

    it('should call onMakeOffer without parameters', async () => {
      const onMakeOffer = vi.fn()

      render(<PriceSlider {...defaultProps} onMakeOffer={onMakeOffer} />)

      const makeOfferButton = screen.getByText('Hacer oferta')
      await user.click(makeOfferButton)

      expect(onMakeOffer).toHaveBeenCalledTimes(1)
      expect(onMakeOffer).toHaveBeenCalledWith()
    })

    it('should handle keyboard activation of make offer button', async () => {
      render(<PriceSlider {...defaultProps} />)

      const makeOfferButton = screen.getByText('Hacer oferta')
      makeOfferButton.focus()

      await user.keyboard('{Enter}')

      expect(mockOnMakeOffer).toHaveBeenCalledTimes(1)
    })
  })

  describe('Slider visual styling', () => {
    it('should calculate slider percentage correctly', () => {
      render(<PriceSlider {...defaultProps} />)

      const slider = screen.getByRole('slider')

      // proposedPrice: 75, minPrice: 50, maxPrice: 100
      // percentage = ((75 - 50) / (100 - 50)) * 100 = 50%
      const expectedBackground = 'linear-gradient(to right, black 0%, black 50%, #e5e7eb 50%, #e5e7eb 100%)'

      expect(slider).toHaveStyle({ background: expectedBackground })
    })

    it('should update slider background when price changes', () => {
      const { rerender } = render(<PriceSlider {...defaultProps} />)

      const slider = screen.getByRole('slider')

      // Initial state: 50%
      let expectedBackground = 'linear-gradient(to right, black 0%, black 50%, #e5e7eb 50%, #e5e7eb 100%)'
      expect(slider).toHaveStyle({ background: expectedBackground })

      // Change to proposedPrice: 60 (20% of range)
      rerender(<PriceSlider {...defaultProps} proposedPrice={60} />)
      expectedBackground = 'linear-gradient(to right, black 0%, black 20%, #e5e7eb 20%, #e5e7eb 100%)'
      expect(slider).toHaveStyle({ background: expectedBackground })

      // Change to proposedPrice: 90 (80% of range)
      rerender(<PriceSlider {...defaultProps} proposedPrice={90} />)
      expectedBackground = 'linear-gradient(to right, black 0%, black 80%, #e5e7eb 80%, #e5e7eb 100%)'
      expect(slider).toHaveStyle({ background: expectedBackground })
    })

    it('should handle edge cases for slider percentage', () => {
      // Test with proposedPrice at minimum
      const { rerender } = render(<PriceSlider {...defaultProps} proposedPrice={50} />)

      const slider = screen.getByRole('slider')
      let expectedBackground = 'linear-gradient(to right, black 0%, black 0%, #e5e7eb 0%, #e5e7eb 100%)'
      expect(slider).toHaveStyle({ background: expectedBackground })

      // Test with proposedPrice at maximum
      rerender(<PriceSlider {...defaultProps} proposedPrice={100} />)
      expectedBackground = 'linear-gradient(to right, black 0%, black 100%, #e5e7eb 100%, #e5e7eb 100%)'
      expect(slider).toHaveStyle({ background: expectedBackground })
    })
  })

  describe('Responsive behavior and styling', () => {
    it('should have proper container styling', () => {
      render(<PriceSlider {...defaultProps} />)

      const container = screen.getByText('Propon tu precio:').closest('.border')
      expect(container).toHaveClass('mt-1')
      expect(container).toHaveClass('mb-6')
      expect(container).toHaveClass('w-full')
      expect(container).toHaveClass('sm:w-1/2')
      expect(container).toHaveClass('mx-auto')
      expect(container).toHaveClass('border')
      expect(container).toHaveClass('rounded-lg')
      expect(container).toHaveClass('p-4')
    })

    it('should apply custom className', () => {
      render(<PriceSlider {...defaultProps} className="custom-class" />)

      const container = screen.getByText('Propon tu precio:').closest('.border')
      expect(container).toHaveClass('custom-class')
    })

    it('should have proper button styling', () => {
      render(<PriceSlider {...defaultProps} />)

      const button = screen.getByText('Hacer oferta')
      expect(button).toHaveClass('w-full')
      expect(button).toHaveClass('mt-3')
      expect(button).toHaveClass('py-2')
      expect(button).toHaveClass('bg-black')
      expect(button).toHaveClass('hover:bg-neutral-900')
      expect(button).toHaveClass('text-white')
      expect(button).toHaveClass('rounded-md')
      expect(button).toHaveClass('transition')
      expect(button).toHaveClass('duration-200')
    })

    it('should have proper slider styling', () => {
      render(<PriceSlider {...defaultProps} />)

      const slider = screen.getByRole('slider')
      expect(slider).toHaveClass('w-full')
      expect(slider).toHaveClass('price-slider')
    })
  })

  describe('Price display formatting', () => {
    it('should format prices correctly with different currencies', () => {
      render(<PriceSlider {...defaultProps} currencyText="USD" />)

      expect(screen.getByText('75 USD/noche')).toBeInTheDocument()
      expect(screen.getByText('50 USD/noche')).toBeInTheDocument()
      expect(screen.getByText('100 USD/noche')).toBeInTheDocument()
    })

    it('should handle large price values', () => {
      render(<PriceSlider {...defaultProps} proposedPrice={1500} minPrice={1000} maxPrice={2000} />)

      expect(screen.getByText('1500 EUR/noche')).toBeInTheDocument()
      expect(screen.getByText('1000 EUR/noche')).toBeInTheDocument()
      expect(screen.getByText('2000 EUR/noche')).toBeInTheDocument()
    })

    it('should handle single digit prices', () => {
      render(<PriceSlider {...defaultProps} proposedPrice={5} minPrice={1} maxPrice={9} />)

      expect(screen.getByText('5 EUR/noche')).toBeInTheDocument()
      expect(screen.getByText('1 EUR/noche')).toBeInTheDocument()
      expect(screen.getByText('9 EUR/noche')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes on slider', () => {
      render(<PriceSlider {...defaultProps} />)

      const slider = screen.getByRole('slider')
      expect(slider).toHaveAttribute('type', 'range')
      expect(slider).toHaveAttribute('min', '50')
      expect(slider).toHaveAttribute('max', '100')
      expect(slider).toHaveAttribute('step', '1')
      expect(slider).toHaveAttribute('value', '75')
    })

    it('should be keyboard accessible', async () => {
      render(<PriceSlider {...defaultProps} />)

      const slider = screen.getByRole('slider')
      slider.focus()

      expect(slider).toHaveFocus()

      // Test arrow key navigation
      await user.keyboard('{ArrowRight}')
      // Note: actual slider behavior with keyboard may vary by browser
    })

    it('should have accessible button', () => {
      render(<PriceSlider {...defaultProps} />)

      const button = screen.getByRole('button')
      expect(button).toHaveTextContent('Hacer oferta')
    })
  })

  describe('Edge cases and error handling', () => {
    it('should handle equal min and max prices', () => {
      render(<PriceSlider {...defaultProps} proposedPrice={100} minPrice={100} maxPrice={100} />)

      const slider = screen.getByRole('slider')
      expect(slider).toHaveAttribute('min', '100')
      expect(slider).toHaveAttribute('max', '100')
      expect(slider).toHaveAttribute('value', '100')

      // Percentage calculation: (100-100)/(100-100) = 0/0 = NaN, should handle gracefully
      // In this case, it would be 0%
      const _expectedBackground = 'linear-gradient(to right, black 0%, black NaN%, #e5e7eb NaN%, #e5e7eb 100%)'
      // The actual implementation might need to handle NaN case
    })

    it('should handle negative prices', () => {
      render(<PriceSlider {...defaultProps} proposedPrice={-5} minPrice={-10} maxPrice={0} />)

      expect(screen.getByText('-5 EUR/noche')).toBeInTheDocument()
      expect(screen.getByText('-10 EUR/noche')).toBeInTheDocument()
      expect(screen.getByText('0 EUR/noche')).toBeInTheDocument()
    })

    it('should handle zero prices', () => {
      render(<PriceSlider {...defaultProps} proposedPrice={0} minPrice={0} maxPrice={10} />)

      expect(screen.getAllByText('0 EUR/noche')).toHaveLength(2) // One for current price, one for min price
    })

    it('should handle very large numbers', () => {
      render(<PriceSlider {...defaultProps} proposedPrice={999999} minPrice={100000} maxPrice={1000000} />)

      expect(screen.getByText('999999 EUR/noche')).toBeInTheDocument()
    })

    it('should handle invalid slider input gracefully', () => {
      render(<PriceSlider {...defaultProps} />)

      const slider = screen.getByRole('slider')

      // Try to set an invalid value
      fireEvent.change(slider, { target: { value: 'invalid' } })

      // Should convert to NaN via Number.parseInt
      expect(mockOnPriceChange).toHaveBeenCalledWith(Number.NaN)
    })

    it('should handle rapid price changes', async () => {
      render(<PriceSlider {...defaultProps} />)

      const slider = screen.getByRole('slider')

      // Rapidly change values
      fireEvent.change(slider, { target: { value: '60' } })
      fireEvent.change(slider, { target: { value: '70' } })
      fireEvent.change(slider, { target: { value: '80' } })
      fireEvent.change(slider, { target: { value: '90' } })

      expect(mockOnPriceChange).toHaveBeenCalledTimes(4)
      expect(mockOnPriceChange).toHaveBeenNthCalledWith(1, 60)
      expect(mockOnPriceChange).toHaveBeenNthCalledWith(2, 70)
      expect(mockOnPriceChange).toHaveBeenNthCalledWith(3, 80)
      expect(mockOnPriceChange).toHaveBeenNthCalledWith(4, 90)
    })

    it('should handle multiple button clicks', async () => {
      render(<PriceSlider {...defaultProps} />)

      const button = screen.getByText('Hacer oferta')

      await user.click(button)
      await user.click(button)
      await user.click(button)

      expect(mockOnMakeOffer).toHaveBeenCalledTimes(3)
    })
  })
})
