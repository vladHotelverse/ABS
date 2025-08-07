import { useReducer, useEffect, useMemo, useCallback } from 'react'
import type { RoomOption } from '../types'


// Drag state interface
interface DragState {
  isDragging: boolean
  startX: number
  currentX: number
  deltaX: number
  startTime: number
}

// State interface - removed slider-specific state
export interface CarouselState {
  activeIndex: number
  activeImageIndices: Record<number, number>
  selectedRoom: RoomOption | null
  dragState: DragState
}

// Action types - removed slider-specific actions, added drag actions
export type CarouselAction =
  | { type: 'SET_ACTIVE_INDEX'; payload: number }
  | { type: 'SET_ACTIVE_IMAGE_INDEX'; payload: { roomIndex: number; imageIndex: number } }
  | { type: 'SET_SELECTED_ROOM'; payload: RoomOption | null }
  | {
      type: 'SET_SELECTED_ROOM_AND_INDEX'
      payload: { room: RoomOption | null; index: number }
    }
  | { type: 'NEXT_SLIDE'; roomCount: number }
  | { type: 'PREV_SLIDE'; roomCount: number }
  | { type: 'NEXT_IMAGE'; roomIndex: number; imageCount: number }
  | { type: 'PREV_IMAGE'; roomIndex: number; imageCount: number }
  | { type: 'RESET_STATE'; payload: CarouselState }
  | { type: 'RESET_VIEW'; payload: { activeIndex: number; activeImageIndices: Record<number, number> } }
  | { type: 'START_DRAG'; payload: { startX: number } }
  | { type: 'UPDATE_DRAG'; payload: { currentX: number } }
  | { type: 'END_DRAG'; roomCount?: number; imageCount?: number; roomIndex?: number }

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

    case 'SET_SELECTED_ROOM_AND_INDEX':
      return {
        ...state,
        selectedRoom: action.payload.room,
        activeIndex: action.payload.index,
      }

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

    case 'RESET_VIEW':
      return {
        ...state,
        activeIndex: action.payload.activeIndex,
        activeImageIndices: action.payload.activeImageIndices,
      }

    case 'START_DRAG':
      return {
        ...state,
        dragState: {
          ...state.dragState,
          isDragging: true,
          startX: action.payload.startX,
          currentX: action.payload.startX,
          deltaX: 0,
          startTime: Date.now(),
        },
      }

    case 'UPDATE_DRAG':
      return {
        ...state,
        dragState: {
          ...state.dragState,
          currentX: action.payload.currentX,
          deltaX: action.payload.currentX - state.dragState.startX,
        },
      }

    case 'END_DRAG': {
      const { dragState } = state
      const deltaX = dragState.deltaX
      const duration = Date.now() - dragState.startTime
      const velocity = Math.abs(deltaX) / Math.max(duration, 1)
      
      // Determine if we should trigger navigation
      const DRAG_DISTANCE_THRESHOLD = 50 // minimum distance in pixels to trigger navigation
      const DRAG_VELOCITY_THRESHOLD = 0.5 // minimum velocity (px/ms) for quick swipes
      
      const shouldNavigate = Math.abs(deltaX) > DRAG_DISTANCE_THRESHOLD || velocity > DRAG_VELOCITY_THRESHOLD
      
      const newState = {
        ...state,
        dragState: {
          isDragging: false,
          startX: 0,
          currentX: 0,
          deltaX: 0,
          startTime: 0,
        },
      }

      if (shouldNavigate) {
        if (action.roomCount !== undefined) {
          // Room carousel navigation
          if (deltaX < 0) {
            // Swipe left - next slide
            newState.activeIndex = (state.activeIndex + 1) % action.roomCount
          } else {
            // Swipe right - previous slide
            newState.activeIndex = state.activeIndex > 0 ? state.activeIndex - 1 : action.roomCount - 1
          }
        } else if (action.imageCount !== undefined && action.roomIndex !== undefined) {
          // Image navigation within room
          const currentImageIndex = state.activeImageIndices[action.roomIndex] || 0
          if (deltaX < 0) {
            // Swipe left - next image
            newState.activeImageIndices = {
              ...state.activeImageIndices,
              [action.roomIndex]: (currentImageIndex + 1) % action.imageCount,
            }
          } else {
            // Swipe right - previous image
            newState.activeImageIndices = {
              ...state.activeImageIndices,
              [action.roomIndex]: currentImageIndex > 0 ? currentImageIndex - 1 : action.imageCount - 1,
            }
          }
        }
      }

      return newState
    }

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

