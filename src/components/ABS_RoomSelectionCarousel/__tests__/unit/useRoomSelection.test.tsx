import { renderHook, act } from '@testing-library/react'
import { vi } from 'vitest'
import { useRoomSelection } from '../../hooks/useRoomSelection'
import type { RoomOption } from '../../types'

const mockRoom: RoomOption = {
  id: '1',
  name: 'Standard Room',
  description: 'A comfortable standard room',
  amenities: ['WiFi', 'TV'],
  price: 100,
  images: ['image1.jpg'],
}

const anotherMockRoom: RoomOption = {
  id: '2',
  name: 'Deluxe Room',
  description: 'A luxurious deluxe room',
  amenities: ['WiFi', 'TV', 'Minibar'],
  price: 150,
  images: ['image2.jpg'],
}

describe('useRoomSelection', () => {
  describe('initialization', () => {
    it('should initialize with null when no initial room provided', () => {
      const { result } = renderHook(() => useRoomSelection({}))

      expect(result.current.selectedRoom).toBeNull()
    })

    it('should initialize with provided initial room', () => {
      const { result } = renderHook(() =>
        useRoomSelection({
          initialSelectedRoom: mockRoom,
        })
      )

      expect(result.current.selectedRoom).toBe(mockRoom)
    })
  })

  describe('room selection', () => {
    it('should update selected room when selectRoom is called', () => {
      const { result } = renderHook(() => useRoomSelection({}))

      act(() => {
        result.current.selectRoom(mockRoom)
      })

      expect(result.current.selectedRoom).toBe(mockRoom)
    })

    it('should call onRoomSelected callback when provided', () => {
      const mockOnRoomSelected = vi.fn()
      const { result } = renderHook(() =>
        useRoomSelection({
          onRoomSelected: mockOnRoomSelected,
        })
      )

      act(() => {
        result.current.selectRoom(mockRoom)
      })

      expect(mockOnRoomSelected).toHaveBeenCalledWith(mockRoom)
      expect(mockOnRoomSelected).toHaveBeenCalledTimes(1)
    })

    it('should not call onRoomSelected when not provided', () => {
      const { result } = renderHook(() => useRoomSelection({}))

      // This should not throw an error
      expect(() => {
        act(() => {
          result.current.selectRoom(mockRoom)
        })
      }).not.toThrow()

      expect(result.current.selectedRoom).toBe(mockRoom)
    })

    it('should allow changing selected room', () => {
      const mockOnRoomSelected = vi.fn()
      const { result } = renderHook(() =>
        useRoomSelection({
          initialSelectedRoom: mockRoom,
          onRoomSelected: mockOnRoomSelected,
        })
      )

      // Initial room should be set
      expect(result.current.selectedRoom).toBe(mockRoom)

      // Select a different room
      act(() => {
        result.current.selectRoom(anotherMockRoom)
      })

      expect(result.current.selectedRoom).toBe(anotherMockRoom)
      expect(mockOnRoomSelected).toHaveBeenCalledWith(anotherMockRoom)
      expect(mockOnRoomSelected).toHaveBeenCalledTimes(1)
    })

    it('should handle selecting the same room multiple times', () => {
      const mockOnRoomSelected = vi.fn()
      const { result } = renderHook(() =>
        useRoomSelection({
          onRoomSelected: mockOnRoomSelected,
        })
      )

      // Select room twice
      act(() => {
        result.current.selectRoom(mockRoom)
      })
      act(() => {
        result.current.selectRoom(mockRoom)
      })

      expect(result.current.selectedRoom).toBe(mockRoom)
      expect(mockOnRoomSelected).toHaveBeenCalledWith(mockRoom)
      expect(mockOnRoomSelected).toHaveBeenCalledTimes(2)
    })
  })

  describe('integration scenarios', () => {
    it('should maintain state correctly across multiple operations', () => {
      const mockOnRoomSelected = vi.fn()
      const { result } = renderHook(() =>
        useRoomSelection({
          initialSelectedRoom: mockRoom,
          onRoomSelected: mockOnRoomSelected,
        })
      )

      // Verify initial state
      expect(result.current.selectedRoom).toBe(mockRoom)
      expect(mockOnRoomSelected).not.toHaveBeenCalled()

      // Select different room
      act(() => {
        result.current.selectRoom(anotherMockRoom)
      })

      expect(result.current.selectedRoom).toBe(anotherMockRoom)
      expect(mockOnRoomSelected).toHaveBeenCalledWith(anotherMockRoom)

      // Select back to original room
      act(() => {
        result.current.selectRoom(mockRoom)
      })

      expect(result.current.selectedRoom).toBe(mockRoom)
      expect(mockOnRoomSelected).toHaveBeenCalledWith(mockRoom)
      expect(mockOnRoomSelected).toHaveBeenCalledTimes(2)
    })
  })
})
