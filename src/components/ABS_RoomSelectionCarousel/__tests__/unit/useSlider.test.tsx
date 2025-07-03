import { renderHook, act } from '@testing-library/react'
import { vi } from 'vitest'
import { useSlider } from '../../hooks/useSlider'
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

describe('useSlider', () => {
  describe('initialization', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() =>
        useSlider({
          roomOptions: mockRoomOptions,
          activeIndex: 1,
          minPrice: 50,
        })
      )

      expect(result.current.proposedPrice).toBe(100) // (50 + 150) / 2
      expect(result.current.maxPrice).toBe(150) // Price of active room (index 1)
    })

    it('should calculate max price based on active room', () => {
      const { result } = renderHook(() =>
        useSlider({
          roomOptions: mockRoomOptions,
          activeIndex: 2,
          minPrice: 50,
        })
      )

      expect(result.current.maxPrice).toBe(200) // Price of room at index 2
    })

    it('should handle different min prices', () => {
      const { result } = renderHook(() =>
        useSlider({
          roomOptions: mockRoomOptions,
          activeIndex: 1,
          minPrice: 75,
        })
      )

      expect(result.current.proposedPrice).toBe(113) // Math.round((75 + 150) / 2)
    })
  })

  describe('price management', () => {
    it('should set proposed price', () => {
      const { result } = renderHook(() =>
        useSlider({
          roomOptions: mockRoomOptions,
          activeIndex: 1,
          minPrice: 50,
        })
      )

      act(() => {
        result.current.setProposedPrice(120)
      })

      expect(result.current.proposedPrice).toBe(120)
    })

    it('should update proposed price when active index changes', () => {
      const { result, rerender } = renderHook(
        ({ activeIndex }) =>
          useSlider({
            roomOptions: mockRoomOptions,
            activeIndex,
            minPrice: 50,
          }),
        {
          initialProps: { activeIndex: 1 },
        }
      )

      expect(result.current.proposedPrice).toBe(100) // (50 + 150) / 2

      // Change active index to room with price 200
      rerender({ activeIndex: 2 })

      expect(result.current.proposedPrice).toBe(125) // (50 + 200) / 2
      expect(result.current.maxPrice).toBe(200)
    })

    it('should recalculate price when room options change', () => {
      const newRoomOptions = [
        ...mockRoomOptions.slice(0, 2),
        {
          id: '3',
          name: 'Premium Suite',
          description: 'An ultra-luxury suite',
          amenities: ['WiFi', 'TV', 'Minibar', 'Jacuzzi', 'Butler'],
          price: 300,
          images: ['image3.jpg'],
        },
      ]

      const { result, rerender } = renderHook(
        ({ roomOptions }) =>
          useSlider({
            roomOptions,
            activeIndex: 2,
            minPrice: 50,
          }),
        {
          initialProps: { roomOptions: mockRoomOptions },
        }
      )

      expect(result.current.proposedPrice).toBe(125) // (50 + 200) / 2

      // Change room options
      rerender({ roomOptions: newRoomOptions })

      expect(result.current.proposedPrice).toBe(175) // (50 + 300) / 2
      expect(result.current.maxPrice).toBe(300)
    })
  })

  describe('make offer functionality', () => {
    it('should call onMakeOffer when provided', () => {
      const onMakeOffer = vi.fn()
      const { result } = renderHook(() =>
        useSlider({
          roomOptions: mockRoomOptions,
          activeIndex: 1,
          minPrice: 50,
          onMakeOffer,
        })
      )

      act(() => {
        result.current.makeOffer()
      })

      expect(onMakeOffer).toHaveBeenCalledWith(100, mockRoomOptions[1])
    })

    it('should show alert when onMakeOffer is not provided', () => {
      const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => {})

      const { result } = renderHook(() =>
        useSlider({
          roomOptions: mockRoomOptions,
          activeIndex: 1,
          minPrice: 50,
        })
      )

      act(() => {
        result.current.makeOffer()
      })

      expect(mockAlert).toHaveBeenCalledWith('Has propuesto 100 EUR por noche')

      mockAlert.mockRestore()
    })

    it('should use custom offer text when provided', () => {
      const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => {})

      const { result } = renderHook(() =>
        useSlider({
          roomOptions: mockRoomOptions,
          activeIndex: 1,
          minPrice: 50,
          offerMadeText: 'You have offered {price} dollars per night',
        })
      )

      act(() => {
        result.current.makeOffer()
      })

      expect(mockAlert).toHaveBeenCalledWith('You have offered 100 dollars per night')

      mockAlert.mockRestore()
    })

    it('should handle different proposed prices in offer', () => {
      const onMakeOffer = vi.fn()
      const { result } = renderHook(() =>
        useSlider({
          roomOptions: mockRoomOptions,
          activeIndex: 1,
          minPrice: 50,
          onMakeOffer,
        })
      )

      // Change proposed price
      act(() => {
        result.current.setProposedPrice(130)
      })

      act(() => {
        result.current.makeOffer()
      })

      expect(onMakeOffer).toHaveBeenCalledWith(130, mockRoomOptions[1])
    })
  })

  describe('edge cases', () => {
    it('should handle empty room options gracefully', () => {
      const { result } = renderHook(() =>
        useSlider({
          roomOptions: [],
          activeIndex: 0,
          minPrice: 50,
        })
      )

      expect(result.current.maxPrice).toBe(20) // Default fallback value
      expect(result.current.proposedPrice).toBe(35) // (50 + 20) / 2
    })

    it('should handle invalid active index', () => {
      const { result } = renderHook(() =>
        useSlider({
          roomOptions: mockRoomOptions,
          activeIndex: 10, // Invalid index
          minPrice: 50,
        })
      )

      expect(result.current.maxPrice).toBe(20) // Default fallback value
    })

    it('should handle very low min price', () => {
      const { result } = renderHook(() =>
        useSlider({
          roomOptions: mockRoomOptions,
          activeIndex: 1,
          minPrice: 1,
        })
      )

      expect(result.current.proposedPrice).toBe(76) // Math.round((1 + 150) / 2)
    })

    it('should handle min price higher than room price', () => {
      const { result } = renderHook(() =>
        useSlider({
          roomOptions: mockRoomOptions,
          activeIndex: 0, // Room with price 100
          minPrice: 200, // Higher than room price
        })
      )

      expect(result.current.proposedPrice).toBe(150) // Math.round((200 + 100) / 2)
    })
  })
})
