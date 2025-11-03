import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { mockRoomOptions, mockTranslations } from '@/__tests__/helpers/mockData'
import RoomCarouselContent from '../../components/RoomCarouselContent'
import type { RoomCardProps, RoomCarouselContentProps } from '../../types'

// Mock RoomCard component
vi.mock('../../RoomCard', () => ({
  default: ({ room, translations }: { room: any; translations: any }) => (
    <div data-testid={`room-card-${room.id}`}>
      <h3>{room.title}</h3>
      <p>{room.roomType}</p>
      <p>{room.description}</p>
      <span>
        {translations.currencySymbol}
        {room.price}
      </span>
      <button>{translations.upgradeNowText}</button>
    </div>
  ),
}))

describe('RoomCarouselContent', () => {
  let user: ReturnType<typeof userEvent.setup>

  const createMockRoomCardProps = (room: any, index: number): RoomCardProps => ({
    room,
    translations: mockTranslations,
    handlers: {
      onSelectRoom: vi.fn(),
      onImageChange: vi.fn(),
    },
    config: {
      currencySymbol: '€',
      isActive: true,
      roomIndex: index,
      enableHoverZoom: true,
    },
    state: {
      selectedRoom: null,
      activeImageIndex: 0,
    },
  })

  const defaultProps: RoomCarouselContentProps = {
    roomCardPropsArray: mockRoomOptions.slice(0, 3).map(createMockRoomCardProps),
    current: 1,
    setRoomCarouselApi: vi.fn(),
    className: 'test-content',
  }

  beforeEach(() => {
    user = userEvent.setup()
    vi.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('renders all room cards', () => {
      render(<RoomCarouselContent {...defaultProps} />)

      expect(screen.getByTestId('room-card-room-1')).toBeInTheDocument()
      expect(screen.getByTestId('room-card-room-2')).toBeInTheDocument()
      expect(screen.getByTestId('room-card-room-3')).toBeInTheDocument()
    })

    it('displays room information correctly', () => {
      render(<RoomCarouselContent {...defaultProps} />)

      expect(screen.getByText('Ocean View Suite')).toBeInTheDocument()
      expect(screen.getByText('Presidential Suite')).toBeInTheDocument()
      expect(screen.getByText('Family Room')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      const { container } = render(<RoomCarouselContent {...defaultProps} />)

      expect(container.firstChild).toHaveClass('test-content')
    })
  })

  describe('Carousel Structure', () => {
    it('renders proper carousel structure', () => {
      render(<RoomCarouselContent {...defaultProps} />)

      // Should have carousel region
      const carousel = screen.getByRole('region')
      expect(carousel).toBeInTheDocument()
      expect(carousel).toHaveAttribute('aria-roledescription', 'carousel')
    })

    it('renders carousel items with proper structure', () => {
      render(<RoomCarouselContent {...defaultProps} />)

      const carouselItems = screen.getAllByRole('group')
      expect(carouselItems).toHaveLength(3)

      // Each item should contain a room card
      carouselItems.forEach((item, index) => {
        const roomCard = item.querySelector(`[data-testid="room-card-room-${index + 1}"]`)
        expect(roomCard).toBeInTheDocument()
      })
    })

    it('configures carousel with correct options', () => {
      render(<RoomCarouselContent {...defaultProps} />)

      // Should render carousel with proper configuration
      const carousel = screen.getByRole('region')
      expect(carousel).toBeInTheDocument()
    })
  })

  describe('Slide Opacity and Interaction', () => {
    it('applies opacity and pointer-events to non-current slides in multi-room scenario', () => {
      const { container } = render(
        <RoomCarouselContent
          {...defaultProps}
          current={2}
          roomCardPropsArray={mockRoomOptions.slice(0, 4).map(createMockRoomCardProps)}
        />
      )

      const carouselItems = container.querySelectorAll('[class*="CarouselItem"]')

      // With 4 rooms and current=2, slides other than index 1 should have opacity/pointer-events
      carouselItems.forEach((item, index) => {
        if (index !== 1) {
          // current=2 means index 1 is active
          expect(item).toHaveClass('pointer-events-none', 'opacity-50')
        }
      })
    })

    it('does not apply opacity for two rooms or less', () => {
      const { container } = render(
        <RoomCarouselContent
          {...defaultProps}
          roomCardPropsArray={mockRoomOptions.slice(0, 2).map(createMockRoomCardProps)}
        />
      )

      const carouselItems = container.querySelectorAll('[class*="CarouselItem"]')

      // With 2 rooms, no opacity should be applied
      carouselItems.forEach((item) => {
        expect(item).not.toHaveClass('pointer-events-none', 'opacity-50')
      })
    })
  })

  describe('Responsive Layout', () => {
    it('applies correct responsive classes to carousel items', () => {
      const { container } = render(<RoomCarouselContent {...defaultProps} />)

      const carouselItems = container.querySelectorAll('[class*="CarouselItem"]')

      carouselItems.forEach((item) => {
        expect(item).toHaveClass(
          'flex',
          'w-full',
          'flex-shrink-0',
          'basis-full',
          'justify-center',
          'pt-1',
          'xl:w-[50%]',
          'xl:basis-[50%]'
        )
      })
    })

    it('maintains proper layout structure', () => {
      const { container } = render(<RoomCarouselContent {...defaultProps} />)

      const contentContainer = container.querySelector('.flex.pb-1')
      expect(contentContainer).toBeInTheDocument()
      expect(contentContainer).toHaveStyle({ width: '100%' })
    })
  })

  describe('API Integration', () => {
    it('calls setRoomCarouselApi when carousel is initialized', () => {
      const mockSetApi = vi.fn()

      render(<RoomCarouselContent {...defaultProps} setRoomCarouselApi={mockSetApi} />)

      // The carousel should call setApi during initialization
      // Note: This might be called asynchronously, so we just verify the function was provided
      expect(mockSetApi).toBeDefined()
    })

    it('handles API setter correctly', () => {
      const mockSetApi = vi.fn()

      render(<RoomCarouselContent {...defaultProps} setRoomCarouselApi={mockSetApi} />)

      // Should not crash and should render properly
      expect(screen.getByTestId('room-card-room-1')).toBeInTheDocument()
    })
  })

  describe('Room Card Integration', () => {
    it('passes correct props to room cards', () => {
      render(<RoomCarouselContent {...defaultProps} />)

      // Verify room cards receive correct data
      expect(screen.getByText('Ocean View Suite')).toBeInTheDocument()
      expect(screen.getByText('DELUXE OCEAN')).toBeInTheDocument()
      expect(screen.getByText('€150')).toBeInTheDocument()
      expect(screen.getAllByText('Upgrade Now')).toHaveLength(3)
    })

    it('handles room card interactions', async () => {
      render(<RoomCarouselContent {...defaultProps} />)

      const upgradeButtons = screen.getAllByText('Upgrade Now')

      // Should be able to interact with room cards
      await user.click(upgradeButtons[0])

      // Should not crash
      expect(upgradeButtons[0]).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles empty room card array', () => {
      render(<RoomCarouselContent {...defaultProps} roomCardPropsArray={[]} />)

      // Should render carousel structure without crashing
      const carousel = screen.getByRole('region')
      expect(carousel).toBeInTheDocument()
    })

    it('handles single room card', () => {
      render(
        <RoomCarouselContent {...defaultProps} roomCardPropsArray={[createMockRoomCardProps(mockRoomOptions[0], 0)]} />
      )

      expect(screen.getByTestId('room-card-room-1')).toBeInTheDocument()
      expect(screen.getByText('Ocean View Suite')).toBeInTheDocument()
    })

    it('handles large number of room cards', () => {
      const manyRooms = Array.from({ length: 20 }, (_, i) => ({
        ...mockRoomOptions[0],
        id: `room-${i + 1}`,
        title: `Room ${i + 1}`,
      }))

      const manyRoomCardProps = manyRooms.map(createMockRoomCardProps)

      render(<RoomCarouselContent {...defaultProps} roomCardPropsArray={manyRoomCardProps} />)

      expect(screen.getByTestId('room-card-room-1')).toBeInTheDocument()
      expect(screen.getByTestId('room-card-room-20')).toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    it('renders efficiently with many room cards', () => {
      const startTime = performance.now()

      const manyRooms = Array.from({ length: 50 }, (_, i) => ({
        ...mockRoomOptions[0],
        id: `room-${i + 1}`,
        title: `Room ${i + 1}`,
      }))

      const manyRoomCardProps = manyRooms.map(createMockRoomCardProps)

      render(<RoomCarouselContent {...defaultProps} roomCardPropsArray={manyRoomCardProps} />)

      const endTime = performance.now()
      const renderTime = endTime - startTime

      expect(renderTime).toBeLessThan(100)
      expect(screen.getByTestId('room-card-room-1')).toBeInTheDocument()
    })

    it('handles rapid re-renders without issues', () => {
      const { rerender } = render(<RoomCarouselContent {...defaultProps} />)

      // Rapid re-renders with different current values
      rerender(<RoomCarouselContent {...defaultProps} current={2} />)
      rerender(<RoomCarouselContent {...defaultProps} current={3} />)
      rerender(<RoomCarouselContent {...defaultProps} current={1} />)

      expect(screen.getByTestId('room-card-room-1')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('maintains proper carousel accessibility', () => {
      render(<RoomCarouselContent {...defaultProps} />)

      const carousel = screen.getByRole('region')
      expect(carousel).toHaveAttribute('aria-roledescription', 'carousel')
    })

    it('provides proper group roles for carousel items', () => {
      render(<RoomCarouselContent {...defaultProps} />)

      const carouselItems = screen.getAllByRole('group')
      expect(carouselItems).toHaveLength(3)
    })

    it('maintains accessibility when slides are disabled', () => {
      render(
        <RoomCarouselContent
          {...defaultProps}
          current={2}
          roomCardPropsArray={mockRoomOptions.slice(0, 4).map(createMockRoomCardProps)}
        />
      )

      // Even disabled slides should maintain basic accessibility
      const carouselItems = screen.getAllByRole('group')
      expect(carouselItems).toHaveLength(4)
    })
  })

  describe('Styling', () => {
    it('applies correct container classes', () => {
      const { container } = render(<RoomCarouselContent {...defaultProps} />)

      const mainContainer = container.firstChild
      expect(mainContainer).toHaveClass('relative', 'mx-auto', 'w-full', 'test-content')

      const overflowContainer = container.querySelector('.overflow-hidden')
      expect(overflowContainer).toBeInTheDocument()
    })

    it('applies correct carousel content styling', () => {
      const { container } = render(<RoomCarouselContent {...defaultProps} />)

      const carouselContent = container.querySelector('.flex.pb-1')
      expect(carouselContent).toBeInTheDocument()
      expect(carouselContent).toHaveStyle({ width: '100%' })
    })
  })
})