// Hook return type - removed slider-specific properties, added drag handlers
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
    startDrag: (startX: number) => void
    updateDrag: (currentX: number) => void
    endDrag: (options?: { roomCount?: number; imageCount?: number; roomIndex?: number }) => void
  }
}

// Utility function to get initial active index
const getInitialActiveIndex = (roomCount: number): number => {
  if (roomCount === 1) return 0
  if (roomCount === 2) return 0
  // For 3+ rooms, use the actual middle index (or close to it)
  return Math.floor((roomCount - 1) / 2)
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
    // Initialize image indices for all rooms dynamically
    const initialImageIndices: Record<number, number> = {}
    roomOptions.forEach((_, index) => {
      initialImageIndices[index] = 0
    })
    
    return {
      activeIndex: initialActiveIndex,
      activeImageIndices: initialImageIndices,
      selectedRoom: initialSelectedRoom,
      dragState: {
        isDragging: false,
        startX: 0,
        currentX: 0,
        deltaX: 0,
        startTime: 0,
      },
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
      // Find the index of the selected room to sync the activeIndex
      const newIndex = room ? roomOptions.findIndex((option) => option.id === room.id) : -1

      if (newIndex !== -1) {
        dispatch({
          type: 'SET_SELECTED_ROOM_AND_INDEX',
          payload: { room, index: newIndex },
        })
      } else {
        // If room is deselected (null), just update the selected room
        dispatch({ type: 'SET_SELECTED_ROOM', payload: room })
      }

      if (onRoomSelected) {
        onRoomSelected(room)
      }
    },
    [roomOptions, onRoomSelected]
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

  const startDrag = useCallback((startX: number) => {
    dispatch({ type: 'START_DRAG', payload: { startX } })
  }, [])

  const updateDrag = useCallback((currentX: number) => {
    dispatch({ type: 'UPDATE_DRAG', payload: { currentX } })
  }, [])

  const endDrag = useCallback((options?: { roomCount?: number; imageCount?: number; roomIndex?: number }) => {
    dispatch({ type: 'END_DRAG', ...options })
  }, [])

  // Group actions into object - removed slider-specific actions, added drag handlers
  const actions = useMemo(
    () => ({
      setActiveIndex,
      setActiveImageIndex,
      selectRoom,
      nextSlide,
      prevSlide,
      nextImage,
      prevImage,
      startDrag,
      updateDrag,
      endDrag,
    }),
    [setActiveIndex, setActiveImageIndex, selectRoom, nextSlide, prevSlide, nextImage, prevImage, startDrag, updateDrag, endDrag]
  )

  // This effect now ONLY resets the view when the list of rooms changes.
  useEffect(() => {
    const newActiveIndex = getInitialActiveIndex(roomOptions.length)
    const newImageIndices: Record<number, number> = {}
    roomOptions.forEach((_, index) => {
      newImageIndices[index] = 0
    })
    dispatch({ type: 'RESET_VIEW', payload: { activeIndex: newActiveIndex, activeImageIndices: newImageIndices } })
  }, [roomOptions])

  // This new effect ONLY syncs the selected room from the parent without changing the view.
  useEffect(() => {
    if (state.selectedRoom?.id !== initialSelectedRoom?.id) {
      dispatch({ type: 'SET_SELECTED_ROOM', payload: initialSelectedRoom })
    }
  }, [initialSelectedRoom, state.selectedRoom])

  return {
    state,
    actions,
  }
}
