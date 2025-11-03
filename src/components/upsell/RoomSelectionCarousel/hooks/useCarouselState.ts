import { useCallback, useEffect, useState } from 'react'
import type { CarouselApi } from '@/components/ui/carousel'
import type { RoomOption } from '../types'

interface UseCarouselStateParams {
  roomOptions: RoomOption[]
  initialSelectedRoom: RoomOption | null
  onRoomSelected?: (room: RoomOption | null) => void
  contextRoomId?: string
  roomSpecificSelections?: Record<string, string>
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
  contextRoomId,
  roomSpecificSelections,
}: UseCarouselStateParams): UseCarouselStateReturn => {
  // Function to determine selected room based on context
  const getSelectedRoomForContext = useCallback((): RoomOption | null => {
    if (contextRoomId && roomSpecificSelections?.[contextRoomId]) {
      const selectedRoomId = roomSpecificSelections[contextRoomId]
      return roomOptions.find((room) => room.id === selectedRoomId) || null
    }
    return initialSelectedRoom
  }, [contextRoomId, roomSpecificSelections, roomOptions, initialSelectedRoom])

  // Initialize selected room based on context or initial selection
  const [selectedRoom, setSelectedRoom] = useState<RoomOption | null>(() => getSelectedRoomForContext())

  // Update selected room when context changes
  useEffect(() => {
    const newSelectedRoom = getSelectedRoomForContext()
    if (newSelectedRoom?.id !== selectedRoom?.id) {
      setSelectedRoom(newSelectedRoom)
    }
  }, [getSelectedRoomForContext, selectedRoom?.id])

  // Update when initialSelectedRoom changes (for simple cases)
  useEffect(() => {
    if (!contextRoomId && initialSelectedRoom?.id !== selectedRoom?.id) {
      setSelectedRoom(initialSelectedRoom)
    }
  }, [initialSelectedRoom, contextRoomId, selectedRoom?.id])
  const [activeImageIndices, setActiveImageIndices] = useState<Record<number, number>>(() => {
    const indices: Record<number, number> = {}
    roomOptions.forEach((_, index) => {
      indices[index] = 0
    })
    return indices
  })

  // Carousel API for controlling room navigation
  const [roomCarouselApi, setRoomCarouselApiState] = useState<CarouselApi>()
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
