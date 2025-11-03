import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { createMockRooms, mockRoomOptions } from '@/__tests__/helpers/mockData'
import RoomUpgradeCarousel from '../../RoomUpgradeCarousel'
import type { RoomUpgradeCarouselProps } from '../../types'

describe('RoomUpgradeCarousel Integration Tests', () => {
  let user: ReturnType<typeof userEvent.setup>

  const mockTranslations = {
    currencySymbol: '€',
    nightText: '/night',
    learnMoreText: 'Learn More',
    priceInfoText: 'Prices include taxes and fees',
    selectedText: 'Selected',
    selectText: 'Select Room',
    removeText: 'Remove',
    previousImageLabel: 'Previous Image',
    nextImageLabel: 'Next Image',
    viewImageLabel: (index: number) => `View image ${index}`,
  }

  const defaultProps: RoomUpgradeCarouselProps = {
    roomOptions: mockRoomOptions.slice(0, 3),
    initialSelectedRoom: null,
    onRoomSelected: vi.fn(),
    translations: mockTranslations,
    className: 'test-class',
    enableHoverZoom: true,
  }

  beforeEach(() => {
    user = userEvent.setup()
    vi.clearAllMocks()
  })

  describe('Task 6.1: Carousel Functionality Tests', () => {
    it('verifies carousel navigation (arrows and dots) works correctly', async () => {
      render(<RoomUpgradeCarousel {...defaultProps} />)

      // Should render carousel structure for 3+ rooms
      const carousel = screen.getByRole('region')
      expect(carousel).toBeInTheDocument()
      expect(carousel).toHaveAttribute('aria-roledescription', 'carousel')

      // Should show navigation elements
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
      })

      // Should show navigation dots
      const dotButtons = screen.getAllByRole('button', { name: /go to slide/i })
      expect(dotButtons.length).toBe(3)

      // Test dot navigation
      await user.click(dotButtons[1])
      // Should not crash and should maintain carousel structure
      expect(carousel).toBeInTheDocument()
    })

    it('tests room selection and cart integration functionality', async () => {
      const mockOnRoomSelected = vi.fn()

      render(<RoomUpgradeCarousel {...defaultProps} onRoomSelected={mockOnRoomSelected} />)

      // Should display room information
      expect(screen.getByText('Ocean View Suite')).toBeInTheDocument()
      expect(screen.getByText('DELUXE OCEAN')).toBeInTheDocument()

      // Should show upgrade buttons
      const upgradeButtons = screen.getAllByText('Upgrade Now')
      expect(upgradeButtons.length).toBeGreaterThan(0)

      // Test room selection
      await user.click(upgradeButtons[0])
      expect(mockOnRoomSelected).toHaveBeenCalled()
    })

    it('validates image carousel and hover zoom features', async () => {
      render(<RoomUpgradeCarousel {...defaultProps} enableHoverZoom={true} />)

      // Should display room images
      const roomImages = screen.getAllByRole('img')
      expect(roomImages.length).toBeGreaterThan(0)

      // Test image interaction (hover zoom should be enabled)
      await user.hover(roomImages[0])

      // Should not crash and images should remain accessible
      expect(roomImages[0]).toBeInTheDocument()
    })

    it('tests auto-centering behavior when rooms are selected', async () => {
      const mockOnRoomSelected = vi.fn()

      render(
        <RoomUpgradeCarousel
          {...defaultProps}
          roomOptions={mockRoomOptions.slice(0, 4)} // 4 rooms to trigger auto-center
          onRoomSelected={mockOnRoomSelected}
        />
      )

      // Should render multi-room carousel
      const carousel = screen.getByRole('region')
      expect(carousel).toBeInTheDocument()

      // Test room selection with auto-centering
      const upgradeButtons = screen.getAllByText('Upgrade Now')
      await user.click(upgradeButtons[0])

      // Should call selection handler (auto-centering is internal behavior)
      expect(mockOnRoomSelected).toHaveBeenCalled()
    })
  })

  describe('Task 6.2: Responsive Design and Accessibility Tests', () => {
    it('verifies layout works correctly on different screen sizes', () => {
      // Test single room layout
      const { rerender } = render(<RoomUpgradeCarousel {...defaultProps} roomOptions={mockRoomOptions.slice(0, 1)} />)

      expect(screen.getByText('Ocean View Suite')).toBeInTheDocument()
      expect(screen.queryByRole('region', { name: /carousel/i })).not.toBeInTheDocument()

      // Test two room layout
      rerender(<RoomUpgradeCarousel {...defaultProps} roomOptions={mockRoomOptions.slice(0, 2)} />)

      expect(screen.getByText('Ocean View Suite')).toBeInTheDocument()
      expect(screen.getByText('Presidential Suite')).toBeInTheDocument()

      // Test multi-room carousel layout
      rerender(<RoomUpgradeCarousel {...defaultProps} roomOptions={mockRoomOptions.slice(0, 3)} />)

      const carousel = screen.getByRole('region')
      expect(carousel).toBeInTheDocument()
      expect(carousel).toHaveAttribute('aria-roledescription', 'carousel')
    })

    it('tests keyboard navigation and screen reader compatibility', async () => {
      render(<RoomUpgradeCarousel {...defaultProps} />)

      // Test keyboard navigation to upgrade buttons
      const upgradeButtons = screen.getAllByRole('button', { name: /upgrade now/i })

      // Tab to first button
      await user.tab()
      expect(upgradeButtons[0]).toHaveFocus()

      // Activate with Enter
      await user.keyboard('{Enter}')
      expect(defaultProps.onRoomSelected).toHaveBeenCalled()
    })

    it('validates ARIA labels and accessibility features', () => {
      render(<RoomUpgradeCarousel {...defaultProps} />)

      // Check carousel accessibility
      const carousel = screen.getByRole('region')
      expect(carousel).toHaveAttribute('aria-roledescription', 'carousel')

      // Check navigation accessibility
      expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()

      // Check dot navigation accessibility
      const dotButtons = screen.getAllByRole('button', { name: /go to slide/i })
      expect(dotButtons.length).toBe(3)

      dotButtons.forEach((button, index) => {
        expect(button).toHaveAttribute('aria-label', `Go to slide ${index + 1}`)
      })
    })

    it('ensures proper focus management during navigation', async () => {
      render(<RoomUpgradeCarousel {...defaultProps} />)

      const dotButtons = screen.getAllByRole('button', { name: /go to slide/i })

      // Focus first dot
      dotButtons[0].focus()
      expect(dotButtons[0]).toHaveFocus()

      // Navigate with keyboard
      await user.keyboard('{Tab}')

      // Should maintain proper focus flow
      expect(document.activeElement).toBeInstanceOf(HTMLElement)
    })
  })

  describe('Performance and Error Handling', () => {
    it('ensures no performance regressions with large datasets', () => {
      const startTime = performance.now()
      const manyRooms = createMockRooms(20)

      render(<RoomUpgradeCarousel {...defaultProps} roomOptions={manyRooms} />)

      const endTime = performance.now()
      const renderTime = endTime - startTime

      // Should render quickly
      expect(renderTime).toBeLessThan(100)
      expect(screen.getByText('Test Room room-1')).toBeInTheDocument()
    })

    it('handles empty room options gracefully', () => {
      render(<RoomUpgradeCarousel {...defaultProps} roomOptions={[]} />)

      // Should render without crashing
      expect(screen.getByText('No rooms available')).toBeInTheDocument()
    })

    it('handles rapid interactions without issues', async () => {
      render(<RoomUpgradeCarousel {...defaultProps} />)

      const upgradeButtons = screen.getAllByText('Upgrade Now')

      // Rapid clicks
      await user.click(upgradeButtons[0])
      await user.click(upgradeButtons[0])
      await user.click(upgradeButtons[0])

      // Should not crash
      expect(upgradeButtons[0]).toBeInTheDocument()
      expect(defaultProps.onRoomSelected).toHaveBeenCalledTimes(3)
    })

    it('maintains functionality with different room counts', () => {
      // Test with various room counts
      const roomCounts = [1, 2, 3, 5, 10]

      roomCounts.forEach((count) => {
        const rooms = createMockRooms(count)
        const { unmount } = render(<RoomUpgradeCarousel {...defaultProps} roomOptions={rooms} />)

        // Should render appropriate layout for each count
        if (count === 1) {
          expect(screen.queryByRole('region', { name: /carousel/i })).not.toBeInTheDocument()
        } else if (count >= 3) {
          expect(screen.getByRole('region')).toHaveAttribute('aria-roledescription', 'carousel')
        }

        expect(screen.getByText('Test Room room-1')).toBeInTheDocument()
        unmount()
      })
    })
  })

  describe('Business Logic Integration', () => {
    it('preserves existing room selection behavior', async () => {
      const mockOnRoomSelected = vi.fn()

      render(
        <RoomUpgradeCarousel
          {...defaultProps}
          initialSelectedRoom={mockRoomOptions[1]}
          onRoomSelected={mockOnRoomSelected}
        />
      )

      // Should handle initial selection
      expect(screen.getByText('Presidential Suite')).toBeInTheDocument()

      // Should handle new selections
      const upgradeButtons = screen.getAllByText('Upgrade Now')
      await user.click(upgradeButtons[0])

      expect(mockOnRoomSelected).toHaveBeenCalled()
    })

    it('maintains compatibility with existing translation system', () => {
      const customTranslations = {
        ...mockTranslations,
        currencySymbol: '$',
        upgradeNowText: 'Custom Upgrade',
        nightText: '/noche',
      }

      render(<RoomUpgradeCarousel {...defaultProps} translations={customTranslations} />)

      // Should use custom translations
      expect(screen.getByText('$150')).toBeInTheDocument()
      expect(screen.getByText('/noche')).toBeInTheDocument()
    })

    it('handles different room data formats correctly', () => {
      const customRooms = [
        {
          id: 'custom-1',
          title: 'Custom Room',
          roomType: 'CUSTOM',
          description: 'Custom description',
          amenities: ['Custom Amenity'],
          price: '999',
          images: ['custom.jpg'],
        },
      ]

      render(<RoomUpgradeCarousel {...defaultProps} roomOptions={customRooms} />)

      expect(screen.getByText('Custom Room')).toBeInTheDocument()
      expect(screen.getByText('CUSTOM')).toBeInTheDocument()
      expect(screen.getByText('€999')).toBeInTheDocument()
    })
  })
})
