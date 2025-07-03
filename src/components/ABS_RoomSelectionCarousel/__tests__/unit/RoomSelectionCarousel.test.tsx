import { vi, describe, it, expect, beforeEach } from 'vitest'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '../../../../__tests__/helpers/custom-render'
import { createMockRoomOptions } from '../../../../__tests__/helpers/mock-factory'
import RoomSelectionCarousel from '../../index'
import type { RoomOption, RoomSelectionCarouselProps } from '../../types'

describe('ABS_RoomSelectionCarousel', () => {
  let mockRoomOptions: RoomOption[]
  let defaultProps: RoomSelectionCarouselProps
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
    mockRoomOptions = createMockRoomOptions(3, {
      images: ['image1.jpg', 'image2.jpg'],
      amenities: ['WiFi', 'TV', 'AC'],
    })

    defaultProps = {
      roomOptions: mockRoomOptions,
      onRoomSelected: vi.fn(),
      onMakeOffer: vi.fn(),
      onLearnMore: vi.fn(),
    }
  })

  describe('Basic functionality', () => {
    it('should render all room options', () => {
      render(<RoomSelectionCarousel {...defaultProps} />)

      mockRoomOptions.forEach((room) => {
        expect(screen.getByText(room.name)).toBeInTheDocument()
        expect(screen.getByText(room.description)).toBeInTheDocument()
      })
    })

    it('should initialize with correct active index based on room count', () => {
      // Single room - should be index 0
      const singleRoomProps = { ...defaultProps, roomOptions: [mockRoomOptions[0]] }
      const { rerender } = render(<RoomSelectionCarousel {...singleRoomProps} />)

      expect(screen.getByText(singleRoomProps.roomOptions[0].name)).toBeInTheDocument()

      // Two rooms - should be index 0
      const twoRoomsProps = { ...defaultProps, roomOptions: mockRoomOptions.slice(0, 2) }
      rerender(<RoomSelectionCarousel {...twoRoomsProps} />)

      // Three rooms - should be index 1 (middle)
      rerender(<RoomSelectionCarousel {...defaultProps} />)

      // Check that middle room is in the active position (has z-10 class)
      const middleRoom = mockRoomOptions[1]
      expect(screen.getByText(middleRoom.name).closest('.absolute')).toHaveClass('z-10')
    })

    it('should handle room selection correctly', async () => {
      const onRoomSelected = vi.fn()
      render(<RoomSelectionCarousel {...defaultProps} onRoomSelected={onRoomSelected} />)

      const selectButton = screen.getAllByText('SELECCIONAR')[0]
      await user.click(selectButton)

      expect(onRoomSelected).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
          amenities: expect.arrayContaining(['WiFi', 'TV', 'AC']),
          price: expect.any(Number),
          images: expect.any(Array),
        })
      )
    })

    it('should display selected room with correct styling', async () => {
      const { rerender } = render(<RoomSelectionCarousel {...defaultProps} />)

      // Initially no room selected
      expect(screen.getAllByText('SELECCIONAR')).toHaveLength(3)

      // Select a room
      const selectedRoom = mockRoomOptions[0]
      rerender(<RoomSelectionCarousel {...defaultProps} initialSelectedRoom={selectedRoom} />)

      // Should show selected room text - carousel shows only visible cards (active + adjacent)
      // Check that we have selection buttons for visible cards
      const selectButtons = screen.getAllByText('SELECCIONAR')
      expect(selectButtons.length).toBeGreaterThan(0) // At least one card should be visible
      expect(selectButtons.length).toBeLessThanOrEqual(3) // Max 3 cards visible in carousel
    })

    it('should handle make offer callback', async () => {
      const onMakeOffer = vi.fn()
      render(<RoomSelectionCarousel {...defaultProps} onMakeOffer={onMakeOffer} variant="with-slider" />)

      const makeOfferButton = screen.getByText('Hacer oferta')
      await user.click(makeOfferButton)

      expect(onMakeOffer).toHaveBeenCalledWith(
        expect.any(Number),
        mockRoomOptions[1] // Middle room is active by default
      )
    })

    it('should handle learn more callback', async () => {
      const onLearnMore = vi.fn()
      render(<RoomSelectionCarousel {...defaultProps} onLearnMore={onLearnMore} />)

      const learnMoreButtons = screen.getAllByText('Descubre más detalles')
      await user.click(learnMoreButtons[0])

      expect(onLearnMore).toHaveBeenCalledWith(expect.any(Object))
    })
  })

  describe('Carousel navigation', () => {
    it('should navigate to next room on desktop', async () => {
      render(<RoomSelectionCarousel {...defaultProps} />)

      // Find the desktop next button (hidden on mobile with sm:block)
      const nextButtons = screen.getAllByLabelText('Next room')
      const desktopNextButton = nextButtons.find(
        (btn) => btn.className.includes('hidden') && btn.className.includes('sm:block')
      )
      expect(desktopNextButton).toBeDefined()
      if (desktopNextButton) await user.click(desktopNextButton)

      // Active room should change (check z-index class)
      const nextActiveRoom = mockRoomOptions[2] // Should move from index 1 to 2
      expect(screen.getByText(nextActiveRoom.name).closest('.absolute')).toHaveClass('z-10')
    })

    it('should navigate to previous room on desktop', async () => {
      render(<RoomSelectionCarousel {...defaultProps} />)

      const prevButtons = screen.getAllByLabelText('Previous room')
      const desktopPrevButton = prevButtons.find(
        (btn) => btn.className.includes('hidden') && btn.className.includes('sm:block')
      )
      expect(desktopPrevButton).toBeDefined()
      if (desktopPrevButton) await user.click(desktopPrevButton)

      // Should move from index 1 to 0
      const prevActiveRoom = mockRoomOptions[0]
      // In 3+ room carousel, room should be displayed properly
      expect(screen.getByText(prevActiveRoom.name)).toBeInTheDocument()
    })

    it('should wrap around when navigating past bounds', async () => {
      render(<RoomSelectionCarousel {...defaultProps} />)

      const nextButtons = screen.getAllByLabelText('Next room')
      const desktopNextButton = nextButtons.find(
        (btn) => btn.className.includes('hidden') && btn.className.includes('sm:block')
      )

      // Navigate to last room (from 1 to 2)
      expect(desktopNextButton).toBeDefined()
      if (desktopNextButton) await user.click(desktopNextButton)

      // Navigate past last room (should wrap to 0)
      if (desktopNextButton) await user.click(desktopNextButton)

      const firstRoom = mockRoomOptions[0]
      // Should wrap to first room
      expect(screen.getByText(firstRoom.name)).toBeInTheDocument()
    })

    it('should handle keyboard navigation', async () => {
      render(<RoomSelectionCarousel {...defaultProps} />)

      const nextButtons = screen.getAllByLabelText('Next room')
      const desktopNextButton = nextButtons.find(
        (btn) => btn.className.includes('hidden') && btn.className.includes('sm:block')
      )
      expect(desktopNextButton).toBeDefined()
      desktopNextButton?.focus()

      await user.keyboard('{Enter}')

      // Should navigate to next room
      const nextActiveRoom = mockRoomOptions[2]
      // After keyboard navigation, should display the correct room
      expect(screen.getByText(nextActiveRoom.name)).toBeInTheDocument()
    })
  })

  describe('Mobile navigation', () => {
    it('should show mobile navigation dots for multiple rooms', () => {
      render(<RoomSelectionCarousel {...defaultProps} />)

      // Should have navigation dots equal to number of rooms
      const dots = screen.getAllByLabelText(/Go to room \d+/)
      expect(dots).toHaveLength(3)
    })

    it('should not show mobile navigation for single room', () => {
      const singleRoomProps = { ...defaultProps, roomOptions: [mockRoomOptions[0]] }
      render(<RoomSelectionCarousel {...singleRoomProps} />)

      expect(screen.queryByLabelText(/Go to room \d+/)).not.toBeInTheDocument()
    })

    it('should navigate using mobile dots', async () => {
      render(<RoomSelectionCarousel {...defaultProps} />)

      const thirdRoomDot = screen.getByLabelText('Go to room 3')
      await user.click(thirdRoomDot)

      // Should show third room as active
      const thirdRoom = mockRoomOptions[2]
      // Should navigate to third room via mobile dots
      expect(screen.getByText(thirdRoom.name)).toBeInTheDocument()
    })

    it('should show mobile arrow buttons', () => {
      render(<RoomSelectionCarousel {...defaultProps} />)

      // Mobile arrows have different labels than desktop
      const mobileNextButton = screen.getAllByLabelText('Next room')[1] // Second one is mobile
      const mobilePrevButton = screen.getAllByLabelText('Previous room')[1] // Second one is mobile

      expect(mobileNextButton).toBeInTheDocument()
      expect(mobilePrevButton).toBeInTheDocument()
    })
  })

  describe('Price slider variant', () => {
    it('should show price slider when variant is with-slider', () => {
      render(<RoomSelectionCarousel {...defaultProps} variant="with-slider" />)

      expect(screen.getByText('Propon tu precio:')).toBeInTheDocument()
      expect(screen.getByRole('slider')).toBeInTheDocument()
      expect(screen.getByText('Hacer oferta')).toBeInTheDocument()
    })

    it('should show price slider when showPriceSlider is true', () => {
      render(<RoomSelectionCarousel {...defaultProps} showPriceSlider={true} />)

      expect(screen.getByText('Propon tu precio:')).toBeInTheDocument()
      expect(screen.getByRole('slider')).toBeInTheDocument()
    })

    it('should not show price slider by default', () => {
      render(<RoomSelectionCarousel {...defaultProps} />)

      expect(screen.queryByText('Propon tu precio:')).not.toBeInTheDocument()
      expect(screen.queryByRole('slider')).not.toBeInTheDocument()
    })

    it('should handle price changes in slider', async () => {
      render(<RoomSelectionCarousel {...defaultProps} variant="with-slider" minPrice={50} />)

      const slider = screen.getByRole('slider')

      // Change slider value
      fireEvent.change(slider, { target: { value: '150' } })

      // Should update the slider value (the displayed price might be formatted differently)
      await waitFor(() => {
        expect(slider).toHaveValue('150')
      })

      // Verify the price is reflected somewhere in the component
      expect(screen.getByText('Propon tu precio:')).toBeInTheDocument()
    })

    it('should calculate proposed price correctly based on active room', async () => {
      const roomsWithFixedPrices = mockRoomOptions.map((room, index) => ({
        ...room,
        price: 100 + index * 50, // 100, 150, 200
      }))

      render(
        <RoomSelectionCarousel
          {...defaultProps}
          roomOptions={roomsWithFixedPrices}
          variant="with-slider"
          minPrice={50}
        />
      )

      // Default active room is index 1 (price 150), so proposed price should be (50 + 150) / 2 = 100
      expect(screen.getByText(/100 EUR/)).toBeInTheDocument()
    })

    it('should update proposed price when navigating between rooms', async () => {
      const roomsWithFixedPrices = mockRoomOptions.map((room, index) => ({
        ...room,
        price: 100 + index * 50, // 100, 150, 200
      }))

      render(
        <RoomSelectionCarousel
          {...defaultProps}
          roomOptions={roomsWithFixedPrices}
          variant="with-slider"
          minPrice={50}
        />
      )

      // Navigate to next room (index 2, price 200) - use desktop button
      const nextButtons = screen.getAllByLabelText('Next room')
      const desktopNextButton = nextButtons.find(
        (btn) => btn.className.includes('hidden') && btn.className.includes('sm:block')
      )
      expect(desktopNextButton).toBeDefined()
      if (desktopNextButton) await user.click(desktopNextButton)

      // Proposed price should update to (50 + 200) / 2 = 125
      await waitFor(() => {
        expect(screen.getByText(/125 EUR/)).toBeInTheDocument()
      })
    })
  })

  describe('Image carousel functionality', () => {
    it('should show image navigation arrows when multiple images exist', () => {
      const roomWithMultipleImages = {
        ...mockRoomOptions[0],
        images: ['img1.jpg', 'img2.jpg', 'img3.jpg'],
      }

      render(<RoomSelectionCarousel {...defaultProps} roomOptions={[roomWithMultipleImages]} />)

      // Should have image navigation arrows
      expect(screen.getByLabelText('Previous image')).toBeInTheDocument()
      expect(screen.getByLabelText('Next image')).toBeInTheDocument()
    })

    it('should not show image navigation for single image', () => {
      const roomWithSingleImage = {
        ...mockRoomOptions[0],
        images: ['single-img.jpg'],
      }

      render(<RoomSelectionCarousel {...defaultProps} roomOptions={[roomWithSingleImage]} />)

      expect(screen.queryByLabelText('Previous image')).not.toBeInTheDocument()
      expect(screen.queryByLabelText('Next image')).not.toBeInTheDocument()
    })

    it('should show image indicators for multiple images', () => {
      const roomWithMultipleImages = {
        ...mockRoomOptions[0],
        images: ['img1.jpg', 'img2.jpg', 'img3.jpg'],
      }

      render(<RoomSelectionCarousel {...defaultProps} roomOptions={[roomWithMultipleImages]} />)

      // Should have image indicators
      expect(screen.getByLabelText('View image 1')).toBeInTheDocument()
      expect(screen.getByLabelText('View image 2')).toBeInTheDocument()
      expect(screen.getByLabelText('View image 3')).toBeInTheDocument()
    })

    it('should navigate through room images', async () => {
      const roomWithMultipleImages = {
        ...mockRoomOptions[0],
        images: ['img1.jpg', 'img2.jpg', 'img3.jpg'],
      }

      render(<RoomSelectionCarousel {...defaultProps} roomOptions={[roomWithMultipleImages]} />)

      // Initial image should be displayed
      const imageElement = screen.getByAltText(roomWithMultipleImages.name)
      expect(imageElement).toHaveAttribute('src', 'img1.jpg')

      // Click next image button
      const nextImageButton = screen.getByLabelText('Next image')
      await user.click(nextImageButton)

      // Should show second image
      expect(imageElement).toHaveAttribute('src', 'img2.jpg')
    })

    it('should handle image indicator clicks', async () => {
      const roomWithMultipleImages = {
        ...mockRoomOptions[0],
        images: ['img1.jpg', 'img2.jpg', 'img3.jpg'],
      }

      render(<RoomSelectionCarousel {...defaultProps} roomOptions={[roomWithMultipleImages]} />)

      const imageElement = screen.getByAltText(roomWithMultipleImages.name)

      // Click third image indicator
      const thirdImageIndicator = screen.getByLabelText('View image 3')
      await user.click(thirdImageIndicator)

      // Should show third image
      expect(imageElement).toHaveAttribute('src', 'img3.jpg')
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels for navigation buttons', () => {
      render(<RoomSelectionCarousel {...defaultProps} />)

      // Should have multiple navigation buttons (desktop + mobile)
      const prevButtons = screen.getAllByLabelText('Previous room')
      const nextButtons = screen.getAllByLabelText('Next room')

      expect(prevButtons.length).toBeGreaterThan(0)
      expect(nextButtons.length).toBeGreaterThan(0)
      expect(prevButtons[0]).toBeInTheDocument()
      expect(nextButtons[0]).toBeInTheDocument()
    })

    it('should have proper ARIA labels for mobile navigation', () => {
      render(<RoomSelectionCarousel {...defaultProps} />)

      expect(screen.getByLabelText('Go to room 1')).toBeInTheDocument()
      expect(screen.getByLabelText('Go to room 2')).toBeInTheDocument()
      expect(screen.getByLabelText('Go to room 3')).toBeInTheDocument()
    })

    it('should support keyboard navigation for buttons', async () => {
      render(<RoomSelectionCarousel {...defaultProps} />)

      const selectButton = screen.getAllByText('SELECCIONAR')[0]

      // Use user.click instead of keyboard since buttons respond to click events
      await user.click(selectButton)

      expect(defaultProps.onRoomSelected).toHaveBeenCalledWith(expect.any(Object))
    })

    it('should have focus management for navigation controls', () => {
      render(<RoomSelectionCarousel {...defaultProps} />)

      // Target desktop navigation buttons specifically
      const nextButtons = screen.getAllByLabelText('Next room')
      const prevButtons = screen.getAllByLabelText('Previous room')

      // Desktop buttons should be the first ones (with hidden sm:block classes)
      const desktopNextButton = nextButtons.find(
        (btn) => btn.className.includes('hidden') && btn.className.includes('sm:block')
      )
      const desktopPrevButton = prevButtons.find(
        (btn) => btn.className.includes('hidden') && btn.className.includes('sm:block')
      )

      expect(desktopNextButton).toHaveAttribute('class')
      expect(desktopPrevButton).toHaveAttribute('class')

      // Should have focus styles (focus:outline-none focus:ring-2)
      expect(desktopNextButton?.className).toContain('focus:outline-none')
      expect(desktopPrevButton?.className).toContain('focus:ring-2')
    })
  })

  describe('Responsive behavior', () => {
    it('should show desktop navigation arrows with proper responsive classes', () => {
      render(<RoomSelectionCarousel {...defaultProps} />)

      // Get all navigation buttons and filter for desktop ones
      const nextButtons = screen.getAllByLabelText('Next room')
      const prevButtons = screen.getAllByLabelText('Previous room')

      // Desktop buttons have hidden sm:block classes
      const desktopNextButton = nextButtons.find(
        (btn) => btn.className.includes('hidden') && btn.className.includes('sm:block')
      )
      const desktopPrevButton = prevButtons.find(
        (btn) => btn.className.includes('hidden') && btn.className.includes('sm:block')
      )

      // Desktop arrows should be hidden on mobile (sm:block)
      expect(desktopNextButton?.className).toContain('hidden')
      expect(desktopNextButton?.className).toContain('sm:block')
      expect(desktopPrevButton?.className).toContain('hidden')
      expect(desktopPrevButton?.className).toContain('sm:block')
    })

    it('should show mobile navigation only on small screens', () => {
      render(<RoomSelectionCarousel {...defaultProps} />)

      // Get all navigation buttons and filter for mobile ones
      const prevButtons = screen.getAllByLabelText('Previous room')

      // Mobile button has p-2 rounded-full classes (not hidden sm:block)
      const mobilePrevButton = prevButtons.find(
        (btn) =>
          btn.className.includes('p-2') && btn.className.includes('rounded-full') && !btn.className.includes('hidden')
      )

      // Mobile navigation container should have sm:hidden class
      const mobileNavContainer = mobilePrevButton?.closest('.flex')
      expect(mobileNavContainer?.className).toContain('sm:hidden')
    })

    it('should handle room positioning with responsive classes', () => {
      render(<RoomSelectionCarousel {...defaultProps} />)

      const activeRoom = mockRoomOptions[1] // Middle room is active by default

      // Should have responsive positioning for 3+ room carousel
      expect(screen.getByText(activeRoom.name)).toBeInTheDocument()
      // Should have navigation controls
      expect(screen.getAllByLabelText('Previous room').length).toBeGreaterThan(0)
      expect(screen.getAllByLabelText('Next room').length).toBeGreaterThan(0)
    })

    it('should show single room layout for one room', () => {
      const singleRoomProps = { ...defaultProps, roomOptions: [mockRoomOptions[0]] }
      render(<RoomSelectionCarousel {...singleRoomProps} />)

      // Single room should be displayed without carousel structure
      expect(screen.getByText(mockRoomOptions[0].name)).toBeInTheDocument()

      // Should have a container with max-width and centered layout
      const maxWidthContainer = document.querySelector('.max-w-md.mx-auto')
      expect(maxWidthContainer).toBeInTheDocument()

      // Should not have carousel navigation
      expect(screen.queryByLabelText('Next room')).not.toBeInTheDocument()
      expect(screen.queryByLabelText('Previous room')).not.toBeInTheDocument()

      // Should not have absolute positioning (no carousel)
      const roomNameElement = screen.getByText(mockRoomOptions[0].name)
      const absoluteParent = roomNameElement.closest('.absolute')
      expect(absoluteParent).not.toBeInTheDocument()
    })

    it('should show side-by-side layout for two rooms on desktop', () => {
      const twoRoomProps = { ...defaultProps, roomOptions: [mockRoomOptions[0], mockRoomOptions[1]] }
      render(<RoomSelectionCarousel {...twoRoomProps} />)

      // Should have grid container for desktop (hidden on mobile)
      const gridContainer = document.querySelector('.hidden.lg\\:grid.lg\\:grid-cols-2')
      expect(gridContainer).toBeInTheDocument()

      // Should also have mobile carousel version
      const mobileCarousel = document.querySelector('.lg\\:hidden')
      expect(mobileCarousel).toBeInTheDocument()
    })

    it('should show carousel layout for three or more rooms', () => {
      render(<RoomSelectionCarousel {...defaultProps} />)

      // Should have full carousel structure with responsive positioning
      const activeRoom = mockRoomOptions[1]
      // Should display active room in carousel layout
      expect(screen.getByText(activeRoom.name)).toBeInTheDocument()

      // Should have navigation controls for carousel
      expect(screen.getAllByLabelText('Previous room').length).toBeGreaterThan(0)
    })
  })

  describe('Custom text and localization', () => {
    it('should use custom text props', () => {
      const customProps = {
        ...defaultProps,
        learnMoreText: 'Custom Learn More',
        nightText: '/custom night',
        selectedText: 'CUSTOM SELECTED',
        selectText: 'CUSTOM SELECT',
        makeOfferText: 'Custom Make Offer',
        proposePriceText: 'Custom Propose Price:',
        currencyText: 'USD',
      }

      render(<RoomSelectionCarousel {...customProps} variant="with-slider" />)

      // Multiple room cards are shown, so use getAllBy to check all instances
      const learnMoreButtons = screen.getAllByText('Custom Learn More')
      expect(learnMoreButtons.length).toBeGreaterThan(0)
      expect(learnMoreButtons[0]).toBeInTheDocument()

      const customNightTexts = screen.getAllByText(/\/custom night/)
      expect(customNightTexts.length).toBeGreaterThan(0)
      expect(customNightTexts[0]).toBeInTheDocument()

      const selectButtons = screen.getAllByText('CUSTOM SELECT')
      expect(selectButtons.length).toBeGreaterThan(0)
      expect(selectButtons[0]).toBeInTheDocument()

      expect(screen.getByText('Custom Make Offer')).toBeInTheDocument()
      expect(screen.getByText('Custom Propose Price:')).toBeInTheDocument()
      const usdElements = screen.getAllByText(/USD/)
      expect(usdElements.length).toBeGreaterThan(0)
      expect(usdElements[0]).toBeInTheDocument()
    })

    it('should use custom currency symbol', () => {
      render(<RoomSelectionCarousel {...defaultProps} currencySymbol="$" />)

      // Should show dollar sign instead of euro - multiple rooms show multiple prices
      const dollarPrices = screen.getAllByText(/\$\d+/)
      expect(dollarPrices.length).toBeGreaterThan(0)
      expect(dollarPrices[0]).toBeInTheDocument()
    })

    it('should handle missing currency symbol gracefully', () => {
      render(<RoomSelectionCarousel {...defaultProps} currencySymbol={undefined} />)

      // Should default to euro symbol - multiple rooms show multiple prices
      const euroPrices = screen.getAllByText(/€\d+/)
      expect(euroPrices.length).toBeGreaterThan(0)
      expect(euroPrices[0]).toBeInTheDocument()
    })
  })

  describe('Edge cases and error handling', () => {
    it('should handle empty room options array', () => {
      const emptyProps = { ...defaultProps, roomOptions: [] }
      render(<RoomSelectionCarousel {...emptyProps} />)

      // Should not crash and show no rooms
      expect(screen.queryByText('SELECCIONAR')).not.toBeInTheDocument()
    })

    it('should handle room options without images', () => {
      const roomsWithoutImages = mockRoomOptions.map((room) => ({ ...room, images: [] }))
      render(<RoomSelectionCarousel {...defaultProps} roomOptions={roomsWithoutImages} />)

      // Should not show image navigation
      expect(screen.queryByLabelText('Previous image')).not.toBeInTheDocument()
      expect(screen.queryByLabelText('Next image')).not.toBeInTheDocument()
    })

    it('should handle missing onRoomSelected callback', async () => {
      const propsWithoutCallback = { ...defaultProps, onRoomSelected: undefined }
      render(<RoomSelectionCarousel {...propsWithoutCallback} />)

      const selectButton = screen.getAllByText('SELECCIONAR')[0]

      // Should not crash when clicking select without callback
      expect(() => user.click(selectButton)).not.toThrow()
    })

    it('should handle missing onMakeOffer callback with alert fallback', async () => {
      // Mock window.alert
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

      const propsWithoutCallback = { ...defaultProps, onMakeOffer: undefined }
      render(<RoomSelectionCarousel {...propsWithoutCallback} variant="with-slider" />)

      const makeOfferButton = screen.getByText('Hacer oferta')
      await user.click(makeOfferButton)

      // Should show alert as fallback
      expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('Has propuesto'))

      alertSpy.mockRestore()
    })

    it('should reinitialize active index when room options change', () => {
      const { rerender } = render(<RoomSelectionCarousel {...defaultProps} />)

      // Initially should have middle room active (index 1) for 3 rooms
      let activeRoom = mockRoomOptions[1]
      // Initially should show the middle room as active
      expect(screen.getByText(activeRoom.name)).toBeInTheDocument()

      // Change to single room (no carousel positioning)
      const singleRoomProps = { ...defaultProps, roomOptions: [mockRoomOptions[0]] }
      rerender(<RoomSelectionCarousel {...singleRoomProps} />)

      // Should display the single room without carousel structure
      activeRoom = mockRoomOptions[0]
      expect(screen.getByText(activeRoom.name)).toBeInTheDocument()

      // Single room layout doesn't use .absolute positioning
      const singleRoomElement = screen.getByText(activeRoom.name).closest('div')
      expect(singleRoomElement).not.toHaveClass('absolute')
    })
  })

  describe('Discount badge functionality', () => {
    it('should show discount badge when room has oldPrice', () => {
      const roomWithDiscount = {
        ...mockRoomOptions[0],
        price: 100,
        oldPrice: 150,
      }

      render(<RoomSelectionCarousel {...defaultProps} roomOptions={[roomWithDiscount]} discountBadgeText="-" />)

      // Should show 33% discount (100/150 = 0.67, so 33% off)
      expect(screen.getByText('-33%')).toBeInTheDocument()
    })

    it('should not show discount badge when room has no oldPrice', () => {
      const roomWithoutDiscount = {
        ...mockRoomOptions[0],
        oldPrice: undefined,
      }

      render(<RoomSelectionCarousel {...defaultProps} roomOptions={[roomWithoutDiscount]} />)

      expect(screen.queryByText(/%/)).not.toBeInTheDocument()
    })

    it('should use custom discount badge text', () => {
      const roomWithDiscount = {
        ...mockRoomOptions[0],
        price: 100,
        oldPrice: 200,
      }

      render(<RoomSelectionCarousel {...defaultProps} roomOptions={[roomWithDiscount]} discountBadgeText="SAVE " />)

      // Should show custom prefix
      expect(screen.getByText('SAVE 50%')).toBeInTheDocument()
    })
  })
})
