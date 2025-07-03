import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render } from '../../../../__tests__/helpers'
import RoomTabs from '../../RoomTabs'
import type { RoomTabsProps, RoomTab } from '../../RoomTabs'

const mockRoomTabs: RoomTab[] = [
  {
    id: 'room-1',
    roomName: 'Deluxe Suite',
    roomNumber: '101',
    guestName: 'John Doe',
  },
  {
    id: 'room-2',
    roomName: 'Standard Room',
    roomNumber: '102',
    guestName: 'Jane Smith',
  },
  {
    id: 'room-3',
    roomName: 'Premium Suite',
    roomNumber: '201',
    guestName: 'Bob Johnson',
  },
]

const defaultProps: RoomTabsProps = {
  roomTabs: mockRoomTabs,
  activeRoomId: 'room-1',
  onRoomTabClick: vi.fn(),
  isSticky: true,
  headerHeight: 50,
}

describe('RoomTabs', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Mock window.scrollY
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
    })
  })

  afterEach(() => {
    // Clean up scroll event listeners
    window.removeEventListener('scroll', vi.fn())
  })

  describe('Basic functionality', () => {
    it('should render all room tabs', () => {
      render(<RoomTabs {...defaultProps} />)

      expect(screen.getByText('101')).toBeInTheDocument()
      expect(screen.getByText('102')).toBeInTheDocument()
      expect(screen.getByText('201')).toBeInTheDocument()

      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
    })

    it('should highlight active room tab', () => {
      render(<RoomTabs {...defaultProps} activeRoomId="room-2" />)

      const activeTab = screen.getByLabelText(/Switch to Standard Room - Room 102 for Jane Smith/i)
      expect(activeTab).toHaveClass('bg-white', 'text-black')

      // Should show check icon for active tab
      const checkIcon = activeTab.querySelector('svg')
      expect(checkIcon).toBeInTheDocument()
    })

    it('should handle room tab click events', () => {
      const onRoomTabClick = vi.fn()
      render(<RoomTabs {...defaultProps} onRoomTabClick={onRoomTabClick} />)

      const roomTab = screen.getByText('102').closest('button')
      if (roomTab) fireEvent.click(roomTab)

      expect(onRoomTabClick).toHaveBeenCalledWith('room-2')
    })

    it('should not render when no room tabs provided', () => {
      render(<RoomTabs {...defaultProps} roomTabs={[]} />)

      const container = document.querySelector('.bg-black')
      expect(container).not.toBeInTheDocument()
    })
  })

  describe('Multi-room functionality', () => {
    it('should render room tabs when isMultiBooking is true', () => {
      render(<RoomTabs {...defaultProps} />)

      mockRoomTabs.forEach((room) => {
        expect(screen.getByText(room.roomNumber)).toBeInTheDocument()
        expect(screen.getByText(room.guestName)).toBeInTheDocument()
      })
    })

    it('should display current room information correctly', () => {
      render(<RoomTabs {...defaultProps} activeRoomId="room-3" />)

      const activeTab = screen.getByLabelText(/Switch to Premium Suite - Room 201 for Bob Johnson/i)
      expect(activeTab).toBeInTheDocument()
      expect(activeTab).toHaveClass('bg-white', 'text-black')
    })

    it('should switch between room tabs correctly', () => {
      const onRoomTabClick = vi.fn()
      render(<RoomTabs {...defaultProps} onRoomTabClick={onRoomTabClick} activeRoomId="room-1" />)

      // Click on room 2
      const room2Tab = screen.getByText('102').closest('button')
      if (room2Tab) fireEvent.click(room2Tab)

      expect(onRoomTabClick).toHaveBeenCalledWith('room-2')
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<RoomTabs {...defaultProps} />)

      const tab1 = screen.getByLabelText('Switch to Deluxe Suite - Room 101 for John Doe')
      const tab2 = screen.getByLabelText('Switch to Standard Room - Room 102 for Jane Smith')
      const tab3 = screen.getByLabelText('Switch to Premium Suite - Room 201 for Bob Johnson')

      expect(tab1).toBeInTheDocument()
      expect(tab2).toBeInTheDocument()
      expect(tab3).toBeInTheDocument()
    })

    it('should support keyboard navigation', () => {
      const onRoomTabClick = vi.fn()
      render(<RoomTabs {...defaultProps} onRoomTabClick={onRoomTabClick} />)

      const firstTab = screen.getByText('101').closest('button')
      expect(firstTab).not.toBeNull()

      if (firstTab) {
        // Test that button can receive focus
        firstTab.focus()
        expect(firstTab).toHaveFocus()

        // Test that button is properly set up for keyboard accessibility
        expect(firstTab).toHaveAttribute('aria-label')
        expect(firstTab).not.toBeDisabled()
      }
    })

    it('should have correct tab order', () => {
      render(<RoomTabs {...defaultProps} />)

      const tabs = screen.getAllByRole('button')
      expect(tabs).toHaveLength(3)

      // Check that tabs are in correct order
      expect(tabs[0]).toHaveTextContent('101')
      expect(tabs[1]).toHaveTextContent('102')
      expect(tabs[2]).toHaveTextContent('201')
    })
  })

  describe('Responsive behavior', () => {
    it('should handle long room names gracefully', () => {
      const longNameRooms: RoomTab[] = [
        {
          id: 'room-1',
          roomName: 'Presidential Suite with Ocean View and Balcony',
          roomNumber: '1001',
          guestName: 'Alexander Maximilian Thompson-Wellington',
        },
      ]

      render(<RoomTabs {...defaultProps} roomTabs={longNameRooms} />)

      expect(screen.getByText('1001')).toBeInTheDocument()

      // Check for truncation classes
      const guestNameElement = screen.getByText('Alexander Maximilian Thompson-Wellington')
      expect(guestNameElement).toHaveClass('truncate')
    })

    it('should have scrollable container for many tabs', () => {
      const manyRooms: RoomTab[] = Array.from({ length: 10 }, (_, i) => ({
        id: `room-${i + 1}`,
        roomName: `Room ${i + 1}`,
        roomNumber: `${100 + i}`,
        guestName: `Guest ${i + 1}`,
      }))

      render(<RoomTabs {...defaultProps} roomTabs={manyRooms} />)

      const scrollContainer = document.querySelector('.overflow-x-auto')
      expect(scrollContainer).toBeInTheDocument()
      expect(scrollContainer).toHaveClass('scrollbar-hide')
    })

    it('should handle mobile screens with truncated names', () => {
      render(<RoomTabs {...defaultProps} />)

      const guestNames = screen.getAllByText(mockRoomTabs[0].guestName)
      expect(guestNames[0]).toHaveClass('truncate', 'max-w-20', 'md:max-w-none')
    })
  })

  describe('Sticky positioning', () => {
    it('should apply sticky positioning when isSticky is true', () => {
      render(<RoomTabs {...defaultProps} isSticky={true} />)

      const container = document.querySelector('.bg-black')
      expect(container).toHaveClass('sticky', 'z-100')
    })

    it('should not apply sticky positioning when isSticky is false', () => {
      render(<RoomTabs {...defaultProps} isSticky={false} />)

      const container = document.querySelector('.bg-black')
      expect(container).not.toHaveClass('sticky')
    })

    it('should handle scroll events and adjust position', async () => {
      render(<RoomTabs {...defaultProps} isSticky={true} headerHeight={50} />)

      const container = document.querySelector('.bg-black') as HTMLElement
      expect(container.style.top).toBe('50px')

      // Simulate scroll past header
      Object.defineProperty(window, 'scrollY', { value: 100, writable: true })
      fireEvent.scroll(window)

      await waitFor(() => {
        expect(container.style.top).toBe('0px')
      })
    })
  })

  describe('Visual styling', () => {
    it('should have correct styling for active tab', () => {
      render(<RoomTabs {...defaultProps} activeRoomId="room-1" />)

      const activeTab = screen.getByText('101').closest('button')
      expect(activeTab).toHaveClass('bg-white', 'text-black')
    })

    it('should have correct styling for inactive tabs', () => {
      render(<RoomTabs {...defaultProps} activeRoomId="room-1" />)

      const inactiveTab = screen.getByText('102').closest('button')
      expect(inactiveTab).toHaveClass('bg-white/10', 'text-white')
    })

    it('should show check icon only for active tab', () => {
      render(<RoomTabs {...defaultProps} activeRoomId="room-2" />)

      const activeTab = screen.getByText('102').closest('button')
      const inactiveTab = screen.getByText('101').closest('button')

      expect(activeTab?.querySelector('svg')).toBeInTheDocument()
      expect(inactiveTab?.querySelector('svg')).not.toBeInTheDocument()
    })

    it('should apply custom className', () => {
      render(<RoomTabs {...defaultProps} className="custom-room-tabs" />)

      const container = document.querySelector('.custom-room-tabs')
      expect(container).toBeInTheDocument()
    })
  })

  describe('Edge cases', () => {
    it('should handle missing onRoomTabClick prop gracefully', () => {
      const props = { ...defaultProps }
      props.onRoomTabClick = undefined

      expect(() => render(<RoomTabs {...props} />)).not.toThrow()

      const tab = screen.getByText('101').closest('button')
      if (tab) expect(() => fireEvent.click(tab)).not.toThrow()
    })

    it('should handle no active room selected', () => {
      render(<RoomTabs {...defaultProps} activeRoomId={undefined} />)

      const tabs = screen.getAllByRole('button')
      tabs.forEach((tab) => {
        expect(tab).toHaveClass('bg-white/10', 'text-white')
        expect(tab.querySelector('svg')).not.toBeInTheDocument()
      })
    })

    it('should handle invalid activeRoomId', () => {
      render(<RoomTabs {...defaultProps} activeRoomId="non-existent-room" />)

      const tabs = screen.getAllByRole('button')
      tabs.forEach((tab) => {
        expect(tab).toHaveClass('bg-white/10', 'text-white')
      })
    })
  })
})
