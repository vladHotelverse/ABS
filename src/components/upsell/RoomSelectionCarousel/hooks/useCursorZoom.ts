import { useCallback, useEffect, useRef, useState } from 'react'

export interface UseCursorZoomOptions {
  enabled?: boolean
  delay?: number
  zoomLevel?: number
  zoomSize?: { width: number; height: number }
}

export const useCursorZoom = (options: UseCursorZoomOptions = {}) => {
  const [defaultZoomSize, setDefaultZoomSize] = useState({ width: 600, height: 400 })

  useEffect(() => {
    setDefaultZoomSize({
      width: Math.min(window.innerWidth * 0.5, 600),
      height: Math.min(window.innerHeight * 0.5, 400),
    })
  }, [])

  const { enabled = true, delay = 150, zoomLevel = 2, zoomSize = defaultZoomSize } = options

  const [isVisible, setIsVisible] = useState(false)
  const [sourceRect, setSourceRect] = useState<DOMRect | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const elementRef = useRef<HTMLElement | null>(null)

  const handleMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (!enabled) return

      const target = event.currentTarget
      elementRef.current = target
      const rect = target.getBoundingClientRect()
      setSourceRect(rect)

      // Set initial mouse position
      setMousePosition({ x: event.clientX, y: event.clientY })

      // Clear any existing timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }

      // Set a delay before showing the zoom
      hoverTimeoutRef.current = setTimeout(() => {
        setIsVisible(true)
      }, delay)
    },
    [enabled, delay]
  )

  const handleMouseLeave = useCallback(() => {
    if (!enabled) return

    // Clear timeout if mouse leaves before delay completes
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }

    // Hide the zoom
    setIsVisible(false)
    setSourceRect(null)
    elementRef.current = null
  }, [enabled])

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (!enabled) return

      // Update mouse position for zoom to follow cursor
      setMousePosition({ x: event.clientX, y: event.clientY })

      // Update source rect if needed
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect()
        setSourceRect(rect)
      }
    },
    [enabled]
  )

  // Cleanup function
  const cleanup = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    setIsVisible(false)
    setSourceRect(null)
    elementRef.current = null
  }, [])

  return {
    isVisible,
    sourceRect,
    mousePosition,
    zoomLevel,
    zoomSize,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseMove,
    cleanup,
  }
}
