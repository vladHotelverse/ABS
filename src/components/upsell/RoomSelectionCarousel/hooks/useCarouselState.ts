import { useCallback, useEffect, useState } from 'react'
import type { CarouselApi } from '@/components/ui/carousel'
import type { RoomOption } from '../types'

interface UseCarouselStateParams {
  roomOptions: RoomOption[]
  initialSelectedRoom: RoomOption | null
  onRoomSelected?: (room: RoomOption | null) => void
}

interface UseCarouselStateReturn {
  selectedRoom: RoomOption | null
  activeImageIndices: Record<number, number>
  roomCarouselApi: CarouselApi | undefined
  current: number
  count: number
  setRoomCarouselApi: (api: CarouselApi) => void
  handleRoomSelection: (room: RoomOption | null) => void
  handleImageChange: (roomIndex: number, imageIndex: number) => void
}

export const useCarouselState = ({
  roomOptions,
  initialSelectedRoom,
  onRoomSelected,
}: UseCarouselStateParams): UseCarouselStateReturn => {
  // Simple selected room state
  const [selectedRoom, setSelectedRoom] = useState<RoomOption | null>(initialSelectedRoom)

  // Carousel API for controlling room navigation
  const [roomCarouselApi, setRoomCarouselApiState] = useState<CarouselApi>()

  // Update when initialSelectedRoom changes
  useEffect(() => {
    if (initialSelectedRoom?.id !== selectedRoom?.id) {
      setSelectedRoom(initialSelectedRoom)
    }
  }, [initialSelectedRoom, selectedRoom?.id])

  // Auto-center carousel when selected room changes (e.g., tab switch in multi-booking)
  useEffect(() => {
    if (!roomCarouselApi || !selectedRoom || roomOptions.length <= 2) {
      return
    }

    const roomIndex = roomOptions.findIndex((room) => room.id === selectedRoom.id)
    const currentIndex = roomCarouselApi.selectedScrollSnap()

    if (roomIndex !== -1 && roomIndex !== currentIndex) {
      // Auto-center without animation when selection changes externally
      roomCarouselApi.scrollTo(roomIndex, true)
    }
  }, [selectedRoom?.id, roomCarouselApi, roomOptions])

  const [activeImageIndices, setActiveImageIndices] = useState<Record<number, number>>(() => {
    const indices: Record<number, number> = {}
    roomOptions.forEach((_, index) => {
      indices[index] = 0
    })
    return indices
  })
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  // Memoize setRoomCarouselApi to prevent infinite loops
  const setRoomCarouselApi = useCallback((api: CarouselApi) => {
    setRoomCarouselApiState(api)
  }, [])

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
  const handleRoomSelection = useCallback(
    (room: RoomOption | null) => {
      setSelectedRoom(room)
      onRoomSelected?.(room)
    },
    [onRoomSelected]
  )

  // Handle image index changes with basic debouncing
  const handleImageChange = useCallback((roomIndex: number, imageIndex: number) => {
    setActiveImageIndices((prev) => {
      // Only update if the value actually changed
      if (prev[roomIndex] === imageIndex) {
        return prev
      }
      return {
        ...prev,
        [roomIndex]: imageIndex,
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
