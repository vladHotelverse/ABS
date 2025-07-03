import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { render } from '../../../../__tests__/helpers'
import BookingInfoBar from '../../index'
import { createSingleBookingProps, createMultiBookingProps, mockViewport, VIEWPORT_SIZES } from '../testUtils'
import type { RoomBookingInfo } from '../../types'

// Mock the useResponsiveScreen hook
vi.mock('../../helpers', async () => {
  const actual = await vi.importActual('../../helpers')
  return {
    ...actual,
    useResponsiveScreen: vi.fn(),
  }
})

// Import the mocked helper functions
import { useResponsiveScreen } from '../../helpers'

// Common test constants
const DEFAULT_LABELS = {
  multiRoomBookingsTitle: 'Multiple Bookings',
  roomsCountLabel: 'rooms',
  singleRoomLabel: 'room',
  clickToExpandLabel: 'Click to expand',
  roomLabel: 'Room',
  guestLabel: 'Guest',
  selectionLabel: 'Selected',
}

const MOCK_ROOM_BOOKINGS: RoomBookingInfo[] = [
  {
    id: 'room1',
    roomName: 'Deluxe Suite',
    guestName: 'John Doe',
    items: [{ icon: 'Calendar', label: 'Stay Dates', value: '15/01/2024 - 20/01/2024' }],
  },
  {
    id: 'room2',
    roomName: 'Ocean View',
    guestName: 'Jane Smith',
    items: [{ icon: 'Calendar', label: 'Stay Dates', value: '15/01/2024 - 18/01/2024' }],
  },
]

