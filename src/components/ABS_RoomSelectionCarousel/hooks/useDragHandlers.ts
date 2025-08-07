import { useCallback, useRef } from 'react'

interface UseDragHandlersProps {
  onDragStart: (startX: number) => void
  onDragMove: (currentX: number) => void
  onDragEnd: (options?: { roomCount?: number; imageCount?: number; roomIndex?: number }) => void
  disabled?: boolean
}

interface DragHandlers {
  onMouseDown: (e: React.MouseEvent) => void
  onMouseMove: (e: React.MouseEvent) => void
  onMouseUp: () => void
  onMouseLeave: () => void
  onTouchStart: (e: React.TouchEvent) => void
  onTouchMove: (e: React.TouchEvent) => void
  onTouchEnd: () => void
  setEndOptions: (options: { roomCount?: number; imageCount?: number; roomIndex?: number }) => void
  style: React.CSSProperties
}

export const useDragHandlers = ({
  onDragStart,
  onDragMove,
  onDragEnd,
  disabled = false,
}: UseDragHandlersProps): DragHandlers => {
  const isDraggingRef = useRef(false)
  const endOptionsRef = useRef<{ roomCount?: number; imageCount?: number; roomIndex?: number }>()

  const getClientX = (e: React.MouseEvent | React.TouchEvent): number => {
    if ('touches' in e) {
      return e.touches[0]?.clientX || 0
    }
    return e.clientX
  }

  const handleStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (disabled) return
      
      e.preventDefault()
      const clientX = getClientX(e)
      isDraggingRef.current = true
      onDragStart(clientX)
    },
    [disabled, onDragStart]
  )

  const handleMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (disabled || !isDraggingRef.current) return
      
      e.preventDefault()
      const clientX = getClientX(e)
      onDragMove(clientX)
    },
    [disabled, onDragMove]
  )

  const handleEnd = useCallback(() => {
    if (disabled || !isDraggingRef.current) return
    
    isDraggingRef.current = false
    onDragEnd(endOptionsRef.current)
    endOptionsRef.current = undefined
  }, [disabled, onDragEnd])

  const setEndOptions = useCallback((options: { roomCount?: number; imageCount?: number; roomIndex?: number }) => {
    endOptionsRef.current = options
  }, [])

  // Mouse handlers
  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      handleStart(e)
      
      // Add global listeners for mouse events
      const handleGlobalMouseMove = (globalE: MouseEvent) => {
        if (!isDraggingRef.current) return
        
        globalE.preventDefault()
        onDragMove(globalE.clientX)
      }
      
      const handleGlobalMouseUp = () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove)
        document.removeEventListener('mouseup', handleGlobalMouseUp)
        handleEnd()
      }
      
      document.addEventListener('mousemove', handleGlobalMouseMove)
      document.addEventListener('mouseup', handleGlobalMouseUp)
    },
    [handleStart, onDragMove, handleEnd]
  )

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      handleMove(e)
    },
    [handleMove]
  )

  const onMouseUp = useCallback(() => {
    handleEnd()
  }, [handleEnd])

  const onMouseLeave = useCallback(() => {
    // Don't end drag on mouse leave as we're using global listeners
  }, [])

  // Touch handlers
  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      handleStart(e)
    },
    [handleStart]
  )

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      handleMove(e)
    },
    [handleMove]
  )

  const onTouchEnd = useCallback(() => {
    handleEnd()
  }, [handleEnd])

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onMouseLeave,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    setEndOptions,
    style: {
      touchAction: disabled ? 'auto' : 'none',
      userSelect: disabled ? 'auto' : 'none',
      cursor: disabled ? 'default' : 'grab',
    },
  }
}