import { act, renderHook } from '@testing-library/react'
import { vi } from 'vitest'
import { mockRoomOptions } from '@/__tests__/helpers/mockData'
import { useCarouselState } from '../../hooks/useCarouselState'

// Mock CarouselApi
const _mockCarouselApi = {
  scrollSnapList: vi.fn(() => [0, 1, 2]),
  selectedScrollSnap: vi.fn(() => 0),
  scrollTo: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
  destroy: vi.fn(),
}

describe('useCarouselState', () => {
  const defaultParams = {
    roomOptions: mockRoomOptions,
    initialSelectedRoom: null,
    onRoomSelected: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Initialization', () => {
    it('initializes with correct default state', () => {
      const { result } = renderHook(() => useCarouselState(defaultParams))

      expect(result.current.selectedRoom).toBe(null)
      expect(result.current.current).toBe(0)
      expect(result.current.count).toBe(0)
      expect(result.current.roomCarouselApi).toBeUndefined()
    })

    it('initializes with provided selectedRoom', () => {
      const { result } = renderHook(() =>
        useCarouselState({
          ...defaultParams,
          initialSelectedRoom: mockRoomOptions[0],
        })
      )

      expect(result.current.selectedRoom).toBe(mockRoomOptions[0])
    })

    it('initializes image indices correctly', () => {
      const { result } = renderHook(() => useCarouselState(defaultParams))

      // Should have indices for all rooms initialized to 0
      expect(result.current.activeImageIndices).toEqual({
        0: 0,
        1: 0,
        2: 0,
        3: 0,
      })
    })
  })

  describe('Room Selection', () => {
    it('handles room selection correctly', () => {
      const mockOnRoomSelected = vi.fn()
      const { result } = renderHook(() =>
        useCarouselState({
          ...defaultParams,
          onRoomSelected: mockOnRoomSelected,
        })
      )

      act(() => {
        result.current.handleRoomSelection(mockRoomOptions[0])
      })

      expect(mockOnRoomSelected).toHaveBeenCalledWith(mockRoomOptions[0])
      expect(result.current.selectedRoom).toBe(mockRoomOptions[0])
    })

    it('handles deselection (null selection)', () => {
      const mockOnRoomSelected = vi.fn()
      const { result } = renderHook(() =>
        useCarouselState({
          ...defaultParams,
          initialSelectedRoom: mockRoomOptions[0],
          onRoomSelected: mockOnRoomSelected,
        })
      )

      act(() => {
        result.current.handleRoomSelection(null)
      })

      expect(mockOnRoomSelected).toHaveBeenCalledWith(null)
      expect(result.current.selectedRoom).toBe(null)
    })
  })

  describe('Image Management', () => {
    it('handles image index changes', () => {
      const { result } = renderHook(() => useCarouselState(defaultParams))

      act(() => {
        result.current.handleImageChange(0, 2)
      })

      expect(result.current.activeImageIndices[0]).toBe(2)
    })

    it('prevents unnecessary updates for same image index', () => {
      const { result } = renderHook(() => useCarouselState(defaultParams))

      // Set initial image index
      act(() => {
        result.current.handleImageChange(0, 1)
      })

      const initialIndices = result.current.activeImageIndices

      // Try to set the same index again
      act(() => {
        result.current.handleImageChange(0, 1)
      })

      // Should be the same object reference (no re-render)
      expect(result.current.activeImageIndices).toBe(initialIndices)
    })

    it('handles multiple room image indices independently', () => {
      const { result } = renderHook(() => useCarouselState(defaultParams))

      act(() => {
        result.current.handleImageChange(0, 2)
        result.current.handleImageChange(1, 3)
        result.current.handleImageChange(2, 1)
      })

      expect(result.current.activeImageIndices).toEqual({
        0: 2,
        1: 3,
        2: 1,
        3: 0, // Unchanged
      })
    })
  })

  describe('Carousel API Integration', () => {
    it('provides carousel API setter', () => {
      const { result } = renderHook(() => useCarouselState(defaultParams))

      // Should provide the setter function (integration point)
      expect(typeof result.current.setRoomCarouselApi).toBe('function')
    })

    it('initializes basic state', () => {
      const { result } = renderHook(() => useCarouselState(defaultParams))

      // Should have initial state values (our component logic, not Embla internals)
      expect(result.current.current).toBe(0)
      expect(result.current.count).toBe(0)
      expect(result.current.selectedRoom).toBeNull()
    })
  })

  describe('Multi-booking Context', () => {
    it('selects room based on contextRoomId and roomSpecificSelections', () => {
      const contextRoomId = 'room-context-1'
      const roomSpecificSelections = {
        'room-context-1': mockRoomOptions[1].id,
      }

      const { result } = renderHook(() =>
        useCarouselState({
          ...defaultParams,
          contextRoomId,
          roomSpecificSelections,
        })
      )

      expect(result.current.selectedRoom).toBe(mockRoomOptions[1])
    })

    it('falls back to initialSelectedRoom when no context match', () => {
      const contextRoomId = 'room-context-1'
      const roomSpecificSelections = {
        'room-context-2': mockRoomOptions[1].id, // Different context
      }

      const { result } = renderHook(() =>
        useCarouselState({
          ...defaultParams,
          initialSelectedRoom: mockRoomOptions[2],
          contextRoomId,
          roomSpecificSelections,
        })
      )

      expect(result.current.selectedRoom).toBe(mockRoomOptions[2])
    })

    it('updates selection when context changes', () => {
      const { result, rerender } = renderHook((props) => useCarouselState(props), {
        initialProps: {
          ...defaultParams,
          contextRoomId: 'room-context-1',
          roomSpecificSelections: {
            'room-context-1': mockRoomOptions[0].id,
          },
        },
      })

      expect(result.current.selectedRoom).toBe(mockRoomOptions[0])

      // Change context
      const newSelections = {
        'room-context-1': mockRoomOptions[0].id,
        'room-context-2': mockRoomOptions[1].id,
      }
      rerender({
        ...defaultParams,
        contextRoomId: 'room-context-2',
        roomSpecificSelections: newSelections,
      })

      expect(result.current.selectedRoom).toBe(mockRoomOptions[1])
    })
  })

  describe('Error Handling', () => {
    it('handles missing room in roomSpecificSelections gracefully', () => {
      const contextRoomId = 'room-context-1'
      const roomSpecificSelections = {
        'room-context-1': 'non-existent-room-id',
      }

      const { result } = renderHook(() =>
        useCarouselState({
          ...defaultParams,
          contextRoomId,
          roomSpecificSelections,
        })
      )

      expect(result.current.selectedRoom).toBe(null)
    })

    it('handles empty roomOptions array', () => {
      const { result } = renderHook(() =>
        useCarouselState({
          ...defaultParams,
          roomOptions: [],
        })
      )

      expect(result.current.activeImageIndices).toEqual({})
      expect(result.current.selectedRoom).toBe(null)
    })
  })
})
