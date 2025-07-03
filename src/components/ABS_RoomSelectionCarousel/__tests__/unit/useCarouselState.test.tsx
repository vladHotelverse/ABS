import { renderHook, act } from '@testing-library/react'
import { vi } from 'vitest'
import { useCarouselState } from '../../hooks/useCarouselState'
import type { RoomOption } from '../../types'

const mockRoomOptions: RoomOption[] = [
  {
    id: '1',
    name: 'Standard Room',
    description: 'A comfortable standard room',
    amenities: ['WiFi', 'TV'],
    price: 100,
    images: ['image1.jpg'],
  },
  {
    id: '2',
    name: 'Deluxe Room',
    description: 'A luxurious deluxe room',
    amenities: ['WiFi', 'TV', 'Minibar'],
    price: 150,
    images: ['image2.jpg'],
  },
  {
    id: '3',
    name: 'Suite',
    description: 'A spacious suite',
    amenities: ['WiFi', 'TV', 'Minibar', 'Jacuzzi'],
    price: 200,
    images: ['image3.jpg'],
  },
]

describe('useCarouselState', () => {
  describe('initialization', () => {
    it('should initialize with correct default state', () => {
      const { result } = renderHook(() =>
        useCarouselState({
          roomOptions: mockRoomOptions,
        })
      )

      expect(result.current.state.activeIndex).toBe(1) // Middle room for 3 rooms
      expect(result.current.state.selectedRoom).toBeNull()
      expect(result.current.state.activeImageIndices).toEqual({ 0: 0, 1: 0, 2: 0 })
    })

    it('should initialize with selected room when provided', () => {
      const { result } = renderHook(() =>
        useCarouselState({
          roomOptions: mockRoomOptions,
          initialSelectedRoom: mockRoomOptions[0],
        })
      )

      expect(result.current.state.selectedRoom).toEqual(mockRoomOptions[0])
    })

    it('should handle single room correctly', () => {
      const { result } = renderHook(() =>
        useCarouselState({
          roomOptions: [mockRoomOptions[0]],
        })
      )

      expect(result.current.state.activeIndex).toBe(0)
    })

    it('should handle two rooms correctly', () => {
      const { result } = renderHook(() =>
        useCarouselState({
          roomOptions: mockRoomOptions.slice(0, 2),
        })
      )

      expect(result.current.state.activeIndex).toBe(0)
    })
  })

  describe('carousel navigation', () => {
    it('should navigate to next slide', () => {
      const { result } = renderHook(() =>
        useCarouselState({
          roomOptions: mockRoomOptions,
        })
      )

      act(() => {
        result.current.actions.nextSlide()
      })

      expect(result.current.state.activeIndex).toBe(2)
    })

    it('should navigate to previous slide', () => {
      const { result } = renderHook(() =>
        useCarouselState({
          roomOptions: mockRoomOptions,
        })
      )

      act(() => {
        result.current.actions.prevSlide()
      })

      expect(result.current.state.activeIndex).toBe(0)
    })

    it('should wrap around when going past last room', () => {
      const { result } = renderHook(() =>
        useCarouselState({
          roomOptions: mockRoomOptions,
        })
      )

      // Start at index 1, go to 2, then should wrap to 0
      act(() => {
        result.current.actions.nextSlide()
      })

      act(() => {
        result.current.actions.nextSlide()
      })

      expect(result.current.state.activeIndex).toBe(0)
    })

    it('should wrap around when going before first room', () => {
      const { result } = renderHook(() =>
        useCarouselState({
          roomOptions: mockRoomOptions,
        })
      )

      // Start at index 1, go to 0, then should wrap to 2
      act(() => {
        result.current.actions.prevSlide()
      })

      act(() => {
        result.current.actions.prevSlide()
      })

      expect(result.current.state.activeIndex).toBe(2)
    })

    it('should set active index directly', () => {
      const { result } = renderHook(() =>
        useCarouselState({
          roomOptions: mockRoomOptions,
        })
      )

      act(() => {
        result.current.actions.setActiveIndex(2)
      })

      expect(result.current.state.activeIndex).toBe(2)
    })
  })

  describe('image navigation', () => {
    it('should navigate to next image', () => {
      const { result } = renderHook(() =>
        useCarouselState({
          roomOptions: mockRoomOptions,
        })
      )

      act(() => {
        result.current.actions.nextImage(0, 3)
      })

      expect(result.current.state.activeImageIndices[0]).toBe(1)
    })

    it('should navigate to previous image', () => {
      const { result } = renderHook(() =>
        useCarouselState({
          roomOptions: mockRoomOptions,
        })
      )

      act(() => {
        result.current.actions.prevImage(0, 3)
      })

      expect(result.current.state.activeImageIndices[0]).toBe(2) // Wrapped around
    })

    it('should set active image index directly', () => {
      const { result } = renderHook(() =>
        useCarouselState({
          roomOptions: mockRoomOptions,
        })
      )

      act(() => {
        result.current.actions.setActiveImageIndex(0, 2)
      })

      expect(result.current.state.activeImageIndices[0]).toBe(2)
    })
  })

  describe('room selection', () => {
    it('should select a room', () => {
      const { result } = renderHook(() =>
        useCarouselState({
          roomOptions: mockRoomOptions,
        })
      )

      act(() => {
        result.current.actions.selectRoom(mockRoomOptions[1])
      })

      expect(result.current.state.selectedRoom).toEqual(mockRoomOptions[1])
    })

    it('should call onRoomSelected callback when provided', () => {
      const onRoomSelected = vi.fn()
      const { result } = renderHook(() =>
        useCarouselState({
          roomOptions: mockRoomOptions,
          onRoomSelected,
        })
      )

      act(() => {
        result.current.actions.selectRoom(mockRoomOptions[0])
      })

      expect(onRoomSelected).toHaveBeenCalledWith(mockRoomOptions[0])
    })
  })

  describe('state reset', () => {
    it('should reset state when room options change', () => {
      const { result, rerender } = renderHook(({ roomOptions }) => useCarouselState({ roomOptions }), {
        initialProps: { roomOptions: mockRoomOptions },
      })

      // Change active index from default
      act(() => {
        result.current.actions.setActiveIndex(2)
      })

      expect(result.current.state.activeIndex).toBe(2)

      // Change room options (should reset)
      rerender({ roomOptions: mockRoomOptions.slice(0, 2) })

      expect(result.current.state.activeIndex).toBe(0) // Should reset to default for 2 rooms
    })
  })
})
