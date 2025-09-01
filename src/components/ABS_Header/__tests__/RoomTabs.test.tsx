import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RoomTabs from '../RoomTabs'
import type { RoomTab } from '../RoomTabs'

// Mock the UI Button component
vi.mock('../../ui/button', () => ({
  UiButton: vi.fn(({ children, onClick, onFocus, onBlur, variant, size, role, tabIndex, className, ...props }) => (
    <button
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      role={role}
      tabIndex={tabIndex}
      className={className}
      data-variant={variant}
      data-size={size}
      {...props}
    >
      {children}
    </button>
  ))
}))

const mockRoomTabs: RoomTab[] = [
  {
    id: 'room-1',
    roomName: 'Superior Room',
    roomNumber: '101',
    guestName: 'John Doe',
    baseRoomRoomType: 'Standard Room'
  },
  {
    id: 'room-2', 
    roomName: 'Standard Room',
    roomNumber: '102',
    guestName: 'Jane Smith',
    baseRoomRoomType: 'Standard Room'
  },
  {
    id: 'room-3',
    roomName: 'Deluxe Suite',
    roomNumber: '201',
    guestName: 'Bob Johnson',
    baseRoomRoomType: 'Superior Room'
  }
]

describe('RoomTabs Component', () => {
  it('should render all room tabs correctly', () => {
    render(<RoomTabs roomTabs={mockRoomTabs} />)
    
    expect(screen.getByText('Room 1')).toBeInTheDocument()
    expect(screen.getByText('Room 2')).toBeInTheDocument()
    expect(screen.getByText('Room 3')).toBeInTheDocument()
  })

  it('should show room names on desktop', () => {
    render(<RoomTabs roomTabs={mockRoomTabs} />)
    
    expect(screen.getByText('(Superior Room)')).toBeInTheDocument()
    expect(screen.getByText('(Standard Room)')).toBeInTheDocument()
    expect(screen.getByText('(Deluxe Suite)')).toBeInTheDocument()
  })

  it('should show upgrade indicator when room is upgraded from base room', () => {
    render(<RoomTabs roomTabs={mockRoomTabs} />)
    
    // Room 1: Superior Room upgraded from Standard Room - should show upgrade
    const room1Upgrades = screen.getAllByLabelText('Room upgrade available')
    expect(room1Upgrades).toHaveLength(2) // Room 1 and Room 3 have upgrades
    
    // Verify specifically for upgraded rooms
    const room1Container = screen.getByText('Room 1').closest('button')
    const room3Container = screen.getByText('Room 3').closest('button')
    
    expect(room1Container?.querySelector('[aria-label="Room upgrade available"]')).toBeInTheDocument()
    expect(room3Container?.querySelector('[aria-label="Room upgrade available"]')).toBeInTheDocument()
  })

  it('should not show upgrade indicator when room matches base room type', () => {
    render(<RoomTabs roomTabs={mockRoomTabs} />)
    
    // Room 2: Standard Room matches baseRoomRoomType - should not show upgrade
    const room2Container = screen.getByText('Room 2').closest('button')
    expect(room2Container?.querySelector('[aria-label="Room upgrade available"]')).toBeNull()
  })

  it('should highlight active room tab', () => {
    render(<RoomTabs roomTabs={mockRoomTabs} activeRoomId="room-2" />)
    
    const activeTab = screen.getByText('Room 2').closest('button')
    const inactiveTab = screen.getByText('Room 1').closest('button')
    
    expect(activeTab).toHaveAttribute('data-variant', 'default')
    expect(inactiveTab).toHaveAttribute('data-variant', 'outline')
  })

  it('should show check icon for active room', () => {
    render(<RoomTabs roomTabs={mockRoomTabs} activeRoomId="room-1" />)
    
    // Check icon should be present for active room
    const activeRoomButton = screen.getByText('Room 1').closest('button')
    expect(activeRoomButton?.querySelector('svg')).toBeInTheDocument()
  })

  it('should handle room tab clicks', async () => {
    const user = userEvent.setup()
    const mockOnRoomTabClick = vi.fn()
    
    render(
      <RoomTabs 
        roomTabs={mockRoomTabs} 
        onRoomTabClick={mockOnRoomTabClick}
      />
    )
    
    await user.click(screen.getByText('Room 2').closest('button')!)
    expect(mockOnRoomTabClick).toHaveBeenCalledWith('room-2')
  })

  it('should support keyboard navigation', async () => {
    const user = userEvent.setup()
    const mockOnRoomTabClick = vi.fn()
    
    render(
      <RoomTabs 
        roomTabs={mockRoomTabs} 
        onRoomTabClick={mockOnRoomTabClick}
      />
    )
    
    const container = screen.getByRole('tablist')
    
    // Focus on container and navigate with arrow keys
    container.focus()
    await user.keyboard('{ArrowRight}')
    
    // Should focus second tab (index 1, which is Room 2) - first press from -1 goes to index 1
    expect(screen.getByText('Room 2').closest('button')).toHaveFocus()
    
    // Press Enter to select
    await user.keyboard('{Enter}')
    expect(mockOnRoomTabClick).toHaveBeenCalledWith('room-2')
  })

  it('should handle keyboard navigation with arrow keys', async () => {
    const user = userEvent.setup()
    
    render(<RoomTabs roomTabs={mockRoomTabs} />)
    
    const container = screen.getByRole('tablist')
    container.focus()
    
    // Navigate right through tabs (starts at -1, first right goes to index 1 = Room 2)
    await user.keyboard('{ArrowRight}')
    expect(screen.getByText('Room 2').closest('button')).toHaveFocus()
    
    await user.keyboard('{ArrowRight}')
    expect(screen.getByText('Room 3').closest('button')).toHaveFocus()
    
    // Navigate left
    await user.keyboard('{ArrowLeft}')
    expect(screen.getByText('Room 2').closest('button')).toHaveFocus()
  })

  it('should apply sticky styling when isSticky is true', () => {
    render(<RoomTabs roomTabs={mockRoomTabs} isSticky={true} />)
    
    const container = screen.getByRole('tablist')
    expect(container).toHaveClass('sticky', 'top-0', 'z-100', 'border-b', 'border-b-border')
  })

  it('should not apply sticky styling when isSticky is false', () => {
    render(<RoomTabs roomTabs={mockRoomTabs} isSticky={false} />)
    
    const container = screen.getByRole('tablist')
    expect(container).not.toHaveClass('sticky')
  })

  it('should return null when no room tabs are provided', () => {
    const { container } = render(<RoomTabs roomTabs={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('should apply custom className', () => {
    render(<RoomTabs roomTabs={mockRoomTabs} className="custom-class" />)
    
    const container = screen.getByRole('tablist')
    expect(container).toHaveClass('custom-class')
  })

  it('should have proper accessibility attributes', () => {
    render(<RoomTabs roomTabs={mockRoomTabs} activeRoomId="room-1" />)
    
    const container = screen.getByRole('tablist')
    expect(container).toHaveAttribute('aria-label', 'Room tabs navigation')
    
    const tabs = screen.getAllByRole('tab')
    expect(tabs).toHaveLength(3)
    
    // Check first tab (active)
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
    expect(tabs[0]).toHaveAttribute('aria-controls', 'room-panel-room-1')
    expect(tabs[0]).toHaveAttribute('aria-label', 'Switch to Room 1')
    
    // Check second tab (inactive)
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false')
    expect(tabs[1]).toHaveAttribute('aria-controls', 'room-panel-room-2')
  })

  it('should handle focus and blur events correctly', async () => {
    const user = userEvent.setup()
    
    render(<RoomTabs roomTabs={mockRoomTabs} />)
    
    const firstTab = screen.getByText('Room 1').closest('button')!
    const secondTab = screen.getByText('Room 2').closest('button')!
    
    // Focus on first tab
    await user.click(firstTab)
    expect(firstTab).toHaveFocus()
    
    // Move focus to second tab
    await user.click(secondTab)
    expect(secondTab).toHaveFocus()
  })

  describe('Upgrade Indicator Logic', () => {
    it('should show upgrade indicator when roomName differs from baseRoomRoomType', () => {
      const roomsWithUpgrades: RoomTab[] = [
        {
          id: 'room-1',
          roomName: 'Deluxe Room',
          roomNumber: '101',
          guestName: 'John Doe',
          baseRoomRoomType: 'Standard Room'
        }
      ]
      
      render(<RoomTabs roomTabs={roomsWithUpgrades} />)
      
      expect(screen.getByLabelText('Room upgrade available')).toBeInTheDocument()
    })

    it('should not show upgrade indicator when roomName equals baseRoomRoomType', () => {
      const roomsWithoutUpgrades: RoomTab[] = [
        {
          id: 'room-1',
          roomName: 'Standard Room',
          roomNumber: '101',
          guestName: 'John Doe',
          baseRoomRoomType: 'Standard Room'
        }
      ]
      
      render(<RoomTabs roomTabs={roomsWithoutUpgrades} />)
      
      expect(screen.queryByLabelText('Room upgrade available')).not.toBeInTheDocument()
    })

    it('should not show upgrade indicator when baseRoomRoomType is undefined', () => {
      const roomsWithoutBaseRoom: RoomTab[] = [
        {
          id: 'room-1',
          roomName: 'Standard Room',
          roomNumber: '101',
          guestName: 'John Doe'
          // baseRoomRoomType is undefined
        }
      ]
      
      render(<RoomTabs roomTabs={roomsWithoutBaseRoom} />)
      
      expect(screen.queryByLabelText('Room upgrade available')).not.toBeInTheDocument()
    })

    it('should use correct styling for upgrade indicator', () => {
      const roomsWithUpgrades: RoomTab[] = [
        {
          id: 'room-1',
          roomName: 'Premium Suite',
          roomNumber: '301',
          guestName: 'Alice Cooper',
          baseRoomRoomType: 'Deluxe Room'
        }
      ]
      
      render(<RoomTabs roomTabs={roomsWithUpgrades} />)
      
      const upgradeIcon = screen.getByLabelText('Room upgrade available')
      expect(upgradeIcon).toHaveClass('w-4', 'h-4', 'text-blue-500')
    })
  })
})