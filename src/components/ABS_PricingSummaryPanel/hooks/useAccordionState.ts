import { useCallback, useEffect, useState } from 'react'

export const useAccordionState = (
  initialRoomId?: string,
  externalActiveRoom?: string,
  onActiveRoomChange?: (roomId: string) => void
) => {
  const [internalActiveRoom, setInternalActiveRoom] = useState<string | null>(initialRoomId || null)
  
  // Use external control if provided, otherwise use internal state
  const activeRoom = externalActiveRoom !== undefined ? externalActiveRoom : internalActiveRoom

  // Sync internal state when external control changes
  useEffect(() => {
    if (externalActiveRoom !== undefined) {
      setInternalActiveRoom(externalActiveRoom)
    }
  }, [externalActiveRoom])

  const handleAccordionToggle = useCallback((roomId: string) => {
    const newActiveRoom = activeRoom === roomId ? null : roomId
    
    // Handle external control
    if (onActiveRoomChange && newActiveRoom) {
      onActiveRoomChange(newActiveRoom)
    }
    
    // Handle internal state (for uncontrolled usage)
    if (externalActiveRoom === undefined) {
      setInternalActiveRoom(newActiveRoom)
    }
  }, [activeRoom, externalActiveRoom, onActiveRoomChange])

  const isRoomActive = useCallback(
    (roomId: string) => {
      return activeRoom === roomId
    },
    [activeRoom]
  )

  return {
    activeRoom,
    handleAccordionToggle,
    isRoomActive,
  }
}
