import { useReducer, useEffect, useMemo, useCallback } from 'react'
import type { RoomOption } from '../types'

// State interface - removed slider-specific state
export interface CarouselState {
  activeIndex: number
  activeImageIndices: Record<number, number>
  selectedRoom: RoomOption | null
}

// Action types - removed slider-specific actions
export type CarouselAction =
  | { type: 'SET_ACTIVE_INDEX'; payload: number }
  | { type: 'SET_ACTIVE_IMAGE_INDEX'; payload: { roomIndex: number; imageIndex: number } }
  | { type: 'SET_SELECTED_ROOM'; payload: RoomOption | null }
  | { type: 'NEXT_SLIDE'; roomCount: number }
  | { type: 'PREV_SLIDE'; roomCount: number }
  | { type: 'NEXT_IMAGE'; roomIndex: number; imageCount: number }
  | { type: 'PREV_IMAGE'; roomIndex: number; imageCount: number }
  | { type: 'RESET_STATE'; payload: CarouselState }

// Reducer function - removed slider-specific cases
const carouselReducer = (state: CarouselState, action: CarouselAction): CarouselState => {
  switch (action.type) {
    case 'SET_ACTIVE_INDEX':
      return { ...state, activeIndex: action.payload }

    case 'SET_ACTIVE_IMAGE_INDEX':
      return {
        ...state,
        activeImageIndices: {
          ...state.activeImageIndices,
          [action.payload.roomIndex]: action.payload.imageIndex,
        },
      }

    case 'SET_SELECTED_ROOM':
      return { ...state, selectedRoom: action.payload }

    case 'NEXT_SLIDE':
      return {
        ...state,
        activeIndex: (state.activeIndex + 1) % action.roomCount,
      }

    case 'PREV_SLIDE':
      return {
        ...state,
        activeIndex: state.activeIndex > 0 ? state.activeIndex - 1 : action.roomCount - 1,
      }

    case 'NEXT_IMAGE':
      return {
        ...state,
        activeImageIndices: {
          ...state.activeImageIndices,
          [action.roomIndex]: (state.activeImageIndices[action.roomIndex] + 1) % action.imageCount,
        },
      }

    case 'PREV_IMAGE':
      return {
        ...state,
        activeImageIndices: {
          ...state.activeImageIndices,
          [action.roomIndex]:
            state.activeImageIndices[action.roomIndex] > 0
              ? state.activeImageIndices[action.roomIndex] - 1
              : action.imageCount - 1,
        },
      }

    case 'RESET_STATE':
      return action.payload

    default:
      return state
  }
}

// Hook props - removed slider-specific props
export interface UseCarouselStateProps {
  roomOptions: RoomOption[]
  initialSelectedRoom?: RoomOption | null
  onRoomSelected?: (room: RoomOption | null) => void
}

// Hook return type - removed slider-specific properties
export interface UseCarouselStateReturn {
  state: CarouselState
  actions: {
    setActiveIndex: (index: number) => void
    setActiveImageIndex: (roomIndex: number, imageIndex: number) => void
    selectRoom: (room: RoomOption | null) => void
    nextSlide: () => void
    prevSlide: () => void
    nextImage: (roomIndex: number, imageCount: number) => void
    prevImage: (roomIndex: number, imageCount: number) => void
  }
}

// Utility function to get initial active index
const getInitialActiveIndex = (roomCount: number): number => {
  if (roomCount === 1) return 0
  if (roomCount === 2) return 0
  return 1 // Default to middle card for 3+ rooms
}

// Main hook - removed slider-specific logic
export const useCarouselState = ({
  roomOptions,
  initialSelectedRoom = null,
  onRoomSelected,
}: UseCarouselStateProps): UseCarouselStateReturn => {
  // Memoize initial state calculation
  const initialState = useMemo((): CarouselState => {
    const initialActiveIndex = getInitialActiveIndex(roomOptions.length)
    return {
      activeIndex: initialActiveIndex,
      activeImageIndices: {
        0: 0,
        1: 0,
        2: 0,
      },
      selectedRoom: initialSelectedRoom,
    }
  }, [roomOptions.length, initialSelectedRoom])

  const [state, dispatch] = useReducer(carouselReducer, initialState)

  // Memoized action creators
  const setActiveIndex = useCallback((index: number) => {
    dispatch({ type: 'SET_ACTIVE_INDEX', payload: index })
  }, [])

  const setActiveImageIndex = useCallback((roomIndex: number, imageIndex: number) => {
    dispatch({ type: 'SET_ACTIVE_IMAGE_INDEX', payload: { roomIndex, imageIndex } })
  }, [])

  const selectRoom = useCallback(
    (room: RoomOption | null) => {
      dispatch({ type: 'SET_SELECTED_ROOM', payload: room })
      if (onRoomSelected) {
        onRoomSelected(room)
      }
    },
    [onRoomSelected]
  )

  const nextSlide = useCallback(() => {
    dispatch({ type: 'NEXT_SLIDE', roomCount: roomOptions.length })
  }, [roomOptions.length])

  const prevSlide = useCallback(() => {
    dispatch({ type: 'PREV_SLIDE', roomCount: roomOptions.length })
  }, [roomOptions.length])

  const nextImage = useCallback((roomIndex: number, imageCount: number) => {
    dispatch({ type: 'NEXT_IMAGE', roomIndex, imageCount })
  }, [])

  const prevImage = useCallback((roomIndex: number, imageCount: number) => {
    dispatch({ type: 'PREV_IMAGE', roomIndex, imageCount })
  }, [])

  // Group actions into object - removed slider-specific actions
  const actions = useMemo(
    () => ({
      setActiveIndex,
      setActiveImageIndex,
      selectRoom,
      nextSlide,
      prevSlide,
      nextImage,
      prevImage,
    }),
    [setActiveIndex, setActiveImageIndex, selectRoom, nextSlide, prevSlide, nextImage, prevImage]
  )

  // Reinitialize state when roomOptions change
  useEffect(() => {
    const newActiveIndex = getInitialActiveIndex(roomOptions.length)
    const newState: CarouselState = {
      activeIndex: newActiveIndex,
      activeImageIndices: { 0: 0, 1: 0, 2: 0 },
      selectedRoom: initialSelectedRoom,
    }
    dispatch({ type: 'RESET_STATE', payload: newState })
  }, [roomOptions.length, initialSelectedRoom])

  return {
    state,
    actions,
  }
}
