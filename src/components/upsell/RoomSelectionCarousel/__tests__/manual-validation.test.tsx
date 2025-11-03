import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { mockRoomOptions } from '@/__tests__/helpers/mockData'
import RoomUpgradeCarousel from '../RoomUpgradeCarousel'

describe('Manual Validation - Core Functionality', () => {
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

  beforeEach(() => {
    user = userEvent.setup()
    vi.clearAllMocks()
  })

  describe('Task 6.1: Basic Carousel Functionality', () => {
    it('renders single room layout correctly', () => {
      const mockOnRoomSelected = vi.fn()

      render(
        <RoomUpgradeCarousel
          roomOptions={mockRoomOptions.slice(0, 1)}
          initialSelectedRoom={null}
          onRoomSelected={mockOnRoomSelected}
          translations={mockTranslations}
        />
      )

      // Should display room information
      expect(screen.getByText('Ocean View Suite')).toBeInTheDocument()
      expect(screen.getByText('DELUXE OCEAN')).toBeInTheDocument()
      expect(screen.getByText('Spacious suite with stunning ocean views and premium amenities')).toBeInTheDocument()

      // Should show price components (even if split)
      expect(screen.getByText('150')).toBeInTheDocument()
      expect(screen.getByText('/night')).toBeInTheDocument()

      // Should show amenities
      expect(screen.getByText('Ocean View')).toBeInTheDocument()
      expect(screen.getByText('WiFi')).toBeInTheDocument()
    })

    it('handles room selection correctly', async () => {
      const mockOnRoomSelected = vi.fn()

      render(
        <RoomUpgradeCarousel
          roomOptions={mockRoomOptions.slice(0, 1)}
          initialSelectedRoom={null}
          onRoomSelected={mockOnRoomSelected}
          translations={mockTranslations}
        />
      )

      // Should show upgrade button
      const upgradeButton = screen.getByText('Upgrade Now')
      expect(upgradeButton).toBeInTheDocument()

      // Should handle selection
      await user.click(upgradeButton)
      expect(mockOnRoomSelected).toHaveBeenCalledWith(mockRoomOptions[0])
    })

    it('displays image gallery correctly', () => {
      render(
        <RoomUpgradeCarousel
          roomOptions={mockRoomOptions.slice(0, 1)}
          initialSelectedRoom={null}
          onRoomSelected={vi.fn()}
          translations={mockTranslations}
        />
      )

      // Should display room image
      const roomImage = screen.getByRole('img')
      expect(roomImage).toBeInTheDocument()
      expect(roomImage).toHaveAttribute('alt', 'Ocean View Suite - 1 of 4')

      // Should show photo count
      expect(screen.getByText('4 photos')).toBeInTheDocument()
    })

    it('shows discount information when available', () => {
      render(
        <RoomUpgradeCarousel
          roomOptions={mockRoomOptions.slice(0, 1)}
          initialSelectedRoom={null}
          onRoomSelected={vi.fn()}
          translations={mockTranslations}
        />
      )

      // Should show old price (crossed out)
      expect(screen.getByText('€180')).toBeInTheDocument()

      // Should show segment discount badge
      expect(screen.getByText(/Business Traveler/)).toBeInTheDocument()
      expect(screen.getByText(/15%/)).toBeInTheDocument()
    })
  })

  describe('Task 6.2: Layout Adaptation', () => {
    it('renders two room layout without crashing', () => {
      render(
        <RoomUpgradeCarousel
          roomOptions={mockRoomOptions.slice(0, 2)}
          initialSelectedRoom={null}
          onRoomSelected={vi.fn()}
          translations={mockTranslations}
        />
      )

      // Should display both rooms
      expect(screen.getByText('Ocean View Suite')).toBeInTheDocument()
      expect(screen.getByText('Presidential Suite')).toBeInTheDocument()
    })

    it('handles empty room options gracefully', () => {
      render(
        <RoomUpgradeCarousel
          roomOptions={[]}
          initialSelectedRoom={null}
          onRoomSelected={vi.fn()}
          translations={mockTranslations}
        />
      )

      // Should show empty state
      expect(screen.getByText('No rooms available')).toBeInTheDocument()
    })
  })

  describe('Task 6.2: Accessibility', () => {
    it('provides proper button accessibility', async () => {
      render(
        <RoomUpgradeCarousel
          roomOptions={mockRoomOptions.slice(0, 1)}
          initialSelectedRoom={null}
          onRoomSelected={vi.fn()}
          translations={mockTranslations}
        />
      )

      // Should have accessible buttons
      const upgradeButton = screen.getByRole('button', { name: /upgrade now/i })
      expect(upgradeButton).toBeInTheDocument()

      // Should support keyboard navigation
      await user.tab()
      expect(upgradeButton).toHaveFocus()
    })

    it('provides proper image accessibility', () => {
      render(
        <RoomUpgradeCarousel
          roomOptions={mockRoomOptions.slice(0, 1)}
          initialSelectedRoom={null}
          onRoomSelected={vi.fn()}
          translations={mockTranslations}
        />
      )

      // Should have accessible images
      const roomImage = screen.getByRole('img')
      expect(roomImage).toHaveAttribute('alt')
      expect(roomImage.getAttribute('alt')).toContain('Ocean View Suite')
    })
  })

  describe('Performance and Error Handling', () => {
    it('renders efficiently', () => {
      const startTime = performance.now()

      render(
        <RoomUpgradeCarousel
          roomOptions={mockRoomOptions.slice(0, 1)}
          initialSelectedRoom={null}
          onRoomSelected={vi.fn()}
          translations={mockTranslations}
        />
      )

      const endTime = performance.now()
      const renderTime = endTime - startTime

      // Should render quickly
      expect(renderTime).toBeLessThan(100)
      expect(screen.getByText('Ocean View Suite')).toBeInTheDocument()
    })

    it('handles missing translations gracefully', () => {
      render(
        <RoomUpgradeCarousel
          roomOptions={mockRoomOptions.slice(0, 1)}
          initialSelectedRoom={null}
          onRoomSelected={vi.fn()}
          translations={undefined as any}
        />
      )

      // Should still render room information
      expect(screen.getByText('Ocean View Suite')).toBeInTheDocument()
    })

    it('handles rapid interactions', async () => {
      const mockOnRoomSelected = vi.fn()

      render(
        <RoomUpgradeCarousel
          roomOptions={mockRoomOptions.slice(0, 1)}
          initialSelectedRoom={null}
          onRoomSelected={mockOnRoomSelected}
          translations={mockTranslations}
        />
      )

      const upgradeButton = screen.getByText('Upgrade Now')

      // Rapid clicks should not crash
      await user.click(upgradeButton)
      await user.click(upgradeButton)
      await user.click(upgradeButton)

      expect(mockOnRoomSelected).toHaveBeenCalledTimes(3)
      expect(upgradeButton).toBeInTheDocument()
    })
  })

  describe('Business Logic Integration', () => {
    it('maintains existing room selection behavior', () => {
      const mockOnRoomSelected = vi.fn()

      render(
        <RoomUpgradeCarousel
          roomOptions={mockRoomOptions.slice(0, 1)}
          initialSelectedRoom={mockRoomOptions[0]}
          onRoomSelected={mockOnRoomSelected}
          translations={mockTranslations}
        />
      )

      // Should handle initial selection
      expect(screen.getByText('Ocean View Suite')).toBeInTheDocument()
    })

    it('supports custom translations', () => {
      const customTranslations = {
        ...mockTranslations,
        currencySymbol: '$',
        nightText: '/noche',
      }

      render(
        <RoomUpgradeCarousel
          roomOptions={mockRoomOptions.slice(0, 1)}
          initialSelectedRoom={null}
          onRoomSelected={vi.fn()}
          translations={customTranslations}
        />
      )

      // Should use custom translations
      expect(screen.getByText('/noche')).toBeInTheDocument()
    })

    it('handles hover zoom configuration', () => {
      render(
        <RoomUpgradeCarousel
          roomOptions={mockRoomOptions.slice(0, 1)}
          initialSelectedRoom={null}
          onRoomSelected={vi.fn()}
          translations={mockTranslations}
          enableHoverZoom={false}
        />
      )

      // Should render without hover zoom (internal behavior)
      expect(screen.getByText('Ocean View Suite')).toBeInTheDocument()
    })
  })
})
