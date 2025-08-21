import { useState, useCallback, useEffect } from 'react'
import type { CarouselApi } from '@/components/ui/carousel'
import type { RoomOption } from '../types'

interface UseCarouselStateParams {
  roomOptions: RoomOption[]
  initialSelectedRoom: RoomOption | null
  onRoomSelected?: (room: RoomOption | null) => void
}

export const useCarouselState = ({
  roomOptions,
  initialSelectedRoom,
  onRoomSelected,
}: UseCarouselStateParams) => {
  // Local state for room selection and image indices
  const [selectedRoom, setSelectedRoom] = useState<RoomOption | null>(initialSelectedRoom)
  const [activeImageIndices, setActiveImageIndices] = useState<Record<number, number>>(() => {
    const indices: Record<number, number> = {}
    roomOptions.forEach((_, index) => {
      indices[index] = 0
    })
    return indices
  })

  // Carousel API for controlling room navigation
  const [roomCarouselApi, setRoomCarouselApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  // Make room carousel API available to child components if needed
  useEffect(() => {
    if (roomCarouselApi) {
      // Store reference for potential child access
      ; (window as any).roomCarouselApi = roomCarouselApi
    }
    return () => {
      delete (window as any).roomCarouselApi
    }
  }, [roomCarouselApi])

  // Handle carousel events for dots
  useEffect(() => {
    if (!roomCarouselApi) {
      return
    }

    setCount(roomCarouselApi.scrollSnapList().length)
    setCurrent(roomCarouselApi.selectedScrollSnap() + 1)

    roomCarouselApi.on('select', () => {
      setCurrent(roomCarouselApi.selectedScrollSnap() + 1)
    })
  }, [roomCarouselApi])

  // Handle room selection
  const handleRoomSelection = useCallback((room: RoomOption | null) => {
    setSelectedRoom(room)
    onRoomSelected?.(room)
  }, [onRoomSelected])

  // Handle image index changes with basic debouncing
  const handleImageChange = useCallback((roomIndex: number, imageIndex: number) => {
    setActiveImageIndices(prev => {
      // Only update if the value actually changed
      if (prev[roomIndex] === imageIndex) {
        return prev
      }
      return {
        ...prev,
        [roomIndex]: imageIndex
      }
    })
  }, [])

  return {
    selectedRoom,
    activeImageIndices,
    roomCarouselApi,
    current,
    count,
    setRoomCarouselApi,
    handleRoomSelection,
    handleImageChange,
  }
}