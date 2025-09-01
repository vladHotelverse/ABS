import { useCallback, useEffect, useRef, useState } from 'react'

export const useAccordionState = (
  roomIds: string[] = [],
  externalActiveRooms?: string[],
  onActiveRoomsChange?: (roomIds: string[]) => void,
  multipleOpen = true
) => {
  // Use a ref to track if we've initialized
  const initializedRef = useRef(false)
  
  // Initialize with all rooms open by default for multiple mode, or first room for single mode
  const [internalActiveRooms, setInternalActiveRooms] = useState<string[]>(() => {
    return multipleOpen ? roomIds : roomIds.length > 0 ? [roomIds[0]] : []
  })
  
  // Use external control if provided, otherwise use internal state
  const activeRooms = externalActiveRooms !== undefined ? externalActiveRooms : internalActiveRooms

  // Sync internal state when external control changes
  useEffect(() => {
    if (externalActiveRooms !== undefined) {
      setInternalActiveRooms(externalActiveRooms)
    }
  }, [externalActiveRooms])

  // Initialize with roomIds only once
  useEffect(() => {
    if (!initializedRef.current && externalActiveRooms === undefined && roomIds.length > 0) {
      const newActiveRooms = multipleOpen ? roomIds : [roomIds[0]]
      setInternalActiveRooms(newActiveRooms)
      initializedRef.current = true
    }
  }, [roomIds, multipleOpen, externalActiveRooms])

  const handleAccordionToggle = useCallback((roomId: string) => {
    let newActiveRooms: string[]
    
    if (multipleOpen) {
      // Multiple mode: toggle the specific room
      newActiveRooms = activeRooms.includes(roomId)
        ? activeRooms.filter(id => id !== roomId)
        : [...activeRooms, roomId]
    } else {
      // Single mode: only one room can be active
      newActiveRooms = activeRooms.includes(roomId) ? [] : [roomId]
    }
    
    // Handle external control
    if (onActiveRoomsChange) {
      onActiveRoomsChange(newActiveRooms)
    }
    
    // Handle internal state (for uncontrolled usage)
    if (externalActiveRooms === undefined) {
      setInternalActiveRooms(newActiveRooms)
    }
  }, [activeRooms, multipleOpen, externalActiveRooms, onActiveRoomsChange])

  const isRoomActive = useCallback(
    (roomId: string) => {
      return activeRooms.includes(roomId)
    },
    [activeRooms]
  )

  return {
    activeRooms,
    handleAccordionToggle,
    isRoomActive,
  }
}
