import React from 'react'

/**
 * Custom hook for smooth height transitions
 * Uses CSS custom properties and requestAnimationFrame for smooth animations
 *
 * @param height - Target height value
 * @param containerRef - Ref to the container element
 * @param disabled - Disable transitions (e.g., on mobile)
 * @returns Object with transition state and current height
 */
export const useSmoothHeightTransition = (
  height: number,
  containerRef: React.RefObject<HTMLDivElement | null>,
  disabled = false
) => {
  const [prevHeight, setPrevHeight] = React.useState(0)
  const [isTransitioning, setIsTransitioning] = React.useState(false)
  const timeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined)

  React.useEffect(() => {
    // Skip all transitions if disabled (e.g., on mobile)
    if (disabled) {
      return
    }

    if (height > 0 && height !== prevHeight) {
      // Use requestAnimationFrame to ensure we get the current height after any DOM updates
      const animationId = requestAnimationFrame(() => {
        // Get the actual current height from the DOM element
        const actualCurrentHeight = containerRef.current?.offsetHeight || prevHeight || 0

        setIsTransitioning(true)

        // Create CSS custom properties for the animation
        const root = document.documentElement
        root.style.setProperty('--height-from', `${actualCurrentHeight}px`)
        root.style.setProperty('--height-to', `${height}px`)

        // Reset transition state after animation completes
        const timeoutId = setTimeout(() => {
          setIsTransitioning(false)
          setPrevHeight(height)
        }, 300) // Match animation duration

        // Store timeout for cleanup
        timeoutRef.current = timeoutId
      })

      return () => {
        cancelAnimationFrame(animationId)
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }
  }, [height, prevHeight, disabled])

  return { isTransitioning, currentHeight: height }
}
