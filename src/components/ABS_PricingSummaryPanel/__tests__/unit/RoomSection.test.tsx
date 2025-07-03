import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { render } from '../../../../__tests__/helpers'
import RoomSection from '../../components/RoomSection'
import type { PricingItem } from '../../types'
import { createMockPricingLabels, createMockPricingItem } from '../../../../__tests__/helpers'

const mockLabels = createMockPricingLabels()

describe('RoomSection', () => {
  const defaultProps = {
    labels: mockLabels,
    onRemoveItem: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render nothing when no room items', () => {
      render(<RoomSection {...defaultProps} roomItems={[]} />)

      expect(screen.queryByText(mockLabels.selectedRoomLabel)).not.toBeInTheDocument()
    })

    it('should render room section with items', () => {
      const roomItems: PricingItem[] = [
        createMockPricingItem({ id: 1, name: 'Standard Room', price: 100, type: 'room' }),
        createMockPricingItem({ id: 2, name: 'Ocean View', price: 50, type: 'room' }),
      ]

      render(<RoomSection {...defaultProps} roomItems={roomItems} />)

      expect(screen.getByText(mockLabels.selectedRoomLabel)).toBeInTheDocument()
      expect(screen.getByText('Standard Room')).toBeInTheDocument()
      expect(screen.getByText('Ocean View')).toBeInTheDocument()
    })

    it('should render remove buttons for each item', () => {
      const roomItems: PricingItem[] = [
        createMockPricingItem({ id: 1, name: 'Room 1', type: 'room' }),
        createMockPricingItem({ id: 2, name: 'Room 2', type: 'room' }),
      ]

      render(<RoomSection {...defaultProps} roomItems={roomItems} />)

      const removeButtons = screen.getAllByRole('button', { name: mockLabels.removeRoomUpgradeLabel })
      expect(removeButtons).toHaveLength(2)
    })
  })

  describe('Interactions', () => {
    it('should call onRemoveItem when remove button is clicked', () => {
      const roomItem = createMockPricingItem({ id: 1, name: 'Test Room', type: 'room' })
      const roomItems: PricingItem[] = [roomItem]

      render(<RoomSection {...defaultProps} roomItems={roomItems} />)

      const removeButton = screen.getByRole('button', { name: mockLabels.removeRoomUpgradeLabel })
      fireEvent.click(removeButton)

      expect(defaultProps.onRemoveItem).toHaveBeenCalledWith(roomItem)
    })

    it('should handle multiple item removals correctly', () => {
      const roomItems: PricingItem[] = [
        createMockPricingItem({ id: 1, name: 'Room 1', type: 'room' }),
        createMockPricingItem({ id: 2, name: 'Room 2', type: 'room' }),
      ]

      render(<RoomSection {...defaultProps} roomItems={roomItems} />)

      const removeButtons = screen.getAllByRole('button', { name: mockLabels.removeRoomUpgradeLabel })

      fireEvent.click(removeButtons[0])
      expect(defaultProps.onRemoveItem).toHaveBeenCalledWith(roomItems[0])

      fireEvent.click(removeButtons[1])
      expect(defaultProps.onRemoveItem).toHaveBeenCalledWith(roomItems[1])
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA structure', () => {
      const roomItems: PricingItem[] = [createMockPricingItem({ type: 'room' })]

      render(<RoomSection {...defaultProps} roomItems={roomItems} />)

      const section = screen.getByRole('region')
      expect(section).toHaveAttribute('aria-labelledby')

      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toBeInTheDocument()
    })

    it('should have proper heading hierarchy', () => {
      const roomItems: PricingItem[] = [createMockPricingItem({ type: 'room' })]

      render(<RoomSection {...defaultProps} roomItems={roomItems} />)

      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toHaveTextContent(mockLabels.selectedRoomLabel)
    })
  })

  describe('Edge Cases', () => {
    it('should handle missing item properties gracefully', () => {
      const roomItems: PricingItem[] = [{ id: 1, name: '', price: 0, type: 'room' } as PricingItem]

      render(<RoomSection {...defaultProps} roomItems={roomItems} />)

      expect(screen.getByText(mockLabels.selectedRoomLabel)).toBeInTheDocument()
    })

    it('should handle items with zero price', () => {
      const roomItems: PricingItem[] = [createMockPricingItem({ price: 0, type: 'room' })]

      render(<RoomSection {...defaultProps} roomItems={roomItems} />)

      // Should still render the section
      expect(screen.getByText(mockLabels.selectedRoomLabel)).toBeInTheDocument()
    })

    it('should handle remove callback errors gracefully', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      const roomItems: PricingItem[] = [createMockPricingItem({ type: 'room' })]

      const errorProps = {
        ...defaultProps,
        onRemoveItem: vi.fn(() => {
          throw new Error('Callback error')
        }),
      }

      render(<RoomSection {...errorProps} roomItems={roomItems} />)

      const removeButton = screen.getByRole('button', { name: mockLabels.removeRoomUpgradeLabel })

      // Should not crash the component and should log error
      expect(() => {
        fireEvent.click(removeButton)
      }).not.toThrow()

      expect(consoleError).toHaveBeenCalledWith('Error in remove item callback:', expect.any(Error))
      consoleError.mockRestore()
    })

    it('should handle items with special characters in names', () => {
      const roomItems: PricingItem[] = [createMockPricingItem({ name: 'Café & Suite', type: 'room' })]

      render(<RoomSection {...defaultProps} roomItems={roomItems} />)

      expect(screen.getByText('Café & Suite')).toBeInTheDocument()
    })

    it('should handle items with long names', () => {
      const roomItems: PricingItem[] = [
        createMockPricingItem({
          name: 'Premium Ocean View Suite with Balcony and All Amenities',
          type: 'room',
        }),
      ]

      render(<RoomSection {...defaultProps} roomItems={roomItems} />)

      expect(screen.getByText('Premium Ocean View Suite with Balcony and All Amenities')).toBeInTheDocument()
    })
  })
})
