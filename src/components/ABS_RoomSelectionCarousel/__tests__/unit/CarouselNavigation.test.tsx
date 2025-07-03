import { vi, describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '../../../../__tests__/helpers/custom-render'
import CarouselNavigation from '../../CarouselNavigation'

describe('CarouselNavigation', () => {
  let user: ReturnType<typeof userEvent.setup>
  let mockOnPrev: ReturnType<typeof vi.fn>
  let mockOnNext: ReturnType<typeof vi.fn>

  beforeEach(() => {
    user = userEvent.setup()
    mockOnPrev = vi.fn()
    mockOnNext = vi.fn()
  })

  describe('Basic rendering', () => {
    it('should render previous and next buttons', () => {
      render(<CarouselNavigation onPrev={mockOnPrev} onNext={mockOnNext} />)

      expect(screen.getByLabelText('Previous room')).toBeInTheDocument()
      expect(screen.getByLabelText('Next room')).toBeInTheDocument()
    })

    it('should render SVG icons for navigation', () => {
      render(<CarouselNavigation onPrev={mockOnPrev} onNext={mockOnNext} />)

      const prevButton = screen.getByLabelText('Previous room')
      const nextButton = screen.getByLabelText('Next room')

      // Check for SVG elements
      expect(prevButton.querySelector('svg')).toBeInTheDocument()
      expect(nextButton.querySelector('svg')).toBeInTheDocument()
    })

    it('should have correct arrow directions in SVG paths', () => {
      render(<CarouselNavigation onPrev={mockOnPrev} onNext={mockOnNext} />)

      const prevButton = screen.getByLabelText('Previous room')
      const nextButton = screen.getByLabelText('Next room')

      // Previous arrow should point left (15 18 9 12 15 6)
      const prevPolyline = prevButton.querySelector('polyline')
      expect(prevPolyline).toHaveAttribute('points', '15 18 9 12 15 6')

      // Next arrow should point right (9 18 15 12 9 6)
      const nextPolyline = nextButton.querySelector('polyline')
      expect(nextPolyline).toHaveAttribute('points', '9 18 15 12 9 6')
    })
  })

  describe('Interaction handling', () => {
    it('should call onPrev when previous button is clicked', async () => {
      render(<CarouselNavigation onPrev={mockOnPrev} onNext={mockOnNext} />)

      const prevButton = screen.getByLabelText('Previous room')
      await user.click(prevButton)

      expect(mockOnPrev).toHaveBeenCalledTimes(1)
      expect(mockOnNext).not.toHaveBeenCalled()
    })

    it('should call onNext when next button is clicked', async () => {
      render(<CarouselNavigation onPrev={mockOnPrev} onNext={mockOnNext} />)

      const nextButton = screen.getByLabelText('Next room')
      await user.click(nextButton)

      expect(mockOnNext).toHaveBeenCalledTimes(1)
      expect(mockOnPrev).not.toHaveBeenCalled()
    })

    it('should handle multiple clicks correctly', async () => {
      render(<CarouselNavigation onPrev={mockOnPrev} onNext={mockOnNext} />)

      const prevButton = screen.getByLabelText('Previous room')
      const nextButton = screen.getByLabelText('Next room')

      await user.click(prevButton)
      await user.click(nextButton)
      await user.click(nextButton)
      await user.click(prevButton)

      expect(mockOnPrev).toHaveBeenCalledTimes(2)
      expect(mockOnNext).toHaveBeenCalledTimes(2)
    })
  })

  describe('Keyboard navigation', () => {
    it('should handle keyboard activation for previous button', async () => {
      render(<CarouselNavigation onPrev={mockOnPrev} onNext={mockOnNext} />)

      const prevButton = screen.getByLabelText('Previous room')
      prevButton.focus()

      await user.keyboard('{Enter}')

      expect(mockOnPrev).toHaveBeenCalledTimes(1)
    })

    it('should handle keyboard activation for next button', async () => {
      render(<CarouselNavigation onPrev={mockOnPrev} onNext={mockOnNext} />)

      const nextButton = screen.getByLabelText('Next room')
      nextButton.focus()

      await user.keyboard('{Enter}')

      expect(mockOnNext).toHaveBeenCalledTimes(1)
    })

    it('should handle space key activation', async () => {
      render(<CarouselNavigation onPrev={mockOnPrev} onNext={mockOnNext} />)

      const prevButton = screen.getByLabelText('Previous room')
      prevButton.focus()

      await user.keyboard(' ')

      expect(mockOnPrev).toHaveBeenCalledTimes(1)
    })

    it('should support tab navigation between buttons', async () => {
      render(<CarouselNavigation onPrev={mockOnPrev} onNext={mockOnNext} />)

      // Tab to first button (previous)
      await user.tab()
      expect(screen.getByLabelText('Previous room')).toHaveFocus()

      // Tab to second button (next)
      await user.tab()
      expect(screen.getByLabelText('Next room')).toHaveFocus()
    })
  })

  describe('Styling and responsive behavior', () => {
    it('should have proper responsive classes for desktop display', () => {
      render(<CarouselNavigation onPrev={mockOnPrev} onNext={mockOnNext} />)

      const prevButton = screen.getByLabelText('Previous room')
      const nextButton = screen.getByLabelText('Next room')

      // Should be hidden on mobile and visible on desktop
      expect(prevButton).toHaveClass('hidden')
      expect(prevButton).toHaveClass('sm:block')
      expect(nextButton).toHaveClass('hidden')
      expect(nextButton).toHaveClass('sm:block')
    })

    it('should have proper positioning classes', () => {
      render(<CarouselNavigation onPrev={mockOnPrev} onNext={mockOnNext} />)

      const prevButton = screen.getByLabelText('Previous room')
      const nextButton = screen.getByLabelText('Next room')

      // Previous button positioning
      expect(prevButton).toHaveClass('absolute')
      expect(prevButton).toHaveClass('left-0')
      expect(prevButton).toHaveClass('top-1/2')
      expect(prevButton).toHaveClass('-translate-y-1/2')

      // Next button positioning
      expect(nextButton).toHaveClass('absolute')
      expect(nextButton).toHaveClass('right-0')
      expect(nextButton).toHaveClass('top-1/2')
      expect(nextButton).toHaveClass('-translate-y-1/2')
    })

    it('should have proper z-index for layering', () => {
      render(<CarouselNavigation onPrev={mockOnPrev} onNext={mockOnNext} />)

      const prevButton = screen.getByLabelText('Previous room')
      const nextButton = screen.getByLabelText('Next room')

      expect(prevButton).toHaveClass('z-20')
      expect(nextButton).toHaveClass('z-20')
    })

    it('should have hover and focus styles', () => {
      render(<CarouselNavigation onPrev={mockOnPrev} onNext={mockOnNext} />)

      const prevButton = screen.getByLabelText('Previous room')
      const nextButton = screen.getByLabelText('Next room')

      // Hover styles
      expect(prevButton).toHaveClass('hover:bg-neutral-50')
      expect(nextButton).toHaveClass('hover:bg-neutral-50')

      // Focus styles
      expect(prevButton).toHaveClass('focus:outline-none')
      expect(prevButton).toHaveClass('focus:ring-2')
      expect(prevButton).toHaveClass('focus:ring-black')
      expect(prevButton).toHaveClass('focus:ring-offset-2')

      expect(nextButton).toHaveClass('focus:outline-none')
      expect(nextButton).toHaveClass('focus:ring-2')
      expect(nextButton).toHaveClass('focus:ring-black')
      expect(nextButton).toHaveClass('focus:ring-offset-2')
    })

    it('should have proper button styling', () => {
      render(<CarouselNavigation onPrev={mockOnPrev} onNext={mockOnNext} />)

      const prevButton = screen.getByLabelText('Previous room')
      const nextButton = screen.getByLabelText('Next room')

      // Background and shape
      expect(prevButton).toHaveClass('bg-white')
      expect(prevButton).toHaveClass('rounded-full')
      expect(prevButton).toHaveClass('shadow-md')
      expect(prevButton).toHaveClass('p-2')

      expect(nextButton).toHaveClass('bg-white')
      expect(nextButton).toHaveClass('rounded-full')
      expect(nextButton).toHaveClass('shadow-md')
      expect(nextButton).toHaveClass('p-2')

      // Transitions
      expect(prevButton).toHaveClass('transition-all')
      expect(prevButton).toHaveClass('duration-200')
      expect(nextButton).toHaveClass('transition-all')
      expect(nextButton).toHaveClass('duration-200')
    })
  })

  describe('SVG icon properties', () => {
    it('should have correct SVG dimensions and properties', () => {
      render(<CarouselNavigation onPrev={mockOnPrev} onNext={mockOnNext} />)

      const prevSvg = screen.getByLabelText('Previous room').querySelector('svg')
      const nextSvg = screen.getByLabelText('Next room').querySelector('svg')

      // Dimensions
      expect(prevSvg).toHaveAttribute('width', '24')
      expect(prevSvg).toHaveAttribute('height', '24')
      expect(nextSvg).toHaveAttribute('width', '24')
      expect(nextSvg).toHaveAttribute('height', '24')

      // ViewBox
      expect(prevSvg).toHaveAttribute('viewBox', '0 0 24 24')
      expect(nextSvg).toHaveAttribute('viewBox', '0 0 24 24')

      // Stroke properties (using stroke-width with hyphen for HTML attributes)
      expect(prevSvg).toHaveAttribute('stroke', 'currentColor')
      expect(prevSvg).toHaveAttribute('stroke-width', '2')
      expect(prevSvg).toHaveAttribute('stroke-linecap', 'round')
      expect(prevSvg).toHaveAttribute('stroke-linejoin', 'round')

      expect(nextSvg).toHaveAttribute('stroke', 'currentColor')
      expect(nextSvg).toHaveAttribute('stroke-width', '2')
      expect(nextSvg).toHaveAttribute('stroke-linecap', 'round')
      expect(nextSvg).toHaveAttribute('stroke-linejoin', 'round')
    })

    it('should have proper CSS classes on SVG elements', () => {
      render(<CarouselNavigation onPrev={mockOnPrev} onNext={mockOnNext} />)

      const prevSvg = screen.getByLabelText('Previous room').querySelector('svg')
      const nextSvg = screen.getByLabelText('Next room').querySelector('svg')

      expect(prevSvg).toHaveClass('h-6')
      expect(prevSvg).toHaveClass('w-6')
      expect(nextSvg).toHaveClass('h-6')
      expect(nextSvg).toHaveClass('w-6')
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<CarouselNavigation onPrev={mockOnPrev} onNext={mockOnNext} />)

      expect(screen.getByLabelText('Previous room')).toBeInTheDocument()
      expect(screen.getByLabelText('Next room')).toBeInTheDocument()
    })

    it('should be focusable elements', () => {
      render(<CarouselNavigation onPrev={mockOnPrev} onNext={mockOnNext} />)

      const prevButton = screen.getByLabelText('Previous room')
      const nextButton = screen.getByLabelText('Next room')

      // Should be button elements (focusable by default)
      expect(prevButton.tagName).toBe('BUTTON')
      expect(nextButton.tagName).toBe('BUTTON')
    })

    it('should have proper focus management', async () => {
      render(<CarouselNavigation onPrev={mockOnPrev} onNext={mockOnNext} />)

      const prevButton = screen.getByLabelText('Previous room')
      const nextButton = screen.getByLabelText('Next room')

      // Should be able to focus buttons
      prevButton.focus()
      expect(prevButton).toHaveFocus()

      nextButton.focus()
      expect(nextButton).toHaveFocus()
    })
  })

  describe('Edge cases', () => {
    it('should handle rapid clicking without issues', async () => {
      render(<CarouselNavigation onPrev={mockOnPrev} onNext={mockOnNext} />)

      const nextButton = screen.getByLabelText('Next room')

      // Rapidly click multiple times
      await user.click(nextButton)
      await user.click(nextButton)
      await user.click(nextButton)
      await user.click(nextButton)
      await user.click(nextButton)

      expect(mockOnNext).toHaveBeenCalledTimes(5)
    })

    it('should handle alternating clicks correctly', async () => {
      render(<CarouselNavigation onPrev={mockOnPrev} onNext={mockOnNext} />)

      const prevButton = screen.getByLabelText('Previous room')
      const nextButton = screen.getByLabelText('Next room')

      await user.click(nextButton)
      await user.click(prevButton)
      await user.click(nextButton)
      await user.click(prevButton)

      expect(mockOnNext).toHaveBeenCalledTimes(2)
      expect(mockOnPrev).toHaveBeenCalledTimes(2)
    })

    it('should not break when callbacks are called with no parameters', async () => {
      // Ensure callbacks don't expect parameters
      const onPrev = vi.fn()
      const onNext = vi.fn()

      render(<CarouselNavigation onPrev={onPrev} onNext={onNext} />)

      await user.click(screen.getByLabelText('Previous room'))
      await user.click(screen.getByLabelText('Next room'))

      expect(onPrev).toHaveBeenCalledTimes(1)
      expect(onNext).toHaveBeenCalledTimes(1)
      expect(onPrev).toHaveBeenCalledWith()
      expect(onNext).toHaveBeenCalledWith()
    })
  })
})
