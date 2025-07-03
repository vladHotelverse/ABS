import { vi, describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '../../../../__tests__/helpers/custom-render'
import { createMockRoomOption } from '../../../../__tests__/helpers/mock-factory'
import RoomCard from '../../RoomCard'
import type { RoomOption } from '../../types'

describe('RoomCard', () => {
  let mockRoom: RoomOption
  let defaultProps: any
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
    mockRoom = createMockRoomOption({
      id: 'test-room-1',
      name: 'Deluxe Room',
      description: 'A comfortable deluxe room with amazing views',
      price: 150,
      oldPrice: 200,
      images: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
      amenities: ['WiFi', 'TV', 'AC', 'Mini Bar'],
    })

    defaultProps = {
      room: mockRoom,
      discountBadgeText: '-',
      nightText: '/night',
      learnMoreText: 'Learn More',
      priceInfoText: 'Price info and taxes',
      selectedText: 'SELECTED',
      selectText: 'SELECT',
      selectedRoom: null,
      onSelectRoom: vi.fn(),
      activeImageIndex: 0,
      onImageChange: vi.fn(),
      currencySymbol: '€',
      onLearnMore: vi.fn(),
    }
  })

  describe('Basic rendering', () => {
    it('should render room information correctly', () => {
      render(<RoomCard {...defaultProps} />)

      expect(screen.getByText('Deluxe Room')).toBeInTheDocument()
      expect(screen.getByText('A comfortable deluxe room with amazing views')).toBeInTheDocument()
      expect(screen.getByText('€150')).toBeInTheDocument()
      expect(screen.getByText('/night')).toBeInTheDocument()
    })

    it('should render amenities', () => {
      render(<RoomCard {...defaultProps} />)

      expect(screen.getByText('WiFi')).toBeInTheDocument()
      expect(screen.getByText('TV')).toBeInTheDocument()
      expect(screen.getByText('AC')).toBeInTheDocument()
      expect(screen.getByText('Mini Bar')).toBeInTheDocument()
    })

    it('should render room image with correct alt text', () => {
      render(<RoomCard {...defaultProps} />)

      const image = screen.getByAltText('Deluxe Room')
      expect(image).toHaveAttribute('src', 'image1.jpg')
    })

    it('should render price info text', () => {
      render(<RoomCard {...defaultProps} />)

      expect(screen.getByText('Price info and taxes')).toBeInTheDocument()
    })
  })

  describe('Discount badge functionality', () => {
    it('should show discount badge when oldPrice exists', () => {
      render(<RoomCard {...defaultProps} />)

      // Discount: (1 - 150/200) * 100 = 25%
      expect(screen.getByText('-25%')).toBeInTheDocument()
    })

    it('should not show discount badge when oldPrice is not provided', () => {
      const roomWithoutDiscount = { ...mockRoom, oldPrice: undefined }
      render(<RoomCard {...defaultProps} room={roomWithoutDiscount} />)

      expect(screen.queryByText(/%/)).not.toBeInTheDocument()
    })

    it('should calculate discount percentage correctly', () => {
      const roomWithBigDiscount = { ...mockRoom, price: 50, oldPrice: 100 }
      render(<RoomCard {...defaultProps} room={roomWithBigDiscount} />)

      expect(screen.getByText('-50%')).toBeInTheDocument()
    })

    it('should use custom discount badge text', () => {
      render(<RoomCard {...defaultProps} discountBadgeText="SAVE " />)

      expect(screen.getByText('SAVE 25%')).toBeInTheDocument()
    })
  })

  describe('Price display', () => {
    it('should show current price with currency symbol', () => {
      render(<RoomCard {...defaultProps} />)

      expect(screen.getByText('€150')).toBeInTheDocument()
    })

    it('should show old price with strikethrough when available', () => {
      render(<RoomCard {...defaultProps} />)

      const oldPrice = screen.getByText('€200')
      expect(oldPrice).toHaveClass('line-through')
    })

    it('should use custom currency symbol', () => {
      render(<RoomCard {...defaultProps} currencySymbol="$" />)

      expect(screen.getByText('$150')).toBeInTheDocument()
      expect(screen.getByText('$200')).toBeInTheDocument()
    })

    it('should default to euro symbol when currencySymbol is not provided', () => {
      render(<RoomCard {...defaultProps} currencySymbol={undefined} />)

      expect(screen.getByText('€150')).toBeInTheDocument()
    })
  })

  describe('Room selection', () => {
    it('should show SELECT text when room is not selected', () => {
      render(<RoomCard {...defaultProps} />)

      expect(screen.getByText('SELECT')).toBeInTheDocument()
    })

    it('should show SELECTED text when room is selected', () => {
      render(<RoomCard {...defaultProps} selectedRoom={mockRoom} />)

      expect(screen.getByText('SELECTED')).toBeInTheDocument()
    })

    it('should have different styling for selected room', () => {
      render(<RoomCard {...defaultProps} selectedRoom={mockRoom} />)

      const selectButton = screen.getByText('SELECTED')
      expect(selectButton).toHaveClass('bg-green-600')
    })

    it('should call onSelectRoom when select button is clicked', async () => {
      const onSelectRoom = vi.fn()
      render(<RoomCard {...defaultProps} onSelectRoom={onSelectRoom} />)

      const selectButton = screen.getByText('SELECT')
      await user.click(selectButton)

      expect(onSelectRoom).toHaveBeenCalledWith(mockRoom)
    })

    it('should stop event propagation when select button is clicked', async () => {
      const onSelectRoom = vi.fn()
      const cardClickSpy = vi.fn()

      render(
        <div onClick={cardClickSpy}>
          <RoomCard {...defaultProps} onSelectRoom={onSelectRoom} />
        </div>
      )

      const selectButton = screen.getByText('SELECT')
      await user.click(selectButton)

      expect(onSelectRoom).toHaveBeenCalledWith(mockRoom)
      expect(cardClickSpy).not.toHaveBeenCalled()
    })

    it('should deselect room when clicking SELECTED button', async () => {
      const onSelectRoom = vi.fn()
      render(<RoomCard {...defaultProps} selectedRoom={mockRoom} onSelectRoom={onSelectRoom} />)

      // Verify room is shown as selected
      const selectedButton = screen.getByText('SELECTED')
      expect(selectedButton).toBeInTheDocument()

      // Click the SELECTED button to deselect
      await user.click(selectedButton)

      // Should call onSelectRoom with null to deselect
      expect(onSelectRoom).toHaveBeenCalledWith(null)
    })
  })

  describe('Image carousel functionality', () => {
    it('should show image navigation arrows for multiple images', () => {
      render(<RoomCard {...defaultProps} />)

      expect(screen.getByLabelText('Previous image')).toBeInTheDocument()
      expect(screen.getByLabelText('Next image')).toBeInTheDocument()
    })

    it('should not show image navigation for single image', () => {
      const roomWithSingleImage = { ...mockRoom, images: ['single-image.jpg'] }
      render(<RoomCard {...defaultProps} room={roomWithSingleImage} />)

      expect(screen.queryByLabelText('Previous image')).not.toBeInTheDocument()
      expect(screen.queryByLabelText('Next image')).not.toBeInTheDocument()
    })

    it('should show image indicators for multiple images', () => {
      render(<RoomCard {...defaultProps} />)

      expect(screen.getByLabelText('View image 1')).toBeInTheDocument()
      expect(screen.getByLabelText('View image 2')).toBeInTheDocument()
      expect(screen.getByLabelText('View image 3')).toBeInTheDocument()
    })

    it('should not show image indicators for single image', () => {
      const roomWithSingleImage = { ...mockRoom, images: ['single-image.jpg'] }
      render(<RoomCard {...defaultProps} room={roomWithSingleImage} />)

      expect(screen.queryByLabelText('View image 1')).not.toBeInTheDocument()
    })

    it('should call onImageChange when next image button is clicked', async () => {
      const onImageChange = vi.fn()
      render(<RoomCard {...defaultProps} onImageChange={onImageChange} />)

      const nextButton = screen.getByLabelText('Next image')
      await user.click(nextButton)

      expect(onImageChange).toHaveBeenCalledWith(1)
    })

    it('should call onImageChange when previous image button is clicked', async () => {
      const onImageChange = vi.fn()
      render(<RoomCard {...defaultProps} onImageChange={onImageChange} activeImageIndex={1} />)

      const prevButton = screen.getByLabelText('Previous image')
      await user.click(prevButton)

      expect(onImageChange).toHaveBeenCalledWith(0)
    })

    it('should wrap to last image when clicking previous from first image', async () => {
      const onImageChange = vi.fn()
      render(<RoomCard {...defaultProps} onImageChange={onImageChange} activeImageIndex={0} />)

      const prevButton = screen.getByLabelText('Previous image')
      await user.click(prevButton)

      expect(onImageChange).toHaveBeenCalledWith(2) // Last image index
    })

    it('should wrap to first image when clicking next from last image', async () => {
      const onImageChange = vi.fn()
      render(<RoomCard {...defaultProps} onImageChange={onImageChange} activeImageIndex={2} />)

      const nextButton = screen.getByLabelText('Next image')
      await user.click(nextButton)

      expect(onImageChange).toHaveBeenCalledWith(0)
    })

    it('should call onImageChange when image indicator is clicked', async () => {
      const onImageChange = vi.fn()
      render(<RoomCard {...defaultProps} onImageChange={onImageChange} />)

      const secondImageIndicator = screen.getByLabelText('View image 2')
      await user.click(secondImageIndicator)

      expect(onImageChange).toHaveBeenCalledWith(1)
    })

    it('should stop event propagation on image navigation', async () => {
      const onImageChange = vi.fn()
      const cardClickSpy = vi.fn()

      render(
        <div onClick={cardClickSpy}>
          <RoomCard {...defaultProps} onImageChange={onImageChange} />
        </div>
      )

      const nextButton = screen.getByLabelText('Next image')
      await user.click(nextButton)

      expect(onImageChange).toHaveBeenCalledWith(1)
      expect(cardClickSpy).not.toHaveBeenCalled()
    })

    it('should highlight active image indicator', () => {
      render(<RoomCard {...defaultProps} activeImageIndex={1} />)

      const indicators = screen
        .getAllByRole('button')
        .filter((btn) => btn.getAttribute('aria-label')?.startsWith('View image'))

      // Second indicator should have active styling (bg-white)
      expect(indicators[1]).toHaveClass('bg-white')
      // Other indicators should have inactive styling (bg-white/50)
      expect(indicators[0]).toHaveClass('bg-white/50')
      expect(indicators[2]).toHaveClass('bg-white/50')
    })
  })

  describe('Learn more functionality', () => {
    it('should show learn more button', () => {
      render(<RoomCard {...defaultProps} />)

      expect(screen.getByText('Learn More')).toBeInTheDocument()
    })

    it('should call onLearnMore when learn more button is clicked', async () => {
      const onLearnMore = vi.fn()
      render(<RoomCard {...defaultProps} onLearnMore={onLearnMore} />)

      const learnMoreButton = screen.getByText('Learn More')
      await user.click(learnMoreButton)

      expect(onLearnMore).toHaveBeenCalledWith(mockRoom)
    })

    it('should log to console when onLearnMore is not provided', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      render(<RoomCard {...defaultProps} onLearnMore={undefined} />)

      const learnMoreButton = screen.getByText('Learn More')
      await user.click(learnMoreButton)

      expect(consoleSpy).toHaveBeenCalledWith('Learn more about room:', 'Deluxe Room')

      consoleSpy.mockRestore()
    })

    it('should stop event propagation when learn more button is clicked', async () => {
      const onLearnMore = vi.fn()
      const cardClickSpy = vi.fn()

      render(
        <div onClick={cardClickSpy}>
          <RoomCard {...defaultProps} onLearnMore={onLearnMore} />
        </div>
      )

      const learnMoreButton = screen.getByText('Learn More')
      await user.click(learnMoreButton)

      expect(onLearnMore).toHaveBeenCalledWith(mockRoom)
      expect(cardClickSpy).not.toHaveBeenCalled()
    })

    it('should use custom learn more text', () => {
      render(<RoomCard {...defaultProps} learnMoreText="Custom Learn More" />)

      expect(screen.getByText('Custom Learn More')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels for image navigation', () => {
      render(<RoomCard {...defaultProps} />)

      expect(screen.getByLabelText('Previous image')).toBeInTheDocument()
      expect(screen.getByLabelText('Next image')).toBeInTheDocument()
    })

    it('should have proper ARIA labels for image indicators', () => {
      render(<RoomCard {...defaultProps} />)

      expect(screen.getByLabelText('View image 1')).toBeInTheDocument()
      expect(screen.getByLabelText('View image 2')).toBeInTheDocument()
      expect(screen.getByLabelText('View image 3')).toBeInTheDocument()
    })

    it('should have focus management for interactive elements', () => {
      render(<RoomCard {...defaultProps} />)

      const selectButton = screen.getByText('SELECT')
      expect(selectButton).toHaveClass('focus:outline-none')
      expect(selectButton).toHaveClass('focus:ring-2')
    })
  })

  describe('Responsive behavior', () => {
    it('should have responsive image navigation visibility', () => {
      render(<RoomCard {...defaultProps} />)

      const nextButton = screen.getByLabelText('Next image')
      const prevButton = screen.getByLabelText('Previous image')

      // Should be hidden on mobile and visible on hover on desktop
      expect(nextButton).toHaveClass('md:opacity-0')
      expect(nextButton).toHaveClass('group-hover:opacity-100')
      expect(prevButton).toHaveClass('md:opacity-0')
      expect(prevButton).toHaveClass('group-hover:opacity-100')
    })

    it('should have responsive amenities scrolling', () => {
      render(<RoomCard {...defaultProps} />)

      const amenitiesContainer = screen.getByText('WiFi').closest('.flex')
      expect(amenitiesContainer).toHaveClass('overflow-auto')
      expect(amenitiesContainer).toHaveClass('flex-nowrap')
    })
  })

  describe('Edge cases', () => {
    it('should handle room with no amenities', () => {
      const roomWithoutAmenities = { ...mockRoom, amenities: [] }
      render(<RoomCard {...defaultProps} room={roomWithoutAmenities} />)

      // Should still render without crashing
      expect(screen.getByText('Deluxe Room')).toBeInTheDocument()
    })

    it('should handle room with no images', () => {
      const roomWithoutImages = { ...mockRoom, images: [] }
      render(<RoomCard {...defaultProps} room={roomWithoutImages} />)

      // Should not show image navigation
      expect(screen.queryByLabelText('Previous image')).not.toBeInTheDocument()
      expect(screen.queryByLabelText('Next image')).not.toBeInTheDocument()
    })

    it('should handle very long room names and descriptions', () => {
      const roomWithLongContent = {
        ...mockRoom,
        name: 'Very Long Room Name That Might Overflow The Container And Cause Layout Issues',
        description:
          'A very long description that goes on and on and might cause layout issues if not handled properly with appropriate text wrapping and container constraints',
      }

      render(<RoomCard {...defaultProps} room={roomWithLongContent} />)

      expect(screen.getByText(roomWithLongContent.name)).toBeInTheDocument()
      expect(screen.getByText(roomWithLongContent.description)).toBeInTheDocument()
    })

    it('should handle amenities with special characters', () => {
      const roomWithSpecialAmenities = {
        ...mockRoom,
        amenities: ['Wi-Fi & Internet', 'A/C Climate Control', '24/7 Service', 'Room Service (24h)'],
      }

      render(<RoomCard {...defaultProps} room={roomWithSpecialAmenities} />)

      expect(screen.getByText('Wi-Fi & Internet')).toBeInTheDocument()
      expect(screen.getByText('A/C Climate Control')).toBeInTheDocument()
      expect(screen.getByText('24/7 Service')).toBeInTheDocument()
      expect(screen.getByText('Room Service (24h)')).toBeInTheDocument()
    })
  })
})
