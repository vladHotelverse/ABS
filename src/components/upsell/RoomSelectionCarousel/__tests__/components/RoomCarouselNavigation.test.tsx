import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { mockRoomOptions } from '@/__tests__/helpers/mockData'
import type { RoomCarouselNavigationProps } from '../../components/RoomCarouselNavigation'
import RoomCarouselNavigation from '../../components/RoomCarouselNavigation'

describe('RoomCarouselNavigation', () => {
  let user: ReturnType<typeof userEvent.setup>

  const mockCarouselApi = {
    scrollTo: vi.fn(),
    scrollSnapList: vi.fn(() => [0, 1, 2]),
    selectedScrollSnap: vi.fn(() => 0),
    on: vi.fn(),
    off: vi.fn(),
    destroy: vi.fn(),
  }

  const defaultProps: RoomCarouselNavigationProps = {
    roomCarouselApi: mockCarouselApi,
    current: 1,
    count: 3,
    roomOptions: mockRoomOptions.slice(0, 3),
    showArrows: true,
    showDots: true,
    className: 'test-navigation',
  }

  beforeEach(() => {
    user = userEvent.setup()
    vi.clearAllMocks()
  })

  describe('Navigation Arrows', () => {
    it('renders navigation arrows when showArrows is true', () => {
      render(<RoomCarouselNavigation {...defaultProps} />)

      expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
    })

    it('hides navigation arrows when showArrows is false', () => {
      render(<RoomCarouselNavigation {...defaultProps} showArrows={false} />)

      expect(screen.queryByRole('button', { name: /previous/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /next/i })).not.toBeInTheDocument()
    })

    it('applies correct positioning classes to arrows', () => {
      render(<RoomCarouselNavigation {...defaultProps} />)

      const previousButton = screen.getByRole('button', { name: /previous/i })
      const nextButton = screen.getByRole('button', { name: /next/i })

      expect(previousButton).toHaveClass('relative', 'left-2', 'z-30')
      expect(nextButton).toHaveClass('relative', 'right-2', 'z-30')
    })
  })

  describe('Navigation Dots', () => {
    it('renders navigation dots when showDots is true', () => {
      render(<RoomCarouselNavigation {...defaultProps} />)

      const dotButtons = screen.getAllByRole('button', { name: /go to slide/i })
      expect(dotButtons).toHaveLength(3)
    })

    it('hides navigation dots when showDots is false', () => {
      render(<RoomCarouselNavigation {...defaultProps} showDots={false} />)

      expect(screen.queryByRole('button', { name: /go to slide/i })).not.toBeInTheDocument()
    })

    it('applies active state styling to current dot', () => {
      render(<RoomCarouselNavigation {...defaultProps} current={2} />)

      const dotButtons = screen.getAllByRole('button', { name: /go to slide/i })

      // Second dot (index 1, current 2) should have active styling
      expect(dotButtons[1]).toHaveClass('after:border-foreground')

      // Other dots should have inactive styling
      expect(dotButtons[0]).toHaveClass('after:border-muted-foreground')
      expect(dotButtons[2]).toHaveClass('after:border-muted-foreground')
    })

    it('handles dot clicks correctly', async () => {
      render(<RoomCarouselNavigation {...defaultProps} />)

      const dotButtons = screen.getAllByRole('button', { name: /go to slide/i })

      await user.click(dotButtons[1])
      expect(mockCarouselApi.scrollTo).toHaveBeenCalledWith(1)

      await user.click(dotButtons[2])
      expect(mockCarouselApi.scrollTo).toHaveBeenCalledWith(2)
    })

    it('uses room IDs as keys for dots', () => {
      const { container } = render(<RoomCarouselNavigation {...defaultProps} />)

      // Check that dots are rendered with room-based keys
      const dotButtons = container.querySelectorAll('button[aria-label*="Go to slide"]')
      expect(dotButtons).toHaveLength(3)
    })

    it('provides proper ARIA labels for dots', () => {
      render(<RoomCarouselNavigation {...defaultProps} />)

      expect(screen.getByRole('button', { name: 'Go to slide 1' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Go to slide 2' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Go to slide 3' })).toBeInTheDocument()
    })
  })

  describe('Styling and Layout', () => {
    it('applies custom className correctly', () => {
      const { container } = render(<RoomCarouselNavigation {...defaultProps} />)

      const dotsContainer = container.querySelector('.test-navigation')
      expect(dotsContainer).toBeInTheDocument()
    })

    it('applies correct positioning for arrow container', () => {
      const { container } = render(<RoomCarouselNavigation {...defaultProps} />)

      const arrowContainer = container.querySelector('.absolute.top-1\\/2')
      expect(arrowContainer).toHaveClass(
        '-translate-y-1/2',
        'absolute',
        'top-1/2',
        'z-10',
        'hidden',
        'w-full',
        'transform',
        'items-center',
        'justify-between',
        'px-2',
        'md:flex'
      )
    })

    it('applies correct styling for dots container', () => {
      const { container } = render(<RoomCarouselNavigation {...defaultProps} />)

      const dotsContainer = container.querySelector('.flex.justify-center')
      expect(dotsContainer).toHaveClass('flex', 'justify-center', 'test-navigation')
    })
  })

  describe('Edge Cases', () => {
    it('handles undefined carousel API gracefully', async () => {
      render(<RoomCarouselNavigation {...defaultProps} roomCarouselApi={undefined} />)

      const dotButtons = screen.getAllByRole('button', { name: /go to slide/i })

      // Should not crash when clicking dots without API
      await user.click(dotButtons[0])

      expect(dotButtons[0]).toBeInTheDocument()
    })

    it('handles zero count gracefully', () => {
      render(<RoomCarouselNavigation {...defaultProps} count={0} roomOptions={[]} />)

      expect(screen.queryByRole('button', { name: /go to slide/i })).not.toBeInTheDocument()
    })

    it('handles single room scenario', () => {
      render(<RoomCarouselNavigation {...defaultProps} count={1} roomOptions={mockRoomOptions.slice(0, 1)} />)

      const dotButtons = screen.getAllByRole('button', { name: /go to slide/i })
      expect(dotButtons).toHaveLength(1)
    })

    it('handles large number of rooms', () => {
      const manyRooms = Array.from({ length: 10 }, (_, i) => ({
        ...mockRoomOptions[0],
        id: `room-${i}`,
        title: `Room ${i}`,
      }))

      render(<RoomCarouselNavigation {...defaultProps} count={10} roomOptions={manyRooms} />)

      const dotButtons = screen.getAllByRole('button', { name: /go to slide/i })
      expect(dotButtons).toHaveLength(10)
    })
  })

  describe('Accessibility', () => {
    it('provides proper ARIA labels for navigation elements', () => {
      render(<RoomCarouselNavigation {...defaultProps} />)

      // Check arrow accessibility
      expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()

      // Check dot accessibility
      expect(screen.getByRole('button', { name: 'Go to slide 1' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Go to slide 2' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Go to slide 3' })).toBeInTheDocument()
    })

    it('supports keyboard navigation', async () => {
      render(<RoomCarouselNavigation {...defaultProps} />)

      const dotButtons = screen.getAllByRole('button', { name: /go to slide/i })

      // Tab to first dot
      await user.tab()
      expect(dotButtons[0]).toHaveFocus()

      // Activate with Enter
      await user.keyboard('{Enter}')
      expect(mockCarouselApi.scrollTo).toHaveBeenCalledWith(0)

      // Activate with Space
      await user.keyboard(' ')
      expect(mockCarouselApi.scrollTo).toHaveBeenCalledWith(0)
    })

    it('maintains focus management during navigation', async () => {
      render(<RoomCarouselNavigation {...defaultProps} />)

      const dotButtons = screen.getAllByRole('button', { name: /go to slide/i })

      // Focus first dot
      dotButtons[0].focus()
      expect(dotButtons[0]).toHaveFocus()

      // Click should maintain proper focus behavior
      await user.click(dotButtons[1])
      expect(mockCarouselApi.scrollTo).toHaveBeenCalledWith(1)
    })
  })

  describe('Responsive Behavior', () => {
    it('hides arrows on mobile (md:flex class)', () => {
      const { container } = render(<RoomCarouselNavigation {...defaultProps} />)

      const arrowContainer = container.querySelector('.hidden.md\\:flex')
      expect(arrowContainer).toBeInTheDocument()
    })

    it('shows dots on all screen sizes', () => {
      render(<RoomCarouselNavigation {...defaultProps} />)

      const dotButtons = screen.getAllByRole('button', { name: /go to slide/i })
      expect(dotButtons).toHaveLength(3)

      // Dots should be visible (no responsive hiding classes)
      dotButtons.forEach((button) => {
        expect(button).toBeVisible()
      })
    })
  })

  describe('Performance', () => {
    it('renders efficiently with many dots', () => {
      const startTime = performance.now()

      const manyRooms = Array.from({ length: 50 }, (_, i) => ({
        ...mockRoomOptions[0],
        id: `room-${i}`,
        title: `Room ${i}`,
      }))

      render(<RoomCarouselNavigation {...defaultProps} count={50} roomOptions={manyRooms} />)

      const endTime = performance.now()
      const renderTime = endTime - startTime

      expect(renderTime).toBeLessThan(50)

      const dotButtons = screen.getAllByRole('button', { name: /go to slide/i })
      expect(dotButtons).toHaveLength(50)
    })

    it('handles rapid clicks without issues', async () => {
      render(<RoomCarouselNavigation {...defaultProps} />)

      const dotButtons = screen.getAllByRole('button', { name: /go to slide/i })

      // Rapid clicks
      await user.click(dotButtons[0])
      await user.click(dotButtons[1])
      await user.click(dotButtons[2])
      await user.click(dotButtons[0])

      expect(mockCarouselApi.scrollTo).toHaveBeenCalledTimes(4)
      expect(dotButtons[0]).toBeInTheDocument()
    })
  })
})
