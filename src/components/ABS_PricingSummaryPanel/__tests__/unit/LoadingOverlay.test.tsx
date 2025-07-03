import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from '../../../../__tests__/helpers'
import LoadingOverlay from '../../components/LoadingOverlay'

describe('LoadingOverlay', () => {
  describe('Rendering', () => {
    it('should render nothing when not loading', () => {
      render(<LoadingOverlay isLoading={false} loadingLabel="Loading..." />)

      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })

    it('should render loading overlay when loading', () => {
      render(<LoadingOverlay isLoading={true} loadingLabel="Loading content..." />)

      expect(screen.getByText('Loading content...')).toBeInTheDocument()
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('should render loading spinner', () => {
      render(<LoadingOverlay isLoading={true} loadingLabel="Loading..." />)

      const spinner = document.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
      expect(spinner).toHaveAttribute('aria-hidden', 'true')
    })

    it('should have proper overlay styling', () => {
      render(<LoadingOverlay isLoading={true} loadingLabel="Loading..." />)

      const overlay = screen.getByRole('status')
      expect(overlay).toHaveClass('absolute', 'inset-0', 'bg-white', 'bg-opacity-75')
      expect(overlay).toHaveClass('flex', 'items-center', 'justify-center', 'z-10')
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const loadingLabel = 'Loading pricing information...'

      render(<LoadingOverlay isLoading={true} loadingLabel={loadingLabel} />)

      const overlay = screen.getByRole('status')
      expect(overlay).toHaveAttribute('aria-live', 'polite')
      expect(overlay).toHaveAttribute('aria-label', loadingLabel)
    })

    it('should announce loading state to screen readers', () => {
      render(<LoadingOverlay isLoading={true} loadingLabel="Please wait while we load your information" />)

      expect(screen.getByLabelText('Please wait while we load your information')).toBeInTheDocument()
    })

    it('should hide spinner from screen readers', () => {
      render(<LoadingOverlay isLoading={true} loadingLabel="Loading..." />)

      const spinner = document.querySelector('.animate-spin')
      expect(spinner).toHaveAttribute('aria-hidden', 'true')
    })

    it('should provide visible loading text', () => {
      const loadingText = 'Processing your request...'

      render(<LoadingOverlay isLoading={true} loadingLabel={loadingText} />)

      expect(screen.getByText(loadingText)).toBeInTheDocument()
      expect(screen.getByText(loadingText)).toHaveClass('text-sm')
    })
  })

  describe('Visual Design', () => {
    it('should center content properly', () => {
      render(<LoadingOverlay isLoading={true} loadingLabel="Loading..." />)

      const contentContainer = screen.getByText('Loading...').parentElement
      expect(contentContainer).toHaveClass('flex', 'items-center', 'space-x-2')
    })

    it('should have proper spinner styling', () => {
      render(<LoadingOverlay isLoading={true} loadingLabel="Loading..." />)

      const spinner = document.querySelector('.animate-spin')
      expect(spinner).toHaveClass('w-5', 'h-5', 'border-t-2', 'border-b-2', 'border-blue-500', 'rounded-full')
    })

    it('should have semi-transparent background', () => {
      render(<LoadingOverlay isLoading={true} loadingLabel="Loading..." />)

      const overlay = screen.getByRole('status')
      expect(overlay).toHaveClass('bg-white', 'bg-opacity-75')
    })

    it('should be positioned above other content', () => {
      render(<LoadingOverlay isLoading={true} loadingLabel="Loading..." />)

      const overlay = screen.getByRole('status')
      expect(overlay).toHaveClass('z-10')
    })
  })

  describe('Props handling', () => {
    it('should handle empty loading label', () => {
      render(<LoadingOverlay isLoading={true} loadingLabel="" />)

      const overlay = screen.getByRole('status')
      expect(overlay).toBeInTheDocument()
      expect(overlay).toHaveAttribute('aria-label', '')
    })

    it('should handle long loading labels', () => {
      const longLabel =
        'Please wait while we process your booking information and calculate the final pricing details with all applicable taxes and fees'

      render(<LoadingOverlay isLoading={true} loadingLabel={longLabel} />)

      expect(screen.getByText(longLabel)).toBeInTheDocument()
    })

    it('should handle loading labels with special characters', () => {
      const specialLabel = 'Cargando información... ¡Por favor, espere!'

      render(<LoadingOverlay isLoading={true} loadingLabel={specialLabel} />)

      expect(screen.getByText(specialLabel)).toBeInTheDocument()
    })

    it('should toggle visibility based on isLoading prop', () => {
      const { rerender } = render(<LoadingOverlay isLoading={false} loadingLabel="Loading..." />)

      expect(screen.queryByRole('status')).not.toBeInTheDocument()

      rerender(<LoadingOverlay isLoading={true} loadingLabel="Loading..." />)

      expect(screen.getByRole('status')).toBeInTheDocument()

      rerender(<LoadingOverlay isLoading={false} loadingLabel="Loading..." />)

      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })
  })

  describe('Integration', () => {
    it('should work within a relative positioned container', () => {
      render(
        <div className="relative">
          <div>Main content</div>
          <LoadingOverlay isLoading={true} loadingLabel="Loading..." />
        </div>
      )

      expect(screen.getByText('Main content')).toBeInTheDocument()
      expect(screen.getByRole('status')).toBeInTheDocument()
      expect(screen.getByRole('status')).toHaveClass('absolute', 'inset-0')
    })

    it('should maintain proper z-index stacking', () => {
      render(
        <div>
          <div style={{ zIndex: 5 }}>Background content</div>
          <LoadingOverlay isLoading={true} loadingLabel="Loading..." />
        </div>
      )

      const overlay = screen.getByRole('status')
      expect(overlay).toHaveClass('z-10')
    })
  })

  describe('Performance', () => {
    it('should not re-render unnecessarily when props do not change', () => {
      let renderCount = 0

      const TestWrapper = ({ isLoading, loadingLabel }: { isLoading: boolean; loadingLabel: string }) => {
        renderCount++
        return <LoadingOverlay isLoading={isLoading} loadingLabel={loadingLabel} />
      }

      const { rerender } = render(<TestWrapper isLoading={true} loadingLabel="Loading..." />)

      const initialRenderCount = renderCount

      // Re-render with same props
      rerender(<TestWrapper isLoading={true} loadingLabel="Loading..." />)

      expect(renderCount).toBe(initialRenderCount + 1) // Only one additional render
    })
  })
})