describe('ABS_BookingInfoBar', () => {
  beforeEach(() => {
    // Default to mobile view for most tests
    vi.mocked(useResponsiveScreen).mockReturnValue(false)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Single Booking Mode', () => {
    it('should render hotel banner when showBanner is true', () => {
      render(<BookingInfoBar {...createSingleBookingProps()} />)

      const banner = screen.getByRole('img', { name: /hotel exterior view/i })
      expect(banner).toBeInTheDocument()
      expect(banner).toHaveAttribute('src')
    })

    it('should not render hotel banner when showBanner is false', () => {
      render(<BookingInfoBar {...createSingleBookingProps({ showBanner: false })} />)

      const banner = screen.queryByRole('img', { name: /hotel exterior view/i })
      expect(banner).not.toBeInTheDocument()
    })

    it('should render custom hotel image when provided', () => {
      const customImage = 'https://example.com/custom-hotel.jpg'
      render(<BookingInfoBar {...createSingleBookingProps({ hotelImage: customImage })} />)

      const banner = screen.getByRole('img', { name: /hotel exterior view/i })
      expect(banner).toHaveAttribute('src', customImage)
    })

    it('should render all booking info items with correct icons', () => {
      render(<BookingInfoBar {...createSingleBookingProps()} />)

      expect(screen.getAllByText('Código de reserva')[0]).toBeInTheDocument()
      expect(screen.getAllByText('1003066AU')[0]).toBeInTheDocument()
      expect(screen.getAllByText('Fechas de estancia')[0]).toBeInTheDocument()
      expect(screen.getAllByText('01/01/2025 - 01/01/2025')[0]).toBeInTheDocument()
    })

    it('should apply custom className when provided', () => {
      const { container } = render(<BookingInfoBar {...createSingleBookingProps({ className: 'custom-class' })} />)

      const wrapper = container.querySelector('.custom-class')
      expect(wrapper).toBeInTheDocument()
    })

    it('should render responsive layouts correctly', () => {
      render(<BookingInfoBar {...createSingleBookingProps()} />)

      // XL Desktop version should be hidden on smaller screens
      const xlDesktopVersion = document.querySelector('.hidden.xl\\:block')
      expect(xlDesktopVersion).toBeInTheDocument()

      // Mobile/Tablet/Desktop version should be shown on screens smaller than XL
      const smallerScreenVersion = document.querySelector('.block.xl\\:hidden')
      expect(smallerScreenVersion).toBeInTheDocument()
    })
  })

  describe('Multi-Booking Mode', () => {
    it('should render multi-booking header with room count', () => {
      render(<BookingInfoBar {...createMultiBookingProps()} />)

      expect(screen.getByText('Información de tus reservas')).toBeInTheDocument()
      expect(
        screen.getByText((_content, element) => {
          return element?.textContent === '2 habitaciones • Haz clic para expandir'
        })
      ).toBeInTheDocument()
    })

    it('should render accordion buttons for each room', () => {
      render(<BookingInfoBar {...createMultiBookingProps()} />)

      const roomButtons = screen.getAllByRole('button')
      expect(roomButtons).toHaveLength(2) // Only smaller screens have buttons now (no accordion on XL)

      // XL now uses compact format without labels
      expect(screen.getAllByText('Deluxe Double Room with Ocean View')[0]).toBeInTheDocument()
      expect(screen.getAllByText(/María García/)[0]).toBeInTheDocument()
    })

    it('should expand room details when accordion button is clicked (smaller screens only)', () => {
      mockViewport(VIEWPORT_SIZES.tablet)

      render(<BookingInfoBar {...createMultiBookingProps({ showBanner: true })} />)

      // Initially details should not be visible (accordion collapsed)
      expect(screen.queryByText('1003066AU')).not.toBeInTheDocument()

      // Click the first room button to expand
      const firstRoomButton = screen.getByRole('button', { name: /deluxe double room with ocean view/i })
      fireEvent.click(firstRoomButton)

      // Now details should be visible
      expect(screen.getByText('1003066AU')).toBeInTheDocument()

      // Click again to collapse
      fireEvent.click(firstRoomButton)

      // Details should be hidden again
      expect(screen.queryByText('1003066AU')).not.toBeInTheDocument()
    })

    it('should collapse expanded room when clicked again (smaller screens only)', () => {
      mockViewport(VIEWPORT_SIZES.tablet)

      render(<BookingInfoBar {...createMultiBookingProps({ showBanner: true })} />)

      const firstRoomButton = screen.getByRole('button', { name: /deluxe double room with ocean view/i })

      // Expand
      fireEvent.click(firstRoomButton)
      expect(screen.getByText('1003066AU')).toBeInTheDocument()

      // Collapse
      fireEvent.click(firstRoomButton)
      expect(screen.queryByText('1003066AU')).not.toBeInTheDocument()
    })

    it('should render room images when provided', () => {
      render(<BookingInfoBar {...createMultiBookingProps({ showBanner: true })} />)

      const roomImages = screen.getAllByRole('img').filter((img) => img.getAttribute('alt')?.includes('room'))
      expect(roomImages).toHaveLength(1) // Only first room has image (single layout rendering)
      expect(roomImages[0]).toHaveAttribute('src', 'https://example.com/room1.jpg')
    })

    it('should handle rooms without images gracefully', () => {
      render(<BookingInfoBar {...createMultiBookingProps()} />)

      // Second room doesn't have image, should still render (use getAllByText for multiple instances)
      expect(screen.getAllByText('Standard Twin Room')[0]).toBeInTheDocument()
    })
  })

  describe('Type Safety Issues', () => {
    it('should handle invalid icon names gracefully', () => {
      const propsWithInvalidIcon = createSingleBookingProps({
        items: [
          {
            icon: 'InvalidIcon' as any,
            label: 'Test Label',
            value: 'Test Value',
          },
        ],
      })

      // Should not throw and should render the item without icon
      expect(() => render(<BookingInfoBar {...propsWithInvalidIcon} />)).not.toThrow()
      expect(screen.getAllByText('Test Label')[0]).toBeInTheDocument()
      expect(screen.getAllByText('Test Value')[0]).toBeInTheDocument()
    })

    it('should handle empty items array', () => {
      const propsWithEmptyItems = createSingleBookingProps({
        items: [],
      })

      expect(() => render(<BookingInfoBar {...propsWithEmptyItems} />)).not.toThrow()
      expect(screen.getAllByText('Información de tu reserva')[0]).toBeInTheDocument()
    })

    it('should handle empty roomBookings array', () => {
      const propsWithEmptyRooms = createMultiBookingProps({
        roomBookings: [],
      })

      expect(() => render(<BookingInfoBar {...propsWithEmptyRooms} />)).not.toThrow()
    })
  })

  describe('Accessibility Issues', () => {
    it('should have proper semantic structure', () => {
      render(<BookingInfoBar {...createSingleBookingProps()} />)

      const banner = document.querySelector('section')
      expect(banner).toBeInTheDocument()
    })

    it('should have proper heading hierarchy', () => {
      render(<BookingInfoBar {...createSingleBookingProps()} />)

      const headings = screen.getAllByRole('heading', { level: 4 })
      expect(headings[0]).toHaveTextContent('Información de tu reserva')
    })

    it('should have accessible accordion buttons in multi-booking mode', () => {
      render(<BookingInfoBar {...createMultiBookingProps()} />)

      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('type', 'button')
        expect(button).toHaveAttribute('aria-expanded')
        expect(button).toHaveAttribute('aria-controls')
        expect(button).toHaveAttribute('id')
      })
    })

    it('should have proper alt text for images', () => {
      render(<BookingInfoBar {...createMultiBookingProps()} />)

      const hotelImage = screen.getByRole('img', { name: /hotel exterior view/i })
      expect(hotelImage).toHaveAttribute('alt', 'Hotel exterior view')

      const roomImages = screen.getAllByRole('img', { name: /Deluxe Double Room with Ocean View room/i })
      expect(roomImages[0]).toHaveAttribute('alt', 'Deluxe Double Room with Ocean View room')
    })

    it('should support keyboard navigation', () => {
      render(<BookingInfoBar {...createMultiBookingProps()} />)

      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        button.focus()
        expect(button).toHaveFocus()

        // Should be able to activate with Enter/Space (implicit test)
        expect(button).not.toBeDisabled()
      })
    })
  })

  describe('Performance and UX', () => {
    it('should handle large numbers of rooms without performance issues', () => {
      const manyRooms = Array.from({ length: 50 }, (_, i) => ({
        id: `room-${i}`,
        roomName: `Room ${i}`,
        guestName: `Guest ${i}`,
        items: [
          {
            icon: 'Tag',
            label: 'Code',
            value: `CODE${i}`,
          },
        ],
      }))

      const propsWithManyRooms = createMultiBookingProps({
        roomBookings: manyRooms,
      })

      expect(() => render(<BookingInfoBar {...propsWithManyRooms} />)).not.toThrow()
      expect(
        screen.getByText((_content, element) => {
          return element?.textContent === '50 habitaciones • Haz clic para expandir'
        })
      ).toBeInTheDocument()
    })

    it('should have scrollable content when many rooms are present', () => {
      render(<BookingInfoBar {...createMultiBookingProps()} />)

      // Should have scrollable container with max height
      const scrollableContainer = document.querySelector('.max-h-\\[400px\\].overflow-y-auto')

      expect(scrollableContainer).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('should have different layouts for XL screens and smaller screens', () => {
      render(<BookingInfoBar {...createSingleBookingProps()} />)

      // XL grid layout with responsive classes
      const xlGrid = document.querySelector('.hidden.xl\\:block .grid')
      expect(xlGrid).toBeInTheDocument()

      // Smaller screen grid layout (mobile/tablet/desktop)
      const smallerGrid = document.querySelector('.block.xl\\:hidden .grid')
      expect(smallerGrid).toBeInTheDocument()
    })

    it('should handle very long room names gracefully', () => {
      const propsWithLongNames = createMultiBookingProps({
        roomBookings: [
          {
            id: 'room-1',
            roomName: 'Very Long Room Name That Should Not Break The Layout When Displayed On Mobile Devices',
            guestName: 'Guest With Very Long Name That Should Also Be Handled Properly',
            items: [],
          },
        ],
      })

      expect(() => render(<BookingInfoBar {...propsWithLongNames} />)).not.toThrow()
      expect(screen.getAllByText(/Very Long Room Name/)[0]).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('should handle undefined props gracefully', () => {
      const minimalProps = { items: [] }

      expect(() => render(<BookingInfoBar {...minimalProps} />)).not.toThrow()
    })

    it('should handle rooms without required fields', () => {
      const propsWithIncompleteRooms = createMultiBookingProps({
        roomBookings: [
          {
            id: 'room-1',
            roomName: '',
            guestName: '',
            items: [],
          },
        ] as RoomBookingInfo[],
      })

      expect(() => render(<BookingInfoBar {...propsWithIncompleteRooms} />)).not.toThrow()
    })

    it('should handle missing labels in multi-booking mode', () => {
      const propsWithoutLabels = createMultiBookingProps({
        labels: undefined,
      })

      expect(() => render(<BookingInfoBar {...propsWithoutLabels} />)).not.toThrow()
    })
  })

  describe('Internationalization', () => {
    it('should use provided labels for multi-booking UI', () => {
      render(<BookingInfoBar {...createMultiBookingProps({ labels: DEFAULT_LABELS })} />)

      expect(
        screen.getByText((_content, element) => {
          return element?.textContent === '2 rooms • Click to expand'
        })
      ).toBeInTheDocument()
      expect(screen.getAllByText('Deluxe Double Room with Ocean View')[0]).toBeInTheDocument()
      expect(screen.getAllByText(/María García/)[0]).toBeInTheDocument()
    })
  })

  describe('Selection Indicators', () => {
    it('should show selection indicator on active room header', () => {
      render(<BookingInfoBar roomBookings={MOCK_ROOM_BOOKINGS} labels={DEFAULT_LABELS} activeRoom="room1" />)

      expect(screen.getAllByText('Selected')[0]).toBeInTheDocument()
      const activeRoomButton = screen.getByRole('button', { name: /deluxe suite.*selected/i })
      expect(activeRoomButton).toHaveAttribute('data-selected', 'true')
    })

    it('should not show selection indicator when no room is active', () => {
      render(<BookingInfoBar roomBookings={[MOCK_ROOM_BOOKINGS[0]]} labels={DEFAULT_LABELS} activeRoom={null} />)

      expect(screen.queryByText('Selected')).not.toBeInTheDocument()
      const roomButton = screen.getByRole('button', { name: /deluxe suite/i })
      expect(roomButton).toHaveAttribute('data-selected', 'false')
    })

    it('should show selection indicator only on correct room when multiple rooms exist', () => {
      render(<BookingInfoBar roomBookings={MOCK_ROOM_BOOKINGS} labels={DEFAULT_LABELS} activeRoom="room2" />)

      const room2Button = screen.getByRole('button', { name: /ocean view.*selected/i })
      expect(room2Button).toHaveAttribute('data-selected', 'true')

      const room1Button = screen.getByRole('button', { name: /deluxe suite/i })
      expect(room1Button).toHaveAttribute('data-selected', 'false')
      expect(room1Button.textContent).not.toContain('Selected')
    })

    it('should show accordion behavior on screens smaller than XL', () => {
      mockViewport(VIEWPORT_SIZES.mobile)

      render(<BookingInfoBar roomBookings={[MOCK_ROOM_BOOKINGS[0]]} labels={DEFAULT_LABELS} activeRoom="room1" />)

      expect(screen.getAllByText('Selected')[0]).toBeInTheDocument()
      const accordionButton = screen.getByRole('button', { name: /deluxe suite.*selected/i })
      expect(accordionButton).toHaveAttribute('aria-expanded')
    })

    it('should show compact layout only on XL screens without accordion', () => {
      mockViewport(VIEWPORT_SIZES.xl)
      vi.mocked(useResponsiveScreen).mockReturnValue(true)

      render(<BookingInfoBar roomBookings={[MOCK_ROOM_BOOKINGS[0]]} labels={DEFAULT_LABELS} activeRoom="room1" />)

      expect(screen.getAllByText('Selected')[0]).toBeInTheDocument()
      expect(screen.getAllByText('Stay Dates')[0]).toBeInTheDocument()
      expect(screen.queryByText('Room:')).not.toBeInTheDocument()
      expect(screen.getAllByText('Deluxe Suite')[0]).toBeInTheDocument()

      const xlHeaders = screen.getByTestId('room-header-room1')
      expect(xlHeaders).toBeInTheDocument()
      expect(xlHeaders.tagName).toBe('DIV')
    })

    it('should use improved readable layout on XL screens', () => {
      mockViewport(VIEWPORT_SIZES.xl)
      vi.mocked(useResponsiveScreen).mockReturnValue(true)

      const roomWithMultipleItems = {
        ...MOCK_ROOM_BOOKINGS[0],
        items: [
          { icon: 'Calendar', label: 'Stay Dates', value: '15/01/2024 - 20/01/2024' },
          { icon: 'Users', label: 'Guests', value: '2 Adults' },
          { icon: 'Tag', label: 'Booking Code', value: 'ABC123' },
        ],
      }

      render(<BookingInfoBar roomBookings={[roomWithMultipleItems]} labels={DEFAULT_LABELS} activeRoom="room1" />)

      const itemsContainer = screen.getByText('Stay Dates').closest('.grid')
      expect(itemsContainer).toBeInTheDocument()
      expect(itemsContainer).toHaveClass('grid-cols-[repeat(auto-fit,minmax(200px,1fr))]')

      expect(screen.getAllByText('Stay Dates')[0]).toBeInTheDocument()
      expect(screen.getAllByText('Guests')[0]).toBeInTheDocument()
      expect(screen.getAllByText('Booking Code')[0]).toBeInTheDocument()

      const roomName = screen.getAllByText('Deluxe Suite')[0]
      expect(roomName).toHaveClass('font-bold')
    })

    it('should filter out duplicate room type items on XL screens', () => {
      mockViewport(VIEWPORT_SIZES.xl)
      vi.mocked(useResponsiveScreen).mockReturnValue(true)

      const roomWithDuplicateTypes = {
        ...MOCK_ROOM_BOOKINGS[0],
        items: [
          { icon: 'Calendar', label: 'Stay Dates', value: '15/01/2024 - 20/01/2024' },
          { icon: 'Home', label: 'Room Type', value: 'Deluxe Suite' },
          { icon: 'Home', label: 'Type', value: 'Deluxe Suite' },
          { icon: 'Users', label: 'Guests', value: '2 Adults' },
        ],
      }

      render(<BookingInfoBar roomBookings={[roomWithDuplicateTypes]} labels={DEFAULT_LABELS} activeRoom="room1" />)

      expect(screen.queryByText('Room Type')).not.toBeInTheDocument()
      expect(screen.queryByText('Type')).not.toBeInTheDocument()
      expect(screen.getByText('Stay Dates')).toBeInTheDocument()
      expect(screen.getByText('Guests')).toBeInTheDocument()
    })

    it('should show selection indicator immediately without expansion', () => {
      render(<BookingInfoBar roomBookings={[MOCK_ROOM_BOOKINGS[0]]} labels={DEFAULT_LABELS} activeRoom="room1" />)

      expect(screen.getAllByText('Selected')[0]).toBeInTheDocument()

      const buttonElement = screen.queryByRole('button', { name: /deluxe suite.*selected/i })
      const roomElement = buttonElement || screen.getByTestId('room-header-room1')
      expect(roomElement).toHaveAttribute('data-selected', 'true')
    })

    it('should provide callback when room becomes active', () => {
      mockViewport(VIEWPORT_SIZES.tablet)
      const onRoomActiveChange = vi.fn()

      render(
        <BookingInfoBar
          roomBookings={[MOCK_ROOM_BOOKINGS[0]]}
          labels={DEFAULT_LABELS}
          onRoomActiveChange={onRoomActiveChange}
        />
      )

      const roomHeader = screen.getByRole('button', { name: /deluxe suite/i })
      fireEvent.click(roomHeader)

      expect(onRoomActiveChange).toHaveBeenCalledWith('room1')
    })
  })
})
