import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import MultiBookingPricingSummaryPanel from '../../MultiBookingPricingSummaryPanel'
import type { MultiBookingPricingSummaryPanelProps, RoomBooking } from '../../MultiBookingPricingSummaryPanel'

// Mock components
vi.mock('../../components/PriceChangeIndicator', () => ({
  default: ({ price, euroSuffix }: { price: number; euroSuffix: string }) => (
    <span data-testid="price-indicator">
      {euroSuffix}
      {price.toFixed(2)}
    </span>
  ),
}))

vi.mock('../../components/ToastContainer', () => ({
  default: ({ toasts }: { toasts: any[] }) => (
    <div data-testid="toast-container">
      {toasts.map((toast, index) => (
        <div key={`toast-${toast.type}-${index}`} data-testid={`toast-${toast.type}`}>
          {toast.message}
        </div>
      ))}
    </div>
  ),
}))

describe('MultiBookingPricingSummaryPanel', () => {
  const mockLabels = {
    multiRoomBookingsTitle: 'Multi-Room Bookings',
    roomsCountLabel: 'rooms',
    singleRoomLabel: 'room',
    clickToExpandLabel: 'Click to expand',
    selectedRoomLabel: 'Selected Room',
    upgradesLabel: 'Upgrades',
    specialOffersLabel: 'Special Offers',
    roomTotalLabel: 'Room Total',
    subtotalLabel: 'Subtotal',
    totalLabel: 'Total',
    payAtHotelLabel: 'Pay at Hotel',
    viewTermsLabel: 'View Terms',
    confirmAllButtonLabel: 'Confirm All',
    confirmingAllLabel: 'Confirming...',
    editLabel: 'Edit',
    addLabel: 'Add',
    addUpgradeTitle: 'Add Upgrade',
    noUpgradesSelectedLabel: 'No upgrades selected',
    noOffersSelectedLabel: 'No offers selected',
    noMoreUpgradesLabel: 'No more upgrades',
    noMoreOffersLabel: 'No more offers',
    euroSuffix: '€',
    nightsLabel: 'nights',
    nightLabel: 'night',
    guestsLabel: 'guests',
    guestLabel: 'guest',
    roomImageAltText: 'Room image',
    removedSuccessfully: 'removed successfully',
    addedSuccessfully: 'added successfully',
    cannotRemoveRoom: 'Cannot remove room',
    itemAlreadyAdded: 'Item already added',
    notificationsLabel: 'Notifications',
    closeNotificationLabel: 'Close notification',
  }

  const mockRoomBooking: RoomBooking = {
    id: 'room-1',
    roomName: 'Deluxe Suite',
    roomNumber: '101',
    guestName: 'John Doe',
    checkIn: '2024-01-15',
    checkOut: '2024-01-18',
    guests: 2,
    nights: 3,
    payAtHotel: true,
    roomImage: '/test-room.jpg',
    items: [
      {
        id: 'room-base',
        name: 'Deluxe Suite',
        price: 150,
        type: 'room',
        category: 'accommodation',
      },
      {
        id: 'upgrade-1',
        name: 'Sea View',
        price: 25,
        type: 'customization',
        category: 'upgrade',
      },
      {
        id: 'offer-1',
        name: 'Breakfast Package',
        price: 15,
        type: 'offer',
        category: 'meal',
      },
    ],
  }

  const defaultProps: MultiBookingPricingSummaryPanelProps = {
    roomBookings: [mockRoomBooking],
    labels: mockLabels,
    currency: 'EUR',
    locale: 'en-US',
    onRemoveItem: vi.fn(),
    onEditSection: vi.fn(),
    onConfirmAll: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders the component with correct title', () => {
      render(<MultiBookingPricingSummaryPanel {...defaultProps} />)

      expect(screen.getByText('Multi-Room Bookings')).toBeInTheDocument()
    })

    it('displays correct room count in header', () => {
      render(<MultiBookingPricingSummaryPanel {...defaultProps} />)

      expect(screen.getByText(/1 room/)).toBeInTheDocument()
    })

    it('displays multiple rooms count correctly', () => {
      const multiRoomProps = {
        ...defaultProps,
        roomBookings: [mockRoomBooking, { ...mockRoomBooking, id: 'room-2' }],
      }

      render(<MultiBookingPricingSummaryPanel {...multiRoomProps} />)

      expect(screen.getByText(/2 rooms/)).toBeInTheDocument()
    })

    it('renders room information correctly', () => {
      render(<MultiBookingPricingSummaryPanel {...defaultProps} />)

      expect(screen.getAllByText('Deluxe Suite')).toHaveLength(2) // Header and room content
      expect(screen.getByText(/Room 101/)).toBeInTheDocument()
      expect(screen.getByText(/John Doe/)).toBeInTheDocument()
    })

    it('displays room total correctly', () => {
      render(<MultiBookingPricingSummaryPanel {...defaultProps} />)

      // Total should be 150 + 25 + 15 = 190 - check all occurrences
      expect(screen.getAllByText('€190.00')).toHaveLength(3) // accordion header, room total, overall total
    })
  })

  describe('Accordion Behavior', () => {
    it('first room is expanded by default', () => {
      render(<MultiBookingPricingSummaryPanel {...defaultProps} />)

      // Should show expanded content
      expect(screen.getByText('Selected Room')).toBeInTheDocument()
      expect(screen.getByText('Upgrades')).toBeInTheDocument()
      expect(screen.getByText('Special Offers')).toBeInTheDocument()
    })

    it('toggles accordion when clicked', () => {
      render(<MultiBookingPricingSummaryPanel {...defaultProps} />)

      // Find and click the accordion trigger
      const accordionTrigger = screen.getByRole('button', { name: /deluxe suite.*collapse/i })

      fireEvent.click(accordionTrigger)

      // Content should be hidden after click
      expect(screen.queryByText('Selected Room')).not.toBeInTheDocument()
    })
  })

  describe('Item Management', () => {
    it('displays room items correctly', () => {
      render(<MultiBookingPricingSummaryPanel {...defaultProps} />)

      expect(screen.getAllByText('Deluxe Suite')).toHaveLength(2) // Header and content
      expect(screen.getByText('Sea View')).toBeInTheDocument()
      expect(screen.getByText('Breakfast Package')).toBeInTheDocument()
    })

    it('calls onRemoveItem when remove button is clicked', async () => {
      const onRemoveItem = vi.fn()
      render(<MultiBookingPricingSummaryPanel {...defaultProps} onRemoveItem={onRemoveItem} />)

      // Find remove buttons (X buttons) - should have aria-label
      const removeButtons = screen.getAllByRole('button', { name: /remove.*sea view/i })

      expect(removeButtons.length).toBeGreaterThan(0)

      await act(async () => {
        fireEvent.click(removeButtons[0])
      })

      await waitFor(
        () => {
          expect(onRemoveItem).toHaveBeenCalled()
        },
        { timeout: 1000 }
      )
    })

    it('prevents removal of room items', async () => {
      render(<MultiBookingPricingSummaryPanel {...defaultProps} />)

      // Try to remove a room item - should show error toast
      // This test would need more specific implementation based on the actual UI
    })

    it('shows empty state messages when no upgrades/offers', () => {
      const roomWithoutUpgrades = {
        ...mockRoomBooking,
        items: [
          {
            id: 'room-base',
            name: 'Deluxe Suite',
            price: 150,
            type: 'room' as const,
            category: 'accommodation',
          },
        ],
      }

      render(<MultiBookingPricingSummaryPanel {...defaultProps} roomBookings={[roomWithoutUpgrades]} />)

      expect(screen.getByText('No upgrades selected')).toBeInTheDocument()
      expect(screen.getByText('No offers selected')).toBeInTheDocument()
    })
  })

  describe('Currency Formatting', () => {
    it('formats currency correctly with locale', () => {
      render(<MultiBookingPricingSummaryPanel {...defaultProps} />)

      // Should use Intl.NumberFormat with EUR currency - check that at least one exists
      const currencyElements = screen.getAllByText(/€190\.00/)
      expect(currencyElements.length).toBeGreaterThan(0)
    })

    it('falls back to euro suffix when currency formatting fails', () => {
      const propsWithInvalidLocale = {
        ...defaultProps,
        currency: 'INVALID',
        locale: 'invalid-locale',
      }

      render(<MultiBookingPricingSummaryPanel {...propsWithInvalidLocale} />)

      // Should fallback to euro suffix format when currency/locale is invalid
      const euroElements = screen.getAllByText(/€190\.00/)
      expect(euroElements.length).toBeGreaterThan(0)
    })

    it('uses euro suffix when no currency/locale provided', () => {
      const propsWithoutCurrency = {
        ...defaultProps,
        currency: undefined,
        locale: undefined,
      }

      render(<MultiBookingPricingSummaryPanel {...propsWithoutCurrency} />)

      const currencyElements = screen.getAllByText(/€190\.00/)
      expect(currencyElements.length).toBeGreaterThan(0)
    })
  })

  describe('Confirm All Functionality', () => {
    it('calls onConfirmAll when confirm button is clicked', async () => {
      const onConfirmAll = vi.fn()
      render(<MultiBookingPricingSummaryPanel {...defaultProps} onConfirmAll={onConfirmAll} />)

      // Find the confirm button by text content
      const buttons = screen.getAllByRole('button')
      const confirmButton = buttons.find((button) => button.textContent?.includes('Confirm All'))
      expect(confirmButton).toBeDefined()

      await act(async () => {
        if (confirmButton) {
          fireEvent.click(confirmButton)
        }
      })

      expect(onConfirmAll).toHaveBeenCalled()
    })

    it('shows loading state during confirmation', async () => {
      const onConfirmAll = vi.fn(() => new Promise<void>((resolve) => setTimeout(resolve, 100)))
      render(<MultiBookingPricingSummaryPanel {...defaultProps} onConfirmAll={onConfirmAll} />)

      // Find the confirm button by text content
      const buttons = screen.getAllByRole('button')
      const confirmButton = buttons.find((button) => button.textContent?.includes('Confirm All'))
      expect(confirmButton).toBeDefined()

      await act(async () => {
        if (confirmButton) {
          fireEvent.click(confirmButton)
        }
      })

      expect(screen.getByText('Confirming...')).toBeInTheDocument()

      await waitFor(() => {
        expect(screen.queryByText('Confirming...')).not.toBeInTheDocument()
      })
    })

    it('is disabled when isLoading prop is true', () => {
      render(<MultiBookingPricingSummaryPanel {...defaultProps} isLoading={true} />)

      // Button should be disabled and show loading state
      const buttons = screen.getAllByRole('button')
      const confirmButton = buttons.find(
        (button) =>
          button.textContent?.includes('Confirm All') ||
          button.textContent?.includes('Confirming') ||
          (button as HTMLButtonElement).disabled
      )
      expect(confirmButton).toBeDisabled()
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<MultiBookingPricingSummaryPanel {...defaultProps} />)

      // Check for accessible button labels
      expect(screen.getByRole('button', { name: /confirm all/i })).toBeInTheDocument()
    })

    it('renders images with alt text', () => {
      render(<MultiBookingPricingSummaryPanel {...defaultProps} />)

      const roomImage = screen.getByAltText('Room image')
      expect(roomImage).toBeInTheDocument()
      expect(roomImage).toHaveAttribute('src', '/test-room.jpg')
    })

    it('uses fallback image when no room image provided', () => {
      const roomWithoutImage = {
        ...mockRoomBooking,
        roomImage: undefined,
      }

      render(<MultiBookingPricingSummaryPanel {...defaultProps} roomBookings={[roomWithoutImage]} />)

      const roomImage = screen.getByAltText('Room image')
      expect(roomImage).toHaveAttribute('src', '/hotel-room.png')
    })
  })

  describe('Multiple Rooms', () => {
    it('handles multiple room bookings correctly', () => {
      const room2 = {
        ...mockRoomBooking,
        id: 'room-2',
        roomName: 'Standard Room',
        roomNumber: '102',
        guestName: 'Jane Smith',
      }

      const multiRoomProps = {
        ...defaultProps,
        roomBookings: [mockRoomBooking, room2],
      }

      render(<MultiBookingPricingSummaryPanel {...multiRoomProps} />)

      expect(screen.getAllByText('Deluxe Suite')).toHaveLength(2) // Header and content for first room
      expect(screen.getByText('Standard Room')).toBeInTheDocument()
      expect(screen.getByText(/Room 101/)).toBeInTheDocument()
      expect(screen.getByText(/Room 102/)).toBeInTheDocument()
    })

    it('calculates total correctly for multiple rooms', () => {
      const room2 = {
        ...mockRoomBooking,
        id: 'room-2',
        items: [
          {
            id: 'room-2-base',
            name: 'Standard Room',
            price: 100,
            type: 'room' as const,
            category: 'accommodation',
          },
        ],
      }

      const multiRoomProps = {
        ...defaultProps,
        roomBookings: [mockRoomBooking, room2],
      }

      render(<MultiBookingPricingSummaryPanel {...multiRoomProps} />)

      // Total should be (150 + 25 + 15) + 100 = 290 - check the overall total specifically
      const totalElements = screen.getAllByText('€290.00')
      expect(totalElements.length).toBeGreaterThan(0)
    })
  })

  describe('Error Handling', () => {
    it('handles empty room bookings array', () => {
      render(<MultiBookingPricingSummaryPanel {...defaultProps} roomBookings={[]} />)

      expect(screen.getByText('Multi-Room Bookings')).toBeInTheDocument()
      expect(screen.getByText(/0 rooms/)).toBeInTheDocument()
    })

    it('handles room booking without items', () => {
      const roomWithoutItems = {
        ...mockRoomBooking,
        items: [],
      }

      render(<MultiBookingPricingSummaryPanel {...defaultProps} roomBookings={[roomWithoutItems]} />)

      const zeroElements = screen.getAllByText('€0.00')
      expect(zeroElements.length).toBeGreaterThan(0)
    })
  })
})
